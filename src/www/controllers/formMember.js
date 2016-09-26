var application = angular.module("tribeApplication");

application.controller("FormMemberController", function($scope, $routeParams, $location, $mdDateLocale, $mdDialog, $log) {
	$scope.today = function() {
		return $mdDateLocale.formatDate(new Date());
	};
	$scope.newEmptyPhoneNumber = function() { 
		return {
			"private": null 
		};
	};
	$scope.newEmptyEmail = function() { 
		return {
			"private": null 
		};
	};
	$scope.newEmptyAddress = function() { 
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
	$scope.cancelMemberConfirmed = function(event) {
		var confirm = $mdDialog.confirm()
			.title("Discard changes?")
			.htmlContent("Are you sure you want to discard all changes made to the member " + $scope.member.firstname + " " + $scope.member.lastname + "? <br />This action cannot be undone.")
			.targetEvent(event)
			.ok("Discard changes")
			.cancel("Cancel");

		$mdDialog.show(confirm)
			.then(function() {
				$scope.goBack();
			}, function() {
				// do nothing
			});
	};
});