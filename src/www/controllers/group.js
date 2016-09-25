var application = angular.module("tribeApplication");

application.controller("GroupController", function($scope, $routeParams, $location, $mdDialog, $log) {
	$scope.textBack = "Back";
	$scope.textCancel = "Cancel & Back";
	$scope.textSave = "Save & Back";
	$scope.cancelItemConfirmed = function(event) {
		// Appending dialog to document.body to cover sidenav in docs app
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