app.controller('brand-ctrl', function($scope, $http) {
	$scope.items = [];
	$scope.listBrands = [];
	$scope.form = {};

	$scope.initialize = function() {
		$http.get('/rest/brands').then(resp => {
			$scope.items = resp.data;
		});
	}

	// start
	$scope.initialize();

	//rest
	$scope.reset = function() {
		$scope.form = {};
	}

	// view
	$scope.edit = function(item) {
		$scope.form = angular.copy(item);
		$('.nav-tabs li:eq(0) button').tab('show')
		
	}

	//create
	$scope.create = function() {
		if (!$scope.checkValid()) {
			return;
		}
		var item = angular.copy($scope.form);
		$http.post(`/rest/brands`, item).then(resp => {
			// $scope.item.multipartFile = $scope.item.id;
			$scope.items.push(resp.data);
			$scope.reset();
			swal("Thành công!", "Thương hiệu của bạn đã được thêm!", "success");
		}).catch(error => {
			swal("Thất bại!", "Vui lòng kiểm tra thông tin hoặc thử lại sau!", "error");
			console.log('Error', error);
		})
	}

	$scope.update = function() {
		if (!$scope.checkValid()) {
			return;
		}
		var item = angular.copy($scope.form);
		$http.put(`/rest/brands/${item.id}`, item).then(resp => {
			var index = $scope.items.findIndex(b => b.id == item.id);
			$scope.items[index] = item;
			swal("Thành công!", "Thương hiệu của bạn đã được cập nhật!", "success");
		}).catch(error => {
			swal("Thất bại!", "Vui lòng kiểm tra thông tin hoặc thử lại sau!", "error");
			console.log("Error", error);
		});
	}

	$scope.delete = function(item) {
		swal({
			title: "Bạn muốn xóa thương hiệu này?",
			text: "Khi đã xóa, Bạn không thể khôi phục thương hiệu này",
			icon: "warning",
			buttons: ["Hủy!", "Đồng ý!"],
			dangerMode: true
		})
			.then((willDelete) => {
				if (willDelete) {
					$http.delete(`/rest/brands/${item.id}`).then(resp => {
						var index = $scope.items.findIndex(b => b.id == item.id);
						$scope.items.splice(index, 1);
						$scope.reset();
						$http.delete(`/rest/brands/images`).then(resp => {

						}).catch(error => {
							swal("Thất bại!", "Lỗi xóa hình ảnh", "error");
							console.log(error)
						})
						swal("Bùm! Thương hiệu của bạn đã được xóa!", {
							icon: "success",
						});
					}).catch(error => {
						swal("Thất bại! Thương hiệu này không thể xóa", {
							icon: "error",
						});
						console.log("Error", error);
					});
				} else {
					swal("Thương hiệu của bạn vẫn an toàn!");
				}
			});
	}

	// upload
	$scope.imageChanged = function(files) {
		var data = new FormData();
		data.append('file', files[0]);
		$http.post('/rest/brands/upload/images', data, {
			transformRequest: angular.identity,
			headers: { 'Content-Type': undefined }
		}).then(resp => {
			$scope.form.logo = resp.data.name;
		}).catch(error => {
			alert('Lỗi tải lên hình ảnh');
			console.log("Error", error);
		})
	}
	
	$scope.checkValid = function() {

		if (!$scope.form.name) {
			showErrorToast('Nhập tên thương hiệu');
			return false;
		}
		if (!$scope.form.logo) {
			showErrorToast('Chọn hình ảnh cho thương hiệu');
			return false;
		}
		
		
		return true;
	}
	
	//phân trang
	$scope.pageSize = 10;

	$scope.changeSize = function(item) {
		$scope.pageSize = item;
		console.log($scope.pageSize);
		if (item == -1) {
			$scope.pageSize = ' '
		}
	}

})