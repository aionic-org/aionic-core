// Environment variables imported from .env file
export const env = {
  CACHE_TTL: 3600,
  HP: {
    DOMAIN: process.env.HP_DOMAIN
  },
  NODE_ENV: process.env.NODE_ENV || 'development',
  NODE_PORT: process.env.NODE_PORT || 3000,
  SMTP: {
    host: process.env.SMTP_HOST || '',
    password: process.env.SMTP_PASSWORD || '',
    port: process.env.SMTP_PORT || '',
    username: process.env.SMTP_USERNAME || ''
  }
}

// Mail addresses
export const mails = {
  service: 'service@aionic.com'
}
