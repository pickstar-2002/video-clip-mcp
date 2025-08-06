# 🎬 Video-Clip MCP Server

[![npm version](https://badge.fury.io/js/%40pickstar-2002%2Fvideo-clip-mcp.svg)](https://badge.fury.io/js/%40pickstar-2002%2Fvideo-clip-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)

> 🚀 专业的视频处理 MCP 服务器，为 AI 助手提供强大的视频编辑能力

## ✨ 核心功能

### 🎯 视频剪辑
- 📐 **精确剪辑**: 支持毫秒级精度的时间段裁剪
- 🎨 **多种编码**: 支持 H.264、H.265、VP9、AV1 等主流编码格式
- ⚡ **高效处理**: 优化的处理算法，快速完成剪辑任务

### 🔗 视频合并
- 📁 **智能合并**: 自动处理不同格式和分辨率的视频文件
- 🎵 **音视频同步**: 确保合并后音视频完美同步
- 🔧 **格式统一**: 自动转换为统一的输出格式

### ✂️ 视频分割
- ⏱️ **按时长分割**: 指定每段视频的时长
- 📊 **按大小分割**: 控制每段视频的文件大小
- 🔢 **按段数分割**: 将视频平均分割为指定段数

### 📊 视频信息
- 🔍 **详细信息**: 获取视频时长、分辨率、帧率、编码等完整信息
- 📋 **格式支持**: 查询支持的视频格式和编码列表
- 📈 **实时状态**: 监控处理任务的实时状态

### 🚀 批量处理
- 📦 **任务队列**: 支持多个视频处理任务并行执行
- 🎯 **任务管理**: 实时查询和管理处理任务状态
- ⚡ **高效执行**: 优化的批量处理算法

## 🛠️ 安装使用

### 📦 NPM 安装
```bash
npm install -g @pickstar-2002/video-clip-mcp
```

### 🔧 MCP 服务器配置

#### 🎯 Claude Desktop
在 `claude_desktop_config.json` 中添加：
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

#### 🤖 Cursor AI
在 `.cursorrules` 或项目配置中添加：
```json
{
  "mcp": {
    "servers": {
      "video-clip": {
        "command": "npx @pickstar-2002/video-clip-mcp"
      }
    }
  }
}
```

#### 🌊 WindSurf
在 `.windsurfrules` 中配置：
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

#### 🎨 CodeBuddy
在项目设置中添加 MCP 服务器：
```bash
npx @pickstar-2002/video-clip-mcp
```

#### 🔧 其他 MCP 兼容工具
任何支持 MCP 协议的工具都可以使用：
```bash
npx @pickstar-2002/video-clip-mcp --stdio
```

## 🎮 使用示例

### 📐 视频剪辑
```typescript
// 剪辑视频片段（10-30秒）
await clipVideo({
  inputPath: "input.mp4",
  outputPath: "output.mp4",
  timeSegment: { start: 10000, end: 30000 },
  quality: "fast",
  videoCodec: "libx264"
});
```

### 🔗 视频合并
```typescript
// 合并多个视频文件
await mergeVideos({
  inputPaths: ["video1.mp4", "video2.mp4"],
  outputPath: "merged.mp4",
  quality: "medium"
});
```

### ✂️ 视频分割
```typescript
// 按时长分割视频
await splitVideo({
  inputPath: "input.mp4",
  outputDir: "./output",
  splitBy: "duration",
  duration: 60 // 每段60秒
});
```

### 🚀 批量处理
```typescript
// 批量处理多个任务
await batchProcess({
  tasks: [
    {
      type: "clip",
      options: { /* 剪辑参数 */ }
    },
    {
      type: "merge", 
      options: { /* 合并参数 */ }
    }
  ]
});
```

## 🎯 支持格式

### 📹 视频格式
- **输入**: MP4, AVI, MOV, MKV, WebM, FLV
- **输出**: MP4, AVI, MOV, MKV, WebM, FLV

### 🎵 编码支持
- **视频编码**: H.264, H.265, VP9, AV1
- **音频编码**: AAC, MP3, Opus, Vorbis

## 🔧 系统要求

- 📱 **Node.js**: 18.0.0 或更高版本
- 🎬 **FFmpeg**: 自动安装和配置
- 💾 **内存**: 建议 4GB 以上
- 💿 **存储**: 根据视频文件大小而定

## 📚 API 文档

### 🔍 getVideoInfo
获取视频文件的详细信息
```typescript
interface VideoInfo {
  duration: number;    // 时长（秒）
  width: number;       // 宽度
  height: number;      // 高度
  fps: number;         // 帧率
  bitrate: number;     // 比特率
  format: string;      // 格式
  codec: string;       // 编码
  size: number;        // 文件大小
}
```

### ✂️ clipVideo
剪辑视频片段
```typescript
interface ClipOptions {
  inputPath: string;           // 输入文件路径
  outputPath: string;          // 输出文件路径
  timeSegment: {               // 时间段
    start: number;             // 开始时间（毫秒）
    end: number;               // 结束时间（毫秒）
  };
  quality?: string;            // 质量预设
  videoCodec?: string;         // 视频编码
  audioCodec?: string;         // 音频编码
}
```

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. 🍴 Fork 本仓库
2. 🌿 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 💾 提交更改 (`git commit -m 'Add amazing feature'`)
4. 📤 推送到分支 (`git push origin feature/amazing-feature`)
5. 🔄 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

- 🎬 基于 [FFmpeg](https://ffmpeg.org/) 构建
- 🤖 支持 [Model Context Protocol](https://modelcontextprotocol.io/)
- ⚡ 使用 [TypeScript](https://www.typescriptlang.org/) 开发

---

<div align="center">

**🌟 如果这个项目对您有帮助，请给个 Star！**

[🐛 报告问题](https://github.com/pickstar-2002/video-clip-mcp/issues) • [💡 功能建议](https://github.com/pickstar-2002/video-clip-mcp/issues) • [📖 文档](https://github.com/pickstar-2002/video-clip-mcp)

</div>