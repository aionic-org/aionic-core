const mysql = require('mysql');
const fs = require('fs');

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

// Run seed query
connection.query(seedQuery, (err, res) => {
  if (err) {
    throw err;
  }
});

connection.end();
