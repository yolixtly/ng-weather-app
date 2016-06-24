angular.module('owmLibrary', [])

  //.constant() method definds a value that should never be changed

  // this contains the URL base 
  .constant('OWM_API_PREFIX', 'http://api.openweathermap.org/data/2.5/forecast')
  //this contains the API KEY as part of parameters
  .constant('OWM_API_KEY', '3b3780ece38a75714a0b4a17dc9025f1')
  //this gives access to the list of cities. We are making a same domain request
  // for this part 
  .constant('OWM_CITIES_JSON_FILE', './owm-cities.json')
  //this Factory performs the AJAX request to the OWM_API host (third Party)
  //it returns the response.data when the promise is resolved and successful
  .factory('owmRequest', ['$http', '$q', 'OWM_API_PREFIX', 'OWM_API_KEY', function($http, $q, OWM_API_PREFIX, OWM_API_KEY){
    return function(params){
      //here we copy the content/properties of the objects sources 
      //(params and key) to the destination object {} from left to right
      var reqParams = angular.extend({}, params, {APPID: OWM_API_KEY});
      console.log('the destination new Object created with ang.extend(); ');
      console.log(reqParams); //logs : q:Selected_City, APPID: 3b3780ece38a75714a0b4a17dc9025f1;
      return $http.get(OWM_API_PREFIX, {params: reqParams})
        .then(function(response){
          console.log('AJAX Request: ');
          console.log(response.data);
          console.log(params); //logs the API response data from OWM_API 
          //when the AJAX request returns a promise ($http) and AJAX request is successful
          //then the $q promise will be resolved >> 
          return $q.when(response.data);
        });
    };
  }])

  //this Factory makes a Same Domain Request to our json file owm-cities.json
  // and returns the response data of that object 
  .factory('owmUSCities', ['$http', '$q', 'OWM_CITIES_JSON_FILE', function($http, $q, OWM_CITIES_JSON_FILE) {
    return function() {
      //Returns the GET Request for the local file 
      return $http.get(OWM_CITIES_JSON_FILE, {cache: true})
        .then(function(response){
          console.log('same domain GET Request: ');
          console.log(response.data);
          return $q.when(response.data);
        });
    };
  }])
  //this Factory injects the first factory: owmRequest 
  // this Factory Specifies the data we are interested in requesting from owmRequest
  //before calling the service (owmRequest), you must first build the parameters object 
  //that you'll be querying the API against.
  .factory('owmFindCity', ['owmRequest', function(owmRequest) {
    return function(q) {
      var params;
      //This prepare an object that will contain the key:value pairs for the query params
      //to be sent to Open Weather Map API
      if(q.match(/^\d+$/)) {
        params = {
          //when searching for 'New York' then  q  :  'New York' 
          id : q
        };
      } else {
        params = {
          q : q
        };
      }
      //Returns the Parameters and then calls the owmRequest with that information so
      // it can return the Request succesfully.
      return owmRequest(params);
    };
  }])

  // this Factory also injects owmRequest Factory but instead of passing a q key 
  // with a specific city name, it uses geolocation to find the clossest city given the 
  //latitud and longitud parameters 
  .factory('owmNearby', ['owmRequest', function(owmRequest) {
    return function(loc) {
      var params = {
        lat : loc.lat,
        lon : loc.lon
      };
      console.log('when requesting nearby weather these are the params instead of a city name: ');
      console.log(params);

      //again it returns the paramenters and it calls the owmRequest with 
      //the parameters information to make the new search nearby 
      //The lat and lng coordinates get defined in app/home/near-me.js as part of NearMeCtrl:
      return owmRequest(params);
    };
  }]);
