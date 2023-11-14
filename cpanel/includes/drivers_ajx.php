<?php
session_start();
include_once("../config/dbconn.php");
include_once("./functions.php");

error_reporting(E_ALL);
ini_set('display_errors','On');

$customerid = $_SESSION['customerid'];

$todo = $_POST['todo'];
if($todo == "Get_drivers_List"){
	/*if(!preg_match('/showdrivers/',$_SESSION['loadpage'])){
		$_SESSION['loadpage']	= $_SESSION['loadpage'].",showdrivers";
	}*/

	$start	= $_POST['start'];
	$limit	= $_POST['limit'];

	$totQry	= mysql_query("SELECT * FROM drivers WHERE customerid='".$customerid."' ORDER BY drivername");
	$totCnt	= mysql_num_rows($totQry);

	if($totCnt == 0){
		$myData[] = array(
			'driverid'  	 => 0,
			'drivername'   => "<span class='tableTextM'>No drivers Found</span>"
		);
	}else{
		$driverQry = mysql_query("SELECT * FROM drivers WHERE customerid='".$customerid."' ORDER BY drivername LIMIT $start , $limit");
		while($driverRes = mysql_fetch_array($driverQry)){
			$myData[] = array(
				'customerid'  		=> $driverRes['customerid'],
				'customername'  	=> getCustomerName($driverRes['customerid']),
				'driverid'  		=> $driverRes['driverid'],
				'drivername'  	 	=> $driverRes['drivername'],
				'address1'			=> $driverRes['address1'],
				'address2'   		=> $driverRes['address2'],
				'address3'			=> $driverRes['address3'],
				'city'				=> $driverRes['city'],
				'mobile'			=> $driverRes['mobile'],
				'phoneno'			=> $driverRes['phoneno'],
				'licenseno'			=> $driverRes['licenseno'],
				'licenseexpirydate'	=> $driverRes['licenseexpirydate']=="0000-00-00"?"":date("d-m-Y",strtotime($driverRes['licenseexpirydate'])),
				'photo'				=> $driverRes['photo'],
				'licensecopy'		=> $driverRes['licensecopy']
				/*'action'			=> "<img src='./images/device.png' onclick='getDevices(\'".$driverRes['customerid']."\')'/>"*/
			);
		}
	}

    $myData = array('drivers' => $myData, 'totalCount' => $totCnt);
	header('Content-Type: application/x-json');
    echo json_encode($myData);
}

if($todo == "Add_driver"){
	//$customerid  		= $_POST['customerid'];
	$drivername  		= $_POST['drivername'];
	$address1   		= $_POST['address1'];
	$address2			= $_POST['address2'];
	$address3   		= $_POST['address3'];
	$city				= $_POST['city'];
	$mobile				= $_POST['mobile'];
	$phoneno			= $_POST['phoneno'];
	$licenseno			= $_POST['licenseno'];
	$licenseexpirydate	= date("Y-m-d" , strtotime($_POST['licenseexpirydate']));
	
	$chkQry	= mysql_query("SELECT * FROM drivers WHERE drivername='".$drivername."'");
	$chkCnt	= mysql_num_rows($chkQry);
	if($chkCnt == 0){
		$driverQry = "INSERT INTO drivers(customerid, drivername, address1, address2, address3,city,mobile,phoneno,
						licenseno,licenseexpirydate)
						VALUES('".$customerid."', '".$drivername."', '".$address1."', '".$address2."', '".$address3."',
						'".$mobile."', '".$phoneno."', '".$city."', '".$licenseno."', '".$licenseexpirydate."')";
		$driverRes = mysql_query($driverQry);
		if($driverRes){
			$driverid = mysql_insert_id();
			/***
			 *
			 * Create new table specific to this customer for managing his devices
			 *
			 ****/
			$photourl = "";
			$fileUploadErr	= "";
			if( isset($_FILES['photo']) && $_FILES['photo']!='' ){
				$photoSize = $_FILES["photo"]["size"] / 1024;
				if($photoSize<=500){
					$photo	= $_FILES['photo']['name'];
					$photourl = "../../photos/drivers/" . $customerid."_".$driverid."_".$_FILES["photo"]["name"];
					$photoflag="NO";
					if(move_uploaded_file($_FILES["photo"]["tmp_name"],$photourl)){
						$photoflag="YES";
					}else{
						$photourl = './images/emptyimg.png';
					}
					if($photoflag=="YES"){
						$updatePhotoQry = "UPDATE drivers set photo ='".$photourl."'
						WHERE driverid = $driverid" ;				
						$updatePhotoRes = mysql_query($updatePhotoQry);
					}
				}else{
					$fileUploadErr .= "Driver Photo File size should be less then to 500Kb.<br>";
				}
			}
			
			$licensecopyurl = "";
			if( isset($_FILES['licensecopy']) && $_FILES['licensecopy']!='' ){
				$licensecopySize = $_FILES["licensecopy"]["size"] / 1024;
				if($licensecopySize<=500){
					$licensecopy	= $_FILES['licensecopy']['name'];
					$licensecopyurl = "../../photos/drivers/" . $customerid."_".$driverid."_".$_FILES["licensecopy"]["name"];
					$licflag="NO";
					if(move_uploaded_file($_FILES["licensecopy"]["tmp_name"],$licensecopyurl)){
						$licflag="YES";
					}else{
						$licensecopyurl = './images/emptyimg.png';
					}
					if($licflag=="YES"){
						$updatePhotoQry = "UPDATE drivers set licensecopy ='".$licensecopyurl."'
						WHERE driverid = $driverid" ;				
						$updatePhotoRes = mysql_query($updatePhotoQry);
					}	
				}else{
					$fileUploadErr .= "License Copy File size should be less then to 500Kb.<br>";
				}
			}
			/*if($fileUploadErr!=""){
				$fileUploadErr	= substr($fileUploadErr, 0, count($fileUploadErr)-4);
			}*/
			/*if($updatePhotoRes){
				echo "{ success: true,msg:'Kid <b>$kidname</b> of <b>$customername</b> Added Successfully.'}";
			}else{
				echo "{ success: true,msg:'Kid <b>$kidname</b> of <b>$customername</b> Added Successfully.<br/> But the photo is not updated'}";
			}*/
			echo "{ success: true,msg:'Driver <b>$drivername</b> Added Successfully.', fileUploadErr:'$fileUploadErr'}";
		}
		else
			echo "{ success: false,msg:'Error while adding new Driver.'}";
	}else{
		echo "{ success: false,msg:'Driver <b>$drivername</b> Already Exists.'}";
	}
}

if($todo == "Edit_driver"){
	$driverid  			= $_POST['driverid'];
	//$customerid  		= $_POST['customerid'];
	$drivername  		= $_POST['drivername'];
	//$customername 		= getCustomerName($_POST['customerid']);
	$address1   		= $_POST['address1'];
	$address2			= $_POST['address2'];
	$address3   		= $_POST['address3'];
	$city				= $_POST['city'];
	$mobile				= $_POST['mobile'];
	$phoneno			= $_POST['phoneno'];
	$licenseno			= $_POST['licenseno'];
	$licenseexpirydate	= date("Y-m-d" , strtotime($_POST['licenseexpirydate']));

	$chkQry	= mysql_query("SELECT * FROM drivers WHERE customerid='".$customerid."' AND drivername='".$drivername."' AND driverid!='".$driverid."'");
	$chkCnt	= mysql_num_rows($chkQry);
	if($chkCnt == 0){
		$driverQry = "UPDATE drivers SET
						drivername 		= '".$drivername."',
						address1		= '".$address1."',
						address2		= '".$address2."',
						address3		= '".$address3."',
						city			= '".$city."',
						mobile			= '".$mobile."',
						phoneno			= '".$phoneno."',
						licenseno		= '".$licenseno."',
						licenseexpirydate	= '".$licenseexpirydate."'
						WHERE driverid= '".$driverid."'";
		$driverRes = mysql_query($driverQry);
		if($driverRes){
			$photourl = "";
			$fileUploadErr	= "";
			if( isset($_FILES['photo']) && $_FILES['photo']!='' ){
				$photoSize = $_FILES["photo"]["size"] / 1024;
				if($photoSize<=500){
					$photo	= $_FILES['photo']['name'];
					$photourl = "../../photos/drivers/" . $customerid."_".$driverid."_".$_FILES["photo"]["name"];
					$photoflag="NO";
					if(move_uploaded_file($_FILES["photo"]["tmp_name"],$photourl)){
						$photoflag="YES";
					}else{
						$photourl = './images/emptyimg.png';
					}
					if($photoflag=="YES"){
						$updatePhotoQry = "UPDATE drivers set photo ='".$photourl."'
						WHERE driverid = $driverid" ;				
						$updatePhotoRes = mysql_query($updatePhotoQry);
					}
				}else{
					$fileUploadErr .= "Driver Photo File size should be less then to 500Kb.<br>";
				}
			}
			
			$licensecopyurl = "";
			if( isset($_FILES['licensecopy']) && $_FILES['licensecopy']!='' ){
				$licensecopySize = $_FILES["licensecopy"]["size"] / 1024;
				if($licensecopySize<=500){
					$licensecopy	= $_FILES['licensecopy']['name'];
					$licensecopyurl = "../../photos/drivers/" . $customerid."_".$driverid."_".$_FILES["licensecopy"]["name"];
					$licflag="NO";
					if(move_uploaded_file($_FILES["licensecopy"]["tmp_name"],$licensecopyurl)){
						$licflag="YES";
					}else{
						$licensecopyurl = './images/emptyimg.png';
					}
					if($licflag=="YES"){
						$updatePhotoQry = "UPDATE drivers set licensecopy ='".$licensecopyurl."'
						WHERE driverid = $driverid" ;				
						$updatePhotoRes = mysql_query($updatePhotoQry);
					}	
				}else{
					$fileUploadErr .= "License Copy File size should be less then to 500Kb.<br>";
				}
			}
			if($fileUploadErr!=""){
				$fileUploadErr	= substr($fileUploadErr, 0, count($fileUploadErr)-5);
			}
			echo "{ success: true,msg:'Details of the driver <b>$drivername</b> Updated Successfully.', fileUploadErr:'$fileUploadErr'}";
		}else{
			//$error	= mysql_error();
			echo "{ success: false,msg:'Error while updating driver details'}";
		}
	}else{
		echo "{ success: false,msg:'Already there is some other driver with the name <b>$drivername</b> Exists.'}";
	}
}


if($todo == "Delete_driver"){
	$driverid		= $_POST['driverid'];
	$drivername		= $_POST['drivername'];
	$chkQry	= mysql_query("SELECT * FROM drivers WHERE drivername='".$drivername."' AND driverid='".$driverid."'");
	$chkCnt	= mysql_num_rows($chkQry);
	if($chkCnt == 1){
		$customerQry = "DELETE FROM drivers WHERE drivername='".$drivername."' AND driverid='".$driverid."'";
		$customerRes = mysql_query($customerQry);
		if(!mysql_error()){
			/****
			 *
			 * Delete Devices, History and other tables such as drivers, kids details etc
			 *
			 ***/
		}
		if($customerRes){
			echo "{ success: true,msg:'The Driver <b>$drivername</b> Deleted Successfully.'}";
		}else{
			//$error	= mysql_error();
			echo "{ success: false,msg:'Error while deleting Driver'}";
		}
	}else{
		echo "{ success: false,msg:'The Driver <b>$drivername</b> does not Exist.'}";
	}
}
?>