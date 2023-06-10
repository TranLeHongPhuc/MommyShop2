app.controller('category-ctrl', function ($scope, $http) {

    $scope.tableToExcel = function () {
        var table2excel = new Table2Excel();
        table2excel.export(document.querySelectorAll("table.table-category"));
    };

    $scope.listCategories = [];
    $scope.form = {};
    $scope.parentCategories = [];
    $scope.childCategories = [];
    $scope.isBug = false;

    $scope.initialize = function () {

        $http.get('/rest/categories/listParent').then(resp => {
            $scope.parentCategories = resp.data;
        });

        $http.get('/rest/categories/listChild').then(resp => {
            $scope.childCategories = resp.data;
        });
    };

    // Khởi đầu
    $scope.initialize();

    // Xóa form
    $scope.reset = function () {
        $scope.form = {};
    };

    // hiển thị trên form
    $scope.edit = function (item) {
        $scope.form = angular.copy(item);
        $('.nav-tabs li:eq(0) button').tab('show');
    };

    // thêm sp
    $scope.create = function () {
        if (!$scope.checkValid()) {
            return;
        }
        var item = angular.copy($scope.form);
        console.log(item);
        $http.post(`/rest/categories`, item).then(resp => {
            if (!resp.data) {
                showWarningToast('Tên Danh mục đã tồn tại');
            } else {
                if (resp.data.parentCategory === null) {
                    $scope.parentCategories.push(resp.data);
                } else {
                    $scope.childCategories.push(resp.data);
                }
                $scope.reset();
                swal("Thành công!", "Danh mục của bạn đã được thêm!", "success");
            }
        }).catch(error => {
            swal("Thất bại!", "Vui lòng kiểm tra thông tin hoặc thử lại sau!", "error");
            console.log('Error', error);
            console.log($scope.item);
        });
    };

    // update
    $scope.update = function () {
        if (!$scope.checkValid()) {
            return;
        }
        var item = angular.copy($scope.form);
        console.log(item);
        $http.put(`/rest/categories/${item.id}`, item).then(resp => {
            if (resp.data.parentCategory == null) {
                var index = $scope.parentCategories.findIndex(c => c.id == item.id);
                $scope.parentCategories[index] = item;
            } else {
                var index = $scope.childCategories.findIndex(c => c.id == item.id);
                $scope.childCategories[index] = item;
            }
            $scope.reset();
            swal("Thành công!", "Danh mục của bạn đã được cập nhật!", "success");
        }).catch(error => {
            swal("Thất bại!", "Vui lòng kiểm tra thông tin hoặc thử lại sau!", "error");
            console.log("Error", error);
        });
    };

    // xóa sp
    $scope.delete = function (item) {
        if ($scope.isBug === true) {
            $scope.isBug = false;
            return;
        }
        swal({
            title: "Bạn muốn xóa danh mục này?",
            text: "Khi đã xóa, Bạn không thể khôi phục danh mục này",
            icon: "warning",
            buttons: ["Hủy!", "Đồng ý!"],
            dangerMode: true
        }).then((willDelete) => {
            if (willDelete) {
                axios({
                    url: `/rest/categories/delete/${item.id}`,
                    method: "DELETE"
                }).then((result) => {
                    if (result.data === 'OK') {
                        if (item.parentCategory == null) {
                            let index = $scope.parentCategories.findIndex(c => c.id == item.id);
                            $scope.parentCategories.splice(index, 1);
                        } else {
                            let index = $scope.childCategories.findIndex(c => c.id == item.id);
                            $scope.childCategories.splice(index, 1);
                        }
                        $scope.reset();
                        swal("Thành công!", "Danh mục của bạn đã được xóa!", "success");
                        $scope.isBug = true;
                        $("button.btn[ng-click='delete(item)']:first").click();
                    } else if (result.data === 'Existed child Categories') {
                        swal("Thất bại! Đã có Danh mục con liên kết với Danh mục này!", {
                            icon: "error",
                        });
                    } else if (result.data === 'Existed integrated Products') {
                        swal("Thất bại! Đã có Sản phẩm thuộc Danh mục này!", {
                            icon: "error",
                        });
                    } else if (result.data === 'Not found') {
                        swal("Thất bại! Không kiếm thấy danh mục có id " + item.id + "!", {
                            icon: "error",
                        });
                    }
                }).catch(error => {
                    swal("Thất bại! Lỗi hệ thống!", {
                        icon: "error",
                    });
                    console.log(error);
                });
            }
        });
    };

    $scope.checkValid = function () {
        if (!$scope.form.name) {
            showWarningToast('Nhập tên danh mục');
            $("#category_name").focus();
            return false;
        }
        return true;
    };

    $scope.pageSizeChild = 10;
    $scope.startChild = 0;
    $scope.pageIndexChild = 0;

    $scope.changeSizeChild = function (item) {
        $scope.pageSizeChild = item;
        console.log($scope.pageSizeChild);
        if (item == -1) {
            $scope.pageSizeChild = ' ';
        }
    };

    $scope.changeSizeParent = function (item) {
        $scope.pageSizeParent = item;
        console.log($scope.pageSizeParent);
        if (item == -1) {
            $scope.pageSizeParent = ' ';
        }
    };

    $scope.pageSizeParent = 5;
    $scope.startParent = 0;
    $scope.pageIndexParent = 0;

    $scope.nextParent = function () {
        if ($scope.startParent < $scope.parentCategories.length - $scope.pageSizeParent) {
            $scope.startParent += $scope.pageSizeParent;
            $scope.pageIndexParent++;
        }
    };
    $scope.prevParent = function () {
        if ($scope.startParent > 0) {
            $scope.startParent -= $scope.pageSizeParent;
            $scope.pageIndexParent--;
        }
    };
    $scope.firstParent = function () {
        $scope.startParent = 0;
        $scope.pageIndexParent = 0;
    };
    $scope.lastParent = function () {
        sotrang = Math.ceil($scope.parentCategories.length / $scope.pageSizeParent);
        $scope.startParent = $scope.pageSizeParent * (sotrang - 1);
        $scope.pageIndexParent = $scope.countParent() - 1;
    };
    $scope.countParent = function () {
        return Math.ceil(1.0 * $scope.parentCategories.length / $scope.pageSizeParent);
    };

});