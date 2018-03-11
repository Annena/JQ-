$(function () {

	// 后台门店---储值卡管理

		// ipad滚动条无法滚动的解决
	    scrollHei('.stores-nav', '.stores-content', '.stafffloatdiv');
		// 定义状态参数 0:正常，1：下架，默认是0显示正常列表
        var storedStatus = 0;
 		var shop_ids = $.cookie("shop_id")
		var StoredValueManage = {

			init: function () {
				// 显示数据
				this.StoredValueData(storedStatus);
				// 绑定点击事件
				this.StoredValueBind();
			},

			// 请求显示数据
			StoredValueData: function (storedStatus) {
				// 请求显示列表数据之前先清空列表数据
				$('#tbodys').html('');
				
				var self = this;
                setAjax(AdminUrl.storetStoredList, {
                    'stored_status': storedStatus,
                    'sale_shop_id':shop_ids
                }, $('#prompt-message'), {20: ''}, function(respnoseText) {
					// 得到返回数据
                    var data = respnoseText.data;
                    // 显示数据
                    self.StoredValueList(data);
                }, 1);
			},

			// 显示数据
			StoredValueList: function (data) {
					var content = '';

					var sale = {
						1: '线上售卖+全部门店售卖',
						2: '线上售卖+指定门店售卖',
						3: '仅支持线上售卖',
						4: '仅支持全部门店售卖',
						5: '仅支持指定门店售卖'
					}

					for (var i in data) {
						var st_text = data[i].is_repeat == 0 ? '满' : '每满';

						content += '<tr class="total-tr" stored-id="'+data[i].stored_id+'">'+
				                        '<td class="tdjianju" data-type="storedName">'+data[i].stored_name+'</td>'+
				                        '<td class="tdjianju" data-type="storedMoney">'+(data[i].is_custom == 0 ? data[i].stored_money : '任意金额')+'</td>'+
				                        '<td class="tdjianju" data-type="giveMoney">'+(data[i].is_custom == 0 ? data[i].give_money : (data[i].give_rate == 0 ? 0 : data[i].give_rate+'%'))+'</td>'+
				                        '<td class="tdjianju">'+
				                        ((data[i].give_voucher_id == null || data[i].give_voucher_id == '') ? '无':data[i].give_voucher_name+'<br>'+
				                        	((data[i].give_voucher_money == 0 || data[i].give_voucher_money == null) ? '' 
												: st_text+data[i].give_voucher_money+'元')+'赠'+data[i].give_voucher_num+'张')+
				                        '</td>'+
				                        '<td class="tdjianju" data-type="startTime">'+getAppointTime(data[i].start_time)+'</td>'+
				                        '<td class="tdjianju" data-type="endTime">'+getAppointTime(data[i].end_time)+'</td>'+
				                        '<td class="tdjianju" data-type="saleMode">'+sale[data[i].sale_mode]+'</td>'+
				                    '</tr>';
					}
					// 添加到页面中
					$('#tbodys').html(content);
			},

			// 绑定点击事件
			StoredValueBind: function () {
				var self = this;

				// 点击储值卡列表
				$('#storedMan').unbind('click').bind('click', function () {
					// 点击储值卡列表，删除不选中的样式，添加选中的样式
					$('#storedMan').removeClass('caipin-fenleinucheck');
					$('#storedMan').addClass('caipin-fenleicheck');
					// 下架列表，删除选中样式，添加不选中的样式
					$('#storedShe').removeClass('caipin-fenleicheck');
					$('#storedShe').addClass('caipin-fenleinucheck');


					self.StoredValueData(0);
				});

				// 点击下架列表
				$('#storedShe').unbind('click').bind('click', function () {
					// 点击下架列表，删除不选中的样式，添加选中的样式
					$('#storedShe').removeClass('caipin-fenleinucheck');
					$('#storedShe').addClass('caipin-fenleicheck');
					// 储值卡列表，删除选中样式，添加不选中的样式
					$('#storedMan').removeClass('caipin-fenleicheck');
					$('#storedMan').addClass('caipin-fenleinucheck');

					self.StoredValueData(1);
				});
			} 
		}

		StoredValueManage.init();

});

