# 🎬 Video Clip MCP

[![npm version](https://badge.fury.io/js/@pickstar-2002%2Fvideo-clip-mcp.svg)](https://badge.fury.io/js/@pickstar-2002%2Fvideo-clip-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

一个强大的视频剪辑 MCP (Model Context Protocol) 服务器，提供视频处理、剪辑和批量操作功能。

## ✨ 特性

- 🎥 视频剪辑和裁切
- 📊 视频信息获取
- 🔄 批量视频处理
- ⚡ 高性能异步处理
- 🛠️ 灵活的配置选项
- 📝 完整的 TypeScript 支持

## 📦 安装

### NPM 安装
```bash
npm install -g @pickstar-2002/video-clip-mcp
```

### 使用 npx (推荐)
```bash
npx @pickstar-2002/video-clip-mcp
```

## 🚀 使用方式

### 1. 作为 MCP 服务器

在您的 MCP 客户端配置中添加：

```json
{
  "mcpServers": {
    "video-clip": {
      "command": "npx",
      "args": ["@pickstar-2002/video-clip-mcp"]
    }
  }
}
```

### 2. Claude Desktop 配置

在 `claude_desktop_config.json` 中添加：

```json
{
  "mcpServers": {
    "video-clip": {
      "command": "npx",
      "args": ["@pickstar-2002/video-clip-mcp"],
      "env": {}
    }
  }
}
```

### 3. Cursor 配置

在 `.cursorrules` 文件中添加：

```
video-clip-mcp:
  command: npx @pickstar-2002/video-clip-mcp
```

### 4. WindSurf 配置

在 `.windsurfrules` 文件中添加：

```yaml
mcp_servers:
  video-clip:
    command: npx
    args: [@pickstar-2002/video-clip-mcp]
```

### 5. 编程方式使用

```typescript
import { VideoClipMCPServer } from '@pickstar-2002/video-clip-mcp';

const server = new VideoClipMCPServer();
await server.start();
```

## 🛠️ 可用工具

### `clip_video`
剪辑视频片段，支持毫秒级精度的时间段裁剪。

**参数:**
- `inputPath` (string): 输入视频文件路径
- `outputPath` (string): 输出视频文件路径
- `timeSegment` (object): 时间段配置
  - `start` (number): 开始时间（毫秒）
  - `end` (number): 结束时间（毫秒）
- `quality` (string, 可选): 视频质量预设

### `merge_videos`
合并多个视频文件，支持不同格式和分辨率的智能适配。

**参数:**
- `inputPaths` (array): 输入视频文件路径数组
- `outputPath` (string): 输出视频文件路径
- `resolution` (object, 可选): 目标分辨率

### `split_video`
分割视频文件，支持按时长、大小或段数分割。

**参数:**
- `inputPath` (string): 输入视频文件路径
- `outputDir` (string): 输出目录路径
- `splitBy` (string): 分割方式 ('duration' | 'size' | 'segments')

### `get_video_info`
获取视频文件的详细信息。

**参数:**
- `filePath` (string): 视频文件路径

### `batch_process`
批量处理视频任务。

**参数:**
- `tasks` (array): 批量任务配置数组

## 📋 环境要求

- Node.js >= 18.0.0
- FFmpeg (需要系统安装)

## 🎯 支持的格式

### 视频格式
- MP4 (.mp4)
- AVI (.avi)
- MOV (.mov)
- MKV (.mkv)
- WebM (.webm)
- FLV (.flv)

### 视频编码
- H.264 (libx264)
- H.265 (libx265)
- VP9 (libvpx-vp9)

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📞 支持

如有问题或建议，请通过 GitHub Issues 联系我们。