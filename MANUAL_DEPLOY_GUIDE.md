# 手动构建部署指南

## 🎯 目标
本地构建 Docker 镜像，传输到服务器并部署

## 📋 前提条件

### 本地环境
- Docker 已安装
- 有构建权限

### 服务器环境
- Docker 已安装
- SSH 可访问
- 有足够的存储空间

## 🔧 三种部署方式

### 方式一：分步手动操作（推荐新手）

#### 1. 本地构建镜像
```bash
# 构建镜像
./build-local.sh

# 输出示例：
# ✅ 镜像构建成功: company-website:prod-20241201-120000
# ✅ 镜像导出成功: company-website-prod-20241201-120000.tar
# 📊 文件大小: 45.2M
```

#### 2. 传输到服务器
```bash
# 使用 scp 传输（替换为你的服务器信息）
scp company-website-prod-20241201-120000.tar user@your-server.com:/opt/company-website/
```

#### 3. 服务器上部署
```bash
# SSH 登录服务器
ssh user@your-server.com

# 进入项目目录
cd /opt/company-website

# 部署镜像（自动加载 tar 文件）
./deploy-remote.sh '' company-website-prod-20241201-120000.tar

# 或者直接指定镜像名称
./deploy-remote.sh company-website:prod-20241201-120000
```

### 方式二：一键自动部署（推荐）

```bash
# 设置服务器信息
export SERVER_HOST=your-server.com
export SERVER_USER=root
export SERVER_PORT=22
export SERVER_PATH=/opt/company-website

# 一键部署
./deploy-full.sh
```

### 方式三：传统 Docker Compose 部署

适合在本地或服务器上直接构建：

```bash
# 本地构建并运行
./docker-deploy.sh prod
```

## 📊 常用命令

### 本地操作
```bash
# 构建镜像
./build-local.sh

# 查看本地镜像
docker images | grep company-website

# 清理本地构建缓存
docker system prune -f
```

### 服务器操作
```bash
# 查看运行状态
docker ps | grep company-website

# 查看日志
docker logs -f company-website

# 停止服务
docker stop company-website

# 启动服务
docker start company-website

# 重启服务
docker restart company-website

# 删除容器
docker rm company-website
```

## 🔍 故障排查

### 构建失败
1. 检查 Dockerfile.prod 语法
2. 确认 Node.js 版本兼容性
3. 查看构建日志：`docker build -f Dockerfile.prod -t test .`

### 传输失败
1. 检查 SSH 连接：`ssh user@server`
2. 检查磁盘空间：`df -h`
3. 检查文件权限：`ls -la`

### 部署失败
1. 检查端口占用：`netstat -tlnp | grep :80`
2. 检查容器日志：`docker logs company-website`
3. 检查镜像是否存在：`docker images`

### 服务无法访问
1. 检查容器状态：`docker ps`
2. 检查端口映射：`docker port company-website`
3. 检查防火墙：`iptables -L`
4. 测试本地访问：`curl http://localhost`

## ⚙️ 高级配置

### 自定义端口
```bash
# 部署时指定端口
PORT=8080 ./deploy-remote.sh company-website:prod-xxx
```

### 环境变量
```bash
# 服务器配置
export SERVER_HOST=your-server.com
export SERVER_USER=root
export SERVER_PORT=22
export SERVER_PATH=/opt/company-website

# 自动应用
./deploy-full.sh
```

### 多服务器部署
```bash
# 部署到多个服务器
for server in server1.com server2.com; do
    SERVER_HOST=$server ./deploy-full.sh
done
```

## 🔄 回滚操作

如果新部署有问题，可以快速回滚：

```bash
# 查看历史容器
docker ps -a | grep company-website-backup

# 停止当前容器
docker stop company-website

# 启动备份容器
docker start company-website-backup-xxx

# 重命名为正式名称
docker rename company-website company-website-bad
docker rename company-website-backup-xxx company-website
```

## 📁 文件结构
```
project/
├── build-local.sh          # 本地构建脚本
├── deploy-remote.sh        # 远程部署脚本
├── deploy-full.sh          # 一键部署脚本
├── docker-deploy.sh        # Docker Compose 部署
├── Dockerfile.prod         # 生产环境 Dockerfile
├── docker-compose.prod.yml # Docker Compose 配置
├── MANUAL_DEPLOY_GUIDE.md  # 本指南
└── docker/
    └── nginx.conf          # Nginx 配置
```

## 💡 最佳实践

1. **构建前清理**：定期清理 Docker 缓存
2. **版本标记**：使用时间戳标记镜像版本
3. **备份策略**：保留最近几个版本用于回滚
4. **健康检查**：部署后进行健康检查
5. **监控日志**：定期查看容器运行日志
6. **安全传输**：使用 SSH 密钥认证，避免密码传输

## 🆘 获取帮助

如果遇到问题：
1. 查看脚本输出信息
2. 检查 Docker 日志
3. 验证网络连接
4. 确认文件权限
5. 查看系统资源使用情况