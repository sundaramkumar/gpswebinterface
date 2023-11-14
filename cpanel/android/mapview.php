<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="initial-scale=1.0, user-scalable=no">
<meta charset="utf-8">
<title>InnovTrack</title>
<style>
html, body {
  height: 100%;
  margin: 0;
  padding: 0;
}

#map_canvas {
  height: 100%;
}

@media print {
  html, body {
    height: auto;
  }

  #map_canvas {
    height: 650px;
  }
}
</style>
<script src="jquery/jquery-1.7.2.min.js"></script>
<script src="js/json2.js"></script>
<!--script src="https://maps.googleapis.com/maps/api/js?sensor=false"></script-->
<script src="js/markers.js"></script>
<script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?sensor=false&libraries=places"></script>
<script type="text/javascript">
	var map;
	var geocoder;
	function initialize() {
		var latitude = 13.050047;
		var longitude = 80.240497;
		/*if (window.android){
			latitude = window.android.getLatitude();
			longitude = window.android.getLongitude();
		}*/
		geocoder = new google.maps.Geocoder();
		var myLatlng = new google.maps.LatLng(latitude,longitude);
		var myOptions = {
			zoom: 16,
			center: myLatlng,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		}
		map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
		//addMarker(myLatlng);
		
		showDeviceList();
	}
	
	var prevIgnition = "";
	var prevLatitude = "";
	var prevLongitude= "";
		
	function showDeviceList(){
		$.ajax({
			url: 'includes/device_ajax.php',
			type: 'POST',			
			data: { todo:'Get_Devices_List'},
			success: function(devRes) {
				//console.log(devRes);
				document.getElementById("devicelist").innerHTML = devRes.deviceList;
				prevIgnition = "";
				prevLatitude = "";
				prevLongitude= "";
				setInterval(function() {
					getDeviceLatLng();
				}, 5000);
			}
		});
	}
	
	function showLiveTracking(){
		prevIgnition = "";
		prevLatitude = "";
		prevLongitude= "";
		getDeviceLatLng();
	}
	
	function getDeviceLatLng(){
		if(document.getElementById("deviceIMEI")){
			var deviceIMEI = document.getElementById("deviceIMEI").value;
			if(deviceIMEI!=""){
				$.ajax({
					url: 'includes/device_ajax.php',
					type: 'POST',			
					data: { todo:'Get_Live_LatLng', deviceIMEI: deviceIMEI },
					success: function(geoRes) {
						var latitude 	= geoRes.latitude;
						var longitude 	= geoRes.longitude;
						var ignition 	= geoRes.ignition;
						if(prevIgnition=="" || prevIgnition=="ON"){
							clearOverlays();
							var myLatlng = new google.maps.LatLng(latitude,longitude);
							addMarker(myLatlng, ignition);
						}
						
						prevIgnition = ignition;
						prevLatitude = latitude;
						prevLongitude= longitude;
					}
				});
			}
		}
	}
</script>
</head>
<body onload="initialize()">
	<div id="devicelist"></div>	
	<div id="map_canvas" style="height:100%;width:100%"></div>
</body>
</html>
