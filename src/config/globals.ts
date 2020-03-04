import { readFileSync } from 'fs';

const config = JSON.parse(readFileSync('./aionic-config.json', 'utf-8'));

// Environment variables & sensitive data imported from .env file
export const env = {
	CACHE_TTL: 3600,
	GITHUB: {
		id: process.env.GH_CLIENT_ID,
		secret: process.env.GH_CLIENT_SECRET
	},
	NODE_ENV: process.env.NODE_ENV || 'development',
	NODE_PORT: process.env.NODE_PORT || 3000,
	REDIS: {
		host: process.env.REDIS_HOST,
		pass: process.env.REDIS_PASS
	},
	SMTP: {
		auth: {
			pass: process.env.SMTP_PASSWORD || '',
			user: process.env.SMTP_USERNAME || ''
		},
		host: process.env.SMTP_HOST || '',
		port: process.env.SMTP_PORT || 587,
		tls: {
			rejectUnauthorized: false
		}
	}
};

export enum ApplicationSymbols {
	backend,
	core,
	milestone
}

// Company configuration
export const company = {
	email: config.company['email'],
	name: config.company['name'],
	website: config.company['website']
};

// Aionic configuration
export const applications = {
	[ApplicationSymbols.backend]: {
		domain: process.env.AIONIC_BACKEND_DOMAIN || config.aionic.applications['aionic-backend']['domain'],
		email: config.aionic.applications['aionic-backend']['email'],
		name: config.aionic.applications['aionic-backend']['name']
	},

	[ApplicationSymbols.core]: {
		domain: process.env.AIONIC_CORE_DOMAIN || config.aionic.applications['aionic-core']['domain'],
		email: config.aionic.applications['aionic-core']['email'],
		name: config.aionic.applications['aionic-core']['name']
	},

	[ApplicationSymbols.milestone]: {
		domain: process.env.AIONIC_MILESTONE_DOMAIN || config.aionic.applications['aionic-milestone']['domain'],
		email: config.aionic.applications['aionic-milestone']['email'],
		name: config.aionic.applications['aionic-milestone']['name']
	}
};
