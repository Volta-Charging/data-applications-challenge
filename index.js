// Mapbox
const access_token = 'pk.eyJ1IjoibWljaGFlbHRhbWFraSIsImEiOiJjajlva3Y1bGgxZmpiMzNxemo2MXMwOGI1In0.8vX_HEkBY3WKQx6o4XUi4w';
var stations = {};
// Map bounds for all stations
var t = -9999; // top is taken
var bottom = 9999;
var right = -9999;
var left = 9999;
var mymap;
var station_list;

window.onload = function() {
	// Initialize leaflet map
	mymap = L.map('mapid');
	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
	    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
	    maxZoom: 18,
	    id: 'mapbox.streets',
	    accessToken: access_token
	}).addTo(mymap);

	// Set up HTTP GET request for Volta API
	var xhttp = new XMLHttpRequest();
	var url = "https://api.voltaapi.com/v1/stations";
	var params = "?available=true&status=a";
	xhttp.open("GET", url + params, true);
	xhttp.setRequestHeader("Accept", "application/json");
	// Analyze data from Volta API
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4) {
			stations = JSON.parse(this.responseText);
			var list = document.getElementById('list');
			var values = [];
			for (i in stations) {
				var station = stations[i];
				// Set bounds for map
				var coord = station["location"]["coordinates"];

				if (coord[1] < left) {
					left = coord[1];
				} else if (coord[1] > right) {
					right = coord[1];
				}
				if (coord[0] > t) {
					t = coord[0];
				} else if (coord[0] < bottom) {
					bottom = coord[0];
				}
				// Add marker to map
				var marker = L.marker([coord[1], coord[0]]);
				marker.addTo(mymap);
				var address = station["street_address"] + ", " + station["city"]; 
				address += ", " + station["state"] + ", " + station["zip_code"].toString();
				var label = "<b>" + station["name"] + "</b><br>" + address;
				marker.bindPopup(label);
				marker.on('click', function(e) {
					if (e.latlng) {
						// User click
						mymap.fitBounds(e.latlng.toBounds(15000));
					} else {
						// Simulated click
						mymap.fitBounds(e.target.getLatLng().toBounds(15000));
					}
				});
				station["marker"] = marker;

				// Add item to station list
				values.push({ 
					address: address,
					name: station["name"],
					index: i.toString()
				});
			}
			mymap.fitBounds([
				[left, t],
				[right, bottom]
			]);

			// Set up station list
			var item = '<li>';
			item += '<b class="name"></b><br>';
			item += '<span class="address"></span>';
			item += '<span class="index hidden"></span>';
			var options = {
				valueNames: ['address', 'name', 'index'],
				item: item
			};
			station_list = new List('hacker-list', options, values);

			// Get city marker on click
			var station_elements = document.getElementById('hacker-list').getElementsByClassName('list')[0].childNodes;
			for (var i = 0; i < station_elements.length; i++) {
				var name_element = station_elements[i].getElementsByClassName('name')[0];
				name_element.onclick = function(e) {
					var index = parseInt(this.parentNode.getElementsByClassName('index')[0].innerHTML);
					var marker = stations[index]["marker"];
					marker.fire('click');
					e.preventDefault();
				}
			};
		}
	}
	xhttp.send();

	// Reset map button
	document.getElementById('reset').onclick = function(e) {
		mymap.fitBounds([
			[left, t],
			[right, bottom]
		]);
		e.preventDefault();
	};
};