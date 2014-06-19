app.controller('MapController', function($scope, mapService){
	$scope.text = mapService.getText();
});

app.controller('AuthController', function($scope) {
	$scope.signIn = function(authResult) {
		$scope.$apply(function() {
			$scope.processAuth(authResult);
		});
	};

	$scope.processAuth = function(authResult) {
		$scope.loginButtonStatus = true;

		if (authResult['access_token']) {
			$scope.loginButtonStatus = false;
		} else if (authResult['error']) {
			if (authResult['error'] === 'immediate_failed') {
				$scope.loginButtonStatus = true;
			} else if(authResult['error'] === 'user_signed_out') {
				$scope.loginButtonStatus = true;
			} else {
				console.log('Error:' + authResult['error']);
			}
		}
	};

	$scope.renderSignIn = function() {
		gapi.signin.render('googleSignIn', {
			'callback': $scope.signIn,
			'clientid': "384107108130-72iln86je7a2b9lcj5f7kujp4m0qrlh5.apps.googleusercontent.com",
			'requestvisibleactions': "http://schemas.google.com/AddActivity",
			'theme': 'dark',
			'cookiepolicy': "single_host_origin",
			'scope': "https://www.googleapis.com/auth/plus.login"
		});
	};

	$scope.signOut = function() {
		gapi.auth.signOut();
	};


	$scope.start = function() {
		$scope.renderSignIn();
	};

	$scope.start();

	$scope.getProfile = function() {
gapi.client.load('plus','v1', function(){
 var request = gapi.client.plus.people.list({
   'userId': 'me',
   'collection': 'visible'
 });
 request.execute(function(resp) {
   console.log('Num people visible:' + resp.totalItems);
 });
});


	};
});
