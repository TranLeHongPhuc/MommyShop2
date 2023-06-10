var app = angular.module("admin-app", ["ngRoute", "textAngular", "angularUtils.directives.dirPagination"]);


app.controller('remote-user', function ($scope, $http) {
    $scope.session = "";

    $http.get('/rest/remote').then(resp => {
        $scope.session = resp.data;
    })
})

app.config(function ($routeProvider) {
    $routeProvider
        .when("/admin", {
            templateUrl: "/assets/admin/home/home.html",
            controller: "home-ctrl"
        })
        .when("/brand", {
            templateUrl: "/assets/admin/brand/index.html",
            controller: "brand-ctrl"
        })
        .when("/product", {
            templateUrl: "/assets/admin/product/index.html",
            controller: "product-ctrl"
        })
        .when("/account", {
            templateUrl: "/assets/admin/account/index.html",
            controller: "account-ctrl"
        })
        .when("/profile", {
            templateUrl: "/assets/admin/account/_page-profile.html",
            controller: "profile-ctrl"
        })
        .when("/category", {
            templateUrl: "/assets/admin/category/index.html",
            controller: "category-ctrl"
        })
        .when("/details/:id", {
            templateUrl: "/assets/admin/order/order_detail.html",
            controller: "order_detail-ctrl"
        })
        .when("/order", {
            templateUrl: "/assets/admin/order/order.html",
            controller: "order-ctrl"
        })
        .when("/report", {
            templateUrl: "/assets/admin/report/report.html",
            controller: "report-ctrl"
        })
        .when("/authorize", {
            templateUrl: "/assets/admin/authority/index.html",
            controller: "authority-ctrl"
        })
        .when("/unauthorized", {
            templateUrl: "/assets/admin/authority/unauthorized.html",
            controller: "authority-ctrl"
        })
        .otherwise({
            templateUrl: "/assets/admin/home/home.html",
            controller: "home-ctrl"
        });
});