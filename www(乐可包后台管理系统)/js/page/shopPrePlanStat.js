$(function () {

	// 优惠方案统计---优惠方案


        var shopshopid = $.cookie('shop-shop_id');

        // 传给php的参数中type，1表示店铺，2表示卡片，3表示日期

        // 第几层	1：第一层，2：第二层
        var hierarchy = getQueryString('hierarchy');
        // sign：1：表示单个日期，2：表示多个日期
        var sign = getQueryString('sign');
        // click：1：点击合计，2：点击上面的其他的
        var click = getQueryString('click');
        // way：1：店铺，2：优惠方案，3：日期，只在点总计旁边的按钮进入第二层的时候使用
        var way = getQueryString('way');

        // 从上一个页面传过来的缓存数据
        var stoData = Cache.get('preferentstat');

		var StoredValueStatistical = {

			init: function () {
				// 如果是单个日期并且是第三层就不显示标题列的（操作）
				if (sign == 2 && hierarchy == 2) {
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

				// 如果是单个日期并且是第一层就显示导航条
				if (sign == 2 && hierarchy == 1) {
					// 导航条显示
					$('#Navigation').html('<b id="stat">优惠方案统计 </b>>> '+stoData.start_date+'至'+stoData.end_date+'(按优惠方案)');
				}
				// 如果是多个日期并且是第二层就显示导航条
				if (sign == 2 && hierarchy == 2) {
					// 导航条显示
					$('#Navigation').html('<b id="stat">优惠方案统计 </b>>>'+stoData.start_date);
				}

				//alert(stoData.shop_id);
                setAjax(AdminUrl.promoCountFirst, {
					'start_date': stoData.start_date,
                    'end_date': stoData.end_date,
                    'shop_ids': shopshopid,
                    'promo_ids': stoData.promo_ids,
                    'type': 2
                }, $('#prompt-message'), {20: ''}, function(respnoseText) {
					// 得到返回数据
                    var data = respnoseText.data;
                    self.StoredList(data);
                }, 1);
			},

			// 显示数据
			StoredList: function (data) {

				var content = '';
				// 消费总金额
				var money = 0;
				// 支付总金额
				var pay_money = 0;

				for (var i in data) {
					content += '<tr class="total-tr" promo-id="'+data[i].promo_ids+'" shop-id="'+data[i].shop_id+'">'+
			 						'<td class="total-addr" data-type="name">'+
			 							data[i].promo_name+
			 						'</td>'+
									'<td class="total-tel" data-type="sumStoredMoney">'+data[i].money+'</td>'+
									'<td class="total-tel" data-type="sumGiveMoney">'+data[i].pay_money+'</td>'+
									// 如果是单个日期并且是第三层就不显示按钮
									(sign == 2 && hierarchy == 2 ? '' :
									'<td class="total-caozuo clearfix">'+
										// 如果是多个日期并且是第一层 或者 如果是多个日期并且是第二层 就显示店铺明细和日期明细
										(sign == 2 && hierarchy == 1 ?
										'<span>'+
											'<input type="button" value="日期明细" data-type="dateDetailed" class="stores-caozuo-btn">'+
										'</span>':'')+
			                        '</td>')+
			    				'</tr>';
			    	money += parseFloat(data[i].money);
			    	pay_money += parseFloat(data[i].pay_money);
				}
				content += '<tr class="total-tr">'+
			 					'<td class="total-addr">合计</td>'+
								'<td class="total-tel">'+parseFloat(money).toFixed(2)+'</td>'+
								'<td class="total-tel">'+parseFloat(pay_money).toFixed(2)+'</td>'+
								// 如果是单个日期并且是第三层就不显示合计按钮
								(sign == 2 && hierarchy == 2 ? '' :	
								'<td class="total-caozuo clearfix">'+
									// 如果是多个日期并且是第一层 或者 如果是多个日期并且是第二层 就显示优惠方案明细和日期明细
									(sign == 2 && hierarchy == 1 ?
									'<span>'+
										'<input type="button" value="日期明细" id="dateDetailed" class="stores-caozuo-btn">'+
									'</span>':'')+
			                    '</td>')+
			    			'</tr>';

				// 添加到页面中
				$('#tbodys').html(content);

				// 总计日期明细
				$('#dateDetailed').unbind('click').bind('click', function () {

					// 如果是多个日期并且是第一层点击总计旁边的日期明细
					if (sign == 2 && hierarchy == 1){
						var preferentstat = {
							'start_date': stoData.start_date,
							'end_date': stoData.end_date,
							'shop_ids': shopshopid,
							'promo_ids': 'all',
							'type': 3
						}
						Cache.set('preferentstat',preferentstat);
						// url后面带的参数sign=2多个日期，click=1点击的下面的，hierarchy=1点击之后是第一层
						window.location.replace('shopPreStatistical.html?sign=2&click=1&hierarchy=1');
					}

				});
			},

			// 绑定点击事件
			StoredBind: function () {
				var _self = this;

				// 导航点击跳转会优惠方案统计
				$('#stat').unbind('click').bind('click', function () {
							var preferentstat = {
								'start_date': stoData.start_date,
								'end_date': stoData.end_date,
								'shop_ids': shopshopid,
								'promo_ids': 'all',
								'type': 3
							}
							Cache.set('preferentstat',preferentstat);
							// url后面带的参数sign=2多个日期，click=2点击的上面的，hierarchy=2点击之后是第二层，way=1店铺，点击店铺在点击到日期的
							window.location.replace('shopPreStatistical.html?sign=2&click=2&hierarchy=1&way=1');
				});

				// 点击导出
				$('#dd').unbind('click').bind('click', function () {
					
				});

				// 点击店铺明细优惠方案明细
				$('#tbodys').delegate('tr', 'click', function(event) {
					var self = this,
						shopId = $(self).attr('shop-id'),
						promoIds = $(self).attr('promo-id'),
						type = $(event.target).attr('data-type');

	                // 店铺名称或者卡片名称
	                var name = $(self).find('td[data-type="name"]').text();
	                // 消费金额
	                var sumStoredMoney = $(self).find('td[data-type="sumStoredMoney"]').text();
	                // 支付金额
	                var sumGiveMoney = $(self).find('td[data-type="sumGiveMoney"]').text();

					if (type == 'dateDetailed') {// 点击日期明细

						// 如果是多个日期并且是第一层点击日期明细
						if (sign == 2 && hierarchy == 1){
							var preferentstat = {
								'start_date': stoData.start_date,
								'end_date': stoData.end_date,
								'shop_ids': shopshopid,
								'promo_ids': 'all',
								'type': 3,
								'name': name // 导航用到的
							}
							Cache.set('preferentstat',preferentstat);
							// url后面带的参数sign=2多个日期，click=2点击的上面的，hierarchy=2点击之后是第二层，way=2点击优惠方案在点击日期的
							window.location.replace('shopPreStatistical.html?sign=2&click=2&hierarchy=2&way=2');
						}
	                }
				});

				
			}


		}

		StoredValueStatistical.init();

});
