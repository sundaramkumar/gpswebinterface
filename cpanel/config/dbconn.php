<?php
$conn = mysql_connect("localhost","root","secRet123");
if(!$conn)
    die('Could not connect: ' . mysql_error());

$db_selected = mysql_select_db("innovtrack",$conn);
if (!$db_selected)
    die ('Cannot use Customers Database : ' . mysql_error());

?>
