var app = angular.module('WhereAmI', ['ngRoute']);

app.config(function($routeProvider) {
	$routeProvider
		.when('/', 
		{
			controller: 'AuthController',
			templateUrl: 'app/views/login.html'
		})
		.when('/login',
		{
			controller: 'AuthController',
			templateUrl: 'app/views/login.html'
		})
		.when('/register', 
		{
			controller: 'MapController',
			templateUrl: 'app/views/register.html'
		})
		.otherwise({redirectTo: '/'});
});