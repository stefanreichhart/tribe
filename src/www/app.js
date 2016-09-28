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

application.controller("tribeController", function($scope, $http, $location, $window, $routeParams, $log) {
	$scope.goBack = function() {
		$window.history.back();
	};
	$scope.getMemberById = function(id) {
		return Tribe.detect($scope.members, function(each, index) {
			return id === each._id || id === "" + each._id;
		});
	};
	$scope.getGroupById = function(id) {
		return Tribe.detect($scope.groups, function(each, index) {
			return id === each._id || id === "" + each._id;
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
		return "/edit/member/" + member._id;
	};
	$scope.viewMemberUrl = function(member) {
		return "/view/member/" + member._id;
	};
	$scope.addMemberUrl = function(group) {
		return group ? "/add/member/group/" + group._id : "/add/member";
	};
	$scope.mainViewUrl = function() {
		return "/view";
	};
	$scope.addGroupUrl = function() {
		return "/add/group";
	};
	$scope.editGroupUrl = function(group) {
		return group ? "/edit/group/" + group._id : "";
	};
	$scope.viewGroupUrl = function(group) {
		return group ? "/view/group/" + group._id : "";
	};
	$scope.getGroups = function(member) {
		var groups = [];
		angular.forEach($scope.groups, function(each, index) {
			if (Tribe.includes(member.groups, each.id)) {
				groups.push(each);
			}
		});
		return groups;
	};
	$scope.getGroupbyId = function(id) {
		console.log("getGroupbyId", id, $scope.groups);
		console.log($scope);
		console.log($scope.groups);
		return Tribe.detect($scope.groups, function(group, groupIndex) {
			return group.id == id;
		});
	};
	$scope.hasGroupById = function(id) {
		console.log("hasGroupById", id, $scope.groups);
		console.log($scope.selectedGroup);
		return id != undefined
			&& id != null
			&& !!("" + id).replace(/\s+/g, "")
			&& !!$scope.selectedGroup;
	};
	$scope.getMembersByGroup = function(id) {
		if (id === undefined || id === null) {
			return $scope.members;
		} else {
			return Tribe.select($scope.members, function(member, memberIndex) {
				return Tribe.anySatisfy(member.groups, function(group, groupIndex) {
					return group == id;
				});
			});
		}
	};
	$scope.resetSelectGroupFromRequest = function() {
		$scope.selectedGroup = null;
		$scope.selectedGroupMembers = $scope.members;
	};
	$scope.selectGroupFromRequest = function() {
		var selectedGroup = $scope.getGroupById($routeParams.id);
		if ($routeParams.id != undefined && $routeParams.id != null && !selectedGroup) {
			$location.url($scope.mainViewUrl());
		} else {
			if (selectedGroup != $scope.selectedGroup) {
				$scope.selectedGroup = selectedGroup
				$scope.selectedGroupMembers = $scope.selectedGroup ? $scope.getMembersByGroup($routeParams.id) : $scope.members;
			}
		}
	};
	$scope.groups = [];
	$scope.members = [];
	$scope.error = null;
	$scope.selectedGroup = null;
	$scope.selectedGroupMembers = $scope.members;
	if (!$scope.groups || $scope.groups.length < 1) {
		$http.get("/api/groups")
			.success(function(response) {
				$scope.groups = response.results;
				if (!$scope.members || $scope.members.length < 1) {
					$http.get("/api/members/details")
						.success(function(response) {
							$scope.members = response.results;
							$scope.resetSelectGroupFromRequest();
							$scope.selectGroupFromRequest();
						})
						.error(function(error) {
							$scope.error = error;
						});
				}
			})
			.error(function(error) {
				$scope.error = error;
			});
	}
});