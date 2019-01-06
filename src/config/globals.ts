// sensitive data
export { smtp } from './private/smtp'

// global variable
export const variables = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000
}

// global environment variables
export const env_global = {
  production: { url: 'https://www.aionic.app', port: variables.port, cacheTTL: 3600 },
  development: { url: 'https://test.aionic.app', port: variables.port, cacheTTL: 120 }
}

// variables of current environment
export const env = env_global[variables.env]

// mail addresses
export const mails = {
  service: 'service@aionic.com'
}
