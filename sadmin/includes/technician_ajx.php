<?php
session_start();
include_once("../config/dbconn.php");
include_once("./functions.php");

$todo = $_POST['todo'];
if($todo == "Get_Technicians_List"){
	if(!preg_match('/showTechnicians/',$_SESSION['loadpage'])){
		$_SESSION['loadpage']	= $_SESSION['loadpage'].",showTechnicians";
	}

	$start	= $_POST['start'];
	$limit	= $_POST['limit'];
	$filterQry = '';
	$filtertext	= $_POST['filtertext'];
	if($filtertext!=''){
		$filterQry = "AND technicianname LIKE '%$filtertext%' OR mobile LIKE '%$filtertext%' OR city LIKE '%$filtertext%' OR email LIKE '%$filtertext%'";
	}

	$totQry	= mysql_query("SELECT * FROM technician WHERE technicianid!='' $filterQry");
	$totCnt	= mysql_num_rows($totQry);

	if($totCnt == 0){
		$myData[] = array(
			'technicianid'  	 => 0,
			'technicianname'   => "<span class='tableTextM'>No Technicians Found</span>"
		);
	}elsE{
		$$technicianQry = mysql_query("SELECT * FROM technician WHERE technicianid!='' $filterQry ORDER BY technicianname LIMIT $start , $limit");
		while($technicianRes = mysql_fetch_array($$technicianQry)){
			$myData[] = array(
				'technicianid'  	=> $technicianRes['technicianid'],
				'technicianname'    => $technicianRes['technicianname'],	
				'address1'			=> $technicianRes['address1'],
				'address2'			=> $technicianRes['address2'],
				'address3'			=> $technicianRes['address3'],
				'city'				=> $technicianRes['city'],
				'mobile'			=> $technicianRes['mobile'],
				'landline'			=> $technicianRes['landline'],
				'email'				=> $technicianRes['email'],
				'status'			=> $technicianRes['status']
				//'addedby'   		=> getTeamMemberName($technicianRes['addedby'])
			);
		}
	}

    $myData = array('TECHNICIANS' => $myData, 'totalCount' => $totCnt);
	header('Content-Type: application/x-json');
    echo json_encode($myData);
}

if($todo == "Get_Technician_Details"){
	if(!preg_match('/showTechnicians/',$_SESSION['loadpage'])){
		$_SESSION['loadpage']	= $_SESSION['loadpage'].",showTechnicians";
	}

	$start	= $_POST['start'];
	$limit	= $_POST['limit'];

	$totQry	= mysql_query('SELECT * FROM technician WHERE technicianid="'.$_POST['technicianid'].'"');
	$totCnt	= mysql_num_rows($totQry);

	if($totCnt == 0){
		$myData[] = array(
			'technicianid'  	 => 0,
			'technicianname'   => "<span class='tableTextM'>No Technicians Found</span>"
		);
	}elsE{
		$technicianQry = mysql_query("SELECT * FROM technician ORDER BY technicianname LIMIT $start , $limit");
		while($technicianRes = mysql_fetch_array($technicianQry)){
			$myData[] = array(
				'technicianid'  	 	=> $technicianRes['technicianid'],
				'technicianname'   	=> $technicianRes['technicianname'],
				'address1'			=> $technicianRes['address1'],
				'address2'			=> $technicianRes['address2'],
				'address3'			=> $technicianRes['address3'],
				'status'   	        => $technicianRes['status'],
				'mobile'			=> $technicianRes['mobile'],
				'landline'			=> $technicianRes['landline'],
				'email'				=> $technicianRes['email'],
				'city'				=> $technicianRes['city'],
				'status'			=> $technicianRes['status']
				//'addedby'   		=> getTeamMemberName($technicianRes['addedby'])
			);
		}
	}

    $myData = array('TECHNICIANS' => $myData, 'totalCount' => $totCnt);
	header('Content-Type: application/x-json');
    echo json_encode($myData);
}

if($todo == "Add_Technician"){
    $technicianid	= $_POST['technicianid'];
	$technicianname	= $_POST['technicianname'];
	$address1		= $_POST['address1'];
	$address2		= $_POST['address2'];
	$address3		= $_POST['address3'];
	$city			= $_POST['city'];
	$mobile			= $_POST['mobile'];
	$landline		= $_POST['landline'];
	$email			= $_POST['email'];
	$status			= $_POST['status'];
	

	$chkQry	= mysql_query("SELECT * FROM technician WHERE technicianname='".$technicianname."'");
	$chkCnt	= mysql_num_rows($chkQry);
	if($chkCnt == 0){
		$technicianQry = "INSERT INTO technician(technicianname,address1,address2,address3,city,mobile,landline, email,status)
						VALUES('".$technicianname."','".$address1."', '".$address2."', '".$address3."','".$city."','".$mobile."','".$landline."','".$email."', '".$status."')";
						 
		$technicianRes = mysql_query($technicianQry);
		if($technicianRes)
			echo "{ success: true,msg:'Technician <b>$technicianname</b> Added Successfully.'}";
		else
			echo "{ success: false,msg:'Error while adding new Technician.'}";
	}else{
		echo "{ success: false,msg:'Technician <b>$technicianname</b> Already Exists.'}";
	}
}

if($todo == "Edit_Technician"){
	$technicianid	= $_POST['technicianid'];
	$technicianname	= $_POST['technicianname'];
	$address1		= $_POST['address1'];
	$address2		= $_POST['address2'];
	$address3		= $_POST['address3'];
	$city			= $_POST['city'];
	$mobile			= $_POST['mobile'];
	$landline		= $_POST['landline'];
	$email			= $_POST['email'];
	$status			= $_POST['status'];


	$chkQry	= mysql_query("SELECT * FROM technician WHERE technicianname='".$technicianname."' AND technicianid!='".$technicianid."'");
	$chkCnt	= mysql_num_rows($chkQry);
	if($chkCnt == 0){
		$technicianQry = "UPDATE technician SET
						technicianname 	= '".$technicianname."',
						status	        = '".$status."',
						landline 		= '".$landline."',
						mobile			= '".$mobile."',
						email			= '".$email."',
						address1		= '".$address1."',
						address2		= '".$address2."',
						address3		= '".$address3."',
						city			= '".$city."'
						WHERE technicianid= '".$technicianid."'";
		$technicianRes = mysql_query($technicianQry);
		if($technicianRes){
			echo "{ success: true,msg:'Technician <b>$technicianname</b> Updated Successfully.'}";
		}else{
			//$error	= mysql_error();
			echo "{ success: false,msg:'Error while updating Technician'}";
		}
	}else{
		echo "{ success: false,msg:'Already there is some other Technician with the name <b>$technicianname</b> Exists.'}";
	}
}

if($todo == "Delete_Technician"){
	$technicianid		= $_POST['technicianid'];
	$technicianname	= $_POST['technicianname'];
	$insdev		= mysql_query("SELECT * FROM devices WHERE installedby='".$technicianid."'");
	$ins_cnt	= mysql_num_rows($insdev);
	$chkdev		= mysql_query("SELECT * FROM devices WHERE checkedby='".$technicianid."'");
	$che_cnt	= mysql_num_rows($chkdev);
	$tradev		= mysql_query("SELECT * FROM devices WHERE trackingcheckedby='".$technicianid."'");
	$tra_cnt	= mysql_num_rows($tradev);
	$chkQry		= mysql_query("SELECT * FROM technician WHERE technicianname='".$technicianname."' AND technicianid='".$technicianid."'");
	$chkCnt		= mysql_num_rows($chkQry);
	if($ins_cnt == 0 && $che_cnt == 0 && $tra_cnt == 0)
	{
		if($chkCnt == 1){
			$technicianQry = "DELETE FROM technician WHERE technicianname='".$technicianname."' AND technicianid='".$technicianid."'";
			$technicianRes = mysql_query($technicianQry);
			if(!mysql_error()){
				/****
				 *
				 * Delete Devices, History and other tables such as drivers, kids details etc
				 *
				 ***/
			}
			if($technicianRes){
				echo "{ success: true,msg:'Technician <b>$technicianname</b> Deleted Successfully.'}";
			}else{
				//$error	= mysql_error();
				echo "{ success: false,msg:'Error while deleting Technician'}";
			}
		}else{
			echo "{ success: false,msg:'The Technician <b>$technicianname</b> does not Exists.'}";
		}
	}
	else
		echo "{ success: false,msg:'The Technician <b>$technicianname</b> worked for a device.'}";
}
?>