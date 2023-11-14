<?php
include_once("../config/dbconn.php");
include_once("./functions.php");

$inSmsFolder = "/var/spool/sms/incoming";
$handle = opendir($inSmsFolder);
while($file = readdir($handle)) {
	if($file !== '.' && $file !== '..') {
		//echo "$file\n";
		$fileCont = file_get_contents($inSmsFolder."/".$file);
		$contSplit = explode("\n",$fileCont);
		for($i=12; $i<count($contSplit); $i++){
			$lineStr = strtolower(trim($contSplit[$i]));
			if($lineStr!=""){
				//Check Whether the request is Address Alerts or Not
				if(substr($lineStr,0,4)=="addr" || substr($lineStr,0,4)=="lock" || substr($lineStr,0,6)=="unlock"){
					$smsType = "";
					if(substr($lineStr,0,4)=="addr"){
						$regno = trim(substr($lineStr,4));
						$smsType = "addr";
					}else if(substr($lineStr,0,4)=="lock"){
						$regno = trim(substr($lineStr,4));
						$smsType = "lock";
					}else if(substr($lineStr,0,6)=="unlock"){
						$regno = trim(substr($lineStr,6));
						$smsType = "unlock";
					}
						
					$regno = preg_replace('/\s/', '', $regno);
					if($regno!=""){
						//echo $regno;
						/* echo "SELECT gdl.latitude, gdl.longitude FROM gpsdata_live gdl
									LEFT OUTER JOIN devices gd ON gd.deviceIMEI = gdl.deviceIMEI
									LEFT OUTER JOIN vehicles vh ON vh.deviceid = gd.deviceid
									WHERE REPLACE( LCASE( vh.regnno ) ,  " ",  "" ) = '".$regno."'\n"; */ 
						$vehQry = mysql_query("SELECT gdl.latitude, gdl.longitude, gdl.ignition, gdl.speed, gdl.fuel , 
									vhs.vehicleid, vhs.lock_unlock, vhs.lock_lat_lng
									FROM gpsdata_live gdl
									LEFT OUTER JOIN devices gd ON gd.deviceIMEI = gdl.deviceIMEI
									LEFT OUTER JOIN vehicles vh ON vh.deviceid = gd.deviceid
									LEFT OUTER JOIN vehicle_sms vhs ON vhs.vehicleid = vh.vehicleid
									WHERE REPLACE( LCASE( vh.regnno ) ,' ', '' ) = '".$regno."'");
						$vehCnt = mysql_num_rows($vehQry);
						if($vehCnt>0){
							$vehRes = mysql_fetch_array($vehQry);
							$latitude 	= $vehRes['latitude'];
							$longitude 	= $vehRes['longitude'];
							$speed		= $vehRes['speed'];
							$ignition	= $vehRes['ignition'];
							$voltage	= $vehRes['fuel'];
							
							if($voltage=='00000000' || $voltage==""){
								$actualFuel = 0;
							}else{
								$actualFuel = round(calculateFuel($tracking_deviceid,$voltage),2);
							}
							
							$smsStr = "Engine : ".$ignition."\n";
							if($ignition=="ON"){
								$smsStr .= "Speed : ".$speed."\n";
								$smsStr .= "Fuel : ".$actualFuel."\n";
							}
							
							if($smsType=="addr"){
								$geocodeJson = do_post_request("http://maps.googleapis.com/maps/api/geocode/json?latlng=$latitude,$longitude&sensor=true",'','');
								$geocodeJsonArr = json_decode($geocodeJson);
								$address = $geocodeJsonArr->results[0]->formatted_address;
								//echo $address."\n";
								$smsStr .= $address;
							}
							
							if($smsType=="lock"){
								$vehicleid	 = $vehRes['vehicleid'];
								$lock_unlock = $vehRes['lock_unlock'];
								$lock_lat_lng= "$latitude,$longitude";
								$lockRes = mysql_query("UPDATE vehicle_sms SET lock_unlock='LOCK', lock_unlock_cnt=0, lock_lat_lng='".$lock_lat_lng."' 
												WHERE vehicleid='".$vehicleid."'");
								$smsStr = "Your Vehicle [ $regno ] is Locked";
							}
							
							if($smsType=="unlock"){
								$vehicleid	 = $vehRes['vehicleid'];
								$lock_unlock = $vehRes['lock_unlock'];
								$lockRes = mysql_query("UPDATE vehicle_sms SET lock_unlock='UNLOCK', lock_unlock_cnt=0, lock_lat_lng='' 
												WHERE vehicleid='".$vehicleid."'");
								$smsStr = "Your Vehicle [ $regno ] is UnLocked";
							}
							
							$cellno = trim(str_replace("From:","",$contSplit[0]));
							sendSMS($cellno, $smsStr);
						}else{
							echo "$regno : Invalid Reg No\n";
						}						
					}					
					//echo $regno."\n";
				}
			}
		}
		unlink($inSmsFolder."/".$file);
	}
}
closedir($handle);
?>