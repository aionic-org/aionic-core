import { bind } from 'decko';
import { resolve } from 'path';
import { NextFunction, Request, Response } from 'express';

import { CacheService } from '@services/cache';
import { FilesystemService } from '@services/helper/filesystem';

export class ConfigController {
	private readonly cacheService: CacheService = new CacheService();

	/**
	 * Caches
	 */

	/**
	 * Get cache keys and stats
	 *
	 * @param {Request} req
	 * @param {Response} res
	 * @param {NextFunction} next
	 * @returns {Promise<Response | void>} Returns HTTP response
	 */
	@bind
	public async getCachesMetadata(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const keys = await this.cacheService.getKeys();
			const stats = await this.cacheService.getStats();

			return res.json({ status: res.statusCode, data: { keys, stats } });
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * Delete complete cache
	 *
	 * @param {Request} req
	 * @param {Response} res
	 * @param {NextFunction} next
	 * @returns {Promise<Response | void>} Returns HTTP response
	 */
	@bind
	public async deleteCachesMetadata(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			await this.cacheService.flush();

			return res.json({ status: res.statusCode, data: 'cache cleared' });
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * Get cache key data
	 *
	 * @param {Request} req
	 * @param {Response} res
	 * @param {NextFunction} next
	 * @returns {Promise<Response | void>} Returns HTTP response
	 */
	@bind
	public async getCacheKeyData(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const { key } = req.params;

			if (!key) {
				return res.status(400).json({ status: 400, error: 'Invalid request' });
			}

			const data = await this.cacheService.get(key);

			return res.json({ data, status: res.statusCode });
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * Delete cache key data
	 *
	 * @param {Request} req
	 * @param {Response} res
	 * @param {NextFunction} next
	 * @returns {Promise<Response | void>} Returns HTTP response
	 */
	@bind
	public async deleteCacheKeyData(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const { key } = req.params;

			if (!key) {
				return res.status(400).json({ status: 400, error: 'Invalid request' });
			}

			await this.cacheService.delete(key);

			return res.status(204).json({ status: 204 });
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * Logs
	 */

	/**
	 * @param {Request} req
	 * @param {Response} res
	 * @param {NextFunction} next
	 * @returns {Promise<Response | void>} Returns HTTP response
	 */
	@bind
	public async getLogFiles(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const logFiles: string[] = await FilesystemService.readFolder(FilesystemService.logsFilePath);

			return res.json({ status: res.statusCode, data: logFiles });
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * @param {Request} req
	 * @param {Response} res
	 * @param {NextFunction} next
	 * @returns {Promise<Response | void>} Returns HTTP response
	 */
	@bind
	public async readLogFile(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const { logname } = req.params;

			if (!logname) {
				return res.status(400).json({ status: 400, error: 'Invalid request' });
			}

			const logContent: string = await FilesystemService.readFile(resolve(FilesystemService.logsFilePath, logname));

			return res.json({ status: res.statusCode, data: logContent });
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * @param {Request} req
	 * @param {Response} res
	 * @param {NextFunction} next
	 * @returns {Promise<Response | void>} Returns HTTP response
	 */
	@bind
	public async deleteLogFile(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const { logname } = req.params;

			if (!logname) {
				return res.status(400).json({ status: 400, error: 'Invalid request' });
			}

			await FilesystemService.deleteFile(resolve(FilesystemService.logsFilePath, logname));

			return res.status(204).json({ status: 204 });
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * @param {Request} req
	 * @param {Response} res
	 * @param {NextFunction} next
	 * @returns {Promise<Response | void>} Returns HTTP response
	 */
	@bind
	public downloadLogFile(req: Request, res: Response, next: NextFunction): Response | void {
		try {
			const { logname } = req.params;

			if (!logname) {
				return res.status(400).json({ status: 400, error: 'Invalid request' });
			}

			return res.download(resolve(FilesystemService.logsFilePath, logname));
		} catch (err) {
			return next(err);
		}
	}
}
