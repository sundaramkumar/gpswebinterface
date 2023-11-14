Ext.define('live_device_combo_data', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'deviceid', type: 'int'},
        {name: 'devicename',  type: 'devicename'},
		{name: 'routeid', type: 'int'},
		{name: 'fenceid', type: 'int'},
		{name: 'fuelcapacity',  type: 'fuelcapacity'},
		{name: 'speedlimit',  type: 'speedlimit'},
		{name: 'devicetype',  type: 'devicetype'},
		{name: 'vehicleid',  type: 'vehicleid'},
		{name: 'vehiclename',  type: 'vehiclename'},
		{name: 'regnno',  type: 'regnno'},
		{name: 'drivername',  type: 'drivername'},
		{name: 'driverMobile',  type: 'driverMobile'},
		{name: 'kidname',  type: 'kidname'},
		{name: 'kidsMobile',  type: 'kidsMobile'},
		{name: 'ignition_v',  type: 'ignition_v'},
		{name: 'fuelstatus',  type: 'fuelstatus'}

    ]
});

var live_device_combo_store = new Ext.data.Store({
	model: 'live_device_combo_data',
	proxy: {
		type: 'ajax',
		url: 'includes/combo_ajx.php',
		actionMethods: {
			read: 'POST'
		},
		extraParams: {
			todo : 'Get_Device_List'
		},			
		reader: {
			type: 'json',
			root: 'DEVICES'
		}
	}
});

var brdg_assign_combo_store = new Ext.data.Store({
	model: 'live_device_combo_data',
	proxy: {
		type: 'ajax',
		url: 'includes/combo_ajx.php',
		actionMethods: {
			read: 'POST'
		},
		extraParams: {
			todo : 'Get_Vehicle_List_assign'
		},			
		reader: {
			type: 'json',
			root: 'VEHICLES'
		}
	}
});

var fence_route_assign_combo = new Ext.data.Store({
	model: 'live_device_combo_data',
	proxy: {
		type: 'ajax',
		url: 'includes/combo_ajx.php',
		actionMethods: {
			read: 'POST'
		},
		extraParams: {
			todo : 'Get_Vehicle_fence_route'
		},			
		reader: {
			type: 'json',
			root: 'VEHICLES'
		}
	}
});

Ext.define('device_history_combo_data', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'deviceid', type: 'int'},
		{name: 'routeid', type: 'int'},
		{name: 'fenceid', type: 'int'},
        {name: 'devicename',  type: 'devicename'},
		{name: 'fuelcapacity',  type: 'fuelcapacity'},
		{name: 'speedlimit',  type: 'speedlimit'},
		{name: 'devicetype',  type: 'devicetype'},
		{name: 'vehicleid',  type: 'vehicleid'},
		{name: 'vehiclename',  type: 'vehiclename'},
		{name: 'regnno',  type: 'regnno'},
		{name: 'drivername',  type: 'drivername'},
		{name: 'driverMobile',  type: 'driverMobile'},
		{name: 'kidname',  type: 'kidname'},
		{name: 'kidsMobile',  type: 'kidsMobile'}
    ]
});

var device_history_combo_store = new Ext.data.Store({
	model: 'device_history_combo_data',
	proxy: {
		type: 'ajax',
		url: 'includes/combo_ajx.php',
		actionMethods: {
			read: 'POST'
		},
		extraParams: {
			todo : 'Get_Device_List'
		},			
		reader: {
			type: 'json',
			root: 'DEVICES'
		}
	}
});


Ext.define('driver_combo_data', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'driverid', type: 'string'},
        {name: 'drivername',  type: 'string'}
    ]
});

var driver_combo_store = new Ext.data.Store({
	model: 'driver_combo_data',
	proxy: {
		type: 'ajax',
		url: 'includes/combo_ajx.php',
		actionMethods: {
			read: 'POST'
		},
		extraParams: {
			todo : 'Get_Driver_List'
		},			
		reader: {
			type: 'json',
			root: 'DRIVERS'
		}
	}
});

Ext.define('sdate_history_combo_data', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'gpsid', type: 'int'},
        {name: 'date',  type: 'string'}
    ]
});

var sdate_history_combo_store = new Ext.data.Store({
	model: 'sdate_history_combo_data',
	proxy: {
		type: 'ajax',
		url: 'includes/combo_ajx.php',
		actionMethods: {
			read: 'POST'
		},
		extraParams: {
			todo : 'Get_Device_Date_List'
		},			
		reader: {
			type: 'json',
			root: 'DATES'
		}
	}
});

Ext.define('edate_history_combo_data', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'gpsid', type: 'int'},
        {name: 'date',  type: 'string'}
    ]
});

var edate_history_combo_store = new Ext.data.Store({
	model: 'edate_history_combo_data',
	proxy: {
		type: 'ajax',
		url: 'includes/combo_ajx.php',
		actionMethods: {
			read: 'POST'
		},
		extraParams: {
			todo : 'Get_Device_Date_List'
		},			
		reader: {
			type: 'json',
			root: 'DATES'
		}
	}
});


Ext.define('polygon_path_data', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'fenceid', type: 'int'},
        {name: 'pathname',  type: 'string'},
		{name: 'polycoords',  type: 'string'}
    ]
});

var polygon_path_store = new Ext.data.Store({
	model: 'polygon_path_data',
	proxy: {
		type: 'ajax',
		url: 'includes/combo_ajx.php',
		actionMethods: {
			read: 'POST'
		},
		extraParams: {
			todo : 'Get_Polygon_Path_List'
		},			
		reader: {
			type: 'json',
			root: 'POLYGON'
		}
	}
});

Ext.define('route_combo_data', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'routeid', type: 'int'},
        {name: 'routename',  type: 'string'},
		{name: 'routedata',  type: 'string'}
    ]
});

var route_combo_store = new Ext.data.Store({
	model: 'route_combo_data',
	proxy: {
		type: 'ajax',
		url: 'includes/combo_ajx.php',
		actionMethods: {
			read: 'POST'
		},
		extraParams: {
			todo : 'Get_Route_List'
		},			
		reader: {
			type: 'json',
			root: 'ROUTE'
		}
	}
});

var Brdg_SaveRouteStore = new Ext.data.Store({
	model: 'SaveRouteStore',
	proxy: {
		type: 'ajax',
		url: 'includes/combo_ajx.php',
		actionMethods: {
			read: 'POST'
		},
		extraParams: {
			todo : 'Get_Save_Route'
			
		},
		reader: {
			type: 'json',
			root: 'SAVEROUTE'
		}
	}
});
