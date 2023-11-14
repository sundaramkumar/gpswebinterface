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
            {name: 'model',mapping: 'model', type: 'string'},
            {name: 'modeldetails',mapping: 'modeldetails', type: 'string'},
			{name: 'vendorid',mapping: 'vendorid', type: 'string'},            
			{name: 'purchasedon',mapping: 'purchasedon', type: 'string'},
			{name: 'invoiceid',mapping: 'invoiceid', type: 'int'},				
            {name: 'productcheckedby',mapping: 'productcheckedby', type: 'string'},
			{name: 'deviceIMEI',mapping: 'deviceIMEI', type: 'int'},           			
			{name: 'status',mapping: 'status', type: 'string'},
			{name: 'customername',mapping: 'customername', type: 'string'},			            
			{name: 'installedon',mapping: 'installedon', type: 'string'},			
            {name: 'installedby',mapping: 'installedby', type: 'string'},				
			{name: 'checkedby',mapping: 'checkedby', type: 'string'},
			{name: 'trackingcheckedby',mapping: 'trackingcheckedby', type: 'string'},
			{name: 'scrapedon',mapping: 'scrapedon', type: 'string'},
			{name: 'scrapdetails',mapping: 'scrapdetails', type: 'string'},
			{name: 'simcardno',mapping: 'simcardno', type: 'string'},
			{name: 'simserialno',mapping: 'simserialno', type: 'string'},
			{name: 'simprovider',mapping: 'simprovider', type: 'string'},
			{name: 'gprsplan',mapping: 'gprsplan', type: 'string'},
			{name: 'gprssettings',mapping: 'gprssettings', type: 'string'},
			{name: 'activatedon',mapping: 'activatedon', type: 'string'},
			{name: 'customerid',mapping: 'customerid', type: 'int'},
			{name: 'ins_technicianname',mapping: 'technicianname', type: 'string'},
			{name: 'ins_technicianid',mapping: 'technicianid',type:'int'},
			{name: 'che_technicianname',mapping: 'technicianname', type: 'string'},
			{name: 'che_technicianid',mapping: 'technicianid',type:'int'},
			{name: 'tra_technicianname',mapping: 'technicianname', type: 'string'},
			{name: 'tra_technicianid',mapping: 'technicianid',type:'int'},
			
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
		{text: "Customer Name", dataIndex: 'customername',  flex: 1, sortable: true},
		{text: "Device Type", dataIndex: 'devicetype', flex: 1, sortable: true},
		{text: "Device Name", dataIndex: 'devicename', flex: 1, sortable: true},
		{text: "Model", dataIndex: 'model', flex: 1, sortable: true},
		//{text: "Modeldetails", dataIndex: 'modeldetails', flex: 1, sortable: true},
		{text: "IMEI", dataIndex: 'deviceIMEI',  flex: 1, sortable: true},
		{text: "Purchasedon", dataIndex: 'purchasedon', flex: 1, sortable: true},
		{text: "Invoiceid", dataIndex: 'invoiceid', flex: 1, sortable: true},
		{text: "installedon", dataIndex: 'installedon', flex: 1, sortable: true}
		
	];

    var loadTabPanel = Ext.getCmp('SAdminPanelDevices');
	
	Ext.define('CustomerNamesStore_filter', {
        extend: 'Ext.data.Model',
		fields: [
			{name: 'dev_fltr_customerid',mapping: 'customerid',type:'int'},
			{name: 'dev_fltr_customername',mapping: 'customername', type: 'string'}
        ]
	});

	var DeviceCustomersStore_filter = new Ext.data.Store({
		model: 'CustomerNamesStore_filter',
		proxy: {
			type: 'ajax',
			url: 'includes/combo_ajx.php',
			actionMethods: {
				read: 'POST'
			},
            extraParams: {
				todo : 'Get_Customers_List_Filter'
				
            },
			reader: {
				type: 'json',
				root: 'CUSTOMERS'
			}
		}
	});
	var fltr_modelStore = Ext.create('Ext.data.ArrayStore', {
		fields: ['fname','fm_alice'],
		data : [
			["","ALL"],
			["VTS","VEHICLE TRACKING"],
			["CTS","CHILD TRACKING"],
			["PTS","PHONE TRACKING"],
			["BTS","BIKE TRACKING"],
			["OTS","OMNIBUS TRACKING"]
		]
	});
	
    loadTabPanel.add({
		id:'SAdminPanelDevicesGrid',
		xtype: 'grid',
		enableColumnHide:false,
		enableColumnMove:false,
		layout: 'fit',
		autoScroll:true,
		loadMask: true,
		store:DeviceStore,
		selModel: {
			selType: 'rowmodel',
			mode : 'SINGLE',
			listeners:{
				'selectionchange':function(selmod, record, opt){
					if(selmod.hasSelection()){
						if(record[0].get("deviceid")!=0){
								//alert(1);
								Ext.getCmp("gridEditButton_dev").enable();
								Ext.getCmp("gridDelButton_dev").enable();
						}
					}
				}
			}
		},
		viewConfig: {
			forceFit:true,
			stripeRows: true,
			emptyText:"<span class='tableTextM'>No Records Found</span>"
		},
		tbar:[{
				xtype:'combo',
				fieldLabel:'Customer',
				labelWidth:50,
				width:250,
				store: DeviceCustomersStore_filter,
				displayField: 'dev_fltr_customername',
				valueField: 'dev_fltr_customerid',
				queryMode:'local',
				emptyText:'Select Customer...',
				name: 'dev_fltr_customerid',
				id:'dev_fltr_customerid',
				triggerAction: 'all',
				forceSelection: true,
				selectOnFocus:true,
				listeners:{
					afterrender: function(){
						DeviceCustomersStore_filter.load({
						});
					},
					select:function(){
						var dev_customerid = Ext.getCmp("dev_fltr_customerid").getValue();
						var filtr_devtype = Ext.getCmp("dev_fltr_devicetype").getValue();
						var dev_filtertext = Ext.getCmp("device_filterid").getRawValue();
						DeviceStore.baseParams = {customerid:dev_customerid,devtype:filtr_devtype,filtertext:dev_filtertext, start:0, limit:30};
						DeviceStore.load({params:{customerid:dev_customerid,devtype:filtr_devtype,filtertext:dev_filtertext, start:0, limit:30}});
					} 
				}		
			},{
				xtype: 'combo',
				fieldLabel: 'Device Type',
				labelWidth:70,
				width:250,
				id:'dev_fltr_devicetype',
				name:'devicetype',
				emptyText:'Select Device Type...',
				store: fltr_modelStore,
				queryMode: 'local',
				triggerAction: 'all',
				displayField: 'fm_alice',
				valueField: 'fname',
				listeners:{
					afterrender:function(){
					},
					select:function(){
						var filtr_devtype = Ext.getCmp("dev_fltr_devicetype").getValue();
						var dev_customerid = Ext.getCmp("dev_fltr_customerid").getValue();
						var dev_filtertext = Ext.getCmp("device_filterid").getRawValue();
						DeviceStore.baseParams = {customerid:dev_customerid,devtype:filtr_devtype,filtertext:dev_filtertext, start:0, limit:30};
						DeviceStore.load({params:{customerid:dev_customerid,devtype:filtr_devtype,filtertext:dev_filtertext, start:0, limit:30}});
					}
				}
			},new Ext.ux.form.SearchField({
				width:300,
				fieldLabel:'Search',
				emptyText:'Devicename/DeviceIMEI/Model',
				labelWidth:45,
				id:'device_filterid',
				onTrigger2Click:function(){
					var dev_filtertext = Ext.getCmp("device_filterid").getRawValue();
					var filtr_devtype = Ext.getCmp("dev_fltr_devicetype").getValue();
					var dev_customerid = Ext.getCmp("dev_fltr_customerid").getValue();
					DeviceStore.baseParams = {customerid:dev_customerid,devtype:filtr_devtype,filtertext:dev_filtertext, start:0, limit:30};
					DeviceStore.load({params:{customerid:dev_customerid,devtype:filtr_devtype,filtertext:dev_filtertext, start:0, limit:30}});
				}
			}),
			/* {
				xtype:'textfield',
				fieldLabel: 'Search',
				labelWidth:40,
				width:250,
				name: 'filtertext',
				id:'dev_filterid'
			},
			{
				xtype: 'button',
				text: 'Search',
				listeners: {
					click: function(){
						var dev_filtertext = Ext.getCmp("dev_filterid").getValue();
						if(dev_filtertext){
							DeviceStore.baseParams = {filtertext:dev_filtertext, start:0, limit:30};
							DeviceStore.load({params:{filtertext:dev_filtertext, start:0, limit:30}});
						}
					}                       
				}
			},  */
			'->',{
			xtype:'buttongroup',
			items: [{
				text: 'Add Device',
				scale: 'small',
				handler:function(){
					var deviceArray 			= new Array();
					deviceArray["todo"]		= "Add_Device";
					deviceArray["titleStr"]	= "Add Device";
					deviceArray['deviceid'] = 0;
					for(var i=0;i<=23;i++){
						deviceArray[i]="";
					}
					add_edit_device(deviceArray);
				}
			}]
		  },{
			xtype:'buttongroup',
			items: [{
				text: 'Edit Device',
				scale: 'small',
				id:'gridEditButton_dev',
				disabled:true,
				handler:function(){
					//alert(2);
					var gridRec	= Ext.getCmp("SAdminPanelDevicesGrid").getSelectionModel().getSelection();
					//alert(3);
					if(gridRec.length>0){
						//var tmpStrArray1 = gridRec[0].get("contactperson").split(" ");
						var deviceArray 			= new Array();
						deviceArray["todo"]		= "Edit_Device";
						deviceArray["titleStr"]	= "Edit Device";
						deviceArray['deviceid'] 	= gridRec[0].get("deviceid");
						deviceArray[0]	= gridRec[0].get("customerid");
						deviceArray[1]	= gridRec[0].get("devicetype");
						deviceArray[2]	= gridRec[0].get("devicename");
						deviceArray[3]	= gridRec[0].get("model");
						deviceArray[4]	= gridRec[0].get("modeldetails");
						deviceArray[5]	= gridRec[0].get("vendorid");
						deviceArray[6]	= gridRec[0].get("purchasedon");
						deviceArray[7]	= gridRec[0].get("invoiceid");
						deviceArray[8]	= gridRec[0].get("productcheckedby");
						deviceArray[9]	= gridRec[0].get("deviceIMEI");
						deviceArray[10]	= gridRec[0].get("status");
						deviceArray[12]	= gridRec[0].get("installedon");
						//deviceArray[11]	= gridRec[0].get("customername");
						//deviceArray[13]	= gridRec[0].get("installedby");
						//deviceArray[14]	= gridRec[0].get("checkedby");
						//deviceArray[15]	= gridRec[0].get("trackingcheckedby");
						deviceArray[13]	= gridRec[0].get("installedby");
						deviceArray[14]	= gridRec[0].get("checkedby");
						deviceArray[15]	= gridRec[0].get("trackingcheckedby");
						deviceArray[16]	= gridRec[0].get("scrapedon");
						deviceArray[17]	= gridRec[0].get("scrapdetails");
						deviceArray[18]	= gridRec[0].get("simcardno");
						deviceArray[19]	= gridRec[0].get("simserialno");
						deviceArray[20]	= gridRec[0].get("simprovider");
						deviceArray[21]	= gridRec[0].get("gprsplan");
						deviceArray[22]	= gridRec[0].get("gprssettings");
						deviceArray[23]	= gridRec[0].get("activatedon");
						add_edit_device(deviceArray);
					}
				}
			}]
		 },{
			xtype:'buttongroup',
			items: [{
				text: 'Delete Device',
				scale: 'small',
				id:'gridDelButton_dev',
				disabled:true,
				handler:function(){
					var gridRec	= Ext.getCmp("SAdminPanelDevicesGrid").getSelectionModel().getSelection();
					if(gridRec.length>0){
						delete_device(gridRec);
					}
				}
			}]
		}],
		columns: DevicesCol,
		plugins: [{
			ptype: 'rowexpander',
			rowBodyTpl : [
				'<p><b>model Details:</b> {modeldetails}</p>',
				'<p><b>Vendor:</b> {vendorid}</p>'
				
			]
		}],
		border:false,
		collapsible: false,
		animCollapse: false,
		stripeRows: true,
		dockedItems: [{
			xtype: 'pagingtoolbar',
			id:'SAdminPanelDevicesGridPbar',
			store: DeviceStore,
			dock: 'bottom',
			pageSize: 30,
			displayInfo: true
		}]
    }).show();
    loadTabPanel.doLayout();
    //loadTabPanel.setActiveTab(Ext.getCmp("attendGrid"));
    DeviceStore.load({params:{start:0, limit:30}});


}

var modelStore = Ext.create('Ext.data.ArrayStore', {
fields: ['name','m_alice'],
    data : [
			["VTS","VEHICLE TRACKING"],
			["CTS","CHILD TRACKING"],
			["PTS","PHONE TRACKING"],
			["BTS","BIKE TRACKING"],
			["OTS","OMNIBUS TRACKING"]
		]
});

var statusStore = Ext.create('Ext.data.ArrayStore', {
fields: ['sstatus','alice'],
    data : [
			["I","INSTALLED"],
			["NI","NOT INSTALLED"],
			["W","WORKING"],
			["NW","NOT WORKING"],
			["SP","SCRAPED"]
		]
});

function add_edit_device(deviceArray){
	Ext.define('CustomerNamesStore', {
        extend: 'Ext.data.Model',
			fields: [
				{name: 'customerid',mapping: 'customerid',type:'int'},
				{name: 'customername',mapping: 'customername', type: 'string'}
		    ]
			//,idCustomer: 'customerid'
	});
		
	var DeviceCustomersStore = new Ext.data.Store({
		model: 'CustomerNamesStore',
		proxy: {
			type: 'ajax',
			url: 'includes/combo_ajx.php',
			actionMethods: {
				read: 'POST'
			},
            extraParams: {
				todo : 'Get_Customers_List'
            },
			reader: {
				type: 'json',
				root: 'CUSTOMERS'
			}
		}
	});
	
	Ext.define('TechnicianNamesStore', {
	extend: 'Ext.data.Model',
		fields: [
			{name: 'ins_technicianid',mapping: 'technicianid',type:'int'},
			{name: 'ins_technicianname',mapping: 'technicianname', type: 'string'},
			{name: 'che_technicianid',mapping: 'technicianid',type:'int'},
			{name: 'che_technicianname',mapping: 'technicianname', type: 'string'},
			{name: 'tra_technicianid',mapping: 'technicianid',type:'int'},
			{name: 'tra_technicianname',mapping: 'technicianname', type: 'string'}
		]
	});
	
	var DeviceTechniciansStore = new Ext.data.Store({
		model: 'TechnicianNamesStore',
		proxy: {
			type: 'ajax',
			url: 'includes/combo_ajx.php',
			actionMethods: {
				read: 'POST'
			},
            extraParams: {
				todo : 'Get_Technicians_List'
            },
			reader: {
				type: 'json',
				root: 'TECHNICIANS'
			}
		}
	});
	
	
	
	
	var deviceform = {
		xtype:'form',
		id:'deviceform',
		name:'deviceform',
		layout: {
			type: 'column'
		},
		frame:true,
		border:false,
		bodyPadding:10,
		fieldDefaults: {
			labelAlign: 'right',
			msgTarget: 'side',
			labelSeparator:''
		},
		items: [{
			xtype:'container',
			anchor: '100%',
			columnWidth: 0.5,
			height: 250,
			//id:'fieldone',
			//name:'fieldone',
			layout: {
				type:'anchor',
				anchor: '100%'
			},
			items: [{
					xtype:'combo',
					fieldLabel:'Customer',
					store: DeviceCustomersStore,
					displayField: 'customername',
					width: 300,
					valueField: 'customerid',
					queyrMode:'local',
					emptyText:'Select Customer...',
					name: 'customerid',
					id:'customerid',
					hiddenName: 'customerid_Hid',
					blankText: 'Select Customer',
					triggerAction: 'all',
					allowBlank: false,
					forceSelection: true,
					editable:true,
					selectOnFocus:true,
					listeners:{
						afterrender: function(){
							DeviceCustomersStore.load({
								callback: function() {
									if(deviceArray[0]!="")
										Ext.getCmp("customerid").setValue(deviceArray[0]); //0);
								}
							});
						}
					}
				},{
					xtype: 'combo',
					fieldLabel: 'Device Type',
					width: 300,
					id:'devicetype',
					name:'devicetype',
					editable:false,
					emptyText:'Select Device Type...',
					blankText:'Select Device Type',
					store: modelStore,
					allowBlank:false,
					queryMode: 'local',
					triggerAction: 'all',
					displayField: 'm_alice',
					valueField: 'name',
					listeners:{
						afterrender:function(){
							if(deviceArray[1]!="")
								this.setValue(deviceArray[1]);
						}
					}
				},{
					xtype: 'textfield',
					fieldLabel:'Device name',
					name:'devicename',
					id:'devicename',
					allowBlank:false,
					anchor: '100%',
					blankText:'Please enter the Device Name',
					listeners:{
						afterrender:function(){
							if(deviceArray[2]!="")
								this.setValue(deviceArray[2]);
						}
					}
				},{
					xtype: 'numberfield',
					hideTrigger: 'true',
					fieldLabel:'Device IMEI',
					blankText:'Please enter the Device IMEI no.',
					allowBlank:false,
					id:'deviceIMEI',
					anchor: '100%',
					name:'deviceIMEI',
					listeners:{
						afterrender:function(){
							if(deviceArray[9]!="")
								this.setValue(deviceArray[9]);
						}
					}
				},{
					xtype: 'textfield',
					fieldLabel:'Model',
					id:'model',
					name:'model',
					anchor: '100%',
					allowBlank:false,
					blankText:'Please enter the Model No',
					listeners:{
						afterrender:function(){
							if(deviceArray[3]!="")
								this.setValue(deviceArray[3]);
						}
					}
				},{
					xtype: 'textfield',
					fieldLabel:'Model Details',
					id:'modeldetails',
					name:'modeldetails',
					anchor: '100%',
					blankText:'Please enter the Model Details',
					listeners:{
						afterrender:function(){
							if(deviceArray[4]!="")
								this.setValue(deviceArray[4]);
						}
					}
				},{
					xtype: 'numberfield',
					hideTrigger: 'true',
					fieldLabel:'Vendor',
					id:'vendorid',
					anchor: '100%',
					name:'vendorid',
					listeners:{
						afterrender:function(){
							if(deviceArray[5]!="")
								this.setValue(deviceArray[5]);
						}
					}
				},{
					xtype: 'numberfield',
					hideTrigger:'true',
					fieldLabel:'Invoice ID',
					id:'invoiceid',
					blankText: 'Please enter the invoice ID',
					anchor: '100%',
					name:'invoiceid',
					allowBlank:false,
					listeners:{
						afterrender:function(){
							if(deviceArray[7]!="")
								this.setValue(deviceArray[7]);
						}
					}
				},{
					xtype: 'datefield',
					fieldLabel:'Purchased on',
					name:'purchasedon',
					id:'purchasedon',
					width: 300,
					Padding: '5',
					format: 'd-m-Y',
					altFormat:'d/m/Y|d.m.Y',
					allowBlank:false,
					blankText:'Please select the Purchased date',
					listeners:{
						afterrender:function(){
							if(deviceArray[6]!="")
								this.setValue(deviceArray[6]);
						}
					}
				},/* {			
					xtype: 'combo',
					fieldLabel:'Product By',
					store: DeviceTechniciansStore,
					displayField: 'technicianname',
					valueField: 'technicianid',
					queyrMode:'local',
					emptyText:'Select Technician...',
					tabIndex:1,
					name: 'technicianid',
					id:'technicianid',
					hiddenName: 'technicianid_Hid',
					anchor:'100%',
					triggerAction: 'all',
					allowBlank: false,
					forceSelection: true,
					editable:false,
					selectOnFocus:true,
					listeners:{
						afterrender: function(){
							DeviceTechniciansStore.load({
								callback: function() {
									if(deviceArray[8]!="")
										Ext.getCmp("technicianid").setValue(deviceArray[8]); //0);
								}
							});
						}
					}
				}, */{
					xtype: 'combo',
					fieldLabel: 'Status',
					grow:false,
					id:'status',
					name:'status',
					blankText:'Please select the Status',
					allowBlank:false,
					width: 300,
					store: statusStore,
					queryMode: 'local',
					displayField: 'alice',
					valueField: 'sstatus',
					editable:false,
					listeners:{
						afterrender:function(){
							if(deviceArray[10]!="")
								this.setValue(deviceArray[10]);
						}
					}
				},{
					xtype: 'datefield',
					fieldLabel:'Installed ON',
					id:'installedon',
					width: 300,
					format: 'd-m-Y',
					altFormat:'d/m/Y|d.m.Y',
					name:'installedon',
					blankText:'Please select the Installed date',
					listeners:{
						afterrender:function(){
							if(deviceArray[12]!="")
								this.setValue(deviceArray[12]);
						}
					}
				}
			]
		},{
			xtype:'container',
			columnWidth: 0.5,
			//title: 'Fieldset 1',
			height: 250,
			collapsible: true,
			id:'fieldtwo',
			layout: {
				type:'anchor',
				anchor: '100%'
			},
			items: [{
				xtype: 'combo',
				fieldLabel:'Installed By',
				store: DeviceTechniciansStore,
				displayField: 'ins_technicianname',
				valueField: 'ins_technicianid',
				queyrMode:'local',
				emptyText:'Select Technician...',
				blankText:'Please select the Technician',
				width: 300,
				name: 'ins_technicianid',
				id:'ins_technicianid',
				hiddenName: 'install_technicianid_Hid',
				triggerAction: 'all',
				allowBlank: false,
				forceSelection: true,
				editable:true,
				selectOnFocus:true,
				listeners:{
					afterrender: function(){
						DeviceTechniciansStore.load({
							callback: function() {
								if(deviceArray[13]!="")
									Ext.getCmp("ins_technicianid").setValue(deviceArray[13]); //0);
							}
						});
					}
				}
			 },{
				xtype: 'combo',
				fieldLabel:'Checked By',
				//id:'checkedby',
				//flex:0,
				store: DeviceTechniciansStore,
				displayField: 'che_technicianname',
				valueField: 'che_technicianid',
				queyrMode:'local',
				emptyText:'Select Technician...',
				blankText:'Please select the Technician',
				tabIndex:1,
				name: 'che_technicianid',
				id:'che_technicianid',
				hiddenName: 'check_technicianid_Hid',
				width: 300,
				triggerAction: 'all',
				allowBlank: false,
				forceSelection: true,
				editable:true,
				selectOnFocus:true,
				listeners:{
					afterrender: function(){
						DeviceTechniciansStore.load({
							callback: function() {
								if(deviceArray[14]!="")
									Ext.getCmp("che_technicianid").setValue(deviceArray[14]); //0);
							}
						});
					}
				}
			 },{
					xtype: 'datefield',
					fieldLabel:'Activated ON',
					id:'activatedon',
					width: 300,
					format: 'd-m-Y',
					altFormat:'d/m/Y|d.m.Y',
					name:'activatedon',
					blankText:'Please select the Activated date',
					listeners:{
						afterrender:function(){
							if(deviceArray[23]!="")
								this.setValue(deviceArray[23]);
						}
					}
			},{
				xtype: 'combo',
				fieldLabel:'Tracking By',
				store: DeviceTechniciansStore,
				displayField: 'tra_technicianname',
				valueField: 'tra_technicianid',
				queyrMode:'local',
				emptyText:'Select Technician...',
				blankText:'Please select the Technician',
				tabIndex:1,
				name: 'tra_technicianid',
				id:'tra_technicianid',
				hiddenName: 'track_technicianid_Hid',
				width: 300,
				triggerAction: 'all',
				allowBlank: false,
				forceSelection: true,
				editable:true,
				selectOnFocus:true,
				listeners:{
					afterrender: function(){
						DeviceTechniciansStore.load({
							callback: function() {
								if(deviceArray[15]!="")
									Ext.getCmp("tra_technicianid").setValue(deviceArray[15]); //0);
							}
						});
					}
				}
			 },{
				xtype: 'datefield',
				fieldLabel:'Scraped ON',
				id:'scrapedon',
				name:'scrapedon',
				width: 300,
				format: 'd-m-Y',
				altFormat:'d/m/Y|d.m.Y',
				blankText:'Please select the Scraped date',
				listeners:{
					afterrender:function(){
						if(deviceArray[16]!="")
							this.setValue(deviceArray[16]);
					}
				}						
			 },{
				xtype: 'textfield',
				fieldLabel:'Scrap Details',
				id:'scrapdetails',
				name:'scrapdetails',
				anchor: '100%',
				listeners:{
					afterrender:function(){
						if(deviceArray[17]!="")
							this.setValue(deviceArray[17]);
					}
				}
			 },{
				xtype: 'textfield',
				fieldLabel:'Sim Card No',
				anchor: '100%',
				id:'simcardno',
				name:'simcardno',
				listeners:{
					afterrender:function(){
						if(deviceArray[18]!="")
							this.setValue(deviceArray[18]);
					}
				}
			 },{
				xtype: 'textfield',
				fieldLabel:'Sim Serial No',
				anchor: '100%',
				id:'simserialno',
				name:'simserialno',
				listeners:{
					afterrender:function(){
						if(deviceArray[19]!="")
							this.setValue(deviceArray[19]);
					}
				}
			 },{
				xtype: 'textfield',
				fieldLabel:'Sim Provider',
				anchor: '100%',
				id:'simprovider',
				name:'simprovider',
				listeners:{
					afterrender:function(){
						if(deviceArray[20]!="")
							this.setValue(deviceArray[20]);
					}
				}
			 },{
				xtype: 'textfield',
				fieldLabel:'GPRS Plan',
				anchor: '100%',
				id:'gprsplan',
				name:'gprsplan',
				listeners:{
					afterrender:function(){
						if(deviceArray[21]!="")
							this.setValue(deviceArray[21]);
					}
				}
			 },{
				xtype: 'textfield',
				fieldLabel:'GPRS Settings',
				anchor: '100%',
				id:'gprssettings',
				name:'gprssettings',
				listeners:{
					afterrender:function(){
						if(deviceArray[22]!="")
							this.setValue(deviceArray[22]);
					}
				}
			 }
			]
		}]
	}

	var deviceWin = Ext.create('Ext.Window', {
		title: deviceArray['todo']=="Add_Device"?"Add Device":"Edit Device",
		width:900,
		height:400,
		plain: true,
		modal:true,
		closable:true,
		border: false,
		layout: {
			type: 'fit'
		},
		items: [deviceform],
		buttons: [{
			text: deviceArray['todo']=="Add_Device"?'Add':'Update',
			handler:function(){
				var formPanel = Ext.getCmp('deviceform').getForm();
				if(formPanel.isValid()){
					formPanel.submit({
						//clientValidation: true,
						url: 'includes/mng_devices_ajx.php',
						params: {
							todo: deviceArray['todo'], deviceid:deviceArray['deviceid']
						},
						success: function(form, action) {
							Ext.Msg.alert('Success', action.result.msg);
							deviceWin.destroy();
							Ext.getCmp('SAdminPanelDevicesGrid').getStore().load({params:{start:0, limit:30}});
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
			text: 'Reset',
			hidden:deviceArray['todo']=="Add_Device"?false:true,
			handler: function() {
				Ext.getCmp('deviceform').getForm().reset();

			}
		 },{
			text: 'Close',
			handler: function() {
				deviceWin.destroy();
			}
		 }
		]
    }).show();
	Ext.getCmp('devicename').focus(true,1000);
}

function delete_device(gridRec){
	var deviceid 	= gridRec[0].get("deviceid");
	var devicename	= gridRec[0].get("devicename");
	Ext.MessageBox.show({
		title:'Confirm Delete?',
		msg: 'Are you sure to delete device <b>[ '+devicename+' ]</b> ?<br><br><span class="tableTextM">Note:- All the Tracking history will be deleted permanently. This action cannot be undone</span>',
		buttons: Ext.MessageBox.YESNO,
		fn: function(btn, text){
			if(btn=="yes"){
				Ext.Ajax.request({
					url: 'includes/mng_devices_ajx.php',
					timeout: 1200000,
					params: {
						todo:'Delete_Device',
						deviceid : deviceid,
						devicename :devicename
					},
					success: function(response){
						response = Ext.decode(response.responseText);
						if(response.success){
							Ext.MessageBox.show({
								title:'SUCCESS',
								msg: response.msg,
								buttons: Ext.MessageBox.OK
							});
							Ext.getCmp("SAdminPanelDevicesGrid").getStore().loadPage(1);
						}else{
							Ext.MessageBox.show({
								title:'ERROR',
								msg: response.msg,
								buttons: Ext.MessageBox.OK
							});
						}
					}
				});
			}
		},
	   icon: Ext.MessageBox.CONFIRM
	});
}