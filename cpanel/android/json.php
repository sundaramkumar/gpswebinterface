<?php
include_once("../config/dbconn.php");
include_once("./functions.php");

$todo = $_POST['todo'];
if($todo == "Get_Lat_Lng"){
	$devicename	= $_POST['devicename'];

	$joinQry = "WHERE gd.devicename = '".$devicename."'";
	$devQry = mysql_query("SELECT gd.devicename, gv.vehiclename, gv.regnno, 
							gpl.latitude, gpl.longitude, gpl.speed, gpl.fuel, gpl.ignition
							FROM gpsdata_live gpl
							LEFT OUTER JOIN devices gd ON gd.deviceIMEI = gpl.deviceIMEI
							LEFT OUTER JOIN vehicles gv ON gv.deviceid = gd.deviceid
							LEFT OUTER JOIN vehicle_sms gvs ON gvs.vehicleid = gv.vehicleid		
							$joinQry
							ORDER BY gd.customerid");
	$devCnt = mysql_num_rows($devQry);
	$devRes = mysql_fetch_array($devQry);
	header('Content-type: application/json');
	echo json_encode(array('deviceData'=>$devRes));
}
?>