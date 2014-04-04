'use strict';

/* Controllers */

function Video(youtubeId, duration){
	var m_youtubeId = youtubeId;
	var m_duration = duration; 

	this.getLink = function(){
		return "http://www.youtube.com/watch?v=" + m_youtubeId;
	};		

	this.getDuration = function(){

		var splitedDuration = m_duration.split("M");

		var minuteSide = splitedDuration[0].substring(2,splitedDuration[0].length);
		var secondSide = splitedDuration[1].substring(0,splitedDuration[1].length - 1);

		return parseInt(minuteSide) * 60 + parseInt(secondSide);
	}
}

function Like(name){
	var m_name = name;

	this.getName = function(){
		return m_name;
	}
}

angular.module('procrastinarApp.Controllers', []).
controller('MainCtrl', ['$scope', '$http', 'Facebook', function($scope, $http, Facebook){

	var m_likes = [];
	$scope.videos = [];

	$scope.getCurrentSearch = function(){
		return m_currentSearchResult;
	}

	$scope.login = function() {
        Facebook.login(function(response) {
      		console.log(response);
    	}, {scope: 'user_likes'});
    };

    var m_generated = false;

    $scope.generate = function(){

		$scope.videos = [];

		Facebook.api('/me/likes', function(response) {
	        var likes = response.data;

	        console.log(response);

	        for (var i = 0; i < likes.length; ++i){
	        	m_likes.push(new Like(likes[i].name));
	        }

	        var randomIndex = Math.floor(Math.random() * m_likes.length);

	        youtubeSearch(m_likes[randomIndex].getName(), 10);

    		m_generated = true;
	    });
    };

    $scope.isGenerated = function(){
    	return m_generated;
    };

    var youtubeSearch = function(p_query, p_maxResults){

    	console.log(p_query);

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
	  			$scope.videos.push(new Video(items[i].id.videoId, "PT2M57S"));
	  		}

	    	$scope.$apply()
	  	});
    }

}]);