app.controller('order_detail-ctrl', function ($scope, $http, $routeParams) {
    $scope.items = [];
    $scope.info = [];
    $scope.ratings = [];
    $scope.tracks = [];
    $scope.orderByField = 'id';
    $scope.reverseSort = false;

    $scope.closeModal = function () {
        $('#statusModal').modal('hide')
        $('#ratedOrder').modal('hide')
    }

    var id = $routeParams.id;
    $scope.initialize = function () {
        $http.get(`/rest/order-details/${id}`).then(resp => {
            $scope.items = resp.data;
            console.log($scope.items)
        });

        $http.get(`/rest/orders/${id}`).then(resp => {
            $scope.info = resp.data;
            console.log($scope.info.paymentMethod);
            console.log(typeof ($scope.info.paymentMethod));
        })

        $http.get(`/rest/ratings/by-order/${id}`).then(resp => {
            $scope.ratings = resp.data;
        })

        $http.get(`/rest/order-tracks/${id}`).then(resp => {
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
            console.log($scope.tracks);
        })
    }

    $scope.initialize();

    $scope.getTotal = function () {
        var total = 0;
        for (var i = 0; i < $scope.items.length; i++) {
            var product = $scope.items[i];
            total += (product.price * product.quantity);
        }
        return total;
    }

    $scope.updateOrderStatusElm = function (id, status, item) {
        if (!item) {
            showErrorToast("Vui lòng chọn chi tiết trạng thái !")
            return false
        }
        if (item == 'other-detail') {

            var other_detail = $('textarea#content-detail').val();
            if (other_detail == '') {
                showErrorToast("Vui lòng nhập chi tiết trạng thái !")
                return false;
            }
            item = other_detail;
        }
        $http.get(`/rest/order-tracks/${id}/status/${status}`).then(resp => {
            $scope.orderTracks = resp.data;
            var currentDate = new Date();
           // var dateFormat = date.toLocaleString();
            var hours = currentDate.getHours().toString().padStart(2, '0');
            var minutes = currentDate.getMinutes().toString().padStart(2, '0');
            var seconds = currentDate.getSeconds().toString().padStart(2, '0');
            var day = currentDate.getDate().toString().padStart(2, '0');
            var month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
            var year = currentDate.getFullYear().toString();
            var dateFormat  = hours + ':' + minutes + ':' + seconds + ' | ' + day + '/' + month + '/' + year;
            if ($scope.orderTracks.note == null) { //kiểm tra  đơn hàng đã có tình trạng ghi chú chưa
                if ($scope.place == null) { //kiem tra có nhập dịa điểm không
                    $scope.orderTracks.note = "\n" + dateFormat + ": " + item
                } else {
                    $scope.orderTracks.note = "\n" + dateFormat + ": " + item + " tại " + $scope.place
                }
            } else {
                if ($scope.place == null) {
                    $scope.orderTracks.note = $scope.orderTracks.note + "\n" + dateFormat + ": " + item
                } else {
                    $scope.orderTracks.note = $scope.orderTracks.note + "\n" + dateFormat + ": " + item + " tại " + $scope.place
                }

            }
            $http.put(`/rest/order-tracks/${$scope.orderTracks.id}`, $scope.orderTracks).then(resp => {
                showSuccessToast('Cập nhật trạng thái đơn hàng thành công!')
                $scope.initialize();
                $('#statusModalElm').modal('hide');
            })

        });


    }

    $scope.updateOrderStatus = function (id, status) {
        $http.put(`/rest/orders/update/status/${id}/${status}`).then(resp => {
            showSuccessToast('Cập nhật trạng thái đơn hàng thành công!')
            $scope.initialize();
        })
        var orderTrack = {
            orderStatus: status,
            updateTime: new Date(),
            order: { id: id }
        }
        if (status == 'CONFIRMED') {

        }
        $http.post(`/rest/order-tracks`, orderTrack).then(resp => {
            $scope.orderTrackNew = resp.data;
            console.log($scope.orderTrackNew);
        })
    }

    $scope.updateOrderStatusCancel = function (id) {
        console.log(id);
        $http.get(`/rest/orders/${id}`).then(resp => {
            $scope.orderOld = resp.data;
            console.log($scope.orderOld);
            var reasonCancel = $('#content-cancel option:selected').text();
            if (reasonCancel == "Chọn lý do gợi ý") {
                showErrorToast('vui lòng chọn lý do')
            } else {
                if (reasonCancel == "Lý do khác...") {
                    reasonCancel = $('textarea#content-reason').val();
                    if (reasonCancel == '') {
                        showErrorToast('Nhập cho đang hoàng')
                    } else {
                        var item = angular.copy($scope.orderOld)
                        console.log(reasonCancel);
                        item.note = $scope.orderOld.note + " // Lý do hủy: " + reasonCancel;
                        item.orderStatus = 'CANCELLED'
                        $http.put(`/rest/orders/${id}`, item).then(resp => {
                            swal("Thành công!", "Bạn đã hủy đơn hàng thành công!", "success")
                                .then(() => {
                                    location.reload();
                                });
                        })
                        var orderTrack = {
                            orderStatus: item.orderStatus,
                            updateTime: new Date(),
                            order: { id: id }
                        }
                        $http.post(`/rest/order-tracks`, orderTrack).then(resp => {
                            $scope.orderTrackNew = resp.data;
                            console.log($scope.orderTrackNew);
                        })
                    }
                } else {
                    var item = angular.copy($scope.orderOld)
                    console.log(reasonCancel);
                    item.note = $scope.orderOld.note + " // Lý do hủy: " + reasonCancel;
                    item.orderStatus = 'CANCELLED'
                    $http.put(`/rest/orders/${id}`, item).then(resp => {
                        swal("Thành công!", "Bạn đã hủy đơn hàng thành công!", "success")
                            .then(() => {
                                location.reload();
                            });
                    })
                    var orderTrack = {
                        orderStatus: item.orderStatus,
                        updateTime: new Date(),
                        order: { id: id }
                    }
                    $http.post(`/rest/order-tracks`, orderTrack).then(resp => {
                        $scope.orderTrackNew = resp.data;
                        console.log($scope.orderTrackNew);
                    })
                }
            }
        })
    }

    //phân trang
    $scope.pageSize = 10;
    $scope.start = 0;
    $scope.pageIndex = 0;

    $scope.next = function () {
        if ($scope.start < $scope.items.length - $scope.pageSize) {
            $scope.start += $scope.pageSize;
            $scope.pageIndex++;
        }
    }
    $scope.prev = function () {
        if ($scope.start > 0) {
            $scope.start -= $scope.pageSize;
            $scope.pageIndex--;
        }
    }
    $scope.first = function () {
        $scope.start = 0;
        $scope.pageIndex = 0;
    }
    $scope.last = function () {
        sotrang = Math.ceil($scope.items.length / $scope.pageSize);
        $scope.start = $scope.pageSize * (sotrang - 1);
        $scope.pageIndex = $scope.count() - 1;
    }
    $scope.count = function () {
        return Math.ceil(1.0 * $scope.items.length / $scope.pageSize);
    }

})

function showHide(elm) {


    if (elm == "other-reason") {
        //display textbox
        document.getElementById('content-reason').style.display = "block";
    } else {
        //hide textbox
        document.getElementById('content-reason').style.display = "none";
    }

}
function showHideStatus(elm) {


    if (elm == "other-detail") {
        //display textbox
        document.getElementById('content-detail').style.display = "block";
    } else {
        //hide textbox
        document.getElementById('content-detail').style.display = "none";
    }

}