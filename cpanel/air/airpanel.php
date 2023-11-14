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
	header("location: ../air.php");
	exit;
}

require_once("../config/dbconn.php");

?>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title><?=$pagetitle;?></title>
<link rel="stylesheet" type="text/css" href="../extjs4.1/resources/css/ext-all.css" />
<!--link rel="stylesheet" type="text/css" href="../extjs4.7/resources/css/ext-all-slate.css" id="theme"-->
<link rel="stylesheet" type="text/css" href="../css/styles.css" />
<link rel="stylesheet" type="text/css" href="../plugins/css/redInfoWindow.css" />
<style>

   /* for word wrapping inside grid cells */
	td.x-grid-cell {
        overflow: hidden;
    }
  	td.x-grid-cell div.x-grid-cell-inner {
        white-space: normal !important;
    }


</style>
<link rel="SHORTCUT ICON" href="../favicon.ico">

<script type="text/javascript" src="../extjs4.1/ext-all.js"></script>
<script>
	function confLogout(){
		Ext.MessageBox.confirm('Confirm', 'Are you sure to Logout ?',
		function(con){
			if(con)
			{
				if(con=='yes'){
					var redirect = 'logout.php';
					window.location = redirect;
				}else{
					return false;
				}
			}
		});
	}
</script>
<script type="text/javascript" src="../plugins/GMapPanel.js"></script>
<script type="text/javascript" src="../plugins/rgraph/RGraph.common.core.js"></script>
<script type="text/javascript" src="../plugins/rgraph/RGraph.common.effects.js"></script>
<script type="text/javascript" src="../plugins/rgraph/RGraph.common.dynamic.js"></script>
<script type="text/javascript" src="../plugins/rgraph/RGraph.gauge.js"></script>

<script type="text/javascript" src="./scripts/misc.js"></script>
<script type="text/javascript" src="./scripts/tracking.js"></script>
<script type="text/javascript" src="./scripts/airlayout.js"></script>
<script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?sensor=false&libraries=places"></script>
<script type="text/javascript" src="../plugins/infobox.js"></script>
<script type="text/javascript" src="../polygonEdit/src/polygonEdit.js"></script>
<script type="text/javascript" src="../plugins/geofenceLimit.js"></script>

</head>
<body>
<div id="loading">
    <div class="loading-indicator"><img src="../extjs4.1/resources/themes/images/default/shared/large-loading.gif" width="32" height="32" style="margin-right:8px;float:left;vertical-align:top;"/><?=$pageloadmsg;?><br /><span id="loading-msg">Loading Control Panel, Please wait...</span></div>
</div>
<div id="north">
    <table width="100%" cellspacing="0" cellpadding="0" border="0">
      <tr>
        <td width="180" valign="top" class="pageHeading" style="padding-top:5px;padding-left:5px;font-wight:bold;vertical-align: top"><img src="../images/logo-inside.png" width="178" height="70"/></td>
		<td valign="middle" class="pageHeading" style="padding-top:5px;font-wight:bold;vertical-align: middle;text-align:left;"><b>&#160;&#160;&#160;&#160;<?=$projectheading;?></b></td>
        <!--td align="right" class="tableTextW">&#160;&#160;[&#160;<a href="#" onClick="confLogout()"><span class="tableTextW"><U>Logout</U></span></a>&#160;]&#160;</td-->
		<td align="right" class="tableTextW" valign="middle"><a href="#" onClick="location.reload(true)"><img src="../images/reload.png"/></a>&#160;&#160;<a href="#" onClick="confLogout()"><img src="../images/logout.png"/></a>&#160;&#160;</td>
      </tr>
    </table>
</div>
</body>
</html>