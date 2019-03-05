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
var path = require('path');
var url = require('url'); 
//var routeValidator = require( 'express-route-validator' );


//get home 
router.get('/',  function(req, res, next) {
	res.redirect('/pages/1');
});

/* GET home page. */
router.get('/pages/:page', function ( req, res, next ){
	
});


//ensureLoggedIn( '/login' ),
//get upload
router.get('/admin',  function(req, res, next) {
	//get the category.
	db.query('SELECT category_name FROM category', function(err, results, fields){
		if(err) throw err;
		var category = results;
		res.render('upload', {title: 'ADMIN CORNER', category: category});
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

//post add new category never existed.
router.post('/newcat', function(req, res, next) {
	var category = req.body.category;
	db.query( 'SELECT category_name FROM category WHERE category_name  = ?', [category], function ( err, results, fields ){
	console.log( results )
		if ( results.length === 0 ){
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
  successReturnToOrRedirect: '/admin',
  failureFlash: true
}));

//post add category 
router.post('/addcategory',  function(req, res, next) {
	var category = req.body.category;
	var parent = req.body.parent;
	console.log( req.body );
	db.query( 'SELECT category_name FROM category WHERE category_name  = ?', [parent], function ( err, results, fields ){
	console.log( results )
		if ( results.length === 0 ){
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
	var img = req.body.img;
	var category = req.body.category;
	var price = req.body.price;
	var description = req.body.description;
	product = req.body.product;
	
	//var category = req.body.category;
	if (req.url == '/upload' && req.method.toLowerCase() == 'post') {
		// parse a file upload
		var form = new formidable.IncomingForm();
		form.parse(req, function(err, fields, files) {
			if (err) throw err;
					var filed =  JSON.stringify(files.img);
					var file  =  JSON.parse( filed );
					var name  =  file.name;
					console.log( file );
					form.on('fileBegin', function(name, file) {
						var newpath =  '/Users/STAIN/desktop/sites/obionyi/public/images/samples/' + file.name;
						var oldpath  =  file.path;
						var type  =  file.type;
						var size  =  file.size;
						var oldfile  =  path.basename(oldpath);
						//console.log(newfile + 'is the new file');
						//change the file name
						console.log(newpath);
						//if the type is not supported.
						var supported  =  {
							png: 'image/png',
							jpg: 'image/jpg',
							jpeg: 'image/jpeg'
						}
						if( type  == supported.png || type == supported.jpg || type == supported.jpeg){
							//console.log( 'file is supported', typeof supported.jpeg, typeof type, supported.jpeg === type, supported.jpeg == type);
							//check the size
							if( size > 3000000 ){
								var error = 'This file is too big. the maximum file size is 3mb.'
								//console.log( 'file too big' )
								//delete the file
								fs.unlink('oldpath', function(err){
									if(err) throw err;
									res.render('upload', {title: 'FILE UPLOAD FAILED', error: error});
								});
							}else{
								
								// move the file.
								fs.rename(oldpath, newpath, function( err ){
									if( err ) throw err;
									console.log( 'file moved' );
									securePin.generatePin(10, function(pin){
										//insert joor
										var product_id = pin;
										db.query('INSERT INTO products (price, category, product_name, image, product_id, status) values (?, ?, ?, ?, ?, ?)', [price, category, product, newpath, product_id, 'instock'], function(err, results, fields){
											if (err) throw err;
											var success = 'Product added successfully';
											res.render('upload', {title: 'FILE UPLOAD SUCCESSFUL', success: success});
										});
									});
								});
							}
						}else{
							//console.log( 'is not supported' );
							var error = 'This file is not supported. Use a jpg or png or jpeg file.';
							res.render('upload', {title: 'FILE UPLOAD FAILED', error: error});
						}
					});
					form.emit( 'fileBegin', name, file );
		});
	}
});

//post the register
//var normal = require( '../functions/normal.js' );
router.post('/register', function (req, res, next) {
	req.checkBody('username', 'Username must be between 8 to 25 characters').len(8,25);
	req.checkBody('fullname', 'Full Name must be between 8 to 25 characters').len(8,25);
	req.checkBody('pass1', 'Password must be between 8 to 25 characters').len(8,100);
	req.checkBody('pass2', 'Password confirmation must be between 8 to 100 characters').len(8,100);
	req.checkBody('email', 'Email must be between 8 to 105 characters').len(8,105);
	req.checkBody('email', 'Invalid Email').isEmail();
	req.checkBody('code', 'Country Code must not be empty.').notEmpty();
	req.checkBody('pass1', 'Password must match').equals(req.body.pass2);
	req.checkBody('phone', 'Phone Number must be ten characters').len(10);
  
	var username = req.body.username;
	var password = req.body.pass1;
	var cpass = req.body.pass2;
	var email = req.body.email;
	var fullname = req.body.fullname;
	var code = req.body.code;
	var phone = req.body.phone;
	var sponsor = req.body.sponsor;

	var errors = req.validationErrors();
	if (errors) { 
	
		console.log(JSON.stringify(errors));
  
		res.render('register', { title: 'REGISTRATION FAILED', errors: errors, username: username, email: email, phone: phone, password: password, cpass: cpass, fullname: fullname, code: code, sponsor: sponsor});
	}else{
		db.query('SELECT username FROM user WHERE username = ?', [username], function(err, results, fields){
          	if (err) throw err;
			
          	if(results.length===1){
          		var error = "Sorry, this username is taken";
				console.log(error);
				res.render('register', {title: "REGISTRATION FAILED", error: error, username: username, email: email, phone: phone, password: password, cpass: cpass, fullname: fullname, code: code,  sponsor: sponsor});
          	}else{
				//check the email
				db.query('SELECT email FROM user WHERE email = ?', [email], function(err, results, fields){
          			if (err) throw err;
          			if(results.length===1){
          				var error = "Sorry, this email is taken";
            			console.log(error);
						res.render('register', {title: "REGISTRATION FAILED", error: error, username: username, email: email, phone: phone, password: password, cpass: cpass, fullname: fullname, code: code,  sponsor: sponsor});
            		}else{
						bcrypt.hash(password, saltRounds, null, function(err, hash){
							db.query( 'INSERT INTO user (full_name, phone, username, email, code, password, verification)(?, ?, ?, ?, ?, ?, ?)', [ fullname, phone, username, email, code, hash, 'no'], function(err, result, fields){
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

router.get('/404', function(req, res, next) {
  res.render('404', {title: 'PAGE NOT FOUND', message: 'Ooops  since you got lost somehow but i am here to catch you. see our quick links.'});
});
router.get( '*', function ( req, res, next ){
	res.redirect( '/404' )
});
module.exports = router;