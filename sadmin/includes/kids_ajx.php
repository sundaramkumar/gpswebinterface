<?php
session_start();
include_once("../config/dbconn.php");
include_once("./functions.php");

//error_reporting(E_ALL);
//ini_set('display_errors','On');
$todo = $_POST['todo'];


if($todo == "Get_Kids_List"){
	if(!preg_match('/showKids/',$_SESSION['loadpage'])){
		$_SESSION['loadpage']	= $_SESSION['loadpage'].",showKids";
	}
	$start		= $_POST['start'];
	$limit		= $_POST['limit'];
	$filterQry = "";
	$fil_customerid	= $_POST['filtr_customerid'];
	$fil_filtertext	= $_POST['filtertext'];
	if($fil_customerid!="" && $fil_customerid!="0"){
		if($fil_filtertext!=''){
			$filterQry = "AND kid.customerid=$fil_customerid AND (kid.kidname LIKE '%$fil_filtertext%' OR dev.devicename LIKE '%$fil_filtertext%' OR kid.institutename LIKE '%$fil_filtertext%')";
		}
		else{
			$filterQry = "AND kid.customerid=$fil_customerid";
		}
		
	}
	if($fil_filtertext!=''){
		if($fil_customerid!="" && $fil_customerid!="0"){
			$filterQry = "AND kid.customerid=$fil_customerid AND (kid.kidname LIKE '%$fil_filtertext%' OR dev.devicename LIKE '%$fil_filtertext%' OR kid.institutename LIKE '%$fil_filtertext%')";
			
		}
		else{
			$filterQry = "AND (kid.kidname LIKE '%$fil_filtertext%' OR dev.devicename LIKE '%$fil_filtertext%' OR kid.institutename LIKE '%$fil_filtertext%')";
			
		}
	} 
					
	$totQry	= mysql_query("SELECT dev.deviceid, dev.devicename,cus.customerid,cus.customername,kid.* FROM kids kid 
							LEFT OUTER JOIN	devices dev ON dev.deviceid = kid.deviceid
							LEFT OUTER JOIN	customers cus ON cus.customerid = kid.customerid 
							WHERE kid.kidid!='' $filterQry");
	$totCnt	= mysql_num_rows($totQry);
	if($totCnt == 0){
		$myData[] = array(
			'kidid'  	 => 0,
			'kidname'   => "<span class='tableTextM'>No Kids Found</span>"
		);
	}else{
		$kidQry = mysql_query("SELECT dev.deviceid, dev.devicename,cus.customerid,cus.customername,kid.* FROM kids kid 
							LEFT OUTER JOIN	devices dev ON dev.deviceid = kid.deviceid
							LEFT OUTER JOIN	customers cus ON cus.customerid = kid.customerid 
							WHERE kid.kidid!='' $filterQry ORDER BY kid.kidname LIMIT $start , $limit");
		while($kidRes = mysql_fetch_array($kidQry)){
			$status = $kidRes['kid_status'];
				if($status=="Enable")
					$status="<img src='./images/enable.png' style='cursor:pointer' title='Click here to Disable' onclick='status_kid(".$kidRes['kidid'].",\"Disable\")'/>";
				else
					$status="<img src='./images/disable.png' style='cursor:pointer' title='Click here to Enable' onclick='status_kid(".$kidRes['kidid'].",\"Enable\")'/>";
			
			$kidid = $kidRes['kidid'];
			$deviceid = $kidRes['deviceid'];
				if($deviceid!=0)
					$devicename = $kidRes['devicename'].'<br><a onclick="unassign_kid('.$kidid.')" href="#">Remove from the kid</a>';
				else
					$devicename = '';
				
				
			$myData[] = array(
				'kidid'  			=> $kidRes['kidid'],
				'customerid'  		=> $kidRes['customerid'],
				'deviceid'  		=> $kidRes['deviceid'],
				'customername'  	=> $kidRes['customername'],
				'devicename' 	 	=> $devicename,
				'kidname'   		=> $kidRes['kidname'],
				'mobile'			=> $kidRes['mobile'],
				'institutename'   	=> $kidRes['institutename'],
				'instaddress1'		=> $kidRes['instaddress1'],
				'instaddress2'		=> $kidRes['instaddress2'],
				'instaddress3'		=> $kidRes['instaddress3'],
				'instcity'			=> $kidRes['instcity'],
				'instphone1'		=> $kidRes['instphone1'],
				'instphone2'		=> $kidRes['instphone2'],
				'friend1name'		=> $kidRes['friend1name'],
				'friend1phone'		=> $kidRes['friend1phone'],
				'friend2name'		=> $kidRes['friend2name'],
				'friend2phone'		=> $kidRes['friend2phone'],
				'photo'				=> $kidRes['photo'],
				'addedon'			=> date("d-m-Y", strtotime($kidRes['addedon'])),
				'addedby'   		=> getTeamMemberName($kidRes['addedby']),
				'kid_status'		=> $status,
			);
		}
	}
    $myData = array('KIDS' => $myData, 'totalCount' => $totCnt);
	header('Content-Type: application/x-json');
	//echo $q;
    echo json_encode($myData);
}

if($todo == "Add_Kid"){
	$customerid  		= $_POST['customerid'];
	$deviceid  			= $_POST['deviceid'];
	$kidname   			= $_POST['kidname'];
	$mobile				= $_POST['mobile'];
	$institutename   	= $_POST['institutename'];
	$instaddress1		= $_POST['instaddress1'];
	$instaddress2		= $_POST['instaddress2'];
	$instaddress3		= $_POST['instaddress3'];
	$instcity			= $_POST['instcity'];
	$instphone1			= $_POST['instphone1'];
	$instphone2			= $_POST['instphone2'];
	$friend1name		= $_POST['friend1name'];
	$friend1phone		= $_POST['friend1phone'];
	$friend2name		= $_POST['friend2name'];
	$friend2phone		= $_POST['friend2phone'];
	$photourl			= $_FILES['photo'];
	
	$chkQry	= mysql_query("SELECT * FROM kids WHERE kidname='".$kidname."'");
	$chkCnt	= mysql_num_rows($chkQry);
	if($chkCnt == 0){
		
			$chkdev	= mysql_query("SELECT * FROM kids WHERE deviceid='".$deviceid."'");
			$chkdevCnt	= mysql_num_rows($chkdev);
			if($chkdevCnt == 0){
				$kidQry = "INSERT INTO kids(customerid, deviceid, kidname, mobile,institutename, instaddress1, instaddress2,instaddress3,
								instcity,instphone1,instphone2,friend1name,friend1phone,friend2name,friend2phone,addedby,addedon)
								VALUES('".$customerid."', '".$deviceid."', '".$kidname."', '".$mobile."', '".$institutename."', '".$instaddress1."',
								'".$instaddress2."', '".$instaddress3."', '".$instcity."', '".$instphone1."', '".$instphone2."', '".$friend1name."', '".$friend1phone."', '".$friend2name."', '".$friend2phone."', '".$_SESSION['userid']."', '". date("Y-m-d")."')";
				$kidRes = mysql_query($kidQry);
				if($kidRes){
					$kidid = mysql_insert_id();
					$photourl = "";
					if(($_FILES['photo']['name']))
					{
						$photourl	= $_FILES['photo']['name'];
						$photourl = "../photos/kids/" . $customerid."_".$kidid."_".$_FILES["photo"]["name"];
						if(move_uploaded_file($_FILES["photo"]["tmp_name"],$photourl)){
							//echo "{success: true}";
							$photourl = "./photos/kids/" . $customerid."_".$kidid."_".$_FILES['photo']['name'];
						}else{
							$photourl = './images/emptyimg.png';
						}
					}
					else
					{
						$photourl = './images/emptyimg.png';
					}
					$updatePhotoQry = "UPDATE kids set photo ='".$photourl."' WHERE kidid = $kidid" ;
					$updatePhotoRes = mysql_query($updatePhotoQry);
					if($updatePhotoRes){
						echo "{ success: true,msg:'Kid <b>$kidname</b>  Added Successfully.'}";
					}else{
						echo "{ success: true,msg:'Kid <b>$kidname</b>  Added Successfully.<br/> But the photo is not updated'}";
					}
				}
				else{
					echo "{ success: false,msg:'Error while adding new Kid.'}";
				}
			}
			else
				echo "{success: false,msg:'Device is already assigned to another KID.'}";
			
	}else{
		echo "{ success: false,msg:'Kid <b>$kidname</b>  Already Exists.'}";
	}
}

if($todo == "Edit_Kid"){
	$kidid  			= $_POST['kidid'];
	$customerid  		= $_POST['customerid'];
	$deviceid  			= $_POST['deviceid'];
	//$customername  	= getCustomerName($_POST['customerid']);
	//$devicename  		= getDeviceName($_POST['deviceid']);
	$kidname   			= $_POST['kidname'];
	$mobile				= $_POST['mobile'];
	$institutename   	= $_POST['institutename'];
	$instaddress1		= $_POST['instaddress1'];
	$instaddress2		= $_POST['instaddress2'];
	$instaddress3		= $_POST['instaddress3'];
	$instcity			= $_POST['instcity'];
	$instphone1			= $_POST['instphone1'];
	$instphone2			= $_POST['instphone2'];
	$friend1name		= $_POST['friend1name'];
	$friend1phone		= $_POST['friend1phone'];
	$friend2name		= $_POST['friend2name'];
	$friend2phone		= $_POST['friend2phone'];
	$photourl			= $_FILES['photo'];
	//$emphoto			= $_FILES

	$chkQry	= mysql_query("SELECT * FROM kids WHERE kidname='".$kidname."' AND kidid!='".$kidid."'");
	$chkCnt	= mysql_num_rows($chkQry);
	if($chkCnt == 0){
		$devChk = mysql_query("SELECT * FROM kids WHERE kidid!='".$kidid."' AND deviceid='".$deviceid."'");
		$devCnt = mysql_num_rows($devChk);
		if($devCnt==0)
		{
			$kidQry = "UPDATE kids SET
						customerid 			= '".$customerid."',
						kidname 			= '".$kidname."',
						mobile				= '".$mobile."',
						deviceid			= '".$deviceid."',
						institutename		= '".$institutename."',
						instaddress1		= '".$instaddress1."',
						instaddress2		= '".$instaddress2."',
						instaddress3		= '".$instaddress3."',
						instcity			= '".$instcity."',
						instphone1			= '".$instphone1."',
						instphone2			= '".$instphone2."',
						friend1name			= '".$friend1name."',
						friend2name			= '".$friend2name."',
						friend1phone		= '".$friend1phone."',
						friend2phone		= '".$friend2phone."'
						WHERE kidid= '".$kidid."'";
			$kidRes = mysql_query($kidQry);
			if($kidRes){
					if(isset($_FILES)){
					$ph_name = $_FILES['photo']['name'];
					$temp_name = $_FILES['photo']['tmp_name'];
					$photourl = "../photos/kids/" . $customerid."_".$kidid."_".$_FILES['photo']['name'];
					if (move_uploaded_file ($temp_name, $photourl)) {
						$photourl = "./photos/kids/" . $customerid."_".$kidid."_".$_FILES['photo']['name'];
						$updatePhotoQry = "UPDATE kids set photo ='".$photourl."' WHERE kidid = $kidid" ;
						$updatePhotoRes = mysql_query($updatePhotoQry);
					} 
					else 
						$photourl = './images/emptyimg.png';
				}
				if($kidRes)
					echo "{ success: true,msg:'Kid <b>$kidname</b>  Updated Successfully.'}";
				}
			else{
				//$error	= mysql_error();
				echo "{ success: false,msg:'Error while updating Kid details'}";
			}
		}
		else{
			echo "{ success: false,msg:'Already  <b>$kidname</b> Exists.'}";
		}
	}else{
		echo "{ success: false,msg:'Already there is some other Kid with the name <b>$kidname</b> Exists.'}";
	}
}

if($todo == "Delete_Kid"){
	$kidid		= $_POST['kidid'];
	$customerid	= $_POST['customerid'];
	$kidname	= $_POST['kidname'];
	$customername  	= getCustomerName($_POST['customerid']);
	$chkQry	= mysql_query("SELECT * FROM kids WHERE kidname='".$kidname."' AND customerid='".$customerid."' AND kidid='".$kidid."'");
	$chkCnt	= mysql_num_rows($chkQry);
	if($chkCnt == 1){
		$kidQry = "DELETE FROM kids WHERE kidname='".$kidname."' AND customerid='".$customerid."' AND kidid='".$kidid."'";
		$kidRes = mysql_query($kidQry);
		if(!mysql_error()){
			/****
			 *
			 * Delete Devices, History and other tables such as drivers, kids details etc
			 *
			 ***/
		}
		if($kidRes){
			echo "{ success: true,msg:'Kid <b>$kidname</b>  Deleted Successfully.'}";
		}else{
			//$error	= mysql_error();
			echo "{ success: false,msg:'Error while deleting Kid'}";
		}
	}else{
		echo "{ success: false,msg:'The details of Kid <b>$kidname</b> of   does not Exist in database.'}";
	}
}

if($todo=="Status_Kid")
{
	$kidid		= $_POST['kidid'];
	$kid_status	= $_POST['kid_status'];
	$statusQry = mysql_query("UPDATE kids SET kid_status='".$kid_status."' WHERE kidid='".$kidid."'");	
	if($statusQry!='')
		echo "{success:true,msg:'Status Changed Successfully'}";
	else
		echo "{success:true,msg:'Status Change Failed'}";
	
}

if($todo=="Unassign_Kid")
{
	$kidid		= $_POST['kidid'];
	$unassignQry = mysql_query("UPDATE kids SET deviceid='', kid_status='Disable' WHERE kidid='".$kidid."'");	
	if($unassignQry!='')
	echo "{success:true,msg:'Device Removed Successfully'}";
	else
	echo "{success:true,msg:'Device Removed Failed'}";
	
}

?>