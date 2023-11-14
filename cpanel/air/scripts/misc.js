Ext.define('live_device_combo_data', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'deviceid', type: 'int'},
        {name: 'devicename',  type: 'devicename'},
		{name: 'fuelcapacity',  type: 'fuelcapacity'},
		{name: 'speedlimit',  type: 'speedlimit'},
		{name: 'devicetype',  type: 'devicetype'},
		{name: 'vehiclename',  type: 'vehiclename'},
		{name: 'regnno',  type: 'regnno'},
		{name: 'drivername',  type: 'drivername'},
		{name: 'driverMobile',  type: 'driverMobile'},
		{name: 'kidname',  type: 'kidname'},
		{name: 'kidsMobile',  type: 'kidsMobile'}
    ]
});

var live_device_combo_store = new Ext.data.Store({
	model: 'live_device_combo_data',
	proxy: {
		type: 'ajax',
		url: '../includes/combo_ajx.php',
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