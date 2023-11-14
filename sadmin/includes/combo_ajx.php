<?php
session_start();
include_once("../config/dbconn.php");

$todo = $_POST['todo'];

	
if($todo == "Get_Customers_List"){
	$getQry = mysql_query("SELECT * FROM customers ORDER BY customername");
    $getCnt = mysql_num_rows($getQry);
	
    while($getRes = mysql_fetch_array($getQry)){
        $customerid   	= $getRes['customerid'];
		$customername	= $getRes['customername'];
		
		$myData[]	= array(
			
			'customerid'	=> $customerid,
			'customername'	=> $customername
		);
    }


	$myData = array('CUSTOMERS' => $myData, 'totalCount' => $getCnt);
	header('Content-Type: application/x-json');
    echo json_encode($myData);
}

if($todo == "Get_Customers_List_Filter"){
	$getQry = mysql_query("SELECT * FROM customers ORDER BY customername");
    $getCnt = mysql_num_rows($getQry);
	$myData[]= array(
                'customerid'        => 0,
                'customername'        => 'All'
               );
    while($getRes = mysql_fetch_array($getQry)){
        $customerid   	= $getRes['customerid'];
		$customername	= $getRes['customername'];
		
		$myData[]	= array(
			
			'customerid'	=> $customerid,
			'customername'	=> $customername
		);
    }


	$myData = array('CUSTOMERS' => $myData, 'totalCount' => $getCnt);
	header('Content-Type: application/x-json');
    echo json_encode($myData);
}


if($todo == "Get_Project_List"){
	$getQry = mysql_query("SELECT * FROM project ORDER BY projectname");
    $getCnt = mysql_num_rows($getQry);

    while($getRes = mysql_fetch_array($getQry)){
        $projectid   	= $getRes['projectid'];
		$projectname	= $getRes['projectname'];
		$projectplots	= $getRes['projectplots'];

		$myData[]	= array(
			'projectid'	=> $projectid,
			'projectname'	=> $projectname,
			'projectplots'	=> $projectplots
		);
    }


	$myData = array('PROJECT' => $myData, 'totalCount' => $getCnt);
	header('Content-Type: application/x-json');
    echo json_encode($myData);
}
if($todo == "Get_Plots_ComboList"){
	$projCndtnQry = "";
    $myData = array();
	$rowno = 0;
	if(isset($_POST['projectid'])){
		if($_POST['projectid'] != ""){
			$projectid = $_POST['projectid'];
			$projCndtnQry = " WHERE projectid=$projectid ";

			$getQry = mysql_query("SELECT * FROM plots $projCndtnQry ORDER BY fromplotno");
			$getCnt = mysql_num_rows($getQry);
			if($getCnt > 0){
				$rowno = 1;
				while($getRes = mysql_fetch_array($getQry)){
					$plotid   		= $getRes['plotid'];
					$fromplotno		= $getRes['fromplotno'];
					$toplotno		= $getRes['toplotno'];
					$plotsqft		= $getRes['plotsqft'];
					$ratepersqft	= $getRes['ratepersqft'];
					for($i=$fromplotno;$i<=$toplotno;$i++){
						$myData[]	= array(
							'dup_plotid'	=> $rowno,
							'plotid'		=> $plotid,
							'plotno'		=> $i,
							'plotsqft'		=> $plotsqft,
							'ratepersqft'	=> $ratepersqft
						);
						$rowno++;
					}
				}
			}
		}
	}


	$myData = array('PLOTS' => $myData, 'totalCount' => $rowno);
	header('Content-Type: application/x-json');
    echo json_encode($myData);
}


if($todo == "Get_Devices_List"){
   /* if($customerid!='') 
   echo $customerid;
   else
   echo 'no customerid'; */
   $customerid = $_POST['customerid'];

	$getQry = mysql_query("SELECT * FROM devices WHERE customerid='".$customerid."' ORDER BY devicename");
    $getCnt = mysql_num_rows($getQry);

    while($getRes = mysql_fetch_array($getQry)){
        $deviceid   	= $getRes['deviceid'];
		$devicename	= $getRes['devicename'];

		$myData[]	= array(
			'deviceid'	=> $deviceid,
			'devicename'	=> $devicename
		);
    }


	$myData = array('DEVICES' => $myData, 'totalCount' => $getCnt);
	header('Content-Type: application/x-json');
   echo json_encode($myData);
}

if($todo == "Get_Devices_List_Vehicle"){
  	$customerid_add = $_POST['customerid_add'];
	$customerid_edit = $_POST['customerid_edit'];
	if($customerid_add)
	$getQry = mysql_query("SELECT dev.* FROM devices dev LEFT OUTER JOIN vehicles veh ON veh.deviceid = dev.deviceid WHERE dev.customerid='".$customerid_add."' AND veh.deviceid IS NULL AND (devicetype='VTS' OR devicetype='OTS') ORDER BY devicename");
	if($customerid_edit)
	$getQry = mysql_query("SELECT * FROM devices WHERE customerid='".$customerid_edit."' AND devicetype='VTS' OR devicetype='OTS' ORDER BY devicename");
    $getCnt = mysql_num_rows($getQry);

    while($getRes = mysql_fetch_array($getQry)){
        $deviceid   	= $getRes['deviceid'];
		$devicename	= $getRes['devicename'];

		$myData[]	= array(
			'deviceid'	=> $deviceid,
			'devicename'	=> $devicename
		);
    }


	$myData = array('DEVICES_T' => $myData, 'totalCount' => $getCnt);
	header('Content-Type: application/x-json');
   echo json_encode($myData);
}



if($todo == "Get_Devices_List_Kids"){
    $customerid_add = $_POST['customerid_add'];
	$customerid_edit = $_POST['customerid_edit'];
	if($customerid_add)
    //$customerid = $_POST['customerid'];
	$getQry = mysql_query("SELECT dev.* FROM devices dev LEFT OUTER JOIN kids kid ON kid.deviceid = dev.deviceid WHERE dev.customerid='".$customerid_add."' AND kid.deviceid IS NULL AND devicetype='CTS' ORDER BY devicename");
	if($customerid_edit)
	$getQry = mysql_query("SELECT * FROM devices WHERE customerid='".$customerid_edit."' AND devicetype='CTS' ORDER BY devicename");
    $getCnt = mysql_num_rows($getQry);

    while($getRes = mysql_fetch_array($getQry)){
        $deviceid   	= $getRes['deviceid'];
		$devicename	= $getRes['devicename'];

		$myData[]	= array(
			'deviceid'	=> $deviceid,
			'devicename'	=> $devicename
		);
    }


	$myData = array('DEVICES_KIDS' => $myData, 'totalCount' => $getCnt);
	header('Content-Type: application/x-json');
   echo json_encode($myData);
}


if($todo == "Get_Drivers_List"){

    $customerid = $_POST['customerid'];

	$getQry = mysql_query("SELECT * FROM drivers WHERE customerid='".$customerid."' ORDER BY drivername ");
    $getCnt = mysql_num_rows($getQry);

    while($getRes = mysql_fetch_array($getQry)){
        $driverid   	= $getRes['driverid'];
		$drivername	= $getRes['drivername'];

		$myData[]	= array(
			'driverid'	 => $driverid,
			'drivername' => $drivername
		);
    }


	$myData = array('DRIVERS' => $myData, 'totalCount' => $getCnt);
	header('Content-Type: application/x-json');
	
    echo json_encode($myData);
}


if($todo == "Get_Technicians_List"){
	$getQry = mysql_query("SELECT * FROM technician ORDER BY technicianname");
    $getCnt = mysql_num_rows($getQry);

    while($getRes = mysql_fetch_array($getQry)){
        $technicianid   	= $getRes['technicianid'];
		$technicianname		= $getRes['technicianname'];

		$myData[]	= array(
			'technicianid'		=> $technicianid,
			'technicianname'	=> $technicianname
		);
    }


	$myData = array('TECHNICIANS' => $myData, 'totalCount' => $getCnt);
	header('Content-Type: application/x-json');
    echo json_encode($myData);
}




?>