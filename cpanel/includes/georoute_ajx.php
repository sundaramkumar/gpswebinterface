<?php
session_start();
include_once("../config/dbconn.php");
include_once("./functions.php");

$customerid = $_SESSION['customerid'];
$todo = $_POST['todo'];
if($todo == "Save_Route"){
	$routename	= $_POST['routename'];
	$routedata	= $_POST['routeData'];
	$routePath	= $_POST['routePath'];
	
	$routeQry = mysql_query("SELECT * FROM georoute WHERE routename='".$routename."' AND customerid='".$customerid."'");
	$routeCnt = mysql_num_rows($routeQry);
	if($routeCnt>0){
		echo "{ success: false,msg:'Route Name <b>$routename</b> Already Exists.'}";
	}else{
		$insRes = mysql_query("INSERT INTO georoute(customerid, routename, routedata, routepath, addedon) 
					VALUES('".$customerid."', '".$routename."', '".$routedata."', '".$routePath."', '".date("Y-m-d H:i:s")."')");
		$routeid= mysql_insert_id();
		if($insRes){
			echo "{ success: true,msg:'Route Name <b>$routename</b> Saved Successfully.', routeid:'$routeid'}";
		}else{
			echo "{ success: false,msg:'Error while inserting inserting Route'}";
		}
	}
}

if($todo == "Delete_Route"){
	$routeid = $_POST['routeid'];
	
	$devQry = mysql_query("SELECT routeid FROM vehicles WHERE routeid='".$routeid."'");
	$devCnt = mysql_num_rows($devQry);
	if($devCnt>0){
		echo "{ success: false,msg:'This Route is assigned some of your Vehicle.<br>Please first Un-Assign and Delete this Route.'}";
	}else{	
		$delRes = mysql_query("DELETE FROM georoute WHERE routeid='".$routeid."'");
		if($delRes){
			echo "{ success: true,msg:'Route Deleted Successfully.'}";
		}else{
			echo "{ success: false,msg:'Error while Route'}";
		}
	}
}

if($todo == "Assign_Route"){
	$vehicleid = $_POST['routevehicleid'];
	$routeid  = $_POST['routeid'];
	$uptRes = mysql_query("UPDATE vehicles SET routeid='".$routeid."' WHERE vehicleid='".$vehicleid."'");
	if($uptRes){
		echo "{ success: true,msg:'Route Assigned Successfully.'}";
	}else{
		echo "{ success: false,msg:'Error while Assigning Route'}";
	}
}

if($todo == "Get_Route"){
	$routeid  = $_POST['routeid'];
	$routeQry = mysql_query("SELECT routedata FROM georoute WHERE routeid='".$routeid."'");
	$routeRes = mysql_fetch_array($routeQry);
	$routedata	= $routeRes['routedata'];
	echo "{ success: true,routedata:'$routedata'}";
}

if($todo == "UnAssign_Route"){
	$vehicleid 	= $_POST['vehicleid'];
	$routeid  	= $_POST['routeid'];
	$uptRes = mysql_query("UPDATE vehicles SET routeid='0' WHERE vehicleid='".$vehicleid."'");
	if($uptRes){
		echo "{ success: true,msg:'Route Un-Assigned Successfully.'}";
	}else{
		echo "{ success: false,msg:'Error while Un-Assigning Route'}";
	}
}
?>