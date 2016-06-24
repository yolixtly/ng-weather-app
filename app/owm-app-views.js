//this module holds all the different modules we have created 
//and then owmAppViews is injected on owm-app.js. doing these make the following list of 
// dependencies available in the whole app
var viewsModule = angular.module('owmAppViews',
    ['ngRoute', 'owmLibrary', 'geolocation', 'owmHistory']);
