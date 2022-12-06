//Create a directions service and display which can be used to show the directions
let directionsService = new google.maps.DirectionsService();
let directionsDisplay = new google.maps.DirectionsRenderer();

//Creating an array of restaurants
let restaurantsArr = []
let bestTravelWaypoints = []
let bestTravelValue = Infinity

async function findOptimalRoute(){
	//Get the start location and end location values
	let startLocation = document.getElementById('startLocation').value
	let endLocation = document.getElementById('endLocation').value

	//Create
	var request = {
		// origin: new google.maps.LatLng(start_lat, start_lon),
		origin: startLocation,
		destination: endLocation,
		optimizeWaypoints: true,
		avoidHighways: false,
		avoidTolls: false,
		travelMode: google.maps.TravelMode.DRIVING
	};

	//Makinga  request to begin the directions service
	directionsService.route(request, function(response, status) {
		if (status == google.maps.DirectionsStatus.OK) {
			//Initializing the map
			travelMap = document.getElementById('travelMap')
			travelMap.style.height = '750px';
			travelMap.style.width = '1500px';
			
			//Initializing the bounds of the map
			bounds = new google.maps.LatLngBounds();


			//Initializing the current map for the initial run
			let mapOptions = {
				zoom: 7,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			}
			map = new google.maps.Map(travelMap, mapOptions)


			directionsDisplay.setMap(map)
			directionsDisplay.setDirections(response)

			//Getting all of the legs within the current map
			let stepLength = response.routes[0].legs[0].steps.length
			let steps = response.routes[0].legs[0].steps.slice(Math.floor(stepLength /3), Math.floor(stepLength * 2/3));
			service = new google.maps.places.PlacesService(map);
			findPlaces(steps)
		}
	});

}

function sleep(milliseconds) {
	const date = Date.now();
	let currentDate = null;
	do {
	  currentDate = Date.now();
	} while (currentDate - date < milliseconds);
}

function findPlaces(stepArr){
	if(stepArr.length == 0){
		console.log(restaurantsArr)
		console.log("In the if statement!!")
		let numRestaurants = document.getElementById("restaurantStops")
		let startLocation = document.getElementById('startLocation').value
		let endLocation = document.getElementById('endLocation').value
		if(Number(numRestaurants) == 2){
			computeShortestPath([0, 1], startLocation, endLocation)
		}else{
			computeShortestPathSingle(0, startLocation, endLocation)
		}
		return
	}
	sleep(50)
	let lastStep = stepArr.pop()
	let southLat = lastStep.start_location.lat()
	let northLat = 0
	let westLng = lastStep.start_location.lng()
	let eastLng = 0
	if(lastStep.end_location.lat() > southLat){
		northLat = lastStep.end_location.lat() 
	}else{
		northLat = southLat
		southLat = lastStep.end_location.lat() 
	}

	if(lastStep.end_location.lng() > westLng){
		eastLng = lastStep.end_location.lng() 
	}else{
		eastLng = westLng
		westLng = lastStep.end_location.lng() 
	}

	northLat = northLat + 0.001
	southLat = southLat - 0.001
	eastLng = eastLng + 0.001
	westLng = westLng - 0.001
	

	let sw = new google.maps.LatLng(southLat, westLng)
	let ne = new google.maps.LatLng(northLat, eastLng)
	let latLngBounds = new google.maps.LatLngBounds(sw, ne)
	let request = {
		bounds: latLngBounds,
		type: 'restaurant',
		keyword: document.getElementById('restaurantType').value
	};

	console.log(document.getElementById('restaurantType').value)
	service.nearbySearch(request, function(response, status){
		if (status == google.maps.places.PlacesServiceStatus.OK) {
			if(typeof response === undefined){
				
			}else{
				restaurantsArr.push(...response)
			}
			findPlaces(stepArr)
		}else{
			findPlaces(stepArr)
		}
	})
}

function computeShortestPathSingle(currIndex, startLocation, endLocation){
	sleep(50)
	if(currIndex == restaurantsArr.length){
		returnShortestPath(startLocation, endLocation)
		return
	}
	let waypoints = [{location: restaurantsArr[currIndex].vicinity, stopover: true}]
	var request = {
		// origin: new google.maps.LatLng(start_lat, start_lon),
		origin: startLocation,
		destination: endLocation,
		optimizeWaypoints: true,
		waypoints: waypoints,
		avoidHighways: false,
		avoidTolls: false,
		travelMode: google.maps.TravelMode.DRIVING
	};

	directionsService.route(request, function(response, status) {

		if (status == google.maps.DirectionsStatus.OK) {
			// console.log(response)
			let duration = (response.routes[0].legs[0].duration.value +  response.routes[0].legs[1].duration.value)/restaurantsArr[currIndex].rating
			// console.log(duration)
			if(duration < bestTravelValue){
				bestTravelWaypoints.pop()
				bestTravelWaypoints.push(restaurantsArr[currIndex])
				bestTravelValue = duration
			}
			computeShortestPathSingle(currIndex + 1, startLocation, endLocation)
			// console.log(response)
			//Initializing the map
		}else{
			computeShortestPathSingle(currIndex + 1, startLocation, endLocation)
		}
		// console.log(response)
		// console.log(status)
	});
}

function returnShortestPath(startLocation, endLocation){
	sleep(2000)
	let waypoints = []
	for(let i = 0; i < bestTravelWaypoints.length; i++){
		waypoints.push({location: bestTravelWaypoints[i].vicinity, stopover: true})
	}

	var request = {
		// origin: new google.maps.LatLng(start_lat, start_lon),
		origin: startLocation,
		destination: endLocation,
		optimizeWaypoints: true,
		waypoints: waypoints,
		avoidHighways: false,
		avoidTolls: false,
		travelMode: google.maps.TravelMode.DRIVING
	};

	
	directionsService.route(request, function(response, status) {
		if (status == google.maps.DirectionsStatus.OK) {
			let p = document.createElement("p")
			for(let i = 0; i < bestTravelWaypoints.length; i++){
				p.innerHTML += `<p>Stop ${i + 1}:</p><p>Restaurant Name: ${bestTravelWaypoints[i].name}</p><p>Adress: ${bestTravelWaypoints[i].vicinity}</p>
				<p>Rating: ${bestTravelWaypoints[i].rating}</p><br><br>`
			}
			let resultsDiv = document.getElementById("restaurantLocation")
			resultsDiv.appendChild(p);
			directionsDisplay.setDirections(response);
		};
	});
}
