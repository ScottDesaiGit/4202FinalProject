var directionsService = new google.maps.DirectionsService();


function findDirections(){
	// Using Latitude and longitude
	var request = {
		// origin: new google.maps.LatLng(start_lat, start_lon),
		origin: "51 Shaughnessy Crescent",
		destination: "785 Kanata Avenue",
		waypoints: [{location: "13th Street. 47 W 13th St, New York, NY", stopover: true}],
		// destination: new google.maps.LatLng(end_lat, end_lon),
		optimizeWaypoints: true,
		avoidHighways: false,
		avoidTolls: false,
		travelMode: google.maps.TravelMode.DRIVING
	};

	directionsService.route(request, function(response, status) {
		if (status == google.maps.DirectionsStatus.OK) {
			var route = response.routes[0];
			var leg = response.routes[0].legs[0];
			var leg2 = response.routes[0].legs[1];
			var polyline = route.overview_polyline;
			var distance = route.legs[0].distance.value;
			var duration = route.legs[0].duration.value;

			// console.log(route); // Complete route
			// console.log(distance); // Only distance 
			// console.log(duration); // Only duration
			// console.log(leg); // Route options/list
			// console.log(leg.start_location.lat())
			console.log(leg)
			console.log(leg2)
			let startLatitude = leg.start_location.lat()
			let startLongitude = leg.start_location.lng()

			let endLatitude = leg.end_location.lat()
			let endLongitude = leg.end_location.lng()
			console.log(startLatitude)
			console.log(startLongitude)
			console.log(endLatitude)
			console.log(endLongitude)
			// console.log(polyline); // Polyline data
		}
	});
}

function getIDofRestaurantInRadius(latitude, longitude){
	

	//instead of the radius, we could use rankby=distance
	var config = {
	  method: 'get',
	  url: 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + location['lat'] + '%2C' + location['lng'] + '&radius=10000&type=restaurant&key=' + apiKey,
	  headers: { }
	};
	
	axios(config)
	.then(function (response) {
	  let restaurants = response.data.results;
	  for (let i = 0; i < restaurants.length; i++){
		console.log(restaurants[i].name + ', ' + String(restaurants[i].rating));
	  }
	})
	.catch(function (error) {
	  console.log(error);
	});
}