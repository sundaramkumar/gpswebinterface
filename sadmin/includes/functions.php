<?php
session_start();
include_once("../config/dbconn.php");

function getTeamMemberName($memberid){
	$memberQry = mysql_query('SELECT membername FROM inhouseteam WHERE memberid = "'.$memberid.'"');
	$memberRes = mysql_fetch_array($memberQry);
	return $memberRes['membername'];
}

function getCustomerName($customerid){
	$memberQry = mysql_query('SELECT customername FROM customers WHERE customerid = "'.$customerid.'"');
	$memberRes = mysql_fetch_array($memberQry);
	return $memberRes['customername'];
}

function getDeviceName($deviceid){
	$memberQry = mysql_query('SELECT devicename FROM devices WHERE deviceid = "'.$deviceid.'"');
	$memberRes = mysql_fetch_array($memberQry);
	return $memberRes['devicename'];
}

function getCustomerUsername($customerid){
	$memberQry = mysql_query('SELECT username,password FROM users WHERE customerid = "'.$customerid.'"');
	$memberRes = mysql_fetch_array($memberQry);
	return $memberRes['username'];
}

function getDevices($customerid){

//	$start	= $_POST['start'];
//	$limit	= $_POST['limit'];
//
//	$totQry	= mysql_query('SELECT * FROM devices_'.$customerid.' WHERE customerid = "'.$customerid.'"');
//	$totCnt	= mysql_num_rows($totQry);
//
//	if($totCnt == 0){
//		$myData[] = array(
//			'customerid'  	 => 0,
//			'customername'   => "<span class='tableTextM'>No Customers Found</span>"
//		);
//	}else{
//		$memberQry = mysql_query('SELECT deviceid FROM devices_'.$customerid.' WHERE customerid = "'.$customerid.'"');
//		while($memberRes = mysql_fetch_array($memberQry)){
//
//
//				$myData[] = array(
//					'customerid'  	 	=> $customerRes['customerid'],
//					'customername'   	=> $customerRes['customername'],
//					'contactperson'   	=> $customerRes['contactperson'],
//					'mobile'			=> $customerRes['mobile'],
//					'email'				=> $customerRes['email'],
//					'phone'				=> $customerRes['phone'],
//					'city'				=> $customerRes['city'],
//					'address1'			=> $customerRes['address1'],
//					'address2'			=> $customerRes['address2'],
//					'address3'			=> $customerRes['address3'],
//					'pincode'			=> $customerRes['pincode'],
//					'timezone'			=> $customerRes['timezone'],
//					'addedon'			=> $customerRes['customerSince'],
//					'addedby'   		=> getTeamMemberName($customerRes['addedby'])/*,
//					'action'			=> "<img src='./images/device.png' onclick='getDevices(\'".$customerRes['customerid']."\')'/>"*/
//				);
//		}
//	}
//
//    $myData = array('CUSTDEVICES' => $myData, 'totalCount' => $totCnt);
//	header('Content-Type: application/x-json');
//    echo json_encode($myData);

}
?>