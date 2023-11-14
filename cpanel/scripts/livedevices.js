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

var deviceAddress;

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
			
			//dec04
			var ignition_v	= tracking_deviceStore.getAt(storeInd).get("ignition_v");
			//alert(ignition_v);
			//
			
			//var track_interval			= tracking_deviceStore.getAt(storeInd).get("tracking_interval");
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
			
			//nov23
			//Ext.TaskManager.interval = track_interval;
			if(tracking_deviceid!=""){
				Set_Device_Gps_LatLong(tracking_deviceid, deviceArr, ignition_v);
			}		
				
			
		}else{
			Ext.TaskManager.stop(trackingTask);
			Ext.getCmp("startTrackBut").enable();
			Ext.getCmp("stopTrackBut").disable();
		}
	},interval:5000
}
var cnt_latlan_stop1,cnt_latlan_stop2;
var prev_speed,prev_distance;
var prev_lat,prev_lan,prev_point=0;
function Set_Device_Gps_LatLong(tracking_deviceid, deviceArr, ignition_v){
	Ext.Ajax.request({
        url: 'includes/tracking_ajx.php',
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
			var gpsid		= deviceRes.gpsid;
			var speed 		= deviceRes.speed;
			var fuel		= deviceRes.fuel;
			var ignition	= deviceRes.ignition;
			var door		= deviceRes.door;

			var latlan_cnt = deviceRes.latlan_count; 
			var distance_latlan	 = deviceRes.distance; 
			
			deviceArr['devicename']	= devicename;
			deviceArr['speed']		= speed;
			deviceArr['fuel']		= fuel;
			deviceArr['ignition']	= ignition;
			deviceArr['door']		= door;				
					
			// Create our "tiny" marker icon
			/*var greenIcon = new GIcon(G_DEFAULT_ICON);
			greenIcon.image = "./images/gmap/marker-green.png";

			var orangeIcon = new GIcon(G_DEFAULT_ICON);
			orangeIcon.image = "./images/gmap/marker-orange.png";

			var redIcon = new GIcon(G_DEFAULT_ICON);
			redIcon.image = "./images/gmap/marker-red.png";*/
			var greenIcon = "./images/gmap/marker-green.png";
			var orangeIcon  = "./images/gmap/marker-orange.png";
			var redIcon  = "./images/gmap/marker-red.png";
			var blueIcon  = "./images/gmap/marker-blue.png";
			
			
			
						if(ignition_v == 1)
						{
							if(ignition == 'ON'){
								//if(prevpointArr[0]['lat'] != prevpointArr[1]['lat'] && prevpointArr[0]['lon'] != prevpointArr[1]['lon']){
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
									
									/*}else{
									var markerLen = Ext.getCmp('trackingDeviceMapPanel').cache.marker.length;
									if(markerLen>0)
										Ext.getCmp('trackingDeviceMapPanel').cache.marker[markerLen-1].setAnimation(google.maps.Animation.BOUNCE);
								}*/
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
									
									//nov30
									if(prevpointArr[0]['lat'] == prevpointArr[1]['lat'] && prevpointArr[0]['lon'] == prevpointArr[1]['lon']){
										redIconFlag = false;
									}
									//30th
								}else{
									var markerLen = Ext.getCmp('trackingDeviceMapPanel').cache.marker.length;
									if(markerLen>0)
										Ext.getCmp('trackingDeviceMapPanel').cache.marker[markerLen-1].setAnimation(google.maps.Animation.BOUNCE);
									
									//nov30
									if(prevpointArr[0]['lat'] != prevpointArr[1]['lat'] && prevpointArr[0]['lon'] != prevpointArr[1]['lon']){
										redIconFlag = true;
									}//nov30
								}
								
								
								
								speedGauge.value = speed;
								RGraph.Effects.Gauge.Grow(speedGauge);

								fuelGauge.value = fuel;
								RGraph.Effects.Gauge.Grow(fuelGauge);
												
							}
						}
						else if(ignition_v == 0 || ignition_v == "" || ignition_v == null)
						{
							var point	= new google.maps.LatLng(parseFloat(latitude),parseFloat(longitude));
							Ext.getCmp('trackingDeviceMapPanel').gmap.setCenter(point, 16);

							var speelimit = parseDouble(deviceArr['speedlimit']);
							var curspeed  = parseDouble(speed);
							//var markerIcon	= redIcon;
							
							if(speed>1 && distance_latlan>0){
								markerIcon = blueIcon;
								/*if(prev_lat == latitude && prev_lan == longitude)
									cnt_latlan_stop1++;
								if(cnt_latlan_stop1>5)
									markerIcon	= redIcon;*/														
							}
							else{							
								if(distance_latlan>10){
									markerIcon = blueIcon;
									/*if(prev_lat == latitude && prev_lan == longitude){
										cnt_latlan_stop2++;
										if(cnt_latlan_stop2>5)
											markerIcon	= redIcon;
									}*/
								}
								else{
									markerIcon	= redIcon;
								}
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

							var markerLen = Ext.getCmp('trackingDeviceMapPanel').cache.marker.length;
							if(markerIcon	== redIcon)
								Ext.getCmp('trackingDeviceMapPanel').cache.marker[markerLen-1].setAnimation(google.maps.Animation.BOUNCE);
							
							speedGauge.value = speed;
							RGraph.Effects.Gauge.Grow(speedGauge);

							fuelGauge.value = fuel;
							RGraph.Effects.Gauge.Grow(fuelGauge);

							redIconFlag = true;

							prev_lat = latitude;
							prev_lan = longitude;
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

function Show_Gps_Track_Live(deviceid){
	var rtMap, rtRen, rtSer;
	var trackliveForm = Ext.create('Ext.form.Panel', {
		id:'trackliveForm',
		frame:true,
		border:false,
		height:50,
		padding:10,
		fieldDefaults: {
			labelAlign: 'right',
			msgTarget: 'side',
			labelSeparator:'',
			labelWidth: 120
		},
		defaultType: 'textfield',
		defaults: {
			anchor: '100%'
		},
		items: [{
			xtype: 'container',
			border:false,
			anchor: '100%',
			layout:'column',
			items:[{
				xtype: 'container',
				border:false,
				columnWidth:.3,
				layout: 'anchor',
				items: [{
					xtype:'combo',
					fieldLabel:'Device',
					store: live_device_combo_store,
					displayField: 'displayname',
					valueField: 'deviceid',
					queryMode:'local',
					emptyText:'Select Device...',
					labelWidth:60,
					name: 'GPS_tracking_deviceid',
					id:'GPS_tracking_deviceid',
					triggerAction: 'all',
					forceSelection: true,
					editable:true,
					selectOnFocus:true,
					anchor: '100%',
					//value:deviceid,
					listeners:{
						select:function(combo,records){
							var tracking_deviceid		= Ext.getCmp("GPS_tracking_deviceid").getValue();
							var tracking_deviceStore 	= Ext.getCmp("GPS_tracking_deviceid").getStore();
							var storeInd 				= tracking_deviceStore.findExact('deviceid',tracking_deviceid);
							var fuelcapacity			= tracking_deviceStore.getAt(storeInd).get("fuelcapacity");

							if(fuelcapacity==null || fuelcapacity=='undefined' || fuelcapacity==undefined)
								drawFuelGauge(90);
							else
								drawFuelGauge(fuelcapacity);
						},
						afterrender:function(){
							live_device_combo_store.load({
								callback: function() {
									if(deviceid){
										Ext.getCmp("GPS_tracking_deviceid").setValue(deviceid);
										var tracking_deviceStore 	= Ext.getCmp("GPS_tracking_deviceid").getStore();
										var storeInd 				= tracking_deviceStore.findExact('deviceid',deviceid);
										var fuelcapacity			= tracking_deviceStore.getAt(storeInd).get("fuelcapacity");

										if(fuelcapacity==null || fuelcapacity=='undefined' || fuelcapacity==undefined)
											drawFuelGauge(90);
										else
											drawFuelGauge(fuelcapacity);
									}
								}
							});
						}
					}

				}]
			},{
				 xtype: 'hiddenfield',
				 id:'selfuelcapacity',
				 name:'selfuelcapacity'
			},{
				xtype: 'container',
				border:false,
				columnWidth:.3,
				layout: 'anchor',
				style:'padding-left:10px',
				items: [{
					xtype:'button',
					id:'startTrackBut',
					text:'Start Tracking',
					handler:function(){
						//Ext.TaskManager.stop(trackingTask);
						Ext.TaskManager.start(trackingTask);
						Ext.getCmp("stopTrackBut").enable();
						Ext.getCmp("startTrackBut").disable();
						Ext.getCmp("GPS_tracking_deviceid").disable();
						redIconFlag = true;
					}
				},{
					xtype:'button',
					text:'Stop Tracking',
					id:'stopTrackBut',
					disabled:true,
					style:'margin-left:10px',
					handler:function(){
						Ext.TaskManager.stop(trackingTask);
						prevpointArr[0]	= new Array();
						prevpointArr[0]['lat'] = "";
						prevpointArr[0]['lon'] = "";
						prevpointArr[1]	= new Array();
						prevpointArr[1]['lat'] = "";
						prevpointArr[1]['lon'] = "";
						Ext.getCmp("startTrackBut").enable();
						Ext.getCmp("stopTrackBut").disable();
						Ext.getCmp("GPS_tracking_deviceid").enable();
						redIconFlag = true;
					}
				}]
			},{
				xtype: 'container',
				border:false,
				columnWidth:.4,
				layout: 'anchor',
				style:'padding-left:10px',
				items: [{
					xtype:'checkbox',
					id:'GPS_routechkbox',
					labelWidth:1,
					boxLabel:'Show Route',
					listeners:{
						change:function(chkBox, checked){
							if(checked){
								var tracking_deviceid		= Ext.getCmp("GPS_tracking_deviceid").getValue();
								var tracking_deviceStore 	= Ext.getCmp("GPS_tracking_deviceid").getStore();
								var storeInd 				= tracking_deviceStore.findExact('deviceid',tracking_deviceid);
								var routeid					= tracking_deviceStore.getAt(storeInd).get("routeid");
								if(routeid==0){
									Ext.Msg.alert("INFO","No Route Assigned for this Vehicle");
									this.setValue(0);
									return false;
								}
								Ext.Ajax.request({
									url: 'includes/georoute_ajx.php',
									params: {
										todo:'Get_Route',
										routeid : routeid
									},
									timeout: 600000000,
									success:function(response){
										var geoRes = Ext.decode(response.responseText);
										if(geoRes.success){
											var os = Ext.decode(geoRes.routedata);
											
											rtMap = Ext.getCmp("GPS_trackingDeviceMapPanel").getMap();
											rtRen = new google.maps.DirectionsRenderer( {'draggable':false} );
											rtRen.setMap(rtMap);
											rtSer = new google.maps.DirectionsService();
									
											var wp = [];
											for(var i=0;i<os.waypoints.length;i++)
												wp[i] = {'location': new google.maps.LatLng(os.waypoints[i][0], os.waypoints[i][1]),'stopover':false }
												
											rtSer.route({'origin':new google.maps.LatLng(os.start.lat,os.start.lng),
											'destination':new google.maps.LatLng(os.end.lat,os.end.lng),
											'waypoints': wp,
											'travelMode': google.maps.DirectionsTravelMode.DRIVING},function(res,sts) {
												if(sts=='OK'){
													rtRen.setDirections(res);
													google.maps.event.trigger(rtMap, "resize");
												}
											});
										}
									}
								});
							}else{
								rtRen.setMap(null);
							}
						}
					}
				}]
			}]
		}]
	});

	var trackliveWin = Ext.create('Ext.Window', {
		title: 'GPS Live Tracking',
		width:900,
		height:600,
		plain: true,
		closable:false,
		resizable:true,
		maximizable:true,
		border: false,
		layout: 'fit',
		modal:true,
		html:'<div id="gaugeChart" style="position: absolute;width: 320px;height: 150px; bborder: 1px solid red;bottom: 15px;right: 5px;"><canvas id="speedChart" width="150" height="150">[No canvas support]</canvas><canvas id="fuelChart" width="150" height="150">[No canvas support]</canvas></div>',
		items: [{
			layout:'border',
			items:[{
				region:'north',
				items:[trackliveForm]
			},{
				region:'center',
				xtype: 'gmappanel',
				id:'GPS_trackingDeviceMapPanel',
				zoomLevel: 16,
				gmapType: 'map',
				mapConfOpts: ['enableScrollWheelZoom','enableDoubleClickZoom','enableDragging'],
				mapControls: ['GSmallMapControl','GMapTypeControl','NonExistantControl'],
				setCenter: {
					//geoCodeAddr: 'Giri Road,Chennai',
					lat:13.04836518143244, 
					lng:80.2421048283577,
					marker: {title: 'InnovMax Technologies'}
				},
				listeners:{
					afterrender:function(){

						speedGauge = new RGraph.Gauge('speedChart', 0, 200, 0);

						speedGauge.Set('chart.background.color', '#000');
						speedGauge.Set('chart.border.width', '2');
						speedGauge.Set('chart.scale.decimals', 0);
						speedGauge.Set('chart.tickmarks.small', 50);
						speedGauge.Set('chart.tickmarks.big',5);
						speedGauge.Set('chart.needle.tail',true);
						speedGauge.Set('chart.centerpin.radius',5);
						speedGauge.Set('chart.shadow',false);

						//speedGauge.Set('chart.background.gradient', true);
						//speedGauge.Set('chart.needle.colors','#FF1493');
						//gauge1.Set('chart.title.top', 'Speed');
						//gauge1.Set('chart.title.top.size', 10);
						speedGauge.Set('chart.title.bottom', 'Speed');
						speedGauge.Set('chart.title.bottom.size', '8');
						speedGauge.Set('chart.title.bottom.color', '#666');
						//speedGauge.Set('chart.title.bottom.pos', -15);
						speedGauge.Set('chart.text.size', '6');
						speedGauge.Set('chart.text.color', 'cyan');
						//gauge1.Set('chart.shadow',false);
						//speedGauge.Set('chart.title.bottom.color', '#aaa');
						speedGauge.Set('chart.colors.ranges', [[0, 60, '#009933'], [60, 80, '#DB7093'], [80, 120, '#FFA07A'], [120, 200, '#FF4500']]);
						speedGauge.Draw();

						/*****************
						 *
						 * call fuel chart fn.
						 *
						 **/
						drawFuelGauge(90);
					}
				}
			}]
		}],
		buttons: [{
			text: 'Close',
			handler: function() {
				Ext.TaskManager.stop(trackingTask);
				trackliveWin.destroy();
			}
		}]
	}).show();

}


function drawFuelGauge(fuelmaxValue){
	fuelGauge = new RGraph.Gauge('fuelChart', 0,fuelmaxValue, 0);
	fuelGauge.Set('chart.background.color', '#000');
	fuelGauge.Set('chart.border.width', '2');
	fuelGauge.Set('chart.scale.decimals', 0);
	fuelGauge.Set('chart.tickmarks.small', 50);
	fuelGauge.Set('chart.tickmarks.big',5);
	fuelGauge.Set('chart.needle.tail',true);
	fuelGauge.Set('chart.centerpin.radius',5);
	fuelGauge.Set('chart.shadow',false);

	//fuelGauge.Set('chart.background.gradient', true);

	//gauge2.Set('chart.title.top', 'Speed');
	//gauge2.Set('chart.title.top.size', 24);
	fuelGauge.Set('chart.title.bottom', 'Fuel');
	fuelGauge.Set('chart.title.bottom.size', '8');
	fuelGauge.Set('chart.title.bottom.color', '#666');
	fuelGauge.Set('chart.text.size', '6');
	fuelGauge.Set('chart.text.color', 'cyan');
	//fuelGauge.Set('chart.colors.ranges', [[0, 20, '#FF4500'],[20, 40, '#DB7093'],[40, 90, '#8FBC8F']]);
	fuelGauge.Set('chart.colors.ranges', [[0, 5, '#FF4500'],[5, fuelmaxValue, '#009933']]);
	fuelGauge.Draw();
}

