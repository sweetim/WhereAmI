var app = angular.module('WhereAmI', ['ngRoute']);

app.config(function($routeProvider) {
	$routeProvider
		.when('/', 
		{
			controller: 'MapController',
			templateUrl: 'app/views/map.html'
		})
		.otherwise({redirectTo: '/'});
});