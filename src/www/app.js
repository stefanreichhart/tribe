var application = angular.module("tribeApplication", [ "ngRoute", "ngMaterial", "ngMessages", "ngSanitize", "ngDragDrop", "angularFileUpload" ]);

application.constant("types", [ 'work', 'home' ]);

application.constant("googleMap", false);

application.filter("tokens", function($filter, $location, $window) {
	return function(list, search) {
		var results = list;
		if (search != undefined && search != null && !!(""+search).replace(/\s+/g, "")) {
			$location.search("search", search);
			var tokens = Tribe.unique(Tribe.select(search.split(" "), function(token, tokenIndex) {
				return !!token;
			}));
			for (var i = 0; i < tokens.length; i++) {
				var token = tokens[i];
				results = $filter("filter")(results, token, "$"); // case insensitive 
			}
			
		} 
		return results;
	};
});

application.directive("tribeScrollTop", function() {
	return {
		link: function($scope, $element) {
			$element.on('click', function() {
				angular.element("html,body").animate({
					scrollTop: 0
				}, "slow");
			});
		}
	}
});

application.config(function($routeProvider) {
	$routeProvider
		.when("/view", {
			templateUrl: "/templates/mainView.html",
			controller: "MainViewController",
			reloadOnSearch: false
		})
		.when("/view/group/:id", {
			templateUrl: "/templates/mainView.html",
			controller: "MainViewController",
			reloadOnSearch: false
		})
		.when("/view/member/:id", {
			templateUrl: "/templates/viewMember.html",
			controller: "ViewMemberController"
		})
		.when("/edit/member/:id", {
			templateUrl: "/templates/editMember.html",
			controller: "EditMemberController"
		})
		.when("/add/member", {
			templateUrl: "/templates/addMember.html",
			controller: "AddMemberController",
		})
		.when("/add/member/group/:id", {
			templateUrl: "/templates/addMember.html",
			controller: "AddMemberController",
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
			redirectTo: "/view"
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
	$scope.members = [];
	$scope.error = null;
	$http.get("/data/database.json")
		.success(function(response) {
			$log.debug(response);
			if (response) {
				$log.debug("loaded", response);
				$scope.database = response || {};
				$scope.members = response.members || [];
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
	$scope.getMemberById = function(id) {
		return Tribe.detect($scope.members, function(each, index) {
			return id === each.id || id === "" + each.id;
		});
	};
	$scope.getGroupById = function(id) {
		return Tribe.detect($scope.groups, function(each, index) {
			return id === each.id || id === "" + each.id;
		});
	};
	$scope.getNextMemberId = function() {
		var lastMember = $scope.members[$scope.members.length-1] || {};
		return (lastMember.id || 0) + 1;
	};
	$scope.getNextGroupId = function() {
		var lastGroup = $scope.groups[$scope.groups.length-1] || {};
		return (lastGroup.id || 0) + 1;
	};
	$scope.editMemberUrl = function(member) {
		return "/edit/member/" + member.id;
	};
	$scope.viewMemberUrl = function(member) {
		return "/view/member/" + member.id;
	};
	$scope.addMemberUrl = function(group) {
		return group ? "/add/member/group/" + group.id : "/add/member";
	};
	$scope.mainViewUrl = function() {
		return "/view";
	};
	$scope.addGroupUrl = function() {
		return "/add/group";
	};
	$scope.editGroupUrl = function(group) {
		return group ? "/edit/group/" + group.id : "";
	};
	$scope.viewGroupUrl = function(group) {
		return group ? "/view/group/" + group.id : "";
	};
	$scope.getGroups = function(member) {
		var groups = [];
		angular.forEach($scope.database.groups, function(each, index) {
			if (Tribe.includes(member.groups, each.id)) {
				groups.push(each);
			}
		});
		return groups;
	};
});