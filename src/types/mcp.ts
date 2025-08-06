/**
 * MCP协议相关类型定义
 */

import { 
  ClipOptions, 
  MergeOptions, 
  SplitOptions, 
  VideoInfo, 
  ProcessResult,
  BatchTask 
} from './video.js';

// MCP工具参数类型
export interface MCPToolParams {
  // 视频剪辑工具参数
  clipVideo: ClipOptions;
  
  // 视频合并工具参数
  mergeVideos: MergeOptions;
  
  // 视频分割工具参数
  splitVideo: SplitOptions;
  
  // 获取视频信息工具参数
  getVideoInfo: {
    filePath: string;
  };
  
  // 批量处理工具参数
  batchProcess: {
    tasks: Omit<BatchTask, 'id' | 'status' | 'createdAt'>[];
  };
  
  // 获取支持格式工具参数
  getSupportedFormats: Record<string, never>;
  
  // 取消任务工具参数
  cancelTask: {
    taskId: string;
  };
  
  // 获取任务状态工具参数
  getTaskStatus: {
    taskId: string;
  };
}

// MCP工具返回值类型
export interface MCPToolResults {
  clipVideo: ProcessResult;
  mergeVideos: ProcessResult;
  splitVideo: ProcessResult;
  getVideoInfo: VideoInfo;
  batchProcess: {
    taskIds: string[];
    message: string;
  };
  getSupportedFormats: {
    videoFormats: string[];
    videoCodecs: string[];
    audioCodecs: string[];
  };
  cancelTask: {
    success: boolean;
    message: string;
  };
  getTaskStatus: BatchTask | null;
}

// MCP工具定义
export interface MCPTool {
  name: keyof MCPToolParams;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, any>;
    required?: string[];
  };
}

// MCP服务器配置
export interface MCPServerConfig {
  name: string;
  version: string;
  description: string;
  author: string;
  license: string;
  tools: MCPTool[];
}