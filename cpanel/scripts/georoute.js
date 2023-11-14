function showGeoRoute(){
	var loadTabPanel = Ext.getCmp('SAdminPanelGeoRoute');
	loadTabPanel.add({
		baseCls:'x-plain',
		id: 'SAdminPanelGeoRouteGrid',
		border:false,
		layout: {
			type: 'border'
		},
		items:[{
			region:'north',
			title:'Route Options',
			split:true,
			frame:true,
			collapsible:true,
			collapsed:false,
			height: 160,
			minHeight:160,
			minHeight:160,
			xtype:'form',
			layout: {
				type:'hbox',
				pack:'start',
                align:'middle'
			},
			defaults:{margins:'0 2 0 0'},
			items:[{
				xtype:'panel',
				title:'Directions',
				frame:true,
				width:400,
				height:120 ,
				items:[{
					xtype:'textfield',
					id:'startAddress',
					width:350,
					labelWidth:1,
					emptyText:'Start Address'
				},{
					xtype:'textfield',
					id:'endAddress',
					width:350,
					labelWidth:1,
					emptyText:'End Address'
				}],
				fbar:[{
					text:'Show Route',
					id:'showRoute'
				},{
					text:'Save Route',
					id:'saveRoute',
					disabled:true
				}] 
			},{
				xtype:'panel',
				title:'Saved Routes',
				frame:true,
				width:400,
				height:120 ,
				items:[{
					xtype:'combo',
					fieldLabel:'Saved Route',
					store: route_combo_store,
					displayField: 'routename',
					valueField: 'routeid',
					queryMode:'local',
					emptyText:'Select Route...',
					labelWidth:80,
					name: 'routeCombo',
					id:'routeCombo',
					triggerAction: 'all',
					forceSelection: true,
					editable:true,
					selectOnFocus:true,
					width:350,
					listeners:{
						afterrender:function(){
							var routeComboStore = Ext.getCmp("routeCombo").getStore();
							routeComboStore.load({
								callback: function() {
									Ext.getCmp("routeCombo").setValue(this);														
								}
							});
						}
					}
				},{
					xtype:'button',
					disabled:true,
					style:'float:right;margin-left:5px;',
					id:'deleteRoute',
					text:'Delete Route'
				},{
					xtype:'button',
					id:'assignRoute',
					style:'float:right;margin-left:5px;',
					text:'Assign Route to Vehicle',
					handler:function(){
						var routeid	= Ext.getCmp("routeCombo").getValue();
						var routename= Ext.getCmp("routeCombo").getRawValue();
						//check the saved polygon has been selected or not
						if(routeid==null || routeid==""){
							Ext.Msg.alert("INFO","Please select the Saved Route");
							return false;
						}
						Assign_Route(routeid, routename);
					}
				},{
					xtype:'button',
					style:'float:right;margin-left:5px;',
					id:'loadRouteid',
					text:'Load Route'
				}]
			}]
		},{
			region:'center',
			xtype:'panel',
			html:'<div id="georouteMapPanel" style="width:100%; height:100%; float:left; margin:5px;"></div>',
			listeners:{
				afterrender:function(){
					var latlan = new google.maps.LatLng(13.050047,80.240497);
					var routeid = Ext.getCmp("routeCombo").getValue();
					initialize_routemap(latlan,routeid);			//Initialize the map and map functions after rendering the panel
				}
			}
		},{
			region:'west',
			id:'directionsWestPanel',
			title:'Route Directions',
			width:300,
			maxWidth:500,
			minWidth:300,
			split:true,
			collapsed:true,
			collapsible:true,
			layout:{
				type:'fit'
			},
			items:[{
				baseCls:'x-plain',
				style:'font-size:10px',
				id:'directionsPanel',
				border:false,
				autoScroll:true,
				fbar:[{
					text:'Print',
					icon:'images/print.gif',
					handler:function(){
						var divToPrint = document.getElementById('directionsPanel-body');
						var popupWin = window.open('', '_blank', 'width=700,height=500');
						popupWin.document.open();
						popupWin.document.write('<html><body onload="window.print()">' + divToPrint.innerHTML + '</html>');
						popupWin.document.close();
					}
				}]
			}]
		}]
    }).show();
	loadTabPanel.doLayout();
}

function initialize_routemap(latlan,routeid){
	var routeMap, dirRen, dirSer;
	var data = {};
	//Initialize the routeMap
	routeMap = new google.maps.Map( 
		document.getElementById('georouteMapPanel'),{
			'zoom':16, 
			'mapTypeId': google.maps.MapTypeId.ROADMAP, 
			'center': latlan
		}
	);
	
	google.maps.event.addListenerOnce(routeMap, 'idle', function(){
	    // do something only the first time the map is loaded
		google.maps.event.trigger(document.getElementById("georouteMapPanel"), "resize");
		//set center for map when the center bounds changed
		routeMap.setCenter(latlan);
	});
	
	dirRen = new google.maps.DirectionsRenderer( {'draggable':true} );
	dirRen.setMap(routeMap);
	dirRen.setPanel(document.getElementById("directionsPanel-body"));
	dirSer = new google.maps.DirectionsService();
	
	//search a place on the map
	var startAddress = document.getElementById('startAddress-inputEl');
	var startAutocomplete = new google.maps.places.Autocomplete(startAddress);
	
	var endAddress = document.getElementById('endAddress-inputEl');
	var endAutocomplete = new google.maps.places.Autocomplete(endAddress);

	startAutocomplete.bindTo('bounds', routeMap);
	endAutocomplete.bindTo('bounds', routeMap);	
	
	var startPlace;
	var endPlace;
	//get the searched place on the map
	google.maps.event.addListener(startAutocomplete, 'place_changed', function() {
		startPlace = startAutocomplete.getPlace();
	});
	
	google.maps.event.addListener(endAutocomplete, 'place_changed', function() {
		endPlace = endAutocomplete.getPlace();
	});
	
	Ext.getCmp("assignRoute").disable();
	Ext.getCmp("deleteRoute").disable();
	Ext.getCmp("showRoute").on('click', function () {
		if(startPlace=="undefined" || startPlace==undefined){
			Ext.Msg.alert("INFO","Please enter the Valid Start Address");
			return false;
		}
		if(endPlace=="undefined" || endPlace==undefined){
			Ext.Msg.alert("INFO","Please enter the Valid End Address");
			return false;
		}
		//show the shortest traveling mode route on the map using Direction service
		dirSer.route({ 
			'origin': startPlace.geometry.location, 
			'destination':  endPlace.geometry.location, 
			'travelMode': google.maps.DirectionsTravelMode.DRIVING
		},function(res,sts) {
			if(sts=='OK'){
				dirRen.setDirections(res);
				Ext.getCmp("directionsWestPanel").expand();
				Ext.getCmp("saveRoute").enable();
				Ext.getCmp("routeCombo").reset();
				Ext.getCmp("deleteRoute").disable();
				Ext.getCmp("assignRoute").disable();
			}			
		})
	});
	
	//call the function to load the saved route
	Ext.getCmp("loadRouteid").on('click', function () {
		var routeid	= Ext.getCmp("routeCombo").getValue();
		if(routeid==null || routeid==""){
			Ext.Msg.alert("INFO","Please select the Saved Route");
			return false;
		}
		var routePathStore 	= Ext.getCmp("routeCombo").getStore();
		var storeInd 		= routePathStore.findExact('routeid',routeid);
		var routedata		= routePathStore.getAt(storeInd).get("routedata");
		loadRoute(routedata);
		Ext.getCmp("assignRoute").enable();
		Ext.getCmp("deleteRoute").enable();
	});
	
	//call the save_route function when save route is clicked
	//save the route with the data
	Ext.getCmp("saveRoute").on('click', function () {
		var w=[],wp;
		var rleg = dirRen.directions.routes[0].legs[0];
		data.start = {'lat': rleg.start_location.lat(), 'lng':rleg.start_location.lng()}
		data.end = {'lat': rleg.end_location.lat(), 'lng':rleg.end_location.lng()}
		var wp = rleg.via_waypoints 
		for(var i=0;i<wp.length;i++)w[i] = [wp[i].lat(),wp[i].lng()] 
		data.waypoints = w;
		var routePathArr = [];
		var routeCoordsArr = dirRen.directions.routes[0].overview_path;
		for(var i=0;i<routeCoordsArr.length;i++){
			routePathArr.push(routeCoordsArr.toString());
		}
		Save_Route(data, routePathArr);
	});
	
	//delete the selected route
	Ext.getCmp("deleteRoute").on('click', function () {
		var routeid	= Ext.getCmp("routeCombo").getValue();		//get route id to delete
		var routename= Ext.getCmp("routeCombo").getRawValue();
		Ext.MessageBox.show({
			title:'Confirm Delete?',
			msg: 'Are you sure to delete Route <b>[ '+routename+' ]</b>',
			buttons: Ext.MessageBox.YESNO,
			fn: function(btn, text){
				if(btn=="yes"){
					Ext.Ajax.request({
						url: 'includes/georoute_ajx.php',
						params: {
							todo:'Delete_Route',
							routeid : routeid
						},
						timeout: 600000000,
						success:function(response){
							var geoRes = Ext.decode(response.responseText);
							if(geoRes.success){
								dirRen.setMap(null);
								document.getElementById("directionsPanel-body").innerHTML = "";
								Ext.getCmp("deleteRoute").disable();
								Ext.getCmp("routeCombo").reset();
								Ext.getCmp("routeCombo").getStore().load();
								Ext.Msg.alert('Success', 'Route <b>'+routename+'</b> deleted successfully');
							}else{
								Ext.Msg.alert('Error', geoRes.msg);
							}
						}
					});
				}
			},
			icon: Ext.MessageBox.CONFIRM
		});
	});
	
	//load saved route with route data
	function loadRoute(routedata){
		var os	= Ext.decode(routedata);
		var wp = [];
		for(var i=0;i<os.waypoints.length;i++)
			wp[i] = {'location': new google.maps.LatLng(os.waypoints[i][0], os.waypoints[i][1]),'stopover':false }
			
		dirSer.route({
			'origin':new google.maps.LatLng(os.start.lat,os.start.lng),
			'destination':new google.maps.LatLng(os.end.lat,os.end.lng),
			'waypoints': wp,
			'travelMode': google.maps.DirectionsTravelMode.DRIVING
			},
			function(res,sts) {
				if(sts=='OK')dirRen.setDirections(res);
				{				
					Ext.getCmp("directionsWestPanel").expand();
					Ext.getCmp("saveRoute").enable();
					google.maps.event.trigger(routeMap, "resize");
					/* var bounds = new google.maps.LatLngBounds();
					//fit to display all the markers within the map panel
					for (var i = 0; i < os.waypoints.length; i++) {
					  bounds.extend(os.waypoints[i]);
					}
					routeMap.fitBounds(bounds);	 */			
				}
			}
		);
	}
}

//save created route with routedata
function Save_Route(data, routePathArr){
	//Get the route data and route path latlan
	var routeData = Ext.encode(data);
	var routePath = Ext.encode(routePathArr);
	var saverouteWin = Ext.create('Ext.Window', {
        title: 'Save Route',
		id:'saverouteWin',
        width:400,
        height:110,
        plain: true,
		modal:true,
		closable:false,
		border: false,
        layout: 'fit',
		items: [{
			xtype:'form',
			id:'saveroutefrm',
			frame:true,
			bodyPadding:10,
			fieldDefaults: {
				labelAlign: 'right',
				msgTarget: 'side',
				labelSeparator:'',
				labelWidth: 70
			},
			defaultType: 'textfield',
			items:[{
				xtype: 'textfield',
				fieldLabel:'Route Name',
				id:'routename',
				name:'routename',
				allowBlank:false,
				emptyText:'Please enter the Route Name',
				blankText:'Please enter the Route Name',
				anchor:'100%'
			}]
		}],
		buttons: [{
			text:'Save',
			handler:function(){
				var formPanel = Ext.getCmp('saveroutefrm').getForm();
				if(formPanel.isValid()){
					Ext.getCmp('saveroutefrm').getEl().mask("Please wait...Saving Path");
					formPanel.submit({
						clientValidation: true,
						url: 'includes/georoute_ajx.php',
						params: {
							todo: 'Save_Route', 
							routeData:routeData,
							routePath:routePath
						},
						success: function(form, action) {
							var routeid = action.result.routeid;
							Ext.getCmp('saveroutefrm').getEl().unmask();
							saverouteWin.destroy();
							Ext.getCmp("deleteRoute").enable();
							Ext.getCmp("routeCombo").getStore().load({
								callback:function(){
									Ext.getCmp("routeCombo").setValue(routeid);
								}
							});
							Ext.Msg.alert('Success', action.result.msg);
						},
						failure: function(form, action) {
							Ext.getCmp('saveroutefrm').getEl().unmask();
							switch (action.failureType) {
								case Ext.form.action.Action.CLIENT_INVALID:
									Ext.Msg.alert('Failure', 'Form fields may not be submitted with invalid values');
									break;
								case Ext.form.action.Action.CONNECT_FAILURE:
									Ext.Msg.alert('Failure', 'Ajax communication failed');
									break;
								case Ext.form.action.Action.SERVER_INVALID:
								   Ext.Msg.alert('Failure', action.result.msg);
						   }
						}
					});
				}
			}
		},{
			text: 'Close',
			handler: function() {
				saverouteWin.destroy();
			}
		}]
    }).show();
}

//assign route for vehicle
function Assign_Route(routeid, routename){
	var assignrouteWin = Ext.create('Ext.Window', {
        title: 'Assign Route for <b>'+routename+'</b>',
		id:'assignrouteWin',
        width:400,
        height:110,
        plain: true,
		modal:true,
		closable:false,
		border: false,
        layout: 'fit',
		items: [{
			xtype:'form',
			id:'assignroutefrm',
			frame:true,
			bodyPadding:10,
			fieldDefaults: {
				labelAlign: 'right',
				msgTarget: 'side',
				labelSeparator:'',
				labelWidth: 70
			},
			items:[{
				xtype:'combo',
				fieldLabel:'Vehicle',
				store: fence_route_assign_combo,
				displayField: 'vehiclename',
				valueField: 'vehicleid',
				queryMode:'local',
				emptyText:'Select Vehicle...',
				name: 'routevehicleid',
				id:'routevehicleid',
				triggerAction: 'all',
				forceSelection: true,
				editable:true,
				selectOnFocus:true,
				allowBlank:false,
				blankText:'Select the Vehicle',
				anchor: '100%',
				listeners:{
					afterrender:function(){
						fence_route_assign_combo.load();
					}
				}
			}]
		}],
		buttons: [{
			text:'Save',
			handler:function(){
				var formPanel = Ext.getCmp('assignroutefrm').getForm();
				if(formPanel.isValid()){
					var vehiclename = Ext.getCmp("routevehicleid").getRawValue();
					Ext.getCmp('assignroutefrm').getEl().mask("Please wait...Assigning Route to Vehicle");
					formPanel.submit({
						clientValidation: true,
						url: 'includes/georoute_ajx.php',
						params: {
							todo: 'Assign_Route', 
							routeid:routeid
						},
						success: function(form, action) {
							Ext.getCmp('assignroutefrm').getEl().unmask();
							assignrouteWin.destroy();
							Ext.Msg.alert('Success', 'The Route <b>'+routename+'</b> assigned to Vehicle <b>'+vehiclename);
						},
						failure: function(form, action) {
							Ext.getCmp('assignroutefrm').getEl().unmask();
							switch (action.failureType) {
								case Ext.form.action.Action.CLIENT_INVALID:
									Ext.Msg.alert('Failure', 'Form fields may not be submitted with invalid values');
									break;
								case Ext.form.action.Action.CONNECT_FAILURE:
									Ext.Msg.alert('Failure', 'Ajax communication failed');
									break;
								case Ext.form.action.Action.SERVER_INVALID:
								   Ext.Msg.alert('Failure', action.result.msg);
						   }
						}
					});
				}
			}
		},{
			text: 'Close',
			handler: function() {
				assignrouteWin.destroy();
			}
		}]
    }).show();
}


var rtMap, rtRen, rtSer;
//show the assigned route for a vehilce in popup window
//this function called from live tracking and vehilces grid
function Show_Route(routeid){
	if(routeid==0){
		Ext.Msg.alert('NOT ASSIGNED', 'No Route Assigned for this Vehicle');
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
				var routedata = geoRes.routedata;
				var routepathWin = Ext.create('Ext.Window', {
					title: 'Route',
					id:'routepathWin',
					width:900,
					height:500,
					plain: true,
					modal:true,
					closable:true,
					maximizable:true,
					border: false,
					layout: 'fit',
					items: [{
						baseCls:'x-plain',
						border:false,
						layout: {
							type: 'border'
						},
						items:[{
							region:'west',
							id:'rtdirectionsWestPanel',
							title:'Route Directions',
							width:300,
							layout:{
								type:'fit'
							},
							items:[{
								baseCls:'x-plain',
								style:'font-size:10px',
								id:'rtdirectionsPanel',
								border:false,
								autoScroll:true,
								fbar:[{
									text:'Print',
									icon:'images/print.gif',
									handler:function(){
										var divToPrint = document.getElementById('rtdirectionsPanel-body');
										var popupWin = window.open('', '_blank', 'width=700,height=500');
										popupWin.document.open();
										popupWin.document.write('<html><body onload="window.print()">' + divToPrint.innerHTML + '</html>');
										popupWin.document.close();
									}
								}]
							}]
						},{
							region:'center',
							xtype:'panel',
							layout:{							
								type:'fit'
							},
							html:'<div id="routepathMapPanel" style="width:100%; height:100%; float:left; margin:5px;"></div>',
							listeners:{
								afterrender:function(){
									var latlan = new google.maps.LatLng(13.050047,80.240497);									
									var os = Ext.decode(routedata);
									rtMap = new google.maps.Map( 
										document.getElementById('routepathMapPanel'),{
											'zoom':16, 
											'mapTypeId': google.maps.MapTypeId.ROADMAP, 
											'center': latlan
										}
									);									
									rtRen = new google.maps.DirectionsRenderer( {'draggable':false} );
									rtRen.setMap(rtMap);
									rtRen.setPanel(document.getElementById("rtdirectionsPanel-body"));
									rtSer = new google.maps.DirectionsService();
									
									var polyline = new google.maps.Polyline({
										path: [],
										strokeColor: '#0000FF',
										strokeWeight: 5
									});
									
									var bounds = new google.maps.LatLngBounds();									
									var wp = [];
									for(var i=0;i<os.waypoints.length;i++)
										wp[i] = {'location': new google.maps.LatLng(os.waypoints[i][0], os.waypoints[i][1]),'stopover':false }
										
									rtSer.route({
											'origin':new google.maps.LatLng(os.start.lat,os.start.lng),
											'destination':new google.maps.LatLng(os.end.lat,os.end.lng),
											'waypoints': wp,
											'travelMode': google.maps.DirectionsTravelMode.DRIVING
										},
										function(response,sts) {
											if(sts=='OK'){
												rtRen.setDirections(response);
												google.maps.event.trigger(rtMap, "resize");
											}
										}
									);								
								}
							}
						}]
					}],
					listeners:{
						maximize:function(){
							google.maps.event.trigger(rtMap, "resize");
						}
					}
				}).show();
			}else{
				Ext.Msg.alert('Error', geoRes.msg);
			}
		}
	});
}

//Unassign route from device(called from vehicles grid)
function UnAssign_Route(vehicleid, routeid){
	Ext.MessageBox.show({
		title:'Confirm Un-Assigned?',
		msg: 'Are you sure to Un-Assigned Route this Vehicle',
		buttons: Ext.MessageBox.YESNO,
		fn: function(btn, text){
			if(btn=="yes"){
				Ext.Ajax.request({
					url: 'includes/georoute_ajx.php',
					params: {
						todo:'UnAssign_Route',
						vehicleid:vehicleid,
						routeid : routeid
					},
					timeout: 600000000,
					success:function(response){
						var geoRes = Ext.decode(response.responseText);
						if(geoRes.success){
							Ext.Msg.alert('SUCCESS', 'Route is Un-Assigned successfully for this Vehicle');
							Ext.getCmp("CPanelVehiclesGrid").getStore().load();
						}else{
							Ext.Msg.alert('Error', geoRes.msg);
						}
					}
				});
			}
		},
		icon: Ext.MessageBox.CONFIRM
	});
}