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
	$scope.selectedGroup = $scope.getGroupbyId($routeParams.id);
	$scope.selectedGroupItems = [];
	if (!$scope.hasGroupById($routeParams.id)) {
		$location.url("/items");
	}
	$scope.refresh = function() {
		$scope.selectedGroup = $scope.getGroupById($routeParams.id);
		$scope.selectedGroupItems = $scope.selectedGroup ? $scope.getItemsByGroup($routeParams.id) : $scope.items;
	}
	$scope.refresh();
	$scope.removeItemFromGroup = function(item, group, event) {
		if (item && group) {
			var index = item.groups.indexOf(group.id);
			item.groups.splice(index, 1);	
			$scope.refresh();
		}
	};
	$scope.removeItem = function(item) {
		if (item) {
			var index = $scope.items.indexOf(item);
			$scope.items.splice(index, 1);
			$scope.refresh();
		}
	};
	$scope.removeGroup = function(group) {
		if (group) {
			var index = $scope.groups.indexOf(group);
			$scope.groups.splice(index, 1);
			angular.forEach($scope.items, function(item) {
				$scope.removeItemFromGroup(item, group);
			});
			$scope.refresh();
		}
	};
	$scope.addItemToGroup = function(item, group) {
		if (item && group && !Tribe.includes(item.groups, group.id)) {
			item.groups.push(group.id);
			$scope.refresh();
		}
	};
	$scope.cloneGroup = function(group) {
		if (group) {
			var newGroup = angular.extend({}, group);
			newGroup.id = $scope.getNextGroupId();
			newGroup.name = Tribe.incremented(newGroup.name);
			$scope.groups.push(newGroup);
			angular.forEach($scope.items, function(item, index) {
			if (item && group && Tribe.includes(item.groups, group.id)) {
					
					$scope.addItemToGroup(item, newGroup);
				}
			});
			$scope.refresh();
		}
	};
	$scope.removeGroupConfirmed = function(group, event) {
		// Appending dialog to document.body to cover sidenav in docs app
		var confirm = $mdDialog.confirm()
			.title("Remove group?")
			.htmlContent("Are you sure you want to remove the group " + group.name + "? <br />This will not remove any member from the database. This action cannot be undone.")
			.targetEvent(event)
			.ok("Remove group")
			.cancel("Cancel");

		$mdDialog.show(confirm)
			.then(function() {
				$scope.removeGroup(group);
			}, function() {
				// do nothing
			});
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