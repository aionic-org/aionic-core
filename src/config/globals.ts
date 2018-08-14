// sensitive data
export { smtp } from './private/smtp'

// global variable
export const variables = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000
}

// environment variables
export const env = {
  production: {
    url: 'https://www.aionic.app',
    port: variables.port
  },
  development: {
    url: 'https://test.aionic.app',
    port: variables.port
  }
}

// mail addresses
export const mails = {
  service: 'service@aionic.com'
}
