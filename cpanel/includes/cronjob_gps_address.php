<?php
include_once("../config/dbconn.php");

$gpsQry = mysql_query("SELECT * FROM gpsdata WHERE address='' ORDER BY posdatetime ASC");
$gpsCnt = mysql_num_rows($gpsQry);
if($gpsCnt > 0){
	echo $gpsCnt;
	echo "\n";
	$i=0;
	while($gpsRes = mysql_fetch_array($gpsQry)){
		$gpsid		= $gpsRes['gpsid'];
		$latitude 	= $gpsRes['latitude'];
		$longitude 	= $gpsRes['longitude'];
		$geocodeJson = do_post_request("http://maps.googleapis.com/maps/api/geocode/json?latlng=$latitude,$longitude&sensor=true",'','');
		$geocodeJsonArr = json_decode($geocodeJson);
		$address = $geocodeJsonArr->results[0]->formatted_address;
		mysql_query("UPDATE gpsdat SET address='".$address."' WHERE gpsid='".$gpsid."'");
		$i++;
		echo $gpsid." - ".$gpsCnt."/".$i."\n";
		
	}
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
?>