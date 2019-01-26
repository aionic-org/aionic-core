import Acl from 'acl'
import { readFileSync } from 'fs'

const permissions = new Acl(new Acl.memoryBackend())

// Read permissions from combined policies
const policies = JSON.parse(readFileSync('./dist/output/policies.combined.json', 'utf-8'))

permissions.allow([
  {
    allows: policies.Admin,
    roles: ['Admin']
  },
  {
    allows: policies.User,
    roles: ['User']
  }
])

export { permissions }
