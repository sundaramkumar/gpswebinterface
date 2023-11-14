function devices(){
	if(Ext.getCmp("cpanelDashboard")){
		Ext.getCmp("contentPanel").setActiveTab("cpanelDashboard");
		return false;
	}

	var loadTabPanel = Ext.getCmp('contentPanel');

	loadTabPanel.add(
	{
		title:'Dashboard',
		xtype:'tabpanel',
		id:'cpanelDashboard',
		listeners:{
			afterrender:function(){
				showDashboardItems();
			}
		}
	}).show();
//	loadTabPanel.add(
//	{
//		title:'Device Tracking',
//		id:'deviceMapPanel',
//		xtype: 'gmappanel',
//		zoomLevel: 16,
//		gmapType: 'map',
//		mapConfOpts: ['enableScrollWheelZoom','enableDoubleClickZoom','enableDragging'],
//		mapControls: ['GSmallMapControl','GMapTypeControl','NonExistantControl'],
//		setCenter: {
//			//geoCodeAddr: '4 Yawkey Way, Boston, MA, 02215-3409, USA',
//			lat:13.035833,
//			lng:80.247778,
//			marker: {title: 'Device Name'},
//            listeners: {
//                click: function(e){
//                    Ext.Msg.alert('Richmond', 'Richmond Church');
//                }
//            }
//		}
//		/*,
//		markers: [{
//			lat: 13.048,
//			lng: 80.242,
//			marker: {title: 'Boston Museum of Fine Arts'},
//			listeners: {
//				click: function(e){
//					Ext.Msg.alert({title: 'Its fine', text: 'and its art.'});
//				}
//			}
//		},{
//			lat: 13.048,
//			lng: 80.242,
//			marker: {title: 'Northeastern University'}
//		}]*/
//	});
	loadTabPanel.doLayout();
}

var task = {
    run: trackGpsDevice,
    interval: 10000 //1 second
}

function startAutoRefresh(){
    Ext.TaskManager.start(task);
}

function stopAutoRefresh(){
    Ext.TaskManager.stop(task);
}

function trackGpsDevice(){
    if(Ext.getCmp("TracePanel")){
        deviceTrackArr = new Array();
        var records = Ext.getCmp("TracePanel").getView().getChecked();
        if(records.length>0){
            Ext.getCmp("autoRefresh").enable();
            Ext.Array.each(records, function(rec){
                var deviceid = rec.get("id");
                var deviceid = deviceid.replace("Tracking/Realtime/Devices/","");
                if(!deviceTrackArr.inArray(deviceid)){
                    deviceTrackArr[deviceTrackArr.length] = deviceid;
                }
            });

            gpsCook.set('deviceTrackArr',deviceTrackArr);
            setLatLanDevice();
        }else{
            stopAutoRefresh();
            Ext.getCmp("autoRefresh").setText("Start Auto Refresh");
            Ext.getCmp("autoRefresh").disable();
        }
    }
}

function setLatLanDevice(){
    var deviceids = gpsCook.get('deviceTrackArr').join("@");
    Ext.Ajax.request({
        url: 'includes/devices_ajx.php',
        params: {
            todo:'Get_Lat_Lon',
            deviceids : deviceids
        },
        timeout: 600000000,
        success:function(response){
            var deviceRes = Ext.decode(response.responseText);
            if(deviceRes.deviceArrJson!="[]"){
                var deviceArr   = Ext.JSON.decode(deviceRes.deviceArrJson);

                for(var i=0;i<gpsCook.get('deviceTrackArr').length;i++){
                    var latitude = deviceArr[gpsCook.get('deviceTrackArr')[i]]['latitude'];
                    var longitude= deviceArr[gpsCook.get('deviceTrackArr')[i]]['longitude'];
                    //var latlonVal = latlon(latitude,longitude);
                    //var point = new GLatLng(latlonVal.split("@")[0],latlonVal.split("@")[1]);
                    var point = new GLatLng(parseFloat(latitude),parseFloat(longitude));
                    Ext.getCmp('deviceMapPanel').gmap.setCenter(point, 16);

                    var markerJson = {title:gpsCook.get('deviceTrackArr')[i]};

                    var markerListener = {
                        'click':deviceEvent
                    }
                    var markerClear = false;
                    if(i==0)
                        markerClear = true;

                    var markerCenter = Ext.getCmp('deviceMapPanel').getMap().getCenter();
                    Ext.getCmp('deviceMapPanel').addMarker(point,markerJson,markerClear,markerCenter,markerListener);
                    //Ext.getCmp('deviceMapPanel').setCenter({lat: 13.048,lng: 80.242});
                }
            }

        }
    });
}

function deviceEvent(overlay, latlng){
    //var center = this.getCenter();

    alert("speed:40km"+latlng);
}