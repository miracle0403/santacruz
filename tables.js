var db = require('./db.js');

/*db.query('CREATE TABLE IF NOT EXISTS result1 (reg_no varchar(255) NOT NULL, class varchar(255) NOT NULL, full_name varchar(255) NOT NULL, uploaded_by varchar(255) NOT NULL, session varchar(255) NOT NULL,  term varchar (255) NOT NULL, subject varchar(255) NOT NULL, grade varchar(255) NOT NULL, CA int(11)  NOT NULL, position varchar(255) NOT NULL, exam int(11) NOT NULL, total int(11) NOT NULL, date_uploaded DATETIME DEFAULT CURRENT_TIMESTAMP)', function(err, results){
	if (err) throw err;
	console.log('REsult1 table created');
});

db.query('CREATE TABLE IF NOT EXISTS result2 (reg_no varchar(255) NOT NULL, class varchar(255) NOT NULL, full_name varchar(255) NOT NULL, uploaded_by varchar(255) NOT NULL, session varchar(255) NOT NULL,  term varchar (255) NOT NULL, position varchar(255) NOT NULL, aggregate int(11) NOT NULL, total int(11) NOT NULL, teachers_remark text NOT NULL, principals_remark text NOT NULL, date_uploaded DATETIME DEFAULT CURRENT_TIMESTAMP)', function(err, results){
	if (err) throw err;
	console.log('REsult2 table created');
});

db.query('CREATE TABLE IF NOT EXISTS staff (user INT(11) UNIQUE NOT NULL, date_registered DATETIME DEFAULT CURRENT_TIMESTAMP)', function(err, results){
	if (err) throw err;
	console.log('staff table created');
});

db.query('CREATE TABLE IF NOT EXISTS pins (reg_no INT(11) NULL, pin varchar (255) UNIQUE NOT NULL, serial varchar (255) NOT NULL, session_used varchar(255) null, term_used varchar(255) null, times_used INT DEFAULT 0, date_used DATETIME null, date_created DATETIME DEFAULT CURRENT_TIMESTAMP)', function(err, results){
	if (err) throw err;
	console.log('pin table created');
});

db.query('CREATE TABLE IF NOT EXISTS pin_restrict (user varchar (255) NOT NULL, reg_no varchar(255) NOT NULL, pin varchar (255) UNIQUE NOT NULL, times_entered INT, date_entered DATETIME DEFAULT CURRENT_TIMESTAMP, status varchar(255) NOT NULL)', function(err, results){
	if (err) throw err;
	console.log('pin table created');
});

db.query('CREATE TABLE IF NOT EXISTS admin (user INT(11) UNIQUE NOT NULL, date_registered DATETIME DEFAULT CURRENT_TIMESTAMP)', function(err, results){
	if (err) throw err;
	console.log('admin table created');
});

db.query('CREATE TABLE IF NOT EXISTS courses (class varchar(255) NOT NULL, session varchar(255) NOT NULL, term varchar(255) NOT NULL)', function(err, results){
	if (err) throw err;
	console.log('courses table created');
});

db.query('CREATE TABLE IF NOT EXISTS user (user_id INT(11) PRIMARY KEY AUTO_INCREMENT NOT NULL, username varchar(255) UNIQUE NOT NULL, email varchar(255)UNIQUE NOT NULL, role varchar(255) NULL, full_name varchar(255) NOT NULL, phone bigint NOT NULL, code varchar (255) NOT NULL, password varchar (255) NOT NULL, date_registered DATETIME DEFAULT CURRENT_TIMESTAMP)', function(err, results){
	if (err) throw err;
	console.log('user table created');
});*/