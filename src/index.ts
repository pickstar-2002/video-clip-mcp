#!/usr/bin/env node

/**
 * 视频剪辑MCP服务器主入口
 */

import { VideoClipMCPServer } from './mcp/server.js';

async function main() {
  try {
    const server = new VideoClipMCPServer();
    await server.start();
  } catch (error) {
    console.error('启动服务器失败:', error);
    process.exit(1);
  }
}

// 处理未捕获的异常
process.on('uncaughtException', (error) => {
  console.error('未捕获的异常:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('未处理的Promise拒绝:', reason);
  process.exit(1);
});

// 优雅关闭
process.on('SIGINT', () => {
  console.error('收到SIGINT信号，正在关闭服务器...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.error('收到SIGTERM信号，正在关闭服务器...');
  process.exit(0);
});

main();