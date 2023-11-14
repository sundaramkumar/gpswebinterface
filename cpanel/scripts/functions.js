function getHistDeviceAddress(rowid,lat,lon){
	Ext.Ajax.request({
		url: 'includes/tracking_ajx.php',
		params: {
			todo:'Get_LanLon_Address',
			latitude : lat,
			longitude : lon
		},
		timeout: 600000000,
		success:function(response){
			var deviceRes 	= Ext.decode(response.responseText);
			var deviceAddress = deviceRes['results'][0]['formatted_address'];
			//deviceAddress = deviceAddress.replace(/\,/gi,"<br>");
			console.log(deviceAddress);
			Ext.get('histaddr_'+rowid).dom.innerHTML = deviceAddress;
		}
	});

}

function getInfoWindowDetails(point, deviceArr){
	var devDetails = "<table cellspacing='0' cellpadding='0' width='100%' style='background-color:#ECE9D8'>";
	devDetails += "<tr>";
	devDetails += "<td style='background-color:#FFDFF7;padding:0px;'>";
	devDetails += "<table cellspacing='0' cellpadding='0' border='0' class='tableTextBlack' width='100%'>";

	if (Ext.isArray(deviceArr)) {
		var devicename		= deviceArr['devicename'];
		var devicetype		= deviceArr['devicetype'];
		var vehiclename		= deviceArr['vehiclename'];
		var regnno			= deviceArr['regnno'];
		var drivername		= deviceArr['drivername'];
		var driverMobile	= deviceArr['driverMobile'];
		var kidname			= deviceArr['kidname'];
		var kidsMobile		= deviceArr['kidsMobile'];
		var speed			= deviceArr['speed'];
		var fuel			= deviceArr['fuel'];
		var ignition		= deviceArr['ignition'];
		var door			= deviceArr['door'];
		if(devicetype == "VTS"){
			devDetails	+= "<tr style='bbackground-color:#d6e3f2'>";
			devDetails	+= "<td style='padding:2px;'><b>Reg.No :</b> "+regnno+"</td>";
			devDetails	+= "</tr><tr>";
			devDetails	+= "<td style='padding:2px;'><b>Speed : </b>"+speed+" Km/h</td>";
			devDetails	+= "</tr><tr>";
			devDetails	+= "<td style='padding:2px;'><b>Fuel : </b>"+fuel+" Litres</td>";
			devDetails	+= "</tr><tr>";
			devDetails	+= "<td style='padding:2px;'><b>Engine : </b>"+ignition+"</td>";
			devDetails	+= "</tr><tr>";
			devDetails	+= "<td style='padding:2px;'><b>Door is : </b>"+door+"</td>";
			devDetails	+= "</tr>";
		}else{
			devDetails	+= "<tr style='bbackground-color:#d6e3f2'>";
			devDetails	+= "<td style='padding:2px;'><b>Person Name :</b> "+kidname+"</td>";
			devDetails	+= "</tr><tr>";
			devDetails	+= "<td style='padding:2px;'><b>Mobile No : </b>"+kidsMobile+"</td>";
			devDetails	+= "</tr>";
		}
	}
	var deviceAddress = getAddress(point);
	devDetails	+= "<tr style='background-color:#FFCDE3'><td width='100%' colspan='2' style='padding:2px;'><b>Address : </b><br>"+deviceAddress+"</td></tr>";
	devDetails	+= "</table>";
	devDetails	+= "</td></tr>";
	devDetails	+= "</table>";
	return devDetails;
}

function getAddress(point){
	console.log(point);
	var geocoder = new google.maps.Geocoder();
	geocoder.geocode({latLng: point}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			if (results[0]) {
				console.log(results[0].formatted_address);
				var deviceAddress	= results[0].formatted_address;
				return deviceAddress.replace(/\,/gi,"<br>");
			}
		}
		return "";
	});
}

function showTrackingInfoWindow(latitude, longitude, deviceArr){
	Ext.Ajax.request({
		url: 'includes/tracking_ajx.php',
		params: {
			todo:'Get_LanLon_Address',
			latitude : longitude,
			longitude : longitude
		},
		timeout: 600000000,
		success:function(response){
			var deviceRes 	= Ext.decode(response.responseText);
			//alert(deviceRes['results'][0]['formatted_address']);
			var deviceAddress = deviceRes['results'][0]['formatted_address'];
			deviceAddress = deviceAddress.replace(/\,/gi,"<br>");

			var devDetails = "<table cellspacing='0' cellpadding='0' width='250' style='background-color:#ECE9D8'>";
			devDetails += "<tr>";
			devDetails += "<td style='background-color:#FFDFF7;padding:0px;'>";
			devDetails += "<table cellspacing='0' cellpadding='0' border='0' class='tableTextBlack' width='250'>";

			if (Ext.isArray(deviceArr)) {
				var devicename		= deviceArr['devicename'];
				var devicetype		= deviceArr['devicetype'];
				var vehiclename		= deviceArr['vehiclename'];
				var regnno			= deviceArr['regnno'];
				var drivername		= deviceArr['drivername'];
				var driverMobile	= deviceArr['driverMobile'];
				var kidname			= deviceArr['kidname'];
				var kidsMobile		= deviceArr['kidsMobile'];
				var speed			= deviceArr['speed'];
				var fuel			= deviceArr['fuel'];
				var ignition		= deviceArr['ignition'];
				var door			= deviceArr['door'];
				if(devicetype == "VTS"){
					devDetails	+= "<tr style='bbackground-color:#d6e3f2'>";
					devDetails	+= "<td style='padding:2px;'><b>Reg.No :</b> "+regnno+"</td>";
					devDetails	+= "</tr><tr>";
					devDetails	+= "<td style='padding:2px;'><b>Speed : </b>"+speed+" Km/h</td>";
					devDetails	+= "</tr><tr>";
					devDetails	+= "<td style='padding:2px;'><b>Fuel : </b>"+fuel+" Litres</td>";
					devDetails	+= "</tr><tr>";
					devDetails	+= "<td style='padding:2px;'><b>Engine : </b>"+ignition+"</td>";
					devDetails	+= "</tr><tr>";
					devDetails	+= "<td style='padding:2px;'><b>Door is : </b>"+door+"</td>";
					devDetails	+= "</tr>";
				}else{
					devDetails	+= "<tr style='bbackground-color:#d6e3f2'>";
					devDetails	+= "<td style='padding:2px;'><b>Person Name :</b> "+kidname+"</td>";
					devDetails	+= "</tr><tr>";
					devDetails	+= "<td style='padding:2px;'><b>Mobile No : </b>"+kidsMobile+"</td>";
					devDetails	+= "</tr>";
				}
			}
			devDetails	+= "<tr style='background-color:#FFCDE3'><td width='100%' colspan='2' style='padding:2px;'><b>Address : </b><br>"+deviceAddress+"</td></tr>";
			devDetails	+= "</table>";
			devDetails	+= "</td></tr>";
			devDetails	+= "</table>";
			//mark.openInfoWindowHtml(devDetails);
			//mark.openExtInfoWindow(
			//	curMap,
			//	"custom_info_window_red",
			//	"<div class='title'>Details</div>"+
			//	"<div class='section1'><p>See how you can use background colors "+
			//	"to match up with the CSS images to create title bars.</p></div>"+
			//	"<div class='section2'><p>Also, you can do anything you want "+
			//	"within the bounds of CSS.</p></div>"+
			//	"<div class='section1'><p>Including the striped row look you see here.</p></div>",
			//	{beakOffset: 3}
			//);
			mark.openExtInfoWindow(
				curMap,
				"custom_info_window_red",
				"<div class='title'>Info</div>"+
				"<div class='section1'>"+devDetails+"</div>",
				{beakOffset: 3}
			);
		}
	});
}