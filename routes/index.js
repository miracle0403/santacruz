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



/*
var messages = res.locals.getMessages();
	if( messages.notify ){
		console.log( messages.notify );
		res.render('index', {title: 'SANCTA CRUX', ShowMessage: true, messages: messages.notify});
	}else{
		console.log( 'no notify' );
		res.render('index', {title: 'SANCTA CRUX'});
	}
	
*/

//get home 
router.get('/',  function(req, res, next) {
	db.query('SELECT * FROM site_settings', function(err, results, fields){
		if(err) throw err;
		if(results.length === 0){
			res.redirect('/welcome');
		}else{
			var site_settings = {
				name: results[0].name,
				slug: results[0].slug,
				url: results[0].url,
				description: results[0].description
			}
			if(req.isAuthenticated()){
				var currentUser = req.session.passport.user.user_id;
				//check if user is a admin.
				db.query('SELECT user FROM admin WHERE user = ?', [currentUser], function(err, results, fields){
					if(err) throw err;
					if(results.length === 0){
						db.query('SELECT user FROM staff WHERE user = ?', [currentUser], function(err, results, fields){
							if(err) throw err;
							if(results.length === 0){
								res.render('index', {subtitle: site_settings.name, title: site_settings.name, slug: site_settings.slug, description: site_settings.description});
							}else{
								res.render('index', {subtitle: site_settings.name, title: site_settings.name, staff: results[0].user, slug: site_settings.slug, description: site_settings.description});
							}
						});
					}else{
						res.render('index', {subtitle: site_settings.name, title: site_settings.name, slug: site_settings.slug, description: site_settings.description, admin: results[0].user});
					}
				});
			}else{
				res.render('index', {subtitle: site_settings.name, title: site_settings.name, slug: site_settings.slug, description: site_settings.description});
			}
		}
	});
});

//get home 
router.get('/fees', ensureLoggedIn('/login'), function(req, res, next) {
	db.query('SELECT * FROM site_settings', function(err, results, fields){
		if(err) throw err;
		if(results.length === 0){
			res.redirect('/welcome');
		}else{
			var site_settings = {
				name: results[0].name,
				slug: results[0].slug,
				url: results[0].url,
				description: results[0].description
			}
			if(req.isAuthenticated()){
				var currentUser = req.session.passport.user.user_id;
				//check if user is a admin.
				db.query('SELECT user FROM admin WHERE user = ?', [currentUser], function(err, results, fields){
					if(err) throw err;
					if(results.length === 0){
						db.query('SELECT user FROM staff WHERE user = ?', [currentUser], function(err, results, fields){
							if(err) throw err;
							if(results.length === 0){
								res.render('fees', {subtitle: 'ADD FEES', title: site_settings.name, slug: site_settings.slug, description: site_settings.description});
							}else{
								res.render('fees', {subtitle: 'ADD FEES', title: site_settings.name, slug: site_settings.slug, description: site_settings.description, staff: results[0].user});
							}
						});
					}else{
						res.render('fees', {subtitle: 'ADD FEES', title: site_settings.name, slug: site_settings.slug, description: site_settings.description, admin: results[0].user});
					}
				});
			}else{
				res.render('fees', {title: 'SANCTA CRUX'});
			}
		}
	});
});


router.get('/students', ensureLoggedIn('/login'), function(req, res, next){
	var currentUser = req.session.passport.user.user_id;
	db.query('SELECT user FROM admin WHERE user = ?', [currentUser], function(err, results, fields){
		if(err) throw err;
		if(results.length === 0){
			res.redirect('/404');
		}else{
			var admin = currentUser;
			var messages = res.locals.getMessages();
			if( messages.error){
				res.render('students', {title: 'ADD NEW STUDENT', ShowMessage: true, error: messages.error, admin: admin});
			}else{
				if( messages.success){
					res.render('students', {title: 'ADD NEW STUDENT', ShowMessage: true, success: messages.success, admin: admin});
				}else{
					res.render('students', {title: 'ADD NEW STUDENT', admin: admin});
				}
			}
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
	db.query('SELECT * FROM site_settings', function(err, results, fields){
		if(err) throw err;
		if(results.length === 0){
			res.redirect('/welcome');
		}else{
			var site_settings = {
				name: results[0].name,
				slug: results[0].slug,
				url: results[0].url,
				description: results[0].description
			}
			var flashMessages = res.locals.getMessages( );
			if( flashMessages.error ){
				res.render( 'login', {
					subtitle: 'LOGIN',
					showErrors: true,
					errors: flashMessages.error
				});
			}else{
				res.render('login', { subtitle: 'LOG IN', title: site_settings.name, slug: site_settings.slug, description: site_settings.description});
			}
		}
	});
});


//register get request
router.get('/register', function(req, res, next) {
	db.query('SELECT * FROM site_settings', function(err, results, fields){
		if(err) throw err;
		if(results.length === 0){
			res.redirect('/welcome');
		}else{
			var site_settings = {
				name: results[0].name,
				slug: results[0].slug,
				url: results[0].url,
				description: results[0].description
			}
			res.render('register',  {subtitle: 'REGISTRATION', title: site_settings.name, slug: site_settings.slug, description: site_settings.description});
		}
	});
});

//welcome get request
router.get('/welcome', function(req, res, next) {	
    res.render('welcome',  { title: 'WELCOME PAGE'});
});

//check-result get request
router.get('/check-result', function(req, res, next) {
	db.query('SELECT * FROM site_settings', function(err, results, fields){
		if(err) throw err;
		if(results.length === 0){
			res.redirect('/welcome');
		}else{
			var site_settings = {
				name: results[0].name,
				slug: results[0].slug,
				url: results[0].url,
				description: results[0].description
			}
			res.render('checkResult',  {subtitle: 'CHECK RESULT', title: site_settings.name, slug: site_settings.slug, description: site_settings.description});
		}
	});
});


//check-result get request
router.post('/checkresult', function(req, res, next) {	
    req.checkBody('reg_no', 'Registration number must be between 6 to 25 characters').len(6,25).trim();
	req.checkBody('session', 'Session must be between 8 to 25 characters').len(8,25).trim();
	req.checkBody('term', 'Term must be 3 characters').len(3).trim();
	req.checkBody('pin', 'Pin must be between 10 to 30 characters').len(10,30).trim().escape();
	
	var errors = req.validationErrors();
	if (errors) { 
	
		console.log(JSON.stringify(errors));
  
		res.render('checkResult', { title: 'CHECK RESULT FAILED', errors: errors});
	}else{
		var reg_no = req.body.reg_no;
		var term = req.body.term;
		var pin = req.body.pin;
		var session = req.body.session;
		
		db.query('SELECT reg_no FROM students WHERE reg_no = ?', [reg_no], function(err, results, fields){
			if(err) throw err;
			if(results.length === 0){
				var error = 'This reg number does not exist.';
				req.flash('regerror', error);
				res.redirect('/check-result');
			}else{
				//check if the user has been blocked before.
				db.query('SELECT reg_no FROM pin_barred WHERE reg_no = ?', [reg_no], function(err, results, fields){
					if(err) throw err;
					if(results.length > 0){
						var error = 'You have been barred from using this service. Please contact our support for more details.';
						req.flash('regerror', error);
						res.redirect('/check-result');
					}else{
						//check if the pin exists.
						db.query('SELECT pin FROM pins WHERE pin = ?', [pin], function(err, results, fields){
							if(err) throw err;
							if(results.length === 0){
								//check the number of times
								db.query('SELECT reg_no, times_entered, date_entered FROM pin_restrict WHERE reg_no = ?', [reg_no], function(err, results, fields){
									if(err) throw err;
									var amo = results.slice(-1)[0];
									var amount = amo.times_entered;
									
									var last_date = amo.last_date;
									var now = new Date();
									var distance = last_date - now;
									var days = Math.floor(distance /(1000 * 60 * 60 * 24));
									var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
							  		var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
							  		var seconds = Math.floor((distance % (1000 * 60)) / 1000);
							
									var timeout = 20;
									if(days > 0){
										//start afresh
										db.query('INSERT INTO pin_restrict (reg_no, pin, times_entered, date_entered) VALUES(?,?,?,?)', [reg_no, pin, 0, now], function(err, results, fields){
											if(err) throw err;
											var left = 4;
											var error = 'This pin is incorrect. You will be barred if you try a wrong or used pin ' + left + ' more times';
											req.flash('regerror', error);
											res.redirect('/check-result');
										});
									}else{
										if(hours > 0){
											//start afresh
											db.query('INSERT INTO pin_restrict (reg_no, pin, times_entered, date_entered) VALUES(?,?,?,?)', [reg_no, pin, 0, now], function(err, results, fields){
												if(err) throw err;
												var left = 4;
												var error = 'This pin is incorrect. You will be barred if you try a wrong or used pin ' + left + ' more times';
												req.flash('regerror', error);
												res.redirect('/check-result');
											});
										}else{
											if(minutes > 30){
												db.query('INSERT INTO pin_restrict (reg_no, pin, times_entered, date_entered) VALUES(?,?,?,?)', [reg_no, pin, 0, now], function(err, results, fields){
													if(err) throw err;
													var left = 4;
													var error = 'This pin is incorrect. You will be barred if you try a wrong or used pin ' + left + ' more times';
													req.flash('regerror', error);
													res.redirect('/check-result');
												});
											}else{
												if(minutes < 30){
													var remain = amount + 1;
													db.query('INSERT INTO pin_restrict (reg_no, pin, times_entered, date_entered) VALUES(?,?,?,?)', [reg_no, pin, remain, now], function(err, results, fields){
														if(err) throw err;
														if (remain === 5){
															db.query('INSERT INTO pin_barred (reg_no, date_barred) VALUES(?,?)', [reg_no, now], function(err, results, fields){
																if(err) throw err;
																var error = 'This pin is incorrect. You have been barred from using this service. Contact us for more details.';
																req.flash('regerror', error);
																res.redirect('/check-result');
															});
														}else{
															var left = amount - remain
															var error = 'This pin is incorrect. You will be barred if you try a wrong or used pin ' + left + ' more times';
															req.flash('regerror', error);
															res.redirect('/check-result');
														}														
													});													 
												}
											}
										}
									}
								});
							}else{
								//if pin exist, check the amount of times it should be used.
								db.query('SELECT * FROM pin_settings', function(err, results, fields){
									if(err) throw err;
									if(results.length === 0){
										var error = 'Something Went Wrong. That is all we know. Contact us to fix this ASAP';
										req.flash('regerror', error);
										res.redirect('/check-result');
									}else{
										var pin_settings = {
											fees_restriction: results[0].fees_restriction,
											times_used: results[0].times_used,
											fees_consider: results[0].fees_consider
										}
										if(pin_settings.fees_restriction === 'NO'){
										//YES MEANS NO SCHOOL FEES NO RESULT
											db.query('SELECT * FROM pin_entrance WHERE pin = ?',[pin], function(err, results, fields){
												if(err) throw err;											
												if(results.length ===0){
													db.query('INSERT INTO pin_entrance (reg_no, pin, term, session, times_used) VALUES(?,?,?,?,?)', [reg_no, pin, term, session, 1], function(err, results, fields){
														if(err) throw err;
														var success = 'Welcome! You have used your pin Once';
														req.flash('regsuccess', success);
														res.redirect('/result/' + reg_no + '/' + session + '/' + term );
													});
												}else{
													var pin_entrance = {
														reg_no: results[0].reg_no,
														times_used: result[0].times_used,
														session: results[0].session,
														term: results[0].term,
														pin: results[0].pin,
														date_used: result[0].date_used
													}
													
													if(reg_no !== pin_entrance.reg_no){
														var error = 'This pin has been used by someone else!';
														req.flash('regerror', error);
														res.redirect('/check-result');
													}else{
														var left = pin_settings.times_used - pin_entrance.times_used;
														if(left === 0){
															var error = 'You can not use this pin again. Please get a  new pin to continue using thiis service.';
															req.flash('regerror', error);
															res.redirect('/check-result');
														}else{
															if(session === pin_entrance.session &&  term === pin_entrance.term){
																var remain = pin_entrance.times_used + 1;
																db.query('UPDATE pin_entrance SET times_used = ? WHERE pin = ?', [remain, pin], function(err, results, fields){
																	if(err) throw err;
																	var success = 'Welcome! You have used your pin ' + remain + ' times';
																	req.flash('regsuccess', success);
																	res.redirect('/result/' + reg_no + '/' + session + '/' + term );
																});
															}else{
																var error = 'Ooops! This pin was not used for either the term or the session. Please try again.';
																req.flash('regerror', error);
																res.redirect('/check-result');
															}
														}
													}
												}
											});
										}else{
											//get the students balance
											db.query('SELECT * FROM result_eligible WHERE reg_no = ? and session = ? and term = ?', [reg_no, session, term],  function(err, results, fields){
												if(err) throw err;									
												if(results.length  === 0){
													var error = 'It seems you have not paid completed this term school fees and as a result, we can not show you your result. If you think this is a mistake please contact us ASAP and we will rectify it immediately.';
													req.flash('regerror', error);
													res.redirect('/check-result');
												}else{
													db.query('SELECT * FROM pin_entrance WHERE pin = ?',[pin], function(err, results, fields){
														if(err) throw err;											
														if(results.length ===0){
															db.query('INSERT INTO pin_entrance (reg_no, pin, term, session, times_used) VALUES(?,?,?,?,?)', [reg_no, pin, term, session, 1], function(err, results, fields){
																if(err) throw err;
																var success = 'Welcome! You have used your pin Once';
																req.flash('regsuccess', success);
																res.redirect('/result/' + reg_no + '/' + session + '/' + term );
															});
														}else{
															var pin_entrance = {
																reg_no: results[0].reg_no,
																times_used: result[0].times_used,
																session: results[0].session,
																term: results[0].term,
																pin: results[0].pin,
																date_used: result[0].date_used
															}
															
															if(reg_no !== pin_entrance.reg_no){
																var error = 'This pin has been used by someone else!';
																req.flash('regerror', error);
																res.redirect('/check-result');
															}else{
																var left = pin_settings.times_used - pin_entrance.times_used;
																if(left === 0){
																	var error = 'You can not use this pin again. Please get a  new pin to continue using thiis service.';
																	req.flash('regerror', error);
																	res.redirect('/check-result');
																}else{
																	if(session === pin_entrance.session &&  term === pin_entrance.term){
																		var remain = pin_entrance.times_used + 1;
																		db.query('UPDATE pin_entrance SET times_used = ? WHERE pin = ?', [remain, pin], function(err, results, fields){
																			if(err) throw err;
																			var success = 'Welcome! You have used your pin ' + remain + ' times';
																			req.flash('regsuccess', success);
																			res.redirect('/result/' + reg_no + '/' + session + '/' + term );
																		});
																	}else{
																		var error = 'Ooops! This pin was not used for either the term or the session. Please try again.';
																		req.flash('regerror', error);
																		res.redirect('/check-result');
																	}
																}
															}
														}
													});
												}
											});
										}
									}
								});
							}
						});
					}
				});
			}
		});	
	}
});


//application get request
router.get('/application', function(req, res, next) {
	var messages = res.locals.getMessages();
	var error = 'Nothing to show. Go to search the user first';
	if( messages.error ){
		res.render('application', {title: 'EMPTY FORM', ShowMessage: true, error: messages.error});
	}else{
		res.render('application', {title: 'EMPTY FORM'});
	}
});

//register get request
router.get('/searchstudents', ensureLoggedIn('/login'), function(req, res, next){
	var currentUser = req.session.passport.user.user_id;
	db.query('SELECT user FROM admin WHERE user = ?', [currentUser], function(err, results, fields){
		if(err) throw err;
		if(results.length === 0){
			 res.redirect('/404');
		}else{
			var messages = res.locals.getMessages();
			if( messages.error){
				res.render('searchstudents',  { title: 'SEARCH STUDENTS', error: messages.error, ShowMessage: true});
			}else{
				if( messages.success){
					res.render('searchstudents',  { title: 'SEARCH STUDENTS', success: messages.success, ShowMessage: true});
				}
			}
		}
	});
});

//register get request
router.get('/application/regNo=:regNo', function(req, res, next) {	
	var regNo = req.params.regNo;
    db.query('SELECT reg_no FROM students1 WHERE reg_no = ?', [regNo], function(err, results, fields){
		if(err) throw err;
		var students1 = results[0];
		db.query('SELECT reg_no FROM students2 WHERE reg_no = ?', [regNo], function(err, results, fields){
			if(err) throw err;
			var students2 = results;
			res.render('application',  { title: 'APPLICATION FORM', students1: students1, students2: students2});
		});
	});
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
router.post('/searchstudents', function(req, res, next) {
	req.checkBody('reg_no', 'Registration number must be between 6 to 25 characters').len(6,25).trim();
	
	var errors = req.validationErrors();
	if (errors) { 
	
		console.log(JSON.stringify(errors));
  
		res.render('searchstudents', { title: 'SEARCH FAILED', errors: errors});
	}else{
		var regNo = req.body.reg_no;
		//get the student info
		db.query( 'SELECT * FROM students1 WHERE reg_no = ?', [regNo], function ( err, results, fields ){
			if(err) throw err;
			if(resullts.length === 0){
				var error = regNo + ' is not correct... Please recheck and try again later';
				req.flash('error', error);
				res.redirect('/searchstudents');
			}else{
				res.flash('success', 'Search completed');
				res.redirect('/application/regNo=' + regNo);
			}
		});
	}
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


router.post('/students', function(req, res, next) {
	//var category = req.body.category;
	if (req.url == '/students' && req.method.toLowerCase() == 'post') {
		// parse a file upload
		var form = new formidable.IncomingForm();
		form.uploadDir = '/Users/STAIN/desktop/sites/sanctacruz/public/images/passport';
		form.maxFileSize = 2 * 1024 * 1024;
		form.parse(req, function(err, fields, files) {
			//var img = fields.img; 
			var fullname = fields.full_name;
			var sto = fields.sto;
			var tel = fields.tel;
			var dob = fields.dob;
			var gender = fields.gender;
			var nationality = fields.nationality;
			var address = fields.address;
			var mmn = fields.mmn;
			var parent_name = fields.parent_name;
			var relationship = fields.relationship;
			var guardianFullname = fields.guardian_full_name;
			var guardianPhone = fields.guardian_phone;
			var guardianEmail = fields.guardian_email;
			var religion = fields.religion;
			var guardianAddress = fields.guardian_address;
			var guardianStatus = fields.guardian_status;
			var occupation = fields.occupation;
			var anniversary = fields.anniversary;
			var classAddmitted = fields.class_admitted;
			var YearAddmitted = fields.year_admitted;
			var performance = fields.performance;
			var schoolName = fields.school_name;
			var yearAttended = fields.year_attended;
			var schoolClass = fields.school_class;
			var RegNo = fields.reg_no;
			var YearOfAdmission = fields.year_of_admission;
			
			console.log(fields);
			var getfiles = JSON.stringify( files );
			var file = JSON.parse(getfiles);
			var oldpath = file.img.path;
			//console.log(oldpath, typeof oldpath, typeof file, file.path, typeof file.path);
			var name = file.passport.name;
			form.keepExtensions = true;
			var newpath = '/Users/STAIN/desktop/sites/sanctacruz/public/images/passport/' + name;
			var img = '/images/passport' + name;
			form.on('fileBegin', function( name, file){
				//rename the file
				fs.rename(oldpath, newpath, function(err){
					if (err) throw err;
					//console.log('file renamed');
				});
				//save in the database.
				//check if the req number has been added before.
				db.query('SELECT reg_no FROM students1 WHERE reg_no = ?', [regNo], function(err, results, fields){
					if( err ) throw err;
					if(results.length > 1){
						fs.unlink(newpath, function(err){
							if (err) throw err;
							console.log('file deleted');
						});
						
						var error = 'The student ' + fullname + ' is already in the database';
						req.flash('error', error);
						res.redirect('/students');
					}else{
						if(guardianStatus === ''){
							db.query('INSERT INTO students1 (passport, full_name, sto, tel, dob, gender, nationality, address, mmn, parent_name, relationship, guardian_full_name, guardian_phone, guardian_email, religion, guardian_address, occupation, anniversary, class_admitted, year_admitted, performance, reg_no, year_of_admission) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [name, fullname, sto, tel, dob, gender, nationality, address, mmn, parent_name, relationship, guardianFullname, guardianPhone, guardianEmail, religion, guardianAddress, occupation, anniversary, classAddmitted, YearAddmitted, performance, regNo, YearOfAdmission], function(err,results, fields){
								if (err)  throw err;
								for(var i = 0; i < schoolName.length; i++){
									db.query('INSERT INTO students2 (reg_no, school_name, year_attended, school_class) VALUES (?, ?, ?, ?)', [regNo, schoolName[i], yearAttended[i], schoolClass[i]], function(err,results, fields){
										if (err)  throw err;
									});
								}
								var success = 'The new Student '+ fullname + ' was added successfully';
								req.flash('success', success);
								res.redirect('/students');
							});
						}else{
							db.query('INSERT INTO students1 (passport,  guardian_status, full_name, sto, tel, dob, gender, nationality, address, mmn, parent_name, relationship, guardian_full_name, guardian_phone, guardian_email, religion, guardian_address, occupation, anniversary, class_admitted, year_admitted, performance, reg_no, year_of_admission) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [name, guardianStatus, fullname, sto, tel, dob, gender, nationality, address, mmn, parent_name, relationship, guardianFullname, guardianPhone, guardianEmail, religion, guardianAddress, occupation, anniversary, classAddmitted, YearAddmitted, performance, regNo, YearOfAdmission], function(err,results, fields){
								if (err)  throw err;
								for(var i = 0; i < schoolName.length; i++){
									db.query('INSERT INTO students2 (reg_no, school_name, year_attended, school_class) VALUES (?, ?, ?, ?)', [regNo, schoolName[i], yearAttended[i], schoolClass[i]], function(err,results, fields){
										if (err)  throw err;
									});
								}
								var success = 'The new Student '+ fullname + ' was added successfully';
								req.flash('success', success);
								res.redirect('/students');
							});
						}
					}
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