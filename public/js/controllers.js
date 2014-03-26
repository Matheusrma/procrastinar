'use strict';

/* Controllers */

angular.module('procrastinarApp.Controllers', []).
controller('MainCtrl', ['$scope', '$http', 'Facebook', function($scope, $http, Facebook){

	$http({method: 'GET', url: '/api/name'}).
	success(function(data, status, headers, config) {
	    $scope.name = data.name;
	}).
	error(function(data, status, headers, config) {
		$scope.name = 'Error!'
	});

	$scope.login = function() {
    
        FB.getLoginStatus(function(response) {
      		console.log(response);
    	},true);

    };
}]);