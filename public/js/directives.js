'use strict';

/* Directives */


var app = angular.module('procrastinarApp.directives', []);

app.directive('appVersion', ['version', function(version) {
	return function(scope, elm, attrs) {
  		elm.text(version);
	};
}]);

app.directive('youtube', function($sce) {
  return {
    restrict: 'EA',
    scope: { code:'=' },
    replace: true,
    template: '<div class="youtube-div"><iframe style="overflow:hidden;height:100%;width:100%" width="100%" height="100%" src="{{url}}" frameborder="0" allowfullscreen></iframe></div>',
    link: function (scope) {
        scope.$watch('code', function (newVal) {
           if (newVal) {
               scope.url = $sce.trustAsResourceUrl("http://www.youtube.com/embed/" + newVal);
           }
        });
    }
  };
});
