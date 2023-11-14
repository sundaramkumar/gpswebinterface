    var accordion_store = Ext.create('Ext.data.TreeStore', {
        proxy: {
            type: 'ajax',
            url: './scripts/menu.json'
        }
    });

	var mnuSAdmin_store = Ext.create('Ext.data.TreeStore', {
//        proxy: {
//            actionMethods: {
//				read: 'POST'
//			},
//            type: 'ajax'
//			//,
////            url: 'includes/customers_ajx.php',
////            extraParams: {
////				todo : 'Get_Devices_List'
////            }
//        },
        root: {
			expanded: true,
			id:'SAadmin',
			children:[
				{
					text: 'Customers',
					id: 'Customers',
					leaf:true,
					listeners:{
						//click:loadCustomers
					}
				},{
					text:'Devices',
					id: 'Devices',
					leaf:true
				},
				{
					text: 'Kids',
					id: 'Kids',
					leaf:true
				},
				{
					text: 'Vehicle',
					id: 'Vehicle',
					leaf:true
				},
				{
					text: 'Technicians',
					id: 'Technicians',
					leaf:true
				},
				{
					text: 'Users',
					id: 'Users',
					leaf:true
				},
				{
					text: 'Services',
					id: 'Services',
					leaf:true
				},
				{
					text: 'Reports',
					id: 'Reports',
					leaf:true
				},
				{
					text: 'Settings',
					id: 'Settings',
					leaf:true
				}
			]
        }/*,
		folderSort: true,
        sorters: [{
            property: 'text',
            direction: 'ASC'
        }]*/
    });

	var mnuTrack_store = Ext.create('Ext.data.TreeStore', {
//        proxy: {
//            actionMethods: {
//				read: 'POST'
//			},
//            type: 'ajax',
//            url: 'includes/devices_ajx.php',
//            extraParams: {
//				todo : 'Get_Devices_List'
//            }
//        },
        root: {
			text:'Tracking',
			id:'Tracking',
			expanded: true,
			children:[{
				text:'Realtime',
				id:'Tracking/Realtime',
				expanded: true,
				children:[{
					text: 'Devices',
					id: 'Tracking/Realtime/Devices',
					iconCls:'gpsFolder',
					expanded: true
				}]
			},
			{
				text: 'History',
				id: 'Tracking/Realtime/History'
			}]

        }
        /*,
		 folderSort: true,
        sorters: [{
            property: 'text',
            direction: 'ASC'
        }]*/
    });

	var welcome = Ext.create('Ext.Panel', {
		title: 'Welcome',
		html: '&lt;empty panel&gt;',
		iconCls:'dashboard'
	});

	// Go ahead and create the TreePanel now so that we can use it below
    var TracePanel = Ext.create('Ext.tree.Panel',
	{
        id: 'TracePanel',
		title: 'Track Devices',
		iconCls: 'nav',
		width: 200,
		//height: 360,
		//region: 'west',
		split: true,
		collapsible: true,
		collapseMode: 'mini',
        autoScroll: true,
        store: mnuTrack_store,
		listeners:{
			itemclick: function(view, record , item, index, event) {
				/*if(record.get("leaf")){
					//eval(record.get("id")+"()");
					var deviceid = record.get("id");
                    var deviceid = deviceid.replace("Devices/","");
                    if(!deviceTrackArr.inArray(deviceid)){
                        deviceTrackArr[deviceTrackArr.length] = deviceid;
                    }
                    gpsCook.set('deviceTrackArr',deviceTrackArr);
                    setLatLanDevice();
				}*/
				//devices();
			}
		},
        bbar:[{
            text:'Start Auto Refresh',
            disabled:true,
            id:'autoRefresh',
            handler : function(){
                if(this.text=="Start Auto Refresh"){
                    this.setText("Stop Auto Refresh");
                    startAutoRefresh();
                }else{
                    this.setText("Start Auto Refresh");
                    stopAutoRefresh();
                }
            }
        },'->',{
            text:'Track',
            handler:trackGpsDevice
        }]
    });


	var ManagePanel = Ext.create('Ext.Panel', {
		title: 'Manage',
		iconCls:'manage'
	});

	var ReportsPanel = Ext.create('Ext.tree.Panel', {
		title: 'Reports',
		iconCls:'report',
		store: accordion_store,
		root: {
			text:'Reports',
			id:'Reports/',
			expanded: true
        }
		////,autoLoad:true,
		//,listeners:{
		//	beforeload:function(TreeLoader,node){
		//		console.Log(TreeLoader.baseParams+' --- '+node);
		//	}
		//	//dataUrl:'./scripts/menu.json?node=Reports'
		//}
	});

	var sAdminPanel = Ext.create('Ext.tree.Panel',{
		title: 'Manage',
		iconCls: 'alarm',
		store: mnuSAdmin_store,
		//flex:3,
		layout:'fit',
		border:0,
		rootVisible: false,
		listeners:{
			itemclick: function(view, record , item, index, event) {
				if(record.get("leaf")){
					//alert("LoadTabs('"+record.get("id")+"')");
					eval("LoadTabs('"+record.get("id")+"')");
					//eval(record.get("id")+"()");
					/*var deviceid = record.get("id");
                    var deviceid = deviceid.replace("Devices/","");
                    if(!deviceTrackArr.inArray(deviceid)){
                        deviceTrackArr[deviceTrackArr.length] = deviceid;
                    }
                    gpsCook.set('deviceTrackArr',deviceTrackArr);
                    setLatLanDevice();*/
				}
				//devices();
			}
		}
	});


    var accordion = Ext.create('Ext.Panel',
		{
			region:'west',
			margins:'5 0 5 5',
			split:true,
			width: 200,
			title:'Welcome',
			layout: {
				type:'vbox',
				//padding:'5',
				align:'stretch'
			},
			items:[{
				xtype:'container',
				title: 'Welcome',
				flex:1
				/*icon:'./images/duetoday.png'*//*,
				handler:markAttendance*/
			},{
				xtype:'container',
				//layout:'accordion',
				flex:3,
				items: [sAdminPanel]//,  ReportsPanel, ManagePanel, GeoFencePanel]
			}]

		}
	);