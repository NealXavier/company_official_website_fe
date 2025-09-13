# Docker 部署方案

## 概述
本项目提供完整的 Docker 容器化部署方案，支持开发环境和生产环境的快速部署。

## 文件结构
```
├── Dockerfile.prod         # 生产环境 Dockerfile
├── docker-compose.prod.yml # 生产环境编排
├── docker-deploy.sh        # 一键部署脚本
├── build-local.sh          # 本地构建脚本
├── deploy-remote.sh        # 远程部署脚本
├── deploy-full.sh          # 一键构建+传输+部署脚本
├── MANUAL_DEPLOY_GUIDE.md  # 手动部署完整指南
├── docker/
│   └── nginx.conf         # Nginx 配置
└── .dockerignore          # Docker 忽略文件
```

## 快速开始

### 开发环境（本地启动）
开发环境不需要 Docker，直接使用本地开发服务器：
```bash
# 安装依赖（首次需要）
npm install

# 启动开发服务器
npm run dev

# 访问地址: http://localhost:9000
```

### 生产环境部署（Docker）
```bash
# 使用部署脚本
./docker-deploy.sh prod

# 或者直接使用 docker-compose
docker-compose -f docker-compose.prod.yml up -d
```

## 部署命令

### 生产环境
```bash
# 启动生产环境
./docker-deploy.sh prod

# 停止服务
./docker-deploy.sh stop

# 清理资源
./docker-deploy.sh clean
```

## 配置说明

### 生产环境 (Dockerfile.prod)
- 多阶段构建优化镜像大小
- 使用 Nginx 提供静态文件服务
- 内置 API 代理配置
- 支持 HTTPS 配置

### Nginx 配置
- 静态文件服务
- API 代理转发
- 静态资源缓存
- 错误页面处理

## 环境变量

### 开发环境
- `NODE_ENV=development`
- 后端 API: `http://127.0.0.1:8088`

### 生产环境
- `NODE_ENV=production`
- 后端 API: `http://81.71.17.188:8088`

## 端口映射

| 环境 | 主机端口 | 容器端口 | 服务 |
|------|----------|----------|------|
| 开发 | 9000 | 9000 | Vue 开发服务器 |
| 生产 | 80 | 80 | Nginx |
| 生产 | 443 | 443 | Nginx HTTPS |

## 卷挂载

### 生产环境
- 构建产物挂载: `./dist → /usr/share/nginx/html`

## 网络配置

- 使用 Docker Bridge 网络
- 服务间通过容器名通信
- 支持自定义网络配置

## 部署流程

### 生产环境
1. 构建生产版本前端代码
2. 构建 Nginx 镜像
3. 配置静态文件服务
4. 配置 API 代理
5. 通过 http://localhost 访问

## 维护命令

```bash
# 查看容器状态
docker-compose ps

# 查看日志
docker-compose logs -f

# 进入容器
docker-compose exec frontend sh

# 重启服务
docker-compose restart

# 更新镜像
docker-compose pull
docker-compose up -d
```

## 故障排除

### 端口占用
检查端口是否被占用：
```bash
lsof -i :9000  # 开发环境
lsof -i :80    # 生产环境
```

### 构建失败
清理缓存重新构建：
```bash
docker-compose down
docker system prune -f
docker-compose build --no-cache
docker-compose up -d
```

### 权限问题
确保脚本有执行权限：
```bash
chmod +x docker-deploy.sh
```

## 性能优化

### 镜像优化
- 使用 Alpine Linux 基础镜像
- 多阶段构建减少镜像大小
- 合理使用缓存层

### 运行时优化
- Nginx 静态资源缓存
- Gzip 压缩启用
- 连接池优化

## 安全考虑

### 生产环境
- 使用非 root 用户运行服务
- 定期更新基础镜像
- 配置防火墙规则
- 启用 HTTPS

### 敏感信息
- 环境变量管理敏感配置
- 不在镜像中包含密钥
- 使用 Docker Secret 管理机密

## 扩展功能

### CI/CD 集成
支持 GitHub Actions、GitLab CI 等自动化部署

### 监控集成
可集成 Prometheus、Grafana 等监控工具

### 日志收集
支持 ELK、Fluentd 等日志收集方案

## 手动构建部署方案

### 方案概述
支持本地构建 Docker 镜像，传输到远程服务器并部署的完整流程。适用于以下场景：
- 服务器无法直接访问 Docker Hub
- 需要离线部署
- 构建环境和部署环境分离
- 需要更灵活的部署控制

### 部署方式对比

| 方式 | 适用场景 | 优点 | 缺点 |
|------|----------|------|------|
| **docker-deploy.sh** | 本地/服务器直接构建 | 简单快速 | 需要构建环境 |
| **手动分步部署** | 离线/分离环境 | 灵活可控 | 步骤较多 |
| **一键自动部署** | 日常部署 | 自动化程度高 | 需要配置SSH |

### 方式一：分步手动部署

#### 步骤1：本地构建镜像
```bash
# 执行本地构建脚本
./build-local.sh

# 输出示例：
# 🏗️ 开始本地构建 Docker 镜像...
# 📋 构建信息：
#    镜像名称: company-website:prod-20241201-120000
#    导出文件: company-website-prod-20241201-120000.tar
# 🔨 开始构建镜像...
# ✅ 镜像构建成功: company-website:prod-20241201-120000
# 💾 导出镜像到文件...
# ✅ 镜像导出成功: company-website-prod-20241201-120000.tar
# 📊 文件大小: 45.2M
```

#### 步骤2：传输到服务器
```bash
# 使用 scp 传输文件（替换为你的服务器信息）
scp company-website-prod-20250912-173652.tar ssh@:http://[服务器 IP]/opt/company-website/

# 或者使用 rsync（支持断点续传）
rsync -avz --progress company-website-prod-20241201-120000.tar user@your-server.com:/opt/company-website/
```

#### 步骤3：服务器上部署
```bash
# SSH 登录服务器
ssh user@your-server.com

# 进入项目目录
cd /opt/company-website

# 方式A：自动加载 tar 文件并部署
./deploy-remote.sh '' company-website-prod-20241201-120000.tar

# 方式B：指定镜像名称部署（如果镜像已加载）
./deploy-remote.sh company-website:prod-20241201-120000
```

### 方式二：一键自动部署

#### 配置服务器信息
```bash
# 临时设置
export SERVER_HOST=your-server.com
export SERVER_USER=root
export SERVER_PORT=22
export SERVER_PATH=/opt/company-website

# 或者写入 ~/.bashrc 永久设置
echo 'export SERVER_HOST=your-server.com' >> ~/.bashrc
echo 'export SERVER_USER=root' >> ~/.bashrc
source ~/.bashrc
```

#### 执行一键部署
```bash
# 全自动完成构建、传输、部署
./deploy-full.sh

# 输出示例：
# 🚀 一键构建+传输+部署流程
# 📋 部署配置：
#    服务器: root@your-server.com:22
#    路径: /opt/company-website
# 🔨 步骤1: 本地构建镜像...
# ✅ 本地构建完成
# 📁 步骤2: 创建服务器目录...
# 📦 步骤3: 传输镜像文件到服务器...
# ✅ 文件传输完成
# 🚀 步骤4: 远程部署...
# ✅ 远程部署完成
# ✅ 一键部署完成！
# 🌐 访问地址：
#    http://your-server.com
```

### 部署脚本功能详解

#### build-local.sh（本地构建）
- ✅ 自动构建 Docker 镜像
- ✅ 导出镜像为 tar 文件
- ✅ 显示构建信息和文件大小
- ✅ 可选清理构建缓存
- ✅ 提供下一步操作指引

#### deploy-remote.sh（远程部署）
- ✅ 支持 tar 文件自动加载
- ✅ 支持指定镜像名称部署
- ✅ 自动备份现有容器
- ✅ 健康检查机制
- ✅ 失败自动回滚
- ✅ 交互式清理旧版本

#### deploy-full.sh（一键部署）
- ✅ 集成构建、传输、部署全流程
- ✅ 自动 SSH 连接和文件传输
- ✅ 服务器环境自动配置
- ✅ 部署结果验证
- ✅ 支持多服务器部署

### 高级用法

#### 自定义端口部署
```bash
# 部署到指定端口
PORT=8080 ./deploy-remote.sh company-website:prod-xxx
```

#### 多服务器批量部署
```bash
# 部署到多个服务器
for server in server1.com server2.com; do
    SERVER_HOST=$server ./deploy-full.sh
done
```

#### 离线部署包制作
```bash
# 制作完整的离线部署包
./build-local.sh
tar -czf offline-deploy-package.tar.gz \
  company-website-*.tar \
  deploy-remote.sh \
  docker/nginx.conf \
  MANUAL_DEPLOY_GUIDE.md
```

### 故障排查

#### 传输失败
```bash
# 检查 SSH 连接
ssh user@server 'echo "SSH连接正常"'

# 检查磁盘空间
ssh user@server 'df -h'

# 检查网络带宽
scp -l 8192 file.tar user@server:/path/  # 限制传输速度
```

#### 部署失败
```bash
# 检查镜像文件
ssh user@server 'docker images | grep company-website'

# 检查容器状态
ssh user@server 'docker ps -a | grep company-website'

# 查看部署日志
ssh user@server 'docker logs company-website'
```

#### 服务无法访问
```bash
# 检查端口监听
ssh user@server 'netstat -tlnp | grep :80'

# 测试本地访问
ssh user@server 'curl -I http://localhost'

# 检查防火墙
ssh user@server 'iptables -L -n'
```

### 安全考虑

#### SSH 安全
- 使用 SSH 密钥认证
- 禁用密码登录
- 配置防火墙规则
- 使用非标准端口

#### 传输安全
- 使用 SCP/SFTP 加密传输
- 验证文件完整性
- 及时清理临时文件
- 限制传输权限

#### 部署安全
- 容器运行权限控制
- 端口访问限制
- 镜像安全扫描
- 定期更新基础镜像

### 性能优化

#### 构建优化
- 使用构建缓存
- 多阶段构建
- 基础镜像选择
- 依赖项缓存

#### 传输优化
- 压缩镜像文件
- 增量传输
- 断点续传
- 带宽限制

#### 部署优化
- 蓝绿部署
- 滚动更新
- 健康检查
- 自动回滚

### 维护建议

#### 日常维护
- 定期清理旧镜像
- 监控容器运行状态
- 备份重要数据
- 更新安全补丁

#### 版本管理
- 使用语义化版本号
- 保留历史版本
- 记录部署日志
- 建立回滚机制

#### 监控告警
- 容器资源监控
- 服务可用性检查
- 错误日志收集
- 异常告警通知