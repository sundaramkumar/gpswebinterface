var glp_latlongArr = new Array();
var hpllPoint 	= "";
var hcurCnt 	= 0;

var polyTask = {
    run: historyDrawPoly,
    interval: 1000 //1 second
}


function historyDrawPoly(){
	console.log("historyDrawPoly");
	var latitude = glp_latlongArr[hcurCnt]['latitude'];
	var longitude= glp_latlongArr[hcurCnt]['longitude'];

	console.log(latitude+"\n"+longitude);

	var curr_latlong_point = new GLatLng(parseFloat(latitude),parseFloat(longitude));
	Ext.getCmp('historyMapPanel').gmap.setCenter(curr_latlong_point, 16);

        var markerClear = false;
    if(hcurCnt==0)
        markerClear = true;

    var markerJson = {title:'Device'};

    Ext.getCmp('historyMapPanel').addMarker(curr_latlong_point,markerJson,markerClear);

	if(hpllPoint !=""){
    	//setTimeout(function(){
    		Ext.getCmp('historyMapPanel').addPolyline(hpllPoint,curr_latlong_point,false,true);
    	//},3000);
		}

    hpllPoint = curr_latlong_point;
    hcurCnt++;
    if(hcurCnt==glp_latlongArr.length)
    	Ext.TaskManager.stop(polyTask);
}

function Show_Gps_Track_History(deviceid){
    var historyForm = Ext.create('Ext.form.Panel', {
		id:'historyForm',
        frame:true,
        border:false,
		height:50,
		padding:10,
        fieldDefaults: {
			labelAlign: 'right',
            msgTarget: 'side',
			labelSeparator:'',
            labelWidth: 120
        },
        defaultType: 'textfield',
        defaults: {
            anchor: '100%'
        },
        items: [{
            xtype: 'container',
            border:false,
            anchor: '100%',
            layout:'column',
            items:[{
                xtype: 'container',
                border:false,
                columnWidth:.3,
                layout: 'anchor',
                items: [{
                    xtype:'combo',
					fieldLabel:'Device',
					store: device_history_combo_store,
					displayField: 'devicename',
					valueField: 'deviceid',
					queryMode:'remote',
					emptyText:'Select Device...',
					labelWidth:60,
					name: 'history_deviceid',
					id:'history_deviceid',
					triggerAction: 'all',
					forceSelection: true,
					editable:true,
					selectOnFocus:true,
					anchor: '100%',
					listeners:{
						select : function(combo, valArr, opt){
							var deviceid	= valArr[0].get("deviceid");
							Ext.getCmp("history_device_start_date").reset();
							Ext.getCmp("history_device_end_date").reset();
							Ext.getCmp("history_device_start_date").getStore().removeAll();
							Ext.getCmp("history_device_end_date").getStore().removeAll();
							//date_history_combo_store.removeAll();
							sdate_history_combo_store.proxy.extraParams = {todo:'Get_Device_Date_List', deviceid:deviceid };
							sdate_history_combo_store.load({params:{deviceid:deviceid}});

							edate_history_combo_store.proxy.extraParams = {todo:'Get_Device_Date_List', deviceid:deviceid };
							edate_history_combo_store.load({params:{deviceid:deviceid}});

						},
						afterrender: function(){
							device_history_combo_store.load({
								callback: function() {
									if (Ext.getCmp('history_deviceid').store.getTotalCount() > 0){
										//alert(Ext.getCmp('plot_project_id').store.getTotalCount());
										//var deviceid 	= Ext.getCmp('history_deviceid').store.getAt(0).get("deviceid");
										//Ext.getCmp('history_deviceid').setValue(deviceid);
										//date_history_combo_store.proxy.extraParams = {todo:'Get_Device_Date_List', deviceid:deviceid };
										//date_history_combo_store.load({params:{deviceid:deviceid}});
									}
								}
							});
						}
					}
                }]
            },{
                xtype: 'container',
                border:false,
                columnWidth:.25,
                layout: 'anchor',
                items: [{
                    xtype:'combo',
					fieldLabel:'Start Date',
					store: sdate_history_combo_store,
					displayField: 'date',
					valueField: 'gpsid',
					queryMode:'remote',
					emptyText:'Select Start Date...',
					labelWidth:60,
					name: 'history_device_start_date',
					id:'history_device_start_date',
					triggerAction: 'all',
					forceSelection: true,
					editable:true,
					selectOnFocus:true,
					anchor: '100%'
                }]
            },{
                xtype: 'container',
                border:false,
                columnWidth:.25,
                layout: 'anchor',
                items: [{
                    xtype:'combo',
					fieldLabel:'End Date',
					store: edate_history_combo_store,
					displayField: 'date',
					valueField: 'gpsid',
					queryMode:'remote',
					emptyText:'Select End Date...',
					labelWidth:60,
					name: 'history_device_end_date',
					id:'history_device_end_date',
					triggerAction: 'all',
					forceSelection: true,
					editable:true,
					selectOnFocus:true,
					anchor: '100%'
                }]
            },{
                xtype: 'container',
                border:false,
                columnWidth:.1,
                layout: 'anchor',
                bodyStyle:'padding-left:10px',
                items: [{
                	xtype:'button',
                	text:'Go Track',
                	handler:function(){
                		glp_latlongArr = new Array();
                		hpllPoint 	= "";
						hcurCnt 	= 0;
						Ext.TaskManager.stop(polyTask);
                		var deviceid 	= Ext.getCmp("history_deviceid").getValue();
                		var startgpsid 	= Ext.getCmp("history_device_start_date").getValue();
                		var endgpsid 	= Ext.getCmp("history_device_end_date").getValue();
                		Ext.Ajax.request({
							url: 'includes/history_ajx.php',
							timeout: 1200000,
							params: {
								todo:'Get_Start_End_Point',
								deviceid : deviceid,
								startgpsid :startgpsid,
								endgpsid :endgpsid
							},
							success: function(response){
								var response = Ext.decode(response.responseText);
								var latlongArr = Ext.decode(response.latlongJson);
								console.log(latlongArr.length);
								if(latlongArr.length>0){
									glp_latlongArr = latlongArr;
									alert("start");
									polyTask = {
										run: historyDrawPoly,
										interval: 1000 //1 second
									};
									Ext.TaskManager.start(polyTask);
								}
							}
						});
                	}
                },{
                	xtype:'button',
                	text:'Stop Track',
                	bodyStyle:'padding-left:10px',
                	handler:function(){
                		Ext.TaskManager.stop(polyTask);
                	}
                }]
            }]
        }]
    });

	var historyWin = Ext.create('Ext.Window', {
        title: 'GPS TRACK HISTORY',
        width:1000,
        height:600,
        plain: true,
		closable:false,
		border: false,
        layout: 'fit',
        items: [{
        	layout:'border',
        	items:[{
        		region:'north',
        		items:[historyForm]
        	},{
        		region:'center',
	        	xtype: 'gmappanel',
	        	id:'historyMapPanel',
				zoomLevel: 16,
				gmapType: 'map',
				mapConfOpts: ['enableScrollWheelZoom','enableDoubleClickZoom','enableDragging'],
				mapControls: ['GSmallMapControl','GMapTypeControl','NonExistantControl'],
				setCenter: {
					//geoCodeAddr: '4 Yawkey Way, Boston, MA, 02215-3409, USA',
					lat:13.035833,
					lng:80.247778,
					marker: {title: 'Device Name'},
		            listeners: {
		                click: function(e){
		                    Ext.Msg.alert('Richmond', 'Richmond Church');
		                }
		            }
				}
			}]
        }],
		buttons: [{
			text: 'Close',
			handler: function() {
				historyWin.destroy();
			}
		}]
    }).show();

}