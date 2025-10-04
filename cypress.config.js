const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://opensource-demo.orangehrmlive.com', 

    supportFile: false,
    
    setupNodeEvents(on, config) {

    },
  },
});