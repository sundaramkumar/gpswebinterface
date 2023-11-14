<?
#ajxlogin.php
session_start();
include_once("../config/dbconn.php");

$todo = $_POST['todo'];

if($todo=="Get_Devices_List"){
	$nodes = array();

	$devQry = mysql_query("SELECT * FROM gpsdata GROUP BY deviceid");
	while($devRes = mysql_fetch_array($devQry)){
		$deviceid = $devRes['deviceid'];
		$nodes[] = array(
						'text' 	=> $deviceid,
						'id'	=> "Tracking/Realtime/Devices/".$deviceid,
						'leaf'	=> true,
						'iconCls'	=> 'gpsDevices',
						'checked'=> false
					);
	}



	//echo "{'text':'Devices','expanded': true,'leaf':false,'children':".json_encode($nodes)."}";

	echo json_encode($nodes);
}

if($todo == "Get_Lat_Lon"){
	$deviceids = $_POST['deviceids'];

	$deviceArr	= array();
	$deviceidSplt = explode("@",$deviceids);
	foreach($deviceidSplt as $ind => $deviceid){
		$devQry = mysql_query("SELECT * FROM gpsdata WHERE deviceid='".$deviceid."' ORDER BY gpsid DESC LIMIT 0,1");
		$devCnt = mysql_num_rows($devQry);
		$devRes = mysql_fetch_array($devQry);
		$latitude = $devRes['latitude'];
		$longitude= $devRes['longitude'];

		$deviceArr[$deviceid]['latitude']	= $latitude;
		$deviceArr[$deviceid]['longitude'] 	= $longitude;
	}

	$deviceArrJson = json_encode($deviceArr);

	echo "{ success: true, deviceArrJson:'$deviceArrJson'}";
}
?>