<?php
defined('BASEPATH') OR exit('No direct script access allowed');
?>
<!DOCTYPE html PUBLIC "-//WAPFORUM//DTD XHTML Mobile 1.0//EN" "http://www.wapforum.org/DTD/xhtml-mobile10.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title>用户登陆-犀牛二手车评估系统</title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="viewport" content="width=device-width, heigth=device-width, minimum-scale=1.0, maximum-scale=2.0" />
<meta name="format-detection" content="telephone=no">
<link rel="stylesheet" href="/static/artdialog/css/ui-dialog.css">
<link rel="stylesheet" href="/static/css/westMobi.css" type="text/css" />
<style>
#denglu { 
font-size:18px; 
text-align:center;
padding:0px 0px 30px 0px;
} 
</style>
<script type="text/javascript" src="/static/js/jquery.js"></script>
<script type="text/javascript" src="/static/artdialog/dist/dialog-min.js"></script>
</head>
<body style="background-color:#0069b7">
	<div class="MainBody">
		<div class="mainInfoBody">
			<header id="header"> <section> <strong>会员登录</strong></section> </header>
			<div class="conBody">
                       
				<div class="pa10">
					<form id="login_form" name="login_form" action="<?php echo base_url().'index.php/login/do_login';?>" method="post">
					
     						<div id="denglu">
						  
						   <img src="/static/img/Login_Logo.png" style="width:60px;height:60px;padding:0px;margin:0px;vertical-align:middle;"/>
 						   <span>犀牛二手车评估系统</span>
 						</div>
                                              	<div class="field username">
							<div class="userbox">
								<label><em>*</em> 帐号：</label>
								<input type="text" name="u_name" id="u_name" class="login_username"	placeholder="会员帐号"  />
							</div>
						</div>
						<div class="field">
							<div class=" pwd">
								<label><em>*</em> 密码：</label>
								<input type="password" name="u_password" id="u_password" placeholder="密码" 	class="login_password"  />
							</div>
						</div>

						<div class="field submitlogin">
							<input type="submit" class="submit-btn" id="do_submit" value="登  录" />
						</div>
					</form>
				</div>
			</div>
			<!--<div class="mobiBottom">
				<div class="copyRight">
				</div>
			</div>-->
		</div>
	</div>
</body>
<script type="text/javascript">
function isWeiXin(){
    var ua = window.navigator.userAgent.toLowerCase();
    if(ua.match(/MicroMessenger/i) == 'micromessenger'){
        return true;
    }else{
        return false;
    }
}

$('#do_submit').click(function(){
	if($.trim($('#u_name').val()).length > 0  && $.trim($('#u_password').val()).length > 0 ){		
		dialog({content:"登录中..."}).show();
		$('#do_submit').attr('disabled',true);
		if( ! isWeiXin()){
			var url = $('#login_form').attr('action')+'/1';
			$('#login_form').attr('action',url);
		}
		$('#login_form').submit();
		return false;
	}else{
		$('#do_submit').attr('disabled',true);
		var d = dialog({content:"账号密码不能为空."});
		d.show();
		setTimeout(function () {
		    d.close().remove();
		    $('#do_submit').removeAttr("disabled");
		}, 2000);
		return false;	
	}
	return false;
});
</script>
</html>
