import express from 'express';

import { registerApiRoutes } from '../api/routes';

export class ExpressServer {
	private readonly _app: express.Application = express();

	public constructor() {
		registerApiRoutes(this._app);
	}

	/**
	 * Get Express app
	 *
	 * @returns {express.Application} Returns Express app
	 */
	public get app(): express.Application {
		return this._app;
	}
}
