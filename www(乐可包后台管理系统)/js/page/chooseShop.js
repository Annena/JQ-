$(function () {

	// 登录之后的页面，选择店铺chooseShop

			// 显示基本数据
			ChooseShopList();
			// 绑定点击事件
			ChooseShopBind();


			// 显示基本数据
			function ChooseShopList () {

				// 用来区分壳子上，到这个中间页面之后可以调用登录
				if ($.cookie('card_shell') == 1) {
					$.cookie('return_2_2', 0, { path: '/html', domain: '.lekabao.net' });
					// 如果是壳子不显示退出登录按钮
					$('#exit-system,#admin_header').addClass('hide');
				} else {
				    $('#exit-system,#admin_header').removeClass('hide');
				}
				var cardName = $.cookie('cardName');
				// 商户名称
				$('#cardName').text(cardName);
				// 从cookie中取出用户真实姓名和手机号
				var aUserName = $.cookie("a_user_name");
				var aUserMobile = $.cookie("a_user_mobile");
				
				// 真实姓名 decodeURIComponent() 对编码后的 URI 进行解码
                $('#userName').text(aUserName == undefined ? '' : decodeURIComponent(aUserName));
                // 手机号
                //$('#userMobile').text(aUserMobile == undefined ? '' : decodeURIComponent(aUserMobile));

                setAjax(AdminUrl.userPermit, {}, $('#prompt-message'), {20: '', 205133: '', 405101: '',205103: ''}, function(respnoseText) {
                	// alert(respnoseText.data +'==='+ respnoseText.code )
					if (respnoseText.code == 205133) {// 只有一个总部，跳转总部
						$.cookie('jump_link', 1, {path:'/html',domain:'.lekabao.net'});
						$.cookie('is_shop', 0);
						if ($.cookie('card_shell') == 1) {
							$.cookie('return_2_2', 1, { path: '/html', domain: '.lekabao.net' });
						}
						$.cookie('admin_select', 0, { path: '/html', domain: '.lekabao.net' });
						// 这个时候说明只要一个总部，则直接跳转请求获取左侧列表接口
						window.location.replace('./total/index.html?v='+version+'');
			    	} else if (respnoseText.code == 205103) {// 只有一个门店跳转门店
			    		$.cookie('jump_link', 2, {path:'/html',domain:'.lekabao.net'});
			    		$.cookie('is_shop', 1);
						if ($.cookie('card_shell') == 1) {
							$.cookie('return_2_2', 1, { path: '/html', domain: '.lekabao.net' });
						}
						$.cookie('admin_select', 0, { path: '/html', domain: '.lekabao.net' });
						// 这个时候说明只要一个店铺，则直接跳转请求获取左侧列表接口
						window.location.replace('./shop/index.html?v='+version+'');
					} else if (respnoseText.code == 20) {
						$.cookie('admin_select', 1, { path: '/html', domain: '.lekabao.net' });
						$.cookie('jump_link', 3, {path:'/html',domain:'.lekabao.net'});
						// 得到返回数据
	                    var data = respnoseText.data;
	                    // 获取到数据
	                    ChooseShopInfo(data);
					} else {
						displayMsg(ndPromptMsg, respnoseText.message, 2000);
					}
                }, 0);
			}

			// 获取到数据
			function ChooseShopInfo (data) {
				// 总部内容
				var allContent = '';
				// 门店内容
				var content = '';
				// 门店是否正常，0：正常，1：不正常,正常显示并且可点击，不正常显示灰色并且不可点击
				var shopStatus = '';
				// 循环所有数据
				for (var i in data) {
					//var dd = data[i].shop_name;
					if (data[i].indexOf('总部') != -1) {
						allContent += '<li class="shopbor" shop-id="'+i+'">'+
										'<div class="shoplogo">'+
											'<img src="../img/base/store-true.png">'+
										'</div>'+
										'<div class="shoplogo-txt">总部</div>'+
									  '</li>';
					} else {
					content += '<li class="shopbor" shop-id="'+i+'">'+
									'<div class="shoplogo">'+
										'<img src="../img/base/shop-true.png"  width="50" height="50">'+
									'</div>'+
									'<div class="shoplogo-txt">'+data[i]+'</div>'+
								'</li>';
					}
				}
				// 将门店和总部填充
				$('#allContent').html(allContent);
				$('#content').html(content);
			}

			// 绑定点击事件
			function ChooseShopBind () {
				var self = this;
				//alert(self.business);
				// 点击总部
				$('#allContent').delegate('li', 'click', function() {
					// 获取到店铺id
					var shopid = $(this).attr('shop-id');
					//var eve = $(e.target).attr('data-type');
	                // 跳转并且把id传过去

					setAjax(AdminUrl.userShop, {
						'shop_id':shopid
	                }, $('#prompt-message'), {20: ''}, function(respnoseText) {
						if (respnoseText.code == 20) {
							if ($.cookie('card_shell') == 1) {
								$.cookie('return_2_2', 1, { path: '/html', domain: '.lekabao.net' });
							}
							$.cookie('jump_link', 1, {path:'/html',domain:'.lekabao.net'});
							$.cookie('is_shop', 0);
							window.location.replace('./total/index.html?v='+version+'');
						} else {
							displayMsg(ndPromptMsg, respnoseText.message, 2000);
						}
	                }, 0);
	            });

				// 点击门店
				$('#content').delegate('li', 'click', function() {
					// 获取到店铺id
					var shopid = $(this).attr('shop-id');
					//var eve = $(e.target).attr('data-type');
	                // 跳转并且把id传过去

		            setAjax(AdminUrl.userShop, {
		            	'shop_id':shopid
	                }, $('#prompt-message'), {20: ''}, function(respnoseText) {
						if (respnoseText.code == 20) {
							if ($.cookie('card_shell') == 1) {
								$.cookie('return_2_2', 1, { path: '/html', domain: '.lekabao.net' });
							}
							$.cookie('jump_link', 2, {path:'/html',domain:'.lekabao.net'});
							$.cookie('is_shop', 1);
							window.location.replace('./shop/index.html?v='+version+'');
						} else {
							displayMsg(ndPromptMsg, respnoseText.message, 2000);
						}
	                }, 0);
	            });
	            $('#exit').html('<a href="../html/loginEdit.html" "target="main">修改密码</a>');

	            $('#userName').click(function(){
					$('#exit').toggle();
                });

                $('#downopen').click(function(){
					$('#exit').toggle();
                });
			}


});
