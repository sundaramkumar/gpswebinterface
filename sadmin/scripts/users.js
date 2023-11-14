function showUsers(){

	if(Ext.getCmp("SAdminPanelUsersGrid")){
		Ext.getCmp("cpanelDashboard").setActiveTab("SAdminPanelUsersGrid");
		return false;
	}

	Ext.define('userData', {
        extend: 'Ext.data.Model',
		fields: [
			{name: 'userid',mapping: 'userid',type:'int'},
            {name: 'customerid',mapping: 'customerid',type:'int'},
			{name: 'customername',mapping: 'customername',type:'string'},
			{name: 'realname',mapping: 'realname', type: 'string'},
			{name: 'salname',mapping: 'salname', type: 'string'},
			{name: 'contactname',mapping: 'contactname', type: 'string'},
			{name: 'username',mapping: 'username', type: 'string'},
			{name: 'usertype',mapping: 'usertype', type: 'string'},
            {name: 'mobile',mapping: 'mobile', type: 'string'},
            {name: 'email',mapping: 'email', type: 'string'}
			//{name: 'addedby',mapping: 'addedby', type: 'string'}
			/* ,
			{name: 'password',mapping: 'password', type: 'string'} */
            ],
        idUser: 'userid'
    });

    // create the Data Store
    var UsersStore = Ext.create('Ext.data.JsonStore', {
        id: 'UsersStore',
        pageSize: 30,
        model: 'userData',
        remoteSort: false,
        proxy: {
            type: 'ajax',
			actionMethods: {
				read: 'POST'
			},
            url: './includes/users_ajx.php',
            extraParams: {
				todo : 'Get_Users_List'
            },
            reader: {
				type: 'json',
                root: 'CUSTOMERS_U',
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
			{name: 'user_fltr_customerid',mapping: 'customerid',type:'int'},
			{name: 'user_fltr_customername',mapping: 'customername', type: 'string'}
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
	
	var UsersCol	= [	Ext.create('Ext.grid.RowNumberer'),
		{text: "Customer", dataIndex: 'customername', flex: 1, sortable: true},
		{text: "Contactperson", dataIndex: 'contactname', flex: 1, sortable: true},
		{text: "User", dataIndex: 'username', flex: 1, sortable: true},
		{text: "Mobile", dataIndex: 'mobile', flex: 1, sortable: true},
		{text: "User Type", dataIndex: 'usertype', flex: 1, sortable: true},
		{text: "Email", dataIndex: 'email', flex: 1, sortable: true}/* ,
		{id: 'customer_city', text: "City", dataIndex: 'city',  flex: 1, sortable: true},
		{id: 'customer_addedon', text: "Since", dataIndex: 'addedon', width:80, sortable: true},
		{id: 'customer_addedby', text: "Added By", dataIndex: 'addedby', width:80, sortable: true} */
		
		
	];

    var loadTabPanel = Ext.getCmp('SAdminPanelUsers');
	
    loadTabPanel.add({
			id:'SAdminPanelUsersGrid',
			//title:'Customers',
			xtype: 'grid',
			enableColumnHide:false,
			enableColumnMove:false,
			layout: 'fit',
			autoScroll:true,
			loadMask: true,
			store:UsersStore,
			//selModel: new Ext.grid.RowSelectionModel({
			//	singleSelect: true
			//}),
			//viewConfig: { forceFit:true },

			selModel: {
				selType: 'rowmodel',
				mode : 'SINGLE',
				listeners:{
					'selectionchange':function(selmod, record, opt){
						if(record[0].get("userid")!=0){
							//alert(1);
							Ext.getCmp("gridEditButton_users").enable();
							Ext.getCmp("gridDelButton_users").enable();
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
				displayField: 'user_fltr_customername',
				valueField: 'user_fltr_customerid',
				queryMode:'local',
				emptyText:'Select Customer...',
				name: 'user_fltr_customerid',
				id:'user_fltr_customerid',
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
						var user_customerid = Ext.getCmp("user_fltr_customerid").getValue();
						var user_filtertext = Ext.getCmp("user_filterid").getRawValue();
						UsersStore.baseParams = {customerid:user_customerid,filtertext:user_filtertext, start:0, limit:30};
						UsersStore.load({params:{customerid:user_customerid,filtertext:user_filtertext, start:0, limit:30}});
					} 
				}		
			},{
				xtype:'tbspacer',
				width:20
			},new Ext.ux.form.SearchField({
				width:250,
				labelWidth:40,
				fieldLabel:'Search',
				emptyText:'Contactperson/Username/Mobile',
				id:'user_filterid',
				onTrigger2Click:function(){					
					var user_customerid = Ext.getCmp("user_fltr_customerid").getValue();
					var user_filtertext = Ext.getCmp("user_filterid").getRawValue();
					UsersStore.baseParams = {customerid:user_customerid,filtertext:user_filtertext, start:0, limit:30};
					UsersStore.load({params:{customerid:user_customerid,filtertext:user_filtertext, start:0, limit:30}});
				}
			}),
			'->',{
				xtype:'buttongroup',
				items: [{
					text: 'Add User',
					scale: 'small',
					handler:function(){
						var userArray 			= new Array();
						userArray["todo"]		= "Add_User";
						userArray["titleStr"]	= "Add User";
						userArray['userid'] = 0;

						for(var i=0;i<=14;i++){
							userArray[i]="";
						}
						add_edit_user(userArray);
					}
				}]
			},{
				xtype:'buttongroup',
				items: [{
					text: 'Edit user',
					scale: 'small',
					id:'gridEditButton_users',
					disabled:true,
					handler:function(){
						//alert(2);
						var gridRec	= Ext.getCmp("SAdminPanelUsersGrid").getSelectionModel().getSelection();
						//alert(3);
						if(gridRec.length>0){
							//alert(userArray);
							//var tmpStrArray = gridRec[0].get("realname").split(" ");
							
							var userArray 			= new Array();
							userArray["todo"]		= "Edit_User";
							userArray["titleStr"]	= "Edit user";
							userArray['userid'] 	= gridRec[0].get("userid");
							userArray[0]	= gridRec[0].get("customerid");
							userArray[1]	= gridRec[0].get("realname");
							//userArray[1]	= tmpStrArray[1]; //gridRec[0].get("contactperson");
							userArray[2]	= gridRec[0].get("mobile");
							userArray[3]	= gridRec[0].get("email");
							userArray[4]	= gridRec[0].get("salname");
							//userArray[4]	= tmpStrArray[0]; //gridRec[0].get("salutation");
							userArray[5]	= gridRec[0].get("username");
							userArray[6]	= gridRec[0].get("usertype");
							add_edit_user(userArray);
						}
					}
				}]
			},{
				xtype:'buttongroup',
				items: [{
					text: 'Delete User',
					scale: 'small',
					id:'gridDelButton_users',
					disabled:true,
					handler:function(){
						var gridRec	= Ext.getCmp("SAdminPanelUsersGrid").getSelectionModel().getSelection();
						if(gridRec.length>0){
							delete_user(gridRec);
						}
					}
				}]
			}],
			columns: UsersCol,
			border:false,
			collapsible: false,
			animCollapse: false,
			stripeRows: true,
			dockedItems: [{
				xtype: 'pagingtoolbar',
				id:'SAdminPanelUsersGridPbar',
				store: UsersStore,
				dock: 'bottom',
				pageSize: 30,
				displayInfo: true
			}]
    }).show();
    loadTabPanel.doLayout();
    //loadTabPanel.setActiveTab(Ext.getCmp("attendGrid"));
    UsersStore.load({params:{start:0, limit:30}});

}

var salutationStore = Ext.create('Ext.data.ArrayStore', {
    fields: ['sal'],
    data : [
			["Mr. "],
			["Mrs. "],
			["Ms. "]
		]
});

var typeStore = Ext.create('Ext.data.ArrayStore', {
fields: ['type','alice'],
    data : [
			["A","Administrator"],
			["U","User"],
			["E","Executive"]
		]
});

function add_edit_user(userArray){


	Ext.define('CustomerNamesStore_combo', {
        extend: 'Ext.data.Model',
		fields: [
			{name: 'customerid',mapping: 'customerid',type:'int'},
			{name: 'customername',mapping: 'customername', type: 'string'}
            ]
		//,idCustomer: 'customerid'
    });

	var UserCustomersStore_combo = new Ext.data.Store({
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

	var userform = {
		xtype:'form',
		id:'userform',
		name:'userform',
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
				columnWidth: 1,
				border:false,
				style:'padding-left:5px;padding-right:15px',
				layout:{
					type:'anchor',
					anchor:'100%'
				},
				items: [
					{
						xtype:'combo',
						fieldLabel:'Customer Name',
						store: UserCustomersStore_combo,
						displayField: 'customername',
						valueField: 'customerid',
						queryMode:'local',
						emptyText:'Select Customer...',
						blankText:'Please Select the Customer',
						tabIndex:1,
						name: 'customerid',
						id:'customerid',
						//hiddenName: 'customerid_Hid',
						width: 250,
						triggerAction: 'all',
						forceSelection: true,
						editable:true,
						allowBlank: false,
						selectOnFocus:true,
						listeners:{
							afterrender: function(){
								UserCustomersStore_combo.load({
									callback: function() {
										
										if(userArray[0]!="")
											Ext.getCmp("customerid").setValue(userArray[0]); //0);
									}
								});
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
										if(userArray[4]!="")
											this.setValue(userArray[4]);
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
								grow:false,
								blankText:'Please enter the Contact Person Name',
								listeners:{
									afterrender:function(){
										if(userArray[1]!="")
											this.setValue(userArray[1]);
									}
								}
							}]
					},{
						xtype: 'numberfield',
						hideTrigger: 'true',
						minLength:6,
						//maxLength:10,
						fieldLabel:'Mobile',
						blankText:'Please enter the Username',
						allowDecimals: false,
						anchor:'70%',
						//labelWidth: 100,
						id:'mobile',
						name:'mobile',
						allowBlank:false,
						blankText:'Please enter the Mobile No',
						listeners:{
							afterrender:function(){
								if(userArray[2]!="")
									this.setValue(userArray[2]);
							}
						}
					},{
						xtype: 'textfield',
						fieldLabel:'E-Mail',
						id:'email',
						//flex:0,
						vtype:'email',
						name:'email',
						anchor:'70%',
						listeners:{
							afterrender:function(){
								if(userArray[3]!="")
									this.setValue(userArray[3]);
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
							//disabled:(userArray['todo']=="Edit_User")?true:false,
							readonly:(userArray['todo']=="Edit_User")?true:false,
							listeners:{
								afterrender:function(){
									if(userArray[5]!="")
										this.setValue(userArray[5]);
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
							allowBlank:userArray['todo']=="Add_User"?false:true,
							anchor:'70%'
						},{
							xtype: 'textfield',
							fieldLabel:'Confirm Password',
							id:'confpassword',
							inputType: 'password',
							name:'confpassword',
							blankText:'Please re-enter the password',
							allowBlank:userArray['todo']=="Add_User"?false:true,
							anchor:'70%'
						},{
							xtype: 'combo',
							fieldLabel:'Type',
							id:'usertype',
							store: typeStore,
							allowBlank:false,
							blankText:'Please enter the Usertype',
							name:'usertype',
							width: 250,
							forceselection: true,
							queryMode: 'local',
							displayField: 'alice',
							valueField: 'type',
							editable:true,
							listeners:{
								afterrender:function(){
									if(userArray[6]!="")
										this.setValue(userArray[6]);
										
								}
							}
						},
				]
			}
		]
	}

var userWin = Ext.create('Ext.Window', {
	title: userArray['todo']=="Add_User"?"Add User":"Edit user",
	width:500,
	height:300,
	plain: true,
	modal:true,
	//closable:true,
	resizable:false,
	border: false,
	layout: {
//        align: 'stretch',
        type: 'fit'
	},
	items: [userform],
	buttons: [{
		text: userArray['todo']=="Add_User"?'Add':'Update',
		handler:function(){
			var formPanel = Ext.getCmp('userform').getForm();
			if(formPanel.isValid()){
				formPanel.submit({
					clientValidation: true,
					url: 'includes/users_ajx.php',
					params: {
						todo: userArray['todo'], userid:userArray['userid']
					},
					success: function(form, action) {
					   Ext.Msg.alert('Success', action.result.msg);
					   userWin.destroy();
					   Ext.getCmp("SAdminPanelUsersGrid").getStore().loadPage(1);
					   //UsersStore.load({params:{start:0, limit:30}});
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
			Ext.getCmp("SAdminPanelUsersGrid").getStore().loadPage(1);
		}
	},{
		text: 'Reset',
		hidden:userArray['todo']=="Add_User"?false:true,
		handler: function() {
			Ext.getCmp('userform').getForm().reset();
			Ext.getCmp('salutation').setValue("Mr. ");
		}
	},{
		text: 'Close',
		handler: function() {
			userWin.destroy();
		}
	}]
}).show();
Ext.getCmp('username').focus(true,1000);
}

function delete_user(gridRec){
	var userid 		= gridRec[0].get("userid");
	var username	= gridRec[0].get("username");
//alert(userid)
	Ext.MessageBox.show({
		title:'Confirm Delete?',
		msg: 'Are you sure to delete <b>[ '+username+' ]</b>?',
		buttons: Ext.MessageBox.YESNO,
		fn: function(btn, text){
			if(btn=="yes"){
				Ext.Ajax.request({
					url: 'includes/users_ajx.php',
					timeout: 1200000,
					params: {
						todo:'Delete_User',
						userid : userid,
						username :username
					},
					success: function(response){
						response = Ext.decode(response.responseText);
						if(response.success){
							Ext.MessageBox.show({
								title:'SUCCESS',
								msg: response.msg
							});
							Ext.getCmp("SAdminPanelUsersGrid").getStore().loadPage(1);
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
			Ext.getCmp("SAdminPanelUsersGrid").getStore().loadPage(1);
		},
	   icon: Ext.MessageBox.CONFIRM
	});
}