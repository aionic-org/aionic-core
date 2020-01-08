import 'module-alias/register';

import { assert } from 'chai';

import { Project } from './model';
import { TestFactory } from '../../../../test/factory';

describe('Testing project component', () => {
	const factory: TestFactory = new TestFactory();
	const testProject: Project = Project.mockTestProject();
	const testProjectModified: Project = { ...testProject, title: 'testTitleModified', key: 'testKeyModified' };

	before(async () => {
		await factory.init();
	});

	after(async () => {
		await factory.close();
	});

	describe('POST /projects', () => {
		it('responds with status 400', (done) => {
			factory.app
				.post('/api/v1/projects')
				.send()
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(400, done);
		});

		it('responds with new project', (done) => {
			factory.app
				.post('/api/v1/projects')
				.send({
					project: testProject
				})
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(200)
				.end((err, res) => {
					try {
						if (err) throw err;

						const { status } = res.body;
						const project: Project = res.body.data;

						// Assert status
						assert(status === res.status, 'status does not match');

						// Assert project
						assert.isObject(project, 'project should be an object');
						for (const k in testProject) {
							assert(testProject[k as keyof Project] === project[k as keyof Project], `key ${k} does not match`);
						}

						return done();
					} catch (err) {
						return done(err);
					}
				});
		});
	});

	describe('PUT /projects/1', () => {
		it('responds with updated project', (done) => {
			factory.app
				.put('/api/v1/projects/1')
				.send({
					project: testProjectModified
				})
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.end((err, res) => {
					try {
						if (err) throw err;

						const { status } = res.body;
						const project: Project = res.body.data;

						// Assert status
						assert(status === res.status, 'status does not match');

						// Assert project
						assert.isObject(project, 'project should be an object');
						for (const k in testProjectModified) {
							assert(
								testProjectModified[k as keyof Project] === project[k as keyof Project],
								`key ${k} does not match`
							);
						}

						return done();
					} catch (err) {
						return done(err);
					}
				});
		});
	});

	describe('GET /projects', () => {
		it('responds with project array', (done) => {
			factory.app
				.get('/api/v1/projects')
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(200)
				.end((err, res) => {
					try {
						if (err) throw err;

						const { status } = res.body;
						const projects: Project[] = res.body.data;

						// Assert status
						assert(status === res.status, 'status does not match');

						// Assert projects
						assert.isArray(projects, 'projects should be an array');
						for (const k in testProjectModified) {
							assert(
								testProjectModified[k as keyof Project] === projects[0][k as keyof Project],
								`key ${k} does not match`
							);
						}

						return done();
					} catch (err) {
						return done(err);
					}
				});
		});
	});

	describe('GET /projects/1', () => {
		it('responds with single project', (done) => {
			factory.app
				.get('/api/v1/projects/1')
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(200)
				.end((err, res) => {
					try {
						if (err) throw err;

						const { status } = res.body;
						const project: Project = res.body.data;

						// Assert status
						assert(status === res.status, 'status does not match');

						// Assert project
						assert.isObject(project, 'project should be an object');
						for (const k in testProjectModified) {
							assert(
								testProjectModified[k as keyof Project] === project[k as keyof Project],
								`key ${k} does not match`
							);
						}

						return done();
					} catch (err) {
						return done(err);
					}
				});
		});
	});

	describe('DELETE /projects/1', () => {
		it('responds with status 204', (done) => {
			factory.app
				.delete('/api/v1/projects/1')
				.set('Accept', 'application/json')
				.expect(204, done);
		});

		it('responds with status 404', (done) => {
			factory.app
				.delete('/api/v1/projects/1')
				.set('Accept', 'application/json')
				.expect(404, done);
		});
	});
});
