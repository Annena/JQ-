$(function () {
	// 支付方式添加修改


        // 获取到修改传过来的shop_id
		var payTypeid = getQueryString('pay_type_id');
		// 获取到修改传过来的缓存
		var data = Cache.get('payWay');
		// 判断是修改还是添加 0；添加，1：修改
		var addIsUp = 0;

		var PayWayManageAdd = {

			init: function () {
				// 判断是修改还是添加
				if (payTypeid != null && payTypeid != undefined && data != null && data != undefined)  {
					addIsUp = 1;
					// 把状态显示
                    $('#addNoDisplay').removeClass('hide');
                    $('#addAndedit').text('支付方式修改');
                    // 编号名称不可修改 
                    // $('#payTypedid').attr('disabled','true');
                    $('#payTypename').attr('disabled','true');
					// 显示数据
					this.payWayManage(data);
				} else {
					addIsUp = 0;
					// 把状态显示
                    $('#addNoDisplay').addClass('hide');
                    // 编号名称可修改，去除不可修改属性
                    $('#payTypedid').removeAttr('readonly');
                    $('#addAndedit').text('支付方式添加');
				}
				
				// 绑定点击事件
				this.PayWayAddBind();
			},

			// 显示数据
			payWayManage: function (data) {
				// 显示数据
				
				// 编号
				$('#payTypedid').val(data.pay_type_did);
				// 名称
				$('#payTypename').val(data.pay_type_name);
				// 描述
				$('#payTypeinfo').val(data.pay_type_info);

				// 是否支持会员价，是否支持会员折扣
				$('#is_member_price').val(data.is_member_price);
				$('#is_member_discount').val(data.is_member_discount);

				// 门店状态
				$('#payStatus').val(data.pay_type_status);

				// 属性设置不能修改
				$('#attribute_setting').find('input[type="checkbox"]').each(function(i,valt){
					if ((valt.value == 1 && data.is_receipts == 1) || 
						(valt.value == 2 && data.receipts_integral == 1) || 
						(valt.value == 3 && data.is_preferential == 1) || 
						(valt.value == 4 && data.preferential_integral == 1)) {
						$(this).attr('checked', true);
					}
					$(this).attr('disabled','true');
				});
				 
				Cache.del('payWay');
			},

			// 绑定点击事件
			PayWayAddBind: function () {
				var _self = this;
				// 点击修改
				$('#updatebtn').unbind('click').bind('click', function () {

					// 效验数据通过才能修改
					if (_self.dataCheck()) {

						// 校验支付方式名称
						var value = $('#payTypename').val();
				        var len = value.length;
				        if(len <= 20){
				            var reg1 = /[\u4e00-\u9fa5]{1,}/g;
				            if(reg1.test(value)){
				                len += value.match(reg1).join("").length;
				                console.log(len);
				                if(len > 20){
				                  	displayMsg($('#prompt-message'), '只能输入10个汉字', 3000);
				                  	return;
				                }
				            }
				        }else{
				          	displayMsg($('#prompt-message'), '只能输入20个字符', 3000);
				          	return;
				        }

						var memberArray = new Array();
						var num = 1;
						var nums = 0;// 是否有选中计入实收或者计入优惠 0否 1是

						var num1 = 0;
						var num2 = 0;
						var num3 = 0;
						var num4 = 0;

				        // 属性设置
				        $('#attribute_setting').find('input[type="checkbox"]').each(function(i,valt){
				        	if ($(this).is(':checked') || $(this).attr('checked') == true) {
								memberArray[num] = valt.value;
								num++;
								if (valt.value == 1 || valt.value == 3) {
									nums = 1;
								}
								if (valt.value == 1) {
									num1 = 1;
								}
								if (valt.value == 2) {
									num2 = 1;
								}
								if (valt.value == 3) {
									num3 = 1;
								}
								if (valt.value == 4) {
									num4 = 1;
								}
				        	}
				        });

				        if (nums == 0) {
							displayMsg($('#prompt-message'), '计入实收或计入优惠必须选择一个', 3000);
				          	return;
				        }

						if (addIsUp == 0) {
							_self.payWayManageAdd(num1, num2, num3, num4);
						} else if (addIsUp == 1) {
							_self.payWayManageUpdate(num1, num2, num3, num4);
						}
					}
				});

				// 点击取消
				$('#exitbtn').unbind('click').bind('click', function () {
					window.location.replace('payWayManage.html?is_select=1&type='+getQueryString('type'));
				});

				// 点击导航
				$('#selectJump').unbind('click').bind('click', function () {
					window.location.replace('payWayManage.html?is_select=1&type='+getQueryString('type'));
				});
			},

			// 添加
			payWayManageAdd: function (num1, num2, num3, num4) {
				
				// 获取到各个数据，请求接口提交数据
				var self = this;
				var pay_type_did = $('#payTypedid').val();
				var pay_type_name = $('#payTypename').val();
				var pay_type_info = $("#payTypeinfo").val();
				// 是否支持会员价，是否支持会员折扣
				var is_member_price = $('#is_member_price').val();
				var is_member_discount = $('#is_member_discount').val();

	            setAjax(AdminUrl.payTypePayTypeAdd, {
	                'pay_type_did': pay_type_did,
	                'pay_type_name': pay_type_name,
	                'pay_type_info': pay_type_info,
	                'is_receipts': num1,
	                'is_preferential': num3,
	                'receipts_integral': num2,
	                'preferential_integral': num4,
	                'is_member_price': is_member_price,
	                'is_member_discount': is_member_discount
	            }, $('#prompt-message'), {20: ''}, function(respnoseText) {
					// 得到返回数据
	                var data = respnoseText.data;	
					window.location.replace('payWayManage.html?is_select=1&type='+getQueryString('type'));
	            }, 2);
			},

			// 修改
			payWayManageUpdate: function (num1, num2, num3, num4) {
				// 获取到各个数据，请求接口提交数据
				var self = this;
				var pay_type_did = $('#payTypedid').val();
				var pay_type_name = $('#payTypename').val();
				var pay_type_info = $("#payTypeinfo").val();
				var pay_type_status = $("#payStatus").val();
				// 是否支持会员价，是否支持会员折扣
				var is_member_price = $('#is_member_price').val();
				var is_member_discount = $('#is_member_discount').val();

	            setAjax(AdminUrl.payTypePayTypeUpdate, {
	                'pay_type_id': payTypeid,
	                'pay_type_did': pay_type_did,
	                'pay_type_name': pay_type_name,
	                'pay_type_info': pay_type_info,
	                'pay_type_status': pay_type_status,
	                'is_receipts': num1,
	                'is_preferential': num3,
	                'receipts_integral': num2,
	                'preferential_integral': num4,
	                'is_member_price': is_member_price,
	                'is_member_discount': is_member_discount
	            }, $('#prompt-message'), {20: ''}, function(respnoseText) {
					// 得到返回数据
	                var data = respnoseText.data;	
					window.location.replace('payWayManage.html?is_select=1&type='+getQueryString('type'));
	            }, 2);
			},

			// 效验要修改的数据
			dataCheck: function () {
	            if ( /*dataTest('#payTypedid', '#prompt-message', { 'empty': '不能为空'})
	            	&&*/ dataTest('#payTypename', '#prompt-message', { 'empty': '不能为空'})
	            
	            ) {
	            	//alert('tt');
	                return true;
	            }

	            return false;
			}
		}

		PayWayManageAdd.init();

});

