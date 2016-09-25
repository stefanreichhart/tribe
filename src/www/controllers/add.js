var application = angular.module("tribeApplication");

application.controller('AddController', function($scope, $routeParams, $log) {
	$scope.submit = function() {
		if ($scope.addableGroup != null) {
			$scope.addGroup($scope.item.groups, $scope.addableGroup);
		}
		$scope.originalItem = angular.extend($scope.originalItem, $scope.item);
		$scope.item = angular.extend({}, $scope.originalItem);
		$scope.item.id = $scope.getNextId();
		$scope.items.push($scope.item);
		$scope.goBack();
	};
	$scope.emptyItem = function() {
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
	$scope.originalItem = $scope.emptyItem();
	$scope.item = angular.extend({}, $scope.originalItem);
});