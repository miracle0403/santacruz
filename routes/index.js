'use strict';

var express = require('express');
var router = express.Router();


var passport = require('passport'); 
var securePin = require('secure-pin');
var charSet = new securePin.CharSet();
charSet.addLowerCaseAlpha().addUpperCaseAlpha().addNumeric().randomize();

var { check, validationResult } = require('express-validator');
var bcrypt = require('bcryptjs');

var db = require('../db.js');
var getfunc = require('../functions.js');

var ensureLoggedIn = require( 'connect-ensure-login' ).ensureLoggedIn

const saltRounds = bcrypt.genSaltSync(10);

/*for (var i = 0; i < 15; i++){
	securePin.generatePin(16, function(pin){
		securePin.generateString(10, charSet, function(str){
			db.query('INSERT INTO pins (pin, serial) VALUES (?,?)', [pin, str], function(err, results, fields){
				if (err) throw err;
				console.log(pin,str);
			});
		});	
	});	
}
*/

/* GET home page. */
router.get('/register', function(req, res, next) {
  res.render('register', { title: 'SCHOOL', mess: 'Registration' });
});

/* check results */
router.get('/checkresults', function(req, res, next) {
	const flashMessages = res.locals.getMessages( );
	if( flashMessages.error ){
		res.render('checkresults', { 
			title: 'SCHOOL', 
			mess: 'CHECK RESULT', 
			showErrors: true,
			uncheck: 'CHECK',
			error: flashMessages.error
		});
	}else if( flashMessages.success ){
		res.render('checkresults', { 
			title: 'SCHOOL', 
			mess: 'CHECK RESULT', 
			showSuccess: true,
			uncheck: 'CHECK',
			success: flashMessages.success
		});
	}else{
		
		res.render('checkresults', { 
			title: 'SCHOOL', 
			uncheck: 'CHECK',
			mess: 'CHECK RESULT' 
		});
	}
});


/* GET login */
router.get('/login', function(req, res, next) {
	
	const flashMessages = res.locals.getMessages( );
	if( flashMessages.error ){
		res.render( 'login', {
			showErrors: true,
			errors: flashMessages.error
		});
	}else{
		var message = 'LOG IN';
		res.render('login', { title: 'SCHOOL', mess: message });
	}
});


	
//dashboard
router.get('/admin', ensureLoggedIn('/login'), function(req, res, next) {
	var currentUser = req.session.passport.user.user_id;
	db.query('SELECT * FROM user WHERE user_id = ?', [currentUser], function ( err, results, fields ){
		if( err ) throw err;
		if(results[0].user_type !== 'Administrator'){
			res.redirect('/404');
		}else{
			var admin = results[0];
			db.query('SELECT * FROM available_results', function ( err, results, fields ){
				if( err ) throw err;
				var available_results = results;
				db.query('SELECT * FROM remark', function ( err, results, fields ){
					if( err ) throw err;
					var remark = remark;
				
					const flashMessages = res.locals.getMessages( );
					if( flashMessages.rolessuccess ){
						res.render('admin', { 
							title: 'SCHOOL',  
							mess: 'ADMIN DASHBOARD', 
							admin: admin,
							remark: remark,
							showSuccess: true,
							rolessuccess: flashMessages.rolessuccess
						
						});
					}else if( flashMessages.delsuccess ){
						res.render('admin', { 
							title: 'SCHOOL',  
							mess: 'ADMIN DASHBOARD', 
							admin: admin,
							remark: remark,
							showSuccess: true,
							delsuccess: flashMessages.delssuccess
						
						});
					}else if( flashMessages.editremarksuccess ){
						res.render('admin', { 
							title: 'SCHOOL',  
							mess: 'ADMIN DASHBOARD', 
							admin: admin,
							remark: remark,
							showSuccess: true,
							editremarksuccess: flashMessages.editremarksuccess
						
						});
					}else if( flashMessages.delusersuccess ){
						res.render('admin', { 
							title: 'SCHOOL',  
							mess: 'ADMIN DASHBOARD', 
							admin: admin,
							remark: remark,
							showSuccess: true,
							delusersuccess: flashMessages.delusersuccess
						
						});
					}else if( flashMessages.delusererror ){
						res.render('admin', { 
							title: 'SCHOOL',  
							mess: 'ADMIN DASHBOARD', 
							admin: admin,
							remark: remark,
							showErrors: true,
							delusererror: flashMessages.delusererror
						
						});
						
					}else if( flashMessages.roleserror ){
						res.render('admin', { 
							title: 'SCHOOL',  
							mess: 'ADMIN DASHBOARD', 
							admin: admin,
							remark: remark,
							showErrors: true,
							roleserror: flashMessages.roleserror
						
						});
						
					}else if( flashMessages.remarkerror ){
						res.render('admin', { 
							title: 'SCHOOL',  
							mess: 'ADMIN DASHBOARD', 
							admin: admin,
							remark: remark,
							showErrors: true,
							remarkerror: flashMessages.remarkerror
						
						});
						
					}else if( flashMessages.remarksuccess ){
						res.render('admin', { 
							title: 'SCHOOL',  
							mess: 'ADMIN DASHBOARD', 
							admin: admin,
							remark: remark,
							showSuccess: true,
							remarksuccess: flashMessages.remarksuccess
						
						});
					}else if( flashMessages.delstudent ){
						res.render('admin', { 
							title: 'SCHOOL',  
							mess: 'ADMIN DASHBOARD', 
							admin: admin,
							remark: remark,
							showErrors: true,
							delstudent: flashMessages.delstudent
						
						});
						
					}else if( flashMessages.addresultserror ){
						res.render('admin', { 
							title: 'SCHOOL',  
							mess: 'ADMIN DASHBOARD', 
							admin: admin,
							remark: remark,
							showErrors: true,
							addresultserror: flashMessages.addresultserror
						
						});
						
					}else if( flashMessages.addsubjecterror ){
						res.render('admin', { 
							title: 'SCHOOL',  
							mess: 'ADMIN DASHBOARD', 
							admin: admin,
							remark: remark,
							showErrors: true,
							addsubjecterror: flashMessages.addsubjecterror
						
						});
						
					}else if( flashMessages.removesubjecterror ){
						res.render('admin', { 
							title: 'SCHOOL',  
							mess: 'ADMIN DASHBOARD', 
							admin: admin,
							remark: remark,
							showErrors: true,
							removesubjecterror: flashMessages.removesubjecterror
						
						});
						
					}else if( flashMessages.addstudenterror ){
						res.render('admin', { 
							title: 'SCHOOL',  
							mess: 'ADMIN DASHBOARD', 
							admin: admin,
							remark: remark,
							showErrors: true,
							addstudenterror: flashMessages.addstudenterror
						
						});
						
					}else if( flashMessages.addresultssuccess ){
						res.render('admin', { 
							title: 'SCHOOL',  
							mess: 'ADMIN DASHBOARD', 
							admin: admin,
							remark: remark,
							showSuccess: true,
							addresultssuccess: flashMessages.addresultssuccess
						
						});
					}else if( flashMessages.addsubjectsuccess ){
						res.render('admin', { 
							title: 'SCHOOL',  
							mess: 'ADMIN DASHBOARD', 
							admin: admin,
							remark: remark,
							showSuccess: true,
							addsubjectsuccess: flashMessages.addsubjectsuccess
						
						});
					}else if( flashMessages.removesubjectsuccess ){
						res.render('admin', { 
							title: 'SCHOOL',  
							mess: 'ADMIN DASHBOARD', 
							admin: admin,
							remark: remark,
							showSuccess: true,
							removesubjectsuccess: flashMessages.removesubjectsuccess
						
						});
					}else if( flashMessages.addstudentsuccess ){
						res.render('admin', { 
							title: 'SCHOOL',  
							mess: 'ADMIN DASHBOARD', 
							admin: admin,
							remark: remark,
							showSuccess: true,
							addstudentsuccess: flashMessages.addstudentsuccess
						
						});
					}else if( flashMessages.removeresultssuccess ){
						res.render('admin', { 
							title: 'SCHOOL',  
							mess: 'ADMIN DASHBOARD', 
							admin: admin,
							remark: remark,
							showSuccess: true,
							removeresultssuccess: flashMessages.removeresultssuccess
						
						});
					}else if( flashMessages.removeresultserror ){
						res.render('admin', { 
							title: 'SCHOOL',  
							mess: 'ADMIN DASHBOARD', 
							admin: admin,
							remark: remark,
							showErrors: true,
							removeresultserror: flashMessages.removeresultserror
						
						});
						
					}else if( flashMessages.unbanerror ){
						res.render('admin', { 
							title: 'SCHOOL',  
							mess: 'ADMIN DASHBOARD', 
							admin: admin,
							remark: remark,
							showErrors: true,
							unbanerror: flashMessages.unbanerror
						
						});
						
					}else if( flashMessages.unbansuccess ){
						res.render('admin', { 
							title: 'SCHOOL',  
							mess: 'ADMIN DASHBOARD', 
							admin: admin,
							remark: remark,
							showSuccess: true,
							unbansuccess: flashMessages.unbansuccess
						
						});
					}else if( flashMessages.addremark ){
						res.render('admin', { 
							title: 'SCHOOL',  
							mess: 'ADMIN DASHBOARD', 
							admin: admin,
							remark: remark,
							showSuccess: true,
							addremark: flashMessages.addremark
						
						});
					}else if( flashMessages.restrictsuccess ){
						res.render('admin', { 
							title: 'SCHOOL',  
							mess: 'ADMIN DASHBOARD', 
							admin: admin,
							remark: remark,
							showSuccess: true,
							restrictsuccess: flashMessages.restrictsuccess
						
						});
					}else if( flashMessages.restricterror ){
						res.render('admin', { 
							title: 'SCHOOL',  
							mess: 'ADMIN DASHBOARD', 
							admin: admin,
							remark: remark,
							showErrors: true,
							restricterror: flashMessages.restricterror
						
						});
						
					}else if( flashMessages.unrestricterror ){
						res.render('admin', { 
							title: 'SCHOOL',  
							mess: 'ADMIN DASHBOARD', 
							admin: admin,
							remark: remark,
							showErrors: true,
							unrestricterror: flashMessages.unrestricterror
						
						});
						
					}else if( flashMessages.unrestrictsuccess ){
						res.render('admin', { 
							title: 'SCHOOL',  
							mess: 'ADMIN DASHBOARD', 
							admin: admin,
							remark: remark,
							showSuccess: true,
							unrestrictsuccess: flashMessages.unrestrictsuccess
						
						});
					}else if( flashMessages.addclassteachersuccess ){
						res.render('admin', { 
							title: 'SCHOOL',  
							mess: 'ADMIN DASHBOARD', 
							admin: admin,
							remark: remark,
							showSuccess: true,
							addclassteachersuccess: flashMessages.addclassteachersuccess
						
						});
					}else if( flashMessages.classteachersuccess ){
						res.render('admin', { 
							title: 'SCHOOL',  
							mess: 'ADMIN DASHBOARD', 
							admin: admin,
							remark: remark,
							showSuccess: true,
							classteachersuccess: flashMessages.classteachersuccess
						
						});
					}else if( flashMessages.classteachererror ){
						res.render('admin', { 
							title: 'SCHOOL',  
							mess: 'ADMIN DASHBOARD', 
							admin: admin,
							remark: remark,
							showErrors: true,
							classteachererror: flashMessages.classteachererror
						
						});
						
					}else if( flashMessages.addclassteachererror ){
						res.render('admin', { 
							title: 'SCHOOL',  
							mess: 'ADMIN DASHBOARD', 
							admin: admin,
							remark: remark,
							showErrors: true,
							addclassteachererror: flashMessages.addclassteachererror
						
						});
						
					}else{
						res.render('admin', { 
						title: 'SCHOOL',  
						remark: remark,
						mess: 'ADMIN DASHBOARD', 
						admin: admin });
					}
				});
			});
		}
	});
});

//get edit result of the particular student.
router.get('/editresult/:resultid', ensureLoggedIn('/login'), function(req, res, next) {
	var currentUser = req.session.passport.user.user_id;
	var resultid = req.params.resultid;
	db.query('SELECT * FROM user WHERE user_id  = ?', [currentUser], function ( err, results, fields ){
		if( err ) throw err;
		if(results[0].user_type === 'Administrator'){
			var admin = results[0];
			db.query('SELECT theclass FROM classteacher WHERE full_name = ?', [admin.full_name], function ( err, results, fields ){
				if( err ) throw err;
				if (results.length === 0){
					var error = 'You cannot work on a result unless you are a theclass teacher';
					res.render('editresult', { 
						title: 'SCHOOL', 			
						mess: 'EDIT RESULT',
						error: error,
						admin: admin
					});
				}else{
					var theclass = results[0].theclass;
					db.query('SELECT * FROM results WHERE resultid = ?', [resultid], function ( err, results, fields ){
						if( err ) throw err;
						if (results.length === 0){
							res.redirect('/404');
						}else{
							var result = results;
							db.query('SELECT subject FROM subjects ',  function ( err, results, fields ){
								if( err ) throw err;
								var subject = results;
								const flashMessages = res.locals.getMessages( );
								if( flashMessages.success ){
									res.render('editresult', { 
										title: 'SCHOOL', 
										mess: 'EDIT ' + result[0].full_name + ' RESULT',
										theclass: theclass,
										admin: admin,
										student: result[0], 
										result: result,
										subjects: subject,
										start: 'gfd',
										showSuccess: true,
										success: flashMessages.success
									
									});
								}else if( flashMessages.error ){
									res.render('editresult', { 
										title: 'SCHOOL', 
										mess: 'EDIT ' + result[0].full_name + ' RESULT',
										theclass: theclass,
										admin: admin,
										student: result[0],
										subjects: subject,
										start: 'gfd',
										result: result,
										showErrors: true,
										error: flashMessages.error
									
									});
									
								}else{
									res.render('editresult', { 
										title: 'SCHOOL', 
										mess: 'EDIT ' + result[0].full_name + ' RESULT',
										theclass: theclass,
										admin: admin,
										student: result[0], 
										start: 'gfd',
										result: result,
										subjects: subject,
										admin: admin
									
									});
									
								}
							});
						}
					});
				}
			});
		}else if(results[0].user_type === 'Teacher'){
			var teacher = results[0];
			db.query('SELECT theclass FROM classteacher WHERE full_name = ?', [teacher.full_name], function ( err, results, fields ){
				if( err ) throw err;
				if (results.length === 0){
					var error = 'You cannot work on a result unless you are a theclass teacher';
					res.render('editresult', { 
						title: 'SCHOOL', 			
						mess: 'EDIT RESULT',
						error: error,
						teacher: teacher
					});
				}else{
					var theclass = results[0].theclass;
					db.query('SELECT * FROM results WHERE resultid = ?', [resultid], function ( err, results, fields ){
						if( err ) throw err;
						if (results.length === 0){
							res.redirect('/404');
						}else{
							var result = results;
							db.query('SELECT subject FROM subjects ',  function ( err, results, fields ){
								if( err ) throw err;
								var subject = results;
								const flashMessages = res.locals.getMessages( );
								if( flashMessages.success ){
									res.render('editresult', { 
										title: 'SCHOOL', 
										mess: 'EDIT ' + result[0].full_name + ' RESULT',
										theclass: theclass,
										teacher: teacher,
										student: result[0], 
										subjects: subject,
										start: 'gfd',
										showSuccess: true,
										success: flashMessages.success
									
									});
								}else if( flashMessages.error ){
									res.render('editresult', { 
										title: 'SCHOOL', 
										mess: 'EDIT ' + result[0].full_name + ' RESULT',
										theclass: theclass,
										teacher: teacher,
										student: result[0], 
										start: 'gfd',
										subjects: subject,
										showErrors: true,
										error: flashMessages.error
									
									});
									
								}else{
									res.render('editresult', { 
										title: 'SCHOOL', 
										mess: 'EDIT ' + result[0].full_name + ' RESULT',
										theclass: theclass,
										teacher: teacher,
										student: result[0], 
										subjects: subject,
										start: 'gfd',
										teacher: teacher
									
									});
									
								}
							});
						}
					});
				}
			});
		}else{
			res.redirect('/404');
		}
	});	
});



//get edit result
router.get('/editresult', ensureLoggedIn('/login'), function(req, res, next) {
	var currentUser = req.session.passport.user.user_id;
	db.query('SELECT * FROM user WHERE user_id  = ?', [currentUser], function ( err, results, fields ){
		if( err ) throw err;
		if(results[0].user_type === 'Administrator'){
			var admin = results[0];
			db.query('SELECT theclass FROM classteacher WHERE full_name = ?', [admin.full_name], function ( err, results, fields ){
				if( err ) throw err;
				if (results.length === 0){
					var error = 'You cannot work on a result unless you are a theclass teacher';
					res.render('editresult', { 
						title: 'SCHOOL', 			
						mess: 'EDIT RESULT',
						error: error,
						admin: admin
					});
				}else{
					var theclass = results[0].theclass;
					db.query('SELECT * FROM available_results WHERE available  = ?', ['No'], function ( err, results, fields ){
						if( err ) throw err;
						if (results.length === 0){
							var error = 'There is no result batch ready to be worked on. Contact the administrator to add the result batch in the ADD RESULTS section. Also remember to use option "No" in order to work on this bach of result.';
							res.render('editresult', { 
								title: 'SCHOOL', 
								mess: 'EDIT RESULT',
								error: error,
								theclass: theclass,
								admin: admin
								
							});
						}else{
							var available = results.slice(-1)[0];
							db.query('SELECT * FROM subjects', function ( err, results, fields ){
								if( err ) throw err;
								var subjects = results;
								db.query('SELECT * FROM aggregriate WHERE theclass = ? and session = ? and term = ?', [theclass, available.session, available.term], function ( err, results, fields ){
									if( err ) throw err;
									console.log(theclass)
									if (results.length === 0){
										var error = 'There is no result batch ready to be worked on.';
										res.render('editresult', { 
											title: 'SCHOOL', 
											mess: 'EDIT RESULT',
											error: error,
											theclass: theclass,
											admin: admin
											
										});
									}else{
										var result = results;
										db.query('SELECT full_name, regid FROM students WHERE theclass = ?', [theclass], function ( err, results, fields ){
											if( err ) throw err;
											var student = results;
											const flashMessages = res.locals.getMessages( );
											if( flashMessages.success ){
												res.render('editresult', { 
													title: 'SCHOOL', 
													mess: 'EDIT RESULT',
													theclass: theclass,
													admin: admin,
													student: student,
													results: result,
													subjects: subjects,
													available: available,
													showSuccess: true,
													success: flashMessages.success
												
												});
											}else if( flashMessages.error ){
												res.render('editresult', { 
													title: 'SCHOOL', 
													mess: 'EDIT RESULT',
													theclass: theclass,
													student: student, 
													admin: admin,
													results: result,
													subjects: subjects,
													available: available,
													showErrors: true,
													error: flashMessages.error
												
												});
												
											}else{
												res.render('editresult', { 
													title: 'SCHOOL', 
													mess: 'EDIT RESULT',	
													theclass: theclass,
													student: student, 
													results: result,
													subjects: subjects,
													available: available,
													admin: admin
												
												});
												
											}
										});
									}
								});
							});
						}
					});
				}
			});
		}else if(results[0].user_type === 'Teacher'){
			var teacher = results[0];
			db.query('SELECT theclass FROM classteacher WHERE full_name = ?', [teacher.full_name], function ( err, results, fields ){
				if( err ) throw err;
				if (results.length === 0){
					var error = 'You cannot work on a result unless you are a theclass teacher';
					res.render('editresult', { 
						title: 'SCHOOL', 			
						mess: 'EDIT RESULT',
						error: error,
						teacher: teacher
					});
				}else{
					var theclass = results[0].theclass;
					db.query('SELECT * FROM available_results WHERE available  = ?', ['No'], function ( err, results, fields ){
						if( err ) throw err;
						if (results.length === 0){
							var error = 'There is no result batch ready to be worked on. Contact the teacheristrator to add the result batch in the ADD RESULTS section. Also remember to use option "No" in order to work on this bach of result.';
							res.render('editresult', { 
								title: 'SCHOOL', 
								mess: 'EDIT RESULT',
								error: error,
								theclass: theclass,
								teacher: teacher
								
							});
						}else{
							var available = results.slice(-1)[0];
							db.query('SELECT * FROM subjects', function ( err, results, fields ){
								if( err ) throw err;
								var subjects = results;
								db.query('SELECT * FROM aggregriate WHERE theclass = ? and session = ? and term = ?', [theclass, available.session, available.term], function ( err, results, fields ){
									if( err ) throw err;
									if (results.length === 0){
										var error = 'There is no result batch ready to be worked on.';
										res.render('editresult', { 
											title: 'SCHOOL', 
											mess: 'EDIT RESULT',
											error: error,
											theclass: theclass,
											admin: admin
											
										});
									}else{
										var result = results;
										db.query('SELECT full_name, regid FROM students WHERE theclass = ?', [theclass], function ( err, results, fields ){
											if( err ) throw err;
											var student = results;
											const flashMessages = res.locals.getMessages( );
											if( flashMessages.success ){
												res.render('editresult', { 
													title: 'SCHOOL', 
													mess: 'EDIT RESULT',
													theclass: theclass,
													teacher: teacher,
													student: student, 
													results: result,
													subjects: subjects,
													available: available,
													showSuccess: true,
													success: flashMessages.success
												
												});
											}else if( flashMessages.error ){
												res.render('editresult', { 
													title: 'SCHOOL', 
													mess: 'EDIT RESULT',
													theclass: theclass,
													student: student, 
													teacher: teacher,
													results: result,
													subjects: subjects,
													available: available,
													showErrors: true,
													error: flashMessages.error
												
												});
												
											}else{
												res.render('editresult', { 
													title: 'SCHOOL', 
													mess: 'EDIT RESULT',	
													theclass: theclass,
													student: student, 
													results: result,
													subjects: subjects,
													available: available,
													teacher: teacher
												
												});
												
											}
										});
									}
								});
							});
						}
					});
				}
			});
		}else{
			res.redirect('/404')
		}
	});
});

//post results//dashboard
router.get('/postresult', ensureLoggedIn('/login'), function(req, res, next) {
	var currentUser = req.session.passport.user.user_id;
	var post = 'post';
	db.query('SELECT * FROM user WHERE user_id = ?', [currentUser], function ( err, results, fields ){
		if( err ) throw err;
		if(results[0].user_type === 'Administrator'){
			var admin = results[0];
			db.query('SELECT theclass FROM classteacher WHERE full_name = ?', [admin.full_name], function ( err, results, fields ){
				if( err ) throw err;
				if (results.length === 0){
					var error = 'You cannot work on a result unless you are a theclass teacher';
					res.render('postresult', { 
						title: 'SCHOOL', 
						post: post,						
						mess: 'UPLOAD RESULT',
						error: error,
						admin: admin
					});
				}else{
					var theclass = results[0].theclass;
					db.query('SELECT * FROM available_results WHERE available  = ?', ['No'], function ( err, results, fields ){
						if( err ) throw err;
						if (results.length === 0){
							var error = 'There is no result batch ready to be worked on. Contact the administrator to add the result batch in the ADD RESULTS section. Also remember to use option "No" in order to work on this bach of result.';
							res.render('postresult', { 
								title: 'SCHOOL',  
								post: post,
								mess: 'UPLOAD RESULT',
								error: error,
								theclass: theclass,
								admin: admin
								
							});
						}else{
							var available = results;
							db.query('SELECT * FROM subjects', function ( err, results, fields ){
								if( err ) throw err;
								var subjects = results;
								db.query('SELECT full_name, regid FROM students WHERE theclass = ?', [theclass], function ( err, results, fields ){
									if( err ) throw err;
									var student = results;
									const flashMessages = res.locals.getMessages( );
									if( flashMessages.success ){
										res.render('postresult', { 
											title: 'SCHOOL',  
											mess: 'UPLOAD RESULT',								
											post: 'h',
											theclass: theclass,
											admin: admin,
											student: student, 
											subjects: subjects,
											available: available,
											showSuccess: true,
											success: flashMessages.success
										
										});
									}else if( flashMessages.error ){
										res.render('postresult', { 
											title: 'SCHOOL',  
											mess: 'UPLOAD RESULT',	
											post: 'h',
											theclass: theclass,
											student: student, 
											admin: admin,
											subjects: subjects,
											available: available,
											showErrors: true,
											error: flashMessages.error
										
										});
										
									}else{
										res.render('postresult', { 
											title: 'SCHOOL',  
											mess: 'UPLOAD RESULT',	
											theclass: theclass,
											student: student, 
											post: 'h',
											subjects: subjects,
											available: available,
											admin: admin
										
										});
										
									}
								});
							});
						}
					});
				}
			});
		}else if(results[0].user_type === 'Teacher'){
			var teacher = results[0];
			db.query('SELECT theclass FROM classteacher WHERE full_name = ?', [teacher.full_name], function ( err, results, fields ){
				if( err ) throw err;
				if (results.length === 0){
					var error = 'You cannot work on a result unless you are a theclass teacher';
					res.render('postresult', { 
						title: 'SCHOOL', 
						post: post,						
						mess: 'UPLOAD RESULT',
						error: error,
						teacher: teacher
					});
				}else{
					var theclass = results[0].theclass;
					db.query('SELECT * FROM available_results WHERE available  = ?', ['No'], function ( err, results, fields ){
						if( err ) throw err;
						if (results.length === 0){
							var error = 'There is no result batch ready to be worked on. Contact the teacheristrator to add the result batch in the ADD RESULTS section. Also remember to use option "No" in order to work on this bach of result.';
							res.render('postresult', { 
								title: 'SCHOOL',  
								post: post,
								mess: 'UPLOAD RESULT',
								error: error,
								theclass: theclass,
								teacher: teacher
								
							});
						}else{
							var available = results;
							db.query('SELECT * FROM subjects', function ( err, results, fields ){
								if( err ) throw err;
								var subjects = results;
								db.query('SELECT full_name, regid FROM students WHERE theclass = ?', [theclass], function ( err, results, fields ){
									if( err ) throw err;
									var student = results;
									const flashMessages = res.locals.getMessages( );
									if( flashMessages.success ){
										res.render('postresult', { 
											title: 'SCHOOL',  
											mess: 'UPLOAD RESULT',								
											post: 'h',
											theclass: theclass,
											teacher: teacher,
											student: student, 
											subjects: subjects,
											available: available,
											showSuccess: true,
											success: flashMessages.success
										
										});
									}else if( flashMessages.error ){
										res.render('postresult', { 
											title: 'SCHOOL',  
											mess: 'UPLOAD RESULT',	
											post: 'h',
											theclass: theclass,
											student: student, 
											teacher: teacher,
											subjects: subjects,
											available: available,
											showErrors: true,
											error: flashMessages.error
										
										});
										
									}else{
										res.render('postresult', { 
											title: 'SCHOOL',  
											mess: 'UPLOAD RESULT',	
											theclass: theclass,
											student: student, 
											post: 'h',
											subjects: subjects,
											available: available,
											teacher: teacher
										
										});
										
									}
								});
							});
						}
					});
				}
			});
		}else{
			res.redirect('/404');
		}
	});
});


//add position
router.get('/addposition', ensureLoggedIn('/login'), function(req, res, next) {
	var currentUser = req.session.passport.user.user_id;
	db.query('SELECT * FROM user WHERE user_id = ?', [currentUser], function ( err, results, fields ){
		if( err ) throw err;
		if(results[0].user_type === 'Administrator'){
			var admin = results[0];
			db.query('SELECT theclass, full_name FROM classteacher WHERE full_name = ?', [admin.full_name], function ( err, results, fields ){
				if( err ) throw err;
				if(results.length === 0){
					
					res.redirect('/404');
				}else{
					var theclass = results[0].theclass;
					db.query('SELECT session, term FROM current_session', function ( err, results, fields ){
						if( err ) throw err;
						var session = results[0];
						db.query('SELECT session, term, full_name, regid, aggregriate, theclass FROM aggregriate WHERE theclass = ? ORDER BY aggregriate DESC', [theclass], function ( err, results, fields ){
							if( err ) throw err;
							var position = results;
							const flashMessages = res.locals.getMessages( );
							if( flashMessages.success ){
								res.render('position', { 
									title: 'SCHOOL',  
									mess: 'ADD POSITION', 
									theclass: theclass,
									admin: admin,
									session: session,
									showSuccess: true,
									position: position,
									addposition: 'add',
									success: flashMessages.success
								
								});
							}else if( flashMessages.error ){
								res.render('position', { 
									title: 'SCHOOL',  
									mess: 'ADD POSITION', 
									theclass: theclass,
									admin: admin,
									session: session,
									showErrors: true,
									position: position,
									addposition: 'add',
									error: flashMessages.error
								
								});
								
								
							}else{
								res.render('position', { 
									title: 'SCHOOL',  
									mess: 'ADD POSITION', 
									theclass: theclass,
									session: session,
									position: position,
									addposition: 'add',
									admin: admin
								
								});
								
							}
						});
					});
				}
				
			});
		}else if(results[0].user_type === 'Teacher'){
			var teacher = results[0];
			db.query('SELECT theclass, full_name FROM classteacher WHERE full_name = ?', [teacher.full_name], function ( err, results, fields ){
				if( err ) throw err;
				if(results.length === 0){
					var error = 'You are not a theclass teacher';
					req.flash('error', error)
					res.redirect('/dashboard');
				}else{
					var theclass = results[0].theclass;
					db.query('SELECT session, term FROM current_session', function ( err, results, fields ){
						if( err ) throw err;
						var session = results[0];
						db.query('SELECT session, term, full_name, regid, aggregriate, theclass FROM aggregriate WHERE theclass = ? ORDER BY aggregriate DESC', [theclass],function ( err, results, fields ){
							if( err ) throw err;
							var position = results;
							const flashMessages = res.locals.getMessages( );
							if( flashMessages.success ){
								res.render('position', { 
									title: 'SCHOOL',  
									mess: 'ADD POSITION', 
									theclass: theclass,
									teacher: teacher,
									session: session,
									showSuccess: true,
									position: position,
									addposition: 'add',
									success: flashMessages.ssuccess
								
								});
							}else if( flashMessages.error ){
								res.render('position', { 
									title: 'SCHOOL',  
									mess: 'ADD POSITION', 
									theclass: theclass,
									teacher: teacher,
									session: session,
									showErrors: true,
									position: position,
									addposition: 'add',
									error: flashMessages.error
								
								});
								
								
							}else{
								res.render('position', { 
									title: 'SCHOOL',  
									mess: 'ADD POSITION', 
									theclass: theclass,
									session: session,
									position: position,
									addposition: 'add',
									teacher: teacher
								
								});
								
							}
						});
					});
				}
				
			});
			
		}else{
			
			res.redirect('/404');
		}
	});
});



//dashboard
router.get('/dashboard', ensureLoggedIn('/login'), function(req, res, next) {
	var currentUser = req.session.passport.user.user_id;
	db.query('SELECT * FROM user WHERE user_id = ?', [currentUser], function ( err, results, fields ){
		if( err ) throw err;
		
		if(results[0].user_type === 'Administrator'){
			var admin = results[0];
			db.query('SELECT * FROM available_results', function ( err, results, fields ){
				if( err ) throw err;
				var available_results = results;
				db.query('SELECT session, term FROM current_session', function ( err, results, fields ){
					if( err ) throw err;
					var session = results[0];
					db.query('SELECT theclass, full_name FROM classteacher WHERE full_name = ?', [admin.full_name], function ( err, results, fields ){
						if( err ) throw err;
						var theclass = results[0].theclass;
						db.query('SELECT theclass FROM classteacher', function ( err, results, fields ){
							if( err ) throw err;
							var theclasses = results;
							const flashMessages = res.locals.getMessages( );
							if( flashMessages.delsuccess ){
								res.render('dashboard', { 
									title: 'SCHOOL', 
									session: session, 
									mess: 'DASHBOARD',
									theclass: theclass,
									theclasses: theclasses,
									available_results: available_results, 
									admin: admin,
									showSuccess: true,
									delsuccess: flashMessages.delsuccess
								});
							}else if ( flashMessages.delstudent ){
								res.render('dashboard', { 
									title: 'SCHOOL', 
									session: session, 
									mess: 'DASHBOARD',
									theclass: theclass,
									theclasses: theclasses,								
									available_results: available_results, 
									admin: admin,
									showErrors: true,
									delstudent: flashMessages.delstudent
								});
							}else if ( flashMessages.addstudenterror ){
								res.render('dashboard', { 
									title: 'SCHOOL', 
									session: session, 
									mess: 'DASHBOARD',
									theclass: theclass,
									theclasses: theclasses,								
									available_results: available_results, 
									admin: admin,
									showErrors: true,
									addstudenterror: flashMessages.addstudenterror
								});
							}else if ( flashMessages.transferstudenterror ){
								res.render('dashboard', { 
									title: 'SCHOOL', 
									session: session, 
									mess: 'DASHBOARD',
									theclass: theclass,
									theclasses: theclasses,
									available_results: available_results, 
									admin: admin,
									showErrors: true,
									transferstudenterror: flashMessages.transferstudenterror
								});
							}else if ( flashMessages.addstudentsuccess ){
								res.render('dashboard', { 
									title: 'SCHOOL', 
									session: session, 
									mess: 'DASHBOARD',
									theclass: theclass,							
									available_results: available_results, 
									admin: admin,
									theclasses: theclasses,
									showSuccess: true,
									addstudentsuccess: flashMessages.addstudentsuccess
								});
							}else if ( flashMessages.transferstudentsuccess ){
								res.render('dashboard', { 
									title: 'SCHOOL', 
									session: session, 
									mess: 'DASHBOARD',
									theclass: theclass,							
									available_results: available_results, 
									admin: admin,
									theclasses: theclasses,
									showSuccess: true,
									transferstudentsuccess: flashMessages.transferstudentsuccess
								});
							}else{
								res.render('dashboard', { 
									title: 'SCHOOL', 
									session: session, 
									mess: 'DASHBOARD',
									theclass: theclass,							
									available_results: available_results,
									theclasses: theclasses,								
									admin: admin 
								});
							}
						});
					});
				});
			});
		}else if(results[0].user_type === 'Teacher'){
			var teacher = results[0];
			db.query('SELECT * FROM available_results', function ( err, results, fields ){
				if( err ) throw err;
				var available_results = results;
				db.query('SELECT session, term FROM current_session', function ( err, results, fields ){
					if( err ) throw err;
					var session = results[0];
					db.query('SELECT theclass, full_name FROM classteacher WHERE full_name = ?', [teacher.full_name], function ( err, results, fields ){
						if( err ) throw err;
						var theclass = results[0].theclass;
						db.query('SELECT theclass FROM classteacher', function ( err, results, fields ){
							if( err ) throw err;
							var theclasses = results;
							const flashMessages = res.locals.getMessages( );
							if( flashMessages.delsuccess ){
								res.render('dashboard', { 
									title: 'SCHOOL', 
									session: session, 
									mess: 'DASHBOARD',
									theclass: theclass,
									theclasses: theclasses,
									available_results: available_results, 
									teacher: teacher,
									showSuccess: true,
									delsuccess: flashMessages.delsuccess
								});
							}else if ( flashMessages.delstudent ){
								res.render('dashboard', { 
									title: 'SCHOOL', 
									session: session, 
									mess: 'DASHBOARD',
									theclass: theclass,
									theclasses: theclasses,								
									available_results: available_results, 
									teacher: teacher,
									showErrors: true,
									delstudent: flashMessages.delstudent
								});
							}else if ( flashMessages.addstudenterror ){
								res.render('dashboard', { 
									title: 'SCHOOL', 
									session: session, 
									mess: 'DASHBOARD',
									theclass: theclass,
									theclasses: theclasses,								
									available_results: available_results, 
									teacher: teacher,
									showErrors: true,
									addstudenterror: flashMessages.addstudenterror
								});
							}else if ( flashMessages.transferstudenterror ){
								res.render('dashboard', { 
									title: 'SCHOOL', 
									session: session, 
									mess: 'DASHBOARD',
									theclass: theclass,
									theclasses: theclasses,
									available_results: available_results, 
									teacher: teacher,
									showErrors: true,
									transferstudenterror: flashMessages.transferstudenterror
								});
							}else if ( flashMessages.addstudentsuccess ){
								res.render('dashboard', { 
									title: 'SCHOOL', 
									session: session, 
									mess: 'DASHBOARD',
									theclass: theclass,							
									available_results: available_results, 
									teacher: teacher,
									theclasses: theclasses,
									showSuccess: true,
									addstudentsuccess: flashMessages.addstudentsuccess
								});
							}else if ( flashMessages.transferstudentsuccess ){
								res.render('dashboard', { 
									title: 'SCHOOL', 
									session: session, 
									mess: 'DASHBOARD',
									theclass: theclass,							
									available_results: available_results, 
									teacher: teacher,
									theclasses: theclasses,
									showSuccess: true,
									transferstudentsuccess: flashMessages.transferstudentsuccess
								});
							}else{
								res.render('dashboard', { 
									title: 'SCHOOL', 
									session: session, 
									mess: 'DASHBOARD',
									theclass: theclass,							
									available_results: available_results,
									theclasses: theclasses,								
									teacher: teacher 
								});
							}
						});
					});
				});
			});
		}else{
			res.redirect('/404');
		}
	});
  //res.render('register', { title: 'SCHOOL', mess: 'Registration' });
});


//get logout
router.get('/logout', function(req, res, next) {
  req.logout();
  req.session.destroy();
  res.redirect('/login');
});


//all roles
router.get('/all-users', ensureLoggedIn('/login'), function(req, res, next) {
	var currentUser = req.session.passport.user.user_id;
	db.query('SELECT * FROM user WHERE user_id = ?', [currentUser], function ( err, results, fields ){
		if( err ) throw err;
		if(results[0].user_type !== 'Administrator'){
			res.redirect('/404');
		}else{
			db.query('SELECT * FROM user ', function ( err, results, fields ){
				if( err ) throw err;
				var user = results;
				res.render('all-users', {mess: 'All Users ', user: user, admin: currentUser});
			});
		}
	});
});


//all students
router.get('/all-students-class', ensureLoggedIn('/login'), function(req, res, next) {
	var currentUser = req.session.passport.user.user_id;
	db.query('SELECT username, full_name, user_type FROM user WHERE user_id = ? ', [currentUser], function ( err, results, fields ){
		if( err ) throw err;
		console.log(results)
		if(results[0].user_type === 'Teacher'){
			var username = results[0].username;
			db.query('SELECT full_name, theclass FROM classteacher WHERE full_name = ? ',[results[0].full_name], function ( err, results, fields ){
				if( err ) throw err;
				if(results.length === 0){
					
					res.redirect('/404');
				}else{
					var theclass = results[0].theclass;
					db.query('SELECT * FROM students WHERE theclass = ? ',[theclass], function ( err, results, fields ){
						if( err ) throw err;
						var student = results;
						res.render('classstudent', {student: student, title: 'SCHOOL', mess: theclass + ' Students', theclass: theclass});
					});
				}
			});
		}else if(results[0].user_type === 'Administrator'){
			var admin = results[0].username;
			db.query('SELECT full_name, theclass FROM classteacher WHERE full_name = ? ',[results[0].full_name], function ( err, results, fields ){
				if( err ) throw err;
				if(results.length === 0){
					
					res.redirect('/404');
				}else{
					var theclass = results[0].theclass;
					db.query('SELECT * FROM students WHERE theclass = ? ',[theclass], function ( err, results, fields ){
						if( err ) throw err;
						var student = results;
						res.render('classstudent', {student: student, admin: admin, title: 'SCHOOL', mess: theclass + ' Students', theclass: theclass});
					});
				}
			});
		}else{
			res.redirect('/404');
		}
	});
});


//all students
router.get('/all-students', ensureLoggedIn('/login'), function(req, res, next) {
	var currentUser = req.session.passport.user.user_id;
	db.query('SELECT user_type FROM user WHERE user_id = ? ', [currentUser], function ( err, results, fields ){
		if( err ) throw err;
		if(results[0].user_type !== 'Administrator'){
			res.redirect('/404');
		}else{
			db.query('SELECT * FROM students ORDER BY theclass', function ( err, results, fields ){
				if( err ) throw err;
				var student = results;
				res.render('all-students', {mess: ' All Students ', student: student, admin: currentUser});
			});
		}
	});
});




//post log in
router.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
  function(req, res) {
	res.redirect('/dashboard');
});


//Passport login
passport.serializeUser(function(user_id, done){
  done(null, user_id)
});
        
passport.deserializeUser(function(user_id, done){
  done(null, user_id)
});

function authentificationMiddleware(){
  return (req, res, next) => {
    console.log(JSON.stringify(req.session.passport));
  if (req.isAuthenticated()) return next();

  res.redirect('/login'); 
  } 
}


//post register

router.post('/register', [	check('username', 'Username must be between 8 to 25 numbers').isLength(8,25),	check('fullname', 'Full Name must be between 8 to 25 characters').isLength(8,25),	check('password', 'Password must be between 8 to 15 characters').isLength(8,15),	 check('email', 'Email must be between 8 to 105 characters').isLength(8,105),	check('email', 'Invalid Email').isEmail(),		check('phone', 'Phone Number must be eleven characters').isLength(11)], function (req, res, next) {	 
	console.log(req.body)
	
	var username = req.body.username;
    var password = req.body.password;
    var cpass = req.body.cpass;
    var email = req.body.email;
    var fullname = req.body.fullname;
    
    var phone = req.body.phone;
	
	var errors = validationResult(req).errors;
	
	if (errors.length > 0){
		res.render('register', { mess: 'REGISTRATION FAILED', errors: errors, username: username, email: email, phone: phone, password: password, cpass: cpass, fullname: fullname });
	}else{
		if (cpass !== password){
			var error = 'Password must match';
			res.render('register', { mess: 'REGISTRATION FAILED', errors: errors, username: username, email: email, phone: phone, password: password, cpass: cpass, fullname: fullname,  error: error});
		}else{
			
			db.query('SELECT username FROM user WHERE username = ?', [username], function(err, results, fields){
				if (err) throw err;
				if(results.length > 0){
					var error = "Sorry, this username is taken";
					res.render('register', { mess: 'REGISTRATION FAILED', error: error, username: username, email: email, phone: phone, password: password, cpass: cpass, fullname: fullname});
				}else{
					db.query('SELECT email FROM user WHERE email = ?', [email], function(err, results, fields){
						if (err) throw err;
						if (results.length > 0){
							var error = "Sorry, this email is taken";
							res.render('register', { mess: 'REGISTRATION FAILED', error: error, username: username, email: email, phone: phone, password: password, cpass: cpass, fullname: fullname});
						}else{
							db.query('SELECT phone FROM user WHERE phone = ?', [phone], function(err, results, fields){
								if (err) throw err;
							
								if (results.length > 0){
									var error = "Sorry, this phone number is taken";
									res.render('register', { mess: 'REGISTRATION FAILED', error: error, username: username, email: email, phone: phone, password: password, cpass: cpass, fullname: fullname});
								}else{
									db.query('SELECT user_id FROM user', function(err, results, fields){
										if (err) throw err;
										if (results.length === 0){
											//register user
											bcrypt.hash(password, saltRounds,  function(err, hash){
												db.query('INSERT INTO user (user_id, full_name, phone, username, email, password, user_type) VALUES (?,?,?,?,?,?,?)', [ 1, fullname, phone, username, email, hash, 'Administrator'],  function(err, results, fields){
													if (err) throw err;
													var success = 'Registration successful! please login';
													res.render('register', {mess: 'REGISTRATION SUCCESSFUL', success: success});
												});
											});
										}else{
											//register user
											bcrypt.hash(password, saltRounds,  function(err, hash){
												db.query('INSERT INTO user ( full_name, phone, username, email, password) VALUES (?,?,?,?,?)', [  fullname, phone, username, email, hash],  function(err, results, fields){
													if (err) throw err;
													var success = 'Registration successful! please login';
													res.render('register', {mess: 'REGISTRATION SUCCESSFUL', success: success});
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
		}
	}
});

//check results
router.post('/checkresults', [  check('regid', 'Registration ID must be between 4 to 10 numbers').isLength(4, 10), check('pin', 'Pin must be 16 numbers').isLength(16)  ], function(req, res, next) {
	
	var session = req.body.session;
	var term = req.body.term;
	var theclass = req.body.theclass.toUpperCase();
	var regid = req.body.regid;
	var pin = req.body.pin;
	
	var errors = validationResult(req).errors;
	if (errors.length > 0){
		res.render('checkresults', {errors: errors, uncheck: 'ds', mess: 'CHECK Results',  regid: regid, theclass: theclass, session: session, pin:pin});
	}else{
		
		db.query('SELECT * FROM available_results WHERE session = ? and term = ?', [ session, term], function ( err, results, fields ){
			if( err ) throw err;
			if(results.length === 0){
				var error = 'Session or Term is Incorrect';
				req.flash('error', error);
				res.redirect('checkresults');
			}else{
				if(results[0].available === 'No'){
					var error = 'Result Batch currently unavailable';
					req.flash('error', error);
					res.redirect('checkresults');
				}else{
					db.query('SELECT full_name, theclass FROM students WHERE regid = ? ', [ regid], function ( err, results, fields ){
						if( err ) throw err;
						if(results.length === 0){
							var error = 'Student does not exist!';
							req.flash('error', error);
							res.redirect('checkresults');
						}else{
							var fullname = results[0].full_name;
							
							db.query('SELECT * FROM ban WHERE user = ? ', [fullname], function ( err, results, fields ){
								if( err ) throw err;
								if(results.length > 0){
									var error = 'You are banned from using this service. Please contact us for more information';
									req.flash('error', error);
									res.redirect('checkresults');
								}else{
									db.query('SELECT * FROM restricted WHERE full_name = ? AND regid = ? AND session = ? AND term = ?', [fullname, regid, session, term], function ( err, results, fields ){
										if( err ) throw err;
										if(results.length > 0){
											var error = 'You are not allowed to check results';
											req.flash('error', error);
											res.redirect('checkresults');
										}else{
											db.query('SELECT * FROM aggregriate WHERE full_name = ? AND regid = ? and session = ? and term = ? and theclass = ?', [fullname, regid, session, term, theclass], function ( err, results, fields ){
												if( err ) throw err;
												var aggregriate = results[0];
												db.query('SELECT COUNT(regid) AS count FROM aggregriate WHERE  session = ? and term = ? and theclass = ?', [session, term, theclass], function ( err, results, fields ){
													if( err ) throw err;
													var count = results[0].count;
													db.query('SELECT * FROM results WHERE full_name = ? AND regid = ? and session = ? and term = ? and theclass = ?', [fullname, regid, session, term, theclass], function ( err, results, fields ){
														if( err ) throw err;
														if(results.length === 0){
															var error = 'You do not have a result for this academic session or theclass. Please contact Us for more information';
															req.flash('error', error);
															res.redirect('checkresults');
														}else{
															var result = results;
															db.query('SELECT * FROM pins WHERE pin = ?', [pin], function ( err, results, fields ){
																if( err ) throw err;
																if(results.length === 0){
																	var error = 'Pin is Incorrect!';
																	//console.log(fullname)
																	var error2 = getfunc.ban(fullname, regid, session, term);
																	req.flash('error', error2);
																	req.flash('error', error);
																	res.redirect('checkresults');
																}else{
																	if(results[0].user !== null && results[0].user === fullname && results[0].term !== term && results[0].session !== session){
																		var error1 = 'Pin has been used been used by YOU!'
																		var error2 = getfunc.ban(fullname, regid, session, term);
																		req.flash('error', error1);
																		req.flash('error', error2);
																		res.redirect('checkresults');
																	}else if(results[0].user !== null && results[0].user === fullname && results[0].term === term && results[0].session === session && results[0].amount_used === 3){
																		var error1 = 'Pin has been used been used by YOU  for up to three times. Please buy another pin!'
																		var error2 = getfunc.ban(fullname, regid, session, term);
																		req.flash('error', error1);
																		req.flash('error', error2);
																		res.redirect('checkresults');
																	}else if(results[0].user !== null && results[0].user !== fullname){
																		var error = 'Pin has been used been used already!';
																		var error2 = getfunc.ban(fullname, regid, session, term);
																		req.flash('error', error1);
																		req.flash('error', error2);
																		res.redirect('checkresults');
																	}else if(results[0].user !== null && results[0].regid === regid && results[0].amount_used > 3 && results[0].user === fullname && results[0].term === term && results[0].session === session){
																		var error = 'You have used this pin thrice, you cannot use it again.';
																		var error2 = getfunc.ban(fullname, regid, session, term);
																		req.flash('error', error1);
																		req.flash('error', error2);
																		res.redirect('checkresults');
																		
																	}else if(results[0].user !== null && results[0].regid === regid && results[0].amount_used < 3 && results[0].user === fullname && results[0].term === term && results[0].session === session){
																		db.query('UPDATE pins SET amount_used = ? WHERE pin = ?', [results[0].amount_used + 1, pin], function ( err, results, fields ){
																			if( err ) throw err;
																			res.render('check',{
																				title: 'SCHOOL',
																				mess: 'CHECK RESULTS',
																				results: result,
																				fullname: fullname,
																				regid: regid,
																				theclass: theclass,
																				term: term,
																				session: session,
																				studentsnumber: count,
																				aggregriate: aggregriate
																			});
																		});
																	}else if(results[0].user === null){
																		var date = new Date();
																		db.query('UPDATE pins SET amount_used = ?, term = ?, session = ?, regid = ?, date_used = ?, user = ? WHERE pin = ?', [results[0].amount_used + 1, term, session, regid, date, fullname, pin], function ( err, results, fields ){
																			if( err ) throw err;
																			var success = 'Your result is ready!';
																			res.render('check',{
																				title: 'SCHOOL',
																				mess: 'CHECK RESULTS',
																				results: result,
																				studentsnumber: count,
																				fullname: fullname,
																				regid: regid,
																				theclass: theclass,
																				term: term,
																				session: session,
																				aggregriate: aggregriate
																			});
																		});
																	}	
																}
															});
														}
													});
												});
											});
										}
									});
								}
							});
						}
					});
				}
			}
		});
	}
});

//post results
router.post('/postresult', authentificationMiddleware(), [	check('session', 'Session must be 9 characters').isLength(9), check('term', 'Term must be 8 characters').isLength(8), check('theclass', 'You must be a theclass teacher to upload results').isLength(3, 12)  ], function(req, res, next) {
	var currentUser = req.session.passport.user.user_id;
	

	var term = req.body.term;
	var theclass = req.body.theclass;
	var session = req.body.session;
	var regid = req.body.regid;
	var fullname = req.body.student;
	var subject = req.body.subject;
	var ca = req.body.ca;
	var exam = req.body.exam;
	var total = req.body.total;
	var grade = req.body.grade;
	var remark = req.body.remark;
	console.log(req.body)
	
	var errors = validationResult(req).errors;
	if (errors.length > 0){
		res.render('postresult', {post: post, mess: 'ADMIN DASHBOARD', errors: errors, session:session, fullname: fullname, ca: ca, exam: exam, total: total});
	}else{
		db.query('SELECT * FROM students WHERE theclass = ? and full_name = ? and regid = ?', [theclass, fullname, regid], function ( err, results, fields ){
			if( err ) throw err;
			console.log(results)
			if (results.length === 0){
				var error = 'Student details is incorrect.';
				req.flash('error', error);
				res.redirect('/postresult');
			}else{
				console.log(results)
				db.query('SELECT * FROM available_results WHERE session = ? AND term = ?  and available = ?', [session, term, fullname, 'Yes'], function ( err, results, fields ){
					if( err ) throw err;
					if (results.length > 0){
						var error = 'This result batch has been released hence, you cannot add to it ';
						req.flash('postresulterror', error);
						res.redirect('/postresult');
					}else{
						db.query('SELECT * FROM results WHERE session = ? AND term = ? and full_name = ?', [session, term, fullname], function ( err, results, fields ){
							if( err ) throw err;
							if (results.length > 0){
								var error = 'Result Exist already';
								req.flash('error', error);
								res.redirect('/postresult');
							}else{
								var yr = session.split('/');
								var year = yr[0];
								securePin.generateString(5, charSet, function(str){
									var resultid = year + theclass + str;
									
									for (var i = 0; i < subject.length; i++){
										if(subject[i] !== 'None'){
											db.query('INSERT INTO results (resultid, full_name, theclass, term, session, regid, subject, grade, ca, exam, total) VALUES (?,?,?,?,?,?,?,?,?,?,?)', [resultid,  fullname, theclass, term, session, regid, subject[i], grade[i], ca[i], exam[i], total[i]],  function(err, results, fields){
												if (err) throw err;
											});
										}
									}
									db.query('SELECT agg AS agg, SUM(total) AS sum,  COUNT(subject) AS count  FROM results WHERE term = ? and session = ? and theclass = ? and full_name = ? and regid = ?', [term, session, theclass, fullname, regid], function ( err, results, fields ){
										if( err ) throw err;
										
										if (results[0].sum === null){
											var error = 'Result is empty!';
											req.flash('error', error);
											res.redirect('/postresult');
										}else{
											console.log(results, 'yes')
											var sum = results[0].sum;
											var count = results[0].count;
											var aggregriate = sum / count;
											var agg = results[0].agg;
											
											db.query('UPDATE results SET agg = ? WHERE term = ? and session = ? and regid = ? AND full_name = ? AND  theclass  = ?', ['Yes', term, session, regid, fullname,   theclass ], function ( err, results, fields ){
												if( err ) throw err;
												
												db.query('INSERT INTO aggregriate (resultid, class_teacher_remark, aggregriate, grand_total, subjects, term, session, theclass, full_name, regid ) VALUES (?,?,?,?,?,?,?,?,?,?)', [resultid, remark,aggregriate, sum, count, term, session, theclass, fullname, regid ],  function(err, results, fields){
													if (err) throw err;
													console.log(i, agg)
													var success = 'Result uploaded successfully';
													req.flash('success', success);
													res.redirect('/postresult');
												});
											});	
										}
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


//edit results
router.post('/editresult/:resultid', authentificationMiddleware(), [	check('session', 'Session must be 9 characters').isLength(9), check('term', 'Term must be 8 characters').isLength(8), check('theclass', 'You must be a theclass teacher to upload results').isLength(3, 12)  ], function(req, res, next) {
	var currentUser = req.session.passport.user.user_id;
	

	var term = req.body.term;
	var theclass = req.body.theclass;
	var resultid = req.params.resultid;
	var session = req.body.session;
	var regid = req.body.regid;
	var fullname = req.body.full_name;
	var subject = req.body.subject;
	var ca = req.body.ca;
	var exam = req.body.exam;
	var total = req.body.total;
	var grade = req.body.grade;
	var remark = req.body.remark;
	console.log(req.body)
	
	var errors = validationResult(req).errors;
	if (errors.length > 0){
		res.render('editresult', {edit: edit, mess: 'ADMIN DASHBOARD', errors: errors, session:session, fullname: fullname, ca: ca, exam: exam, total: total});
	}else{
		db.query('SELECT * FROM available_results WHERE session = ? AND term = ? ', [session, term], function ( err, results, fields ){
			if( err ) throw err;
			var result = results;
			if (results.length === 0){
				var error = 'This result batch has not been added. Ask an Administrator to add it ';
				req.flash('edittresulterror', error);
				res.redirect('/editresult');
			}else if(result[0].available === 'Yes'){
				var error = 'This result batch has been made available for viewing. Ask an Administrator to set it to "No" in the "Add Results" section to proceed. ';
				req.flash('edittresulterror', error);
				res.redirect('/editresult');
			}else if(result[0].available === 'No'){
				db.query('DELETE FROM results WHERE resultid = ?', [resultid], function ( err, results, fields ){
					if( err ) throw err;
					for (var i = 0; i < subject.length; i++){
						if(subject[i] !== 'None'){
							db.query('INSERT INTO results (resultid, full_name, theclass, term, session, regid, subject, grade, ca, exam, total) VALUES (?,?,?,?,?,?,?,?,?,?,?)', [resultid,  fullname, theclass, term, session, regid, subject[i], grade[i], ca[i], exam[i], total[i]],  function(err, results, fields){
								if (err) throw err;
							});
						}
					}
					db.query('SELECT SUM(total) AS sum,  COUNT(subject) AS count  FROM results WHERE  resultid = ?', [resultid], function ( err, results, fields ){
						if( err ) throw err;
						console.log(results[0])
						if(results[0].sum === null){
							var error = 'Result Set is Empty!';
							req.flash('error', error);
							res.redirect('/editresult/' + resultid);
						}else{
							var sum = results[0].sum;
							var count = results[0].count;
							var aggregriate = sum / count;
							
							db.query('UPDATE aggregriate SET  class_teacher_remark = ?, aggregriate = ?, grand_total = ?, subjects = ? WHERE  term = ? AND session = ? AND theclass = ? AND full_name = ? AND regid = ? ', [remark, aggregriate, sum, count, term, session, theclass, fullname, regid ],  function(err, results, fields){
								if (err) throw err;
								var success = 'Result Updated';
								req.flash('success', success);
								res.redirect('/editresult/' + resultid);
							});
						}
					});
				});
			}else{
				var error = 'Something Went Wrong.';
				req.flash('error', error);
				res.redirect('/editresult/' + resultid);
			
			}
		});
	}
});



//Add positions
router.post('/addposition/:theclass/', authentificationMiddleware(), function(req, res, next) {
	var theclass = req.params.theclass;
	var fullname = req.body.fullname;
	var term = req.body.term;
	var session = req.body.session;
	var aggregriate = req.body.aggregriate;
	var position = req.body.position;
	var regid = req.body.regid;
	
	for (var i = 0; i < fullname.length; i++){
		db.query('UPDATE aggregriate SET position = ?  WHERE term = ? AND session = ? AND regid = ? AND full_name = ? AND  theclass  = ?', [position[i],  term[0], session[0],  regid[i], fullname[i],   theclass,  ], function ( err, results, fields ){
			if( err ) throw err;
		});
	}
	var success = 'Positions added';
	req.flash('success', success);
	res.redirect('/addposition');
});


//Recalculate aggregriate
router.post('/recalculateaggregriate', authentificationMiddleware(), [	check('class_admitted', 'Class Admitted must be 3 to 5 characters').isLength(3, 5),  check('fullname', 'Full Name must be 8 to 25 characters').isLength(8, 25),   check('session', 'Session must be 9 characters').isLength(9),   ], function(req, res, next) {
	var currentUser = req.session.passport.user.user_id;
	
	var theclass = req.body.theclass;
	var session = req.body.session;
	var term = req.body.fullname;
	
	
	var errors = validationResult(req).errors;
	if (errors.length > 0){
		res.render('admin', { errors: errors, mess: 'ADMIN DASHBOARD', session:session, fullname:fullname, theclass: theclass , regid:regid });
	}else{
		db.query('SELECT * FROM results WHERE term = ? and session = ? and theclass = ? ', [term, session, theclass], function ( err, results, fields ){
			if( err ) throw err;
			var result = results;
			if (results.length === 0){
				var error = 'This batch of results does not exist.';
				req.flash('recalculateaggregriate', error);
				res.redirect('/dashboard/#recalculateaggregriate');
			}else{
				db.query('SELECT term FROM aggregriate WHERE term = ? and session = ? and theclass = ? ', [term, session, theclass], function ( err, results, fields ){
					if( err ) throw err;
					var result = results;
					if (results.length === 0){
						var error = 'You have not calculated this aggregriates before now.';
						req.flash('recalculateaggregriate', error);
						res.redirect('/dashboard/#recalculateaggregriate');
					}else{
						for(i = 0; i < result.length; i++){
							db.query('SELECT SUM(total) FROM results AS sum WHERE term = ? and session = ? and theclass = ? and full_name = ? and regid = ?', [term, session, theclass, result[i].full_name, result[i].regid], function ( err, results, fields ){
								if( err ) throw err;
								var sum = results[0].sum;
								db.query('SELECT COUNT(subject) FROM results AS count WHERE term = ? and session = ? and theclass = ? and full_name = ? and regid = ?', [term, session, theclass, result[i].full_name, result[i].regid], function ( err, results, fields ){
									if( err ) throw err;
									var count = results[0].count;
									var agg = sum / count;
									var aggregriate
									db.query('UPDATE aggregriate SET aggregriate = ?, term = ?, session = ?, grand_total  = ?, subjects  = ? WHERE regid = ? AND full_name = ? AND  theclass  = ?', [aggregriate,  term, session, sum, count, result[i].regid, result[i].full_name,   theclass,  ], function ( err, results, fields ){
										if( err ) throw err;
										var success = 'Calculation was successful.';
										req.flash('calculateaggregriatesuccess', success);
										res.redirect('/dashboard/#calculateaggregriate');
									});
								}); 
							});
						}
					}
				});
			}
		});
	}
});


//add transfer student
router.post('/transferstudent', authentificationMiddleware(), [	check('class_admitted', 'Class Admitted must be 3 to 5 characters').isLength(3, 5),  check('fullname', 'Full Name must be 8 to 25 characters').isLength(8, 25),   check('session', 'Session must be 9 characters').isLength(9),   ], function(req, res, next) {
	var currentUser = req.session.passport.user.user_id;
	
	var theclass = req.body.class_admitted;
	var regid = req.body.regid;
	var session = req.body.session;
	var fullname = req.body.fullname;

	
	var errors = validationResult(req).errors;
	if (errors.length > 0){
		res.render('dashboard', { errors: errors, mess: 'DASHBOARD', session:session, fullname:fullname, theclass:theclass , regid:regid });
	}else{
		db.query('SELECT theclass, full_name FROM classteacher WHERE theclass = ? ', [theclass], function ( err, results, fields ){
			if( err ) throw err;
			db.query('SELECT * FROM students WHERE full_name = ? and regid = ? ', [fullname, regid], function ( err, results, fields ){
				if( err ) throw err;
				if(results.length === 0){
					var error = 'Incorrect Student Details';
					req.flash('transferstudenterror', error);
					res.redirect('/dashboard/#transferstudent');
				}else{
					var classteacher = results[0].full_name;
					db.query('UPDATE students SET theclass = ?, classteacher = ? WHERE regid = ? AND full_name = ?', [theclass, classteacher, regid, fullname], function ( err, results, fields ){
						if( err ) throw err;
						var success = 'Student Transferred';
						req.flash('transferstudentsuccess', success);
						res.redirect('/dashboard/#transferstudent');
														
					});
				}
			});
		});
	}
});


//add student
router.post('/addstudent', authentificationMiddleware(), [	check('class_admitted', 'Class Admitted must be 3 to 5 characters').isLength(3, 5),  check('fullname', 'Full Name must be 8 to 25 characters').isLength(8, 25),   check('session', 'Session must be 9 characters').isLength(9),   ], function(req, res, next) {
	var currentUser = req.session.passport.user.user_id;
	
	var class_admitted = req.body.class_admitted;
	var regid = req.body.regid;
	var session = req.body.session;
	var fullname = req.body.fullname;

	
	var errors = validationResult(req).errors;
	if (errors.length > 0){
		res.render('dashboard', { errors: errors, mess: ' DASHBOARD', session:session, fullname:fullname, class_admitted:class_admitted , regid:regid });
	}else{
		db.query('SELECT theclass, full_name FROM classteacher WHERE theclass = ? ', [class_admitted], function ( err, results, fields ){
			if( err ) throw err;
			if (results.length === 0){
				var error = 'Assign a theclass teacher to this theclass first';
				req.flash('addstudenterror', error);
				res.redirect('/dashboard/#addstudent');
			}else{
				var classteacher = results[0].full_name;
				db.query('SELECT full_name FROM students WHERE full_name = ? ', [fullname], function ( err, results, fields ){
					if( err ) throw err;
					if (results.length > 0){
						var error = 'Student Name already exist. Try adding a middle name.';
						req.flash('addstudenterror', error);
						res.redirect('/dashboard/#addstudent');
					}else{
						db.query('SELECT regid FROM students WHERE regid = ? ', [regid], function ( err, results, fields ){
							if( err ) throw err;
							if (results.length > 0){
								var error = 'Registration Id already exist. Try leaving this column blank so we can generate a unique id for you.';
								req.flash('addstudenterror', error);
								res.redirect('/dashboard/#addstudent');
							}else{
								if(regid === '' || regid === null ){
								
									var sess = session.split('/');
									var sess1 = sess[0].toString();
									var sess2 = sess1.split('');
									var sess3 = sess2[2] + sess2[3];
									db.query('SELECT id FROM students ORDER BY id DESC', function ( err, results, fields ){
										if( err ) throw err;
										if (results.length === 0){
											var id = 1;
											var regid = sess3 + '/' + id;
											db.query('INSERT INTO students ( classteacher, full_name, theclass, session, regid) VALUES (?,?,?,?,?)', [ classteacher, fullname, class_admitted, session, regid],  function(err, results, fields){
											if (err) throw err;
											var success = 'Student Added!';
												req.flash('addstudentsuccess', success);
												res.redirect('/dashboard/#addstudent');
											
											});
										}else{
											var id = results[0].id + 1;
											var regid = sess3 + '/' + id;
											db.query('INSERT INTO students (classteacher, full_name, theclass, session, regid) VALUES (?, ?,?,?,?)', [classteacher, fullname, class_admitted, session, regid],  function(err, results, fields){
												if (err) throw err;
												var success = 'Student Added';
												req.flash('addstudentsuccess', success);
												res.redirect('/dashboard/#addstudent');
												
											});
										}
									});
								}else{
									console.log(regid)
									db.query('INSERT INTO students (classteacher, full_name, theclass, session, regid) VALUES (?,?,?,?,?)', [ classteacher, fullname, class_admitted, session, regid],  function(err, results, fields){
										if (err) throw err;
										var success = 'Student Added!';
											req.flash('addstudentsuccess', success);
											res.redirect('/dashboard/#addstudent');
										
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


//Add remark to result sheet
router.post('/addremark', authentificationMiddleware(),  function(req, res, next) {
	
	db.query('SELECT * FROM remark', function ( err, results, fields ){
		if( err ) throw err;
		var remark = results;
		db.query('SELECT * FROM current_session', function ( err, results, fields ){
			if( err ) throw err;
			var current = results[0];
			db.query('UPDATE aggregriate SET remark = ? WHERE (aggregriate >= ? OR aggregriate  <= ?) AND session = ? and term = ? ', [remark[0].remark, remark[0].mini, remark[0].maxi, current.session, current.term ], function ( err, results, fields ){
				if( err ) throw err;
				db.query('UPDATE aggregriate SET remark = ? WHERE (aggregriate >= ? OR aggregriate  <= ?) AND session = ? and term = ? ', [remark[1].remark, remark[1].mini, remark[1].maxi, current.session, current.term ], function ( err, results, fields ){
					if( err ) throw err;
					db.query('UPDATE aggregriate SET remark = ? WHERE (aggregriate >= ? OR aggregriate  <= ?) AND session = ? and term = ? ', [remark[2].remark, remark[2].mini, remark[2].maxi, current.session, current.term ], function ( err, results, fields ){
						if( err ) throw err;
						db.query('UPDATE aggregriate SET remark = ? WHERE (aggregriate >= ? OR aggregriate  <= ?) AND session = ? and term = ? ', [remark[3].remark, remark[3].mini, remark[3].maxi, current.session, current.term ], function ( err, results, fields ){
							if( err ) throw err;
							db.query('UPDATE aggregriate SET remark = ? WHERE (aggregriate >= ? OR aggregriate  <= ?) AND session = ? and term = ? ', [remark[4].remark, remark[4].mini, remark[4].maxi, current.session, current.term ], function ( err, results, fields ){
								if( err ) throw err;
								db.query('UPDATE aggregriate SET remark = ? WHERE (aggregriate >= ? OR aggregriate  <= ?) AND session = ? and term = ? ', [remark[5].remark, remark[5].mini, remark[5].maxi, current.session, current.term ], function ( err, results, fields ){
									if( err ) throw err;
									db.query('UPDATE aggregriate SET remark = ? WHERE (aggregriate >= ? OR aggregriate  <= ?) AND session = ? and term = ? ', [remark[6].remark, remark[6].mini, remark[6].maxi, current.session, current.term ], function ( err, results, fields ){
										if( err ) throw err;
										var success = 'Remark Added to results successfully';
										req.flash('addremark', success);
										res.redirect('/admin/#addremark');
									});
								});
							});
						});
					});
				});
			});
		});
	});
	
});

//edit principal's remark

router.post('/editremark', authentificationMiddleware(), [	check('remark', ' Remark must be 8 to 35 characters').isLength(8, 35)], function(req, res, next) {
	var currentUser = req.session.passport.user.user_id;
	
	var remark = req.body.remark;
	
	
	
	var errors = validationResult(req).errors;
	if (errors.length > 0){
		res.render('admin', {errors: errors, mess: 'ADMIN DASHBOARD', remark:remark});
	}else{
		db.query('UPDATE remark SET remark = ? WHERE mini = ? and maxi = ? ', [remark[0], -99.99, 39.99 ], function ( err, results, fields ){
			if( err ) throw err;
			db.query('UPDATE remark SET remark = ? WHERE mini = ? and maxi = ? ', [remark[1], 40.00, 49.99 ], function ( err, results, fields ){
				if( err ) throw err;
				db.query('UPDATE remark SET remark = ? WHERE mini = ? and maxi = ? ', [remark[2], 50.00, 59.99 ], function ( err, results, fields ){
					if( err ) throw err;
					db.query('UPDATE remark SET remark = ? WHERE mini = ? and maxi = ? ', [remark[3], 60.00, 69.99 ], function ( err, results, fields ){
						if( err ) throw err;
						db.query('UPDATE remark SET remark = ? WHERE mini = ? and maxi = ? ', [remark[4], 70.00, 79.99 ], function ( err, results, fields ){
							if( err ) throw err;
							db.query('UPDATE remark SET remark = ? WHERE mini = ? and maxi = ? ', [remark[5], 80.00, 89.99 ], function ( err, results, fields ){
								if( err ) throw err;
								db.query('UPDATE remark SET remark = ? WHERE mini = ? and maxi = ? ', [remark[6], 90.00, 99.99 ], function ( err, results, fields ){
									if( err ) throw err;
									var success = 'Remark Updated!';
									req.flash('editremarksuccess', success);
									res.redirect('/admin/#editremark');
								});
							});
						});
					});
				});
			});
		});
	}
});


//remove results
router.post('/removeresults', authentificationMiddleware(), [	check('session', 'Session must be 9 characters').isLength(9)  ], function(req, res, next) {
	var currentUser = req.session.passport.user.user_id;
	
	var session = req.body.session;
	var term = req.body.term;
	
	var errors = validationResult(req).errors;
	if (errors.length > 0){
		res.render('admin', { mess: 'ADMIN DASHBOARD', errors: errors, session:session});
	}else{
		db.query('SELECT * FROM available_results WHERE session = ? AND term = ? ', [session, term], function ( err, results, fields ){
			if( err ) throw err;
			if(results.length === 0){
				var error = 'Result does not exist already';
				req.flash('removeresultserror', error);
				res.redirect('/admin/#removeresults');
			}else{
				db.query('DELETE FROM available_results WHERE term = ? and session = ?', [term, session],  function(err, results, fields){
					if (err) throw err;
					var success = 'Results is now unavailable for veiwing!';
					req.flash('removeresultssuccess', success);
					res.redirect('/admin/#removeresults');
				});
			}
		});
	}
});


//add results
router.post('/addresults', authentificationMiddleware(), [	check('session', 'Session must be 9 characters').isLength(9)  ], function(req, res, next) {
	var currentUser = req.session.passport.user.user_id;
	
	var session = req.body.session;
	var term = req.body.term;
	var available = req.body.available;
	
	var errors = validationResult(req).errors;
	if (errors.length > 0){
		res.render('admin', { mess: 'ADMIN DASHBOARD', errors: errors, session:session});
	}else{
		db.query('SELECT * FROM available_results WHERE session = ? AND term = ? ', [session, term], function ( err, results, fields ){
			if( err ) throw err;
			if(results.length > 0){
				if(results[0].available === 'Yes' && available === 'Yes'){
					var error = 'Result is already available for veiwing';
					req.flash('addresultserror', error);
					res.redirect('/admin/#addresults');
				}else if(results[0].available === 'No' && available === 'No'){
					var error = 'Result is already not available for veiwing';
					req.flash('addresultserror', error);
					res.redirect('/admin/#addresults');
				}else if(results[0].available === 'No' && available === 'Yes'){
					db.query('UPDATE available_results SET available = ? WHERE term = ? and session = ?', ['Yes', term, session], function ( err, results, fields ){
						if( err ) throw err;
						var success = 'Results is now available for veiwing!';
						req.flash('addresultssuccess', success);
						res.redirect('/admin/#addresults');
					});
				}else if(results[0].available === 'Yes' && available === 'No'){
					db.query('UPDATE available_results SET available = ? WHERE term = ? AND session = ?', ['No', term, session], function ( err, results, fields ){
						if( err ) throw err;
						var success = 'Results is now unavailable for veiwing!';
						req.flash('addresultssuccess', success);
						res.redirect('/admin/#addresults');
					});
				}
				
			}else{
				db.query('INSERT INTO available_results ( term, session, available) VALUES (?,?,?)', [term, session, available],  function(err, results, fields){
					if (err) throw err;
					var success = 'Results has been added!';
					req.flash('addresultssuccess', success);
					res.redirect('/admin/#addresults');
				});
			}
		});
	}
});

//unban
router.post('/unban', authentificationMiddleware(), [	check('fullname', 'Full name must be between 8 to 45 numbers').isLength(8,45)  ], function(req, res, next) {
	var currentUser = req.session.passport.user.user_id;
	
	var fullname = req.body.fullname;
	var regid = req.body.regid;
	
	var errors = validationResult(req).errors;
	if (errors.length > 0){
		res.render('admin', { mess: 'ADMIN DASHBOARD', errors: errors, fullname: fullname, regid: regid});
	}else{
		db.query('SELECT * FROM students WHERE full_name = ? AND regid = ? ', [fullname, regid], function ( err, results, fields ){
			if( err ) throw err;
			if(results.length === 0){
				var error = 'Student does not exist';
				req.flash('unbanerror', error);
				res.redirect('/admin/#unban');
			}else{
				db.query('SELECT * FROM ban WHERE full_name = ? AND regid = ? ', [fullname, regid], function ( err, results, fields ){
					if( err ) throw err;
					if(results.length > 0){
						db.query('DELETE FROM ban WHERE full_name = ? and regid = ?', [  fullname, regid],  function(err, results, fields){
							if (err) throw err;
							db.query('DELETE FROM card_error_history WHERE fullname = ? and regid = ?', [  fullname, regid],  function(err, results, fields){
								if (err) throw err;
								var success = 'Student Unbanned Successfully'
								req.flash('unbansuccess', success);
								res.redirect('/admin/#unban');
							});
						});
					}else{
						var error = 'Student  unrbanned already';
						req.flash('unbanerror', error);
						res.redirect('/admin/#unban');
					}
				});
			}
		});
	}
});	

//add roles
router.post('/addroles', authentificationMiddleware(), [	check('fullname', 'Full name must be between 8 to 45 numbers').isLength(8,45)  ], function(req, res, next) {
	var currentUser = req.session.passport.user.user_id;
	
	var role = req.body.role;
	var fullname = req.body.fullname;
	
	var errors = validationResult(req).errors;
	if (errors.length > 0){
		res.render('admin', { mess: 'ADMIN DASHBOARD', errors: errors, fullname: fullname});
	}else{
		db.query('SELECT * FROM user WHERE full_name = ? ', [fullname], function ( err, results, fields ){
			if( err ) throw err;
			if(results.length === 0){
				var error = 'User does not exist';
				req.flash('roleserror', error);
				res.redirect('/admin/#addroles');
			}else if(results[0].user_type === 'Teacher' && role === 'Teacher'){
				var error = 'User is already a Teacher!';
				req.flash('roleserror', error);
				res.redirect('/admin/#addroles');
			}else if(results[0].user_type === 'Administrator' && role === 'Administrator'){
				var error = 'User is already an administrator!';
				req.flash('roleserror', error);
				res.redirect('/admin/#addroles');
			}else if(results[0].user_type === 'Administrator' && role === 'Teacher'){
				db.query('UPDATE user SET user_type = ? WHERE full_name = ?', ['Teacher', fullname], function ( err, results, fields ){
					if( err ) throw err;
					var success = 'User has been converted from an administrator to a Teacher!';
					req.flash('rolessuccess', success);
					res.redirect('/admin/#addroles');
				});
			}else if(results[0].user_type === 'Teacher' && role === 'Administrator'){
				db.query('UPDATE user SET user_type = ? WHERE full_name = ?', ['Administrator', fullname], function ( err, results, fields ){
					if( err ) throw err;
					var success = 'User has been converted from a  Teacher to an Administrator!';
					req.flash('rolessuccess', success);
					res.redirect('/admin/#addroles');
				});
			}else if(results[0].user_type === 'user' && role === 'Administrator'){
				db.query('UPDATE user SET user_type = ? WHERE full_name = ?', ['Administrator', fullname], function ( err, results, fields ){
					if( err ) throw err;
					var success = 'User is now an Administrator!';
					req.flash('rolessuccess', success);
					res.redirect('/admin/#addroles');
				});
			}else if(results[0].user_type === 'user' && role === 'Teacher'){
				db.query('UPDATE user SET user_type = ? WHERE full_name = ?', ['Teacher', fullname], function ( err, results, fields ){
					if( err ) throw err;
					var success = 'User is now a Teacher!';
					req.flash('rolessuccess', success);
					res.redirect('/admin/#addroles');
				});
			}else{
				var error = 'Something Went Wrong';
				req.flash('roleserror', error);
				res.redirect('/admin/#addroles');
			}
		});
	}
});

//add results

//delete students
router.post('/deletestudent', authentificationMiddleware(), function(req, res, next) {
	var currentUser = req.session.passport.user.user_id;
	var fullname = req.body.fullname;
	var regid = req.body.regid;
	
	db.query('SELECT * FROM students WHERE full_name = ? and regid = ?', [fullname, regid], function ( err, results, fields ){
		if( err ) throw err;
		if(results.length === 0){
			var error = 'Student does not exist';
			req.flash('delstudent', error);
			res.redirect('/dashboard/#deletestudent');
		}else{
			db.query('DELETE FROM students WHERE full_name = ? and regid = ?', [  fullname, regid],  function(err, results, fields){
				if (err) throw err;
				var success = 'Student deleted successfully!';
				req.flash('delsuccess', success);
				res.redirect('/dashboard/#deletestudent');
			});
		}
	});
});

//classteacher
router.post('/addclassteacher', authentificationMiddleware(), function(req, res, next) {
	var currentUser = req.session.passport.user.user_id;
	var fullname = req.body.fullname;
	var theclass = req.body.theclass;
	db.query('SELECT * FROM user WHERE full_name = ? ', [fullname], function ( err, results, fields ){
		if( err ) throw err;
		if(results.length === 0){
			var error = 'User does not exist';
			req.flash('classteachererror', error);
			res.redirect('/admin/#classteacher');
		}else{
			db.query('SELECT * FROM classteacher WHERE full_name = ? ', [fullname], function ( err, results, fields ){
				if( err ) throw err;
				if(results.length > 0){
					var error = 'This teacher is already a theclass teacher. Relieve him of his responsibilities first before you assign a new one.';
					req.flash('classteachererror', error);
					res.redirect('/admin/#classteacher');
				}else{
					db.query('INSERT INTO classteacher (theclass, full_name) VALUES (?,?)', [theclass, fullname], function ( err, results, fields ){
						if( err ) throw err;
						var success = 'Class Teacher added successfully!';
						req.flash('addclassteachersuccess', success);
						res.redirect('/admin/#classteacher');
					});
				}
			});
		}
	});
});	


//delete  classteacher
router.post('/deleteclassteacher', authentificationMiddleware(), function(req, res, next) {
	var currentUser = req.session.passport.user.user_id;
	var fullname = req.body.fullname;
	var theclass = req.body.theclass;
	db.query('SELECT * FROM user WHERE full_name = ? ', [fullname], function ( err, results, fields ){
		if( err ) throw err;
		if(results.length === 0){
			var error = 'User does not exist';
			req.flash('classteachererror', error);
			res.redirect('/admin/#classteacher');
		}else{
			db.query('SELECT * FROM classteacher WHERE full_name = ? ', [fullname], function ( err, results, fields ){
				if( err ) throw err;
				if(results.length === 0){
					var error = 'This teacher is not a theclass teacher. Assign a responsibility.';
					req.flash('classteachererror', error);
					res.redirect('/admin/#classteacher');
				}else{
					db.query('DELETE FROM classteacher WHERE full_name = ?', [  fullname],  function(err, results, fields){
						if (err) throw err;
						var success = 'Class Teacher deleted successfully!';
						req.flash('classteachersuccess', success);
						res.redirect('/admin/#classteacher');
					});
				}
			});
		}
	});
});


//add subjects
router.post('/addsubject', authentificationMiddleware(),  function(req, res, next) {
	
	var subject = req.body.subject.toUpperCase();
	
	
	db.query('SELECT * FROM subjects WHERE subject = ?', [subject], function ( err, results, fields ){
		if( err ) throw err;
		if(results.length > 0){
			var error = 'Subject already exist';
			req.flash('addsubjecterror', error);
			res.redirect('/admin/#addsubject');
		}else{
			console.log(subject)
			db.query('INSERT INTO subjects (subject) VALUES (?)', [subject], function ( err, results, fields ){
				if( err ) throw err;
				var success = 'Subject added successfully!';
				req.flash('addsubjectsuccess', success);
				res.redirect('/admin/#addsubject');
			});
		}
	});
});	


//remove subject
router.post('/removesubject', authentificationMiddleware(), function(req, res, next) {
	
	var subject = req.body.subject.toUpperCase();
	db.query('SELECT * FROM subjects WHERE subject = ?', [subject], function ( err, results, fields ){
		if( err ) throw err;
		if(results.length === 0){
			var error = 'Subject does not exist';
			req.flash('removesubjecterror', error);
			res.redirect('/admin/#removesubject');
		}else{
			db.query('DELETE FROM subjects WHERE subject = ? ', [ subject.toUpperCase()],  function(err, results, fields){
				if (err) throw err;
				var success = 'Subject deleted successfully!';
				req.flash('removesubjectsuccess', success);
				res.redirect('/admin/#removesubject');
			});
		}
	});
});



//deleteuser
router.post('/deleteuser', authentificationMiddleware(), function(req, res, next) {
	var currentUser = req.session.passport.user.user_id;
	var fullname = req.body.fullname;
	
	db.query('SELECT * FROM user WHERE full_name = ? ', [fullname], function ( err, results, fields ){
		if( err ) throw err;
		if(results.length === 0){
			var error = 'User does not exist';
			req.flash('delusererror', error);
			res.redirect('/admin/#deleteuser');
		}else{
			db.query('DELETE FROM user WHERE full_name = ? ', [  fullname],  function(err, results, fields){
				if (err) throw err;
				var success = 'User deleted successfully!';
				req.flash('delusersuccess', success);
				res.redirect('/admin/#deleteuser');
			});
		}
	});
});
	
	
//restrict
router.post('/restrict', authentificationMiddleware(), [	check('fullname', 'Full name must be between 8 to 45 numbers').isLength(8,45),  check('regid', 'Registration ID must be between 5 to 10 numbers').isLength(5,10)  ], function(req, res, next) {
	var currentUser = req.session.passport.user.user_id;
	
	var session = req.body.session;
	var term = req.body.term;
	var fullname = req.body.fullname;
	var regid = req.body.regid;
	
	var errors = validationResult(req).errors;
	if (errors.length > 0){
		res.render('admin', { mess: 'ADMIN DASHBOARD', errors: errors, fullname: fullname, regid: regid});
	}else{
		db.query('SELECT * FROM students WHERE full_name = ? AND regid = ? ', [fullname, regid], function ( err, results, fields ){
			if( err ) throw err;
			if(results.length === 0){
				var error = 'Student does not exist';
				req.flash('restricterror', error);
				res.redirect('/admin/#restrict');
			}else{
				db.query('SELECT * FROM restricted WHERE full_name = ? AND regid = ? and session = ? and term = ?', [fullname, regid, session, term], function ( err, results, fields ){
					if( err ) throw err;
					if(results.length === 0){
						db.query('INSERT INTO restricted ( full_name, regid, term, session, date) VALUES (?,?,?,?,?)', [  fullname, regid, term, session, date],  function(err, results, fields){
							if (err) throw err;
							var success = 'Student Restricted Successfully'
							req.flash('restrictsuccess', success);
							res.redirect('/admin/#restrict');
						});
					}else{
						var error = 'Student has been restricted already';
						req.flash('restricterror', error);
						res.redirect('/admin/#restrict');
					}
				});
			}
		});
	}	
});

//unrestrict
router.post('/unrestrict', authentificationMiddleware(), [	check('fullname', 'Full name must be between 8 to 45 numbers').isLength(8,45),  check('regid', 'Registration ID must be between 5 to 10 numbers').isLength(5,10)  ], function(req, res, next) {
	var currentUser = req.session.passport.user.user_id;
	
	var session = req.body.session;
	var term = req.body.term;
	var fullname = req.body.fullname;
	var regid = req.body.regid;
	
	var errors = validationResult(req).errors;
	if (errors.length > 0){
		res.render('admin', { mess: 'ADMIN DASHBOARD', errors: errors, fullname: fullname, regid: regid});
	}else{
		db.query('SELECT * FROM students WHERE full_name = ? AND regid = ? ', [fullname, regid], function ( err, results, fields ){
			if( err ) throw err;
			if(results.length === 0){
				var error = 'Student does not exist';
				req.flash('unrestricterror', error);
				res.redirect('/admin/#unrestrict');
			}else{
				db.query('SELECT * FROM restricted WHERE full_name = ? AND regid = ? and session = ? and term = ?', [fullname, regid, session, term], function ( err, results, fields ){
					if( err ) throw err;
					if(results.length > 0){
						db.query('DELETE FROM restricted WHERE full_name = ? and regid = ? and term = ? and session = ?', [  fullname, regid, term, session, date],  function(err, results, fields){
							if (err) throw err;
							var success = 'Student Unrestricted Successfully'
							req.flash('unrestrictsuccess', success);
							res.redirect('/admin/#unrestrict');
						});
					}else{
						var error = 'Student  unrestricted already';
						req.flash('unrestricterror', error);
						res.redirect('/admin/#unrestrict');
					}
				});
			}
		});
	}
});


router.get('*', function(req, res, next) {
  res.render('404',{title: 'SCHOOL', mess: 'Page not found'});
});

module.exports = router;
