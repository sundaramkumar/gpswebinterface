function showfuelReports(){
	if(Ext.getCmp("speedReportsGrid")){
		Ext.getCmp("SAdminPanelfuelReports").setActiveTab("speedReportsGrid");
		return false;
	}

	Ext.define('fuelrep_store_data', {
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

	var fuel_rep_store = new Ext.data.Store({
		model: 'fuelrep_store_data',
		pageSize: 100,
		proxy: {
			type: 'ajax',
			url: 'includes/reports_ajx.php',
			actionMethods: {
				read: 'POST'
			},
			extraParams: {
				todo : 'Get_Fuel_Reports'
			},
			reader: {
				type: 'json',
				root: 'HISTORY',
				totalProperty: 'totalCount'
			}
		}
	});

	var fuel_rep_col	= [ new Ext.grid.RowNumberer({ width:50 }),
		{text: "Date Time", dataIndex: 'datetime', width:160, sortable: true},
		//{text: "Latitude", dataIndex: 'latitude', width:120, sortable: false},
		//{text: "Longitude", dataIndex: 'longitude', width:120, sortable: false},
		//{text: "Speed", dataIndex: 'speed', width:80, sortable: false},
		{text: "Fuel", dataIndex: 'fuel', width:160, sortable: false,
			renderer:function(fuel){
				return fuel+" Litres";
			}
		},
		{text: "Address", dataIndex: 'address', flex:1, sortable: true}
	];

	var loadTabPanel = Ext.getCmp('SAdminPanelfuelReports');
    loadTabPanel.add({
		id:'fuelReportGrid',
		xtype: 'grid',
		enableColumnHide:false,
		enableColumnMove:false,
		layout: 'fit',
		autoScroll:true,
		loadMask: true,
		store:fuel_rep_store,
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
		columns: fuel_rep_col,
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
			name: 'fuel_deviceid',
			id:'fuel_deviceid',
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
			id: 'fuel_startdate',
			name: 'fuel_startdate',
			format:'d-m-Y',
			altFormats:'d.m.Y|d/m/Y',
			width: 250,
			allowBlank:false
		}),'',
		new Ext.ux.form.field.DateTime({
			fieldLabel:'End Date',
			labelWidth:60,
			style:'margin-top:3px;',
			id: 'fuel_enddate',
			name: 'fuel_enddate',
			width: 250,
			allowBlank:false
		}),'',{
			xtype:'buttongroup',
			items: [{
				text:'View',
				scale: 'small',
				handler:function(){
					var deviceid 	= Ext.getCmp("fuel_deviceid").getValue();
					var startdate	= Ext.getCmp("fuel_startdate").getValue();
					var enddate		= Ext.getCmp("fuel_enddate").getValue();

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
					//Ext.getCmp("fuelReportGrid").getEl().mask("Please wait...Fetching Fuel Report...");
					fuel_rep_store.proxy.extraParams = {todo:'Get_Fuel_Reports', deviceid:deviceid, startdate:startdate, enddate:enddate, start:0, limit:100 };
					fuel_rep_store.load({
						params:{deviceid:deviceid, startdate:startdate, enddate:enddate, start:0, limit:100},
						callback: function() {
							//Ext.getCmp("fuelReportGrid").getEl().mask();
						}
					});
				}
			}]
		},'->',{
			xtype:'buttongroup',
			items: [{
				text:'View Chart',
				scale: 'small',
				handler:function(){
					show_fuel_chart();
				}
			}]
		},'-',{
			xtype:'buttongroup',
			items: [{
				text:'Generate Excel',
				scale: 'small',
				handler:function(){
					var deviceid 	= Ext.getCmp("fuel_deviceid").getValue();
					var startdate	= Ext.getCmp("fuel_startdate").getValue();
					var enddate		= Ext.getCmp("fuel_enddate").getValue();

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
						   src: 'includes/reports_ajx.php?todo=Generate_Excel_Fuel_Reports&deviceid='+deviceid+'&startdate='+startdate+'&enddate='+enddate
				   });
				}
			}]
		}],
		dockedItems: [{
			xtype: 'pagingtoolbar',
			id:'fuelReportGridPbar',
			store: fuel_rep_store,
			dock: 'bottom',
			pageSize: 100,
			displayInfo: true
		}]
    }).show();
    loadTabPanel.doLayout();
}

function show_fuel_chart(){
	var fuelStore	= Ext.getCmp("fuelReportGrid").getStore();
	if(fuelStore.getCount()==0){
		Ext.Msg.alert("SELECT FILTER", "Please select the filter critieria");
		return false;
	}

	var fuelChartData	= [];
	for(var i=0;i<fuelStore.getCount()-1;i++){
		//console.log(speedStore.getAt(i).get("datetime"));

		var fuel	= fuelStore.getAt(i).get("fuel");
		if(fuel=="Empty")
			fuel = 0;
		console.log(Ext.util.Format.round(fuel));
		fuelChartData.push({
			datetime:fuelStore.getAt(i).get("datetime"),
			speed:fuelStore.getAt(i).get("speed"),
			fuel:Ext.util.Format.round(fuel)
		});
	}

	var fuelChartStore = Ext.create('Ext.data.JsonStore', {
		fields: ['datetime', 'speed', 'fuel'],
		data:fuelChartData
	});

	var speedChart = Ext.create('Ext.chart.Chart',{
		width:2160,
		height:500,
        xtype: 'chart',
		animate: false,
		store: fuelChartStore,
		insetPadding: 30,
		axes: [{
			type: 'Numeric',
			minimum: 0,
			position: 'left',
			fields: ['fuel'],
			title: false,
			grid: true,
			label: {
				renderer: Ext.util.Format.numberRenderer('0,0'),
				font: '10px Arial'
			}
		}, {
			type: 'Category',
			position: 'bottom',
			fields: ['datetime'],
			title: false,
			label: {
				font: '11px Arial'/*,
				rotate: {
					degrees: 315
				}*/
			}
		}],
		series: [{
			type: 'line',
			axis: 'left',
			xField: 'datetime',
			yField: 'fuel',
			listeners: {
			  itemmouseup: function(item) {
					//Ext.example.msg('Item Selected', item.value[1] + ' visits on ' + Ext.Date.monthNames[item.value[0]]);
			  }
			},
			tips: {
				trackMouse: true,
				width: 200,
				height: 60,
				renderer: function(storeItem, item) {
					this.setTitle(storeItem.get('datetime'));
					var tipText = "Fuel : "+storeItem.get('fuel')+" Ltr";
					tipText	+= "<br>Speed : "+storeItem.get('speed')+" Kmh";
					this.update(tipText);
				}
			},
			style: {
				fill: '#38B8BF',
				stroke: '#38B8BF',
				'stroke-width': 3
			},
			markerConfig: {
				type: 'circle',
				size: 4,
				radius: 4,
				'stroke-width': 0,
				fill: '#38B8BF',
				stroke: '#38B8BF'
			}
		}]
	});

	var chartWin = Ext.create('Ext.Window', {
        title: 'Fuel Chart',
        width:900,
        height:600,
		autoScroll:true,
		closable:true,
		border: false,
        layout: 'fit',
		items: [{
			xtype:'panel',
			autoScroll:true,
			items:[speedChart]
		}],
		buttonAlign:'right',
		buttons:[{
			text: 'Save Chart',
            handler: function(){ downloadChart(speedChart); }
		},{
			text:'Close',
			handler:function(){
				chartWin.destroy();
			}
		}]
	}).show();
}