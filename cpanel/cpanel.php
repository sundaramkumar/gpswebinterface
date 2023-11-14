<?php
/****************************************
*
* cpanel.php
*
******************************************/
$pagetitle		= "Tracking System";
$pageloadmsg	= "Tracking System User Control Panel";
$projectheading	= "&#160;Tracking System - User Control Panel";

session_start();
$_SESSION['reportsTitle'] = "InnovTrack - Tracking System";

//print_r($_SESSION);
//exit;
//error_reporting(E_ALL);
//ini_set('display_errors','On');

if( (!isset($_SESSION['userid']) || !isset($_SESSION['username']) || !isset($_SESSION['usertype']) ) && ($_SESSION['usertype']!='U' || $_SESSION['usertype']!='A' ) ){
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
<link rel="stylesheet" type="text/css" href="./extjs4.1/resources/css/ext-all.css" />
<!--link rel="stylesheet" type="text/css" href="./extjs4.7/resources/css/ext-all-slate.css" id="theme"-->
<link rel="stylesheet" type="text/css" href="./css/styles.css" />
<link rel="stylesheet" type="text/css" href="./plugins/css/redInfoWindow.css" />
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

<script type="text/javascript" src="./extjs4.1/ext-all.js"></script>

<script type="text/javascript">
var username = "<?=$_SESSION['exusername'];?>";

function setUsername(){
	Ext.getCmp('statusMsg').setTitle('Logged in as '+"<font color='#f30'><B><?=$_SESSION['username'];?></B></font>");
	gpsCook.set('loadpage',"<?=$_SESSION['loadpage'];?>");
	loadSessionPage();
}

</script>

<script type="text/javascript" src="./plugins/SearchField.js"></script>
<script type="text/javascript" src="./plugins/RowExpander.js"></script>
<script type="text/javascript" src="./plugins/GMapPanel.js"></script>
<script type="text/javascript" src="./plugins/datetime.js"></script>
<script type="text/javascript" src="./plugins/GroupingSummary.js"></script>

<script type="text/javascript" src="./plugins/rgraph/RGraph.common.core.js"></script>
<script type="text/javascript" src="./plugins/rgraph/RGraph.common.effects.js"></script>
<script type="text/javascript" src="./plugins/rgraph/RGraph.common.dynamic.js"></script>
<script type="text/javascript" src="./plugins/rgraph/RGraph.gauge.js"></script>


<script type="text/javascript" src="./scripts/innovtrack.js"></script>
<script type="text/javascript" src="./scripts/tracking.js"></script>
<script type="text/javascript" src="./scripts/kids.js"></script>
<script type="text/javascript" src="./scripts/layout.js"></script>
<script type="text/javascript" src="./scripts/livedevices.js"></script>
<script type="text/javascript" src="./scripts/devices.js"></script>
<script type="text/javascript" src="./scripts/history.js"></script>
<script type="text/javascript" src="./scripts/vehicles.js"></script>
<script type="text/javascript" src="./scripts/drivers.js"></script>
<script type="text/javascript" src="./scripts/menu.js"></script>
<script type="text/javascript" src="./scripts/dashboard.js"></script>
<script type="text/javascript" src="./scripts/livetracking.js"></script>
<script type="text/javascript" src="./scripts/geofence.js"></script>
<script type="text/javascript" src="./scripts/georoute.js"></script>
<script type="text/javascript" src="./scripts/boardingpoint.js"></script>
<script type="text/javascript" src="./scripts/combo.js"></script>
<script type="text/javascript" src="./scripts/TripSummaryReports.js"></script>
<script type="text/javascript" src="./scripts/HistoryReports.js"></script>
<script type="text/javascript" src="./scripts/speedReports.js"></script>
<script type="text/javascript" src="./scripts/fuelReports.js"></script>
<script type="text/javascript" src="./scripts/functions.js"></script>

<!--script src="http://maps.google.com/maps?file=api&amp;v=2&amp;sensor=false&amp;key=ABQIAAAAhM3jxNkxvSWAKCVrZEVwNhR5KEzaqTn_Ur61x3JdEe46YoG8IhRx5d5dXYwKHi9vZf3AHalBvLRO0Q" type="text/javascript"></script-->
<!--script src="http://maps.google.com/maps?file=api&amp;v=2&amp;sensor=false&amp;key=AIzaSyCtiC-qe7eVo66mhdAMNosaIJ-z-tYVt2I" type="text/javascript"></script-->
<!--script src="http://maps.google.com/maps?file=api&amp;v=2&amp;sensor=false&amp;key=AIzaSyCtiC-qe7eVo66mhdAMNosaIJ-z-tYVt2I" type="text/javascript"></script-->
<!--script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?v=3&sensor=false"></script-->
<script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?sensor=false&libraries=places"></script>
<script type="text/javascript" src="./plugins/infobox.js"></script>
<script type="text/javascript" src="polygonEdit/src/polygonEdit.js"></script>
<script type="text/javascript" src="./plugins/geofenceLimit.js"></script>
<script type="text/javascript" src="./scripts/settings.js"></script>
<!--script type="text/javascript" src="./plugins/extinfowindow.js"></script-->
<!--
<link rel="stylesheet" type="text/css" href="plugins/portal.css">
<script type="text/javascript" src="plugins/classes.js"></script>
-->



</head>
<body oncontextmenu="return false">
<div id="loading">
    <div class="loading-indicator"><img src="./extjs4.1/resources/themes/images/default/shared/large-loading.gif" width="32" height="32" style="margin-right:8px;float:left;vertical-align:top;"/><?=$pageloadmsg;?><br /><span id="loading-msg">Loading Control Panel, Please wait...</span></div>
</div>
<div id="north">
    <table width="100%" cellspacing="0" cellpadding="0" border="0">
      <tr>
        <td width="180" valign="top" class="pageHeading" style="padding-top:5px;padding-left:5px;font-wight:bold;vertical-align: top"><img src="./images/logo-inside.png" width="178" height="70"/></td>
		<td valign="middle" class="pageHeading" style="padding-top:5px;font-wight:bold;vertical-align: middle;text-align:left;"><b>&#160;&#160;&#160;&#160;<?=$projectheading;?></b></td>
<td width="180" valign="top" class="pageHeading" style="padding-top:5px;padding-left:5px;font-wight:bold;vertical-align: top"><img src="./images/images/side_top.png" width="620" height="75"/></td>
        <!--td align="right" class="tableTextW">&#160;&#160;[&#160;<a href="#" onClick="confLogout()"><span class="tableTextW"><U>Logout</U></span></a>&#160;]&#160;</td-->
		<td align="right" class="tableTextW" valign="middle"><img src="./images/help.png"/>&#160;&#160;<a href="#" onClick="confLogout()"><img src="./images/logout.png"/></a>&#160;&#160;</td>
      </tr>
    </table>
</div>
</body>
</html>