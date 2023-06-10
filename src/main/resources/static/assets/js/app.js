const app = angular.module('myApp', []);
app.controller('shopping-cart-ctrl', function ($scope, $http, $window) {
	/* QUẢN LÝ GIỎ HÀNG */
	$scope.totalCart = 0;
	$scope.listShippingRates = [];
	$scope.provinceCity = "";
	$scope.carts = [];
	$('#city').on('change', function () {
		$scope.provinceCity = ($("#city option:selected").text());
		console.log($scope.provinceCity);

		$http.get('/rest/shipping-rates').then(resp => {
			$scope.listShippingRates = resp.data;
			console.log($scope.listShippingRates);

			$scope.listShippingRates.forEach(item => {
				if (item.provinceCity == $scope.provinceCity) {
					var rate = 0;
					rate = item.rate;
					$('span.shipping-rate').text(rate);
					console.log(parseFloat(rate));
					$scope.totalCart = $scope.cart.amount += parseFloat(rate);
				}
			});
		});
	});

	$scope.remote = {};
	$scope.getUser = function () {
		$http.get('/rest/remote').then(resp => {
			$scope.remote = resp.data;
			if ($scope.remote != '') {
				$http.get(`/profile/address/by-account/${$scope.remote.id}`).then(resp => {
					for (let i = 0; i < resp.data.length; i++) {
						if (resp.data[i].isDefault == true) {
							$scope.address = resp.data[i].address;
						}
					}
				})
			}
		});
	};
	//cap nhat tai khoan
	$scope.update = function () {
		if(!$scope.remote.photo){
			showWarningToast('Vui lòng cập nhật ảnh đại diện !');
			return false;
		}
		var sub = angular.copy($scope.remote);
		$http.put(`/rest/accounts/update/${sub.id}`, sub).then(resp => {
			swal("Thành công!", "Bạn đã cập nhật thông tin thành công", "success");
		}).catch(error => {
			swal('Thất bại!', 'Lỗi cập nhật vui lòng kiểm tra lại thông tin', 'error');
			console.log("Error", error);
		});
	};
	$scope.images = [];
	// upload hình
	$scope.imageChangedProfile = function (files) {
		var data = new FormData();
		data.append('file', files[0]);
		$http.post('/rest/accounts/upload/images', data, {
			transformRequest: angular.identity,
			headers: { 'Content-Type': undefined },
			enctype: 'multipart/form-data'
		}).then(resp => {
			$scope.remote.photo = resp.data.name;

		}).catch(error => {
			showErrorToast('Lỗi upload hình ảnh!');
			console.log("Error", error);
		});
		console.log($scope.images);
	};

	/*danh gia san pham*/////////////////////////////////////////////
	$scope.details = [];
	$scope.ratingImage = {};
	$scope.ratingImages = [];

	$scope.checkOrderDetail = function (item) {
		$http.get(`/rest/order-details/${item}`).then(resp => {
			$scope.details = resp.data;
		});
		$http.get(`/rest/order-tracks/${item}`).then(resp => {
			$scope.tracks = resp.data;
			$scope.tracks.forEach(item => {
				if (item.orderStatus == 'CONFIRMED') {
					$scope.statusConfirm = 'CONFIRMED'
					$scope.timeConfirm = item.updateTime;
					$scope.statusConfirmElm = item.note;
				}
				else if (item.orderStatus == 'DILIVERING') {
					$scope.statusDilivery = 'DILIVERING'
					$scope.timeDilivery = item.updateTime;
					$scope.statusDiliveryElm = item.note;
				}
				else if (item.orderStatus == 'FINISHED') {
					$scope.statusFinish = 'FINISHED'
					$scope.timeFinish = item.updateTime;
				}
				console.log($scope.statusNew);
				console.log($scope.statusConfirm);
				console.log($scope.statusDilivery);
				console.log($scope.statusFinish);
			})
			console.log($scope.track);
		})
	};
	$scope.checkStar = function (product, star) {

		for (let i = 0; i < $scope.details.length; i++) {
			if (product == $scope.details[i].product.id) {
				if (star == 1) {
					$scope.details[i].review = "Tệ";
				} else if (star == 2) {
					$scope.details[i].review = "Không hài lòng";
				} else if (star == 3) {
					$scope.details[i].review = "Bình thường";
				} else if (star == 4) {
					$scope.details[i].review = "Hài lòng";
				} else if (star == 5) {
					$scope.details[i].review = "Tuyệt vời";
				}
				//$http.get(`/rest/order-details/${item}`).then(resp => {

				//})
			}
		}
	};

	$scope.rates = function (id) {
		console.log(id);
		var error = 0;
		//console.log($scope.details);
		for (let i = 0; i < $scope.details.length; i++) {
			if ($scope.details[i].rating == null) {
				showErrorToast('Vui lòng đáng giá sản phẩm ' + $scope.details[i].product.name + ' !');
				error = 1;
				break;
			} else {
				error = 0;

			}
		}
		if (error == 0) {
			for (let i = 0; i < $scope.details.length; i++) {
				var rating;
				if ($scope.details[i].ratingImages == null) {
					rating = {
						star: $scope.details[i].rating.star, features: $scope.details[i].rating.features,
						review: $scope.details[i].rating.review, product: $scope.details[i].product,
						order: $scope.details[i].order,
						ratingImages: [],
						ratingDate: new Date()
					};
				} else {
					rating = {
						star: $scope.details[i].rating.star, features: $scope.details[i].rating.features,
						review: $scope.details[i].rating.review, product: $scope.details[i].product,
						order: $scope.details[i].order,
						ratingImages: $scope.details[i].ratingImages,
						ratingDate: new Date()
					};
				}
				console.log(rating);
				$http.post(`/rest/ratings`, rating).then(resp => {
					console.log(resp.data);
					$('#ratingOrder').modal('hide');
				}).catch(error => {
					showErrorToast('Đánh giá sản phẩm thất bại ! Vui lòng đáng giá lại !');
					console.log(error);
					return false;
				});
			}
			var status = 'RATED'
			$http.put(`/rest/orders/update/status/${id}/${status}`).then(resp => {
				console.log(resp.data);
			});
			swal({
				title: "Thành công!",
				text: "Bạn đã đánh giá sản phẩm",
				icon: "success",
				button: "Đồng ý!",
			})
				.then(() => {
					location.reload();
				});
		}
	};

	// upload hình
	$scope.imageChanged = function (files) {
		var data = new FormData();
		data.append('file', files[0]);
		$http.post('/rest/ratings/upload/images', data, {
			transformRequest: angular.identity,
			headers: { 'Content-Type': undefined }
		}).then(resp => {
			$scope.form.mainImage = resp.data.name;
			console.log($scope.form.mainImage);
		}).catch(error => {
			alert("Lỗi upload hình ảnh");
			console.log("Error", error);
		});
	};

	//more images
	$scope.extraImageChangedNew = function (product, files) {
		for (let i = 0; i < $scope.details.length; i++) {
			if (product == $scope.details[i].product.id) {
				console.log(product);

				var data = new FormData();
				data.append('file', files[0]);
				$http.post('/rest/ratings/upload/images', data, {
					transformRequest: angular.identity,
					headers: { 'Content-Type': undefined }
				}).then(resp => {
					$scope.ratingImage.name = resp.data.name;
					if ($scope.details[i].ratingImages == null) {
						$scope.details[i].ratingImages = new Array;
						$scope.details[i].ratingImages.push($scope.ratingImage);
						$scope.ratingImage = {};
						console.log($scope.details[i].ratingImages);
					} else {
						$scope.details[i].ratingImages.push($scope.ratingImage);
						$scope.ratingImage = {};
						console.log($scope.details[i].ratingImages);
					}

				}).catch(error => {
					showErrorToast("Lỗi upload hình ảnh");
					console.log("Error", error);
				});

			}
		}

	};

	$scope.deleteImageNew = function (item, product, index) {
		for (let i = 0; i < $scope.details.length; i++) {
			if (product == $scope.details[i].product.id) {
				$http.delete(`/rest/ratings/delete/images/name/${item.name}`).then(resp => {
					showSuccessToast('Xóa hình ảnh thành công ! ');
					$scope.details[i].ratingImages.splice(index, 1);
				}).catch(error => {
					showErrorToast("Lỗi xóa hình ảnh");
					console.log(error);
				});
			}
		}
	};

	$scope.clearRate = function () {
		for (let i = 0; i < $scope.details.length; i++) {
			if ($scope.details[i].ratingImages != null) {
				for (let j = 0; j < $scope.details[i].ratingImages.length; j++) {
					$http.delete(`/rest/ratings/delete/images/name/${$scope.details[i].ratingImages[j].name}`).then(resp => {
						$scope.details[i].ratingImages = [];
					}).catch(error => {
						showErrorToast("Lỗi xóa tất cả hình ảnh");
						console.log(error);
					});
				}
			}
		}
		showSuccessToast('Xóa tất cả đánh giá thành công ! ');
	};
	/*doi mk user*/////////////////////////////////////////////

	$scope.account_change;
	$scope.pw = {
		change(item) {
			console.log(item);
			$http.get(`/rest/accounts/account/email/${email}`).then(resp => {
				$scope.account_change = resp.data;
				if (item.new == item.confirm) {
					$scope.account_change.password = item.confirm;
					$http.put(`/rest/accounts/change`, $scope.account_change).then(resp => {
						swal("Thành công!", "Bạn đã đổi mật khẩu thành công", "success");
					});
				} else {
					showErrorToast("Xác nhận mật khẩu không đúng ! ");
				}
			}
			);
		}
	};

	$scope.updateOrderStatus = function (id, status) {
		$http.put(`/rest/orders/update/status/${id}/${status}`).then(resp => {
			// showSuccessToast('Cập nhật trạng thái đơn hàng thành công!');
			location.reload();
		});
		var orderTrack = {
			orderStatus: status,
			updateTime: new Date(),
			order: { id: id }
		}
		$http.post(`/rest/order-tracks`, orderTrack).then(resp => {
			$scope.orderTrackNew = resp.data;
			console.log($scope.orderTrackNew);
		})
	};


	$scope.updateOrderStatusCancel = function (id) {
		console.log(id);
		$http.get(`/rest/orders/${id}`).then(resp => {
			$scope.orderOld = resp.data;
			console.log($scope.orderOld);
			var reasonCancel = $('#content-cancel option:selected').text();
			if (reasonCancel == "Chọn lý do gợi ý") {
				showErrorToast('vui lòng chọn lý do');
			} else {
				if (reasonCancel == "Lý do khác...") {
					reasonCancel = $('textarea#content-reason').val();
					if (reasonCancel == '') {
						showErrorToast('Nhập cho đang hoàng');
					} else {
						var item = angular.copy($scope.orderOld);
						console.log(reasonCancel);
						item.note = $scope.orderOld.note + " // Lý do hủy: " + reasonCancel;
						item.orderStatus = 'CANCELLED';
						$http.put(`/rest/orders/${id}`, item).then(resp => {
							swal("Thành công!", "Bạn đã hủy đơn hàng thành công!", "success")
								.then(() => {
									location.reload();
								});
						});
					}
				} else {
					var item = angular.copy($scope.orderOld);
					console.log(reasonCancel);
					item.note = $scope.orderOld.note + " // Lý do hủy: " + reasonCancel;
					item.orderStatus = 'CANCELLED';
					$http.put(`/rest/orders/${id}`, item).then(resp => {
						swal("Thành công!", "Bạn đã hủy đơn hàng thành công!", "success")
							.then(() => {
								location.reload();
							});
					});
				}
			}
		});
	};

	var email = null;
	email = $("#remoteEmail").text();
	// console.log(email + "/hihi");

	$scope.loadCart = function () {
		if (email != "") {
			//$scope.cart.loadFromLocalStorage();
			$http.get(`/rest/carts/account/${email}`).then(resp => {
				$scope.carts = resp.data;
				//console.log($scope.carts)
				//gộp giỏ hàng lại khi đăng nhập
				for (let i = 0; i < $scope.cart.carts.length; i++) {
					var itemCheck1 = $scope.carts.find(items => items.product.id == $scope.cart.carts[i].id);
					//nếu sp trong 2 giỏ hàng trong db và local trùng nhau thì cập nhật quantity
					if (itemCheck1) {
						itemCheck1.quantity += $scope.cart.carts[i].quantity;
						$http.put(`/rest/carts`, itemCheck1).then(resp => {
							//$scope.loadCart();
						}).catch(error => {
							console.log(error);
						});
						var item = $scope.cart.carts.findIndex(item => item.id == itemCheck1.product.id);
						$scope.cart.carts.splice(item, 1);
						$scope.cart.saveToLocalStorage();

					} //nếu sp trong 2 giỏ hàng trong db và local không trùng nhau thì tạo mới giỏ hàng trong db và quantity=1
					else {
						$http.get(`/rest/remote`).then(resp => {
							$scope.acc = resp.data;
							$http.get(`/rest/products/${$scope.cart.carts[i].id}`).then(resp => {
								item = { product: resp.data, account: $scope.acc };
								item.quantity = $scope.cart.carts[i].quantity;
								$http.post(`/rest/carts`, item).then(resp => {
									var item = $scope.cart.carts.findIndex(item => item.id == resp.data.product.id);
									$scope.cart.carts.splice(item, 1);
									$scope.cart.saveToLocalStorage();
								});
							});
						});

					}

				}
				//nếu từ chưa đăng nhập chuyển tới đã đăng nhập thì clear checkout
				if ($scope.checkout.items.length) {
					if ($scope.checkout.items[0].account == null) {
						$scope.checkout.clear();
					}
				}

				//$scope.loadCart();
				for (let i = 0; i < $scope.carts.length; i++) {

					if ($scope.carts[i].selected == true) {
						//console.log($scope.carts[i])
						if ($scope.carts[i].product.inventory > 0) {
							$scope.checkout.items.push($scope.carts[i]);
						}
						$scope.checkout.saveToLocalStorage();
					}

				}
				//nếu thay đổi tài khoản
				//console.log($scope.carts[0].account.id + "||" + $scope.checkout.items[0].account.id)
				if ($scope.carts.length == 0 || $scope.checkout.items.length == 0) {
					$scope.checkout.clear();
				} else {

					if ($scope.carts[0].account.id !=
						$scope.checkout.items[0].account.id) {
						$scope.checkout.clear();
						for (let i = 0; i < $scope.carts.length; i++) {
							if ($scope.carts[i].selected == true) {
								if ($scope.carts[i].product.inventory > 0) {
									$scope.checkout.items.push($scope.carts[i]);
								}
							}
						}

					} else {
						$scope.checkout.clear();
						for (let i = 0; i < $scope.carts.length; i++) {

							if ($scope.carts[i].selected == true) {
								//console.log($scope.carts[i])

								if ($scope.carts[i].product.inventory > 0) {
									$scope.checkout.items.push($scope.carts[i]);
								}
								$scope.checkout.saveToLocalStorage();
							}
						}
					}
				}

			}).catch(error => {
				console.log(error);
			});
			$scope.loadCheckAll();
		} else {
			if ($scope.cart.carts.length == 0 || $scope.checkout.items.length == 0) {
				$scope.checkout.clear();
			}
			$scope.loadCheckAll();
		}


	};

	$scope.getUser();

	$scope.countFavorite = 0;

	$scope.loadCartInventory = function () {
		if (email == "") {
			for (let i = 0; i < $scope.cart.carts.length; i++) {
				$http.get(`/rest/products/${$scope.cart.carts[i].id}`).then(resp => {
					$scope.cart.carts[i].inventory = resp.data.inventory;
				});
			}
			$scope.cart.saveToLocalStorage();
		}
	};

	$scope.listParentCategories = [];
	$scope.topListParentCategories = [];
	$scope.topBrands = [];
	$scope.countAllProducts = 0;
	$scope.productMostWanted = {};

	$scope.loadInit = function () {
		$http.get('/rest/products/most-wanted').then(resp => {
			$scope.productMostWanted = resp.data;
		});
		$http.get('/rest/categories/listParentDto').then(resp => {
			$scope.listParentCategories = resp.data;
		});
		$http.get('/rest/products').then(resp => {
			$scope.countAllProducts = resp.data.length;
		})
		$http.get('/rest/categories/listParentTop').then(resp => {
			$scope.topListParentCategories = resp.data;
		})
		$http.get('/rest/brands/top-brand').then(resp => {
			$scope.topBrands = resp.data;
		})
	};

	$scope.loadInit();

	$scope.checkAll;

	$scope.loadCheckAll = function () {
		if (email != "") {
			$http.get(`/rest/carts/account/${email}`).then(resp => {
				for (let i = 0; i < resp.data.length; i++) {
					if (resp.data[i].selected == true) {
						$scope.checkAll = true;
					} else {
						$scope.checkAll = false;
						break;
					}

				}
			});

		} else {
			for (let i = 0; i < $scope.cart.carts.length; i++) {
				if ($scope.cart.carts[i].selected == true) {
					$scope.checkAll = true;
				} else {
					$scope.checkAll = false;
					break;
				}

			}
		}

	};

	$scope.checkout = {
		items: [],
		selectAll() {
			if (email != "") {
				for (let i = 0; i < $scope.carts.length; i++) {
					if ($scope.checkAll == null) {
						$scope.carts[i].selected = true;
						var itemCheck1 = this.items.find(items => items.product.id == $scope.carts[i].product.id);
						console.log(itemCheck1);
						if (itemCheck1) {
							continue;
						} else {
							if ($scope.carts[i].product.inventory > 0) {
								this.items.push($scope.carts[i]);
							}
						}
					} else if ($scope.checkAll == true) {
						$scope.carts[i].selected = false;
						this.items = [];

					} else if ($scope.checkAll == false) {
						$scope.carts[i].selected = true;
						var itemCheck1 = this.items.find(items => items.product.id == $scope.carts[i].product.id);
						console.log(itemCheck1);
						if (itemCheck1) {
							continue;
						} else {
							if ($scope.carts[i].product.inventory > 0) {
								this.items.push($scope.carts[i]);
							}
						}


					} else {
						$scope.carts[i].selected = false;
						this.items = [];

					}
					console.log(this.items);


				}
				$http.put(`/rest/carts/updateall`, $scope.carts).then(resp => {

				});
				this.saveToLocalStorage();
			} else {
				for (let i = 0; i < $scope.cart.carts.length; i++) {
					if ($scope.checkAll == null) {
						$scope.cart.carts[i].selected = true;
						var itemCheck1 = this.items.find(items => items.id == $scope.cart.carts[i].id);
						console.log(itemCheck1);
						if (itemCheck1) {
							continue;
						} else {
							if ($scope.cart.carts[i].inventory > 0) {
								this.items.push($scope.cart.carts[i]);
							}
						}
					} else if ($scope.checkAll == true) {
						$scope.cart.carts[i].selected = false;
						this.items = [];

					} else if ($scope.checkAll == false) {
						$scope.cart.carts[i].selected = true;
						var itemCheck1 = this.items.find(items => items.id == $scope.cart.carts[i].id);
						console.log(itemCheck1);
						if (itemCheck1) {
							continue;
						} else {
							if ($scope.cart.carts[i].inventory > 0) {
								this.items.push($scope.cart.carts[i]);
							}
						}
					} else {
						$scope.cart.carts[i].selected = false;
						this.items = [];
					}
				}
				console.log(this.items);
				this.saveToLocalStorage();
				$scope.cart.saveToLocalStorage();
			}

		},
		selectCart(item) {
			if (email != "") {
				//alert("hello")
				if (item.selected == null) {
					item.selected = true;
					this.items.push(item);
					$scope.loadCheckAll();

				} else if (item.selected == true) {
					item.selected = false;
					var item1 = this.items.findIndex(items => items.product.id == item.product.id);
					this.items.splice(item1, 1);
					var itemCheck = $scope.carts.findIndex(items => items.product.id == item.product.id);
					$scope.carts.splice(itemCheck, item);
					$scope.checkAll = false;

				} else if (item.selected == false) {
					item.selected = true;
					this.items.push(item);
					$scope.loadCheckAll();

				} else {
					item.selected = null;
					var item1 = this.items.findIndex(items => items.product.id == item.product.id);
					this.items.splice(item1, 1);
					var itemCheck = $scope.carts.findIndex(items => items.product.id == item.product.id);
					$scope.carts.splice(itemCheck, item);
					$scope.checkAll = false;
					this.saveToLocalStorage();
				}

				this.saveToLocalStorage();
				$http.put(`/rest/carts/updateall`, $scope.carts).then(resp => {
					$scope.loadCheckAll();
				});
			} else {
				if (item.selected == null) {
					item.selected = true;
					this.items.push(item);
					$scope.loadCheckAll();

				} else if (item.selected == true) {
					item.selected = false;
					var item1 = this.items.findIndex(items => items.id == item.id);
					this.items.splice(item1, 1);
					var itemCheck = $scope.cart.carts.findIndex(items => items.id == item.id);
					$scope.cart.carts.splice(itemCheck, item);
					$scope.checkAll = false;

				} else if (item.selected == false) {
					item.selected = true;
					this.items.push(item);
					$scope.loadCheckAll();

				} else {
					item.selected = null;
					var item1 = this.items.findIndex(items => items.id == item.id);
					this.items.splice(item1, 1);
					var itemCheck = $scope.cart.carts.findIndex(items => items.id == item.id);
					$scope.cart.carts.splice(itemCheck, item);
					$scope.checkAll = false;
					this.saveToLocalStorage();
				}
				this.saveToLocalStorage();
				$scope.cart.saveToLocalStorage();
			}
		},
		// clear
		clear() {
			this.items = [];
			this.saveToLocalStorage();

		},
		get discount() {
			if (email != "") {
				return this.items
					.map(item => ((item.quantity * item.product.price) - (item.quantity * item.product.realPrice)))
					.reduce((total, quantity) => total += quantity, 0);
			} else {
				return this.items
					.map(item => ((item.quantity * item.price) - (item.quantity * item.realPrice)))
					.reduce((total, quantity) => total += quantity, 0);
			}
		},

		// money/total product
		get amount() {
			if (email != "") {
				return this.items
					.map(item => (item.quantity * item.product.price))
					.reduce((total, quantity) => total += quantity, 0);
			} else {
				return this.items
					.map(item => (item.quantity * item.price))
					.reduce((total, quantity) => total += quantity, 0);
			}
		},
		// save to local storage
		saveToLocalStorage() {
			var json = JSON.stringify(angular.copy(this.items));
			sessionStorage.setItem("checkout", json);
		},
		// read local storage
		loadFromLocalStorage() {
			var json = sessionStorage.getItem("checkout");
			this.items = json ? JSON.parse(json) : [];
		},
	};
	$scope.error = "";
	$scope.product = [];
	$scope.checkout.loadFromLocalStorage();
	$scope.checkoutClick = function (item) {
		if ($scope.checkout.items.length == 0) {
			swal('Thất bại!', 'Bạn chưa chọn sản phẩm để thanh toán', 'error');
		} else {
			if (email != "") {
				for (let i = 0; i < $scope.checkout.items.length; i++) {
					var item1 = item.find(item => item.product.id == $scope.checkout.items[i].product.id);
					if ($scope.checkout.items[i].quantity <= item1.product.inventory) {
						$scope.error = "";
						//location.href = "/order/checkout"
					} else {
						console.log($scope.checkout.items[i].quantity + "||" + item1.product.inventory);
						$scope.error = "Số lượng sản phẩm " + $scope.checkout.items[i].product.name + " trong giỏ hàng bạn chọn thanh toán có "
							+ "số lượng lớn hơn trong kho " + $scope.checkout.items[i].quantity + " > "
							+ item1.product.inventory;
						swal('Thất bại!', $scope.error, 'error');
						break;
					}
				}
				if ($scope.error == "") {
					location.href = "/order/checkout";
				}
			} else {
				for (let i = 0; i < $scope.checkout.items.length; i++) {
					var item1 = item.find(item => item.id == $scope.checkout.items[i].id);
					if ($scope.checkout.items[i].quantity <= item1.inventory) {
						$scope.error = "";
						//location.href = "/order/checkout"
					} else {
						console.log($scope.checkout.items[i].quantity + "||" + item1.inventory);
						$scope.error = "Số lượng sản phẩm " + $scope.checkout.items[i].name + " trong giỏ hàng bạn chọn thanh toán có "
							+ "số lượng lớn hơn trong kho " + $scope.checkout.items[i].quantity + " > "
							+ item1.inventory;
						swal('Thất bại!', $scope.error, 'error');
						break;
					}


				}
				if ($scope.error == "") {
					location.href = "/order/checkout";
				}
			}
		}
	};

	$scope.cart = {
		carts: [],

		// add to cart
		add(id) {
			if (email != "") {
				//var item = this.items.find(item => item.id == id);
				var item;
				$http.get(`/rest/carts/product/${id}/account/${email}`).then(resp => {
					item = resp.data;
					if (item) { // nếu sản phẩm có trong giỏ hàng thì tăng số lượng
						//item.quantity++;
						//this.saveToLocalStorage();
						item.quantity++;
						$http.put(`/rest/carts`, item).then(resp => {
							$scope.loadCart();
							var item1 = $scope.checkout.items.find(items => items.product.id == item.product.id);
							console.log(item1);
							if (item1) {
								item1.quantity++;
								$scope.checkout.items.splice(item1, item1);
								$scope.checkout.saveToLocalStorage();
							}
							swal("Thành công!", "Bạn đã thêm sản phẩm vào giỏ hàng", "success");
						});
					} else { // ngược lại nếu chưa có sản phẩm trong giỏ hàng thì số lượng = 1
						$http.get(`/rest/products/${id}`).then(resp => {
							//resp.data.quantity = 1;
							//this.items.push(resp.data);
							//this.saveToLocalStorage();
							$scope.product = resp.data;
							console.log($scope.product);
							$http.get(`/rest/remote`).then(resp => {
								$scope.acc = resp.data;
								item = { product: $scope.product, account: $scope.acc };
								item.quantity = 1;
								//authority={account:acc, role:role};
								$http.post(`/rest/carts`, item).then(resp => {
									$scope.loadCart();
									swal("Thành công!", "Bạn đã thêm sản phẩm vào giỏ hàng", "success");
								});
							});
						}).catch(error => {
							console.log(error);
						});
					}
				});
			} else {
				var item = this.carts.find(item => item.id == id);
				if (item) { // nếu sản phẩm có trong giỏ hàng thì tăng số lượng
					item.quantity++;
					this.saveToLocalStorage();
					var item1 = $scope.checkout.items.find(items => items.id == item.id);
					console.log(item1);
					if (item1) {
						item1.quantity++;
						$scope.checkout.items.splice(item1, item1);
						$scope.checkout.saveToLocalStorage();
					}
					swal("Thành công!", "Bạn đã thêm sản phẩm vào giỏ hàng", "success");
				} else { // ngược lại nếu chưa có sản phẩm trong giỏ hàng thì số lượng = 1
					$http.get(`/rest/products/${id}`).then(resp => {
						resp.data.quantity = 1;
						this.carts.push(resp.data);
						this.saveToLocalStorage();
						swal("Thành công!", "Bạn đã thêm sản phẩm vào giỏ hàng", "success");
					}).catch(error => {
						console.log(error);
					});
				}

			}
		},

		// delete 
		remove(id) {
			if (email != "") {
				//var item = this.items.findIndex(item => item.id == id);
				$http.delete(`/rest/carts/${id}`).then(resp => {
					//this.items.splice(item, 1);
					//this.saveToLocalStorage();
					$scope.loadCart();
					var itemCheck = $scope.checkout.items.find(items => items.id == id);
					if (itemCheck) {
						var item1 = $scope.checkout.items.findIndex(items => items.id == id);
						$scope.checkout.items.splice(item1, 1);
						$scope.checkout.saveToLocalStorage();

					}
					$scope.loadCheckAll();
				});
			} else {
				var itemCheck = $scope.checkout.items.find(items => items.id == id);
				if (itemCheck) {
					var item1 = $scope.checkout.items.findIndex(items => items.id == id);
					$scope.checkout.items.splice(item1, 1);
					$scope.checkout.saveToLocalStorage();
				}
				var item = this.carts.findIndex(item => item.id == id);
				this.carts.splice(item, 1);
				this.saveToLocalStorage();
				$scope.loadCheckAll();
			}
		},

		// clear
		clear() {
			if (email != "") {
				$http.delete(`/rest/carts/account/${email}`).then(resp => {
					$scope.loadCart();
					$scope.checkout.clear();
					swal('Thành công!', 'Bạn đã xóa tất cả sản phẩm trong giỏ hàng', 'success');
				});
			} else {
				this.carts = [];
				this.saveToLocalStorage();
				$scope.checkout.clear();
				swal('Thành công!', 'Bạn đã xóa tất cả sản phẩm trong giỏ hàng', 'success');
			}
		},

		// clear
		removeCarts() {
			if (email != "") {
				for (let i = 0; i < $scope.checkout.items.length; i++) {
					$http.delete(`/rest/carts/${$scope.checkout.items[i].id}`).then(resp => {
						$scope.loadCart();
						console.log('clear');
					});
				}
				$scope.checkout.clear();
			} else {
				for (let i = 0; i < $scope.checkout.items.length; i++) {
					var item1 = this.carts.findIndex(items => items.id == $scope.checkout.items[i].id);
					console.log(item1);
					this.carts.splice(item1, 1);
					this.saveToLocalStorage();

				}
				$scope.checkout.clear();
			}

		},

		// total count
		get count() {
			if (email != "") {
				return $scope.carts.length;
			} else {
				return this.carts.length;
			}
		},

		get discount() {
			if (email != "") {
				return $scope.carts
					.map(item => ((item.quantity * item.product.price) - (item.quantity * item.product.realPrice)))
					.reduce((total, quantity) => total += quantity, 0);
			} else {
				return this.carts
					.map(item => ((item.quantity * item.price) - (item.quantity * item.realPrice)))
					.reduce((total, quantity) => total += quantity, 0);
			}
		},

		// money/total product
		get amount() {
			if (email != "") {
				return $scope.carts
					.map(item => (item.quantity * item.product.price))
					.reduce((total, quantity) => total += quantity, 0);
			} else {
				return this.carts
					.map(item => (item.quantity * item.price))
					.reduce((total, quantity) => total += quantity, 0);
			}
		},

		get totalCart() {
			var total = $('span.shipping-rate').text();
			return total;
		},

		// save to local storage
		saveToLocalStorage() {
			var json = JSON.stringify(angular.copy(this.carts));
			localStorage.setItem("cart", json);
		},
		// read local storage
		loadFromLocalStorage() {
			var json = localStorage.getItem("cart");
			this.carts = json ? JSON.parse(json) : [];
		},
		plus(item, num) {
			if (email != "") {
				item.quantity += num;
				//this.saveToLocalStorage();
				//this.amount;
				$http.put(`/rest/carts`, item).then(resp => {
					//$scope.loadCart();
					console.log(this.amount);
					var item1 = $scope.checkout.items.find(items => items.product.id == item.product.id);
					console.log(item1);
					if (item1) {
						item1.quantity = item.quantity;
						$scope.checkout.items.splice(item1, item1);

						$scope.checkout.saveToLocalStorage();
						console.log($scope.checkout.items);

					}
					if (item.quantity <= 0) {
						var item1 = $scope.checkout.items.find(items => items.id == item.id);
						if (item1) {
							$scope.checkout.items.del(item1);
							//$scope.checkout.saveToLocalStorage();
						}
						$scope.del(item);
					}
					$scope.checkout.saveToLocalStorage();
				});

			} else {
				item.quantity += num;
				this.saveToLocalStorage();
				this.amount;
				var item1 = $scope.checkout.items.find(items => items.id == item.id);
				if (item1) {
					item1.quantity = item.quantity;
					$scope.checkout.items.splice(item1, item1);
					$scope.checkout.saveToLocalStorage();

				}
				if (item.quantity <= 0) {
					var item1 = $scope.checkout.items.find(items => items.id == item.id);
					if (item1) {
						$scope.checkout.items.del(item1);
						//$scope.checkout.saveToLocalStorage();
					}
					$scope.del(item);
					console.log(item.name);

				}
				$scope.checkout.saveToLocalStorage();
			}
		}
	};

	$scope.cart.loadFromLocalStorage();
	$scope.loadCart();
	$scope.loadCartInventory();
	if ($scope.totalCart == 0) {
		$scope.totalCart = $scope.cart.amount;
	}
	$scope.acc = {};
	$scope.order = {
		createDate: new Date(),
		addressLine1: "",
		provinceCity: "",
		district: "",
		wardVillage: "",
		account: {},
		note: "",
		confirm: false,

		get orderDetails() {
			// nếu có người dùng
			// return $scope.carts.map
			if (email != "") {
				return $scope.checkout.items.map(item => {
					return {
						product: { id: item.product.id },
						price: item.product.price,
						quantity: item.quantity,
						//shippingfee: $('span.shipping-rate').text()
					};
				});
			} else {
				return $scope.checkout.items.map(item => {
					return {
						product: { id: item.id },
						price: item.realPrice,
						quantity: item.quantity,
						//shippingfee: $('span.shipping-rate').text()
					};
				});
			}
		},
		purchase() {
			var checked = $('input[name="account"]:checked');

			if (email != "") { //đã login
				var phone = $('#phone-account').val();
				if (phone != '') {
					$scope.order.phoneNumberAnonymous = phone;
				} else {
					showWarningToast("Nhập Số điện thoại!");
					return false;
				}
				$http.get(`/rest/accounts/email/${email}`).then(resp => {
					var id = resp.data;
					$http.get(`/profile/address/by-account/${id}`).then(resp => {
						$scope.lengthAddress = resp.data.length;
						if ($scope.lengthAddress > 0) {
							var addressIsDefault = $("#addressSelect option:selected").text();
							var valueCity = $('#city option:selected').text();
							var valueDistrict = $('#district option:selected').text();
							var valueWard = $('#ward option:selected').text();
							if (addressIsDefault === "Chọn địa chỉ khác...") {
								if (valueCity === "Chọn tỉnh thành") {
									valueCity = "";
								}
								if (valueDistrict === "Chọn quận huyện") {
									valueDistrict = "";
								}
								if (valueWard === "Chọn phường xã") {
									valueWard = "";
								}
								//validate
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
								let addressLine1 = $("#address_line_1").val();
								if (!addressLine1 || addressLine1 === '') {
									showWarningToast("Nhập Số nhà, Đường");
									return false;
								}
								$scope.order.provinceCity = valueCity;
								$scope.order.district = valueDistrict;
								$scope.order.wardVillage = valueWard;
							} else {
								// $scope.order.provinceCity = addressIsDefault.split(", ").pop();
								$scope.addressSelect = addressIsDefault.split(", ").splice(0);
								$scope.order.provinceCity = $scope.addressSelect[$scope.addressSelect.length - 1];
								$scope.order.district = $scope.addressSelect[$scope.addressSelect.length - 2];
								$scope.order.wardVillage = $scope.addressSelect[$scope.addressSelect.length - 3];
								$scope.order.addressLine1 = $scope.addressSelect[$scope.addressSelect.length - 4];
								for (var i = 5; i <= $scope.addressSelect.length; i++) {
									$scope.order.addressLine1 = $scope.addressSelect[$scope.addressSelect.length - i] + ", " + $scope.order.addressLine1
								}
								// console.log($scope.addressSelect);
								// console.log("tỉnh " + $scope.order.provinceCity);
								// console.log("huyện " + $scope.order.district);
								// console.log("xã " + $scope.order.wardVillage);
								// console.log($scope.order.addressLine1);
							}
						} else {
							var valueCity = $('#no-city option:selected').text();
							if (!valueCity || valueCity === '' || valueCity === 'Chọn tỉnh thành') {
								showWarningToast("Chọn tỉnh thành");
								return false;
							}
							var valueDistrict = $('#no-district option:selected').text();
							if (!valueDistrict || valueDistrict === '' || valueDistrict === 'Chọn quận huyện') {
								showWarningToast("Chọn quận huyện");
								return false;
							}
							var valueWard = $('#no-ward option:selected').text();
							if (!valueWard || valueWard === '' || valueWard === 'Chọn phường xã') {
								showWarningToast("Chọn phường xã");
								return false;
							}
							let addressLine1 = $("#no-address").val();
							if (!addressLine1 || addressLine1 === '') {
								showWarningToast("Nhập Số nhà, Đường");
								console.log('1');
								return false;
							}

							$scope.order.provinceCity = valueCity;
							$scope.order.district = valueDistrict;
							$scope.order.wardVillage = valueWard;
						}
						$http.get(`/rest/accounts/email/${$("#email").text()}`).then(resp => {
							$scope.order.account = { id: resp.data };
							console.log($scope.order.account);
							var order = angular.copy(this);
							order.paymentMethod = 'COD';
							order.orderStatus = 'NEW';
							order.orderPaymentStatus = 'UNPAID';
							console.log(order);
							console.log(order.orderDetails);

							//Thực hiện đặt hàng
							$http.post("/rest/orders/purchase", order).then(resp => {
								console.log(resp.data);
								$scope.cart.removeCarts();
								//$scope.cart.clear();
								for (let i = 0; i < order.orderDetails.length; i++) {
									$http.get(`/rest/products/id/${order.orderDetails[i].product.id}/inventory/${order.orderDetails[i].quantity}`).then(resp => {
										console.log('Cập nhập inventory thành công');
									}).catch(error => {
										console.log(error);
									});
								}
								swal({
									title: "Thành công!",
									text: "Đơn hàng của bạn đã được đặt",
									icon: "success",
									button: "Đồng ý!",
								})
									.then(() => {
										location.href = "/order/detail/" + resp.data.id;
									});
							}).catch(error => {
								showErrorToast('Đặt hàng lỗi');
								console.log(error);
							});
						}).catch(error => {
							showErrorToast('Lỗi');
							console.log(error);
						});
					})
				})
			} else { //chưa login
				var valueCity = $('#city option:selected').text();
				var valueDistrict = $('#district option:selected').text();
				var valueWard = $('#ward option:selected').text();
				if (valueCity === "Chọn tỉnh thành") {
					valueCity = "";
				}
				if (valueDistrict === "Chọn quận huyện") {
					valueDistrict = "";
				}
				if (valueWard === "Chọn phường xã") {
					valueWard = "";
				}
				//validate
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

				$scope.order.provinceCity = valueCity;
				$scope.order.district = valueDistrict;
				$scope.order.wardVillage = valueWard;
				$scope.account;

				if (checked.length == 0) { // không đăng ký
					console.log('khong dang ky');
					var email1 = "andanh@gmail.com";
					$http.get(`/rest/accounts/account/email/${email1}`).then(resp => {
						$scope.account = resp.data;
						//$scope.order.account = { id: $scope.account.id };

						if ($scope.account.length == 0) { //kiểm tra nếu chưa có tài khoản ẩn danh trong db thì tạo mới
							var account = { id: 200, photo: null, fullname: 'AnDanh', phoneNumber: '0123456789', enabled: true, password: '12345678', email: 'andanh@gmail.com', verificationToken: 'Guest' };

							$http.post("/rest/accounts/create", account).then(resp => {
								console.log(resp.data);
								$scope.order.account = { id: resp.data.id };
								console.log($scope.order.account);
								var order = angular.copy(this);
								order.paymentMethod = 'COD';
								order.orderStatus = 'NEW';
								order.orderPaymentStatus = 'UNPAID';
								console.log(order);
								console.log(order.orderDetails);

								//Thực hiện đặt hàng
								$http.post("/rest/orders/purchase", order).then(resp => {
									$scope.cart.loadFromLocalStorage();
									console.log(resp.data);
									$scope.cart.removeCarts();
									for (let i = 0; i < order.orderDetails.length; i++) {
										$http.get(`/rest/products/id/${order.orderDetails[i].product.id}/inventory/${order.orderDetails[i].quantity}`).then(resp => {
											console.log('Cập nhập inventory thành công');
										}).catch(error => {
											console.log(error);
										});
									}
									swal({
										title: "Thành công!",
										text: "Đơn hàng của bạn đã được đặt",
										icon: "success",
										button: "Đồng ý!",
									})
										.then(() => {
											location.href = "/order/detail/" + resp.data.id;
										});
								}).catch(error => {
									showErrorToast('Đặt hàng lỗi');
									console.log(error);
								});
							}).catch(error => {
								showErrorToast('Tạo tài khoản lỗi');
							});

						} else { //kiểm tra nếu  có tài khoản ẩn danh trong db thì tiến hành liên kết
							$scope.order.account = { id: $scope.account.id };
							console.log($scope.order.account);
							var order = angular.copy(this);
							order.paymentMethod = 'COD';
							order.orderStatus = 'NEW';
							order.orderPaymentStatus = 'UNPAID';
							console.log(order);
							console.log(order.orderDetails);

							//Thực hiện đặt hàng
							$http.post("/rest/orders/purchase", order).then(resp => {
								$scope.cart.loadFromLocalStorage();
								console.log(resp.data);
								$scope.cart.removeCarts();
								for (let i = 0; i < order.orderDetails.length; i++) {
									$http.get(`/rest/products/id/${order.orderDetails[i].product.id}/inventory/${order.orderDetails[i].quantity}`).then(resp => {
										console.log('Cập nhập inventory thành công');
									}).catch(error => {
										console.log(error);
									});
								}
								swal({
									title: "Thành công!",
									text: "Đơn hàng của bạn đã được đặt",
									icon: "success",
									button: "Đồng ý!",
								})
									.then(() => {
										location.href = "/order/detail/" + resp.data.id;
									});
							}).catch(error => {
								showErrorToast('Đặt hàng lỗi');
								console.log(error);
							});
						}

					});
				} else {//có đăng ký
					var account = {
						id: 200, photo: null, fullname: $scope.order.fullnameAnonymous, phoneNumber: $scope.order.phoneNumberAnonymous, enabled: true,
						password: $scope.acc.password, email: $scope.order.emailAnonymous, verificationToken: 'Order'
					};
					console.log('co dang ky');
					$http.get(`/rest/accounts`).then(resp => {
						$scope.accounts = resp.data;
						console.log($scope.accounts);
						for (let i = 0; i < $scope.accounts.length; i++) {
							if ($scope.order.emailAnonymous == $scope.accounts[i].email) {
								$scope.error = 'Email đã tồn tại';
								showErrorToast('Email đã tồn tại');
								break;
							} else {
								$scope.error = null;
							}
						}
						console.log('error ' + $scope.error);
						if ($scope.error == null) {
							if ($scope.acc.password == $scope.acc.password1) {
								$scope.error = "Vui lòng đợi !";

								$http.post(`/rest/accounts/create`, account).then(resp => {
									showSuccessToast('Đăng ký tài khoản thành công!');
									//$scope.error = "Đăng ký tài khoản thành công ! Vui lòng kiểm tra mã code tại email " + order.emailAnonymous + "!";
									$scope.checkcode = "yes";
									$scope.checkUser = resp.data;
									$http.post(`/rest/authorities/role`, $scope.checkUser).then(resp => {
									})

									$scope.order.account = { id: resp.data.id };
									console.log($scope.order.account);
									var order = angular.copy(this);
									order.paymentMethod = 'COD';
									order.orderStatus = 'NEW';
									order.orderPaymentStatus = 'UNPAID';
									console.log(order);
									console.log(order.orderDetails);

									//Thực hiện đặt hàng
									$http.post("/rest/orders/purchase", order).then(resp => {
										$scope.cart.loadFromLocalStorage();
										console.log(resp.data);
										$scope.cart.removeCarts();
										for (let i = 0; i < order.orderDetails.length; i++) {
											$http.get(`/rest/products/id/${order.orderDetails[i].product.id}/inventory/${order.orderDetails[i].quantity}`).then(resp => {
												console.log('Cập nhập inventory thành công');
											}).catch(error => {
												console.log(error);
											});
										}
										swal({
											title: "Thành công!",
											text: "Đơn hàng của bạn đã được đặt",
											icon: "success",
											button: "Đồng ý!",
										})
											.then(() => {
												location.href = "/order/detail/" + resp.data.id;
											});
									}).catch(error => {
										showErrorToast('Đặt hàng lỗi');
										console.log(error);
									});
								}).catch(error => {
									//alert("dang ky lỗi!")
									showErrorToast('Đăng ký lỗi!!');
									$scope.error = null;
									console.log(error);
								});
							} else {
								$scope.error = "Xác nhận mật khẩu không đúng!";
								showErrorToast('Xác nhận mật khẩu không đúng!');
							}
						}

					});//.catch(error => {
					//alert('khong tim dc accounts');
					//showErrorToast('khong tim dc accounts!');
					//})
				}
			}
		}
	};

	$scope.liked = false;

	$scope.favorite = {
		account: {},
		product: {},

		add(id) {
			var items = [];

			if ($("#remoteEmail").text()) {
				$http.get(`/rest/favorites`).then(resp => {
					items = resp.data;
					console.log(items);
					$http.get(`/rest/accounts/email/${$("#remoteEmail").text()}`).then(resp => {
						$scope.favorite.account = { id: resp.data };
						console.log("account: ", $scope.favorite.account);
						$http.get(`/rest/products/pid/${id}`).then(resp => {
							$scope.favorite.product = { id: resp.data };
							console.log(items);
							console.log("product: ", $scope.favorite.product);
							var favorite = angular.copy(this);
							console.log(favorite);
							$http.post('/rest/favorites', favorite).then(resp => {
								showSuccessToast('Thêm vào yêu thích thành công!');

								let linkLike = $(".product_liked-" + id);
								linkLike.addClass('heart-account');
								linkLike.removeAttr('ng-click')
								linkLike.attr('ng-click', 'angular.element(this).scope().favorite.removeByProduct(' + id + ')');
								console.log(resp.data);
							});
						});
					});
				});
			} else {
				location.href = "/login";
			}
		},

		// delete 
		remove(id) {
			var items = [];
			$http.get(`/rest/favorites`).then(resp => {
				items = resp.data;
				$http.delete(`/rest/favorites/${id}`).then(resp => {
					$('.fav' + id).remove();
					showSuccessToast('Bỏ yêu thích thành công!');
				}).catch(error => {
					showErrorToast('Bỏ yêu thích thất bại!');
					console.log("Error", error);
				});
			});
		},

		removeByProduct(id) {
			$http.delete(`/rest/favorites/pid/${id}`).then(resp => {
				showSuccessToast('Bỏ yêu thích thành công!');
				$(".product_liked-" + id).removeClass('heart-account');
			}).catch(error => {
				showErrorToast('Bỏ yêu thích thất bại!');
				console.log("Error", error);
			});
		},

	};

	$scope.priceUsdNew = 0;

	$scope.loader = function () {
		const priceVnd = $('#priceVnd').val();
		$scope.priceUsd = (priceVnd / 24000);
		$scope.priceUsdNew = $scope.priceUsd.toFixed(2);
		console.log($scope.priceUsdNew);
		return $scope.priceUsdNew;
	};

	//quen mk
	$scope.account_forget = null;
	$scope.forget_error;
	$scope.checkemail_forget = null;
	$scope.checkcode_forget = null;
	$scope.check_backlogin = null;
	$scope.password = {
		forget(item) {
			if (item != null) {
				$http.get(`/rest/accounts/account/email/${item}`).then(resp => {
					$scope.account_forget = resp.data;
					console.log($scope.account_forget);
					if (!$scope.account_forget) {
						$scope.forget_error = "Không thể tìm thấy tài khoản bạn đã nhập";
						swal("Thất bại!", "Không thể tìm thấy tài khoản bạn đã nhập!", "error");
						$scope.checkemail_forget = null;
					} else {
						$scope.forget_error = "Đang gửi mã đến email của bạn. Xin vui lòng kiểm tra email của bạn   !   " + $scope.account_forget.email + " !";
						//swal("Thành công!", "Thêm mới người dùng thành công!", "success");
						showSuccessToast("Đang gửi mã đến email của bạn. Xin vui lòng kiểm tra email của bạn   !   " + $scope.account_forget.email + " !");
						$scope.checkemail_forget = "1";
						$http.put(`/rest/accounts/forget`, $scope.account_forget).then(resp => {
							$scope.account_forget = resp.data;
							$scope.forget_error = "Đã gửi mã đến email của bạn. Xin vui lòng kiểm tra email của bạn   ! " + $scope.account_forget.email + " !";
							showSuccessToast("Đã gửi mã đến email của bạn. Xin vui lòng kiểm tra email của bạn   !   " + $scope.account_forget.email + " !");
						});
					}
				}).catch(error => {
					alert(error);

				});
			} else {
				$scope.forget_error = null;
			}
		},
		confirm(item) {
			if (item != null) {
				if (item == $scope.account_forget.verificationToken) {
					$scope.forget_error = "Vui lòng thay đổi mật khẩu của bạn !";
					swal("Thành công!", "Vui lòng thay đổi mật khẩu của bạn !", "success");
					$scope.checkcode_forget = "1";
					$scope.checkemail_forget = null;
				} else {
					$scope.forget_error = "Mã xác minh không chính xác! ";
					swal("Thất bại!", "Mã xác minh không chính xác !", "error");
					$scope.checkcode_forget = null;
					$scope.checkemail_forget = "1";
				}
			} else {
				$scope.forget_error = "Vui lòng nhập mã xác nhận! ";
				swal("Thất bại!", "Vui lòng nhập mã xác nhận!", "error");
				$scope.checkemail_forget = "1";
			}
		},
		changepassword(item) {
			if (item.pw == item.cfpw) {
				$scope.account_forget.password = item.pw;
				$scope.forget_error = "Mật khẩu xác nhận chính xác !";
				//showSuccessToast("Mật khẩu xác nhận chính xác!   ");
				$http.put(`/rest/accounts/change`, $scope.account_forget).then(resp => {
					$scope.account_forget = resp.data;
					console.log($scope.account_forget);
					swal({
						title: "Đổi mật khẩu thành công !",
						text: "Bạn muốn chuyển qua trang đăng nhập không? ",
						icon: "success",
						buttons: ["Hủy!", "Đồng ý!"],
						successMode: true
					}).then((willDelete) => {
						if (willDelete) {
							location.href = "/login";
						} else {
							swal("Bạn vẫn ở trang quên mật khẩu!");
						}
					});
					$scope.forget_error = "Đổi mật khẩu thành công !";
					//swal("Thành công!", "Đổi mật khẩu thành công  !", "success");

					$scope.checkcode_forget = null;

				});
			} else {
				$scope.forget_error = "Mật khẩu xác nhận không chính xác !";
				swal("Thất bại!", "Mật khẩu xác nhận không chính xác !", "error");

				$scope.checkcode_forget = "1";
				$scope.checkemail_forget = null;
			}
		}
	};
	//dangky tai khoan
	$scope.register = function (id) {
		var dto_email = null;
		dto_email = $("#user_email").text();
		//swal("Thất bại!", " xác nhận không chính xác !", "error");
		$http.get(`/rest/accounts/account/email/${dto_email}`).then(resp => {
			console.log(resp.data)
			if (id == resp.data.verificationToken) {
				swal({
					title: "Thành công!",
					text: "Tài khoản của bạn đã được đăng ký",
					icon: "success",
					button: "Đồng ý!",
				})
					.then(() => {
						location.href = "/register/code";
					});
			} else {
				swal("Thất bại!", "Mã xác nhận không chính xác! Vui lòng kiểm tra lại !", "error");
			}
		})
	}
});

app.controller('paypal-ctrl', function ($scope, $http) {
	initPayPalButton = function () {
		paypal.Buttons({
			style: {
				shape: 'rect',
				color: 'gold',
				layout: 'vertical',
				label: 'paypal',
			},

			client: {
				sandbox: 'AankfqJu8TQ6ebHKleWHyZFOJjunjyZNdOfl54Q3SeRbu9xL9md6kZviO83MjMch9iVLY_I3rZBnLUJ3',
				production: ''
			},

			createOrder: function (data, actions) {
				return actions.order.create({
					purchase_units: [{ "amount": { "currency_code": "USD", "value": document.getElementById('priceUsd').value } }]
				});
			},
			onInit: function (data, actions) {

				// Disable the buttons
				actions.disable();

				// Listen for changes to the checkbox
				document.querySelector('#check')
					.addEventListener('change', function (event) {

						// Enable or disable the button when it is checked or unchecked
						if (event.target.checked) {
							actions.enable();
						} else {
							actions.disable();
						}
					});
			},
			onApprove: function (data, actions) {
				var email = null;
				email = $("#remoteEmail").text();
				$scope.acc = {};
				$scope.order = {
					createDate: new Date(),
					addressLine1: "",
					provinceCity: "",
					district: "",
					wardVillage: "",
					account: {},
					note: "",
					confirm: false,

					get orderDetails() {
						// nếu có người dùng
						// return $scope.carts.map
						if (email != "") {
							return $scope.checkout.items.map(item => {
								return {
									product: { id: item.product.id },
									price: item.product.price,
									quantity: item.quantity,
								};
							});
						} else {
							return $scope.checkout.items.map(item => {
								return {
									product: { id: item.id },
									price: item.realPrice,
									quantity: item.quantity,
								};
							});
						}
					},
					purchase() {
						var checked = $('input[name="account"]:checked');

						var note = $('#note-order').val();
						$scope.order.note = note;
						if (email != "") { //đã login
							var phone = $('#phone-account').val();
							if (phone != '') {
								$scope.order.phoneNumberAnonymous = phone;
							} else {
								showWarningToast("Nhập Số điện thoại!");
								return false;
							}
							var addressIsDefault = $("#addressSelect option:selected").text();
							var noAddress = $("#no-address").val();
							var haveAddress = $("#address_line_1").val();
							if (noAddress != '' && haveAddress == undefined) {
								$scope.order.addressLine1 = noAddress;
							} else if(noAddress == undefined && haveAddress != ''){
								$scope.order.addressLine1 = haveAddress
							} else if(noAddress == undefined && haveAddress == '' && addressIsDefault == "Chọn địa chỉ khác...") {
								showWarningToast("Nhập Số nhà, Đường!");
								return false;
							} 
							$http.get(`/rest/accounts/email/${email}`).then(resp => {
								var id = resp.data;
								$http.get(`/profile/address/by-account/${id}`).then(resp => {
									$scope.lengthAddress = resp.data.length;
									if ($scope.lengthAddress > 0) {
										var addressIsDefault = $("#addressSelect option:selected").text();
										var valueCity = $('#city option:selected').text();
										var valueDistrict = $('#district option:selected').text();
										var valueWard = $('#ward option:selected').text();
										if (addressIsDefault === "Chọn địa chỉ khác...") {
											if (valueCity === "Chọn tỉnh thành") {
												valueCity = "";
											}
											if (valueDistrict === "Chọn quận huyện") {
												valueDistrict = "";
											}
											if (valueWard === "Chọn phường xã") {
												valueWard = "";
											}
											//validate
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
											let addressLine1 = $("#address_line_1").val();
											if (!addressLine1 || addressLine1 === '') {
												showWarningToast("Nhập Số nhà, Đường");
												return false;
											}
											$scope.order.provinceCity = valueCity;
											$scope.order.district = valueDistrict;
											$scope.order.wardVillage = valueWard;
										} else {
											$scope.addressSelect = addressIsDefault.split(", ").splice(0);
											$scope.order.provinceCity = $scope.addressSelect[$scope.addressSelect.length - 1];
											$scope.order.district = $scope.addressSelect[$scope.addressSelect.length - 2];
											$scope.order.wardVillage = $scope.addressSelect[$scope.addressSelect.length - 3];
											$scope.order.addressLine1 = $scope.addressSelect[$scope.addressSelect.length - 4];
											for (var i = 5; i <= $scope.addressSelect.length; i++) {
												$scope.order.addressLine1 = $scope.addressSelect[$scope.addressSelect.length - i] + ", " + $scope.order.addressLine1
											}
										}
									} else {
										var valueCity = $('#no-city option:selected').text();
										if (!valueCity || valueCity === '' || valueCity === 'Chọn tỉnh thành') {
											showWarningToast("Chọn tỉnh thành");
											return false;
										}
										var valueDistrict = $('#no-district option:selected').text();
										if (!valueDistrict || valueDistrict === '' || valueDistrict === 'Chọn quận huyện') {
											showWarningToast("Chọn quận huyện");
											return false;
										}
										var valueWard = $('#no-ward option:selected').text();
										console.log(valueWard);
										if (!valueWard || valueWard === '' || valueWard === 'Chọn phường xã') {
											showWarningToast("Chọn phường xã");
											return false;
										}

										$scope.order.provinceCity = valueCity;
										$scope.order.district = valueDistrict;
										$scope.order.wardVillage = valueWard;
										$scope.order.addressLine1 = noAddress;
									}
									$http.get(`/rest/accounts/email/${$("#email").text()}`).then(resp => {
										$scope.order.account = { id: resp.data };
										console.log($scope.order.account);
										var order = angular.copy(this);
										order.paymentMethod = 'CREDIT_CARD';
										order.orderStatus = 'NEW';
										order.orderPaymentStatus = 'PAID';
										console.log(order);
										console.log(order.orderDetails);

										//Thực hiện đặt hàng
										$http.post("/rest/orders/purchase", order).then(resp => {
											console.log(resp.data);
											$scope.cart.removeCarts();
											//$scope.cart.clear();
											for (let i = 0; i < order.orderDetails.length; i++) {
												$http.get(`/rest/products/id/${order.orderDetails[i].product.id}/inventory/${order.orderDetails[i].quantity}`).then(resp => {
													console.log('Cập nhập inventory thành công');
												}).catch(error => {
													console.log(error);
												});
											}
											swal({
												title: "Thành công!",
												text: "Đơn hàng của bạn đã được đặt",
												icon: "success",
												button: "Đồng ý!",
											})
												.then(() => {
													location.href = "/order/detail/" + resp.data.id;
												});
										}).catch(error => {
											showErrorToast('Đặt hàng lỗi');
											console.log(error);
										});
									}).catch(error => {
										showErrorToast('Lỗi');
										console.log(error);
									});
								})
							})
						} else { //chưa login
							var valueCity = $('#city option:selected').text();
							var valueDistrict = $('#district option:selected').text();
							var valueWard = $('#ward option:selected').text();
							if (valueCity === "Chọn tỉnh thành") {
								valueCity = "";
							}
							if (valueDistrict === "Chọn quận huyện") {
								valueDistrict = "";
							}
							if (valueWard === "Chọn phường xã") {
								valueWard = "";
							}
							//validate
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

							$scope.order.provinceCity = valueCity;
							$scope.order.district = valueDistrict;
							$scope.order.wardVillage = valueWard;
							$scope.account;

							if (checked.length == 0) { // không đăng ký
								console.log('khong dang ky');
								var email1 = "andanh@gmail.com";
								$http.get(`/rest/accounts/account/email/${email1}`).then(resp => {
									$scope.account = resp.data;
									//$scope.order.account = { id: $scope.account.id };

									if ($scope.account.length == 0) { //kiểm tra nếu chưa có tài khoản ẩn danh trong db thì tạo mới
										var account = { id: 200, photo: null, fullname: 'AnDanh', phoneNumber: '0123456789', enabled: true, password: '12345678', email: 'andanh@gmail.com', verificationToken: 'Guest' };

										$http.post("/rest/accounts/create", account).then(resp => {
											console.log(resp.data);
											$scope.order.account = { id: resp.data.id };
											console.log($scope.order.account);
											var order = angular.copy(this);
											order.paymentMethod = 'CREDIT_CARD';
											order.orderStatus = 'NEW';
											order.orderPaymentStatus = 'PAID';
											console.log(order);
											console.log(order.orderDetails);

											//Thực hiện đặt hàng
											$http.post("/rest/orders/purchase", order).then(resp => {
												$scope.cart.loadFromLocalStorage();
												console.log(resp.data);
												$scope.cart.removeCarts();
												for (let i = 0; i < order.orderDetails.length; i++) {
													$http.get(`/rest/products/id/${order.orderDetails[i].product.id}/inventory/${order.orderDetails[i].quantity}`).then(resp => {
														console.log('Cập nhập inventory thành công');
													}).catch(error => {
														console.log(error);
													});
												}
												swal({
													title: "Thành công!",
													text: "Đơn hàng của bạn đã được đặt",
													icon: "success",
													button: "Đồng ý!",
												})
													.then(() => {
														location.href = "/order/detail/" + resp.data.id;
													});
												return actions.order.capture().then(function (orderData) {
													console.log('Capture result', orderData, JSON.stringify(orderData, null, 2));
												});
											}).catch(error => {
												showErrorToast('Đặt hàng lỗi');
												console.log(error);
											});
										}).catch(error => {
											showErrorToast('Tạo tài khoản lỗi');
										});

									} else { //kiểm tra nếu  có tài khoản ẩn danh trong db thì tiến hành liên kết
										$scope.order.account = { id: $scope.account.id };
										console.log($scope.order.account);
										var order = angular.copy(this);
										order.paymentMethod = 'CREDIT_CARD';
										order.orderStatus = 'NEW';
										order.orderPaymentStatus = 'PAID';
										console.log(order);
										console.log(order.orderDetails);

										//Thực hiện đặt hàng
										$http.post("/rest/orders/purchase", order).then(resp => {
											$scope.cart.loadFromLocalStorage();
											console.log(resp.data);
											$scope.cart.removeCarts();
											for (let i = 0; i < order.orderDetails.length; i++) {
												$http.get(`/rest/products/id/${order.orderDetails[i].product.id}/inventory/${order.orderDetails[i].quantity}`).then(resp => {
													console.log('Cập nhập inventory thành công');
												}).catch(error => {
													console.log(error);
												});
											}
											swal({
												title: "Thành công!",
												text: "Đơn hàng của bạn đã được đặt",
												icon: "success",
												button: "Đồng ý!",
											})
												.then(() => {
													location.href = "/order/detail/" + resp.data.id;
												});
											return actions.order.capture().then(function (orderData) {
												console.log('Capture result', orderData, JSON.stringify(orderData, null, 2));
											});
										}).catch(error => {
											showErrorToast('Đặt hàng lỗi');
											console.log(error);
										});
									}

								});
							} else {//có đăng ký
								var account = {
									id: 200, photo: null, fullname: $scope.order.fullnameAnonymous, phoneNumber: $scope.order.phoneNumberAnonymous, enabled: true,
									password: $scope.acc.password, email: $scope.order.emailAnonymous, verificationToken: 'Order'
								};
								console.log('co dang ky');
								$http.get(`/rest/accounts`).then(resp => {
									$scope.accounts = resp.data;
									console.log($scope.accounts);
									for (let i = 0; i < $scope.accounts.length; i++) {
										if ($scope.order.emailAnonymous == $scope.accounts[i].email) {
											$scope.error = 'Email đã tồn tại';
											showErrorToast('Email đã tồn tại');
											break;
										} else {
											$scope.error = null;
										}
									}
									console.log('error ' + $scope.error);
									if ($scope.error == null) {
										if ($scope.acc.password == $scope.acc.password1) {
											$scope.error = "Vui lòng đợi !";

											$http.post(`/rest/accounts/create`, account).then(resp => {
												showSuccessToast('Đăng ký tài khoản thành công!');
												//$scope.error = "Đăng ký tài khoản thành công ! Vui lòng kiểm tra mã code tại email " + order.emailAnonymous + "!";
												$scope.checkcode = "yes";
												$scope.checkUser = resp.data;
												$http.post(`/rest/authorities/role`, $scope.checkUser).then(resp => {
												})

												$scope.order.account = { id: resp.data.id };
												console.log($scope.order.account);
												var order = angular.copy(this);
												order.paymentMethod = 'CREDIT_CARD';
												order.orderStatus = 'NEW';
												order.orderPaymentStatus = 'PAID';
												console.log(order);
												console.log(order.orderDetails);

												//Thực hiện đặt hàng
												$http.post("/rest/orders/purchase", order).then(resp => {
													$scope.cart.loadFromLocalStorage();
													console.log(resp.data);
													$scope.cart.removeCarts();
													for (let i = 0; i < order.orderDetails.length; i++) {
														$http.get(`/rest/products/id/${order.orderDetails[i].product.id}/inventory/${order.orderDetails[i].quantity}`).then(resp => {
															console.log('Cập nhập inventory thành công');
														}).catch(error => {
															console.log(error);
														});
													}
													swal({
														title: "Thành công!",
														text: "Đơn hàng của bạn đã được đặt",
														icon: "success",
														button: "Đồng ý!",
													})
														.then(() => {
															location.href = "/order/detail/" + resp.data.id;
														});
													return actions.order.capture().then(function (orderData) {
														console.log('Capture result', orderData, JSON.stringify(orderData, null, 2));
													});
												}).catch(error => {
													showErrorToast('Đặt hàng lỗi');
													console.log(error);
												});
											}).catch(error => {
												//alert("dang ky lỗi!")
												showErrorToast('Đăng ký lỗi!!');
												$scope.error = null;
												console.log(error);
											});
										} else {
											$scope.error = "Xác nhận mật khẩu không đúng!";
											showErrorToast('Xác nhận mật khẩu không đúng!');
										}
									}

								});
							}
						}
					}
				};
				$scope.order.purchase();
			},

			onError: function (err) {
				console.log(err);
				alert('Lỗi paypal');
			}
		}).render('#paypal-button-container');
	};
	initPayPalButton();

});

app.controller('address-controller', function ($scope, $http) {
	$scope.save = () => {
		let provinceCity = $('#cityAddress').find(":selected").text();
		if (!provinceCity || provinceCity === '' || provinceCity === 'Chọn tỉnh thành') {
			showWarningToast("Chọn tỉnh thành");
			return false;
		}
		let district = $('#districtAddress').find(":selected").text();
		if (!district || district === '' || district === 'Chọn quận huyện') {
			showWarningToast("Chọn quận huyện");
			return false;
		}
		let wardVillage = $('#wardAddress').find(":selected").text();
		if (!wardVillage || wardVillage === '' || wardVillage === 'Chọn phường xã') {
			showWarningToast("Chọn phường xã");
			return false;
		}
		let addressLine1 = $("#address_line_1").val();
		if (!addressLine1 || addressLine1 === '') {
			showWarningToast("Nhập Số nhà, Đường");
			return false;
		}

		let isDefault = false;

		let address = {
			isDefault, addressLine1, wardVillage, district, provinceCity
		};

		$http.post(`/profile/address/add`, address).then(resp => {
			if (resp.data) {
				swal("Lưu địa chỉ thành công!", {
					icon: "success",
				});
				$("#editAddress").modal('toggle');
				let address = resp.data;

				let addAddressHtml = `
					<div id="address${address.id}" class="col-md-4 card">
						<label for="isDefault${address.id}">
							<div class="form-group card-content">
								<div class="radio-address">
									<input name="isDefault" id="isDefault${address.id}" type="radio" value="${address.id}" onchange="javascript:setDefaultAddress($(this))"
										${address.isDefault ? 'checked' : ''}>
								</div>
								<div class="remove-address">
									<button class="btn delete-address" data-aid="${address.id}" onclick="javascript:deleteAddress($(this))">
										<i class="fa-solid fa-xmark"></i></button>
								</div>
								<div class="text-address">${address.address}</div>
							</div>
						</label>
					</div>
				`;

				$("#address-row").append(addAddressHtml);
				let removeTag = $(".no-address-found");
				if (removeTag) removeTag.remove();
								
			} else {
				showErrorToast("Lỗi hệ thống 1!");
			}
		}).catch(error => {
			showErrorToast("Lỗi hệ thống 2!");
			console.log(error);
		});
	};
});