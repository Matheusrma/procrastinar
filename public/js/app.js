'use strict';

var app = angular.module('procrastinarApp', ['procrastinarApp.filters', 'procrastinarApp.services', 
						 'procrastinarApp.directives','procrastinarApp.Controllers','ngRoute','facebook']);

app.config(['$routeProvider', '$locationProvider', 'FacebookProvider', function($routeProvider, $locationProvider, FacebookProvider) {
    
    $routeProvider.when('/index', {templateUrl: 'partial/main'});

    $routeProvider.otherwise({redirectTo: '/index'});
    
    $locationProvider.html5Mode(true);

	// PROD
    // FacebookProvider.init('268834626616980');
    
    // DEV
    FacebookProvider.init('612253015520613');
  }]);
