function showSettings(){
	if(Ext.getCmp("SAdminPanelSettingsGrid")){
		Ext.getCmp("SAdminPanelSettings").setActiveTab("SAdminPanelSettingsGrid");
		return false;
	}
	var loadTabPanel = Ext.getCmp('SAdminPanelSettings');
	loadTabPanel.add({
		id:'CPanelSettingsGrid',
		layout:'column',
		border:false,
		autoScroll:true,
		defaults: {
			layout: 'anchor',
			defaults: {
				anchor: '100%'
			}
		},
		items:[{
			columnWidth:.35,
			baseCls:'x-plain',
			bodyStyle:'padding:5px',
			height:200,
			items:[{
				xtype:'form',
				title:'Change Password',
				id:'pwd_chng_form',
				height:160,
				frame:true,
				items:[{
					xtype: 'container',
					width:350,
					height:100,
					border:false,
					layout:{
						type:'anchor'
					},
					style:'padding-left:5px;padding-right:15px',
					items: [{
						xtype: 'textfield',
						fieldLabel:'Current password',
						id:'old_pwd',
						name:'old_pwd',
						//flex:0,
						//width:10,
						inputType: 'password',
						allowBlank:false,
						emptyText:'Enter Current Password',
						blankText:'Please enter your old password',
						anchor:'100%',
						listeners:{
							afterrender:function(){
							}
						}
					},{
						xtype: 'textfield',
						fieldLabel:'New password',
						id:'new_pwd',
						name:'new_pwd',
						//flex:0,
						inputType: 'password',
						allowBlank:false,
						minLength:8,
						emptyText:'Enter new password',
						blankText:'Please enter your new password',
						anchor:'100%',
						listeners:{
							afterrender:function(){
							}
						}
					},{
						xtype: 'textfield',
						fieldLabel:'Confirm Password',
						id:'new_pwd2',
						name:'new_pwd2',
						inputType: 'password',
						allowBlank:false,
						minLength:8,
						emptyText:'Confirm password',
						blankText:'Please re-enter your password',
						anchor:'100%',
						listeners:{
							afterrender:function(){
							}
						}
					}]
				}],
			buttons:[{
				xtype:'button',
				scale: 'small',
				//buttonAlign:'right',
				//style:'margin-top:-3px;',
				id:'pwd_id',
				text:'Update',
				handler:function(){
					var formPanel = Ext.getCmp('pwd_chng_form').getForm();
					var oldpwd = Ext.getCmp('old_pwd').getValue();
					var newpwd = Ext.getCmp('new_pwd').getValue();
					var cnfmpwd = Ext.getCmp('new_pwd2').getValue();
					if(formPanel.isValid()){
						if(newpwd!=cnfmpwd){
							Ext.Msg.alert('INFO', "New Password and Re-entered Password not matched..");
							Ext.getCmp('new_pwd').reset();
							Ext.getCmp('new_pwd2').reset();
							return false;
						}
						var formMask 	= Ext.getCmp("pwd_chng_form");
						formMask.getEl().mask("Changing Password...");
						formPanel.submit({
							clientValidation: true,
							url: 'includes/dashboard_ajx.php',
							params: {
								todo: 'Change_Password'
							},
							success: function(form, action) {
								
								if(action.result.success==true)
								{
									Ext.Msg.alert('Success', action.result.msg);
									formMask.getEl().unmask();
									formPanel.reset();
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
							   formMask.getEl().unmask();
							   formPanel.reset();
							} 
						});
					}
					//chnge_pwd();
				}
			}]
			}]
		}]
	}).show();
	loadTabPanel.doLayout();
}