var application = angular.module("tribeApplication");

application.controller("EditController", function($scope, $routeParams, $location, $mdDateLocale, $log) {
	$scope.submit = function() {
		if ($scope.addableGroup != null) {
			$scope.addGroup($scope.item.groups, $scope.addableGroup);
		}
		originalItem = angular.extend(originalItem, $scope.item);
		$scope.item = angular.extend({}, originalItem);
		$scope.goBack();
	};
	$scope.textBack = "Back";
	$scope.textCancel = "Cancel & Back";
	$scope.textSave = "Save & Back";
	var originalItem = $scope.getItemById($routeParams.id);
	if (!originalItem) {
		$log.debug("Item not found", $routeParams.id);
		$scope.goto($scope.viewItemUrl($scope.item));
	}
	$scope.item = angular.extend({}, originalItem);
});

application.controller("KeyValueAutocompleterController", function($scope, $log) {
	$scope.getSuggestions = function(searchKey, searchMax) {
		return Tribe.deepSelect($scope.items, 
			function(value, key) {
				return key == searchKey;
			}, function(value, key) {
				return value;
			},
			searchMax,
			true);
	};
	$scope.getAllSuggestionsWithSearch = function(searchKey, searchText, searchMax) {
		var suggestions = $scope.getSuggestions(searchKey, searchMax);
		if (searchText && !!(""+searchText).replace(/\s+/g, "")) {
			suggestions.splice(0, 0, searchText);
		}
		return suggestions;
	}
});