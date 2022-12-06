//Create a directions service and display which can be used to show the directions
let directionsService = new google.maps.DirectionsService();
let directionsDisplay = new google.maps.DirectionsRenderer();

//Creating an array of restaurants
let restaurantsArr = []
let splitRestaurantsArr = []
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
			// let stepLength = response.routes[0].legs[0].steps.length
			let steps = response.routes[0].legs[0].steps
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

//Function which finds all of the places 
function findPlaces(stepArr){
	if(stepArr.length == 0){
		let numRestaurants = Number(document.getElementById("restaurantStops").value)
		let startLocation = document.getElementById('startLocation').value
		let endLocation = document.getElementById('endLocation').value

		//If there are 2 or greater restaurants then compute using n arrays of a size 10/n, where n is the number of restaurants
		if(numRestaurants >= 2){
			let currRestaurantsArrSplit = []
			let indexArr = []

			for(let i = 0; i < numRestaurants; i++){
				indexArr.push(i)
				currRestaurantsArr = restaurantsArr.slice(0, restaurantsArr.length/numRestaurants)
				currRestaurantsArrSplit.push(currRestaurantsArr)
				restaurantsArr = restaurantsArr.slice(restaurantsArr.length/numRestaurants)
			}

			let constantTenValue = Math.floor(10/numRestaurants)
			for(let i = 0; i < numRestaurants; i++){
				if(i == 0){
					splitRestaurantsArr.push(currRestaurantsArrSplit[i].slice(-constantTenValue));
				}else if(i == numRestaurants - 1){
					splitRestaurantsArr.push(currRestaurantsArrSplit[i].slice(0, constantTenValue));
				}else{
					splitRestaurantsArr.push(currRestaurantsArrSplit[i].slice(Math.floor(currRestaurantsArrSplit[i].length/2) - constantTenValue, Math.floor(currRestaurantsArrSplit[i].length/2)))
				}
			}
			computeShortestPath(indexArr, startLocation, endLocation, numRestaurants)
		}else{
			restaurantsArr = restaurantsArr.slice(Math.floor(restaurantsArr.length/3), Math.floor(restaurantsArr.length * 2/3))
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

//Compute the shortest path which stops at either 2 or 3 restaurants
function computeShortestPath(indexArr, startLocation, endLocation, numRestaurants){
	sleep(50)

	let waypoints = []
	for(let i = 0; i < indexArr.length; i++){
		waypoints.push({location: splitRestaurantsArr[i][indexArr[i]].vicinity, stopover: true})
	}
	var request = {
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
			let durationSum = 0
			let ratingSum = 0
			for(let i = 0; i < response.routes[0].legs.length; i++){
				durationSum += response.routes[0].legs[i].duration.value
			}
			for(let i = 0; i < indexArr.length; i++){
				ratingSum += splitRestaurantsArr[i][indexArr[i]].rating
			}
			duration = durationSum/ratingSum
			if(duration < bestTravelValue){
				bestTravelWaypoints = []
				for(let i = 0; i < indexArr.length; i++){
					bestTravelWaypoints.push(splitRestaurantsArr[i][indexArr[i]])
				}
				bestTravelValue = duration
			}
		}
		for(let i = 0; i < indexArr.length; i++){
			if(indexArr[i] < (Math.floor(10/numRestaurants) - 1)){
				indexArr[i] += 1
				if(i > 0){
					for(let j = 0; j < i; j++){
						indexArr[j] = 0
					}
				}
				computeShortestPath(indexArr, startLocation, endLocation, numRestaurants)
				return
			}
		}

		returnShortestPath(startLocation, endLocation)
		return
	});
}

//Compute the shortest path which stops at a single restaurant
function computeShortestPathSingle(currIndex, startLocation, endLocation){
	sleep(50)
	if(currIndex == restaurantsArr.length){
		returnShortestPath(startLocation, endLocation)
		return
	}
	let waypoints = [{location: restaurantsArr[currIndex].vicinity, stopover: true}]
	var request = {
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
			let duration = (response.routes[0].legs[0].duration.value +  response.routes[0].legs[1].duration.value)/restaurantsArr[currIndex].rating
			if(duration < bestTravelValue){
				bestTravelWaypoints.pop()
				bestTravelWaypoints.push(restaurantsArr[currIndex])
				bestTravelValue = duration
			}
			computeShortestPathSingle(currIndex + 1, startLocation, endLocation)
		}else{
			computeShortestPathSingle(currIndex + 1, startLocation, endLocation)
		}

	});
}

//What this function does is that it will return the shortest path with the best travel waypoints which were found
function returnShortestPath(startLocation, endLocation){
	sleep(2000)
	let waypoints = []
	for(let i = 0; i < bestTravelWaypoints.length; i++){
		waypoints.push({location: bestTravelWaypoints[i].vicinity, stopover: true})
	}

	var request = {
		origin: startLocation,
		destination: endLocation,
		optimizeWaypoints: true,
		waypoints: waypoints,
		avoidHighways: false,
		avoidTolls: false,
		travelMode: google.maps.TravelMode.DRIVING
	};

	
	//Route through the best possible path and display it to the end user
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
