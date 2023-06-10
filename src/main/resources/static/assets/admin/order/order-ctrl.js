app.controller('order-ctrl', function ($scope, $http) {
	$scope.items = [];
	$scope.initialize = function(){
        $http.get('/rest/orders').then(resp => {
            $scope.items = resp.data;
            console.log($scope.items);
        });
    }

    $scope.initialize();

    //phân trang

    $scope.pageSize = 10;
	$scope.start = 0;
	$scope.pageIndex = 0;

	$scope.changeSizeOrder = function (item) {
        $scope.pageSize = item;
        console.log($scope.pageSize);
        if (item == -1) {
            $scope.pageSize = ' '
        }
    }

    $scope.count = function () {
        return Math.ceil(1.0 * $scope.items.length / $scope.pageSize);
    }
})