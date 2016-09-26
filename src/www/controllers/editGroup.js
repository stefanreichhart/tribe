var application = angular.module("tribeApplication");

application.controller("EditGroupController", function($scope, $routeParams, $location, $log) {
	$scope.submit = function() {
		$scope.originalGroup = angular.merge($scope.originalGroup, $scope.group);
		$scope.group = angular.merge({}, $scope.originalGroup);
		$scope.goBack();
	};
	$scope.originalGroup = $scope.getGroupById($routeParams.id);
	if (!$scope.originalGroup) {
		$log.debug("Group not found", $routeParams.id);
		$location.url($scope.mainViewUrl());
	}
	$scope.group = angular.merge({}, $scope.originalGroup);
});