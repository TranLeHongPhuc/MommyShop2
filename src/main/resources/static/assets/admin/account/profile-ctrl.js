app.controller('profile-ctrl', function ($scope, $http) {
    $scope.session = {};
    $scope.items = [];
    $scope.addresses = [];
    $scope.address = {};

    $http.get('/rest/remote').then(resp => {
        $scope.session = resp.data;
        $http.get(`/profile/address/by-account/${$scope.session.id}`).then(resp => {
            $scope.addresses = resp.data;
            console.log($scope.addresses);
        })
    })

    $scope.initialize = function () {
        $http.get('/rest/accounts').then(resp => {
            $scope.items = resp.data;
            $scope.items.forEach(item => {
                if (item.photo == null) {
                    item.photo = "default.png";
                }
            })
        })
    }

    // Khởi đầu
    $scope.initialize();


    $scope.update = function () {
        var item = angular.copy($scope.session)
        $http.put(`/rest/accounts/update/${item.id}`, item).then(resp => {
            var index = $scope.items.findIndex(u => u.username == item.username);
            $scope.items[index] = item;
            alert('Cập nhật người dùng thành công!')
            window.location.reload();
        }).catch(error => {
            alert('Cập nhật người dùng thất bại!')
            console.log("Error", error);
        })
    }

    $scope.imageChanged = function (files) {
        var data = new FormData();
        data.append('file', files[0]);
        $http.post('/rest/accounts/upload/images', data, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        }).then(resp => {
            $scope.session.photo = resp.data.name;
        }).catch(error => {
            alert("Lỗi upload hình ảnh");
            console.log("Error", error);
        })
    }

    $scope.deleteAddress = function (item) {
        swal({
            title: "Bạn muốn xóa địa chỉ này?",
            text: "Khi đã xóa, Bạn không thể khôi phục địa chỉ này",
            icon: "warning",
            buttons: ["Hủy!", "Đồng ý!"],
            dangerMode: true
        })
            .then((willDelete) => {
                if (willDelete) {
                    $http.delete(`/profile/address/delete/${item.id}`)
                        .then(resp => {
                            if (resp.data) {
                                var index = $scope.addresses.findIndex(a => a.id == item.id);
                                $scope.addresses.splice(index, 1);
                                swal("Bùm! Địa chỉ của bạn đã được xóa!", {
                                    icon: "success",
                                });
                            } else if (resp.data === false) {
                                showWarningToast("Không thể xoá địa chỉ mặc định!");
                            } else {
                                showErrorToast("Lỗi hệ thống 1!");
                                console.log(error);
                            }
                        }).catch(error => {
                            showErrorToast("Lỗi hệ thống 2!");
                            console.log(error);
                        });
                } else {
                    swal("Thương hiệu của bạn vẫn an toàn!");
                }
            });
    }

    $scope.addAddress = function() {
        let provinceCity = $('#city').find(":selected").text();
		if (!provinceCity || provinceCity === '' || provinceCity === 'Chọn tỉnh thành') {
			showWarningToast("Chọn tỉnh thành");
			return false;
		}
		let district = $('#district').find(":selected").text();
		if (!district || district === '' || district === 'Chọn quận huyện') {
			showWarningToast("Chọn quận huyện");
			return false;
		}
		let wardVillage = $('#ward').find(":selected").text();
		if (!wardVillage || wardVillage === '' || wardVillage === 'Chọn phường xã') {
			showWarningToast("Chọn phường xã");
			return false;
		}
		let addressLine1 = $("#address_line1").val();
		if (!addressLine1 || addressLine1 === '') {
			showWarningToast("Nhập Số nhà, Đường");
			return false;
		}

        let isDefault = false;

        $scope.address = {
            isDefault, addressLine1, wardVillage, district, provinceCity
        }

        var item = angular.copy($scope.address);
        console.log(item);
        $http.post(`/profile/address/add`, item).then(resp => {
			if (resp.data) {
                $scope.addresses.push(resp.data);
				swal("Thành công!","Địa chỉ của bạn đã được thêm!", "success");
			} else {
				showErrorToast("Lỗi hệ thống 1!");
			}
		}).catch(error => {
			showErrorToast("Lỗi hệ thống 2!");
			console.log(error);
		});

    }

})