const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const logger = require('./logger');

class FileUtils {
  static async ensureDirectory(dirPath) {
    try {
      await fs.access(dirPath);
    } catch (error) {
      await fs.mkdir(dirPath, { recursive: true });
      logger.info(`Created directory: ${dirPath}`);
    }
  }

  static async saveBufferToFile(buffer, filePath) {
    try {
      const dir = path.dirname(filePath);
      await this.ensureDirectory(dir);
      await fs.writeFile(filePath, buffer);
      return filePath;
    } catch (error) {
      logger.error('Error saving buffer to file:', error);
      throw new Error(`Failed to save file: ${error.message}`);
    }
  }

  static async readFileToBuffer(filePath) {
    try {
      return await fs.readFile(filePath);
    } catch (error) {
      logger.error('Error reading file to buffer:', error);
      throw new Error(`Failed to read file: ${error.message}`);
    }
  }

  static async deleteFile(filePath) {
    try {
      await fs.unlink(filePath);
      logger.info(`Deleted file: ${filePath}`);
      return true;
    } catch (error) {
      if (error.code !== 'ENOENT') {
        logger.error('Error deleting file:', error);
        throw new Error(`Failed to delete file: ${error.message}`);
      }
      return false; // File didn't exist
    }
  }

  static async fileExists(filePath) {
    try {
      await fs.access(filePath);
      return true;
    } catch (error) {
      return false;
    }
  }

  static getFileHash(buffer) {
    return crypto.createHash('sha256').update(buffer).digest('hex');
  }

  static getFileExtension(filename) {
    return path.extname(filename).toLowerCase();
  }

  static isValidFileType(filename, allowedExtensions) {
    const ext = this.getFileExtension(filename);
    return allowedExtensions.includes(ext);
  }

  static getMimeType(filename) {
    const ext = this.getFileExtension(filename);
    const mimeTypes = {
      '.wav': 'audio/wav',
      '.mp3': 'audio/mpeg',
      '.mp4': 'video/mp4',
      '.mov': 'video/quicktime',
      '.avi': 'video/x-msvideo',
      '.txt': 'text/plain',
      '.json': 'application/json',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.pdf': 'application/pdf'
    };
    return mimeTypes[ext] || 'application/octet-stream';
  }

  static formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  static sanitizeFilename(filename) {
    // Remove or replace characters that might be problematic in filenames
    return filename
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .replace(/_+/g, '_')
      .substring(0, 255); // Limit filename length
  }

  static async getTempFilePath(prefix = 'temp', extension = '') {
    const tempDir = path.join(__dirname, '../../temp');
    await this.ensureDirectory(tempDir);
    
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    const filename = `${prefix}_${timestamp}_${random}${extension}`;
    
    return path.join(tempDir, filename);
  }

  static async cleanTempFiles(maxAge = 24 * 60 * 60 * 1000) { // 24 hours default
    const tempDir = path.join(__dirname, '../../temp');
    
    try {
      const files = await fs.readdir(tempDir);
      const now = Date.now();
      
      for (const file of files) {
        const filePath = path.join(tempDir, file);
        const stats = await fs.stat(filePath);
        
        if (now - stats.mtime.getTime() > maxAge) {
          await this.deleteFile(filePath);
          logger.info(`Cleaned up temp file: ${file}`);
        }
      }
    } catch (error) {
      logger.error('Error cleaning temp files:', error);
    }
  }

  static async copyFile(sourcePath, destPath) {
    try {
      const dir = path.dirname(destPath);
      await this.ensureDirectory(dir);
      await fs.copyFile(sourcePath, destPath);
      return destPath;
    } catch (error) {
      logger.error('Error copying file:', error);
      throw new Error(`Failed to copy file: ${error.message}`);
    }
  }

  static async moveFile(sourcePath, destPath) {
    try {
      const dir = path.dirname(destPath);
      await this.ensureDirectory(dir);
      await fs.rename(sourcePath, destPath);
      return destPath;
    } catch (error) {
      logger.error('Error moving file:', error);
      throw new Error(`Failed to move file: ${error.message}`);
    }
  }

  static async getFileStats(filePath) {
    try {
      const stats = await fs.stat(filePath);
      return {
        size: stats.size,
        sizeFormatted: this.formatFileSize(stats.size),
        created: stats.birthtime,
        modified: stats.mtime,
        isFile: stats.isFile(),
        isDirectory: stats.isDirectory()
      };
    } catch (error) {
      logger.error('Error getting file stats:', error);
      throw new Error(`Failed to get file stats: ${error.message}`);
    }
  }

  static async listFiles(dirPath, options = {}) {
    const {
      recursive = false,
      includeStats = false,
      filter = null
    } = options;

    try {
      const files = await fs.readdir(dirPath);
      const result = [];

      for (const file of files) {
        const filePath = path.join(dirPath, file);
        
        if (includeStats) {
          const stats = await this.getFileStats(filePath);
          result.push({ name: file, path: filePath, ...stats });
        } else {
          result.push({ name: file, path: filePath });
        }

        if (recursive) {
          const stats = await fs.stat(filePath);
          if (stats.isDirectory()) {
            const subFiles = await this.listFiles(filePath, options);
            result.push(...subFiles);
          }
        }
      }

      // Apply filter if provided
      if (filter && typeof filter === 'function') {
        return result.filter(filter);
      }

      return result;
    } catch (error) {
      logger.error('Error listing files:', error);
      throw new Error(`Failed to list files: ${error.message}`);
    }
  }
}

// Initialize temp directory and start cleanup interval
FileUtils.ensureDirectory(path.join(__dirname, '../../temp'))
  .then(() => {
    // Clean up temp files every hour
    setInterval(() => FileUtils.cleanTempFiles(), 60 * 60 * 1000);
  })
  .catch(error => {
    logger.error('Failed to initialize temp directory:', error);
  });

module.exports = FileUtils;