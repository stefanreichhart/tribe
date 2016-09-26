var application = angular.module("tribeApplication");

application.controller('AddMemberController', function($scope, $routeParams, $log) {
	$scope.submit = function() {
		if ($scope.addableGroup != null) {
			$scope.addGroup($scope.member.groups, $scope.addableGroup);
		}
		$scope.originalMember = angular.merge($scope.originalMember, $scope.member);
		$scope.member = angular.merge({}, $scope.originalMember);
		$scope.member.id = $scope.getNextMemberId();
		$scope.members.push($scope.member);
		$scope.goBack();
	};
	$scope.newEmptyMember = function() {
		return {
			"id": null,
			"poster": "",
			"firstname": "",
			"lastname": "",
			"position": "",
			"addresses": [
				{
						"type": "private", 
						"street": "",
						"zip": "",
						"city": "",
						"country": "",
						"map": false
				}
			],
			"phonenumbers": [
				{
					"type": "private",  
					"phone": ""
				}
			],
			"emails": [
				{
					"type": "private",  
					"number": ""
				}
			],
			"description": "",
			"groups": $routeParams.id ? [ $routeParams.id ] : []
		}
	};
	$scope.originalMember = $scope.newEmptyMember();
	$scope.member = angular.merge({}, $scope.originalMember);
});