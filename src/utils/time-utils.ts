/**
 * 时间处理工具类
 */

export class TimeUtils {
  /**
   * 将秒转换为毫秒
   */
  static secondsToMilliseconds(seconds: number): number {
    return Math.round(seconds * 1000);
  }

  /**
   * 将毫秒转换为秒
   */
  static millisecondsToSeconds(milliseconds: number): number {
    return milliseconds / 1000;
  }

  /**
   * 格式化时间为 HH:MM:SS.mmm 格式
   */
  static formatTime(milliseconds: number): string {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const ms = milliseconds % 1000;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${ms
      .toString()
      .padStart(3, '0')}`;
  }

  /**
   * 解析时间字符串为毫秒
   * 支持格式: HH:MM:SS.mmm, MM:SS.mmm, SS.mmm, 或纯数字（秒）
   */
  static parseTime(timeString: string): number {
    // 如果是纯数字，当作秒处理
    if (/^\d+(\.\d+)?$/.test(timeString)) {
      return this.secondsToMilliseconds(parseFloat(timeString));
    }

    // 解析 HH:MM:SS.mmm 格式
    const timeRegex = /^(?:(\d+):)?(?:(\d+):)?(\d+)(?:\.(\d+))?$/;
    const match = timeString.match(timeRegex);

    if (!match) {
      throw new Error(`无效的时间格式: ${timeString}`);
    }

    const [, hours = '0', minutes = '0', seconds, milliseconds = '0'] = match;

    const totalMs =
      parseInt(hours) * 3600 * 1000 +
      parseInt(minutes) * 60 * 1000 +
      parseInt(seconds) * 1000 +
      parseInt(milliseconds.padEnd(3, '0').slice(0, 3));

    return totalMs;
  }

  /**
   * 验证时间段是否有效
   */
  static validateTimeSegment(start: number, end: number, maxDuration?: number): void {
    if (start < 0) {
      throw new Error('开始时间不能为负数');
    }

    if (end <= start) {
      throw new Error('结束时间必须大于开始时间');
    }

    if (maxDuration && end > maxDuration) {
      throw new Error(`结束时间不能超过视频总时长 ${this.formatTime(maxDuration)}`);
    }
  }

  /**
   * 计算时间段的持续时间
   */
  static getDuration(start: number, end: number): number {
    return end - start;
  }

  /**
   * 将时间段数组合并（去除重叠）
   */
  static mergeTimeSegments(segments: Array<{ start: number; end: number }>): Array<{ start: number; end: number }> {
    if (segments.length === 0) return [];

    // 按开始时间排序
    const sorted = segments.slice().sort((a, b) => a.start - b.start);
    const merged: Array<{ start: number; end: number }> = [sorted[0]];

    for (let i = 1; i < sorted.length; i++) {
      const current = sorted[i];
      const last = merged[merged.length - 1];

      if (current.start <= last.end) {
        // 有重叠，合并
        last.end = Math.max(last.end, current.end);
      } else {
        // 无重叠，添加新段
        merged.push(current);
      }
    }

    return merged;
  }

  /**
   * 计算多个时间段的总持续时间
   */
  static getTotalDuration(segments: Array<{ start: number; end: number }>): number {
    const merged = this.mergeTimeSegments(segments);
    return merged.reduce((total, segment) => total + this.getDuration(segment.start, segment.end), 0);
  }

  /**
   * 生成等间隔的时间点
   */
  static generateTimePoints(start: number, end: number, count: number): number[] {
    if (count <= 1) return [start];
    
    const interval = (end - start) / (count - 1);
    const points: number[] = [];
    
    for (let i = 0; i < count; i++) {
      points.push(start + interval * i);
    }
    
    return points;
  }

  /**
   * 将时间戳转换为FFmpeg时间格式
   */
  static toFFmpegTime(milliseconds: number): string {
    const seconds = this.millisecondsToSeconds(milliseconds);
    return seconds.toFixed(3);
  }

  /**
   * 从FFmpeg时间格式转换为毫秒
   */
  static fromFFmpegTime(timeString: string): number {
    const seconds = parseFloat(timeString);
    return this.secondsToMilliseconds(seconds);
  }
}