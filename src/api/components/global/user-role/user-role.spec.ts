import { assert } from 'chai';

import { UserRole } from './model';
import { TestFactory } from '../../../../test/factory';

describe('Testing user-role component', () => {
	const factory: TestFactory = new TestFactory();

	before(async () => {
		await factory.init();
	});

	after(async () => {
		await factory.close();
	});

	it('POST /user-roles', (done) => {
		factory.app
			.post('/api/v1/user-roles')
			.send({
				userRole: { name: 'Admin' }
			})
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(200)
			.then((res) => {
				const { status } = res.body;
				const userRole: UserRole = res.body.data;

				// Assert status
				assert(status, res.status.toString());

				// Assert userRole
				assert(userRole.id, '1');
				assert(userRole.name, 'Admin');

				done();
			});
	});

	it('GET /user-roles', (done) => {
		factory.app
			.get('/api/v1/user-roles')
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(200)
			.then((res) => {
				const { status } = res.body;
				const userRoles: UserRole[] = res.body.data;

				// Assert status
				assert(status, res.status.toString());

				// Assert userRoles
				assert(userRoles[0].id, '1');
				assert(userRoles[0].name, 'Admin');

				done();
			});
	});
});
