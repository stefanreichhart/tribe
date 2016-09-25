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

application.controller("ItemsController", function($scope, $routeParams, $location, $mdDialog, $log) {
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
	$scope.selectedGroupItems = [];
	$scope.refresh = function() {
		$scope.selectedGroupItems = $scope.getItemsByGroup($routeParams.id);
	}
	$scope.refresh();
	$scope.removeItemFromGroup = function(item, group, event) {
		var id = item.groups.indexOf(group.id);
		item.groups.splice(id, 1);	
		$scope.refresh();
	};
	$scope.removeItem = function(item) {
		var index = $scope.items.indexOf(item);
		$scope.items.splice(index, 1);
		$scope.refresh();
	};
	$scope.removeItemConfirmed = function(item, event) {
		// Appending dialog to document.body to cover sidenav in docs app
		var confirm = $mdDialog.confirm()
			.title("Remove member?")
			.htmlContent("Are you sure you want to remove the member " + item.firstname + " " + item.lastname + "? <br />This action cannot be undone.")
			.targetEvent(event)
			.ok("Remove member")
			.cancel("Cancel");

		$mdDialog.show(confirm)
			.then(function() {
				$scope.removeItem(item);
			}, function() {
				// do nothing
			});
	};
	var draggable = null;
	$scope.onDragStart = function(event, ui, item) {
		draggable = item;
		var original = angular.element(event.target);
		var clone = angular.element(ui.helper);
		clone.css({
			width: original.outerWidth(),
			height: original.outerHeight()
		});
	};
	$scope.onDropSuccess = function(event, ui, group) {
		if (group && draggable && !Tribe.includes(draggable.groups, group.id)) {
			draggable.groups.push(group.id);
		}
		draggable = null;
	};
	
});