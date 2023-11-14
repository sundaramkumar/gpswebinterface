function showDrivers(){
	if(Ext.getCmp("SAdminPanelDriversGrid")){
		Ext.getCmp("SAdminPanelDrivers").setActiveTab("SAdminPanelDriversGrid");
		return false;
	}

	Ext.define('driversData', {
        extend: 'Ext.data.Model',
		fields: [
			{name: 'customerid',mapping: 'customerid',type:'int'},
			{name: 'customername',mapping: 'customername', type: 'string'},
			{name: 'driverid',mapping: 'driverid',type:'int'},
            {name: 'drivername',mapping: 'drivername',type:'string'},
			{name: 'address1',mapping: 'address1', type: 'string'},
			{name: 'address2',mapping: 'address2', type: 'string'},
			{name: 'address3',mapping: 'address3', type: 'string'},
			{name: 'city',mapping: 'city', type: 'string'},
			{name: 'mobile',mapping: 'mobile', type: 'string'},
			{name: 'phoneno',mapping: 'phoneno', type: 'string'},
			{name: 'licenseno',mapping: 'licenseno', type: 'string'},
			{name: 'licenseexpirydate',mapping: 'licenseexpirydate', type: 'string'},
			{name: 'photo',mapping: 'photo', type: 'string'},
			{name: 'licensecopy',mapping: 'licensecopy', type: 'string'}
			],
        idCustomer: 'driverid'
    });


    // create the Data Store
    var driversStore = Ext.create('Ext.data.JsonStore', {
        id: 'driversStore',
        pageSize: 30,
        model: 'driversData',
        remoteSort: false,
        proxy: {
            type: 'ajax',
			actionMethods: {
				read: 'POST'
			},
            url: './includes/drivers_ajx.php',
            extraParams: {
				todo : 'Get_drivers_List'
            },
            reader: {
				type: 'json',
                root: 'drivers',
                totalProperty: 'totalCount'
            },
            // sends single sort as multi parameter
            simpleSortMode: true
        },
        sorters: [{
            property: 'drivername',
            direction: 'ASC'
        }]
    });

	var driversCol	= [	Ext.create('Ext.grid.RowNumberer'),
		{text: "Customer Id", dataIndex: 'customerid',hidden:true, flex: 1, sortable: true},
		{text: "Customer Name", dataIndex: 'customername', flex: 1, sortable: true},
		{text: "Driver Id", dataIndex: 'driverid',hidden:true, flex: 1, sortable: true},
		{text: "driver Name", dataIndex: 'drivername', flex: 1, sortable: true},
		{text: "Address 1", dataIndex: 'address1', flex: 1, sortable: true},
		{text: "Address 2", dataIndex: 'address2', flex: 1, sortable: true},
		{text: "Address 3", dataIndex: 'address3', flex: 1, sortable: true},
		{text: "City", dataIndex: 'city', flex: 1, sortable: true},
		{text: "Mobile", dataIndex: 'mobile', flex: 1, sortable: true},
		{text: "Phone No", dataIndex: 'phoneno', flex: 1, sortable: true},
		{text: "Licence No", dataIndex: 'licenseno', flex: 1, sortable: true},
		{text: "Licence Exp Date", dataIndex: 'licenseexpirydate', flex: 1, sortable: true}
	];

    var loadTabPanel = Ext.getCmp('SAdminPanelDrivers');
    loadTabPanel.add({
			id:'SAdminPanelDriversGrid',
			//title:'Customers',
			xtype: 'grid',
			enableColumnHide:false,
			enableColumnMove:false,
			layout: 'fit',
			autoScroll:true,
			loadMask: true,
			store:driversStore,
			//selModel: new Ext.grid.RowSelectionModel({
			//	singleSelect: true
			//}),
			//viewConfig: { forceFit:true },

			selModel: {
				selType: 'rowmodel',
				mode : 'SINGLE',
				listeners:{
					/*'selectionchange':function(selmod, record, opt){
						if(record[0].get("driverid")!=0){
							//alert(1);
							Ext.getCmp("gridDEditButton").enable();
							Ext.getCmp("gridDDelButton").enable();
						}
					}*/
					'select':function(selmod, record, opt){
						if(record.get("driverid")!=0){
							Ext.getCmp("gridDEditButton").enable();	
							//Ext.getCmp("gridDDelButton").enable();							
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
					text: 'Add Driver',
					scale: 'small',
					handler:function(){
						var driverArray 			= new Array();
						driverArray["todo"]		= "Add_driver";
						driverArray["titleStr"]	= "Add Driver";
						driverArray['driverid'] = 0;

						for(var i=0;i<=11;i++){
							driverArray[i]="";
						}
						add_edit_driver(driverArray);
					}
				},{
					text: 'Edit Driver',
					scale: 'small',
					id:'gridDEditButton',
					disabled:true,
					handler:function(){
						//alert(2);
						var gridRec	= Ext.getCmp("SAdminPanelDriversGrid").getSelectionModel().getSelection();
						//alert(3);
						if(gridRec.length>0){
							var driverArray 			= new Array();
							driverArray["todo"]		= "Edit_driver";
							driverArray["titleStr"]	= "Edit driver";
							driverArray["photopath"]= "./images/emptyimg.png";

							driverArray['driverid'] 	= gridRec[0].get("driverid");
							driverArray[0]		= gridRec[0].get("customerid");
							driverArray[1]		= gridRec[0].get("customername");
							driverArray[2]		= gridRec[0].get("driverid");
							driverArray[3] 		= gridRec[0].get("drivername");
							driverArray[4] 		= gridRec[0].get("address1");
							driverArray[5]		= gridRec[0].get("address2");
							driverArray[6]		= gridRec[0].get("address3");
							driverArray[7]		= gridRec[0].get("city");
							driverArray[8]		= gridRec[0].get("mobile");
							driverArray[9]		= gridRec[0].get("phoneno");
							driverArray[10]		= gridRec[0].get("licenseno");
							driverArray[11]		= gridRec[0].get("licenseexpirydate");
							driverArray[12]		= gridRec[0].get("photo");
							driverArray[13]		= gridRec[0].get("licensecopy");

							//alert(driverArray);
							add_edit_driver(driverArray);
						}
					}
				},{
					text: 'Delete Driver',
					scale: 'small',
					id:'gridDDelButton',
					disabled:true,
					handler:function(){
						var gridRec	= Ext.getCmp("SAdminPanelDriversGrid").getSelectionModel().getSelection();
						if(gridRec.length>0){
							delete_driver(gridRec);
						}
					}
				}]
			}
			],
			columns: driversCol,
			border:false,
			collapsible: false,
			animCollapse: false,
			stripeRows: true,
			dockedItems: [{
				xtype: 'pagingtoolbar',
				id:'SAdminPanelDriversGridPbar',
				store: driversStore,
				dock: 'bottom',
				pageSize: 30,
				displayInfo: true
			}]
    }).show();
    loadTabPanel.doLayout();
    //loadTabPanel.setActiveTab(Ext.getCmp("attendGrid"));
	loadTabPanel.on('activate', function(){
		driversStore.load({params:{start:0, limit:30}});
	});	
    //driversStore.load({params:{start:0, limit:30}});

}

function add_edit_driver(driverArray){
	Ext.define('CustomerNamesStore', {
        extend: 'Ext.data.Model',
		fields: [
			{name: 'customerid',mapping: 'customerid',type:'int'},
			{name: 'customername',mapping: 'customername', type: 'string'}
            ]
		//,idCustomer: 'customerid'
    });

	var driversCustomersStore = new Ext.data.Store({
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

	var driverformold = {
		xtype:'form',
		id:'driverform',
		name:'driverform',
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
		defaultType: 'textfield',
		items: [
			{
				xtype: 'container',
				columnWidth: 0.6,
				border:false,
				style:'padding-left:5px;padding-right:15px',
				layout:{
					type:'anchor'
				},
				items: [
					{
						/*xtype: 'displayfield',
						name: 'displayfield1',
						fieldLabel: 'Customer Name',
						value: '<span style="color:green;">'+driverArray[1]+'</span>',
						anchor:'100%'
					},{*/
						xtype: 'textfield',
						fieldLabel:'Driver Name',
						id:'drivername',
						name:'drivername',
						//flex:0,
						allowBlank:false,
						blankText:'Please enter the driver\'s Name',
						anchor:'100%',
						listeners:{
							afterrender:function(){
								if(driverArray[3]!="")
									this.setValue(driverArray[3]);
							}
						}
					},{
						xtype: 'textfield',
						fieldLabel:'Address 1',
						id:'address1',
						name:'address1',
						allowBlank:false,
						//flex:0,
						blankText:'Please enter the Address No 1',
						anchor:'100%',
						listeners:{
							afterrender:function(){
								if(driverArray[4]!="")
									this.setValue(driverArray[4]);
							}
						}
					},{
						xtype: 'textfield',
						fieldLabel:'Address 2',
						id:'address2',
						name:'address2',
						anchor:'100%',
						listeners:{
							afterrender:function(){
								if(driverArray[5]!="")
									this.setValue(driverArray[5]);
							}
						}
					},{

						xtype: 'textfield',
						fieldLabel:'Address 3',
						id:'address3',
						name:'address3',
						anchor:'100%',
						listeners:{
							afterrender:function(){
								if(driverArray[6]!="")
									this.setValue(driverArray[6]);
							}
						}
					}
				]
			},{
				xtype: 'container',
				columnWidth: 0.4,
				layout:{
					type:'anchor'
				},
				items: [
					{
						xtype: 'textfield',
						fieldLabel:'City',
						id:'city',
						name:'city',
						allowBlank:false,
						blankText:'Please enter the City',
						anchor:'100%',
						listeners:{
							afterrender:function(){
								if(driverArray[7]!="")
									this.setValue(driverArray[7]);
							}
						}
					},{
						xtype: 'textfield',
						fieldLabel:'Mobile',
						id:'mobile',
						name:'mobile',
						//flex:0,
						allowBlank:false,
						blankText:'Please enter the Mobile No',
						anchor:'100%',
						listeners:{
							afterrender:function(){
								if(driverArray[8]!="")
									this.setValue(driverArray[8]);
							}
						}
					},{
						xtype: 'textfield',
						fieldLabel:'Phone No',
						id:'phoneno',
						name:'phoneno',
						//flex:0,
						//allowBlank:false,
						blankText:'Please enter the Phone No',
						anchor:'100%',
						listeners:{
							afterrender:function(){
								if(driverArray[9]!="")
									this.setValue(driverArray[9]);
							}
						}
					},{
						xtype: 'textfield',
						fieldLabel:'License No',
						id:'licenseno',
						name:'licenseno',
						//flex:0,
						allowBlank:false,
						blankText:'Please enter the License No',
						anchor:'100%',
						listeners:{
							afterrender:function(){
								if(driverArray[10]!="")
									this.setValue(driverArray[10]);
							}
						}
					},{
						xtype: 'datefield',
						fieldLabel:'Licence Exp Date',
						id:'licenseexpirydate',
						name:'licenseexpirydate',
						//flex:0,
						allowBlank:false,
						format: 'd-m-Y',
						altFormats:'d/m/Y|d.m.Y',
						blankText:'Please enter the License Expiry Date',
						listeners:{
							afterrender:function(){
								if(driverArray[11]!="")
									this.setValue(driverArray[11]);
							}
						}
					}
				]
			}
		]
	}

	var driverpanel = Ext.create('Ext.form.Panel', {
		xtype:'form',
		title:'Details',
		id:'driverpanel',
		name:'driverpanel',
		layout: {
			type: 'column'
		},
		frame:true,
		//border:false,
		height:250,
		bodyPadding:10,
		fieldDefaults: {
			labelAlign: 'right',
			msgTarget: 'side',
			labelSeparator:''//,
			//labelWidth: 120
		},
		defaultType: 'textfield',
		items: [
			{
				xtype: 'container',
				columnWidth: 0.5,
				border:false,
				layout:{
					type:'anchor'
				},
				style:'padding-left:5px;padding-right:15px',
				items: [{
						xtype: 'textfield',
						fieldLabel:'Driver Name',
						id:'drivername',
						name:'drivername',
						//flex:0,
						allowBlank:false,
						blankText:'Please enter the driver\'s Name',
						anchor:'100%',
						listeners:{
							afterrender:function(){
								if(driverArray[3]!="")
									this.setValue(driverArray[3]);
							}
						}
					},{
						xtype: 'textfield',
						fieldLabel:'Address 1',
						id:'address1',
						name:'address1',
						allowBlank:false,
						//flex:0,
						blankText:'Please enter the Address No 1',
						anchor:'100%',
						listeners:{
							afterrender:function(){
								if(driverArray[4]!="")
									this.setValue(driverArray[4]);
							}
						}
					},{
						xtype: 'textfield',
						fieldLabel:'Address 2',
						id:'address2',
						name:'address2',
						anchor:'100%',
						listeners:{
							afterrender:function(){
								if(driverArray[5]!="")
									this.setValue(driverArray[5]);
							}
						}
					},{

						xtype: 'textfield',
						fieldLabel:'Address 3',
						id:'address3',
						name:'address3',
						anchor:'100%',
						listeners:{
							afterrender:function(){
								if(driverArray[6]!="")
									this.setValue(driverArray[6]);
							}
						}
					},{					
						xtype: 'textfield',
						fieldLabel:'City',
						id:'city',
						name:'city',
						allowBlank:false,
						blankText:'Please enter the City',
						anchor:'100%',
						listeners:{
							afterrender:function(){
								if(driverArray[7]!="")
									this.setValue(driverArray[7]);
							}
						}
					}	
				]
			},{
				xtype: 'container',
				columnWidth: 0.5,
				layout:{
					type:'anchor'
				},
				items: [{
						xtype: 'textfield',
						fieldLabel:'Mobile',
						id:'mobile',
						name:'mobile',
						//flex:0,
						allowBlank:false,
						blankText:'Please enter the Mobile No',
						anchor:'100%',
						listeners:{
							afterrender:function(){
								if(driverArray[8]!="")
									this.setValue(driverArray[8]);
							}
						}
					},{
						xtype: 'textfield',
						fieldLabel:'Phone No',
						id:'phoneno',
						name:'phoneno',
						//flex:0,
						//allowBlank:false,
						blankText:'Please enter the Phone No',
						anchor:'100%',
						listeners:{
							afterrender:function(){
								if(driverArray[9]!="")
									this.setValue(driverArray[9]);
							}
						}
					},{
						xtype: 'textfield',
						fieldLabel:'License No',
						id:'licenseno',
						name:'licenseno',
						//flex:0,
						allowBlank:false,
						blankText:'Please enter the License No',
						anchor:'100%',
						listeners:{
							afterrender:function(){
								if(driverArray[10]!="")
									this.setValue(driverArray[10]);
							}
						}
					},{
						xtype: 'datefield',
						fieldLabel:'Licence Exp Date',
						id:'licenseexpirydate',
						name:'licenseexpirydate',
						//flex:0,
						allowBlank:false,
						format: 'd-m-Y',
						altFormats:'d/m/Y|d.m.Y',
						blankText:'Please enter the License Expiry Date',
						listeners:{
							afterrender:function(){
								if(driverArray[11]!="")
									this.setValue(driverArray[11]);
							}
						}
					}
				]
			}
		]		
	});	
	
	var documentform = Ext.create('Ext.form.Panel', {
		title:'Documents',
		xtype:'form',
		id:'docform',
		name:'docform',
		layout: {
			type: 'column'
		},
		height:250,
		frame:true,
		//border:false,
		//bodyPadding:10,
		/*fieldDefaults: {
			labelAlign: 'right',
			msgTarget: 'side',
			labelSeparator:''//,
			//labelWidth: 120
		},*/
		defaultType: 'textfield',
		items: [{
			xtype: 'container',
			columnWidth: 0.9,
			border:false,
			layout:{
				type:'anchor'
			},
			style:'padding-left:5px;padding-right:15px',
		items: [{
				xtype: 'container',
				border:false,
				anchor: '100%',
				layout:'column',
				style:'padding-left:5px;padding-right:15px',
				items:[{
					xtype: 'container',
					border:false,
					columnWidth:.7,
					layout: 'anchor',
						items: [{
							xtype: 'filefield',
							fieldLabel:'Upload Driver Copy',
							labelWidth:130,
							id:'photo',
							//flex:0,
							name:'photo',
							anchor: '100%',
							buttonText: 'Select Photo...',
							allowBlank:true,
							listeners:{
								afterrender:function(){
									//if(kidArray[14]!="")
										//this.setValue(kidArray[14]);
									
										
								}
							}
						}]
				},{
					xtype: 'container',
					border:false,
					columnWidth:.3,
					layout: 'anchor',
						items: [{
							xtype:'button',
							text:'View Photo',
							style:'margin-left:10px',
							handler:function(){
								view_driver_image(driverArray[12]);	
							}
						}]
				}]				
			},{
				xtype: 'container',
				border:false,
				anchor: '100%',
				layout:'column',
				style:'padding-left:5px;padding-right:15px',
				items:[{
					xtype: 'container',
					border:false,
					columnWidth:.7,
					layout: 'anchor',
						items: [{
							xtype: 'filefield',
							fieldLabel:'Upload License Copy',
							id:'licensecopy',
							//flex:0,
							name:'licensecopy',
							labelWidth:130,
							anchor: '100%',
							buttonText: 'Select Image...',
							allowBlank:true,
							listeners:{
								afterrender:function(){
								}
							}
						}]
				},{
					xtype: 'container',
					border:false,
					columnWidth:.3,
					layout: 'anchor',
					items: [{
						xtype:'button',
						text:'View Image',
						style:'margin-left:10px',
						handler:function(){
							view_driver_image(driverArray[13]);
						}
					}]
				}]						
			}]
		}]	
			
	});	
	
	var drivertabpanel = {		       			
		xtype:'tabpanel',
		activeTab: 0,
		items: [
			driverpanel, documentform
		]		
	}
	
	var driverform = {		       			
		xtype:'form',
		id:'driverform',
		name:'driverform',
		frame:true,		
		items: drivertabpanel	
	}


var driverWin = Ext.create('Ext.Window', {
	title: driverArray['todo']=="Add_driver"?"Add driver":"Edit driver",
	width:800,
	height:260,
	plain: true,
	modal:true,
	closable:false,
	resizable:false,
	border: false,
	layout: {
		type: 'fit'
	},
	items: [driverform],
	buttons: [{
		text: driverArray['todo']=="Add_driver"?'Add':'Update',
		handler:function(){
			var formPanel = Ext.getCmp('driverform').getForm();
			if(formPanel.isValid()){
				formPanel.submit({
					clientValidation: true,
					url: 'includes/drivers_ajx.php',
					params: {
						todo: driverArray['todo'], driverid:driverArray['driverid'],customerid:driverArray[15]
					},
					success: function(form, action) {
					   	Ext.getCmp('SAdminPanelDriversGrid').getStore().load({params:{start:0, limit:30}});	
					   	//Ext.getCmp("gridDEditButton").disable();
						//Ext.Msg.alert('Success', action.result.msg);
					   	//driverWin.destroy();
						
						var fileUploadErr= action.result.fileUploadErr;
						if(fileUploadErr!=""){
							Ext.Msg.alert('WARNING', 'Driver Info updated successfully.<br><br>But Some Documents is not uploded.Please see below : <br><br><b>'+fileUploadErr+'</b>');
						}else{
							Ext.Msg.alert('Success', action.result.msg);
							driverWin.destroy();
						}
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
		hidden:driverArray['todo']=="Add_driver"?false:true,
		handler: function() {
			Ext.getCmp('driverform').getForm().reset();
		}
	},{
		text: 'Close',
		handler: function() {
			driverWin.destroy();
		}
	}]
    }).show();
	Ext.getCmp('drivername').focus(true,1000);
}

function delete_driver(gridRec){
	var driverid 	= gridRec[0].get("driverid");
	var drivername	= gridRec[0].get("drivername");
	
	Ext.MessageBox.show({
		title:'Confirm Delete?',
		msg: 'Are you sure to delete This driver <b>[ '+drivername+' ]</b> ?<br><br><span class="tableTextM">Note:- All related information like vehicle and everything will be deleted permanently. This action cannot be undone</span>',
		buttons: Ext.MessageBox.YESNO,
		fn: function(btn, text){
			if(btn=="yes"){
				Ext.Ajax.request({
					url: 'includes/drivers_ajx.php',
					timeout: 1200000,
					params: {
						todo:'Delete_driver',
						driverid : driverid,
						drivername :drivername
					},
					success: function(response){
						response = Ext.decode(response.responseText);
						if(response.success){
							Ext.MessageBox.show({
								title:'SUCCESS',
								msg: response.msg
							});
							Ext.getCmp("SAdminPanelDriversGrid").getStore().loadPage(1);
						}else{
							Ext.MessageBox.show({
								title:'ERROR',
								msg: response.msg
							});
						}
						setTimeout(function(){
							Ext.MessageBox.hide();
						}, 2000);
					}
				});
			}
		},
	   icon: Ext.MessageBox.CONFIRM
	});
}

function view_driver_image(driver_img){
	var viewdriverform = {
		xtype:'form',
		id:'viewdriverform',
		name:'viewdriverform',
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
		items: [{
				xtype: 'container',
				columnWidth: 0.5,
				style:'padding-left:5px;padding-right:15px',
				items: [{
						xtype:'box',
						anchor:'',
						//isFormField:true,
						fieldLabel:'Image',
						autoEl:{
							tag:'div', children:[{
								 tag:'img',
								 qtip:'You can also have a tooltip on the image',
								 src:driver_img,
								 width:550,
								 height:500
							/*},{
								tag:'div',
								style:'margin:5px',
								html:'View Image'*/
							}]
						}
					}
				]
			}
		]
	}	
	var viewdriverimgWin = Ext.create('Ext.Window', {
		title: "View Image",
		width:600,
		height:600,
		plain: true,
		modal:true,
		resizable:false,
		border: false,
		layout: {
			type: 'fit'
		},
		items: [viewdriverform],
		buttons: [{			
			text: 'Close',
			handler: function() {
				viewdriverimgWin.destroy();
			}
		}]
	}).show();	
}



