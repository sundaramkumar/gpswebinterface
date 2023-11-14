<?php
/****************************************
*
* cpanel.php
*
******************************************/
$pagetitle		= "Vehicle Tracking System";
$pageloadmsg	= "Vehicle Tracking System Control Panel";
$projectheading	= "Tracking System Admin Panel";

session_start();
$_SESSION['reportsTitle'] = "Vehicle Tracking System";

//print_r($_SESSION);
//error_reporting(E_ALL);
//ini_set('display_errors','On');

if( (!isset($_SESSION['userid']) || !isset($_SESSION['username']) || !isset($_SESSION['usertype']) ) && $_SESSION['usertype']!='SA' ){
	//echo "Not authenticated.....";
	header("location: ./index.php");
	exit;
}

require_once("./config/dbconn.php");

?>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title><?=$pagetitle;?></title>
<link rel="stylesheet" type="text/css" href="./extjs4.7/resources/css/ext-all.css" />
<!--link rel="stylesheet" type="text/css" href="./extjs4.7/resources/css/ext-all-slate.css" id="theme"-->
<link rel="stylesheet" type="text/css" href="./css/styles.css" />
<style>

   /* for word wrapping inside grid cells */
	td.x-grid-cell {
        overflow: hidden;
    }
  	td.x-grid-cell div.x-grid-cell-inner {
        white-space: normal !important;
    }


</style>
<link rel="SHORTCUT ICON" href="./favicon.ico">

<script type="text/javascript" src="./extjs4.7/ext-all.js"></script>

<script type="text/javascript">
var username = "<?=$_SESSION['exusername'];?>";

function setUsername(){
	Ext.getCmp('statusMsg').setTitle('Logged in as '+"<font color='#f30'><B><?=$_SESSION['membername'];?></B></font>");
	gpsCook.set('loadpage',"<?=$_SESSION['loadpage'];?>");
	loadSessionPage();
}

</script>
<script type="text/javascript" src="./scripts/innovtrack.js"></script>
<script type="text/javascript" src="./scripts/customers.js"></script>
<script type="text/javascript" src="./scripts/vehicle.js"></script>
<script type="text/javascript" src="./scripts/kids.js"></script>
<script type="text/javascript" src="./scripts/layout.js"></script>
<script type="text/javascript" src="./scripts/devices.js"></script>
<script type="text/javascript" src="./scripts/manage_device.js"></script>
<script type="text/javascript" src="./scripts/menu.js"></script>
<script type="text/javascript" src="./scripts/technician.js"></script>
<script type="text/javascript" src="./scripts/dashboard.js"></script>
<script type="text/javascript" src="./scripts/geo.js"></script>
<script type="text/javascript" src="./scripts/users.js"></script>
<script type="text/javascript" src="./plugins/RowExpander.js"></script>
<script type="text/javascript" src="./plugins/SearchField.js"></script>
<!--script src="http://maps.google.com/maps?file=api&amp;v=2&amp;sensor=false&amp;key=ABQIAAAAhM3jxNkxvSWAKCVrZEVwNhR5KEzaqTn_Ur61x3JdEe46YoG8IhRx5d5dXYwKHi9vZf3AHalBvLRO0Q" type="text/javascript"></script-->
<!--script src="http://maps.google.com/maps?file=api&amp;v=2&amp;sensor=false&amp;key=AIzaSyCtiC-qe7eVo66mhdAMNosaIJ-z-tYVt2I" type="text/javascript"></script-->
<!--script type="text/javascript" src="./plugins/GMapPanel.js"></script-->


<!--
<link rel="stylesheet" type="text/css" href="plugins/portal.css">
<script type="text/javascript" src="plugins/classes.js"></script>
-->



</head>
<body>
<div id="loading">
    <div class="loading-indicator"><img src="./extjs4.7/resources/themes/images/default/shared/large-loading.gif" width="32" height="32" style="margin-right:8px;float:left;vertical-align:top;"/><?=$pageloadmsg;?><br /><span id="loading-msg">Loading Control Panel, Please wait...</span></div>
</div>
<div id="north">
    <table width="100%" cellspacing="0" cellpadding="0" border="0">
      <tr>
        <td valign="top" class="pageHeading" style="padding-top:5px;font-wight:bold;vertical-align: middle"><b><?=$projectheading;?></b></td>
        <!--td align="right" class="tableTextW">&#160;&#160;[&#160;<a href="#" onClick="confLogout()"><span class="tableTextW"><U>Logout</U></span></a>&#160;]&#160;</td-->
		<td align="right" class="tableTextW" valign="middle"><img src="./images/help.png"/>&#160;&#160;<a href="#" onClick="confLogout()"><img src="./images/logout.png"/></a>&#160;&#160;</td>
      </tr>
    </table>
</div>
</body>
</html>