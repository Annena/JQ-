$(function () {
	
	// 微信支付宝设置

		// // 定义状态参数 0:正常，1：下架，默认是0显示正常c列表
  //       var payStatus = 0;
  //       // 从缓存中得到用户是否有添加修改权限
  //       var perIsEdit = Cache.get('perIsEdit');
  //       // 数据
  //       var payData;

		// var PayWayManage = {

		// 	init: function () {
		// 		// 判断如果等于undefined说明没有添加修改权限
		// 		if (perIsEdit['微信支付修改'] == undefined) {
		// 			$('#permissions').addClass('hide');
		// 		} else {
		// 			$('#permissions').removeClass('hide');
		// 		}
		// 		// 显示数据
		// 		this.PayWayData(payStatus);
		// 		// 绑定点击事件
		// 		this.PayWayBind();
		// 	},

		// 	// 显示数据 正常
		// 	PayWayData: function (payStatus) {
		// 		// 显示数据之前先清空列表数据
		// 		$('#paynormal').html('');
		// 		var self = this;
  //               setAjax(AdminUrl.payTypeWxpay, {
                	
  //               }, $('#prompt-message'), {20: ''}, function(respnoseText) {
		// 			// 得到返回数据
  //                   payData = respnoseText.data;
  //                   self.PayWayList(payData);
  //               }, 1);
		// 	},

		// 	// 显示数据
		// 	PayWayList: function (data) {
		// 		$('#app_id').text(data.app_id);
		// 		$('#app_secret').text(data.app_secret);
		// 		$('#mch_id').text(data.mch_id);
		// 		// 商户启用状态is_shop_weixin，总部启用状态is_weixin
		// 		var is_wxpay = '';
		// 		if (data.is_wxpay == 0) {
		// 			is_wxpay = '未启用';
		// 			$('#permissions').removeClass('hide');
		// 		} else {
		// 			is_wxpay = '已启用';
		// 			$('#permissions').addClass('hide');
		// 		}
		// 		$('#is_wxpay').text(is_wxpay);
		// 	},

		// 	// 绑定点击事件
		// 	PayWayBind: function () {

		// 		// 点击修改
		// 		var _self = this;
		// 		// 点击修改设置
		// 		$('#consumebtn').unbind('click').bind('click', function () {
		// 			Cache.set('totalpaymentData', payData);
		// 			window.location.replace('paymentEdit.html?stat='+payStatus);
		// 		});

		// 		// 点击微信
		// 		$('#normal').unbind('click').bind('click', function () {
		// 			$('paynormal').removeClass('hide');
		// 			$('payshelves').addClass('hide');
		// 			$('#shelves').removeClass('caipin-fenleicheck');
		// 			$('#shelves').addClass('caipin-fenleinucheck');
		// 			$('#normal').addClass('caipin-fenleicheck');
		// 			$('#normal').removeClass('caipin-fenleinucheck');
		// 			_self.PayWayData(0);
		// 			payStatus = 0;
		// 		});
		// 		// 点击支付宝
		// 		$('#shelves').unbind('click').bind('click', function () {
		// 			$('paynormal').addClass('hide');
		// 			$('#shelves').addClass('caipin-fenleicheck');
		// 			$('#shelves').removeClass('caipin-fenleinucheck');
		// 			$('#normal').removeClass('caipin-fenleicheck');
		// 			$('#normal').addClass('caipin-fenleinucheck');
					
		// 			_self.PayWayData(1);

		// 			payStatus = 1;
		// 		});

		// 	} 
		// }

		// PayWayManage.init();


		// 定义状态参数 0:正常，1：下架，默认是0显示正常c列表
        var payStatus = 0;
        // 从缓存中得到用户是否有添加修改权限
        var perIsEdit = Cache.get('perIsEdit');
        // 数据
        var payData;

		var newPayWayManage = {
			// 新的初始化
			newInit: function () {
				// 判断如果等于undefined说明没有添加修改权限

				// 新增  修改权限  应该都有  ？
				if (perIsEdit['微信支付修改'] == undefined) { 
					$('#permissions').addClass('hide');
				} else {
					$('#permissions').removeClass('hide');
				}
				if (perIsEdit['支付宝支付修改'] == undefined) { 
					$('#permissions').addClass('hide');
				} else {
					$('#permissions').removeClass('hide');
				}
				// 不显示修改按钮
				$('#permissions').addClass('hide');
				// 显示数据
				this.newPayWayData(payStatus,0); //初始化  微信数据
				// 绑定点击事件
				this.newPayWayBind();
			},

			// 新的显示数据 正常
			// type 0微信  1支付宝		
			newPayWayData: function (payStatus,type) {
				// 显示数据之前先清空列表数据
				$('#paynormal').html('');// ????  微信 支付宝  两个接口？
				var _self = this;
				if (type == 0) {
					setAjax(AdminUrl.payTypeWxpay, {}, $('#prompt-message'), {20: ''}, function(respnoseText) {
						// 得到返回数据
	                    payData = respnoseText.data;
	                    _self.newPayWayList(payData,0);
	                    // console.log('请求微信接口');
	                    // console.log('微信',payData);
	                }, 1);
				} else {
					setAjax(AdminUrl.payTypeAlipay, {}, $('#prompt-message'), {20: ''}, function(respnoseText) {
						// 得到返回数据
	                    payData = respnoseText.data;
	                    _self.newPayWayList(payData,1);
	                }, 1);
				}
			},

			// 新的显示数据   
			// type  0 微信  1 支付宝
			newPayWayList: function (data,type) {
				var content = '';
				if (type == 0) {
					// 商户启用状态is_shop_weixin，总部启用状态is_weixin
					var is_wxpay = '';
					if (data.is_wxpay == 0) {
					 	is_wxpay = '未启用';
					 	$('#permissions').removeClass('hide');
					} else {
					 	is_wxpay = '已启用';
					 	$('#permissions').addClass('hide');
					}
					// 微信内容
					content =  '<li class="clearfix">'+
				                    '<div class="nav-content-title list_tip">APP ID：</div>'+
				                    '<div id="app_id">'+data.app_id+'</div>'+
				                '</li>'+
				                '<li class="clearfix">'+
				                    '<div class="nav-content-title list_tip">APP密钥：</div>'+
				                    '<div id="app_secret">'+data.app_secret+'</div>'+
				                '</li>'+
				                '<li class="clearfix">'+
				                    '<div class="nav-content-title list_tip">微信支付商户号：</div>'+
				                    '<div id="mch_id">'+data.mch_id+'</div>'+
				                '</li>'+
				                '<li class="clearfix">'+
				                    '<div class="nav-content-title list_tip">启用状态：</div>'+
				                    '<div id="is_wxpay">'+is_wxpay+'</div>'+
				                '</li>';		 			
				} else {
					// 商户启用状态is_shop_ali，总部启用状态is_ali
					var is_alipay = '';
					if (data.is_alipay == 0) {
					 	is_alipay = '未启用';
						$('#permissions').removeClass('hide');
					} else {
					 	is_alipay = '已启用';
						$('#permissions').addClass('hide');
					}
					// 内容  支付宝内容未定
					content =   '<li class="clearfix">'+
				                    '<div class="nav-content-title list_tip">APP ID：</div>'+
				                    '<div id="app_id">'+data.app_id+'</div>'+
				                '</li>'+
				                '<li class="clearfix">'+
				                    '<div class="nav-content-title list_tip">收款账号ID：</div>'+
				                    '<div id="seller_id">'+data.seller_id+'</div>'+
				                '</li>'+
				                '<li class="clearfix">'+
				                    '<div class="nav-content-title list_tip">收款账号邮箱：</div>'+
				                    '<div id="seller_email">'+data.seller_email+'</div>'+
				                '</li>'+
				                '<li class="clearfix">'+
				                    '<div class="nav-content-title list_tip">支付宝公钥：</div>'+
				                    '<div id="alipay_public_key"  style="max-width:1000px;margin-left:140px;line-height:16px;word-break:break-all;margin-bottom:15px;">'+data.alipay_public_key+'</div>'+
				                '</li>'+
				                '<li class="clearfix">'+
				                    '<div class="nav-content-title list_tip">开发者私钥：</div>'+
				                    '<div id="app_private_key" style="max-width:1000px;margin-left:140px;line-height:16px;word-break:break-all;margin-bottom:15px;">'+data.app_private_key+'</div>'+
				                '</li>'+
				                '<li class="clearfix">'+
				                    '<div class="nav-content-title list_tip">启用状态：</div>'+
				                    '<div id="is_wxpay">'+is_alipay+'</div>'+
				                '</li>';		
				}
				$('.nav-content').html(content);
			},
			// 绑定点击事件
			newPayWayBind: function () {

				// 点击修改
				var _self = this;
				// 点击修改设置
				$('#consumebtn').unbind('click').bind('click', function () {
					// 点击设置 将支付设置data数据  放入缓存
					Cache.set('totalpaymentData', payData);
					window.location.replace('paymentEdit.html?stat='+payStatus);
				});

				// 点击微信
				$('#normal').unbind('click').bind('click', function () {
					$('paynormal').removeClass('hide');
					$('payshelves').addClass('hide');
					$('#shelves').removeClass('caipin-fenleicheck');
					$('#shelves').addClass('caipin-fenleinucheck');
					$('#normal').addClass('caipin-fenleicheck');
					$('#normal').removeClass('caipin-fenleinucheck');

					_self.newPayWayData(payStatus,0);

					payStatus = 0;
				});
				// 点击支付宝
				$('#shelves').unbind('click').bind('click', function () {
					$('paynormal').addClass('hide');
					$('#shelves').addClass('caipin-fenleicheck');
					$('#shelves').removeClass('caipin-fenleinucheck');
					$('#normal').removeClass('caipin-fenleicheck');
					$('#normal').addClass('caipin-fenleinucheck');
					
					_self.newPayWayData(payStatus,1);


					payStatus = 1;
				});

			} 
		}

		newPayWayManage.newInit();

});
