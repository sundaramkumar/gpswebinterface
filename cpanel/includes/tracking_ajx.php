<?php
session_start();
include_once("../config/dbconn.php");
include_once("./functions.php");

$customerid = $_SESSION['customerid'];
$todo = $_POST['todo'];
if($todo == "Get_Vehicle_List"){
	$devtype	= $_POST['devtype'];
	$start	= $_POST['start'];
	$limit	= $_POST['limit'];

	$filterText	= $_POST['filterText'];
	$filterQry = "";
	if($filterText!=""){
		$filterQry = " AND ( vh.regnno LIKE '$filterText%' OR vh.vehiclename LIKE '$filterText%' OR drivername LIKE '$filterText%')";
	}

	$totQry	= mysql_query("SELECT * FROM vehicles vh
			LEFT outer join devices dev on dev.deviceid = vh.deviceid
			LEFT outer join drivers dr on dr.driverid = vh.driverid
			where dev.devicetype='".$devtype."' AND vh.customerid='".$customerid."' $filterQry");
	$totCnt	= mysql_num_rows($totQry);

	if($totCnt == 0){
		$myData[] = array(
			'vehicleid'  	 => 0,
			'vehiclename'   => "<span class='tableTextM'>No Vehicle Found</span>"
		);
	}else{
		$vehicleQry = mysql_query("SELECT * FROM vehicles vh
			LEFT outer join devices dev on dev.deviceid = vh.deviceid
			LEFT outer join drivers dr on dr.driverid = vh.driverid
			where dev.devicetype='".$devtype."' AND vh.customerid='".$customerid."' $filterQry LIMIT $start , $limit");
		while($vehicleRes = mysql_fetch_array($vehicleQry )){
			$fenceid	= $vehicleRes['fenceid'];
			$fenceText  = "";
			if($fenceid!=0){
				$fenceText  = '<img src="./images/polygon.png" style="cursor:pointer;" title="View Route Path this Vehicle" onClick="Show_Poly_Path('.$vehicleRes['fenceid'].')"/>';
				$fenceText  .= '&#160;&#160;&#160;<img src="./images/remove.png" style="cursor:pointer;" title="Un-Assign Route Path this Vehicle" onClick="UnAssign_Poly_Path('.$vehicleRes['deviceid'].','.$vehicleRes['fenceid'].')"/>';
			}
			$routeid	= $vehicleRes['routeid'];
			$routeText  = "";
			if($routeid!=0){
				$routeText  = '<img src="./images/routepath.png" style="cursor:pointer;" title="View Route Path this Vehicle" onClick="Show_Route('.$vehicleRes['routeid'].')"/>';
				$routeText  .= '&#160;&#160;&#160;<img src="./images/remove.png" style="cursor:pointer;" title="Un-Assign Route Path this Vehicle" onClick="UnAssign_Route('.$vehicleRes['deviceid'].','.$vehicleRes['routeid'].')"/>';
			}
			$myData[] = array(
				'vehicleid'  	 	=> $vehicleRes['vehicleid'],
				'customerid'  	 	=> $vehicleRes['customerid'],
				'deviceid'  	 	=> $vehicleRes['deviceid'],
				'regno'   			=> $vehicleRes['regnno'],
				'vehiclename'   	=> $vehicleRes['vehiclename'],
				'devicename'   		=> $vehicleRes['devicename'],
				'deviceIMEI'   		=> $vehicleRes['deviceIMEI'],
				'simcardno'   		=> $vehicleRes['simcardno'],
				'drivername'   		=> $vehicleRes['drivername'],
				'mobile'   		=> $vehicleRes['mobile'],
				'polypath'		=> $fenceText,
				'routepath'		=> $routeText,
				'realtime'		=> '<img src="./images/view.png" style="cursor:pointer;" title="Track this Vehicle in Realtime" onClick="Show_Gps_Track_Live('.$vehicleRes['deviceid'].')"/>',
				'history'		=> '<img src="./images/history.png" style="cursor:pointer;" title="View the past history of this Vehicle\'s movement" onClick="Show_Gps_Track_History('.$vehicleRes['deviceid'].')"/>'
			);
		}
	}

    $myData = array('VEHICLE' => $myData, 'totalCount' => $totCnt);
	header('Content-Type: application/x-json');
    echo json_encode($myData);
}


if($todo == "Get_Kids_List"){
	$devtype	= $_POST['devtype'];
	$start	= $_POST['start'];
	$limit	= $_POST['limit'];

	$filterText	= $_POST['filterText'];
	$filterQry = "";
	if($filterText!=""){
		$filterQry = " AND kd.kidname LIKE '$filterText%'";
	}

	$totQry	= mysql_query("SELECT * FROM devices dev
			LEFT outer join kids kd on dev.deviceid = kd.deviceid
			where dev.devicetype='".$devtype."' AND kd.customerid='".$customerid."' $filterQry");
	$totCnt	= mysql_num_rows($totQry);

	if($totCnt == 0){
		$myData[] = array(
			'kidid'  	 => 0,
			'kidname'   => "<span class='tableTextM'>No Vehicle Found</span>"
		);
	}else{
		$vehicleQry = mysql_query("SELECT * FROM devices dev
			LEFT outer join kids kd on kd.deviceid = dev.deviceid
			where dev.devicetype='".$devtype."' AND kd.customerid='".$customerid."' $filterQry LIMIT $start , $limit");
		while($vehicleRes = mysql_fetch_array($vehicleQry )){
			$myData[] = array(
				'kidid'  	 	=> $vehicleRes['kidid'],
				'customerid'  	 	=> $vehicleRes['customerid'],
				'deviceid'  	 	=> $vehicleRes['deviceid'],
				'kidname'   		=> $vehicleRes['kidname'],
				'devicename'   		=> $vehicleRes['devicename'],
				'mobile'   			=> $vehicleRes['mobile'],
				'deviceIMEI'   		=> $vehicleRes['deviceIMEI'],
				'friend1name'   	=> $vehicleRes['friend1name'],
				'friend1phone'   	=> $vehicleRes['friend1phone'],
				'friend2name'   	=> $vehicleRes['friend2name'],
				'friend2phone'   	=> $vehicleRes['friend2phone'],
				// 'realtime'		=> '<img src="./images/view.png" onClick="Show_Gps_Track_Live('.$vehicleRes['deviceid'].')"/>',
				// 'history'		=> '<img src="./images/history.png" onClick="Show_Gps_Track_History('.$vehicleRes['deviceid'].')"/>'
				'realtime'		=> '<img src="./images/view.png" style="cursor:pointer;" title="Track this Kid in Realtime" onClick="Show_Gps_Track_Live('.$vehicleRes['deviceid'].')"/>',
				'history'		=> '<img src="./images/history.png" style="cursor:pointer;" title="View the past history of this Kid\'s movement" onClick="Show_Gps_Track_History('.$vehicleRes['deviceid'].')"/>'
			);
		}
	}
    $myData = array('KIDS' => $myData, 'totalCount' => $totCnt);
	header('Content-Type: application/x-json');
    echo json_encode($myData);
}

if($todo == "Get_Lat_Lon"){
	$tracking_deviceid = $_POST['tracking_deviceid']; 
    	/*$igini_status = mysql_query("SELECT ignition from vehicles WHERE deviceid='".$tracking_deviceid."' ");
	$igini_status_res = mysql_fetch_array($igini_status);*/

	$devQry = mysql_query("SELECT gdt.gpsid, gdt.deviceIMEI, gdt.latitude, gdt.longitude, gdt.posdatetime, gdt.speed, gdt.fuel,
		gdt.ignition,gdt.door,
		gd.devicename, gd.simcardno
		FROM gpsdata_live gdt
		LEFT OUTER JOIN devices gd ON gd.deviceIMEI = gdt.deviceIMEI
		WHERE gd.deviceid='".$tracking_deviceid."' ");
	$devCnt = mysql_num_rows($devQry);
	$devRes = mysql_fetch_array($devQry);
	$gpsid 		= $devRes['gpsid'];
	$latitude 	= $devRes['latitude'];
	$longitude	= $devRes['longitude'];
	$speed 		= $devRes['speed'];
	$voltage	= $devRes['fuel'];
	$ignition	= $devRes['ignition'];
	$door		= $devRes['door'];

	$distance = 0;
	$Qry_latlan  = mysql_query("SELECT * FROM(SELECT gpd.* FROM gpsdata gpd LEFT OUTER JOIN devices dev ON dev.deviceIMEI = gpd.deviceIMEI WHERE dev.deviceid='".$tracking_deviceid."' ORDER BY gpd.gpsid DESC LIMIT 4) as gps_data group by latitude,longitude order by gpsid DESC LIMIT 2");
	$Qry_latlan_cnt = mysql_num_rows($Qry_latlan);
	if($Qry_latlan_cnt == 2){
		while($latlan_Res = mysql_fetch_array($Qry_latlan)){
			$lat_arr[] = array(
			$latlan_Res['latitude']);
			$lon_arr[] = array(
			$latlan_Res['longitude']);
		}
		$distance = LatLng_Distance($lat_arr[0][0], $lon_arr[0][0], $lat_arr[1][0], $lon_arr[1][0], 'MR');
	}	
	

	if($voltage=='00000000' || $voltage==""){
		$actualFuel = 0;
	}else{
		$actualFuel = round(calculateFuel($tracking_deviceid,$voltage),2);
	}

	$devicename = $devRes['devicename'];


	echo "{ success: true, gpsid:'$gpsid', distance:'$distance', latitude:'$latitude', longitude:'$longitude', speed:'$speed', fuel:'$actualFuel', devicename:'$devicename', ignition:'$ignition', door:'$door', latlan_count:'$Qry_latlan_cnt'}";
}

if($todo == "Get_History_Datas"){
	$deviceid 	= $_POST['deviceid'];
	$startdate	= $_POST['startdate'];
	$enddate	= $_POST['enddate'];
	$start		= $_POST['start'];
	$limit		= $_POST['limit'];
	/*echo "SELECT gdt.gpsid, CONVERT_TZ(gdt.posdatetime,'+00:00','+05:30') as gpsdatetime FROM gpsdata gdt
							LEFT OUTER JOIN devices gd ON gd.deviceIMEI = gdt.deviceIMEI
							WHERE gd.deviceid='".$deviceid."' AND posdatetime BETWEEN CONVERT_TZ('$startdate','+05:30','+00:00') AND CONVERT_TZ('$enddate','+05:30','+00:00') GROUP BY latitude,longitude ORDER BY gpsdatetime ASC";*/

	$history_tot_Qry = mysql_query("SELECT gdt.gpsid, CONVERT_TZ(gdt.posdatetime,'+00:00','+05:30') as gpsdatetime FROM gpsdata gdt
							LEFT OUTER JOIN devices gd ON gd.deviceIMEI = gdt.deviceIMEI
							WHERE gd.deviceid='".$deviceid."' AND posdatetime BETWEEN CONVERT_TZ('$startdate','+05:30','+00:00') AND CONVERT_TZ('$enddate','+05:30','+00:00') GROUP BY latitude,longitude ORDER BY gpsdatetime ASC");
	$historyCnt = mysql_num_rows($history_tot_Qry);
	if($historyCnt == 0){
		$myData[] = array(
			'gpsid'  	 => 0,
			'datetime'   => "<span class='tableTextM'>No Records Found</span>"
		);
	}else{
		//OLD Query
		/*
		"SELECT gdt.gpsid, gdt.deviceIMEI, gdt.latitude, gdt.longitude, CONVERT_TZ(gdt.posdatetime,'+00:00','+05:30') as gpsdatetime, gdt.speed, gdt.fuel,
							gdt.ignition, gdt.door FROM gpsdata gdt
							LEFT OUTER JOIN devices gd ON gd.deviceIMEI = gdt.deviceIMEI
							WHERE gd.deviceid='".$deviceid."' AND gdt.speed>1.50 AND posdatetime BETWEEN CONVERT_TZ('$startdate','+05:30','+00:00') AND CONVERT_TZ('$enddate','+05:30','+00:00') GROUP BY latitude,longitude ORDER BY gpsdatetime ASC"
							*/
		$historyQry = mysql_query("SELECT gdt.gpsid, gdt.deviceIMEI, gdt.latitude, gdt.longitude, 
							CONVERT_TZ(gdt.posdatetime,'+00:00','+05:30') as gpsdatetime, gdt.speed, gdt.fuel,
							gdt.ignition, gdt.door FROM gpsdata gdt
							LEFT OUTER JOIN devices gd ON gd.deviceIMEI = gdt.deviceIMEI
							WHERE gd.deviceid='".$deviceid."' AND gdt.posdatetime BETWEEN CONVERT_TZ('$startdate','+05:30','+00:00') 
							AND CONVERT_TZ('$enddate','+05:30','+00:00') GROUP BY latitude,longitude ORDER BY gpsdatetime ASC");

		$prevLatPoint = "";
		$prevLonPoint = "";
		while($historyRes = mysql_fetch_array($historyQry)){
			$latitude	= $historyRes['latitude'];
			$longitude	= $historyRes['longitude'];
			if($prevLatPoint != $latitude && $prevLonPoint != $longitude){
				/**
				 *
				 * for timezone conversion
				 *
				 ***/

				$gpsdatetime = date("d-m-Y H:i:s",strtotime($historyRes['gpsdatetime']));

				$voltage	= $historyRes['fuel'];

				//if($voltage=='00000000'){
				//	$actualFuel = 0;
				//}else{				
				//	/*$fuel = number_format($voltage); //
				//	$fstrlen = strlen($fuel);
				//	$decimalpart = substr($fuel,-2);
				//	$intPart = substr($fuel,0,$fstrlen-2);
				//	$actualVoltage = $intPart.".".$decimalpart;*/
				//	
				//	if(substr($voltage,0,4)=='0000')
				//		$voltage = substr($voltage,4,4);
				//    else
				//		$voltage = substr($voltage,0,4);
				//	
				//	
				//	$fuel 		= $voltage; //number_format($voltage);
				//	$fstrlen 	= strlen($fuel);
				//	$decimalpart = substr($fuel,2,2);
				//	$intPart = substr($fuel,0,2);
				//	$actualVoltage = $intPart.".".$decimalpart;
				//
				//	$actualFuel = round(calculateFuel($deviceid,$actualVoltage),2);
				//}
				if($voltage=='00000000' || $voltage==""){
					$actualFuel = 0;
				}else{				
					/*$fuel = number_format($voltage); //
					$fstrlen = strlen($fuel);
					$decimalpart = substr($fuel,-2);
					$intPart = substr($fuel,0,$fstrlen-2);
					$actualVoltage = $intPart.".".$decimalpart;*/
					
				//	if(substr($voltage,0,4)=='0000')
				//		$voltage = substr($voltage,4,4);
				//    else
				//		$voltage = substr($voltage,0,4);
				//	
				//	
				//	$fuel 		= $voltage; //number_format($voltage);
				//	$fstrlen 	= strlen($fuel);
				//	$decimalpart = substr($fuel,2,2);
				//	$intPart = substr($fuel,0,2);
				//	$actualVoltage = $intPart.".".$decimalpart;

					$actualFuel = round(calculateFuel($deviceid,$voltage),2);
				}
				
				$distance = 0;
				if($prevLatPoint!="" && $prevLonPoint!=""){
					$distance = LatLng_Distance($prevLatPoint, $prevLonPoint, $latitude, $longitude, 'K');
					$distance += $prevDistance;

					$distance	= round($distance, 2);
				}



				$myData[] = array(
					'gpsid'  	=> $historyRes['gpsid'],
					'latitude'	=> $latitude,
					'longitude'	=> $longitude,
					'speed'	=> $historyRes['speed'],
					'fuel'	=> $actualFuel,
					'datetime' => $gpsdatetime,
					'distance' => $distance." Kms",
					'ignition'	=> $historyRes['ignition'],
					'door'		=> $historyRes['door']
				);

				$prevDistance = $distance;
			}

			$prevLatPoint = $historyRes['latitude'];
			$prevLonPoint = $historyRes['longitude'];
		}
	}
	$myData = array('HISTORY' => $myData, 'totalCount' => $historyCnt);
	header('Content-Type: application/x-json');
    echo json_encode($myData);
}

if($todo == "Get_LanLon_Address"){
	$latitude	= $_POST['latitude'];
	$longitude	= $_POST['longitude'];
	echo $geocodeJson = do_post_request("http://maps.googleapis.com/maps/api/geocode/json?latlng=$latitude,$longitude&sensor=true",'','');
	//$geocodeJsonArr = json_decode($geocodeJson);
	//echo $geocodeJson[0]['formatted_address'];
	//echo $geocodeJsonArr->results[0]->formatted_address;
}

?>
