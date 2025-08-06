/**
 * 视频处理引擎核心类
 */

import ffmpeg from 'fluent-ffmpeg';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { v4 as uuidv4 } from 'uuid';
import {
  VideoInfo,
  ClipOptions,
  MergeOptions,
  SplitOptions,
  ProcessResult,
  ProcessProgress,
  TimeSegment,
  VideoFormat,
  VideoCodec,
  AudioCodec,
  QualityPreset
} from '../types/video.js';

export class VideoEngine {
  private static instance: VideoEngine;
  private processingTasks = new Map<string, any>();

  private constructor() {}

  public static getInstance(): VideoEngine {
    if (!VideoEngine.instance) {
      VideoEngine.instance = new VideoEngine();
    }
    return VideoEngine.instance;
  }

  /**
   * 获取视频信息
   */
  public async getVideoInfo(filePath: string): Promise<VideoInfo> {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(filePath, (err: any, metadata: any) => {
        if (err) {
          reject(new Error(`获取视频信息失败: ${err.message}`));
          return;
        }

        const videoStream = metadata.streams.find((s: any) => s.codec_type === 'video');
        if (!videoStream) {
          reject(new Error('未找到视频流'));
          return;
        }

        const audioStream = metadata.streams.find((s: any) => s.codec_type === 'audio');
        
        resolve({
          duration: metadata.format.duration || 0,
          width: videoStream.width || 0,
          height: videoStream.height || 0,
          fps: this.parseFps(videoStream.r_frame_rate || '0/1'),
          bitrate: parseInt(metadata.format.bit_rate || '0'),
          format: metadata.format.format_name || '',
          codec: videoStream.codec_name || '',
          size: parseInt(metadata.format.size || '0')
        });
      });
    });
  }

  /**
   * 视频剪辑
   */
  public async clipVideo(options: ClipOptions): Promise<ProcessResult> {
    const startTime = Date.now();
    const taskId = uuidv4();

    try {
      // 验证输入文件
      await this.validateInputFile(options.inputPath);
      
      // 确保输出目录存在
      await this.ensureOutputDir(options.outputPath);

      // 验证时间段
      const videoInfo = await this.getVideoInfo(options.inputPath);
      this.validateTimeSegment(options.timeSegment, videoInfo.duration);

      return new Promise((resolve, reject) => {
        const command = ffmpeg(options.inputPath)
          .seekInput(options.timeSegment.start / 1000) // 转换为秒
          .duration((options.timeSegment.end - options.timeSegment.start) / 1000)
          .output(options.outputPath);

        // 设置编码参数
        this.applyEncodingOptions(command, options);

        // 进度监听
        command.on('progress', (progress: any) => {
          // 可以在这里添加进度回调
        });

        command.on('end', () => {
          resolve({
            success: true,
            outputPaths: [options.outputPath],
            duration: Date.now() - startTime
          });
        });

        command.on('error', (err: any) => {
          reject(new Error(`视频剪辑失败: ${err.message}`));
        });

        this.processingTasks.set(taskId, command);
        command.run();
      });

    } catch (error) {
      return {
        success: false,
        outputPaths: [],
        duration: Date.now() - startTime,
        error: error instanceof Error ? error.message : '未知错误'
      };
    }
  }

  /**
   * 视频合并
   */
  public async mergeVideos(options: MergeOptions): Promise<ProcessResult> {
    const startTime = Date.now();
    const taskId = uuidv4();

    try {
      // 验证所有输入文件
      for (const inputPath of options.inputPaths) {
        await this.validateInputFile(inputPath);
      }

      // 确保输出目录存在
      await this.ensureOutputDir(options.outputPath);

      return new Promise((resolve, reject) => {
        const command = ffmpeg();

        // 添加所有输入文件
        options.inputPaths.forEach(inputPath => {
          command.input(inputPath);
        });

        // 设置合并参数
        command
          .complexFilter([
            ...options.inputPaths.map((_, i) => `[${i}:v]scale=${options.resolution?.width || -1}:${options.resolution?.height || -1}[v${i}]`),
            ...options.inputPaths.map((_, i) => `[v${i}][${i}:a]`),
            `concat=n=${options.inputPaths.length}:v=1:a=1[outv][outa]`
          ])
          .outputOptions(['-map', '[outv]', '-map', '[outa]'])
          .output(options.outputPath);

        // 设置编码参数
        this.applyEncodingOptions(command, options);

        command.on('end', () => {
          resolve({
            success: true,
            outputPaths: [options.outputPath],
            duration: Date.now() - startTime
          });
        });

        command.on('error', (err: any) => {
          reject(new Error(`视频合并失败: ${err.message}`));
        });

        this.processingTasks.set(taskId, command);
        command.run();
      });

    } catch (error) {
      return {
        success: false,
        outputPaths: [],
        duration: Date.now() - startTime,
        error: error instanceof Error ? error.message : '未知错误'
      };
    }
  }

  /**
   * 视频分割
   */
  public async splitVideo(options: SplitOptions): Promise<ProcessResult> {
    const startTime = Date.now();

    try {
      // 验证输入文件
      await this.validateInputFile(options.inputPath);
      
      // 确保输出目录存在
      await fs.mkdir(options.outputDir, { recursive: true });

      const videoInfo = await this.getVideoInfo(options.inputPath);
      const segments = this.calculateSplitSegments(videoInfo, options);
      const outputPaths: string[] = [];

      // 并行处理分割任务
      const splitPromises = segments.map(async (segment, index) => {
        const outputPath = path.join(
          options.outputDir,
          this.generateSplitFileName(options.inputPath, index, options.namePattern)
        );

        const clipOptions: ClipOptions = {
          inputPath: options.inputPath,
          outputPath,
          timeSegment: segment,
          quality: options.quality,
          videoCodec: options.videoCodec,
          audioCodec: options.audioCodec
        };

        const result = await this.clipVideo(clipOptions);
        if (result.success) {
          outputPaths.push(outputPath);
        }
        return result;
      });

      const results = await Promise.all(splitPromises);
      const failedResults = results.filter(r => !r.success);

      if (failedResults.length > 0) {
        throw new Error(`${failedResults.length} 个分割任务失败`);
      }

      return {
        success: true,
        outputPaths,
        duration: Date.now() - startTime
      };

    } catch (error) {
      return {
        success: false,
        outputPaths: [],
        duration: Date.now() - startTime,
        error: error instanceof Error ? error.message : '未知错误'
      };
    }
  }

  /**
   * 取消处理任务
   */
  public cancelTask(taskId: string): boolean {
    const task = this.processingTasks.get(taskId);
    if (task) {
      task.kill('SIGKILL');
      this.processingTasks.delete(taskId);
      return true;
    }
    return false;
  }

  // 私有辅助方法

  private parseFps(frameRate: string): number {
    const [num, den] = frameRate.split('/').map(Number);
    return den ? num / den : 0;
  }

  private async validateInputFile(filePath: string): Promise<void> {
    try {
      await fs.access(filePath);
    } catch {
      throw new Error(`输入文件不存在: ${filePath}`);
    }
  }

  private async ensureOutputDir(outputPath: string): Promise<void> {
    const dir = path.dirname(outputPath);
    await fs.mkdir(dir, { recursive: true });
  }

  private validateTimeSegment(segment: TimeSegment, duration: number): void {
    if (segment.start < 0 || segment.end <= segment.start) {
      throw new Error('无效的时间段');
    }
    if (segment.end > duration * 1000) {
      throw new Error('结束时间超出视频长度');
    }
  }

  private applyEncodingOptions(command: any, options: any): void {
    if (options.videoCodec) {
      command.videoCodec(options.videoCodec);
    }
    if (options.audioCodec) {
      command.audioCodec(options.audioCodec);
    }
    if (options.quality) {
      command.preset(options.quality);
    }
  }

  private calculateSplitSegments(videoInfo: VideoInfo, options: SplitOptions): TimeSegment[] {
    const segments: TimeSegment[] = [];
    const totalDuration = videoInfo.duration * 1000; // 转换为毫秒

    switch (options.splitBy) {
      case 'duration':
        if (!options.duration) throw new Error('缺少分割时长参数');
        const segmentDuration = options.duration * 1000;
        for (let start = 0; start < totalDuration; start += segmentDuration) {
          segments.push({
            start,
            end: Math.min(start + segmentDuration, totalDuration)
          });
        }
        break;

      case 'segments':
        if (!options.segmentCount) throw new Error('缺少分割段数参数');
        const segmentLength = totalDuration / options.segmentCount;
        for (let i = 0; i < options.segmentCount; i++) {
          segments.push({
            start: i * segmentLength,
            end: Math.min((i + 1) * segmentLength, totalDuration)
          });
        }
        break;

      case 'size':
        if (!options.maxSize) throw new Error('缺少最大文件大小参数');
        // 基于比特率估算分割点
        const targetSizeBytes = options.maxSize * 1024 * 1024;
        const estimatedDuration = (targetSizeBytes * 8) / videoInfo.bitrate * 1000;
        for (let start = 0; start < totalDuration; start += estimatedDuration) {
          segments.push({
            start,
            end: Math.min(start + estimatedDuration, totalDuration)
          });
        }
        break;
    }

    return segments;
  }

  private generateSplitFileName(inputPath: string, index: number, pattern?: string): string {
    const ext = path.extname(inputPath);
    const basename = path.basename(inputPath, ext);
    
    if (pattern) {
      return pattern
        .replace('{name}', basename)
        .replace('{index}', (index + 1).toString().padStart(3, '0'))
        .replace('{ext}', ext);
    }
    
    return `${basename}_part${(index + 1).toString().padStart(3, '0')}${ext}`;
  }
}