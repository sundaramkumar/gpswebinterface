var speedGauge;
var fuelGauge;
Ext.onReady(function(){
	gpsCook = new Ext.state.CookieProvider({});
    Ext.tip.QuickTipManager.init();
	
	Ext.create('Ext.Viewport', {
        layout: 'border',
        title: 'Vehicle Tracking System',
        items: [{
			xtype: 'box',
            id: 'header',
            region: 'north',
			contentEl:'north',
			minHeight:80,
			maxHeight:80,
            height: 80
		},{
			region:'center',
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
					xtype:'panel',
					title:'Vehicle Live Tracking',
					frame:true,
					width:500,
					height:600,
					layout:'fit',
					tbar:['Device : ',{
						xtype:'combo',
						store: live_device_combo_store,
						displayField: 'devicename',
						valueField: 'deviceid',
						queryMode:'local',
						emptyText:'Select Device...',
						name: 'tracking_deviceid',
						id:'tracking_deviceid',
						triggerAction: 'all',
						forceSelection: true,
						editable:true,
						selectOnFocus:true,
						width: 200,
						listeners:{
							select:function(combo,records){
								var tracking_deviceid		= Ext.getCmp("tracking_deviceid").getValue();
								var tracking_deviceStore 	= Ext.getCmp("tracking_deviceid").getStore();
								var storeInd 				= tracking_deviceStore.findExact('deviceid',tracking_deviceid);
								var fuelcapacity			= tracking_deviceStore.getAt(storeInd).get("fuelcapacity");

								if(fuelcapacity==null || fuelcapacity=='undefined' || fuelcapacity==undefined)
									drawFuelGauge(90);
								else
									drawFuelGauge(fuelcapacity);
									
								Ext.TaskManager.stopAll();
								prevpointArr[0]	= new Array();
								prevpointArr[0]['lat'] = "";
								prevpointArr[0]['lon'] = "";
								prevpointArr[1]	= new Array();
								prevpointArr[1]['lat'] = "";
								prevpointArr[1]['lon'] = "";								
								redIconFlag = true;
								
								Ext.TaskManager.start(trackingTask);
								
							},
							afterrender:function(){
								live_device_combo_store.load({
									callback: function() {
										
									}
								});
							}
						}
					}],
					html:'<div id="gaugeChart" style="position: absolute;width: 320px;height: 150px; bborder: 1px solid red;bottom: 15px;right: 5px;"><canvas id="speedChart" width="150" height="150">[No canvas support]</canvas><canvas id="fuelChart" width="150" height="150">[No canvas support]</canvas></div>',
					items: [{
						xtype: 'gmappanel',
						id:'trackingDeviceMapPanel',
						zoomLevel: 16,
						gmapType: 'map',
						mapConfOpts: ['enableScrollWheelZoom','enableDoubleClickZoom','enableDragging'],
						mapControls: ['GSmallMapControl','GMapTypeControl','NonExistantControl'],
						setCenter: {
							//geoCodeAddr: 'Giri Road,Chennai',
							lat:13.04836518143244, 
							lng:80.2421048283577,
							marker: {title: 'InnovMax Technologies'}
						},
						listeners:{
							afterrender:function(){

								speedGauge = new RGraph.Gauge('speedChart', 0, 200, 0);

								speedGauge.Set('chart.background.color', '#000');
								speedGauge.Set('chart.border.width', '2');
								speedGauge.Set('chart.scale.decimals', 0);
								speedGauge.Set('chart.tickmarks.small', 50);
								speedGauge.Set('chart.tickmarks.big',5);
								speedGauge.Set('chart.needle.tail',true);
								speedGauge.Set('chart.centerpin.radius',5);
								speedGauge.Set('chart.shadow',false);

								//speedGauge.Set('chart.background.gradient', true);
								//speedGauge.Set('chart.needle.colors','#FF1493');
								//gauge1.Set('chart.title.top', 'Speed');
								//gauge1.Set('chart.title.top.size', 10);
								speedGauge.Set('chart.title.bottom', 'Speed');
								speedGauge.Set('chart.title.bottom.size', '8');
								speedGauge.Set('chart.title.bottom.color', '#666');
								//speedGauge.Set('chart.title.bottom.pos', -15);
								speedGauge.Set('chart.text.size', '6');
								speedGauge.Set('chart.text.color', 'cyan');
								//gauge1.Set('chart.shadow',false);
								//speedGauge.Set('chart.title.bottom.color', '#aaa');
								speedGauge.Set('chart.colors.ranges', [[0, 60, '#009933'], [60, 80, '#DB7093'], [80, 120, '#FFA07A'], [120, 200, '#FF4500']]);
								speedGauge.Draw();

								/*****************
								 *
								 * call fuel chart fn.
								 *
								 **/
								drawFuelGauge(90);
							}
						}
					}]
				}]
			}]
		}],
		listeners:{
			afterrender:function(){
				setTimeout('Ext.get(\'loading\').fadeOut({remove: true});',300);
			}
		},
        renderTo: Ext.getBody()
    });
})


function drawFuelGauge(fuelmaxValue){
	fuelGauge = new RGraph.Gauge('fuelChart', 0,fuelmaxValue, 0);
	fuelGauge.Set('chart.background.color', '#000');
	fuelGauge.Set('chart.border.width', '2');
	fuelGauge.Set('chart.scale.decimals', 0);
	fuelGauge.Set('chart.tickmarks.small', 50);
	fuelGauge.Set('chart.tickmarks.big',5);
	fuelGauge.Set('chart.needle.tail',true);
	fuelGauge.Set('chart.centerpin.radius',5);
	fuelGauge.Set('chart.shadow',false);

	//fuelGauge.Set('chart.background.gradient', true);

	//gauge2.Set('chart.title.top', 'Speed');
	//gauge2.Set('chart.title.top.size', 24);
	fuelGauge.Set('chart.title.bottom', 'Fuel');
	fuelGauge.Set('chart.title.bottom.size', '8');
	fuelGauge.Set('chart.title.bottom.color', '#666');
	fuelGauge.Set('chart.text.size', '6');
	fuelGauge.Set('chart.text.color', 'cyan');
	//fuelGauge.Set('chart.colors.ranges', [[0, 20, '#FF4500'],[20, 40, '#DB7093'],[40, 90, '#8FBC8F']]);
	fuelGauge.Set('chart.colors.ranges', [[0, 5, '#FF4500'],[5, fuelmaxValue, '#009933']]);
	fuelGauge.Draw();
}