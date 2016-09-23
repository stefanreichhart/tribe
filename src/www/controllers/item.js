var application = angular.module("tribeApplication");

application.controller("ItemController", function($scope, $routeParams, $location, $mdDateLocale, $log) {
	$scope.today = function() {
		return $mdDateLocale.formatDate(new Date());
	};

	$scope.emptyPhoneNumber = function() { 
		return {
			"private": null 
		};
	};
	$scope.emptyEmail = function() { 
		return {
			"private": null 
		};
	};
	$scope.emptyAddress = function() { 
		return {
			"type": null, 
			"street": null,
			"zip": null,
			"city": null,
			"country": null
		};
	};
	$scope.addListEntry = function(list, each) {
		list.push(each);
	};
	$scope.removeListEntry = function(list, each) {
		list.splice(list.indexOf(each), 1);
	};
	$scope.addableGroups = null;
	$scope.getAddableGroups = function(list) {
		if ($scope.addableGroups == null) {
			var groups = [];
			angular.forEach($scope.database.groups, function(each, index) {
				if (!Tribe.includes(list, each.id)) {
					groups.push(each);
				}
			});
			$scope.addableGroups = groups;
		}
		return $scope.addableGroups;
	};
	$scope.addableGroup = null;
	$scope.addGroup = function(list, group) {
		if (group && group.id != null && !Tribe.includes(list, group.id)) {
			list.push(group.id);
			$scope.addableGroup = null;
			$scope.addableGroups = null;
			$scope.searchText = null;
		}
	};
	$scope.removeGroup = function(list, group) {
		if (group && group.id != null && Tribe.includes(list, group.id)) {
			list.splice(list.indexOf(group.id), 1);
			$scope.addableGroups = null;
			$scope.searchText = null;
		}
	};
});