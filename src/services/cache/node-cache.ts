import nodeCache from 'node-cache';

import { env } from '@config/globals';

/**
 * TODO: Refactor
 */

export class NodeCacheService {
	private static cache: nodeCache = new nodeCache({ stdTTL: env.CACHE_TTL });

	/**
	 * Get cache value and set if not provided
	 *
	 * @param key Cache key
	 * @param storeFunction Function to execute if key is not set
	 * @param storeFunctionArgs Arguments for store function
	 * @returns Returns cache key value
	 */
	public get(
		key: string,
		storeFunction: Function = () => Promise.resolve(),
		storeFunctionArgs: any[] = []
	): Promise<any> {
		const value = NodeCacheService.cache.get(key);

		if (value) {
			return Promise.resolve(value);
		}

		return storeFunction(...storeFunctionArgs).then((res: any) => {
			NodeCacheService.cache.set(key, res);
			return res;
		});
	}

	public set(key: string | number, data: any) {
		NodeCacheService.cache.set(key, data);
	}

	public delete(keys: string | number) {
		NodeCacheService.cache.del(keys);
	}

	public getStats() {
		return NodeCacheService.cache.getStats();
	}

	public getKeys() {
		return NodeCacheService.cache.keys();
	}

	public flush() {
		NodeCacheService.cache.flushAll();
	}
}
