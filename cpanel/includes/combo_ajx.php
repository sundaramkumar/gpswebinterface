<?php
session_start();
include_once("../config/dbconn.php");

$customerid = $_SESSION['customerid'];

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

if($todo == "Get_Device_List"){
	//$getQry = mysql_query("SELECT * FROM devices WHERE customerid='".$customerid."'");
	/*echo "SELECT * FROM vehicles vh
			LEFT OUTER JOIN devices dev on dev.deviceid = vh.deviceid
			LEFT OUTER JOIN drivers dr on dr.driverid = vh.driverid
			LEFT OUTER JOIN kids gk ON gk.deviceid = dev.deviceid 
			where dev.customerid='".$customerid."'";*/
	if($customerid == '3')
		$cust_qry = "";
	else
		$cust_qry = "AND dev.customerid='".$customerid."'";
	$getQry = mysql_query("SELECT dev.deviceid, dev.devicename, vh.vehicleid, vh.fuel_capacity, vh.speedlimit,
			dev.devicetype, vh.vehiclename, vh.regnno,vh.ignition,vh.fuelstatus, dr.drivername, dr.mobile as driverMobile, gk.kidid, gk.kidname, gk.mobile as kidsMobile,
			vh.fenceid, vh.routeid FROM devices dev
			LEFT OUTER JOIN vehicles vh on vh.deviceid = dev.deviceid
			LEFT OUTER JOIN drivers dr on dr.driverid = vh.driverid
			LEFT OUTER JOIN kids gk ON gk.deviceid = dev.deviceid WHERE (vh.deviceid IS NOT NULL OR gk.deviceid IS NOT NULL) AND (devicetype='VTS' OR devicetype='OTS' OR devicetype='CTS' OR devicetype='PTS' OR devicetype='BTS') $cust_qry");
    $getCnt = mysql_num_rows($getQry);
	
    while($getRes = mysql_fetch_array($getQry)){
        $deviceid   	= $getRes['deviceid'];
		$devicename		= $getRes['devicename'];
		$fenceid   		= $getRes['fenceid'];
		$routeid   		= $getRes['routeid'];
		$fuelcapacity	= $getRes['fuel_capacity'];
		$speedlimit		= $getRes['speedlimit'];
		$devicetype		= $getRes['devicetype'];
		$vehicleid		= $getRes['vehicleid'];
		$vehiclename	= $getRes['vehiclename'];
		$regnno			= $getRes['regnno'];
		$drivername		= $getRes['drivername'];
		$driverMobile	= $getRes['driverMobile'];
		$kidid			= $getRes['kidid'];
		$kidname		= $getRes['kidname'];
		$kidsMobile		= $getRes['kidsMobile'];
		$ignition_v		= $getRes['ignition'];
		$fuelstatus		= $getRes['fuelstatus'];

		$myData[]	= array(
			'deviceid'		=> $deviceid,
			'devicename'	=> $devicename,
			'routeid'		=> $routeid,
			'fenceid'		=> $fenceid,
			'fuelcapacity'	=> $fuelcapacity,
			'devicename'	=> $devicename,
			'devicetype'	=> $devicetype,
			'vehicleid'		=> $vehicleid,
			'vehiclename'	=> $vehiclename,
			'regnno'		=> $regnno,
			'drivername'	=> $drivername,
			'driverMobile'	=> $driverMobile,
			'kidid'			=> $kidid,
			'kidname'		=> $kidname,
			'kidsMobile'	=> $kidsMobile,
			'ignition_v'	=> $ignition_v,
			'fuelstatus'	=> $fuelstatus
		);
    }
	$myData = array('DEVICES' => $myData, 'totalCount' => $getCnt);
	header('Content-Type: application/x-json');
    echo json_encode($myData);
}

if($todo == "Get_Driver_List"){
	$getQry = mysql_query("SELECT * FROM drivers WHERE customerid='".$customerid."'");
    $getCnt = mysql_num_rows($getQry);

    while($getRes = mysql_fetch_array($getQry)){
        $driverid   	= $getRes['driverid'];
		$drivername		= $getRes['drivername'];

		$myData[]	= array(
			'driverid'		=> $driverid,
			'drivername'	=> $drivername
		);
    }


	$myData = array('DRIVERS' => $myData, 'totalCount' => $getCnt);
	header('Content-Type: application/x-json');
    echo json_encode($myData);
}

if($todo == "Get_Device_Date_List"){
	$deviceid = $_POST['deviceid'];
	$getQry = mysql_query("SELECT * FROM gpsdata WHERE deviceid='".$deviceid."' ORDER BY posdatetime ASC");
    $getCnt = mysql_num_rows($getQry);

    while($getRes = mysql_fetch_array($getQry)){
        $gpsid   		= $getRes['gpsid'];
		$posdatetime	= $getRes['posdatetime'];

		$myData[]	= array(
			'gpsid'	=> $gpsid,
			'date'	=> date("d-m-Y H:i:s",strtotime($posdatetime))
		);
    }


	$myData = array('DATES' => $myData, 'totalCount' => $getCnt);
	header('Content-Type: application/x-json');
    echo json_encode($myData);
}

if($todo == "Get_Polygon_Path_List"){
	$getQry = mysql_query("SELECT * FROM geofence WHERE customerid='".$customerid."' ORDER BY pathname");
    $getCnt = mysql_num_rows($getQry);

    while($getRes = mysql_fetch_array($getQry)){
        $fenceid   	= $getRes['fenceid'];
		$pathname	= $getRes['pathname'];
		$polycoords	= $getRes['polycoords'];

		$myData[]	= array(
			'fenceid'	=> $fenceid,
			'pathname'	=> $pathname,
			'polycoords'=> $polycoords
		);
    }


	$myData = array('POLYGON' => $myData, 'totalCount' => $getCnt);
	header('Content-Type: application/x-json');
    echo json_encode($myData);
}

if($todo == "Get_Route_List"){
	$getQry = mysql_query("SELECT * FROM georoute WHERE customerid='".$customerid."' ORDER BY routename");
    $getCnt = mysql_num_rows($getQry);

    while($getRes = mysql_fetch_array($getQry)){
        $routeid   	= $getRes['routeid'];
		$routename	= $getRes['routename'];
		$routedata	= $getRes['routedata'];

		$myData[]	= array(
			'routeid'	=> $routeid,
			'routename'	=> $routename,
			'routedata'=> $routedata
		);
    }


	$myData = array('ROUTE' => $myData, 'totalCount' => $getCnt);
	header('Content-Type: application/x-json');
    echo json_encode($myData);
}
if($todo == "Get_Save_Route"){
	$getQry = mysql_query("SELECT * FROM boardingpoint ORDER BY routename");
    $getCnt = mysql_num_rows($getQry);

    while($getRes = mysql_fetch_array($getQry)){
        $boardingid   	= $getRes['boardingid'];
		$routename	= $getRes['routename'];
		
		$myData[]	= array(
			
			'boardingid'	=> $boardingid,
			'routename'	=> $routename
		);
    }


	$myData = array('SAVEROUTE' => $myData, 'totalCount' => $getCnt);
	header('Content-Type: application/x-json');
    echo json_encode($myData);
}

if($todo == "Get_Vehicle_List_assign"){
	//$devtype	= $_POST['devtype'];
	if($customerid == '3')
		$cust_qry = "";
	else
		$cust_qry = "AND vh.customerid='".$customerid."'";
	
	$vehicleQry = mysql_query("SELECT vh.*,dev.deviceid,dev.devicetype FROM vehicles vh 
								LEFT OUTER JOIN devices dev on dev.deviceid = vh.deviceid 
								WHERE devicetype='OTS' $cust_qry");
	$vehicleCnt = mysql_num_rows($vehicleQry);
	while($vehicleRes = mysql_fetch_array($vehicleQry )){
		$deviceid = $vehicleRes['deviceid'];
		$vehicleid = $vehicleRes['vehicleid'];
		$vehiclename = $vehicleRes['vehiclename'];	
		$myData[] = array(
			'vehicleid'  	 	=> $vehicleRes['vehicleid'],
			'deviceid'  	 	=> $vehicleRes['deviceid'],
			'vehiclename'   	=> $vehicleRes['vehiclename']
		);
	}
	$myData = array('VEHICLES' => $myData, 'totalCount' => $vehicleCnt);
	header('Content-Type: application/x-json');
    echo json_encode($myData);
}

if($todo == "Get_Vehicle_fence_route"){
	//$devtype	= $_POST['devtype'];
	if($customerid == '3')
		$cust_qry = "";
	else
		$cust_qry = "AND vh.customerid='".$customerid."'";
	
	$vehicleQry = mysql_query("SELECT vh.*,dev.deviceid,dev.devicetype FROM vehicles vh 
								LEFT OUTER JOIN devices dev on dev.deviceid = vh.deviceid 
								WHERE devicetype='VTS' $cust_qry");
	$vehicleCnt = mysql_num_rows($vehicleQry);
	while($vehicleRes = mysql_fetch_array($vehicleQry )){
		$deviceid = $vehicleRes['deviceid'];
		$vehicleid = $vehicleRes['vehicleid'];
		$vehiclename = $vehicleRes['vehiclename'];	
		$myData[] = array(
			'vehicleid'  	 	=> $vehicleRes['vehicleid'],
			'deviceid'  	 	=> $vehicleRes['deviceid'],
			'vehiclename'   	=> $vehicleRes['vehiclename']
		);
	}
	$myData = array('VEHICLES' => $myData, 'totalCount' => $vehicleCnt);
	header('Content-Type: application/x-json');
    echo json_encode($myData);
}
?>