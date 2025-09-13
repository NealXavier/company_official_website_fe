#!/bin/bash

# 一键构建+传输+部署脚本
# 本地构建镜像，传输到服务器并部署

set -e

echo "🚀 一键构建+传输+部署流程"

# 配置
SERVER_USER=${SERVER_USER:-"root"}
SERVER_HOST=${SERVER_HOST:-""}
SERVER_PORT=${SERVER_PORT:-"22"}
SERVER_PATH=${SERVER_PATH:-"/opt/company-website"}
IMAGE_NAME="company-website"
IMAGE_TAG="prod-$(date +%Y%m%d-%H%M%S)"
FULL_IMAGE_NAME="${IMAGE_NAME}:${IMAGE_TAG}"
EXPORT_FILE="${IMAGE_NAME}-${IMAGE_TAG}.tar"

# 检查必要参数
if [ -z "$SERVER_HOST" ]; then
    echo "❌ 请设置服务器地址"
    echo "用法: SERVER_HOST=your-server.com ./deploy-full.sh"
    echo "或者设置环境变量："
    echo "   export SERVER_HOST=your-server.com"
    echo "   export SERVER_USER=root"
    echo "   export SERVER_PATH=/opt/company-website"
    exit 1
fi

echo "📋 部署配置："
echo "   服务器: ${SERVER_USER}@${SERVER_HOST}:${SERVER_PORT}"
echo "   路径: ${SERVER_PATH}"
echo "   镜像: ${FULL_IMAGE_NAME}"
echo ""

# 步骤1：本地构建
echo "🔨 步骤1: 本地构建镜像..."
./build-local.sh

if [ $? -ne 0 ]; then
    echo "❌ 本地构建失败"
    exit 1
fi

echo "✅ 本地构建完成"

# 步骤2：创建服务器目录
echo "📁 步骤2: 创建服务器目录..."
ssh -p ${SERVER_PORT} ${SERVER_USER}@${SERVER_HOST} "mkdir -p ${SERVER_PATH}"

# 步骤3：传输镜像文件
echo "📦 步骤3: 传输镜像文件到服务器..."
scp -P ${SERVER_PORT} ${EXPORT_FILE} ${SERVER_USER}@${SERVER_HOST}:${SERVER_PATH}/

if [ $? -ne 0 ]; then
    echo "❌ 文件传输失败"
    exit 1
fi

echo "✅ 文件传输完成"

# 步骤4：远程部署
echo "🚀 步骤4: 远程部署..."
ssh -p ${SERVER_PORT} ${SERVER_USER}@${SERVER_HOST} << EOF
cd ${SERVER_PATH}
chmod +x deploy-remote.sh
./deploy-remote.sh '' ${EXPORT_FILE}
EOF

if [ $? -ne 0 ]; then
    echo "❌ 远程部署失败"
    exit 1
fi

echo "✅ 远程部署完成"

# 步骤5：清理本地临时文件
echo "🧹 步骤5: 清理本地临时文件..."
rm -f ${EXPORT_FILE}

# 显示访问信息
echo ""
echo "🎉 一键部署完成！"
echo "🌐 访问地址："
echo "   http://${SERVER_HOST}"
echo ""
echo "📊 远程查看日志："
echo "   ssh -p ${SERVER_PORT} ${SERVER_USER}@${SERVER_HOST} 'docker logs -f company-website'"
echo ""
echo "🔧 远程管理容器："
echo "   ssh -p ${SERVER_PORT} ${SERVER_USER}@${SERVER_HOST} 'docker ps | grep company-website'" 
echo ""
echo "💡 下次部署可以直接运行："
echo "   SERVER_HOST=${SERVER_HOST} ./deploy-full.sh" 

# 可选：清理服务器上的临时文件
read -p "是否清理服务器上的临时文件？(y/N): " cleanup_server
if [[ $cleanup_server =~ ^[Yy]$ ]]; then
    ssh -p ${SERVER_PORT} ${SERVER_USER}@${SERVER_HOST} "rm -f ${SERVER_PATH}/${EXPORT_FILE}"
    echo "🧹 服务器临时文件已清理"
fi

echo ""
echo "✨ 所有步骤完成！" 

# 健康检查
echo "🏥 进行健康检查..."
sleep 3
if curl -f -m 10 http://${SERVER_HOST} > /dev/null 2>&1; then
    echo "✅ 服务运行正常！"
else
    echo "⚠️  健康检查失败，请手动检查服务状态"
fi