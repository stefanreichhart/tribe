var application = angular.module("tribeApplication");

application.controller('AddController', function($scope, $routeParams, $log) {
	$scope.submit = function() {
		if ($scope.addableGroup != null) {
			$scope.addGroup($scope.item.groups, $scope.addableGroup);
		}
		originalItem = angular.extend(originalItem, $scope.item);
		$scope.item = angular.extend({}, originalItem);
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
			"groups": $routeParams.id ? [ $routeParams.id ] : []
		}
	};
	$scope.textBack = "Back";
	$scope.textCancel = "Cancel & Back";
	$scope.textSave = "Save & Back";
	var originalItem = $scope.emptyItem();
	$scope.item = angular.extend({}, originalItem);
});