import * as Acl from 'acl'

const permissions = new Acl(new Acl.memoryBackend())

permissions.allow([
  {
    roles: ['Admin'],
    allows: [
      {
        resources: ['user', 'task', 'taskStatus'],
        permissions: '*'
      }
    ]
  },
  {
    roles: ['User'],
    allows: [
      {
        resources: 'user',
        permissions: ['read', 'delete']
      },
      {
        resources: 'task',
        permissions: ['read', 'update']
      },
      {
        resources: 'taskStatus',
        permissions: ['read']
      }
    ]
  }
])

export { permissions }
