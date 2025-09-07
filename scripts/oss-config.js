// OSS 配置文件
// 复制此文件为 oss-config.local.js 并填入你的实际配置

const ossConfig = {
  // OSS 地域，如：oss-cn-hangzhou
  region: 'oss-cn-hangzhou',
  
  // 访问密钥 ID
  accessKeyId: '',
  
  // 访问密钥密钥
  accessKeySecret: '',
  
  // 存储桶名称
  bucket: '',
  
  // 自定义域名（可选）
  customDomain: '',
  
  // 上传路径前缀
  defaultPrefix: 'images/'
};

module.exports = ossConfig;