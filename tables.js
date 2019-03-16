var db = require('./db.js');

/*db.query('CREATE TABLE IF NOT EXISTS staff (user INT(11) UNIQUE NOT NULL, date_registered DATETIME DEFAULT CURRENT_TIMESTAMP)', function(err, results){
	if (err) throw err;
	console.log('staff table created');
});

db.query('CREATE TABLE IF NOT EXISTS admin (user INT(11) UNIQUE NOT NULL, date_registered DATETIME DEFAULT CURRENT_TIMESTAMP)', function(err, results){
	if (err) throw err;
	console.log('admin table created');
});

db.query('CREATE TABLE IF NOT EXISTS user (user_id INT(11) PRIMARY KEY AUTO_INCREMENT NOT NULL, username varchar(255) UNIQUE NOT NULL, email varchar(255)UNIQUE NOT NULL, role varchar(255) NULL, full_name varchar(255) NOT NULL, phone bigint NOT NULL, code varchar (255) NOT NULL, password varchar (255) NOT NULL, date_registered DATETIME DEFAULT CURRENT_TIMESTAMP)', function(err, results){
	if (err) throw err;
	console.log('user table created');
});*/