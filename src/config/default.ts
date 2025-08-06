/**
 * 默认配置
 */

import { QualityPreset, VideoCodec, AudioCodec } from '../types/video.js';

export const DEFAULT_CONFIG = {
  // 视频处理默认设置
  video: {
    quality: QualityPreset.MEDIUM,
    videoCodec: VideoCodec.H264,
    audioCodec: AudioCodec.AAC,
    preserveMetadata: true,
  },

  // 批量处理设置
  batch: {
    maxConcurrentTasks: 3,
    taskTimeout: 30 * 60 * 1000, // 30分钟
    cleanupInterval: 60 * 60 * 1000, // 1小时
  },

  // 文件处理设置
  files: {
    tempDir: './temp',
    maxFileSize: 10 * 1024 * 1024 * 1024, // 10GB
    supportedFormats: ['mp4', 'avi', 'mov', 'mkv', 'webm', 'flv', 'm4v', '3gp', 'wmv'],
    outputFormats: ['mp4', 'avi', 'mov', 'mkv', 'webm'],
  },

  // 性能优化设置
  performance: {
    enableHardwareAcceleration: true,
    memoryLimit: 4 * 1024 * 1024 * 1024, // 4GB
    threadCount: 0, // 0表示自动检测CPU核心数
  },

  // 日志设置
  logging: {
    level: 'info',
    enableFileLogging: false,
    logDir: './logs',
    maxLogFiles: 10,
    maxLogSize: 10 * 1024 * 1024, // 10MB
  },

  // MCP服务器设置
  server: {
    name: 'video-clip-mcp',
    version: '1.0.0',
    description: '基于AI MCP协议的视频剪辑工具',
    author: 'CodeBuddy',
    license: 'MIT',
  },
};

export type Config = typeof DEFAULT_CONFIG;