$(function () {
	// 员工管理---添加修改员工


        // 获取到修改传过来的a_user_id
		var aUserId = getQueryString('a_user_id');
		// 获取到修改传过来的缓存
		var data = Cache.get('empUp');
		// 判断是修改还是添加 0；添加，1：修改
		var addIsUp = 0;

		// 从cookie中获取到门店id
		var shopIdPro = $.cookie('shop-shop_id');

		var EmployeesManageAdd = {

			init: function () {
				
				// 判断是修改还是添加
				if (aUserId != null && aUserId != undefined && data != null && data != undefined) {
					addIsUp = 1;
					// 修改不显示密码
					$('#passDisplay').addClass('hide');

					/*// 显示剩下的数据
					$('#morenpassword').addClass('hide');
					$('#aUserPass').attr("disabled","");
					$('#restbutton').removeClass('hide');*/
					// 修改显示状态
					$('#empDisplay').removeClass('hide');

					$('#addAndedit').text('员工修改');
					this.employeesData(data);
				} else {
					// 添加显示密码
					$('#passDisplay').removeClass('hide');
					addIsUp = 0;
					// 添加隐藏状态
					$('#empDisplay').addClass('hide');
					$('#addAndedit').text('员工添加');

				}
				// 绑定点击事件
				this.employeesAddBind();
			},


			// 显示基本数据
			employeesData: function (data) {
				// 显示数据
				
				// 登录名员工电话
				$('#aUserMobile').val(data.a_user_mobile);
				// 员工编号
				$('#aUserDid').val(data.a_user_did);
				// 员工姓名
				$('#aUserName').val(data.a_user_name);
				// 员工昵称
				$('#aUserNickname').val(data.a_user_nickname);

				// 状态
				var staffSt = data.staff_status;
				$('#statusList').val(staffSt);
				
				// 缓存中的数据取出之后删除
				Cache.del('empUp');
			},

			// 绑定点击事件
			employeesAddBind: function () {
				var _self = this;
				// 点击保存
				$('#updatebtn').unbind('click').bind('click', function () {
					if (addIsUp == 0) {
						_self.employeesAdd();
					} else if (addIsUp == 1) {
						_self.employeesUpdate();
					}
				});

				// 点击取消
				$('#exitbtn').unbind('click').bind('click', function () {
					// 跳转
					window.location.replace('shopEmployees.html?is_select=1&type='+getQueryString('type'));
				});

				// 点击导航
				$('#selectJump').unbind('click').bind('click', function () {
					window.location.replace('shopEmployees.html?is_select=1&type='+getQueryString('type'));
				});

				// 手机号变化的时候，密码为手机号后三位
				$('#aUserMobile').unbind('input').bind('input', function () {
					if ($(this).val().length >= 11) {
						$('#aUserPass').val($(this).val().substring($(this).val().length-3,$(this).val().length));
					} else {
						$('#aUserPass').val('');
					}
				});

				// 点击重置密码 
				/*$('#buttonpass').unbind('click').bind('click', function () {

					$('#morenpassword').removeClass('hide');
					$('#aUserPass').removeAttr("disabled"); 
					$('#restbutton').addClass('hide');
					// 调用随机生成密码方法
					var c = _self.randomWord(false, 6);

	                $('#aUserPass').val(c);         //把随机生成的数显示到页面的框里头

				});*/

			},


			//随机生成6位数字和字母 组成的密码
	        randomWord: function (randomFlag, min, max){
	            var str = "",
	            range = min,
	            // arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
	            arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
	         
	            // 随机产生
	            if(randomFlag){
	                range = Math.round(Math.random() * (max-min)) + min;
	            }

	            for(var i=0; i<range; i++){
	                pos = Math.round(Math.random() * (arr.length-1));
	                str += arr[pos];
	            }

	            return str;
	        },

			// 添加
			employeesAdd: function () {
				// 获取到各个数据，请求接口提交数据
				var self = this;

				// 登录名员工电话
				var aUserMobile = $('#aUserMobile').val();
				// 密码
				var aUserPass = $('#aUserPass').val();
				// 员工编号
				var aUserDid = $('#aUserDid').val();
				// 员工姓名
				var aUserName = $('#aUserName').val();
				// 员工昵称
				var aUserNickname = $('#aUserNickname').val();
				
				// 效验数据通过才能修改
				if (this.dataCheck()) {
	                setAjax(AdminUrl.staffStaffAdd, {
	                    'a_user_mobile': aUserMobile,
	                    'a_user_pass': aUserPass,
	                    'a_user_name': aUserName,
	                    'a_user_nickname': aUserNickname,
	                    'a_user_organization': shopIdPro,
	                    'a_user_did': aUserDid,
	                    'staff_status': 0
	                }, $('#prompt-message'), {20: ''}, function(respnoseText) {
	                	if (respnoseText.code == 20) {
	                		displayMsg(ndPromptMsg, respnoseText.message, 2000, function () {
								// 得到返回数据
			                    var data = respnoseText.data;
			                    window.location.replace('shopEmployees.html?is_select=1&type='+getQueryString('type'));
			                });
	                	} else {
	                		displayMsg(ndPromptMsg, respnoseText.message, 2000);
	                	}
	                }, 0);
	            }
			},

			// 修改
			employeesUpdate: function () {
				// 获取到各个数据，请求接口提交数据
				var self = this;
				// 登录名员工电话
				var aUserMobile = $('#aUserMobile').val();
				// 密码
				var aUserPass = $('#aUserPass').val();
				// 员工编号
				var aUserDid = $('#aUserDid').val();
				// 员工姓名
				var aUserName = $('#aUserName').val();
				// 员工昵称
				var aUserNickname = $('#aUserNickname').val();
				// 状态
				var statusList = $('#statusList').val();

				// 效验数据通过才能修改
				if (this.dataCheck()) {
	                setAjax(AdminUrl.staffStaffUpdate, {
	                	'a_user_id': aUserId,
	                    'a_user_mobile': aUserMobile,
	                    'a_user_pass': aUserPass,
	                    'a_user_name': aUserName,
	                    'a_user_nickname': aUserNickname,
	                    'a_user_organization': shopIdPro,
	                    'a_user_did': aUserDid,
	                    'staff_status': statusList
	                }, $('#prompt-message'), {20: ''}, function(respnoseText) {
	                	if (respnoseText.code == 20) {
	                		displayMsg(ndPromptMsg, respnoseText.message, 2000, function () {
								// 得到返回数据
			                    var data = respnoseText.data;
			                    window.location.replace('shopEmployees.html?is_select=1&type='+getQueryString('type'));
			                });
	                	} else {
	                		displayMsg(ndPromptMsg, respnoseText.message, 2000);
	                	}
	                }, 0);
	            }
			},

			// 效验要修改的数据
			dataCheck: function () {
	            if ( dataTest('#aUserMobile', '#prompt-message', { 'empty': '不能为空', 'mobileNumber': '电话号码不正确'})
	            	&& dataTest('#aUserName', '#prompt-message', { 'empty': '不能为空'})
	            ) {
	            	//alert('tt');
	                return true;
	            }
	            return false;
			}
		}

		EmployeesManageAdd.init();

});

