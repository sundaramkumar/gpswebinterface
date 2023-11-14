function showCustomers(){
	if(Ext.getCmp("SAdminPanelCustomersGrid")){
		Ext.getCmp("SAdminPanelCustomers").setActiveTab("SAdminPanelCustomersGrid");
		return false;
	}

	Ext.define('customerData', {
        extend: 'Ext.data.Model',
		fields: [
            {name: 'customerid',mapping: 'customerid',type:'int'},
			{name: 'customername',mapping: 'customername', type: 'string'},
            {name: 'contactperson',mapping: 'contactperson', type: 'string'},
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
			{name: 'addedby',mapping: 'addedby', type: 'string'}
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
		{id: 'customer_name', text: "Company", dataIndex: 'customername', flex: 1, sortable: true},
		{id: 'customer_contact', text: "Contact Person", dataIndex: 'contactperson', flex: 1, sortable: true},
		{id: 'customer_mobile', text: "Mobile", dataIndex: 'mobile', flex: 1, sortable: true},
		{id: 'customer_email', text: "Email", dataIndex: 'email', flex: 1, sortable: true},
		{id: 'customer_city', text: "City", dataIndex: 'city',  flex: 1, sortable: true},
		{id: 'customer_addedon', text: "Since", dataIndex: 'addedon', width:80, sortable: true},
		{id: 'customer_addedby', text: "Added By", dataIndex: 'addedby', width:80, sortable: true}/*,
		{id: 'action', text: "<img src='./images/device.png'/>", width:150, align:'center', sortable: false,
			renderer:function(v){
				return "<span class='tableTextBlue'><b>"+Ext.util.Format.number(v, "0,0.00")+"</b></span>";
			}
		}*/
	];

    var loadTabPanel = Ext.getCmp('SAdminPanelCustomers');
    loadTabPanel.add({
			id:'SAdminPanelCustomersGrid',
			//title:'Customers',
			xtype: 'grid',
			enableColumnHide:false,
			enableColumnMove:false,
			layout: 'fit',
			autoScroll:true,
			loadMask: true,
			store:CustomersStore,
			//selModel: new Ext.grid.RowSelectionModel({
			//	singleSelect: true
			//}),
			//viewConfig: { forceFit:true },

			selModel: {
				selType: 'rowmodel',
				mode : 'SINGLE',
				listeners:{
					'selectionchange':function(selmod, record, opt){
						if(record[0].get("customerid")!=0){
							//alert(1);
							Ext.getCmp("gridEditButton").enable();
							Ext.getCmp("gridDelButton").enable();
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
					text: 'Add Customer',
					scale: 'small',
					handler:function(){
						var customerArray 			= new Array();
						customerArray["todo"]		= "Add_Customer";
						customerArray["titleStr"]	= "Add Customer";
						customerArray['customerid'] = 0;

						for(var i=0;i<=11;i++){
							customerArray[i]="";
						}
						add_edit_customer(customerArray);
					}
				},{
					text: 'Edit Customer',
					scale: 'small',
					id:'gridEditButton',
					disabled:true,
					handler:function(){
						//alert(2);
						var gridRec	= Ext.getCmp("SAdminPanelCustomersGrid").getSelectionModel().getSelection();
						//alert(3);
						if(gridRec.length>0){
							//alert(customerArray);
							var tmpStrArray = gridRec[0].get("contactperson").split(" ");
							var customerArray 			= new Array();
							customerArray["todo"]		= "Edit_Customer";
							customerArray["titleStr"]	= "Edit Customer";
							customerArray['customerid'] 	= gridRec[0].get("customerid");
							customerArray[0]	= gridRec[0].get("customername");
							customerArray[1]	= tmpStrArray[1]; //gridRec[0].get("contactperson");
							customerArray[2]	= gridRec[0].get("phone");
							customerArray[3]	= gridRec[0].get("mobile");
							customerArray[4]	= gridRec[0].get("email");
							customerArray[5]	= gridRec[0].get("timezone");
							customerArray[6]	= gridRec[0].get("address1");
							customerArray[7]	= gridRec[0].get("address2");
							customerArray[8]	= gridRec[0].get("address3");
							customerArray[9]	= gridRec[0].get("city");
							customerArray[10]	= gridRec[0].get("pincode");
							customerArray[11]	= tmpStrArray[0]; //gridRec[0].get("salutation");
							//alert(customerArray);
							add_edit_customer(customerArray);
						}
					}
				},{
					text: 'Delete Customer',
					scale: 'small',
					id:'gridDelButton',
					disabled:true,
					handler:function(){
						var gridRec	= Ext.getCmp("SAdminPanelCustomersGrid").getSelectionModel().getSelection();
						if(gridRec.length>0){
							delete_customer(gridRec);
						}
					}
				}]
			}
			],
			columns: CustomersCol,
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
    //loadTabPanel.setActiveTab(Ext.getCmp("attendGrid"));
    CustomersStore.load({params:{start:0, limit:30}});

}

var salutationStore = Ext.create('Ext.data.ArrayStore', {
    fields: ['sal'],
    data : [
			["Mr. "],
			["Mrs. "],
			["Ms. "]
		]
});

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
			labelSeparator:''//,
			//labelWidth: 120
		},
		defaultType: 'textfield',
		items: [
			{
				xtype: 'container',
				columnWidth: 0.5,
				border:false,
				style:'padding-left:5px;padding-right:15px',
				items: [
					{
						xtype: 'textfield',
						fieldLabel:'Company Name',
						name:'customername',
						id:'customername',
						allowBlank:false,
						blankText:'Please enter the Company Name',
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
								width:200,
								grow:false,
								blankText:'Please enter the Contact Person Name',
								listeners:{
									afterrender:function(){
										if(customerArray[1]!="")
											this.setValue(customerArray[1]);
									}
								}
							}]
					},{
						xtype: 'textfield',
						fieldLabel:'Office Phone',
						id:'phone',
						name:'phone',
						//flex:0,
						allowBlank:false,
						blankText:'Please enter the Office Phone No',
						listeners:{
							afterrender:function(){
								if(customerArray[2]!="")
									this.setValue(customerArray[2]);
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
								if(customerArray[3]!="")
									this.setValue(customerArray[3]);
							}
						}
					},{
						xtype: 'textfield',
						fieldLabel:'E-Mail',
						id:'email',
						//flex:0,
						name:'email',
						listeners:{
							afterrender:function(){
								if(customerArray[4]!="")
									this.setValue(customerArray[4]);
							}
						}
					},{
						xtype: 'combo',
						fieldLabel:'Timezone',
						name:'timezone',
						id:'timezone',
						//flex:0,
						//width:100,
						allowBlank:false,
						blankText:'Please select the Timezone',
						store: tzoneStore,
						queryMode: 'local',
						displayField: 'tzname',
						valueField: 'tzname',
						listeners:{
							afterrender:function(){
								if(customerArray[5]!="")
									this.setValue(customerArray[5]);
							}
						}
					}
				]
			},
			{
				xtype: 'container',
				columnWidth: 0.5,
				items: [
					{
						xtype: 'textfield',
						fieldLabel:'Address 1',
						id:'address1',
						//flex:0,
						name:'address1',
						allowBlank:false,
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
						//flex:0,
						name:'address2',
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

						//flex:0,
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
						//flex:0,
						name:'city',
						listeners:{
							afterrender:function(){
								if(customerArray[9]!="")
									this.setValue(customerArray[9]);
							}
						}
					},{
						xtype: 'textfield',
						fieldLabel:'Pincode',
						id:'pincode',
						//flex:0,
						name:'pincode',
						allowBlank:false,
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
	closable:true,
	border: false,
	layout: {
//        align: 'stretch',
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
							   Ext.Msg.alert('Failure', action.result.msg);
					   }
					}
				});
			}
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
		msg: 'Are you sure to delete This Company <b>[ '+customername+' ]</b> ?<br><br><span class="tableTextM">Note:- All related information like devices ,Tracking history and everything will be deleted permanently. This action cannot be undone</span>',
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
								msg: response.msg
							});
							Ext.getCmp("SAdminPanelCustomersGrid").getStore().loadPage(1);
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