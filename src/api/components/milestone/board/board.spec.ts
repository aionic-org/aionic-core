import 'module-alias/register';

import { assert } from 'chai';

import { Board } from './model';
import { TestFactory } from '../../../../test/factory';

describe('Testing board component', () => {
	const factory: TestFactory = new TestFactory();
	const testBoard: Board = Board.mockTestBoard();
	const testBoardModified: Board = { ...testBoard, title: 'testTitleModified', description: 'testDescriptionModified' };

	before(async () => {
		await factory.init();
	});

	after(async () => {
		await factory.close();
	});

	describe('POST /boards', () => {
		it('responds with status 400', (done) => {
			factory.app
				.post('/api/v1/boards')
				.send()
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(400, done);
		});

		it('responds with new board', (done) => {
			factory.app
				.post('/api/v1/boards')
				.send({
					board: testBoard
				})
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(200)
				.end((err, res) => {
					try {
						if (err) throw err;

						const { status } = res.body;
						const board: Board = res.body.data;

						// Assert status
						assert(status === res.status, 'status does not match');

						// Assert board
						assert.isObject(board, 'board should be an object');
						for (const k in testBoard) {
							assert(testBoard[k as keyof Board] === board[k as keyof Board], `key ${k} does not match`);
						}

						return done();
					} catch (err) {
						return done(err);
					}
				});
		});
	});

	describe('PUT /board/1', () => {
		it('responds with updated board', (done) => {
			factory.app
				.put('/api/v1/boards/1')
				.send({
					board: testBoardModified
				})
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.end((err, res) => {
					try {
						if (err) throw err;

						const { status } = res.body;
						const board: Board = res.body.data;

						// Assert status
						assert(status === res.status, 'status does not match');

						// Assert board
						assert.isObject(board, 'board should be an object');
						for (const k in testBoardModified) {
							assert(testBoardModified[k as keyof Board] === board[k as keyof Board], `key ${k} does not match`);
						}

						return done();
					} catch (err) {
						return done(err);
					}
				});
		});
	});

	describe('GET /boards', () => {
		it('responds with board array', (done) => {
			factory.app
				.get('/api/v1/boards')
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(200)
				.end((err, res) => {
					try {
						if (err) throw err;

						const { status } = res.body;
						const boards: Board[] = res.body.data;

						// Assert status
						assert(status === res.status, 'status does not match');

						// Assert boards
						assert.isArray(boards, 'boards should be an array');
						for (const k in testBoardModified) {
							assert(testBoardModified[k as keyof Board] === boards[0][k as keyof Board], `key ${k} does not match`);
						}

						return done();
					} catch (err) {
						return done(err);
					}
				});
		});
	});

	describe('GET /boards/1', () => {
		it('responds with single board', (done) => {
			factory.app
				.get('/api/v1/boards/1')
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(200)
				.end((err, res) => {
					try {
						if (err) throw err;

						const { status } = res.body;
						const board: Board = res.body.data;

						// Assert status
						assert(status === res.status, 'status does not match');

						// Assert board
						assert.isObject(board, 'board should be an object');
						for (const k in testBoardModified) {
							assert(testBoardModified[k as keyof Board] === board[k as keyof Board], `key ${k} does not match`);
						}

						return done();
					} catch (err) {
						return done(err);
					}
				});
		});
	});

	describe('DELETE /boards/1', () => {
		it('responds with status 204', (done) => {
			factory.app
				.delete('/api/v1/boards/1')
				.set('Accept', 'application/json')
				.expect(204, done);
		});

		it('responds with status 404', (done) => {
			factory.app
				.delete('/api/v1/boards/1')
				.set('Accept', 'application/json')
				.expect(404, done);
		});
	});
});
