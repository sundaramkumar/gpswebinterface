var markersArray = [];
function addMarker(location, ignition) {
	var infowindow = new google.maps.InfoWindow({
		content: 'Vehicle'
	});
	
	var markericon = '../images/gmap/marker-green.png';
	if(ignition=="OFF"){
		markericon = '../images/gmap/marker-red.png';
	}
	
	marker = new google.maps.Marker({
		position: location,
		map: map,
		icon:markericon
	});
	
	google.maps.event.addListener(marker, 'click', function() {
		var latlng = marker.position;
		geocoder.geocode({'latLng': latlng}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				if (results[1]) {
					infowindow.setContent(results[1].formatted_address.replace(/,/mgi,"<br>"));
					infowindow.open(map, marker);
				}
			} else {
				alert("Geocoder failed due to: " + status);
			}
		});
		//infowindow.open(map, marker);
	});
	
	map.setCenter(location);
	markersArray.push(marker);
}

// Removes the overlays from the map, but keeps them in the array
function clearOverlays() {
	if (markersArray) {
		for (i in markersArray) {
			markersArray[i].setMap(null);
		}
	}
}

// Shows any overlays currently in the array
function showOverlays() {
	if (markersArray) {
		for (i in markersArray) {
			markersArray[i].setMap(map);
		}
	}
}

// Deletes all markers in the array by removing references to them
function deleteOverlays() {
	if (markersArray) {
		for (i in markersArray) {
			markersArray[i].setMap(null);
		}
		markersArray.length = 0;
	}
}

function setCenter(latitude, longitude){
	var myLatlng = new google.maps.LatLng(latitude,longitude);
	map.setCenter(myLatlng);
}