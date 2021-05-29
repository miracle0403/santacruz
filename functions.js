var db = require('./db.js');


exports.ban = function(user, regid, session, term){
	var date = new Date().getTime();
	
	db.query('SELECT * FROM card_error_history WHERE user = ? AND regid = ?', [user, regid], function ( err, results, fields ){
		if( err ) throw err;
		// get the last onerror
		
		if(results.length === 0){
			db.query('INSERT INTO card_error_history (trials, user, regid, session, term) VALUES (?,?,?,?,?)', [1, user, regid, session, term], function(err, results, fields){
				if(err) throw err;
				var left = 'If you enter a wrong or used pin 2 more times your access to your results will be disabled.' ;
				console.log(left, '1')
				return left;
			});
		}else{
			var last = results.slice(-1)[0];
			var setdate = last.date_committed.setHours(last.date_committed.getHours() + 72);
			console.log(setdate, setdate <= date, setdate >= date , date)
			if(setdate <= date){
				db.query('DELETE FROM card_error_history WHERE user = ? ', [user],  function(err, results, fields){
					if (err) throw err;
					db.query('INSERT INTO card_error_history (trials, user, regid, session, term) VALUES (?,?,?,?,?)', [1, user, regid, session, term], function(err, results, fields){
						if(err) throw err;
						var left = 'If you enter a wrong or used pin 2 more times your access to your results will be disabled.' ;
						console.log(left, '2')
						return left;
					});
					
				});
			}else{
				if(last.trials === 2){
				db.query('INSERT INTO card_error_history (trials, user, regid, session, term) VALUES (?,?,?,?,?)', [3, user, regid, session, term], function(err, results, fields){
					if(err) throw err;
					db.query('INSERT INTO ban ( user, regid) VALUES (?,?)', [user, regid], function(err, results, fields){
						if(err) throw err;
						var left = 'You have been banned from using this service';
						console.log(left, '3')
						return left;
					});
				});
			}else{
				var trials = last.trials + 1;
					db.query('INSERT INTO card_error_history (trials, user, regid, session, term) VALUES (?,?,?,?,?)', [trials, user, regid, session, term], function(err, results, fields){
						if(err) throw err;
						var rem = 3 - trials;
						var left = 'If you enter a wrong or used pin ' + rem +' more times your access to your results will be disabled.' ;
						console.log(left, rem, '4')
						return left;
					});
				}
			}
		}
	});
}



exports.suffix = function(no){
	var i = no - 1;
	if(no == 1){
		var suf = 'st';
		var position = no + suf;
		return position;
	}else if(no == 2){
		var suf = 'nd';
		var position = no + suf;
		return position;
	}else if(no == 3){
		var suf = 'rd';
		var position = no + suf;
		return position;
	}else{
		if(no > 20){
			var r = no.split('');
			var t = r.pop();
			if(t == 1){
				var suf = 'st';
				var position = no + suf;
				return position;
			}else if(t == 2){
				var suf = 'nd';
				var position = no + suf;
				return position;
			}else if(t == 3){
				var suf = 'rd';
				var position = no + suf;
				return position;
			}else{
				var suf = 'th';
				return position;
			}
		}else{
			var suf = 'th';
			var position = no + suf;
			return position;
		}
	}
}

exports.aggregriate = function(resu, term, session, theclass){
	for(var i = 0; i < resu.length; i++){
		var ii = i; 
		db.query('SELECT agg AS agg, SUM(total) AS sum,  COUNT(subject) AS count  FROM results WHERE term = ? and session = ? and class = ? and full_name = ? and regid = ?', [term, session, theclass, resu[i].full_name, resu[i].regid], function ( err, results, fields ){
			if( err ) throw err;
			console.log(i, ii)
			var sum = results[0].sum;
			var count = results[0].count;
			var aggregriate = sum / count;
			var agg = results[0].agg;
			
			if(agg === 'No'){
				console.log(agg, i)
				db.query('UPDATE results SET agg = ? WHERE term = ? and session = ? and regid = ? AND full_name = ? AND  class  = ?', ['Yes', term, session, resu[i].regid, resu[i].full_name,   theclass ], function ( err, results, fields ){
					if( err ) throw err;
					var i = ii;
					console.log(agg, i)
					db.query('INSERT INTO aggregriate ( aggregriate, grand_total, subjects, term, session, class, full_name, regid ) VALUES (?,?,?,?,?,?,?,?)', [aggregriate, sum, count, term, session, theclass, resu[i].full_name, resu[i].regid ],  function(err, results, fields){
						if (err) throw err;
						console.log(i, agg)
						
					});
				});
			}
		 
		});
	}
}