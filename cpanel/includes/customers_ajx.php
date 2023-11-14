<?php
session_start();
include_once("../config/dbconn.php");
include_once("./functions.php");

$todo = $_POST['todo'];
if($todo == "Get_Customers_List"){
	if(!preg_match('/showCustomers/',$_SESSION['loadpage'])){
		$_SESSION['loadpage']	= $_SESSION['loadpage'].",showCustomers";
	}

	$start	= $_POST['start'];
	$limit	= $_POST['limit'];

	$totQry	= mysql_query("SELECT * FROM customers ORDER BY customername");
	$totCnt	= mysql_num_rows($totQry);

	if($totCnt == 0){
		$myData[] = array(
			'customerid'  	 => 0,
			'customername'   => "<span class='tableTextM'>No Customers Found</span>"
		);
	}else{
		$customerQry = mysql_query("SELECT *,DATE_FORMAT(addedon,'%d-%m-%Y') customerSince FROM customers ORDER BY customername LIMIT $start , $limit");
		while($customerRes = mysql_fetch_array($customerQry)){
			$myData[] = array(
				'customerid'  	 	=> $customerRes['customerid'],
				'customername'   	=> $customerRes['customername'],
				'contactperson'   	=> $customerRes['contactperson'],
				'mobile'			=> $customerRes['mobile'],
				'email'				=> $customerRes['email'],
				'phone'				=> $customerRes['phone'],
				'city'				=> $customerRes['city'],
				'address1'			=> $customerRes['address1'],
				'address2'			=> $customerRes['address2'],
				'address3'			=> $customerRes['address3'],
				'pincode'			=> $customerRes['pincode'],
				'timezone'			=> $customerRes['timezone'],
				'addedon'			=> $customerRes['customerSince'],
				'addedby'   		=> getTeamMemberName($customerRes['addedby'])/*,
				'action'			=> "<img src='./images/device.png' onclick='getDevices(\'".$customerRes['customerid']."\')'/>"*/
			);
		}
	}

    $myData = array('CUSTOMERS' => $myData, 'totalCount' => $totCnt);
	header('Content-Type: application/x-json');
    echo json_encode($myData);
}

if($todo == "Get_Customer_Details"){
	if(!preg_match('/showCustomers/',$_SESSION['loadpage'])){
		$_SESSION['loadpage']	= $_SESSION['loadpage'].",showCustomers";
	}

	$start	= $_POST['start'];
	$limit	= $_POST['limit'];

	$totQry	= mysql_query('SELECT * FROM customers WHERE customerid="'.$_POST['customerid'].'"');
	$totCnt	= mysql_num_rows($totQry);

	if($totCnt == 0){
		$myData[] = array(
			'customerid'  	 => 0,
			'customername'   => "<span class='tableTextM'>No Customers Found</span>"
		);
	}elsE{
		$customerQry = mysql_query("SELECT * FROM customers ORDER BY customername LIMIT $start , $limit");
		while($customerRes = mysql_fetch_array($customerQry)){
			$myData[] = array(
				'customerid'  	 	=> $customerRes['customerid'],
				'customername'   	=> $customerRes['customername'],
				'contactperson'   	=> $customerRes['contactperson'],
				'mobile'			=> $customerRes['mobile'],
				'email'				=> $customerRes['email'],
				'city'				=> $customerRes['city'],
				'addedby'   		=> getTeamMemberName($customerRes['addedby'])
			);
		}
	}

    $myData = array('CUSTOMERS' => $myData, 'totalCount' => $totCnt);
	header('Content-Type: application/x-json');
    echo json_encode($myData);
}

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

	$chkQry	= mysql_query("SELECT * FROM customers WHERE customername='".$customername."'");
	$chkCnt	= mysql_num_rows($chkQry);
	if($chkCnt == 0){
		$customerQry = "INSERT INTO customers(customername, contactperson, phone, mobile, email,timezone,
						address1,address2,address3,city,pincode,addedby,addedon)
						VALUES('".$customername."', '".$salutation.$contactperson."', '".$phone."', '".$mobile."', '".$email."',
						'".$timezone."', '".$address1."', '".$address2."', '".$address3."', '".$city."', '".$pincode."', '".$_SESSION['userid']."', '". date("Y-m-d H:i:s")."')";
		$customerRes = mysql_query($customerQry);
		if($customerRes){
			/***
			 *
			 * Create new table specific to this customer for managing his devices
			 *
			 ****/
			echo "{ success: true,msg:'Company <b>$customername</b> Added Successfully.'}";
		}
		else
			echo "{ success: false,msg:'Error while adding new Company.'}";
	}else{
		echo "{ success: false,msg:'Company <b>$customername</b> Already Exists.'}";
	}
}

if($todo == "Edit_Customer"){
	$customerid		= $_POST['customerid'];
	$customername	= $_POST['customername'];
	$salutation		= $_POST['salutation']." ";
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

	$chkQry	= mysql_query("SELECT * FROM customers WHERE customername='".$customername."' AND customerid!='".$customerid."'");
	$chkCnt	= mysql_num_rows($chkQry);
	if($chkCnt == 0){
		$customerQry = "UPDATE customers SET
						customername 	= '".$customername."',
						contactperson 	= '".$salutation.$contactperson."',
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
			echo "{ success: true,msg:'Company <b>$customername</b> Updated Successfully.'}";
		}else{
			//$error	= mysql_error();
			echo "{ success: false,msg:'Error while updating Company'}";
		}
	}else{
		echo "{ success: false,msg:'Already there is some other Company with the name <b>$customername</b> Exists.'}";
	}
}

if($todo == "Delete_Customer"){
	$customerid		= $_POST['customerid'];
	$customername	= $_POST['customername'];
	$chkQry	= mysql_query("SELECT * FROM customers WHERE customername='".$customername."' AND customerid='".$customerid."'");
	$chkCnt	= mysql_num_rows($chkQry);
	if($chkCnt == 1){
		$customerQry = "DELETE FROM customers WHERE customername='".$customername."' AND customerid='".$customerid."'";
		$customerRes = mysql_query($customerQry);
		if(!mysql_error()){
			/****
			 *
			 * Delete Devices, History and other tables such as drivers, kids details etc
			 *
			 ***/
		}
		if($customerRes){
			echo "{ success: true,msg:'Company <b>$customername</b> Deleted Successfully.'}";
		}else{
			//$error	= mysql_error();
			echo "{ success: false,msg:'Error while deleting Company'}";
		}
	}else{
		echo "{ success: false,msg:'The Company <b>$customername</b> does not Exist.'}";
	}
}
?>