app.controller('product-ctrl', function($scope, $http) {

	// $filter('filter')(array, expression, comparator, anyPropertyKey)
	$scope.items = [];
	$scope.listCategories = [];
	$scope.listBrands = [];
	$scope.form = { discount: 0 };
	$scope.numberOfExistingExtraImages = 1;
	$scope.productImage = {};
	$scope.productImages = [];

	$scope.initialize = function() {
		$http.get('/rest/products').then(resp => {
			$scope.items = resp.data;
			
		})
		$http.get('/rest/brands').then(resp => {
			$scope.listBrands = resp.data;
		})

		$http.get('/rest/categories/listParent').then(resp => {
			$scope.listCategories = resp.data;

		});
	}

	// Khởi đầu
	$scope.initialize();

	// Xóa form
	$scope.reset = function() {
		$scope.form = {
			createDate: new Date(),
			//image: 'default.png',
			//available: true,
			discount: 0,
			shortDesc: " ",
			longDesc: " "
		}
		$scope.productImages = [];

	}



	$scope.change = function(item) {
		if (item != null) {
			$http.get(`/rest/categories/listChildByParent/${item.id}`).then(resp => {
				$scope.cates_child = resp.data;
			});
		} else {
			$scope.cates_child = [];
		}
	}

	// hiển thị trên form
	$scope.edit = function(item) {
		$scope.form = angular.copy(item);
		console.log($scope.form)
		$scope.form.liked = 0;
		$http.get(`/rest/product-images/pid/${item.id}`).then(resp => {
			$scope.productImages = resp.data;
			console.log($scope.productImages);
		})
		$('.nav-tabs li:eq(0) button').tab('show')
		$http.get(`/rest/categories/listChildByParent/${$scope.form.category.parentCategory.id}`).then(resp => {
			$scope.cates_child = resp.data;
			$scope.cates_child.forEach(temp => {
				if (temp.id ==
					$scope.form.category.id) {
					$scope.form.category.id = $scope.form.category.id;
				};
			})
		});
	}

	$scope.create = function() {
		if (!$scope.checkValid()) {
			return;
		}

		$scope.form.productImages = $scope.productImages
		var item = angular.copy($scope.form);

		console.log(item);
		if (item.productImages == null) {
			item.productImages = [];
		}
		$http.post(`/rest/products`, item).then(resp => {
			$scope.items.push(resp.data);
			console.log(resp.data);
			$scope.reset();
			$scope.initialize();
			swal("Thành công!", "Sản phẩm của bạn đã được thêm!", "success");
		}).catch(error => {
			swal("Thất bại!", "Vui lòng kiểm tra thông tin hoặc thử lại sau!", "error");
			console.log('Error', error);
		});
	}

	// update
	$scope.update = function() {
		if (!$scope.checkValid()) {
			return;
		}
		$scope.form.productImages = $scope.productImages;
		var item = angular.copy($scope.form);
		$http.put(`/rest/products/${item.id}`, item).then(resp => {
			item.productImages = $scope.productImages;
			var index = $scope.items.findIndex(p => p.id == item.id);
			$scope.items[index] = item;
			swal("Thành công!", "Sản phẩm của bạn đã được cập nhật!", "success");
			$scope.initialize();
		}).catch(error => {
			swal("Thất bại!", "Vui lòng kiểm tra thông tin hoặc thử lại sau!", "error");
			console.log(error)
		})
	}

	// xóa sp
	$scope.delete = function(item) {
		swal({
			title: "Bạn muốn xóa sản phẩm này?",
			text: "Khi đã xóa, Bạn không thể khôi phục sản phẩm này",
			icon: "warning",
			buttons: ["Hủy!", "Đồng ý!"],
			dangerMode: true
		})
			.then((willDelete) => {
				if (willDelete) {
					$http.delete(`/rest/products/${item.id}`).then(resp => {
						var index = $scope.items.findIndex(p => p.id == item.id);
						$scope.items.splice(index, 1);
						$http.delete(`/rest/products/images`).then(resp => {

						})
						$scope.reset();
						swal("Bùm! Sản phẩm của bạn đã được xóa!", {
							icon: "success",
						});
					}).catch(error => {
						swal("Thất bại! Sản phẩm này không thể xóa!", {
							icon: "error",
						});
						console.log("Error", error)
					})
				} else {
					swal("Sản phẩm của bạn vẫn an toàn!");
				}
			});
	}

	// upload hình
	$scope.imageChanged = function(files) {
		var data = new FormData();
		data.append('file', files[0]);
		$http.post('/rest/products/upload/images', data, {
			transformRequest: angular.identity,
			headers: { 'Content-Type': undefined }
		}).then(resp => {
			$scope.form.mainImage = resp.data.name;
			console.log($scope.form.mainImage);
			showSuccessToast("Tải lên hình ảnh thành công!")
		}).catch(error => {
			alert("Lỗi upload hình ảnh");
			console.log("Error", error);
		})
	}

	//more images
	$scope.extraImageChangedNew = function(files) {
		var data = new FormData();
		data.append('file', files[0]);
		$http.post('/rest/products/upload/images', data, {
			transformRequest: angular.identity,
			headers: { 'Content-Type': undefined }
		}).then(resp => {
			$scope.productImage.name = resp.data.name;
			$scope.productImages.push($scope.productImage)
			$scope.productImage = {};
			console.log($scope.productImages);
			showSuccessToast("Tải lên hình ảnh thành công!")
		}).catch(error => {
			showErrorToast("Lỗi upload hình ảnh");
			console.log("Error", error);
		})
	}

	//delete Images
	$scope.deleteImage = function(item) {
		swal({
			title: "Bạn muốn xóa hình ảnh này?",
			text: "Khi đã xóa, Bạn không thể khôi phục hình ảnh này",
			icon: "warning",
			buttons: ["Hủy!", "Đồng ý!"],
			dangerMode: true
		})
			.then((willDelete) => {
				if (willDelete) {
					$http.delete(`/rest/product-images/${item.id}`).then(resp => {
						$http.delete(`/rest/product-images/delete/images/name/${item.name}`).then(resp => {
						}).catch(error => {
							swal("Thất bại!", "Lỗi xóa hình ảnh", "error");
							console.log(error)
						})
						var index = $scope.productImages.findIndex(u => u.id == item.id);
						$scope.productImages.splice(index, 1);
					}).catch(error => {
						swal("Thất bại!", "Lỗi upload hình ảnh", "error");
						console.log("Error", error);
					})
					swal("Bùm! Hình ảnh của bạn đã được xóa!", {
						icon: "success",
					});
				} else {
					swal("Hình ảnh của bạn vẫn an toàn!");
				}
			});
	}
	// delete temp images
	$scope.deleteImageNew = function(index, item) {
		$http.delete(`/rest/product-images/delete/images/name/${item.name}`).then(resp => {
			showSuccessToast('Xóa hình ảnh tạm thời thành công ! ')
			$scope.productImages.splice(index, 1);
			console.log($scope.productImages);
		}).catch(error => {
			showErrorToast("Lỗi xóa hình ảnh");
			console.log(error)
		})
	}

	$scope.checkValid = function() {

		if (!$scope.form.brand) {
			showErrorToast('Chọn tên thương hiệu');
			return false;
		}
		if (!$scope.form.category) {
			showErrorToast('Chọn loại tên danh mục');
			return false;
		}
		if (!$scope.form.category.id) {
			showErrorToast('Chọn tên danh mục');
			return false;
		}
		
		if (!$scope.form.name ) {
			showErrorToast('Nhập tên sản phẩm');
			return false;
		}
		if (!$scope.form.price) {
			showErrorToast('Nhập giá sản phẩm');
			return false;
		}

		if (!$scope.form.inventory) {
			showErrorToast('Nhập số lượng sản phẩm');
			return false;
		}
		return true;
	}

	//phân trang
	$scope.pageSize = 10;
	$scope.start = 0;
	$scope.pageIndex = 0;

	$scope.changeSizeProduct = function(item) {
		$scope.pageSize = item;
		console.log($scope.pageSize);
		if (item == -1) {
			$scope.pageSize = ' '
		}
	}

	$scope.count = function() {
		return Math.ceil(1.0 * $scope.items.length / $scope.pageSize);
	}

})