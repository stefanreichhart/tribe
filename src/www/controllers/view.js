var application = angular.module("tribeApplication");

application.controller("ViewController", function($scope, $routeParams, $location, $mdDialog, $log) {
	$scope.item = $scope.getItemById($routeParams.id);
	if (!$scope.item) {
		$log.debug("Item not found", $routeParams.id);
		$location.url('/items');
	}
	$scope.showMap = Tribe.anySatisfy($scope.item.addresses || [], function(each, index) {
		return each.map === true;
	});
	if ($scope.googleMap && $scope.showMap) {
		jQuery("<script>")
			.attr({
				src: "https://maps.googleapis.com/maps/api/js?key=AIzaSyB7a5yoZSk2DHwukVlykFQUHFy1jTKGm7s&callback=Tribe.initGoogleMaps" 
			})
			.appendTo("body");
	}
	$scope.removeItem = function(item) {
		var index = $scope.items.indexOf(item);
		$scope.items.splice(index, 1);
		$scope.goBack();
	};
	$scope.removeItemConfirmed = function(item, event) {
		// Appending dialog to document.body to cover sidenav in docs app
		var confirm = $mdDialog.confirm()
			.title("Remove member?")
			.htmlContent("Are you sure you want to remove the member " + item.firstname + " " + item.lastname + "? <br />This action cannot be undone.")
			.targetEvent(event)
			.ok("Remove member")
			.cancel("Cancel");

		$mdDialog.show(confirm)
			.then(function() {
				$scope.removeItem(item);
			}, function() {
				// do nothing
			});
	};
});