import 'module-alias/register';

import { assert } from 'chai';

import { Announcement } from './model';
import { TestFactory } from '../../../../test/factory';

describe('Testing announcement component', () => {
	const factory: TestFactory = new TestFactory();
	const testAnnouncement: Announcement = Announcement.mockTestAnnouncement();

	before(async () => {
		await factory.init();
	});

	after(async () => {
		await factory.close();
	});

	describe('POST /announcements', () => {
		it('responds with status 400', (done) => {
			factory.app
				.post('/api/v1/announcements')
				.send()
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(400, done);
		});

		it('responds with new announcement', (done) => {
			factory.app
				.post('/api/v1/announcements')
				.send({
					announcement: testAnnouncement
				})
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(200)
				.end((err, res) => {
					try {
						if (err) throw err;

						const { status } = res.body;
						const announcement: Announcement = res.body.data;

						// Assert status
						assert(status === res.status, 'status does not match');

						// Assert announcement
						assert.isObject(announcement, 'announcement should be an object');
						for (const k in testAnnouncement) {
							assert(
								testAnnouncement[k as keyof Announcement] === announcement[k as keyof Announcement],
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

	describe('GET /announcements', () => {
		it('responds with announcement array', (done) => {
			factory.app
				.get('/api/v1/announcements')
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(200)
				.end((err, res) => {
					try {
						if (err) throw err;

						const { status } = res.body;
						const announcements: Announcement[] = res.body.data;

						// Assert status
						assert(status === res.status, 'status does not match');

						// Assert announcements
						assert.isArray(announcements, 'announcements should be an array');
						for (const k in testAnnouncement) {
							assert(
								testAnnouncement[k as keyof Announcement] === announcements[0][k as keyof Announcement],
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

	describe('GET /announcements/1', () => {
		it('responds with single announcement', (done) => {
			factory.app
				.get('/api/v1/announcements/1')
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(200)
				.end((err, res) => {
					try {
						if (err) throw err;

						const { status } = res.body;
						const announcement: Announcement = res.body.data;

						// Assert status
						assert(status === res.status, 'status does not match');

						// Assert announcement
						assert.isObject(announcement, 'announcement should be an object');
						for (const k in announcement) {
							assert(
								announcement[k as keyof Announcement] === announcement[k as keyof Announcement],
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

	describe('DELETE /announcements/1', () => {
		it('responds with status 204', (done) => {
			factory.app
				.delete('/api/v1/announcements/1')
				.set('Accept', 'application/json')
				.expect(204, done);
		});

		it('responds with status 404', (done) => {
			factory.app
				.delete('/api/v1/announcements/1')
				.set('Accept', 'application/json')
				.expect(404, done);
		});
	});
});
