// Environment variables imported from .env file
export const env = {
	CACHE_TTL: 3600,
	GITHUB: {
		id: process.env.GH_CLIENT_ID,
		secret: process.env.GH_CLIENT_SECRET
	},
	HP: {
		DOMAIN: process.env.HP_DOMAIN
	},
	NODE_ENV: process.env.NODE_ENV || 'development',
	NODE_PORT: process.env.NODE_PORT || process.env.PORT || 3000,
	SMTP: {
		auth: {
			pass: process.env.SMTP_PASSWORD || '',
			user: process.env.SMTP_USERNAME || ''
		},
		host: process.env.SMTP_HOST || '',
		port: process.env.SMTP_PORT || '',
		tls: {
			rejectUnauthorized: false
		}
	}
};

// Mail addresses
export const mails = {
	service: 'service@aionic.app'
};
