app.controller('MapController', function($scope, mapService){
	$scope.text = mapService.getText();
});

app.controller('AuthController', function($scope) {
	$scope.signOut = function() {
		gapi.auth.signOut();
	};

	$scope.signIn = function(authResult) {
		$scope.$apply(function() {
			$scope.processAuth(authResult);
		});
	};

	$scope.processAuth = function(authResult) {
		$scope.immediateFailed = true;
		if ($scope.isSignedIn) {
			return 0;
		}
		if (authResult['access_token']) {
			$scope.immediateFailed = false;			
		} else if (authResult['error']) {
			if (authResult['error'] == 'immediate_failed') {
				$scope.immediateFailed = true;
			} else {
				console.log('Error:' + authResult['error']);
			}
		}
	};

	$scope.renderSignIn = function() {
		gapi.signin.render('myGsignin', {
			'callback': $scope.signIn,
			'clientid': "384107108130-72iln86je7a2b9lcj5f7kujp4m0qrlh5.apps.googleusercontent.com",
			'requestvisibleactions': "http://schemas.google.com/AddActivity",
			'theme': 'dark',
			'cookiepolicy': "single_host_origin"
		});
	};

	$scope.start = function() {
		$scope.renderSignIn();
	};

	$scope.start();
});