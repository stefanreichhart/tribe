var application = angular.module("tribeApplication");

application.controller("KeyValueAutocompleterController", function($scope, $log) {
	$scope.getSuggestions = function(searchKey, searchMax) {
		return Tribe.deepSelect($scope.members, 
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