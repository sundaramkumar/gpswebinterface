function showDevices(){
	if(Ext.getCmp("SAdminPanelDevicesGrid")){
		Ext.getCmp("SAdminPanelDevices").setActiveTab("SAdminPanelDevicesGrid");
		return false;
	}

    Ext.define('deviceData', {
        extend: 'Ext.data.Model',
		fields: [
            {name: 'deviceid',mapping: 'deviceid',type:'int'},
			{name: 'devicetype',mapping: 'devicetype', type: 'string'},
            {name: 'devicename',mapping: 'devicename', type: 'string'},
			{name: 'status',mapping: 'status', type: 'string'},
			{name: 'purchasedon',mapping: 'purchasedon', type: 'string'},
			{name: 'installedon',mapping: 'installedon', type: 'string'},
			{name: 'simcardno',mapping: 'simcardno', type: 'string'},
			{name: 'simserialno',mapping: 'simserialno', type: 'string'},
			{name: 'simprovider',mapping: 'simprovider', type: 'string'},
			{name: 'gprsplan',mapping: 'gprsplan', type: 'string'},
			{name: 'gprssettings',mapping: 'gprssettings', type: 'string'},
			{name: 'customerid',mapping: 'customerid', type: 'int'},
			{name: 'devdetails',mapping: 'devdetails', type: 'string'},
			{name: 'realtime',mapping: 'realtime', type: 'string'},
			{name: 'history',mapping: 'history', type: 'string'}
            ],
        idDevice: 'deviceid'
    });

    // create the Data Store
    var DeviceStore = Ext.create('Ext.data.JsonStore', {
        id: 'DeviceStore',
        pageSize: 30,
        model: 'deviceData',
        remoteSort: false,
        proxy: {
            type: 'ajax',
			actionMethods: {
				read: 'POST'
			},
            url: './includes/mng_devices_ajx.php',
            extraParams: {
				todo : 'Get_Devices_List'
            },
            reader: {
				type: 'json',
                root: 'DEVICES',
                totalProperty: 'totalCount'
            },
            // sends single sort as multi parameter
            simpleSortMode: true
        },
        sorters: [{
            property: 'Devicename',
            direction: 'ASC'
        }]
    });

	var DevicesCol	= [	Ext.create('Ext.grid.RowNumberer'),
		{text: "Device Name", dataIndex: 'devicename', flex:1, sortable: true},
		{text: "Purchased On", dataIndex: 'purchasedon', width:100, sortable: true},
		{text: "installed On", dataIndex: 'installedon', width:100, sortable: true},
		{text: "Sim Card No", dataIndex: 'simcardno',  width:120, sortable: true},
		{text: "Provider", dataIndex: 'simprovider',  width:120, sortable: true},
		{text: "GPRS Plan", dataIndex: 'gprsplan',  width:120, sortable: true},
		//{text: "Live Tracking", dataIndex: 'realtime',  flex: 1, width:5,sortable: true},
		{text: "History Tracking", dataIndex: 'history',  flex: 1, width:5,sortable: true}
	];

    var loadTabPanel = Ext.getCmp('SAdminPanelDevices');
    loadTabPanel.add({
			id:'CPanelDevicesGrid',
			xtype: 'grid',
			enableColumnHide:false,
			enableColumnMove:false,
			layout: 'fit',
			autoScroll:true,
			loadMask: true,
			store:DeviceStore,
			plugins: [{
			    ptype: 'rowexpander',
	            rowBodyTpl : [
	                '{devdetails}'
	            ]
	        }],
			selModel: {
				selType: 'rowmodel',
				mode : 'SINGLE',
				listeners:{
					'select':function(selmod, record, opt){
						if(record.get("deviceid")!=0){
							Ext.getCmp("gridDEEditButton").enable();							
						}
					}
				}
			},
			viewConfig: {
				forceFit:true,
				stripeRows: true,
				emptyText:"<span class='tableTextM'>No Records Found</span>"
			},
			tbar:['->',{
				xtype:'buttongroup',
				items: [{
					text: 'Update Simcard Details',
					scale: 'small',
					id:'gridDEEditButton',
					disabled:true,
					hidden:true,
					handler:function(){
						var selMode = Ext.getCmp("CPanelDevicesGrid").getSelectionModel();
						if(selMode.hasSelection()){
							var gridRec	= selMode.getSelection();
							//alert(3);
							if(gridRec.length>0){
								//var tmpStrArray1 = gridRec[0].get("contactperson").split(" ");
								var deviceArray 			= new Array();
								deviceArray["todo"]		= "Update_Simcard_Details";
								deviceArray["titleStr"]	= "Update Simcard Details";
								deviceArray['deviceid'] 	= gridRec[0].get("deviceid");
								deviceArray['devicetype']	= gridRec[0].get("devicetype");
								deviceArray['devicename']	= gridRec[0].get("devicename");
								deviceArray[1]	= gridRec[0].get("simcardno");
								deviceArray[2]	= gridRec[0].get("simserialno");
								deviceArray[3]	= gridRec[0].get("simprovider");
								deviceArray[4]	= gridRec[0].get("gprsplan");
								deviceArray[5]	= gridRec[0].get("gprssettings");								
								Update_SimDetails(deviceArray);
							}
						}
					}				
				}]
			}
			],
			columns: DevicesCol,
			border:false,
			collapsible: false,
			animCollapse: false,
			stripeRows: true,
			dockedItems: [{
				xtype: 'pagingtoolbar',
				id:'CPanelDevicesGridPbar',
				store: DeviceStore,
				dock: 'bottom',
				pageSize: 30,
				displayInfo: true
			}]
    }).show();
    loadTabPanel.doLayout();
	Ext.getCmp("gridDEEditButton").disable();	
    //loadTabPanel.setActiveTab(Ext.getCmp("attendGrid"));
	loadTabPanel.on('activate', function(){
		DeviceStore.load({params:{start:0, limit:30}});
	});	
    //DeviceStore.load({params:{start:0, limit:30}});

}

function Update_SimDetails(deviceArray){
	var simform = {
		xtype:'form',
		id:'simform',
		name:'simform',
		layout: {
			type: 'anchor'
		},
		frame:true,
		border:false,
		bodyPadding:10,
		fieldDefaults: {
			labelAlign: 'right',
			msgTarget: 'side',
			labelSeparator:'',
			labelWidth:120
		},
		defaultType: 'textfield',
		items: [{
			xtype:'textfield',
			fieldLabel:'Device Name',
			id:'devicename',
			name:'devicename',
			anchor:'100%',
			readOnly:true,
			listeners:{
				afterrender:function(){
					if(deviceArray['devicename']!="")
						this.setValue(deviceArray['devicename']);
				}
			}
		},{
			xtype:'textfield',
			fieldLabel:'Simcard No',
			id:'simcardno',
			name:'simcardno',
			blankText:'Enter the Simcard No',
			allowBlank:false,
			anchor:'70%',
			listeners:{
				afterrender:function(){
					if(deviceArray[1]!="")
						this.setValue(deviceArray[1]);
				}
			}
		},{
			xtype:'textfield',
			fieldLabel:'Simcard SerialNo',
			id:'simcardserial',
			name:'simcardserial',
			blankText:'Enter the Simcard SerialNo',
			allowBlank:false,
			anchor:'100%',
			listeners:{
				afterrender:function(){
					if(deviceArray[2]!="")
						this.setValue(deviceArray[2]);
				}
			}
		},{
			xtype:'textfield',
			fieldLabel:'Simcard Provider',
			id:'simprovider',
			name:'simprovider',
			blankText:'Enter the Simcard Provider',
			allowBlank:false,
			anchor:'100%',
			listeners:{
				afterrender:function(){
					if(deviceArray[3]!="")
						this.setValue(deviceArray[3]);
				}
			}
		},{
			xtype:'textfield',
			fieldLabel:'GPRS Plan',
			id:'gprsplan',
			name:'gprsplan',
			blankText:'Enter the GPRS Plan',
			allowBlank:false,
			anchor:'100%',
			listeners:{
				afterrender:function(){
					if(deviceArray[4]!="")
						this.setValue(deviceArray[4]);
				}
			}
		},{
			xtype:'textfield',
			fieldLabel:'GPRS Settings',
			id:'gprssettings',
			name:'gprssettings',
			blankText:'Enter the GPRS Settings',
			allowBlank:false,
			anchor:'100%',
			listeners:{
				afterrender:function(){
					if(deviceArray[5]!="")
						this.setValue(deviceArray[5]);
				}
			}
		}]
	};
	
	var deviceWin = Ext.create('Ext.Window', {
		title:"Update Simcard Details",
		width:400,
		height:250,
		plain: true,
		modal:true,
		resizable:false,
		border: false,
		layout: {
			type: 'fit'
		},
		items: [simform],
		buttons: [{
			text: 'Update',
			handler:function(){
				var formPanel = Ext.getCmp('simform').getForm();
				if(formPanel.isValid()){
					formPanel.submit({
						clientValidation: true,
						url: 'includes/mng_devices_ajx.php',
						params: {
							todo: deviceArray['todo'], deviceid:deviceArray['deviceid'], devicename:deviceArray['devicename']
						},
						success: function(form, action) {
						   Ext.Msg.alert('Success', action.result.msg);
						   Ext.getCmp("CPanelDevicesGridPbar").store.load();
						   deviceWin.destroy();
						},
						failure: function(form, action) {
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
				deviceWin.destroy();
			}
		}]
	}).show();
	Ext.getCmp('simcardno').focus(true,1000);	
}