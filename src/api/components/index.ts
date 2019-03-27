import { Router } from 'express'

// Auth routes
import { AuthRoutes } from './auth/routes'

// Config routes
import { ConfigRoutes } from './config/routes'

// User routes
import { UserInvitationRoutes } from './user-invitation/routes'
import { UserRoleRoutes } from './user-role/routes'
import { UserRoutes } from './user/routes'

// Task routes
import { TaskPriorityRoutes } from './task-priority/routes'
import { TaskStatusRoutes } from './task-status/routes'
import { TaskRoutes } from './task/routes'

// Project routes
import { ProjectRoutes } from './project/routes'

// Git Routes
import { GitRoutes } from './git/routes'

// Announcement routes
import { AnnouncementRoutes } from './announcement/routes'

/**
 * Init Express api routes
 *
 * @param {Router} router
 * @param {string} prefix
 * @returns {void}
 */
export function registerApiRoutes(router: Router, prefix: string = ''): void {
  // Auth
  router.use(`${prefix}/auth`, new AuthRoutes().router)

  // Config
  router.use(`${prefix}/config`, new ConfigRoutes().router)

  // User
  router.use(`${prefix}/users`, new UserRoutes().router)
  router.use(`${prefix}/user-invitations`, new UserInvitationRoutes().router)
  router.use(`${prefix}/user-roles`, new UserRoleRoutes().router)

  // Task
  router.use(`${prefix}/tasks`, new TaskRoutes().router)
  router.use(`${prefix}/task-priorities`, new TaskPriorityRoutes().router)
  router.use(`${prefix}/task-status`, new TaskStatusRoutes().router)

  // Project
  router.use(`${prefix}/projects`, new ProjectRoutes().router)

  // Git
  router.use(`${prefix}/git`, new GitRoutes().router)

  // Announcement
  router.use(`${prefix}/announcements`, new AnnouncementRoutes().router)
}
