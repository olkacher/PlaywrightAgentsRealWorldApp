// test-config.ts

/**
 * Test Configuration and Constants 
*/

export const testConfig = {
  // Test Credentials
  testUsers: {
    validUser: {
      username: 'Solon_Robel60',
      password: 's3cret'
    },
    invalidUser: {
      username: 'invalid_user',
      password: 'wrong_pass'
    }
  },

  // URLs
  baseURL: 'http://frontend-ta-realworldapp.apps.os-prod.lab.proficom.de/',

  // Timeouts (in ms)
  timeouts: {
    short: 5000,
    medium: 10000,
    long: 30000
  },

  // Retry counts
  retries: {
    api: 3,
    ui: 2
  },

  // Wait times
  waits: {
    pageLoad: 5000,
    element: 5000,
    navigation: 10000,
    debounce: 1000
  }
};