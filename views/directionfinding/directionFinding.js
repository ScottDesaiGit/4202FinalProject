var directionsService = new google.maps.DirectionsService();

let directionsDisplay = new google.maps.DirectionsRenderer();



async function findDirections(){
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

	travelMap = document.getElementById('travelMap')
	travelMap.style.height = '750px';
    travelMap.style.width = '1500px';
	// let map = new google.maps.Map(document.getElementById('travelMap'), {
	// 	center: {lat: -33.8666, lng: 151.1958},
	// 	zoom: 15
	//   });

	directionsService.route(request, function(response, status) {
		if (status == google.maps.DirectionsStatus.OK) {

			//This code creates a map and then sets the directions on the map equal to whatever we find with the directions service
			let mapOptions = {
				zoom: 7,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			}
			let map = new google.maps.Map(document.getElementById('travelMap'), mapOptions)
			directionsDisplay.setMap(map)
			directionsDisplay.setDirections(response)

			//Creating the intiial variables
			var route = response.routes[0];
			var leg = response.routes[0].legs[0];
			var leg2 = response.routes[0].legs[1];
			var polyline = route.overview_polyline;
			var distance = route.legs[0].distance.value;
			var duration = route.legs[0].duration.value;

			let latLngArr = []

			// console.log(route); // Complete route
			// console.log(distance); // Only distance 
			// console.log(duration); // Only duration
			// console.log(leg); // Route options/list
			// console.log(leg.start_location.lat())
			console.log(leg)
			console.log(leg2)
			let firstSteps = leg.steps
			let nextSteps = leg2.steps

			//Get the latitude and longitude cooridnates for all of the steps within the leg
			for(let i = 0; i < firstSteps.length; i++){
				console.log(firstSteps[i])
				console.log(firstSteps[i])
				let startLat = firstSteps[i].start_location.lat()
				let endLat = firstSteps[i].end_location.lat()
				let startLng = firstSteps[i].start_location.lng()
				let endLng = firstSteps[i].end_location.lng()
				latLngArr.push({startLat: startLat, endLat: endLat, startLng: startLng, endLng: endLng})
			}

			console.log(latLngArr)
			
			let startLatitude = leg.start_location.lat()
			let startLongitude = leg.start_location.lng()

			let endLatitude = leg.end_location.lat()
			let endLongitude = leg.end_location.lng()
			console.log(startLatitude)
			console.log(startLongitude)
			console.log(endLatitude)
			console.log(endLongitude)

			let myLatLng = new google.maps.LatLng(0, 0)
			
			console.log(myLatLng)
			// const flightPath = new google.maps.Polyline({
			// 	path: polyline,
			// 	geodesic: true,
			// 	strokeColor: "#FF0000",
			// 	strokeOpacity: 1.0,
			// 	strokeWeight: 2,
			//   });

			// console.log(flightPath)
			
			//   flightPath.setMap(map);
			// polyline.setMap(map)

			//Here what we need to do is create a new google maps latlng bounds:
			//https://googlemaps.github.io/v3-utility-library/classes/_googlemaps_jest_mocks.latlngbounds.html

			//using a google maps latlng literal
			//https://developers.google.com/maps/documentation/javascript/examples/map-latlng-literal


			// console.log(polyline); // Polyline data
		}
	});
}

// async function getIDofRestaurantInRadius(latitude, longitude){

// 	//instead of the radius, we could use rankby=distance
// 	var config = {
// 	  method: 'get',
// 	  url: 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + location['lat'] + '%2C' + location['lng'] + '&radius=10000&type=restaurant&key=' + apiKey,
// 	  headers: { }
// 	};
	
// 	axios(config)
// 	.then(function (response) {
// 	  let restaurants = response.data.results;
// 	  for (let i = 0; i < restaurants.length; i++){
// 		console.log(restaurants[i].name + ', ' + String(restaurants[i].rating));
// 	  }
// 	})
// 	.catch(function (error) {
// 	  console.log(error);
// 	});
// }