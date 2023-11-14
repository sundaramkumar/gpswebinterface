<?php
#ajxlogin.php
session_start();
include_once("../config/dbconn.php");
//include_once("./functions.php");

/*if($_GET)
{
			$loginQry = mysql_query("SELECT * FROM users WHERE username = '".$_GET['username']."' AND password=PASSWORD('".$_GET['password']."') AND status='E' ");
			$loginCnt = mysql_num_rows($loginQry);
			if($loginCnt == 0){
				echo "{ success: false, errors: { reason: 'Your Login details do not match.Please Contact InnoVTrack Support' }}";
				exit;
			}else{
				$loginRes = mysql_fetch_array($loginQry);
				$login_status	= $loginRes['status'];
				if($login_status=="D"){
					echo "{ success: false, errors: { reason: 'Your account is blocked,you have exceeded the no of attempts' }}";
					exit;
				}else{
					$userid 	= $loginRes['userid'];
					$username 	= $loginRes['username'];
					$usertype 	= $loginRes['usertype'];
					$customerid 	= $loginRes['customerid'];
					$_SESSION['userid'] 	= $userid;
					$_SESSION['username'] 	= $username;
					$_SESSION['usertype'] 	= $usertype;
					$_SESSION['customerid'] 	= $customerid;

					$upQry = "UPDATE users SET loginip = '". $_SERVER['REMOTE_ADDR'] ."' WHERE userid = '".$loginRes['userid']."'";
					$upRes = mysql_query($upQry);
					
					$cQry = "SELECT timezone from customers WHERE customerid = $customerid";
					$cRes = mysql_query($cQry);
					$cRow = mysql_fetch_array($cRes);
					$_SESSION['timzone'] = $cRow['timezone'];

					$_SESSION['loadpage']	= 'devices';
					header("location: ../cpanel.php");
					//echo "{ success: true}";
				}
			}		
}*/
if($_POST){
	
    if($_POST['username'] && $_POST['password'] && $_POST['code']){
		if($_SESSION['secureCode'] != md5($_POST['code']).'jlp'){
			echo "{ success: false,  errors:{ reason:'Please enter the Security Code correctly' ,eType:'CODE'}}";
		}else{
			$username 		= $_POST['username'];			
			
			$loginQry = mysql_query("SELECT * FROM users WHERE username = '".$_POST['username']."' AND password=PASSWORD('".$_POST['password']."') AND status='E' ");
			$loginCnt = mysql_num_rows($loginQry);
			if($loginCnt == 0){
				echo "{ success: false, errors: { reason: 'Your Login details do not match.Please Contact InnoVTrack Support' }}";
				exit;
			}else{
				if($_POST['remember_me'])
				{												
					//$cookie_arr[0]		= $_POST['username'];
					//$cookie_arr[1]		= $_POST['password'];
					$cookie_arr = $_POST['username'].','.$_POST['password'];
					setcookie("cook",$cookie_arr,strtotime("+30 days"),"/");
					//echo $cook_arr;
					//die;
					//$ex_date = date('M/d/Y H:i:s',strtotime("+30 days"));
					//setcookie("cook[username]",$cookie_arr[0],strtotime("+30 days"));
					//setcookie("cook[password]",$cookie_arr[1],strtotime("+30 days"));					
				}
				$loginRes = mysql_fetch_array($loginQry);
				$login_status	= $loginRes['status'];
				if($login_status=="D"){
					echo "{ success: false, errors: { reason: 'Your account is blocked,you have exceeded the no of attempts' }}";
					exit;
				}else{
					$userid 	= $loginRes['userid'];
					$username 	= $loginRes['username'];
					$usertype 	= $loginRes['usertype'];
					$customerid 	= $loginRes['customerid'];
					$_SESSION['userid'] 	= $userid;
					$_SESSION['username'] 	= $username;
					$_SESSION['usertype'] 	= $usertype;
					$_SESSION['customerid'] 	= $customerid;

					$upQry = "UPDATE users SET loginip = '". $_SERVER['REMOTE_ADDR'] ."' WHERE userid = '".$loginRes['userid']."'";
					$upRes = mysql_query($upQry);
					
					$cQry = "SELECT timezone from customers WHERE customerid = $customerid";
					$cRes = mysql_query($cQry);
					$cRow = mysql_fetch_array($cRes);
					$_SESSION['timzone'] = $cRow['timezone'];

					$_SESSION['loadpage']	= 'devices';
					echo "{ success: true}";
				}
			}
		}
    }else{
        echo "{ success: false, errors: { reason: 'Login failed. Please Try again.' }}";
    }
}
else
{
	$cook_val = $_COOKIE["cook"];
	$cook_arr = explode(',',$cook_val);
	if($cook_arr[0]!="" && $cook_arr[1]!="")
	{
		$loginQry = mysql_query("SELECT * FROM users WHERE username = '".$cook_arr[0]."' AND password=PASSWORD('".$cook_arr[1]."') AND status='E' ");
		$loginCnt = mysql_num_rows($loginQry);
		if($loginCnt == 0){
			echo "{ success: false, errors: { reason: 'Your Login details do not match.Please Contact InnoVTrack Support' }}";
			exit;
		}else{
			$loginRes = mysql_fetch_array($loginQry);
			$login_status	= $loginRes['status'];
			if($login_status=="D"){
				echo "{ success: false, errors: { reason: 'Your account is blocked,you have exceeded the no of attempts' }}";
				exit;
			}else{
				$userid 	= $loginRes['userid'];
				$username 	= $loginRes['username'];
				$usertype 	= $loginRes['usertype'];
				$customerid 	= $loginRes['customerid'];
				$_SESSION['userid'] 	= $userid;
				$_SESSION['username'] 	= $username;
				$_SESSION['usertype'] 	= $usertype;
				$_SESSION['customerid'] 	= $customerid;
	
				$upQry = "UPDATE users SET loginip = '". $_SERVER['REMOTE_ADDR'] ."' WHERE userid = '".$loginRes['userid']."'";
				$upRes = mysql_query($upQry);
						
				$cQry = "SELECT timezone from customers WHERE customerid = $customerid";
				$cRes = mysql_query($cQry);
				$cRow = mysql_fetch_array($cRes);
				$_SESSION['timzone'] = $cRow['timezone'];
				$_SESSION['loadpage']	= 'devices';
				header("location: ../cpanel.php");
				//echo "{ success: true}";
			}
		}
	}	
}
?>