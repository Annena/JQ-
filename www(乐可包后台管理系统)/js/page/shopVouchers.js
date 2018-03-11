$(function () {

	// 门店后台   抵用劵列表
		// 定义状态参数 0:正常，1：下架，默认是0显示正常列表
        var vouStatus = 0;

		var VouchersManage = {

			init: function () {
				// 显示数据
				this.VouchersData(vouStatus);
				// 绑定点击事件
				this.VouchersBind();
			},

			// 请求显示数据
			VouchersData: function (vouStatus) {
				// 请求显示列表之前显示清空列表数据
				$('#tbodys').html('');

				var self = this;
                setAjax(AdminUrl.voucherVoucherList, {
                    'vou_status': vouStatus
                }, $('#prompt-message'), {20: ''}, function(respnoseText) {
					// 得到返回数据
                    var data = respnoseText.data;
                    // 显示数据
                    self.VouchersList(data);
                }, 1);
			},

			// 显示数据
			VouchersList: function (data) {
					var content = '';

					for (var i in data) {
						content += '<tr class="total-tr" voucher-id="'+data[i].voucher_id+'">'+
				                        '<td class="tdjianju">'+data[i].voucher_name+'</td>'+
				                        '<td class="tdjianju">'+data[i].voucher_money+'</td>'+
				                        '<td class="tdjianju">'+data[i].low_consume+'</td>'+
				                        '<td class="tdjianju">'+data[i].shop_info+'</td>'+
				                        '<td class="tdjianju">'+getAppointTime(data[i].start_time)+'</td>'+
				                        '<td class="tdjianju">'+getAppointTime(data[i].end_time)+'</td>'+
				                        '<td class="tdjianju">'+(data[i].give_out == 1 ? '消费返赠' : '')+'</td>'+
				                    '</tr>';
					}
					// 添加到页面中
					$('#tbodys').html(content);
			},

			// 绑定点击事件
			VouchersBind: function () {
				var self = this;

				// 点击抵用劵列表
				$('#vouchersMan').unbind('click').bind('click', function () {
					// 点击抵用劵列表，删除不选中的样式，添加选中的样式
					$('#vouchersMan').removeClass('caipin-fenleinucheck');
					$('#vouchersMan').addClass('caipin-fenleicheck');
					// 下架列表，删除选中样式，添加不选中的样式
					$('#vouchersShe').removeClass('caipin-fenleicheck');
					$('#vouchersShe').addClass('caipin-fenleinucheck');


					self.VouchersData(0);
				});

				// 点击下架列表
				$('#vouchersShe').unbind('click').bind('click', function () {
					// 点击下架列表，删除不选中的样式，添加选中的样式
					$('#vouchersShe').removeClass('caipin-fenleinucheck');
					$('#vouchersShe').addClass('caipin-fenleicheck');
					// 抵用劵列表，删除选中样式，添加不选中的样式
					$('#vouchersMan').removeClass('caipin-fenleicheck');
					$('#vouchersMan').addClass('caipin-fenleinucheck');

					self.VouchersData(1);
				});
			} 
		}

		VouchersManage.init();

});
