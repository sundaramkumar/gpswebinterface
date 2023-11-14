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
			{name: 'kidcustomerid',mapping: 'customerid',type:'int'},
			{name: 'kidcustomername',mapping: 'customername', type: 'string'},
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
			{name: 'devicename',mapping: 'devicename', type: 'string'},            
			{name: 'status',mapping: 'status', type: 'string'},
			{name: 'simcardno',mapping: 'simcardno', type: 'string'},
			{name: 'simserialno',mapping: 'simserialno', type: 'string'},
			{name: 'simprovider',mapping: 'simprovider', type: 'string'},
			{name: 'gprsplan',mapping: 'gprsplan', type: 'string'},
			{name: 'gprssettings',mapping: 'gprssettings', type: 'string'},
			{name: 'realtime',mapping: 'realtime', type: 'string'},
			{name: 'history',mapping: 'history', type: 'string'}
            ],
        idKids: 'kidid'
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
		{text: "Customer Id", dataIndex: 'kidcustomerid',hidden:true, flex: 1, sortable: true},
		{text: "Customer Name", dataIndex: 'kidcustomername', flex: 1, sortable: true},
		{text: "Institute Name", dataIndex: 'institutename', flex: 1, sortable: true},
		{text: "City", dataIndex: 'instcity', flex: 1, sortable: true},
		{text: "Mobile", dataIndex: 'mobile', flex: 1, sortable: true},
		{text: "Added On", dataIndex: 'addedon', width:80, sortable: true},
		{text: "Added By", dataIndex: 'addedby', width:80, sortable: true},
		{text: "Live Tracking", dataIndex: 'realtime',  flex: 1, width:5,sortable: true},
		{text: "History Tracking", dataIndex: 'history',  flex: 1, width:5,sortable: true}
		
		/*,
		{id: 'action', text: "<img src='./images/kid.png'/>", width:150, align:'center', sortable: false,
			renderer:function(v){
				return "<span class='tableTextBlue'><b>"+Ext.util.Format.number(v, "0,0.00")+"</b></span>";
			}
		}*/
	];

    var loadTabPanel = Ext.getCmp('SAdminPanelKids');
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
			plugins: [{
			    ptype: 'rowexpander',
	            rowBodyTpl : [
	                '<p><b>Device Name:</b> {devicename}</p>',
	                '<p><b>Simcard No:</b> {simcardno}</p>'
	            ]
	        }],
			selModel: {
				selType: 'rowmodel',
				mode : 'SINGLE',
				listeners:{
					'selectionchange':function(selmod, record, opt){
						if(selmod.hasSelection()){
							//alert(1);
							Ext.getCmp("gridKEditButton").enable();
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
					text: 'Edit Kid',
					scale: 'small',
					id:'gridKEditButton',
					disabled:true,
					handler:function(){
						//alert(2);
						var gridRec	= Ext.getCmp("SAdminPanelKidsGrid").getSelectionModel().getSelection();
						//alert(3);
						if(gridRec.length>0){
							var kidArray 			= new Array();
							kidArray["todo"]		= "Edit_Kid";
							kidArray["titleStr"]	= "Edit Kid";
							kidArray["photopath"]= "./images/emptyimg.png";

							kidArray['kidid'] 	= gridRec[0].get("kidid");

							kidArray[0]	= gridRec[0].get("kidcustomerid");
							kidArray[1]	= gridRec[0].get("kidname");
							kidArray[2]	= gridRec[0].get("mobile");

							kidArray[3] 	= gridRec[0].get("friend1name");
							kidArray[4] 	= gridRec[0].get("friend1phone");
							kidArray[5]		= gridRec[0].get("friend2name");
							kidArray[6]		= gridRec[0].get("friend2phone");
                                                      
							kidArray[7]		= gridRec[0].get("institutename");
							kidArray[8]		= gridRec[0].get("instaddress1");
							kidArray[9]		= gridRec[0].get("instaddress2");
							kidArray[10]	= gridRec[0].get("instaddress3");
							kidArray[11]	= gridRec[0].get("instcity");
							kidArray[12]	= gridRec[0].get("instphone1");
							kidArray[13]	= gridRec[0].get("instphone2");

							kidArray[14]	= gridRec[0].get("photo");
							kidArray[15]	= gridRec[0].get("kidcustomername");

							//alert(kidArray);
							add_edit_kid(kidArray);
						}
					}
				/*},{
					text: 'Delete Kid',
					scale: 'small',
					id:'gridDelButton',
					disabled:true,
					handler:function(){
						var gridRec	= Ext.getCmp("SAdminPanelKidsGrid").getSelectionModel().getSelection();
						if(gridRec.length>0){
							//alert(gridRec);
							delete_kid(gridRec);
						}
					}*/
				}]
			}
			],
			columns: KidsCol,
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
	Ext.define('KidsCustomerNamesStore', {
        extend: 'Ext.data.Model',
		fields: [
			{name: 'customerid',mapping: 'customerid',type:'int'},
			{name: 'customername',mapping: 'customername', type: 'string'}
            ]
		//,idKids: 'customerid'
    });

	var KidsCustomersStore = new Ext.data.Store({
		model: 'KidsCustomerNamesStore',
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
			labelSeparator:''//,
			//labelWidth: 120
		},
		defaultType: 'textfield',
		items: [
			{
				xtype: 'container',
				columnWidth: 1/2,
				layout:{
					type:'anchor'
				},
				border:false,
				style:'padding-left:5px;padding-right:15px',
				items: [
					{
						xtype: 'displayfield',
						name: 'displayfield1',
						fieldLabel: 'Customer Name',
						anchor:'100%',
						value: '<span style="color:green;">'+kidArray[15]+'</span>'
					},{
						xtype: 'textfield',
						fieldLabel:'Kid Name',
						id:'kidname',
						name:'kidname',
						//flex:0,
						allowBlank:false,
						blankText:'Please enter the Kid\'s Name',
						anchor:'100%',
						listeners:{
							afterrender:function(){
								if(kidArray[1]!="")
									this.setValue(kidArray[1]);
							}
						}
					},{
						xtype: 'textfield',
						fieldLabel:'Mobile',
						id:'mobile',
						name:'mobile',
						allowBlank:false,
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
						//flex:0,
						allowBlank:false,
						blankText:'Please enter the Friend Name',
						anchor:'100%',
						listeners:{
							afterrender:function(){
								if(kidArray[3]!="")
									this.setValue(kidArray[3]);
							}
						}
					},{
						xtype: 'textfield',
						fieldLabel:'Friend 1 Phone',
						id:'friend1phone',
						name:'friend1phone',
						//flex:0,
						allowBlank:false,
						blankText:'Please enter the Friend Phone',
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
						//flex:0,
						allowBlank:false,
						blankText:'Please enter the Friend Name',
						anchor:'100%',
						listeners:{
							afterrender:function(){
								if(kidArray[5]!="")
									this.setValue(kidArray[5]);
							}
						}
					},{
						xtype: 'textfield',
						fieldLabel:'Friend 2 Phone',
						id:'friend2phone',
						name:'friend2phone',
						//flex:0,
						allowBlank:false,
						blankText:'Please enter the Friend Phone',
						listeners:{
							afterrender:function(){
								if(kidArray[6]!="")
									this.setValue(kidArray[6]);
							}
						}
					},{
						/*xtype: 'filefield',
						fieldLabel:'Upload Kid Photo',
						id:'photo',
						//flex:0,
						name:'photo',
						anchor: '100%'*/
						
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
								fieldLabel:'Upload Kid Photo',
								id:'photo',
								labelWidth:100,
								name:'photo',
								anchor: '100%',
								buttonText: 'Select Image...',
								allowBlank:true
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
									viewkidphoto(kidArray[14]);
								}
							}]						
						}]
					}]	
			},{
				xtype: 'container',
				columnWidth: 0.5,
				layout:{
					type:'anchor'
				},
				items: [
					{
						xtype: 'textfield',
						fieldLabel:'Institute Name',
						id:'institutename',
						name:'institutename',
						//flex:0,
						allowBlank:false,
						blankText:'Please enter the Institute Name',
						anchor:'100%',
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
						//flex:0,
						name:'instaddress1',
						allowBlank:false,
						anchor:'100%',
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
						//flex:0,
						name:'instaddress2',
						anchor:'100%',
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
						name:'instaddress3',
						anchor:'100%',
						listeners:{
							afterrender:function(){
								if(kidArray[10]!="")
									this.setValue(kidArray[10]);
							}
						}
					},{
						xtype: 'textfield',
						fieldLabel:'City',
						id:'instcity',
						allowBlank:false,
						//flex:0,
						name:'instcity',
						anchor:'100%',
						listeners:{
							afterrender:function(){
								if(kidArray[11]!="")
									this.setValue(kidArray[11]);
							}
						}
					},{
						xtype: 'textfield',
						fieldLabel:'Institute Phone1',
						id:'instphone1',
						name:'instphone1',
						listeners:{
							afterrender:function(){
								if(kidArray[12]!="")
									this.setValue(kidArray[12]);
							}
						}
					},{
						xtype: 'textfield',
						fieldLabel:'Institute Phone2',
						id:'instphone2',
						name:'instphone2',
						listeners:{
							afterrender:function(){
								if(kidArray[13]!="")
									this.setValue(kidArray[13]);
							}
						}
					}
				]
			}
		]
}

var kidWin = Ext.create('Ext.Window', {
	title: kidArray['todo']=="Add_Kid"?"Add Kid":"Edit Kid",
	width:900,
	height:300,
	plain: true,
	modal:true,
	closable:false,
	resizable:false,
	border: false,
	layout: {
//        align: 'stretch',
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
						todo: kidArray['todo'], kidid:kidArray['kidid'],customerid:kidArray[0]
					},
					success: function(form, action) {
						Ext.getCmp("SAdminPanelKidsGrid").getStore().load({params:{start:0, limit:30}});
						var fileUploadErr= action.result.fileUploadErr;
						if(fileUploadErr!=""){
							Ext.Msg.alert('WARNING', 'Kids Info updated successfully.<br><br>But Kids Photo is not uploded.Please see below : <br><br><b>'+fileUploadErr+'</b>');
						}else{
							Ext.Msg.alert('Success', action.result.msg);
							kidWin.destroy();
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

/* function delete_kid(gridRec){
	var kidid 	= gridRec[0].get("kidid");
	var kidname	= gridRec[0].get("kidname");
	var customerid	= gridRec[0].get("customerid");

	Ext.MessageBox.show({
		title:'Confirm Delete?',
		msg: 'Are you sure to delete This Kid <b>[ '+kidname+' ]</b> ?<br><br><span class="tableTextM">Note:- All related information like devices ,Tracking history and everything will be deleted permanently. This action cannot be undone</span>',
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
								msg: response.msg
							});
							Ext.getCmp("SAdminPanelKidsGrid").getStore().loadPage(1);
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
} */


function viewkidphoto(kidphoto){
	var viewkidphotoform = {
		xtype:'form',
		id:'viewkidphotoform',
		name:'viewkidphotoform',
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
								 src:kidphoto,
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
	var viewkidphotoWin = Ext.create('Ext.Window', {
		title: "View Kid Photo",
		width:600,
		height:600,
		plain: true,
		modal:true,
		resizable:false,
		border: false,
		layout: {
			type: 'fit'
		},
		items: [viewkidphotoform],
		buttons: [{			
			text: 'Close',
			handler: function() {
				viewkidphotoWin.destroy();
			}
		}]
	}).show();	
}