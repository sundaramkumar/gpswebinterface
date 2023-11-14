function showspeedReports(){
	if(Ext.getCmp("speedReportsGrid")){
		Ext.getCmp("SAdminPanelspeedReports").setActiveTab("speedReportsGrid");
		return false;
	}

	Ext.define('speedrep_store_data', {
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

	var speed_rep_store = new Ext.data.Store({
		model: 'speedrep_store_data',
		pageSize: 100,
		proxy: {
			type: 'ajax',
			url: 'includes/reports_ajx.php',
			actionMethods: {
				read: 'POST'
			},
			extraParams: {
				todo : 'Get_Speed_Reports'
			},
			reader: {
				type: 'json',
				root: 'HISTORY',
				totalProperty: 'totalCount'
			}
		}
	});

	var speed_rep_col	= [ new Ext.grid.RowNumberer({ width:50 }),
		{text: "Date Time", dataIndex: 'datetime', width:180, sortable: true},
		//{text: "Latitude", dataIndex: 'latitude', width:120, sortable: false},
		//{text: "Longitude", dataIndex: 'longitude', width:120, sortable: false},
		{text: "Speed", dataIndex: 'speed', width:80, sortable: false},
		//{text: "Fuel", dataIndex: 'fuel', width:80, sortable: false},
		{text: "Address", dataIndex: 'address', flex:1, sortable: true}
	];

	var loadTabPanel = Ext.getCmp('SAdminPanelspeedReports');
    loadTabPanel.add({
		id:'speedReportGrid',
		xtype: 'grid',
		enableColumnHide:false,
		enableColumnMove:false,
		layout: 'fit',
		autoScroll:true,
		loadMask: true,
		store:speed_rep_store,
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
		columns: speed_rep_col,
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
			name: 'speed_deviceid',
			id:'speed_deviceid',
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
			id: 'speed_startdate',
			name: 'speed_startdate',
			format:'d-m-Y',
			altFormats:'d.m.Y|d/m/Y',
			width: 250,
			allowBlank:false
		}),'',
		new Ext.ux.form.field.DateTime({
			fieldLabel:'End Date',
			labelWidth:60,
			style:'margin-top:3px;',
			id: 'speed_enddate',
			name: 'speed_enddate',
			width: 250,
			allowBlank:false
		}),'',{
			xtype:'buttongroup',
			items: [{
				text:'View',
				scale: 'small',
				handler:function(){
					var deviceid 	= Ext.getCmp("speed_deviceid").getValue();
					var startdate	= Ext.getCmp("speed_startdate").getValue();
					var enddate		= Ext.getCmp("speed_enddate").getValue();

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
					speed_rep_store.proxy.extraParams = {todo:'Get_Speed_Reports', deviceid:deviceid, startdate:startdate, enddate:enddate, start:0, limit:100 };
					speed_rep_store.load({
						params:{deviceid:deviceid, startdate:startdate, enddate:enddate, start:0, limit:100},
						callback: function() {

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
					show_speed_chart();
				}
			}]
		},'-',{
			xtype:'buttongroup',
			items: [{
				text:'Generate Excel',
				scale: 'small',
				handler:function(){
					var deviceid 	= Ext.getCmp("speed_deviceid").getValue();
					var startdate	= Ext.getCmp("speed_startdate").getValue();
					var enddate		= Ext.getCmp("speed_enddate").getValue();

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
					   src: 'includes/reports_ajx.php?todo=Generate_Excel_Speed_Reports&deviceid='+deviceid+'&startdate='+startdate+'&enddate='+enddate
				   });
				}
			}]
		}],
		dockedItems: [{
			xtype: 'pagingtoolbar',
			id:'speedReportGridPbar',
			store: speed_rep_store,
			dock: 'bottom',
			pageSize: 100,
			displayInfo: true
		}]
    }).show();
    loadTabPanel.doLayout();
}

function show_speed_chart(){
	var speedStore	= Ext.getCmp("speedReportGrid").getStore();
	if(speedStore.getCount()==0){
		Ext.Msg.alert("SELECT FILTER", "Please select the filter critieria");
		return false;
	}

	var speedChartData	= [];
	for(var i=0;i<speedStore.getCount()-1;i++){
		//console.log(speedStore.getAt(i).get("datetime"));
		//console.log(speedStore.getAt(i).get("speed"));
		speedChartData.push({
			datetime:speedStore.getAt(i).get("datetime"),
			speed:Ext.util.Format.round(speedStore.getAt(i).get("speed")),
			fuel:speedStore.getAt(i).get("fuel")
		});
	}


	var speedChartStore = Ext.create('Ext.data.JsonStore', {
		fields: ['datetime', 'speed', 'fuel'],
		data:speedChartData
	});

	var speedChart = Ext.create('Ext.chart.Chart',{
		width:2160,
		height:500,
        xtype: 'chart',
		animate: false,
		store: speedChartStore,
		insetPadding: 30,
		axes: [{
			type: 'Numeric',
			minimum: 0,
			position: 'left',
			fields: ['speed'],
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
			yField: 'speed',
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
					var speed 	= storeItem.get('speed');
					var fuel	= storeItem.get('fuel');
					var tipText = "Speed : "+storeItem.get('speed')+" Kmh";
					if(fuel!='Empty')
						tipText	+= "<br>Fuel : "+storeItem.get('fuel')+" Ltr";
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
        title: 'Speed Chart',
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

function downloadChart(chart){
	Ext.MessageBox.confirm('Confirm Download', 'Would you like to download the chart as an image?', function(choice){
		if(choice == 'yes'){
			chart.save({
				type: 'image/png'
			});
		}
	});
}