# 阿里云 OSS 图片上传脚本

这个脚本可以帮助你将本地的图片批量上传到阿里云 OSS（对象存储服务）。

## 功能特点

- 📁 批量上传整个目录的图片
- 🔒 使用 MD5 哈希值避免重复上传
- 📊 生成详细的上传报告
- 🎯 支持自定义 OSS 路径前缀
- 🌍 支持环境变量配置
- 📋 支持多种图片格式（JPG、PNG、GIF、WebP、SVG、BMP）
- ⚡ 自动设置正确的 MIME 类型和缓存头

## 安装依赖

```bash
npm install
```

## 配置方法

### 方法 1：使用配置文件（推荐）

1. 复制配置文件模板：
```bash
cp scripts/oss-config.js scripts/oss-config.local.js
```

2. 编辑 `scripts/oss-config.local.js`，填入你的 OSS 配置：

```javascript
const ossConfig = {
  region: 'oss-cn-hangzhou',        // 你的 OSS 地域
  accessKeyId: '你的AccessKeyId',    // 访问密钥 ID
  accessKeySecret: '你的AccessKeySecret', // 访问密钥密钥
  bucket: '你的存储桶名称',          // 存储桶名称
  customDomain: '',                  // 自定义域名（可选）
  defaultPrefix: 'images/'           // 默认上传路径前缀
};

module.exports = ossConfig;
```

### 方法 2：使用环境变量

```bash
export OSS_REGION=oss-cn-hangzhou
export OSS_ACCESS_KEY_ID=你的AccessKeyId
export OSS_ACCESS_KEY_SECRET=你的AccessKeySecret
export OSS_BUCKET=你的存储桶名称
export OSS_CUSTOM_DOMAIN=你的自定义域名（可选）
```

### 方法 3：直接修改脚本

直接在 `upload-to-oss.js` 文件中修改 `ossConfig` 对象。

## 使用方法

### 基本用法

```bash
# 上传当前目录下的 images 文件夹中的所有图片
node scripts/upload-to-oss.js ./images

# 使用 npm 脚本
npm run upload-images ./images
```

### 指定 OSS 路径前缀

```bash
# 上传到 products/2024/ 目录下
node scripts/upload-to-oss.js ./images products/2024/

# 使用 npm 脚本
npm run upload-images ./images products/2024/
```

### 使用不同的配置文件

```bash
# 使用特定的配置文件
node scripts/upload-to-oss.js ./images products/2024/
```

## OSS 配置获取

### 1. 获取 AccessKey

1. 登录阿里云控制台
2. 进入 "访问控制" (RAM)
3. 创建或查看 AccessKey
4. 获取 AccessKeyId 和 AccessKeySecret

### 2. 创建存储桶

1. 进入 OSS 控制台
2. 创建新的存储桶
3. 记录存储桶名称和地域信息

### 3. 配置权限

确保你的 AccessKey 有 OSS 的读写权限。

## 上传结果

上传完成后，脚本会：

1. 在控制台显示上传进度和结果
2. 生成 JSON 格式的详细报告文件
3. 显示上传统计信息（成功/失败数量、总大小等）

## 文件命名规则

上传的文件会按照以下格式命名：
```
{前缀}{原文件名}_{时间戳}_{MD5哈希值前8位}.{扩展名}
```

例如：
```
products/2024/banner_1694001234567_a1b2c3d4.jpg
```

## 支持的图片格式

- `.jpg`, `.jpeg` - JPEG 图片
- `.png` - PNG 图片
- `.gif` - GIF 图片
- `.webp` - WebP 图片
- `.svg` - SVG 矢量图
- `.bmp` - BMP 位图

## 错误处理

脚本会：
- 跳过非图片文件
- 处理网络错误和重试
- 记录失败的文件和错误原因
- 继续上传其他文件，即使某些文件失败

## 安全建议

1. **不要将配置文件提交到代码仓库**
   - `oss-config.local.js` 已添加到 `.gitignore`
   - 使用环境变量在 CI/CD 中更安全

2. **使用最小权限原则**
   - 只为 AccessKey 分配必要的 OSS 权限
   - 考虑使用临时凭证

3. **定期轮换密钥**
   - 定期更换 AccessKey
   - 监控异常访问

## 故障排除

### 常见问题

1. **"OSS 配置不完整"错误**
   - 检查配置文件或环境变量
   - 确保所有必需的配置项都已填写

2. **"目录不存在"错误**
   - 检查图片目录路径是否正确
   - 使用绝对路径或相对路径

3. **上传失败**
   - 检查网络连接
   - 验证 OSS 配置是否正确
   - 检查存储桶权限

4. **找不到图片文件**
   - 确保文件扩展名正确
   - 检查文件是否为支持的格式

### 调试模式

在脚本中添加 `console.log` 或使用调试器来排查问题。

## 扩展功能

你可以根据需要修改脚本：

- 添加更多的图片格式支持
- 修改文件命名规则
- 添加图片压缩功能
- 集成到构建流程中
- 添加 GUI 界面

## 相关链接

- [阿里云 OSS 文档](https://help.aliyun.com/document_detail/31978.html)
- [ali-oss SDK 文档](https://github.com/ali-sdk/ali-oss)
- [阿里云控制台](https://oss.console.aliyun.com/)