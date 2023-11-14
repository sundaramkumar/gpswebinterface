<?php
session_start();
include_once("../config/dbconn.php");
include_once("./functions.php");

error_reporting(E_ALL);
ini_set('display_errors','On');

$customerid = $_SESSION['customerid'];

$todo = $_POST['todo'];
if($todo == "Get_vehicles_List"){
	/*if(!preg_match('/showvehicles/',$_SESSION['loadpage'])){
		$_SESSION['loadpage']	= $_SESSION['loadpage'].",showvehicles";
	}*/

	$start	= $_POST['start'];
	$limit	= $_POST['limit'];
	
	/*echo "SELECT gv.customerid, gv.deviceid, gv.vehiclename, gv.model, gv.regnno,
				gv.insurancedate, gv.fcdate, gv.servicedue, gv.engineno, gv.chassisno,
				gd.devicename, gd.status, gd.simcardno, gd.simserialno, gd.simprovider, gd.gprsplan, gd.gprssettings
		 		FROM vehicles gv 
				LEFT OUTER JOIN devices gd ON gd.deviceid = gv.deviceid
				WHERE gv.customerid='".$customerid."' AND gd.devicetype='VTS' ORDER BY gv.vehiclename";*/
	if($customerid == '3')
		$cust_qry = "";
	else
		$cust_qry = "AND gv.customerid='".$customerid."'";

	$totQry	= mysql_query("SELECT gv.customerid, gv.deviceid, gv.vehiclename, gv.model, gv.regnno,
				gv.insurancedate, gv.fcdate, gv.servicedue, gv.engineno, gv.chassisno, gdr.driverid, gdr.drivername, gdr.mobile,
				gd.devicename, gd.status, gd.simcardno, gd.simserialno, gd.simprovider, gd.gprsplan, gd.gprssettings
		 		FROM vehicles gv LEFT OUTER JOIN devices gd ON gd.deviceid = gv.deviceid
				LEFT OUTER JOIN drivers gdr ON gdr.driverid = gv.driverid
				WHERE (devicetype='VTS' OR devicetype='OTS') $cust_qry ORDER BY gv.vehiclename");
	$totCnt	= mysql_num_rows($totQry);
	if($totCnt == 0){
		$myData[] = array(
			'vehicleid'  	 => 0,
			'vehiclename'   => "<span class='tableTextM'>No vehicles Found</span>"
		);
	}else{
					
		$vehicleQry	= mysql_query("SELECT gv.customerid, gv.deviceid, gv.vehicleid, gv.vehiclename, gv.model, gv.regnno,gv.fenceid, gv.routeid,
					gv.insurancedate, gv.fcdate, gv.servicedue, gv.engineno, gv.chassisno, gdr.driverid, gdr.drivername, gdr.mobile,
					gd.devicename, gd.status, gd.simcardno, gd.simserialno, gd.simprovider, gd.gprsplan, gd.gprssettings,
					gv.rccopy,gv.insurancecopy,gv.vehiclephoto,gv.permitcopy,gv.fuel_capacity,gv.speedlimit
			 		FROM vehicles gv 
					LEFT OUTER JOIN devices gd ON gd.deviceid = gv.deviceid
					LEFT OUTER JOIN drivers gdr ON gdr.driverid = gv.driverid
					WHERE (gd.devicetype='VTS' OR gd.devicetype='OTS') $cust_qry ORDER BY gv.vehiclename LIMIT $start , $limit");
		while($vehicleRes = mysql_fetch_array($vehicleQry)){
			$fenceid	= $vehicleRes['fenceid'];
			$fenceText  = "";
			if($fenceid!=0){				
				$fenceText  = '<img src="./images/polygon.png" style="cursor:pointer;" title="View Route Path this Vehicle" onClick="Show_Poly_Path('.$vehicleRes['fenceid'].')"/>';
				$fenceText  .= '&#160;&#160;&#160;<img src="./images/remove.png" style="cursor:pointer;" title="Un-Assign Route Path this Vehicle" onClick="UnAssign_Poly_Path('.$vehicleRes['vehicleid'].','.$vehicleRes['fenceid'].')"/>';
			}
			$routeid	= $vehicleRes['routeid'];
			$routeText  = "";
			if($routeid!=0){
				$routeText  = '<img src="./images/routepath.png" style="cursor:pointer;" title="View Route Path this Vehicle" onClick="Show_Route('.$vehicleRes['routeid'].')"/>';
				$routeText  .= '&#160;&#160;&#160;<img src="./images/remove.png" style="cursor:pointer;" title="Un-Assign Route Path this Vehicle" onClick="UnAssign_Route('.$vehicleRes['vehicleid'].','.$vehicleRes['routeid'].')"/>';
			}
			$myData[] = array(
				'customerid'  		=> $vehicleRes['customerid'],
				'customername'  	=> getCustomerName($vehicleRes['customerid']),
				'deviceid'			=> $vehicleRes['deviceid'],
				'driverid'			=> $vehicleRes['driverid'],
				'drivername'		=> $vehicleRes['drivername'],
				'drivermobile'		=> $vehicleRes['mobile'],
				'vehicleid'  		=> $vehicleRes['vehicleid'],
				'vehiclename'   	=> $vehicleRes['vehiclename'],
				'model'				=> $vehicleRes['model'],
				'regnno'   			=> $vehicleRes['regnno'],
				'insurancedate'		=> $vehicleRes['insurancedate']=="0000-00-00"?"":date("d-m-Y",strtotime($vehicleRes['insurancedate'])),
				'fcdate'			=> $vehicleRes['fcdate']=="0000-00-00"?"":date("d-m-Y",strtotime($vehicleRes['fcdate'])),
				'servicedue'		=> $vehicleRes['servicedue']=="0000-00-00"?"":date("d-m-Y",strtotime($vehicleRes['servicedue'])),
				'engineno'			=> $vehicleRes['engineno'],
				'chassisno'			=> $vehicleRes['chassisno'],
				'devicename'		=> $vehicleRes['devicename'],
				'status'			=> $vehicleRes['status'],
				'simcardno'			=> $vehicleRes['simcardno'],
				'simserialno'		=> $vehicleRes['simserialno'],
				'simprovider'		=> $vehicleRes['simprovider'],
				'gprsplan'			=> $vehicleRes['gprsplan'],
				'gprssettings'		=> $vehicleRes['gprssettings'],
				'fuelcapacity'		=> $vehicleRes['fuel_capacity'],
				'speedlimit'		=> $vehicleRes['speedlimit'],
				'rccopy'			=> $vehicleRes['rccopy'],
				'inscopy'			=> $vehicleRes['insurancecopy'],
				'vehiclephoto'		=> $vehicleRes['vehiclephoto'],
				'permitcopy'		=> $vehicleRes['permitcopy'],
				'polypath'			=> $fenceText,
				'routepath'			=> $routeText,
				'realtime'			=> '<img src="./images/view.png" style="cursor:pointer;" title="Track this Vehicle in Realtime" onClick="Show_Gps_Track_Live('.$vehicleRes['deviceid'].')"/>',
				'history'			=> '<img src="./images/history.png" style="cursor:pointer;" title="View the past history of this Vehicle\'s movement" onClick="Show_Gps_Track_History('.$vehicleRes['deviceid'].')"/>',
				'action'			=> ""
			);
		}
	}

    $myData = array('VEHICLES' => $myData, 'totalCount' => $totCnt, 'sess_cust' => $customerid);
	header('Content-Type: application/x-json');
    echo json_encode($myData);
}

//if($todo == "Get_Customer_Details"){
//	if(!preg_match('/showCustomers/',$_SESSION['loadpage'])){
//		$_SESSION['loadpage']	= $_SESSION['loadpage'].",showCustomers";
//	}
//
//	$start	= $_POST['start'];
//	$limit	= $_POST['limit'];
//
//	$totQry	= mysql_query('SELECT * FROM customers WHERE customerid="'.$_POST['customerid'].'"');
//	$totCnt	= mysql_num_rows($totQry);
//
//	if($totCnt == 0){
//		$myData[] = array(
//			'customerid'  	 => 0,
//			'customername'   => "<span class='tableTextM'>No Customers Found</span>"
//		);
//	}elsE{
//		$vehicleQry = mysql_query("SELECT * FROM customers ORDER BY customername LIMIT $start , $limit");
//		while($vehicleRes = mysql_fetch_array($vehicleQry)){
//			$myData[] = array(
//				'customerid'  	 	=> $vehicleRes['customerid'],
//				'customername'   	=> $vehicleRes['customername'],
//				'contactperson'   	=> $vehicleRes['contactperson'],
//				'mobile'			=> $vehicleRes['mobile'],
//				'email'				=> $vehicleRes['email'],
//				'city'				=> $vehicleRes['city'],
//				'addedby'   		=> getTeamMemberName($vehicleRes['addedby'])
//			);
//		}
//	}
//
//    $myData = array('CUSTOMERS' => $myData, 'totalCount' => $totCnt);
//	header('Content-Type: application/x-json');
//    echo json_encode($myData);
//}

if($todo == "Edit_vehicle"){
	$vehicleid  		= $_POST['vehicleid'];
	$customerid  		= $_POST['customerid'];
	//$customername  		= getCustomerName($_POST['customerid']);
	$vehiclename   		= $_POST['vehiclename'];
	$model				= $_POST['model'];
	$regnno   			= $_POST['regnno'];
	$insurancedate		= $_POST['insurancedate'];
	if($insurancedate)
		$insurancedate  = date("Y-m-d",strtotime($insurancedate));
	if($fcdate)
		$fcdate		    = date("Y-m-d",strtotime($fcdate));
	if($servicedue)
		$servicedue		= date("Y-m-d",strtotime($servicedue));
	$engineno			= $_POST['engineno'];
	$chassisno			= $_POST['chassisno'];
	$driverid			= $_POST['vehicle_driverid'];
	$fuelcapacity		= $_POST['fuelcapacity'];
	$speedlimit			= $_POST['speedlimit'];
	
	$chkQry	= mysql_query("SELECT * FROM vehicles WHERE customerid='".$customerid."' AND vehiclename='".$vehiclename."' AND vehicleid!='".$vehicleid."'");
	$chkCnt	= mysql_num_rows($chkQry);
	if($chkCnt == 0){
		/*$vehicleQry = "UPDATE vehicles SET
						vehiclename 		= '".$vehiclename."',
						model				= '".$model."',
						regnno				= '".$regnno."',
						insurancedate		= '".$insurancedate."',
						fcdate				= '".$fcdate."',
						servicedue			= '".$servicedue."',
						engineno			= '".$engineno."',
						chassisno			= '".$chassisno."',
						driverid			= '".$driverid."'
						WHERE vehicleid= '".$vehicleid."'";*/
		$vehicleQry = "UPDATE vehicles SET
						driverid			= '".$driverid."',
						fuel_capacity		= '".$fuelcapacity."',
						speedlimit			= '".$speedlimit."'
						WHERE vehicleid= '".$vehicleid."'";
		$vehicleRes = mysql_query($vehicleQry);
		if($vehicleRes){
			$fileUploadErr = "";
			$rccopyurl = "";
			if( isset($_FILES['rccopy']) && $_FILES['rccopy']!='' ){
				$rccopy	= $_FILES['rccopy']['name'];
				$rccopyurl = "../../photos/vehicle/" . $customerid."_".$vehicleid."_".$_FILES["rccopy"]["name"];
				$rcflag="NO";
				$rcSize = $_FILES["rccopy"]["size"] / 1024;
				if($rcSize<=500){
					if(move_uploaded_file($_FILES["rccopy"]["tmp_name"],$rccopyurl)){
						$rcflag="YES";
					}else{
						$rccopyurl = './images/emptyimg.png';
					}
					if($rcflag=="YES"){
						$updatePhotoQry = "UPDATE vehicles set rccopy ='".$rccopyurl."'
						WHERE vehicleid = $vehicleid" ;				
						$updatePhotoRes = mysql_query($updatePhotoQry);
					}
				}else{
					$fileUploadErr .= "RC Copy File size should be less then to 500Kb.<br>";
				}
			}
			
			$inscopyurl = "";
			
			if( isset($_FILES['inscopy']) && $_FILES['inscopy']!='' ){
				$inscopy	= $_FILES['inscopy']['name'];
				$inscopyurl = "../../photos/vehicle/" . $customerid."_".$vehicleid."_".$_FILES["inscopy"]["name"];
				$insflag="NO";
				$insSize = $_FILES["inscopy"]["size"] / 1024;
				if($insSize<=500){
					if(move_uploaded_file($_FILES["inscopy"]["tmp_name"],$inscopyurl)){
						$insflag="YES";
					}else{
						$inscopyurl = './images/emptyimg.png';
					}
					if($insflag=="YES"){	
						$updatePhotoQry = "UPDATE vehicles set insurancecopy ='".$inscopyurl."'
											WHERE vehicleid = $vehicleid" ;
						$updatePhotoRes = mysql_query($updatePhotoQry);
					}
				}else{
					$fileUploadErr .= "Insurance Copy File size should be less then to 500Kb.<br>";
				}
				
			}
			
			$vehiclephotourl = "";
			if( isset($_FILES['vehiclephoto']) && $_FILES['vehiclephoto']!='' ){
				$vehiclephoto	= $_FILES['vehiclephoto']['name'];
				$vehiclephotourl = "../../photos/vehicle/" . $customerid."_".$vehicleid."_".$_FILES["vehiclephoto"]["name"];
				$vehphotoflag="NO";
				$vehSize = $_FILES["vehiclephoto"]["size"] / 1024;
				if($vehSize<=500){
					if(move_uploaded_file($_FILES["vehiclephoto"]["tmp_name"],$vehiclephotourl)){
						$vehphotoflag="YES";
					}else{
						$vehiclephotourl = './images/emptyimg.png';
					}
					if($vehphotoflag=="YES"){	
						$updatePhotoQry = "UPDATE vehicles set vehiclephoto ='".$vehiclephotourl."'
											WHERE vehicleid = $vehicleid" ;
						$updatePhotoRes = mysql_query($updatePhotoQry);
					}
				}else{
					$fileUploadErr .= "Vehicle Photo File size should be less then to 500Kb.<br>";
				}
			}			
			
			$permitcopyurl = "";
			if( isset($_FILES['permitcopy']) && $_FILES['permitcopy']!='' ){
				$permitcopy	= $_FILES['permitcopy']['name'];
				$permitcopyurl = "../../photos/vehicle/" . $customerid."_".$vehicleid."_".$_FILES["permitcopy"]["name"];
				$permitflag="NO";
				$perSize = $_FILES["permitcopy"]["size"] / 1024;
				if($perSize<=500){
					if(move_uploaded_file($_FILES["permitcopy"]["tmp_name"],$permitcopyurl)){
						$permitflag="YES";
					}else{
						$permitcopyurl = './images/emptyimg.png';
					}
					if($permitflag=="YES"){
						$updatePhotoQry = "UPDATE vehicles set permitcopy ='".$permitcopyurl."'
						WHERE vehicleid = $vehicleid" ;
						$updatePhotoRes = mysql_query($updatePhotoQry);
					}
				}else{
					$fileUploadErr .= "Permit Copy File size should be less then to 500Kb.<br>";
				}
			}
			if($fileUploadErr!=""){
				$fileUploadErr	= substr($fileUploadErr, 0, count($fileUploadErr)-5);
			}
			echo "{ success: true,msg:'Details of the vehicle <b>$vehiclename</b> Updated Successfully.', fileUploadErr:'$fileUploadErr'}";
		}else{
			//$error	= mysql_error();
			echo "{ success: false,msg:'Error while updating vehicle details'}";
		}
	}else{
		echo "{ success: false,msg:'Already there is some other vehicle with the name <b>$vehiclename</b> Exists.'}";
	}
}

?>