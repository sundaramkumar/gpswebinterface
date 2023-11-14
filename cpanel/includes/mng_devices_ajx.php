<?php
session_start();
include_once("../config/dbconn.php");
include_once("./functions.php");

$customerid = $_SESSION['customerid'];

$todo = $_POST['todo'];
if($todo == "Get_Devices_List"){
	if(!preg_match('/showDevices/',$_SESSION['loadpage'])){
		$_SESSION['loadpage']	= $_SESSION['loadpage'].",showDevices";
	}

	$start	= $_POST['start'];
	$limit	= $_POST['limit'];
	//echo($customerid);
	if($customerid == '3')
		$cust_qry = "";
	else
		$cust_qry = "WHERE gd.customerid='".$customerid."'";
	$totQry	= mysql_query("SELECT gd.*, gv.vehiclename, gv.regnno, gk.kidname, gk.institutename FROM devices gd
				LEFT OUTER JOIN vehicles gv ON gv.deviceid = gd.deviceid
				LEFT OUTER JOIN kids gk ON gk.deviceid = gd.deviceid 
				$cust_qry ORDER BY gd.devicename");
	$totCnt	= mysql_num_rows($totQry);

	if($totCnt == 0){
		$myData[] = array(
			'deviceid'  	 => 0,
			'devicename'   => "<span class='tableTextM'>No device Found</span>"
		);
	}elsE{
		$$deviceQry = mysql_query("SELECT gd.*, gv.vehiclename, gv.regnno, gk.kidname, gk.institutename FROM devices gd
						LEFT OUTER JOIN vehicles gv ON gv.deviceid = gd.deviceid
						LEFT OUTER JOIN kids gk ON gk.deviceid = gd.deviceid 
						$cust_qry ORDER BY devicetype LIMIT $start , $limit");
		while($deviceRes = mysql_fetch_array($$deviceQry)){
			$devdetails = "";
			$devicetype	= $deviceRes['devicetype'];
			if($devicetype=="VTS"){
				$devdetails = "<p><b>Vehicle Name :</b>&#160;".$deviceRes['vehiclename'];
				$devdetails .= "<p><b>RegNo :</b>&#160;".$deviceRes['regnno'];
			}else if($devicetype=="CTS"){
					$devdetails = "<p><b>Kids Name :</b>&#160;".$deviceRes['kidname'];
					$devdetails .= "<p><b>Institute Name :</b>&#160;".$deviceRes['institutename'];
			}
			$myData[] = array(
				'deviceid'  	 	=> $deviceRes['deviceid'],
				'devicetype'   		=> $deviceRes['devicetype'],
				'devicename'		=> $deviceRes['devicename'],
				'purchasedon'		=> $deviceRes['purchasedon']=="0000-00-00"?"":date("d-m-Y",strtotime($deviceRes['purchasedon'])),
				'installedon'		=> $deviceRes['installedon']=="0000-00-00"?"":date("d-m-Y",strtotime($deviceRes['installedon'])),
				'status'			=> $deviceRes['status'],
				'simcardno'			=> $deviceRes['simcardno'],
				'simserialno'		=> $deviceRes['simserialno'],
				'simprovider'		=> $deviceRes['simprovider'],
				'gprsplan'			=> $deviceRes['gprsplan'],
				'gprssettings'		=> $deviceRes['gprssettings'],
				'activatedon'		=> $deviceRes['activatedon']=="0000-00-00"?"":date("d-m-Y",strtotime($deviceRes['activatedon'])),
				'devdetails'		=> $devdetails,				
				'realtime'		=> '<img src="./images/view.png" style="cursor:pointer;" title="Track this Vehicle in Realtime" onClick="Show_Gps_Track_Live('.$deviceRes['deviceid'].')"/>',
				'history'		=> '<img src="./images/history.png" style="cursor:pointer;" title="View the past history of this Vehicle\'s movement" onClick="Show_Gps_Track_History('.$deviceRes['deviceid'].')"/>'
				
			);
		}
	}

    $myData = array('DEVICES' => $myData, 'totalCount' => $totCnt);
	header('Content-Type: application/x-json');
    echo json_encode($myData);
}

if($todo == "Get_Device_Details"){
	if(!preg_match('/showDevices/',$_SESSION['loadpage'])){
		$_SESSION['loadpage']	= $_SESSION['loadpage'].",showDevices";
	}

	$start	= $_POST['start'];
	$limit	= $_POST['limit'];

	$totQry	= mysql_query('SELECT * FROM devices WHERE deviceid="'.$_POST['deviceid'].'"');
	$totCnt	= mysql_num_rows($totQry);

	if($totCnt == 0){
		$myData[] = array(
			'deviceid'  	 => 0,
			'decvicename'   => "<span class='tableTextM'>No Device Found</span>"
		);
	}elsE{
		$deviceQry = mysql_query("SELECT * FROM devices ORDER BY devicename LIMIT $start , $limit");
		while($deviceRes = mysql_fetch_array($deviceQry)){
			$myData[] = array(
				'deviceid'  	 	=> $deviceRes['deviceid'],
				'devicename'   	=> $deviceRes['devicename'],
				'status'   	=> $deviceRes['status'],
				'mobile'			=> $deviceRes['mobile'],
				'email'				=> $deviceRes['email'],
				'city'				=> $deviceRes['city'],
				//'addedby'   		=> getTeamMemberName($technicianRes['addedby'])
			);
		}
	}

    $myData = array('DEVICES' => $myData, 'totalCount' => $totCnt);
	header('Content-Type: application/x-json');
    echo json_encode($myData);
}

if($todo == "Add_Device"){
	$devicetype	= $_POST['devicetype'];
	$devicename	= $_POST['devicename'];
	$model		= $_POST['model'];
	$details	= $_POST['modeldetails'];
	$vendor		= $_POST['vendor'];
	$purchasedon	= $_POST['purchasedon'];
	$invoiceid	= $_POST['invoiceid'];
	$productcheckedby= $_POST['productcheckedby'];
	$customerid= $_POST['customerid'];
	$deviceIMEI	= $_POST['deviceIMEI'];
	$status		= $_POST['status'];

	$chkQry	= mysql_query("SELECT * FROM devices WHERE devicename='".$devicename."'");
	$chkCnt	= mysql_num_rows($chkQry);
	if($chkCnt == 0){
		$deviceQry = "INSERT INTO devices(devicetype, devicename, model, modeldetails, vendorid,purchasedon,
						invoiceid,productcheckedby,customerid,deviceIMEI,status)
						VALUES('".$devicetype."', '".$devicename."', '".$model."', '".$modeldetails."', '".$vendor."',
						'".$purchasedon."', '".$invoiceid."', '".$productcheckedby."', '".$customerid."', '".$deviceIMEI."', '".$status."')";
		$deviceRes = mysql_query($deviceQry);
		if($deviceRes)
			echo "{ success: true,msg:'<b>$devicename</b> Added Successfully.'}";
		else
			echo "{ success: false,msg:'Error while adding new Devices.'}";
	}else{
		echo "{ success: false,msg:'<b>$devicename</b> Already Exists.'}";
	}
}

if($todo == "Edit_Device"){
	$deviceid	= $_POST['deviceid'];
	$devicetype	= $_POST['devicetype'];
	$devicename	= $_POST['devicename'];
	$model		= $_POST['model'];
	$modeldetails	= $_POST['modeldetails'];
	$vendorid		= $_POST['vendorid'];
	$purchasedon	= $_POST['purchasedon'];
	if($purchasedon!="")
		$purchasedon = date('Y-m-d', strtotime($purchasedon));
	$invoiceid		= $_POST['invoiceid'];
	$productcheckedby= $_POST['productcheckedby'];
	$customerid		= $_POST['customerid'];
	$deviceIMEI	= $_POST['deviceIMEI'];
	$status		= $_POST['status'];
	$installedon	= $_POST['installedon'];
	if($installedon!="")
		$installedon = date('Y-m-d', strtotime($installedon));	
	$installedby		= $_POST['installedby'];
	$checkedby	= $_POST['checkedby'];
	$trackingcheckedby		= $_POST['trackingcheckedby'];
	$scrapedon	= $_POST['scrapedon'];
	$scrapedon = date('Y-m-d', strtotime($scrapedon));	
	$scrapdetails	= $_POST['scrapdetails'];
	$simcardno= $_POST['simcardno'];
	$simserialno= $_POST['simserialno'];
	$simprovider	= $_POST['simprovider'];
	$gprsplan		= $_POST['gprsplan'];
	$gprssettings		= $_POST['gprssettings'];
	//$activatedon		= $_POST['activatedon'];

	$chkQry	= mysql_query("SELECT * FROM devices WHERE devicename='".$devicename."' AND deviceid!='".$deviceid."'");
	$chkCnt	= mysql_num_rows($chkQry);
	if($chkCnt == 0){
		$deviceQry = "UPDATE devices SET
						devicename 	= '".$devicename."',
						status			= '".$status."',
						devicetype 			= '".$devicetype."',
						model				= '".$model."',
						modeldetails		= '".$modeldetails."',
						vendorid			= '".$vendorid."',
						purchasedon			= '".$purchasedon."',
						invoiceid			= '".$invoiceid."',
						productcheckedby	= '".$productcheckedby."',
						deviceIMEI			= '".$deviceIMEI."',
						installedon 		= '".$installedon."',
						installedby			= '".$installedby."',
						checkedby 			= '".$checkedby."',
						trackingcheckedby	= '".$trackingcheckedby."',
						scrapedon			= '".$scrapedon."',
						scrapdetails		= '".$scrapdetails."',
						simcardno			= '".$simcardno."',
						simserialno			= '".$simserialno."',
						simprovider			= '".$simprovider."',
						gprsplan			= '".$gprsplan."',
						gprssettings		= '".$gprssettings."'
						WHERE deviceid= '".$deviceid."'";
		//echo $deviceQry;				
		$deviceRes = mysql_query($deviceQry);
		if($deviceRes){
			echo "{ success: true,msg:'The <b>$devicename</b> Updated Successfully.'}";
		}else{
			//$error	= mysql_error();
			echo "{ success: false,msg:'Error while updating Devices'}";
		}
	}else{
		echo "{ success: false,msg:'Already there is some other Devices with the name <b>$devicename</b> Exists.'}";
	}
}

if($todo == "Delete_Device"){
	$deviceid		= $_POST['deviceid'];
	$devicename	= $_POST['devicename'];
	$chkQry	= mysql_query("SELECT * FROM devices WHERE devicename='".$devicename."' AND deviceid='".$deviceid."'");
	$chkCnt	= mysql_num_rows($chkQry);
	if($chkCnt == 1){
		$deviceQry = "DELETE FROM devices WHERE devicename='".$devicename."' AND deviceid='".$deviceid."'";
		$devcieRes = mysql_query($deviceQry);
		if(!mysql_error()){
			/****
			 *
			 * Delete Devices, History and other tables such as drivers, kids details etc
			 *
			 ***/
		}
		if($devcieRes){
			echo "{ success: true,msg:'The <b>$devicename</b> Deleted Successfully.'}";
		}else{
			//$error	= mysql_error();
			echo "{ success: false,msg:'Error while deleting Devices'}";
		}
	}else{
		echo "{ success: false,msg:'The <b>$devicename</b> does not Exists.'}";
	}
}

if($todo == "Update_Simcard_Details"){
	$deviceid		= $_POST['deviceid'];
	$devicename		= $_POST['devicename'];
	$simcardno		= $_POST['simcardno'];
	$simprovider	= $_POST['simprovider'];
	$simcardserial	= $_POST['simcardserial'];
	$gprsplan		= $_POST['gprsplan'];
	$gprssettings	= $_POST['gprssettings'];
	
	
	$uptQry = "UPDATE devices SET simcardno='".$simcardno."', simserialno='".$simcardserial."', 
			simprovider='".$simprovider."', gprsplan='".$gprsplan."', gprssettings='".$gprssettings."'
			WHERE deviceid='".$deviceid."'";
	$uptRes = mysql_query($uptQry);
	if($uptRes){
		echo "{ success: true,msg:'The <b>$devicename</b> Simcard Details Updated Successfully.'}";
	}else{
		//$error	= mysql_error();
		echo "{ success: false,msg:'Error while updating simcard details'}";
	}
}
?>