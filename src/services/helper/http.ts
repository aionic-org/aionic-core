import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

/**
 * HttpService
 *
 * Service for making HTTP requests
 */
export class HttpService {
	private axiosInstance: AxiosInstance;
	private _reqConfig: AxiosRequestConfig;

	public constructor(reqConfig?: AxiosRequestConfig) {
		this._reqConfig = reqConfig || {};
		this.axiosInstance = axios.create(this._reqConfig);
	}

	public get reqConfig(): AxiosRequestConfig {
		return this._reqConfig;
	}

	public set reqConfig(reqConfig: AxiosRequestConfig) {
		this._reqConfig = reqConfig;
	}

	/**
	 * Send custom request
	 *
	 * @param reqConfig Request config
	 * @returns Returns request
	 */
	public request(reqConfig: AxiosRequestConfig): Promise<any> {
		return new Promise((resolve, reject) => {
			this.axiosInstance
				.request(reqConfig)
				.then((res) => {
					resolve(res);
				})
				.catch((err) => {
					reject(err);
				});
		});
	}

	/**
	 * Fetch data from resource
	 *
	 * @param url URL to fetch data from
	 * @param params Request params
	 * @returns Returns request
	 */
	public fetchData(url: string, params?: object): Promise<any> {
		return new Promise((resolve, reject) => {
			this.axiosInstance
				.get(url, { ...this._reqConfig, params })
				.then((res) => {
					resolve(res);
				})
				.catch((err) => {
					reject(err);
				});
		});
	}

	/**
	 * Post data to resource
	 *
	 * @param url URL to post data to
	 * @param data Request data
	 */
	public postData(url: string, data: object): Promise<any> {
		return new Promise((resolve, reject) => {
			this.axiosInstance
				.post(url, { ...this._reqConfig, data })
				.then((res) => {
					resolve(res);
				})
				.catch((err) => {
					reject(err);
				});
		});
	}
}
