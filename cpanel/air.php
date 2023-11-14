<?php

/****************************************
*
* login.php
*
******************************************/
//Vehicle Tracking System
$pagetitle		= ""; //"Vehicle Tracking System";
$pageloadmsg	= ""; //"Vehicle Tracking System Control Panel";
$projectheading	= ""; //"Vehicle Tracking System";

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
<head>
<title><?=$pagetitle;?></title>

<style type="text/css">

    #loading{
		position:absolute;
		left:40%;
		top:40%;
		z-index:20001;
		height:auto;
		border:1px solid #ccc;
		color:#225588;
	}

	#loading a {
		color:#225588;
	}

	#loading .loading-indicator{
		background:#DFE8F6;
		color:#225588;
		font:bold 13px tahoma,arial,helvetica;
		padding:10px;
		margin:0;
		height:auto;
		width:350px;
	}

	#loading-msg {
		font: normal 10px arial,tahoma,sans-serif;
		color:#444;
	}

</style>
</head>

<body>
<div id="loading">
    <div class="loading-indicator"><img src="./extjs4.1/resources/themes/images/default/shared/large-loading.gif" width="32" height="32" style="margin-right:8px;float:left;vertical-align:top;"/><?=$pageloadmsg;?><br /><span id="loading-msg">Loading, Control Panel Please wait...</span></div>
</div>
<link rel="stylesheet" type="text/css" href="./extjs4.7/resources/css/ext-all.css" />
<script type="text/javascript" src="./extjs4.7/ext-all.js"></script>

<link rel="stylesheet" type="text/css" href="./css/styles.css" />
<script type="text/javascript" src="scripts/login.js"></script>
</body>
</html>