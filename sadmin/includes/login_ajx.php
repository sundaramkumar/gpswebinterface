<?
#ajxlogin.php
session_start();
include_once("../config/dbconn.php");
//include_once("./functions.php");
if($_POST){
    if($_POST['username'] && $_POST['password'] && $_POST['code']){
		if($_SESSION['secureCode'] != md5($_POST['code']).'jlp'){
			echo "{ success: false,  errors:{ reason:'Please enter the Security Code correctly' ,eType:'CODE'}}";
		}else{
			$username 		= $_POST['username'];

			$loginQry = mysql_query("SELECT * FROM inhouseteam WHERE username = '".$_POST['username']."' AND password=PASSWORD('".$_POST['password']."')");
			$loginCnt = mysql_num_rows($loginQry);
			if($loginCnt == 0){
				echo "{ success: false, errors: { reason: 'Your Login details do not match.' }}";
				exit;
			}else{
				$loginRes = mysql_fetch_array($loginQry);
				$login_status	= $loginRes['login_status'];
				if($login_status=="D"){
					echo "{ success: false, errors: { reason: 'Your account is blocked,you have exceeded the no of attempts' }}";
					exit;
				}else{
					$userid 	= $loginRes['memberid'];
					$membername 	= $loginRes['membername'];
					$username 	= $loginRes['username'];
					$usertype 	= $loginRes['usertype'];
					$_SESSION['userid'] 	= $userid;
					$_SESSION['membername'] = $membername;
					$_SESSION['username'] 	= $username;
					$_SESSION['usertype'] 	= $usertype;

					$_SESSION['loadpage']	= '';
					echo "{ success: true}";
				}
			}
		}
    }else{
        echo "{ success: false, errors: { reason: 'Login failed. Please Try again.' }}";
    }
}
?>