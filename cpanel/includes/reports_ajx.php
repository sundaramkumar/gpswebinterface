<?php
session_start();
include_once("../config/dbconn.php");
include_once("./functions.php");

$customerid = $_SESSION['customerid'];
$todo = $_POST['todo'];
//error_reporting(E_ALL);
if($todo == "Get_TripSummary_Reports"){
	$vehicleid 	= $_POST['vehicleid'];
	$startdate	= $_POST['startdate'];
	$enddate	= $_POST['enddate'];
	
	$startHtml 	= "<span class='tableTextM'>No Records Found</span>";
	$endHtml   	= "<span class='tableTextM'>No Records Found</span>";
	$milageHtml	= "<span class='tableTextM'>No Records Found</span>";
	$driverHtml = "<span class='tableTextM'>No Records Found</span>";
	
	$tripQry = mysql_query("SELECT gdt.gpsid, gdt.deviceIMEI, gdt.latitude, gdt.longitude, CONVERT_TZ(gdt.posdatetime,'+00:00','+05:30') as gpsdatetime, 
							gdt.speed, gdt.fuel,gdt.ignition, gdt.door, gdt.address, gd.deviceid, 
							gv.vehiclename, gv.regnno, gv.fuel_capacity, gv.speedlimit, gv.fuellimit, gv.routelimit, gdr.drivername, gdr.mobile
							FROM gpsdata gdt
							LEFT OUTER JOIN devices gd ON gd.deviceIMEI = gdt.deviceIMEI
							LEFT OUTER JOIN vehicles gv ON gv.deviceid = gd.deviceid
							LEFT OUTER JOIN drivers gdr ON gdr.driverid	 = gv.driverid
							WHERE gv.vehicleid='".$vehicleid."'
							AND posdatetime BETWEEN CONVERT_TZ('$startdate','+05:30','+00:00') AND CONVERT_TZ('$enddate','+05:30','+00:00') 
							ORDER BY gpsdatetime ASC");
	$tripCnt = mysql_num_rows($tripQry);
	$rowno = 1;
	$startFuel = "";
	$endFuel  = "";
	$prevLatPoint = "";
	$prevLngPoint = "";
	$totalDistance = 0;
	$totalMeters   = 0;
	$tripStart = false;
	$rowInc = 1;
	$prevIgnition = "";
	$prevlatlngdt = "";
	$ignOffFlag = true;
	$idleOnStartDt = "";
	$overspeedCnt = 0;
	$ignitionCnt  = 0;
	while($tripRes = mysql_fetch_array($tripQry)){
		$gpsid		= $tripRes['gpsid'];
		$latitude	= $tripRes['latitude'];
		$longitude	= $tripRes['longitude'];
		$latlngdt   = $tripRes['gpsdatetime'];
		$voltage	= $tripRes['fuel'];
		
		$ignition	= $tripRes['ignition'];
		$door		= $tripRes['door'];
		$speed		= $tripRes['speed'];
			
		$address	= get_latlan_address($latitude, $longitude);//$tripRes['address'];
		$gpsdatetime= date("d-m-Y H:i:s",strtotime($tripRes['gpsdatetime']));
		
		$speedlimit	= $tripRes['speedlimit'];
		
		if($prevLatPoint!="" && $prevLngPoint!=""){
			$distance = LatLng_Distance($prevLatPoint, $prevLngPoint, $latitude, $longitude, 'K');
			$totalDistance += $distance;
			$totalMeters 	+= round(($distance*1000),2);
		}
		
		if(!$tripStart && $ignition == "ON" && $totalMeters>10){
			$tripStart = true;
			$ignOffFlag = true;
			if($address=="" || $address==null){
				$address	= get_latlan_address($latitude, $longitude);
				mysql_query("UPDATE gpsdata SET address='".$address."' WHERE gpsid='".$gpsid."'");
			}
		}
		
		if($ignition=="OFF" && $prevIgnition=="OFF"){
			$ignOffFlag = false;
		}
		
		if($ignition=="ON" && $prevIgnition=="OFF"){
			$ignOffFlag = true;
		}
		
		if($rowInc == $tripCnt){
			$ignOffFlag = true;
		}
		
		if($tripStart && $ignOffFlag){
			$actualFuel = 0;
			if($voltage=='00000000' || $voltage==""){
				$actualFuel = 0;
			}else{
				$deviceid	= $tripRes['deviceid'];
				$actualFuel = round(calculateFuel($deviceid,$voltage),2);
			}		
		
			if($ignition=="ON" && $startFuel=="" && $actualFuel>0){
				$startFuel = $actualFuel;
			}
			
			if($ignition=="ON" && $actualFuel>0){
				$endFuel = $actualFuel;
			}
			
			if($ignition=="ON")
				$ignitionSts = '<span class="tableTextG">'.$ignition.'</span>';
			else
				$ignitionSts = '<span class="tableTextRed">'.$ignition.'</span>';
			
			/* if($address=="" || $address==null){
				if($rowno==1){
					$address	= get_latlan_address($latitude, $longitude);
					mysql_query("UPDATE gpsdata SET address='".$address."' WHERE gpsid='".$gpsid."'");
				}

				if($rowno == $tripCnt){
					$address	= get_latlan_address($latitude, $longitude);
					mysql_query("UPDATE gpsdata SET address='".$address."' WHERE gpsid='".$gpsid."'");
				}
			} */
			
			if($rowno == 1){
				$startHtml = '<table width="100%" cellspacing="1" cellpadding="1" class="tableTextD">';
				$startHtml .= '<tr><td width="30%" align="right"><b>Engine :</b></td><td align="left" class="tableTextM" style="padding:0 0 0 2">'.$ignitionSts.'</td></tr>';
				$startHtml .= '<tr><td width="30%" align="right"><b>Speed :</b></td><td align="left" class="tableTextM" style="padding:0 0 0 2">'.$speed.' Kms</td></tr>';
				$startHtml .= '<tr><td width="30%" align="right"><b>Fuel :</b></td><td align="left" class="tableTextM" style="padding:0 0 0 2">'.$actualFuel.' Ltrs</td></tr>';
				$startHtml .= '<tr><td width="30%" align="right"><b>Date :</b></td><td align="left" class="tableTextM" style="padding:0 0 0 2">'.$gpsdatetime.'</td></tr>';
				$startHtml .= '<tr><td width="30%" align="right" valign="top"><b>Address :</b></td><td align="left" class="tableTextM" style="padding:0 0 0 2">'.$address.'</td></tr>';
				$startHtml .= '</table>';
			}
			
			if(($rowInc-1) == $tripCnt || ($ignition=="OFF" && $prevIgnition=="ON")){
				if($address=="" || $address==null){
					$address	= get_latlan_address($latitude, $longitude);
					mysql_query("UPDATE gpsdata SET address='".$address."' WHERE gpsid='".$gpsid."'");
				}
				$endHtml = '<table width="100%" cellspacing="1" cellpadding="1" class="tableTextD">';
				$endHtml .= '<tr><td width="30%" align="right"><b>Engine :</b></td><td align="left" class="tableTextM" style="padding:0 0 0 2">'.$ignitionSts.'</td></tr>';
				$endHtml .= '<tr><td width="30%" align="right"><b>Speed :</b></td><td align="left" class="tableTextM" style="padding:0 0 0 2">'.$speed.' Kms</td></tr>';
				$endHtml .= '<tr><td width="30%" align="right"><b>Fuel :</b></td><td align="left" class="tableTextM" style="padding:0 0 0 2">'.$actualFuel.' Ltrs</td></tr>';
				$endHtml .= '<tr><td width="30%" align="right"><b>Date :</b></td><td align="left" class="tableTextM" style="padding:0 0 0 2">'.$gpsdatetime.'</td></tr>';
				$endHtml .= '<tr><td width="30%" align="right" valign="top"><b>Address :</b></td><td align="left" class="tableTextM" style="padding:0 0 0 2">'.$address.'</td></tr>';
				$endHtml .= '</table>';
			}		
			
			$idle = "";
			//$cnt = count($myData);
			//$idle = count($myData)."-".$myData[intval($rowno)]['speed'];
			if($prevlatlngdt!="" && $ignition=="OFF"){
				$idle = timeDiff($latlngdt, $prevlatlngdt);
				if($idle!="" && $idle!="00-00-00")
					$idle = '<span class="tableTextBlue">'.$idle.'</span>';
				
			}
			
			if($prevIgnition=="OFF" && $ignition=="ON" && $prevLatPoint != $latitude && $prevLngPoint != $longitude){
				$ignitionCnt++;
			}
			
			$overspeed = "";
			if(intval($speed)>$speedlimit){
				$overspeed = '<span class="tableTextRed">'.$speed.'</span>';
				$overspeedCnt++;
			}
			
			if($prevLatPoint == $latitude && $prevLngPoint == $longitude && $idle!=""){
				//$overspeed = "same";
				if($idleOnStartDt == "")
					$idleOnStartDt = $latlngdt;
			}
			
			
			if($prevLatPoint != $latitude && $prevLngPoint != $longitude){
				if($idleOnStartDt !=""){
					$idle = timeDiff($latlngdt, $idleOnStartDt);
					if($idle!="" && $idle!="00-00-00")
						$idle = '<span class="tableTextBlue">'.$idle.'</span>';
					$idleOnStartDt = "";
				}
				$myData[] = array(
					'gpsid'  	=> $gpsid,
					'latitude'	=> $latitude,
					'longitude'	=> $longitude,
					'speed'		=> $speed,
					'fuel'		=> $actualFuel,
					'datetime' 	=> $gpsdatetime,
					'distance' 	=> $totalDistance." Kms",
					'ignition'	=> $ignitionSts,
					'door'		=> $door,
					'address'	=> $address,
					'idle'		=> $idle,
					'overspeed' => $overspeed
				);
			}
			$prevlatlngdt = $tripRes['gpsdatetime'];
			$rowno++;
		}
		
		$prevLatPoint = $tripRes['latitude'];
		$prevLngPoint = $tripRes['longitude'];
		$prevIgnition = $tripRes['ignition'];
		
		$rowInc++;
	}
	
	if($tripCnt>0){
		$milage = 0;
		$milageHtml = '<table width="100%" cellspacing="1" cellpadding="1" class="tableTextD">';
		$milageHtml .= '<tr><td width="33%" align="right"><b>Total Distance :</b></td><td align="left" class="tableTextM" style="padding:0 0 0 2">'.$totalDistance.' Km</td></tr>';
		$milageHtml .= '<tr><td width="30%" align="right"><b>Start Fuel :</b></td><td align="left" class="tableTextM" style="padding:0 0 0 2">'.$startFuel.' Ltr</td></tr>';
		$milageHtml .= '<tr><td width="30%" align="right"><b>End Fuel :</b></td><td align="left" class="tableTextM" style="padding:0 0 0 2">'.$endFuel.' Ltr</td></tr>';
		$milageHtml .= '<tr><td width="30%" align="right"><b>Milage :</b></td><td align="left" class="tableTextM" style="padding:0 0 0 2">'.$milage.'</td></tr>';
		$milageHtml .= '</table>';
	}
	
	$driverHtml = '<table width="100%" cellspacing="1" cellpadding="1" class="tableTextD">';
	$driverHtml .= '<tr><td width="30%" align="right"><b>OverSpeed :</b></td><td align="left" class="tableTextM" style="padding:0 0 0 2">'.$overspeedCnt.'</td></tr>';
	$driverHtml .= '<tr><td width="30%" align="right"><b>Engine Off :</b></td><td align="left" class="tableTextM" style="padding:0 0 0 2">'.$ignitionCnt.'</td></tr>';
	$driverHtml .= '<tr><td width="30%" align="right"><b>HarshBreak :</b></td><td align="left" class="tableTextM" style="padding:0 0 0 2">'.$harshbreak.'</td></tr>';
	$driverHtml .= '</table>';
	
	//echo "{ success: true, startHtml:'$startHtml', endHtml:'$endHtml', milageHtml:'$milageHtml'}";
	
	$myData = array('TRIP' => $myData, 'totalCount' => $tripCnt, 'startHtml' => $startHtml, 'endHtml' => $endHtml, 'milageHtml' => $milageHtml, 'driverHtml'=>$driverHtml);
	header('Content-Type: application/x-json');
    echo json_encode($myData);
}

if($todo == "Get_History_Reports"){
	$deviceid 	= $_POST['deviceid'];
	$startdate	= $_POST['startdate'];
	$enddate	= $_POST['enddate'];

	$page	= $_POST['page'];
	$start	= $_POST['start'];
	$limit	= $_POST['limit'];

	if($page==1)
		$start = 0;
	else
		$start	= (($page-1)*$limit)+1;


	$totQry = mysql_query("SELECT gdt.gpsid, gdt.deviceIMEI, gdt.latitude, gdt.longitude, CONVERT_TZ(gdt.posdatetime,'+00:00','+05:30') as gpsdatetime, gdt.speed, gdt.fuel, gdt.address FROM gpsdata gdt
					LEFT OUTER JOIN devices gd ON gd.deviceIMEI = gdt.deviceIMEI
					WHERE gd.deviceid='".$deviceid."' AND posdatetime BETWEEN CONVERT_TZ('$startdate','+05:30','+00:00') AND CONVERT_TZ('$enddate','+05:30','+00:00') ORDER BY CONVERT_TZ(gdt.posdatetime,'+00:00','+05:30') ASC");
	$totCnt = mysql_num_rows($totQry);
/*
 echo "SELECT gdt.gpsid, gdt.deviceIMEI, gdt.latitude, gdt.longitude, CONVERT_TZ(gdt.posdatetime,'+00:00','+05:30') as gpsdatetime, gdt.speed, gdt.fuel, gdt.address FROM gpsdata gdt
					LEFT OUTER JOIN devices gd ON gd.deviceIMEI = gdt.deviceIMEI
					WHERE gd.deviceid='".$deviceid."' AND posdatetime BETWEEN CONVERT_TZ('$startdate','+05:30','+00:00') AND CONVERT_TZ('$enddate','+05:30','+00:00') ORDER BY CONVERT_TZ(gdt.posdatetime,'+00:00','+05:30') ASC";
					
*/				
	/*echo "SELECT gdt.gpsid, gdt.deviceIMEI, gdt.latitude, gdt.longitude, gdt.posdatetime, gdt.speed, gdt.fuel FROM gpsdata gdt
					LEFT OUTER JOIN devices gd ON gd.deviceIMEI = gdt.deviceIMEI
					WHERE gd.deviceid='".$deviceid."' AND posdatetime BETWEEN '$startdate' AND '$enddate' ORDER BY gdt.posdatetime ASC LIMIT $start, $limit";*/

	$historyQry = mysql_query("SELECT gdt.gpsid, gdt.deviceIMEI, gdt.latitude, gdt.longitude, CONVERT_TZ(gdt.posdatetime,'+00:00','+05:30') as gpsdatetime, gdt.speed, gdt.fuel, gdt.address FROM gpsdata gdt
					LEFT OUTER JOIN devices gd ON gd.deviceIMEI = gdt.deviceIMEI
					WHERE gd.deviceid='".$deviceid."' AND posdatetime BETWEEN CONVERT_TZ('$startdate','+05:30','+00:00') AND CONVERT_TZ('$enddate','+05:30','+00:00') ORDER BY CONVERT_TZ(gdt.posdatetime,'+00:00','+05:30') ASC LIMIT $start, $limit");
	$historyCnt = mysql_num_rows($historyQry);
	//echo $historyQry;
	if($totCnt == 0){
		$myData[] = array(
			'gpsid'  	 => 0,
			'datetime'   => "<span class='tableTextM'>No Records Found</span>"
		);
	}else{
		$i=1;

		//Required for calculating distance between two points
		$totalDistance = 0.0;
		$prevlat = "";
		$prevlon = "";

		while($historyRes = mysql_fetch_array($historyQry)){
			$gpsid		= $historyRes['gpsid'];
			$address	= $historyRes['address'];
			$latitude	= $historyRes['latitude'];
			$longitude	= $historyRes['longitude'];
			$speed		= $historyRes['speed'];
			$voltage	= $historyRes['fuel'];

			/***
			 *
			 * calcualte distance between two points
			 * this is not yet used. have to check the output is correct
			 * then have to use
			 *
			 ****/
			//if($prevlat=="" || $prevlon==""){
			//	//$totalDistance = $totalDistance + distance($prevlat,$latitude,$prevlon,$longitude,"K")
			//	$prevlat = $latitude;
			//	$prevlon = $longitude;
			//	$totalDistance = 0.0;
			//}else{
			//	if($prevlat==$latitude && $prevlon==$longitude){
			//		$totalDistance = 0.0;
			//	}else{
			//		$totalDistance = $totalDistance + distance($prevlat,$latitude,$prevlon,$longitude,"K");
			//		$prevlat = $latitude;
			//		$prevlon = $longitude;
			//	}
			//}


			/***
			 *
			 * Calculate fuel reading
			 *
			 *
			 ****/
			//if($voltage=='00000000'){
			//	$actualFuel = "Empty";
			//}else{
			//	/*$fuel = number_format($voltage); //
			//	$fstrlen = strlen($fuel);
			//	$decimalpart = substr($fuel,-2);
			//	$intPart = substr($fuel,0,$fstrlen-2);
			//	$actualVoltage = $intPart.".".$decimalpart;*/
			//	$fuel 		= $voltage; //number_format($voltage);
			//	$fstrlen 	= strlen($fuel);
			//	$decimalpart = substr($fuel,2,2);
			//	$intPart = substr($fuel,0,2);
			//	$actualVoltage = $intPart.".".$decimalpart;
			//
			//	$actualFuel = round(calculateFuel($deviceid,$actualVoltage),2)." Litres";
			//}
			if($voltage=='00000000' || $voltage==""){
				$actualFuel = "Empty";
			}else{
				$actualFuel = round(calculateFuel($deviceid,$voltage),2)." Litres";
			}

			if($address=="" || $address==null){
				if($i==1){
					$address	= get_latlan_address($latitude, $longitude);
					mysql_query("UPDATE gpsdata SET address='".$address."' WHERE gpsid='".$gpsid."'");
				}

				if($i == $historyCnt){
					$address	= get_latlan_address($latitude, $longitude);
					mysql_query("UPDATE gpsdata SET address='".$address."' WHERE gpsid='".$gpsid."'");
				}
			}

			if($address=="" || $address==null){
				$address	= "<span id='histaddr_".$gpsid."'><a href='javascript: getHistDeviceAddress($gpsid,\"$latitude\", \"$longitude\")'>View Address</a></span>"; //getDeviceAddress($latitude, $longitude);
			}


			/**
			 *
			 * for timezone conversion
			 *
			 ***/

			/*$dt = date("Y-m-d H:i:s",strtotime($historyRes['posdatetime']));

			$utc_date = DateTime::createFromFormat(
							'Y-m-d G:i:s',
							$dt,
							new DateTimeZone('UTC')
			);

			$nyc_date = $utc_date;
			$ctz = isset($_SESSION['timzone'])?$_SESSION['timzone']:'Asia/Calcutta';
			$nyc_date->setTimeZone(new DateTimeZone($ctz)); //'Asia/Calcutta'));

			$show_time = $nyc_date->format('Y-m-d g:i:s A'); // output: 2011-04-26 10:45 PM*/
			$gpsdatetime	= date("d-m-Y H:i:s",strtotime($historyRes['gpsdatetime']));

			$myData[] = array(
				'gpsid'  	=> $gpsid,
				'latitude'	=> $latitude,
				'longitude'	=> $longitude,
				'speed'		=> $speed,
				'fuel'		=> $actualFuel,
				'datetime'  => $gpsdatetime,
				'address'	=> $address
			);
			//'fuel'		=> $fuel,
			//echo $tmpstr = $gpsid."|".$latitude."|".$longitude."|".$speed."|".$fuel."|".$show_time."|".$address."\r\n";
			////'datetime'  => date("d-m-Y H:i:s",strtotime($historyRes['posdatetime'])),
			//file_put_contents("/tmp/test",$tmpstr,FILE_APPEND);
			$i++;

			//print_r($myData);

		}
	}

	$myData = array('HISTORY' => $myData, 'totalCount' => $totCnt);
	header('Content-Type: application/x-json');
	//file_put_contents("/tmp/test",json_encode($myData1));
    echo json_encode($myData);
}


if($_REQUEST['todo'] == 'Generate_Excel_History_Reports'){
	$deviceid 	= $_REQUEST['deviceid'];
	$startdate	= $_REQUEST['startdate'];
	$enddate	= $_REQUEST['enddate'];

	$deviceIMEI	= "";

	$historyQry = mysql_query("SELECT gdt.gpsid, gdt.deviceIMEI, gdt.latitude, gdt.longitude, CONVERT_TZ(gdt.posdatetime,'+00:00','+05:30') as gpsdatetime, gdt.speed, gdt.fuel, gdt.address FROM gpsdata gdt
					LEFT OUTER JOIN devices gd ON gd.deviceIMEI = gdt.deviceIMEI
					WHERE gd.deviceid='".$deviceid."' AND posdatetime BETWEEN CONVERT_TZ('$startdate','+05:30','+00:00') AND CONVERT_TZ('$enddate','+05:30','+00:00') ORDER BY CONVERT_TZ(gdt.posdatetime,'+00:00','+05:30') ASC ");
	$historyCnt = mysql_num_rows($historyQry);
	if($historyCnt == 0){
		echo '{ success: false,Msg:"No Matching Records Founds"}';
	}else{

		require_once('../PHPExcel.php');
		require_once('../PHPExcel/Reader/Excel2007.php');
		require_once '../PHPExcel/IOFactory.php';
		ini_set("memory_limit", "2000M");
		//Execution Time unlimited
		set_time_limit (0);

		$objPHPExcel = new PHPExcel();
		// Set properties
		//echo date('H:i:s') . " Set properties\n";
		$objPHPExcel->getProperties()->setCreator("Testplan")
															 ->setLastModifiedBy("History Reports")
															 ->setTitle("Office 2007 XLSX History Document")
															 ->setSubject("History Reports")
															 ->setDescription("History Details")
															 ->setKeywords("office 2007 openxml php")
															 ->setCategory("Export");
		$objPHPExcel->setActiveSheetIndex(0);
		$objPHPExcel->getActiveSheet()->setCellValue('A3', "Date Time");
		$objPHPExcel->getActiveSheet()->getColumnDimension('A')->setWidth(20);
		/*$objPHPExcel->getActiveSheet()->setCellValue('B3', "Latitude");
		$objPHPExcel->getActiveSheet()->getColumnDimension('B')->setWidth(20);
		$objPHPExcel->getActiveSheet()->setCellValue('C3', "Longitude");
		$objPHPExcel->getActiveSheet()->getColumnDimension('C')->setWidth(20);*/
		$objPHPExcel->getActiveSheet()->setCellValue('B3', "Speed");
		$objPHPExcel->getActiveSheet()->getColumnDimension('B')->setWidth(20);
		$objPHPExcel->getActiveSheet()->setCellValue('C3', "Fuel");
		$objPHPExcel->getActiveSheet()->getColumnDimension('C')->setWidth(20);
		$objPHPExcel->getActiveSheet()->setCellValue('D3', "Address");
		$objPHPExcel->getActiveSheet()->getColumnDimension('D')->setWidth(100);

		$rowno = 3;
		//Color for the Header
		$objPHPExcel->getActiveSheet()->getStyle('A3:F3')->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
		$objPHPExcel->getActiveSheet()->getStyle('A3:F3')->getFill()->getStartColor()->setARGB(PHPExcel_Style_Color::COLOR_GREEN);
		$objPHPExcel->getActiveSheet()->getStyle('A3:A'.$rowno)
				->getAlignment()->setWrapText(true)->setVertical(PHPExcel_Style_Alignment::VERTICAL_TOP);
		$i=1;
		while($historyRes = mysql_fetch_array($historyQry)){
			$gpsid		= $historyRes['gpsid'];
			$address	= $historyRes['address'];
			$latitude	= $historyRes['latitude'];
			$longitude	= $historyRes['longitude'];
			$speed	= $historyRes['speed'];
			$voltage	= $historyRes['fuel'];

			/***
			 *
			 * Calculate fuel reading
			 *
			 *
			 ****/
			//if($voltage=='00000000'){
			//	$actualFuel = "Empty";
			//}else{
			//	/*$fuel = number_format($voltage); //
			//	$fstrlen = strlen($fuel);
			//	$decimalpart = substr($fuel,-2);
			//	$intPart = substr($fuel,0,$fstrlen-2);
			//	$actualVoltage = $intPart.".".$decimalpart;*/
			//
			//	$fuel 		= $voltage; //number_format($voltage);
			//	$fstrlen 	= strlen($fuel);
			//	$decimalpart = substr($fuel,2,2);
			//	$intPart = substr($fuel,0,2);
			//	$actualVoltage = $intPart.".".$decimalpart;
			//
			//	$actualFuel = round(calculateFuel($deviceid,$actualVoltage),2)." Litres";
			//}
			if($voltage=='00000000' || $voltage==""){
				$actualFuel = "Empty";
			}else{
				$actualFuel = round(calculateFuel($deviceid,$voltage),2)." Litres";
			}

			if($address=="" || $address==null){
				if($i==1){
					$address	= get_latlan_address($latitude, $longitude);
					mysql_query("UPDATE gpsdata SET address='".$address."' WHERE gpsid='".$gpsid."'");
				}

				if($i == $historyCnt-1){
					$address	= get_latlan_address($latitude, $longitude);
					mysql_query("UPDATE gpsdata SET address='".$address."' WHERE gpsid='".$gpsid."'");
				}
			}

			$rowno++;
			$deviceIMEI	= $historyRes['deviceIMEI'];

			/**
			 *
			 * for timezone conversion
			 *
			 ***/

			$gpsdatetime = date("d-m-Y H:i:s",strtotime($historyRes['gpsdatetime']));

			//$objPHPExcel->getActiveSheet()->setCellValue('A' . $rowno, date("d-m-Y H:i:s",strtotime($historyRes['posdatetime'])));
			$objPHPExcel->getActiveSheet()->setCellValue('A' . $rowno, $gpsdatetime);

			//$objPHPExcel->getActiveSheet()->setCellValue('B' . $rowno, $historyRes['latitude']);
			//$objPHPExcel->getActiveSheet()->setCellValue('C' . $rowno, $historyRes['longitude']);
			$objPHPExcel->getActiveSheet()->setCellValue('B' . $rowno, $speed);
			$objPHPExcel->getActiveSheet()->setCellValue('C' . $rowno, $actualFuel);
			$objPHPExcel->getActiveSheet()->setCellValue('D' . $rowno, $address);

			$i++;
		}
	}

	$filename	= $deviceIMEI."-".date("d-m-Y H:i:s",strtotime($startdate))."-".date("d-m-Y H:i:s",strtotime($enddate)).".xlsx";

	$objPHPExcel->setActiveSheetIndex(0);
	header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
	header('Content-Disposition: attachment;filename='.$filename);
	header('Cache-Control: max-age=0');
	$objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
	$objWriter->save('php://output');
}

if($todo == "Get_Speed_Reports"){
	$deviceid 	= $_POST['deviceid'];
	$startdate	= $_POST['startdate'];
	$enddate	= $_POST['enddate'];

	$page	= $_POST['page'];
	$start	= $_POST['start'];
	$limit	= $_POST['limit'];

	if($page==1)
		$start = 0;
	else
		$start	= (($page-1)*$limit)+1;

	$totQry = mysql_query("SELECT gdt.gpsid, gdt.deviceIMEI, gdt.latitude, gdt.longitude, CONVERT_TZ(gdt.posdatetime,'+00:00','+05:30') as gpsdatetime, gdt.speed, gdt.fuel, gdt.address FROM gpsdata gdt
					LEFT OUTER JOIN devices gd ON gd.deviceIMEI = gdt.deviceIMEI
					WHERE gd.deviceid='".$deviceid."' AND 
					posdatetime BETWEEN CONVERT_TZ('$startdate','+05:30','+00:00') AND CONVERT_TZ('$enddate','+05:30','+00:00') AND speed>0 
					ORDER BY gpsdatetime ASC");
	$totCnt = mysql_num_rows($totQry);

	$historyQry = mysql_query("SELECT gdt.gpsid, gdt.deviceIMEI, gdt.latitude, gdt.longitude, CONVERT_TZ(gdt.posdatetime,'+00:00','+05:30') as gpsdatetime, gdt.speed, gdt.fuel, gdt.address FROM gpsdata gdt
					LEFT OUTER JOIN devices gd ON gd.deviceIMEI = gdt.deviceIMEI
					WHERE gd.deviceid='".$deviceid."' AND 
					posdatetime BETWEEN CONVERT_TZ('$startdate','+05:30','+00:00') AND CONVERT_TZ('$enddate','+05:30','+00:00') AND speed>0 
					ORDER BY gpsdatetime ASC LIMIT $start, $limit");
	$historyCnt = mysql_num_rows($historyQry);
	//echo $historyQry;
	if($totCnt == 0){
		$myData[] = array(
			'gpsid'  	 => 0,
			'datetime'   => "<span class='tableTextM'>No Records Found</span>"
		);
	}else{
		$i=1;

		//Required for calculating distance between two points
		$totalDistance = 0.0;
		$prevlat = "";
		$prevlon = "";

		while($historyRes = mysql_fetch_array($historyQry)){
			$gpsid		= $historyRes['gpsid'];
			$address	= $historyRes['address'];
			$latitude	= $historyRes['latitude'];
			$longitude	= $historyRes['longitude'];
			$speed		= $historyRes['speed'];
			$voltage	= $historyRes['fuel'];

			/***
			 *
			 * calcualte distance between two points
			 * this is not yet used. have to check the output is correct
			 * then have to use
			 *
			 ****/
			//if($prevlat=="" || $prevlon==""){
			//	//$totalDistance = $totalDistance + distance($prevlat,$latitude,$prevlon,$longitude,"K")
			//	$prevlat = $latitude;
			//	$prevlon = $longitude;
			//	$totalDistance = 0.0;
			//}else{
			//	if($prevlat==$latitude && $prevlon==$longitude){
			//		$totalDistance = 0.0;
			//	}else{
			//		$totalDistance = $totalDistance + distance($prevlat,$latitude,$prevlon,$longitude,"K");
			//		$prevlat = $latitude;
			//		$prevlon = $longitude;
			//	}
			//}


			/***
			 *
			 * Calculate fuel reading
			 *
			 *
			 ****/
			//if($voltage=='00000000' || $voltage==''){
			//	$actualFuel = "Empty";
			//}else{
			//	/* $fuel = number_format($voltage); //
			//	$fstrlen = strlen($fuel);
			//	$decimalpart = substr($fuel,-2);
			//	$intPart = substr($fuel,0,$fstrlen-2);
			//	$actualVoltage = $intPart.".".$decimalpart; */
			//
			//	$fuel 		= $voltage; //number_format($voltage);
			//	$fstrlen 	= strlen($fuel);
			//	$decimalpart = substr($fuel,2,2);
			//	$intPart = substr($fuel,0,2);
			//	$actualVoltage = $intPart.".".$decimalpart;
			//
			//	$actualFuel = round(calculateFuel($deviceid,$actualVoltage),2)." Litres";
			//}
			////$actualFuel = "Empty";
			if($voltage=='00000000' || $voltage==""){
				$actualFuel = "Empty";
			}else{
				$actualFuel = round(calculateFuel($deviceid,$voltage),2)." Litres";
			}
			
			if($address=="" || $address==null){
				if($i==1){
					$address	= get_latlan_address($latitude, $longitude);
					mysql_query("UPDATE gpsdata SET address='".$address."' WHERE gpsid='".$gpsid."'");
				}

				if($i == $historyCnt){
					$address	= get_latlan_address($latitude, $longitude);
					mysql_query("UPDATE gpsdata SET address='".$address."' WHERE gpsid='".$gpsid."'");
				}
			}

			if($address=="" || $address==null){
				$address	= "<span id='histaddr_".$gpsid."'><a href='javascript: getHistDeviceAddress($gpsid,\"$latitude\", \"$longitude\")'>View Address</a></span>"; //getDeviceAddress($latitude, $longitude);
			}

			/**
			 *
			 * for timezone conversion
			 *
			 ***/

			$gpsdatetime = date("d-m-Y H:i:s",strtotime($historyRes['gpsdatetime']));

			$myData[] = array(
				'gpsid'  	=> $gpsid,
				'latitude'	=> $latitude,
				'longitude'	=> $longitude,
				'speed'		=> $speed,
				'fuel' 		=> $actualFuel,
				'datetime'  => $gpsdatetime,
				'address'	=> $address
			);
			//'fuel'		=> $fuel,
			//echo $tmpstr = $gpsid."|".$latitude."|".$longitude."|".$speed."|".$fuel."|".$show_time."|".$address."\r\n";
			////'datetime'  => date("d-m-Y H:i:s",strtotime($historyRes['posdatetime'])),
			//file_put_contents("/tmp/test",$tmpstr,FILE_APPEND);
			$i++;

			//print_r($myData);

		}
	}

	$myData = array('HISTORY' => $myData, 'totalCount' => $totCnt);
	header('Content-Type: application/x-json');
	//file_put_contents("/tmp/test",json_encode($myData1));
    echo json_encode($myData);
}

if($_REQUEST['todo'] == 'Generate_Excel_Speed_Reports'){
	$deviceid 	= $_REQUEST['deviceid'];
	$startdate	= $_REQUEST['startdate'];
	$enddate	= $_REQUEST['enddate'];

	$deviceIMEI	= "";

	$historyQry = mysql_query("SELECT gdt.gpsid, gdt.deviceIMEI, gdt.latitude, gdt.longitude, CONVERT_TZ(gdt.posdatetime,'+00:00','+05:30') as gpsdatetime, gdt.speed,
					gdt.fuel, gdt.address FROM gpsdata gdt
					LEFT OUTER JOIN devices gd ON gd.deviceIMEI = gdt.deviceIMEI
					WHERE gd.deviceid='".$deviceid."' AND posdatetime BETWEEN CONVERT_TZ('$startdate','+05:30','+00:00') AND CONVERT_TZ('$enddate','+05:30','+00:00') ORDER BY gpsdatetime ASC");
	$historyCnt = mysql_num_rows($historyQry);
	if($historyCnt == 0){
		echo '{ success: false,Msg:"No Matching Records Foundss"}';
	}else{

		require_once('../PHPExcel.php');
		require_once('../PHPExcel/Reader/Excel2007.php');
		require_once '../PHPExcel/IOFactory.php';
		ini_set("memory_limit", "2000M");
		//Execution Time unlimited
		set_time_limit (0);

		$objPHPExcel = new PHPExcel();
		// Set properties
		//echo date('H:i:s') . " Set properties\n";
		$objPHPExcel->getProperties()->setCreator("Testplan")
															 ->setLastModifiedBy("Speed Reports")
															 ->setTitle("Office 2007 XLSX Speed Report Document")
															 ->setSubject("Speed Reports")
															 ->setDescription("Speed Details")
															 ->setKeywords("office 2007 openxml php")
															 ->setCategory("Export");
		$objPHPExcel->setActiveSheetIndex(0);
		$objPHPExcel->getActiveSheet()->setCellValue('A3', "Date Time");
		$objPHPExcel->getActiveSheet()->getColumnDimension('A')->setWidth(20);
		/*$objPHPExcel->getActiveSheet()->setCellValue('B3', "Latitude");
		$objPHPExcel->getActiveSheet()->getColumnDimension('B')->setWidth(20);
		$objPHPExcel->getActiveSheet()->setCellValue('C3', "Longitude");
		$objPHPExcel->getActiveSheet()->getColumnDimension('C')->setWidth(20);*/
		$objPHPExcel->getActiveSheet()->setCellValue('B3', "Speed");
		$objPHPExcel->getActiveSheet()->getColumnDimension('B')->setWidth(20);
		//$objPHPExcel->getActiveSheet()->setCellValue('C3', "Fuel");
		//$objPHPExcel->getActiveSheet()->getColumnDimension('C')->setWidth(20);
		$objPHPExcel->getActiveSheet()->setCellValue('C3', "Address");
		$objPHPExcel->getActiveSheet()->getColumnDimension('C')->setWidth(100);

		$rowno = 3;
		//Color for the Header
		$objPHPExcel->getActiveSheet()->getStyle('A3:F3')->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
		$objPHPExcel->getActiveSheet()->getStyle('A3:F3')->getFill()->getStartColor()->setARGB(PHPExcel_Style_Color::COLOR_GREEN);
		$objPHPExcel->getActiveSheet()->getStyle('A3:A'.$rowno)
				->getAlignment()->setWrapText(true)->setVertical(PHPExcel_Style_Alignment::VERTICAL_TOP);
		$i=1;
		while($historyRes = mysql_fetch_array($historyQry)){
			$gpsid		= $historyRes['gpsid'];
			$address	= $historyRes['address'];
			$latitude	= $historyRes['latitude'];
			$longitude	= $historyRes['longitude'];
			$speed	= $historyRes['speed'];
			$voltage	= $historyRes['fuel'];

			/***
			 *
			 * Calculate fuel reading
			 *
			 *
			 ****/
			//if($voltage=='00000000'){
			//	$actualFuel = "Empty";
			//}else{
			//	/* $fuel = number_format($voltage); //
			//	$fstrlen = strlen($fuel);
			//	$decimalpart = substr($fuel,-2);
			//	$intPart = substr($fuel,0,$fstrlen-2);
			//	$actualVoltage = $intPart.".".$decimalpart; */
			//
			//	$fuel 		= $voltage; //number_format($voltage);
			//	$fstrlen 	= strlen($fuel);
			//	$decimalpart = substr($fuel,2,2);
			//	$intPart = substr($fuel,0,2);
			//	$actualVoltage = $intPart.".".$decimalpart;
			//
			//	$actualFuel = round(calculateFuel($deviceid,$actualVoltage),2)." Litres";
			//}
			if($voltage=='00000000' || $voltage==""){
				$actualFuel = "Empty";
			}else{
				$actualFuel = round(calculateFuel($deviceid,$voltage),2)." Litres";
			}

			if($address=="" || $address==null){
				if($i==1){
					$address	= get_latlan_address($latitude, $longitude);
					mysql_query("UPDATE gpsdata SET address='".$address."' WHERE gpsid='".$gpsid."'");
				}

				if($i == $historyCnt-1){
					$address	= get_latlan_address($latitude, $longitude);
					mysql_query("UPDATE gpsdata SET address='".$address."' WHERE gpsid='".$gpsid."'");
				}
			}

			$rowno++;
			$deviceIMEI	= $historyRes['deviceIMEI'];

			/**
			 *
			 * for timezone conversion
			 *
			 ***/

			$gpsdatetime = date("d-m-Y H:i:s",strtotime($historyRes['gpsdatetime']));

			
			//$objPHPExcel->getActiveSheet()->setCellValue('A' . $rowno, date("d-m-Y H:i:s",strtotime($historyRes['posdatetime'])));
			$objPHPExcel->getActiveSheet()->setCellValue('A' . $rowno, $gpsdatetime);

			//$objPHPExcel->getActiveSheet()->setCellValue('B' . $rowno, $historyRes['latitude']);
			//$objPHPExcel->getActiveSheet()->setCellValue('C' . $rowno, $historyRes['longitude']);
			$objPHPExcel->getActiveSheet()->setCellValue('B' . $rowno, $speed);
			//$objPHPExcel->getActiveSheet()->setCellValue('C' . $rowno, $actualFuel);
			$objPHPExcel->getActiveSheet()->setCellValue('C' . $rowno, $address);

			$i++;
		}
	}

	$filename	= $deviceIMEI."-speed-".date("d-m-Y H:i:s",strtotime($startdate))."-".date("d-m-Y H:i:s",strtotime($enddate)).".xlsx";

	$objPHPExcel->setActiveSheetIndex(0);
	header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
	header('Content-Disposition: attachment;filename='.$filename);
	header('Cache-Control: max-age=0');
	$objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
	$objWriter->save('php://output');
}

if($todo == "Get_Fuel_Reports"){
	$deviceid 	= $_POST['deviceid'];
	$startdate	= $_POST['startdate'];
	$enddate	= $_POST['enddate'];

	$page	= $_POST['page'];
	$start	= $_POST['start'];
	$limit	= $_POST['limit'];

	if($page==1)
		$start = 0;
	else
		$start	= (($page-1)*$limit)+1;


	$totQry = mysql_query("SELECT gdt.gpsid, gdt.deviceIMEI, gdt.latitude, gdt.longitude, CONVERT_TZ(gdt.posdatetime,'+00:00','+05:30') as gpsdatetime, gdt.speed, gdt.fuel, gdt.address FROM gpsdata gdt
					LEFT OUTER JOIN devices gd ON gd.deviceIMEI = gdt.deviceIMEI
					WHERE gd.deviceid='".$deviceid."' AND posdatetime BETWEEN CONVERT_TZ('$startdate','+05:30','+00:00') AND CONVERT_TZ('$enddate','+05:30','+00:00') AND fuel>0 ORDER BY gpsdatetime ASC");
	$totCnt = mysql_num_rows($totQry);

	/*echo "SELECT gdt.gpsid, gdt.deviceIMEI, gdt.latitude, gdt.longitude, gdt.posdatetime, gdt.speed, gdt.fuel FROM gpsdata gdt
					LEFT OUTER JOIN devices gd ON gd.deviceIMEI = gdt.deviceIMEI
					WHERE gd.deviceid='".$deviceid."' AND posdatetime BETWEEN '$startdate' AND '$enddate' ORDER BY gdt.posdatetime ASC LIMIT $start, $limit";*/

	$historyQry = mysql_query("SELECT gdt.gpsid, gdt.deviceIMEI, gdt.latitude, gdt.longitude, CONVERT_TZ(gdt.posdatetime,'+00:00','+05:30') as gpsdatetime, gdt.speed, gdt.fuel, gdt.address FROM gpsdata gdt
					LEFT OUTER JOIN devices gd ON gd.deviceIMEI = gdt.deviceIMEI
					WHERE gd.deviceid='".$deviceid."' AND posdatetime BETWEEN CONVERT_TZ('$startdate','+05:30','+00:00') AND CONVERT_TZ('$enddate','+05:30','+00:00') AND fuel>0 ORDER BY gpsdatetime ASC LIMIT $start, $limit");
	$historyCnt = mysql_num_rows($historyQry);
	//echo $historyQry;
	if($totCnt == 0){
		$myData[] = array(
			'gpsid'  	 => 0,
			'datetime'   => "<span class='tableTextM'>No Records Found</span>"
		);
	}else{
		$i=1;

		//Required for calculating distance between two points
		$totalDistance = 0.0;
		$prevlat = "";
		$prevlon = "";

		while($historyRes = mysql_fetch_array($historyQry)){
			$gpsid		= $historyRes['gpsid'];
			$address	= $historyRes['address'];
			$latitude	= $historyRes['latitude'];
			$longitude	= $historyRes['longitude'];
			$speed	= $historyRes['speed'];
			$voltage	= $historyRes['fuel'];

			/***
			 *
			 * calcualte distance between two points
			 * this is not yet used. have to check the output is correct
			 * then have to use
			 *
			 ****/
			//if($prevlat=="" || $prevlon==""){
			//	//$totalDistance = $totalDistance + distance($prevlat,$latitude,$prevlon,$longitude,"K")
			//	$prevlat = $latitude;
			//	$prevlon = $longitude;
			//	$totalDistance = 0.0;
			//}else{
			//	if($prevlat==$latitude && $prevlon==$longitude){
			//		$totalDistance = 0.0;
			//	}else{
			//		$totalDistance = $totalDistance + distance($prevlat,$latitude,$prevlon,$longitude,"K");
			//		$prevlat = $latitude;
			//		$prevlon = $longitude;
			//	}
			//}


			/***
			 *
			 * Calculate fuel reading
			 *
			 *
			 ****/
			//if($voltage=='00000000' || $voltage==''){
			//	$actualFuel = "Empty";
			//}else{
			//	/* $fuel = number_format($voltage); //
			//	$fstrlen = strlen($fuel);
			//	$decimalpart = substr($fuel,-2);
			//	$intPart = substr($fuel,0,$fstrlen-2);
			//	$actualVoltage = $intPart.".".$decimalpart; */
			//
			//	if(substr($voltage,0,4)=='0000')
			//		$voltage = substr($voltage,4,4);
			//	else
			//		$voltage = substr($voltage,0,4);				
			//	
			//	$fuel 		= $voltage; //number_format($voltage);
			//	$fstrlen 	= strlen($fuel);
			//	$decimalpart = substr($fuel,2,2);
			//	$intPart = substr($fuel,0,2);
			//	$actualVoltage = $intPart.".".$decimalpart;
			//
			//	$actualFuel = round(calculateFuel($deviceid,$actualVoltage),2);
			//
			//}
			if($voltage=='00000000' || $voltage==""){
				$actualFuel = "Empty";
			}else{
				$actualFuel = round(calculateFuel($deviceid,$voltage),2);
			}

			if($address=="" || $address==null){
				if($i==1){
					$address	= get_latlan_address($latitude, $longitude);
					mysql_query("UPDATE gpsdata SET address='".$address."' WHERE gpsid='".$gpsid."'");
				}

				if($i == $historyCnt){
					$address	= get_latlan_address($latitude, $longitude);
					mysql_query("UPDATE gpsdata SET address='".$address."' WHERE gpsid='".$gpsid."'");
				}
			}
			
			if($address=="" || $address==null){
				$address	= "<span id='histaddr_".$gpsid."'><a href='javascript: getHistDeviceAddress($gpsid,\"$latitude\", \"$longitude\")'>View Address</a></span>"; //getDeviceAddress($latitude, $longitude);
			}


			/**
			 *
			 * for timezone conversion
			 *
			 ***/

			$gpsdatetime = date("d-m-Y H:i:s",strtotime($historyRes['gpsdatetime']));

			
			$myData[] = array(
				'gpsid'  	=> $gpsid,
				'latitude'	=> $latitude,
				'longitude'	=> $longitude,
				'speed'		=> $speed,
				'fuel' 		=> $actualFuel,
				'datetime'  => $gpsdatetime,
				'address'	=> $address
			);
			//'fuel'		=> $fuel,
			//echo $tmpstr = $gpsid."|".$latitude."|".$longitude."|".$speed."|".$fuel."|".$show_time."|".$address."\r\n";
			////'datetime'  => date("d-m-Y H:i:s",strtotime($historyRes['posdatetime'])),
			//file_put_contents("/tmp/test",$tmpstr,FILE_APPEND);
			$i++;

			//print_r($myData);

		}
	}

	$myData = array('HISTORY' => $myData, 'totalCount' => $totCnt);
	header('Content-Type: application/x-json');
	//file_put_contents("/tmp/test",json_encode($myData1));
    echo json_encode($myData);
}


if($_REQUEST['todo'] == 'Generate_Excel_Fuel_Reports'){
	$deviceid 	= $_REQUEST['deviceid'];
	$startdate	= $_REQUEST['startdate'];
	$enddate	= $_REQUEST['enddate'];

	$deviceIMEI	= "";

	$historyQry = mysql_query("SELECT gdt.gpsid, gdt.deviceIMEI, gdt.latitude, gdt.longitude, CONVERT_TZ(gdt.posdatetime,'+00:00','+05:30') as gpsdatetime, gdt.speed,
					gdt.fuel, gdt.address FROM gpsdata gdt
					LEFT OUTER JOIN devices gd ON gd.deviceIMEI = gdt.deviceIMEI
					WHERE gd.deviceid='".$deviceid."' AND posdatetime BETWEEN CONVERT_TZ('$startdate','+05:30','+00:00') AND CONVERT_TZ('$enddate','+05:30','+00:00') ORDER BY gpsdatetime ASC");
	$historyCnt = mysql_num_rows($historyQry);
	if($historyCnt == 0){
		echo '{ success: false,Msg:"No Matching Records Foundss"}';
	}else{

		require_once('../PHPExcel.php');
		require_once('../PHPExcel/Reader/Excel2007.php');
		require_once '../PHPExcel/IOFactory.php';
		ini_set("memory_limit", "2000M");
		//Execution Time unlimited
		set_time_limit (0);

		$objPHPExcel = new PHPExcel();
		// Set properties
		//echo date('H:i:s') . " Set properties\n";
		$objPHPExcel->getProperties()->setCreator("Testplan")
															 ->setLastModifiedBy("Fuel Reports")
															 ->setTitle("Office 2007 XLSX Fuel Report Document")
															 ->setSubject("Fuel Reports")
															 ->setDescription("Fuel Details")
															 ->setKeywords("office 2007 openxml php")
															 ->setCategory("Export");
		$objPHPExcel->setActiveSheetIndex(0);
		$objPHPExcel->getActiveSheet()->setCellValue('A3', "Date Time");
		$objPHPExcel->getActiveSheet()->getColumnDimension('A')->setWidth(20);
		/*$objPHPExcel->getActiveSheet()->setCellValue('B3', "Latitude");
		$objPHPExcel->getActiveSheet()->getColumnDimension('B')->setWidth(20);
		$objPHPExcel->getActiveSheet()->setCellValue('C3', "Longitude");
		$objPHPExcel->getActiveSheet()->getColumnDimension('C')->setWidth(20);*/
		//$objPHPExcel->getActiveSheet()->setCellValue('B3', "Speed");
		//$objPHPExcel->getActiveSheet()->getColumnDimension('B')->setWidth(20);
		$objPHPExcel->getActiveSheet()->setCellValue('B3', "Fuel");
		$objPHPExcel->getActiveSheet()->getColumnDimension('B')->setWidth(20);
		$objPHPExcel->getActiveSheet()->setCellValue('C3', "Address");
		$objPHPExcel->getActiveSheet()->getColumnDimension('C')->setWidth(100);

		$rowno = 3;
		//Color for the Header
		$objPHPExcel->getActiveSheet()->getStyle('A3:F3')->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
		$objPHPExcel->getActiveSheet()->getStyle('A3:F3')->getFill()->getStartColor()->setARGB(PHPExcel_Style_Color::COLOR_GREEN);
		$objPHPExcel->getActiveSheet()->getStyle('A3:A'.$rowno)
				->getAlignment()->setWrapText(true)->setVertical(PHPExcel_Style_Alignment::VERTICAL_TOP);
		$i=1;
		while($historyRes = mysql_fetch_array($historyQry)){
			$gpsid		= $historyRes['gpsid'];
			$address	= $historyRes['address'];
			$latitude	= $historyRes['latitude'];
			$longitude	= $historyRes['longitude'];
			$speed	= $historyRes['speed'];
			$voltage	= $historyRes['fuel'];

			/***
			 *
			 * Calculate fuel reading
			 *
			 *
			 ****/
			//if($voltage=='00000000'){
			//	$actualFuel = "Empty";
			//}else{
			//	/* $fuel = number_format($voltage); //
			//	$fstrlen = strlen($fuel);
			//	$decimalpart = substr($fuel,-2);
			//	$intPart = substr($fuel,0,$fstrlen-2);
			//	$actualVoltage = $intPart.".".$decimalpart; */
			//
			//	$fuel 		= $voltage; //number_format($voltage);
			//	$fstrlen 	= strlen($fuel);
			//	$decimalpart = substr($fuel,2,2);
			//	$intPart = substr($fuel,0,2);
			//	$actualVoltage = $intPart.".".$decimalpart;
			//
			//	$actualFuel = round(calculateFuel($deviceid,$actualVoltage),2)." Litres";
			//}
			if($voltage=='00000000' || $voltage==""){
				$actualFuel = "Empty";
			}else{
				$actualFuel = round(calculateFuel($deviceid,$voltage),2)." Litres";
			}

			if($address=="" || $address==null){
				if($i==1){
					$address	= get_latlan_address($latitude, $longitude);
					mysql_query("UPDATE gpsdata SET address='".$address."' WHERE gpsid='".$gpsid."'");
				}

				if($i == $historyCnt-1){
					$address	= get_latlan_address($latitude, $longitude);
					mysql_query("UPDATE gpsdata SET address='".$address."' WHERE gpsid='".$gpsid."'");
				}
			}

			$rowno++;
			$deviceIMEI	= $historyRes['deviceIMEI'];

			/**
			 *
			 * for timezone conversion
			 *
			 ***/

			$gpsdatetime = date("d-m-Y H:i:s",strtotime($historyRes['gpsdatetime']));

			
			//$objPHPExcel->getActiveSheet()->setCellValue('A' . $rowno, date("d-m-Y H:i:s",strtotime($historyRes['posdatetime'])));
			$objPHPExcel->getActiveSheet()->setCellValue('A' . $rowno, $gpsdatetime);

			//$objPHPExcel->getActiveSheet()->setCellValue('B' . $rowno, $historyRes['latitude']);
			//$objPHPExcel->getActiveSheet()->setCellValue('C' . $rowno, $historyRes['longitude']);
			//$objPHPExcel->getActiveSheet()->setCellValue('B' . $rowno, $speed);
			$objPHPExcel->getActiveSheet()->setCellValue('B' . $rowno, $actualFuel);
			$objPHPExcel->getActiveSheet()->setCellValue('C' . $rowno, $address);

			$i++;
		}
	}

	$filename	= $deviceIMEI."-fuel-".date("d-m-Y H:i:s",strtotime($startdate))."-".date("d-m-Y H:i:s",strtotime($enddate)).".xlsx";

	$objPHPExcel->setActiveSheetIndex(0);
	header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
	header('Content-Disposition: attachment;filename='.$filename);
	header('Cache-Control: max-age=0');
	$objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
	$objWriter->save('php://output');
}

?>