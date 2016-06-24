viewsModule.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when("/near-me", {
    templateUrl : "./home/near-me.html",
    controller : 'NearMeCtrl'
  });
}]);
//injects owmNearby factory from owm-library.js
//the geolocation service is a plugin that has been included in the app
viewsModule.controller('NearMeCtrl', ['$scope', 'geolocation', 'owmNearby', '$location', '$q',
  function($scope, geolocation, owmNearby, $location, $q) {
  $scope.loading = true;
  //from the factories it gets the data and looks for the lat and lng properties
  //located at: Object.city.coord.lat/lon or data.coords.latitude/longitude
  //this returns a promise that when resolved returns an object with the latitud
  //and longitud
  geolocation.getLocation()
    .then(function(data) {
      return $q.when({
        lat: data.coords.latitude,
        lon: data.coords.longitude
      });
    })
    .then(owmNearby)
    .then(function(response){
      if(parseInt(response.cod) > 400){
        return $q.reject(response.message);
      }
      else{
        return $q.when(response);
      }
    })
    .then(function(result) {
      $location.path('/cities/' + result.city.id);
    }, function(){
      // error city not found
    })
    .finally(function(){
      $scope.loading = false;
    });
}]);
//Those values are then passed into the owmNearby service 
//which then queries the remote API to figure out which city is closest to us. 
//Once you get that city you then redirect to its profile page.