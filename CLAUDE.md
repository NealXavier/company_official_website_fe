# 项目代码规范指南

## Git 提交规范

### 提交消息格式
使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### 类型说明
- `feat`: 新功能
- `fix`: 修复bug
- `docs`: 文档更新
- `style`: 代码格式调整（不影响功能）
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

### 作用域(Scope)
- `banner`: 轮播图组件
- `api`: API接口
- `config`: 配置文件
- `ui`: UI界面
- `utils`: 工具函数

### 示例
```
fix(banner): 修复轮播图图片URL显示问题

- 添加getFullImageUrl方法处理相对路径转完整URL
- 优化:key绑定使用item.id避免DOM复用问题
- 区分开发/生产环境baseURL配置

Closes #123
```

## 分支命名规范

### 分支类型
- `feature/功能描述`: 新功能开发
- `fix/问题描述`: Bug修复
- `hotfix/紧急修复`: 紧急修复
- `refactor/重构描述`: 代码重构

### 示例
- `feature/add-user-authentication`
- `fix/banner-image-urls`
- `hotfix/security-vulnerability`

## Vue.js 代码规范

### 组件命名
- 使用 PascalCase 命名组件文件
- 使用 kebab-case 命名组件标签

### Props 定义
```javascript
props: {
  title: {
    type: String,
    required: true,
    default: ''
  }
}
```

### 方法命名
- 使用动词开头：`getData()`, `handleClick()`, `validateInput()`
- 事件处理使用 `handle` 前缀

### 样式规范
- 使用 scoped CSS 避免样式污染
- 使用 BEM 命名规范
- 移动端优先的响应式设计

## API 调用规范

### 错误处理
- 使用 try-catch 包裹异步操作
- 提供友好的错误提示
- 记录错误日志

### URL处理
- 使用完整URL路径
- 区分开发/生产环境配置
- 统一处理URL编码

## 文件结构规范

```
src/
├── api/           # API接口定义
├── assets/        # 静态资源
├── components/    # 公共组件
├── views/         # 页面组件
├── utils/         # 工具函数
├── router/        # 路由配置
└── store/         # 状态管理
```

## 开发环境配置

### 后端地址配置
- 开发环境：`http://127.0.0.1:8088`
- 生产环境：`http://81.71.17.188:8088`

### 代理配置
在 `vue.config.js` 中配置代理：
```javascript
proxy: {
  '/api/': {
    target: 'http://127.0.0.1:8088',
    changeOrigin: true,
    pathRewrite: {
      '^/api/': ''
    }
  }
}
```

## 调试规范

### 日志等级
- `console.log`: 普通调试信息
- `console.warn`: 警告信息
- `console.error`: 错误信息

### 调试技巧
- 使用详细的调试输出
- 在生产环境移除调试代码
- 使用浏览器开发者工具