export const userPermissions = {
  admin: { resources: 'user', permissions: '*' },
  user: { resources: 'user', permissions: ['read', 'create'] }
}
