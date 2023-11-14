var polyGonMap;
var mapPolygon;
function showGeoFence(){
    var loadTabPanel = Ext.getCmp('SAdminPanelGeoFence');
	loadTabPanel.add({
		baseCls:'x-plain',
		border:false,
		layout: {
			type: 'border'
		},
		items:[{
			region:'north',
			frame:true,
			height: 40,
			minHeight:40,
			minHeight:40,
			xtype:'form',
			layout: {
				type:'hbox',
				pack:'start',
                align:'middle'
			},
			defaults:{margins:'0 5 0 0'},
			items:[{
				xtype:'textfield',
				id:'searchLoc',
				width:200,
				labelWidth:1,
				emptyText:'Search Location'
			},{
				xtype:'combo',
				fieldLabel:'Saved Path',
				store: polygon_path_store,
				displayField: 'pathname',
				valueField: 'fenceid',
				queryMode:'local',
				emptyText:'Select Path...',
				labelWidth:70,
				name: 'polypath',
				id:'polypath',
				triggerAction: 'all',
				forceSelection: true,
				editable:true,
				selectOnFocus:true,
				width:250,
				listeners:{
					afterrender:function(){
						polygon_path_store.load({
							callback: function() {
								Ext.getCmp("polypath").setValue(this);						
							} 
						});
					},
					select: function() {
						Ext.getCmp("loadPolygon").enable();
						Ext.getCmp("newPolygon").enable();
						Ext.getCmp("assignPolygon").enable();
					}
				}
			},{
				xtype:'button',
				id:'loadPolygon',
				disabled:true,
				text:'Load Path'
			},{
				xtype:'button',
				id:'newPolygon',
				text:'Create New Path'				
			},{
				xtype:'button',
				disabled:true,
				id:'savePolygon',
				text:'Save Path'				
			},{
				xtype:'button',
				disabled:true,
				id:'deletePolygon',
				text:'Delete Path'
			},{
				xtype:'button',
				id:'assignPolygon',
				disabled:true,
				text:'Assign Path to Vehicle',
				handler:function(){
					var fenceid	= Ext.getCmp("polypath").getValue();
					var pathname= Ext.getCmp("polypath").getRawValue();
					//check the route has been selected or not
					if(fenceid==null || fenceid==""){
						Ext.Msg.alert("INFO","Please select the Saved Path");
						return false;
					}
					Assign_Poly_Path(fenceid, pathname);
				}
			}]
		},{
			region:'center',
			xtype:'panel',
			html:'<div id="geofenceMapPanel" style="width:100%; height:100%; float:left; margin:5px;"></div>',
			listeners:{
				afterrender:function(){
					var latlan = new google.maps.LatLng(13.050047,80.240497);
					initialize_polymap(latlan);			//Initialize the map and map functions after rendering the panel
				}
			}
		}]
    }).show();
	loadTabPanel.doLayout();
}

function initialize_polymap(latlan) {
	//Initialize the polyGonMap
    var polyGonMap = new google.maps.Map(
		document.getElementById("geofenceMapPanel"),{
			zoom: 16,
			center: latlan,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		}
	);
	
    var followLine1 = new google.maps.Polyline({
		clickable: false,
		map : polyGonMap,
		path: [],
		strokeColor: "#787878",
		strokeOpacity: 1,
		strokeWeight: 2
	});
    var followLine2 = new google.maps.Polyline({
		clickable: false,
		map : polyGonMap,
		path: [],
		strokeColor: "#787878",
		strokeOpacity: 1,
		strokeWeight: 2
	});
	var mapPolygon;
	var polyStore = Ext.getCmp("polypath").getStore();
	if(polyStore.getCount()>0){
		var fenceid = polyStore.getAt(0).get("fenceid");
		var polyCoords	= polyStore.getAt(0).get("polycoords");
		Ext.getCmp("polypath").setValue(fenceid);
		eval(polyCoords);
		Ext.getCmp("savePolygon").enable();
		Ext.getCmp("deletePolygon").enable();
	}else{
		polyCoords = [];
	}
	mapPolygon = new google.maps.Polygon({map : polyGonMap,
		strokeColor   : '#ff0000',
		strokeOpacity : 0.6,
		strokeWeight  : 2,
		path:polyCoords
	});
	mapPolygon.runEdit(true);
	
	google.maps.event.addListenerOnce(polyGonMap, 'idle', function(){
	    // do something only the first time the map is loaded
		google.maps.event.trigger(document.getElementById("geofenceMapPanel"), "resize");
		//set center for map when the center bounds changed
		polyGonMap.setCenter(latlan);
	});
	
	//search a place on the map
	var searchLoc = document.getElementById('searchLoc-inputEl');
	var searchLoccomplete = new google.maps.places.Autocomplete(searchLoc);
	searchLoccomplete.bindTo('bounds', polyGonMap);
	google.maps.event.addListener(searchLoccomplete, 'place_changed', function() {		
		searchLocPlace = searchLoccomplete.getPlace();		
		polyGonMap.setCenter(searchLocPlace.geometry.location);
		clearPolyGonMap(false);
	});	
	
	//do the function when create button is clicked
	//enable save button only and disable others
	Ext.getCmp("newPolygon").on('click', function () {
		clearPolyGonMap(true);							//clear the markers in the map and initialize the variables
		createNewPloygon();							
	});
	
	//call the save_polygon function when save route is clicked
	//get the polygon coordinates
	Ext.getCmp("savePolygon").on('click', function () {
		var polyCoordsX = [];
		var polyCoordsY = [];
		var polyCoords = 'polyCoords = [';
		mapPolygon.getPath().forEach(function (vertex, inex) {
			polyCoords += 'new google.maps.LatLng('+vertex.lat()+','+vertex.lng()+')' + ((inex<mapPolygon.getPath().getLength()-1)?',':'');
			polyCoordsX.push(vertex.lat());
			polyCoordsY.push(vertex.lng());
		});
		polyCoords += ']';
		if(polyCoords=='polyCoords = []'){
			Ext.Msg.alert("INFO","Please draw the path");
			return false;
		}
		Save_Polygon_Path(polyCoords, polyCoordsX, polyCoordsY);
	});
	
	//call the function to load the saved polygon
	Ext.getCmp("loadPolygon").on('click', function () {
		var fenceid	= Ext.getCmp("polypath").getValue();
		if(fenceid==null || fenceid==""){
			Ext.Msg.alert("INFO","Please select the Saved Path");
			return false;
		}
		var polypathStore 	= Ext.getCmp("polypath").getStore();
		var storeInd 		= polypathStore.findExact('fenceid',fenceid);
		var polyCoords		= polypathStore.getAt(storeInd).get("polycoords");
		eval(polyCoords);
		clearPolyGonMap(true);
		mapPolygon = new google.maps.Polygon({map : polyGonMap,
			strokeColor   : '#ff0000',
			strokeOpacity : 0.6,
			strokeWeight  : 2,
			path:polyCoords
		});
		mapPolygon.runEdit(true);
		google.maps.event.trigger(polyGonMap, "resize");
		var bounds = new google.maps.LatLngBounds();
		//fit to display all the markers within the map panel
		for (var i = 0; i < polyCoords.length; i++) {
		  bounds.extend(polyCoords[i]);
		}
		Ext.getCmp("deletePolygon").enable();
		polyGonMap.fitBounds(bounds);
	});
	
	//delete the selected polygon
	Ext.getCmp("deletePolygon").on('click', function () {
		var fenceid	= Ext.getCmp("polypath").getValue();		//get fence id to delete
		var pathname= Ext.getCmp("polypath").getRawValue();
		Ext.MessageBox.show({
			title:'Confirm Delete?',
			msg: 'Are you sure to delete PathName <b>[ '+pathname+' ]</b>',
			buttons: Ext.MessageBox.YESNO,
			fn: function(btn, text){
				if(btn=="yes"){
					Ext.Ajax.request({
						url: 'includes/geofence_ajx.php',
						params: {
							todo:'Delete_Poly_Path',
							fenceid : fenceid
						},
						timeout: 600000000,
						success:function(response){
							var geoRes = Ext.decode(response.responseText);
							if(geoRes.success){
								clearPolyGonMap(true);
								Ext.getCmp("deletePolygon").disable();
								Ext.getCmp("polypath").reset();
								Ext.getCmp("polypath").getStore().load();
								Ext.Msg.alert('Success', 'PathName <b>'+pathname+'</b> deleted successfully');
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
	
	//clear existing polylines from the map
	function clearPolyGonMap(crosshair){
		mapPolygon.stopEdit();
		mapPolygon.setMap(null);
		mapPolygon = null;
		google.maps.event.clearListeners(polyGonMap, "click");
		google.maps.event.clearListeners(polyGonMap, "mousemove");
		google.maps.event.clearListeners(polyGonMap, "rightclick");
		if(crosshair)
			polyGonMap.setOptions({ draggableCursor: 'crosshair'});

		mapPolygon = new google.maps.Polygon({map : polyGonMap,
			strokeColor   : '#ff0000',
			strokeOpacity : 0.6,
			strokeWeight  : 2,
			path:[]
		});
		followLine1.setPath([]);
		followLine2.setPath([]);
		followLine1.setMap(polyGonMap);
		followLine2.setMap(polyGonMap);
	}
	
	//create a polygon with lines
	function createNewPloygon(){
		Ext.getCmp("deletePolygon").disable();
		Ext.getCmp("savePolygon").enable();
		Ext.getCmp("polypath").reset();
		var polyCords = "";
		clearPolyGonMap(true);
		google.maps.event.addListener(polyGonMap, 'click', function(point) {
			mapPolygon.stopEdit();
			mapPolygon.getPath().push(point.latLng);
			mapPolygon.runEdit(true);
		});
		
		google.maps.event.addListener(polyGonMap, 'rightclick', function () {
			google.maps.event.clearListeners(polyGonMap, "click");
			google.maps.event.clearListeners(polyGonMap, "mousemove");
			google.maps.event.clearListeners(polyGonMap, "rightclick");
			polyGonMap.setOptions({ draggableCursor: 'pointer' });
		});
		
		google.maps.event.addListener(polyGonMap, 'mousemove', function(point) {
			var pathLength = mapPolygon.getPath().getLength();
			if (pathLength >= 1) {
				var startingPoint1 = mapPolygon.getPath().getAt(pathLength - 1);
				var followCoordinates1 = [startingPoint1, point.latLng];
				followLine1.setPath(followCoordinates1);

				var startingPoint2 = mapPolygon.getPath().getAt(0);
				var followCoordinates2 = [startingPoint2, point.latLng];
				followLine2.setPath(followCoordinates2);
			}
		});
	}
	
	//save the drawed polygon coordinates
	function Save_Polygon_Path(polycoords, polyCoordsX, polyCoordsY){
		//Get the coordinate of the drawed polygon
		var polyCoordsX = [];
		var polyCoordsY = [];
		var polyCoords = 'polyCoords = [';
		mapPolygon.getPath().forEach(function (vertex, inex) {
			polyCoords += 'new google.maps.LatLng('+vertex.lat()+','+vertex.lng()+')' + ((inex<mapPolygon.getPath().getLength()-1)?',':'');
			polyCoordsX.push(vertex.lat());
			polyCoordsY.push(vertex.lng());
		});
		polyCoords += ']';
		if(polyCoords=='polyCoords = []'){
			Ext.Msg.alert("INFO","Please draw the path");
			return false;
		}
		var savepolyWin = Ext.create('Ext.Window', {
			title: 'Save Path',
			id:'savepolyWin',
			width:400,
			height:110,
			plain: true,
			modal:true,
			closable:false,
			border: false,
			layout: 'fit',
			items: [{
				xtype:'form',
				id:'savepolyfrm',
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
					fieldLabel:'Path Name',
					id:'pathname',
					name:'pathname',
					allowBlank:false,
					blankText:'Please enter the Path Name',
					anchor:'100%'
				}]
			}],
			buttons: [{
				text:'Save',
				handler:function(){
					var formPanel = Ext.getCmp('savepolyfrm').getForm();
					if(formPanel.isValid()){
						Ext.getCmp('savepolyfrm').getEl().mask("Please wait...Saving Path");
						formPanel.submit({
							clientValidation: true,
							url: 'includes/geofence_ajx.php',
							params: {
								todo: 'Save_Poly_Path', 
								polycoords:polycoords,
								polyCoordsX:Ext.encode(polyCoordsX),
								polyCoordsY:Ext.encode(polyCoordsY)
							},
							success: function(form, action) {
								var fenceid = action.result.fenceid;
								Ext.getCmp('savepolyfrm').getEl().unmask();
								savepolyWin.destroy();
								Ext.getCmp("deletePolygon").enable();
								Ext.getCmp("polypath").getStore().load({
									callback:function(){
										Ext.getCmp("polypath").setValue(fenceid);
									}
								});
								Ext.Msg.alert('Success', action.result.msg);
							},
							failure: function(form, action) {
								Ext.getCmp('savepolyfrm').getEl().unmask();
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
					savepolyWin.destroy();
				}
			}]
		}).show();
	}
}

//assign a polygon fence for a vehicle/bike/child
function Assign_Poly_Path(fenceid, pathname){
	var assignpolyWin = Ext.create('Ext.Window', {
        title: 'Assign Path for <b>'+pathname+'</b>',
		id:'assignpolyWin',
        width:400,
        height:110,
        plain: true,
		modal:true,
		closable:false,
		border: false,
        layout: 'fit',
		items: [{
			xtype:'form',
			id:'assignpolyfrm',
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
				name: 'polyvehicleid',
				id:'polyvehicleid',
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
				var formPanel = Ext.getCmp('assignpolyfrm').getForm();
				if(formPanel.isValid()){
					var vehiclename = Ext.getCmp("polyvehicleid").getRawValue();
					Ext.getCmp('assignpolyfrm').getEl().mask("Please wait...Assigning Path to Vehicle");
					formPanel.submit({
						clientValidation: true,
						url: 'includes/geofence_ajx.php',
						params: {
							todo: 'Assign_Poly_Path',
							fenceid:fenceid
						},
						success: function(form, action) {
							Ext.getCmp('assignpolyfrm').getEl().unmask();
							assignpolyWin.destroy();
							Ext.Msg.alert('Success', 'The Path <b>'+pathname+'</b> assigned to Vehicle <b>'+vehiclename);
						},
						failure: function(form, action) {
							Ext.getCmp('assignpolyfrm').getEl().unmask();
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
				assignpolyWin.destroy();
			}
		}]
    }).show();
}

//show the assinged polygon for vehicle in a popup window
//this function called from live tracking and vehilces grid
function Show_Poly_Path(fenceid){
	if(fenceid==0){
		Ext.Msg.alert('NOT ASSIGNED', 'No Geo Fence Path Assigned for this Vehicle');
		return false;
	}
	var polypathMap;
	Ext.Ajax.request({
		url: 'includes/geofence_ajx.php',
		params: {
			todo:'Get_Poly_Path',
			fenceid : fenceid
		},
		timeout: 600000000,
		success:function(response){
			var geoRes = Ext.decode(response.responseText);
			if(geoRes.success){
				var polyCoords = geoRes.polycoords;
				eval(polyCoords);
				var polypathWin = Ext.create('Ext.Window', {
					title: 'Route Path',
					id:'polypathWin',
					width:900,
					height:500,
					plain: true,
					modal:true,
					closable:true,
					maximizable:true,
					border: false,
					layout: 'fit',
					items: [{
						xtype:'panel',
						html:'<div id="polypathMapPanel" style="width:100%; height:100%; float:left; margin:5px;"></div>',
						listeners:{
							afterrender:function(){
								polypathMap = new google.maps.Map(
									document.getElementById("polypathMapPanel"),
									{
										zoom: 16,
										center: new google.maps.LatLng(13.050047,80.240497),
										mapTypeId: google.maps.MapTypeId.ROADMAP
									}
								);
								var devicePolygon = new google.maps.Polygon({map : polypathMap,
											strokeColor   : '#ff0000',
											strokeOpacity : 0.6,
											strokeWeight  : 2,
											path:polyCoords
										});
								devicePolygon.runEdit(true);
								google.maps.event.trigger(polypathMap, "resize");
								var bounds = new google.maps.LatLngBounds();
								var i;
								for (i = 0; i < polyCoords.length; i++) {
								  bounds.extend(polyCoords[i]);
								}
								//polyGonMap.setCenter(bounds.getCenter());
								polypathMap.fitBounds(bounds);
							}
						}
					}],
					listeners:{
						maximize:function(){
							google.maps.event.trigger(polypathMap, "resize");
						}
					}
				}).show();
			}else{
				Ext.Msg.alert('Error', geoRes.msg);
			}
		}
	});
} 

//Unassign polygon fence from device(called from vehicles grid)
function UnAssign_Poly_Path(vehicleid, fenceid){
	Ext.MessageBox.show({
		title:'Confirm Un-Assigned?',
		msg: 'Are you sure to Un-Assigned Geo Fence this Vehicle',
		buttons: Ext.MessageBox.YESNO,
		fn: function(btn, text){
			if(btn=="yes"){
				Ext.Ajax.request({
					url: 'includes/geofence_ajx.php',
					params: {
						todo:'UnAssign_Poly_Path',
						vehicleid:vehicleid,
						fenceid : fenceid
					},
					timeout: 600000000,
					success:function(response){
						var geoRes = Ext.decode(response.responseText);
						if(geoRes.success){
							Ext.Msg.alert('SUCCESS', 'Geo Fence Path is Un-Assigned successfully for this Vehicle');
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