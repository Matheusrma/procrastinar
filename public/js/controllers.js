'use strict';

/* Controllers */

function Video(youtubeId){
	var m_youtubeId = youtubeId;

	this.getLink = function(){
		return "http://www.youtube.com/watch?v=" + m_youtubeId;
	};		
}

angular.module('procrastinarApp.Controllers', []).
controller('MainCtrl', ['$scope', '$http', 'Facebook', function($scope, $http, Facebook){

	var m_currentSearchResult = "ESPERANDO";
	$scope.videos = [];

	$scope.getCurrentSearch = function(){
		return m_currentSearchResult;
	}

	$scope.login = function() {
    
        FB.getLoginStatus(function(response) {
      		console.log(response);
    	},true);

    };

    var m_generated = false;

    $scope.generate = function(){

		youtubeSearch("Harry Potter", 10);

    	m_generated = true;
    };

    $scope.isGenerated = function(){
    	return m_generated;
    };

    var youtubeSearch = function(p_query, p_maxResults){

	  	var request = gapi.client.youtube.search.list({
	    	part: 'id',

	    	q: p_query,
	    	maxResults: p_maxResults,
	    	type: 'video'
	  	});

	  	request.execute(function(response) {
	  		
	  		// var detailRequest = gapi.client.youtube.videos.list ({
	  		// 	part: 'contentDetails',
	  		// 	id: '07e76t7n2KE' 
	  		// });

	  		// detailRequest.execute(function(response){
	  		// 	console.log(response.result.items[0].contentDetails.duration);
	  		// });

	  		var items = response.result.items;

	  		for (var i = 0; i < items.length; ++i){
	  			$scope.videos.push(new Video(items[i].id.videoId));
	  		}

	    	$scope.$apply()
	  	});
    }

}]);