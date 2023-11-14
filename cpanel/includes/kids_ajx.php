<?php
session_start();
include_once("../config/dbconn.php");
include_once("./functions.php");

error_reporting(E_ALL);
ini_set('display_errors','On');

$customerid = $_SESSION['customerid'];

$todo = $_POST['todo'];
if($todo == "Get_Kids_List"){
	if(!preg_match('/showKids/',$_SESSION['loadpage'])){
		$_SESSION['loadpage']	= $_SESSION['loadpage'].",showKids";
	}

	$start	= $_POST['start'];
	$limit	= $_POST['limit'];
	
	/*echo "SELECT gk.*,
				gd.devicename, gd.status, gd.simcardno, gd.simserialno, gd.simprovider, gd.gprsplan, gd.gprssettings
		 		FROM kids gk
				LEFT OUTER JOIN devices gd ON gd.deviceid = gk.deviceid
		 		WHERE gk.customerid='".$customerid."' AND gd.devicetype='CTS' ORDER BY gk.kidname";*/
	if($customerid == '3')
		$cust_qry = "";
	else
		$cust_qry = "AND gk.customerid='".$customerid."'";
	$totQry	= mysql_query("SELECT gk.*,
				gd.devicename, gd.status, gd.simcardno, gd.simserialno, gd.simprovider, gd.gprsplan, gd.gprssettings
		 		FROM kids gk
				LEFT OUTER JOIN devices gd ON gd.deviceid = gk.deviceid
		 		WHERE gd.devicetype='CTS' $cust_qry ORDER BY gk.kidname");
	$totCnt	= mysql_num_rows($totQry);

	if($totCnt == 0){
		$myData[] = array(
			'kidid'  	 => 0,
			'kidname'   => "<span class='tableTextM'>No Kids Found</span>"
		);
	}else{
		$kidQry = mysql_query("SELECT gk.*,
					gd.devicename, gd.status, gd.simcardno, gd.simserialno, gd.simprovider, gd.gprsplan, gd.gprssettings
			 		FROM kids gk
					LEFT OUTER JOIN devices gd ON gd.deviceid = gk.deviceid
					WHERE gd.devicetype='CTS' $cust_qry ORDER BY gk.kidname LIMIT $start , $limit");
		while($kidRes = mysql_fetch_array($kidQry)){
			$myData[] = array(
				'kidid'  			=> $kidRes['kidid'],
				'customerid'  		=> $kidRes['customerid'],
				'customername'  	=> getCustomerName($kidRes['customerid']),
				'kidname'   		=> $kidRes['kidname'],
				'deviceid'			=> $kidRes['deviceid'],
				'mobile'			=> $kidRes['mobile'],
				'institutename'   	=> $kidRes['institutename'],
				'instaddress1'		=> $kidRes['instaddress1'],
				'instaddress2'		=> $kidRes['instaddress2'],
				'instaddress3'		=> $kidRes['instaddress3'],
				'instcity'			=> $kidRes['instcity'],
				'instphone1'		=> $kidRes['instphone1'],
				'instphone2'		=> $kidRes['instphone2'],
				'friend1name'		=> $kidRes['friend1name'],
				'friend1phone'		=> $kidRes['friend1phone'],
				'friend2name'		=> $kidRes['friend2name'],
				'friend2phone'		=> $kidRes['friend2phone'],
				'photo'				=> $kidRes['photo'],
				'addedon'			=> $kidRes['addedon'],
				'addedby'   		=> getTeamMemberName($kidRes['addedby']),
				'devicename'		=> $kidRes['devicename'],
				'status'			=> $kidRes['status'],
				'simcardno'			=> $kidRes['simcardno'],
				'simserialno'		=> $kidRes['simserialno'],
				'simprovider'		=> $kidRes['simprovider'],
				'gprsplan'			=> $kidRes['gprsplan'],
				'gprssettings'		=> $kidRes['gprssettings'],				
				'realtime'		=> '<img src="./images/view.png" style="cursor:pointer;" title="Track this Vehicle in Realtime" onClick="Show_Gps_Track_Live('.$kidRes['deviceid'].')"/>',
				'history'		=> '<img src="./images/history.png" style="cursor:pointer;" title="View the past history of this Vehicle\'s movement" onClick="Show_Gps_Track_History('.$kidRes['deviceid'].')"/>',
				'action'			=> ""
			);
		}
	}

    $myData = array('KIDS' => $myData, 'totalCount' => $totCnt);
	header('Content-Type: application/x-json');
    echo json_encode($myData);
}

//if($todo == "Get_Customer_Details"){
//	if(!preg_match('/showCustomers/',$_SESSION['loadpage'])){
//		$_SESSION['loadpage']	= $_SESSION['loadpage'].",showCustomers";
//	}
//
//	$start	= $_POST['start'];
//	$limit	= $_POST['limit'];
//
//	$totQry	= mysql_query('SELECT * FROM customers WHERE customerid="'.$_POST['customerid'].'"');
//	$totCnt	= mysql_num_rows($totQry);
//
//	if($totCnt == 0){
//		$myData[] = array(
//			'customerid'  	 => 0,
//			'customername'   => "<span class='tableTextM'>No Customers Found</span>"
//		);
//	}elsE{
//		$kidQry = mysql_query("SELECT * FROM customers ORDER BY customername LIMIT $start , $limit");
//		while($kidRes = mysql_fetch_array($kidQry)){
//			$myData[] = array(
//				'customerid'  	 	=> $kidRes['customerid'],
//				'customername'   	=> $kidRes['customername'],
//				'contactperson'   	=> $kidRes['contactperson'],
//				'mobile'			=> $kidRes['mobile'],
//				'email'				=> $kidRes['email'],
//				'city'				=> $kidRes['city'],
//				'addedby'   		=> getTeamMemberName($kidRes['addedby'])
//			);
//		}
//	}
//
//    $myData = array('CUSTOMERS' => $myData, 'totalCount' => $totCnt);
//	header('Content-Type: application/x-json');
//    echo json_encode($myData);
//}

if($todo == "Edit_Kid"){
	$kidid  		= $_POST['kidid'];
	$customerid  		= $_POST['customerid'];
	//$customername  		= getCustomerName($_POST['customerid']);
	$kidname   		= $_POST['kidname'];
	$mobile			= $_POST['mobile'];
	$institutename   	= $_POST['institutename'];
	$instaddress1		= $_POST['instaddress1'];
	$instaddress2		= $_POST['instaddress2'];
	$instaddress3		= $_POST['instaddress3'];
	$instcity			= $_POST['instcity'];
	$instphone1		= $_POST['instphone1'];
	$instphone2		= $_POST['instphone2'];
	$friend1name		= $_POST['friend1name'];
	$friend1phone		= $_POST['friend1phone'];
	$friend2name		= $_POST['friend2name'];
	$friend2phone		= $_POST['friend2phone'];	
	
	
	$chkQry	= mysql_query("SELECT * FROM kids WHERE customerid='".$customerid."' AND kidname='".$kidname."' AND kidid!='".$kidid."'");
	$chkCnt	= mysql_num_rows($chkQry);
	if($chkCnt == 0){
		$kidQry = "UPDATE kids SET
						kidname 		= '".$kidname."',
						mobile				= '".$mobile."',
						institutename		= '".$institutename."',
						instaddress1		= '".$instaddress1."',
						instaddress2		= '".$instaddress2."',
						instaddress3		= '".$instaddress3."',
						instcity			= '".$instcity."',
						instphone1			= '".$instphone1."',
						instphone2			= '".$instphone2."',
						friend1name			= '".$friend1name."',
						friend2name			= '".$friend2name."',
						friend1phone		= '".$friend1phone."',
						friend2phone		= '".$friend2phone."'
						WHERE kidid= '".$kidid."'";
		$kidRes = mysql_query($kidQry);
		if($kidRes){
			$fileUploadErr = "";
			if( isset($_FILES['photo']) && $_FILES['photo']!='' ){
				$photourl = './images/emptyimg.png';
				$photoSize = $_FILES["photo"]["size"] / 1024;
				if($photoSize<=500){
					$photo	= $_FILES['photo']['name'];
					$photourl = "../../photos/kids/" . $customerid."_".$kidid."_".$_FILES["photo"]["name"];
					$photo="NO";
					if(move_uploaded_file($_FILES["photo"]["tmp_name"],$photourl)){
						$photo="YES";
					}
					mysql_query("UPDATE kids SET photo='".$photourl."' WHERE kidid= '".$kidid."'");
				}else{
					$fileUploadErr .= "Kids Photo File size should be less then to 500Kb.<br>";
				}
			}
			
			echo "{ success: true,msg:'Details of the Kid <b>$kidname</b> Updated Successfully.', fileUploadErr:'$fileUploadErr'}";
		}else{
			//$error	= mysql_error();
			echo "{ success: false,msg:'Error while updating Kid details'}";
		}
	}else{
		echo "{ success: false,msg:'Already there is some other Kid with the name <b>$kidname</b> Exists.'}";
	}
}

?>