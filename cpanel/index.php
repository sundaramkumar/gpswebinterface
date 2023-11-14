<?php

/****************************************
*
* login.php
*
******************************************/
//<div style="background-image: url(images/logo.png); padding-top:100px; position:relative; margin:605px 0 0 1080px;  background-repeat:no-repeat;"></div></a>
//Vehicle Tracking System
$pagetitle		= ""; //"Vehicle Tracking System";
$pageloadmsg	= ""; //"Vehicle Tracking System Control Panel";
$projectheading	= ""; //"Vehicle Tracking System";




?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
<head>
<title><?php echo $pagetitle;?></title>
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
	
	#watermark {
		color: #afdfdf;
		font-size: 60pt;
		-webkit-transform: rotate(-45deg);
		-moz-transform: rotate(-45deg);
		position: absolute;
		margin: 0;
		z-index: -1;
		left:158px;
		top:575px;
	}
	
	#watermark1 {
		color: #ffffff;
		font-size: 60pt;
		font-familiy: Impact,Charcoal,sans-serif;
		-webkit-transform: rotate(-45deg);
		-moz-transform: rotate(-45deg);
		position: absolute;
		margin: 0;
		z-index: -1;
		left:398px;
		top:283px;
	}

	#slideshow {
		position:relative;
		height:350px;
	}

	#slideshow IMG {
		position:absolute;
		top:0;
		left:0;
		z-index:8;
		opacity:0.0;
	}

	#slideshow IMG.active {
		z-index:10;
		opacity:1.0;
	}

	#slideshow IMG.last-active {
		z-index:9;
	}

</style>
</head>

<body background="images/login_bg.png">
<!--div id="watermark">
<p>Innovmox</p>
</div>
<div id="watermark1">
<p> Technologies </p>
</div >
-->
<!--div id="slideshow">
    <img id="imagid" src="images/Login-page-BG-2.png" alt="Slideshow Image 1" class="active" /><!--onload="imag();"/-->
    <!--img src="images/Login-page-BG-3.png" style="width:1280px;height:905px;" alt="Slideshow Image 2" />
    <img src="images/Login-page-BG-Map03.png" style="width:1280px;height:905px;" alt="Slideshow Image 3" />
    <img src="images/Login-page-BG-PAD.png" style="width:1280px;height:905px;" alt="Slideshow Image 4" />
</div--> 
<div>
<img style="margin-top:100px;margin-left:150px;" src="images/images/receptionist.png"><br>
<img style="margin-top:50px;margin-left:150px;" src="images/images/message.png"><br>
<img style="margin-top:50px;margin-left:150px;" src="images/images/report.png"><br>
<img style="margin-top:50px;margin-left:150px;" src="images/images/satellite.png">

</div>
<div style="margin-top:-650px;margin-left:300px; font-size:22px;font-weight:bold;">24/7 Support</div>
<div style="margin-top:-10px;margin-left:300px;"><br>Round the clock chat and voice support.</div>
<div style="margin-top:130px;margin-left:300px;font-size:22px;font-weight:bold;">Instant Alert</div>
<div style="margin-top:-10px;margin-left:300px;"><br>Customized alerts for required  parameters.</div>
<div style="margin-top:130px;margin-left:300px;font-size:22px;font-weight:bold;">Online Report</div>
<div style="margin-top:-10px;margin-left:300px;"><br>Tracking movements of assets.</div>
<div style="margin-top:150px;margin-left:300px;font-size:22px;font-weight:bold;">Live Tracking</div>
<div style="margin-top:-10px;margin-left:300px;"><br>Generate customized reports online.</div>

<div id="loading">
    <div class="loading-indicator"><img src="./extjs4.1/resources/themes/images/default/shared/large-loading.gif" width="32" height="32" style="margin-right:8px;float:left;vertical-align:top;"/><?=$pageloadmsg;?><br /><span id="loading-msg">Loading, Control Panel Please wait...</span></div>
</div>
<link rel="stylesheet" type="text/css" href="./extjs4.7/resources/css/ext-all.css" />
<script type="text/javascript" src="./extjs4.7/ext-all.js"></script>

<link rel="stylesheet" type="text/css" href="./css/styles.css" />
<?php
$cook_val = $_COOKIE["cook"];
$cook_arr = explode(',',$cook_val);
if($cook_arr[0]!="" && $cook_arr[1]!="")
{
	header("location: ./includes/login_ajx.php");
}
else{
?>
<script type="text/javascript" src="scripts/login.js"></script>
<?php
}
?>
</body>
</html>