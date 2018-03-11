$(function () {

		$('#exit').attr('style','display:none;');

	    // 区分是单商户还是多商户
	    var many_merchant = $.cookie('many_merchant');
	    // 是否单个总部或者单个门店
	    var admin_select = $.cookie('admin_select');
	    // 是否选了门店
	    var is_shop = $.cookie('is_shop');

		// 获取基础数据
		topList();
		
		// 获取基础数据
		function topList () {
			// 从cookie中取出用户真实姓名和手机号
			var aUserName = $.cookie("a_user_name");
			//var aUserMobile = $.cookie("a_user_mobile");
			var cardName = $.cookie('cardName');
			// 商户名称
			$('#cardName').text(cardName);
			$('#header-mercheant span').text(cardName);
			
			if (is_shop != 1) {
				$('#header-shop-select span').text('总部');
			} else {
				setTimeout(function () {
					$('#header-shop-select span').text($.cookie('shop_name'));
				}, 1000);
			}
			
			// 真实姓名 decodeURIComponent() 对编码后的 URI 进行解码
            $('#userName').text(aUserName == undefined ? '' : decodeURIComponent(aUserName));
            // 手机号
            //$('#userMobile').text(aUserMobile == undefined ? '' : decodeURIComponent(aUserMobile));
            $('#exit').html('<a href="../loginEdit.html" target="main">修改密码</a>');
            
            $('#userName').click(function(){
				$('#exit').toggle();
            });

            $('#exit').unbind('click').bind('click', function () {
				$('#exit').toggle();
            });

            $('#downopen').click(function(){
				$('#exit').toggle();
            });
            
			// 如果是壳子不显示退出登录按钮
			if ($.cookie('card_shell') == 1) {
			    $('#exit-system').addClass('hide');
			    // 如果在壳子里面打开，不显示自身的头部，否则显示，通过调用主要的frameset控制
			    window.parent.frames['frameset'].rows='0,*';
			} else {
			    $('#exit-system').removeClass('hide');
			    window.parent.frames['frameset'].rows='70,*';
			}

			// 选择跳转点击
			changeShop();
		}

	    // 选择跳转点击
	    function changeShop() {
	        // 点击跳到选择门店
	        $("#header-shop-select").off('click').on('click', 'span', function() {
	        	if (admin_select == 1) {
		            if ($.cookie('card_shell') == 1) {
		                window.parent.jump_shopstore_click();
		            } else {
		                window.top.location.href = '../index-select.html';
		            }
	        	}
	        });

	        // 点击跳到选择商户
	        $("#header-mercheant").off('click').on('click', 'span', function() {
	            if (many_merchant == 1) {
	                if ($.cookie('card_shell') == 1) {
	                    window.parent.jump_mercheant_click();
	                } else {
	                    window.top.location.href = '../chooseMerchant.html';
	                }
	            }
	        });
	    }

	
});