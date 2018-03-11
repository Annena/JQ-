$(function () {
	// 微信支付宝修改设置


  //       // 获取到修改传过来的shop_id
		// var stat = getQueryString('stat');
		// // 获取到修改传过来的缓存
		// var payData = Cache.get('totalpaymentData');
		// // 判断是修改还是添加 0；添加，1：修改
		// var addIsUp = 0;

		// var PayWayManageAdd = {

		// 	init: function () {
		// 		// 判断是修改还是添加
		// 		if (stat == 0)  {
		// 			$('#addAndedit').text('微信支付修改');
		// 		} else {
  //                   $('#addAndedit').text('支付宝支付修改');
		// 		}
		// 		// 显示数据
		// 		this.payWayManage(payData);
		// 		// 绑定点击事件
		// 		this.PayWayAddBind();
		// 	},

		// 	// 显示数据
		// 	payWayManage: function (data) {
		// 		// 显示数据
				
		// 		$('#app_id').val(data.app_id);
		// 		$('#app_secret').val(data.app_secret);
		// 		$('#mch_id').val(data.mch_id);
		// 	},

		// 	// 绑定点击事件
		// 	PayWayAddBind: function () {
		// 		var _self = this;
		// 		// 点击修改
		// 		$('#updatebtn').unbind('click').bind('click', function () {
		// 			_self.payWayManageUpdate();
		// 		});

		// 		// 点击取消
		// 		$('#exitbtn').unbind('click').bind('click', function () {
		// 			window.location.replace('paymentSettings.html');
		// 		});
		// 	},

		// 	// 修改
		// 	payWayManageUpdate: function () {
		// 		// 获取到各个数据，请求接口提交数据
		// 		var self = this;
				
		// 		var app_id = $('#app_id').val();
		// 		var app_secret = $('#app_secret').val();
		// 		var mch_id = $('#mch_id').val();

		// 		// 效验数据通过才能修改
		// 		if (this.dataCheck()) {

		// 			var rel = /^[0-9a-zA-Z]{18}$/;
		// 			if (!rel.test(app_id)) {
		// 				displayMsg(ndPromptMsg, 'APPID必须是十八位字母数字！', 2000);
		// 				return;
		// 			}
		// 			rel = /^[0-9a-zA-Z]{32}$/;
		// 			if (!rel.test(app_secret)) {
		// 				displayMsg(ndPromptMsg, 'APP密钥必须是三十二位字母数字！', 2000);
		// 				return;
		// 			}
		// 			rel = /^[0-9]{10}$/;
		// 			if (!rel.test(mch_id)) {
		// 				displayMsg(ndPromptMsg, '微信支付商户号必须是十位数字！', 2000);
		// 				return;
		// 			}


	 //                setAjax(AdminUrl.payTypeUpdateWxpay, {
	 //                	'app_id': app_id,
	 //                    'app_secret': app_secret,
	 //                    'mch_id': mch_id
	 //                }, $('#prompt-message'), {20: ''}, function(respnoseText) {
	 //                    if (respnoseText.code == 20) {
	 //                    	displayMsg(ndPromptMsg, respnoseText.message, 2000, function () {
	 //                    		window.location.replace('paymentSettings.html');
	 //                    	});
		// 				} else {
		// 					displayMsg(ndPromptMsg, respnoseText.message, 2000);
		// 				}
	 //                }, 0);
	 //            }
		// 	},

		// 	// 效验要修改的数据
		// 	dataCheck: function () {
	 //            if ( dataTest('#app_id', '#prompt-message', { 'empty': '不能为空'})
	 //            	&& dataTest('#app_secret', '#prompt-message', { 'empty': '不能为空'})
	 //            	&& dataTest('#mch_id', '#prompt-message', { 'empty': '不能为空'})
	 //            ) {
	 //            	//alert('tt');
	 //                return true;
	 //            }

	 //            return false;
		// 	}
		// }

		// PayWayManageAdd.init();



		var stat = getQueryString('stat');  //  判断  0微信   1支付宝
		// 获取到修改传过来的缓存
		var payData = Cache.get('totalpaymentData');
										// 判断是修改还是添加 0；添加，1：修改
										// var addIsUp = 0;//  好像没用

		var newPayWayManageAdd = {

			newInit: function () {
				// 判断是修改还是添加
				if (stat == 0)  {
					$('#addAndedit').text('微信支付修改');
				} else {
                    $('#addAndedit').text('支付宝支付修改');
				}
				// 显示数据
				// stat 0 微信  1 支付宝
				this.newPayWayManage(payData,stat);
				// 绑定点击事件
				// stat  0 wx  1 ali
				this.newPayWayAddBind(stat);
			},

			// 新的显示数据
			// data  从缓存中获取从设置也保存的数据
			newPayWayManage: function (data,stat) {
				// body...
		     // stat            判断  0微信   1支付宝
				var content = '';
				if (stat == 0) {
					content =   '<li class="clearfix">'+
				                    '<div class="nav-content-edit-title list_tip">APP ID：</div>'+
				                    '<div style="color: red"><input type="text" id="app_id" name="app_id" class="nav-shop" data-description="APPID" value="'+data.app_id+'" placeholder="" autocomplete="off"> &nbsp;*必填</div>'+
				                '</li>'+
				                '<li class="clearfix">'+
				                    '<div class="nav-content-edit-title list_tip">APP密钥：</div>'+
				                    '<div style="color: red"><input type="text" id="app_secret" name="app_secret" class="nav-shop" value="'+data.app_secret+'" data-description="APP密钥" placeholder="" autocomplete="off">&nbsp;*必填</div>'+
				                '</li>'+
				                '<li class="clearfix">'+
				                    '<div class="nav-content-edit-title list_tip">微信支付商户号：</div>'+
				                    '<div style="color: red"><input type="text" id="mch_id" name="mch_id" class="nav-shop" value="'+data.mch_id+'" data-description="微信支付商户号" placeholder="" autocomplete="off">&nbsp;*必填</div>'+
				               '</li>';      
				} else {
					content =   '<li class="clearfix" style="margin-bottom: 10px">'+
				                    '<div class="nav-content-edit-title list_tip">APP ID：</div>'+
				                    '<div style="color: red"><input type="text" id="app_id" name="app_id" class="nav-shop" data-description="APPID" value="'+data.app_id+'" placeholder="" autocomplete="off"> &nbsp;*必填</div>'+
				                '</li>'+
				                '<li class="clearfix" style="margin-bottom: 10px">'+
				                    '<div class="nav-content-edit-title list_tip">收款账号ID：</div>'+
				                    '<div style="color: red"><input type="text" id="seller_id" name="seller_id" class="nav-shop" data-description="SellerId" value="'+data.seller_id+'" placeholder="" autocomplete="off"> &nbsp;*必填</div>'+
				                '</li>'+
				                '<li class="clearfix" style="margin-bottom: 10px">'+
				                    '<div class="nav-content-edit-title list_tip">收款账号邮箱：</div>'+
				                    '<div style="color: red"><input type="text" id="seller_email" name="seller_email" class="nav-shop" data-description="SellerEmail" value="'+data.seller_email+'" placeholder="" autocomplete="off"> &nbsp;*必填</div>'+
				                '</li>'+
				                '<li class="clearfix" style="margin-bottom: 10px">'+
				                    '<div class="nav-content-edit-title list_tip">支付宝公钥：</div>'+
				                    '<div style="color: red">'+
				                    	// '<input type="text" id="alipay_public_key" name="app_secret" class="nav-shop" value="'+data.alipay_public_key+'" data-description="APP密钥" placeholder="" autocomplete="off">'+
				                    	'<textarea id="alipay_public_key" style="height: 70px; line-height:20px;width: 900px; resize:none; padding: 0 10px">'
	    									+data.alipay_public_key+
	    								'</textarea>'+
				                    	'&nbsp;*必填'+
				                    '</div>'+
				                '</li>'+
				                '<li class="clearfix" style="margin-bottom: 10px">'+
				                    '<div class="nav-content-edit-title list_tip">开发者私钥：</div>'+
				                    '<div style="color: red">'+
				                    // '<input type="text" id="app_private_key" name="mch_id" class="nav-shop" value="'+data.app_private_key+'" data-description="微信支付商户号" placeholder="" autocomplete="off">'+                    	
				                    	'<textarea id="app_private_key" style="height: 270px; line-height:20px;width: 900px; resize:none; padding: 0 10px">'
	    									+data.app_private_key+
	    								'</textarea>'+
				                    	'&nbsp;*必填'+
				                    '</div>'+
				                '</li>';    
				}
				$('.nav-content').html(content);
			},

			// 新的绑定点击事件
			// type   0微信 1支付宝
			newPayWayAddBind: function (type) {
				var _self = this;
				// 点击修改
				$('#updatebtn').unbind('click').bind('click', function () {
					_self.newPayWayManageUpdate(type);
				});

				// 点击取消
				$('#exitbtn').unbind('click').bind('click', function () {
					window.location.replace('paymentSettings.html');
				});
			},

			// 修改  
			// type  0 wx   1 ali
			newPayWayManageUpdate: function (type) {
				// 获取到各个数据，请求接口提交数据
				// var self = this;
				// 支付宝校验  不一样
				
				if (type == 0) {
					// 调用微信 校验和接口
					if (this.newDataCheck(0)) {
						var app_id = $('#app_id').val();
						var app_secret = $('#app_secret').val();
						var mch_id = $('#mch_id').val();
						var rel = /^[0-9a-zA-Z]{18}$/;
						if (!rel.test(app_id)) {
							displayMsg(ndPromptMsg, 'APPID必须是十八位字母数字！', 2000);
							return;
						}
						rel = /^[0-9a-zA-Z]{32}$/;
						if (!rel.test(app_secret)) {
							displayMsg(ndPromptMsg, 'APP密钥必须是三十二位字母数字！', 2000);
							return;
						}
						rel = /^[0-9]{10}$/;
						if (!rel.test(mch_id)) {
							displayMsg(ndPromptMsg, '微信支付商户号必须是十位数字！', 2000);
							return;
						}
		                setAjax(AdminUrl.payTypeUpdateWxpay, {
		                	'app_id': app_id,
		                    'app_secret': app_secret,
		                    'mch_id': mch_id
		                }, $('#prompt-message'), {20: ''}, function(respnoseText) {
		                    if (respnoseText.code == 20) {
		                    	displayMsg(ndPromptMsg, respnoseText.message, 2000, function () {
		                    		window.location.replace('paymentSettings.html');
		                    	});
							} else {
								displayMsg(ndPromptMsg, respnoseText.message, 2000);
							}
		                }, 0);
		            } 
				} else {
					// 调用支付宝 校验和接口
					if (this.newDataCheck(1)) {
						//  需要 修改内容
						var is_alipay = payData.is_alipay;
						var app_id = $('#app_id').val();
						var alipay_public_key = $('#alipay_public_key').text();
						var app_private_key = $('#app_private_key').text();
						var seller_id = $('#seller_id').val();
						var seller_email = $('#seller_email').val();
						var alipay_public_key_length = $('#alipay_public_key').text().length;
						var app_private_key_length = $('#app_private_key').text().length;
						// console.log('alipay_public_key:',alipay_public_key);
						// console.log('app_private_key:',app_private_key);
						 // 正则 需要改支付宝数据
						var rel = /^[0-9a-zA-Z]{16}$/;
						if (!rel.test(app_id)) {
							displayMsg(ndPromptMsg, 'APPID必须是十六位字母数字！', 2000);
							return;
						}
						var rel = /^[0-9a-zA-Z]{16}$/;
						if (!rel.test(seller_id)) {
							displayMsg(ndPromptMsg, '收款账号ID必须是十六位字母数字！', 2000);
							return;
						}
						var rel = /^([\w-_]+(?:\.[\w-_]+)*)@((?:[a-z0-9]+(?:-[a-zA-Z0-9]+)*)+\.[a-z]{2,6})$/i;
						if (!rel.test(seller_email)) {
							displayMsg(ndPromptMsg, '请填写正确的邮箱！', 2000);
							return;
						}
						// rel = /^[0-9a-zA-Z]{32}$/;
						if (alipay_public_key_length < 128 || alipay_public_key_length > 2048) {
							displayMsg(ndPromptMsg, '支付宝公钥长度错误！', 2000);
							return;
						}
						// rel = /^[0-9]{10}$/;
						if (app_private_key_length < 128 || app_private_key_length > 2048) {
							displayMsg(ndPromptMsg, '开发者私钥长度错误！', 2000);
							return;
						}
		                setAjax(AdminUrl.payTypeUpdateAlipay, {
		                	// 内容需要改
		                	'is_alipay': is_alipay,
		                	'app_id': app_id,
		                	'seller_id': seller_id,
		                    'seller_email': seller_email,
		                    'alipay_public_key': alipay_public_key,
		                    'app_private_key': app_private_key
		                }, $('#prompt-message'), {20: ''}, function(respnoseText) {
		                    if (respnoseText.code == 20) {
		                    	displayMsg(ndPromptMsg, respnoseText.message, 2000, function () {
		                    		window.location.replace('paymentSettings.html');
		                    	});
							} else {
								displayMsg(ndPromptMsg, respnoseText.message, 2000);
							}
		                }, 0);
		            } 
				}

				// 效验数据通过才能修改


				
			},
			// 效验要修改的数据
			// 分 0微信  1支付宝  
			newDataCheck: function (type) {
				// type  0 wx  1 ali
				if (type == 0) {
					if ( dataTest('#app_id', '#prompt-message', { 'empty': '不能为空'})
	            	&& dataTest('#app_secret', '#prompt-message', { 'empty': '不能为空'})
	            	&& dataTest('#mch_id', '#prompt-message', { 'empty': '不能为空'})
		            ) {
		            	//alert('tt');
		                return true;
		            }
		            return false;
				} else {
					// 支付宝 内容不一样
					if ( dataTest('#app_id', '#prompt-message', { 'empty': '不能为空'})
	            	&& dataTest('#alipay_public_key', '#prompt-message', { 'empty': '不能为空'})
	            	&& dataTest('#app_private_key', '#prompt-message', { 'empty': '不能为空'})
	            	&& dataTest('#seller_id', '#prompt-message', { 'empty': '不能为空'})
	            	&& dataTest('#seller_email', '#prompt-message', { 'empty': '不能为空'})
		            ) {
		            	//alert('tt');
		                return true;
		            }
		            return false;
				}            
			}
		}

		newPayWayManageAdd.newInit();

});

