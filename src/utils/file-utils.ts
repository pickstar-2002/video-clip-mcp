/**
 * 文件操作工具类
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';

export class FileUtils {
  /**
   * 检查文件是否存在
   */
  static async exists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * 获取文件大小（字节）
   */
  static async getFileSize(filePath: string): Promise<number> {
    const stats = await fs.stat(filePath);
    return stats.size;
  }

  /**
   * 创建目录（递归）
   */
  static async ensureDir(dirPath: string): Promise<void> {
    await fs.mkdir(dirPath, { recursive: true });
  }

  /**
   * 删除文件
   */
  static async deleteFile(filePath: string): Promise<void> {
    try {
      await fs.unlink(filePath);
    } catch (error: any) {
      // 忽略文件不存在的错误
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }
  }

  /**
   * 复制文件
   */
  static async copyFile(src: string, dest: string): Promise<void> {
    await this.ensureDir(path.dirname(dest));
    await fs.copyFile(src, dest);
  }

  /**
   * 移动文件
   */
  static async moveFile(src: string, dest: string): Promise<void> {
    await this.ensureDir(path.dirname(dest));
    await fs.rename(src, dest);
  }

  /**
   * 获取文件扩展名
   */
  static getExtension(filePath: string): string {
    return path.extname(filePath).toLowerCase().slice(1);
  }

  /**
   * 检查是否为支持的视频格式
   */
  static isSupportedVideoFormat(filePath: string): boolean {
    const supportedFormats = ['mp4', 'avi', 'mov', 'mkv', 'webm', 'flv', 'm4v', '3gp', 'wmv'];
    const ext = this.getExtension(filePath);
    return supportedFormats.includes(ext);
  }

  /**
   * 生成唯一文件名
   */
  static generateUniqueFileName(basePath: string, extension: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return path.join(basePath, `video_${timestamp}_${random}.${extension}`);
  }

  /**
   * 格式化文件大小
   */
  static formatFileSize(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`;
  }

  /**
   * 清理临时文件
   */
  static async cleanupTempFiles(tempDir: string, maxAge: number = 24 * 60 * 60 * 1000): Promise<number> {
    let cleanedCount = 0;
    
    try {
      const files = await fs.readdir(tempDir);
      const now = Date.now();

      for (const file of files) {
        const filePath = path.join(tempDir, file);
        const stats = await fs.stat(filePath);
        
        if (now - stats.mtime.getTime() > maxAge) {
          await this.deleteFile(filePath);
          cleanedCount++;
        }
      }
    } catch (error: any) {
      // 忽略目录不存在的错误
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }

    return cleanedCount;
  }
}