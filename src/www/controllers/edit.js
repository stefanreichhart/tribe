var application = angular.module("tribeApplication");

application.controller("EditController", function($scope, $routeParams, $location, $mdDateLocale, $log) {
	$scope.submit = function() {
		if ($scope.addableGroup != null) {
			$scope.addGroup($scope.item.groups, $scope.addableGroup);
		}
		$scope.originalItem = angular.extend($scope.originalItem, $scope.item);
		$scope.item = angular.extend({}, $scope.originalItem);
		$scope.goBack();
	};
	$scope.originalItem = $scope.getItemById($routeParams.id);
	if (!$scope.originalItem) {
		$log.debug("Item not found", $routeParams.id);
		$location.url($scope.viewItemUrl($scope.item));
	}
	$scope.item = angular.extend({}, $scope.originalItem);
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
	};
});