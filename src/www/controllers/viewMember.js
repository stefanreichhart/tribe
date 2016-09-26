var application = angular.module("tribeApplication");

application.controller("ViewMemberController", function($scope, $routeParams, $location, $mdDialog, $log) {
	$scope.removeMember = function(member) {
		var index = $scope.members.indexOf(member);
		$scope.members.splice(index, 1);
		$scope.goBack();
	};
	$scope.removeMemberConfirmed = function(member, event) {
		// Appending dialog to document.body to cover sidenav in docs app
		var confirm = $mdDialog.confirm()
			.title("Remove member?")
			.htmlContent("Are you sure you want to remove the member " + member.firstname + " " + member.lastname + "? <br />This action cannot be undone.")
			.targetEvent(event)
			.ok("Remove member")
			.cancel("Cancel");

		$mdDialog.show(confirm)
			.then(function() {
				$scope.removeMember(member);
			}, function() {
				// do nothing
			});
	};
	$scope.member = $scope.getMemberById($routeParams.id);
	if (!$scope.member) {
		$log.debug("Member not found", $routeParams.id);
		$location.url($scope.getMaiViewUrl());
	}
	$scope.showMap = Tribe.anySatisfy($scope.member.addresses || [], function(each, index) {
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