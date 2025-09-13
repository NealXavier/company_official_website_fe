#!/bin/bash

# 本地构建 Docker 镜像脚本
# 用于手动构建镜像并导出，方便部署到远程服务器

set -e

echo "🏗️  开始本地构建 Docker 镜像..."

# 配置
IMAGE_NAME="company-website"
IMAGE_TAG="prod-$(date +%Y%m%d-%H%M%S)"
FULL_IMAGE_NAME="${IMAGE_NAME}:${IMAGE_TAG}"
EXPORT_FILE="${IMAGE_NAME}-${IMAGE_TAG}.tar"

# 检查 Docker 是否安装
if ! command -v docker &> /dev/null; then
    echo "❌ Docker 未安装，请先安装 Docker"
    exit 1
fi

# 显示构建信息
echo "📋 构建信息："
echo "   镜像名称: ${FULL_IMAGE_NAME}"
echo "   导出文件: ${EXPORT_FILE}"
echo ""

# 构建镜像
echo "🔨 开始构建镜像..."
docker build -f Dockerfile.prod -t ${FULL_IMAGE_NAME} .

if [ $? -eq 0 ]; then
    echo "✅ 镜像构建成功: ${FULL_IMAGE_NAME}"
else
    echo "❌ 镜像构建失败"
    exit 1
fi

# 导出镜像
echo "💾 导出镜像到文件..."
docker save -o ${EXPORT_FILE} ${FULL_IMAGE_NAME}

if [ $? -eq 0 ]; then
    echo "✅ 镜像导出成功: ${EXPORT_FILE}"
    echo "📊 文件大小: $(du -h ${EXPORT_FILE} | cut -f1)"
else
    echo "❌ 镜像导出失败"
    exit 1
fi

# 显示下一步操作提示
echo ""
echo "🎯 构建完成！下一步操作："
echo ""
echo "1️⃣  复制镜像文件到服务器："
echo "   scp ${EXPORT_FILE} user@your-server:/path/to/"
echo ""
echo "2️⃣  在服务器上加载镜像："
echo "   ssh user@your-server 'docker load -i /path/to/${EXPORT_FILE}'"
echo ""
echo "3️⃣  运行部署脚本："
echo "   ssh user@your-server 'cd /path/to/project && ./deploy-remote.sh ${FULL_IMAGE_NAME}'"
echo ""
echo "💡 提示：你也可以使用 ./deploy-remote.sh 脚本自动完成传输和部署"

# 可选：清理本地构建缓存
echo ""
read -p "是否清理本地构建缓存？(y/N): " clean_cache
if [[ $clean_cache =~ ^[Yy]$ ]]; then
    docker system prune -f
    echo "🧹 本地构建缓存已清理"
fi