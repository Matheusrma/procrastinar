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
		return m_youtubeId;
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

function Like(name, category){
	var m_name = name;
	var m_category = category;

	this.getName = function(){
		return m_name;
	}

	this.getCategory = function(){
		return m_category;
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
			facebookQuery(response.paging.next, response.data, function(likes){
				m_likes = [];

        for (var i = 0; i < likes.length; ++i){
        	m_likes.push(new Like(likes[i].name,likes[i].category));
        }

        var categoryDict = {};

        for (var i = 0; i < m_likes.length; ++i){
        	if (!(m_likes[i].getCategory() in categoryDict))
        		categoryDict[m_likes[i].getCategory()] = {'count':0 , 'likes':[]};

        	categoryDict[m_likes[i].getCategory()].count++;
        	categoryDict[m_likes[i].getCategory()].likes.push(m_likes[i]);
        }

        var dice = Math.floor(Math.random() * Object.keys(categoryDict).length);
        var sum = 0;
        var chosenCategory = "";

        for (var category in categoryDict){
        	sum += categoryDict[category].count;

        	if (dice < sum){
        		chosenCategory = category;
        		break;
        	}
        }

        var randomIndex = Math.floor(Math.random() * categoryDict[chosenCategory].likes.length);

        m_currentRecomendationSource = categoryDict[chosenCategory].likes[randomIndex].getName();

        youtubeSearch(m_currentRecomendationSource, 15, maxDuration);

        m_generated = true;
			});					
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

  var facebookQuery = function(url,likes, callback){
  	$.get(url
	    ,{},
	    function(response) {			       
	      likes = likes.concat(response.data);	

	      if ('next' in response.paging)
	       	facebookQuery(response.paging.next, likes, callback);
	      else
	       	callback(likes)
	    }
		);
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

  	var request = gapi.client.youtube.search.list({
    	part: 'snippet',

    	q: "\"" + p_query + "\"",
    	maxResults: p_maxResults,
    	type: 'video',
    	videoEmbeddable : 'true'
  	});

  	request.execute(function(response) {

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

    // $scope.login();
}]);
