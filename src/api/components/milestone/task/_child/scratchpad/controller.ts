import { bind } from 'decko';
import { NextFunction, Request, Response } from 'express';
import { getManager, Repository } from 'typeorm';

import { TaskScratchpad } from '@milestone/task/_child/scratchpad/model';

export class ScratchpadController {
  private readonly taskScratchpadRepo: Repository<TaskScratchpad> = getManager().getRepository(
    'TaskScratchpad'
  );

  /**
   * Read scratchpad from a certain task by user from db
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {Promise<Response | void>} Returns HTTP response
   */
  @bind
  public async readTaskScratchpadByUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const { taskId, userId } = req.params;

      if (!taskId || !userId) {
        return res.status(400).json({ status: 400, error: 'Invalid request' });
      }

      const scratchpad: TaskScratchpad | undefined = await this.taskScratchpadRepo.findOne({
        where: {
          author: { id: userId },
          task: { id: taskId }
        }
      });

      return res.json({ status: res.statusCode, data: scratchpad });
    } catch (err) {
      return next(err);
    }
  }

  /**
   * Save or update if exists scratchpad to db
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {Promise<Response | void>} Returns HTTP response
   */
  @bind
  public async createOrUpdateTaskScratchpad(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      if (!req.body.scratchpad) {
        return res.status(400).json({ status: 400, error: 'Invalid request' });
      }

      const newScratchpad: TaskScratchpad = await this.taskScratchpadRepo.save(req.body.scratchpad);

      return res.json({ status: res.statusCode, data: newScratchpad });
    } catch (err) {
      return next(err);
    }
  }
}
