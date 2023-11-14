function showCustomers(){

	if(Ext.getCmp("SAdminPanelCustomersGrid")){
		Ext.getCmp("cpanelDashboard").setActiveTab("SAdminPanelCustomersGrid");
		return false;
	}

	Ext.define('customerData', {
        extend: 'Ext.data.Model',
		fields: [
            {name: 'customerid',mapping: 'customerid',type:'int'},
			{name: 'customername',mapping: 'customername', type: 'string'},
			{name: 'salname',mapping: 'salname', type: 'string'},
            {name: 'contactperson',mapping: 'contactperson', type: 'string'},
			{name: 'contactname',mapping: 'contactname', type: 'string'},
            {name: 'mobile',mapping: 'mobile', type: 'string'},
            {name: 'email',mapping: 'email', type: 'string'},
            {name: 'phone',mapping: 'phone', type: 'string'},
			{name: 'timezone',mapping: 'timezone', type: 'string'},
			{name: 'address1',mapping: 'address1', type: 'string'},
			{name: 'address2',mapping: 'address2', type: 'string'},
			{name: 'address3',mapping: 'address3', type: 'string'},
			{name: 'city',mapping: 'city', type: 'string'},
            {name: 'pincode',mapping: 'pincode', type: 'string'},
			{name: 'addedon',mapping: 'addedon', type: 'string'},
			{name: 'addedby',mapping: 'addedby', type: 'string'},
			{name: 'username',mapping: 'username', type: 'string'},
			{name: 'customerstatus',mapping: 'customerstatus', type: 'string'}
        ],
        idCustomer: 'customerid'
    });

    // create the Data Store
	
    var CustomersStore = Ext.create('Ext.data.JsonStore', {
        id: 'CustomersStore',
        pageSize: 30,
        model: 'customerData',
        remoteSort: false,
        proxy: {
            type: 'ajax',
			actionMethods: {
				read: 'POST'
			},
            url: './includes/customers_ajx.php',
            extraParams: {
				todo : 'Get_Customers_List'
            },
            reader: {
				type: 'json',
                root: 'CUSTOMERS',
                totalProperty: 'totalCount'
            },
            // sends single sort as multi parameter
            simpleSortMode: true
        },
        sorters: [{
            property: 'customername',
            direction: 'ASC'
        }]
    });
	
	var CustomersCol	= [	Ext.create('Ext.grid.RowNumberer'),
		{text: "Customer", dataIndex: 'customername', flex: 1, sortable: true},
		{text: "Contact Person", dataIndex: 'contactname', flex: 1, sortable: true},
		{text: "Mobile", dataIndex: 'mobile', flex: 1, sortable: true},
		{text: "Email", dataIndex: 'email', flex: 1, sortable: true},
		{text: "City", dataIndex: 'city',  flex: 1, sortable: true},
		{text: "Since", dataIndex: 'addedon', width:80, sortable: true},
		{text: "Added By", dataIndex: 'addedby', width:80, sortable: true},
		{text: "Status", dataIndex: 'customerstatus', width:80, sortable: true}
	];

    var loadTabPanel = Ext.getCmp('SAdminPanelCustomers');
	loadTabPanel.add({
		id:'SAdminPanelCustomersGrid',
		xtype: 'grid',
		enableColumnHide:false,
		enableColumnMove:false,
		layout: 'fit',
		autoScroll:true,
		loadMask: true,
		store:CustomersStore,
		/* selModel: new Ext.grid.RowSelectionModel({
		singleSelect: true
		}),
		viewConfig: { forceFit:true }, */

		selModel: {
			selType: 'rowmodel',
			mode : 'SINGLE',
			listeners:{
				'selectionchange':function(selmod, record, opt){
					if(record[0].get("customerid")!=0){
						//alert(record[0].get("customerid"));
						Ext.getCmp("gridEditButton_customer").enable();
						Ext.getCmp("gridDelButton_customer").enable();
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
				width:330,
				fieldLabel:'Search',
				emptyText:'Customer/Contactperson/Mobile/Email/City',
				labelWidth:50,
				id:'cus_filterid',
				onTrigger2Click:function(){
					var cus_filtertext = Ext.getCmp("cus_filterid").getRawValue();
					CustomersStore.baseParams = {filtertext:cus_filtertext, start:0, limit:30};
					CustomersStore.load({params:{filtertext:cus_filtertext, start:0, limit:30}});
				}
			}),
			'->',{
				xtype:'buttongroup',
				items: [{
					text: 'Add Customer',
					scale: 'small',
					handler:function(){
						var customerArray 			= new Array();
						customerArray["todo"]		= "Add_Customer";
						customerArray["titleStr"]	= "Add Customer";
						customerArray['customerid'] = 0;
						for(var i=0;i<=14;i++){
							customerArray[i]="";
						}
						add_edit_customer(customerArray);
					}
				}]
			},{
			xtype:'buttongroup',
			items: [{
				text: 'Edit Customer',
				scale: 'small',
				id:'gridEditButton_customer',
				disabled:true,
				handler:function(){
					var gridRec	= Ext.getCmp("SAdminPanelCustomersGrid").getSelectionModel().getSelection();
					if(gridRec.length>0){
						//var tmpStrArray = gridRec[0].get("contactperson").split(" ");
						var customerArray 			= new Array();
						customerArray["todo"]		= "Edit_Customer";
						customerArray["titleStr"]	= "Edit Customer";
						customerArray['customerid'] = gridRec[0].get("customerid");
						customerArray[0]	= gridRec[0].get("customername");
						customerArray[1]	= gridRec[0].get("contactperson");
						//customerArray[1]	= tmpStrArray[1]; //gridRec[0].get("contactperson");
						customerArray[2]	= gridRec[0].get("phone");
						customerArray[3]	= gridRec[0].get("mobile");
						customerArray[4]	= gridRec[0].get("email");
						customerArray[5]	= gridRec[0].get("timezone");
						customerArray[6]	= gridRec[0].get("address1");
						customerArray[7]	= gridRec[0].get("address2");
						customerArray[8]	= gridRec[0].get("address3");
						customerArray[9]	= gridRec[0].get("city");
						customerArray[10]	= gridRec[0].get("pincode");
						customerArray[11]	= gridRec[0].get("salname");
						//customerArray[11]	= tmpStrArray[0]; //gridRec[0].get("salutation");
						customerArray[12]	= gridRec[0].get("username");
						customerArray[13]	= gridRec[0].get("customerstatus");
						add_edit_customer(customerArray);
					}
				}
			}]
		},{
			xtype:'buttongroup',
			items: [{
				text: 'Delete Customer',
				scale: 'small',
				id:'gridDelButton_customer',
				disabled:true,
				handler:function(){
					var gridRec	= Ext.getCmp("SAdminPanelCustomersGrid").getSelectionModel().getSelection();
					if(gridRec.length>0){
						delete_customer(gridRec);
					}
				}
			}]
		}],
		columns: CustomersCol,
		plugins: [{
            ptype: 'rowexpander',
            rowBodyTpl : [
                '<p><b>Phone:</b> {phone}</p>',
                '<p><b>Address:</b> {address1}<br>',
				'{address2}<br>',
                '{address3}-{pincode}</p>'
            ]
		}],
		border:false,
		collapsible: false,
		animCollapse: false,
		stripeRows: true,
		dockedItems: [{
			xtype: 'pagingtoolbar',
			id:'SAdminPanelCustomersGridPbar',
			store: CustomersStore,
			dock: 'bottom',
			pageSize: 30,
			displayInfo: true
		}]
    }).show();
    loadTabPanel.doLayout();
    CustomersStore.load({params:{start:0, limit:30}});
}
// combo store for salutation
var salutationStore = Ext.create('Ext.data.ArrayStore', {
    fields: ['sal'],
    data : [
			["Mr. "],
			["Mrs. "],
			["Ms. "]
		]
});

//combo store for timezone
var tzoneStore = Ext.create('Ext.data.ArrayStore',{
	fields:["tzname"],
	data:[
		["+12"],
		["+11"],
		["+10"],
		["+9"],
		["+8"],
		["+7"],
		["+6"],
		["+5.3"],
		["+5"],
		["+4"],
		["+3"],
		["+2"],
		["+1"],
		["0"],
		["-1"],
		["-2"],
		["-3"],
		["-4"],
		["-4.5"],
		["-5"],
		["-6"],
		["-7"],
		["-8"],
		["-9"],
		["-10"],
		["-11"],
		["-12"]
	]
});
function add_edit_customer(customerArray){
	var customerform = {
		xtype:'form',
		id:'customerform',
		name:'customerform',
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
						fieldLabel:'Customer',
						name:'customername',
						id:'customername',
						allowBlank:false,
						anchor:'100%',
						blankText:'Please enter the Customer Name',
						listeners:{
							afterrender:function(){
								if(customerArray[0]!="")
									this.setValue(customerArray[0]);
							}
						}
					},
					{
						xtype:'container',
						layout:{
							type:'column'
						},
						border:1,
						items:[{
								xtype: 'combo',
								fieldLabel: 'Contact Person',
								grow:false,
								width:50,
								columnWidth:0.4,
								id:'salutation',
								name:'salutation',
								store: salutationStore,
								//allowBlank:false,
								queryMode: 'local',
								displayField: 'sal',
								valueField: 'sal',
								editable:false,
								listeners:{
									afterrender:function(){
										if(customerArray[11]!="")
											this.setValue(customerArray[11]);
										else
											this.setValue("Mr. ");
									}
								}
							},{
								xtype: 'textfield',
								fieldLabel: '',
								id:'contactperson',
								name:'contactperson',
								labelWidth:1,
								grow:false,
								allowBlank:false,
								columnWidth:0.6,
								anchor:'100%',
								grow:false,
								blankText:'Please enter the Contact Person Name',
								listeners:{
									afterrender:function(){
										if(customerArray[1]!="")
											this.setValue(customerArray[1]);
									}
								}
							}
						]
					},{
						xtype: 'numberfield',
						hideTrigger: 'true',
						minLength:6,
						width:250,
						fieldLabel:'Office Phone',
						id:'phone',
						name:'phone',
						anchor:'100%',
						blankText:'Please enter the Office Phone No',
						listeners:{
							afterrender:function(){
								if(customerArray[2]!="")
									this.setValue(customerArray[2]);
							}
						}
					},{
						xtype: 'numberfield',
						hideTrigger: 'true',
						minLength:6,
						fieldLabel:'Mobile',
						allowDecimals: false,
						width:250,
						id:'mobile',
						name:'mobile',
						allowBlank:false,
						anchor:'100%',
						blankText:'Please enter the Mobile No',
						listeners:{
							afterrender:function(){
								if(customerArray[3]!="")
									this.setValue(customerArray[3]);
							}
						}
					},{
						xtype: 'textfield',
						fieldLabel:'E-Mail',
						id:'email',
						vtype:'email',
						name:'email',
						anchor:'100%',
						listeners:{
							afterrender:function(){
								if(customerArray[4]!="")
									this.setValue(customerArray[4]);
							}
						}
					},{
						xtype: 'textfield',
						fieldLabel:'Username',
						id:'username',
						allowBlank:false,
						blankText:'Please enter the Username',
						name:'username',
						anchor:'70%',
						readonly:(customerArray['todo']=="Edit_Customer")?true:false,
						listeners:{
							afterrender:function(){
								if(customerArray[12]!="")
									this.setValue(customerArray[12]);
							}
						}
					},{
						xtype: 'textfield',
						fieldLabel:'Password',
						id:'password',
						inputType: 'password',
						minLength:8,
						name:'password',
						blankText:'Please enter the Password',
						allowBlank:customerArray['todo']=="Add_Customer"?false:true, //edit customer password field allowblank true
						anchor:'70%'
					},{
						xtype: 'textfield',
						fieldLabel:'Confirm Password',
						id:'confpassword',
						inputType: 'password',
						name:'confpassword',
						blankText:'Please re-enter the Password',
						allowBlank:customerArray['todo']=="Add_Customer"?false:true,
						anchor:'70%'
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
						xtype: 'combo',
						fieldLabel:'Timezone',
						name:'timezone',
						id:'timezone',
						allowBlank:false,
						blankText:'Please select the Timezone',
						store: tzoneStore,
						queryMode: 'local',
						displayField: 'tzname',
						valueField: 'tzname',
						editable: false,
						listeners:{
							afterrender:function(){
								if(customerArray[5]!="")
									this.setValue(customerArray[5]);
								else
									this.setValue("+5.3");									
							}
						}
					},{
						xtype: 'textfield',
						fieldLabel:'Address 1',
						id:'address1',
						name:'address1',
						allowBlank:false,
						blankText:'Please enter the Address',
						anchor:'100%',
						listeners:{
							afterrender:function(){
								if(customerArray[6]!="")
									this.setValue(customerArray[6]);
							}
						}
					},{
						xtype: 'textfield',
						fieldLabel:'Address 2',
						allowBlank:false,
						id:'address2',
						name:'address2',
						blankText:'Please enter the Address',
						anchor:'100%',
						listeners:{
							afterrender:function(){
								if(customerArray[7]!="")
									this.setValue(customerArray[7]);
							}
						}
					},{
						xtype: 'textfield',
						fieldLabel:'Address 3',
						id:'address3',
						anchor:'100%',
						name:'address3',
						listeners:{
							afterrender:function(){
								if(customerArray[8]!="")
									this.setValue(customerArray[8]);
							}
						}
					},{
						xtype: 'textfield',
						fieldLabel:'City',
						id:'city',
						allowBlank:false,
						blankText:'Please enter the City',
						name:'city',
						anchor:'80%',
						listeners:{
							afterrender:function(){
								if(customerArray[9]!="")
									this.setValue(customerArray[9]);
							}
						}
					},{
						xtype: 'numberfield',
						hideTrigger: 'true',
						minLength:4,
						fieldLabel:'Pincode',
						id:'pincode',
						name:'pincode',
						anchor:'60%',
						allowBlank:false,
						blankText:'Please enter the Pincode',
						listeners:{
							afterrender:function(){
								if(customerArray[10]!="")
									this.setValue(customerArray[10]);
							}
						}
					}
				]
			}
		]
	}

	var customerWin = Ext.create('Ext.Window', {
		title: customerArray['todo']=="Add_Customer"?"Add Customer":"Edit Customer",
		width:900,
		height:300,
		plain: true,
		modal:true,
		resizable:false,
		border: false,
		layout: {
			type: 'fit'
		},
		items: [customerform],
		buttons: [{
			text: customerArray['todo']=="Add_Customer"?'Add':'Update',
			handler:function(){
				var formPanel = Ext.getCmp('customerform').getForm();
				if(formPanel.isValid()){
					formPanel.submit({
						clientValidation: true,
						url: 'includes/customers_ajx.php',
						params: {
							todo: customerArray['todo'], customerid:customerArray['customerid']
						},
						success: function(form, action) {
						   Ext.Msg.alert('Success', action.result.msg);
						   customerWin.destroy();
						   Ext.getCmp("SAdminPanelCustomersGrid").getStore().loadPage(1);
						   //CustomersStore.load({params:{start:0, limit:30}});
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
								   Ext.Msg.alert('Error', action.result.msg);
						   }
						}
					});
				}
				Ext.getCmp("SAdminPanelCustomersGrid").getStore().loadPage(1);
			}
		},{
			text: 'Reset',
			hidden:customerArray['todo']=="Add_Customer"?false:true,
			handler: function() {
				Ext.getCmp('customerform').getForm().reset();
				Ext.getCmp('salutation').setValue("Mr. ");
			}
		},{
			text: 'Close',
			handler: function() {
				customerWin.destroy();
			}
		}]
	}).show();
	Ext.getCmp('customername').focus(true,1000);
}

function delete_customer(gridRec){
	var customerid 		= gridRec[0].get("customerid");
	var customername	= gridRec[0].get("customername");
	Ext.MessageBox.show({
		title:'Confirm Delete?',
		msg: 'Are you sure to Delete <b>[ '+customername+' ]</b>  ?<br><br><span class="tableTextM">Note:- Can not be deleted if this customer have like devices , Vehicles, etc.</span>',
		buttons: Ext.MessageBox.YESNO,
		fn: function(btn, text){
			if(btn=="yes"){
				Ext.Ajax.request({
					url: 'includes/customers_ajx.php',
					timeout: 1200000,
					params: {
						todo:'Delete_Customer',
						customerid : customerid,
						customername :customername
					},
					success: function(response){
						response = Ext.decode(response.responseText);
						if(response.success){
							Ext.MessageBox.show({
								title:'SUCCESS',
								msg: response.msg,
								buttons:Ext.MessageBox.OK
							});
							Ext.getCmp("SAdminPanelCustomersGrid").getStore().loadPage(1);
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
			Ext.getCmp("SAdminPanelCustomersGrid").getStore().loadPage(1);
		},
	   icon: Ext.MessageBox.CONFIRM
	});
}

function status_customer(customerid, currentstatus){
	Ext.MessageBox.show({
		title:'Confirmatoin',
		msg: '<b>Are you sure to <b>[ '+currentstatus+' ]</b> this Customer?',
		buttons: Ext.MessageBox.YESNO,
		fn: function(btn, text){
		
			if(btn=="yes"){
			
				Ext.Ajax.request({
					url: 'includes/customers_ajx.php',
					timeout: 1200000,
					params: {
						todo:'Status_Customer',
						customerid   : customerid,
						customerstatus:currentstatus
					},
					success: function(response){
						response = Ext.decode(response.responseText);
						if(response.success){
							Ext.MessageBox.show({
								title:'SUCCESS',
								msg: response.msg,
								buttons:Ext.MessageBox.OK
								
							});
							Ext.getCmp("SAdminPanelCustomersGrid").getStore().loadPage(1);
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
			Ext.getCmp("SAdminPanelCustomersGrid").getStore().loadPage(1);
		},
		icon: Ext.MessageBox.CONFIRM
	});

}