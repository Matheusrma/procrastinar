'use strict';

/* jasmine specs for controllers go here */

describe('controllers', function(){

	it('should return the parsed duration in seconds', function() {
		var video = new Video("","", "PT2M57S");

		expect(video.getDuration()).toBe(177);
	});

	it('should return the parsed duration in seconds even when seconds are below 10', function() {
    	var video = new Video("","", "PT0M7S");

    	expect(video.getDuration()).toBe(7);
  	});

  	it('should return the parsed duration in seconds even when seconds are below 10 indepentent to format', function() {
    	var video = new Video("","", "PT0M07S");

    	expect(video.getDuration()).toBe(7);
  	});

  	it('should return the parsed duration in seconds even when seconds are below 10 indepentent to format', function() {
    	var video = new Video("","", "PT1H1M07S");

    	expect(video.getDuration()).toBe(3667);
  	});

  	it('should return the parsed duration in seconds even when seconds are below 10 indepentent to format', function() {
    	var video = new Video("","", "PT1H07S");

    	expect(video.getDuration()).toBe(3607);
  	});

    it('should return the parsed duration in seconds even when seconds are below 10 indepentent to format', function() {
      var video = new Video("","", "PT3M22S");

      expect(video.getDuration()).toBe(202);
    });

});
