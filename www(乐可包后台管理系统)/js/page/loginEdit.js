$(function () {

	// 修改密码loginEdit
		var LoginEditPage = {

			init: function () {
				// 绑定点击事件
				this.loginBind();
			},

			// 绑定点击事件
			loginBind: function () {
				var self = this;
				// 点击确定按钮
				$('#consumebtn').unbind('click').bind('click', function () {
					// 提交数据
					self.loginSubmit();
				});

				// 点击取消
                $('#exitbtn').unbind('click').bind('click', function () {
                    window.location.replace('../html/index-select.html');
                });
			},

			// 提交数据
			loginSubmit: function () {
				// 原密码
				var password = $('#password').val();
				// 新密码
				var pwdNew = $('#pwdNew').val();
				// 重复新密码
				var pwdRepeat = $('#pwdRepeat').val();
				var ua = navigator.userAgent.toLowerCase();  //判断是否是ipad

				// 效验数据通过才能修改
				if (this.dataCheck()) {
					// 修改
	                setAjax(AdminUrl.staffPwdUpdate, {
	                    'password': password,
	                    'pwd_new': pwdNew,
	                    'pwd_repeat': pwdRepeat
	                }, $('#prompt-message'), {20: ''}, function(respnoseText) {
	                	$.cookie('return_2', 2, {path:'/html',domain:'.lekabao.net'});
						// 修改成功退出登录，跳转到登录页面，重新登录

						if ($.cookie('card_shell') == 1) {
							if(ua.match(/iPad/i)=="ipad") {
							    window.top.location.href = 'http://cashier.lekabao.net/html/box_ipad.html?v='+version+'&return=2';
							} else {
							    window.top.location.href = 'http://cashier.lekabao.net/html/box.html?v='+version+'&return=2';
							}
						} else {
							window.top.location.href = 'index.html';
						}
	                }, 1);
				}


			},

			// 效验要修改的数据
			dataCheck: function () {
	            if ( dataTest('#password', '#prompt-message', { 'empty': '不能为空'})
	                && dataTest('#pwdNew', '#prompt-message', { 'empty': '不能为空'})
	                && dataTest('#pwdRepeat', '#prompt-message', { 'empty': '不能为空'})
	            ) {
	            	//alert('tt');
	                return true;
	            }

	            return false;
			}
		}

		LoginEditPage.init();

});