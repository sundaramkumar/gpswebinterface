Ext.require(['Ext.Img.*' ]);

function showKids(){
	if(Ext.getCmp("SAdminPanelKidsGrid")){
		Ext.getCmp("SAdminPanelKids").setActiveTab("SAdminPanelKidsGrid");
		return false;
	}
	Ext.define('kidsData', {
		extend: 'Ext.data.Model',
		fields: [
			{name: 'kidid',mapping: 'kidid',type:'int'},
			{name: 'kidname',mapping: 'kidname', type: 'string'},
			{name: 'deviceid',mapping: 'deviceid',type:'int'},
			{name: 'devicename',mapping: 'devicename', type: 'string'},
			{name: 'customerid',mapping: 'customerid',type:'int'},
			{name: 'customername',mapping: 'customername', type: 'string'},
			{name: 'institutename',mapping: 'institutename', type: 'string'},
			{name: 'instaddress1',mapping: 'instaddress1', type: 'string'},
			{name: 'instaddress2',mapping: 'instaddress2', type: 'string'},
			{name: 'instaddress3',mapping: 'instaddress3', type: 'string'},
			{name: 'instcity',mapping: 'instcity', type: 'string'},
			{name: 'instphone1',mapping: 'instphone1', type: 'string'},
			{name: 'instphone2',mapping: 'instphone2', type: 'string'},
			{name: 'mobile',mapping: 'mobile', type: 'string'},
			{name: 'friend1name',mapping: 'friend1name', type: 'string'},
			{name: 'friend1phone',mapping: 'friend1phone', type: 'string'},
			{name: 'friend2name',mapping: 'friend2name', type: 'string'},
			{name: 'friend2phone',mapping: 'friend2phone', type: 'string'},
			{name: 'photo',mapping: 'photo', type: 'string'},
			{name: 'addedon',mapping: 'addedon', type: 'string'},
			{name: 'addedby',mapping: 'addedby', type: 'string'},
			{name: 'kid_status',mapping: 'kid_status',type: 'string'}
			],
		idCustomer: 'kidid'
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
			url: './includes/kids_ajx.php',
			extraParams: {
				todo : 'Get_Kids_List'
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
			property: 'kidname',
			direction: 'ASC'
		}]
	});

	var KidsCol	= [	Ext.create('Ext.grid.RowNumberer'),
		{text: "Kid Name", dataIndex: 'kidname', flex: 1, sortable: true},
		{text: "Customer Id", dataIndex: 'customerid',hidden:true, flex: 1, sortable: true},
		{text: "Device Id", dataIndex: 'deviceid',hidden:true, flex: 1, sortable: true},
		{text: "Device name", dataIndex: 'devicename', flex: 1, sortable: true},
		{text: "Customer Name", dataIndex: 'customername', flex: 1, sortable: true},
		{text: "Institute Name", dataIndex: 'institutename', flex: 1, sortable: true},
		{text: "City", dataIndex: 'instcity', flex: 1, sortable: true},
		{text: "Mobile", dataIndex: 'mobile', flex: 1, sortable: true},
		//{text: "Added On", dataIndex: 'addedon', flex: 1, sortable: true},
		{text: "Added By", dataIndex: 'addedby', flex: 1, sortable: true},
		{text: "Status", dataIndex: 'kid_status', width:80, sortable: true}
	];
	
	var loadTabPanel = Ext.getCmp('SAdminPanelKids');
	Ext.define('CustomerNamesStore_filter', {
        extend: 'Ext.data.Model',
		fields: [
			{name: 'kid_fltr_customerid',mapping: 'customerid',type:'int'},
			{name: 'kid_fltr_customername',mapping: 'customername', type: 'string'}
        ]
	});

	var KidsCustomersStore_filter = new Ext.data.Store({
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
		id:'SAdminPanelKidsGrid',
		//title:'Customers',
		xtype: 'grid',
		enableColumnHide:false,
		enableColumnMove:false,
		layout: 'fit',
		autoScroll:true,
		loadMask: true,
		store:KidsStore,
		selModel: {
			selType: 'rowmodel',
			mode : 'SINGLE',
			listeners:{
				'select':function(selmod, record, opt){
					Ext.getCmp("BtnEditKid").enable();
					Ext.getCmp("BtnDelKid").enable();
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
				store: KidsCustomersStore_filter,
				displayField: 'kid_fltr_customername',
				valueField: 'kid_fltr_customerid',
				queryMode:'local',
				emptyText:'Select Customer...',
				name: 'kid_fltr_customerid',
				id:'kid_fltr_customerid',
				triggerAction: 'all',
				forceSelection: true,
				selectOnFocus:true,
				listeners:{
					afterrender: function(){
						KidsCustomersStore_filter.load({
						});
					},
					select:function(){
						var kids_customerid = Ext.getCmp("kid_fltr_customerid").getValue();
						var kids_filtertext = Ext.getCmp("kids_filterid").getRawValue();
						KidsStore.baseParams = {filtr_customerid:kids_customerid,filtertext:kids_filtertext, start:0, limit:30};
						KidsStore.load({params:{filtr_customerid:kids_customerid,filtertext:kids_filtertext, start:0, limit:30}});
					} 
				}		
			},{
				xtype:'tbspacer',
				width:20
			},new Ext.ux.form.SearchField({
				width:300,
				fieldLabel:'Search',
				emptyText:'Kidsname/Devicename/Institutename',
				labelWidth:45,
				id:'kids_filterid',
				onTrigger2Click:function(){
					//var filterText	= Ext.getCmp("filterText").getRawValue();
					var kids_filtertext = Ext.getCmp("kids_filterid").getRawValue();
					var kids_customerid = Ext.getCmp("kid_fltr_customerid").getValue();
					KidsStore.baseParams = {filtr_customerid:kids_customerid,filtertext:kids_filtertext, start:0, limit:30};
					KidsStore.load({params:{filtr_customerid:kids_customerid,filtertext:kids_filtertext, start:0, limit:30}});
				}
			}),'->',
			{
				xtype:'button',
				id:'BtnAddKid',
				text: 'Add Kid',
				scale: 'small',
				handler:function(){
					var kidArray 			= new Array();
					kidArray["todo"]		= "Add_Kid";
					kidArray["titleStr"]	= "Add Kid";
					kidArray['kidid'] = 0;
					kidArray["photopath"]= "./images/emptyimg.png";


					for(var i=0;i<=14;i++){
						kidArray[i]="";
					}
					add_edit_kid(kidArray);
				}
			},{
				xtype:'button',
				id:'BtnEditKid',
				text: 'Edit Kid',
				scale: 'small',
				disabled:true,
				handler:function(){
					if(Ext.getCmp("SAdminPanelKidsGrid").getSelectionModel().hasSelection()){
						var gridRec	= Ext.getCmp("SAdminPanelKidsGrid").getSelectionModel().getSelection();
						if(gridRec.length>0){
							var kidArray 			= new Array();
							kidArray["todo"]		= "Edit_Kid";
							kidArray["titleStr"]	= "Edit Kid";
							kidArray['kidid'] 	= gridRec[0].get("kidid");
							kidArray[0]	= gridRec[0].get("customerid");
							kidArray[1]	= gridRec[0].get("kidname");
							kidArray[2]	= gridRec[0].get("mobile");
							kidArray[3] 	= gridRec[0].get("friend1name");
							kidArray[4] 	= gridRec[0].get("friend1phone");
							kidArray[5]		= gridRec[0].get("friend2name");
							kidArray[6]		= gridRec[0].get("friend2phone");													  0
							kidArray[7]		= gridRec[0].get("institutename");
							kidArray[8]		= gridRec[0].get("instaddress1");
							kidArray[9]		= gridRec[0].get("instaddress2");
							kidArray[10]	= gridRec[0].get("instaddress3");
							kidArray[11]	= gridRec[0].get("instcity");
							kidArray[12]	= gridRec[0].get("instphone1");
							kidArray[13]	= gridRec[0].get("instphone2");
							kidArray[14]	= gridRec[0].get("deviceid");
							kidArray[15]	= gridRec[0].get("kid_status");
							
							if(gridRec[0].get("photo")!='')
								kidArray["photopath"]	= gridRec[0].get("photo");
							else
								kidArray["photopath"]= "./images/emptyimg.png";
							
							add_edit_kid(kidArray);
						}
					}
				}
			},{
				xtype:'button',
				text: 'Delete Kid',
				scale: 'small',
				id:'BtnDelKid',
				disabled:true,
				handler:function(){
					var gridRec	= Ext.getCmp("SAdminPanelKidsGrid").getSelectionModel().getSelection();
					if(gridRec.length>0){
						delete_kid(gridRec);
					}
				}
			}
		],
		columns: KidsCol,
		plugins: [{
            ptype: 'rowexpander',
            rowBodyTpl : [
                '<p><b>Institute Name:</b> {institutename}</p>',
                '<p><b>Institute Address:</b> {instaddress1}</p>',
				'<p><b></b> {instaddress2}</p>',
                '<p><b></b> {instaddress3}</p>'
            ]
		}],
		border:false,
		collapsible: false,
		animCollapse: false,
		stripeRows: true,
		dockedItems: [{
			xtype: 'pagingtoolbar',
			id:'SAdminPanelKidsGridPbar',
			store: KidsStore,
			dock: 'bottom',
			pageSize: 30,
			displayInfo: true
		}]
	}).show();
	loadTabPanel.doLayout();
	//loadTabPanel.setActiveTab(Ext.getCmp("attendGrid"));
	KidsStore.load({params:{start:0, limit:30}});
}

function add_edit_kid(kidArray){
	//customerstore
	Ext.define('CustomerNamesStore_combo',
	{
		extend: 'Ext.data.Model',
		fields: [
		{name: 'customerid',mapping: 'customerid',type:'int'},
		{name: 'customername',mapping: 'customername', type: 'string'}
		]
		//,idCustomer: 'customerid'
	});
	
	var KidCustomerStore_combo = new Ext.data.Store({
		model: 'CustomerNamesStore_combo',
		proxy: {
			type: 'ajax',
			url: 'includes/combo_ajx.php',
			actionMethods:{
				read: 'POST'
			},
			extraParams:{
				todo : 'Get_Customers_List'
			},
			reader:{
				type: 'json',
				root: 'CUSTOMERS'
			}
		}
	});
	//devicestore
	Ext.define('DeviceNamesStore_combo',
	{
		extend: 'Ext.data.Model',
		fields: [
			{name: 'deviceid',mapping: 'deviceid',type:'int'},
			{name: 'devicename',mapping: 'devicename', type: 'string'}
		]
		//,idCustomer: 'customerid'
	});
	
	var KidDeviceStore_combo = new Ext.data.Store({
		model: 'DeviceNamesStore_combo',
		proxy: {
			type: 'ajax',
			url: 'includes/combo_ajx.php',
			actionMethods: {
				read: 'POST'
			},
			extraParams: {
				todo : 'Get_Devices_List_Kids'
				
			},
			reader: {
				type: 'json',
				root: 'DEVICES_KIDS'
			}
		}
	});

	var kidform = {
		xtype:'form',
		id:'kidform',
		name:'kidform',
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
			columnWidth: 0.4,
			border:false,
			style:'padding-left:5px;padding-right:15px',
			items: [
					//get the customer name and device id
					{
						xtype:'combo',
						fieldLabel:'Customer',
						store: KidCustomerStore_combo,
						displayField: 'customername',
						valueField: 'customerid',
						queryMode:'local',
						emptyText:'Select Customer...',
						blankText:'Please Select The Customer',
						allowBlank:false,
						name: 'customerid',
						id:'customerid',
						//hiddenName: 'customerid_Hid',
						anchor:'90%',
						triggerAction: 'all',
						forceSelection: false,
						editable:true,
						selectOnFocus:true,
						listeners:{
							afterrender: function(){
									KidCustomerStore_combo.load({								
									callback: function(value) {
										if(kidArray[0]!="")
											Ext.getCmp("customerid").setValue(kidArray[0]); //0);
									}
								});
							},
							select:function(){
								var customerid = Ext.getCmp("customerid").getValue();
								KidDeviceStore_combo.load({
									params:{
										customerid_add : customerid
									},	
									callback: function() {
									}
								});
							}
						}
					},{
						xtype:'combo',
						fieldLabel:'Device',
						store: KidDeviceStore_combo,
						displayField: 'devicename',
						valueField: 'deviceid',
						queryMode:'local',
						//allowBlank:false,
						emptyText:'Select Device...',
						blankText:'Please Select Device',
						name: 'deviceid',
						id:'deviceid',
						anchor:'90%',
						triggerAction: 'all',
						forceSelection: false,
						editable:true,
						selectOnFocus:true,
						listeners:{						
							afterrender: function(){
							if(kidArray[0]!=""){
								KidDeviceStore_combo.load({
									params:{
										customerid_edit : kidArray[0],
									},
									callback: function() {
										if(kidArray[14]!="")
											Ext.getCmp("deviceid").setValue(kidArray[14]); //0);
									} 
								});  
							}
							}
						}
					},{
						xtype: 'textfield',
						fieldLabel:'Kid Name',
						id:'kidname',
						name:'kidname',
						//flex:0,
						allowBlank:false,
						blankText:'Please enter the Kid\'s Name',
						listeners:{
							afterrender:function(){
								if(kidArray[1]!="")
									this.setValue(kidArray[1]);
							}
						}
					},{
						xtype: 'numberfield',
						fieldLabel:'Mobile',
						id:'mobile',
						name:'mobile',
						allowBlank:false,
						allowDecimals: false,
						hideTrigger: 'true',
						//flex:0,
						blankText:'Please enter the Mobile No',
						listeners:{
							afterrender:function(){
								if(kidArray[2]!="")
									this.setValue(kidArray[2]);
							}
						}
					},{
						xtype: 'textfield',
						fieldLabel:'Friend 1 Name',
						id:'friend1name',
						name:'friend1name',
						blankText:'Please enter the Friend Name',
						listeners:{
							afterrender:function(){
								if(kidArray[3]!="")
									this.setValue(kidArray[3]);
							}
						}
					},{
						xtype: 'numberfield',
						fieldLabel:'Friend 1 Phone',
						id:'friend1phone',
						name:'friend1phone',
						hideTrigger: 'true',
						blankText:'Please enter the Friend Phone no.',
						listeners:{
							afterrender:function(){
								if(kidArray[4]!="")
									this.setValue(kidArray[4]);
							}
						}
					},{
						xtype: 'textfield',
						fieldLabel:'Friend 2 Name',
						id:'friend2name',
						name:'friend2name',
						blankText:'Please enter the Friend Name',
						listeners:{
							afterrender:function(){
								if(kidArray[5]!="")
									this.setValue(kidArray[5]);
							}
						}
					},{
						xtype: 'numberfield',
						fieldLabel:'Friend 2 Phone',
						id:'friend2phone',
						name:'friend2phone',
						hideTrigger: 'true',
						blankText:'Please enter the Friend Phone',
						listeners:{
							afterrender:function(){
								if(kidArray[6]!="")
									this.setValue(kidArray[6]);
							}
						}
					}
				]
			},{
				xtype: 'container',
				columnWidth: 0.6,
				items:[
					{
						xtype: 'textfield',
						fieldLabel:'Institute Name',
						id:'institutename',
						width: 380,
						name:'institutename',
						allowBlank:false,
						blankText:'Please enter the Institute Name',
						listeners:{
							afterrender:function(){
								if(kidArray[7]!="")
									this.setValue(kidArray[7]);
							}
						}
					},{
						xtype: 'textfield',
						fieldLabel:'Address 1',
						id:'instaddress1',
						width: 380,
						name:'instaddress1',
						blankText:'Please enter the Institute Address',
						allowBlank:false,
						listeners:{
							afterrender:function(){
								if(kidArray[8]!="")
									this.setValue(kidArray[8]);
							}
						}
					},{
						xtype: 'textfield',
						fieldLabel:'Address 2',
						allowBlank:false,
						id:'instaddress2',
						width: 380,
						name:'instaddress2',
						blankText:'Please enter the Institute Address',
						listeners:{
							afterrender:function(){
								if(kidArray[9]!="")
									this.setValue(kidArray[9]);
							}
						}
					},{
						xtype: 'textfield',
						fieldLabel:'Address 3',
						id:'instaddress3',
						width: 380,
						name:'instaddress3',
						listeners:{
							afterrender:function(){
								if(kidArray[10]!="")
									this.setValue(kidArray[10]);
							}
						}
					},{
						xtype: 'numberfield',
						fieldLabel:'Institute Phone1',
						id:'instphone1',
						name:'instphone1',
						width: 380,
						hideTrigger: 'true',
						blankText:'Please enter the Institute Phone no.',
						listeners:{
							afterrender:function(){
								if(kidArray[12]!="")
									this.setValue(kidArray[12]);
							}
						}
					},{
						xtype: 'numberfield',
						fieldLabel:'Institute Phone2',
						id:'instphone2',
						name:'instphone2',
						width: 380,
						hideTrigger: 'true',
						listeners:{
							afterrender:function(){
								if(kidArray[13]!="")
									this.setValue(kidArray[13]);
							}
						}
					},{
						xtype: 'textfield',
						fieldLabel:'City',
						id:'instcity',
						allowBlank:false,
						width: 380,
						name:'instcity',
						blankText:'Please enter the Institute City',
						listeners:{
							afterrender:function(){
								if(kidArray[11]!="")
									this.setValue(kidArray[11]);
							}
						}
					}
				]
			},{
				xtype: 'container',
				columnWidth: 1,
				style:'padding-left:370px',				
				items: [
						{
							xtype:'box',
							//isFormField:true,
							fieldLabel:'Image',
							autoEl:{
								tag:'div',
								children:[{
									tag:'img',
									qtip:'You can also have a tooltip on the image',
									src:kidArray["photopath"],
									width:150,
									height:150
								 },{
									tag:'div',
									style:'margin:5px',
									html:'Kid\'s Photo'
								 }
								]
							}
						},{
							xtype: 'filefield',
							fieldLabel:'Upload Kid Photo',
							id:'photo',
							name:'photo',
							width: 300,
							buttonText: 'Select Photo...',
							allowBlank:true
						}
				]
			}
		]
	}

	var kidWin = Ext.create('Ext.Window', {
		title: kidArray['todo']=="Add_Kid"?"Add Kid":"Edit Kid",
		width:700,
		height:500,
		plain: true,
		modal:true,
		closable:true,
		border: false,
		layout: {
			type: 'fit'
		},
		items: [kidform],
		buttons: [{
			text: kidArray['todo']=="Add_Kid"?'Add':'Update',
			handler:function(){
				var formPanel = Ext.getCmp('kidform').getForm();
				if(formPanel.isValid()){
					formPanel.submit({
						clientValidation: true,
						url: 'includes/kids_ajx.php',
						params: {
							todo: kidArray['todo'], kidid:kidArray['kidid']
						},
						success: function(form, action) {
						   Ext.Msg.alert('Success', action.result.msg);
						   kidWin.destroy();
						   Ext.getCmp("SAdminPanelKidsGrid").getStore().loadPage(1);								 
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
				hidden:kidArray['todo']=="Add_Kid"?false:true,
				handler: function() {
					Ext.getCmp('kidform').getForm().reset();
				}
			},{
			text: 'Close',
			handler: function() {
				kidWin.destroy();
			}
		}]
	}).show();
	Ext.getCmp('kidname').focus(true,1000);
}

function delete_kid(gridRec){
	var kidid 	= gridRec[0].get("kidid");
	var kidname	= gridRec[0].get("kidname");
	var customerid	= gridRec[0].get("customerid");
	Ext.MessageBox.show({
		title:'Confirm Delete?',
		msg: 'Are you sure to delete <b>[ '+kidname+' ]</b> ',
		buttons: Ext.MessageBox.YESNO,
		fn: function(btn, text){
			if(btn=="yes"){
				Ext.Ajax.request({
					url: 'includes/kids_ajx.php',
					timeout: 1200000,
					params: {
						todo:'Delete_Kid',
						kidid : kidid,
						kidname :kidname,
						customerid: customerid
					},
					success: function(response){
						response = Ext.decode(response.responseText);
						if(response.success){
							Ext.MessageBox.show({
								title:'SUCCESS',
								msg: response.msg,
								buttons: Ext.MessageBox.OK
							});
							Ext.getCmp("SAdminPanelKidsGrid").getStore().loadPage(1);
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
		},
	   icon: Ext.MessageBox.CONFIRM
	});
}

function status_kid(kidid,kid_status)
{
	Ext.MessageBox.show({
		title:'Confirmatoin',
		msg: '<b>Are you sure to change the status..?',
		buttons: Ext.MessageBox.YESNO,
		fn: function(btn, text){
			if(btn=="yes"){
				Ext.Ajax.request({
					url: 'includes/kids_ajx.php',
					timeout: 1200000,
					params: {
						todo:'Status_Kid',
						kidid   : kidid,
						kid_status:kid_status
					},
					success: function(response){
						response = Ext.decode(response.responseText);
						if(response.success){
							Ext.MessageBox.show({
								title:'SUCCESS',
								msg: response.msg,
								buttons:Ext.MessageBox.OK
							});
							Ext.getCmp("SAdminPanelKidsGrid").getStore().loadPage(1);
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
			else
				Ext.getCmp("SAdminPanelKidsGrid").getStore().loadPage(1);
		},
		icon: Ext.MessageBox.CONFIRM
	});
}

function unassign_kid(kidid){
	Ext.MessageBox.show({
		title:'Are you sure to Remove the Device from this Kid?',
		msg: '<span class="">Note:- If the device is removed, History will be deleted permanantly and this kid cannot be tracked.</span>',		//msg: '<b>[ '+customername+' ]</b> can not be deleted ?<br><br><span class="tableTextM">Note:- If this customer related information like devices , Vehicles</span>',
		buttons: Ext.MessageBox.YESNO,
		fn: function(btn, text){
		
			if(btn=="yes"){
			
				Ext.Ajax.request({
					url: 'includes/kids_ajx.php',
					timeout: 1200000,
					params: {
						todo:'Unassign_Kid',
						kidid   : kidid
						
					},
					success: function(response){
						response = Ext.decode(response.responseText);
						if(response.success){
							Ext.MessageBox.show({
								title:'SUCCESS',
								msg: response.msg,
								buttons:Ext.MessageBox.OK
								
							});
							Ext.getCmp("SAdminPanelKidsGrid").getStore().loadPage(1);
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
			
			Ext.getCmp("SAdminPanelKidsGrid").getStore().loadPage(1);
			
		},
		icon: Ext.MessageBox.CONFIRM
	});

}
