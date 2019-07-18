import { Router } from 'express';

import { AuthService, PassportStrategy } from '@services/auth';

import { ScratchpadController } from './controller';

export class TaskScratchpadRoutes {
  protected readonly controller: ScratchpadController = new ScratchpadController();
  protected authSerivce: AuthService;
  private _router: Router = Router({ mergeParams: true });

  public constructor(defaultStrategy?: PassportStrategy) {
    this.authSerivce = new AuthService(defaultStrategy);
    this.initRoutes();
  }

  public get router(): Router {
    return this._router;
  }

  private initRoutes(): void {
    this.router.get(
      '/scratchpads/users/:userId',
      this.authSerivce.isAuthorized(),
      this.authSerivce.hasPermission('taskScratchpad', 'read'),
      this.controller.readTaskScratchpadByUser
    );
    this.router.post(
      '/scratchpads/users/:userId',
      this.authSerivce.isAuthorized(),
      this.authSerivce.hasPermission('taskScratchpad', 'read'),
      this.controller.createOrUpdateTaskScratchpad
    );
  }
}
