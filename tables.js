var db = require('./db.js');

/*db.query('CREATE TABLE IF NOT EXISTS students (reg_no varchar(255) NOT NULL, DOB DATE NULL, full_name varchar(255) NOT NULL, passport varchar(255) NOT NULL, Class varchar(255) NOT NULL,  date_admitted DATE NOT NULL, performance varchar(255) NOT NULL, Guardian varchar(255) NOT NULL, title varchar(255)  NOT NULL, guardian_phone BIGINT NOT NULL, student_phone BIGINT NULL, guardian_email varchar(255) NOT NULL, student_email varchar(255) NULL, guardian_STO varchar(255) NOT NULL, student_STO varchar(255) NOT NULL, guardian_address varchar(255) NOT NULL, student_address varchar(255) NOT NULL, guardian_occupation varchar(255) NOT NULL, student_madien_name varchar(255) NOT NULL', function(err, results){
	if (err) throw err;
	console.log('students table created');
});

db.query('CREATE TABLE IF NOT EXISTS fees (reg_no varchar(255) NOT NULL, date_paid DATE NULL, purpose varchar(255) NOT NULL, payment_method varchar(255) NOT NULL, payment_slip varchar(255) NULL, transaction_id varchar(255) NULL,  date_entered DATETIME DEFAULT CURRENT_TIMESTAMP, amount INT(11) NOT NULL, session varchar (255) NOT NULL, term varchar(255) NOT NULL, term_payment INT NOT NULL, class varchar (255) NOT NULL, old_debt INT(11) NOT NULL, amount_to_pay INT(11) NOT NULL, balance INT(11) NOT NULL', function(err, results){
	if (err) throw err;
	console.log('payment table created');
});

db.query('CREATE TABLE IF NOT EXISTS result1 (reg_no varchar(255) NOT NULL, age INT(11) NOT NULL, class varchar(255) NOT NULL, full_name varchar(255) NOT NULL, uploaded_by varchar(255) NOT NULL, session varchar(255) NOT NULL,  term varchar (255) NOT NULL, subject varchar(255) NOT NULL, grade varchar(255) NOT NULL, CA int(11)  NOT NULL, position varchar(255) NOT NULL, exam int(11) NOT NULL, total int(11) NOT NULL, date_uploaded DATETIME DEFAULT CURRENT_TIMESTAMP)', function(err, results){
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

db.query('CREATE TABLE IF NOT EXISTS result_grace (amount INT(11) NOT NULL, posted_by varchar(255) NOT NULL, date_registered DATETIME DEFAULT CURRENT_TIMESTAMP)', function(err, results){
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