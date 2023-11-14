function showVehicle(){

	if(Ext.getCmp("SAdminPanelVehicleGrid")){
		Ext.getCmp("cpanelDashboard").setActiveTab("SAdminPanelVehicleGrid");
		return false;
	}
	
	Ext.define('vehicleData', {
        extend: 'Ext.data.Model',
		fields: [
		   	{name: 'vehicleid',mapping: 'vehicleid',type:'int'},
			{name: 'customerid',mapping: 'customerid',type:'int'},
            		{name: 'customername',mapping: 'customername',type:'string'},
			{name: 'deviceid',mapping: 'deviceid',type:'int'},
			{name: 'devicename',mapping: 'devicename', type: 'string'},
         		{name: 'driverid',mapping: 'driverid', type: 'string'},
			{name: 'drivername',mapping: 'drivername', type: 'string'},
            		{name: 'vehiclename',mapping: 'vehiclename', type: 'string'},
            		{name: 'model',mapping: 'model', type: 'string'},
           		{name: 'regnno',mapping: 'regnno', type: 'string'},
			{name: 'insurancedate',mapping: 'insurancedate', type: 'string'},
			{name: 'fcdate',mapping: 'fcdate', type: 'string'},
			{name: 'servicedue',mapping: 'servicedue', type: 'string'},
			{name: 'engineno',mapping: 'engineno', type: 'string'},
			{name: 'chassisno',mapping: 'chassisno', type: 'string'},
          		{name: 'fuel_capacity',mapping: 'fuel_capacity', type: 'string'},
			{name: 'speedlimit',mapping: 'speedlimit', type: 'string'},
			{name: 'totalspeed',mapping: 'totalspeed', type: 'int'},
			{name: 'ignition',mapping: 'ignition', type: 'int'},
			{name: 'fuelstatus',mapping: 'fuelstatus', type: 'int'},
			{name: 'vehiclestatus',mapping: 'vehiclestatus', type: 'string'}
            ],
        idCustomer: 'vehicleid'
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
            url: './includes/vehicle_ajx.php',
            extraParams: {
				todo : 'Get_Vehicle_List'
            },
            reader: {
				type: 'json',
                root: 'CUSTOMERSS',
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
		{text: "Vehicle Name", dataIndex: 'vehiclename', flex: 1, sortable: true},
		{text: "Customer Name", dataIndex: 'customername', flex: 1, sortable: true},
		{text: "Customer Id", dataIndex: 'customerid',hidden:true, sortable: true},
		{text: "Device Name", dataIndex: 'devicename', flex: 1, sortable: true},
		{text: "Device Id", dataIndex: 'deviceid',hidden:true, sortable: true},
		{text: "Driver name", dataIndex: 'drivername', flex: 1, sortable: true},
		{text: "Driver Id", dataIndex: 'driverid',hidden:true, sortable: true},		
		{text: "Model", dataIndex: 'model', width:80, sortable: true},
		{text: "Reg. No", dataIndex: 'regnno',  width:80, sortable: true},
		{text: "Status", dataIndex: 'vehiclestatus',  width:60, sortable: true}
	];

    var loadTabPanel = Ext.getCmp('SAdminPanelVehicle');
	
	Ext.define('CustomerNamesStore_filter', {
        extend: 'Ext.data.Model',
		fields: [
			{name: 'veh_fltr_customerid',mapping: 'customerid',type:'int'},
			{name: 'veh_fltr_customername',mapping: 'customername', type: 'string'}
        ]
	});

	var VehicleCustomersStore_filter = new Ext.data.Store({
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
	
    loadTabPanel.add({
			id:'SAdminPanelVehicleGrid',
			//title:'Customers',
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
					'selectionchange':function(selmod, record, opt){
						if(record[0].get("vehicleid")!=0){
							Ext.getCmp("gridEditButton_vehicle").enable();
							Ext.getCmp("gridDelButton_vehicle").enable();
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
				labelWidth:60,
				width:250,
				store: VehicleCustomersStore_filter,
				displayField: 'veh_fltr_customername',
				valueField: 'veh_fltr_customerid',
				queryMode:'local',
				emptyText:'Select Customer...',
				name: 'veh_fltr_customerid',
				id:'veh_fltr_customerid',
				triggerAction: 'all',
				forceSelection: true,
				allowBlank:false,
				blankText:'Please select the Customer Name',
				selectOnFocus:true,
				listeners:{
					afterrender: function(){
						VehicleCustomersStore_filter.load({
						});
					},
					select:function(){
						var veh_customerid = Ext.getCmp("veh_fltr_customerid").getValue();
						var veh_filtertext = Ext.getCmp("veh_filterid").getRawValue();
						VehicleStore.baseParams = {customerid:veh_customerid,filtertext:veh_filtertext, start:0, limit:30};
						VehicleStore.load({params:{customerid:veh_customerid,filtertext:veh_filtertext, start:0, limit:30}});
					} 
				}		
			},new Ext.ux.form.SearchField({
				width:290,
				fieldLabel:'Search',
				emptyText:'Vehiclename/Devicename/Reg.No',
				labelWidth:50,
				id:'veh_filterid',
				onTrigger2Click:function(){
					var veh_filtertext = Ext.getCmp("veh_filterid").getRawValue();
					var veh_customerid = Ext.getCmp("veh_fltr_customerid").getValue();
					VehicleStore.baseParams = {customerid:veh_customerid,filtertext:veh_filtertext, start:0, limit:30};
					VehicleStore.load({params:{customerid:veh_customerid,filtertext:veh_filtertext, start:0, limit:30}});
				}
			}),'->',	
			{
				xtype:'buttongroup',
				items: [{
					text: 'Add Vehicle',
					scale: 'small',
					handler:function(){
					
						var vehicleArray 			= new Array();
						vehicleArray["todo"]		= "Add_Vehicle";
						vehicleArray["titleStr"]	= "Add Vehicle";
						vehicleArray['vehicleid'] = 0;

						for(var i=0;i<=15;i++){
							vehicleArray[i]="";
						}
						add_edit_vehicle(vehicleArray);
					}
				}]
			},{
				xtype:'buttongroup',
				items: [{
					text: 'Edit Vehicle',
					scale: 'small',
					id:'gridEditButton_vehicle',
					disabled:true,
					handler:function(){
						var gridRec	= Ext.getCmp("SAdminPanelVehicleGrid").getSelectionModel().getSelection();
						if(gridRec.length>0){
							var vehicleArray 			= new Array();
							vehicleArray["todo"]		= "Edit_Vehicle";
							vehicleArray["titleStr"]	= "Edit Vehicle";
							vehicleArray['vehicleid'] 	= gridRec[0].get("vehicleid");
							vehicleArray[0]		= gridRec[0].get("customerid");
							vehicleArray[1]		= gridRec[0].get("deviceid");
							vehicleArray[2]		= gridRec[0].get("driverid");
							vehicleArray[3]		= gridRec[0].get("vehiclename");
							vehicleArray[4]		= gridRec[0].get("model");
							vehicleArray[5]		= gridRec[0].get("regnno");
							vehicleArray[6]		= gridRec[0].get("insurancedate");
							vehicleArray[7]		= gridRec[0].get("fcdate");
							vehicleArray[8]		= gridRec[0].get("servicedue");
							vehicleArray[9]		= gridRec[0].get("engineno");
							vehicleArray[10]	= gridRec[0].get("chassisno");
							vehicleArray[11]	= gridRec[0].get("fuel_capacity");
							vehicleArray[12]	= gridRec[0].get("speedlimit");
							vehicleArray[13]	= gridRec[0].get("totalspeed");
							vehicleArray[14]	= gridRec[0].get("ignition");
							vehicleArray[15]	= gridRec[0].get("fuelstatus");
							add_edit_vehicle(vehicleArray);
						}
					}
				}]
			},{
				xtype:'buttongroup',
				items: [{
					text: 'Delete Vehicle',
					scale: 'small',
					id:'gridDelButton_vehicle',
					disabled:true,
					handler:function(){
						var gridRec	= Ext.getCmp("SAdminPanelVehicleGrid").getSelectionModel().getSelection();
						if(gridRec.length>0){
							delete_vehicle(gridRec);
						}
					}
				}]
			}],
			columns: VehicleCol,
			plugins: [{
				ptype: 'rowexpander',
				rowBodyTpl : [
					'<p><b>Fuel Capacity:</b> {fuel_capacity}</p>',
					'<p><b>Total Speed:</b> {totalspeed}</p>',
					'<p><b>Speedlimit:</b> {speedlimit}</p>',
					'<p><b>Enginee No:</b> {engineno}</p>',
					 '<p><b>Chassis No:</b> {chassisno}</p>',
					'<p><b>Insurance Date:</b> {insurancedate}</p>',
					 '<p><b>FC Date:</b> {fcdate}</p>',
					'<p><b>Due Date:</b> {servicedue}</p>',
				]
			}],
			border:false,
			collapsible: false,
			animCollapse: false,
			stripeRows: true,
			dockedItems: [{
				xtype: 'pagingtoolbar',
				id:'SAdminPanelVehicleGridPbar',
				store: VehicleStore,
				dock: 'bottom',
				pageSize: 30,
				displayInfo: true
			}]
    }).show();
    loadTabPanel.doLayout();
    //loadTabPanel.setActiveTab(Ext.getCmp("attendGrid"));
    VehicleStore.load({params:{start:0, limit:30}});

}

function add_edit_vehicle(vehicleArray){

	Ext.define('CustomerNamesStore_combo', {
        extend: 'Ext.data.Model',
		fields: [
			{name: 'customerid',mapping: 'customerid',type:'int'},
			{name: 'customername',mapping: 'customername', type: 'string'}
        ]
	});
	var VehicleCustomersStore_combo = new Ext.data.Store({
		model: 'CustomerNamesStore_combo',
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
	
	Ext.define('DeviceNamesStore_combo', {
        extend: 'Ext.data.Model',
		fields: [
		    {name: 'deviceid',mapping: 'deviceid',type:'int'},
			{name: 'devicename',mapping: 'devicename', type: 'string'}
		]
		//,idCustomer: 'customerid'
	});
	var VehicleDeviceStore_combo = new Ext.data.Store({
		model: 'DeviceNamesStore_combo',
		proxy: {
			type: 'ajax',
			url: 'includes/combo_ajx.php',
			actionMethods: {
				read: 'POST'
			},
			extraParams: {
				todo : 'Get_Devices_List_Vehicle',
				//customerid : 'customerid'
				
			},
			reader: {
				type: 'json',
				root: 'DEVICES_T'
			}
		}
	});
	
	Ext.define('DriverNamesStore_combo', {
        extend: 'Ext.data.Model',
			fields: [
				{name: 'driverid',mapping: 'driverid',type:'int'},
				{name: 'drivername',mapping: 'drivername', type: 'string'}
		    ]
		});
	var VehicleDriverStore_combo = new Ext.data.Store({
		model: 'DriverNamesStore_combo',
		proxy: {
			type: 'ajax',
			url: 'includes/combo_ajx.php',
			actionMethods: {
				read: 'POST'
			},
            extraParams: {
				todo : 'Get_Drivers_List',
				//customerid : 'customerid'
				
            },
			reader: {
				type: 'json',
				root: 'DRIVERS'
			}
		}
	});
	var vehicleform = {
		xtype:'form',
		id:'vehicleform',
		name:'vehicleform',
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
		defaultType: 'textfield',
		items: [
			{
				xtype: 'container',
				columnWidth: 0.5,
				border:false,
				style:'padding-left:5px;padding-right:15px',
				layout:{
					type:'anchor',
					anchor:'100%'
				},
				items: [
					{
						xtype: 'textfield',
						fieldLabel:'Vehicle Name',
						id:'vehiclename',
						name:'vehiclename',
						allowBlank:false,
						blankText:'Please enter the Vehicle Name ',
						listeners:{
							afterrender:function(){
								if(vehicleArray[3]!="")
									this.setValue(vehicleArray[3]);
							}
						}
					},{
						xtype:'combo',
						fieldLabel:'Customer',
						store: VehicleCustomersStore_combo,
						displayField: 'customername',
						valueField: 'customerid',
						queryMode:'local',
						emptyText:'Select Customer...',
						name: 'customerid',
						id:'customerid',
						triggerAction: 'all',
						forceSelection: true,
						allowBlank:false,
						blankText:'Please select the Customer Name',
						selectOnFocus:true,
						listeners:{
							afterrender: function(){
								VehicleCustomersStore_combo.load({
									callback: function() {
										if(vehicleArray[0]!="")
											Ext.getCmp("customerid").setValue(vehicleArray[0]); //0);
									}
								});
							},
							
							//combobox select using ajax function
							select:function(){
						        var customerid = Ext.getCmp("customerid").getValue();
								VehicleDeviceStore_combo.load({
								    params:{
										customerid_add : customerid
								    },	
									callback: function() {
									    
								    }
								});
								VehicleDriverStore_combo.load({
								    params:{
								        customerid : customerid,
								    },
									callback: function() {
										
									}
								    
							    });
						    }
						}
					},{
						xtype:'combo',
						fieldLabel:'Device',
						store: VehicleDeviceStore_combo,
						displayField: 'devicename',
						valueField: 'deviceid',
						queryMode:'local',
						emptyText:'Select Device...',
						allowBlank:false,
						name: 'deviceid',
						id:'deviceid',
						triggerAction: 'all',
						selectOnFocus:true,
						forceSelection: true,
						blankText:'Please select the Device',
						listeners:{
							afterrender: function(){
								if(vehicleArray[0]!="")
								{
									VehicleDeviceStore_combo.load({
									params:{
											customerid_edit : vehicleArray[0],
										},
										callback: function() {
											Ext.getCmp("deviceid").setValue(vehicleArray[1]); //0);
										}
									});
								}
							}
						} 
					},{
						xtype:'combo',
						fieldLabel:'Driver',
						store: VehicleDriverStore_combo,
						displayField: 'drivername',
						valueField: 'driverid',
						queryMode:'local',
						emptyText:'Select Driver...',
						name: 'driverid',
						id:'driverid',
						triggerAction: 'all',
						selectOnFocus:true,
						forceSelection: true,
						bblankText:'Please select the Driver',
						 listeners:{
							afterrender: function(){
								if(vehicleArray[0]!=""){
									VehicleDriverStore_combo.load({
										params:{
											customerid : vehicleArray[0],
										},
										callback: function() {
											Ext.getCmp("driverid").setValue(vehicleArray[2]); //0);
										}
									});
								}
							}
						} 
					},{
						xtype: 'textfield',
						fieldLabel:'Model',
						id:'model',
						name:'model',
						blankText:'Please enter the Model ',
						listeners:{
							afterrender:function(){
								if(vehicleArray[4]!="")
									this.setValue(vehicleArray[4]);
							}
						}
					},{
						xtype: 'textfield',
						fieldLabel:'Registration No',
						id:'regnno',
						name:'regnno',
						allowBlank:false,
						blankText:'Please enter the Reg. No ',
						listeners:{
							afterrender:function(){
								if(vehicleArray[5]!="")
									this.setValue(vehicleArray[5]);
							}
						}
					},
				    {
						xtype: 'textfield',
						fieldLabel:'Engine No',
						id:'engineno',
						name:'engineno',
						blankText:'Please enter the Engine No ',
						listeners:{
							afterrender:function(){
								if(vehicleArray[9]!="")
									this.setValue(vehicleArray[9]);
							}
						}
					}
				]
			},
			{
				xtype: 'container',
				columnWidth: 0.5,
				layout:{
					type:'anchor'
				},
				items: [
					{
						xtype: 'textfield',
						fieldLabel:'Chassis No',
						id:'chassisno',
						name:'chassisno',
						blankText:'Please enter the Chassis No ',
						listeners:{
							afterrender:function(){
								if(vehicleArray[10]!="")
									this.setValue(vehicleArray[10]);
							}
						}
					}, 
					{
					    xtype: 'datefield',
						fieldLabel:'Insurancedate',
						name:'insurancedate',
						id:'insurancedate',
						format: 'd-m-Y',
						altFormat:'d/m/Y|d.m.Y',
						blankText:'Please select the Insurance Date',
						listeners:{
							afterrender:function(){
								if(vehicleArray[6]!="")
									this.setValue(vehicleArray[6]);
							}
						}
					},{
					    xtype: 'datefield',
						fieldLabel:'FC Date',
						name:'fcdate',
						id:'fcdate',
						format: 'd-m-Y',
						altFormat:'d/m/Y|d.m.Y',
						blankText:'Please select the Fc Date',
						listeners:{
							afterrender:function(){
								if(vehicleArray[7]!="")
									this.setValue(vehicleArray[7]);
							}
						}
					},{
					    xtype: 'datefield',
						fieldLabel:'Due Date',
						name:'servicedue',
						id:'servicedue',
						format: 'd-m-Y',
						altFormat:'d/m/Y|d.m.Y',
						blankText:'Please select the Service Date',
						listeners:{
							afterrender:function(){
								if(vehicleArray[8]!="")
									this.setValue(vehicleArray[8]);
							}
						}
					},{
						xtype: 'numberfield',
						hideTrigger: 'true',
						minLength:1,
						maxLength:5,
						fieldLabel:'Fuel Capacity',
						id:'fuel_capacity',
						name:'fuel_capacity',
						allowBlank:false,
						blankText:'Please enter the Fuel Capacity ',
						listeners:{
							afterrender:function(){
								if(vehicleArray[11]!="")
									this.setValue(vehicleArray[11]);
							}
						}
					},{
						xtype: 'numberfield',
						hideTrigger: 'true',
						minLength:1,
						maxLength:5,
						fieldLabel:'Total Speed',
						id:'totalspeed',
						name:'totalspeed',
						allowBlank:false,
						blankText:'Please enter the Total Speed',
						listeners:{
							afterrender:function(){
								if(vehicleArray[13]!="")
									this.setValue(vehicleArray[13]);
							}
						}
					},{
						xtype: 'numberfield',
						hideTrigger: 'true',
						minLength:1,
						maxLength:5,
						fieldLabel:'Speed Limit',
						id:'speedlimit',
						name:'speedlimit',
						allowBlank:false,
						blankText:'Please enter the Speed Limit',
						listeners:{
							afterrender:function(){
								if(vehicleArray[12]!="")
									this.setValue(vehicleArray[12]);
							}
						}
					},{
						xtype      : 'fieldcontainer',
						fieldLabel : 'Ignition Connected',
						defaultType: 'radiofield',
						defaults: {
							flex: 5
						},
						layout: 'hbox',
						items: [
							{
								boxLabel  : 'On',
								name      : 'ignition',
								inputValue: '1',
								id        : 'radio1'
								
								
							}, {
								boxLabel  : 'Off',
								name      : 'ignition',
								inputValue: '0',
								id        : 'radio2',
								checked:true
								
							}
						],
						listeners: {
						    afterrender:function(){
								if(vehicleArray[14]==1)
								{
								Ext.getCmp("radio1").setValue(true);
								}
								//this.setValue(true);
							}
					    }
					},{
						xtype      : 'fieldcontainer',
						fieldLabel : 'Fuel Status',
						defaultType: 'radiofield',
						defaults: {
							flex: 5
						},
						layout: 'hbox',
						items: [
							{
								boxLabel  : 'On',
								name      : 'fuelstatus',
								inputValue: '1',
								id        : 'radio3'
								
							}, {
								boxLabel  : 'Off',
								name      : 'fuelstatus',
								inputValue: '0',
								id        : 'radio4',
								checked:true
								
							}
						],
						listeners: {
						    afterrender:function(){
								if(vehicleArray[15]==1)
								{
								Ext.getCmp("radio3").setValue(true);
								}
								//this.setValue(true);
							}
					    }
					}
				]
				
			}
		]
}

var vehicleWin = Ext.create('Ext.Window', {
	title: vehicleArray['todo']=="Add_Vehicle"?"Add Vehicle":"Edit Vehicle",
	width:640,
	height:350,
	plain: true,
	modal:true,
	resizable:false,
	border: false,
	layout: {
		type: 'fit'
	},
	items: [vehicleform],
	buttons: [{
		text: vehicleArray['todo']=="Add_Vehicle"?'Add':'Update',
		handler:function(){
			var formPanel = Ext.getCmp('vehicleform').getForm();
			if(formPanel.isValid()){
				formPanel.submit({
					clientValidation: true,
					url: 'includes/vehicle_ajx.php',
					params: {
						todo: vehicleArray['todo'], vehicleid:vehicleArray['vehicleid']
					},
					success: function(form, action) {
						Ext.Msg.alert('Success', action.result.msg);
						vehicleWin.destroy();
						Ext.getCmp("SAdminPanelVehicleGrid").getStore().loadPage(1);
					    VehicleStore.load({params:{start:0, limit:30}});
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
			 Ext.getCmp("SAdminPanelVehicleGrid").getStore().loadPage(1);
		}
	},{
		text: 'Reset',
		hidden:vehicleArray['todo']=="Add_Vehicle"?false:true,
		handler: function() {
			Ext.getCmp('vehicleform').getForm().reset();
		}
	},{
		text: 'Close',
		handler: function() {
			vehicleWin.destroy();
		}
	}]
    }).show();
	Ext.getCmp('vehiclename').focus(true,1000);
}

//delete the Vehicle
function delete_vehicle(gridRec){
	var vehicleid 	= gridRec[0].get("vehicleid");	
	var vehiclename	= gridRec[0].get("vehiclename");
	Ext.MessageBox.show({
		title:'Confirm Delete?',
		msg: 'Are you sure to delete This Vehicle <b>[ '+vehiclename+' ]</b> ',
		buttons: Ext.MessageBox.YESNO,
		fn: function(btn, text){
			if(btn=="yes"){
				Ext.Ajax.request({
					url: 'includes/vehicle_ajx.php',
					timeout: 1200000,
					params: {
						todo:'Delete_Vehicle',
						vehicleid : vehicleid,
						vehiclename :vehiclename
					},
					success: function(response){
						response = Ext.decode(response.responseText);
						if(response.success){
							Ext.MessageBox.show({
								title:'SUCCESS',
								msg: response.msg,
								buttons:Ext.MessageBox.OK
							});
							Ext.getCmp("SAdminPanelVehicleGrid").getStore().loadPage(1);
						}else{
							Ext.MessageBox.show({
								title:'ERROR',
								msg: response.msg,
								buttons:Ext.MessageBox.OK
							});
						}
					}
				});
			}
			Ext.getCmp("SAdminPanelVehicleGrid").getStore().loadPage(1);
		},
	   icon: Ext.MessageBox.CONFIRM
	});
}

//Status Change the Vehicle
function status_vehicle(vehicleid, vehiclestatus){
	Ext.MessageBox.show({
		title:'Confirmatoin',
		msg: '<b>Are you sure to <b>[ '+vehiclestatus+' ]</b> this Vehicle?',
		buttons: Ext.MessageBox.YESNO,
		fn: function(btn, text){
			if(btn=="yes"){
				Ext.Ajax.request({
					url: 'includes/vehicle_ajx.php',
					timeout: 1200000,
					params: {
						todo:'Status_Vehicle',
						vehicleid   : vehicleid,
						vehiclestatus:vehiclestatus
					},
					success: function(response){
						response = Ext.decode(response.responseText);
						if(response.success){
							Ext.MessageBox.show({
								title:'SUCCESS',
								msg: response.msg,
								buttons:Ext.MessageBox.OK
							});
							Ext.getCmp("SAdminPanelVehicleGrid").getStore().loadPage(1);
						}else{
							Ext.MessageBox.show({
								title:'ERROR',
								msg: response.msg,
								buttons:Ext.MessageBox.OK
							});
						}
					}
				});
			}
			
			Ext.getCmp("SAdminPanelVehicleGrid").getStore().loadPage(1);
			
		},
		icon: Ext.MessageBox.CONFIRM
	});

}
//Unassign the Device
function unassign_vehicle(vehicleid){
	Ext.MessageBox.show({
		title:'Are you sure to Remove the Device from this Vehicle?',
		msg: '<b><span class=""> If the device is removed, History will be deleted permanantly and this vehicle cannot be tracked.</span>',		buttons: Ext.MessageBox.YESNO,
		fn: function(btn, text){
			if(btn=="yes"){
				Ext.Ajax.request({
					url: 'includes/vehicle_ajx.php',
					timeout: 1200000,
					params: {
						todo:'Unassign_Vehicle',
						vehicleid   : vehicleid
					},
					success: function(response){
						response = Ext.decode(response.responseText);
						if(response.success){
							Ext.MessageBox.show({
								title:'SUCCESS',
								msg: response.msg,
								buttons:Ext.MessageBox.OK
								
							});
							Ext.getCmp("SAdminPanelVehicleGrid").getStore().loadPage(1);
						}else{
							Ext.MessageBox.show({
								title:'ERROR',
								msg: response.msg,
								buttons:Ext.MessageBox.OK
							});
						}
					}
				});
			}
			Ext.getCmp("SAdminPanelVehicleGrid").getStore().loadPage(1);
		},
		icon: Ext.MessageBox.CONFIRM
	});
}


