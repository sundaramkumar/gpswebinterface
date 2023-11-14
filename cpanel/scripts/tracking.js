function showTracking(){
	if(Ext.getCmp("SAdminPanelTrackingGrid")){
		Ext.getCmp("SAdminPanelTracking").setActiveTab("SAdminPanelTrackingGrid");
		return false;
	}

	Ext.define('vehicleData', {
		extend: 'Ext.data.Model',
			fields: [
				{name: 'vehicleid',mapping: 'vehicleid',type:'int'},
				{name: 'customerid',mapping: 'customerid',type:'int'},
				{name: 'deviceid',mapping: 'deviceid',type:'int'},
				{name: 'regno',mapping: 'regno', type: 'string'},
				{name: 'vehiclename',mapping: 'vehiclename', type: 'string'},
				{name: 'devicename',mapping: 'devicename', type: 'string'},
				{name: 'deviceIMEI',mapping: 'deviceIMEI', type: 'string'},
				{name: 'simcardno',mapping: 'simcardno', type: 'string'},
				{name: 'drivername',mapping: 'drivername', type: 'string'},
				{name: 'mobile',mapping: 'mobile', type: 'string'},
				{name: 'polypath',mapping: 'polypath', type: 'string'},
				{name: 'routepath',mapping: 'routepath', type: 'string'},
				{name: 'realtime',mapping: 'realtime', type: 'string'},
				{name: 'history',mapping: 'history', type: 'string'}
		    ],
		idvehicle: 'vehicleid'
	    });
	Ext.define('kidsData', {
		extend: 'Ext.data.Model',
			fields: [
				{name: 'kidid',mapping: 'kidid',type:'int'},
				{name: 'customerid',mapping: 'customerid',type:'int'},
				{name: 'deviceid',mapping: 'deviceid',type:'int'},
				{name: 'kidname',mapping: 'kidname', type: 'string'},
				{name: 'devicename',mapping: 'devicename', type: 'string'},
				{name: 'mobile',mapping: 'mobile', type: 'string'},
				{name: 'deviceIMEI',mapping: 'deviceIMEI', type: 'string'},
				{name: 'friend1name',mapping: 'friend1name', type: 'string'},
				{name: 'friend1phone',mapping: 'friend1phone', type: 'string'},
				{name: 'friend2name',mapping: 'friend2name', type: 'string'},
				{name: 'friend2phone',mapping: 'friend2phone', type: 'string'},
				{name: 'realtime',mapping: 'realtime', type: 'string'},
				{name: 'history',mapping: 'history', type: 'string'}
		    ],
		idvehicle: 'vehicleid'
	    });

    // create the Data Store
    var VehicleStore = Ext.create('Ext.data.JsonStore', {
        id: 'VehicleStore',
        pageSize: 30,
        model: 'vehicleData',
        remoteSort: false,
        proxy: {
            type: 'ajax',
			actionMethods: {
				read: 'POST'
			},
            url: './includes/tracking_ajx.php',
            extraParams: {
				todo : 'Get_Vehicle_List',
				devtype:'VTS'
            },
            reader: {
				type: 'json',
                root: 'VEHICLE',
                totalProperty: 'totalCount'
            },
            // sends single sort as multi parameter
            simpleSortMode: true
        },
        sorters: [{
            property: 'vehiclename',
            direction: 'ASC'
        }]
    });

    // create the Data Store
    var KidsStore = Ext.create('Ext.data.JsonStore', {
        id: 'KidsStore',
        pageSize: 30,
        model: 'kidsData',
        remoteSort: false,
        proxy: {
            type: 'ajax',
			actionMethods: {
				read: 'POST'
			},
            url: './includes/tracking_ajx.php',
            extraParams: {
				todo : 'Get_Kids_List',
				devtype:'CTS'
            },
            reader: {
				type: 'json',
                root: 'KIDS',
                totalProperty: 'totalCount'
            },
            // sends single sort as multi parameter
            simpleSortMode: true
        },
        sorters: [{
            property: 'vehiclename',
            direction: 'ASC'
        }]
    });

	var VehicleCol	= [	Ext.create('Ext.grid.RowNumberer'),
		{text: "Registration Number", dataIndex: 'regno', flex: 1, sortable: true},
		{text: "Vehicle Name", dataIndex: 'vehiclename', flex: 1, sortable: true},
		{text: "Device Name", dataIndex: 'devicename', flex: 1, sortable: true},
		{text: "DeviceIMEI", dataIndex: 'deviceIMEI', flex: 1, sortable: true},
		{text: "Sim Phone No", dataIndex: 'simcardno', flex: 1, sortable: true},
		{text: "Driver Name", dataIndex: 'drivername', flex: 1, sortable: true},
		{text: "Driver Mobile", dataIndex: 'mobile',  flex: 1, sortable: true},
		{text: "Geo Fence", dataIndex: 'polypath',  flex: 1, width:5,sortable: true},
		{text: "Route Path", dataIndex: 'routepath',  flex: 1, width:5,sortable: true},
		//{text: "Live Tracking", dataIndex: 'realtime',  flex: 1, width:5,sortable: true},
		{text: "History Tracking", dataIndex: 'history',  flex: 1, width:5,sortable: true}

	];

	var kidsCol	= [	Ext.create('Ext.grid.RowNumberer'),
		{text: "Kid Name", dataIndex: 'kidname', flex: 1, sortable: true},
		{text: "Device Name", dataIndex: 'devicename', flex: 1, sortable: true},
		{text: "Mobile", dataIndex: 'mobile', flex: 1, sortable: true},
		{text: "DeviceIMEI", dataIndex: 'deviceIMEI', flex: 1, sortable: true},
		{text: "Friend 1", dataIndex: 'friend1name', flex: 1, sortable: true},
		{text: "Friend 1 Phone", dataIndex: 'friend1phone', flex: 1, sortable: true},
		{text: "Friend 2", dataIndex: 'friend2name', flex: 1, sortable: true},
		{text: "Friend 2 Phone", dataIndex: 'friend2phone', flex: 1, sortable: true},
		{text: "", dataIndex: 'realtime',  flex: 1, width:5,sortable: true},
		{text: "", dataIndex: 'history',  flex: 1, width:5,sortable: true}

	];

	var devtype="";
	var deviceuserStore = Ext.create('Ext.data.ArrayStore', {
	    fields: ['val','name'],
	    data : [
			["VTS","Vehicle"],
			["CTS","Kids"]
		]
	});
	
    var loadTabPanel = Ext.getCmp('SAdminPanelTracking');
    loadTabPanel.add({
			id:'SAdminPanelTrackingGrid',
			//title:'Tracking',
			xtype: 'grid',
			enableColumnHide:false,
			enableColumnMove:false,
			layout: 'fit',
			autoScroll:true,
			loadMask: true,
			store:VehicleStore,
			selModel: {
				selType: 'rowmodel',
				mode : 'SINGLE',
				listeners:{
					/*'selectionchange':function(selmod, record, opt){
						if(record[0].get("vehicleid")!=0){

						}
					}
					'select':function(selmod, record, opt){
						if(record.get("vehicleid")!=0){
														
						}
					}*/
				}
			},
			viewConfig: {
				forceFit:true,
				stripeRows: true,
				emptyText:"<span class='tableTextM'>No Records Found</span>"
			},
			tbar:[{
				xtype: 'combo',
				fieldLabel: 'Device Type',
				grow:false,
				width:200,
				columnWidth:0.4,
				id:'devicetype',
				name:'devicetype',
				store: deviceuserStore,
				//allowBlank:false,
				queryMode: 'local',
				displayField: 'name',
				valueField: 'val',
				listeners:{
					afterrender:function(){
						this.setValue("VTS");
						devtype=this.value;
					},
					select:function(){
						var devtype=Ext.getCmp('devicetype').getValue();
						if(this.value=="CTS"){
							var kidsCol	= [	Ext.create('Ext.grid.RowNumberer'),
								{text: "Kid Name", dataIndex: 'kidname', flex: 1, sortable: true},
								{text: "Device Name", dataIndex: 'devicename', flex: 1, sortable: true},
								{text: "Mobile", dataIndex: 'mobile', flex: 1, sortable: true},
								{text: "DeviceIMEI", dataIndex: 'deviceIMEI', flex: 1, sortable: true},
								{text: "Friend 1", dataIndex: 'friend1name', flex: 1, sortable: true},
								{text: "Friend 1 Phone", dataIndex: 'friend1phone', flex: 1, sortable: true},
								{text: "Friend 2", dataIndex: 'friend2name', flex: 1, sortable: true},
								{text: "Friend 2 Phone", dataIndex: 'friend2phone', flex: 1, sortable: true},
								{text: "", dataIndex: 'realtime',  flex: 1, width:5,sortable: true},
								{text: "", dataIndex: 'history',  flex: 1, width:5,sortable: true}
							];
							Ext.getCmp("SAdminPanelTrackingGrid").reconfigure(KidsStore,kidsCol);
							KidsStore.baseParams = {devtype:devtype, start:0, limit:30};
							KidsStore.load({params:{devtype:devtype, start:0, limit:30}});
							Ext.getCmp("filterText").setRawValue();
							Ext.getCmp("vfilterlabel").hide();
							Ext.getCmp("kfilterlabel").show();
						}else{
							var VehicleCol	= [	Ext.create('Ext.grid.RowNumberer'),
								{text: "Registration Number", dataIndex: 'regno', flex: 1, sortable: true},
								{text: "Vehicle Name", dataIndex: 'vehiclename', flex: 1, sortable: true},
								{text: "Device Name", dataIndex: 'devicename', flex: 1, sortable: true},
								{text: "DeviceIMEI", dataIndex: 'deviceIMEI', flex: 1, sortable: true},
								{text: "Sim Phone No", dataIndex: 'simcardno', flex: 1, sortable: true},
								{text: "Driver Name", dataIndex: 'drivername', flex: 1, sortable: true},
								{text: "Driver Mobile", dataIndex: 'mobile',  flex: 1, sortable: true},
								{text: "Live Tracking", dataIndex: 'realtime',  flex: 1, width:5,sortable: true},
								{text: "History Tracking", dataIndex: 'history',  flex: 1, width:5,sortable: true}
							];
							Ext.getCmp("SAdminPanelTrackingGrid").reconfigure(VehicleStore,VehicleCol);
							VehicleStore.baseParams = {devtype:devtype, start:0, limit:30};
							VehicleStore.load({params:{devtype:devtype, start:0, limit:30}});
							Ext.getCmp("filterText").setRawValue();
							Ext.getCmp("vfilterlabel").show();
							Ext.getCmp("kfilterlabel").hide();
						}

					}
				}

			},new Ext.form.Label({
				id:'vfilterlabel',
				style:'padding:0px 2px 0px 10px',
				text:'Reg No / Vehicle / Driver'
			}),new Ext.form.Label({
				id:'kfilterlabel',
				hidden:true,
				style:'padding:0px 2px 0px 10px',
				text:'Kid Name'
			}),
			new Ext.ux.form.SearchField({
				width:250,
				id:'filterText',
				onTrigger2Click:function(){
					var filterText	= Ext.getCmp("filterText").getRawValue();
					var devtype	= Ext.getCmp("devicetype").getValue();
					if(devtype=="CTS"){
						KidsStore.baseParams = {devtype:devtype, filterText:filterText, start:0, limit:30};
						KidsStore.load({params:{devtype:devtype, filterText:filterText, start:0, limit:30}});
					}else{
						VehicleStore.baseParams = {devtype:devtype, filterText:filterText, start:0, limit:30};
						VehicleStore.load({params:{devtype:devtype, filterText:filterText, start:0, limit:30}});
					}
				}
			}),'->',{
				xtype:'buttongroup',
				items: [{
					text:'View All',
					scale: 'small',
					handler:function(){
						Show_Live_Tracking_Vehicles();
					}
				}]
			},{
				xtype:'buttongroup',
				items: [{
					text:'Refresh',
					scale: 'small',
					icon:'./images/refresh.png',
					handler:function(){
						var filterText	= Ext.getCmp("filterText").getRawValue();
						var devtype	= Ext.getCmp("devicetype").getValue();
						if(devtype=="CTS"){
							KidsStore.baseParams = {devtype:devtype, filterText:filterText, start:0, limit:30};
							KidsStore.load({params:{devtype:devtype, filterText:filterText, start:0, limit:30}});
						}else{
							VehicleStore.baseParams = {devtype:devtype, filterText:filterText, start:0, limit:30};
							VehicleStore.load({params:{devtype:devtype, filterText:filterText, start:0, limit:30}});
						}
					}
				}]
			}],
			columns: VehicleCol,
			border:false,
			collapsible: false,
			animCollapse: false,
			stripeRows: true,
			dockedItems: [{
				xtype: 'pagingtoolbar',
				id:'SAdminPanelTrackingGridPbar',
				store: VehicleStore,
				dock: 'bottom',
				pageSize: 30,
				displayInfo: true
			}]
    }).show();
    loadTabPanel.doLayout();
	loadTabPanel.on('activate', function(){
		VehicleStore.load({params:{devtype:'VTS',start:0, limit:30}});
	});
}

function Show_Live_Tracking_Vehicles(){
	var win2 = Ext.create('widget.window', {
		maximized:true,
        title: 'Vehicle GPS Status',
        closable: true,
        layout: 'fit',
        items: [{
			xtype:'window',
			closable:false,
			maximizable:true,
			id:'vehicle1',
            title: 'Vehicle-1',
            width: 200,
            height: 100,
            x: 0,
            y: 0,
            constrain: true,
            layout: 'fit',
            items: {
                border: false
            }
        },{
			xtype:'window',
			closable:false,
			maximizable:true,
			id:'vehicle2',
            title: 'Vehicle-2',
            width: 200,
            height: 100,
            x: 210,
            y: 0,
            constrain: true,
            layout: 'fit',
            items: {
                border: false
            }
        }]
    });
    win2.show();
    Ext.getCmp("vehicle1").show();
	Ext.getCmp("vehicle2").show();
}
