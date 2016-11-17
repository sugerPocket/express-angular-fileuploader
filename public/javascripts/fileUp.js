(function() {
    'use strict';

    angular
        .module('fileApp', ['angularFileUpload'])
        .controller('faController', ['$scope', 'FileUploader', '$http', function($scope, FileUploader, $http) {
            var uploader = $scope.uploader = new FileUploader({
                url: '/upload',
                removeAfterUpload: true
            });

            $scope.message = "";

            //定义filter

            uploader.filters.push({
                name: 'outOfSize',
                fn: function(item, options) {
                    return item.size / 1024 / 1024 < 15;
                }
            });

            uploader.filters.push({
                name: 'isFull',
                fn: function(item, options) {
                    return this.queue.length <= 1;
                }
            });

            uploader.filters.push({
                name: 'fileName',
                fn: function(item, options) {
                    var name = item.name;
                    var reg_15 = /^15331[0-9]{3}_([\u4e00-\u9fa5]){2,3}\.zip$/;
                    var reg_14 = /^14[0-9]{6}_([\u4e00-\u9fa5]){2,3}\.zip$/;
                    return reg_15.test(name) || reg_14.test(name);
                }
            });


            uploader.onAfterAddingFile = function(fileItem) {
                if (this.queue.length > 1) this.queue.shift();
                $scope.message = "";
            };

            uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/ , filter, options) {
                $scope.message = "Select files as required!";
            };

            uploader.onErrorItem = function(fileItem, response, status, headers) {
                $scope.message = "failed!";
            };

            uploader.onProgressAll = function(progress) {
                $scope.message = "uploading...";
            };

            uploader.onSuccessItem = function(fileItem, response, status, headers) {
                if (response.success) $scope.message = "Success!";
                else $scope.message = response.error;
            };
        }]);
})();