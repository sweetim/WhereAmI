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
		.when('/register', 
		{
			controller: 'MapController',
			templateUrl: 'app/views/register.html'
		})
		.otherwise({redirectTo: '/'});
});