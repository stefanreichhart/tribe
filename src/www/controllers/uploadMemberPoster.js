var application = angular.module("tribeApplication");

application.controller("UploadMemberPosterController", function($scope, FileUploader, $log) {
	var extensions = [ ".jpg", ".jpeg", ".png", ".gif" ];
	var maxSize = 1;
	var uploader = $scope.uploader = new FileUploader({
		url: "/upload/member"
	});
	$scope.progress = null;
	$scope.errors = [];
	uploader.filters.push({
		name:'fileExtension', 
		fn: function(fileItem) { 
			return Tribe.anySatisfy(extensions, function(each, index) {
				return fileItem.name.toLowerCase().indexOf(each) !== -1;
			})
		},
		msg: function(fileItem) {
			var index = fileItem.name.lastIndexOf(".");
			var extension = fileItem.name.substring(index, fileItem.name.length);
			return "File is not supported (" + extension + "). Supported formats are " + extensions.join(", ");
		}
	});

	uploader.filters.push({
		name:'fileSize', 
		fn: function(fileItem) { 
			return fileItem.size && fileItem.size < (maxSize * 1024 * 1024);
		},
		msg: function(fileItem) {
			var size = Math.floor(fileItem.size / 1024 / 1024);
			return "File is too large (" + size + " MB). Maximum size is " + maxSize + " MB";
		}
	});
	uploader.onWhenAddingFileFailed = function(item, filter, options) {
		$scope.errors.push(filter.msg(item));
		console.info('onWhenAddingFileFailed', item, filter, options);
	};
	uploader.onAfterAddingFile = function(fileItem) {
		$scope.errors = [];
		uploader.uploadAll();
	};
	/*
	uploader.onAfterAddingAll = function(addedFileItems) {
		uploader.uploadAll();
	};
	*/
	uploader.onBeforeUploadItem = function(item) {
		$scope.progress = 0;
	};
	uploader.onProgressItem = function(fileItem, progress) {
		$scope.progress = progress;
	};
	/*
	uploader.onProgressAll = function(progress) {
		console.info('onProgressAll', progress);
	};
	uploader.onSuccessItem = function(fileItem, response, status, headers) {
		console.info('onSuccessItem', fileItem, response, status, headers);
	};
	uploader.onErrorItem = function(fileItem, response, status, headers) {
		console.info('onErrorItem', fileItem, response, status, headers);
	};
	uploader.onCancelItem = function(fileItem, response, status, headers) {
		console.info('onCancelItem', fileItem, response, status, headers);
	};
	*/
	uploader.onCompleteItem = function(fileItem, response, status, headers) {
		if (status == 200 && response && !response.error && response.file) {
			$scope.member.poster = response.file;
		}
	};
	uploader.onCompleteAll = function() {
		$scope.progress = null;
		$scope.errors = [];
	};
});