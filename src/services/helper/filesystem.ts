import { exists, readFile, unlink, readdir } from 'fs';
import { resolve } from 'path';

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
			exists(path, (exists: boolean) => {
				if (exists) {
					return readdir(path, (err, files) => {
						if (err) {
							reject(err);
						}
						resolve(files);
					});
				}
				reject('Folder does not exist!');
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
			exists(path, (exists: boolean) => {
				if (exists) {
					return readFile(path, encoding, (err, data) => {
						if (err) {
							reject(err);
						}
						resolve(data);
					});
				}
				reject('File does not exist!');
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
			exists(path, (exists: boolean) => {
				if (exists) {
					return unlink(path, (err) => {
						if (err) {
							reject(err);
						}
						resolve();
					});
				}
				reject('File does not exist!');
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
