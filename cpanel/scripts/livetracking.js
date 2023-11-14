function showLiveTacking(){
	var lrtMap, lrtRen, lrtSer;
	
	/* Ext.define('CustomerNamesStore_filter_live', {
        extend: 'Ext.data.Model',
		fields: [
			{name: 'deviceid',mapping: 'deviceid',type:'int'},
			{name: 'devicename',mapping: 'devicename', type: 'string'}
        ]
	});	
	var liveCustomersStore_filter = new Ext.data.Store({
		model: 'CustomerNamesStore_filter_live',
		proxy: {
			type: 'ajax',
			url: 'includes/combo_ajx.php',
			actionMethods: {
				read: 'POST'
			},
            extraParams: {
				todo : 'Get_Customers_List_live'
				
            },
			reader: {
				type: 'json',
				root: 'DEVICES_LIVE'
			}
		}
	}); */
	
	
	var trackingDashboard = Ext.getCmp('trackingDashboard');
	trackingDashboard.add({
		baseCls:'x-plain',
		layout:{
			type:'fit'
		},
		tbar:['Device : ',{
			xtype:'combo',
			store: live_device_combo_store,
			displayField: 'devicename',
			valueField: 'deviceid',
			queryMode:'local',
			emptyText:'Select Device...',
			name: 'tracking_deviceid',
			id:'tracking_deviceid',
			triggerAction: 'all',
			forceSelection: true,
			editable:true,
			selectOnFocus:true,
			width: 200,
			listeners:{
				select:function(combo,records){
					var tracking_deviceid		= Ext.getCmp("tracking_deviceid").getValue();
					var tracking_deviceStore 	= Ext.getCmp("tracking_deviceid").getStore();
					var storeInd 				= tracking_deviceStore.findExact('deviceid',tracking_deviceid);
					var fuelcapacity			= tracking_deviceStore.getAt(storeInd).get("fuelcapacity");					
					var tracking_dev_type		= tracking_deviceStore.getAt(storeInd).get("devicetype");

					if(fuelcapacity==null || fuelcapacity=='undefined' || fuelcapacity==undefined || fuelcapacity==0)
						drawFuelGauge(90);
					else
						drawFuelGauge(fuelcapacity);

					
					var fuel_id = document.getElementById("fuelChart");
					var speed_id = document.getElementById("speedChart");
					if(tracking_deviceid!="")
					{
						speed_id.style.visibility = 'visible';
					}

					//if(tracking_dev_type=='CTS' || tracking_deviceid==8)
					//{						
					//	fuel_id.style.visibility = 'hidden';
					//}
					//else
					/*if(tracking_dev_type=='VTS' && tracking_deviceid!=8)
					{
						fuel_id.style.visibility = 'visible';
					}*/

					var fuelstatus = tracking_deviceStore.getAt(storeInd).get("fuelstatus");
					if(fuelstatus==1 && tracking_dev_type=='VTS')
					{
						fuel_id.style.visibility = 'visible';
					}
					else
						fuel_id.style.visibility = 'hidden';										
	
					Ext.TaskManager.stopAll();
					prevpointArr[0]	= new Array();
					prevpointArr[0]['lat'] = "";
					prevpointArr[0]['lon'] = "";
					prevpointArr[1]	= new Array();
					prevpointArr[1]['lat'] = "";
					prevpointArr[1]['lon'] = "";								
					redIconFlag = true;
					cnt_latlan_stop1=0;
					cnt_latlan_stop2=0;
					Ext.TaskManager.start(trackingTask);
					
				},
				afterrender:function(){
					live_device_combo_store.load({
						callback: function() {
							
						}
					});
				}
			}
		},'-',{
			xtype:'checkbox',
			id:'routechkbox',
			labelWidth:1,
			boxLabel:'Show Route',
			listeners:{
				change:function(chkBox, checked){
					if(checked){
						var tracking_deviceid		= Ext.getCmp("tracking_deviceid").getValue();
						if(tracking_deviceid==null){
							Ext.Msg.alert("INFO","Please select the Device");
							this.setValue(0);
							return false;
						}
						var tracking_deviceStore 	= Ext.getCmp("tracking_deviceid").getStore();
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
									
									lrtMap = Ext.getCmp("trackingDeviceMapPanel").getMap();
									lrtRen = new google.maps.DirectionsRenderer( {'draggable':false} );
									lrtRen.setMap(lrtMap);
									lrtSer = new google.maps.DirectionsService();
							
									var wp = [];
									for(var i=0;i<os.waypoints.length;i++)
										wp[i] = {'location': new google.maps.LatLng(os.waypoints[i][0], os.waypoints[i][1]),'stopover':false }
										
									lrtSer.route({'origin':new google.maps.LatLng(os.start.lat,os.start.lng),
									'destination':new google.maps.LatLng(os.end.lat,os.end.lng),
									'waypoints': wp,
									'travelMode': google.maps.DirectionsTravelMode.DRIVING},function(res,sts) {
										if(sts=='OK'){
											lrtRen.setDirections(res);
											google.maps.event.trigger(lrtMap, "resize");
										}
									});
								}
							}
						});
					}else{
						lrtRen.setMap(null);
					}
				}
			}
		},'-',{
			//xtype:'button',
			text:'View History',
			icon:'images/history.png',
			handler: function(){
				var history_deviceid		= Ext.getCmp("tracking_deviceid").getValue();
				if(history_deviceid==null){
					Ext.Msg.alert("INFO","Please select the Device");
					//this.setValue(0);
					//return false;
				}
				else
				{
					Show_Gps_Track_History(history_deviceid);
				}
			}
		},'->',{
			text:'View Geo Fence',
			icon:'images/geofences.png',
			handler:function(){
				var tracking_deviceid		= Ext.getCmp("tracking_deviceid").getValue();
				//alert(tracking_deviceid);
				if(tracking_deviceid==null){
					Ext.Msg.alert("INFO","Please select the Device");
					return false;
				}
				var tracking_deviceStore 	= Ext.getCmp("tracking_deviceid").getStore();
				var storeInd 				= tracking_deviceStore.findExact('deviceid',tracking_deviceid);
				var fenceid					= tracking_deviceStore.getAt(storeInd).get("fenceid");
				if(fenceid>0){
					Show_Poly_Path(fenceid);
				}else{
					Ext.Msg.alert("INFO","Geo Fence is not Assigned for this Vehicle");
				}
			}
		},'-',{
			text:'View Route',
			icon:'images/route.png',
			handler:function(){
				var tracking_deviceid		= Ext.getCmp("tracking_deviceid").getValue();
				if(tracking_deviceid==null){
					Ext.Msg.alert("INFO","Please select the Device");
					return false;
				}
				var tracking_deviceStore 	= Ext.getCmp("tracking_deviceid").getStore();
				var storeInd 				= tracking_deviceStore.findExact('deviceid',tracking_deviceid);
				var routeid					= tracking_deviceStore.getAt(storeInd).get("routeid");
				//alert(routeid);
				if(routeid>0){
					Show_Route(routeid);
				}else{
					Ext.Msg.alert("INFO","Route is not Assigned for this Vehicle");
				}
			}
		}],
		html:'<div id="gaugeChart" style="position: absolute;width: 320px;height: 150px; bborder: 1px solid red;bottom: 15px;right: 5px;"><canvas id="fuelChart" style="visibility:hidden" width="150" height="150">[No canvas support]</canvas><canvas id="speedChart" style="visibility:hidden" width="150" height="150">[No canvas support]</canvas></div>',
		items: [{
			xtype: 'gmappanel',
			id:'trackingDeviceMapPanel',
			
			zoomLevel: 16,
			gmapType: 'map',
			style:'margin:25px 0px',
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
					
					//google.maps.event.trigger(Ext.getCmp("trackingDeviceMapPanel").getMap(), "resize");
				}
			}
		}]
	}).show();
	trackingDashboard.doLayout();
}