var prevpointArr = new Array();
prevpointArr[0]	= new Array();
prevpointArr[0]['lat'] = "";
prevpointArr[0]['lon'] = "";
prevpointArr[1]	= new Array();
prevpointArr[1]['lat'] = "";
prevpointArr[1]['lon'] = "";

var redIconFlag = true;

var speedGauge;
var fuelGauge;

var trackingTask = {
	 run: function(){
		if(Ext.getCmp("tracking_deviceid")){
			var tracking_deviceid		= Ext.getCmp("tracking_deviceid").getValue();
			var tracking_deviceStore 	= Ext.getCmp("tracking_deviceid").getStore();
			var storeInd 				= tracking_deviceStore.findExact('deviceid',tracking_deviceid);
			var fuelcapacity			= tracking_deviceStore.getAt(storeInd).get("fuelcapacity");
			var speedlimit				= tracking_deviceStore.getAt(storeInd).get("speedlimit");
			var devicetype				= tracking_deviceStore.getAt(storeInd).get("devicetype");
			var vehiclename				= tracking_deviceStore.getAt(storeInd).get("vehiclename");
			var regnno					= tracking_deviceStore.getAt(storeInd).get("regnno");
			var drivername				= tracking_deviceStore.getAt(storeInd).get("drivername");
			var driverMobile			= tracking_deviceStore.getAt(storeInd).get("driverMobile");
			var kidname					= tracking_deviceStore.getAt(storeInd).get("kidname");
			var kidsMobile				= tracking_deviceStore.getAt(storeInd).get("kidsMobile");

			var deviceArr = new Array();
			deviceArr['deviceid']		= tracking_deviceid;
			deviceArr['fuelcapacity']	= fuelcapacity;
			deviceArr['speedlimit']		= speedlimit;
			deviceArr['devicetype']		= devicetype;
			deviceArr['vehiclename']	= vehiclename;
			deviceArr['regnno']			= regnno;
			deviceArr['drivername']		= drivername;
			deviceArr['driverMobile']	= driverMobile;
			deviceArr['kidname']		= kidname;
			deviceArr['kidsMobile']		= kidsMobile;

			if(tracking_deviceid!=""){
				Set_Device_Gps_LatLong(tracking_deviceid, deviceArr);
			}
		}else{
			Ext.TaskManager.stopAll();
			Ext.getCmp("startTrackBut").enable();
			Ext.getCmp("stopTrackBut").disable();
		}
	 },
	 interval: 5000
};

function Set_Device_Gps_LatLong(tracking_deviceid, deviceArr){
	Ext.Ajax.request({
        url: '../includes/tracking_ajx.php',
        params: {
            todo:'Get_Lat_Lon',
            tracking_deviceid : tracking_deviceid
        },
        timeout: 600000000,
        success:function(response){
            var deviceRes = Ext.decode(response.responseText);
			var devicename 	= deviceRes.devicename;
			var latitude 	= deviceRes.latitude;
			var longitude	= deviceRes.longitude;
			var latitude 	= deviceRes.latitude;
			var gpsid		= deviceRes.gpsid;
			var speed 		= deviceRes.speed;
			var fuel		= deviceRes.fuel;
			var ignition	= deviceRes.ignition;
			var door		= deviceRes.door;

			deviceArr['devicename']	= devicename;
			deviceArr['speed']		= speed;
			deviceArr['fuel']		= fuel;
			deviceArr['ignition']	= ignition;
			deviceArr['door']		= door;
			
			var greenIcon = "../images/gmap/marker-green.png";
			var orangeIcon  = "../images/gmap/marker-orange.png";
			var redIcon  = "../images/gmap/marker-red.png";

			if(ignition == 'ON'){
				if(prevpointArr[0]['lat'] != prevpointArr[1]['lat'] && prevpointArr[0]['lon'] != prevpointArr[1]['lon']){
					//var point = new GLatLng(parseFloat(latitude),parseFloat(longitude)); //gmap v2
					var point	= new google.maps.LatLng(parseFloat(latitude),parseFloat(longitude));
					Ext.getCmp('trackingDeviceMapPanel').gmap.setCenter(point, 16);

					var speelimit = parseDouble(deviceArr['speedlimit']);
					var curspeed  = parseDouble(speed);
					var markerIcon	= greenIcon;
					if(curspeed > speelimit && curspeed!=0.00){
						markerIcon 	= orangeIcon;
					}else{
						markerIcon	= greenIcon;
					}
									
					var markerJson = {title:devicename, icon:markerIcon,
						infoWindow:{
							infoArray:deviceArr
						}
					};

					var markerListener = {
						
					}
					markerClear = true;

					var markerCenter = Ext.getCmp('trackingDeviceMapPanel').getMap().getCenter();
					Ext.getCmp('trackingDeviceMapPanel').addMarker(point,markerJson,markerClear,markerCenter,markerListener,deviceArr);
					
					speedGauge.value = speed;
					RGraph.Effects.Gauge.Grow(speedGauge);

					fuelGauge.value = fuel;
					RGraph.Effects.Gauge.Grow(fuelGauge);

					redIconFlag = true;
				}else{
					var markerLen = Ext.getCmp('trackingDeviceMapPanel').cache.marker.length;
					if(markerLen>0)
						Ext.getCmp('trackingDeviceMapPanel').cache.marker[markerLen-1].setAnimation(google.maps.Animation.BOUNCE);
				}
			}else{ //if ignition is off
				
				if(redIconFlag){
					//var point = new GLatLng(parseFloat(latitude),parseFloat(longitude));
					var point	= new google.maps.LatLng(parseFloat(latitude),parseFloat(longitude));
					Ext.getCmp('trackingDeviceMapPanel').gmap.setCenter(point, 16);
					
					//infoWinContent = getInfoWindowDetails(point, deviceArr);
					
					var markerJson = {title:devicename, icon:redIcon,
						infoWindow:{
							infoArray:deviceArr
						}
					};

					var markerListener = {
						
					}
					markerClear = true;
					
					var markerCenter = Ext.getCmp('trackingDeviceMapPanel').getMap().getCenter();
					Ext.getCmp('trackingDeviceMapPanel').addMarker(point,markerJson,markerClear,markerCenter,markerListener,deviceArr);
				}else{
					var markerLen = Ext.getCmp('trackingDeviceMapPanel').cache.marker.length;
					if(markerLen>0)
						Ext.getCmp('trackingDeviceMapPanel').cache.marker[markerLen-1].setAnimation(google.maps.Animation.BOUNCE);
				}

				redIconFlag = false;
				
				speedGauge.value = speed;
				RGraph.Effects.Gauge.Grow(speedGauge);

				fuelGauge.value = fuel;
				RGraph.Effects.Gauge.Grow(fuelGauge);
			}
			
			if(prevpointArr[0]['lat']!="" && prevpointArr[0]['lon']!=""){
				prevpointArr[1]['lat'] = prevpointArr[0]['lat'];
				prevpointArr[1]['lon'] = prevpointArr[0]['lon'];
			}
			
			prevpointArr[0]['lat'] = latitude;
			prevpointArr[0]['lon'] = longitude;
			
        }
    });
}