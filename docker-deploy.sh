#!/bin/bash

# Docker 部署脚本

set -e

echo "🚀 开始 Docker 部署..."

# 检查 Docker 是否安装
if ! command -v docker &> /dev/null; then
    echo "❌ Docker 未安装，请先安装 Docker"
    exit 1
fi

# 检查 Docker Compose 是否安装
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose 未安装，请先安装 Docker Compose"
    exit 1
fi

# 获取参数
ENV=${1:-prod}

case $ENV in
    "dev"|"development")
        echo "🔧 开发环境请使用本地启动方式:"
        echo "   npm run dev"
        echo "   访问地址: http://localhost:9000"
        exit 0
        ;;
    "prod"|"production")
        echo "🎯 生产环境部署"
        # 构建生产版本
        echo "📦 构建生产版本..."
        docker build -f Dockerfile.prod -t company-frontend:prod .
        
        # 停止旧服务
        docker-compose -f docker-compose.prod.yml down
        
        # 启动生产环境
        docker-compose -f docker-compose.prod.yml up -d
        echo "✅ 生产环境部署完成"
        echo "🌐 访问地址: http://localhost"
        ;;
    "stop")
        echo "🛑 停止服务"
        docker-compose -f docker-compose.prod.yml down 2>/dev/null || true
        echo "✅ 服务已停止"
        ;;
    "clean")
        echo "🧹 清理 Docker 资源"
        docker-compose -f docker-compose.prod.yml down --rmi all 2>/dev/null || true
        docker system prune -f
        echo "✅ Docker 资源已清理"
        ;;
    *)
        echo "❌ 未知环境: $ENV"
        echo "用法: $0 [dev|prod|stop|clean]"
        echo "注意: 开发环境请使用 npm run dev"
        exit 1
        ;;
esac

echo "🎉 部署完成！"