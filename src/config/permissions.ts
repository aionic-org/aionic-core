import * as Acl from 'acl'

const permissions = new Acl(new Acl.memoryBackend())

import { taskPermissions } from '../modules/task/task.config'
import { taskPriorityPermissions } from '../modules/task/taskPriority/taskPriority.config'
import { taskStatusPermissions } from '../modules/task/taskStatus/taskStatus.config'
import { taskCommentPermissions } from '../modules/task/subs/comment/taskComment.config'

import { userPermissions } from '../modules/user/user.config'
import { userInvitationPermissions } from '../modules/user/userInvitation/userInvitation.config'
import { userRolePermissions } from '../modules/user/userRole/userRole.config'
import { userTaskPermissions } from '../modules/user/subs/task/userTask.config'

permissions.allow([
  {
    roles: ['Admin'],
    allows: [
      taskPermissions.admin,
      taskPriorityPermissions.admin,
      taskStatusPermissions.admin,
      taskCommentPermissions.admin,

      userPermissions.admin,
      userInvitationPermissions.admin,
      userRolePermissions.admin,
      userTaskPermissions.admin
    ]
  },
  {
    roles: ['User'],
    allows: [
      taskPermissions.user,
      taskPriorityPermissions.user,
      taskStatusPermissions.user,
      taskCommentPermissions.user,

      userPermissions.user,
      userInvitationPermissions.user,
      userRolePermissions.user,
      userTaskPermissions.user
    ]
  }
])

export { permissions }
