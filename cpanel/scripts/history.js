var startHistoryInd = 0;
var endHistoryInd = 0;
var prevHisLatLanPoint = "";
var selectedDeviceId = "";

var speedHistoryGauge;
var fuelHistoryGauge;

function Show_Gps_Track_History(deviceid){
	selectedDeviceId = deviceid; //by kumar. to show the device as selected currently
	Ext.define('history_store_data', {
		extend: 'Ext.data.Model',
		fields: [
			{name: 'gpsid', type: 'string'},
			{name: 'startpoint', type: 'string'},
			{name: 'endpoint', type: 'string'},
			{name: 'latitude', type: 'string'},
			{name: 'longitude', type: 'string'},
			{name: 'speed', type: 'string'},
			{name: 'fuel', type: 'string'},
			{name: 'datetime', type: 'string'},
			{name: 'distance', type: 'string'},
			{name: 'ignition', type: 'string'},
			{name: 'door', type: 'string'}
		]
	});

	var history_track_store = new Ext.data.Store({
		model: 'history_store_data',
		//pageSize: 25,
		autoLoad:true,
		//buffered:true,		
		//leadingBufferZone : 12,
		proxy: {
			type: 'ajax',
			url: 'includes/tracking_ajx.php',
			actionMethods: {
				read: 'POST'
			},
			extraParams: {
				todo : 'Get_History_Datas'
			},
			reader: {
				type: 'json',
				root: 'HISTORY',
				totalProperty: 'totalCount'
			}
		}
	});

	var history_track_col	= [
		{text: "Start", dataIndex: 'startpoint', width:50, sortable: false,
			renderer:function(val, mdata, record, rowInd , colInd){
				if(rowInd==0){
					return Ext.String.format("<input type='radio' id='startpoint"+rowInd+"' name='startpoint' value='"+rowInd+"' onClick='startHistoryInd=this.value;' checked/>",val);
				}else{
					return Ext.String.format("<input type='radio' id='startpoint"+rowInd+"' name='startpoint' value='"+rowInd+"' onClick='startHistoryInd=this.value;'/>",val);
				}
			}
		},
		{text: "End", dataIndex: 'endpoint', width:50, sortable: false,
			renderer:function(val, mdata, record, rowInd , colInd){
				if(rowInd==history_track_store.getCount()-1){
					return Ext.String.format("<input type='radio' id='endpoint"+rowInd+"' name='endpoint' value='"+rowInd+"' onClick='endHistoryInd=this.value;' checked/>",val);
				}else{
					return Ext.String.format("<input type='radio' id='endpoint"+rowInd+"' name='endpoint' value='"+rowInd+"' onClick='endHistoryInd=this.value;'/>",val);
				}
			}
		},
		{text: "Date & Time", dataIndex: 'datetime', flex:1, sortable: true},
		{text: "Speed", dataIndex: 'speed', width:60, sortable: false},
		{text: "Fuel", dataIndex: 'fuel', width:60, sortable: false},
		{text: "Distance", dataIndex: 'distance', width:60, sortable: false,
			renderer:function(val, mdata, record, rowInd , colInd){

				/*var lat1	= history_track_store.getAt(0).get("latitude");
				var lon1	= history_track_store.getAt(0).get("latitude");

				var lat2	= history_track_store.getAt(rowInd).get("latitude");
				var lon2	= history_track_store.getAt(rowInd).get("latitude");

				var R = 6371; // km
				var dLat = toRad(lat2-lat1);
				var dLon = toRad(lon2-lon1);
				//var lat1 = lat1.toRad();
				//var lat2 = lat2.toRad();

				var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
						Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
				var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
				var d = R * c;
				return d;*/
				return val;
			}
		}
	];

    var historyForm = Ext.create('Ext.form.Panel', {
		id:'historyForm',
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
					store: device_history_combo_store,
					displayField: 'devicename',
					valueField: 'deviceid',
					queryMode:'local',
					emptyText:'Select Device...',
					labelWidth:60,
					name: 'histor_deviceid',
					id:'histor_deviceid',
					triggerAction: 'all',
					forceSelection: true,
					editable:true,
					selectOnFocus:true,
					anchor: '100%',
					listeners:{
						select:function(combo,records){
							var tracking_deviceid		= Ext.getCmp("histor_deviceid").getValue();
							var tracking_deviceStore 		= Ext.getCmp("histor_deviceid").getStore();
							var storeInd 				= tracking_deviceStore.findExact('deviceid',tracking_deviceid);
							var fuelcapacity			= tracking_deviceStore.getAt(storeInd).get("fuelcapacity");

							if(fuelcapacity==null || fuelcapacity=='undefined' || fuelcapacity==undefined)
								drawFuelGaugeHistory(90);
							else
								drawFuelGaugeHistory(fuelcapacity);

							var tracking_dev_type		= tracking_deviceStore.getAt(storeInd).get("devicetype");
							var fuel_id = document.getElementById("fuelHistoryChart");
							var speed_id = document.getElementById("speedHistoryChart");
							if(tracking_deviceid!="")
							{
								speed_id.style.visibility = 'visible';
							}

							/*(tracking_dev_type=='CTS' || tracking_deviceid==8)
							{						
								fuel_id.style.visibility = 'hidden';
							}
							else
							if(tracking_dev_type=='VTS' && tracking_deviceid!=8)
							{
								fuel_id.style.visibility = 'visible';
							}*/
						},
						afterrender:function(){
							//alert(deviceid);
							device_history_combo_store.load({
								callback: function() {
									if(deviceid){
										Ext.getCmp("histor_deviceid").setValue(deviceid);
									}
								}
							});
						}
					}
                }]
            },{
                xtype: 'container',
                border:false,
                columnWidth:.30,
                layout: 'anchor',
                items: [
					new Ext.ux.form.field.DateTime({
						fieldLabel:'Start Date',
						labelWidth:60,
						//style:'margin-top:3px;',
						id: 'history_device_start_date',
						name: 'history_device_start_date',
						format:'d-m-Y',
						altFormats:'d.m.Y|d/m/Y',
						anchor:'100%',
						blankText:'Please select the Start Date',
						allowBlank:false,
						listeners:{
							select:function(){
								alert(this.value);
							}
						}
					})/*{
                   xtype:'datefield',
				   fieldLabel:'Start Date',
				   labelWidth:60,
				   id:'history_device_start_date',
				   name:'history_device_start_date',
				   anchor:'100%',
				   format:'d-m-Y',
				   altFormats:'d.m.Y/d/m/Y',
				   blankText:'Please select the Start Date',
				   allowBlank:false
                }*/]
            },{
                xtype: 'container',
                border:false,
                columnWidth:.30,
                layout: 'anchor',
                items: [
					new Ext.ux.form.field.DateTime({
						fieldLabel:'End Date',
						labelWidth:60,
						//style:'margin-top:3px;',
						id: 'history_device_end_date',
						name: 'history_device_end_date',
						format:'d-m-Y',
						altFormats:'d.m.Y|d/m/Y',
						anchor:'100%',
						blankText:'Please select the Start Date',
						allowBlank:false
					})
					/*{
					xtype:'datefield',
					fieldLabel:'End Date',
					labelWidth:60,
					id:'history_device_end_date',
					name:'history_device_end_date',
					anchor:'100%',
					format:'d-m-Y',
					altFormats:'d.m.Y/d/m/Y',
					blankText:'Please select the Start Date',
					allowBlank:false
                }*/]
            },{
                xtype: 'container',
                border:false,
                columnWidth:.10,
                layout: 'anchor',
                style:'margin-left:10px',
                items: [{
                	xtype:'button',
                	text:'History',
			//floating: false,
			//scale:'small',
			menuAlign:'bl',
			width: 60,
					menu: [
						{text: 'Today', floating: false, handler: onItemClick, id:'today'},
						{text: 'Yesterday', floating: false, handler: onItemClick, id:'yesterday'},
						{text: 'Fetch History', floating: false, handler: onItemClick, id:'fetch_hist_id'}
					]					
                }]
            }]
        }]
    });

	function onItemClick(item){
		var menu_id = item.id;
		Ext.getCmp('historyMapPanel').clearOverlays();
		if(menu_id == 'today' || menu_id == 'yesterday'){
			var deviceid 	= Ext.getCmp("histor_deviceid").getValue();
			if(menu_id == 'today')
			{
				var startdate = new Date();
				var enddate	  = startdate;
				/* alert(startdate);
				alert(enddate); */
			}
			else
			{
				var startdate = new Date();
				startdate.setDate(startdate.getDate()-1);
				var enddate	  = startdate;
				/* alert(startdate);
				alert(enddate); */
			}
			startdate	= Ext.util.Format.date(startdate, "Y-m-d 00:00:00");
			enddate		= Ext.util.Format.date(enddate, "Y-m-d 23:59:59");
			Ext.getCmp("historyGrid").expand();
			Ext.TaskManager.stop(historyTrackTask);
			startHistoryInd = 0;
			endHistoryInd = 0;
			Ext.getCmp("historyGrid").getEl().mask("Please wait...Fetching History Datas...");
			history_track_store.proxy.extraParams = {todo:'Get_History_Datas', deviceid:deviceid, startdate:startdate, enddate:enddate};
			var his_cnt = history_track_store.getCount();
			//alert(his_cnt);
			if(his_cnt == 0)
			{						
				Ext.getCmp("startTrackHisBut").disable();
				Ext.getCmp("stopTrackHisBut").disable();
				Ext.getCmp("route_chkboxid").disable();
			}
			else
			{
				Ext.getCmp("startTrackHisBut").enable();
				Ext.getCmp("stopTrackHisBut").enable();
				Ext.getCmp("route_chkboxid").enable();
				Ext.getCmp("clear_trck_id").enable();
				//Ext.getCmp("Histy_Win_Pbar").enable();
			}
			
			history_track_store.load({
				params:{deviceid:deviceid, startdate:startdate, enddate:enddate},
				callback: function() {
					endHistoryInd = history_track_store.getCount()-1;
					his_cnt = history_track_store.getCount();
					//console.log("endHistoryInd :"+endHistoryInd);
					//Ext.getCmp("historyGrid").getView().select(0);
					Ext.getCmp("historyGrid").getEl().unmask();
					//alert(his_cnt);
					if(his_cnt == 0)
					{						
						Ext.getCmp("startTrackHisBut").disable();
						Ext.getCmp("stopTrackHisBut").disable();
						Ext.getCmp("route_chkboxid").disable();
					}
					else
					{
						Ext.getCmp("startTrackHisBut").enable();
						Ext.getCmp("stopTrackHisBut").enable();
						Ext.getCmp("route_chkboxid").enable();
						Ext.getCmp("clear_trck_id").enable();
					}
				}
			});
		}
		if(menu_id == 'fetch_hist_id')
		{
			var deviceid 	= Ext.getCmp("histor_deviceid").getValue();
			var startdate	= Ext.getCmp("history_device_start_date").getValue();
			var enddate		= Ext.getCmp("history_device_end_date").getValue();
			if(deviceid==""){
				Ext.Msg.alert("INFO", "Please select the Device");
				return false;
			}
			if(startdate=="" || startdate == null){
				Ext.Msg.alert("INFO", "Please select the Start Date");
				return false;
			}
			if(enddate=="" || enddate == null){
				Ext.Msg.alert("INFO", "Please select the End Date");
				return false;
			}
			startdate	= Ext.util.Format.date(startdate, "Y-m-d H:i:s");
			enddate		= Ext.util.Format.date(enddate, "Y-m-d H:i:s");
			Ext.getCmp("historyGrid").expand();
			Ext.TaskManager.stop(historyTrackTask);
			startHistoryInd = 0;
			endHistoryInd = 0;
			Ext.getCmp("historyGrid").getEl().mask("Please wait...Fetching History Datas...");
			history_track_store.proxy.extraParams = {todo:'Get_History_Datas', deviceid:deviceid, startdate:startdate, enddate:enddate};
			var his_cnt = history_track_store.getCount();
			if(his_cnt == 0)
			{						
				Ext.getCmp("startTrackHisBut").disable();
				Ext.getCmp("stopTrackHisBut").disable();
				Ext.getCmp("route_chkboxid").disable();
			}
			else
			{
				Ext.getCmp("startTrackHisBut").enable();
				Ext.getCmp("stopTrackHisBut").enable();
				Ext.getCmp("route_chkboxid").enable();
				Ext.getCmp("clear_trck_id").enable();
				//Ext.getCmp("Histy_Win_Pbar").enable();
			}
			history_track_store.load({
				params:{deviceid:deviceid, startdate:startdate, enddate:enddate},
				callback: function() {
					endHistoryInd = history_track_store.getCount()-1;
					his_cnt = history_track_store.getCount();
					//console.log("endHistoryInd :"+endHistoryInd);
					//Ext.getCmp("historyGrid").getView().select(0);
					Ext.getCmp("historyGrid").getEl().unmask();
					
					if(his_cnt == 0)
					{						
						Ext.getCmp("startTrackHisBut").disable();
						Ext.getCmp("stopTrackHisBut").disable();
						Ext.getCmp("route_chkboxid").disable();
					}
					else
					{
						Ext.getCmp("startTrackHisBut").enable();
						Ext.getCmp("stopTrackHisBut").enable();
						Ext.getCmp("route_chkboxid").enable();
					}
				}
			});			
		}
	}
	
	var checkModel = new Ext.selection.CheckboxModel({
		showHeaderCheckbox:false
	});

	var rtMap, rtRen, rtSer;
	var historyWin = Ext.create('Ext.Window', {
        title: 'GPS TRACK HISTORY',
        width:1000,
        height:600,
        plain: true,
		modal:true,
		closable:false,
		border: false,
		maximizable:true,
        layout: 'fit',
		//html:'<div id="gaugeChart" style="position: absolute;width: 520px;height: 150px;bborder: 1px solid red;bottom: 50px;right: 60px;"></div>',
		html:'<div id="gaugeChart" style="position: absolute;width: 320px;height: 150px;bborder: 1px solid red;bottom: 15px;right: 5px;"><canvas id="fuelHistoryChart" style="visibility:hidden" width="150" height="150">[No canvas support]</canvas><canvas id="speedHistoryChart" width="150" height="150">[No canvas support]</canvas></div>',
        items: [{
        	layout:'border',
        	items:[{
        		region:'north',
        		items:[historyForm]
        	},
			{
        		region:'center',
				layout: {
					type: 'border'
				},
				items:[{
					xtype: 'grid',
					id:'historyGrid',
					title:'History',
					width: 400,
					region: 'west',
					split: true,
					collapsible: true,
					//collapseMode: 'mini',
					enableColumnHide:false,
					enableColumnMove:false,
					//showHeaderCheckbox:false,
					layout: 'fit',
					autoScroll:true,
					loadMask: true,
					store:history_track_store,
					//selModel: checkModel,
					selModel: {
						selType: 'rowmodel',
						mode : 'SINGLE'
					},
					viewConfig: {
						forceFit:true,
						stripeRows: true,
						emptyText:"<span class='tableTextM'>No Records Found</span>"
					},
					columns: history_track_col,
					border:false,
					stripeRows: true,
					fbar:[/*{
						xtype: 'pagingtoolbar',
						id:'Histy_Win_Pbar',
						store: history_track_store,
						flex:1,
						pageSize: 25//,
						//disabled:true
					},*/{
						xtype:'checkbox',
						boxLabel:'Show Route',
						id:'route_chkboxid',
						listeners:{
							change:function(chkBox, checked){
								if(checked){
									var histor_deviceid			= Ext.getCmp("histor_deviceid").getValue();
									var history_deviceStore 	= Ext.getCmp("histor_deviceid").getStore();
									var storeInd 				= history_deviceStore.findExact('deviceid',histor_deviceid);
									var routeid					= history_deviceStore.getAt(storeInd).get("routeid");
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
												
												rtMap = Ext.getCmp("historyMapPanel").getMap();
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
					},/* {
						text:'Start Track',
						id:'startTrackHisBut',
						handler:start_stop_history_track
					},{
						text:'Stop Track',
						id:'stopTrackHisBut',
						handler:start_stop_history_track
					} */]
				},{
					region:'center',
					xtype: 'gmappanel',
					id:'historyMapPanel',
					flex:1,
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
							speedHistoryGauge = new RGraph.Gauge('speedHistoryChart', 0, 200, 0);

							speedHistoryGauge.Set('chart.background.color', '#000');
							speedHistoryGauge.Set('chart.border.width', '2');
							speedHistoryGauge.Set('chart.scale.decimals', 0);
							speedHistoryGauge.Set('chart.tickmarks.small', 50);
							speedHistoryGauge.Set('chart.tickmarks.big',5);
							speedHistoryGauge.Set('chart.needle.tail',true);
							speedHistoryGauge.Set('chart.centerpin.radius',5);
							speedHistoryGauge.Set('chart.shadow',false);

							//speedGauge.Set('chart.background.gradient', true);
							//speedGauge.Set('chart.needle.colors','#FF1493');
							//gauge1.Set('chart.title.top', 'Speed');
							//gauge1.Set('chart.title.top.size', 10);
							speedHistoryGauge.Set('chart.title.bottom', 'Speed');
							speedHistoryGauge.Set('chart.title.bottom.size', '8');
							speedHistoryGauge.Set('chart.title.bottom.color', '#666');
							//speedGauge.Set('chart.title.bottom.pos', -15);
							speedHistoryGauge.Set('chart.text.size', '6');
							speedHistoryGauge.Set('chart.text.color', 'cyan');
							//gauge1.Set('chart.shadow',false);
							//speedGauge.Set('chart.title.bottom.color', '#aaa');
							speedHistoryGauge.Set('chart.colors.ranges', [[0, 60, '#009933'], [60, 80, '#DB7093'], [80, 120, '#FFA07A'], [120, 200, '#FF4500']]);
							speedHistoryGauge.Draw();



							/*****************
							 *
							 * call fuel chart fn.
							 *
							 **/
							drawFuelGaugeHistory(90);
						}
					}
				}]
			}/*,
			{
				region:'south',
				xtype:'container',
				height:200,
				id:'speedgauge',
				renderer:function(){
					dial.setValue(80);
				}
				//,
				//html:'<div id="container" style="height: 200px; position: relative"></div>'

			}*/
			]
        }],
		buttonAlign:'left',
		buttons: [
			{
				text:'Start Track',
				id:'startTrackHisBut',
				margin:'0 0 0 235',
				//disabled:true,
				handler:start_stop_history_track
			},{
				text:'Stop Track',
				id:'stopTrackHisBut',
				margin:'0 10 0 10',
				disabled:true,
				handler:start_stop_history_track
			},
			{
				text:'Clear Tracks',
				id:'clear_trck_id',
				margin:'0 0 0 415',
				//disabled:true,
				handler:function(){
					//Ext.getCmp("historyGrid").getStore().removeAll();
					Ext.getCmp('historyMapPanel').clearOverlays(); //to clear the already placed markers. added by kumar S
					prevHisLatLanPoint="";
				}
			},
			{
				text: 'Close',
				margin:'0 10 0 10',
				handler: function() {
					Ext.TaskManager.stop(historyTrackTask);
					//Ext.getCmp("startTrackHisBut").enable();
					//Ext.getCmp("stopTrackHisBut").disable();
					//Ext.getCmp("historyForm").enable();
					historyWin.destroy();
				}
			}
		]
		/* buttons: [
			{
				text:'Clear Tracks',
				handler:function(){
					//Ext.getCmp("historyGrid").getStore().removeAll();
					Ext.getCmp('historyMapPanel').clearOverlays(); //to clear the already placed markers. added by kumar S
					prevHisLatLanPoint="";
				}
			},
			{
				text: 'Close',
				handler: function() {
					Ext.TaskManager.stop(historyTrackTask);
					Ext.getCmp("startTrackHisBut").enable();
					Ext.getCmp("stopTrackHisBut").disable();
					Ext.getCmp("historyForm").enable();
					historyWin.destroy();
				}
			}
		] */
    }).show();
	/**
	 *
	 * show the selected device in combo box.
	 *
	 ***/
	if(selectedDeviceId!="" || selectedDeviceId!='undefined'){
		//alert(selectedDeviceId);
		Ext.getCmp('histor_deviceid').setValue(selectedDeviceId);
		//alert(Ext.getCmp('history_deviceid').getValue());
	}
//history_track_store.load({params:{start:0,limit:25}});
}


var historyTrackTask = {
	run: function(){
		var historyGridStore = Ext.getCmp("historyGrid").getStore();
		var historyMapPanel	= Ext.getCmp("historyMapPanel");

		if(historyMapPanel){
			var latitude 	= historyGridStore.getAt(startHistoryInd).get("latitude");
			var longitude 	= historyGridStore.getAt(startHistoryInd).get("longitude");
			var speed		= historyGridStore.getAt(startHistoryInd).get("speed");
			var fuel		= historyGridStore.getAt(startHistoryInd).get("fuel");
			var ignition	= historyGridStore.getAt(startHistoryInd).get("ignition");
			var door		= historyGridStore.getAt(startHistoryInd).get("door");

			deviceHistoryArr['speed']	= speed;
			deviceHistoryArr['fuel']	= fuel;
			deviceHistoryArr['ignition']	= ignition;
			deviceHistoryArr['door']	= door;
			
			var greenIcon = "./images/gmap/marker-green.png";
			var orangeIcon  = "./images/gmap/marker-orange.png";
			var redIcon  = "./images/gmap/marker-red.png";

			//var curr_latlong_point = new GLatLng(parseFloat(latitude),parseFloat(longitude));
			var curr_latlong_point	= new google.maps.LatLng(parseFloat(latitude),parseFloat(longitude));
			Ext.getCmp('historyMapPanel').gmap.setCenter(curr_latlong_point, 16);

			var markerClear = false;
			if(startHistoryInd==0)
				markerClear = true;

			var speelimit = parseDouble(deviceHistoryArr['speedlimit']);
			var curspeed  = parseDouble(speed);
			var markerIcon	= greenIcon;
			if(curspeed > speelimit && curspeed!=0.00){
				markerIcon 	= orangeIcon;
			}else{
				markerIcon	= greenIcon;
			}

			if(ignition == 'OFF'){
				markerIcon = redIcon;
			}
			
			var markerJson = {title:deviceHistoryArr['devicename'], icon:markerIcon,
				infoWindow:{
					infoArray:deviceHistoryArr
				}
			};

			var markerCenter = Ext.getCmp('historyMapPanel').getMap().getCenter();
			var markerListener = {
				
			}

			Ext.get("startpoint"+startHistoryInd).dom.checked=true;
			Ext.getCmp("historyGrid").getView().select(startHistoryInd);

			/*if(startHistoryInd == 24){
				Histy_Win_Pbar.moveNext();	
			}*/

			if(prevHisLatLanPoint!=curr_latlong_point){
				Ext.getCmp('historyMapPanel').addMarker(curr_latlong_point, markerJson, markerClear, markerCenter, markerListener, deviceHistoryArr);
				speed	= Ext.util.Format.round(speed);
				
				speedHistoryGauge.value = speed;
				RGraph.Effects.Gauge.Grow(speedHistoryGauge);

				fuelHistoryGauge.value = fuel;
				RGraph.Effects.Gauge.Grow(fuelHistoryGauge);
			}

			if(prevHisLatLanPoint!=""){
				//Ext.getCmp('historyMapPanel').addPolyline(prevHisLatLanPoint,curr_latlong_point,false,true);
				Ext.getCmp('historyMapPanel').addPolyline(prevHisLatLanPoint,curr_latlong_point);
			}
			prevHisLatLanPoint	= curr_latlong_point;

			//console.log(startHistoryInd+"\n"+endHistoryInd);
			if(startHistoryInd == endHistoryInd){
				Ext.TaskManager.stop(historyTrackTask);
				Ext.getCmp("startTrackHisBut").enable();
				Ext.getCmp("stopTrackHisBut").disable();
				Ext.getCmp("historyForm").enable();
			}
			startHistoryInd++;
		}else{
			Ext.TaskManager.stop(historyTrackTask);
		}
	},
	interval: 3000
};
function start_stop_history_track(){
	if(this.text=="Start Track"){
		var gridCount = Ext.getCmp("historyGrid").getStore().getCount()-1;
		Ext.TaskManager.stop(historyTrackTask);
		//startHistoryInd 	= Ext.get("startpoint"+startHistoryInd).dom.value;
		//endHistoryInd 	= Ext.get("endpoint"+gridCount).dom.value;

		if(Ext.getCmp("histor_deviceid")){
			var histor_deviceid		= Ext.getCmp("histor_deviceid").getValue();
			var history_deviceStore 	= Ext.getCmp("histor_deviceid").getStore();
			var storeInd 				= history_deviceStore.findExact('deviceid',histor_deviceid);
			var devicename				= history_deviceStore.getAt(storeInd).get("devicename");
			var fuelcapacity			= history_deviceStore.getAt(storeInd).get("fuelcapacity");
			var speedlimit				= history_deviceStore.getAt(storeInd).get("speedlimit");
			var devicetype				= history_deviceStore.getAt(storeInd).get("devicetype");
			var vehiclename				= history_deviceStore.getAt(storeInd).get("vehiclename");
			var regnno					= history_deviceStore.getAt(storeInd).get("regnno");
			var drivername				= history_deviceStore.getAt(storeInd).get("drivername");
			var driverMobile			= history_deviceStore.getAt(storeInd).get("driverMobile");
			var kidname					= history_deviceStore.getAt(storeInd).get("kidname");
			var kidsMobile				= history_deviceStore.getAt(storeInd).get("kidsMobile");

			deviceHistoryArr	= new Array();
			deviceHistoryArr['deviceid']		= histor_deviceid;
			deviceHistoryArr['fuelcapacity']	= fuelcapacity;
			deviceHistoryArr['speedlimit']		= speedlimit;
			deviceHistoryArr['devicetype']		= devicetype;
			deviceHistoryArr['vehiclename']		= vehiclename;
			deviceHistoryArr['regnno']			= regnno;
			deviceHistoryArr['drivername']		= drivername;
			deviceHistoryArr['driverMobile']	= driverMobile;
			deviceHistoryArr['kidname']			= kidname;
			deviceHistoryArr['kidsMobile']		= kidsMobile;
			deviceHistoryArr['devicename']		= devicename;

		}

		Ext.TaskManager.start(historyTrackTask);
		Ext.getCmp("startTrackHisBut").disable();
		Ext.getCmp("stopTrackHisBut").enable();
		Ext.getCmp("historyForm").disable();
	}else{
		Ext.TaskManager.stop(historyTrackTask);
		Ext.getCmp("startTrackHisBut").enable();
		Ext.getCmp("stopTrackHisBut").disable();
		Ext.getCmp("historyForm").enable();
	}
}

function toRad(Value) {
    /** Converts numeric degrees to radians */
    return Value * Math.PI / 180;
}


function drawFuelGaugeHistory(fuelmaxValue){
	fuelHistoryGauge = new RGraph.Gauge('fuelHistoryChart', 0,fuelmaxValue, 0);
	fuelHistoryGauge.Set('chart.background.color', '#000');
	fuelHistoryGauge.Set('chart.border.width', '2');
	fuelHistoryGauge.Set('chart.scale.decimals', 0);
	fuelHistoryGauge.Set('chart.tickmarks.small', 50);
	fuelHistoryGauge.Set('chart.tickmarks.big',5);
	fuelHistoryGauge.Set('chart.needle.tail',true);
	fuelHistoryGauge.Set('chart.centerpin.radius',5);
	fuelHistoryGauge.Set('chart.shadow',false);

	//fuelGauge.Set('chart.background.gradient', true);

	//gauge2.Set('chart.title.top', 'Speed');
	//gauge2.Set('chart.title.top.size', 24);
	fuelHistoryGauge.Set('chart.title.bottom', 'Fuel');
	fuelHistoryGauge.Set('chart.title.bottom.size', '8');
	fuelHistoryGauge.Set('chart.title.bottom.color', '#666');
	fuelHistoryGauge.Set('chart.text.size', '6');
	fuelHistoryGauge.Set('chart.text.color', 'cyan');
	//fuelGauge.Set('chart.colors.ranges', [[0, 20, '#FF4500'],[20, 40, '#DB7093'],[40, 90, '#8FBC8F']]);
	fuelHistoryGauge.Set('chart.colors.ranges', [[0, 5, '#FF4500'],[5, fuelmaxValue, '#009933']]);
	fuelHistoryGauge.Draw();
}