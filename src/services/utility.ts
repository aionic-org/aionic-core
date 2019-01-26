import { logger } from '../config/logger'

export class UtilityService {
  /**
   * Error handler
   *
   * @param {Error} err
   */
  public static handleError(err: Error) {
    logger.error(err)
  }
}
