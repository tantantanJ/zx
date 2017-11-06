$(function(){
	$('#loginbtn').click(function(){
		var username = $('#username').val();
		var password = $('#password').val();
		if(username == 'admin' && password == '123'){
			window.location.href = 'mainpage.html?id=admin';
		}else if(username == 'yonghu' && password == '123'){
			window.location.href = 'mainpage.html?id=yonghu';
		}else{
			
		}
	})
});