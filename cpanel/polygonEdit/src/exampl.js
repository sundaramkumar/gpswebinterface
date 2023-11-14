  function initialize2 () {
    var map = new google.maps.Map(document.getElementById("map"),{zoom: 14,
                                                                  center: new google.maps.LatLng(50.909528, 34.811726),
                                                                  mapTypeId: google.maps.MapTypeId.ROADMAP
                                                                 });
    var followLine1 = new google.maps.Polyline({
      clickable: false,
      map : map,
      path: [],
      strokeColor: "#787878",
      strokeOpacity: 1,
      strokeWeight: 2
     });
    var followLine2 = new google.maps.Polyline({
      clickable: false,
      map : map,
      path: [],
      strokeColor: "#787878",
      strokeOpacity: 1,
      strokeWeight: 2
     });
    
    var mapPolygon = new google.maps.Polygon({map : map,
                                        strokeColor   : '#ff0000',
                                        strokeOpacity : 0.6,
                                        strokeWeight  : 4,
                                        path:[new google.maps.LatLng(50.91607609098315,34.80485954492187),new google.maps.LatLng(50.91753710953153,34.80485954492187),new google.maps.LatLng(50.91759122044873,34.815159227539056),new google.maps.LatLng(50.9159678655622,34.815159227539056),new google.maps.LatLng(50.91044803534999,34.81258430688476),new google.maps.LatLng(50.91044803534999,34.81584587304687),new google.maps.LatLng(50.90931151845126,34.81533088891601),new google.maps.LatLng(50.90931151845126,34.811897661376946),new google.maps.LatLng(50.90395327929007,34.8094944020996),new google.maps.LatLng(50.9040074060014,34.80700531213378),new google.maps.LatLng(50.90914915662899,34.809666063476556),new google.maps.LatLng(50.90920327729935,34.8065761586914),new google.maps.LatLng(50.91033979684091,34.80700531213378),new google.maps.LatLng(50.910285677492006,34.81035270898437),new google.maps.LatLng(50.91607609098315,34.81301346032714)]
                                       });
    google.maps.event.addListener(mapPolygon, 'click', function() {
      document.getElementById("info").innerHTML = 'path:[';
      mapPolygon.getPath().forEach(function (vertex, inex) {
        document.getElementById("info").innerHTML += 'new google.maps.LatLng('+vertex.lat()+','+vertex.lng()+')' + ((inex<mapPolygon.getPath().getLength()-1)?',':'');
      });
      document.getElementById("info").innerHTML += ']';
    });                                   
    mapPolygon.runEdit(true);
    
    
    document.getElementById("newPolygon").onclick = function () {
      mapPolygon.stopEdit();
      mapPolygon.setMap(null);
      mapPolygon = null;
      document.getElementById("info").innerHTML = "Create a new Polygon. Press the mouse on the map and all will understand :) Finish adding new points - right-click.";
      google.maps.event.clearListeners(map, "click");
      google.maps.event.clearListeners(map, "mousemove");
      google.maps.event.clearListeners(map, "rightclick");
      map.setOptions({ draggableCursor: 'crosshair'});
      
      mapPolygon = new google.maps.Polygon({map : map,
                                        strokeColor   : '#ff0000',
                                        strokeOpacity : 0.6,
                                        strokeWeight  : 4,
                                        path:[]
                                       });
      followLine1.setPath([]);
      followLine2.setPath([]);
      followLine1.setMap(map);
      followLine2.setMap(map);
      
     google.maps.event.addListener(mapPolygon, 'click', function() {
      document.getElementById("info").innerHTML = 'path:[';
      mapPolygon.getPath().forEach(function (vertex, inex) {
        document.getElementById("info").innerHTML += 'new google.maps.LatLng('+vertex.lat()+','+vertex.lng()+')' + ((inex<mapPolygon.getPath().getLength()-1)?',':'');
      });
      document.getElementById("info").innerHTML += ']';
    });
    
     google.maps.event.addListener(map, 'click', function(point) {
       mapPolygon.stopEdit();
       mapPolygon.getPath().push(point.latLng);
       mapPolygon.runEdit(true);
     } ); //*/
     
     google.maps.event.addListener(map, 'rightclick', function () {
       followLine1.setMap(null);
       followLine2.setMap(null);
       google.maps.event.clearListeners(map, "click");
       google.maps.event.clearListeners(map, "mousemove");
       google.maps.event.clearListeners(map, "rightclick");
       map.setOptions({ draggableCursor: 'pointer' });
     } );
     
     
     google.maps.event.addListener(map, 'mousemove', function(point) {
      var pathLength = mapPolygon.getPath().getLength();
      if (pathLength >= 1) {
        var startingPoint1 = mapPolygon.getPath().getAt(pathLength - 1);
        var followCoordinates1 = [startingPoint1, point.latLng];
        followLine1.setPath(followCoordinates1);
        
        var startingPoint2 = mapPolygon.getPath().getAt(0);
        var followCoordinates2 = [startingPoint2, point.latLng];
        followLine2.setPath(followCoordinates2);
      } //*/
     } );   
     
  }
  
  
  }

  
 