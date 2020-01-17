const mysql = require('mysql');
const fs = require('fs');
const bcrypt = require('bcryptjs');

// Check CL arguments
if (process.argv.length > 2) {
	const type = process.argv.slice(2, 3)[0];
	let seedQuery;

	// Read SQL seed
	switch (type) {
		case 'global':
			seedQuery = fs.readFileSync('db/seeds/global.sql', {
				encoding: 'utf-8'
			});
			break;
		case 'milestone':
			seedQuery = fs.readFileSync('db/seeds/milestone.sql', {
				encoding: 'utf-8'
			});
			break;
		default:
			throw new Error('Unknow project seeding for: ' + type);
	}

	// Read MySQL config
	const config = JSON.parse(
		fs.readFileSync('ormconfig.json', {
			encoding: 'utf-8'
		})
	);

	// Connect to database
	const connection = mysql.createConnection({
		host: config.host,
		user: config.username,
		password: config.password,
		database: config.database,
		multipleStatements: true
	});

	connection.connect();

	// Generate random password for initial admin account
	const psw = Math.random()
		.toString(36)
		.substring(7);
	const hash = bcrypt.hashSync(psw, 10);

	// Query arguments
	const queryArgs = [hash];

	console.log('Running SQL seed...');

	// Run seed query
	connection.query(seedQuery, queryArgs, (err) => {
		if (err) {
			throw err;
		}

		console.log('SQL seed completed! Password for initial admin account: ' + psw);
	});

	connection.end();
} else {
	throw new Error('No project as argument for seeding provided!');
}
