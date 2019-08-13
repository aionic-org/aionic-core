// Environment variables imported from .env file
export const env = {
	CACHE_TTL: 3600,
	GITHUB: {
		id: process.env.GH_CLIENT_ID,
		secret: process.env.GH_CLIENT_SECRET
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

// Aionic application details
export const apps = {
	core: {
		name: 'Aionic Core',
		email: 'core@aionic-apps.com',
		domain: process.env.AIC_CORE_DOMAIN
	},
	milestone: {
		name: 'Aionic Milestone',
		email: 'milestone@aionic-apps.com',
		domain: process.env.AIC_MILESTONE_DOMAIN
	}
};

// Mail addresses
export const mails = {
	service: 'service@aionic-apps.com'
};
