import { Clients } from '@config/globals';

declare global {
	namespace Express {
		export interface Request {
			client: Clients;
		}
	}
}
