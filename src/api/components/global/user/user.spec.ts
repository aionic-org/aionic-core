import { assert } from 'chai';

import { User } from './model';
import { TestFactory } from '../../../../test/factory';

describe('Testing user component', () => {
	const factory: TestFactory = new TestFactory();

	before(async () => {
		await factory.init();
	});

	after(async () => {
		await factory.close();
	});

	it('POST /users', (done) => {
		factory.app
			.post('/api/v1/users')
			.send({
				user: {
					email: 'test@email.com',
					firstname: 'testFirstname',
					lastname: 'testLastname',
					password: 'testPassword'
				}
			})
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(200)
			.then((res) => {
				const { status } = res.body;
				const user: User = res.body.data;

				// Assert status
				assert(status, res.status.toString());

				// Assert user
				assert(user.id, '1');
				assert(user.email, 'test@email.com');
				assert(user.firstname, 'testFirstname');
				assert(user.lastname, 'testLastname');

				done();
			});
	});

	it('PUT /users/1', (done) => {
		factory.app
			.put('/api/v1/users/1')
			.send({
				user: {
					id: 1,
					email: 'test@email.com',
					firstname: 'testFirstnameChanged',
					lastname: 'testLastnameChanged'
				}
			})
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(200)
			.then((res) => {
				const { status } = res.body;
				const user: User = res.body.data;

				// Assert status
				assert(status, res.status.toString());

				// Assert user
				assert(user.id, '1');
				assert(user.email, 'test@email.com');
				assert(user.firstname, 'testFirstnameChanged');
				assert(user.lastname, 'testLastnameChanged');

				done();
			});
	});

	it('GET /users', (done) => {
		factory.app
			.get('/api/v1/users')
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(200)
			.then((res) => {
				const { status } = res.body;
				const users: User[] = res.body.data;

				// Assert status
				assert(status, res.status.toString());

				// Assert users
				assert(users[0].id, '1');
				assert(users[0].email, 'test@email.com');
				assert(users[0].firstname, 'testFirstnameChanged');
				assert(users[0].lastname, 'testLastnameChanged');

				done();
			});
	});
});
