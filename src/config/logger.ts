import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { createLogger, format, transports } from 'winston';

import { env } from './globals';

const logDir = 'logs';

// Create the log directory if it does not exist
if (!existsSync(logDir)) {
	mkdirSync(logDir);
}

const filename = join(logDir, 'error.log');

export const logger = createLogger({
	format: format.combine(
		format.timestamp({
			format: 'YYYY-MM-DD HH:mm:ss'
		}),
		format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
	),
	level: env.NODE_ENV === 'development' ? 'debug' : 'info',
	transports: [
		new transports.Console({
			format: format.combine(
				format.colorize(),
				format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
			),
			level: 'info'
		}),
		new transports.File({ filename, level: 'error' })
	]
});
