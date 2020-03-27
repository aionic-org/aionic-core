const mysql = require('mysql');
const fs = require('fs');
const bcrypt = require('bcryptjs');

// Check command line arguments
if (process.argv.length > 2) {
	const type = process.argv.slice(2, 3)[0];
	let seedQuery;
	let initialPassword;
	const seedQueryArgs = [];

	// Read SQL seed
	switch (type) {
		case 'global':
			seedQuery = fs.readFileSync('db/seeds/global.sql', {
				encoding: 'utf-8'
			});

			// Generate random password for initial admin account
			initialPassword = Math.random()
				.toString(36)
				.substring(7);
			const hash = bcrypt.hashSync(initialPassword, 10);
			seedQueryArgs.push(hash);
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

	// Run seed query
	connection.query(seedQuery, seedQueryArgs, (err) => {
		if (err) {
			throw err;
		}

		console.log(`SQL ${type} seed completed!`);

		if (type === 'global') {
			console.log(`Initial admin password: ` + initialPassword);
		}
	});

	connection.end();
} else {
	throw new Error('No project as argument for seeding provided!');
}
