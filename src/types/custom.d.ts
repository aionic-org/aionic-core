import { ApplicationSymbols } from '@config/globals';

declare global {
	namespace Express {
		export interface Request {
			client: ApplicationSymbols;
		}
	}
}
