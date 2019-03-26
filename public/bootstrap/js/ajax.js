$( document ).ready( function ( ){
	//var xhttp = new XMLHttpRequest();
	$( '#fileerror' ).hide( );
	$( '#progress' ).hide( );
	$( '#imagepic' ).hide( );
	$(':file#Picture').change(function(){
		var file  =  this.files[0];
		//alert( file.type )
		var asize = 2 * 1024 * 1024;
		if(( file.type === 'image/png' || file.type ==='image/jpg' || file.type === 'image/jpeg' ) && file.size <= asize){
			
			$( '#fileerror' ).hide();
			$( '#progress' ).show( );
			$( '#progress' ).html( 'File is loading........' );
			var reader = new FileReader( );
			var img = document.createElement( 'img' );
			reader.onloadend = function(){
				img.src  =  reader.result;
				img.width = 150;
				img.height = 250;
			}
			reader.readAsDataURL( file );
			$( '#Picture' ).after( img );
			$( '#progress' ).hide( );
				
		}else{
			$( '#fileerror' ).show(  );
			$( '#Picture' ).val( '' );	document .getElementById( 'fileerror' ).innerHTML  = 'File not accepted. Make sure the size is not more than 2mb. Also make sure its either png, jpg or jpeg.' 
			//alert( 'not ok' )
		}
	});
	//something else.... another function should go here.
	
	$( '#jss' ).hide( );
	$( '#sss' ).hide( );
	
	$('#classes').change(function(){
		var classes = this.value;
		if( classes === 'JSS'){
			$( '#jss' ).show( );
			$( '#sss' ).hide( );
		}
		if( classes === 'SSS'){
			$( '#jss' ).hide( );
			$( '#sss' ).show( );
		}
		if( classes === ''){
			$( '#jss' ).hide( );
			$( '#sss' ).hide( );
		}
	});
	
	//function to duplicate the addsub section
	
	/*$( '#j2' ).hide();
	//$( '#j21' ).hide();
	$( '#j41' ).hide();
	$( '#j31' ).hide();
	$( '#j51' ).hide();
	$( '#j61' ).hide();
	$( '#j71' ).hide();
	$( '#j81' ).hide();
	$( '#j91' ).hide();
	$( '#j101' ).hide();
	$( '#j111' ).hide();
	$( '#j3' ).hide( );
	$( '#j4' ).hide( );
	$( '#j5' ).hide( );
	$( '#j6' ).hide( );
	$( '#j7' ).hide( );
	$( '#j8' ).hide( );
	$( '#j9' ).hide( );
	$( '#j10' ).hide( );
	$( '#j11' ).hide( );*/
	
	
	
	
	$('#jssAdd').click(function(){
		var jssSub = $('#Jaddsub');
		//var itm = jssSub.contains()
		console.log(jssSub)
	});
});