<?php

session_start();
include_once("../config/dbconn.php");
include_once("./functions.php");

$todo = $_POST['todo'];
if($todo == "Get_Devices_List"){
	if(!preg_match('/showDevices/',$_SESSION['loadpage'])){
		$_SESSION['loadpage']	= $_SESSION['loadpage'].",showDevices";
	}
	$filterQry = "";
	$start	= $_POST['start'];
	$limit	= $_POST['limit'];
	$customerid	= $_POST['customerid'];
	$devtype = $_POST['devtype'];
	$filtertext	= $_POST['filtertext'];
	
	if($customerid!="" && $customerid!="0"){
		if($devtype!=""){
			if($filtertext!=''){
				$filterQry = "AND dev.customerid=$customerid AND dev.devicetype='$devtype' AND (dev.devicename LIKE '%$filtertext%' OR dev.deviceIMEI LIKE '%$filtertext%' OR dev.model LIKE '%$filtertext%')";
			}
			else{
				$filterQry = "AND dev.customerid=$customerid AND dev.devicetype='$devtype'";
			}
		}
		elseif($filtertext!=''){
			$filterQry = "AND dev.customerid=$customerid AND (dev.devicename LIKE '%$filtertext%' OR dev.deviceIMEI LIKE '%$filtertext%' OR dev.model LIKE '%$filtertext%')";
		}
		
		else{
			$filterQry = "AND dev.customerid=$customerid";
		}
	}
	if($devtype!=""){
		if($customerid!="" && $customerid!="0"){
			if($filtertext!=''){
				$filterQry = "AND dev.customerid=$customerid AND dev.devicetype='$devtype' AND (dev.devicename LIKE '%$filtertext%' OR dev.deviceIMEI LIKE '%$filtertext%' OR dev.model LIKE '%$filtertext%')";
			}
			else{
				$filterQry = "AND dev.customerid=$customerid AND dev.devicetype='$devtype'";
			}
		}
		elseif($filtertext!=''){
			$filterQry = "AND dev.devicetype='$devtype' AND (dev.devicename LIKE '%$filtertext%' OR dev.deviceIMEI LIKE '%$filtertext%' OR dev.model LIKE '%$filtertext%')";
		}
		else{
			$filterQry = "AND dev.devicetype='$devtype'";
		}
	}
	if($filtertext!=''){
		if($customerid!="" && $customerid!="0"){
		
			if($devtype!=""){
				$filterQry = "AND dev.customerid=$customerid AND dev.devicetype='$devtype' AND (dev.devicename LIKE '%$filtertext%' OR dev.deviceIMEI LIKE '%$filtertext%' OR dev.model LIKE '%$filtertext%')";
			}
			else{
				$filterQry = "AND dev.customerid=$customerid AND (dev.devicename LIKE '%$filtertext%' OR dev.deviceIMEI LIKE '%$filtertext%' OR dev.model LIKE '%$filtertext%')";
			}
		}
		elseif($devtype!=""){
			$filterQry = "AND dev.devicetype='$devtype' AND (dev.devicename LIKE '%$filtertext%' OR dev.deviceIMEI LIKE '%$filtertext%' OR dev.model LIKE '%$filtertext%')";
		}
		else{
			$filterQry = "(AND dev.devicename LIKE '%$filtertext%' OR dev.deviceIMEI LIKE '%$filtertext%' OR dev.model LIKE '%$filtertext%')";
		}
	} 
	
	$totQry	= mysql_query("SELECT cus.customerid, cus.customername, dev.* FROM devices dev 
								LEFT OUTER JOIN customers cus ON dev.customerid=cus.customerid 
								WHERE dev.devicename!='' $filterQry");
	$totCnt	= mysql_num_rows($totQry);

	if($totCnt == 0){
		$myData[] = array(
			'deviceid'  	 => 0,
			'devicename'   => "<span class='tableTextM'>No device Found</span>"
		);
	}else{
		$deviceQry = mysql_query("SELECT cus.customerid, cus.customername, dev.* FROM devices dev 
								LEFT OUTER JOIN customers cus ON dev.customerid=cus.customerid 
								WHERE dev.devicename!='' $filterQry ORDER BY devicename LIMIT $start , $limit");
								
		while($deviceRes = mysql_fetch_array($deviceQry)){
			if($deviceRes['devicetype'] == 'VTS')
				$deviceRes['devicetype'] = 'VEHICLE TRACKING';
			else if($deviceRes['devicetype'] == 'CTS')
				$deviceRes['devicetype'] = 'CHILD TRACKING';
			else if($deviceRes['devicetype'] == 'PTS')
				$deviceRes['devicetype'] = 'PHONE TRACKING';
			else if($deviceRes['devicetype'] == 'BTS')
				$deviceRes['devicetype'] = 'BIKE TRACKING';
			else if($deviceRes['devicetype'] == 'OTS')
				$deviceRes['devicetype'] = 'OMNIBUS TRACKING'; 
			$myData[] = array(
				'deviceid'  	 	=> $deviceRes['deviceid'],
				'devicetype'   		=> $deviceRes['devicetype'],	
				'devicename'		=> $deviceRes['devicename'],
				'model'				=> $deviceRes['model'],
				'modeldetails'		=> $deviceRes['modeldetails'],
				'vendorid'			=> $deviceRes['vendorid'],
				'purchasedon'		=> $deviceRes['purchasedon']=="0000-00-00"?"":date("d-m-Y",strtotime($deviceRes['purchasedon'])),
				'invoiceid'			=> $deviceRes['invoiceid'],
				'productcheckedby'	=> $deviceRes['productcheckedby'],
				'deviceIMEI'		=> $deviceRes['deviceIMEI'],
				'status'			=> $deviceRes['status'],
				'customerid'		=> $deviceRes['customerid'],
				'customername'		=> $deviceRes['customername'],
				'installedon'		=> $deviceRes['installedon']=="0000-00-00"?"":date("d-m-Y",strtotime($deviceRes['installedon'])),
				'installedby'		=> $deviceRes['installedby'],
				'checkedby'			=> $deviceRes['checkedby'],
				'trackingcheckedby'	=> $deviceRes['trackingcheckedby'],
				'scrapedon'			=> $deviceRes['scrapedon']=="0000-00-00"?"":date("d-m-Y",strtotime($deviceRes['scrapedon'])),
				'scrapdetails'		=> $deviceRes['scrapdetails'],
				'simcardno'			=> $deviceRes['simcardno'],
				'simserialno'		=> $deviceRes['simserialno'],
				'simprovider'		=> $deviceRes['simprovider'],
				'gprsplan'			=> $deviceRes['gprsplan'],
				'gprssettings'		=> $deviceRes['gprssettings'],
				'activatedon'		=> $deviceRes['activatedon']=="0000-00-00"?"":date("d-m-Y",strtotime($deviceRes['activatedon']))
				
			);
		}
	}
    $myData = array('DEVICES' => $myData, 'totalCount' => $totCnt);
	header('Content-Type: application/x-json');
    echo json_encode($myData);
}

if($todo == "Add_Device"){
	$devicetype		 = $_POST['devicetype'];
	$devicename		 = $_POST['devicename'];
	$model			 = $_POST['model'];
	$modeldetails	 = $_POST['modeldetails'];
	$vendorid		 = $_POST['vendorid'];
	$purchasedon	 = $_POST['purchasedon'];
	if($purchasedon!="")
		$purchasedon = date('Y-m-d', strtotime($purchasedon));
	$invoiceid		 = $_POST['invoiceid'];
	$productcheckedby= $_POST['productcheckedby'];
	$customerid		 = $_POST['customerid'];
	$deviceIMEI		 = $_POST['deviceIMEI'];
	$status			 = $_POST['status'];
	$installedon 	  = $_POST['installedon'];
	if($installedon!="")
		$installedon = date('Y-m-d', strtotime($installedon));
	$installedby	  = $_POST['ins_technicianid'];
	$checkedby		  = $_POST['che_technicianid'];
	$trackingcheckedby= $_POST['tra_technicianid'];
	$scrapedon		  = $_POST['scrapedon'];
	if($scrapedon!="")
		$scrapedon = date('Y-m-d', strtotime($scrapedon));
	$scrapdetails	  = $_POST['scrapdetails'];
	$simcardno		  = $_POST['simcardno'];
	$simserialno	  = $_POST['simserialno'];
	$simprovider	  = $_POST['simprovider'];
	$gprsplan		  = $_POST['gprsplan'];
	$gprssettings	  = $_POST['gprssettings'];
	$activatedon		  = $_POST['activatedon'];
	if($activatedon!="")
		$activatedon = date('Y-m-d', strtotime($activatedon));
	$chkQry	= mysql_query("SELECT * FROM devices WHERE devicename='".$devicename."'");
	$chkCnt	= mysql_num_rows($chkQry);
	if($chkCnt == 0){
		$chkQry_imei	= mysql_query("SELECT * FROM devices WHERE deviceIMEI='".$deviceIMEI."'");
		$chkCnt_imei	= mysql_num_rows($chkQry_imei);
		if($chkCnt_imei == 0)
		{
			$deviceQry = "INSERT INTO devices (devicetype, devicename, model, modeldetails, vendorid, purchasedon, installedon,scrapedon,scrapdetails,gprsplan,gprssettings,
						  installedby,checkedby,trackingcheckedby,invoiceid,productcheckedby,customerid,deviceIMEI,status,activatedon,simcardno,simserialno,simprovider) 
						  VALUES('".$devicetype."', '".$devicename."', '".$model."', '".$modeldetails."', '".$vendorid."', '".$purchasedon."', '".$installedon."', '".$scrapedon."',
						  '".$scrapdetails."','".$gprsplan."','".$gprssettings."', '".$installedby."','".$checkedby."','".$trackingcheckedby."', '".$invoiceid."', '".$productcheckedby."',
						  '".$customerid."', '".$deviceIMEI."', '".$status."', '".$activatedon."', '".$simcardno."', '".$simserialno."', '".$simprovider."')";
			$deviceRes = mysql_query($deviceQry);
			if($deviceRes)
			{
				//insert deviceid and deciceIMEI into gpsdata_live
				$devgpsid = mysql_insert_id();
				mysql_query("INSERT INTO gpsdata_live (deviceid,deviceIMEI) VALUES('".$devgpsid."', '".$deviceIMEI."')");
				echo "{ success: true,msg:'<b>$devicename</b> Added Successfully.'}";
			}
			else
				echo "{ success: false,msg:'Error while adding new Devices.'}";
		}
		else
			echo "{ success: false,msg:'<b>$deviceIMEI</b> Already Exists.'}";
	}else{
		echo "{ success: false,msg:'<b>$devicename</b> Already Exists.'}";
	}
}

if($todo == "Edit_Device"){
	$deviceid		  = $_POST['deviceid'];
	$devicetype		  = $_POST['devicetype'];
	$devicename		  = $_POST['devicename'];
	$model			  = $_POST['model'];
	$modeldetails	  = $_POST['modeldetails'];
	$vendorid		  = $_POST['vendorid'];
	$purchasedon	  = $_POST['purchasedon'];
	if($purchasedon!="")
		$purchasedon = date('Y-m-d', strtotime($purchasedon));
	$invoiceid		  = $_POST['invoiceid'];
	//$productcheckedby = $_POST['productcheckedby'];
	$customerid		  = $_POST['customerid'];
	$deviceIMEI		  = $_POST['deviceIMEI'];
	$status			  = $_POST['status'];
	$installedon	  = $_POST['installedon'];
	if($installedon!="")
		$installedon = date('Y-m-d', strtotime($installedon));
	$installedby	  	= $_POST['ins_technicianid'];
	$checkedby		  	= $_POST['che_technicianid'];
	$trackingcheckedby	= $_POST['tra_technicianid'];
	$scrapedon		  = $_POST['scrapedon'];
	if($scrapedon!="")
		$scrapedon = date('Y-m-d', strtotime($scrapedon));
	$scrapdetails	  = $_POST['scrapdetails'];
	$simcardno		  = $_POST['simcardno'];
	$simserialno	  = $_POST['simserialno'];
	$simprovider	  = $_POST['simprovider'];
	$gprsplan		  = $_POST['gprsplan'];
	$gprssettings	  = $_POST['gprssettings'];
	$activatedon	  = $_POST['activatedon'];
	if($activatedon!="")
		$activatedon = date('Y-m-d', strtotime($activatedon));
	$chkQry	= mysql_query("SELECT * FROM devices WHERE devicename='".$devicename."' AND deviceid!='".$deviceid."'");
	$chkCnt	= mysql_num_rows($chkQry);
	if($chkCnt == 0){
		$chkQry_imei	= mysql_query("SELECT * FROM devices WHERE deviceIMEI='".$deviceIMEI."'  AND deviceid!='".$deviceid."'");
		$chkCnt_imei	= mysql_num_rows($chkQry_imei);
		if($chkCnt_imei == 0)
		{
			if($devicetype == 'VEHICLE TRACKING')
				$devicetype = 'VTS';
			else if($devicetype == 'CHILD TRACKING')
				$devicetype = 'CTS';
			else if($devicetype == 'PHONE TRACKING')
				$devicetype = 'PTS';
			else if($devicetype == 'BIKE TRACKING')
				$devicetype = 'BTS'; 
			else if($devicetype == 'OMNIBUS TRACKING')
				$devicetype = 'OTS'; 
			$deviceQry = "UPDATE devices SET
							devicename 	        = '".$devicename."',
							customerid 		    = '".$customerid."',
							status			    = '".$status."',
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
							gprssettings		= '".$gprssettings."',
							activatedon			= '".$activatedon."'
							WHERE deviceid= '".$deviceid."'";
			$deviceRes = mysql_query($deviceQry);
			if($deviceRes){
				mysql_query("UPDATE gpsdata_live SET deviceIMEI = '".$deviceIMEI."' WHERE deviceid= '".$deviceid."' ");
				echo "{ success: true,msg:'The <b>$devicename</b> Updated Successfully.'}";
			}else{
				echo "{ success: false,msg:'Error while updating Devices'}";
			}
		}
		else
			echo "{ success: false,msg:'DeviceIMEI Already xists.'}";
	}else{
		echo "{ success: false,msg:'<b>$devicename</b> Already xists.'}";
	}
}

if($todo == "Delete_Device"){
	$deviceid	= $_POST['deviceid'];
	$devicename	= $_POST['devicename'];
	$chkQry		= mysql_query("SELECT * FROM devices WHERE deviceid='".$deviceid."'");
	$chkCnt		= mysql_num_rows($chkQry);
	if($chkCnt == 1){
		$deviceQry = "DELETE FROM devices WHERE deviceid='".$deviceid."'";
		$devcieRes = mysql_query($deviceQry);
		$deviceQry_gps = "DELETE FROM gpsdata WHERE deviceid='".$deviceid."'";
		$devcieRes_gps = mysql_query($deviceQry_gps);
		$deviceQry_live = "DELETE FROM gpsdata_live WHERE deviceid='".$deviceid."'";
		$devcieRes_live = mysql_query($deviceQry_live);
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
			echo "{ success: false,msg:'Error while deleting Devices'}";
		}
	}else{
		echo "{ success: false,msg:'The <b>$devicename</b> does not Exists.'}";
	}

	
}
?>