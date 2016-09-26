var application = angular.module("tribeApplication");

application.controller("MainViewController", function($scope, $routeParams, $location, $mdDialog, $log) {
	$scope.getMembersByGroup = function(id) {
		if (id === undefined || id === null) {
			return $scope.members;
		} else {
			return Tribe.select($scope.members, function(member, memberIndex) {
				return Tribe.anySatisfy(member.groups, function(group, groupIndex) {
					return group == id;
				});
			});
		}
	};
	$scope.getGroupbyId = function(id) {
		return Tribe.detect($scope.groups, function(group, groupIndex) {
			return group.id == id;
		});
	};
	$scope.hasGroupById = function(id) {
		return id != undefined
			&& id != null
			&& !!("" + id).replace(/\s+/g, "")
			&& !!$scope.selectedGroup;
	};
	$scope.resetSearch = function() {
		$scope.searchText = "";
		$location.search("search", undefined);
	};
	$scope.searchText = $location.search().search || "";
	$scope.selectedGroup = $scope.getGroupbyId($routeParams.id);
	$scope.selectedGroupMembers = [];
	if (!$scope.hasGroupById($routeParams.id)) {
		$location.url($scope.mainViewUrl());
	}
	$scope.refresh = function() {
		$scope.selectedGroup = $scope.getGroupById($routeParams.id);
		$scope.selectedGroupMembers = $scope.selectedGroup ? $scope.getMembersByGroup($routeParams.id) : $scope.members;
	}
	$scope.refresh();
	$scope.removeMemberFromGroup = function(member, group, event) {
		if (member && group) {
			var index = member.groups.indexOf(group.id);
			member.groups.splice(index, 1);	
			$scope.refresh();
		}
	};
	$scope.removeMember = function(member) {
		if (member) {
			var index = $scope.members.indexOf(member);
			$scope.members.splice(index, 1);
			$scope.refresh();
		}
	};
	$scope.removeGroup = function(group) {
		if (group) {
			var index = $scope.groups.indexOf(group);
			$scope.groups.splice(index, 1);
			angular.forEach($scope.members, function(member) {
				$scope.removeMemberFromGroup(member, group);
			});
			$scope.refresh();
		}
	};
	$scope.addMemberToGroup = function(member, group) {
		if (member && group && !Tribe.includes(member.groups, group.id)) {
			member.groups.push(group.id);
			$scope.refresh();
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
			$scope.refresh();
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
	
});