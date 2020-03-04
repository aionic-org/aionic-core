import { bind } from 'decko';
import { resolve } from 'path';
import { NextFunction, Request, Response } from 'express';

import { NodeCacheService } from '@services/cache/node-cache';
import { FilesystemService } from '@services/helper/filesystem';

export class ConfigController {
	private readonly cacheService: NodeCacheService = new NodeCacheService();

	/**
	 * Caches
	 */

	/**
	 * Get cache keys and stats
	 *
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns Returns HTTP response
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
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns Returns HTTP response
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
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns Returns HTTP response
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
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns Returns HTTP response
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
	 * Get name of logfiles
	 *
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns Returns HTTP response
	 */
	@bind
	public async getLogfiles(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const logfiles: string[] = await FilesystemService.readFolder(FilesystemService.logsFilePath);

			return res.json({ status: res.statusCode, data: logfiles });
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * Read logfile content
	 *
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns Returns HTTP response
	 */
	@bind
	public async readLogfile(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const { logfile } = req.params;

			if (!logfile) {
				return res.status(400).json({ status: 400, error: 'Invalid request' });
			}

			const logContent: string = await FilesystemService.readFile(resolve(FilesystemService.logsFilePath, logfile));

			return res.json({ status: res.statusCode, data: logContent });
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * Delete logfile
	 *
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns Returns HTTP response
	 */
	@bind
	public async deleteLogfile(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const { logfile } = req.params;

			if (!logfile) {
				return res.status(400).json({ status: 400, error: 'Invalid request' });
			}

			await FilesystemService.deleteFile(resolve(FilesystemService.logsFilePath, logfile));

			return res.status(204).json({ status: 204 });
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * Download logfile
	 *
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns Returns HTTP response
	 */
	@bind
	public downloadLogfile(req: Request, res: Response, next: NextFunction): Response | void {
		try {
			const { logfile } = req.params;

			if (!logfile) {
				return res.status(400).json({ status: 400, error: 'Invalid request' });
			}

			return res.download(resolve(FilesystemService.logsFilePath, logfile));
		} catch (err) {
			return next(err);
		}
	}
}
