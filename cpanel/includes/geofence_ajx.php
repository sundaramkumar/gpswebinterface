<?php
session_start();
include_once("../config/dbconn.php");
include_once("./functions.php");

$customerid = $_SESSION['customerid'];
$todo = $_POST['todo'];
if($todo == "Save_Poly_Path"){
	$pathname	= $_POST['pathname'];
	$polycoords	= $_POST['polycoords'];
	$polyCoordsX= $_POST['polyCoordsX'];
	$polyCoordsY= $_POST['polyCoordsY'];
	
	$fenceQry = mysql_query("SELECT * FROM geofence WHERE pathname='".$pathname."' AND customerid='".$customerid."'");
	$fenceCnt = mysql_num_rows($fenceQry);
	if($fenceCnt>0){
		echo "{ success: false,msg:'Path Name <b>$pathname</b> Already Exists.'}";
	}else{
		$insRes = mysql_query("INSERT INTO geofence(customerid, pathname, polycoords, polyCoordsX, polyCoordsY, addedon) 
					VALUES('".$customerid."', '".$pathname."', '".$polycoords."', '".$polyCoordsX."', '".$polyCoordsY."', '".date("Y-m-d H:i:s")."')");
		$fenceid= mysql_insert_id();
		if($insRes){
			echo "{ success: true,msg:'PathName <b>$pathname</b> Saved Successfully.', fenceid:'$fenceid'}";
		}else{
			echo "{ success: false,msg:'Error while inserting path name'}";
		}
	}
}

if($todo == "Delete_Poly_Path"){
	$fenceid = $_POST['fenceid'];
	
	$devQry = mysql_query("SELECT fenceid FROM devices WHERE fenceid='".$fenceid."'");
	$devCnt = mysql_num_rows($devQry);
	if($devCnt>0){
		echo "{ success: false,msg:'This Path is assigned some of your Devices.<br>Please first Un-Assign and Delete this path.'}";
	}else{	
		$delRes = mysql_query("DELETE FROM geofence WHERE fenceid='".$fenceid."'");
		if($delRes){
			echo "{ success: true,msg:'PathName Deleted Successfully.'}";
		}else{
			echo "{ success: false,msg:'Error while deleting Path'}";
		}
	}
}

if($todo == "Assign_Poly_Path"){
	$vehicleid = $_POST['polyvehicleid'];
	$fenceid  = $_POST['fenceid'];
	$uptRes = mysql_query("UPDATE vehicles SET fenceid='".$fenceid."' WHERE vehicleid='".$vehicleid."'");
	if($uptRes){
		echo "{ success: true,msg:'Path Assigned Successfully.'}";
	}else{
		echo "{ success: false,msg:'Error while Assigning Path'}";
	}
}

if($todo == "Get_Poly_Path"){
	$fenceid  = $_POST['fenceid'];
	$fenceQry = mysql_query("SELECT polycoords FROM geofence WHERE fenceid='".$fenceid."'");
	$fenceRes = mysql_fetch_array($fenceQry);
	$polycoords	= $fenceRes['polycoords'];
	echo "{ success: true,polycoords:'$polycoords'}";
}

if($todo == "UnAssign_Poly_Path"){
	$vehicleid = $_POST['vehicleid'];
	$fenceid  = $_POST['fenceid'];
	$uptRes = mysql_query("UPDATE vehicles SET fenceid='0' WHERE vehicleid='".$vehicleid."'");
	if($uptRes){
		echo "{ success: true,msg:'Path Un-Assigned Successfully.'}";
	}else{
		echo "{ success: false,msg:'Error while Un-Assigning Path'}";
	}
}
?>