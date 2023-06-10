app.controller('account-ctrl', function($scope, $http) {

	$scope.items = [];
	$scope.form = {};

	$scope.initialize = function() {
		// load products
		$http.get('/rest/accounts').then(resp => {
			$scope.items = resp.data;
			
		})
	}

	// Khởi đầu
	$scope.initialize();

	// Xóa form
	$scope.reset = function() {
		$scope.form = {
			photo: 'default.png',
		}
	}

	// hiển thị trên form
	$scope.edit = function(item) {
		$scope.form = angular.copy(item);
		$('.nav-tabs li:eq(0) button').tab('show')
		console.log($scope.form.name);
		
	}

	// create
	$scope.create = function() {
		var item = angular.copy($scope.form);
		$http.post(`/rest/accounts/create`, item).then(resp => {
			$scope.items.push(resp.data);
			$scope.reset();
			swal("Thành công!", "Thêm mới người dùng thành công!", "success");
		}).catch(error => {
			swal("Thất bại!", "Vui lòng kiểm tra thông tin hoặc thử lại sau!", "error");
			console.log('Error', error);
		})
	}

	// update
	$scope.update = function() {
		if (!$scope.checkValid()) {
			return;
		}
		var item = angular.copy($scope.form);
		console.log(item)
		$http.put(`/rest/accounts/update/${item.id}`, item).then(resp => {
			var index = $scope.items.findIndex(u => u.id == item.id);
			$scope.items[index] = item;
			swal("Thành công!", "Cập nhật người dùng thành công!", "success");
			//window.location.reload();
		}).catch(error => {
			swal("Thất bại!", "Cập nhật người dùng thất bại!", "error");
			console.log("Error", error)
		})
	}

	// delete
	$scope.delete = function(item) {
		swal({
			title: "Bạn muốn xóa người dùng này?",
			text: "Khi đã xóa tất cả thông tin liên quan đến người dùng sẽ mất và bạn không thể khôi phục người dùng này",
			icon: "warning",
			buttons: ["Hủy!", "Đồng ý!"],
			dangerMode: true
		})
			.then((willDelete) => {
				if (willDelete) {
					console.log(item)

					$http.delete(`/rest/accounts/delete/${item.id}`).then(resp => {
						var index = $scope.items.findIndex(u => u.id == item.id);
						$scope.items.splice(index, 1);
						$scope.reset();
						swal(" Người dùng của bạn đã được xóa!", {
							icon: "success",
						});
					}).catch(error => {
						swal("Thất bại! Xóa người dùng thất bại!", {
							icon: "error",
						});
						console.log("Error", error)
					})
				} else {
					swal("Người dùng của bạn vẫn an toàn!");
				}
			});

	}

	// upload hình
	$scope.imageChanged = function(files) {
		var data = new FormData();
		data.append('file', files[0]);
		$http.post('/rest/accounts/upload/images', data, {
			transformRequest: angular.identity,
			headers: { 'Content-Type': undefined }
		}).then(resp => {
			$scope.form.photo = resp.data.name;
		}).catch(error => {
			alert("Lỗi upload hình ảnh");
			console.log("Error", error);
		})
	}
	$scope.re='/(84|0[3|5|7|8|9])+([0-9]{8})\b/g';
	$scope.checkValid = function() {

		if (!$scope.form.fullname) {
			showErrorToast('Nhập họ và tên ');
			return false;
		}
		
		if ( !$scope.form.photo ) {
			showErrorToast('Chọn hình ảnh cho người dùng');
			return false;
		}
		
		var phone = null;
		phone = $("#phone").text();
		console.log(phone)
		
		if (!$scope.form.phoneNumber || phone=='false' ) {
			showErrorToast('Nhập đúng định dạng số điện thoại');
			return false;
		}
		
		return true;
	}
	
	$scope.pageSize = 5;
	$scope.start = 0;
	$scope.pageIndex = 0;

	$scope.next = function() {
		if ($scope.start < $scope.items.length - $scope.pageSize) {
			$scope.start += $scope.pageSize;
			$scope.pageIndex++;
		}
	}
	$scope.prev = function() {
		if ($scope.start > 0) {
			$scope.start -= $scope.pageSize;
			$scope.pageIndex--;
		}
	}
	$scope.first = function() {
		$scope.start = 0;
		$scope.pageIndex = 0;
	}
	$scope.last = function() {
		sotrang = Math.ceil($scope.items.length / $scope.pageSize);
		$scope.start = $scope.pageSize * (sotrang - 1);
		$scope.pageIndex = $scope.count() - 1;
	}
	$scope.count = function() {
		return Math.ceil(1.0 * $scope.items.length / $scope.pageSize);
	}

})