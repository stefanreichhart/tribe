var application = angular.module("tribeApplication");

application.controller("AddGroupController", function($scope, $log) {
	$scope.submit = function() {
		$scope.originalGroup = angular.extend($scope.originalGroup, $scope.group);
		$scope.group = angular.extend({}, $scope.originalGroup);
		$scope.group.id = $scope.getNextGroupId();
		$scope.groups.push($scope.group);
		$scope.goBack();
	};
	$scope.emptyGroup = function() {
		return {
			"id": null,
			"name": ""
		}
	};
	$scope.originalGroup = $scope.emptyGroup();
	$scope.group = angular.extend({}, $scope.originalGroup);
});