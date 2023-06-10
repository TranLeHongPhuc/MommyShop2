/**
 * 
 */
  app.controller("authority-ctrl",function($scope,$http,$location){
	$scope.roles=[];
	$scope.admins=[];
	$scope.authorities=[];
	
	$scope.initialize=function(){
		$http.get("/rest/roles").then(resp=>{
			$scope.roles=resp.data;
		})
		
		//load staff and director(administrator)
		$http.get("/rest/accounts?admin=true").then(resp=>{
			$scope.admins=resp.data;
		})
		
		//load authoritites of staff and director(administrator)
		$http.get("/rest/authorities").then(resp=>{
			$scope.authorities=resp.data;
			
		}).catch(error=>{
			$location.path("/unauthorized");
		})
	}
	
	$scope.authority_of=function(acc, role){
		if($scope.authorities){
			
			return $scope.authorities.find(ur => ur.account.id == acc.id && ur.role.id == role.id);
			
		}
	}
	
	$scope.authority_changed=function(acc, role){
		var authority= $scope.authority_of(acc, role)
		 
			if(authority){ //đã cấp quyền => thu hồi quyền (xóa)
			console.log(authority+"tao ne 3")
				$scope.revoke_authority(authority);
				 
			}
			else{ //chưa dc cấp quyền => cấp quyền (thêm mới)
				authority={account:acc, role:role};
				$scope.grant_authority(authority);
			}
	}
	//thêm mới authority
	$scope.grant_authority=function(authority){
		$http.post(`/rest/authorities`,authority).then(resp=>{
			$scope.authorities.push(resp.data)
			showSuccessToast('Cấp quyền sử dụng thành công! !');
		}).catch(error=>{
			showErrorToast('Cấp quyền sử dụng thất bại! !');
			console.log("Error",error);
		})
	}
	//xóa authority
	$scope.revoke_authority=function(authority){
		$http.delete(`/rest/authorities/${authority.id}`).then(resp=>{
			var index=$scope.authorities.findIndex(a => a.id== authority.id);
			$scope.authorities.splice(index,1);
			showSuccessToast('Thu hồi quyền sử dụng thành công !');
		}).catch(error=>{
			showErrorToast('Thu hồi quyền sử dụng thất bại !');
			console.log("Error",error);
		})
	}
	
	$scope.initialize();


	//phân trang
	$scope.pageSize = 5;
	$scope.changeSize = function (item) {
        $scope.pageSize = item;
        console.log($scope.pageSize);
        if (item == -1) {
            $scope.pageSize = ' '
        }
    }
});