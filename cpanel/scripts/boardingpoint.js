Ext.define('SaveRouteStore', {
        extend: 'Ext.data.Model',
		fields: [
			{name: 'boardingid',mapping: 'boardingid',type:'int'},
			{name: 'routename',mapping: 'routename', type: 'string'}
        ]
});

Ext.define('boardpointData', {
	extend: 'Ext.data.Model',
	fields: [
		{name: 'bmarkerid', mapping:'bid', type: 'string'},
		{name: 'boardingno', mapping:'boardingid', type: 'int'},
		{name: 'bpointname', mapping:'bpointname', type: 'string'},
		{name: 'orderno', mapping:'orderno', type: 'string'},
		{name: 'distance', mapping:'distance', type: 'string'} ,
		{name: 'lat', mapping:'lat', type:'string'},
		{name: 'lan', mapping:'lan', type:'string'}
		
	]
});

function showBordingPoint(){
	var loadTabPanel = Ext.getCmp('SAdminPanelBordingPoint');
	var boardpointStore = Ext.create('Ext.data.JsonStore', {
        id: 'boardpointStore',
        model: 'boardpointData',
        remoteSort: false,
        proxy: {
            type: 'ajax',
			actionMethods: {
				read: 'POST'
			},
            url: './includes/boardingpoint_ajx.php',
            extraParams: {
				todo : 'Get_BoardingPoints'
            },
            reader: {
				type: 'json',
				root: 'POINTS',
				totalProperty: 'totalCount'
            },
            // sends single sort as multi parameter
            simpleSortMode: true
        },
        sorters: [{           
            direction: 'ASC'
        }]
    });
	
	//Cell editing in the boarding points grid
    var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
        clicksToEdit: 1
    });
	
	var boardpointCol	= [
		{text: "Order No", dataIndex: 'orderno', width: 60, sortable: false,
				editor: new Ext.form.field.ComboBox({
                typeAhead: true,
                triggerAction: 'all',
                selectOnTab: true,
                store: [
                    [1,1], [2,2], [3,3], [4,4], [5,5], [6,6], [7,7], [8,8], [9,9], [10,10]
                ],
                lazyRender: true,
                listClass: 'x-combo-list-small'
            })
		},
		{text: "Boarding Point", dataIndex: 'bpointname', flex: 1, sortable: false,
			editor: {
                allowBlank: false
            }
		},
		{text: "Distance", dataIndex: 'distance', width: 60, sortable: false},
		{xtype: 'actioncolumn', width:30, sortable: false,
            items: [{
                icon: './images/remove.png',
                tooltip: 'Delete Point',
				id:'remove_id',
				//disabled: true,
                handler: function(grid, rowIndex, colIndex) {				
					gridRemoveMarker(grid, rowIndex);
                }
            }]
		}
	];
	
	
	loadTabPanel.add({
		baseCls:'x-plain',
		border:false,
		layout: {
			type: 'border'
		},
		items:[{
			region:'north',
			title:'Boarding Point Options',
			split:true,
			frame:true,
			collapsible:true,
			collapsed:false,
			height: 130,
			minHeight:130,
			minHeight:130,
			xtype:'form',
			layout: {
				type:'hbox',
				pack:'start',
                align:'middle'
			},
			defaults:{margins:'0 2 0 0'},
			items:[{
				xtype:'panel',
				title:'Search Pleace',
				frame:true,
				width:300,
				height:90 ,
				items:[{
					xtype:'textfield',
					id:'searchPlace',
					width:280,
					labelWidth:1,
					emptyText:'Search Place'
				}],
				fbar:[{
					text:'Show Place',
					id:'showPlace'
				}]
			},{
				xtype:'panel',
				title:'Start Options',
				frame:true,
				width:100,
				height:90 ,
				items:[{
					xtype:'button',
					width:80,
					style:'margin-left:5px;',
					id:'create_brdg',
					text:'Create Route',
					listeners : {
						click: function(button,event) {
							button.setText('Reset');
						}
					}
				},{
					xtype:'button',
					disabled:true,
					width:80,
					style:'float:center;margin-top:5px;margin-left:5px;',
					id:'savebrdg_Route',
					text:'Save Route'					
				}]
			},{
				xtype:'panel',
				title:'Saved Boarding Route',
				frame:true,
				width:350,
				height:90,
				items:[{
					xtype:'combo',
					fieldLabel:'Saved Route',
					store: Brdg_SaveRouteStore,
					displayField: 'routename',
					valueField: 'boardingid',
					queryMode:'local',
					emptyText:'Select Route...',
					labelWidth:80,
					name: 'boardCombo',
					id:'boardCombo',
					triggerAction: 'all',
					forceSelection: true,
					editable:true,
					selectOnFocus:true,
					width:300,
					listeners:{
						afterrender:function(){
							var SaveRouteStore_value = Ext.getCmp("boardCombo").getStore();
							SaveRouteStore_value.load({
								callback: function() {
									Ext.getCmp("boardCombo").setValue(this);	//reset the combo store after saving the boarding route													
								}
							});
						}
					}
				},{
					xtype:'button',
					disabled:true,
					style:'float:right;margin-left:5px;',
					id:'deleteBoard',
					text:'Delete Route'
				},{
					xtype:'button',
					id:'assignBoard',
					disabled:true,
					style:'float:right;margin-left:5px;',
					text:'Assign Route to Vehicle',
					handler:function(){
						boardCombo_id	= Ext.getCmp("boardCombo").getValue();
						routename= Ext.getCmp("boardCombo").getRawValue();
						//check the route has been selected or not
						if(boardCombo_id==null || boardCombo_id==""){
							Ext.Msg.alert("INFO","Please select the Saved Route");
							return false;
						}
						Assign_brdg_Route(boardCombo_id, routename);
					}
				},{
					xtype:'button',
					style:'float:right;margin-left:5px;',
					id:'loadbrdg_Route',
					text:'Load Route'
				}]
			}]
		},{
			region:'center',
			xtype:'panel',
			html:'<div id="bpointMapPanel" style="width:100%; height:100%; float:left; margin:5px;"></div>',
			listeners:{
				afterrender:function(){
					var latlan = new google.maps.LatLng(10.833305058068763,78.68867815234375);
					initialize_boardingmap(latlan);  	//Initialize the map and map functions after rendering the panel
				}
			}
		},{
			region:'west',
			xtype: 'grid',
			id:'boardpointGrid',
			title:'Boarding Points',			
			split:true,
			collapsed:true,
			collapsible:true,
			width:300,
			maxWidth:500,
			minWidth:300,
			enableColumnHide:false,
			enableColumnMove:false,
			autoScroll:true,
			loadMask: true,
			layout:{
				type:'fit'
			},
			store:boardpointStore,
			selModel: {
				selType: 'cellmodel'
			},
			viewConfig: {
				forceFit:true,
				stripeRows: true,
				emptyText:"<span class='tableTextM'>No Records Found</span>"
			},
			columns: boardpointCol,
			plugins: [cellEditing],
			border:false,
			animCollapse: false,
			stripeRows: true/* ,			
			fbar:[{
				text:'Update',
				id:'Brdg_Update_btn',
				disabled: true
			}]*/
		}]
    }).show();
	loadTabPanel.doLayout();
}


var bpointMap;
var boardCombo_id;
var routename;
var boardingno=0;
var latilan_array=[];
var bmarkers = {};
var latti_arr=[];
var langi_arr=[];
var marker_arr = [];
var Marker_Address;

function initialize_boardingmap(latlan){
	var mrkr_cnt=0, dirSer;
	bpointMap = new google.maps.Map(
		document.getElementById("bpointMapPanel"),{
			zoom: 7,
			center: latlan,
			mapTypeId: 'roadmap'
		}
	);
	
	google.maps.event.addListenerOnce(bpointMap, 'idle', function(){
	    // do something only the first time the map is loaded
		google.maps.event.trigger(document.getElementById("bpointMapPanel"), "resize");
		//set center for map when the center bounds changed
		bpointMap.setCenter(latlan);
	});
	
	//searching a place in map
	var searchPlace = document.getElementById('searchPlace-inputEl');
	var searchAutocomplete = new google.maps.places.Autocomplete(searchPlace);
	searchAutocomplete.bindTo('bounds', bpointMap);
	var searched_Place;
	google.maps.event.addListener(searchAutocomplete, 'place_changed', function() {
		searched_Place = searchAutocomplete.getPlace();
	});	
	
	Ext.getCmp("showPlace").on('click', function () {		
		if(searched_Place=="undefined" || searched_Place==undefined){
			Ext.Msg.alert("INFO","Please enter the Valid Place");
			return false;
		}		
		bpointMap.panTo(searched_Place.geometry.location);  //pan to the searched place
		bpointMap.setZoom(14);
	});
	
	//do the function when create button is clicked
	//enable save button only and disable others
	Ext.getCmp("create_brdg").on('click', function () {
		Ext.getCmp("savebrdg_Route").enable();
		Ext.getCmp("boardCombo").reset();
		Ext.getCmp("assignBoard").disable();
		Ext.getCmp("deleteBoard").disable();
		//Ext.getCmp("Brdg_Update_btn").disable();
		clear_brdgpts();     					//clear the markers in the map and initialize the variables
		createboarding();  
	});
	
	//creating boarding points with markers
	function createboarding(){
		var markerId='';
		var i=0,j=0;
		latilan_array = [];
		Ext.getCmp("boardpointGrid").expand();		//Expands the boarding point(in west) grid 
		bpointMap.setZoom(7);
		var boardpointStore=Ext.getCmp("boardpointGrid").getStore();
		boardpointStore.removeAll();
		google.maps.event.clearListeners(bpointMap, "click");
		google.maps.event.clearListeners(bpointMap, "rightclick");
		google.maps.event.addListener(bpointMap, 'rightclick', function(e) {			
			var lat = e.latLng.lat(); // lat of clicked point
			var lng = e.latLng.lng(); // lng of clicked point
			latti_arr[i++] = lat;			
			langi_arr[j++] = lng;
			markerId = lat + ',' + lng; // an that will be used to cache this marker in markers object.			
			mrkr_cnt++;
			var markers_m = new google.maps.Marker({
				position: new google.maps.LatLng(lat, lng),
				map: bpointMap,
				draggable:true,
				animation: google.maps.Animation.DROP,
				icon:'images/gmap/marker-blue.png'
			});			
			latilan_array.push(markers_m);
			bmarkers[markerId] = markers_m; // cache marker in markers object	
			gridAddMarker(markerId,latti_arr,langi_arr);			
		});
	}	
	
	//call the add route function when save route is clicked
	Ext.getCmp("savebrdg_Route").on('click', function () {
		gridMarkerAddRoute(marker_arr);	
	});
	
	//call to load the saved route
	Ext.getCmp("loadbrdg_Route").on('click', function () {
		Ext.getCmp("create_brdg").setText("Create Route");
		Ext.getCmp("savebrdg_Route").disable();
		boardCombo_id = Ext.getCmp("boardCombo").getValue();		
		if(boardCombo_id==null || boardCombo_id==""){
			Ext.Msg.alert("INFO","Please select the Saved Route");
			return false;
		}
		var boardpointStore=Ext.getCmp("boardpointGrid").getStore();
		boardpointStore.load({
			params:{boardingid:boardCombo_id}
		});
		Ext.getCmp("assignBoard").enable();
		Ext.getCmp("deleteBoard").enable();
		//Ext.getCmp("Brdg_Update_btn").enable();
		loadpt_mrkr(boardCombo_id,boardpointStore);	
	});
		
	//daleting the selected route from the boarding routes
	Ext.getCmp("deleteBoard").on('click', function () {
		boardCombo_id = Ext.getCmp("boardCombo").getValue(); 	//get boarding id to delete
		routename = Ext.getCmp("boardCombo").getRawValue();		
		Ext.MessageBox.show({
			title:'Confirm Delete?',
			msg: 'Are you sure to delete Route <b>[ '+routename+' ]</b>',
			buttons: Ext.MessageBox.YESNO,
			fn: function(btn, text){
				if(btn=="yes"){
					Ext.Ajax.request({
						url: 'includes/boardingpoint_ajx.php',
						params: {
							todo:'Delete_Route',
							boardingid : boardCombo_id
						},
						timeout: 600000000,
						success:function(response){
							var boardRes = Ext.decode(response.responseText);
							if(boardRes.success){
								clear_brdgpts();
								Ext.getCmp("deleteBoard").disable();
								//Ext.getCmp("Brdg_Update_btn").disable();
								Ext.getCmp("boardCombo").reset();
								Ext.getCmp("boardCombo").getStore().load();
								var boardpointStore=Ext.getCmp("boardpointGrid").getStore();
								boardpointStore.removeAll();
								Ext.Msg.alert('Success', 'Route <b>'+routename+'</b> deleted successfully');
							}else{
								Ext.Msg.alert('Error', boardRes.msg);
							}
						}
					});
				}
			},
			icon: Ext.MessageBox.CONFIRM
		});
	});	
	
	var dragMarkerid = "";
	/**
	 * Binds right click event to given marker and invokes a callback function that will remove the marker from map.
	 * @param {!google.maps.Marker} marker A google.maps.Marker instance that the handler will binded.
	 */ 
	
	var bindMarkerEvents = function(marker) {
		google.maps.event.addListener (marker, 'click', function (event) {
			console.log(marker.id);			
		});
		google.maps.event.addListener(marker, "rightclick", function (point) {
			//var markerId = point.latLng.lat() + '_' + point.latLng.lng(); // get marker id by using clicked point's coordinate
			//var marker = bmarkers[markerId]; // find marker
			var markerId = marker.id;
			removeMarker(marker, markerId); // remove it
			var roxIndex = getBoardPointGridRIndex('bmarkerid',markerId);
			boardpointStore.removeAt(rowIndex);
		});
		
		google.maps.event.addListener (marker, 'dragstart', function (event) {
			//console.log(marker.getPosition().lat())
			dragMarkerid = marker.getPosition().lat() + '_' + marker.getPosition().lng();
			//console.log("Before:"+dragMarkerid);
			//console.log(bmarkers);
		});
		
		google.maps.event.addListener (marker, 'dragend', function (event) {			
			marker.id = event.latLng.lat() + '_' + event.latLng.lng();
			//console.log("New:"+event.latLng.lat() + '_' + event.latLng.lng());
			var markerId = marker.id;
			delete bmarkers[dragMarkerid];
			bmarkers[markerId] = marker;
			setBoardPointGridBmarker(dragMarkerid,markerId);
			//console.log("After:"+markerId);
			//console.log(bmarkers);
		});		
	};
	
	
	/**
	 * Removes given marker from map.
	 * @param {!google.maps.Marker} marker A google.maps.Marker instance that will be removed.
	 * @param {!string} markerId Id of marker.
	 */ 
	var removeMarker = function(marker, markerId) {
		marker.setMap(null); // set markers setMap to null to remove it from map
		delete bmarkers[markerId]; // delete marker instance from markers object
	};
}

//clear existing boarding point markers when creatboarding and loadboarding route
function clear_brdgpts(){
	boardingno = 0;
	pt_dist = 0;
	bpt_cnt = 0;
	dist_i = 1;
	dist = 0;
	mrkr_cnt = 0;
	markerId = 0;
	bmarkers = [];
	bmarkers.length=0;
	latti_arr = [];
	latti_arr.length=0;	
	langi_arr = [];
	langi_arr.length=0;
	for (var i=0;i<latilan_array.length;i++) {
		latilan_array[i].setMap(null);  	// set markers setMap to null to remove it from map
	}
	langi_arr = [];
	latilan_array.length=0;
}

//load a route with boarding points(markers)
function loadpt_mrkr(boardCombo_id,boardpointStore){
	var mrkr_fit_arr = [];
	clear_brdgpts();
	Ext.getCmp("boardpointGrid").expand();	
	boardpointStore.load({
		params:{boardingid:boardCombo_id},
		callback: function(records, operation, success) {
				for(i=0;i<boardpointStore.getCount();i++)
				{
					var lati = boardpointStore.getAt(i).get("lat");
					var langi = boardpointStore.getAt(i).get("lan");
					mrkr_fit_arr[i] = new google.maps.LatLng(lati, langi);
					var marker_map = new google.maps.Marker({
						position:new google.maps.LatLng(lati,langi),
						map: bpointMap,
						draggable:true,
						animation: google.maps.Animation.DROP,
						icon:'images/gmap/marker-blue.png'
					});
					latilan_array.push(marker_map);
				}				
				google.maps.event.trigger(bpointMap, "resize");
				//fit to display all the markers within the map panel
				var bounds = new google.maps.LatLngBounds();
				for (var i = 0; i < mrkr_fit_arr.length; i++) {
				  bounds.extend(mrkr_fit_arr[i]);
				}
				bpointMap.fitBounds(bounds);
			}
	});
}

var bptname_arr = [];
var dist_arr = [];
var ordrno_arr = [];
var bpt_cnt =0;
var dist_i=1;
var dist=0;
var grid_markr_cnt = 0;
var pt_dist = 0;

function gridAddMarker(markerId,latti_arr,langi_arr){
	grid_markr_cnt++;
	marker_arr[grid_markr_cnt-1] = markerId;	
	var dirSer;	
	bpt_cnt++;			
	if(bpt_cnt>1)
	{
		//calculate the travel maode distance between markers usong google's DirectionsService
		dirSer = new google.maps.DirectionsService();
		var start = new google.maps.LatLng(latti_arr[dist_i-1], langi_arr[dist_i-1]);
		var end = new google.maps.LatLng(latti_arr[dist_i], langi_arr[dist_i]);
		var request = {
			origin:start,
			destination:end,
			travelMode: google.maps.TravelMode.DRIVING
		};
		dirSer.route(request, function(response, status) {
			if (status == google.maps.DirectionsStatus.OK) {
			  dist = response.routes[0].legs[0].distance.value;		//distance between markers(in meters)	  
			}
			var prev_dist = dist/1000;
			pt_dist = pt_dist + prev_dist;
			Ext.Ajax.request({
				url: 'includes/boardingpoint_ajx.php',
				//Get the address of the marker using the marker latlan with AJAX request
				params: {
					todo:'Get_LanLon_Address',
					latitude : latti_arr[bpt_cnt-1],
					longitude : langi_arr[bpt_cnt-1]
				},
				timeout: 600000000,
				success:function(response){
					var MarkerRes 	= Ext.decode(response.responseText);
					Marker_Address = MarkerRes['results'][0]['formatted_address'];
					add_grid(markerId,Marker_Address);		//call the add_grid function to add the grid rows with the marker address and distance
				}
			});			
		});
		dist_i++;
	}
	else
		Ext.Ajax.request({
			url: 'includes/boardingpoint_ajx.php',
			params: {
				todo:'Get_LanLon_Address',
				//Get the address of the marker using the marker latlan with AJAX request
				latitude : latti_arr[bpt_cnt-1],
				longitude : langi_arr[bpt_cnt-1]
			},
			timeout: 600000000,
			success:function(response){
				var MarkerRes 	= Ext.decode(response.responseText);
				Marker_Address = MarkerRes['results'][0]['formatted_address'];
				add_grid(markerId,Marker_Address);		//call the add_grid function to add the grid rows with the marker address and distance
			}
		});
}

//adding order no,marker name(boardingpoint name) and distance in grid
function add_grid(markerId,Marker_Address){
	var bpointgrid 	= Ext.getCmp("boardpointGrid");
	var bpointStore = bpointgrid.getStore();	
	var rowIndex = bpointStore.getCount();	
	boardingno++;
	var gridmarker = Ext.create('boardpointData', {
		bmarkerid:markerId,			
		orderno: boardingno,					//boarding point orderno
		bpointname: Marker_Address,				//boarding point address as name
		distance: pt_dist						//distance
	});	
	bpointStore.insert(rowIndex, gridmarker);	//Insert the row with the above values in the grid
}

//remove boarding point when clicking delete button in grid,and also remove the marker for that point from map
function gridRemoveMarker(grid, rowIndex){
	bpt_cnt--;
	var bpointStore = grid.getStore();
	var markerid = bpointStore.getAt(rowIndex).get("bmarkerid");	//get markerid from the rowIndex which wants to remove
	var orno = bpointStore.getAt(rowIndex).get("boardingno");		//get the orderno from the rowIndex which wants to remove
	var rmve_marker = bmarkers[markerid];
	bpointStore.removeAt(rowIndex);									//remove the row from the boarding point grid
	rmve_marker.setMap(null); 										//set markers setMap to null to remove it from map	
	latti_arr[rowIndex] =0;
	langi_arr[rowIndex] =0;
}

function getBoardPointGridRIndex(fieldname, fieldvalue){
	var bpointgrid 	= Ext.getCmp("boardpointGrid");
	var bpointStore = bpointgrid.getStore();
	return bpointStore.findExact(fieldname, fieldvalue);
}

function setBoardPointGridBmarker(oldmarkerid, newmarkerid){
	var bpointgrid 	= Ext.getCmp("boardpointGrid");
	var bpointStore = bpointgrid.getStore();
	var roxIndex = getBoardPointGridRIndex('bmarkerid',oldmarkerid);
	bpointStore.getAt(roxIndex).set("bmarkerid",newmarkerid);
}

//save the created boardingpoints for a route
function gridMarkerAddRoute(marker_arr){
	var bpointgrid 	= Ext.getCmp("boardpointGrid");
	var bpointStore = bpointgrid.getStore();
	bptname_arr.length = 0;
	ordrno_arr.length = 0;
	dist_arr.length = 0;
	for(i=0;i<bpt_cnt;i++)
	{
		//get the bpointStore values(bpointname,oerderno and distance) to save it to db
		var bptname = bpointStore.getAt(i).get("bpointname");
		var ordrno  = bpointStore.getAt(i).get("orderno");
		var dista  = bpointStore.getAt(i).get("distance");
		bptname_arr[i] = bptname;
		ordrno_arr[i]  = ordrno;
		dist_arr[i]    = dista;
	}
    var boardingsaverouteWin = Ext.create('Ext.Window', {
        title: 'Save Route',
		id:'boardingsaverouteWin',
        width:400,
        height:110,
        plain: true,
		modal:true,
		closable:false,
		border: false,
        layout: 'fit',
		items: [{
			xtype:'form',
			id:'boardsaveroutefrm',
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
				id:'boardroutename',
				name:'boardroutename',
				allowBlank:false,
				blankText:'Please enter the Route Name',
				anchor:'100%'
			}]
		}],
		buttons: [{
			text:'Save',
			handler:function(){
				var formPanel = Ext.getCmp('boardsaveroutefrm').getForm();
				if(formPanel.isValid()){
					formPanel.submit({
						clientValidation: true,
						url: 'includes/boardingpoint_ajx.php',
						params: {
							todo: 'Board_Save_Route',
							latlang: Ext.encode(marker_arr),
							latit: Ext.encode(latti_arr),
							langit: Ext.encode(langi_arr),
							bpointname: Ext.encode(bptname_arr),
							orderno:Ext.encode(ordrno_arr),
							distance:Ext.encode(dist_arr)
						},
						success: function(form, action) {
							var boardingid = action.result.boardingid;
							boardingsaverouteWin.destroy();
							Ext.Msg.alert('Success', action.result.msg);
							Ext.getCmp("boardCombo").getStore().load({
								callback:function(){
									Ext.getCmp("boardCombo").setValue(boardingid);
								}
							});
						},
						failure: function(form, action) {
							boardingsaverouteWin.destroy();
							Ext.Msg.alert('Success', action.result.msg);
						}
					});
				}
			}
		},{
			text: 'Close',
			handler: function() {
				boardingsaverouteWin.destroy();
			}
		}]
    }).show();
}

//assign a route for omni bus or a vehicle
function Assign_brdg_Route(boardCombo_id, routename){
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
				store: brdg_assign_combo_store,
				displayField: 'vehiclename',
				valueField: 'vehicleid',
				queryMode:'local',
				emptyText:'Select Vehicle...',
				name: 'bdg_routevehicleid',
				id:'bdg_routevehicleid',
				triggerAction: 'all',
				forceSelection: true,
				editable:true,
				selectOnFocus:true,
				allowBlank:false,
				blankText:'Select the Vehicle',
				anchor: '100%',
				listeners:{
					afterrender:function(){
						brdg_assign_combo_store.load();
					}
				}
			}]
		}],
		buttons: [{
			text:'Save',
			handler:function(){
				var formPanel = Ext.getCmp('assignroutefrm').getForm();
				if(formPanel.isValid()){
					var vehiclename = Ext.getCmp("bdg_routevehicleid").getRawValue();
					Ext.getCmp('assignroutefrm').getEl().mask("Please wait...Assigning Route to Vehicle");
					formPanel.submit({
						clientValidation: true,
						url: 'includes/boardingpoint_ajx.php',
						params: {
							todo: 'Assign_brdg_Route',
							boardingid:boardCombo_id
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