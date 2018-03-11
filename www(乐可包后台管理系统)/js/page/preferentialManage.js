$(function () {

	// 优惠方案管理


		// 定义状态参数 0:正常，1：下架，默认是0显示正常列表
        var promoStatus = 0;
        // 从缓存中得到用户是否有添加修改权限
        var perIsEdit = Cache.get('perIsEdit');

		var PreferentiaManage = {

			init: function () {
				var self = this;
				// 判断如果等于undefined说明没有添加修改权限
				if (perIsEdit['优惠方案添加修改'] == undefined) {
					$('#permissions').addClass('hide');
					$('#operation').addClass('hide');
				} else {
					$('#permissions').removeClass('hide');
					$('#operation').removeClass('hide');
				}
				// 是否从添加修改 返回回来的
				if (getQueryString('is_select') == 1) {
					self.clickLabel(parseFloat(getQueryString('type')));
				} else {
					// 显示数据
					this.PreferentiaData(promoStatus);
				}

				// 绑定点击事件
				this.PreferentiaBind();
			},

			// 请求显示数据
			PreferentiaData: function (promoStatus) {
				// 请求显示列表数据之前先清空列表数据
				$('#tbodys').html('');

				var self = this;
                setAjax(AdminUrl.promoPromoList, {
                    'promo_status': promoStatus
                }, $('#prompt-message'), {20: ''}, function(respnoseText) {
					// 得到返回数据
                    var data = respnoseText.data;
                    // 显示数据
                    self.PreferentiaList(data);
                }, 1);
			},

			// 显示数据
			PreferentiaList: function (data) {
					var content = '';
					var isAuthorization;
					for (var i in data) {
						if(data[i].is_authorization == 0 ){
							isAuthorization='仅银台使用，不需要授权'
						}else if(data[i].is_authorization == 1){
							isAuthorization='仅银台使用，需要店长授权'
						}else{
							isAuthorization='用户下单可直接使用'
						}
						content += '<tr class="total-tr" promo-id="'+data[i].promo_id+'">'+
				                        '<td class="tdjianju" data-type="promoName">'+data[i].promo_name+'</td>'+
				                        '<td class="tdjianju" >'+getAppointTime(data[i].start_time)+'  至  '+getAppointTime(data[i].end_time)+'</td>'+
				                        '<td class="tdjianju" data-type="lowConsumption">'+data[i].low_consumption+'</td>'+
				                        '<td class="tdjianju" data-type="isAuthorization" value="'+data[i].is_authorization+'">'+isAuthorization+'</td>'+
				                        (perIsEdit['优惠方案添加修改'] == undefined ? '' :
				                        '<td class="total-caozuo clearfix">'+
				                            '<span>'+
				                            	'<input type="button" value="修改" data-type="update" class="stores-caozuo-btn">'+
				                            '</span>'+
				                        '</td>')+
				                        '<td class="hide" data-type="isAuto">'+data[i].is_auto+'</td>'+
				                        '<td class="hide" data-type="startTime">'+data[i].start_time+'</td>'+
				                        '<td class="hide" data-type="endTime">'+data[i].end_time+'</td>'+
										'<td class="hide" data-type="isRepeat">'+data[i].is_repeat+'</td>'+
				                        '<td class="hide" data-type="giveMenuId">'+data[i].give_menu_id+'</td>'+
				                        '<td class="hide" data-type="giveVoucherId">'+data[i].give_voucher_id+'</td>'+
				                        '<td class="hide" data-type="give_voucher_num">'+data[i].give_voucher_num+'</td>'+
				                        '<td class="hide" data-type="discountMenuTypeIds">'+JSON.stringify(data[i].discount_menu_type_ids)+'</td>'+
				                        '<td class="hide" data-type="discountAmount">'+data[i].discount_amount+'</td>'+
				                        '<td class="hide" data-type="shopIds">'+data[i].shop_ids+'</td>'+
										'<td class="hide" data-type="minusamount">'+data[i].minus_amount+'</td>'+
										'<td class="hide" data-type="minusisrepeat">'+data[i].minus_is_repeat+'</td>'+
				                    '</tr>';
					}
					// 添加到页面中
					$('#tbodys').html(content);
			},

			// 绑定点击事件
			PreferentiaBind: function () {
				var self = this;
				// 点击修改
				$('#tbodys').delegate('tr', 'click', function(event) {
                    var self = this,
                    promoId = $(self).attr('promo-id'),
                    type = $(event.target).attr('data-type');

                    if (type == 'update') {
	                    // 点击修改的时候，创建一个数据，存储要修改的这一行的信息，然后存到缓存中，到修改页面取出来填充到页面中去

						// 方案名称
	                    var promoName = $(self).find('td[data-type="promoName"]').text();
	                    // 是否自动，1自动0手动
	                    var isAuto =$(self).find('td[data-type="isAuto"]').text();
	                    //alert(isAuto);
	                    // 是否店长授权
	                    var isAuthorization =$(self).find('td[data-type="isAuthorization"]').attr('value');
	                    //alert(isAuthorization);
	                    // 门店集合
	                    var shopIds =$(self).find('td[data-type="shopIds"]').text();
	                    // 开始时间结束时间
	                    var startTime =$(self).find('td[data-type="startTime"]').text();
	                    var endTime =$(self).find('td[data-type="endTime"]').text();
	                    // 是否累计
	                    var isRepeat =$(self).find('td[data-type="isRepeat"]').text();

	                    // 最低消费
	                    var lowConsumption =$(self).find('td[data-type="lowConsumption"]').text();
	                    // 赠送菜品
	                    var giveMenuId =$(self).find('td[data-type="giveMenuId"]').text();
	                    // 赠送抵用劵
	                    var giveVoucherId =$(self).find('td[data-type="giveVoucherId"]').text();
	                    // 赠送抵用劵数量
	                    var give_voucher_num =$(self).find('td[data-type="give_voucher_num"]').text();
	                    // 折扣菜品
	                    var discountMenuTypeIds =$(self).find('td[data-type="discountMenuTypeIds"]').text();
	                    // 折扣额度
	                    var discountAmount =$(self).find('td[data-type="discountAmount"]').text();
						//立减金额
						var minusamount =$(self).find('td[data-type="minusamount"]').text();
						//立减累计
						var minusisrepeat =$(self).find('td[data-type="minusisrepeat"]').text();

	                    var preUp = {
							'promo_id': promoId,
							'promo_name': promoName,
							'minus_amount': minusamount,
							'minus_is_repeat':minusisrepeat,
							'is_auto': isAuto,
							'is_authorization': isAuthorization,
							'shop_ids': shopIds,
							'start_time': startTime,
							'end_time': endTime,
							'is_repeat': isRepeat,
							'low_consumption': lowConsumption,
							'give_menu_id': giveMenuId,
							'give_voucher_id': giveVoucherId,
							'give_voucher_num': give_voucher_num,
							'discount_menu_type_ids': discountMenuTypeIds,
							'discount_amount': discountAmount,
							'promo_status': promoStatus
	                    };
	                    Cache.set('preUp',preUp);

						window.location.replace('preferentiaEdit.html?promo_id='+promoId+'&type='+promoStatus);
					}
				});

				// 点击优惠方案列表
				$('#preferentiaMan').unbind('click').bind('click', function () {
					self.clickLabel(0);
				});

				// 点击下架列表
				$('#preferentiaShe').unbind('click').bind('click', function () {
					self.clickLabel(1);
				});

				// 点击添加
				$('#updatebtn').unbind('click').bind('click', function () {
					window.location.replace('preferentiaEdit.html?type='+promoStatus);
				});
			},

			// 点击标签页显示隐藏 调用数据
			clickLabel: function (type) {
				var self = this;

				switch(type) {
					case 0:
						// 点击优惠方案列表，删除不选中的样式，添加选中的样式
						$('#preferentiaMan').removeClass('caipin-fenleinucheck');
						$('#preferentiaMan').addClass('caipin-fenleicheck');
						// 下架列表，删除选中样式，添加不选中的样式
						$('#preferentiaShe').removeClass('caipin-fenleicheck');
						$('#preferentiaShe').addClass('caipin-fenleinucheck');


						self.PreferentiaData(0);

						promoStatus = 0;
					break;
					case 1:
						// 点击下架列表，删除不选中的样式，添加选中的样式
						$('#preferentiaShe').removeClass('caipin-fenleinucheck');
						$('#preferentiaShe').addClass('caipin-fenleicheck');
						// 优惠方案列表，删除选中样式，添加不选中的样式
						$('#preferentiaMan').removeClass('caipin-fenleicheck');
						$('#preferentiaMan').addClass('caipin-fenleinucheck');

						self.PreferentiaData(1);

						promoStatus = 1;
					break;
				}
			}
		}

		PreferentiaManage.init();

});
