'use strict';

/* Controllers */

function Video(youtubeId, name, duration){
	var m_name = name;
	var m_youtubeId = youtubeId;
	var m_duration = duration; 

	this.getName = function(){
		return m_name;
	}

	this.getLink = function(){
		return "http://www.youtube.com/watch?v=" + m_youtubeId;
	};		

	this.getDuration = function(){
		return convertTime(m_duration);
	}

	var convertTime = function(duration) {
	    var a = duration.match(/\d+/g);

	    if (duration.indexOf('M') >= 0 && duration.indexOf('H') == -1 && duration.indexOf('S') == -1) {
	        a = [0, a[0], 0];
	    }

	    if (duration.indexOf('H') >= 0 && duration.indexOf('M') == -1) {
	        a = [a[0], 0, a[1]];
	    }

	    if (duration.indexOf('H') >= 0 && duration.indexOf('M') == -1 && duration.indexOf('S') == -1) {
	        a = [a[0], 0, 0];
	    }

	    duration = 0;

	    if (a.length == 3) {
	        duration = duration + parseInt(a[0]) * 3600;
	        duration = duration + parseInt(a[1]) * 60;
	        duration = duration + parseInt(a[2]);
	    }

	    if (a.length == 2) {
	        duration = duration + parseInt(a[0]) * 60;
	        duration = duration + parseInt(a[1]);
	    }

	    if (a.length == 1) {
	        duration = duration + parseInt(a[0]);
	    }

	    return duration
	}
}

function Like(name){
	var m_name = name;

	this.getName = function(){
		return m_name;
	}
}

angular.module('procrastinarApp.Controllers', []).
controller('MainCtrl', ['$scope', 'Facebook', function($scope, Facebook){

	var m_likes = [];
	var m_generated = false;
	var m_currentRecomendationSource = "";

	$scope.videos = [];
    $scope.isFacebookLogged = false;

	$scope.login = function() {
        Facebook.login(function(response) {
        	
        	if (response.status == "connected"){
      			$scope.isFacebookLogged = true;
        	}

    	}, {scope: 'user_likes'});
    };

    $scope.generate = function(type){

    	var maxDuration = calculateMaxDuration(type);

		$scope.videos = [];

		Facebook.api('/me/likes', function(response) {
	        var likes = response.data;

	        // console.log(response);

	        for (var i = 0; i < likes.length; ++i){
	        	m_likes.push(new Like(likes[i].name));
	        }

	        var randomIndex = Math.floor(Math.random() * m_likes.length);

	        m_currentRecomendationSource = m_likes[randomIndex].getName();

	        youtubeSearch(m_currentRecomendationSource, 15, maxDuration);

	        m_generated = true;
	    });
    };

    $scope.isGenerated = function(){
    	return m_generated;
    };

    $scope.getTotalDuration = function(){
    	var total = 0;

    	for (var i = 0; i < $scope.videos.length; ++i){
    		total += $scope.videos[i].getDuration();
    	}

    	return total;
    }

	var calculateMaxDuration = function(type){
		if (type == 0) return 180;
		if (type == 1) return 360;
		return 5000;
	}

	$scope.getCurrentRecomendationSource = function(){
		return m_currentRecomendationSource;
	}

    var youtubeSearch = function(p_query, p_maxResults, p_maxDuration){

    	// console.log(p_query);

	  	var request = gapi.client.youtube.search.list({
	    	part: 'snippet',

	    	q: p_query,
	    	maxResults: p_maxResults,
	    	type: 'video'
	  	});

	  	request.execute(function(response) {
	  		
			// console.log(response.result)

			var items = response.result.items;

	  		for (var i = 0; i < items.length; ++i){
				
				var currentItem = items[i];

				//Closure para manter o escopo
				(function(videoId, videoTitle){
					
					var detailRequest = gapi.client.youtube.videos.list ({
						part: 'contentDetails',
						id: currentItem.id.videoId 
					});

					detailRequest.execute(function(detailResponse){

						// console.log(currentItem.id.videoId)

						// console.log(detailResponse.result)

						var videoResponse = new Video(videoId, videoTitle, detailResponse.result.items[0].contentDetails.duration);

						// console.log(videoResponse.getName() + " / " + videoResponse.getDuration());

						if (videoResponse.getDuration() <= p_maxDuration){
							$scope.videos.push(videoResponse);
							$scope.$apply();
						}
					});

				})(currentItem.id.videoId,currentItem.snippet.title);
	  		}

	  	});
    }

    $scope.login();

}]);
