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
