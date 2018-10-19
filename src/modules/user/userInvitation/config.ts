export const userInvitationPermissions = {
  admin: { resources: 'userInvitation', permissions: '*' },
  user: { resources: 'userInvitation', permissions: ['read'] }
}
