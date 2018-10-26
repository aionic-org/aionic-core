export const taskStatusPermissions = {
  admin: { resources: 'taskStatus', permissions: '*' },
  user: { resources: 'taskStatus', permissions: ['read'] }
}
