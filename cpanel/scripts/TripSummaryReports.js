function showTripSummaryReports(){
	if(Ext.getCmp("TripSummaryPanel")){
		Ext.getCmp("SAdminPanelTripSummaryReports").setActiveTab("TripSummaryPanel");
		return false;
	}
	
	Ext.define('trip_store_data', {
		extend: 'Ext.data.Model',
		fields: [
			{name: 'gpsid', type: 'string'},
			{name: 'latitude', type: 'string'},
			{name: 'longitude', type: 'string'},
			{name: 'speed', type: 'string'},
			{name: 'fuel', type: 'string'},
			{name: 'datetime', type: 'string'},
			{name: 'distance', type: 'string'},
			{name: 'ignition', type: 'string'},
			{name: 'door', type: 'string'},
			{name: 'address', type: 'string'},
			{name: 'overspeed', type: 'string'},
			{name: 'harshbreak', type: 'string'},
			{name: 'idle', type: 'string'}
		]
	});

	var trip_track_store = new Ext.data.Store({
		model: 'trip_store_data',
		proxy: {
			type: 'ajax',
			url: 'includes/reports_ajx.php',
			actionMethods: {
				read: 'POST'
			},
			extraParams: {
				todo : 'Get_TripSummary_Reports'
			},
			reader: {
				type: 'json',
				root: 'TRIP'
			}
		}
	});

	var trip_track_col	= [ new Ext.grid.RowNumberer({ width:50 }),
		{text: "Date & Time", dataIndex: 'datetime', width:150, sortable: true},
		{text: "Engine", dataIndex: 'ignition', width:60, sortable: true},
		{text: "Speed", dataIndex: 'speed', width:60, sortable: false},
		{text: "Fuel", dataIndex: 'fuel', width:60, sortable: false},
		{text: "Distance", dataIndex: 'distance', width:80, sortable: false},
		{text: "OverSpeed", dataIndex: 'overspeed', width:70, sortable: false},
		//{text: "HarshBreak", dataIndex: 'harshbreak', width:70, sortable: false},
		{text: "Idle", dataIndex: 'idle', width:70, sortable: false},
		{text: "Address", dataIndex: 'address', flex:1, sortable: false}
	];
	
	var loadTabPanel = Ext.getCmp('SAdminPanelTripSummaryReports');
    loadTabPanel.add({
		id:'TripSummaryPanel',
		xtype:'tabpanel',
		deferredRender:false,
		layoutOnTabChange :true,
		border:false,
		activeTab:0,
		tbar:[{
			xtype:'combo',
			fieldLabel:'Vehicle',
			store: device_history_combo_store,
			displayField: 'vehiclename',
			valueField: 'vehicleid',
			queryMode:'remote',
			emptyText:'Select Vehicle...',
			labelWidth:40,
			name: 'trip_vehicleid',
			id:'trip_vehicleid',
			triggerAction: 'all',
			forceSelection: true,
			editable:true,
			selectOnFocus:true,
			width: 200
		},'',
		new Ext.ux.form.field.DateTime({
			fieldLabel:'Start Date',
			labelWidth:60,
			style:'margin-top:3px;',
			id: 'trip_startdate',
			name: 'trip_startdate',
			format:'d-m-Y',
			altFormats:'d.m.Y|d/m/Y',
			width: 250,
			allowBlank:false
		}),'',
		new Ext.ux.form.field.DateTime({
			fieldLabel:'End Date',
			labelWidth:60,
			style:'margin-top:3px;',
			id: 'trip_enddate',
			name: 'trip_enddate',
			width: 250,
			allowBlank:false
		}),'',{
			xtype:'buttongroup',
			items: [{
				text:'View',
				scale: 'small',
				handler:function(){
					var trip_vehicleid 	= Ext.getCmp("trip_vehicleid").getValue();
					var startdate	= Ext.getCmp("trip_startdate").getValue();
					var enddate		= Ext.getCmp("trip_enddate").getValue();

					if(trip_vehicleid=="" || trip_vehicleid == null){
						Ext.Msg.alert("INFo","Please select the Vehicle");
						return false;
					}

					if(startdate=="" || startdate == null){
						Ext.Msg.alert("INFO","Please select the Start Date");
						return false;
					}

					if(enddate=="" || enddate == null){
						Ext.Msg.alert("INFO","Please select the End Date");
						return false;
					}

					startdate	= Ext.util.Format.date(startdate, "Y-m-d H:i:s");
					enddate		= Ext.util.Format.date(enddate, "Y-m-d H:i:s");
					Ext.getCmp("TripSummaryPanel").body.mask("Please wait...Fetching Trip Summary Reports");
					/* Ext.Ajax.request({
						url: 'includes/reports_ajx.php',
						params: {
							todo:'Get_TripSummary_Reports',
							vehicleid : trip_vehicleid,
							startdate : startdate,
							enddate : enddate
						},
						timeout: 600000000,
						success:function(response){
							var tripRes = Ext.decode(response.responseText);
							Ext.getCmp("TripSummaryPanel").body.unmask();
							var startHtml	= tripRes.startHtml;
							var endHtml	  	= tripRes.endHtml;
							var milageHtml	= tripRes.milageHtml;
							Ext.getCmp("trip_start_point").body.update(startHtml);
							Ext.getCmp("trip_end_point").body.update(endHtml);
							Ext.getCmp("trip_milage").body.update(milageHtml);
						}
					}); */
					trip_track_store.proxy.extraParams = {todo:'Get_TripSummary_Reports', vehicleid:trip_vehicleid, startdate:startdate, enddate:enddate };
					trip_track_store.load({
						params:{vehicleid:trip_vehicleid, startdate:startdate, enddate:enddate},
						callback: function() {							
							Ext.getCmp("TripSummaryPanel").body.unmask();
							var startHtml	= trip_track_store.proxy.reader.rawData.startHtml;
							var endHtml	  	= trip_track_store.proxy.reader.rawData.endHtml;
							var milageHtml	= trip_track_store.proxy.reader.rawData.milageHtml;
							var driverHtml	= trip_track_store.proxy.reader.rawData.driverHtml;
							Ext.getCmp("trip_start_point").body.update(startHtml);
							Ext.getCmp("trip_end_point").body.update(endHtml);
							Ext.getCmp("trip_milage").body.update(milageHtml);
							Ext.getCmp("trip_driver").body.update(driverHtml);
						}
					});
				}
			}]
		}],
		items:[{
			title:'Summary',
			layout:{
				type:'column'
			},
			bodyStyle:'padding:5px',
			items:[{
				columnWidth: .33,
				style:'margin-right:5px;background-color:#FFFFFF',
				bodyStyle:'background-color:#FFFFFF',
				xtype:'panel',
				frame:true,
				title:'Start Point',
				id:'trip_start_point',
				height:150
			},{
				columnWidth: .33,
				style:'margin-right:5px;background-color:#FFFFFF',
				bodyStyle:'background-color:#FFFFFF',
				xtype:'panel',
				frame:true,
				title:'End Point',
				id:'trip_end_point',
				height:150
			},{
				columnWidth: .33,
				style:'margin-right:5px;background-color:#FFFFFF',
				bodyStyle:'background-color:#FFFFFF',
				xtype:'panel',
				frame:true,
				title:'Milage',
				id:'trip_milage',
				height:150
			},{
				columnWidth: .33,
				style:'margin:5 5 0 0;background-color:#FFFFFF',
				bodyStyle:'background-color:#FFFFFF',
				xtype:'panel',
				frame:true,
				title:'Driver Behaviour',
				id:'trip_driver',
				height:150
			}]
		},{
			xtype: 'grid',
			id:'tripDetailsGrid',
			title:'Details',
			enableColumnHide:false,
			enableColumnMove:false,
			layout: 'fit',
			autoScroll:true,
			loadMask: true,
			store:trip_track_store,
			selModel: {
				selType: 'rowmodel',
				mode : 'SINGLE'
			},
			viewConfig: {
				forceFit:true,
				stripeRows: true,
				emptyText:"<span class='tableTextM'>No Records Found</span>"
			},
			columns: trip_track_col,
			border:false,
			stripeRows: true,
			features: [{
				ftype: 'groupingsummary',       // this for example - not new property
				totalSummary: 'fixed',          // Can be: 'fixed', true, false. Default: false
				totalSummaryTopLine: true,      // Default: true
				totalSummaryColumnLines: true,  // Default: false
			}]  
		}]
    }).show();
    loadTabPanel.doLayout();
}