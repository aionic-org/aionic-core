import 'module-alias/register';

import { assert } from 'chai';

import { Task } from './model';
import { TestFactory } from '../../../../test/factory';

describe('Testing task component', () => {
	const factory: TestFactory = new TestFactory();
	const testTask: Task = Task.mockTestTask();
	const testTaskModified: Task = { ...testTask, title: 'testTitleModified', tags: 'testTag2,testTag1' };

	before(async () => {
		await factory.init();
	});

	after(async () => {
		await factory.close();
	});

	describe('POST /tasks', () => {
		it('responds with status 400', (done) => {
			factory.app
				.post('/api/v1/tasks')
				.send()
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(400, done);
		});

		it('responds with new task', (done) => {
			factory.app
				.post('/api/v1/tasks')
				.send({
					task: testTask
				})
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(200)
				.end((err, res) => {
					try {
						if (err) throw err;

						const { status } = res.body;
						const task: Task = res.body.data;

						// Assert status
						assert(status === res.status, 'status does not match');

						// Assert task
						assert.isObject(task, 'task should be an object');
						assert(task.id === testTask.id, 'taskID does not match');
						assert(task.title === testTask.title, 'taskTitle does not match');
						assert(task.description === testTask.description, 'taskDescription does not match');
						assert(task.tags === testTask.tags, 'taskTags does not match');

						return done();
					} catch (err) {
						return done(err);
					}
				});
		});
	});

	describe('PUT /tasks/1', () => {
		it('responds with updated task', (done) => {
			factory.app
				.put('/api/v1/tasks/1')
				.send({
					task: testTaskModified
				})
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.end((err, res) => {
					try {
						if (err) throw err;

						const { status } = res.body;
						const task: Task = res.body.data;

						// Assert status
						assert(status === res.status, 'status does not match');

						// Assert task
						assert.isObject(task, 'task should be an object');
						assert(task.id === testTaskModified.id, 'taskID does not match');
						assert(task.title === testTaskModified.title, 'taskTitle does not match');
						assert(task.description === testTaskModified.description, 'taskDescription does not match');
						assert(task.tags === testTaskModified.tags, 'taskTags does not match');

						return done();
					} catch (err) {
						return done(err);
					}
				});
		});
	});

	describe('GET /tasks', () => {
		it('responds with task array', (done) => {
			factory.app
				.get('/api/v1/tasks')
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(200)
				.end((err, res) => {
					try {
						if (err) throw err;

						const { status } = res.body;
						const tasks: Task[] = res.body.data;

						// Assert status
						assert(status === res.status, 'status does not match');

						// Assert tasks
						assert.isArray(tasks, 'tasks should be an array');
						assert(tasks[0].id === testTaskModified.id, 'taskID does not match');
						assert(tasks[0].title === testTaskModified.title, 'taskTitle does not match');
						assert(tasks[0].description === testTaskModified.description, 'taskDescription does not match');
						assert(tasks[0].tags === testTaskModified.tags, 'taskTags does not match');

						return done();
					} catch (err) {
						return done(err);
					}
				});
		});
	});

	describe('GET /tasks/1', () => {
		it('responds with single task', (done) => {
			factory.app
				.get('/api/v1/tasks/1')
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(200)
				.end((err, res) => {
					try {
						if (err) throw err;

						const { status } = res.body;
						const task: Task = res.body.data;

						// Assert status
						assert(status === res.status, 'status does not match');

						// Assert task
						assert.isObject(task, 'task should be an object');
						assert(task.id === testTaskModified.id, 'taskID does not match');
						assert(task.title === testTaskModified.title, 'taskTitle does not match');
						assert(task.description === testTaskModified.description, 'taskDescription does not match');
						assert(task.tags === testTaskModified.tags, 'taskTags does not match');

						return done();
					} catch (err) {
						return done(err);
					}
				});
		});
	});

	describe('DELETE /tasks/1', () => {
		it('responds with status 204', (done) => {
			factory.app
				.delete('/api/v1/tasks/1')
				.set('Accept', 'application/json')
				.expect(204, done);
		});

		it('responds with status 404', (done) => {
			factory.app
				.delete('/api/v1/tasks/1')
				.set('Accept', 'application/json')
				.expect(404, done);
		});
	});
});
