<?
#ajxlogin.php
session_start();
include_once("../config/dbconn.php");

$todo = $_POST['todo'];

if($todo=="Get_Start_End_Point"){
	$deviceid	= $_POST['deviceid'];
	$startgpsid	= $_POST['startgpsid'];
	$endgpsid	= $_POST['endgpsid'];
	
	$deviceArr	= array();
	
	$devQry = mysql_query("SELECT * FROM gpsdata WHERE deviceid='".$deviceid."' AND (gpsid BETWEEN $startgpsid AND $endgpsid) ORDER BY gpsid");
	$devCnt = mysql_num_rows($devQry);
	while($devRes = mysql_fetch_array($devQry)){
		$latitude = $devRes['latitude'];
		$longitude= $devRes['longitude'];
		$deviceArr[] = array(
							'latitude' => $latitude,
							'longitude'=> $longitude
						);
	}
	$latlongJson = json_encode($deviceArr);

	echo "{ success: true, latlongJson:'$latlongJson'}";

}
?>