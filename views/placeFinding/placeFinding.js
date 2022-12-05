//var mapsService = new google.maps.MapsService();

let apiKey = 'AIzaSyBh05L5akYR5BDBtF8WdUbZo0ljzj78GXw';



function findPlaceByID() {
  var config = {
    method: 'get',
    url: 'https://maps.googleapis.com/maps/api/place/details/json?place_id=ChIJZ7dDJPf_0UwRorHerClCK1E&fields=name,geometry,rating&key=' + apiKey,
    headers: { }
  };
  
  axios(config)
  .then(function (response) {
    console.log(JSON.stringify(response.data));
    console.log(response.data);
    //getIDofRestaurantInRadius(response.data.result.geometry.location);
	getIDofRestaurantInBounds();
  })
  .catch(function (error) {
    console.log(error);
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

function getIDofRestaurantInBounds(){
  
	var SWLat =  45.296577
	var SWLng = -75.925069
	var NELat =  45.351493
	var NELng = -75.911079
  
	// //first bound is southwest, second bound is northeast
	// var bounds = new google.maps.LatLngBounds(google.maps.LatLng(SWLat, SWLng), google.maps.LatLng(NELat, NELng))
  
	//instead of the radius, we could use rankby=distance
	var config = {
	  method: 'get',
	  url: 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?&locationrestriction=rectangle%3A&' +SWLat + '%2C' + SWLng + '%7C' + NELat + '%2C' + NELng +'&type=restaurant&key=' + apiKey,
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