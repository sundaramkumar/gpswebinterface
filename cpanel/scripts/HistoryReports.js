function showHistoryReports(){
	if(Ext.getCmp("historyReportGrid")){
		Ext.getCmp("SAdminPanelHistoryReports").setActiveTab("historyReportGrid");
		return false;
	}
	Ext.define('historyrep_store_data', {
		extend: 'Ext.data.Model',
		fields: [
			{name: 'gpsid', type: 'string'},
			{name: 'datetime', type: 'string'},
			{name: 'latitude', type: 'string'},
			{name: 'longitude', type: 'string'},
			{name: 'speed', type: 'string'},
			{name: 'fuel', type: 'string'},
			{name: 'address', type: 'string'}
		]
	});

	var history_rep_store = new Ext.data.Store({
		model: 'historyrep_store_data',
		pageSize: 100,
		proxy: {
			type: 'ajax',
			url: 'includes/reports_ajx.php',
			actionMethods: {
				read: 'POST'
			},
			extraParams: {
				todo : 'Get_History_Reports'
			},
			reader: {
				type: 'json',
				root: 'HISTORY',
				totalProperty: 'totalCount'
			}
		}
	});

	var history_rep_col	= [ new Ext.grid.RowNumberer({ width:50 }),
		{text: "Date Time", dataIndex: 'datetime', width:160, sortable: true},
		//{text: "Latitude", dataIndex: 'latitude', width:120, sortable: false},
		//{text: "Longitude", dataIndex: 'longitude', width:120, sortable: false},
		{text: "Speed", dataIndex: 'speed', width:80, sortable: false},
		{text: "Fuel", dataIndex: 'fuel', width:80, sortable: false},
		{text: "Address", dataIndex: 'address', flex:1, sortable: true}
	];

	var loadTabPanel = Ext.getCmp('SAdminPanelHistoryReports');
    loadTabPanel.add({
		id:'historyReportGrid',
		xtype: 'grid',
		enableColumnHide:false,
		enableColumnMove:false,
		layout: 'fit',
		autoScroll:true,
		loadMask: true,
		store:history_rep_store,
		selModel: {
			selType: 'rowmodel',
			mode : 'SINGLE',
			listeners:{
				'selectionchange':function(selmod, record, opt){
					if(selmod.hasSelection()){

					}
				}
			}
		},
		viewConfig: {
			forceFit:true,
			stripeRows: true,
			emptyText:"<span class='tableTextM'>No Records Found</span>"
		},
		columns: history_rep_col,
		border:false,
		collapsible: false,
		animCollapse: false,
		stripeRows: true,
		tbar:[{
			xtype:'combo',
			fieldLabel:'Device',
			store: device_history_combo_store,
			displayField: 'devicename',
			valueField: 'deviceid',
			queryMode:'remote',
			emptyText:'Select Device...',
			labelWidth:40,
			name: 'history_deviceid',
			id:'history_deviceid',
			triggerAction: 'all',
			forceSelection: true,
			editable:true,
			selectOnFocus:true,
			width: 200
		},'',
		new Ext.ux.form.field.DateTime({
			fieldLabel:'Start Date',
			labelWidth:60,
			style:'margin-top:3px;',
			id: 'startdate',
			name: 'startdate',
			format:'d-m-Y',
			altFormats:'d.m.Y|d/m/Y',
			width: 250,
			allowBlank:false
		}),'',
		new Ext.ux.form.field.DateTime({
			fieldLabel:'End Date',
			labelWidth:60,
			style:'margin-top:3px;',
			id: 'enddate',
			name: 'enddate',
			width: 250,
			allowBlank:false
		}),'',{
			xtype:'buttongroup',
			items: [{
				text:'View',
				scale: 'small',
				handler:function(){
					var deviceid 	= Ext.getCmp("history_deviceid").getValue();
					var startdate	= Ext.getCmp("startdate").getValue();
					var enddate		= Ext.getCmp("enddate").getValue();

					if(deviceid=="" || deviceid == null){
						Ext.Msg.alert("INFo","Please select the Device");
						return false;
					}

					if(startdate=="" || startdate == null){
						Ext.Msg.alert("INFO","Please select the Start Date");
						return false;
					}

					if(enddate=="" || enddate == null){
						Ext.Msg.alert("INFO","Please select the End Date");
						return false;
					}

					startdate	= Ext.util.Format.date(startdate, "Y-m-d H:i:s");
					enddate		= Ext.util.Format.date(enddate, "Y-m-d H:i:s");
					//alert(startdate+"\n"+enddate);
					history_rep_store.proxy.extraParams = {todo:'Get_History_Reports', deviceid:deviceid, startdate:startdate, enddate:enddate, start:0, limit:100 };
					history_rep_store.load({
						params:{deviceid:deviceid, startdate:startdate, enddate:enddate, start:0, limit:100},
						callback: function() {

						}
					});
				}
			}]
		},'->',{
			xtype:'buttongroup',
			items: [{
				text:'Generate Excel',
				scale: 'small',
				handler:function(){
					var deviceid 	= Ext.getCmp("history_deviceid").getValue();
					var startdate	= Ext.getCmp("startdate").getValue();
					var enddate		= Ext.getCmp("enddate").getValue();

					if(deviceid=="" || deviceid == null){
						Ext.Msg.alert("INFo","Please select the Device");
						return false;
					}

					if(startdate=="" || startdate == null){
						Ext.Msg.alert("INFO","Please select the Start Date");
						return false;
					}

					if(enddate=="" || enddate == null){
						Ext.Msg.alert("INFO","Please select the End Date");
						return false;
					}

					startdate	= Ext.util.Format.date(startdate, "Y-m-d H:i:s");
					enddate		= Ext.util.Format.date(enddate, "Y-m-d H:i:s");

					/*Ext.Ajax.request({
						url: 'includes/reports_ajx.php',
						params: {
							todo:'Generate_Excel_History_Reports',
							deviceid : deviceid,
							startdate:startdate,
							enddate:enddate
						},
						timeout: 600000000,
						success:function(response){

						}
					});*/
					Ext.DomHelper.append(document.body, {
						   tag: 'iframe',
						   frameBorder: 0,
						   width: 0,
						   height: 0,
						   css: 'display:none;visibility:hidden;height:1px;',
						   src: 'includes/reports_ajx.php?todo=Generate_Excel_History_Reports&deviceid='+deviceid+'&startdate='+startdate+'&enddate='+enddate
				   });
				}
			}]
		}],
		dockedItems: [{
			xtype: 'pagingtoolbar',
			id:'historyReportGridPbar',
			store: history_rep_store,
			dock: 'bottom',
			pageSize: 100,
			displayInfo: true
		}]
    }).show();
    loadTabPanel.doLayout();
}