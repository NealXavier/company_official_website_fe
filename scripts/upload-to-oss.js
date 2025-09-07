#!/usr/bin/env node

const OSS = require('ali-oss');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// 加载配置文件
let ossConfig;
try {
  // 尝试加载本地配置文件
  const localConfig = require('./oss-config.local.js');
  ossConfig = {
    region: process.env.OSS_REGION || localConfig.region,
    accessKeyId: process.env.OSS_ACCESS_KEY_ID || localConfig.accessKeyId,
    accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET || localConfig.accessKeySecret,
    bucket: process.env.OSS_BUCKET || localConfig.bucket,
    customDomain: localConfig.customDomain || ''
  };
} catch (error) {
  // 使用环境变量或默认配置
  ossConfig = {
    region: process.env.OSS_REGION || '<your-region>',
    accessKeyId: process.env.OSS_ACCESS_KEY_ID || '<your-access-key-id>',
    accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET || '<your-access-key-secret>',
    bucket: process.env.OSS_BUCKET || '<your-bucket-name>',
    customDomain: process.env.OSS_CUSTOM_DOMAIN || ''
  };
}

/**
 * 创建 OSS 客户端
 */
function createOSSClient() {
  // 检查配置
  const requiredConfig = ['region', 'accessKeyId', 'accessKeySecret', 'bucket'];
  const missingConfig = requiredConfig.filter(key => !ossConfig[key] || ossConfig[key].startsWith('<your-'));
  
  if (missingConfig.length > 0) {
    return null;
  }
  
  return new OSS(ossConfig);
}

// 延迟创建 OSS 客户端，直到需要时
let client = null;

/**
 * 获取文件的 MD5 哈希值
 */
function getFileHash(filePath) {
  const buffer = fs.readFileSync(filePath);
  return crypto.createHash('md5').update(buffer).digest('hex');
}

/**
 * 获取文件 MIME 类型
 */
function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.bmp': 'image/bmp'
  };
  return mimeTypes[ext] || 'application/octet-stream';
}

/**
 * 上传单个文件到 OSS
 */
async function uploadFile(filePath, ossPath) {
  try {
    // 确保客户端已创建
    if (!client) {
      client = createOSSClient();
      if (!client) {
        throw new Error('OSS 客户端创建失败，请检查配置');
      }
    }
    
    console.log(`正在上传: ${filePath}`);
    
    const fileBuffer = fs.readFileSync(filePath);
    const mimeType = getMimeType(filePath);
    
    const result = await client.put(ossPath, fileBuffer, {
      headers: {
        'Content-Type': mimeType,
        'Cache-Control': 'public, max-age=31536000'
      }
    });
    
    console.log(`✅ 上传成功: ${result.url}`);
    return result.url;
  } catch (error) {
    console.error(`❌ 上传失败: ${filePath}`, error.message);
    throw error;
  }
}

/**
 * 批量上传图片
 */
async function uploadImages(imageDir, prefix = '') {
  try {
    console.log(`开始扫描目录: ${imageDir}`);
    
    if (!fs.existsSync(imageDir)) {
      console.error(`目录不存在: ${imageDir}`);
      return;
    }
    
    const files = fs.readdirSync(imageDir);
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'].includes(ext);
    });
    
    if (imageFiles.length === 0) {
      console.log('没有找到图片文件');
      return;
    }
    
    console.log(`找到 ${imageFiles.length} 张图片`);
    
    const results = [];
    
    for (const file of imageFiles) {
      const filePath = path.join(imageDir, file);
      const fileStat = fs.statSync(filePath);
      
      if (fileStat.isFile()) {
        const fileHash = getFileHash(filePath);
        const ext = path.extname(file);
        const fileName = path.basename(file, ext);
        
        // 生成 OSS 路径: prefix/时间戳_文件名_哈希值.扩展名
        const timestamp = Date.now();
        const ossPath = `${prefix}${fileName}_${timestamp}_${fileHash.substring(0, 8)}${ext}`;
        
        try {
          const url = await uploadFile(filePath, ossPath);
          results.push({
            originalName: file,
            ossPath: ossPath,
            url: url,
            size: fileStat.size
          });
        } catch (error) {
          results.push({
            originalName: file,
            error: error.message
          });
        }
      }
    }
    
    // 生成上传报告
    generateUploadReport(results);
    
    return results;
  } catch (error) {
    console.error('上传过程出错:', error.message);
    throw error;
  }
}

/**
 * 生成上传报告
 */
function generateUploadReport(results) {
  const successCount = results.filter(r => r.url).length;
  const errorCount = results.filter(r => r.error).length;
  const totalSize = results.filter(r => r.size).reduce((sum, r) => sum + r.size, 0);
  
  console.log('\n=== 上传报告 ===');
  console.log(`总文件数: ${results.length}`);
  console.log(`成功: ${successCount}`);
  console.log(`失败: ${errorCount}`);
  console.log(`总大小: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
  
  if (errorCount > 0) {
    console.log('\n失败的文件:');
    results.filter(r => r.error).forEach(r => {
      console.log(`- ${r.originalName}: ${r.error}`);
    });
  }
  
  // 保存详细报告到文件
  const reportContent = {
    uploadTime: new Date().toISOString(),
    summary: {
      total: results.length,
      success: successCount,
      error: errorCount,
      totalSize: totalSize
    },
    results: results
  };
  
  const reportFile = path.join(process.cwd(), `upload-report-${Date.now()}.json`);
  fs.writeFileSync(reportFile, JSON.stringify(reportContent, null, 2));
  console.log(`\n详细报告已保存到: ${reportFile}`);
}

/**
 * 主函数
 */
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('用法: node upload-to-oss.js <图片目录> [OSS前缀]');
    console.log('示例: node upload-to-oss.js ./images products/2024/');
    console.log('\n环境变量:');
    console.log('OSS_REGION - OSS 地域');
    console.log('OSS_ACCESS_KEY_ID - 访问密钥 ID');
    console.log('OSS_ACCESS_KEY_SECRET - 访问密钥密钥');
    console.log('OSS_BUCKET - 存储桶名称');
    return;
  }
  
  const [imageDir, prefix = ''] = args;
  
  // 检查配置
  const requiredConfig = ['region', 'accessKeyId', 'accessKeySecret', 'bucket'];
  const missingConfig = requiredConfig.filter(key => !ossConfig[key] || ossConfig[key].startsWith('<your-'));
  
  if (missingConfig.length > 0) {
    console.error('❌ OSS 配置不完整，请设置以下环境变量:');
    missingConfig.forEach(key => {
      console.log(`- OSS_${key.toUpperCase()}`);
    });
    console.log('\n或者直接在脚本中修改 ossConfig 对象');
    return;
  }
  
  try {
    await uploadImages(imageDir, prefix);
    console.log('\n🎉 所有图片上传完成！');
  } catch (error) {
    console.error('❌ 上传失败:', error.message);
    process.exit(1);
  }
}

// 执行主函数
if (require.main === module) {
  main();
}

module.exports = { uploadImages, uploadFile };