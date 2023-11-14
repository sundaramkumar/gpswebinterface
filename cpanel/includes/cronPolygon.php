<?php
include_once("../config/dbconn.php");
include_once("./functions.php");

$cellno = "919003027717";

$devQry = mysql_query("SELECT gd.deviceid, gd.devicename, gd.deviceIMEI, gv.vehiclename, gv.regnno, 
						gpl.latitude, gpl.longitude, gpl.speed, gpl.fuel, gv.speedlimit, gv.fuellimit, gv.routelimit,
						gv.fenceid, gf.polyCoordsX, gf.polyCoordsY,gv.routeid,gr.routepath,
						CONVERT_TZ(gpl.posdatetime,'+00:00','+05:30') as gpsdatetime,
						gv.vehicleid, gvs.lock_unlock, gvs.lock_unlock_cnt, gvs.lock_lat_lng,
						gvs.geofence_cnt, gvs.georoute_cnt
						FROM gpsdata_live gpl
						LEFT OUTER JOIN devices gd ON gd.deviceIMEI = gpl.deviceIMEI
						LEFT OUTER JOIN vehicles gv ON gv.deviceid = gd.deviceid
						LEFT OUTER JOIN geofence gf ON gf.fenceid = gv.fenceid
						LEFT OUTER JOIN georoute gr ON gr.routeid = gv.routeid
						LEFT OUTER JOIN vehicle_sms gvs ON gvs.vehicleid = gv.vehicleid
						ORDER BY gd.customerid");
$devCnt = mysql_num_rows($devQry);
if($devCnt>0){
	$strHtml = '<table width="80%" cellspacing="1" cellpadding="1"><tr><td style="background-color:#c7bdbd;font-size:12px">';
	$strHtml .= '<table width="100%" cellspacing="1" cellpadding="1">';
	$strHtml .= '<tr style="font-weight:bold;background-color:#f5ebeb">';
	$strHtml .= '<td>Vehicle</td>';
	$strHtml .= '<td>Device</td>';
	$strHtml .= '<td>Reg.No</td>';
	$strHtml .= '<td>SpeedLimit</td>';
	$strHtml .= '<td>Curr.Speed</td>';
	$strHtml .= '<td>FuelLimit</td>';
	$strHtml .= '<td>Curr.Fuel</td>';
	$strHtml .= '<td>RouteLimit</td>';
	$strHtml .= '<td>RouteDistance</td>';
	$strHtml .= '<td>Lock</td>';
	$strHtml .= '<td>LatLng Distance(M)</td>';
	$strHtml .= '</tr>';
	
	while($devRes = mysql_fetch_array($devQry)){
		$vehicleid		= $devRes['vehicleid'];
		$deviceid 		= $devRes['deviceid'];
		$devicename 	= $devRes['devicename'];
		$deviceIMEI 	= $devRes['deviceIMEI'];
		$vehiclename 	= $devRes['vehiclename'];
		$regnno 		= $devRes['regnno'];
		$latitude 		= $devRes['latitude'];
		$longitude 		= $devRes['longitude'];
		$speed 			= $devRes['speed'];
		$voltage		= $devRes['fuel'];
		$fuellimit		= $devRes['fuellimit'];
		$speedlimit 	= $devRes['speedlimit'];
		$fenceid 		= $devRes['fenceid'];
		$polyCoordsX	= $devRes['polyCoordsX'];
		$polyCoordsY 	= $devRes['polyCoordsY'];
		
		$routelimit 	= $devRes['routelimit'];
		$routeid 		= $devRes['routeid'];
		$routepath  	= $devRes['routepath']; 
		
		$gpsdatetime	= $devRes['gpsdatetime'];
		
		$lock_unlock 	= $devRes['lock_unlock'];
		$lock_unlock_cnt= $devRes['lock_unlock_cnt'];
		$lock_lat_lng 	= $devRes['lock_lat_lng'];
		
		$geofence_cnt	= $devRes['geofence_cnt'];
		$georoute_cnt	= $devRes['georoute_cnt'];
		
		if($voltage=='00000000' || $voltage==""){
			$actualFuel = 0;
		}else{
			$actualFuel = round(calculateFuel($deviceid,$voltage),2);
		}
		
		
		//Check Whether the Geo Fence Limit is Assign or Not
		//Check Whether the Current Lat Lang values inside the Geo Fence Limit or not
		if($fenceid>0){
			$polyCoordsX = json_decode($polyCoordsX);
			$polyCoordsY = json_decode($polyCoordsY);
			//print_r($polyCoordsX);
			//print_r($polyCoordsY);
			$points_polygon = count($polyCoordsX);
			if(is_in_polygon($points_polygon, $polyCoordsX, $polyCoordsY, $latitude, $longitude)){
				//echo "Is in polygon!<br>";
			} else {
				//echo "Is not in polygon<br>";
				if($geofence_cnt<=3){
					$smsStr	= "Your Vehicle [ $regnno ] is Moving out of Geo Fence Limit";
					sendSMS($cellno, $smsStr);
					$lockRes = mysql_query("UPDATE vehicle_sms SET geofence_cnt=geofence_cnt+1 WHERE vehicleid='".$vehicleid."'");
				}
			}
		}
		
		
		//Check Whether the Route Path is Assign or Not
		//Check Whether the Current Lat Lang values inside the Rooute Path or not
		$distance = 0;
		if($routeid>0){
			if($routepath[0]!=""){				
				$distance = getNearest_LatLng_Distance($routepath, $latitude, $longitude, 'K');
				//echo "<br><b>Nearest Point KM :".$distance;
				$distance = round(getNearest_LatLng_Distance($routepath, $latitude, $longitude, 'MR'));				
				//echo "<br><b>Nearest Point Meeters:".$distance;
				if($distance>10 && $georoute_cnt<=3){
					$smsStr	= "Your Vehicle [ $regnno ] is going on Wrong Route";
					sendSMS($cellno, $smsStr);
					$lockRes = mysql_query("UPDATE vehicle_sms SET georoute_cnt=georoute_cnt+1 WHERE vehicleid='".$vehicleid."'");
				}
			}
		}
		
		$lock_latlng_dis = 0;
		if($lock_unlock == "LOCK" && $lock_unlock_cnt<=3){
			$lock_lat_lng 	= explode(",",$lock_lat_lng);
			$lock_lat 		= $lock_lat_lng[0];
			$lock_lng 		= $lock_lat_lng[1];
			$lock_latlng_dis = round(LatLng_Distance($latitude, $longitude, $lock_lat, $lock_lng, 'MR'));
			if($lock_latlng_dis>10){
				$smsStr	= "Your Vehicle [ $regnno ] is Moving out of Locked Place";
				sendSMS($cellno, $smsStr);
				$lockRes = mysql_query("UPDATE vehicle_sms SET lock_unlock_cnt=lock_unlock_cnt+1 WHERE vehicleid='".$vehicleid."'");
			}
		}
		
		$strHtml .= '<tr style="background-color:#f5ebeb">';
		$strHtml .= '<td>'.$vehiclename.'</td>';
		$strHtml .= '<td>'.$devicename.'</td>';
		$strHtml .= '<td>'.$regnno.'</td>';
		$strHtml .= '<td>'.$speedlimit.'</td>';
		$strHtml .= '<td>'.$speed.'</td>';
		$strHtml .= '<td>'.$fuellimit.'</td>';
		$strHtml .= '<td>'.$actualFuel.'</td>';
		$strHtml .= '<td>'.$routelimit.'</td>';
		$strHtml .= '<td>'.$distance.' Meters</td>';
		$strHtml .= '<td>'.$lock_unlock.'</td>';
		$strHtml .= '<td>'.$lock_latlng_dis.' Meters</td>';
		$strHtml .= '</tr>';
	}
	$strHtml .= '</table></td></tr></table>';
	//echo $strHtml;
}
/**
  From: http://www.daniweb.com/web-development/php/threads/366489
  Also see http://en.wikipedia.org/wiki/Point_in_polygon
*/
/* $vertices_x = array(13.050047, 13.048417, 13.045428, 13.046201, 13.049985); // x-coordinates of the vertices of the polygon
$vertices_y = array(80.240497, 80.245668, 80.240411, 80.239467, 80.240433); // y-coordinates of the vertices of the polygon
$points_polygon = count($vertices_x); // number vertices
$longitude_x = 13.048417; // x-coordinate of the point to test
$latitude_y = 80.245368; // y-coordinate of the point to test


if(is_in_polygon($points_polygon, $vertices_x, $vertices_y, $longitude_x, $latitude_y)){
	echo "Is in polygon!";
} else {
	echo "Is not in polygon";
} */



?>