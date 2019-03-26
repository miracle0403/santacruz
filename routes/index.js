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
	res.render('index', {title: 'SANCTA CRUX'});
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
			res.render('staff', {staff: staff, title: 'ADD RESULT'});
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
	req.checkBody('classPosition', 'The first class position must be between 3  characters').len(3).trim().escape();
	req.checkBody('sub1', 'The First subject in this page should be at least 3 chararcters and a maximun of 50 characters').len(3,100).trim().escape();
	req.checkBody('CA', 'The first  CA should be between 1 to 2 numbers').len(1,2).isNumber().trim().escape();
	req.checkBody('exam', 'The first Exam  must be between 1 to 2 Numbers').len(1,2).trim().isNumber().escape();
	req.checkBody('subjectTotal', 'The first total must be between 1 to 3 Numbers').len(1,3).isNumber().trim().escape();
	req.checkBody('classPosition2', 'The Second class position must be between 3  characters').len(3).trim().escape();
	req.checkBody('sub2', 'The Second subject in this page should be at least 3 chararcters and a maximun of 50 characters').len(3,100).trim().escape();
	req.checkBody('CA2', 'The Second  CA should be between 1 to 2 numbers').len(1,2).isNumber().trim().escape();
	req.checkBody('exam2', 'The second Exam  must be between 1 to 2 Numbers').len(1,2).trim().isNumber().escape();
	req.checkBody('subjectTotal2', 'The second total must be between 1 to 3 Numbers').len(1,3).isNumber().trim().escape();
	req.checkBody('classPosition3', 'The third class position must be between 3  characters').len(3).trim().escape();
	req.checkBody('sub3', 'The third subject in this page should be at least 3 chararcters and a maximun of 50 characters').len(3,100).trim().escape();
	req.checkBody('CA3', 'The third  CA should be between 1 to 2 numbers').len(1,2).isNumber().trim().escape();
	req.checkBody('exam3', 'The third Exam  must be between 1 to 2 Numbers').len(1,2).trim().isNumber().escape();
	req.checkBody('subjectTotal3', 'The third total must be between 1 to 3 Numbers').len(1,3).isNumber().trim().escape();
	req.checkBody('classPosition4', 'The fourth class position must be between 3  characters').len(3).trim().escape();
	req.checkBody('sub4', 'The fourth subject in this page should be at least 3 chararcters and a maximun of 50 characters').len(3,100).trim().escape();
	req.checkBody('CA4', 'The fourth  CA should be between 1 to 2 numbers').len(1,2).isNumber().trim().escape();
	req.checkBody('exam4', 'The fourth Exam  must be between 1 to 2 Numbers').len(1,2).trim().isNumber().escape();
	req.checkBody('subjectTotal4', 'The fourth total must be between 1 to 3 Numbers').len(1,3).isNumber().trim().escape();
	req.checkBody('classPosition5', 'The fifth class position must be between 3  characters').len(3).trim().escape();
	req.checkBody('sub5', 'The fifth subject in this page should be at least 3 chararcters and a maximun of 50 characters').len(3,100).trim().escape();
	req.checkBody('CA5', 'The fifth  CA should be between 1 to 2 numbers').len(1,2).isNumber().trim().escape();
	req.checkBody('exam5', 'The fifth Exam  must be between 1 to 2 Numbers').len(1,2).trim().isNumber().escape();
	req.checkBody('subjectTotal5', 'The fifth total must be between 1 to 3 Numbers').len(1,3).isNumber().trim().escape();
	req.checkBody('classPosition6', 'The sixth class position must be between 3  characters').len(3).trim().escape();
	req.checkBody('sub6', 'The sixth subject in this page should be at least 3 chararcters and a maximun of 50 characters').len(3,100).trim().escape();
	req.checkBody('CA6', 'The sixth  CA should be between 1 to 2 numbers').len(1,2).isNumber().trim().escape();
	req.checkBody('exam6', 'The sixth Exam  must be between 1 to 2 Numbers').len(1,2).trim().isNumber().escape();
	req.checkBody('subjectTotal6', 'The sixth total must be between 1 to 3 Numbers').len(1,3).isNumber().trim().escape();
	req.checkBody('classPosition7', 'The seventh class position must be between 3  characters').len(3).trim().escape();
	req.checkBody('sub7', 'The seventh subject in this page should be at least 3 chararcters and a maximun of 50 characters').len(3,100).trim().escape();
	req.checkBody('CA7', 'The seventh  CA should be between 1 to 2 numbers').len(1,2).isNumber().trim().escape();
	req.checkBody('exam7', 'The seventh Exam  must be between 1 to 2 Numbers').len(1,2).trim().isNumber().escape();
	req.checkBody('subjectTotal7', 'The seventh total must be between 1 to 3 Numbers').len(1,3).isNumber().trim().escape();
	req.checkBody('classPosition8', 'The eighth class position must be between 3  characters').len(3).trim().escape();
	req.checkBody('sub8', 'The eighth subject in this page should be at least 3 chararcters and a maximun of 50 characters').len(3,100).trim().escape();
	req.checkBody('CA8', 'The eighth  CA should be between 1 to 2 numbers').len(1,2).isNumber().trim().escape();
	req.checkBody('exam8', 'The eighth Exam  must be between 1 to 2 Numbers').len(1,2).trim().isNumber().escape();
	req.checkBody('subjectTotal8', 'The eighth total must be between 1 to 3 Numbers').len(1,3).isNumber().trim().escape();
	req.checkBody('classPosition9', 'The ninth class position must be between 3  characters').len(3).trim().escape();
	req.checkBody('sub9', 'The ninth subject in this page should be at least 3 chararcters and a maximun of 50 characters').len(3,100).trim().escape();
	req.checkBody('CA9', 'The ninth  CA should be between 1 to 2 numbers').len(1,2).isNumber().trim().escape();
	req.checkBody('exam9', 'The ninth Exam  must be between 1 to 2 Numbers').len(1,2).trim().isNumber().escape();
	req.checkBody('subjectTotal9', 'The ninth total must be between 1 to 3 Numbers').len(1,3).isNumber().trim().escape();
	req.checkBody('classPosition10', 'The tenth class position must be between 3  characters').len(3).trim().escape();
	req.checkBody('sub10', 'The tenth subject in this page should be at least 3 chararcters and a maximun of 50 characters').len(3,100).trim().escape();
	req.checkBody('CA10', 'The tenth  CA should be between 1 to 2 numbers').len(1,2).isNumber().trim().escape();
	req.checkBody('exam10', 'The tenth Exam  must be between 1 to 2 Numbers').len(1,2).trim().isNumber().escape();
	req.checkBody('subjectTotal10', 'The tenth total must be between 1 to 3 Numbers').len(1,3).isNumber().trim().escape();
	req.checkBody('classPosition11', 'The eleventh class position must be between 3  characters').len(3).trim().escape();
	req.checkBody('sub11', 'The eleventh subject in this page should be at least 3 chararcters and a maximun of 50 characters').len(3,100).trim().escape();
	req.checkBody('CA11', 'The eleventh  CA should be between 1 to 2 numbers').len(1,2).isNumber().trim().escape();
	req.checkBody('exam11', 'The eleventh Exam  must be between 1 to 2 Numbers').len(1,2).trim().isNumber().escape();
	req.checkBody('subjectTotal11', 'The eleventh total must be between 1 to 3 Numbers').len(1,3).isNumber().trim().escape();
	req.checkBody('total', 'Total must be between 1 to 3 Numbers').len(1,3).isNumber().trim().escape();
	req.checkBody('aggregate', 'The Aggregate must be between 1 to 4 Numbers').len(1,4).isNumber().trim().escape();
	req.checkBody('position', 'The position must be between 1 to 3 characters').len(1,3).trim().escape();
	req.checkBody('aggregate', 'The Aggregate must be between 1 to 4 Numbers').len(1,4).isNumber().trim().escape();
	req.checkBody('position', 'The position must be between 1 to 3 characters').len(1,3).trim().escape();
	req.checkBody('principal', 'The Principal remark must be between 10 to 100 Numbers').len(10,100).trim().escape();
	req.checkBody('classTeacher', 'The Class Teacher must be between 10 to 100 characters').len(10,100).trim().escape();
	
	var regNo = req.body.reg_no;
	var session = req.body.session;
	var classPosition = classPosition;
	var sub1 = req.body.sub1;
	var CA = req.body.CA;
	var exam = req.body.exam;
	var subjectTotal = req.body.subjectTotal;
	var classPosition2 = classPosition2;
	var sub2 = req.body.sub2;
	var CA2 = req.body.CA2;
	var exam2 = req.body.exam2;
	var subjectTotal2 = req.body.subjectTotal2;
	var classPosition3 = classPosition3;
	var sub3 = req.body.sub3;
	var CA3 = req.body.CA3;
	var exam3 = req.body.exam3;
	var subjectTotal3 = req.body.subjectTotal3;
	var classPosition4 = classPosition4;
	var sub4 = req.body.sub4;
	var CA4 = req.body.CA4;
	var exam4 = req.body.exam4;
	var subjectTotal4 = req.body.subjectTotal4;
	var classPosition5 = classPosition5;
	var sub5 = req.body.sub5;
	var CA5 = req.body.CA5;
	var exam5 = req.body.exam5;
	var subjectTotal5 = req.body.subjectTotal5;
	var classPosition6 = classPosition6;
	var sub6 = req.body.sub6;
	var CA6 = req.body.CA6;
	var exam6 = req.body.exam6;
	var subjectTotal6 = req.body.subjectTotal6;
	var classPosition7 = classPosition7;
	var sub7 = req.body.sub7;
	var CA7 = req.body.CA7;
	var exam7 = req.body.exam7;
	var subjectTotal7 = req.body.subjectTotal7;
	var classPosition8 = classPosition8;
	var sub8 = req.body.sub8;
	var CA8 = req.body.CA8;
	var exam8 = req.body.exam8;
	var subjectTotal8 = req.body.subjectTotal8;
	var classPosition9 = classPosition9;
	var sub9 = req.body.sub9;
	var CA9 = req.body.CA9;
	var exam9 = req.body.exam9;
	var subjectTotal9 = req.body.subjectTotal9;
	var classPosition10 = classPosition10;
	var sub10 = req.body.sub10;
	var CA10 = req.body.CA10;
	var exam10 = req.body.exam10;
	var subjectTotal10 = req.body.subjectTotal10;
	var classPosition11 = classPosition11;
	var sub11 = req.body.sub11;
	var CA11 = req.body.CA11;
	var exam11 = req.body.exam11;
	var subjectTotal11 = req.body.subjectTotal11;
	var total = req.body.total;
	var aggregate = req.body.aggregate;
	var position = req.body.position;
	var principal = req.body.principal;
	var classTeacher = req.body.classTeacher;
	var term = req.body.term;
	var Class = req.body.Class;
	var sujects = [sub1, sub2, sub3, sub4, sub5, sub6, sub7, sub8, sub9, sub10, sub11];
	var grades = [grade1, grade2, grade3, grade4, grade5, grade6, grade7, grade8, grade9, grade10, grade11];
	
	var errors = req.validationErrors();
	if (errors) { 
	
		console.log(JSON.stringify(errors));
  
		res.render('staff', { title: 'UPLOAD UNSUCCESSFUL', errors: errors});
	}else{
		//check if the result has been uploaded before now.
		db.query('SELECT reg_no FROM result1 WHERE reg_no = ? and term = ? and session = ? and class = ?', [regNo, term, session, Class], function(err, results, fields){
			if (err) throw err;
			if(results.length > 0){
				var error = 'Its seems you have uploaded this result before';
				res.render('staff', { title: 'UPLOAD UNSUCCESSFUL', error: error});
			}else{
				//get the full name.
				db.query('SELECT full_name FROM user WHERE reg_no = ?', [regNo], function(err, results, fields){
					if (err) throw err;
					if(results.length === 0){
						var error = 'This registration number does not exist in the database.';
						res.render('staff', { title: 'UPLOAD UNSUCCESSFUL', error: error});
					}else{
						var fullname = results[0].full_name;
						//insert it 
						
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