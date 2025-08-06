/**
 * 批量任务管理器
 */

import { EventEmitter } from 'node:events';
import { v4 as uuidv4 } from 'uuid';
import {
  BatchTask,
  ClipOptions,
  MergeOptions,
  SplitOptions,
  ProcessResult,
  ProcessProgress
} from '../types/video.js';
import { VideoEngine } from './video-engine.js';

export class BatchManager extends EventEmitter {
  private static instance: BatchManager;
  private tasks = new Map<string, BatchTask>();
  private processingQueue: string[] = [];
  private maxConcurrentTasks = 3; // 最大并发任务数
  private currentProcessingCount = 0;

  private constructor() {
    super();
  }

  public static getInstance(): BatchManager {
    if (!BatchManager.instance) {
      BatchManager.instance = new BatchManager();
    }
    return BatchManager.instance;
  }

  /**
   * 添加批量任务
   */
  public addTasks(taskConfigs: Omit<BatchTask, 'id' | 'status' | 'createdAt'>[]): string[] {
    const taskIds: string[] = [];

    for (const config of taskConfigs) {
      const taskId = uuidv4();
      const task: BatchTask = {
        id: taskId,
        type: config.type,
        options: config.options,
        status: 'pending',
        createdAt: new Date()
      };

      this.tasks.set(taskId, task);
      this.processingQueue.push(taskId);
      taskIds.push(taskId);
    }

    // 开始处理队列
    this.processQueue();

    return taskIds;
  }

  /**
   * 获取任务状态
   */
  public getTaskStatus(taskId: string): BatchTask | null {
    return this.tasks.get(taskId) || null;
  }

  /**
   * 取消任务
   */
  public cancelTask(taskId: string): boolean {
    const task = this.tasks.get(taskId);
    if (!task) {
      return false;
    }

    if (task.status === 'pending') {
      // 从队列中移除
      const queueIndex = this.processingQueue.indexOf(taskId);
      if (queueIndex > -1) {
        this.processingQueue.splice(queueIndex, 1);
      }
      task.status = 'failed';
      task.result = {
        success: false,
        outputPaths: [],
        duration: 0,
        error: '任务已取消'
      };
      task.completedAt = new Date();
      return true;
    }

    if (task.status === 'processing') {
      // 尝试取消正在处理的任务
      const videoEngine = VideoEngine.getInstance();
      const cancelled = videoEngine.cancelTask(taskId);
      if (cancelled) {
        task.status = 'failed';
        task.result = {
          success: false,
          outputPaths: [],
          duration: Date.now() - (task.startedAt?.getTime() || 0),
          error: '任务已取消'
        };
        task.completedAt = new Date();
        this.currentProcessingCount--;
        this.processQueue(); // 继续处理队列
        return true;
      }
    }

    return false;
  }

  /**
   * 获取所有任务状态
   */
  public getAllTasks(): BatchTask[] {
    return Array.from(this.tasks.values());
  }

  /**
   * 清理已完成的任务
   */
  public cleanupCompletedTasks(): number {
    let cleanedCount = 0;
    for (const [taskId, task] of this.tasks.entries()) {
      if (task.status === 'completed' || task.status === 'failed') {
        this.tasks.delete(taskId);
        cleanedCount++;
      }
    }
    return cleanedCount;
  }

  /**
   * 设置最大并发任务数
   */
  public setMaxConcurrentTasks(count: number): void {
    this.maxConcurrentTasks = Math.max(1, count);
    this.processQueue();
  }

  /**
   * 获取队列统计信息
   */
  public getQueueStats(): {
    pending: number;
    processing: number;
    completed: number;
    failed: number;
    total: number;
  } {
    const stats = {
      pending: 0,
      processing: 0,
      completed: 0,
      failed: 0,
      total: this.tasks.size
    };

    for (const task of this.tasks.values()) {
      stats[task.status]++;
    }

    return stats;
  }

  // 私有方法

  private async processQueue(): Promise<void> {
    while (
      this.currentProcessingCount < this.maxConcurrentTasks &&
      this.processingQueue.length > 0
    ) {
      const taskId = this.processingQueue.shift();
      if (!taskId) continue;

      const task = this.tasks.get(taskId);
      if (!task || task.status !== 'pending') continue;

      this.currentProcessingCount++;
      this.processTask(taskId);
    }
  }

  private async processTask(taskId: string): Promise<void> {
    const task = this.tasks.get(taskId);
    if (!task) {
      this.currentProcessingCount--;
      return;
    }

    try {
      task.status = 'processing';
      task.startedAt = new Date();
      
      this.emit('taskStarted', task);

      const videoEngine = VideoEngine.getInstance();
      let result: ProcessResult;

      // 改进错误处理 - 确保每种任务类型都有正确的处理
      switch (task.type) {
        case 'clip':
          result = await videoEngine.clipVideo(task.options as ClipOptions);
          break;
        case 'merge':
          result = await videoEngine.mergeVideos(task.options as MergeOptions);
          break;
        case 'split':
          result = await videoEngine.splitVideo(task.options as SplitOptions);
          break;
        default:
          throw new Error(`未知任务类型: ${task.type}`);
      }

      // 改进状态判断 - 即使有错误信息但成功生成文件也算部分成功
      task.result = result;
      if (result.success && result.outputPaths.length > 0) {
        task.status = 'completed';
      } else if (!result.success && result.outputPaths.length > 0) {
        task.status = 'completed'; // 部分成功也标记为完成，但保留错误信息
        console.warn(`任务 ${taskId} 部分成功: ${result.error}`);
      } else {
        task.status = 'failed';
      }
      
      task.completedAt = new Date();

      if (task.status === 'completed') {
        this.emit('taskCompleted', task);
      } else {
        this.emit('taskFailed', task);
      }

    } catch (error) {
      task.status = 'failed';
      task.result = {
        success: false,
        outputPaths: [],
        duration: Date.now() - (task.startedAt?.getTime() || 0),
        error: error instanceof Error ? error.message : '未知错误'
      };
      task.completedAt = new Date();

      this.emit('taskFailed', task);
    } finally {
      this.currentProcessingCount--;
      // 继续处理队列中的下一个任务
      this.processQueue();
    }
  }
}