'use strict';

/* Controllers */

function Video(youtubeId, duration){
	var m_youtubeId = youtubeId;
	var m_duration = duration; 

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
controller('MainCtrl', ['$scope', '$http', 'Facebook', function($scope, $http, Facebook){

	var m_likes = [];
	$scope.videos = [];
	$scope.timeInput = '';
    $scope.isFacebookLogged = false;

	$scope.getCurrentSearch = function(){
		return m_currentSearchResult;
	}

	$scope.login = function() {
        Facebook.login(function(response) {
        	
        	if (response.status == "connected"){
      			$scope.isFacebookLogged = true;
        	}

    	}, {scope: 'user_likes'});
    };


    var m_generated = false;

    $scope.generate = function(){

    	console.log($scope.timeInput);

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
	  		
			var items = response.result.items;
	  		
			console.log(items.contentDetails);

	  		for (var i = 0; i < items.length; ++i){
				
				var detailRequest = gapi.client.youtube.videos.list ({
					part: 'contentDetails',
					id: items[i].id.videoId 
				});
			
				detailRequest.execute(function(response){

					console.log(response.result.items[0].contentDetails.duration);
					var resposta = new Video(response.result.items[0].id, response.result.items[0].contentDetails.duration);

					if (resposta.getDuration() <= 180){
						$scope.videos.push(resposta);
						console.log(response.result.items[0].contentDetails.duration);
					}
					$scope.$apply()
				});
	  		}

	  	});
    }

}]);
