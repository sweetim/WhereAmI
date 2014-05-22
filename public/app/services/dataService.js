app.service('mapService', function($http) {
	this.getText = function() {
		$http.get('http://localhost:3000/data').
			success(function(data) {
				return data.title;
			});
	}
});