import { TestFactory } from '../../../../test/factory';

describe('Testing user-role component', () => {
	const factory: TestFactory = new TestFactory();

	before(async () => {
		await factory.init();
	});

	after(() => {
		factory.close();
	});

	it('POST /user-roles', (done) => {
		factory.app
			.post('/api/v1/user-roles')
			.send({
				userRole: { name: 'Admin' }
			})
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(
				200,
				{
					status: 200,
					data: {
						id: 1,
						name: 'Admin'
					}
				},
				done
			);
	});

	it('GET /user-roles', (done) => {
		factory.app
			.get('/api/v1/user-roles')
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(
				200,
				{
					status: 200,
					data: [{ id: 1, name: 'Admin' }]
				},
				done
			);
	});
});
