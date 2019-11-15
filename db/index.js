const mysql = require('mysql');
const fs = require('fs');
const bcrypt = require('bcryptjs');

console.log('Running SQL seed...');

// Read MySQL config
const config = JSON.parse(
	fs.readFileSync('ormconfig.json', {
		encoding: 'utf-8'
	})
);

// Read SQL seed
const seedQuery = fs.readFileSync('db/seeds.sql', {
	encoding: 'utf-8'
});

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
const psw = Math.random().toString(36).substring(7);
const hash = bcrypt.hashSync(psw, 10);

// Query arguments
const queryArgs = [hash];

// Run seed query
connection.query(seedQuery, queryArgs, (err) => {
	if (err) {
		throw err;
	}

	console.log('SQL seed completed! Password for initial admin account: ' + psw);
});

connection.end();
