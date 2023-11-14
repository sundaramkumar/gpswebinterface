<?
//$t = strtotime("May 12, 2012 13:21:28 UTC");
$utc_date = DateTime::createFromFormat(
                'Y-m-d G:i:s', 
                '2012-05-12 10:32:19', 
                new DateTimeZone('UTC')
);

$nyc_date = $utc_date;
$nyc_date->setTimeZone(new DateTimeZone('GST'));

echo $nyc_date->format('Y-m-d g:i A'); // output: 2011-04-26 10:45 PM



?>