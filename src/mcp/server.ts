/**
 * MCP服务器实现
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';

import { VideoEngine } from '../core/video-engine.js';
import { BatchManager } from '../core/batch-manager.js';
import {
  MCPToolParams,
  MCPToolResults,
  MCPTool,
  MCPServerConfig
} from '../types/mcp.js';
import {
  VideoFormat,
  VideoCodec,
  AudioCodec,
  QualityPreset
} from '../types/video.js';

export class VideoClipMCPServer {
  private server: Server;
  private videoEngine: VideoEngine;
  private batchManager: BatchManager;

  constructor() {
    this.server = new Server(
      {
        name: 'video-clip-mcp',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.videoEngine = VideoEngine.getInstance();
    this.batchManager = BatchManager.getInstance();

    this.setupHandlers();
  }

  private setupHandlers(): void {
    // 列出可用工具
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: this.getToolDefinitions(),
      };
    });

    // 处理工具调用
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'clipVideo':
            return await this.handleClipVideo(args as unknown as MCPToolParams['clipVideo']);
          
          case 'mergeVideos':
            return await this.handleMergeVideos(args as unknown as MCPToolParams['mergeVideos']);
          
          case 'splitVideo':
            return await this.handleSplitVideo(args as unknown as MCPToolParams['splitVideo']);
          
          case 'getVideoInfo':
            return await this.handleGetVideoInfo(args as unknown as MCPToolParams['getVideoInfo']);
          
          case 'batchProcess':
            return await this.handleBatchProcess(args as unknown as MCPToolParams['batchProcess']);
          
          case 'getSupportedFormats':
            return await this.handleGetSupportedFormats();
          
          case 'cancelTask':
            return await this.handleCancelTask(args as unknown as MCPToolParams['cancelTask']);
          
          case 'getTaskStatus':
            return await this.handleGetTaskStatus(args as unknown as MCPToolParams['getTaskStatus']);
          
          default:
            throw new Error(`未知工具: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `错误: ${error instanceof Error ? error.message : '未知错误'}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  private getToolDefinitions(): Tool[] {
    return [
      {
        name: 'clipVideo',
        description: '剪辑视频片段，支持毫秒级精度的时间段裁剪',
        inputSchema: {
          type: 'object',
          properties: {
            inputPath: {
              type: 'string',
              description: '输入视频文件路径'
            },
            outputPath: {
              type: 'string',
              description: '输出视频文件路径'
            },
            timeSegment: {
              type: 'object',
              properties: {
                start: {
                  type: 'number',
                  description: '开始时间（毫秒）'
                },
                end: {
                  type: 'number',
                  description: '结束时间（毫秒）'
                }
              },
              required: ['start', 'end']
            },
            quality: {
              type: 'string',
              enum: Object.values(QualityPreset),
              description: '视频质量预设'
            },
            videoCodec: {
              type: 'string',
              enum: Object.values(VideoCodec),
              description: '视频编码格式'
            },
            audioCodec: {
              type: 'string',
              enum: Object.values(AudioCodec),
              description: '音频编码格式'
            },
            preserveMetadata: {
              type: 'boolean',
              description: '是否保留元数据'
            }
          },
          required: ['inputPath', 'outputPath', 'timeSegment']
        }
      },
      {
        name: 'mergeVideos',
        description: '合并多个视频文件，支持不同格式和分辨率的智能适配',
        inputSchema: {
          type: 'object',
          properties: {
            inputPaths: {
              type: 'array',
              items: { type: 'string' },
              description: '输入视频文件路径数组'
            },
            outputPath: {
              type: 'string',
              description: '输出视频文件路径'
            },
            quality: {
              type: 'string',
              enum: Object.values(QualityPreset),
              description: '视频质量预设'
            },
            videoCodec: {
              type: 'string',
              enum: Object.values(VideoCodec),
              description: '视频编码格式'
            },
            audioCodec: {
              type: 'string',
              enum: Object.values(AudioCodec),
              description: '音频编码格式'
            },
            resolution: {
              type: 'object',
              properties: {
                width: { type: 'number' },
                height: { type: 'number' }
              },
              description: '目标分辨率'
            },
            fps: {
              type: 'number',
              description: '目标帧率'
            }
          },
          required: ['inputPaths', 'outputPath']
        }
      },
      {
        name: 'splitVideo',
        description: '分割视频文件，支持按时长、大小或段数分割',
        inputSchema: {
          type: 'object',
          properties: {
            inputPath: {
              type: 'string',
              description: '输入视频文件路径'
            },
            outputDir: {
              type: 'string',
              description: '输出目录路径'
            },
            splitBy: {
              type: 'string',
              enum: ['duration', 'size', 'segments'],
              description: '分割方式'
            },
            duration: {
              type: 'number',
              description: '按时长分割（秒）'
            },
            maxSize: {
              type: 'number',
              description: '按大小分割（MB）'
            },
            segmentCount: {
              type: 'number',
              description: '分割段数'
            },
            quality: {
              type: 'string',
              enum: Object.values(QualityPreset),
              description: '视频质量预设'
            },
            videoCodec: {
              type: 'string',
              enum: Object.values(VideoCodec),
              description: '视频编码格式'
            },
            audioCodec: {
              type: 'string',
              enum: Object.values(AudioCodec),
              description: '音频编码格式'
            },
            namePattern: {
              type: 'string',
              description: '文件命名模式，支持 {name}、{index}、{ext} 占位符'
            }
          },
          required: ['inputPath', 'outputDir', 'splitBy']
        }
      },
      {
        name: 'getVideoInfo',
        description: '获取视频文件的详细信息',
        inputSchema: {
          type: 'object',
          properties: {
            filePath: {
              type: 'string',
              description: '视频文件路径'
            }
          },
          required: ['filePath']
        }
      },
      {
        name: 'batchProcess',
        description: '批量处理视频任务',
        inputSchema: {
          type: 'object',
          properties: {
            tasks: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  type: {
                    type: 'string',
                    enum: ['clip', 'merge', 'split'],
                    description: '任务类型'
                  },
                  options: {
                    type: 'object',
                    description: '任务参数'
                  }
                },
                required: ['type', 'options']
              },
              description: '批量任务配置数组'
            }
          },
          required: ['tasks']
        }
      },
      {
        name: 'getSupportedFormats',
        description: '获取支持的视频格式和编码',
        inputSchema: {
          type: 'object',
          properties: {}
        }
      },
      {
        name: 'cancelTask',
        description: '取消指定的处理任务',
        inputSchema: {
          type: 'object',
          properties: {
            taskId: {
              type: 'string',
              description: '任务ID'
            }
          },
          required: ['taskId']
        }
      },
      {
        name: 'getTaskStatus',
        description: '获取任务状态',
        inputSchema: {
          type: 'object',
          properties: {
            taskId: {
              type: 'string',
              description: '任务ID'
            }
          },
          required: ['taskId']
        }
      }
    ];
  }

  // 工具处理方法

  private async handleClipVideo(args: MCPToolParams['clipVideo']) {
    const result = await this.videoEngine.clipVideo(args);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  private async handleMergeVideos(args: MCPToolParams['mergeVideos']) {
    const result = await this.videoEngine.mergeVideos(args);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  private async handleSplitVideo(args: MCPToolParams['splitVideo']) {
    const result = await this.videoEngine.splitVideo(args);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  private async handleGetVideoInfo(args: MCPToolParams['getVideoInfo']) {
    const result = await this.videoEngine.getVideoInfo(args.filePath);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  private async handleBatchProcess(args: MCPToolParams['batchProcess']) {
    const taskIds = this.batchManager.addTasks(args.tasks);
    const result: MCPToolResults['batchProcess'] = {
      taskIds,
      message: `已添加 ${taskIds.length} 个批量任务到处理队列`
    };
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  private async handleGetSupportedFormats() {
    const result: MCPToolResults['getSupportedFormats'] = {
      videoFormats: Object.values(VideoFormat),
      videoCodecs: Object.values(VideoCodec),
      audioCodecs: Object.values(AudioCodec)
    };
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  private async handleCancelTask(args: MCPToolParams['cancelTask']) {
    const success = this.batchManager.cancelTask(args.taskId);
    const result: MCPToolResults['cancelTask'] = {
      success,
      message: success ? '任务已取消' : '任务取消失败或任务不存在'
    };
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  private async handleGetTaskStatus(args: MCPToolParams['getTaskStatus']) {
    const result = this.batchManager.getTaskStatus(args.taskId);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  /**
   * 启动MCP服务器
   */
  public async start(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    
    console.error('视频剪辑MCP服务器已启动');
  }
}
