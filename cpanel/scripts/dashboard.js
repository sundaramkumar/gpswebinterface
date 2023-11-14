function showDashboardItems(){
	var dashboardPanel = Ext.getCmp('cpanelDashboard');

	Ext.define('dvehicleData', {
		extend: 'Ext.data.Model',
			fields: [
				{name: 'vehicleid',mapping: 'vehicleid',type:'int'},
				{name: 'deviceid',mapping: 'deviceid',type:'int'},
				{name: 'regno',mapping: 'regno', type: 'string'},
				{name: 'vehiclename',mapping: 'vehiclename', type: 'string'},
				{name: 'devicename',mapping: 'devicename', type: 'string'},
				{name: 'ignition',mapping: 'ignition', type: 'string'},
				{name: 'address',mapping: 'address', type: 'string'}
		    ],
		idvehicle: 'vehicleid'
	});

	var DVehicleStore = Ext.create('Ext.data.JsonStore', {
        id: 'DVehicleStore',
        model: 'dvehicleData',
        remoteSort: false,
        proxy: {
            type: 'ajax',
			actionMethods: {
				read: 'POST'
			},
            url: './includes/dashboard_ajx.php',
            extraParams: {
				todo : 'Get_Vehicle_List',
				//devtype:'VTS'
            },
            reader: {
				type: 'json',
                root: 'VEHICLE',
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

	var DVehicleCol	= [	Ext.create('Ext.grid.RowNumberer'),
		{text: "Reg.No", dataIndex: 'regno', width:120, sortable: true},
		{text: "Vehicle Name", dataIndex: 'vehiclename', width:120, sortable: true},
		{text: "Device Name", dataIndex: 'devicename', width:100, sortable: true},
		{text: "Address", dataIndex: 'address',  width:200, sortable: false},
		{text: "Engine", dataIndex: 'ignition',  width:50,sortable: true}
	];

	dashboardPanel.add({
		layout:'column',
		border:false,
		autoScroll:true,
		defaults: {
			layout: 'anchor',
			defaults: {
				anchor: '100%'
			}
		},
		items: [{
			columnWidth: .60,
			baseCls:'x-plain',
			bodyStyle:'padding:5px',
			items:[{
				xtype: 'grid',
				id:'dashVehicleGrid',
				title: 'Vehicles Status',
				frame:true,
				height:200,
				//layout:'fit',
				enableColumnHide:false,
				enableColumnMove:false,
				layout: {
					type:'fit'
				},
				//autoScroll:true,
				//width:400,
				loadMask: true,
				store:DVehicleStore,
				selModel: {
					selType: 'rowmodel',
					mode : 'SINGLE'
				},
				viewConfig: {
					forceFit:true,
					stripeRows: true,
					emptyText:"<span class='tableTextM'>No Records Found</span>"
				},
				columns: DVehicleCol,
				border:false,
				collapsible: false,
				animCollapse: false,
				stripeRows: true,
				tools:[{
					itemId: 'dashrefresh',
					type: 'refresh',
					tooltip:'Reload Vehicles\'s Status',
					handler: function(){
						Ext.getCmp("dashVehicleGrid").getEl().mask("Loading Vehicle Status...");
						DVehicleStore.load({
							callback: function() {
								Ext.getCmp("dashVehicleGrid").getEl().unmask();
							}
						});
					}
				}],
				listeners:{
					afterrender:function(){
						Ext.getCmp("dashVehicleGrid").getEl().mask("Loading Vehicle Status...");
						DVehicleStore.load({
							callback: function() {
								Ext.getCmp("dashVehicleGrid").getEl().unmask();
							}
						});
					}
				}
			}]
		},{
			columnWidth: .40,
			baseCls:'x-plain',
			bodyStyle:'padding:5px',
			items:[{
				xtype:'panel',
				title:'Support',
				height:200,
				frame:true,
				html:'<table width="100%" cellspacing="0" cellpadding="0">'+
					'<tr><td rowspan="6" valign="middle" style="padding:5px;"><img src="./images/00_home_38.png"/></td><td class="tableTextBlack">+91-44-42605439</td></tr>'+
					'<tr><td class="tableTextBlack">+91-9600011990</td></tr>'+
					'<tr><td class="tableTextBlack">+91-9840711124</td></tr>'+
					'<tr><td class="pageHeading">support@innovtrack.com</td></tr>'+
					'<tr><td class="pageHeading"><br/></td></tr>'+
					'<tr><td class="pageHeading">Chat with support Person</td></tr>'+
					'</table>'
			}]
		}
		/*{
			columnWidth: .40,
			baseCls:'x-plain',
			bodyStyle:'padding:5px',
			items:[{
				xtype:'form',
				id:'changepwdFrm',
				title: 'Change Password',
				frame:true,
				fieldDefaults: {
					anchor: '100%',
					labelAlign: 'right',
					msgTarget: 'side',
					labelSeparator:'',
					labelWidth: 120,
					border:false
				},
				items:[{
					xtype:'textfield',
					inputType : 'password',
					fieldLabel:'Old Password',
					id:'oldpwd',
					name:'oldpwd',
					allowBlank:false,
					blankText:'Old Password is Required'
				},{
					xtype:'textfield',
					inputType : 'password',
					fieldLabel:'New Password',
					id:'newpwd',
					name:'newpwd',
					allowBlank:false,
					blankText:'New Password is Required'
				},{
					xtype:'textfield',
					inputType : 'password',
					fieldLabel:'Confirm Password',
					id:'conpwd',
					name:'conpwd',
					allowBlank:false,
					blankText:'Confirm Password is Required'//,
					//vtype: 'password',
					//initialPassField: 'newpwd'
				},{
					anchor:'100%',
					baseCls:'x-plain',
					layout: {
						type: 'hbox',
						padding: 10,
						pack:'end',
                        align:'middle'
					},
					items:[{
						xtype:'button',
						text:'Change Password',
						Float:'right',
						anchor:'20%',
						handler:function(){
							var fp = Ext.getCmp("changepwdFrm").getForm();
                            if(fp.isValid()){
								var newpwd = Ext.getCmp("newpwd").getValue();
								var conpwd = Ext.getCmp("conpwd").getValue();
								if(newpwd!=conpwd){
									Ext.Msg.alert('INFO', "New Password and Confirm Password does not match");
									return false;
								}
								var formPanel	= Ext.getCmp("changepwdFrm").getForm();
								var formMask 	= Ext.getCmp("changepwdFrm");
								formMask.getEl().mask("Changing Password...");
								formPanel.submit({
									clientValidation: true,
									url: 'includes/dashboard_ajx.php',
									params: {
										todo: 'Change_Password'
									},
									success: function(form, action) {
										Ext.Msg.alert('Success', action.result.Msg);
										formMask.getEl().unmask();
									},
									failure: function(form, action) {
										formMask.getEl().unmask();
										switch (action.failureType) {
											case Ext.form.action.Action.CLIENT_INVALID:
												Ext.Msg.alert('Failure', 'Form fields may not be submitted with invalid values');
												break;
											case Ext.form.action.Action.CONNECT_FAILURE:
												Ext.Msg.alert('Failure', 'Ajax communication failed');
												break;
											case Ext.form.action.Action.SERVER_INVALID:
											   Ext.Msg.alert(action.result.title, action.result.Msg);
									   }
									}
								});
							}
						}
					}]
				}]
			}]
		}
		,{
			columnWidth: .40,
			baseCls:'x-plain',
			bodyStyle:'padding:5px',
			items:[{
				xtype:'panel',
				html:'<b>test</b>'
			}]
		}*/
		]
	}).show();
	dashboardPanel.doLayout();
}

function getDeviceAddress(devid,lat,lon){
	Ext.Ajax.request({
		url: 'includes/tracking_ajx.php',
		params: {
			todo:'Get_LanLon_Address',
			latitude : lat,
			longitude : lon
		},
		timeout: 600000000,
		success:function(response){
			var deviceRes 	= Ext.decode(response.responseText);
			var deviceAddress = deviceRes['results'][0]['formatted_address'];
			//deviceAddress = deviceAddress.replace(/\,/gi,"<br>");
			console.log(deviceAddress);
			Ext.get('dboardaddr_'+devid).dom.innerHTML = deviceAddress;
		}
	});

}
