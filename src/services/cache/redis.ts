import { createClient, RedisClient, RetryStrategyOptions } from 'redis';

import { env } from '@config/globals';
import { logger } from '@util/logger';

export class RedisService {
	public static client: RedisClient = createClient({
		...env.REDIS,
		retry_strategy: RedisService.retryStrategy
	}).on('error', (err: Error) => {
		logger.error(err.message);
	});

	/**
	 * Redis connection strategy
	 *
	 * @param options
	 * @returns Error or time until next reconnect
	 */
	private static retryStrategy(options: RetryStrategyOptions): number | Error {
		if (options.error && options.error.code === 'ECONNREFUSED') {
			// End reconnecting on a specific error and flush all commands with
			// a individual error
			return new Error('The server refused the connection');
		}

		if (options.attempt > 10) {
			// End reconnecting with built in error
			return new Error('Retry attempts exhausted');
		}

		// reconnect after
		return Math.min(options.attempt * 100, 3000);
	}
}
