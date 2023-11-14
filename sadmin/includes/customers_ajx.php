<?php
session_start();
include_once("../config/dbconn.php");
include_once("./functions.php");
$todo = $_POST['todo'];

//Get Customer Details
if($todo == "Get_Customers_List"){
	if(!preg_match('/showCustomers/',$_SESSION['loadpage'])){
		$_SESSION['loadpage']	= $_SESSION['loadpage'].",showCustomers";
	}
	$filterQry = '';
	$start	= $_POST['start'];
	$limit	= $_POST['limit'];
	$filtertext	= $_POST['filtertext'];
	if($filtertext!=''){
		$filterQry = "AND customername LIKE '%$filtertext%' OR contactperson LIKE '%$filtertext%' OR mobile LIKE '%$filtertext%' OR city LIKE '%$filtertext%' OR email LIKE '%$filtertext%'";
	}
	$totQry	= mysql_query("SELECT *,DATE_FORMAT(addedon,'%d-%m-%Y')customerSince  FROM customers WHERE customerid!='' $filterQry");
	$totCnt	= mysql_num_rows($totQry);

	if($totCnt == 0){
		$myData[] = array(
			'customerid'  	 => 0,
			'customername'   => "<span class='tableTextM'>No Customers Found</span>"
		);
	}else{
		$customerQry = mysql_query("SELECT *,DATE_FORMAT(addedon,'%d-%m-%Y')customerSince  FROM customers WHERE customerid!='' $filterQry ORDER BY customername LIMIT $start , $limit");
		while($customerRes = mysql_fetch_array($customerQry)){
			// customer status display
			$status = $customerRes['customerstatus'];
			if($status=="Enable")
				$status="<img src='./images/enable.png' style='cursor:pointer' title='Click here to Disable' onclick='status_customer(".$customerRes['customerid'].",\"Disable\")'/>";
			else
				$status="<img src='./images/disable.png' style='cursor:pointer' title='Click here to Enable' onclick='status_customer(".$customerRes['customerid'].",\"Enable\")'/>";
		
			$myData[] = array(
				'customerid'  	 	=> $customerRes['customerid'],
				'customername'   	=> $customerRes['customername'],
				'salname'   		=> $customerRes['salname'],
				'contactperson'   	=> $customerRes['contactperson'],
				'contactname'		=> $customerRes['salname'].$customerRes['contactperson'],
				'mobile'			=> $customerRes['mobile'],
				'email'				=> $customerRes['email'],
				'phone'				=> $customerRes['phone'],
				'city'				=> $customerRes['city'],
				'address1'			=> $customerRes['address1'],
				'address2'			=> $customerRes['address2'],
				'address3'			=> $customerRes['address3'],
				'pincode'			=> $customerRes['pincode'],
				'timezone'			=> $customerRes['timezone'],
				'username'			=> getCustomerUsername($customerRes['customerid']),
				'addedon'			=> $customerRes['customerSince'],
				'addedby'   		=> getTeamMemberName($customerRes['addedby']),
				'customerstatus'    => $status
			);
			
		}
	}

    $myData = array('CUSTOMERS' => $myData, 'totalCount' => $totCnt);
	header('Content-Type: application/x-json');
    echo json_encode($myData);
}

// Customer Added query

if($todo == "Add_Customer"){
	$customername	= $_POST['customername'];
	$salutation		= $_POST['salutation'];
	$contactperson	= $_POST['contactperson'];
	$phone			= $_POST['phone'];
	$mobile			= $_POST['mobile'];
	$email			= $_POST['email'];
	$timezone		= $_POST['timezone'];
	$address1		= $_POST['address1'];
	$address2		= $_POST['address2'];
	$address3		= $_POST['address3'];
	$city			= $_POST['city'];
	$pincode		= $_POST['pincode'];
	$username		= $_POST['username'];
	$password		= $_POST['password'];
	$cpassword		= $_POST['confpassword'];
    if($password == $cpassword )
	{
		$chkQry	= mysql_query("SELECT * FROM customers WHERE customername='".$customername."'");
		$chkCnt	= mysql_num_rows($chkQry);
		if($chkCnt == 0){
			$userQry	= mysql_query("SELECT * FROM users WHERE username='".$username."'");
			$userCnt	= mysql_num_rows($userQry);
			if($userCnt == 0){
				$customerQry = "INSERT INTO customers(customername, salname, contactperson, phone, mobile, email,timezone,
								address1,address2,address3,city,pincode,addedby,addedon)
								VALUES('".$customername."', '".$salutation."', '".$contactperson."', '".$phone."', '".$mobile."', '".$email."',
								'".$timezone."', '".$address1."', '".$address2."', '".$address3."', '".$city."', '".$pincode."', '".$_SESSION['userid']."', '". date("Y-m-d H:i:s")."')";
				$customerRes = mysql_query($customerQry);
				if($customerRes){
					$customerid = mysql_insert_id() ;
					$usersQry = "INSERT INTO users(customerid, salname, realname, mobile, email,
									failedcount,usertype,username,password,addedby,addedon)
									VALUES('".$customerid."', '".$salutation."', '".$contactperson."', '".$mobile."', '".$email."',
									'0', 'A', '".$username."', PASSWORD('".$password."'), '".$_SESSION['userid']."', '". date("Y-m-d H:i:s")."')";
					$usersRes = mysql_query($usersQry);
					$serviceQry = mysql_query("INSERT INTO customer_services (customerid) VALUES('".$customerid."')");
					if($usersRes){
						echo "{ success: true,msg:'Customer <b>$customername</b> Added Successfully.'}";
					}else{
						echo "{ success: true,msg:'Customer <b>$customername</b> Added Successfully.<br/>But the Login details are not created in Users Table'}";
					}
				}
				else
					echo "{ success: false,msg:'Error while adding new Customer.$customerQry'}";
			}
			else{
				echo "{ success: false,msg:'Customer <b>$username</b> Already Exists.'}";
			}
		}else{
			echo "{ success: false,msg:'Customer <b>$customername</b> Already Exists.'}";
		}
	}
	else{
		echo "{ success: false,msg:'Password Does not match'}";
	}
}

//Customer Updated Query

if($todo == "Edit_Customer"){
	$customerid		= $_POST['customerid'];
	$customername	= $_POST['customername'];
	$salutation		= $_POST['salutation'];
	$contactperson	= $_POST['contactperson'];
	$phone			= $_POST['phone'];
	$mobile			= $_POST['mobile'];
	$email			= $_POST['email'];
	$timezone		= $_POST['timezone'];
	$address1		= $_POST['address1'];
	$address2		= $_POST['address2'];
	$address3		= $_POST['address3'];
	$city			= $_POST['city'];
	$pincode		= $_POST['pincode'];
	$username		= $_POST['username'];
	$password		= $_POST['password'];	
	$cpassword		= $_POST['confpassword'];
    if($password == $cpassword )
	{
		$chkQry	= mysql_query("SELECT * FROM customers WHERE customername='".$customername."' AND customerid!='".$customerid."'");
		$chkCnt	= mysql_num_rows($chkQry);
		if($chkCnt == 0){
			$userQry	= mysql_query("SELECT * FROM users WHERE username='".$username."' AND customerid!='".$customerid."'");
			$userCnt	= mysql_num_rows($userQry);
			if($userCnt == 0){
				if($_POST['password']!=''){
					$pwdStr = ", password= PASSWORD('$password') ";
				}else{
					$pwdStr = "";
				}
				$customerQry = "UPDATE customers SET
								customername 	= '".$customername."',
								salname			= '".$salutation."',
								contactperson 	= '".$contactperson."',
								phone 			= '".$phone."',
								mobile			= '".$mobile."',
								email			= '".$email."',
								timezone		= '".$timezone."',
								address1		= '".$address1."',
								address2		= '".$address2."',
								address3		= '".$address3."',
								city			= '".$city."',
								pincode			= '".$pincode."'						
								WHERE customerid= '".$customerid."'";
				$customerRes = mysql_query($customerQry);
				if($customerRes){
					//echo "UPDATE users SET username='".$username."' $pwdStr WHERE customerid= '".$customerid."'";
					$usrQry = mysql_query("UPDATE users SET username='".$username."',
														salname			= '".$salutation."',
														realname 		= '".$contactperson."',
														mobile			= '".$mobile."',
														email			= '".$email."'
														$pwdStr WHERE customerid= '".$customerid."'");
					echo "{ success: true,msg:'Customer <b>$customername</b> Updated Successfully.'}";
				}else{
					$error	= mysql_error();
					echo "{ success: false,msg:'Error while updating Customer '.$error}";
				}
			}
			else{
				echo "{ success: false,msg:'Already <b>$username</b> Exists.'}";
			}
		}else{
			echo "{ success: false,msg:'Already there is some other Customer with the name <b>$customername</b> Exists.'}";
		}
	}else{
		echo "{ success: false,msg:'Password Does not match'}";
	}
}

if($todo == "Delete_Customer"){
	$customerid		= $_POST['customerid'];
	$customername	= $_POST['customername'];
	
	$DevQry = mysql_query("SELECT customerid FROM devices where customerid='".$customerid."'");
	$DevCnt = mysql_num_rows($DevQry);
	
	if($DevCnt==0)
	{
		$kidQry = mysql_query("SELECT customerid FROM kids where customerid='".$customerid."'");
		$kidCnt = mysql_num_rows($kidQry);
	    if($kidCnt==0)
		{
			$DriQry = mysql_query("SELECT customerid FROM vehicles where customerid='".$customerid."'");
			$DriCnt = mysql_num_rows($DriQry);
			if($DriCnt==0)
			{
				$chkQry	= mysql_query("SELECT * FROM customers WHERE customername='".$customername."' AND customerid='".$customerid."'");
				$chkCnt	= mysql_num_rows($chkQry);
				if($chkCnt == 1){
					$customerQry = "DELETE FROM customers WHERE customername='".$customername."' AND customerid='".$customerid."'";
					$customerRes = mysql_query($customerQry);
					$userQry = "DELETE FROM users WHERE customerid='".$customerid."'";
					$userRes = mysql_query($userQry);
					$userQry = "DELETE FROM drivers WHERE customerid='".$customerid."'";
					$userRes = mysql_query($userQry);
					if($customerRes || $userRes){
						echo "{ success: true,msg:'Customer <b>$customername</b> Deleted Successfully.'}";
					}
					else{
						//$error	= mysql_error();
						echo "{ success: false,msg:'Error while deleting Customer'}";
					}
				} 
				else{
					echo "{ success: false,msg:'The Customer <b>$customername</b> does not Exists.'}";
				}
			}
			else{
				echo "{ success: false,msg:'The Customer name used in Vehicles Menu. So it can not be Deleted'}";
			}
		}
		else{
			echo "{ success: false,msg:'The Customer name used in Kids Menu. So it can not be Deleted'}";
		}
	}
	else 
	echo "{ success: false,msg:'The Customer name used in Devices Menu. So it can not be Deleted'}";
	
}

if($todo=="Status_Customer")
{
	$customerid		= $_POST['customerid'];
	$customerstatus	= $_POST['customerstatus'];
	$statusQry = mysql_query("UPDATE customers SET customerstatus='".$customerstatus."' WHERE customerid='".$customerid."'");	
	if($statusQry!='')
	echo "{success:true,msg:'Status Changed Successfully'}";
	else
	echo "{success:true,msg:'Status Change Failed'}";
	
}


?>