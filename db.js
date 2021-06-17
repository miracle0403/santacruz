var sql = require ('mysql');//|| require('postgres');
var server = require ('./app.js');
const PoolManager = require('mysql-connection-pool-manager');



/*var pool  = mySQL.raw.createConnection({
	multipleStatements: true,
	connectionLimit : 0,
	waitForConnections: true,
	host: "localhost",
	user: "root",
	password: '',
	database: "newdb"
	host: "localhost",
  user: "miracle0403",
  password: 'MIracle1994@I',
  database: "ezwiftdb"
	
});*/
const options = {
  idleCheckInterval: 1000,
  maxConnextionTimeout: 30000,
  idlePoolTimeout: 3000,
  errorLimit: 5,
  preInitDelay: 50,
  sessionTimeout: 60000,
  onConnectionAcquire: () => { console.log("Acquire"); },
  onConnectionConnect: () => { console.log("Connect"); },
  onConnectionEnqueue: () => { console.log("Enqueue"); },
  onConnectionRelease: () => { console.log("Release"); },
  mySQLSettings: {
	host: "us-cdbr-east-04.cleardb.com",
  user: "bf24c600dd3fd2",
  password: '9988d6bc',
  database: "heroku_09e2abe7c63d458",
    port: '3306',
    socketPath: '/var/run/mysqld/mysqld.sock',
    charset: 'utf8',
    multipleStatements: true,
    connectTimeout: 15000,
    acquireTimeout: 10000,
    waitForConnections: true,
    connectionLimit: 1000,
    queueLimit: 5000,
    debug: false
  }
}

const mySQL = PoolManager(options);

/*var pool  = mySQL.raw.createConnection({
	host: "us-cdbr-east-04.cleardb.com",
  user: "bf24c600dd3fd2",
  password: '9988d6bc',
  database: "heroku_09e2abe7c63d458"
});*/
var pool  = mySQL.raw.createConnection({
	host: "us-cdbr-east-04.cleardb.com",
  user: "bf24c600dd3fd2",
  password: '9988d6bc',
  database: "heroku_09e2abe7c63d458"
});
pool.connect();

/*mysql -u root -p
YOUR_ROOT_PASSWORD_HERE
use newdb*/


pool.query( 'SELECT 1 + 4 AS solution', function ( err, results, fields ){
	if ( err ) throw err;
	console.log( 'solution is ' + results[0].solution);
});
//pool.end();


module.exports = pool
