$(function () {
	// 员工管理 --- 员工身份--修改添加身份

        // 获取到修改传过来的shop_id
		var statusId = getQueryString('status_id');
		// 获取到添加和修改传过来的
		var aUserIdADD = getQueryString('a_user_id');
		// 获取到修改传过来的缓存
		var dataPro = Cache.get('ideUp');
		// 判断是修改还是添加 0；添加，1：修改
		var addIsUp = 0;
		var a_user_organization =  Cache.get('a_user_organization');
		// 从cookie中获取门店名称
		var shopName =  decodeURIComponent($.cookie('shop_name'));
		// 从cookie中获取到门店id
		var shopIdPro = $.cookie('shop-shop_id');

		// 获取到传过来的员工姓名缓存
		var aUserNameIde = Cache.get('aUserNameIde');

		var EmployeesIdentityAdd = {

			init: function () {
				// 填充门店名称到页面
				$('#shopName').text(shopName);

				// 判断是修改还是添加
				if (statusId != null && statusId != undefined && dataPro != null && dataPro != undefined) {
					// 身份不可修改 
                    $('#statusList').attr('disabled','disabled');
					$('#addAndedit').text('身份修改');
					$('#statusList').addClass('nav-selectcheck');
					addIsUp = 1;
					// 显示数据
					this.EmployeesAddList(dataPro);
				} else {
					// 身份可修改，去除不可修改属性
                     $('#statusList').removeAttr('disabled');
					$('#addAndedit').text('身份添加');
					addIsUp = 0;
				}
				//alert(aUserNameIde);
				// 员工姓名 添加修改都显示，并且不能修改
				$('#aUserNameIde').val(aUserNameIde);
				$('#a_user_organization').text(a_user_organization)
				// 绑定点击事件
				this.EmployeesAddBind();
			},

			// 显示数据
			EmployeesAddList: function (data) {
				// 显示数据
				// 员工id
				//$('#aUserId').val(data.a_user_id);
				// 身份id
				$('#statusList').val(data.status_id);



				// 缓存中的数据取出之后删除
				Cache.del('ideUp');
			},

			//权限Ajax查询
        	selectDateMembers: function(id) {
            	var self = this;
            	setAjax(AdminUrl.staffStaffStatusPermList, {
                    'status_id': id
                },  $('#prompt-message'), { 20: '' }, function(respnoseText) {
                // 得到返回数据
                	var data = respnoseText.data;
                	if (respnoseText.code == 20) {
                    	nowData = data
                    	self.getPermData(data);
                	} else {
                    	displayMsgTime(ndPromptMsg, respnoseText.message, 2000);
                	}
            	}, 0);
        	},
			//查询该身份所拥有的权限
			getPermData : function(data){
				var content = '';
	
                    for(var key in data){
                    	//判断权限
                    	if(key == 'shop'){
                    		content += '<div class="powerShop"><div class="powerShop_t">'+'门店管理'+'</div>'+
                    		'<p>'+data[key].toString().replace(/,/g, '，')+'</p>'+'</div>'
                    	}
                    	if(key == 'cashier'){
                    		content += '<div class="powerCashier"><div class="powerCashier_t">'+'收银系统'+'</div>'+
                    		'<p>'+data[key].toString().replace(/,/g, '，')+'</p>'+'</div>'
                    	}
                    	if(key == 'admin'){
                    		content += '<div class="powerAdmin"><div class="powerAdmin_t">'+'总部管理'+'</div>'+
                    		'<p>'+data[key].toString().replace(/,/g, '，')+'</p>'+'</div>'
                    	}
                    	if(key == 'm_admin'){
                    		content += '<div class="powerM_Admin"><div class="powerM_Admin_t">'+'商户版'+'</div>'+
                    		'<p>'+data[key].toString().replace(/,/g, '，')+'</p>'+'</div>'
                    	}
                    	if(key == 'depot'){
                    		content += '<div class="powerSupplyChain"><div class="powerSupplyChain_t">'+'供应链'+'</div>'+
                    		'<p>'+data[key].toString().replace(/,/g, '，')+'</p>'+'</div>'
                    	}
                    	if(key == 'pos'){
                    		content += '<div class="powerPos"><div class="powerPos_t">'+'点菜宝'+'</div>'+
                    		'<p>'+data[key].toString().replace(/,/g, '，')+'</p>'+'</div>'
                    	}
                    	                  	                    	                    	                   	
                    }
                     $('#confirm').html(content); 
			},

			// 绑定点击事件
			EmployeesAddBind: function () {
				var _self = this;

				//查看权限
				$('#preInfor').unbind('click').bind('click',  function() {
					displayAlertMessage('#confirm-message','#cancel-confirm');
					//身份的id
					var statusListId = $('#statusList').val();
					if(statusList != undefined || statusList != '' || statusList != null){
						//权限名字确定
						$('#permName').text($('#statusList').find("option:selected").text())
						//查询并添加数据
						_self.selectDateMembers(statusListId);
					}
				});

				//查看权限中的取消图标和确认按钮
				$(' #other-logoin').unbind('click').bind('click',  function() {
					layer.close(layerBox);
				});

				// 点击修改
				$('#updatebtn').unbind('click').bind('click', function () {
					if (addIsUp == 0) {
						_self.employeesAdd();
					} else if (addIsUp == 1) {
						//_self.employeesUpdate(dataPro);
					}
				});

				// 点击取消
				$('#exitbtn').unbind('click').bind('click', function () {
					//Cache.set('aUserIdADD',aUserIdADD);
					window.location.replace('shopEmpIdentity.html?a_user_id='+aUserIdADD+'&is_select=1&type='+getQueryString('type'));
				});

				// 点击身份列表
				$('#empIdentitylist').unbind('click').bind('click', function () {
					window.location.replace('shopEmpIdentity.html?a_user_id='+aUserIdADD+'&is_select=1&type='+getQueryString('type'));
				});

				// 点击导航
				$('#selectJump').unbind('click').bind('click', function () {
					window.location.replace('shopEmployees.html?is_select=1&type='+getQueryString('type'));
				});

			},
			// 添加
			employeesAdd: function () {
				// 获取到各个数据，请求接口提交数据
				var self = this;
				// 身份id
				var statusList = $('#statusList').val();
				// 获取身份的名称
				var statusListPro = $('#statusList').find("option:selected").text();

                setAjax(AdminUrl.staffStaffStatusAdd, {
                    'a_user_id': aUserIdADD,
                    'status_id': statusList,
                    'shop_ids': 'all'
                }, $('#prompt-message'), {20: ''}, function(respnoseText) {
					if (respnoseText.code == 20) {
						displayMsg(ndPromptMsg, respnoseText.message, 2000, function () {
							// 得到返回数据
		                    var data = respnoseText.data;
		                    window.location.replace('shopEmpIdentity.html?a_user_id='+aUserIdADD+'&is_select=1&type='+getQueryString('type'));
		                });
					} else {
						displayMsg(ndPromptMsg, respnoseText.message, 2000);
					}
                }, 0);
			}

			// 修改
			/*employeesUpdate: function (data) {
				// 获取到各个数据，请求接口提交数据
				var self = this;

				// 员工id
				var aUserId = data.a_user_id;
				// 身份id
				var statusList = $('#statusList').val();
				// 获取身份的名称
				var statusListPro = $('#statusList').find("option:selected").text();

                setAjax(AdminUrl.staffStaffStatusUpdate, {
                    'a_user_id': aUserId,
                    'status_id': statusList,
                    'shop_ids': shopIdPro
                }, $('#prompt-message'), {20: ''}, function(respnoseText) {
					if (respnoseText.code == 20) {
						displayMsg(ndPromptMsg, respnoseText.message, 2000, function () {
							// 得到返回数据
		                    var data = respnoseText.data;
		                    window.location.replace('shopEmpIdentity.html?a_user_id='+aUserId);
		                });
					} else {
						displayMsg(ndPromptMsg, respnoseText.message, 2000);
					}
                }, 0);
			}*/

		}

		EmployeesIdentityAdd.init();

});

