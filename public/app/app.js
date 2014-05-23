var app = angular.module('WhereAmI', ['ngRoute']);

app.config(function($routeProvider) {
	$routeProvider
		.when('/', 
		{
			controller: 'MapController',
			templateUrl: 'app/views/map.html'
		})
		.when('/login',
		{
			controller: 'MapController',
			templateUrl: 'app/views/login.html'
		})
		.otherwise({redirectTo: '/'});
});