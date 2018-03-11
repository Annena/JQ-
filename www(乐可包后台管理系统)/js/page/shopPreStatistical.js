$(function () {

	// 优惠方案统计----日期

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

        // 获取到缓存
        var stoData = Cache.get('preferentstat');

        var stData = '';
        var enData = '';

		var StoredValueStatistical = {

			init: function () {
				$('#Navigation').html('优惠方案统计');
				// 如果sign==undefined说明是单个日期就显示默认时间hierarchy == undefined说明是第一层
				if (sign == undefined && hierarchy == undefined) {
					// 因为当前是日期页面并且是第一层所以sign=1表示单个日期
					sign = 2;
					hierarchy = 1;
					// 默认显示当前时间
					$("#start-date").val(getLocalDate());
					$("#end-date").val(getLocalDate());
				} else if (sign == 2 && hierarchy == 1) {//如果是多个日期并且是第一层
					$("#start-date").val(stoData.start_date);
					$("#end-date").val(stoData.end_date);
					// 导航条显示
					$('#Navigation').html('优惠方案统计 >> '+stoData.start_date+'至'+stoData.end_date);
					// 从缓存中取到要请求的值请求获取数据
					this.StoredData(stoData.start_date, stoData.end_date, shopshopid, stoData.promo_ids);
				}
				// 如果是多个日期并且是第二层
				if (sign == 2 && hierarchy == 2) {
					// 隐藏标题列的（操作）
					$('#operationDisplay').addClass('hide');
					// 隐藏上面搜索框
					$('#isDate').addClass('hide');
					// 从缓存中取到要请求的值请求获取数据
					this.StoredData(stoData.start_date, stoData.end_date, shopshopid, stoData.promo_ids);

					// 导航条显示
					$('#Navigation').html('<b id="stat">优惠方案统计 </b>>> <b id="statDis">'+stoData.start_date+'至'+stoData.end_date+'</b>>>'+stoData.name);
				} else {
					$('#operationDisplay').removeClass('hide');
					// 显示搜索框
					$('#isDate').removeClass('hide');
				}

				// 绑定点击事件
				this.StoredBind();
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

				// 导航点击跳转回多个日期按店铺或优惠方案查询
				$('#statDis').unbind('click').bind('click', function () {
					var preferentstat = {
						'start_date': stoData.start_date,
						'end_date': stoData.end_date,
						'shop_ids': shopshopid,
						'promo_ids': 'all',
						'type': 2
					}
					// 这个缓存是存储导航条日期的
					Cache.set('preferentstat',preferentstat);

					window.location.replace('shopPrePlanStat.html?sign=2&click=2&hierarchy=1');
					
				});


				// 点击搜索
				$('#selectbtn').unbind('click').bind('click', function () {
					var startdate = $('#start-date').val();
					var endDate = $('#end-date').val();
					// 导航条显示
					$('#Navigation').html('优惠方案统计 >> '+startdate+'至'+endDate);
					_self.StoredData(startdate, endDate, shopshopid, 'all');
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

	                // 统计日期
	                var date = $(self).find('td[data-type="date"]').text();
	                // 消费金额
	                var sumStoredMoney = $(self).find('td[data-type="sumStoredMoney"]').text();
	                // 支付金额
	                var sumGiveMoney = $(self).find('td[data-type="sumGiveMoney"]').text();

					if (type == 'storedDetailed') {// 点击优惠方案明细

				    	// 如果是单个日期并且是第一层点击店铺明细
						if (sign == 2 && hierarchy == 1){
							var preferentstat = {
								'start_date': date,
								'end_date': date,
								'shop_ids': shopshopid,
								'promo_ids': 'all',
								'type': 2
							}
							Cache.set('preferentstat',preferentstat);
							// url后面带的参数sign=1单个日期，click=2点击的上面的，hierarchy=2点击之后是第二层
							window.location.replace('shopPrePlanStat.html?sign=2&click=2&hierarchy=2');
						}
	                }
				});

				
			},

			// 请求显示搜索出来的数据
			StoredData: function (startdate, endDate, shopIds, promoIds) {
				// 搜索数据出来之前先清空列表数据
				$('#tbodys').html('');
				var self = this;

                setAjax(AdminUrl.promoCountFirst, {
                    'start_date': startdate,
                    'end_date': endDate,
                    'shop_ids': shopIds,
                    'promo_ids': promoIds,
                    'type': 3
                }, $('#prompt-message'), {20: ''}, function(respnoseText) {
					// 日期赋值给公共变量
					stData = startdate;
					enData = endDate;
					// 得到返回数据
                    var data = respnoseText.data;
                    self.StoredList(data);
                }, 1);
			},

			// 显示搜索出来的数据
			StoredList: function (data) {
				//var wer = stoData.pay_type_ids;

				var content = '';
				// 消费总金额
				var money = 0;
				// 支付总金额
				var pay_money = 0;

				for (var i in data) {
					content += '<tr class="total-tr" promo-id="'+data[i].promo_ids+'" shop-id="'+data[i].shop_id+'">'+
			 						'<td class="total-addr" data-type="date">'+i+'</td>'+
									'<td class="total-tel" data-type="sumStoredMoney">'+data[i].money+'</td>'+
									'<td class="total-tel" data-type="sumGiveMoney">'+data[i].pay_money+'</td>'+
									// 如果是多个日期并且是第三层的话，就不显示按钮
									(sign == 2 && hierarchy == 2 ? '' :
									'<td class="total-caozuo clearfix">'+
										// 如果是多个日期并且是第二层并且上一次点击的是店铺，就显示优惠方案明细
										(sign == 2 && hierarchy == 1 ?
										'<span>'+
											'<input type="button" value="优惠方案明细" data-type="storedDetailed" class="stores-caozuo-btn">'+
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
								// 如果是多个日期并且是第三层的话，就不显示按钮
								(sign == 2 && hierarchy == 2 ? '' :
								'<td class="total-caozuo clearfix">'+
									// 如果是多个日期并且是第二层并且上一次点击的是优惠方案，就显示店铺明细
									(sign == 2 && hierarchy == 1 ?
									'<span>'+
										'<input type="button" value="优惠方案明细" id="totalStoredDetailed" class="stores-caozuo-btn">'+
									'</span>':'')+
			                    '</td>')+
			    			'</tr>';

				// 添加到页面中
				$('#tbodys').html(content);

				// 总计优惠方案明细
				$('#totalStoredDetailed').unbind('click').bind('click', function () {

						// 如果是第一层点击总计旁边的优惠方案，是多个日期
						if (hierarchy == 1) {
							var preferentstat = {
								'start_date': stData,
								'end_date': enData,
								'shop_ids': shopshopid,
								'promo_ids': 'all',
								'type': 2
							}
							Cache.set('preferentstat',preferentstat);
							// url后面带的参数sign=2多个日期，click=1点击的下面的，hierarchy=1点击之后是第一层
							window.location.replace('shopPrePlanStat.html?sign=2&click=1&hierarchy=1');
						}
				});
			}

		}

		StoredValueStatistical.init();

});
