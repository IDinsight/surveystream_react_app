const { defineConfig } = require('cypress');

module.exports = defineConfig({
  reporter: 'junit',
  reporterOptions: {
    mochaFile: 'cypress/results/output.xml',
  },
  e2e: {
    specPattern: 'e2e/integration',
    baseUrl: 'http://localhost:3000', //this works for local testing
    // baseUrl: 'http://host.docker.internal:3000', // this works for docker container testing
  },
});
