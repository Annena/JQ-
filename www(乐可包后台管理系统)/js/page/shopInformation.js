$(function () {


	// 门店后台，门店信息
		
        // 返回的数据
        var data;

		var InformationPage = {

			init: function () {
				// 显示数据
				this.InformationData();
				// 绑定点击事件
				this.InformationBind();
			},

			// 显示数据
			InformationData: function () {
				var self = this;
                setAjax(AdminUrl.shopShopInfo, {}, $('#prompt-message'), {20: ''}, function(respnoseText) {
					// 得到返回数据
                    data = respnoseText.data;
                    if (respnoseText.code == 20) {
						self.InformationList(data);
					} else {
						displayMsg(ndPromptMsg, respnoseText.message, 2000);
					}
                }, 0);
			},

			// 显示基本数据
			InformationList: function (data) {
				// 门店编号
				$('#shopDid').text(data.shop_did);
				// 公司名称
				$('#shopName').text(data.shop_name);
				// 存到cookie，员工身份添加修改用
				$.cookie('shop_name', data.shop_name);

				// 门店地址
				$('#address').text(data.shop_province+data.shop_city+data.shop_area+data.shop_addr);
				// 联系电话
				$('#shopTel').text(data.shop_tel);
				// 折扣卡
				$('#discountMax').text(data.discount_max+'%');
				// 营业时间
				$('#businessTime').text(data.open_time+'-'+data.close_time);

				// 是否自动设置折扣
				var isAutoMember = '否';
				if (data.is_auto_member == 0) {
					isAutoMember = '否';
				} else if (data.is_auto_member == 1) {
					isAutoMember = '是';
				}
				$('#isAutoMember').text(isAutoMember);

				//Cache.set('shop-shop_id',data.shop_id);
				$.cookie('shop-shop_id', data.shop_id);
				// 状态
				//$('#shopStatus').text(data.shop_status);
				
				// 是否支持实体卡的开关
				$.cookie('is_entity_card', data.is_entity_card, {path:'/html'});
				// 有效期控制年限
				$.cookie('entity_card_time', data.entity_card_time, {path:'/html'});
				if ($.cookie('card_shell') != 1) {
					var cookie_t = $.cookie('cookie_t');
					//alert(cookie_t.indexOf('账户支付'))
					if (cookie_t != undefined && cookie_t.indexOf('账户支付') > -1 && $.cookie('is_login') == 1) {//($.cookie('is_shop') == 1 || 
						var bus = location.href.split('//')[1].split('.')[0];
						//触发href连接
						window.location.href=ajax_php_ress+'/html/shop/storedAccountPay.html';
					}
				}
			},

			// 绑定点击事件
			InformationBind: function () {
				
				/*// 点击修改商户信息
				$('#consumebtn').unbind('click').bind('click', function () {
					//alert(data.company_name);
					Cache.set('totalInfoData',data);
					// 跳转到修改商户信息
					window.location.replace('informationEdit.html?n='+business);
				});*/
			} 
		}

		InformationPage.init();
});