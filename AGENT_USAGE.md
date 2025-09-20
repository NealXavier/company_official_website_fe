# Claude Code 子代理使用指南

## 1. 子代理配置说明

项目中已配置了4个专项子代理：
- **componentAnalyzer**: Vue组件分析专家
- **codeTransformer**: Vue3代码转换专家
- **testValidator**: 测试验证专家
- **performanceOptimizer**: 性能优化专家

## 2. 启动所有子代理

```bash
# 给脚本添加执行权限
chmod +x scripts/start-agents.sh

# 启动所有子代理
./scripts/start-agents.sh
```

## 3. 单独使用特定子代理

### 组件分析代理
```bash
# 分析所有Vue组件
claude --agent componentAnalyzer --target "src/**/*.vue" --output analysis-results.json

# 分析特定目录的组件复杂度
claude --agent componentAnalyzer --target "src/views/front/**/*.vue" --output front-components.json
```

### 代码转换代理
```bash
# 转换特定组件
claude --agent codeTransformer --target "src/views/front/About.vue" --output about-vue3.vue

# 批量转换组件
claude --agent codeTransformer --target "src/components/*.vue" --batch-mode
```

### 测试验证代理
```bash
# 生成并运行单元测试
claude --agent testValidator --target "src/components/Search/index.vue" --framework vitest

# 运行集成测试
claude --agent testValidator --target "src/views/front/*.vue" --type integration
```

### 性能优化代理
```bash
# 分析打包体积
claude --agent performanceOptimizer --mode bundle-analysis --output bundle-report.json

# 内存性能分析
claude --agent performanceOptimizer --mode memory-profiling --target "src/views/front/Home.vue"
```

## 4. 并行处理示例

```bash
# 同时分析多个目录
claude --agent componentAnalyzer --target "src/components/*.vue" --output components.json &
claude --agent componentAnalyzer --target "src/views/*.vue" --output views.json &
wait
```

## 5. 结果文件说明

- `analysis-results.json`: 组件分析结果，包含复杂度、依赖关系等
- `transformation-results.json`: 代码转换结果
- `test-results.json`: 测试验证结果
- `optimization-results.json`: 性能优化建议

## 6. 注意事项

1. 确保已安装Claude Code CLI工具
2. 确保项目根目录下有正确的.agent配置文件
3. 部分子代理可能需要额外的依赖包
4. 并行处理时注意系统资源使用情况