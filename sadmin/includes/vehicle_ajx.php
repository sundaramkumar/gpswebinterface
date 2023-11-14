<?php
session_start();
include_once("../config/dbconn.php");
include_once("./functions.php");

$todo = $_POST['todo'];

if($todo == "Get_Vehicle_List"){
	if(!preg_match('/showVehicle/',$_SESSION['loadpage'])){
		$_SESSION['loadpage']	= $_SESSION['loadpage'].",showVehicle";
	}
	$start	= $_POST['start'];
	$limit	= $_POST['limit'];
	$customerid		= $_POST['customerid'];
	$filtertext	= $_POST['filtertext'];
		
	$filterQry = "";
	if($customerid!="" && $customerid!="0"){
		if($filtertext!=''){
			$filterQry = "AND veh.customerid=$customerid AND (veh.vehiclename LIKE '%$filtertext%' OR dev.devicename LIKE '%$filtertext%' OR dri.drivername LIKE '%$filtertext%' OR veh.regnno LIKE '%$filtertext%' OR veh.model LIKE '%$filtertext%')";
		}
		else{
			$filterQry = "AND veh.customerid=$customerid";
		}
	}
	if($filtertext!=''){
		if($customerid!="" && $customerid!="0"){
			$filterQry = "AND veh.customerid=$customerid AND (veh.vehiclename LIKE '%$filtertext%' OR dev.devicename LIKE '%$filtertext%' OR dri.drivername LIKE '%$filtertext%' OR veh.regnno LIKE '%$filtertext%' OR veh.model LIKE '%$filtertext%')";
		}
		else{
			$filterQry = "AND (veh.vehiclename LIKE '%$filtertext%' OR dev.devicename LIKE '%$filtertext%' OR dri.drivername LIKE '%$filtertext%' OR veh.regnno LIKE '%$filtertext%' OR veh.model LIKE '%$filtertext%')";
		}
	}
	$totQry	= mysql_query("SELECT dev.deviceid, dev.devicename, cus.customerid, cus.customername, veh.*, dri.driverid, dri.drivername FROM vehicles veh
							LEFT OUTER JOIN devices dev ON dev.deviceid = veh.deviceid
							LEFT OUTER JOIN customers cus ON cus.customerid = veh.customerid
							LEFT OUTER JOIN drivers dri on dri.driverid = veh.driverid WHERE veh.vehicleid!='' $filterQry");
	$totCnt	= mysql_num_rows($totQry);
	if($totCnt == 0){
		$myData[] = array(
			'vehicleid'  	 => 0,
			'vehiclename'   => "<span class='tableTextM'>No Vehicle's Found</span>"
		);
		
	}else{
	    $customerQry = mysql_query("SELECT dev.deviceid, dev.devicename, cus.customerid, cus.customername, veh.*, dri.driverid, dri.drivername FROM vehicles veh
		                            LEFT OUTER JOIN devices dev ON dev.deviceid = veh.deviceid
									LEFT OUTER JOIN customers cus ON cus.customerid = veh.customerid
									LEFT OUTER JOIN drivers dri on dri.driverid = veh.driverid WHERE veh.vehicleid!='' $filterQry ORDER BY veh.vehiclename LIMIT $start , $limit");
		while($vehicleRes = mysql_fetch_array($customerQry)){
			$status = $vehicleRes['vehiclestatus'];
			if($status=="Enable")
				$status="<img src='./images/enable.png' style='cursor:pointer' title='Click here to Disable' onclick='status_vehicle(".$vehicleRes['vehicleid'].",\"Disable\")'/>";
			else
				$status="<img src='./images/disable.png' style='cursor:pointer' title='Click here to Enable' onclick='status_vehicle(".$vehicleRes['vehicleid'].",\"Enable\")'/>";
			$vehicleid = $vehicleRes['vehicleid'];
			$deviceid = $vehicleRes['deviceid'];
			if($deviceid!=0)
				$devicename = $vehicleRes['devicename'].'<br><a onclick="unassign_vehicle('.$vehicleid.')" href="#">Remove from the Vehicle</a>';
			else
				$devicename = '';
			$myData[] = array(
				'vehicleid'     => $vehicleRes['vehicleid'],
				'customerid'  	=> $vehicleRes['customerid'],
				'customername'  => $vehicleRes['customername'],
				'deviceid'  	=> $vehicleRes['deviceid'],
				'devicename'   	=> $devicename,
				'driverid'  	=> $vehicleRes['driverid'],
				'drivername'   	=> $vehicleRes['drivername'],
				'vehiclename'	=> $vehicleRes['vehiclename'],
				'model'			=> $vehicleRes['model'],
				'regnno'		=> $vehicleRes['regnno'],
				'insurancedate'	=> $vehicleRes['insurancedate']=="0000-00-00"?"":date("d-m-Y",strtotime($vehicleRes['insurancedate'])),
				'fcdate'		=> $vehicleRes['fcdate']=="0000-00-00"?"":date("d-m-Y",strtotime($vehicleRes['fcdate'])),
				'servicedue'	=> $vehicleRes['servicedue']=="0000-00-00"?"":date("d-m-Y",strtotime($vehicleRes['servicedue'])),
				'engineno'		=> $vehicleRes['engineno'],
				'chassisno'		=> $vehicleRes['chassisno'],
				'fuel_capacity'	=> $vehicleRes['fuel_capacity'],
				'speedlimit'	=> $vehicleRes['speedlimit'],
				'totalspeed'	=> $vehicleRes['totalspeed'],
				'ignition'	=> $vehicleRes['ignition'],
  				'fuelstatus'	=> $vehicleRes['fuelstatus'],
				'vehiclestatus' => $status
			);
		}
	}
	$myData = array('CUSTOMERSS' => $myData, 'totalCount' => $totCnt);
	header('Content-Type: application/x-json');
	echo json_encode($myData);
}

//Add Vehicle
if($todo == "Add_Vehicle"){
		$customerid     = $_POST['customerid'];
		$deviceid		= $_POST['deviceid'];
		$driverid		= $_POST['driverid'];
		$vehiclename	= $_POST['vehiclename'];
		$model			= $_POST['model'];
		$regnno		    = $_POST['regnno'];
		$engineno		= $_POST['engineno'];
		$chassisno		= $_POST['chassisno'];
		$fuel_capacity	= $_POST['fuel_capacity'];
		$totalspeed		= $_POST['totalspeed'];
		$speedlimit		= $_POST['speedlimit'];
		$insurancedate	= $_POST['insurancedate'];
		$fcdate			= $_POST['fcdate'];
		$servicedue		= $_POST['servicedue'];
		$ignition		= $_POST['ignition'];
		$fuelstatus		= $_POST['fuelstatus'];
		if($insurancedate)
			$insurancedate  = date("Y-m-d",strtotime($insurancedate));
		if($fcdate)
			$fcdate		    = date("Y-m-d",strtotime($fcdate));
		if($servicedue)
			$servicedue		= date("Y-m-d",strtotime($servicedue));
		
		$chkQry	= mysql_query("SELECT * FROM vehicles WHERE regnno='".$regnno."'");
		$chkCnt	= mysql_num_rows($chkQry);
		if($chkCnt == 0){
			$vehicleQry = "INSERT INTO vehicles(customerid, deviceid, driverid, vehiclename, model, regnno, insurancedate, fcdate, servicedue, engineno, chassisno, fuel_capacity, totalspeed, speedlimit,ignition,fuelstatus)
							VALUES('".$customerid."', '".$deviceid."', '".$driverid."', '".$vehiclename."', '".$model."', '".$regnno."', '".$insurancedate."', '".$fcdate."', '".$servicedue."', '".$engineno."', '".$chassisno."', '".$fuel_capacity."', '".$totalspeed."', '".$speedlimit."','".$ignition."', '".$fuelstatus."')";
			$vehicleRes = mysql_query($vehicleQry);
				if($vehicleRes){
					$vehicleinsertid = mysql_insert_id();
					$vehiclesmsinsert = mysql_query("INSERT INTO vehicle_sms (deviceid,vehicleid) VALUES ('".$deviceid."','".$vehicleinsertid."')");
					if($vehiclesmsinsert)
					echo "{ success: true,msg:'Vehicle <b>$vehiclename</b> Added Successfully.'}";
					else
					echo "{ success: false,msg:'Vehicle <b>$vehiclename</b> Added Failed.'}";
				}
				else{
					echo "{ success: false,msg:'Error while adding new Vehicle.$vehicleQry'}";
				}
		}else{
			echo "{ success: false,msg:'Vehihle Reg. No Already Exists.'}";
		}
	}
//Edit Vehicle
if($todo == "Edit_Vehicle")
    {
		$vehicleid     = $_POST['vehicleid'];
		$customerid     = $_POST['customerid'];
		$deviceid		= $_POST['deviceid'];
		$driverid		= $_POST['driverid'];
		$vehiclename	= $_POST['vehiclename'];
		$model			= $_POST['model'];
		$regnno		    = $_POST['regnno'];
		$insurancedate	= $_POST['insurancedate'];
		$fcdate			= $_POST['fcdate'];
		$servicedue		= $_POST['servicedue'];
		$engineno		= $_POST['engineno'];
		$chassisno		= $_POST['chassisno'];
		$fuel_capacity	= $_POST['fuel_capacity'];
		$totalspeed     = $_POST['totalspeed'];
		$speedlimit		= $_POST['speedlimit'];	
		$ignition       = $_POST['ignition'];
		$fuelstatus		= $_POST['fuelstatus'];
		
		if($insurancedate)
			$insurancedate  = date("Y-m-d",strtotime($insurancedate));
		if($fcdate)
			$fcdate		    = date("Y-m-d",strtotime($_POST['fcdate']));
		if($servicedue)
			$servicedue		= date("Y-m-d",strtotime($_POST['servicedue']));
		
		$regChk = mysql_query("SELECT * FROM vehicles WHERE vehicleid!='".$vehicleid."' AND regnno='".$regnno."'");
		$regCnt = mysql_num_rows($regChk);
		if($regCnt==0)
		{
			$devChk = mysql_query("SELECT * FROM vehicles WHERE vehicleid!='".$vehicleid."' AND deviceid='".$deviceid."'");
			$devCnt = mysql_num_rows($devChk);
			if($devCnt==0)
			{
				$uchkQry	= mysql_query("SELECT * FROM vehicles WHERE vehicleid='".$vehicleid."'");
				$chkCnt	= mysql_num_rows($uchkQry);
				if($chkCnt==1)
				{
					$vehicleQry = "UPDATE vehicles SET
									customerid 	= '".$customerid."',
									deviceid 	= '".$deviceid."',
									driverid 	= '".$driverid."',
									vehiclename	= '".$vehiclename."',
									model		= '".$model."',
									regnno		= '".$regnno."',
									insurancedate = '".$insurancedate."',
									fcdate		= '".$fcdate."',
									servicedue	= '".$servicedue."',
									engineno	= '".$engineno."',
									chassisno	= '".$chassisno."',
									fuel_capacity = '".$fuel_capacity."',
									totalspeed	= '".$totalspeed."',
									speedlimit	= '".$speedlimit."',
									ignition    = '".$ignition."',
									fuelstatus    = '".$fuelstatus."' 
									WHERE vehicleid= '".$vehicleid."'";
					$vehicleRes = mysql_query($vehicleQry);

					if($vehicleRes){
						$vehiclesmsupdate = mysql_query("UPDATE vehicle_sms SET 
														deviceid  = '".$deviceid."' WHERE vehicleid = '".$vehicleid."'");
						if($vehiclesmsupdate)
						echo "{ success: true,msg:'Vehicle <b>$vehiclename</b> Updated Successfully.'}";
						else
						echo "{ success: false,msg:'Vehicle <b>$vehiclename</b> Updated Failed.'}";
						
					}else{
						$error	= mysql_error();
						echo "{ success: false,msg:'Error while updating Vehicle'}";
					}
				}
				else {
				echo "{ success: false,msg:'Error while updating Vehicle' }";
				}
			}
			else
				echo "{ success: false,msg:'Device already Exits'}";
		}
		else{
			 echo "{ success: false,msg:'Vehicle Reg.No already Exits' }";
		}
	
    }

//Delete the Vehicle
if($todo == "Delete_Vehicle"){
		$vehicleid		= $_POST['vehicleid'];
		$vehiclename	= $_POST['vehiclename'];
		$vehsmsqry = mysql_query("SELECT * FROM vehicle_sms WHERE vehicleid='".$vehicleid."'");
		$vehsmsCnt	= mysql_num_rows($vehsmsqry);
		if($vehsmsCnt==0)	
		{
			$chkQry	= mysql_query("SELECT * FROM vehicles WHERE vehicleid='".$vehicleid."' AND vehiclename='".$vehiclename."'");
			$chkCnt	= mysql_num_rows($chkQry);
			if($chkCnt == 1){
				$vehicleQry = "DELETE FROM vehicles WHERE vehiclename='".$vehiclename."' AND vehicleid='".$vehicleid."'";
				$vehicleRes = mysql_query($vehicleQry);
				if($vehicleRes){
					echo "{ success: true,msg:'Vehicle Deleted Successfully.'}";
				}else{
					echo "{ success: false,msg:'Error while deleting Vehicle'}";
				}
			}else{
				echo "{ success: false,msg:'The Vehicle does not Exists.'}";
			}
		}
		else
		{
			echo "{ success: false,msg:'The Vehicle name using another grids. So Do not Delete the Vehicle'}";
		}
	}
//Change the status
if($todo=="Status_Vehicle"){
		$deviceid = '';
		$vehicleid		= $_POST['vehicleid'];
		$vehiclestatus	= $_POST['vehiclestatus'];
		$statusQry = mysql_query("UPDATE vehicles SET vehiclestatus='".$vehiclestatus."' WHERE vehicleid='".$vehicleid."'");	
		if($statusQry!='')
		echo "{success:true,msg:'Status Changed Successfully'}";
		else
		echo "{success:true,msg:'Status Change Failed'}";
	}
//Usassign the device
if($todo=="Unassign_Vehicle"){
		$vehicleid		= $_POST['vehicleid'];
		$unassignQry = mysql_query("UPDATE vehicles SET deviceid='', vehiclestatus='Disable' WHERE vehicleid='".$vehicleid."'");	
		if($unassignQry!=''){
			$vehicle_smsQry = mysql_query("UPDATE vehicle_sms SET deviceid='' WHERE vehicleid='".$vehicleid."'");
			if($vehicle_smsQry!='') 
				echo "{success:true,msg:'Device Removed Successfully'}";
			else
				echo "{success:true,msg:'Device Removed Failed in vehicle_sms'}";
		}
		else
		echo "{success:true,msg:'Device Removed Failed'}";
	}
?>