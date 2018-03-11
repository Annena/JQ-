$(function () {

	// 快捷支付统计----店铺

        // 传给php的参数中type，1表示店铺，2表示卡片，3表示日期

        // 第几层	1：第一层，2：第二层，三：第三层
        var hierarchy = getQueryString('hierarchy');
        // sign：1：表示单个日期，2：表示多个日期
        var sign = getQueryString('sign');
        // click：1：点击合计，2：点击上面的其他的
        var click = getQueryString('click');
        // way：1：店铺，2：储值卡，3：日期，只在点总计旁边的按钮进入第二层的时候使用
        var way = getQueryString('way');

        // 获取前一个页面缓存传过来的数据
        var stoData = Cache.get('paystosopvalstattt');

		var StoredValueStatistical = {

			init: function () {
				// 如果是单个日期并且是第三层就不显示标题列的（操作）
				if ((sign == 1 || sign == 2) && hierarchy == 3) {
					$('#operationDisplay').addClass('hide');
				} else {
					$('#operationDisplay').removeClass('hide');
				}

				// 显示数据
				this.StoredData(stoData);
				// 绑定点击事件
				this.StoredBind();
			},

			// 请求显示数据
			StoredData: function (stoData) {
				// 搜索数据出来之前先清空列表数据
				$('#tbodys').html('');
				var self = this;

				// 如果是单个日期并且是第二层就显示导航条
				if (sign == 1 && hierarchy == 2) {
					// 导航条显示
					$('#Navigation').html('<b id="stat">快捷支付统计 </b>>> '+stoData.start_date+'(按店铺)');
				}

				// 如果是单个日期并且是第三层就显示导航条
				if (sign == 1 && hierarchy == 3) {
					// 导航条显示
					$('#Navigation').html('<b id="stat">快捷支付统计 </b>>> <b id="statShop">'+stoData.start_date+'</b> >> '+stoData.name);
				}

				// 如果是单个日期并且是第一层就显示导航条
				if (sign == 2 && hierarchy == 1) {
					// 导航条显示
					$('#Navigation').html('<b id="stat">快捷支付统计 </b>>> '+stoData.start_date+'至'+stoData.end_date+'(按店铺)');
				}

                setAjax(AdminUrl.quickpayCountFirst, {
                    'start_date': stoData.start_date,
                    'end_date': stoData.end_date,
                    'shop_ids': stoData.shop_ids,
                    'pay_type_ids': stoData.pay_type_ids,
                    'type': 1
                }, $('#prompt-message'), {20: ''}, function(respnoseText) {
					// 得到返回数据
                    var data = respnoseText.data;
                    self.StoredList(data);
                }, 1);
			},

			// 显示数据
			StoredList: function (data) {

				var wer = stoData.pay_type_ids;

				var content = '';
				// 储值总金额
				var sum_stored_money = 0;
				// 赠送总金额
				var money = 0;
				for (var i in data) {

					if (wer == 'cash' || wer == 'card' || wer == 'quick_pay' || wer == 'stored' || wer == 'voucher') {
						
						var money = data[i].money;
						var shopname = data[i].pay_type_name;
						
					} else {
						var money = data[i].money;
						var shopname = data[i].shop_name;
					};

 					content += '<tr class="total-tr" pay-type-ids="'+data[i].pay_type_ids+'" shop-id="'+data[i].shop_id+'" >'+
			 						'<td class="total-addr" data-type="name">'+shopname+'</td>'+
			 						'<td class="hide" data-type="date">'+data[i].date+'</td>'+
									'<td class="total-tel hide" data-type="sumStoredMoney">'+data[i].sum_stored_money+'</td>'+
									'<td class="total-tel" data-type="sumGiveMoney">'+money+'</td>'+
									// 如果是单个日期并且是第三层就不显示按钮
									((sign == 1 || sign == 2) && hierarchy == 3 ? '' :
									'<td class="total-caozuo clearfix">'+
										// 如果是单个日期并且是第二层 或者 如果是多个日期并且是第一层  就显示储值卡明细
										((sign == 1 && hierarchy == 2) || (sign == 2 && hierarchy == 1) ?
										'<span>'+
											'<input type="button" name="'+data[i].pay_type_ids+'" value="支付方式明细" data-type="storedDetailed" class="stores-caozuo-btn">'+
										'</span>': '')+
										// 如果是多个日期并且是第一层 或者 如果是多个日期并且是第二层  就显示日期明细
										((sign == 2 && hierarchy == 1) || (sign == 2 && hierarchy == 2)?
										'<span>'+
											'<input type="button" value="日期明细" data-type="dateDetailed" class="stores-caozuo-btn">'+
										'</span>': '')+
			                        '</td>')+
			    				'</tr>';
			    	sum_stored_money +=  parseInt(data[i].sum_stored_money);
			    	money +=  parseInt(data[i].money);
				}
				content += '<tr class="total-tr">'+
			 					'<td class="total-addr">合计</td>'+
								'<td class="total-tel hide">'+parseFloat(sum_stored_money).toFixed(2)+'</td>'+
								'<td class="total-tel">'+parseFloat(money).toFixed(2)+'</td>'+
								// 如果是单个日期并且是第三层就不显示合计旁边的按钮
								((sign == 1 || sign == 2) && hierarchy == 3 ? '' :			
								'<td class="total-caozuo clearfix">'+
									// 如果是单个日期并且是第二层 或者 如果是多个日期并且是第一层  就显示储值卡明细
									((sign == 1 && hierarchy == 2) || (sign == 2 && hierarchy == 1) ?
									'<span>'+
										'<input type="button" value="支付方式明细" id="totalStoredDetailed" class="stores-caozuo-btn">'+
									'</span>': '')+
									// 如果是多个日期并且是第一层 或者 如果是多个日期并且是第二层 就显示储值卡明细和日期明细
									((sign == 2 && hierarchy == 1) || (sign == 2 && hierarchy == 2)?
									'<span>'+
										'<input type="button" value="日期明细" id="dateDetailed" class="stores-caozuo-btn">'+
									'</span>': '')+
			                    '</td>')+
			    			'</tr>';

				// 添加到页面中
				$('#tbodys').html(content);
				// 总计储值卡明细
				$('#totalStoredDetailed').unbind('click').bind('click', function () {

					// 如果是单个日期并且是第二层点击总计旁边的储值卡明细
					if (sign == 1 && hierarchy == 2){
						var paystosopvalstat = {
							'start_date': stoData.start_date,
							'end_date': stoData.end_date,
							'shop_ids': 'all',
							'pay_type_ids': 'all',
							'type': 2
						}
						Cache.set('paystosopvalstat',paystosopvalstat);
						// url后面带的参数sign=1单个日期，click=1点击的下面的，hierarchy=2点击之后是第二层
						window.location.replace('quickPaymentDet.html?sign=1&click=1&hierarchy=2');
					}

					// 如果是多个日期并且是第一层点击总计旁边的储值卡明细
					if (sign == 2 && hierarchy == 1){
						var paystosopvalstat = {
							'start_date': stoData.start_date,
							'end_date': stoData.end_date,
							'shop_ids': 'all',
							'pay_type_ids': 'all',
							'type': 2
						}
						Cache.set('paystosopvalstat',paystosopvalstat);
						// url后面带的参数sign=2多个日期，click=1点击的下面的，hierarchy=1点击之后是第一层
						window.location.replace('quickPaymentDet.html?sign=2&click=1&hierarchy=1');
					}

				});

				// 总计日期明细
				$('#dateDetailed').unbind('click').bind('click', function () {

					// 如果是多个日期并且是第一层点击总计旁边的日期明细
					if (sign == 2 && hierarchy == 1){
						var paystosopvalstat = {
							'start_date': stoData.start_date,
							'end_date': stoData.end_date,
							'shop_ids': 'all',
							'pay_type_ids': 'all',
							'type': 3
						}
						Cache.set('paystosopvalstat',paystosopvalstat);
						// url后面带的参数sign=2多个日期，click=1点击的下面的，hierarchy=1点击之后是第一层
						window.location.replace('quickShopPaymentStatcal.html?sign=2&click=1&hierarchy=1');
					}

					// 如果是多个日期并且是第二层点击总计旁边的日期明细
					if (sign == 2 && hierarchy == 2) {
						var paystosopvalstat = {
							'start_date': stoData.start_date,
							'end_date': stoData.end_date,
							'shop_ids': 'all',
							'pay_type_ids': stoData.pay_type_ids,
							'type': 3
						}
						Cache.set('paystosopvalstat',paystosopvalstat);
						// url后面带的参数sign=2多个日期，click=1点击的下面的，hierarchy=2点击之后是第二层，way=1店铺，点击店铺在点击到日期的
						window.location.replace('quickShopPaymentStatcal.html?sign=2&click=1&hierarchy=2&way=1');
					}

				});
			},

			// 绑定点击事件
			StoredBind: function () {
				var _self = this;

				// 导航点击跳转会快捷支付统计
				$('#stat').unbind('click').bind('click', function () {
							var paystosopvalstat = {
								'start_date': stoData.start_date,
								'end_date': stoData.end_date,
								'shop_ids': shopId,
								'pay_type_ids': 'all',
								'type': 3
							}
							Cache.set('paystosopvalstat',paystosopvalstat);
							// url后面带的参数sign=2多个日期，click=2点击的上面的，hierarchy=2点击之后是第二层，way=1店铺，点击店铺在点击到日期的
							window.location.replace('quickShopPaymentStatcal.html?sign=2&click=2&hierarchy=2&way=1');
				});

				// 导航点击跳转回单个日期按店铺查询
				$('#statShop').unbind('click').bind('click', function () {
					var paystosopvalstat = {
						'start_date': stoData.start_date,
						'end_date': stoData.end_date,
						'shop_ids': 'all',
						'pay_type_ids': 'all',
						'type': 2
					}
					// 这个缓存是存储导航条日期的
					Cache.set('paystosopvalstat',paystosopvalstat);
					window.location.replace('quickShopPaymentstat.html?sign=1&click=2&hierarchy=2');
				});

				// 点击导出
				$('#dd').unbind('click').bind('click', function () {
					
				});

				// 点击店铺明细储值卡明细
				$('#tbodys').delegate('tr', 'click', function(event) {
					var self = this,
						shopId = $(self).attr('shop-id'),
						payTypeids = $(self).attr('pay-type-ids'),
						type = $(event.target).attr('data-type');

	                // 店铺名称或者卡片名称
	                var name = $(self).find('td[data-type="name"]').text();
	                // 储值金额
	                var sumStoredMoney = $(self).find('td[data-type="sumStoredMoney"]').text();
	                // 赠送金额
	                var sumGiveMoney = $(self).find('td[data-type="sumGiveMoney"]').text();
					// 赠送金额
	                var addTime = $(self).find('td[data-type="date"]').text();

	                // 点击储值卡明细
					if (type == 'storedDetailed') {

						// 如果是单个日期并且是第二层点击储值卡明细
						if (sign == 1 && hierarchy == 2){
							var paystosopvalstat = {
								'start_date': stoData.start_date,
								'end_date': stoData.end_date,
								'shop_ids': shopId,
								'pay_type_ids': 'all',
								'type': 2,
								'name': name // 导航用到的
							}
							Cache.set('paystosopvalstat',paystosopvalstat);
							// url后面带的参数sign=1单个日期，click=2点击的上面的，hierarchy=3点击之后是第三层
							window.location.replace('quickPaymentDet.html?sign=1&click=2&hierarchy=3');
						}

						// 如果是多个日期并且是第一层点击储值卡明细
						if (sign == 2 && hierarchy == 1){
							var paystosopvalstat = {
								'start_date': stoData.start_date,
								'end_date': stoData.end_date,
								'shop_ids': shopId,
								'pay_type_ids': 'all',
								'type': 2
							}
							Cache.set('paystosopvalstat',paystosopvalstat);
							// url后面带的参数sign=2多个日期，click=2点击的上面的，hierarchy=2点击之后是第二层
							window.location.replace('quickPaymentDet.html?sign=2&click=2&hierarchy=2');
						}
						

						
	                }

	                // 点击日期明细
					if (type == 'dateDetailed') {

						// 如果是多个日期并且是第一层点击日期明细
						if (sign == 2 && hierarchy == 1){
							var paystosopvalstat = {
								'start_date': stoData.start_date,
								'end_date': stoData.end_date,
								'shop_ids': shopId,
								'pay_type_ids': 'all',
								'type': 3,
								'name': name // 导航用到的
							}
							Cache.set('paystosopvalstat',paystosopvalstat);
							// url后面带的参数sign=2多个日期，click=2点击的上面的，hierarchy=2点击之后是第二层，way=1店铺，点击店铺在点击到日期的
							window.location.replace('quickShopPaymentStatcal.html?sign=2&click=2&hierarchy=2&way=1');
						}

						// 如果是多个日期并且是第二层点击日期明细
						if (sign == 2 && hierarchy == 2) {
							var paystosopvalstat = {
								'start_date': stoData.start_date,
								'end_date': stoData.end_date,
								'shop_ids': shopId,
								'pay_type_ids': payTypeids,
								'type': 3
							}
							Cache.set('paystosopvalstat',paystosopvalstat);
							// url后面带的参数sign=2多个日期，click=2点击的上面的，hierarchy=3点击之后是第三层
							window.location.replace('quickShopPaymentStatcal.html?sign=2&click=2&hierarchy=3');
						}

	                }
				});


			}

		}

		StoredValueStatistical.init();

});
