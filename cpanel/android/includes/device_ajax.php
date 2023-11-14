<?php
include_once("../../config/dbconn.php");

$todo = $_POST['todo'];

if($todo == "Get_Devices_List"){
	$devQry = mysql_query("SELECT * FROM devices ORDER BY devicename");
	$devCnt = mysql_num_rows($devQry);
	$deviceList = 'Select Device : <select id="deviceIMEI" onChange="showLiveTracking()"><option value="">Select Device</option>';
	while($devRes = mysql_fetch_array($devQry)){
		$deviceIMEI = $devRes['deviceIMEI'];
		$devicename = $devRes['devicename'];
		$deviceList .= '<option value="'.$deviceIMEI.'">'.$devicename.'</option>';
	}
	$deviceList .= '</select>';
	$data = array('success'=> true, 'deviceList'=>$deviceList);
	header('Content-Type: application/x-json');
	echo json_encode($data);
}

if($todo == "Get_Live_LatLng"){
	$deviceIMEI	= $_POST['deviceIMEI'];
	$devQry = mysql_query("SELECT * FROM gpsdata_live WHERE deviceIMEI='".$deviceIMEI."'");
	$devRes = mysql_fetch_array($devQry);
	$latitude 	= $devRes['latitude'];
	$longitude	= $devRes['longitude'];
	$ignition	= $devRes['ignition'];

	$data = array('success'=> true, 'deviceIMEI'=>$deviceIMEI, 'latitude'=>$latitude, 'longitude'=>$longitude, 'ignition'=>$ignition);

	header('Content-Type: application/x-json');
	echo json_encode($data);
}
?>