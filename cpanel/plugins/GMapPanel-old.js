/*

This file is part of Ext JS 4

Copyright (c) 2011 Sencha Inc

Contact:  http://www.sencha.com/contact

GNU General Public License Usage
This file may be used under the terms of the GNU General Public License version 3.0 as published by the Free Software Foundation and appearing in the file LICENSE included in the packaging of this file.  Please review the following information to ensure the GNU General Public License version 3.0 requirements will be met: http://www.gnu.org/copyleft/gpl.html.

If you are unsure which license is appropriate for your use, please contact the sales department at http://www.sencha.com/contact.

*/
/**
 * @class Ext.ux.GMapPanel
 * @extends Ext.Panel
 * @author Shea Frederick
 */
Ext.define('Ext.ux.GMapPanel', {
    extend: 'Ext.Panel',

    alias: 'widget.gmappanel',

    requires: ['Ext.window.MessageBox'],

    initComponent : function(){

        var defConfig = {
            plain: true,
            zoomLevel: 3,
            yaw: 180,
            pitch: 0,
            zoom: 0,
            gmapType: 'map',
            border: false
        };

        Ext.applyIf(this,defConfig);

        this.callParent();
    },

    afterRender : function(){

        var wh = this.ownerCt.getSize(),
            point;

        Ext.applyIf(this, wh);

        this.callParent();

        if (this.gmapType === 'map'){
            this.gmap = new GMap2(this.body.dom);
			this.addMapControls();
			this.addOptions();
        }

        if (this.gmapType === 'panorama'){
            this.gmap = new GStreetviewPanorama(this.body.dom);
        }

        if (typeof this.addControl == 'object' && this.gmapType === 'map') {
            this.gmap.addControl(this.addControl);
        }

        if (typeof this.setCenter === 'object') {
            if (typeof this.setCenter.geoCodeAddr === 'string'){
                this.geoCodeLookup(this.setCenter.geoCodeAddr);
            }else{
                if (this.gmapType === 'map'){
                    point = new GLatLng(this.setCenter.lat,this.setCenter.lng);
                    this.gmap.setCenter(point, this.zoomLevel);
                }
                if (typeof this.setCenter.marker === 'object' && typeof point === 'object'){
                    this.addMarker(point,this.setCenter.marker,this.setCenter.marker.clear);
                }
            }
            if (this.gmapType === 'panorama'){
                this.gmap.setLocationAndPOV(new GLatLng(this.setCenter.lat,this.setCenter.lng), {yaw: this.yaw, pitch: this.pitch, zoom: this.zoom});
            }
        }

        GEvent.bind(this.gmap, 'load', this, function(){
            this.onMapReady();
        });

    },
    onMapReady : function(){
        this.addMarkers(this.markers);
        this.addMapControls();
        this.addOptions();
    },
    afterComponentLayout : function(w, h){

        if (typeof this.getMap() == 'object') {
            this.gmap.checkResize();
        }

        this.callParent(arguments);

    },
    setSize : function(width, height, animate){

        if (typeof this.getMap() == 'object') {
            this.gmap.checkResize();
        }

        this.callParent(arguments);

    },
    getMap : function(){

        return this.gmap;

    },
    getCenter : function(){
        return this.getMap().getCenter();
    },
    getCenterLatLng : function(){

        var ll = this.getCenter();
        return {lat: ll.lat(), lng: ll.lng()};

    },
    addMarkers : function(markers) {

        if (Ext.isArray(markers)){
            for (var i = 0; i < markers.length; i++) {
                var mkr_point = new GLatLng(markers[i].lat,markers[i].lng);
                this.addMarker(mkr_point,markers[i].marker,false,markers[i].setCenter, markers[i].listeners);
            }
        }

    },
    addMarker : function(point, marker, clear, center, listeners,deviceArr){
        var evt;
        Ext.applyIf(marker,G_DEFAULT_ICON);

        if (clear === true){
            this.getMap().clearOverlays();
        }
        if (center === true) {
            this.getMap().setCenter(point, this.zoomLevel);
        }

        /*var jsonObj = {title:'Abdul'};
        console.log(marker);
        marker.title = "Abdul";*/
        var mark = new GMarker(point,marker);

        //console.log(listeners);
       /*if (typeof listeners === 'object'){
            for (evt in listeners) {
                if (!listeners.hasOwnProperty(evt)) {
                    continue;
                }
                GEvent.bind(mark, evt, this, listeners[evt]);
            }
        }*/
		var latlang = this.getCenterLatLng();
		var curMap = this.getMap();
		GEvent.addListener(mark, "click", function() {
			Ext.Ajax.request({
				url: 'includes/tracking_ajx.php',
				params: {
					todo:'Get_LanLon_Address',
					latitude : latlang.lat,
					longitude : latlang.lng
				},
				timeout: 600000000,
				success:function(response){
					var deviceRes 	= Ext.decode(response.responseText);
					//alert(deviceRes['results'][0]['formatted_address']);
					var deviceAddress = deviceRes['results'][0]['formatted_address'];
					deviceAddress = deviceAddress.replace(/\,/gi,"<br>");

					var devDetails = "<table cellspacing='0' cellpadding='0' width='250' style='background-color:#ECE9D8'>";
					devDetails += "<tr>";
					devDetails += "<td style='background-color:#FFDFF7;padding:0px;'>";
					devDetails += "<table cellspacing='0' cellpadding='0' border='0' class='tableTextBlack' width='250'>";

					if (Ext.isArray(deviceArr)) {
						var devicename		= deviceArr['devicename'];
						var devicetype		= deviceArr['devicetype'];
						var vehiclename		= deviceArr['vehiclename'];
						var regnno			= deviceArr['regnno'];
						var drivername		= deviceArr['drivername'];
						var driverMobile	= deviceArr['driverMobile'];
						var kidname			= deviceArr['kidname'];
						var kidsMobile		= deviceArr['kidsMobile'];
						var speed			= deviceArr['speed'];
						var fuel			= deviceArr['fuel'];
						var ignition		= deviceArr['ignition'];
						var door			= deviceArr['door'];
						if(devicetype == "VTS"){
							devDetails	+= "<tr style='bbackground-color:#d6e3f2'>";
							devDetails	+= "<td style='padding:2px;'><b>Reg.No :</b> "+regnno+"</td>";
							devDetails	+= "</tr><tr>";
							devDetails	+= "<td style='padding:2px;'><b>Speed : </b>"+speed+" Km/h</td>";
							devDetails	+= "</tr><tr>";
							devDetails	+= "<td style='padding:2px;'><b>Fuel : </b>"+fuel+" Litres</td>";
							devDetails	+= "</tr><tr>";
							devDetails	+= "<td style='padding:2px;'><b>Engine : </b>"+ignition+"</td>";
							devDetails	+= "</tr><tr>";
							devDetails	+= "<td style='padding:2px;'><b>Door is : </b>"+door+"</td>";
							devDetails	+= "</tr>";

							//devDetails	+= "<tr style='bbackground-color:#d6e3f2'>";
							//devDetails	+= "<td width='50%' style='padding:2px;'><b>Vehicle Name :</b> "+vehiclename+"</td>";
							//devDetails	+= "<td width='50%' style='padding:2px;'><b>Reg.No : </b>"+regnno+"</td>";
							//devDetails	+= "</tr>";

							//devDetails	+= "<tr style='bbackground-color:#d6e3f2'>";
							//devDetails	+= "<td width='50%' style='padding:2px;'><b>Driver Name :</b> "+drivername+"</td>";
							//devDetails	+= "<td width='50%' style='padding:2px;'><b>Driver Mobile : </b>"+driverMobile+"</td>";
							//devDetails	+= "</tr>";
						}else{
							devDetails	+= "<tr style='bbackground-color:#d6e3f2'>";
							devDetails	+= "<td style='padding:2px;'><b>Person Name :</b> "+kidname+"</td>";
							devDetails	+= "</tr><tr>";
							devDetails	+= "<td style='padding:2px;'><b>Mobile No : </b>"+kidsMobile+"</td>";
							devDetails	+= "</tr>";
						}
					}
					devDetails	+= "<tr style='background-color:#FFCDE3'><td width='100%' colspan='2' style='padding:2px;'><b>Address : </b><br>"+deviceAddress+"</td></tr>";
					devDetails	+= "</table>";
					devDetails	+= "</td></tr>";
					devDetails	+= "</table>";
					//mark.openInfoWindowHtml(devDetails);
					//mark.openExtInfoWindow(
					//	curMap,
					//	"custom_info_window_red",
					//	"<div class='title'>Details</div>"+
					//	"<div class='section1'><p>See how you can use background colors "+
					//	"to match up with the CSS images to create title bars.</p></div>"+
					//	"<div class='section2'><p>Also, you can do anything you want "+
					//	"within the bounds of CSS.</p></div>"+
					//	"<div class='section1'><p>Including the striped row look you see here.</p></div>",
					//	{beakOffset: 3}
					//);
					mark.openExtInfoWindow(
						curMap,
						"custom_info_window_red",
						"<div class='title'>Info</div>"+
						"<div class='section1'>"+devDetails+"</div>",
						{beakOffset: 3}
					);
				}
			});

		});

        this.getMap().addOverlay(mark);

    },
	addPolyline : function(start_point, end_point, clear, center){
        /*
        map.setCenter(new GLatLng(37.4419, -122.1419), 13);
        var polyline = new GPolyline([
  		  new GLatLng(37.4419, -122.1419),
  		  new GLatLng(37.4519, -122.1519)
		], "#ff0000", 10);
		map.addOverlay(polyline);
        */

        if (clear === true){
            this.getMap().clearOverlays();
        }

        this.getMap().setCenter(end_point, this.zoomLevel);
        var polyline = new GPolyline([start_point,end_point], "#ff0000", 5);
        this.getMap().addOverlay(polyline);
        //console.log(start_point);

    },
    addMapControls : function(){

        if (this.gmapType === 'map') {
            if (Ext.isArray(this.mapControls)) {
                for(var i=0;i<this.mapControls.length;i++){
                    this.addMapControl(this.mapControls[i]);
                }
            }else if(typeof this.mapControls === 'string'){
                this.addMapControl(this.mapControls);
            }else if(typeof this.mapControls === 'object'){
                this.getMap().addControl(this.mapControls);
            }
        }

    },
    addMapControl : function(mc){

        var mcf = window[mc];
        if (typeof mcf === 'function') {
            this.getMap().addControl(new mcf());
        }

    },
    addOptions : function(){

        if (Ext.isArray(this.mapConfOpts)) {
            for(var i=0;i<this.mapConfOpts.length;i++){
                this.addOption(this.mapConfOpts[i]);
            }
        }else if(typeof this.mapConfOpts === 'string'){
            this.addOption(this.mapConfOpts);
        }

    },
    addOption : function(mc){

        var mcf = this.getMap()[mc];
        if (typeof mcf === 'function') {
            this.getMap()[mc]();
        }

    },
    geoCodeLookup : function(addr) {
        this.geocoder = new GClientGeocoder();
        this.geocoder.getLocations(addr, Ext.Function.bind(this.addAddressToMap, this));

    },
    addAddressToMap : function(response) {
        var place, addressinfo, accuracy, point;
        if (!response || response.Status.code != 200) {
            Ext.MessageBox.alert('Error', 'Code '+response.Status.code+' Error Returned');
        }else{
            place = response.Placemark[0];
            addressinfo = place.AddressDetails;
            accuracy = addressinfo.Accuracy;
            if (accuracy === 0) {
                Ext.MessageBox.alert('Unable to Locate Address', 'Unable to Locate the Address you provided');
            }else{
                //if (accuracy < 7) {
                //    Ext.MessageBox.alert('Address Accuracy', 'The address provided has a low accuracy.<br><br>Level '+accuracy+' Accuracy (8 = Exact Match, 1 = Vague Match)');
                //}else{
                    point = new GLatLng(place.Point.coordinates[1], place.Point.coordinates[0]);
                    if (typeof this.setCenter.marker === 'object' && typeof point === 'object'){
                        this.addMarker(point,this.setCenter.marker,this.setCenter.marker.clear,true, this.setCenter.listeners);
                    }
               // }
            }
        }

    }

});
