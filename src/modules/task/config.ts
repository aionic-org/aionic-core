export const taskPermissions = {
  admin: { resources: 'task', permissions: '*' },
  user: { resources: 'task', permissions: ['read', 'create', 'update'] }
}
