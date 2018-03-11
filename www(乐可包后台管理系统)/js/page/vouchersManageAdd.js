$(function () {
	// 抵用劵添加身份


        // 获取到修改传过来的id
		var voucherId = getQueryString('voucher_id');
		// 获取到修改传过来的缓存
		var data = Cache.get('vouUp');
		// 判断是修改还是添加 0；添加，1：修改
		var addIsUp = 0;
		// 门店集合
		var shopIdPros = '';

		var VouchersManageAdd = {

			init: function () {
				// 显示所有店铺数据，在显示完所有门店的时候在绑定点击事件
				this.shopData();

				// 判断是修改还是添加
				if (voucherId != null && voucherId != undefined && data != null && data != undefined) {
					addIsUp = 1;
					shopIdPros = data.shop_ids;
					// 把状态显示
					$('#addNoDisplay').removeClass('hide');
					$('#addAndedit').text('抵用券修改');
					$('#voucherMoney').attr('disabled','true');
					$('#lowConsume').attr('disabled','true');
					// 显示数据
					this.VouchersAddList(data);
				} else {
					addIsUp = 0;
					// 把状态隐藏
					$('#addNoDisplay').addClass('hide');
					$('#addAndedit').text('抵用券添加');
				}

				// 绑定点击事件
				//this.VouchersAddBind();
			},

			// 显示数据
			VouchersAddList: function (data) {
				// 显示数据

				// 名称
				$('#voucherName').val(data.voucher_name);
				// 面值
				$('#voucherMoney').val(data.voucher_money);
				// 用劵最低消费
				$('#lowConsume').val(data.low_consume);

				// // 适用门店
				// var shopIds = data.shop_ids;
				// // 找到列表中所有的checkbox，然后循环每个checkbox，
				// $('#shopIds div input[type="checkbox"]').each(function(i,val){
				// 	alert(shopIds);
				// 	// 如果当前用户的授权门店 等于 循环中的某个checkbox
				// 	if(shopIds.split(',')[i] == val.name){
				// 		// 选中当前的checkbox
				// 		$(this).attr('checked','checked');
				// 	}
				// });
				
				//alert(data.start_time);
				// 如果是当日生效或者次日生效
				if (data.start_time == 0 || data.start_time == 1) {
					$('#effective').attr('checked',true);
					$('#validity').attr('checked', false);
					$('#effect').val(data.start_time);
					$('#effectiveDate').val(data.end_time);
				} else {// 如果是有效期
					$('#effective').attr('checked',false);
					$('#validity').attr('checked', true);
					// 有效期开始结束
					$('#openTime').val(getAppointTime(data.start_time));
					// 结束时间
					$('#closeTime').val(getAppointTime(data.end_time));
				}
				
				
				// 发放方式
				$('#giveOut').val(data.give_out);
				// 状态
				$('#vouStatus').val(data.vou_status);


				// 缓存中的数据取出之后删除
				Cache.del('vouUp');
			},

			// 绑定点击事件
			VouchersAddBind: function () {
				var _self = this;
				// 点击修改
				$('#updatebtn').unbind('click').bind('click', function () {

					_self.checkCondition();

					// if (addIsUp == 0) {
					// 	_self.VouchersAdd();
					// } else if (addIsUp == 1) {
					// 	_self.VouchersUpdate();
					// }
				});

				// 点击取消
				$('#exitbtn').unbind('click').bind('click', function () {
					window.location.replace('vouchersManage.html');
				});

				// 点击查看更多门店
				$('#clickMore').unbind('click').bind('click', function () {
					//alert('ddd');
					// 删除隐藏，显示隐藏的那部分门店
					$('#more').removeClass('hide');
					// 隐藏   查看更多门店按钮
					$('#clickMore').addClass('hide');
				});
			},

			// 添加
			VouchersAdd: function () {
				// 获取到各个数据，请求接口提交数据
				var self = this;
				
				// 名称
				var voucherName = $('#voucherName').val();
				// 面值
				var voucherMoney = $('#voucherMoney').val();
				// 用劵最低消费
				var lowConsume = $('#lowConsume').val();

				// 适用门店
				var shopIds = '';
				// 所有门店是all否被选中 0：没有选中，1：选中了
				var isAll = 0;
				// 找到列表中所有的checkbox，然后循环每个checkbox，
				$('#shopIds div input[type="checkbox"]').each(function(i,val){
					// 如果所有门店all被选中了
					if($('#all').is(':checked') || $('#all').attr('checked') == true){
						isAll = 1;
					} else {
						// 如果当前循环出来所有门店all之外的checkbox 被选中了
						if($(this).is(':checked')){
							// 就把checkbox中的名字取出来，并用逗号拼接起来
							shopIds += val.value+',';
						}
					}
				});
				// 如果所有门店被选中了
				if (isAll == 1){
					shopIds = 'all';
				} else {
					// 因为用逗号拼接起来，这个字符串最后会带一个逗号，所以用substring把除去最后一个逗号之外的字符取出来
					shopIds = shopIds.substring(0,shopIds.length-1);
				}

				// 有效期开始结束
				var openTime = '';
				var closeTime = '';
				//alert($('#validity').is(':checked')+'---'+$('#effective').is(':checked'));
				// 如果有效日期区间选中了
				if ($('#validity').is(':checked') || $('#validity').attr('checked') == true) {
					openTime = $('#openTime').val();
					closeTime = $('#closeTime').val();
					if (dataTest('#openTime', '#prompt-message', { 'empty': '不能为空'}) && dataTest('#closeTime', '#prompt-message', { 'empty': '不能为空'})) {
						//return;
					} else {
						return;
					}
				} else if ($('#effective').is(':checked') || $('#effective').attr('checked') == true) {
					// 如果生效的有效天数选中了
					// 当日有效还是次日有效
					openTime = $('#effect').val();
					// 有效天数
					closeTime = $('#effectiveDate').val();
					if (dataTest('#effectiveDate', '#prompt-message', { 'empty': '不能为空','number':'必须为数字'})) {
						if ($('#effectiveDate').val() > 1000) {
							displayMsg(ndPromptMsg, '有效天数不能大于1000!', 2000);
							return;
						}
					} else {
						return;
					}
				}




				// 发放方式
				var giveOut = $('#giveOut').val();

				// 效验数据通过才能修改
				if (this.dataCheck()) {
	                setAjax(AdminUrl.voucherVoucherAdd, {
	                    'voucher_name': voucherName,
	                    'voucher_money': parseFloat(voucherMoney).toFixed(2),
	                    'low_consume': parseFloat(lowConsume).toFixed(2),
						'shop_ids': shopIds,
	                    'give_out': giveOut,
	                    'start_time': openTime,
	                    'end_time': closeTime
	                }, $('#prompt-message'), {20: ''}, function(respnoseText) {
						// 得到返回数据
	                    var data = respnoseText.data;
	                    window.location.replace('vouchersManage.html');
	                }, 2);
	            }
			},

			// 修改
			VouchersUpdate: function () {
				// 获取到各个数据，请求接口提交数据
				var self = this;

				// 名称
				var voucherName = $('#voucherName').val();
				// 面值
				var voucherMoney = $('#voucherMoney').val();
				// 用劵最低消费
				var lowConsume = $('#lowConsume').val();
				 
				// 适用门店
				var shopIds = '';
				// 所有门店是all否被选中 0：没有选中，1：选中了
				var isAll = 0;
				// 找到列表中所有的checkbox，然后循环每个checkbox，
				$('#shopIds div input[type="checkbox"]').each(function(i,val){
					// 如果所有门店all被选中了
					if($('#all').is(':checked') || $('#all').attr('checked') == true){
						isAll = 1;
					} else {
						// 如果当前循环出来所有门店all之外的checkbox 被选中了
						if($(this).is(':checked')){
							// 就把checkbox中的名字取出来，并用逗号拼接起来
							shopIds += val.value+',';
						}
					}
				});
				// 如果所有门店被选中了
				if (isAll == 1){
					shopIds = 'all';
				} else {
					// 因为用逗号拼接起来，这个字符串最后会带一个逗号，所以用substring把除去最后一个逗号之外的字符取出来
					shopIds = shopIds.substring(0,shopIds.length-1);
				}

				// 有效期开始结束
				var openTime = '';
				var closeTime = '';
				//alert($('#validity').is(':checked')+'---'+$('#effective').is(':checked'));
				// 如果有效日期区间选中了
				if ($('#validity').is(':checked') || $('#validity').attr('checked') == true) {
					openTime = $('#openTime').val();
					closeTime = $('#closeTime').val();
					if (dataTest('#openTime', '#prompt-message', { 'empty': '不能为空'}) && dataTest('#closeTime', '#prompt-message', { 'empty': '不能为空'})) {
						//return;
					} else {
						return;
					}
				} else if ($('#effective').is(':checked') || $('#effective').attr('checked') == true) {
					// 如果生效的有效天数选中了
					// 当日有效还是次日有效
					openTime = $('#effect').val();
					// 有效天数
					closeTime = $('#effectiveDate').val();
					if (dataTest('#effectiveDate', '#prompt-message', { 'empty': '不能为空','number':'必须为数字'})) {
						if ($('#effectiveDate').val() > 1000) {
							displayMsg(ndPromptMsg, '有效天数不能大于1000!', 2000);
							return;
						}
					} else {
						return;
					}
				}

				// 发放方式
				var giveOut = $('#giveOut').val();
				// 状态
				var vouStatus = $('#vouStatus').val();

				// 效验数据通过才能修改
				if (this.dataCheck()) {
	                setAjax(AdminUrl.voucherVoucherUpdate, {
						'voucher_id': voucherId,
	                    'voucher_name': voucherName,
	                    'voucher_money': parseFloat(voucherMoney).toFixed(2),
	                    'low_consume': parseFloat(lowConsume).toFixed(2),
						'shop_ids': shopIds,
	                    'give_out': giveOut,
	                    'start_time': openTime,
	                    'end_time': closeTime,
	                    'vou_status': vouStatus
	                }, $('#prompt-message'), {20: ''}, function(respnoseText) {
						// 得到返回数据
	                    var data = respnoseText.data;
	                    window.location.replace('vouchersManage.html');
	                }, 2);
	            }
			},

			// 三级级联显示店铺
			shopData: function () {
				var self = this;
				//alert(shopStatusList);
                setAjax(AdminUrl.shopShopList, {
                	'type': 2
                }, $('#prompt-message'), {20: ''}, function(respnoseText) {
					// 得到返回数据
                    var data = respnoseText.data;

					self.shopList(data);

                }, 0);
			},

			// 显示店铺
			shopList: function (data) {
					var content = '<div class="clearfix">'+
										'<div class="fendian">'+
		                                	'<input name="all" id="all" '+(shopIdPros == 'all' ? 'checked=checked' : '' )+' type="checkbox" value="all">所有门店'+
		                            	'</div>';
					// num用来区分改隐藏的更多门店
					var num = 0;
					for (var i in data) {
						if (num == 15) {
							content += '</div>'+
										'<div class="more" id="clickMore">点击查看更多门店</div>'+
										'<div class="clearfix hide" id="more">'+
											'<div class="fendian">'+
			                                	'<input name="'+data[i].shop_name+'" type="checkbox"  value="'+data[i].shop_id+'">'+data[i].shop_name+
			                            	'</div>';
						} else {
							content += '<div class="fendian">'+
		                                	'<input name="'+data[i].shop_name+'" type="checkbox"   value="'+data[i].shop_id+'">'+data[i].shop_name+
		                            	'</div>';	
						}
		                num ++;
					}

					content += '</div>';
					// 添加到页面中
					$('#shopIds').html(content);


					// 找到列表中所有的checkbox，然后循环每个checkbox，
					$('#shopIds div input[type="checkbox"]').each(function(i,val){
						if (shopIdPros == 'all') {
							$(this).attr('checked','checked');
						} else {
							var leng = shopIdPros.split(',').length;
							for (var i = 0;i<leng;i++) {
								// 如果当前用户的授权门店 等于 循环中的某个checkbox
								if(shopIdPros.split(',')[i] == val.value){
									// 选中当前的checkbox
									$(this).attr('checked','checked');
								}
							}
						}
					});

					// 绑定点击事件
					this.VouchersAddBind();
					// 调用public.js中公共的方法（点击全选，选中所有的，点击其中某一个，如果这时候是全选就把全选取消）
					selectShopAll('#shopIds', '#shopIds div input[type="checkbox"]');

					// 适用门店
				//var shopIds = data.shop_ids;
				
			},

			// 效验要修改的数据
			dataCheck: function () {
	            if ( dataTest('#voucherName', '#prompt-message', { 'empty': '不能为空'})
	            	&& dataTest('#voucherMoney', '#prompt-message', { 'empty': '不能为空', 'number': '必须为数字'})
	                && dataTest('#lowConsume', '#prompt-message', { 'empty': '不能为空', 'number': '必须为数字'})
	            ) {
	            	//alert('tt');
	                return true;
	            }

	            return false;
			},

			// 检测条件
	        checkCondition: function() {

	            var _self = this;
	            if ($('#validity').is(':checked')) {
		            var start = $('#openTime').val(),
		                end = $('#closeTime').val();

		            if (start == "" || end == "") {
		                displayMsg(ndPromptMsg, '请选择开始时间和结束时间!', 2000);
		                return;
		            }

		            if (start > end) {
		                displayMsg(ndPromptMsg, '开始时间应小于结束时间!', 2000);
		                return;
		            }
	        	}
	            // defaults.start = start;
	            // defaults.end = end;
	            // defaults.del = $('#status').val();

	            if (addIsUp == 0) {
						_self.VouchersAdd();
					} else if (addIsUp == 1) {
						_self.VouchersUpdate();
					}

	        },
		}

		VouchersManageAdd.init();

});

