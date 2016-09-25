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
		.when("/edit/group/:id", {
			templateUrl: "/templates/editGroup.html",
			controller: "EditGroupController"
		})
		.when("/add/group", {
			templateUrl: "/templates/addGroup.html",
			controller: "AddGroupController"
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
	$scope.groups = [];
	$scope.items = [];
	$scope.error = null;
	$http.get("/data/database.json")
		.success(function(response) {
			$log.debug(response);
			if (response) {
				$log.debug("loaded", response);
				$scope.database = response || {};
				$scope.items = response.items || [];
				$scope.groups = response.groups || [];
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
	$scope.getGroupById = function(id) {
		return Tribe.detect($scope.groups, function(each, index) {
			return id === each.id || id === "" + each.id;
		});
	};
	$scope.getNextId = function() {
		var lastItem = $scope.items[$scope.items.length-1] || {};
		return (lastItem.id || 0) + 1;
	};
	$scope.getNextGroupId = function() {
		var lastGroup = $scope.groups[$scope.groups.length-1] || {};
		return (lastGroup.id || 0) + 1;
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
		return group ? "/add/item/group/" + group.id : "/add/item";
	};
	$scope.viewItemsUrl = function() {
		return "/items";
	};
	$scope.addGroupUrl = function() {
		return "/add/group";
	};
	$scope.editGroupUrl = function(group) {
		return group ? "/edit/group/" + group.id : "";
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