var application = angular.module("tribeApplication");

application.controller("EditMemberController", function($scope, $routeParams, $location, $mdDateLocale, $log) {
	$scope.submit = function() {
		if ($scope.addableGroup != null) {
			$scope.addGroup($scope.member.groups, $scope.addableGroup);
		}
		$scope.originalMember = angular.merge($scope.originalMember, $scope.member);
		$scope.member = angular.merge({}, $scope.originalMember);
		$scope.goBack();
	};
	$scope.originalMember = $scope.getMemberById($routeParams.id);
	if (!$scope.originalMember) {
		$log.debug("Member not found", $routeParams.id);
		$location.url($scope.viewMemberUrl($scope.member));
	}
	$scope.member = angular.merge({}, $scope.originalMember);
});
