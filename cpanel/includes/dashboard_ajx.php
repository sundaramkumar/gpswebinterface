<?php
session_start();
include_once("../config/dbconn.php");
include_once("./functions.php");

$customerid = $_SESSION['customerid'];
$todo = $_POST['todo'];
if($todo == "Get_Vehicle_List"){
	//$devtype	= $_POST['devtype'];
	if($customerid == '3')
		$cust_qry = "";
	else
		$cust_qry = "AND vh.customerid='".$customerid."'";
	
	$vehicleQry = mysql_query("SELECT vh.vehicleid,dev.deviceid,vh.regnno,vh.vehiclename,dev.devicename,
							  gdl.ignition,gdl.latitude,gdl.longitude FROM vehicles vh
		LEFT outer join devices dev on dev.deviceid = vh.deviceid
		LEFT outer join gpsdata_live gdl on gdl.deviceIMEI = dev.deviceIMEI
		LEFT outer join drivers dr on dr.driverid = vh.driverid
		where (devicetype='VTS' OR devicetype='OTS') $cust_qry");
	$vehicleCnt = mysql_num_rows($vehicleQry);
	while($vehicleRes = mysql_fetch_array($vehicleQry )){
		$deviceid = $vehicleRes['deviceid'];
		$latitude 	= $vehicleRes['latitude'];
		$longitude	= $vehicleRes['longitude'];
		$ignition	= $vehicleRes['ignition'];
		$address	= "<span id='dboardaddr_".$deviceid."'><a href='javascript: getDeviceAddress($deviceid,\"$latitude\", \"$longitude\")'>View Address</a></span>"; //getDeviceAddress($latitude, $longitude);
		if($ignition=="OFF")
			$ignition	= '<img src="./images/engineoff.png" title="Engine is Off"/>'; //<span style="color:red;font-weight:bold">'.$ignition.'</span>';
		else
			$ignition	= '<img src="./images/engineon.gif" title="Engine is On"/>'; //<span style="color:green;font-weight:bold">'.$ignition.'</span>';
		$myData[] = array(
			'vehicleid'  	 	=> $vehicleRes['vehicleid'],
			'deviceid'  	 	=> $vehicleRes['deviceid'],
			'regno'   			=> $vehicleRes['regnno'],
			'vehiclename'   	=> $vehicleRes['vehiclename'],
			'devicename'   		=> $vehicleRes['devicename'],
			'ignition'   		=> $ignition,
			'address'   		=> $address
		);
	}
	$myData = array('VEHICLE' => $myData, 'totalCount' => $vehicleCnt);
	header('Content-Type: application/x-json');
    echo json_encode($myData);
}

if($todo == "Change_Password"){
	$old_pwd = $_POST['old_pwd'];
	$new_pwd = $_POST['new_pwd'];
	//$cnfm_pwd = $_POST['cnfmpwd'];
	$userid = $_SESSION['userid'];
	$customerid = $_SESSION['customerid'];
	/* $pwd_qry = mysql_query("SELECT password FROM users where userid='".$userid."'");
	$pwd_res = mysql_fetch_array($pwd_qry);
	$db_pwd	= $pwd_res['password']; */
	$chng_qry =  mysql_query("SELECT * FROM users where userid='".$userid."' AND customerid='".$customerid."' AND password=PASSWORD('".$old_pwd."')");
	$chng_cnt = mysql_num_rows($chng_qry);
	if($chng_cnt == 0){
		echo "{ success: false,msg:'Your Current Password is INCORRECT..<br>Please enter correct password.'}";
	}
	else{
		$pwd_update_qry = mysql_query("UPDATE users SET	password=PASSWORD('".$new_pwd."') WHERE userid='".$userid."'");
		if($pwd_update_qry)
			echo "{success: true,msg:'Password Successfully changed'}";
	}
} 


?>