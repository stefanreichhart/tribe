var application = angular.module("tribeApplication");

application.controller("FormTypeController", function($scope) {
	$scope.defaultSuggestions = [ "home", "work" ];
	$scope.getSuggestions = function() {
		var suggestions = angular.extend([], $scope.defaultSuggestions, Tribe.deepSelect($scope.members, 
			function(value, key) {
				return key == "type";
			}, function(value, key) {
				return value;
			}));
		return Tribe.unique(suggestions);
	};
	$scope.getAllSuggestionsWithSearch = function(searchText) {
		var suggestions = $scope.getSuggestions();
		suggestions.splice(0, 0, searchText);
		return suggestions;
	}
});