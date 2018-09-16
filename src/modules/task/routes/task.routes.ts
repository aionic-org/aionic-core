import { TaskDetailsRoutes } from './task.details.routes'

export class TaskRoutes extends TaskDetailsRoutes {
  public constructor(defaultStrategy?: string) {
    super(defaultStrategy)
    this.initRoutes()
  }

  private initRoutes(): void {
    this.router.get(
      '/status',
      this.authSerivce.isAuthorized(),
      this.authSerivce.hasPermission('taskStatus', 'read'),
      this.controller.readTaskStatus
    )

    this.router.get(
      '/user/:userID/status/:statusID',
      this.authSerivce.isAuthorized(),
      this.authSerivce.hasPermission('task', 'read'),
      this.controller.readUserTasksByStatus
    )
  }
}
