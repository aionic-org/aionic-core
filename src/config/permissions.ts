import * as Acl from 'acl'

const permissions = new Acl(new Acl.memoryBackend())

permissions.allow([
  {
    roles: ['Admin'],
    allows: [
      {
        resources: ['user', 'task'],
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
      }
    ]
  }
])

export { permissions }
