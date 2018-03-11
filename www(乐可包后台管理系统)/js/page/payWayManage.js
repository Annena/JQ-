$(function () {

	// 支付方式
		
		// 定义状态参数 0:正常，1：下架，默认是0显示正常c列表
        var payStatus = 0;
        // 从缓存中得到用户是否有添加修改权限
        var perIsEdit = Cache.get('perIsEdit');

        var pay_type_data = {};

		var PayWayManage = {

			init: function () {
				var self = this;
				// 判断如果等于undefined说明没有添加修改权限
				if (perIsEdit['支付方式添加修改'] == undefined) {
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
					this.PayWayData(payStatus);
				}

				// 绑定点击事件
				this.PayWayBind();
			},

			// 显示数据 正常
			PayWayData: function (payStatus) {
				// 显示数据之前先清空列表数据
				$('#paynormal').html('');
				var self = this;
                setAjax(AdminUrl.payTypePayTypeList, {
                    'pay_type_status': payStatus
                }, $('#prompt-message'), {20: ''}, function(respnoseText) {
					// 得到返回数据
                    pay_type_data = respnoseText.data;
                    self.PayWayList(pay_type_data);
                }, 1);
			},

			// 显示数据
			PayWayList: function (data) {
				var content = '';

				for (var i in data) {
					var attribute = '';

					if (data[i].is_receipts == 1) {
						attribute += ' 计入实收 ;';
					}
					if (data[i].is_preferential == 1) {
						attribute += ' 计入优惠 ;';
					}
					if (data[i].receipts_integral == 1) {
						attribute += ' 实收参与积分 ;';
					}
					if (data[i].preferential_integral == 1) {
						attribute += ' 优惠参与积分 ;';
					}
					if(data[i].pay_type_id.indexOf("ct00000") != -1 || data[i].pay_type_id.indexOf("ctplatform") != -1){
						continue;
					}
					content += '<tr class="total-tr" pay-type-id="' + data[i].pay_type_id + '">' +
	                                '<td data-type="payTypedid">' + data[i].pay_type_did + '</td>' +
	                                '<td data-type="payTypename">' + data[i].pay_type_name + '</td>' +
	                                '<td class="savesadd">' + attribute + '</td>' +
	                                '<td class="hide" data-type="is_receipts">' + data[i].is_receipts + '</td>' +
	                                '<td class="hide" data-type="receipts_integral">' + data[i].receipts_integral + '</td>' +
	                                '<td class="hide" data-type="preferential_integral">' + data[i].preferential_integral + '</td>' +
	                                '<td class="hide" data-type="is_preferential">' + data[i].is_preferential + '</td>' +
	                                '<td data-type="payTypeinfo">' + data[i].pay_type_info + '</td>' +
	                                (perIsEdit['支付方式添加修改'] == undefined ? '' :
	                                '<td class="total-caozuo">' + '<span><input type="button" value="修改" data-type="update" class="stores-caozuo-btn"></span>' + '</td>' )+
								'</tr>';
				}
				// 添加到页面中
				$('#paynormal').html(content);

				// 调用拖拽方法，jQuery UI 里面的方法
				$("#paynormal").sortable();
				// 只能垂直拖拽
				$("#paynormal").sortable({ axis: "y" });
				// 约束在盒子里
				$("#paynormal").sortable({ containment: "parent" });
				// 当排序动作开始时触发此事件
				$("#paynormal").sortable({ start: function(event, ui) {
					$('#pay_type_sort_b').removeClass('hide');
				}});
			},

			// 绑定点击事件
			PayWayBind: function () {

				// 点击修改
				var _self = this;
				// 点击修改
				$('#paynormal').delegate('tr', 'click', function(event) {
                    var self = this,
                    payTypeid = $(self).attr('pay-type-id'),
                    type = $(event.target).attr('data-type');

                    if (type == 'update') {


	                    var payWay = {
							'pay_type_id': payTypeid,
							'pay_type_did': pay_type_data[payTypeid].pay_type_did,
							'pay_type_status': payStatus,
							'pay_type_name': pay_type_data[payTypeid].pay_type_name,
							'pay_type_info': pay_type_data[payTypeid].pay_type_info,
							'is_receipts': pay_type_data[payTypeid].is_receipts,
							'receipts_integral': pay_type_data[payTypeid].receipts_integral,
							'is_preferential': pay_type_data[payTypeid].is_preferential,
							'preferential_integral': pay_type_data[payTypeid].preferential_integral,
							'is_member_price': pay_type_data[payTypeid].is_member_price,
							'is_member_discount': pay_type_data[payTypeid].is_member_discount
	                    };
	                    Cache.set('payWay',payWay);

						window.location.replace('payWayEdit.html?v= ' + version + '&pay_type_id='+payTypeid+'&type='+payStatus);
					}
				});

				// 点击添加
				$('#consumebtn').unbind('click').bind('click', function () {
					window.location.replace('payWayEdit.html?v=' + version + '&type='+payStatus);
				});

				// 保存排序
				$('#pay_type_sort').unbind('click').bind('click', function () {
					_self.pay_type_sort_ajax();
				});

				// 点击支付方式
				$('#normal').unbind('click').bind('click', function () {
					_self.clickLabel(0);
				});
				// 点击下架列表
				$('#shelves').unbind('click').bind('click', function () {
					_self.clickLabel(1);
				});

			},

			// 请求排序接口
			pay_type_sort_ajax: function () {
                var menu_sorts_array = {};
				var num = 0;
                $("#paynormal").find('tr').each(function() {
                    menu_sorts_array[num] = $(this).attr('pay-type-id');
                    num++;
                });

	            setAjax(AdminUrl.pay_type_sort, {
	            	'pay_type_sorts': JSON.stringify(menu_sorts_array)
	            }, $('#prompt-message'), {20: ''}, function(respnoseText) {
					// 得到返回数据
                    var data = respnoseText.data;
                    if (respnoseText.code == 20) {
						displayMsg($('#prompt-message'), respnoseText.message, 2000);
						$('#pay_type_sort_b').addClass('hide');
                    } else {
						displayMsg($('#prompt-message'), respnoseText.message, 2000);
                    }
                }, 0);
			},

			// 点击标签页显示隐藏 调用数据
			clickLabel: function (type) {
				var _self = this;

				switch(type) {
					case 0:
						// $('paynormal').removeClass('hide');
						$('payshelves').addClass('hide');
						$('#shelves').removeClass('caipin-fenleicheck');
						$('#shelves').addClass('caipin-fenleinucheck');
						$('#normal').addClass('caipin-fenleicheck');
						$('#normal').removeClass('caipin-fenleinucheck');

						_self.PayWayData(0);

						payStatus = 0;
					break;
					case 1:
						// $('paynormal').addClass('hide');
						$('#shelves').addClass('caipin-fenleicheck');
						$('#shelves').removeClass('caipin-fenleinucheck');
						$('#normal').removeClass('caipin-fenleicheck');
						$('#normal').addClass('caipin-fenleinucheck');
						
						_self.PayWayData(1);

						payStatus = 1;
					break;
				}
			}
		}

		PayWayManage.init();

});
