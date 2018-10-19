export const userRolePermissions = {
  admin: { roles: 'Admin', allows: { resources: 'userRole', permissions: '*' } },
  user: { resources: 'userRole', permissions: ['read'] }
}
