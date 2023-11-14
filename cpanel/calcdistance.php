<?php
 
$earth_radius = 3960.00; # in miles
$lat_1 = "13.048626476686385";
$lon_1 = "80.24013876914978";
$lat_2 = "13.04800981944385";
$lon_2 = "80.24290680885315";
$delta_lat = $lat_2 - $lat_1 ;
$delta_lon = $lon_2 - $lon_1 ;
 
# Spherical Law of Cosines
function distance_slc($lat1, $lon1, $lat2, $lon2) {
  global $earth_radius;
  global $delta_lat;
  global $delta_lon;
  $distance  = sin(deg2rad($lat1)) * sin(deg2rad($lat2)) + cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * cos(deg2rad($delta_lon)) ;
  $distance  = acos($distance);
  $distance  = rad2deg($distance);
  $distance  = $distance * 60 * 1.1515;
  $distance  = round($distance, 4);
 
  return $distance * 1.609;  //convert the miles to metres 
}
 
$slc_distance = distance_slc($lat_1, $lon_1, $lat_2, $lon_2);
echo round($slc_distance,2) . " metres\n";



function getDistance($lat1, $lng1, $lat2, $lng2, $miles = false)
{

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




	return ($miles ? ($km * 0.621371192) : $km);
}
echo $slc_distance = getDistance($lat_1, $lon_1, $lat_2, $lon_2);
echo round($slc_distance,2).  "\n";

?>
