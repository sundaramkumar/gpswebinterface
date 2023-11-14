function showTechnicians(){
	if(Ext.getCmp("SAdminPanelTechniciansGrid")){
		Ext.getCmp("SAdminPanelTechnicians").setActiveTab("SAdminPanelTechniciansGrid");
		return false;
	}

	Ext.define('technicianData', {
        extend: 'Ext.data.Model',
		fields: [
			{name: 'technicianid',mapping: 'technicianid',type:'int'},
			{name: 'technicianname',mapping: 'technicianname', type: 'string'},           
			{name: 'address1',mapping: 'address1', type: 'string'},
			{name: 'address2',mapping: 'address2', type: 'string'},
			{name: 'address3',mapping: 'address3', type: 'string'},
			{name: 'city',mapping: 'city', type: 'string'},
			{name: 'mobile',mapping: 'mobile', type: 'string'},
			{name: 'landline',mapping: 'landline', type: 'string'},
			{name: 'email',mapping: 'email', type: 'string'},
			{name: 'status',mapping: 'status', type: 'string'},
			{name: 'doj', mapping: "doj",type: 'string'}
			//{name: 'addedby',mapping: 'addedby', type: 'string'}
           ],
        idTechnician: 'technicianid'
    });

    // create the Data Store
    var TechniciansStore = Ext.create('Ext.data.JsonStore', {
        id: 'TechniciansStore',
        pageSize: 30,
        model: 'technicianData',
        remoteSort: false,
        proxy: {
            type: 'ajax',
			actionMethods: {
				read: 'POST'
			},
            url: './includes/technician_ajx.php',
            extraParams: {
				todo : 'Get_Technicians_List'
            },
            reader: {
				type: 'json',
                root: 'TECHNICIANS',
                totalProperty: 'totalCount'
            },
            // sends single sort as multi parameter
            simpleSortMode: true
        },
        sorters: [{
            property: 'technicianname',
            direction: 'ASC'
        }]
    });

	var TechniciansCol	= [	Ext.create('Ext.grid.RowNumberer'),
		{text: "Technician", dataIndex: 'technicianname', flex: 1, sortable: true},
		{text: "Address1", dataIndex: 'address1',  flex: 1, sortable: true},
		{text: "Address2", dataIndex: 'address2',  flex: 1, sortable: true},
		{text: "Address3", dataIndex: 'address3',  flex: 1, sortable: true},
		{text: "City", dataIndex: 'city',  flex: 1, sortable: true},
		{text: "Mobile", dataIndex: 'mobile', flex: 1, sortable: true},
		{text: "Email", dataIndex: 'email', width:140, sortable: true},
		{text: "Status", dataIndex: 'status', width:80, sortable: true},
		//{text: "Landline", dataIndex: 'landline', flex: 1, sortable: true},
		//{text: "Added By", dataIndex: 'addedby', width:80, sortable: true},
		{text: "<img src='./images/device.png'/>", flex: 1, align:'center', sortable: false/*,
			renderer:function(v){
				return "<span class='tableTextBlue'><b>"+Ext.util.Format.number(v, "0,0.00")+"</b></span>";
			}*/
		}
	];

    var loadTabPanel = Ext.getCmp('SAdminPanelTechnicians');
    loadTabPanel.add({
		id:'SAdminPanelTechniciansGrid',
		//title:'Customers',
		xtype: 'grid',
		enableColumnHide:false,
		enableColumnMove:false,
		layout: 'fit',
		autoScroll:true,
		loadMask: true,
		store:TechniciansStore,
		selModel: {
			selType: 'rowmodel',
			mode : 'SINGLE',
			listeners:{
				'selectionchange':function(selmod, record, opt){
					if(record[0].get("technicianid")!=0){
						Ext.getCmp("gridEditButton_technician").enable();
						Ext.getCmp("gridDelButton_technician").enable();
					}
				}
			}
		},
		viewConfig: {
			forceFit:true,
			stripeRows: true,
			emptyText:"<span class='tableTextM'>No Records Found</span>"
		},
		tbar:[new Ext.ux.form.SearchField({
				width:250,
				labelWidth:40,
				fieldLabel:'Search',
				id:'technician_filterid',
				emptyText:'Technician/Mobile/Email/City',
				onTrigger2Click:function(){					
					var technician_filtertext = Ext.getCmp("technician_filterid").getRawValue();
						TechniciansStore.baseParams = {filtertext:technician_filtertext, start:0, limit:30};
						TechniciansStore.load({params:{filtertext:technician_filtertext, start:0, limit:30}});					
				}
			}),'->',{
			xtype:'buttongroup',
			items: [{
				text: 'Add Technician',
				scale: 'small',
				handler:function(){
					var technicianArray 		= new Array();
					technicianArray["todo"]		= "Add_Technician";
					technicianArray["titleStr"]	= "Add Technician";
					technicianArray['technicianid'] = 0;

					for(var i=0;i<=8;i++){
						technicianArray[i]="";
					}
					add_edit_technician(technicianArray);
				}
			 },{
				text: 'Edit Technician',
				scale: 'small',
				id:'gridEditButton_technician',
				disabled:true,
				handler:function(){
					var gridRec	= Ext.getCmp("SAdminPanelTechniciansGrid").getSelectionModel().getSelection();
					if(gridRec.length>0){
						var technicianArray 			= new Array();
						technicianArray["todo"]		= "Edit_Technician";
						technicianArray["titleStr"]	= "Edit Technician";
						technicianArray['technicianid'] 	= gridRec[0].get("technicianid");
						technicianArray[0]	= gridRec[0].get("technicianname");
						technicianArray[1]	= gridRec[0].get("landline");
						technicianArray[2]	= gridRec[0].get("mobile");
						technicianArray[3]	= gridRec[0].get("email");
						technicianArray[4]	= gridRec[0].get("address1");
						technicianArray[5]	= gridRec[0].get("address2");
						technicianArray[6]	= gridRec[0].get("address3");
						technicianArray[7]	= gridRec[0].get("city");
						technicianArray[8]	= gridRec[0].get("status");
						add_edit_technician(technicianArray);
					}
				}
			 },{
				text: 'Delete Technician',
				scale: 'small',
				id:'gridDelButton_technician',
				disabled:true,
				handler:function(){
					var gridRec	= Ext.getCmp("SAdminPanelTechniciansGrid").getSelectionModel().getSelection();
					if(gridRec.length>0){
						delete_technician(gridRec);
					}
				}
			}]
		}
		],
		columns: TechniciansCol,
		border:false,
		collapsible: false,
		animCollapse: false,
		stripeRows: true,
		dockedItems: [{
			xtype: 'pagingtoolbar',
			id:'SAdminPanelTechniciansGridPbar',
			store: TechniciansStore,
			dock: 'bottom',
			pageSize: 30,
			displayInfo: true
		}]
    }).show();
    loadTabPanel.doLayout();
    TechniciansStore.load({params:{start:0, limit:30}});
}

var deviceStatusStore = Ext.create('Ext.data.ArrayStore', {
    fields: ['sal'],
    data : [
		["Enable"],
		["Disable"]			
	]
});

function add_edit_technician(technicianArray){
	var technicianform = {
		xtype:'form',
		id:'technicianform',
		name:'technicianform',
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
				columnWidth: 0.45,
				border:false,
				style:'padding-left:5px;padding-right:15px',
				items: [				
					{
						xtype: 'textfield',
						fieldLabel:'Technician Name',
						name:'technicianname',
						id:'technicianname',
						allowBlank:false,
						blankText:'Please enter the Technician Name',
						listeners:{
							afterrender:function(){
								if(technicianArray[0]!="")
									this.setValue(technicianArray[0]);
							}
						}
					},{
						xtype: 'textfield',
						fieldLabel:'Landline',
						id:'landline',
						name:'landline',					
						blankText:'Please enter the Landline No',
						listeners:{
							afterrender:function(){
								if(technicianArray[1]!="")
									this.setValue(technicianArray[1]);
							}
						}
					},{
						xtype: 'textfield',
						fieldLabel:'Mobile',
						id:'mobile',
						name:'mobile',
						allowBlank:false,
						blankText:'Please enter the Mobile No',
						listeners:{
							afterrender:function(){
								if(technicianArray[2]!="")
									this.setValue(technicianArray[2]);
							}
						}
					},{
						xtype: 'textfield',
						fieldLabel:'E-Mail',
						id:'email',
						vtype:'email',
						name:'email',
						listeners:{
							afterrender:function(){
								if(technicianArray[3]!="")
									this.setValue(technicianArray[3]);
							}
						}
					}
				]
			},{
				xtype: 'container',
				columnWidth: 0.55,
				items: [
					{
						xtype: 'textfield',
						fieldLabel:'Address 1',
						blankText:'Please enter the Address',
						width: 300,
						id:'address1',
						name:'address1',
						allowBlank:false,
						listeners:{
							afterrender:function(){
								if(technicianArray[4]!="")
									this.setValue(technicianArray[4]);
							}
						}
					},{
						xtype: 'textfield',
						fieldLabel:'Address 2',
						blankText:'Please enter the Address',
						width: 300,
						allowBlank:false,
						id:'address2',
						name:'address2',
						listeners:{
							afterrender:function(){
								if(technicianArray[5]!="")
									this.setValue(technicianArray[5]);
							}
						}
					},{
						xtype: 'textfield',
						fieldLabel:'Address 3',
						id:'address3',
						width: 300,
						name:'address3',
						listeners:{
							afterrender:function(){
								if(technicianArray[6]!="")
									this.setValue(technicianArray[6]);
							}
						}
					},{
						xtype: 'textfield',
						fieldLabel:'City',
						id:'city',
						width: 300,
						blankText:'Please enter the city',
						allowBlank:false,
						name:'city',
						listeners:{
							afterrender:function(){
								if(technicianArray[7]!="")
									this.setValue(technicianArray[7]);
							}
						}
					},{
						xtype: 'combo',
						fieldLabel:'Status',
						grow:false,
						id:'devicetype',
						name:'status',
						store: deviceStatusStore,
						queryMode: 'local',
						displayField: 'sal',
						valueField: 'sal',
						id:'status',
						allowBlank:false,
						listeners:{
							afterrender:function(){
								if(technicianArray[8]!="")
									this.setValue(technicianArray[8]);
								else
									this.setValue("Enable"); 
							}
						}
					}
				]
			}
		]
	}

	var technicianWin = Ext.create('Ext.Window', {
		title: technicianArray['todo']=="Add_Technician"?"Add Technician":"Edit Technician",
		width:700,
		height:250,
		plain: true,
		modal:true,
		closable:true,
		border: false,
		layout: {
			type: 'fit'
		},
		items: [technicianform],
		buttons: [{
			text: technicianArray['todo']=="Add_Technician"?'Add':'Update',
			handler:function(){
				var formPanel = Ext.getCmp('technicianform').getForm();
				if(formPanel.isValid()){
					formPanel.submit({
						clientValidation: true,
						url: 'includes/technician_ajx.php',
						params: {
							todo: technicianArray['todo'], technicianid:technicianArray['technicianid']
						},
						success: function(form, action) {
						   Ext.Msg.alert('Success', action.result.msg);
						   technicianWin.destroy();
						   Ext.getCmp("SAdminPanelTechniciansGrid").getStore().loadPage(1);
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
				Ext.getCmp("SAdminPanelTechniciansGrid").getStore().loadPage(1);
			}
		 },{
			text: 'Reset',
			hidden:technicianArray['todo']=="Add_Technician"?false:true,
			handler: function() {
				Ext.getCmp('technicianform').getForm().reset();	
			}
		 },{
			text: 'Close',
			handler: function() {
				technicianWin.destroy();
			}
		}]
	}).show();
	Ext.getCmp('technicianname').focus(true,1000);
}

function delete_technician(gridRec){
	var technicianid 		= gridRec[0].get("technicianid");
	var technicianname	= gridRec[0].get("technicianname");
	Ext.MessageBox.show({
		title:'Confirm Delete?',
		msg: 'Are you sure to delete Technician <b>[ '+technicianname+' ]</b> ?<br><br><span class="tableTextM">This action cannot be undone</span>',
		buttons: Ext.MessageBox.YESNO,
		fn: function(btn, text){
			if(btn=="yes"){
				Ext.Ajax.request({
					url: 'includes/technician_ajx.php',
					timeout: 1200000,
					params: {
						todo:'Delete_Technician',
						technicianid : technicianid,
						technicianname :technicianname
					},
					success: function(response){
						response = Ext.decode(response.responseText);
						if(response.success){
							Ext.MessageBox.show({
								title:'SUCCESS',
								msg: response.msg,
								buttons:Ext.MessageBox.OK
							});
							Ext.getCmp("SAdminPanelTechniciansGrid").getStore().loadPage(1);
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
			Ext.getCmp("SAdminPanelTechniciansGrid").getStore().loadPage(1);
		},
	   icon: Ext.MessageBox.CONFIRM
	});
}