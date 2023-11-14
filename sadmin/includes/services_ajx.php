<?php
session_start();
include_once("../config/dbconn.php");
include_once("./functions.php");

$todo = $_POST['todo'];
//Get Users List
if($todo == "Get_Services_List"){
	if(!preg_match('/showServices/',$_SESSION['loadpage'])){
		$_SESSION['loadpage']	= $_SESSION['loadpage'].",showServices";
	}

	$start	= $_POST['start'];
	$limit	= $_POST['limit'];
	$filterQry = '';
	$customerid	= $_POST['customerid'];
	if($customerid!="" && $customerid!="0"){
		{
			$filterQry = "AND cust.customerid=$customerid";
		}
		
	}
	
	$totQry	= mysql_query("SELECT cust.customerid,cust.customername,services.* FROM customer_services services 
								LEFT OUTER JOIN customers cust ON cust.customerid = services.customerid WHERE services.serviceid!='' $filterQry");
	$totCnt	= mysql_num_rows($totQry);
	
	
	

	if($totCnt == 0){
		$myData[] = array(
			'userid'  	 => 0,
			'realname'   => "<span class='tableTextM'>No Data Found</span>"
		);
	}else{
		$servicesQry = mysql_query("SELECT cust.customerid,cust.customername,services.* FROM customer_services services 
								LEFT OUTER JOIN customers cust ON cust.customerid = services.customerid WHERE services.serviceid!='' $filterQry LIMIT $start , $limit");
		while($servicesRes = mysql_fetch_array($servicesQry)){
		if($servicesRes['services']=='Basic')
		{
			//$servicesRes_basic='Basic';
			$servicesRes_basic="<img src='./images/tick.png' style='cursor:pointer' title='Click here to Disable' />";
		}
		else{
		$servicesRes_basic = "-";
		}
		if($servicesRes['services']=='Standard')
		{
			$servicesRes_standard="<img src='./images/tick.png' style='cursor:pointer' title='Click here to Disable' />";
		}
		elseif($servicesRes['services']!='Premium'){
			$servicesRes_standard = '<a style="font-size:15px;text-decoration:none;" onclick="service_upgrade('.$servicesRes['customerid'].',\'Standard\')" href="#">upgrade</a>';
		}
		else
		{
		$servicesRes_standard="-";
		}
		if($servicesRes['services']=='Premium')
		{
			$servicesRes_premium="<img src='./images/tick.png' style='cursor:pointer' title='Click here to Disable' />";;
		}
		else{
			$servicesRes_premium = '<a style="font-size:15px;text-decoration:none;" onclick="service_upgrade('.$servicesRes['customerid'].',\'Premium\')" href="#">upgrade</a>';
		}
		
		/* if($deviceid!=0)
					$devicename = $kidRes['devicename'].'<br><a onclick="unassign_kid('.$kidid.')" href="#">unassign</a>';
				else
					$devicename = '';
		 */
		
				$myData[] = array(
				'serviceid'  	=> $servicesRes['serviceid'],
				'customerid'  	=> $servicesRes['customerid'],
				'customername'	=> $servicesRes['customername'],
				'basic'		    => $servicesRes_basic,
				'standard'		=> $servicesRes_standard,
				'premium'		=> $servicesRes_premium,
				'stolen_vehicle_locator' => $servicesRes['stolen_vehicle_locator'],	
				'live_stolen_vehicle_tracking' =>$servicesRes['live_stolen_vehicle_tracking'],
				'customer_web_access'=>$servicesRes['customer_web_access'],
				'online_tracking' => $servicesRes['online_tracking'],	
				'history_tracking' =>$servicesRes['history_tracking'],
				'arrival_departure'=>$servicesRes['arrival_departure'],
				'over_speed' => $servicesRes['over_speed'],	
				'ignition_status' =>$servicesRes['ignition_status'],
				'door_status'=>$servicesRes['door_status'],
				'panic_button' => $servicesRes['panic_button'],	
				'alerts' =>$servicesRes['alerts'],
				'trip_area'=>$servicesRes['trip_area'],
				'fuel_guage_data'=>$servicesRes['fuel_guage_data'],
				'softcopy_report' => $servicesRes['softcopy_report'],	
				'upgradable' =>$servicesRes['upgradable'],
				'transfarable_features'=>$servicesRes['transfarable_features'],
				'online_tracking_limit' =>$servicesRes['online_tracking_limit'],
				'history_tracking_limit'=>$servicesRes['history_tracking_limit'],
			);
			
		}
	}

    $myData = array('CUSTOMERS_S' => $myData, 'totalCount' => $totCnt);
	header('Content-Type: application/x-json');
    echo json_encode($myData);
}

//Edit the services
if($todo == "Edit_Services"){
	$serviceid         = $_POST['serviceid'];
	if($_POST['stolen_vehicle_locator'])
	$stolen_vehicle_locator	    = $_POST['stolen_vehicle_locator'];
	if($_POST['live_stolen_vehicle_tracking'])
	$live_stolen_vehicle_tracking	    = $_POST['live_stolen_vehicle_tracking'];
	if($_POST['customer_web_access'])
	$customer_web_access	    = $_POST['customer_web_access'];
	if($_POST['online_tracking'])
	$online_tracking	    = $_POST['online_tracking'];
	if($_POST['history_tracking'])
	$history_tracking	    = $_POST['history_tracking'];
	if($_POST['arrival_departure'])
	$arrival_departure	    = $_POST['arrival_departure'];
	if($_POST['over_speed'])
	$over_speed	    = $_POST['over_speed'];
	if($_POST['ignition_status'])
	$ignition_status	    = $_POST['ignition_status'];
	if($_POST['door_status'])
	$door_status	    = $_POST['door_status'];
	if($_POST['panic_button'])
	$panic_button	    = $_POST['stolen_vehicle_locator'];
	if($_POST['alerts'])
	$alerts	    = $_POST['alerts'];
	if($_POST['trip_area'])
	$trip_area	    = $_POST['trip_area'];
	if($_POST['fuel_guage_data'])
	$fuel_guage_data	    = $_POST['fuel_guage_data'];
	if($_POST['softcopy_report'])
	$softcopy_report	    = $_POST['softcopy_report'];
	if($_POST['upgradable'])
	$upgradable	    = $_POST['upgradable'];
	if($_POST['transfarable_features'])
	$transfarable_features	    = $_POST['transfarable_features'];

	$servicesQry = mysql_query("UPDATE customer_services SET
					stolen_vehicle_locator 	= '".$stolen_vehicle_locator."',
					live_stolen_vehicle_tracking     = '".$live_stolen_vehicle_tracking."',
					customer_web_access 	= '".$customer_web_access."',
					online_tracking		= '".$online_tracking."',
					history_tracking		= '".$history_tracking."',
					arrival_departure 	= '".$arrival_departure."',
					over_speed     = '".$over_speed."',
					ignition_status 	= '".$ignition_status."',
					door_status		= '".$door_status."',
					panic_button		= '".$panic_button."',
					alerts 	= '".$alerts."',
					trip_area     = '".$trip_area."',
					fuel_guage_data 	= '".$fuel_guage_data."',
					softcopy_report		= '".$softcopy_report."',
					upgradable		= '".$upgradable."',
					transfarable_features    = '".$transfarable_features."'
					WHERE serviceid = '".$serviceid."'");

	if($servicesQry){
		echo "{ success: true,msg:'User  Updated Successfully.'}";
	}
	else{
		echo "{ success: true,msg:'User  Updated failed.'}";
	}
	//}
	//}
	
	
	/* else
	{
		echo "{ success: false,msg:'Already there is some other Customer with the name <b>$username</b> Exists.'}";
	}*/ 

} 


	
if($todo=="Upgrade_Services")
{
	$customerid		= $_POST['customerid'];
	$services		= $_POST['services'];
	if($services=="Standard")
	$upgradeQry = mysql_query("UPDATE customer_services SET
							 services='".$services."',
							 customer_web_access='1',
							 online_tracking='1',
							 history_tracking='1',
							 arrival_departure='1',
							 over_speed='1',
							 ignition_status='1',
							 door_status='1',
							 panic_button='1',
							 trip_area='1' 
							 WHERE customerid='".$customerid."'");	
	if($services=="Premium")
	$upgradeQry = mysql_query("UPDATE customer_services SET
							 services='".$services."',
							 customer_web_access='1',
							 online_tracking='1',
							 history_tracking='1',
							 arrival_departure='1',
							 over_speed='1',
							 ignition_status='1',
							 door_status='1',
							 panic_button='1',
							 trip_area='1',
							 alerts='1',
							 fuel_guage_data='1'
							 WHERE customerid='".$customerid."'");	
	if($upgradeQry!='')
	echo "{success:true,msg:'Services Upgrade Successfully'}";
	else
	echo "{success:true,msg:'Services Upgrade Failed'}";
	
}
	
?>