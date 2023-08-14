const { defineConfig } = require('cypress');

module.exports = defineConfig({
  reporter: 'junit',
  reporterOptions: {
    mochaFile: 'cypress/results/output.xml',
  },
  e2e: {
    // specPattern: 'e2e/integration',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    // baseUrl: 'http://localhost:3000',
    baseUrl: 'http://host.docker.internal:3000',
  },
});
