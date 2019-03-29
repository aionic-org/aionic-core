import { Router } from 'express'

import { TaskPriorityRoutes } from './task-priority/routes'
import { TaskStatusRoutes } from './task-status/routes'
import { TaskRoutes } from './task/routes'

import { ProjectRoutes } from './project/routes'

import { GitRoutes } from './git/routes'

import { AnnouncementRoutes } from './announcement/routes'

/**
 * Init Express api routes (Milestone)
 *
 * @param {Router} router
 * @param {string} prefix
 * @returns {void}
 */
export function registerMilestoneRoutes(router: Router, prefix: string = ''): void {
  router.use(`${prefix}/tasks`, new TaskRoutes().router)
  router.use(`${prefix}/task-priorities`, new TaskPriorityRoutes().router)
  router.use(`${prefix}/task-status`, new TaskStatusRoutes().router)

  router.use(`${prefix}/projects`, new ProjectRoutes().router)

  router.use(`${prefix}/git`, new GitRoutes().router)

  router.use(`${prefix}/announcements`, new AnnouncementRoutes().router)
}
