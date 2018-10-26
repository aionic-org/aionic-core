import * as Acl from 'acl'

const permissions = new Acl(new Acl.memoryBackend())

import { taskPermissions } from '../modules/task/config'
import { taskPriorityPermissions } from '../modules/task/taskPriority/config'
import { taskStatusPermissions } from '../modules/task/taskStatus/config'
import { taskCommentPermissions } from '../modules/task/subs/comment/config'

import { userPermissions } from '../modules/user/config'
import { userInvitationPermissions } from '../modules/user/userInvitation/config'
import { userRolePermissions } from '../modules/user/userRole/config'
import { userTaskPermissions } from '../modules/user/subs/task/config'

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
