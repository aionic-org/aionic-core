import { Router } from 'express'

// Auth routes
import { AuthRoutes } from './auth/routes'

// Config routes
import { ConfigRoutes } from './config/routes'

// User routes
import { UserInvitationRoutes } from './user/invitation/routes'
import { UserRoleRoutes } from './user/role/routes'
import { UserRoutes } from './user/routes'

// Task routes
import { SearchRoutes } from './search/routes'
import { TaskPriorityRoutes } from './task/priority/routes'
import { TaskRoutes } from './task/routes'
import { TaskStatusRoutes } from './task/status/routes'

/**
 * Init Express API routes
 *
 * @param {Router} router
 * @returns {void}
 */
export function initModuleRoutes(router: Router): void {
  router.use('/api/auth', new AuthRoutes().router)

  // Config
  router.use('/api/config', new ConfigRoutes().router)

  // User
  router.use('/api/user', new UserRoutes().router)
  router.use('/api/userInvitation', new UserInvitationRoutes().router)
  router.use('/api/userRole', new UserRoleRoutes().router)

  // Task
  router.use('/api/task', new TaskRoutes().router)
  router.use('/api/taskPriority', new TaskPriorityRoutes().router)
  router.use('/api/taskStatus', new TaskStatusRoutes().router)

  // Search
  router.use('/api/search', new SearchRoutes().router)
}
