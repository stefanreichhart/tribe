var application = angular.module("tribeApplication");

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

application.controller("ItemsController", function($scope, $routeParams, $location, $log) {
	$scope.getItemsByGroup = function(id) {
		if (id === undefined || id === null) {
			return $scope.database.items;
		} else {
			return Tribe.select($scope.database.items, function(item, itemIndex) {
				return Tribe.anySatisfy(item.groups, function(group, groupIndex) {
					return group == id;
				});
			});
		}
	};
	$scope.getGroupbyId = function(id) {
		return Tribe.detect($scope.database.groups, function(group, groupIndex) {
			return group.id == id;
		});
	};
	$scope.hasGroupById = function(id) {
		return id != undefined
			&& id != null
			&& !!("" + id).replace(/\s+/g, "")
			&& !!$scope.selectedGroup;
	};
	$scope.resetSearch = function() {
		$scope.searchText = "";
		$location.search("search", undefined);
	};
	$scope.searchText = $location.search().search || "";
	$scope.groups = $scope.database.groups;
	$scope.selectedGroup = $scope.getGroupbyId($routeParams.id);
	if (!$scope.hasGroupById($routeParams.id)) {
		$location.url("/items");
	}
	$scope.selectedGroupItems = $scope.getItemsByGroup($routeParams.id);
	
});