app.controller('home-ctrl', function($scope, $http, $filter) {
	// var dateStr = '2015-09-21 18:30:00';
	// $scope.dt = $filter('date')(new Date(dateStr.split('-').join('/')), "MM/yyyy");
	// console.log($scope.dt);
	$scope.tableToExcel = function() {
		var table2excel = new Table2Excel();
		table2excel.export(document.querySelectorAll("table.google-visualization-table-table"));
	}

	$scope.items = [];
	$scope.id = null;
	$scope.chartProduct = 1;
	$scope.month = 'Full';
	$scope.month_re = null;
	$scope.brand = null;
	$scope.revenueSum = null;
	$scope.customer = null;
	var report = [];
	var report_product = [];
	var product_name = [];
	var sum = [];
	var data;
	var report_month = [];
	var report_month1 = [];
	var report_year = [];
	var report_year1 = [];
	var report_brand = [];
	var report_product = [];
	var report_sum = [];
	var report1 = [];
	var report2 = [];
	var report3 = [];
	var report4 = [];
	var report5 = [];
	$scope.initialize = function() {
		$http.get('/rest/brands').then(resp => {
			$scope.brands = resp.data;

		});
		$http.get('/rest/reports/revenue/sum').then(resp => {
			$scope.revenueSum = resp.data;
		});
		
		$http.get('/rest/reports/revenue/sum/all').then(resp => {
			$scope.revenueAll = resp.data;
		});
		
		$http.get('/rest/accounts/user').then(resp => {
			$scope.accounts = resp.data;

		});

		$http.get('/rest/products').then(resp => {
			$scope.products = resp.data;
		});

		$http.get('/rest/categories/listParent').then(resp => {
			$scope.cates_parent = resp.data;

		});


		//lay doanh thu san pham theo thang va nam
		$http.get('/rest/reports/revenue/month').then(resp => {
			$scope.month_re = resp.data;
			console.log($scope.month_re)
			for (let i = 0; i < $scope.month_re.length; i++) {
				report_month1.push($scope.month_re[i].month)
				report_year1.push($scope.month_re[i].year)
			}
			$http.get('/rest/reports/revenue/product').then(resp => {
				$scope.products = resp.data;
				report_product.push("Month of year")
				for (let i = 0; i < 5; i++) {
					report_product.push($scope.products[i])
					product_name.push($scope.products[i].name)
				}
				for (let i = 0; i < report_month1.length; i++) {
					//report4[i] = ['Tháng ' + report_month1[i] + '/' + report_year1[i]]
					report4[i] = [new Date(report_year1[i], report_month1[i], 0)]
					for (let j = 1; j < 6; j++) {
						$http.get(`/rest/reports/revenue/product/${report_product[j].month}/month/${report_month1[i]}/year/${report_year1[i]}`).then(resp => {
							$scope.datata = resp.data;
							if ($scope.datata[0].sum == null) {
								report4[i][j] = 10
							} else {
								report4[i][j] = $scope.datata[0].sum

							}
						})
					}

				}
				//load bieu do san pham
				google.charts.load('current', { 'packages': ['corechart'] });
				google.charts.setOnLoadCallback(drawChartProduct);

				function drawChartProduct() {
					setTimeout(() => {
						var data = google.visualization.arrayToDataTable([]);
						data.addColumn('date', 'Tháng / Năm')
						for (let i = 0; i < product_name.length; i++) {
							data.addColumn('number', product_name[i]);
						}
						data.addRow(report4[0])
						for (let i = 1; i < report4.length; i++) {
							data.addRow(report4[i]);
						}

						var options = {
							title: 'Company Performance',
							curveType: 'function',
							legend: { position: 'right' },
							vAxis: {
								scaleType: 'log'
							},
							//lineWidth: 5,
							pointSize: 10,
							series: {
								0: { pointShape: 'circle' },
								1: { pointShape: 'triangle' },
								2: { pointShape: 'square' },
								3: { pointShape: 'diamond' },
								4: { pointShape: 'star' },
								5: { pointShape: 'polygon' }
							}
						};

						var chart = new google.visualization.LineChart(document.getElementById('curve_chart_product'));
						var formatter3 = new google.visualization.DateFormat({ pattern: "MM / yyyy" });
						formatter3.format(data, 0);
						chart.draw(data, options);
						//load table theo product
						google.charts.load('current', { 'packages': ['table'] });
						google.charts.setOnLoadCallback(drawTable);

						function drawTable() {


							var table = new google.visualization.Table(document.getElementById('table_div_product'));


							table.draw(data, { showRowNumber: true, width: '100%', height: '100%' });
						}
					}, 1)
				}
			});
		});


		//lay doanh thu theo thang va nam
		$http.get('/rest/reports/revenue/month').then(resp => {
			$scope.month_re = resp.data;

			for (let i = 0; i < $scope.month_re.length; i++) {
				report_month.push($scope.month_re[i].month)
				report_year.push($scope.month_re[i].year)
				// var dateStr = $scope.month_re[i].year + '-' + $scope.month_re[i].month
				// $scope.date = $filter('date')(new Date(dateStr.split('-').join('/')), "MM/yyyy");
				// console.log($scope.date);
				report3.push([new Date($scope.month_re[i].year, $scope.month_re[i].month, 0), $scope.month_re[i].sum])
			}

			//load bieu do doanh thu

			google.charts.load('current', { 'packages': ['corechart'] });
			google.charts.setOnLoadCallback(areaChart);

			function areaChart() {
				var data = google.visualization.arrayToDataTable([

				]);
				data.addColumn('date', 'THÁNG / NĂM')
				data.addColumn('number', 'DOANH THU')

				for (let i = 0; i < report3.length; i++) {
					data.addRow(report3[i]);
				}
				var options = {
					title: 'Doanh thu',
					hAxis: { title: 'Tháng / Năm', titleTextStyle: { color: '#333' } },
					vAxis: { minValue: 0 },
					series: {
						0: { color: '#FF0033' },

					},
					pointSize: 10,
					pointShape: { type: 'circle', rotation: 180 }
				};

				var chart = new google.visualization.AreaChart(document.getElementById('area_chart_revenue'));
				var formatter3 = new google.visualization.DateFormat({ pattern: "MM / yyyy" });
				formatter3.format(data, 0);
				chart.draw(data, options);
				//load table doanh thu
				google.charts.load('current', { 'packages': ['table'] });
				google.charts.setOnLoadCallback(drawTable);

				function drawTable() {


					var table = new google.visualization.Table(document.getElementById('table_div'));
					// var formatter = new google.visualization.BarFormat({ width: 120 });
					// formatter.format(data, 1); // Apply formatter to second column
					// var formatter = new google.visualization.ColorFormat();
					// formatter.addRange(0, 99999999, 'black', '#FFC107');
					// formatter.addRange(100000000, null, 'white', '#17A2B8');
					// formatter.format(data, 1);

					//console.log(formatter3.format(data, 0));
					table.draw(data, { allowHtml: true, showRowNumber: true, width: '100%', height: '100%' });
				}

			}

			$http.get('/rest/reports/revenue/brand').then(resp => {
				$scope.brand = resp.data;
				report_brand.push("Tháng / Năm")
				for (let i = 0; i < 5; i++) {
					report_brand.push($scope.brand[i].name)
				}

				for (let i = 1; i < report_brand.length; i++) {
					$http.get(`/rest/reports/revenue/brand/${report_brand[i]}`).then(resp => {
						report1.push(resp.data);
					})

				}
				for (let i = 0; i < report_month.length; i++) {
					report2[i] = [report_month[i] + '/' + report_year[i]]
					for (let j = 1; j < report_brand.length; j++) {
						$http.get(`/rest/reports/revenue/brand/${report_brand[j]}/month/${report_month[i]}/year/${report_year[i]}`).then(resp => {
							$scope.datata = resp.data;
							if ($scope.datata[0].sum == null) {
								report2[i][j] = 0
							} else {
								report2[i][j] = $scope.datata[0].sum
							}
						})
					}

				}



				//load bieu do theo brand
				google.charts.load('current', { 'packages': ['bar'] });
				google.charts.setOnLoadCallback(drawChart);

				function drawChart() {
					setTimeout(() => {
						var data = google.visualization.arrayToDataTable([]);
						data.addColumn('string', report_brand[0])
						for (let i = 1; i < report_brand.length; i++) {
							data.addColumn('number', report_brand[i])
						}
						console.log(report2)
						for (let i = 0; i < report2.length; i++) {
							data.addRow(report2[i]);
						}
						var options = {
							chart: {
								title: 'Thống kê 5 thương hiệu có doanh thu cao nhất ',
								subtitle: '2021 , 2022',
							},

						};

						var chart = new google.charts.Bar(document.getElementById('chart_div_brand'));

						chart.draw(data, google.charts.Bar.convertOptions(options));
						//load table theo brand
						google.charts.load('current', { 'packages': ['table'] });
						google.charts.setOnLoadCallback(drawTableBrand);

						function drawTableBrand() {


							var table = new google.visualization.Table(document.getElementById('table_div_brand'));


							table.draw(data, { showRowNumber: true, width: '100%', height: '100%' });
						}


					}, 1)
				}

			});
		});


		//load bieu do category
		$http.get(`/rest/reports/revenue/${$scope.month}`).then(resp => {
			$scope.revenue = resp.data;

			for (let i = 0; i < $scope.revenue.length; i++) {
				report.push([$scope.revenue[i].name, $scope.revenue[i].sum]);

			}
			google.charts.load('current', { 'packages': ['bar'] });
			google.charts.setOnLoadCallback(drawStuff);

			function drawStuff() {

				data = new google.visualization.arrayToDataTable([
					['Tên loại danh mục', 'Doanh thu'],
					report[0],


				])
				for (let i = 0; i < report.length - 1; i++) {
					data.addRow(report[i + 1]);
				}

				console.log(data)

				var options = {
					width: 800,
					legend: { position: 'none' },
					chart: {
						title: 'Doanh thu các loại danh mục ',
						subtitle: 'popularity by percentage'
					},
					axes: {
						x: {
							0: { side: 'top', label: 'White to move' } // Top x-axis.
						}
					},
					bar: { groupWidth: "90%" }
				};

				var chart = new google.charts.Bar(document.getElementById('top_x_div'));
				// Convert the Classic options to Material options.
				chart.draw(data, google.charts.Bar.convertOptions(options));
				//load table doanh thu danh mục
				google.charts.load('current', { 'packages': ['table'] });
				google.charts.setOnLoadCallback(drawTableCate);

				function drawTableCate() {


					var table = new google.visualization.Table(document.getElementById('table_div_category'));

					table.draw(data, { allowHtml: true, showRowNumber: true, width: '100%', height: '100%' });
				}
			};
		});

		//load bieu do don hang theo khach hang
		$http.get('/rest/reports/revenue/customer').then(resp => {
			$scope.customer = resp.data;
			console.log($scope.customer)
			google.charts.load('current', { 'packages': ['corechart', 'controls'] });
			google.charts.setOnLoadCallback(drawDashboard);
			function drawDashboard() {

				// Create our data table.
				var data = google.visualization.arrayToDataTable([
					['Tên khách hàng', 'Số đơn hàng'],
					[$scope.customer[0].name, $scope.customer[0].count]
				]);
				for (let i = 1; i < $scope.customer.length; i++) {
					data.addRow([$scope.customer[i].name, $scope.customer[i].count])
				}
				// Create a dashboard.
				var dashboard = new google.visualization.Dashboard(
					document.getElementById('dashboard_div'));

				// Create a range slider, passing some options
				var donutRangeSlider = new google.visualization.ControlWrapper({
					'controlType': 'NumberRangeFilter',
					'containerId': 'filter_div',
					'options': {
						'filterColumnLabel': 'Số đơn hàng'
					}
				});

				// Create a pie chart, passing some options
				var pieChart = new google.visualization.ChartWrapper({
					'chartType': 'PieChart',
					'containerId': 'chart_div',
					'options': {
						'width': 700,
						'height': 400,
						'pieSliceText': 'value',
						'legend': 'right'
					}
				});

				// Establish dependencies, declaring that 'filter' drives 'pieChart',
				// so that the pie chart will only display entries that are let through
				// given the chosen slider range.
				dashboard.bind(donutRangeSlider, pieChart);

				// Draw the dashboard.
				dashboard.draw(data);
				//load table theo khach hang
				google.charts.load('current', { 'packages': ['table'] });
				google.charts.setOnLoadCallback(drawTable);

				function drawTable() {


					var table = new google.visualization.Table(document.getElementById('table_div_cus'));


					table.draw(data, { showRowNumber: true, width: '100%', height: '100%' });
				}

			}

		});
	}
	$scope.change = function(item) {
		if (item != null) {
			$scope.id = item;
			$scope.chartProduct = null;
			$http.get(`/rest/categories/listChildByParent/${item.id}`).then(resp => {
				$scope.cates_child = resp.data;
			});

			$http.get(`/rest/reports/revenue/parentid/${item.id}/${$scope.month}`).then(resp => {
				$scope.revenueParent = resp.data;
				console.log($scope.revenueParent)
				report.length = 0;
				for (let i = 0; i < $scope.revenueParent.length; i++) {
					report.push([$scope.revenueParent[i].name, $scope.revenueParent[i].sum]);

				}
				if ($scope.revenueParent.length == 0) {
					report.push(['Không có doanh thu', 0])
				}
				google.charts.load('current', { 'packages': ['bar'] });
				google.charts.setOnLoadCallback(drawStuff);

				function drawStuff() {

					data = new google.visualization.arrayToDataTable([
						['Danh mục', 'Doanh thu'],
						report[0]
					])
					for (let i = 0; i < report.length - 1; i++) {
						data.addRow(report[i + 1]);
					}
					var options = {
						width: 800,
						legend: { position: 'none' },
						chart: {
							title: 'Doanh thu ' + item.name,
							subtitle: 'popularity by percentage'
						},
						axes: {
							x: {
								0: { side: 'top', label: 'White to move' } // Top x-axis.
							}
						},
						bar: { groupWidth: "90%" }
					};

					var chart = new google.charts.Bar(document.getElementById('top_x_div'));
					// Convert the Classic options to Material options.
					chart.draw(data, google.charts.Bar.convertOptions(options));
					//load table doanh thu danh mục
					google.charts.load('current', { 'packages': ['table'] });
					google.charts.setOnLoadCallback(drawTableCate);

					function drawTableCate() {


						var table = new google.visualization.Table(document.getElementById('table_div_category'));

						table.draw(data, { allowHtml: true, showRowNumber: true, width: '100%', height: '100%' });
					}
				};
			});



		} else {
			$scope.id = null;
			report.length = 0;
			$scope.cates_child = [];
			for (let i = 0; i < $scope.revenue.length; i++) {
				report.push([$scope.revenue[i].name, $scope.revenue[i].sum]);

			}

			google.charts.load('current', { 'packages': ['bar'] });
			google.charts.setOnLoadCallback(drawStuff);

			function drawStuff() {

				data = new google.visualization.arrayToDataTable([
					['Loại Danh mục', 'Doanh thu'],
					report[0],
				])
				for (let i = 0; i < report.length - 1; i++) {
					data.addRow(report[i + 1]);
				}
				var options = {
					width: 800,
					legend: { position: 'none' },
					chart: {
						title: 'Doanh thu các loại danh mục',
						subtitle: 'popularity by percentage'
					},
					axes: {
						x: {
							0: { side: 'top', label: 'White to move' } // Top x-axis.
						}
					},
					bar: { groupWidth: "90%" }
				};

				var chart = new google.charts.Bar(document.getElementById('top_x_div'));
				// Convert the Classic options to Material options.
				chart.draw(data, google.charts.Bar.convertOptions(options));
				//load table doanh thu danh mục
				google.charts.load('current', { 'packages': ['table'] });
				google.charts.setOnLoadCallback(drawTableCate);

				function drawTableCate() {


					var table = new google.visualization.Table(document.getElementById('table_div_category'));

					table.draw(data, { allowHtml: true, showRowNumber: true, width: '100%', height: '100%' });
				}
			};
		}


	}

	$scope.changeChild = function(item) {
		if (item != null) {
			$scope.charProduct = 1;
			$http.get(`/rest/reports/revenue/categoryid/${item.id}/${$scope.month}`).then(resp => {
				$scope.product = resp.data;
				console.log($scope.product)
				report_product.length = 0;
				for (let i = 0; i < $scope.product.length; i++) {
					report_product.push([$scope.product[i].name, $scope.product[i].sum]);

				}
				if ($scope.product.length == 0) {
					report_product.push(['Không có doanh thu', 0])
				}
				google.charts.load('current', { 'packages': ['bar'] });
				google.charts.setOnLoadCallback(drawStuff);

				function drawStuff() {
					var data = new google.visualization.arrayToDataTable([
						['Sản phẩm', 'Doanh thu sản phẩm'],
						report_product[0]
					]);
					for (let i = 0; i < report_product.length - 1; i++) {
						data.addRow(report_product[i + 1]);
					}
					var options = {
						title: 'Chess opening moves',
						width: 900,
						legend: { position: 'none' },
						chart: {
							title: 'Doanh thu ' + $scope.id.name + ' | ' + item.name,
							subtitle: 'popularity by percentage'
						},
						bars: 'horizontal', // Required for Material Bar Charts.
						axes: {
							x: {
								0: { side: 'top', label: 'Percentage' } // Top x-axis.
							}
						},
						bar: { groupWidth: "90%" }
					};

					var chart = new google.charts.Bar(document.getElementById('top_x_div_product'));
					chart.draw(data, options);
					//load table doanh thu danh mục
					google.charts.load('current', { 'packages': ['table'] });
					google.charts.setOnLoadCallback(drawTableCate);

					function drawTableCate() {


						var table = new google.visualization.Table(document.getElementById('table_div_category'));

						table.draw(data, { allowHtml: true, showRowNumber: true, width: '100%', height: '100%' });
					}
				};
			});
		} else {

			$scope.charProduct = null;
			$http.get(`/rest/reports/revenue/parentid/${$scope.id.id}/${$scope.month}`).then(resp => {
				$scope.revenueParent = resp.data;
				console.log($scope.revenueParent)
				report.length = 0;
				for (let i = 0; i < $scope.revenueParent.length; i++) {
					report.push([$scope.revenueParent[i].name, $scope.revenueParent[i].sum]);

				}
				if ($scope.revenueParent.length == 0) {
					report.push(['Không có', 0])
				}
				google.charts.load('current', { 'packages': ['bar'] });
				google.charts.setOnLoadCallback(drawStuff);

				function drawStuff() {

					data = new google.visualization.arrayToDataTable([
						['Danh mục', 'Doanh thu '],
						report[0]
					])
					for (let i = 0; i < report.length - 1; i++) {
						data.addRow(report[i + 1]);
					}
					var options = {
						width: 800,
						legend: { position: 'none' },
						chart: {
							title: 'Doanh thu ' + $scope.id.name,
							subtitle: 'popularity by percentage'
						},
						axes: {
							x: {
								0: { side: 'top', label: 'White to move' } // Top x-axis.
							}
						},
						bar: { groupWidth: "90%" }
					};

					var chart = new google.charts.Bar(document.getElementById('top_x_div'));
					// Convert the Classic options to Material options.
					chart.draw(data, google.charts.Bar.convertOptions(options));
					//load table doanh thu danh mục
					google.charts.load('current', { 'packages': ['table'] });
					google.charts.setOnLoadCallback(drawTableCate);

					function drawTableCate() {


						var table = new google.visualization.Table(document.getElementById('table_div_category'));

						table.draw(data, { allowHtml: true, showRowNumber: true, width: '100%', height: '100%' });
					}
				};
			});
		}
	}

	$scope.changeMonth = function(item, itemParent, itemChild) {
		if (item != null) {
			$scope.month = item;
		} else {
			$scope.month = 'Full'
		}
		if (itemParent == null) {
			$http.get(`/rest/reports/revenue/${$scope.month}`).then(resp => {
				$scope.revenue = resp.data;
				console.log($scope.revenue)
				report.length = 0
				for (let i = 0; i < $scope.revenue.length; i++) {
					report.push([$scope.revenue[i].name, $scope.revenue[i].sum]);

				}

				if ($scope.revenue.length == 0) {
					report.push(['Không có', 0])
				}
				google.charts.load('current', { 'packages': ['bar'] });
				google.charts.setOnLoadCallback(drawStuff);

				function drawStuff() {

					data = new google.visualization.arrayToDataTable([
						['Move', 'Doanh thu'],
						report[0],


					])
					for (let i = 0; i < report.length - 1; i++) {
						data.addRow(report[i + 1]);
					}

					console.log(data)

					var options = {
						width: 800,
						legend: { position: 'none' },
						chart: {
							title: 'Doanh thu các loại danh mục' + '|| Tháng ' + $scope.month,
							subtitle: 'popularity by percentage'
						},
						axes: {
							x: {
								0: { side: 'top', label: 'White to move' } // Top x-axis.
							}
						},
						bar: { groupWidth: "90%" }
					};

					var chart = new google.charts.Bar(document.getElementById('top_x_div'));
					// Convert the Classic options to Material options.
					chart.draw(data, google.charts.Bar.convertOptions(options));
				};

			});

		} else {
			if (itemChild == null) {
				$scope.id = itemParent;
				$scope.chartProduct = null;
				$http.get(`/rest/categories/listChildByParent/${itemParent.id}`).then(resp => {
					$scope.cates_child = resp.data;
				});

				$http.get(`/rest/reports/revenue/parentid/${itemParent.id}/${$scope.month}`).then(resp => {
					$scope.revenueParent = resp.data;
					console.log($scope.revenueParent)
					report.length = 0;
					for (let i = 0; i < $scope.revenueParent.length; i++) {
						report.push([$scope.revenueParent[i].name, $scope.revenueParent[i].sum]);

					}
					if ($scope.revenueParent.length == 0) {
						report.push(['Không có doanh thu', 0])
					}
					google.charts.load('current', { 'packages': ['bar'] });
					google.charts.setOnLoadCallback(drawStuff);

					function drawStuff() {

						data = new google.visualization.arrayToDataTable([
							['Move', 'Doanh thu'],
							report[0]
						])
						for (let i = 0; i < report.length - 1; i++) {
							data.addRow(report[i + 1]);
						}
						var options = {
							width: 800,
							legend: { position: 'none' },
							chart: {
								title: 'Doanh thu ' + itemParent.name + ' | ' + ' | Tháng ' + $scope.month,
								subtitle: 'popularity by percentage'
							},
							axes: {
								x: {
									0: { side: 'top', label: 'White to move' } // Top x-axis.
								}
							},
							bar: { groupWidth: "90%" }
						};

						var chart = new google.charts.Bar(document.getElementById('top_x_div'));
						// Convert the Classic options to Material options.
						chart.draw(data, google.charts.Bar.convertOptions(options));
					};
				});
			} else {
				$scope.id = itemParent;
				$scope.charProduct = 1;
				$http.get(`/rest/reports/revenue/categoryid/${itemChild.id}/${$scope.month}`).then(resp => {
					$scope.product = resp.data;
					console.log($scope.product)
					report_product.length = 0;
					for (let i = 0; i < $scope.product.length; i++) {
						report_product.push([$scope.product[i].name, $scope.product[i].sum]);

					}
					if ($scope.product.length == 0) {
						report_product.push(['Không có doanh thu', 0])
					}
					google.charts.load('current', { 'packages': ['bar'] });
					google.charts.setOnLoadCallback(drawStuff);

					function drawStuff() {
						var data = new google.visualization.arrayToDataTable([
							['Opening Move', 'Doanh thu sản phẩm'],
							report_product[0]
						]);
						for (let i = 0; i < report_product.length - 1; i++) {
							data.addRow(report_product[i + 1]);
						}
						var options = {
							title: 'Chess opening moves',
							width: 900,
							legend: { position: 'none' },
							chart: {
								title: 'Doanh thu ' + itemParent.name + ' | ' + itemChild.name + ' | Tháng ' + $scope.month,
								subtitle: 'popularity by percentage'
							},
							bars: 'horizontal', // Required for Material Bar Charts.
							axes: {
								x: {
									0: { side: 'top', label: 'Percentage' } // Top x-axis.
								}
							},
							bar: { groupWidth: "90%" }
						};

						var chart = new google.charts.Bar(document.getElementById('top_x_div_product'));
						chart.draw(data, options);
					};
				});
			}
		}


	}


	$scope.initialize();

})