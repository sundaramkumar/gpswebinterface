<?php
session_start();
include_once("../config/dbconn.php");
include_once("./functions.php");

$todo = $_POST['todo'];

//Get Users List
if($todo == "Get_Users_List"){
	if(!preg_match('/showUsers/',$_SESSION['loadpage'])){
		$_SESSION['loadpage']	= $_SESSION['loadpage'].",showUsers";
	}

	$start	= $_POST['start'];
	$limit	= $_POST['limit'];
	
	$filterQry = "";
	$customerid	= $_POST['customerid'];
	$filtertext	= $_POST['filtertext'];
	if($customerid!="" && $customerid!="0"){
		if($filtertext!=''){
			$filterQry = "AND user.customerid=$customerid AND (user.username LIKE '%$filtertext%' OR user.realname LIKE '%$filtertext%' OR user.mobile LIKE '%$filtertext%')";
		}
		else{
			$filterQry = "AND user.customerid=$customerid";
		}
		
	}
	if($filtertext!=''){
		if($customerid!="" && $customerid!="0"){
			$filterQry = "AND user.customerid=$customerid AND (user.username LIKE '%$filtertext%' OR user.realname LIKE '%$filtertext%' OR user.mobile LIKE '%$filtertext%')";
		}
		else{
			$filterQry = "AND user.username LIKE '%$filtertext%' OR user.realname LIKE '%$filtertext%' OR user.mobile LIKE '%$filtertext%'";
		}
	} 
	
	

	$totQry	= mysql_query("SELECT cust.customerid,cust.customername,user.* FROM users user 
								LEFT OUTER JOIN customers cust ON cust.customerid = user.customerid WHERE user.userid!='' $filterQry");
	$totCnt	= mysql_num_rows($totQry);

	if($totCnt == 0){
		$myData[] = array(
			'userid'  	 => 0,
			'realname'   => "<span class='tableTextM'>No Users Found</span>"
		);
	}else{
		$userQry = mysql_query("SELECT cust.customerid,cust.customername,user.* FROM users user 
								LEFT OUTER JOIN customers cust ON cust.customerid = user.customerid WHERE user.userid!='' $filterQry LIMIT $start , $limit");
		while($userRes = mysql_fetch_array($userQry)){
		if($userRes['usertype']=='A')
		{
			$userRes_user='Administrator';
		}
		else if($userRes['usertype']=='E')
		{
			$userRes_user='Executive';
		}
		else
		{
			$userRes_user='User';
		}
			$myData[] = array(
				'userid'  	 		=> $userRes['userid'],
				'customerid'  	 	=> $userRes['customerid'],
				'customername'		=> $userRes['customername'],
				'salname'   	    => $userRes['salname'],
				'realname'   	    => $userRes['realname'],
				'contactname'		=> $userRes['salname'].$userRes['realname'],
				'username'   	    => $userRes['username'],
				'mobile'			=> $userRes['mobile'],
				'email'				=> $userRes['email'],
				'usertype'			=> $userRes_user,
				'city'				=> $userRes['city']
			);
			
		}
	}

    $myData = array('CUSTOMERS_U' => $myData, 'totalCount' => $totCnt);
	header('Content-Type: application/x-json');
    echo json_encode($myData);
}

//Add the User
if($todo == "Add_User"){
	$customerid	    = $_POST['customerid'];
	$salutation		= $_POST['salutation'];
	$contactperson	= $_POST['contactperson'];
	$mobile			= $_POST['mobile'];
	$email			= $_POST['email'];
	$username		= $_POST['username'];
	$password		= $_POST['password'];
	$cpassword		= $_POST['confpassword'];
	$usertype		= $_POST['usertype'];
	if($password == $cpassword )
	{
		$chkQry	= mysql_query("SELECT * FROM users WHERE username='".$username."'");
		$chkCnt	= mysql_num_rows($chkQry);
		if($chkCnt == 0){
			$usersQry = "INSERT INTO users(customerid, salname, realname, mobile, email,
							failedcount,usertype,username,password,addedby,addedon)
							VALUES('".$customerid."', '".$salutation."', '".$contactperson."', '".$mobile."', '".$email."',
							'0', '".$usertype."', '".$username."', PASSWORD('".$password."'), '".$_SESSION['userid']."', '". date("Y-m-d H:i:s")."')";
			$usersRes = mysql_query($usersQry);
			if($usersRes){
				echo "{ success: true,msg:'User <b>$username</b> Added Successfully.'}";
			}else{
				echo "{ success: true,msg:'User <b>$username</b> Added Failed.<br/>'}";
			}
			/***
			 *
			 * Create new table specific to this customer for managing his devices
			 *
			 ****/
		
		}else{
			echo "{ success: false,msg:'User <b>$username</b> Already Exists.'}";
		}
	}
	else{
		echo "{ success: false,msg:'Password Does not match'}";
	}
}

if($todo == "Edit_User"){
	$userid         = $_POST['userid'];
	$customerid	    = $_POST['customerid'];
	$salutation		= $_POST['salutation'];
	$contactperson	= $_POST['contactperson'];
	$mobile			= $_POST['mobile'];
	$email			= $_POST['email'];
	$username		= $_POST['username'];
	$password		= $_POST['password'];
	$cpassword		= $_POST['confpassword'];
	$usertype		= $_POST['usertype'];
	//$cpassword		= $_POST['confpassword'];
    if($password == $cpassword)
	{
		$chkQry	= mysql_query("SELECT * FROM users WHERE username='".$username."' AND userid!='".$userid."'");
		$chkCnt	= mysql_num_rows($chkQry);
		if($chkCnt == 0){
			 if($_POST['password']!=''){
			 
				$pwdStr = ", password= PASSWORD('$password') ";
				
			}else{
				$pwdStr = "";
			}  
			$userQry = mysql_query("UPDATE users SET
							customerid 	= '".$customerid."',
							salname     = '".$salutation."',
							realname 	= '".$contactperson."',
							mobile		= '".$mobile."',
							email		= '".$email."',
							username    = '".$username."',
							usertype	= '".$usertype."'
							$pwdStr WHERE userid = '".$userid."'");
			
			if($userQry){
				echo "{ success: true,msg:'User <b>$username</b> Updated Successfully.'}";
			}
		}
		
		
		else
		{
			echo "{ success: false,msg:'Already there is some other Customer with the name <b>$username</b> Exists.'}";
		}
	}else{
		echo "{ success: false,msg:'Password Does not match'}";
	}
}


if($todo == "Delete_User"){
		$userid		= $_POST['userid'];
		$username	= $_POST['username'];
		
		/* echo $username;
		$chkQry	= mysql_query("SELECT * FROM users WHERE username='".$username."' AND userid='".$userid."'");
		$chkCnt	= mysql_num_rows($chkQry);
		if($chkCnt == 1){ */
			$userQry = "DELETE FROM users WHERE userid='".$userid."'";
			$userRes = mysql_query($userQry);
			if($userRes){
				echo "{ success: true,msg:'User <b>$username</b> Deleted Successfully.'}";
			}
			else{
				//$error	= mysql_error();
				echo "{ success: false,msg:'Error while deleting User'}";
			}
		/* }
		else{
			echo "{success: false,msg:'USername doesnot Exists'}";
		} */
	}
?>