/**
 * 视频剪辑工具类型定义
 */

// 时间戳类型（毫秒）
export type Timestamp = number;

// 视频格式枚举
export enum VideoFormat {
  MP4 = 'mp4',
  AVI = 'avi',
  MOV = 'mov',
  MKV = 'mkv',
  WEBM = 'webm',
  FLV = 'flv'
}

// 视频编码格式
export enum VideoCodec {
  H264 = 'libx264',
  H265 = 'libx265',
  VP9 = 'libvpx-vp9',
  AV1 = 'libaom-av1'
}

// 音频编码格式
export enum AudioCodec {
  AAC = 'aac',
  MP3 = 'libmp3lame',
  OPUS = 'libopus',
  VORBIS = 'libvorbis'
}

// 视频质量预设
export enum QualityPreset {
  ULTRAFAST = 'ultrafast',
  SUPERFAST = 'superfast',
  VERYFAST = 'veryfast',
  FASTER = 'faster',
  FAST = 'fast',
  MEDIUM = 'medium',
  SLOW = 'slow',
  SLOWER = 'slower',
  VERYSLOW = 'veryslow'
}

// 视频信息接口
export interface VideoInfo {
  duration: number; // 总时长（秒）
  width: number;    // 宽度
  height: number;   // 高度
  fps: number;      // 帧率
  bitrate: number;  // 比特率
  format: string;   // 格式
  codec: string;    // 编码格式
  size: number;     // 文件大小（字节）
}

// 时间段接口
export interface TimeSegment {
  start: Timestamp; // 开始时间（毫秒）
  end: Timestamp;   // 结束时间（毫秒）
}

// 剪辑参数接口
export interface ClipOptions {
  inputPath: string;        // 输入文件路径
  outputPath: string;       // 输出文件路径
  timeSegment: TimeSegment; // 时间段
  quality?: QualityPreset;  // 质量预设
  videoCodec?: VideoCodec;  // 视频编码
  audioCodec?: AudioCodec;  // 音频编码
  preserveMetadata?: boolean; // 保留元数据
}

// 合并参数接口
export interface MergeOptions {
  inputPaths: string[];     // 输入文件路径数组
  outputPath: string;       // 输出文件路径
  quality?: QualityPreset;  // 质量预设
  videoCodec?: VideoCodec;  // 视频编码
  audioCodec?: AudioCodec;  // 音频编码
  resolution?: {            // 目标分辨率
    width: number;
    height: number;
  };
  fps?: number;             // 目标帧率
}

// 分割参数接口
export interface SplitOptions {
  inputPath: string;        // 输入文件路径
  outputDir: string;        // 输出目录
  splitBy: 'duration' | 'size' | 'segments'; // 分割方式
  duration?: number;        // 按时长分割（秒）
  maxSize?: number;         // 按大小分割（MB）
  segmentCount?: number;    // 分割段数
  quality?: QualityPreset;  // 质量预设
  videoCodec?: VideoCodec;  // 视频编码
  audioCodec?: AudioCodec;  // 音频编码
  namePattern?: string;     // 文件命名模式
}

// 处理进度接口
export interface ProcessProgress {
  percent: number;          // 完成百分比
  currentTime: number;      // 当前处理时间
  totalTime: number;        // 总时间
  fps: number;              // 当前处理帧率
  speed: string;            // 处理速度
}

// 处理结果接口
export interface ProcessResult {
  success: boolean;         // 是否成功
  outputPaths: string[];    // 输出文件路径
  duration: number;         // 处理耗时（毫秒）
  error?: string;           // 错误信息
}

// 批量处理任务接口
export interface BatchTask {
  id: string;               // 任务ID
  type: 'clip' | 'merge' | 'split'; // 任务类型
  options: ClipOptions | MergeOptions | SplitOptions; // 任务参数
  status: 'pending' | 'processing' | 'completed' | 'failed'; // 任务状态
  progress?: ProcessProgress; // 处理进度
  result?: ProcessResult;   // 处理结果
  createdAt: Date;          // 创建时间
  startedAt?: Date;         // 开始时间
  completedAt?: Date;       // 完成时间
}