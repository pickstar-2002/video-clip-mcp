# 🎬 Video Clip MCP

[![npm version](https://badge.fury.io/js/@pickstar-2002%2Fvideo-clip-mcp.svg)](https://badge.fury.io/js/@pickstar-2002%2Fvideo-clip-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

基于 MCP (Model Context Protocol) 协议的专业视频处理工具，为 AI 助手提供强大的视频剪辑、合并、分割和批量处理能力。

## 🎯 核心功能

### 🎬 智能视频剪辑
- **精确时间裁切**：支持毫秒级精度的视频片段提取
- **多格式支持**：兼容 MP4、AVI、MOV、MKV、WebM 等主流格式
- **质量控制**：提供从超快到极慢的9级编码质量选择
- **编码优化**：支持 H.264、H.265、VP9、AV1 等现代编码格式

### 🔗 视频合并处理
- **智能适配**：自动处理不同分辨率和格式的视频合并
- **分辨率统一**：智能调整输出分辨率和帧率
- **音频同步**：确保合并后音视频完美同步

### ✂️ 视频分割功能
- **多种分割模式**：按时长、文件大小或指定段数分割
- **批量命名**：支持自定义文件命名模式
- **保持质量**：分割过程中保持原始视频质量

### 📊 视频信息分析
- **详细元数据**：获取视频时长、分辨率、编码格式等完整信息
- **技术参数**：提供帧率、比特率、音频参数等技术细节
- **格式检测**：自动识别视频容器和编码格式

### ⚡ 批量处理引擎
- **任务队列**：支持多个视频处理任务并发执行
- **进度监控**：实时跟踪处理进度和任务状态
- **错误处理**：完善的异常处理和任务恢复机制
- **资源管理**：智能内存和CPU资源调度

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