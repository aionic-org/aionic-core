import { Router } from 'express'

// auth routes
import { AuthRoutes } from './auth/routes'

// config routes
import { ConfigRoutes } from './config/routes'

// user routes
import { UserRoutes } from './user/routes'
import { UserInvitationRoutes } from './user/userInvitation/routes'
import { UserRoleRoutes } from './user/userRole/routes'

// task routes
import { SearchRoutes } from './search/routes'
import { TaskRoutes } from './task/routes'
import { TaskPriorityRoutes } from './task/taskPriority/routes'
import { TaskStatusRoutes } from './task/taskStatus/routes'

export function initModuleRoutes(router: Router): void {
  // api endpoints - pass optional passport default strategy
  router.use('/api/auth', new AuthRoutes().router)

  // config
  router.use('/api/config', new ConfigRoutes().router)

  // user
  router.use('/api/user', new UserRoutes().router)
  router.use('/api/userInvitation', new UserInvitationRoutes().router)
  router.use('/api/userRole', new UserRoleRoutes().router)

  // task
  router.use('/api/task', new TaskRoutes().router)
  router.use('/api/taskPriority', new TaskPriorityRoutes().router)
  router.use('/api/taskStatus', new TaskStatusRoutes().router)

  // search
  router.use('/api/search', new SearchRoutes().router)
}
