<?php
function getTeamMemberName($memberid){
	$memberQry = mysql_query('SELECT membername FROM inhouseteam WHERE memberid = "'.$memberid.'"');
	$memberRes = mysql_fetch_array($memberQry);
	return $memberRes['membername'];
}

function getCustomerName($customerid){
	$memberQry = mysql_query('SELECT customername FROM customers WHERE customerid = "'.$customerid.'"');
	$memberRes = mysql_fetch_array($memberQry);
	return $memberRes['customername'];
}

function getFuelCapacity($deviceid){
	$memberQry = mysql_query('SELECT fuel_capacity FROM vehicles WHERE deviceid = "'.$deviceid.'"');
	$memberRes = mysql_fetch_array($memberQry);
	return $memberRes['fuel_capacity'];
}

function getFuelVoltageDetails($deviceid){
	$memberQry = mysql_query('SELECT minvoltage,fullvoltage FROM vehicles WHERE deviceid = "'.$deviceid.'"');
	$memberRes = mysql_fetch_array($memberQry);
	return $memberRes['minvoltage'].'|*|'.$memberRes['fullvoltage'];
}

function calculateFuel($deviceid,$voltage){
	$fuelLevel = 0.0;
	$perUnit = 0.0;
	$capacity = getFuelCapacity($deviceid);
	
	$voltageDetails = getFuelVoltageDetails($deviceid);
	$voltageDetailsAry = explode('|*|',$voltageDetails);
	$minVoltage = $voltageDetailsAry[0];
	$fullVoltage = $voltageDetailsAry[1];
	
	if(substr($voltage,0,4)=='0000')
		$voltage = substr($voltage,4,4);
	else
		$voltage = substr($voltage,0,4);
	
	$fuel 		= $voltage; //number_format($voltage);
	$fstrlen 	= strlen($fuel);
	$decimalpart = substr($fuel,2,2);
	$intPart = substr($fuel,0,2);
	$actualVoltage = $intPart.".".$decimalpart;
		
	$voltage = number_format($actualVoltage,1);
	//$minVoltage = 0; //4.8
	//$fullVoltage = 7.5; //0.44
	
	//if($deviceid==1){
	//	$minVoltage = 4.8; //4.8
	//	$fullVoltage = 0.44; //0.44
	//	//$voltage=1.1;
	//	if ($voltage < $fullVoltage)
	//		$voltage = $fullVoltage;
	//		
	//	if ($voltage > $minVoltage)
	//		$voltage = $minVoltage;		
	//}

	if($minVoltage > $fullVoltage){
		
		//$minVoltage = 4.8; //4.8
		//$fullVoltage = 0.44; //0.44
		//$voltage=1.1;
		if ($voltage < $fullVoltage)
			$voltage = $fullVoltage;
			
		if ($voltage > $minVoltage)
			$voltage = $minVoltage;
		
		$xCount = 0;
		for($i=$fullVoltage;$i<=$minVoltage;$i+=0.1){
				$xCount++;
		}
		//	file_put_contents("/tmp/test1.txt",$xCount);
		$ycount = 0;
		for($x=$fullVoltage;$x<=$voltage;$x+=0.1){
				$ycount++;
		}
		//	file_put_contents("/tmp/test.txt",$yCount);
		$perUnit = 0.86; //0.86 Litres
		$fuelLevel = $perUnit * $ycount;
		
		if($fuelLevel<1)
				$fuelLevel=0;
		if($fuelLevel>$capacity)
				$fuelLevel = $capacity;
	}else{
		////$fullVoltage = 12.0;
		//if($deviceid==5)
		//	$fullVoltage=4.4;
			
		//else
		//	$fullVoltage=7.5;
			
		$perUnit  = $capacity/$fullVoltage;
	
		$fuelLevel = $perUnit * $voltage;
	
		if($fuelLevel>$capacity)
			$fuelLevel = $capacity;		
	}


	return $fuelLevel;
	
}

function LatLng_Distance($lat1, $lng1, $lat2, $lng2, $unit){
	$pi80 = M_PI / 180;
	$lat1 *= $pi80;
	$lng1 *= $pi80;
	$lat2 *= $pi80;
	$lng2 *= $pi80;

	$r = 6372.797; // mean radius of Earth in km
	$dlat = $lat2 - $lat1;
	$dlng = $lng2 - $lng1;
	$a = sin($dlat / 2) * sin($dlat / 2) + cos($lat1) * cos($lat2) * sin($dlng / 2) * sin($dlng / 2);
	$c = 2 * atan2(sqrt($a), sqrt(1 - $a));
	$km = $r * $c;
	
	$unit = strtoupper($unit);
	if ($unit == "M") { // Miles
		return round(($km * 0.621371192),2);
	} else if ($unit == "MR") { // Meeters
		return round($km * 1000,2);
	}else { // Kilomeeters
		return round($km,2);
	}
}

function getNearest_LatLng_Distance($routepath, $latitude, $longitude, $unit){
	$nearestVal = 0;
	$routepath = json_decode($routepath);
	$routepathSplt = explode("),(",$routepath[0]);
	foreach($routepathSplt as $ind => $latlng){
		$latlng = str_replace("(","",$latlng);
		$latlng = str_replace(")","",$latlng);
		$latlngSplt = explode(",",$latlng);
		$routeLat = $latlngSplt[0];
		$routeLng = $latlngSplt[1];
		//echo $latlng."<br>";
		//$latitude  = 13.0681;
		//$longitude = 80.1913;
		$distance = round(LatLng_Distance($routeLat, $routeLng, $latitude, $longitude, $unit));
		//echo "nearestVal : ".$nearestVal."<br>";
		//echo $distance."<br>";
		/* if($nearestVal == ""){
			$nearestVal = $distance;
		} */
		if($distance < $nearestVal){
			$nearestVal = $distance;
		}
	}
	return $nearestVal;
}

function get_latlan_address($latitude, $longitude){
	$geocodeJson = do_post_request("http://maps.googleapis.com/maps/api/geocode/json?latlng=$latitude,$longitude&sensor=true",'','');
	$geocodeJsonArr = json_decode($geocodeJson);
	return $address = $geocodeJsonArr->results[0]->formatted_address;
}

function is_in_polygon($points_polygon, $vertices_x, $vertices_y, $longitude_x, $latitude_y){
  $i = $j = $c = 0;
  for ($i = 0, $j = $points_polygon-1 ; $i < $points_polygon; $j = $i++) {
		if ( (($vertices_y[$i] > $latitude_y != ($vertices_y[$j] > $latitude_y)) &&
			($longitude_x < ($vertices_x[$j] - $vertices_x[$i]) * ($latitude_y - $vertices_y[$i]) / ($vertices_y[$j] - $vertices_y[$i]) + $vertices_x[$i]) ) ) 
			$c = !$c;
  }
  return $c;
}

function timeDiff($date1, $date2){
	$idle = "";
	$time	= strtotime($date1) - strtotime($date2);
	if($time >= 3600){
		$timeDiff = floor($time/3600);
		if(strlen($timeDiff)==1)
			$timeDiff = "0".$timeDiff;
		$idle .= $timeDiff. ":";
		$time = ($time%3600);
	}else{
		$idle .= "00:";
	}
	if($time >= 60){
		$timeDiff = floor($time/60);
		if(strlen($timeDiff)==1)
			$timeDiff = "0".$timeDiff;
		$idle .= $timeDiff. ":";
		$time = ($time%60);
	}else{
		$idle .= "00:";
	}
	$timeDiff = floor($time);
	if($timeDiff=="")
		$timeDiff = "00";
	if(strlen($timeDiff)==1)
		$timeDiff = "0".$timeDiff;
	$idle .= $timeDiff. "";
	return $idle;
}

function do_post_request($url, $data, $optional_headers = null){
	$params = array('http' => array(
			  'method' => 'GET',
			  'content' => $data
			));
	if ($optional_headers !== null) {
		$params['http']['header'] = $optional_headers;
	}
	$ctx = stream_context_create($params);
	$fp = @fopen($url, 'rb', false, $ctx);
	if (!$fp) {
		throw new Exception("Problem with $url, $php_errormsg");
	}
	$response = @stream_get_contents($fp);
	if ($response === false) {
		throw new Exception("Problem reading data from $url, $php_errormsg");
	}
	return $response;
}

function sendSMS($cellno, $smsStr){
	$path  = "/var/spool/sms/outgoing/";
	$filename = $cellno.mt_rand();
	$contents = "To: ".$cellno."\n\n".$smsStr;
	$fh = fopen($path.$filename, 'w+');
	fwrite($fh,$contents);
	fclose($fh);
}
?>
