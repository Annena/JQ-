$(function () {

	// 门店后台  优惠方案列表

		// ipad滚动条无法滚动的解决
		scrollHei('.stores-nav', '.stores-content', '.stafffloatdiv');
		// 定义状态参数 0:正常，1：下架，默认是0显示正常列表
        var promoStatus = 0;

		var PreferentiaManage = {

			init: function () {
				//alert('dd');
				// 显示数据
				this.PreferentiaData(promoStatus);
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

					for (var i in data) {
						content += '<tr class="total-tr" promo-id="'+data[i].promo_id+'">'+
				                        '<td class="tdjianju" data-type="promoName">'+data[i].promo_name+'</td>'+
				                        '<td class="tdjianju" >'+getAppointTime(data[i].start_time)+'  至  '+getAppointTime(data[i].end_time)+'</td>'+
				                        '<td class="tdjianju" data-type="lowConsumption">'+data[i].low_consumption+'</td>'+
				                        '<td class="tdjianju" data-type="isAuthorization">'+(data[i].is_authorization == 1 ? '需要' : '不需要')+'</td>'+
				                        '<td class="hide">'+
											'<input type="button" value="查看详情" data-type="seeDetails" class="xiangqingbtn">'+
				                        '</td>'+
				                    '</tr>';
					}
					// 添加到页面中
					$('#tbodys').html(content);
			},

			// 绑定点击事件
			PreferentiaBind: function () {
				var self = this;

				// 点击查看详情
				$('#tbodys').delegate('tr', 'click', function(event) {
					var self = this,
                    promoId = $(self).attr('promo-id'),
                    type = $(event.target).attr('data-type');

                    // 查看详情
                    if (type == 'seeDetails') {
						// 显示弹出框
                        $('#shopPreferntia').removeClass('hide');
                        displayAlertMessage('#shopPreferntia', '#can-alert');


                    }
				});



				// 点击优惠方案列表
				$('#preferentiaMan').unbind('click').bind('click', function () {
					// 点击优惠方案列表，删除不选中的样式，添加选中的样式
					$('#preferentiaMan').removeClass('caipin-fenleinucheck');
					$('#preferentiaMan').addClass('caipin-fenleicheck');
					// 下架列表，删除选中样式，添加不选中的样式
					$('#preferentiaShe').removeClass('caipin-fenleicheck');
					$('#preferentiaShe').addClass('caipin-fenleinucheck');


					self.PreferentiaData(0);
				});

				// 点击下架列表
				$('#preferentiaShe').unbind('click').bind('click', function () {
					// 点击下架列表，删除不选中的样式，添加选中的样式
					$('#preferentiaShe').removeClass('caipin-fenleinucheck');
					$('#preferentiaShe').addClass('caipin-fenleicheck');
					// 优惠方案列表，删除选中样式，添加不选中的样式
					$('#preferentiaMan').removeClass('caipin-fenleicheck');
					$('#preferentiaMan').addClass('caipin-fenleinucheck');

					self.PreferentiaData(1);
				});
			} 
		}

		PreferentiaManage.init();

});
