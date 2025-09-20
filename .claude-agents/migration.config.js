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
