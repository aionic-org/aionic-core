import { readFile, unlink, readdir, stat } from 'fs';
import { resolve } from 'path';

import { logger } from '@util/logger';

/**
 * FilesystemService
 *
 * Service for filesystem functions
 */
export class FilesystemService {
	public static logsFilePath: string = resolve('logs/');
	public static errorLogFilePath: string = resolve('logs/error.log');

	/**
	 * Get filenames in folder
	 *
	 * @param path Path to read filenames from
	 * @returns Returns array of filenames
	 */
	public static readFolder(path: string): Promise<string[]> {
		return new Promise((resolve, reject) => {
			stat(path, (err: NodeJS.ErrnoException | null) => {
				if (err) {
					logger.error(`${path} does not exists!`);
					reject(err);
				}

				return readdir(path, (err, files) => {
					if (err) {
						reject(err);
					}
					resolve(files);
				});
			});
		});
	}

	/**
	 * Read file content
	 *
	 * @param path Path to read file from
	 * @param encoding File encoding
	 * @returns Returns file content
	 */
	public static readFile(path: string, encoding: string = 'utf8'): Promise<string> {
		return new Promise((resolve, reject) => {
			stat(path, (err: NodeJS.ErrnoException | null) => {
				if (err) {
					logger.error(`${path} does not exists!`);
					reject(err);
				}

				return readFile(path, encoding, (err, data) => {
					if (err) {
						reject(err);
					}
					resolve(data);
				});
			});
		});
	}

	/**
	 * Delete file
	 *
	 * @param path Path to delete file from
	 * @returns
	 */
	public static deleteFile(path: string): Promise<string | undefined> {
		return new Promise((resolve, reject) => {
			stat(path, (err: NodeJS.ErrnoException | null) => {
				if (err) {
					logger.error(`${path} does not exists!`);
					reject(err);
				}

				return unlink(path, (err) => {
					if (err) {
						reject(err);
					}
					resolve();
				});
			});
		});
	}

	/**
	 * Read error log file
	 *
	 * @returns Returns error log content
	 */
	public static readErrorLog(): Promise<string> {
		return FilesystemService.readFile(FilesystemService.errorLogFilePath);
	}
}
