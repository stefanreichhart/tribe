var application = angular.module("tribeApplication");

application.controller("FormGroupController", function($scope, $routeParams, $location, $mdDialog, $log) {
	$scope.cancelGroupConfirmed = function(event) {
		var confirm = $mdDialog.confirm()
			.title("Discard changes?")
			.htmlContent("Are you sure you want to discard all changes made to the group " + $scope.group.name + "? <br />This action cannot be undone.")
			.targetEvent(event)
			.ok("Discard changes")
			.cancel("Cancel");

		$mdDialog.show(confirm)
			.then(function() {
				$scope.goBack();
			}, function() {
				// do nothing
			});
	};
});