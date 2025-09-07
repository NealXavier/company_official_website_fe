#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function main() {
  console.log('🚀 阿里云 OSS 配置设置工具');
  console.log('================================\n');
  
  console.log('请按照提示输入你的 OSS 配置信息。');
  console.log('如果不知道如何获取这些信息，请参考 scripts/README.md\n');
  
  const config = {
    region: await question('OSS 地域 (如: oss-cn-hangzhou): '),
    accessKeyId: await question('AccessKey ID: '),
    accessKeySecret: await question('AccessKey Secret: '),
    bucket: await question('存储桶名称: '),
    customDomain: await question('自定义域名 (可选，直接回车跳过): '),
    defaultPrefix: await question('默认上传路径前缀 (可选，默认 images/): ') || 'images/'
  };
  
  console.log('\n📋 配置摘要:');
  console.log(`地域: ${config.region}`);
  console.log(`AccessKey ID: ${config.accessKeyId.substring(0, 8)}...`);
  console.log(`存储桶: ${config.bucket}`);
  console.log(`默认前缀: ${config.defaultPrefix}`);
  if (config.customDomain) {
    console.log(`自定义域名: ${config.customDomain}`);
  }
  
  const confirm = await question('\n确认配置正确吗? (y/N): ');
  
  if (confirm.toLowerCase() !== 'y') {
    console.log('❌ 配置已取消');
    rl.close();
    return;
  }
  
  // 生成配置文件内容
  const configContent = `// OSS 本地配置文件
// 自动生成于 ${new Date().toLocaleString()}

const ossConfig = {
  region: '${config.region}',
  accessKeyId: '${config.accessKeyId}',
  accessKeySecret: '${config.accessKeySecret}',
  bucket: '${config.bucket}',
  customDomain: '${config.customDomain}',
  defaultPrefix: '${config.defaultPrefix}'
};

module.exports = ossConfig;
`;
  
  const configPath = path.join(__dirname, 'oss-config.local.js');
  
  try {
    fs.writeFileSync(configPath, configContent);
    console.log(`\n✅ 配置文件已生成: ${configPath}`);
    console.log('📝 现在你可以使用图片上传脚本了！');
    console.log('示例: node upload-to-oss.js ./images products/2024/');
  } catch (error) {
    console.error(`❌ 配置文件生成失败: ${error.message}`);
  }
  
  rl.close();
}

// 检查是否已存在配置文件
const configPath = path.join(__dirname, 'oss-config.local.js');
if (fs.existsSync(configPath)) {
  console.log('⚠️  检测到已存在的配置文件:');
  console.log(`   ${configPath}`);
  
  const rl2 = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  rl2.question('是否覆盖现有配置? (y/N): ', (answer) => {
    rl2.close();
    
    if (answer.toLowerCase() === 'y') {
      main();
    } else {
      console.log('❌ 配置已取消');
    }
  });
} else {
  main();
}