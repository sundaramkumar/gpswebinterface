function showServices(){
	if(Ext.getCmp("SAdminPanelServicesGrid")){
		Ext.getCmp("cpanelDashboard").setActiveTab("SAdminPanelServicesGrid");
		return false;
	}

	Ext.define('serviceData', {
        extend: 'Ext.data.Model',
		fields: [
			{name: 'serviceid',mapping: 'serviceid',type:'int'},
			{name: 'customerid',mapping: 'customerid',type:'int'},
			{name: 'customername',mapping: 'customername',type:'string'},
			{name: 'basic',mapping: 'basic', type: 'string'},
			{name: 'standard',mapping: 'standard', type: 'string'},
			{name: 'premium',mapping: 'premium', type: 'string'},
			{name: 'stolen_vehicle_locator',mapping: 'stolen_vehicle_locator', type: 'int'},
			{name: 'live_stolen_vehicle_tracking',mapping: 'live_stolen_vehicle_tracking',type:'int'},
			{name: 'customer_web_access',mapping: 'customer_web_access',type:'int'},
			{name: 'online_tracking',mapping: 'online_tracking',type:'int'},
			{name: 'history_tracking',mapping: 'history_tracking',type:'int'},
			{name: 'arrival_departure',mapping: 'arrival_departure',type:'int'},
			{name: 'over_speed',mapping: 'over_speed',type:'int'},
			{name: 'ignition_status',mapping: 'ignition_status',type:'int'},
			{name: 'door_status',mapping: 'door_status',type:'int'},
			{name: 'panic_button',mapping: 'panic_button',type:'int'},
			{name: 'alerts',mapping: 'alerts',type:'int'},
			{name: 'trip_area',mapping: 'trip_area',type:'int'},
			{name: 'fuel_guage_data',mapping: 'fuel_guage_data',type:'int'},
			{name: 'softcopy_report',mapping: 'softcopy_report',type:'int'},
			{name: 'upgradable',mapping: 'upgradable',type:'int'},
			{name: 'transfarable_features',mapping: 'transfarable_features',type:'int'},
			{name: 'online_tracking_limit',mapping: 'online_tracking_limit',type:'int'},
			{name: 'history_tracking_limit',mapping: 'history_tracking_limit',type:'int'}
			
			
			//{name: 'addedby',mapping: 'addedby', type: 'string'}
			/* ,
			{name: 'password',mapping: 'password', type: 'string'} */
            ],
        idUser: 'serviceid'
    });

    // create the Data Store
    var ServicesStore = Ext.create('Ext.data.JsonStore', {
        id: 'ServicesStore',
        pageSize: 30,
        model: 'serviceData',
        remoteSort: false,
        proxy: {
            type: 'ajax',
			actionMethods: {
				read: 'POST'
			},
            url: './includes/services_ajx.php',
            extraParams: {
				todo : 'Get_Services_List'
            },
            reader: {
				type: 'json',
                root: 'CUSTOMERS_S',
                totalProperty: 'totalCount'
            },
            // sends single sort as multi parameter
            simpleSortMode: true
        }/* ,
        sorters: [{
            property: 'customername',
            direction: 'ASC'
        }] */
    });
	
		Ext.define('CustomerNamesStore_filter', {
        extend: 'Ext.data.Model',
		fields: [
			{name: 'serv_fltr_customerid',mapping: 'customerid',type:'int'},
			{name: 'serv_fltr_customername',mapping: 'customername', type: 'string'}
        ]
	});	
	var UserCustomersStore_filter = new Ext.data.Store({
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
	
	var ServicesCol	= [	Ext.create('Ext.grid.RowNumberer'),
		{text: "Customer", dataIndex: 'customername', flex: 1, sortable: true},
		{text: "Basic", dataIndex: 'basic', flex: 1, sortable: true},
		{text: "Standard", dataIndex: 'standard', flex: 1, sortable: true},
		{text: "Premium", dataIndex: 'premium', flex: 1, sortable: true}/* ,
		{id: 'customer_city', text: "City", dataIndex: 'city',  flex: 1, sortable: true},
		{id: 'customer_addedon', text: "Since", dataIndex: 'addedon', width:80, sortable: true},
		{id: 'customer_addedby', text: "Added By", dataIndex: 'addedby', width:80, sortable: true} */
		
		
	];

    var loadTabPanel = Ext.getCmp('SAdminPanelServices');
	
    loadTabPanel.add({
			id:'SAdminPanelServicesGrid',
			//title:'Customers',
			xtype: 'grid',
			enableColumnHide:false,
			enableColumnMove:false,
			layout: 'fit',
			autoScroll:true,
			loadMask: true,
			store:ServicesStore,
			//selModel: new Ext.grid.RowSelectionModel({
			//	singleSelect: true
			//}),
			//viewConfig: { forceFit:true },
            
			selModel: {
				selType: 'rowmodel',
				mode : 'SINGLE',
				listeners:{
					'selectionchange':function(selmod, record, opt){
						if(record[0].get("serviceid")!=0){
							//alert(1);
							Ext.getCmp("gridEditButton_serv").enable();
							//Ext.getCmp("gridDelButton_serv").enable();
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
				store: UserCustomersStore_filter,
				displayField: 'serv_fltr_customername',
				valueField: 'serv_fltr_customerid',
				queryMode:'local',
				emptyText:'Select Customer...',
				name: 'serv_fltr_customerid',
				id:'serv_fltr_customerid',
				triggerAction: 'all',
				forceSelection: true,
				allowBlank:false,
				blankText:'Please select the Customer Name',
				selectOnFocus:true,
				listeners:{
					afterrender: function(){
						UserCustomersStore_filter.load({
						});
					},
					select:function(){
						var service_customerid = Ext.getCmp("serv_fltr_customerid").getValue();
						//var user_filtertext = Ext.getCmp("user_filterid").getRawValue();
						ServicesStore.baseParams = {customerid:service_customerid, start:0, limit:30};
						ServicesStore.load({params:{customerid:service_customerid, start:0, limit:30}});
					} 
				}		
			},
			'->',{
				xtype:'buttongroup',
				items: [{
					text: 'Edit services',
					scale: 'small',
					id:'gridEditButton_serv',
					disabled:true,
					handler:function(){
						var gridRec	= Ext.getCmp("SAdminPanelServicesGrid").getSelectionModel().getSelection();
						if(gridRec.length>0){
							var servicesArray 			= new Array();
							servicesArray["todo"]		= "Edit_Services";
							servicesArray["titleStr"]	= gridRec[0].get("customername");
							servicesArray["serviceid"]	= gridRec[0].get("serviceid");
							servicesArray[0]	= gridRec[0].get("customername");
							servicesArray[1]	= gridRec[0].get("stolen_vehicle_locator");
							servicesArray[2]	= gridRec[0].get("live_stolen_vehicle_tracking");
							servicesArray[3]	= gridRec[0].get("customer_web_access");
							servicesArray[4]	= gridRec[0].get("online_tracking");
							servicesArray[5]	= gridRec[0].get("history_tracking");
							servicesArray[6]	= gridRec[0].get("arrival_departure");
							servicesArray[7]	= gridRec[0].get("over_speed");
							servicesArray[8]	= gridRec[0].get("ignition_status");
							servicesArray[9]	= gridRec[0].get("door_status");
							servicesArray[10]	= gridRec[0].get("panic_button");
							servicesArray[11]	= gridRec[0].get("alerts");
							servicesArray[12]	= gridRec[0].get("trip_area");
							servicesArray[13]	= gridRec[0].get("fuel_guage_data");
							servicesArray[14]	= gridRec[0].get("softcopy_report");
							servicesArray[15]	= gridRec[0].get("upgradable");
							servicesArray[16]	= gridRec[0].get("transfarable_features");
							servicesArray[17]	= gridRec[0].get("online_tracking_limit");
							servicesArray[18]	= gridRec[0].get("history_tracking_limit");
							alert(servicesArray[17]);
							edit_services(servicesArray);
						}
					}
				}]
			}],
			columns: ServicesCol,
			border:false,
			collapsible: false,
			animCollapse: false,
			stripeRows: true,
			dockedItems: [{
				xtype: 'pagingtoolbar',
				id:'SAdminPanelServicesGridPbar',
				store: ServicesStore,
				dock: 'bottom',
				pageSize: 30,
				displayInfo: true
			}]
    }).show();
    loadTabPanel.doLayout();
    //loadTabPanel.setActiveTab(Ext.getCmp("attendGrid"));
    ServicesStore.load({params:{start:0, limit:30}});

}


function edit_services(servicesArray){
	var servicesform = {
		xtype:'form',
		id:'servicesform',
		name:'servicesform',
		layout: {
			type: 'column'
		},
		frame:true,
		border:false,
		bodyPadding:10,
		fieldDefaults: {
			labelAlign: 'right',
			msgTarget: 'side',
			labelSeparator:''//,
			//labelWidth: 120
		},
		
		//defaultType: 'textfield',
		items: [
			{
				xtype: 'container',
				columnWidth:0.35,
				border:false,
				style:'padding-left:5px;padding-right:15px',
				layout:{
					type:'anchor',
					anchor:'100%'
				},
				items: [
					/* {
						xtype:'displayfield',
						//fieldLabel:'Customer Name',
						name: 'customerid',
						id:'customerid',
						width: 250,
						listeners:{
									afterrender:function(){
										if(servicesArray[0]!="")
											this.setValue(servicesArray[0]);
									}
						}
					}, */{
						xtype: 'container',
						columnWidth: 0.35,
						defaultType: 'checkboxfield',
						items: [
							{
								boxLabel  : 'Stolen vehicle locator',
								name      : 'stolen_vehicle_locator',
								inputValue: '1',
								id        : 'checkbox1',
								listeners:{
									afterrender:function(){
									    if(servicesArray[1]==1)
										this.setValue(true);
									}
								}
							
							}, {
								boxLabel  : 'Live Stolen vehicle tracking',
								name      : 'live_stolen_vehicle_tracking',
								inputValue: '1',
								id        : 'checkbox2',
								listeners:{
									afterrender:function(){
									    if(servicesArray[2]==1)
										this.setValue(true);
									}
								}
							}, {
								boxLabel  : 'Softcopy report(monthly)',
								name      : 'softcopy_report',
								inputValue: '1',
								id        : 'checkbox3',
								listeners:{
									afterrender:function(){
									    if(servicesArray[14]==1)
										this.setValue(true);
									}
								}
								
							}, {
								boxLabel  : 'Upgradable',
								name      : 'upgradable',
								inputValue: '1',
								id        : 'checkbox4',
								listeners:{
									afterrender:function(){
									    if(servicesArray[15]==1)
										this.setValue(true);
									}
								}
							}, {
								boxLabel  : 'Tranferable features',
								name      : 'transfarable_features',
								inputValue: '1',
								id        : 'checkbox5',
								listeners:{
									afterrender:function(){
									    if(servicesArray[16]==1)
										this.setValue(true);
									}
								}
							}
						]						
					}
				]
			},{
						xtype: 'container',
						columnWidth: 0.35,
						defaultType: 'checkboxfield',
						items: [
							{
								boxLabel  : 'Customer web access',
								name      : 'customer_web_access',
								inputValue: '1',
								id        : 'checkbox6',
								listeners:{
									afterrender:function(){
									    if(servicesArray[3]==1)
										this.setValue(true);
									}
								}
							}, {
								boxLabel  : 'Online tracking(limited)',
								name      : 'online_tracking',
								inputValue: '1',
								id        : 'checkbox7',
								listeners:{
									afterrender:function(){
									    if(servicesArray[4]==1)
										this.setValue(true);
									}
								}
							},{
								xtype: 'textfield',
								fieldLabel:'online Limited',
								id:'online_tracking_limit',
								allowBlank:false,
								blankText:'Please enter the limited value',
								name:'online_tracking_limit',
								listeners:{
									afterrender:function(){
										if(servicesArray[17]!="")
											this.setValue(servicesArray[17]);
									}
								}
							},
							{
								boxLabel  : 'History tracking(limited)',
								name      : 'history_tracking',
								inputValue: '1',
								id        : 'checkbox8',
								listeners:{
									afterrender:function(){
									    if(servicesArray[5]==1)
										this.setValue(true);
									}
								}
							},{
								xtype: 'textfield',
								fieldLabel:'History Limited',
								id:'history_tracking_limit',
								allowBlank:false,
								blankText:'Please enter the limited value',
								name:'history_tracking_limit',
								anchor:'80%',
								listeners:{
									afterrender:function(){
										if(servicesArray[18]!="")
											this.setValue(servicesArray[18]);
									}
								}
							},							{
								boxLabel  : 'Arrival/Deptr notification',
								name      : 'arrival_departure',
								inputValue: '1',
								id        : 'checkbox9',
								listeners:{
									afterrender:function(){
									    if(servicesArray[6]==1)
										this.setValue(true);
									}
								}
							}, {
								boxLabel  : 'Overspeed notification',
								name      : 'over_speed',
								inputValue: '1',
								id        : 'checkbox10',
								listeners:{
									afterrender:function(){
									    if(servicesArray[7]==1)
										this.setValue(true);
									}
								}
							}, {
								boxLabel  : 'Ignition status',
								name      : 'ignition_status',
								inputValue: '1',
								id        : 'checkbox11',
								listeners:{
									afterrender:function(){
									    if(servicesArray[8]==1)
										this.setValue(true);
									}
								}
							}
						]						
			},{
						xtype: 'container',
						columnWidth: 0.3,
						defaultType: 'checkboxfield',
						items: [
							{
								boxLabel  : 'Door status',
								name      : 'door_status',
								inputValue: '1',
								id        : 'checkbox12',
								listeners:{
									afterrender:function(){
									    if(servicesArray[9]==1)
										this.setValue(true);
									}
								}
							}, {
								boxLabel  : 'Panic button',
								name      : 'panic_button',
								inputValue: '1',
								id        : 'checkbox13',
								listeners:{
									afterrender:function(){
									    if(servicesArray[10]==1)
										this.setValue(true);
									}
								}
							}, {
								boxLabel  : 'Trip area fencing',
								name      : 'trip_area',
								inputValue: '1',
								id        : 'checkbox14',
								listeners:{
									afterrender:function(){
									    if(servicesArray[12]==1)
										this.setValue(true);
									}
								}
							},{
								boxLabel  : 'Online tracking',
								name      : 'online_tracking',
								inputValue: '1',
								id        : 'checkbox15',
								listeners:{
									afterrender:function(){
									    if(servicesArray[4]==1)
										this.setValue(true);
									}
								}
							}, {
								boxLabel  : 'History tracking',
								name      : 'history_tracking',
								inputValue: '1',
								id        : 'checkbox16',
								listeners:{
									afterrender:function(){
									    if(servicesArray[5]==1)
										this.setValue(true);
									}
								}
							},{
								boxLabel  : 'Alerts',
								name      : 'alerts',
								inputValue: '1',
								id        : 'checkbox17',
								listeners:{
									afterrender:function(){
									    if(servicesArray[11]==1)
										this.setValue(true);
									}
								}
							}, {
								boxLabel  : 'Fuel guage data fencing',
								name      : 'fuel_guage_data',
								inputValue: '1',
								id        : 'checkbox18',
								listeners:{
									afterrender:function(){
									    if(servicesArray[13]==1)
										this.setValue(true);
									}
								}
							}
						]						
			}		
		]
	}

var servicesWin = Ext.create('Ext.Window', {
	title: servicesArray['todo']=="Add_User"?"Add User":servicesArray[0],
	width:600,
	height:350,
	
	plain: true,
	modal:true,
	//closable:true,
	resizable:false,
	border: false,
	layout: {
//        align: 'stretch',
        type: 'fit'
	},
	items: [servicesform],
	buttons: [{
		text: servicesArray['todo']=="Add_User"?'Add':'Update',
		handler:function(){
			var formPanel = Ext.getCmp('servicesform').getForm();
			if(formPanel.isValid()){
				formPanel.submit({
					clientValidation: true,
					url: 'includes/services_ajx.php',
					params: {
						todo: servicesArray['todo'], serviceid:servicesArray['serviceid']
					},
					success: function(form, action) {
					   Ext.Msg.alert('Success', action.result.msg);
					   servicesWin.destroy();
					   Ext.getCmp("SAdminPanelServicesGrid").getStore().loadPage(1);
					   //ServicesStore.load({params:{start:0, limit:30}});
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
			Ext.getCmp("SAdminPanelServicesGrid").getStore().loadPage(1);
		}
	},{
		text: 'Reset',
		hidden:servicesArray['todo']=="Add_User"?false:true,
		handler: function() {
			Ext.getCmp('servicesform').getForm().reset();
			Ext.getCmp('salutation').setValue("Mr. ");
		}
	},{
		text: 'Close',
		handler: function() {
			servicesWin.destroy();
		}
	}]
}).show();
Ext.getCmp('username').focus(true,1000);
}

function service_upgrade(customerid,services){
//alert(services);
	Ext.MessageBox.show({
		title:'Confirmatoin',
		msg: '<b>Are you sure to Upgrade the Customer Service?<br>',
		//msg: '<b>[ '+customername+' ]</b> can not be deleted ?<br><br><span class="tableTextM">Note:- If this customer related information like devices , Vehicles</span>',
		buttons: Ext.MessageBox.YESNO,
		fn: function(btn, text){
		
			if(btn=="yes"){
			
				Ext.Ajax.request({
					url: 'includes/services_ajx.php',
					timeout: 1200000,
					params: {
						todo:'Upgrade_Services',
						customerid   : customerid,
						services   : services
						
					},
					success: function(response){
						response = Ext.decode(response.responseText);
						if(response.success){
							Ext.MessageBox.show({
								title:'SUCCESS',
								msg: response.msg,
								buttons:Ext.MessageBox.OK
								
							});
							Ext.getCmp("SAdminPanelServicesGrid").getStore().loadPage(1);
						}else{
							Ext.MessageBox.show({
								title:'ERROR',
								msg: response.msg,
								buttons:Ext.MessageBox.OK
							});
						}
						/* setTimeout(function(){
							Ext.MessageBox.hide();
						}, 2000); */
					}
				});
			}
			
			Ext.getCmp("SAdminPanelServicesGrid").getStore().loadPage(1);
			
		},
		icon: Ext.MessageBox.CONFIRM
	});

}
