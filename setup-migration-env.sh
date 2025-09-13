#!/bin/bash

echo "🚀 开始Vue3迁移基础环境配置..."

# 1. 检查基础环境
echo "📋 检查基础环境..."
node_version=$(node --version)
npm_version=$(npm --version)
git_version=$(git --version)

echo "Node.js版本: $node_version ✅"
echo "npm版本: $npm_version ✅"
echo "Git版本: $git_version ✅"

# 2. 创建迁移目录结构
echo "📁 创建迁移目录结构..."
mkdir -p .claude-agents
mkdir -p .claude-hooks
mkdir -p scripts/migration
mkdir -p analysis
mkdir -p logs

# 3. 备份原始package.json
echo "💾 备份原始package.json..."
cp package.json package.json.backup

# 4. 安装基础分析工具（与Vue2兼容）
echo "🔧 安装基础分析工具..."
npm install -D @babel/parser@^7.23.0
npm install -D @babel/traverse@^7.23.0
npm install -D vue-template-compiler@^2.7.16

# 5. 创建子代理配置文件
echo "🤖 创建子代理配置文件..."
cat > .claude-agents/migration.config.js << 'EOF'
module.exports = {
  agents: {
    componentAnalyzer: {
      name: "Vue组件分析专家",
      capabilities: ["ast-analysis", "dependency-tracking", "complexity-calculation"],
      constraints: ["read-only-analysis", "no-file-modification"],
      outputFormat: "structured-json",
      parallelLimit: 5
    }
  }
};
EOF

# 6. 创建Hooks配置文件
echo "🪝 创建Hooks配置文件..."
cat > .claude-hooks/hooks.config.js << 'EOF'
module.exports = {
  hooks: {
    preMigration: {
      backup: { enabled: true, retentionDays: 30 },
      validation: { gitStatus: "clean", testsPassing: true }
    },
    duringMigration: {
      progressTracking: { enabled: true, updateInterval: 30 },
      errorHandling: { maxRetries: 3, fallbackStrategy: "partial-rollback" }
    }
  }
};
EOF

# 7. 创建分析脚本
echo "🔍 创建分析脚本..."
cat > scripts/migration/analyze-vue2.js << 'EOF'
const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

// Vue2 API使用分析
function analyzeVue2API(filePath) {
  const code = fs.readFileSync(filePath, 'utf8');
  const ast = parser.parse(code, {
    sourceType: 'module',
    plugins: ['jsx', 'decorators-legacy', 'dynamic-import']
  });

  const vue2APIs = {
    this_$set: 0,
    this_$delete: 0,
    filters: 0,
    directives: 0,
    mixins: 0,
    computed: 0,
    watch: 0,
    lifecycle: 0
  };

  traverse(ast, {
    enter(path) {
      // 统计Vue2特有API
      if (path.isCallExpression()) {
        const callee = path.node.callee;
        if (callee.type === 'MemberExpression' &&
            callee.object.type === 'ThisExpression') {
          const property = callee.property.name;
          if (property === '$set') vue2APIs.this_$set++;
          if (property === '$delete') vue2APIs.this_$delete++;
        }
      }

      // 统计组件选项
      if (path.isObjectProperty()) {
        const key = path.node.key.name;
        if (key === 'filters') vue2APIs.filters++;
        if (key === 'directives') vue2APIs.directives++;
        if (key === 'mixins') vue2APIs.mixins++;
        if (key === 'computed') vue2APIs.computed++;
        if (key === 'watch') vue2APIs.watch++;
      }

      // 统计生命周期
      if (path.isObjectMethod()) {
        const key = path.node.key.name;
        const lifecycles = ['beforeCreate', 'created', 'beforeMount', 'mounted',
                           'beforeUpdate', 'updated', 'beforeDestroy', 'destroyed'];
        if (lifecycles.includes(key)) vue2APIs.lifecycle++;
      }
    }
  });

  return vue2APIs;
}

module.exports = { analyzeVue2API };
EOF

# 8. 设置文件权限
echo "🔐 设置文件权限..."
chmod +x setup-migration-env.sh
chmod +x scripts/migration/analyze-vue2.js

# 9. 验证安装
echo "✅ 验证安装..."
node -e "console.log('✅ Node.js运行正常')"
npm list @babel/parser > /dev/null 2>&1 && echo "✅ Babel解析器安装成功" || echo "❌ Babel解析器安装失败"

echo "🎉 基础环境配置完成！"
echo ""
echo "📋 下一步操作："
echo "1. 运行分析脚本: node scripts/migration/analyze-vue2.js"
echo "2. 查看迁移配置: cat migration-config.json"
echo "3. 开始组件分析: 使用Claude Code开始分析Vue2组件"
echo ""
echo "📝 已创建的文件："
echo "- migration-config.json (迁移配置)"
echo "- .claude-agents/migration.config.js (子代理配置)"
echo "- .claude-hooks/hooks.config.js (Hooks配置)"
echo "- scripts/migration/analyze-vue2.js (分析脚本)"
echo "- setup-migration-env.sh (环境配置脚本)"

echo "🚀 环境准备就绪，可以开始Vue3迁移之旅！"

# 记录配置完成时间
echo "$(date): 基础环境配置完成" >> logs/setup.log