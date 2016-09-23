var application = angular.module("tribeApplication");

application.controller("ViewController", function($scope, $routeParams, $location, $log) {
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
});