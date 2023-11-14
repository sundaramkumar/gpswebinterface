<?php
/**
 * admin_panel.php
 * Saas admin main page
 *
 */
session_start();
//Redirect the page to  default  page , if the session is active
if(!isset($_SESSION['SAAS_USER_ID']) || !isset($_SESSION['SAAS_USER_NAME'])){
    //check which user is logged in and Redirect
    header('location:./login.php');
	//$_SESSION['SAAS_USER_NAME'] = 'admin';
	//$_SESSION['SAAS_USER_ID'] 	= 1; 
}

if($_SESSION['OPEN_TAB'] > 0){
	$openTab = $_SESSION['OPEN_TAB'];
}else{
	$openTab = 0;
	$_SESSION['OPEN_TAB'] = 0;
}
//include('config/config.php');
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<title>EzTest SaaS</title> 
	<link rel="stylesheet" type="text/css" href="../common/extjs/resources/css/ext-all.css" />
	<link rel="stylesheet" type="text/css" href="../common/extjs/styles/styles.css"/>
	<style type="text/css">
	body, select, textarea {
    font: 100% Tahoma, Arial, sans-serif;
    color: #000000;     
}
		#north
	   {
			background-color:#334371; /*#107FBE;*/
			/*color:#FFFFFF;
			text-align:bottom;
			height:80px;*/

			background:transparent url(../common/extjs/images/topBnd_bg.jpg) no-repeat scroll left top;
			font-size:70%;
			height:80px;
			width:100%;
	   }
		div#statusContainer {
			position: absolute;
			left: 40%;
			top: -1px;
			width: 300;
			/* height: 10px;*/
			/*border:1px solid red;*/
		}

		div#statusMessageContainer {
			position: absolute;
			background-color: #F6BC5D ;
			color: #000000;
			/*	width: 83px; */
			font-family: Verdana,Arial, Helvetica, sans-serif;
			padding: 3px 5px 5px 3px;
			font-size:14px;
			/*	font-weight: 600;*/
		}

    #loading{
        position:absolute;
        left:40%;
        top:40%;
        //padding:2px;
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
        width:220px;
    }
    #loading-msg {
        font: normal 10px arial,tahoma,sans-serif;
        color:#444;
    }

    .go-app-logo{
        background: url('../common/images/eztestlogo.jpg');
        /*width:200px;*/
        height:100px;
        background-repeat:no-repeat;
        margin-top: 10px;
        margin-bottom: 20px;
        background-position:center;
    }
</style>
	<link rel="SHORTCUT ICON" href="./favicon.ico">
	<script type="text/javascript" src="../common/extjs/adapter/ext/ext-base.js"></script>
	<script type="text/javascript" src="../common/extjs/ext-all.js"></script>
	<script type="text/javascript" src="../common/extjs/plugin/RowExpander.js"></script>
	<script type="text/javascript" src="../common/extjs/plugin/CheckColumn.js"></script>
	<script type="text/javascript" src="../common/extjs/plugin/SearchField.js"></script>
	<script type="text/javascript" src="../common/extjs/plugin/Spinner.js"></script>
	<script type="text/javascript" src="../common/extjs/plugin/SpinnerField.js"></script>
	<script type="text/javascript" src="../common/extjs/ux/SpinnerField.js"></script>
	<script type="text/javascript" src="../common/extjs/ux/Spinner.js"></script>
	<link rel="stylesheet" type="text/css" href="../common/extjs/ux/css/Spinner.css">
	<link rel="stylesheet" type="text/css" href="../common/extjs/plugin/LovCombo.css">
	<script type="text/javascript" src="../common/extjs/plugin/LovCombo.js"></script>
	<script language="javascript" type="text/javascript" src="../common/javascript/prototype.js"></script>
	<script language="javascript" type="text/javascript" src="../common/javascript/eztest.js"></script>
	<!--script language="javascript" src="../common/javascript/prototype.js"></script-->
	<script type="text/javascript" src="../common/extjs/plugin/Portal.js"></script>
	<script type="text/javascript" src="../common/extjs/plugin/BufferView.js"></script>
	<script type="text/javascript" src="../common/extjs/plugin/PortalColumn.js"></script>
	<script type="text/javascript" src="../common/extjs/plugin/Ext.ux.form.TreeCombo.js"></script>
	<script type="text/javascript" src="../common/extjs/plugin/TreeFilterX.js"></script>
	<script type="text/javascript" src="../common/extjs/plugin/Portlet.js"></script>
	<link rel="stylesheet" type="text/css" href="../common/extjs/plugin/portal.css">

	<script type="text/javascript">
		
		var G_backupDetailsUI = '';
		var SaasFolderPath = '<?php echo $SaasFolderPath;?>';
		var GsetopenTab = <?=$openTab?>;
		var product_title	= '<?php echo $ei_product_title;?>';
	</script>	
	
</head>
<body onload="startUps()">
<div id="mainLoadingDiv">
	<div id="loading">
		<div class="loading-indicator"><img src="../common/extjs/images/large-loading.gif" width="32" height="32" style="margin-right:8px;float:left;vertical-align:top;"/>EzTest Saas Admin<br /><span id="loading-msg">Loading...</span></div>
	</div>
</div>
	<div id="statusContainer" style="visibility: hidden; z-index: 500010;">
		<div id="statusMessageContainer">Loading...</div>
	</div>
	<div id="north">
		<table width="100%" cellspacing="0" cellpadding="0" border="0" height="80">
		  <tr>
			<td width="7%" rowspan="2" valign="top" classs="wizHeadingNew">&#160;</td>
			<td width="20%" rowspan="2" valign="bottom" class="wizHeadingNew">&#160;</td>
			<td align="right" class="tableTextW">&nbsp;</td>
			<td align="right" class="tableTextW" align="right">
				 <table width="10%" border="0" cellspacing="0" cellpadding="5">
					<tr>
						<!--td><a href="javascript: openHelp()" class="lnkHelp" title="goto Help for this Page"><img src="./extjs/images/help.png" title="Help" width="32" height="32" border="0"/></a></td>
						<td><a href="#" class="lnkHelp" title="Faq"><img src="./extjs/images/faq.png" title="Faq" width="32" height="32" border="0"/></a></td-->
						<td align="center"><a href="#" class="lnkHelp"  onclick="Logout()" title="Logout"><img src="../common/extjs/images/logout.png" title="Faq" width="32" height="32" border="0"/></a></td>
					</tr>
					<tr>
						<!--td class="tableTextW"><a href="javascript: openHelp()" class="lnkHelp" title="Help"><span class='tableTextW'>Help</span></a></td>
						<td class="tableTextW">&#160;<a href="#" class="lnkHelp" title="Faq" style='text-decoration:none'><span class='tableTextW'>Faq</span></a></td-->
						<td class="tableTextW" align="center">&#160;<a href="#" onclick="Logout()" class="lnkHelp" title="Faq" style='text-decoration:none'><span class='tableTextW'>Logout</span></a></td>
					</tr>
					
				</table>
			</td>
		  </tr>
		</table>
	</div>
	<div id="south">
		<div id="footer">
			<table width="100%" border="0" cellspacing="0" cellpadding="0">
				<tr>
					<td> <p class="cpyrgt" style="text-align: left;"><font color="white" >You are logged in as&#160;</font><span><span><?=$_SESSION['SAAS_USER_NAME'];?></span></span> </p></td>
					<td align="right"><p class="cpyrgt" style="padding-right:0px;text-align: right;">&copy; <?=date("Y");?> <span><span>e</span>InfoChips</span>. <?php
		?>All rights reserved.<span><span>SaaS</span> Edition&#160;&#160;&#160;</p></td>
				</tr>
			</table>
		</div>
		
	</div>
	<!--div id="footer">
    <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
            <td><p class="cpyrgt" style="text-align: left;">&copy; <?=date("Y");?> <span><span>e</span>InfoChips</span>. <?php
?>All rights reserved.</p></td>
            <td align="right"><p class="cpyrgt" style="padding-right:0px;text-align: right;"><span><span>Team</span> Edition&#160;&#160;&#160;</p></td>
        </tr>
    </table>
</div-->
<script language="javascript">
var G_makeOnline = false;
<?if (file_exists("../EzTest/.htaccess")) {?>
	G_makeOnline = true;//<input type="button" value="Bring Online Now" onClick="javascript: fnMakeOnline()" />
<?}?>
	/* 
	style="	position: absolute;	bottom: 0px;	left:0px;	background: url(../images/footer_bg.gif) repeat-x left top;	height: 26px;	width: 100%;	font-size:70%;	line-height:25px;"
	//alert(document.getElementById('containerWrp').innerHTML)
    G_backupDetailsUI = document.getElementById('containerWrp').innerHTML
	//var divElements=$('containerWrp').innerHTML
    document.getElementById('containerWrp').innerHTML='';
	//$('containerWrp').innerHTML=''; */
</script>
<script type="text/javascript" src="./extjs/script/settings.js"></script>
<script language="javascript">
	/* spinButton.initialize('sch_minute',0,59,'minuteContainer');
	spinButton.initialize('sch_hour',0,23,'hourContainer'); */
	var LoadingMsgDiv = document.getElementById('mainLoadingDiv').innerHTML;
	function showLoadingMsg(v){
		if(v==true){
			document.getElementById('mainLoadingDiv').innerHTML = LoadingMsgDiv ;
		}else{
			setTimeout('Ext.get(\'loading\').fadeOut({remove: true});',300)
		}
	}
	showLoadingMsg(false)
	

</script>

<script type="text/javascript" src="./extjs/script/admin_panel.js"></script>
<script type="text/javascript" src="./extjs/script/licence_panel.js"></script>
<script>
function startUps(){
	setTimeout(function(){
		//Ext.get('loading').fadeOut({remove: true});
	},250);
}
isDebugging = false;
</script>

</body>
</html>