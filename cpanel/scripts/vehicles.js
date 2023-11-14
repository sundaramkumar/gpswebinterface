function showVehicles(){
	if(Ext.getCmp("SAdminPanelVehiclesGrid")){
		Ext.getCmp("SAdminPanelVehicles").setActiveTab("SAdminPanelVehiclesGrid");
		return false;
	}

	Ext.define('vehiclesData', {
        extend: 'Ext.data.Model',
		fields: [
			{name: 'customerid',mapping: 'customerid',type:'int'},
			{name: 'customername',mapping: 'customername', type: 'string'},
			{name: 'deviceid',mapping: 'deviceid',type:'int'},
			{name: 'driverid',mapping: 'driverid',type:'int'},
			{name: 'drivername',mapping: 'drivername',type:'String'},
			{name: 'drivermobile',mapping: 'drivermobile',type:'String'},
            {name: 'vehicleid',mapping: 'vehicleid',type:'int'},
			{name: 'vehiclename',mapping: 'vehiclename', type: 'string'},
			{name: 'model',mapping: 'model', type: 'string'},
			{name: 'regnno',mapping: 'regnno', type: 'string'},
			{name: 'insurancedate',mapping: 'insurancedate', type: 'string'},
			{name: 'fcdate',mapping: 'fcdate', type: 'string'},
			{name: 'servicedue',mapping: 'servicedue', type: 'string'},
			{name: 'engineno',mapping: 'engineno', type: 'string'},
			{name: 'chassisno',mapping: 'chassisno', type: 'string'},
			{name: 'devicename',mapping: 'devicename', type: 'string'},            
			{name: 'status',mapping: 'status', type: 'string'},
			{name: 'simcardno',mapping: 'simcardno', type: 'string'},
			{name: 'simserialno',mapping: 'simserialno', type: 'string'},
			{name: 'simprovider',mapping: 'simprovider', type: 'string'},
			{name: 'gprsplan',mapping: 'gprsplan', type: 'string'},
			{name: 'gprssettings',mapping: 'gprssettings', type: 'string'},
			{name: 'fuelcapacity',mapping: 'fuelcapacity', type: 'string'},
			{name: 'speedlimit',mapping: 'speedlimit', type: 'string'},
			{name: 'rccopy',mapping: 'rccopy', type: 'string'},
			{name: 'inscopy',mapping: 'inscopy', type: 'string'},
			{name: 'vehiclephoto',mapping: 'vehiclephoto', type: 'string'},
			{name: 'permitcopy',mapping: 'permitcopy', type: 'string'},
			{name: 'realtime',mapping: 'realtime', type: 'string'},
			{name: 'polypath',mapping: 'polypath', type: 'string'},
			{name: 'routepath',mapping: 'routepath', type: 'string'},
			{name: 'history',mapping: 'history', type: 'string'}
		],
        idCustomer: 'vehicleid'
    });


    // create the Data Store
    var vehiclesStore = Ext.create('Ext.data.JsonStore', {
        id: 'vehiclesStore',
        pageSize: 30,
        model: 'vehiclesData',
        remoteSort: false,
        proxy: {
            type: 'ajax',
			actionMethods: {
				read: 'POST'
			},
            url: './includes/vehicles_ajx.php',
            extraParams: {
				todo : 'Get_vehicles_List'
            },
            reader: {
				type: 'json',
                root: 'VEHICLES',
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


	var vehiclesCol	= [	Ext.create('Ext.grid.RowNumberer'),
		{text: "Customer Id", dataIndex: 'customerid',hidden:true, flex: 1, sortable: true},
		//{text: "Customer Name", dataIndex: 'customername', flex: 1, sortable: true},
		{text: "vehicle Name", dataIndex: 'vehiclename', flex: 1, sortable: true},
		{text: "Model", dataIndex: 'model', flex: 1, sortable: true},
		{text: "Registration No", dataIndex: 'regnno', flex: 1, sortable: true},
		{text: "Insurance Date", dataIndex: 'insurancedate', flex: 1, sortable: true},
		{text: "FC Date", dataIndex: 'fcdate', flex: 1, sortable: true},
		{text: "Service Due Date", dataIndex: 'servicedue', flex: 1, sortable: true},
		{text: "Engine No", dataIndex: 'engineno', flex: 1, sortable: true},
		{text: "Chassis No", dataIndex: 'chassisno', flex: 1, sortable: true},
		{text: "Geo Fence", dataIndex: 'polypath',  flex: 1, width:5,sortable: true},
		{text: "Route Path", dataIndex: 'routepath',  flex: 1, width:5,sortable: true},
		//{id: 'realtime', text: "Live Tracking", dataIndex: 'realtime',  flex: 1, width:5,sortable: true},
		{id: 'history', text: "History Tracking", dataIndex: 'history',  flex: 1, width:5,sortable: true}
	];

    var loadTabPanel = Ext.getCmp('SAdminPanelVehicles');
    loadTabPanel.add({
			id:'CPanelVehiclesGrid',
			//title:'Customers',
			xtype: 'grid',
			enableColumnHide:false,
			enableColumnMove:false,
			layout: 'fit',
			autoScroll:true,
			loadMask: true,
			store:vehiclesStore,
			plugins: [{
			    ptype: 'rowexpander',
	            rowBodyTpl : [
	                '<p><b>Device Name:</b> {devicename}</p>',
	                '<p><b>Simcard No:</b> {simcardno}</p>',
					'<p><b>Driver Name:</b> {drivername}</p>',
					'<p><b>Driver MobileNo:</b> {drivermobile}</p>'
	            ]
	        }],
			selModel: {
				selType: 'rowmodel',
				mode : 'SINGLE',
				listeners:{
					'selectionchange':function(selmod, record, opt){
						if(selmod.hasSelection()){
							//alert(1);
							Ext.getCmp("gridVEditButton").enable();
							//Ext.getCmp("gridDelButton").enable();
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
					text: 'Edit Vehicle',
					scale: 'small',
					id:'gridVEditButton',
					disabled:true,
					handler:function(){
						//alert(2);
						var gridRec	= Ext.getCmp("CPanelVehiclesGrid").getSelectionModel().getSelection();
						//alert(3);
						if(gridRec.length>0){
							var vehicleArray 			= new Array();
							vehicleArray["todo"]		= "Edit_vehicle";
							vehicleArray["titleStr"]	= "Edit Vehicle";
							vehicleArray["photopath"]= "./images/emptyimg.png";

							vehicleArray['vehicleid'] 	= gridRec[0].get("vehicleid");

							vehicleArray[0]		= gridRec[0].get("customerid");
							vehicleArray[1]		= gridRec[0].get("customername");
							vehicleArray[2]		= gridRec[0].get("deviceid");
							vehicleArray[3] 	= gridRec[0].get("vehicleid");
							vehicleArray[4] 	= gridRec[0].get("vehiclename");
							vehicleArray[5]		= gridRec[0].get("model");
							vehicleArray[6]		= gridRec[0].get("regnno");
							vehicleArray[7]		= gridRec[0].get("insurancedate");
							vehicleArray[8]		= gridRec[0].get("fcdate");
							vehicleArray[9]		= gridRec[0].get("servicedue");
							vehicleArray[10]	= gridRec[0].get("engineno");
							vehicleArray[11]	= gridRec[0].get("chassisno");
							vehicleArray[12]	= gridRec[0].get("driverid");
							vehicleArray[13]	= gridRec[0].get("fuelcapacity");
							vehicleArray[14]	= gridRec[0].get("speedlimit");
							if(gridRec[0].get("rccopy")!=''){
								vehicleArray["rccopy"]	= gridRec[0].get("rccopy");
							}	
							else{
								vehicleArray["rccopy"]= "./images/emptyimg.png";
							}
							if(gridRec[0].get("inscopy")!=''){
								vehicleArray["inscopy"]	= gridRec[0].get("inscopy");
							}	
							else{
								vehicleArray["inscopy"]= "./images/emptyimg.png";
							}
							if(gridRec[0].get("vehiclephoto")!=''){
								vehicleArray["vehiclephoto"]	= gridRec[0].get("vehiclephoto");
							}	
							else{
								vehicleArray["vehiclephoto"]= "./images/emptyimg.png";
							}
							if(gridRec[0].get("permitcopy")!=''){
								vehicleArray["permitcopy"]	= gridRec[0].get("permitcopy");
							}	
							else{
								vehicleArray["permitcopy"]= "./images/emptyimg.png";
							}
							add_edit_vehicle(vehicleArray);
						}
					}
				}]
			}
			],
			columns: vehiclesCol,
			border:false,
			collapsible: false,
			animCollapse: false,
			stripeRows: true,
			dockedItems: [{
				xtype: 'pagingtoolbar',
				id:'CPanelVehiclesGridPbar',
				store: vehiclesStore,
				dock: 'bottom',
				pageSize: 30,
				displayInfo: true
			}]
    }).show();
    loadTabPanel.doLayout();
    //loadTabPanel.setActiveTab(Ext.getCmp("attendGrid"));
    vehiclesStore.load({params:{start:0, limit:30}});

}

function add_edit_vehicle(vehicleArray){
	Ext.define('CustomerNamesStore', {
        extend: 'Ext.data.Model',
		fields: [
			{name: 'customerid',mapping: 'customerid',type:'int'},
			{name: 'customername',mapping: 'customername', type: 'string'}
            ]
		//,idCustomer: 'customerid'
    });

	var vehiclesCustomersStore = new Ext.data.Store({
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

	
	var vehiclepanel = Ext.create('Ext.form.Panel', {
		xtype:'form',
		title:'Details',
		id:'vehiclepanel',
		name:'vehiclepanel',
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
				items: [
					{
						xtype: 'displayfield',
						name: 'displayfield1',
						fieldLabel: 'Customer Name',
						value: '<span style="color:green;">'+vehicleArray[1]+'</span>'
					},{
						xtype: 'textfield',
						fieldLabel:'vehicle Name',
						id:'vehiclename',
						name:'vehiclename',
						//flex:0,
						//allowBlank:false,
						blankText:'Please enter the vehicle\'s Name',
						anchor:'100%',
						readOnly:true,
						listeners:{
							afterrender:function(){
								if(vehicleArray[4]!="")
									this.setValue(vehicleArray[4]);
							}
						}
					},{
						xtype: 'textfield',
						fieldLabel:'Reg No',
						id:'regnno',
						name:'regnno',
						//allowBlank:false,
						//flex:0,
						blankText:'Please enter the Reg No',
						anchor:'100%',
						readOnly:true,
						listeners:{
							afterrender:function(){
								if(vehicleArray[6]!="")
									this.setValue(vehicleArray[6]);
							}
						}
					},{
						xtype: 'textfield',
						fieldLabel:'Model',
						id:'model',
						name:'model',
						//flex:0,
						allowBlank:false,
						blankText:'Please enter the Model Name',
						anchor:'100%',
						readOnly:true,
						listeners:{
							afterrender:function(){
								if(vehicleArray[5]!="")
									this.setValue(vehicleArray[5]);
							}
						}
					},{
						xtype: 'textfield',
						fieldLabel:'Insurance Date',
						id:'insurancedate',
						name:'insurancedate',
						readOnly:true,
						format: 'd-m-Y',
						altFormat:'d/m/Y|d.m.Y',
						blankText:'Please select the Insurance Date',
						listeners:{
							afterrender:function(){
								if(vehicleArray[7]!="")
									this.setValue(vehicleArray[7]);
							}
						}
					},{
						xtype: 'numberfield',
						fieldLabel:'Fuel Capacity',
						id:'fuelcapacity',
						name:'fuelcapacity',
						allowBlank:false,
						blankText:'Fuel Capacity is Required',
						minValue:0,
						maxLength:3,
						allowDecimals:false,
						hideTrigger:true,
						listeners:{
							afterrender:function(){
								if(vehicleArray[13]!="")
									this.setValue(vehicleArray[13]);
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
				items: [
					{
						xtype: 'textfield',
						fieldLabel:'FC date',
						id:'fcdate',
						name:'fcdate',
						readOnly:true,
						format: 'd-m-Y',
						altFormat:'d/m/Y|d.m.Y',
						blankText:'Please select the Fc Date',
						listeners:{
							afterrender:function(){
								if(vehicleArray[8]!="")
									this.setValue(vehicleArray[8]);
							}
						}
					},{
						xtype: 'datefield',
						fieldLabel:'Service Due',
						id:'servicedue',
						name:'servicedue',
						//flex:0,
						//allowBlank:false,
						readOnly:true,
						format: 'd-m-Y',
						altFormat:'d/m/Y|d.m.Y',
						blankText:'Please select the Service Date',
						blankText:'Please enter the Service Due',
						listeners:{
							afterrender:function(){
								if(vehicleArray[9]!="")
									this.setValue(vehicleArray[9]);
							}
						}
					},{
						xtype: 'textfield',
						fieldLabel:'Engine No',
						id:'engineno',
						name:'engineno',
						//flex:0,
						//allowBlank:false,
						blankText:'Please enter the Engine Number',
						anchor:'100%',
						readOnly:true,
						listeners:{
							afterrender:function(){
								if(vehicleArray[10]!="")
									this.setValue(vehicleArray[10]);
							}
						}
					},{
						xtype: 'textfield',
						fieldLabel:'Chassis No',
						id:'chassisno',
						name:'chassisno',
						//flex:0,
						//allowBlank:false,
						blankText:'Please enter the Chassis No',
						anchor:'100%',
						readOnly:true,
						listeners:{
							afterrender:function(){
								if(vehicleArray[11]!="")
									this.setValue(vehicleArray[11]);
							}
						}
					},{
						xtype:'combo',
						fieldLabel:'Driver',
						store: driver_combo_store,
						displayField: 'drivername',
						valueField: 'driverid',
						queryMode:'remote',
						emptyText:'Select Driver...',
						name: 'vehicle_driverid',
						id:'vehicle_driverid',
						triggerAction: 'all',
						forceSelection: true,
						editable:true,
						selectOnFocus:true,
						anchor: '100%',
						//allowBlank:false,
						blankText:'Please select the Driver',
						listeners:{							
							afterrender:function(){
								driver_combo_store.load({
									callback:function(){
										if(vehicleArray[12]!="" && vehicleArray[12]!=0)
											Ext.getCmp("vehicle_driverid").setValue(vehicleArray[12]);
									}
								});
							}
						}
					},{
						xtype: 'numberfield',
						fieldLabel:'Speed Limit',
						id:'speedlimit',
						name:'speedlimit',
						allowBlank:false,
						blankText:'Speed Limit is Required',
						minValue:0,
						maxLength:3,
						allowDecimals:false,
						hideTrigger:true,
						listeners:{
							afterrender:function(){
								if(vehicleArray[14]!="")
									this.setValue(vehicleArray[14]);
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
							fieldLabel:'Upload RC Copy',
							labelWidth:130,
							id:'rccopy',
							//flex:0,
							name:'rccopy',
							anchor: '100%',
							buttonText: 'Select Image...',
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
							text:'View Image',
							style:'margin-left:10px',
							handler:function(){
								view_vehicle_image(vehicleArray["rccopy"]);	
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
							fieldLabel:'Upload Insurance Copy',
							id:'inscopy',
							labelWidth:130,
							//flex:0,
							name:'inscopy',
							anchor: '100%',
							buttonText: 'Select Image...',
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
					columnWidth:.2,
					layout: 'anchor',
						items: [{
							xtype:'button',
							text:'View Image',
							style:'margin-left:10px',
							handler:function(){
								view_vehicle_image(vehicleArray["inscopy"]);
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
							fieldLabel:'Upload Vehicle Photo',
							id:'vehiclephoto',
							//flex:0,
							name:'vehiclephoto',
							labelWidth:130,
							anchor: '100%',
							buttonText: 'Select Image...',
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
							text:'View Image',
							style:'margin-left:10px',
							handler:function(){
								view_vehicle_image(vehicleArray["vehiclephoto"]);
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
							fieldLabel:'Upload Permit Copy',
							id:'permitcopy',
							//flex:0,
							name:'permitcopy',
							labelWidth:130,
							anchor: '100%',
							buttonText: 'Select Image...',
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
							text:'View Image',
							style:'margin-left:10px',
							handler:function(){
								view_vehicle_image(vehicleArray["permitcopy"]);
							}
						}]
				}]			
			}]
		}]	
			
	});	
	
	var vehicletabpanel = {		       			
		xtype:'tabpanel',
		activeTab: 0,
		items: [
			vehiclepanel, documentform
		]		
	}
	
	var vehicleform = {		       			
		xtype:'form',
		id:'vehicleform',
		name:'vehicleform',
		frame:true,
		//border:false,
		//bodyPadding:10,
		/*fieldDefaults: {
			labelAlign: 'right',
			msgTarget: 'side',
			labelSeparator:''
		},
		defaultType: 'textfield',*/
		items: vehicletabpanel	
	}

var vehicleWin = Ext.create('Ext.Window', {
	title: vehicleArray['todo']=="Add_vehicle"?"Add vehicle":"Edit vehicle",
	width:900,
	height:280,
	plain: true,
	modal:true,
	resizable:false,
	border: false,
	layout: {
//        align: 'stretch',
        type: 'fit'
	},
	items: [vehicleform],
	buttons: [{
		text: vehicleArray['todo']=="Add_vehicle"?'Add':'Update',
		handler:function(){
			var formPanel = Ext.getCmp('vehicleform').getForm();
			if(formPanel.isValid()){
				formPanel.submit({
					clientValidation: true,
					url: 'includes/vehicles_ajx.php',
					params: {
						todo: vehicleArray['todo'], vehicleid:vehicleArray['vehicleid'],customerid:vehicleArray[0]
					},
					success: function(form, action) {
						var fileUploadErr= action.result.fileUploadErr;
						if(fileUploadErr!=""){
							Ext.Msg.alert('WARNING', 'Vehicle Info updated successfully.<br><br>But Some document is not uploded.Please see below : <br><br><b>'+fileUploadErr+'</b>');
						}else{
							Ext.Msg.alert('Success', action.result.msg);
						}
						Ext.getCmp("CPanelVehiclesGrid").store.load();
						//vehicleWin.destroy();
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
		hidden:vehicleArray['todo']=="Add_vehicle"?false:true,
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




function view_vehicle_image(vehicle_img){
	var viewvehicleform = {
		xtype:'form',
		id:'viewvehicleform',
		name:'viewvehicleform',
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
								 src:vehicle_img,
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
	var viewvehicleimgWin = Ext.create('Ext.Window', {
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
		items: [viewvehicleform],
		buttons: [{			
			text: 'Close',
			handler: function() {
				viewvehicleimgWin.destroy();
			}
		}]
	}).show();	
}



