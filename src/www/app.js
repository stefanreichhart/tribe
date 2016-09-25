var application = angular.module("tribeApplication", [ "ngRoute", "ngMaterial", "ngMessages", "ngSanitize", "ngDragDrop" ]);

application.constant("types", [ 'work', 'home' ]);

application.config(function($routeProvider) {
	$routeProvider
		.when("/items", {
			templateUrl: "/templates/items.html",
			controller: "ItemsController",
			reloadOnSearch: false
		})
		.when("/group/:id", {
			templateUrl: "/templates/items.html",
			controller: "ItemsController",
			reloadOnSearch: false
		})
		.when("/add/item", {
			templateUrl: "/templates/add.html",
			controller: "AddController",
		})
		.when("/add/item/group/:id", {
			templateUrl: "/templates/add.html",
			controller: "AddController",
		})
		.when("/view/:id", {
			templateUrl: "/templates/view.html",
			controller: "ViewController"
		})
		.when("/edit/:id", {
			templateUrl: "/templates/edit.html",
			controller: "EditController"
		})
		.otherwise({
			redirectTo: "/items"
		});
});

application.config(function($mdThemingProvider) {
	$mdThemingProvider.disableTheming();
});

application.config(function($mdDateLocaleProvider) {
	$mdDateLocaleProvider.formatDate = function(date) {
      var m = moment(date);
      return m.isValid() ? m.format('L') : '';
    };
    $mdDateLocaleProvider.parseDate = function(dateString) {
      var m = moment(dateString, 'L', true);
      return m.isValid() ? m.toDate() : new Date(NaN);
    };
});

application.controller("tribeController", function($scope, $http, $location, $window, $log) {
	$scope.database = {};
	$scope.items = [];
	$scope.error = null;
	$http.get("/data/database.json")
		.success(function(response) {
			$log.debug(response);
			if (response) {
				$log.debug("loaded", response);
				$scope.database = response || {};
				$scope.items = response.items || [];
			}
		})
		.error(function(error) {
			$log.debug($scope, error);
			$scope.error = error;
		});
	$scope.goBack = function() {
		$window.history.back();
	};
	$scope.getItemById = function(id) {
		return Tribe.detect($scope.items, function(each, index) {
			return id === each.id || id === "" + each.id;
		});
	};
	$scope.getNextId = function() {
		var lastItem = $scope.items[$scope.items.length-1] || {};
		return (lastItem.id || 0) + 1;
	};
	$scope.editItemUrl = function(item) {
		return "/edit/" + item.id;
	};
	$scope.removeItemUrl = function(item) {
		return "/remove/" + item.id;
	};
	$scope.viewItemUrl = function(item) {
		return "/view/" + item.id;
	};
	$scope.addItemUrl = function(group) {
		return group && group.id ? "/add/item/group/" + group.id : "/add/item";
	};
	$scope.viewItemsUrl = function() {
		return "/items";
	};
	$scope.groupUrl = function(id) {
		return "/group/" + id;
	};
	$scope.getGroups = function(item) {
		var groups = [];
		angular.forEach($scope.database.groups, function(each, index) {
			if (Tribe.includes(item.groups, each.id)) {
				groups.push(each);
			}
		});
		return groups;
	};
});