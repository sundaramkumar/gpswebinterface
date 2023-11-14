<?php
session_start();
include_once("../config/dbconn.php");

$todo = $_POST['todo'];
if($todo == "loadpage"){
	$destroypage	= $_POST['destroypage'];
	$_SESSION['loadpage']	= str_replace($destroypage, "", $_SESSION['loadpage']);
	echo $_SESSION['loadpage'];
}

?>