import acl from 'acl';
import { readFileSync } from 'fs';

import { RedisService } from '@services/cache/redis';

const permissions = new acl(new acl.redisBackend(RedisService.client));

// Read permissions from combined policies
const policies = JSON.parse(readFileSync(`${__dirname}/policies.combined.json`, 'utf-8'));

permissions.allow([
	{
		allows: policies.Admin,
		roles: ['Admin']
	},
	{
		allows: policies.User,
		roles: ['User']
	}
]);

export { permissions };
