# 🎬 Video Clip MCP

[![npm version](https://badge.fury.io/js/@pickstar-2002%2Fvideo-clip-mcp.svg)](https://badge.fury.io/js/@pickstar-2002%2Fvideo-clip-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue.svg)](https://www.typescriptlang.org/)
[![FFmpeg](https://img.shields.io/badge/FFmpeg-Auto%20Install-green.svg)](https://ffmpeg.org/)

<a href="https://glama.ai/mcp/servers/@pickstar-2002/video-clip-mcp">
  <img width="380" height="200" src="https://glama.ai/mcp/servers/@pickstar-2002/video-clip-mcp/badge" alt="Video Clip MCP server" />
</a>

## 📖 项目简介

基于 AI MCP 协议的专业视频剪辑工具，提供高效的视频处理能力和智能化操作体验。无需手动安装 FFmpeg，开箱即用！

## ✨ 核心功能

- 🎯 **精准剪辑** - 支持毫秒级精度的视频片段裁剪
- 🔗 **智能合并** - 多视频文件无缝拼接，自动适配格式差异
- ✂️ **灵活分割** - 按时长、大小或段数智能分割视频
- 📊 **信息获取** - 详细的视频元数据分析和格式检测
- 🚀 **批量处理** - 高效的批量任务管理和并行处理
- 🎨 **多格式支持** - 支持主流视频格式和编码标准
- 📈 **任务监控** - 实时任务状态跟踪和进度管理
- 🛠️ **高度可配置** - 丰富的编码参数和质量预设

## 📦 安装使用

### 全局安装（推荐）

```bash
npm install -g @pickstar-2002/video-clip-mcp@latest
```

### 临时使用

```bash
npx @pickstar-2002/video-clip-mcp@latest
```

## 🔧 MCP 服务器配置

### Claude Desktop

在 `claude_desktop_config.json` 中添加：

```json
{
  "mcpServers": {
    "video-clip": {
      "command": "npx",
      "args": ["@pickstar-2002/video-clip-mcp@latest"]
    }
  }
}
```

### Cursor AI

在 `.cursorrules` 或项目配置中添加：

```json
{
  "mcp": {
    "servers": {
      "video-clip": {
        "command": "npx @pickstar-2002/video-clip-mcp@latest"
      }
    }
  }
}
```

### WindSurf

在 `windsurfconfig.json` 中配置：

```json
{
  "mcpServers": {
    "video-clip": {
      "command": "npx",
      "args": ["@pickstar-2002/video-clip-mcp@latest"],
      "env": {}
    }
  }
}
```

### CodeBuddy

在项目根目录创建 `.codebuddy/mcp.json`：

```json
{
  "servers": {
    "video-clip": {
      "command": "npx @pickstar-2002/video-clip-mcp@latest",
      "description": "🎬 视频剪辑处理工具"
    }
  }
}
```

### 其他 MCP 兼容工具

通用配置格式：

```json
{
  "mcpServers": {
    "video-clip": {
      "command": "npx",
      "args": ["@pickstar-2002/video-clip-mcp@latest"]
    }
  }
}
```

## 💡 使用示例

### 基础视频剪辑

```typescript
// 剪辑视频片段（10秒到30秒）
await clipVideo({
  inputPath: "input.mp4",
  outputPath: "output.mp4",
  timeSegment: {
    start: 10000,  // 10秒（毫秒）
    end: 30000     // 30秒（毫秒）
  },
  quality: "fast",
  videoCodec: "libx264"
});
```

### 视频合并

```typescript
// 合并多个视频文件
await mergeVideos({
  inputPaths: ["video1.mp4", "video2.mp4", "video3.mp4"],
  outputPath: "merged.mp4",
  quality: "medium",
  resolution: { width: 1920, height: 1080 }
});
```

### 视频分割

```typescript
// 按时长分割视频
await splitVideo({
  inputPath: "long_video.mp4",
  outputDir: "./segments",
  splitBy: "duration",
  duration: 60,  // 每60秒一段
  namePattern: "segment_{index}.{ext}"
});
```

### 批量处理

```typescript
// 批量处理任务
const tasks = [
  {
    type: "clip",
    options: {
      inputPath: "video1.mp4",
      outputPath: "clip1.mp4",
      timeSegment: { start: 0, end: 30000 }
    }
  },
  {
    type: "clip", 
    options: {
      inputPath: "video2.mp4",
      outputPath: "clip2.mp4",
      timeSegment: { start: 10000, end: 40000 }
    }
  }
];

await batchProcess({ tasks });
```

## 🎥 支持格式

### 视频格式
- **输入格式**: MP4, AVI, MOV, MKV, WebM, FLV, 3GP, WMV
- **输出格式**: MP4, AVI, MOV, MKV, WebM

### 视频编码
- **H.264** (libx264) - 通用兼容性最佳
- **H.265** (libx265) - 高压缩比，文件更小
- **VP9** (libvpx-vp9) - 开源编码，适合网络传输
- **AV1** (libaom-av1) - 新一代编码，压缩效率极高

### 音频编码
- **AAC** - 高质量音频编码
- **MP3** (libmp3lame) - 通用兼容性
- **Opus** (libopus) - 低延迟高质量
- **Vorbis** (libvorbis) - 开源音频编码

## 🖥️ 系统要求

### Node.js 版本
- **最低要求**: Node.js 18.0.0+
- **推荐版本**: Node.js 20.0.0+

### 系统依赖
- **FFmpeg**: 自动安装（通过 @ffmpeg-installer/ffmpeg 包）
- **操作系统**: Windows 10+, macOS 10.15+, Linux (Ubuntu 18.04+)

### 推荐硬件配置
- **CPU**: 4核心以上，支持硬件加速更佳
- **内存**: 8GB RAM 以上
- **存储**: SSD 硬盘，至少2GB可用空间
- **GPU**: 支持硬件编码的显卡（可选）

## 📚 API 文档

### 核心接口定义

```typescript
interface VideoClipOptions {
  inputPath: string;
  outputPath: string;
  timeSegment: {
    start: number;  // 开始时间（毫秒）
    end: number;    // 结束时间（毫秒）
  };
  quality?: 'ultrafast' | 'fast' | 'medium' | 'slow' | 'veryslow';
  videoCodec?: 'libx264' | 'libx265' | 'libvpx-vp9' | 'libaom-av1';
  audioCodec?: 'aac' | 'libmp3lame' | 'libopus' | 'libvorbis';
  preserveMetadata?: boolean;
}

interface MergeVideosOptions {
  inputPaths: string[];
  outputPath: string;
  quality?: string;
  videoCodec?: string;
  audioCodec?: string;
  resolution?: { width: number; height: number };
  fps?: number;
}

interface SplitVideoOptions {
  inputPath: string;
  outputDir: string;
  splitBy: 'duration' | 'size' | 'segments';
  duration?: number;     // 按时长分割（秒）
  maxSize?: number;      // 按大小分割（MB）
  segmentCount?: number; // 分割段数
  namePattern?: string;  // 文件命名模式
}

interface VideoInfo {
  duration: number;      // 时长（秒）
  width: number;         // 宽度
  height: number;        // 高度
  fps: number;          // 帧率
  bitrate: number;      // 比特率
  format: string;       // 格式
  codec: string;        // 编码
  size: number;         // 文件大小（字节）
}

interface TaskStatus {
  id: string;
  type: 'clip' | 'merge' | 'split';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress?: number;
  createdAt: string;
  completedAt?: string;
  error?: string;
  result?: any;
}
```

### 主要方法

```typescript
// 获取视频信息
getVideoInfo(filePath: string): Promise<VideoInfo>

// 剪辑视频
clipVideo(options: VideoClipOptions): Promise<string>

// 合并视频
mergeVideos(options: MergeVideosOptions): Promise<string>

// 分割视频
splitVideo(options: SplitVideoOptions): Promise<string[]>

// 批量处理
batchProcess(tasks: BatchTask[]): Promise<string[]>

// 获取任务状态
getTaskStatus(taskId: string): Promise<TaskStatus>

// 取消任务
cancelTask(taskId: string): Promise<boolean>

// 获取支持的格式
getSupportedFormats(): Promise<SupportedFormats>
```

## 🚨 疑难解答

### 常见问题及解决方案

#### 1. 🔄 Connection closed 错误

**问题描述**: 使用 `npx` 时出现连接关闭错误

**解决方案**（按推荐顺序）:

**a. 首选方案 - 使用 @latest 标签**
```bash
npx @pickstar-2002/video-clip-mcp@latest
```

**b. 备用方案 - 锁定特定版本**
```bash
npx @pickstar-2002/video-clip-mcp@1.2.0
```

**c. 终极方案 - 清理 npx 缓存**
```bash
# Windows
npx clear-npx-cache
# 或者手动删除缓存目录
rmdir /s "%APPDATA%\npm-cache\_npx"

# macOS/Linux
npx clear-npx-cache
# 或者手动删除缓存目录
rm -rf ~/.npm/_npx
```

#### 2. 🎬 FFmpeg 相关错误

**问题描述**: FFmpeg 执行失败或找不到

**解决方案**:
- 本工具已内置 FFmpeg，无需手动安装
- 如果仍有问题，请检查网络连接（首次使用需下载 FFmpeg）
- 确保有足够的磁盘空间（至少 100MB）

#### 3. 📁 文件路径问题

**问题描述**: 输入或输出文件路径错误

**解决方案**:
- 使用绝对路径而非相对路径
- 确保路径中不包含特殊字符
- Windows 用户注意使用正斜杠 `/` 或双反斜杠 `\\`

#### 4. 🔧 权限问题

**问题描述**: 没有文件读写权限

**解决方案**:
- 确保对输入文件有读取权限
- 确保对输出目录有写入权限
- Windows 用户可能需要以管理员身份运行

#### 5. 💾 内存不足

**问题描述**: 处理大文件时内存溢出

**解决方案**:
- 降低视频质量设置
- 分段处理大文件
- 增加系统虚拟内存

### 📞 获取帮助

如果以上解决方案无法解决您的问题，请：

1. 📋 收集错误信息和系统环境
2. 🐛 在 [GitHub Issues](https://github.com/pickstar-2002/video-clip-mcp/issues) 提交问题
3. 💬 联系开发者（见下方联系方式）

## 🤝 贡献指南

我们欢迎所有形式的贡献！请遵循以下步骤：

1. **Fork** 本仓库
2. **创建特性分支**: `git checkout -b feature/amazing-feature`
3. **提交更改**: `git commit -m 'Add amazing feature'`
4. **推送分支**: `git push origin feature/amazing-feature`
5. **提交 Pull Request**

### 开发环境设置

```bash
# 克隆仓库
git clone https://github.com/pickstar-2002/video-clip-mcp.git
cd video-clip-mcp

# 安装依赖
npm install

# 构建项目
npm run build

# 启动开发模式
npm run dev
```

## 📄 许可证

本项目采用 [MIT License](LICENSE) 开源协议。您可以自由使用、修改和分发本软件。

## 🙏 致谢

感谢以下开源项目和社区的支持：

- **[FFmpeg](https://ffmpeg.org/)** - 强大的多媒体处理框架
- **[fluent-ffmpeg](https://github.com/fluent-ffmpeg/node-fluent-ffmpeg)** - Node.js FFmpeg 封装库
- **[Model Context Protocol](https://modelcontextprotocol.io/)** - AI 工具集成协议
- **[TypeScript](https://www.typescriptlang.org/)** - 类型安全的 JavaScript 超集
- **开源社区** - 所有贡献者和用户的支持

## 🌟 支持项目

如果这个项目对您有帮助，请：

- ⭐ **给项目点个 Star**
- 🐛 **报告问题和建议** 
- 🔄 **分享给更多开发者**

让我们一起打造更好的视频处理工具！🚀

---

## 📞 联系方式

**微信**: pickstar_loveXX