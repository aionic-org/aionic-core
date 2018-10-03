export const taskPriorityPermissions = {
  admin: { resources: 'taskPriority', permissions: '*' },
  user: { resources: 'taskPriority', permissions: ['read'] }
}
