import { TestFactory } from '../../../../test/factory';

describe('Testing user component', () => {
	const factory: TestFactory = new TestFactory();

	before(async () => {
		await factory.init();
	});

	after(() => {
		factory.close();
	});

	it('GET /users', (done) => {
		factory.app
			.get('/api/v1/users')
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(
				200,
				{
					status: 200,
					data: []
				},
				done
			);
	});
});
