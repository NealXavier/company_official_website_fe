#!/bin/bash

# 远程部署脚本
# 用于在服务器上部署 Docker 镜像

set -e

echo "🚀 开始远程部署..."

# 配置
CONTAINER_NAME="company-website"
PORT=${PORT:-80}
BACKUP_SUFFIX="backup-$(date +%Y%m%d-%H%M%S)"

# 获取参数
IMAGE_NAME=${1:-""}
TAR_FILE=${2:-""}

# 如果提供了 tar 文件，先加载镜像
if [ -n "$TAR_FILE" ] && [ -f "$TAR_FILE" ]; then
    echo "📦 从文件加载镜像: $TAR_FILE"
    docker load -i "$TAR_FILE"
    IMAGE_NAME=$(docker images --format "table {{.Repository}}:{{.Tag}}" | grep "$CONTAINER_NAME" | head -1 | awk '{print $1}')
    echo "✅ 镜像加载成功: $IMAGE_NAME"
fi

# 检查镜像名称
if [ -z "$IMAGE_NAME" ]; then
    echo "❌ 请提供镜像名称或 tar 文件"
    echo "用法: $0 [镜像名称] [tar文件(可选)]"
    echo "示例: $0 company-website:prod-20241201-120000"
    echo "示例: $0 '' company-website-prod-20241201-120000.tar"
    exit 1
fi

# 检查镜像是否存在
echo "🔍 检查镜像: $IMAGE_NAME"
if ! docker image inspect "$IMAGE_NAME" > /dev/null 2>&1; then
    echo "❌ 镜像不存在: $IMAGE_NAME"
    echo "请先在服务器上加载镜像或检查镜像名称是否正确"
    exit 1
fi

echo "✅ 镜像检查通过"

# 停止并备份现有容器
echo "🛑 停止现有容器..."
if docker ps | grep -q "$CONTAINER_NAME"; then
    echo "📋 备份现有容器配置..."
    docker stop "$CONTAINER_NAME"
    docker rename "$CONTAINER_NAME" "${CONTAINER_NAME}-${BACKUP_SUFFIX}"
    echo "✅ 现有容器已停止并备份为: ${CONTAINER_NAME}-${BACKUP_SUFFIX}"
else
    echo "ℹ️  未找到运行中的容器"
fi

# 启动新容器
echo "🆕 启动新容器..."
docker run -d \
    --name "$CONTAINER_NAME" \
    --restart unless-stopped \
    -p ${PORT}:80 \
    -v /etc/localtime:/etc/localtime:ro \
    -e TZ=Asia/Shanghai \
    "$IMAGE_NAME"

if [ $? -eq 0 ]; then
    echo "✅ 新容器启动成功"
else
    echo "❌ 新容器启动失败"
    echo "🔄 尝试回滚..."
    if docker ps -a | grep -q "${CONTAINER_NAME}-${BACKUP_SUFFIX}"; then
        docker start "${CONTAINER_NAME}-${BACKUP_SUFFIX}"
        docker rename "${CONTAINER_NAME}-${BACKUP_SUFFIX}" "$CONTAINER_NAME"
        echo "✅ 已回滚到之前的版本"
    fi
    exit 1
fi

# 健康检查
echo "🏥 健康检查..."
sleep 5
for i in {1..10}; do
    if curl -f http://localhost:${PORT} > /dev/null 2>&1; then
        echo "✅ 服务运行正常"
        break
    else
        echo "⏳ 等待服务启动... (${i}/10)"
        sleep 3
    fi
done

if [ $i -eq 10 ]; then
    echo "⚠️  健康检查失败，但容器已启动"
fi

# 清理旧容器（可选）
echo ""
read -p "是否删除备份的旧容器？(y/N): " cleanup
if [[ $cleanup =~ ^[Yy]$ ]]; then
    if docker ps -a | grep -q "${CONTAINER_NAME}-${BACKUP_SUFFIX}"; then
        docker rm "${CONTAINER_NAME}-${BACKUP_SUFFIX}"
        echo "🧹 旧容器已删除"
    fi
fi

# 显示容器信息
echo ""
echo "🎯 部署完成！"
echo "📋 容器信息："
docker ps | grep "$CONTAINER_NAME"
echo ""
echo "🌐 访问地址："
echo "   http://localhost:${PORT}"
echo ""
echo "📊 容器日志："
echo "   docker logs -f $CONTAINER_NAME"
echo ""
echo "🔧 常用命令："
echo "   停止: docker stop $CONTAINER_NAME"
echo "   启动: docker start $CONTAINER_NAME"
echo "   重启: docker restart $CONTAINER_NAME"
echo "   删除: docker rm $CONTAINER_NAME"