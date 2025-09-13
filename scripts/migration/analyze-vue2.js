const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

// Vue2 API使用分析
function analyzeVue2API(filePath) {
  const code = fs.readFileSync(filePath, 'utf8');

  // 如果是.vue文件，提取script部分
  let scriptCode = code;
  if (filePath.endsWith('.vue')) {
    const scriptMatch = code.match(/<script[^>]*>([\s\S]*?)<\/script>/);
    if (scriptMatch) {
      scriptCode = scriptMatch[1];
    } else {
      return { error: "No script section found in Vue file" };
    }
  }

  const ast = parser.parse(scriptCode, {
    sourceType: 'module',
    plugins: ['jsx', 'decorators-legacy', 'dynamic-import', 'typescript']
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
