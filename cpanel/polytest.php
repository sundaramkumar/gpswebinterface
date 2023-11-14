<?php
/**
  From: http://www.daniweb.com/web-development/php/threads/366489
  Also see http://en.wikipedia.org/wiki/Point_in_polygon
*/
$vertices_x = array(13.050047, 13.048417, 13.045428, 13.046201, 13.049985); // x-coordinates of the vertices of the polygon
$vertices_y = array(80.240497, 80.245668, 80.240411, 80.239467, 80.240433); // y-coordinates of the vertices of the polygon
$points_polygon = count($vertices_x); // number vertices
$longitude_x = 13.048417; // x-coordinate of the point to test
$latitude_y = 80.245368; // y-coordinate of the point to test
//// For testing.  This point lies inside the test polygon.
// $longitude_x = 37.62850;
// $latitude_y = -77.4499;

if (is_in_polygon($points_polygon, $vertices_x, $vertices_y, $longitude_x, $latitude_y)){
  echo "Is in polygon!";
}
else echo "Is not in polygon";


function is_in_polygon($points_polygon, $vertices_x, $vertices_y, $longitude_x, $latitude_y)
{
  $i = $j = $c = 0;
  for ($i = 0, $j = $points_polygon-1 ; $i < $points_polygon; $j = $i++) {
    if ( (($vertices_y[$i] > $latitude_y != ($vertices_y[$j] > $latitude_y)) &&
    ($longitude_x < ($vertices_x[$j] - $vertices_x[$i]) * ($latitude_y - $vertices_y[$i]) / ($vertices_y[$j] - $vertices_y[$i]) + $vertices_x[$i]) ) ) 
        $c = !$c;
  }
  return $c;
}
?>