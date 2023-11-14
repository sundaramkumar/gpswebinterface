<?php
//include the database connection file and function file
session_start();
include_once("../config/dbconn.php");
include_once("./functions.php");
error_reporting(E_ALL);
ini_set('display_errors','On');

// Get the customerid using session
$customerid = $_SESSION['customerid'];
$username = $_SESSION['username'];
$todo = $_POST['todo'];

//Save the Boarding Point Route
if($todo == "Board_Save_Route"){
	$name = $_POST['boardroutename'];
	$i = 0;
	$j = 0;
	$lati_arr = array();
	//json decode the latlan array
	$lati_arr = json_decode($_POST['latit']);
	$langi_arr = array();
	$langi_arr = json_decode($_POST['langit']);
	$bpointname = array();
	$bpointname = json_decode($_POST['bpointname']);
	$orderno = array();
	$orderno = json_decode($_POST['orderno']);
	$distance = array();
	$distance = json_decode($_POST['distance']);
	//insert the boarding point route name and customerid
	$bquery = mysql_query("INSERT INTO boardingpoint (customerid,routename) values ('".$customerid."','".$name."')");
	//Get the insert boarding point id
	$boardingid= mysql_insert_id();
	if($bquery){
		//insert the boarding point detail in boardingdetails table using for loop.
		for($i=0;$i<count($lati_arr);$i++)
		{
			if($lati_arr[$i]!=0 && $langi_arr[$i]!=0)
			{			
			    $bpquery = mysql_query("INSERT INTO boardingdetails (lat,lan,boardingid,bpointname,orderno,boardingdistance) values ('".$lati_arr[$i]."','".$langi_arr[$i]."','".$boardingid."','".$bpointname[$j]."','".$orderno[$j]."','".$distance[$j]."')");
				$j++;
			}
		}
		//check the boardinding point route save 
		if($bpquery)
			echo "{ success: true,msg:'Route Saved Sucessfully'}";
		else{
			echo "{ success: false,msg:'Route Saved, but lat,lng not Sucess'}";
		}		
	}
	elsE{
		echo "{ success: false,msg:'Route Saved Failed'}";
	}
	
}
// Get the Boarding Point details
if($todo == "Get_BoardingPoints"){
	$boardingid = $_POST['boardingid'];
	$totqry = mysql_query("SELECT * from boardingdetails WHERE boardingid='".$boardingid."'");
	//count the number of rows in particular customer boarding point details
	$totcnt = mysql_num_rows($totqry);
	//check the total count
	if($totcnt == 0){
		$myData[] = array(
		'lat' => "<span class='tableTextM'>No details Found</span>");
	}
	else{
		$brdqry = mysql_query("SELECT * from boardingdetails WHERE boardingid='".$boardingid."'");
		//get the details in array format
		while($brdgres = mysql_fetch_array($brdqry))
		{
			$myData[] = array(
				'lat' => $brdgres['lat'],
				'lan' => $brdgres['lan'],
				'orderno' => $brdgres['orderno'],
				'bpointname' => $brdgres['bpointname'],
				'distance' => $brdgres['boardingdistance']
			);
		}
	}
	$myData = array('POINTS' => $myData, 'totalCount' => $totcnt);
	header('Content-Type: application/x-json');
	//encode the data
    echo json_encode($myData);
}

//Delete the boarding point route
if($todo == "Delete_Route"){
	$boardingid = $_POST['boardingid'];
	$chk_Qry = mysql_query("SELECT boardingid FROM vehicles WHERE boardingid='".$boardingid."'");
	$chk_Cnt = mysql_num_rows($chk_Qry);
	//check the route assigned for another vehicle
	if($chk_Cnt>0){
		echo "{ success: false,msg:'This Route is assigned some of your Vehicle.<br>Please first Un-Assign and Delete this Route.'}";
	}else{	
	//delete the route
		$delRes = mysql_query("DELETE FROM boardingpoint WHERE boardingid='".$boardingid."'");
		if($delRes){
			$del_point_res = mysql_query("DELETE FROM boardingdetails WHERE boardingid='".$boardingid."'");
			if($del_point_res)
				echo "{ success: true,msg:'Route Deleted Successfully.'}";
			else
				echo "{ success: false,msg:'Error while deleting Boarding Points'}";
		}else{
			echo "{ success: false,msg:'Error while deleting Boarding Route'}";
		}
	}
}
//Assign the boarding point route in customer vehicle
if($todo == "Assign_brdg_Route"){
	$vehicleid = $_POST['bdg_routevehicleid'];
	$boardingid  = $_POST['boardingid'];
	//update the vehicles table for assign routeid
	$uptRes = mysql_query("UPDATE vehicles SET boardingid='".$boardingid."' WHERE vehicleid='".$vehicleid."'");
	if($uptRes){
		echo "{ success: true,msg:'Route Assigned Successfully.'}";
	}else{
		echo "{ success: false,msg:'Error while Assigning Route'}";
	}
}
//Get the latlan address
if($todo == "Get_LanLon_Address"){
	$latitude	= $_POST['latitude'];
	$longitude	= $_POST['longitude'];
	//get latlan address usin this link
	echo $geocodeJson = do_post_request("http://maps.googleapis.com/maps/api/geocode/json?latlng=$latitude,$longitude&sensor=true",'','');
	
}

?>