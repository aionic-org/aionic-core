import { Router } from 'express';

import { AuthService, PassportStrategy } from '@services/auth';

import { ProjectCommentRoutes } from './_child/comment/routes';
import { ProjectController } from './controller';

export class ProjectRoutes {
  private readonly controller: ProjectController = new ProjectController();
  private authSerivce: AuthService;
  private _router: Router = Router();

  public constructor(defaultStrategy?: PassportStrategy) {
    this.authSerivce = new AuthService(defaultStrategy);

    this.initRoutes();
    this.initChildRoutes(defaultStrategy);
  }

  public get router(): Router {
    return this._router;
  }

  private initRoutes(): void {
    this.router.get(
      '/',
      this.authSerivce.isAuthorized(),
      this.authSerivce.hasPermission('project', 'read'),
      this.controller.readProjects
    );

    this.router.get(
      '/:projectId',
      this.authSerivce.isAuthorized(),
      this.authSerivce.hasPermission('project', 'read'),
      this.controller.readProject
    );

    this.router.post(
      '/',
      this.authSerivce.isAuthorized(),
      this.authSerivce.hasPermission('project', 'create'),
      this.controller.createProject
    );

    this.router.put(
      '/:projectId',
      this.authSerivce.isAuthorized(),
      this.authSerivce.hasPermission('project', 'update'),
      this.controller.updateProject
    );

    this.router.delete(
      '/:projectId',
      this.authSerivce.isAuthorized(),
      this.authSerivce.hasPermission('project', 'delete'),
      this.controller.deleteProject
    );
  }

  private initChildRoutes(defaultStrategy?: PassportStrategy): void {
    this.router.use('/:projectId', new ProjectCommentRoutes(defaultStrategy).router);
  }
}
