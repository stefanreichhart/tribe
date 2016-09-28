var application = angular.module("tribeApplication");

application.controller("MainViewController", function($scope, $routeParams, $location, $mdDialog, $log) {
	$scope.resetSearch = function() {
		$scope.searchText = "";
		$location.search("search", undefined);
	};
	$scope.removeMemberFromGroup = function(member, group, event) {
		if (member && group) {
			var index = member.groups.indexOf(group.id);
			member.groups.splice(index, 1);	
			$scope.selectGroupFromRequest();
		}
	};
	$scope.removeMember = function(member) {
		if (member) {
			var index = $scope.members.indexOf(member);
			$scope.members.splice(index, 1);
			$scope.selectGroupFromRequest();
		}
	};
	$scope.removeGroup = function(group) {
		if (group) {
			var index = $scope.groups.indexOf(group);
			$scope.groups.splice(index, 1);
			angular.forEach($scope.members, function(member) {
				$scope.removeMemberFromGroup(member, group);
			});
			$scope.selectGroupFromRequest();
		}
	};
	$scope.addMemberToGroup = function(member, group) {
		if (member && group && !Tribe.includes(member.groups, group.id)) {
			member.groups.push(group.id);
			$scope.selectGroupFromRequest();
		}
	};
	$scope.cloneGroup = function(group) {
		if (group) {
			var newGroup = angular.extend({}, group);
			newGroup.id = $scope.getNextGroupId();
			newGroup.name = Tribe.incremented(newGroup.name);
			$scope.groups.push(newGroup);
			angular.forEach($scope.members, function(member, index) {
			if (member && group && Tribe.includes(member.groups, group.id)) {
					
					$scope.addMemberToGroup(member, newGroup);
				}
			});
			$scope.selectGroupFromRequest();
		}
	};
	$scope.removeGroupConfirmed = function(group, event) {
		// Appending dialog to document.body to cover sidenav in docs app
		var confirm = $mdDialog.confirm()
			.title("Remove group?")
			.htmlContent("Are you sure you want to remove the group " + group.name + "? <br />This will not remove any member from the database. This action cannot be undone.")
			.targetEvent(event)
			.ok("Remove group")
			.cancel("Cancel");

		$mdDialog.show(confirm)
			.then(function() {
				$scope.removeGroup(group);
			}, function() {
				// do nothing
			});
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
	var draggable = null;
	$scope.onDragStart = function(event, ui, member) {
		draggable = member;
		var original = angular.element(event.target);
		var clone = angular.element(ui.helper);
		clone.css({
			width: original.outerWidth(),
			height: original.outerHeight()
		});
	};
	$scope.onDropSuccess = function(event, ui, group) {
		if (group && draggable && !Tribe.includes(draggable.groups, group.id)) {
			draggable.groups.push(group.id);
		}
		draggable = null;
	};
	$scope.searchText = $location.search().search || "";
	$scope.selectGroupFromRequest();
});