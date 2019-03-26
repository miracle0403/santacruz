'use strict';
const nodemailer = require('nodemailer'); 
var formidable = require('formidable');
var express = require('express');
var router = express.Router();
var ensureLoggedIn =  require('connect-ensure-login').ensureLoggedIn
var util = require('util');
var securePin = require('secure-pin');
var fs = require('fs');
var passport = require('passport');
var db = require('../db.js'); 
var bcrypt = require('bcrypt-nodejs');
var securePin = require('secure-pin');
var path = require('path');

var url = require('url'); 
var math = require( 'mathjs' );
function rounds( err, results ){ 
	if ( err ) throw err;
}
const saltRounds = bcrypt.genSalt( 10, rounds);




//get home 
router.get('/',  function(req, res, next) {
	var messages = res.locals.getMessages();
	if( messages.notify ){
		console.log( messages.notify );
		res.render('index', {title: 'SANCTA CRUX', ShowMessage: true, messages: messages.notify});
	}else{
		console.log( 'no notify' );
		res.render('index', {title: 'SANCTA CRUX'});
	}
});


router.get('/students', ensureLoggedIn('/login'), function(req, res, next){
	var currentUser = req.session.passport.user.user_id;
	db.query('SELECT user FROM admin WHERE user = ?', [currentUser], function(err, results, fields){
		if(err) throw err;
		if(results.length === 0){
			res.redirect('/404');
		}else{
			var admin = currentUser;
			res.render('students', {title: 'ADD NEW STUDENT', admin: admin});
		}
	});
});

//product 
router.get('/category=:category/product=:product',  function(req, res, next) {
	var product = req.params.product;
	var category = req.params.category;
	db.query( 'SELECT * FROM products WHERE product_name = ? and category_name = ?',  [product, category], function(err, results, fields){
		if( err ) throw err;
		var product = results[0];
		res.render('preoduct', {title: product.product_name, product: product});
	});
});

//get category
router.get('/category=:category/page=:page',  function(req, res, next) {
	var limit  =  12;
	var page = req.params.page;
	var category = req.params.category;
	db.query( 'SELECT COUNT( product_id) AS total FROM products WHERE status  = ? and category_name = ?',  ['in stock', category], function(err, results, fields){
		if( err ) throw err;
		var totalrows = results[0].total;
		var pages = math.ceil( totalrows / limit ); 
		if( pages === 1 ){
			var offset = 0;
			var sql = 'SELECT * FROM products WHERE status  =  ? and category_name = ? LIMIT ?, ?';
			var details =  ['in stock', category, offset, limit];
			db.query(sql, details, function ( err, results, fields ){
				if( err ) throw err;
				var products = results;
				//var links = ['/pages/1'];
				res.render( 'category', {title: 'ALL' + category, products: products, pagination: { page: page, pageCount: pages }});
			});
		}else{
			var offset = ( page * limit ) - limit;
			var sql = 'SELECT * FROM products WHERE status  =  ? and category_name = ? LIMIT ?, ?';
			var details =  ['in stock', category, offset, limit];
			db.query(sql, details, function ( err, results, fields ){
				if( err ) throw err;
				var products = results;
				res.render( 'index', {title: 'ALL' + category, products: products, pagination: { page: page, pageCount: pages }});
			});
		}
	});
});

/* GET home page. */
router.get('/page=:page', function ( req, res, next ){
	var limit  =  12;
	var page = req.params.page;
	db.query( 'SELECT COUNT( product_id) AS total FROM products WHERE status  = ?',  ['in stock'], function(err, results, fields){
		if( err ) throw err;
		var totalrows = results[0].total;
		var pages = math.ceil( totalrows / limit ); 
		if( pages === 1 ){
			var offset = 0;
			var sql = 'SELECT * FROM products WHERE status  =  ?  LIMIT ?, ?';
			var details =  ['in stock', offset, limit];
			db.query(sql, details, function ( err, results, fields ){
				if( err ) throw err;
				var products = results;
				//var links = ['/pages/1'];
				res.render( 'index', {title: 'IFEY SAMUEL', products: products, pagination: { page: page, pageCount: pages }});
			});
		}else{
			var offset = ( page * limit ) - limit;
			var sql = 'SELECT * FROM products WHERE status  =  ?  LIMIT ?, ?';
			var details =  ['in stock', offset, limit];
			db.query(sql, details, function ( err, results, fields ){
				if( err ) throw err;
				var products = results;
				res.render( 'index', {title: 'IFEY SAMUEL', products: products, pagination: { page: page, pageCount: pages }});
			});
		}
	});
});


//ensureLoggedIn( '/login' ),
//get upload
router.get('/admin', ensureLoggedIn('/login'), function(req, res, next) {
	//get the category.
	var currentUser = req.session.passport.user.user_id;
	db.query('SELECT user FROM admin WHERE user = ?', [currentUser], function(err, results, fields){
		if(err) throw err;
		if(results.length === 0){
			res.redirect('/404');
		}else{
			var admin = currentUser;
			res.render('upload', {admin: admin, title: 'ADMIN CORNER'});
		}
	});
});

router.get('/staff', ensureLoggedIn('/login'), function(req, res, next) {
	//get the category.
	var currentUser = req.session.passport.user.user_id;
	db.query('SELECT user FROM staff WHERE user = ?', [currentUser], function(err, results, fields){
		if(err) throw err;
		if(results.length === 0){
			db.query('SELECT user FROM admin WHERE user = ?', [currentUser], function(err, results, fields){
				if(err) throw err;
				if(results.length === 0){
					res.redirect('/404');
				}else{
					var admin = currentUser;
					res.render('staff', {admin: admin, title: 'ADD RESULT'});
				}
			});
		}else{
			var staff = currentUser;
			var messages = res.locals.getMessages();
			if( messages.error ){
				console.log( messages.error );
				res.render('staff', {title: 'UPLOAD FAILED', ShowMessage: true, error: messages.error});
			}else{
				if( messages.success ){
					console.log( messages.success );
					res.render('staff', {title: 'UPLOAD FAILED', ShowMessage: true, error: messages.success});
				}else{
					console.log( 'no notify' );
					res.render('staff', {title: 'UPLOAD RESULT'});
				}
			}
		}
	});
});



//get login
router.get('/login', function(req, res, next) {  
	const flashMessages = res.locals.getMessages( );
	if( flashMessages.error ){
		res.render( 'login', {
			title: 'LOGIN',
			showErrors: true,
			errors: flashMessages.error
		});
	}else{
		res.render('login', { title: 'LOG IN'});
	}
});


//register get request
router.get('/register', function(req, res, next) {	
    res.render('register',  { title: 'REGISTRATION'});
});

//get logout
router.get('/logout', function(req, res, next) {
  req.logout();
  req.session.destroy();
  res.redirect('/');
});

//Passport login
passport.serializeUser(function(user_id, done){
  done(null, user_id)
});
        
passport.deserializeUser(function(user_id, done){
  done(null, user_id)
});

//post add status.
router.post('/status', function(req, res, next) {
	var status = req.body.status;
	var id = req.body.id;
	db.query( 'UPDATE products SET status  = ? WHERE id = ?', [status, id], function ( err, results, fields ){
		if(err) throw err;
		res.render('upload', {title: 'ADMIN CORNER', statussuccess: 'Update was successful'});
	});
});

//post search.
router.post('/searchproduct', function(req, res, next) {
	var product_id = req.body.product_id;
	
	db.query( 'SELECT * FROM products WHERE product_id = ?', [product_id], function ( err, results, fields ){
		if(err) throw err;
		var product = results;
		res.render('upload', {title: 'ADMIN CORNER', searchresults: product});
	});
});


//post add new category never existed.
router.post('/newcat', function(req, res, next) {
	var category = req.body.category;
	db.query( 'SELECT category_name FROM category WHERE category_name  = ?', [category], function ( err, results, fields ){
	console.log( results )
		if ( results.length > 0 ){
			var error = 'This category exists already';
			res.render( 'upload', {title: 'ADD CATEGORY FAILED', parenterror: error});
		}else{
			db.query('CALL newcat (?)', [category], function(err, results, fields){
				if (err) throw err;
				var parent = 'Category added.';
				var success = ' New category added successfully';
				res.render('upload', { title: 'IFEYSAMUEL VENTURES', parent: success});
			});
		}
	});
});

//post log in
router.post('/login', passport.authenticate('local', {
  failureRedirect: '/login',
  successReturnToOrRedirect: '/staff',
  failureFlash: true
}));

//add new admin
router.post('/addadmin', function (req, res, next) {
	var user = req.body.user;
	db.query('SELECT user_id, username FROM user WHERE user_id = ?', [user], function(err, results, fields){
		if( err ) throw err;
		if ( results.length === 0){
			var error = 'Sorry this user does not exist.';
			res.render('upload', {adderror: error });
		}
		else{
			db.query('SELECT user FROM admin WHERE user = ?', [user], function(err, results, fields){
				if( err ) throw err;
				if( results.length === 0 ){
					db.query('SELECT user FROM staff WHERE user = ?', [user], function(err, results, fields){
						if( err ) throw err;
						if(results.length === 0){
							db.query('INSERT INTO admin ( user ) values( ? )', [user], function(err, results, fields){
								if( err ) throw err;
								var success = 'New Admin Added Successfully!';
								res.render('upload', {addsuccess: success });
							});
						}else{
							var error = 'This user is already an Admin . Remove user from admin and try again';
							res.render('upload', {adderror: error });
						}
					});
				}
				if( results.length > 0 ){
					var error = 'This user is already an Admin';
					res.render('upload', {adderror: error });
				} 
			});
		}
	});
});

//add new admin
router.post('/addstaff', function (req, res, next) {
	var user = req.body.user;
	db.query('SELECT user_id, username FROM user WHERE user_id = ?', [user], function(err, results, fields){
		if( err ) throw err;
		if ( results.length === 0){
			var error = 'Sorry this user does not exist.';
			res.render('upload', {addstafferror: error });
		}
		else{
			db.query('SELECT user FROM staff WHERE user = ?', [user], function(err, results, fields){
				if( err ) throw err;
				if( results.length === 0 ){
					db.query('SELECT user FROM admin WHERE user = ?', [user], function(err, results, fields){
						if( err ) throw err;
						if(results.length === 0){
							db.query('INSERT INTO staff ( user ) values( ? )', [user], function(err, results, fields){
								if( err ) throw err;
								var success = 'New Admin Added Successfully!';
								res.render('upload', {addstaffsuccess: success });
							});
						}else{
							var error = 'This user is already a staff . Remove user from staff and try again';
							res.render('upload', {addstafferror: error });
						}
					});
				}
				if( results.length > 0 ){
					var error = 'This user is already an Admin';
					res.render('upload', {addstafferror: error });
				} 
			});
		}
	});
});


//delete admin
router.post('/delstaff', function (req, res, next) {
	var user = req.body.user;
	db.query('SELECT user_id, username FROM user WHERE user_id = ?', [user], function(err, results, fields){
		if( err ) throw err;
		if ( results.length === 0){
			var error = 'Sorry this user does not exist.';
			res.render('upload', {adminerror: error });
		}
		else{
			db.query('SELECT user FROM staff WHERE user = ?', [user], function(err, results, fields){
				if( err ) throw err;
				if( results.length === 0 ){
					var error = 'Sorry this staff does not exist.';
					res.render('upload', {adminerror: error });
				}
				else {
					db.query('DELETE FROM staff WHERE user = ?', [user], function(err, results, fields){
						if( err ) throw err;
						var success = 'Staff deleted successfully!'
						res.render('upload', {adminsuccess: success });
					});
				}
			});
		}
	});
});


//delete admin
router.post('/delstaff', function (req, res, next) {
	var user = req.body.user;
	db.query('SELECT user_id, username FROM user WHERE user_id = ?', [user], function(err, results, fields){
		if( err ) throw err;
		if ( results.length === 0){
			var error = 'Sorry this user does not exist.';
			res.render('upload', {adminerror: error });
		}
		else{
			db.query('SELECT user FROM admin WHERE user = ?', [user], function(err, results, fields){
				if( err ) throw err;
				if( results.length === 0 ){
					var error = 'Sorry this admin does not exist.';
					res.render('upload', {adminerror: error });
				}
				else {
					db.query('DELETE FROM admin WHERE user = ?', [user], function(err, results, fields){
						if( err ) throw err;
						var success = 'Admin deleted successfully!'
						res.render('upload', {adminsuccess: success });
					});
				}
			});
		}
	});
});


//post add category 
router.post('/addcategory',  function(req, res, next) {
	var category = req.body.category;
	var parent = req.body.parent;
	console.log( req.body );
	db.query( 'SELECT category_name FROM category WHERE category_name  = ?', [parent], function ( err, results, fields ){
	console.log( results )
		if ( results.length > 0 ){
			var error = 'This category exists already';
			res.render( 'upload', {title: 'ADD CATEGORY FAILED', childerror: error});
		}else{
			db.query('CALL addnewcategory (?, ?)', [parent, category], function(err, results, fields){
				if (err) throw err;
				var success = 'Category added.';
				res.render('upload', { title: 'IFEYSAMUEL VENTURES', childsuccess: success});
			});		
		}
	});
});


router.post('/upload', function(req, res, next) {
	//var category = req.body.category;
	if (req.url == '/upload' && req.method.toLowerCase() == 'post') {
		// parse a file upload
		var form = new formidable.IncomingForm();
		form.uploadDir = '/Users/STAIN/desktop/sites//obionyi/public/images/samples';
		form.maxFileSize = 2 * 1024 * 1024;
		form.parse(req, function(err, fields, files) {
			//var img = fields.img; 
			var category = fields.category;
			var price = fields.price;
			var description = fields.description;
			var product = fields.product;
			console.log(fields);
			var getfiles = JSON.stringify( files );
			var file = JSON.parse( getfiles );
			var oldpath = file.img.path;
			//console.log(oldpath, typeof oldpath, typeof file, file.path, typeof file.path);
			var name = file.img.name;
			form.keepExtensions = true;
			var newpath = '/Users/STAIN/desktop/sites/obionyi/public/images/samples/' + name;
			var img = '/images/samples' + name;
			form.on('fileBegin', function( name, file){
				//rename the file
				fs.rename(oldpath, newpath, function(err){
					if (err) throw err;
					//console.log('file renamed');
				});
				//secure pin for code
				securePin.generatePin(10, function(pin){
				//save in the database.
					db.query('INSERT INTO products (image, category, price, product_id, description, product_name, status) VALUES (?, ?, ?, ?, ?, ?, ?)', [img, category, price, pin, description, product, 'in stock'], function(err,results, fields){
						if (err)  throw err;
						res.render('upload', {title: 'ADMIN CORNER', uploadsuccess: 'file upladed'});
					});
				});
			});
			form.emit('fileBegin', name, file);
	    });
	}
});


//Passport login
passport.serializeUser(function(user_id, done){
  done(null, user_id)
});
        
passport.deserializeUser(function(user_id, done){
  done(null, user_id)
});

router.post('/uploadresult', function (req, res, next) {
	req.checkBody('reg_no', 'Registration number must be between 6 to 25 characters').len(6,25).trim();
	req.checkBody('session', 'Session must be between 8 to 25 characters').len(8,25).trim();
	req.checkBody('classPosition', 'The class position must be between 3  characters').len(3).trim().escape();
	req.checkBody('sub1', 'The First subject in this page should be at least 3 chararcters and a maximun of 50 characters').len(3,100).trim().escape();
	req.checkBody('CA', 'The first  CA should be between 1 to 2 numbers').len(1,2).isNumber().trim().escape();
	req.checkBody('exam', 'The first Exam  must be between 1 to 2 Numbers').len(1,2).trim().isNumber().escape();
	req.checkBody('subjectTotal', 'The first total must be between 1 to 3 Numbers').len(1,3).isNumber().trim().escape();
	req.checkBody('total', 'Total must be between 1 to 3 Numbers').len(1,3).isNumber().trim().escape();
	req.checkBody('aggregate', 'The Aggregate must be between 1 to 4 Numbers').len(1,4).isNumber().trim().escape();
	req.checkBody('position', 'The position must be between 1 to 3 characters').len(1,3).trim().escape();
	req.checkBody('aggregate', 'The Aggregate must be between 1 to 4 Numbers').len(1,4).isNumber().trim().escape();
	req.checkBody('position', 'The position must be between 1 to 3 characters').len(1,3).trim().escape();
	req.checkBody('principal', 'The Principal remark must be between 10 to 100 Numbers').len(10,100).trim().escape();
	req.checkBody('classTeacher', 'The Class Teacher must be between 10 to 100 characters').len(10,100).trim().escape();
	
	var errors = req.validationErrors();
	if (errors) { 
	
		console.log(JSON.stringify(errors));
		
		res.render('staff', { title: 'UPLOAD FAILED', errors: errors});
	}else{
		var regNo = req.body.reg_no;
		var session = req.body.session;
		var classPosition = classPosition;
		var sub1 = req.body.sub1;
		var CA = req.body.CA;
		var exam = req.body.exam;
		var subjectTotal = req.body.subjectTotal;
		var total = req.body.total;
		var aggregate = req.body.aggregate;
		var position = req.body.position;
		var principal = req.body.principal;
		var classTeacher = req.body.classTeacher;
		var term = req.body.term;
		var Class = req.body.Class;
		var grade1 = req.body.grade1;
		
		console.log(sub1);
		
		//check if the result has been uploaded before now.
		db.query('SELECT reg_no FROM result1 WHERE reg_no = ? and term = ? and session = ? and class = ?', [regNo, term, session, Class], function(err, results, fields){
			if (err) throw err;
			if(results.length > 0){
				var error = 'Its seems you have uploaded this result before';
				req.flash('error', error);
				res.redirect('/staff');
			}else{
				//get the full name.
				db.query('SELECT full_name, DOB FROM students WHERE reg_no = ?', [regNo], function(err, results, fields){
					if (err) throw err;
					if(results.length === 0){
						var error = 'This registration number does not exist in the database.';
						req.flash('error', error);
						res.redirect('/staff');
					}else{
						var fullname = results[0].full_name;
						var DOB = resullts[0].DOB;
						var thisyear = new Date().getFullYear();
						var thatyear = DOB.getFullYear();
						var age = thatyear - thisyear;
						console.log(age);
						//get the staff that uploaded.
						var currentUser  = req.session.passport.user.user_id;
						db.query('SELECT full_name FROM user WHERE user_id =  ?', function(err, results, fields){
							if( err ) throw err;
							var staff = results[0].full_name;
							//loop and insert it.
							for(var i  = 0; i < subjects.length; i++){
								db.query('INSERT INTO result1 (age, reg_no, full_name, class,  uploaded_by, session, term, subject, grade, CA, position, exam, total) VALUES( ?,?,?,?,?,?,?,?,?,?,?,?,? )', [age, regNo, fullname, Class, staff, session, term, sub1[i], grade1[i], CA[i], classPosition[i], exam[i], subjectTotal[i] ], function( err, results, fields){
									if( err ) throw err;
									//enter into the next database which is result2
									db.query('INSERT INTO result2 (class, reg_no, full_name, uploaded_by, session, term, position, aggregate, total, teachers_remark, principals_remark) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)', [Class, regNo, fullname, staff, session, term, position, aggregate, total, principal, classTeacher], function( err, resullts, fields){
										if( err ) throw err;
										var success = "Congrats" + staff + ", you have uploaded" + fullname + "'s result successfully";
										req.flash('success', success);
										res.redirect('/staff');
									});
								});
							}
						});
					}
				});
			}
		});
	}
});



//post the register
//var normal = require( '../functions/normal.js' );
router.post('/register', function (req, res, next) {
	req.checkBody('username', 'Username must be between 8 to 25 characters').len(8,25).trim().escape();
	req.checkBody('fullname', 'Full Name must be between 8 to 25 characters').len(8,25).trim().escape();
	req.checkBody('pass1', 'Password must be between 8 to 25 characters').len(8,100).trim().escape();
	req.checkBody('pass2', 'Password confirmation must be between 8 to 100 characters').len(8,100).trim().escape();
	req.checkBody('email', 'Email must be between 8 to 105 characters').len(8,105);
	req.checkBody('email', 'Invalid Email').isEmail();
	req.checkBody('code', 'Country Code must not be empty.').notEmpty().trim().escape();
	req.checkBody('pass1', 'Password must match').equals(req.body.pass2).trim().escape();
	req.checkBody('phone', 'Phone Number must be ten characters').len(10).trim().escape();
  
	var username = req.body.username;
	var password = req.body.pass1;
	var cpass = req.body.pass2;
	var email = req.body.email;
	var fullname = req.body.fullname;
	var code = req.body.code;
	var phone = req.body.phone;

	var errors = req.validationErrors();
	if (errors) { 
	
		console.log(JSON.stringify(errors));
  
		res.render('register', { title: 'REGISTRATION FAILED', errors: errors, username: username, email: email, phone: phone, password: password, cpass: cpass, fullname: fullname, code: code});
	}else{
		db.query('SELECT username FROM user WHERE username = ?', [username], function(err, results, fields){
          	if (err) throw err;
			
          	if(results.length===1){
          		var error = "Sorry, this username is taken";
				console.log(error);
				res.render('register', {title: "REGISTRATION FAILED", error: error, username: username, email: email, phone: phone, password: password, cpass: cpass, fullname: fullname, code: code});
          	}else{
				//check the email
				db.query('SELECT email FROM user WHERE email = ?', [email], function(err, results, fields){
          			if (err) throw err;
          			if(results.length===1){
          				var error = "Sorry, this email is taken";
            			console.log(error);
						res.render('register', {title: "REGISTRATION FAILED", error: error, username: username, email: email, phone: phone, password: password, cpass: cpass, fullname: fullname, code: code});
            		}else{
						bcrypt.hash(password, saltRounds, null, function(err, hash){
							db.query( 'INSERT INTO user (full_name, phone, username, email, code, password) VALUES(?,  ?, ?, ?, ?, ?)', [ fullname, phone, username, email, code, hash], function(err, result, fields){
								if (err) throw err;
								var success = 'Successful registration';
								res.render('register', {title: 'REGISTRATION SUCCESSFUL!', success: success});
							});
						});
					}
				});
			}
		});
	}
});

//fix secure pin
function pinset(amount){
	var charSet = new securePin.CharSet(); 
	charSet.addLowerCaseAlpha().addUpperCaseAlpha().addNumeric().randomize();
	
	for(var i = 0; i < amount; i++){
	
		securePin.generateString(10, charSet, function(str){
			var pin = 'S' + str + 'SC';
			securePin.generateString(4, charSet, function(str){
				var serial = 'ssc' + str;
				//insert into the database
				db.query( 'INSERT INTO pins (pin, serial) VALUES(?, ?)', [pin, serial], function(err, result, fields){
					if (err) throw err;
				});
			});
		});
	}
}

//pinset(50)

router.get('/404', function(req, res, next) {
  res.render('404', {title: 'PAGE NOT FOUND', message: 'Ooops  since you got lost somehow but i am here to catch you. see our quick links.'});
});
router.get( '*', function ( req, res, next ){
	res.redirect( '/404' )
});
module.exports = router;