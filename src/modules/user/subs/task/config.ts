export const userTaskPermissions = {
  admin: { resources: 'userTask', permissions: '*' },
  user: { resources: 'userTask', permissions: ['read'] }
}
