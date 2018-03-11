$(function () {

	// 抵用劵管理
		
		// 定义状态参数 0:正常，1：下架，默认是0显示正常列表
        var vouStatus = 0;
        // 从缓存中得到用户是否有添加修改权限
        var perIsEdit = Cache.get('perIsEdit');
        var is_edit = 0;  // 0 可以 1 不可以

		var VouchersManage = {

			init: function () {
				var self = this;
				// 判断如果等于undefined说明没有添加修改权限
				if (perIsEdit['抵用劵添加修改'] == undefined) {
					$('#permissions').addClass('hide');
					$('#operation').addClass('hide');
					is_edit = 1;
				} else {
					is_edit = 0;
					$('#permissions').removeClass('hide');
					$('#operation').removeClass('hide');
				}

				// 是否从添加修改 返回回来的
				if (getQueryString('is_select') == 1) {
					self.clickLabel(parseFloat(getQueryString('type')));
				} else {
					// 显示数据
					this.VouchersData(vouStatus);
				}

				// 绑定点击事件
				this.VouchersBind();
			},

			// 请求显示数据
			VouchersData: function (vouStatus) {
				var self = this;
				// 请求显示数据之前先清空列表数据
				$('#tbodys').html('');

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

					var startTime = '';
					var endTime = '';

					// 抵金额还是抵数量
					//var is_money = '';

					//alert(new Date(year,month,day+1));
					for (var i in data) {
						// 如果等于0说明当日有效
						if (data[i].start_time == 0) {
							startTime = '当日生效';
							endTime = '有效天数'+data[i].end_time+'天';
						} else if (data[i].start_time == 1) {// 如果等于1说明次日有效
							startTime = '次日生效';
							endTime = '有效天数'+data[i].end_time+'天';
						} else {// 否则说明是正常的日期
							startTime = getAppointTime(data[i].start_time);
							endTime = getAppointTime(data[i].end_time);
						}

						/*if (data[i].voucher_money != 0 && data[i].voucher_num == 0) {
							is_money = '抵金额'+data[i].voucher_money+'元';
						} else if (data[i].voucher_num != 0 && data[i].voucher_money == 0) {
							is_money = '抵数量'+data[i].voucher_num+'个';
						}*/

						content += '<tr class="total-tr" voucher-id="'+data[i].voucher_id+'">'+
				                        '<td class="tdjianju" data-type="voucherName">'+data[i].voucher_name+'</td>'+
				                        //'<td class="tdjianju">'+is_money+'</td>'+
				                        '<td class="tdjianju">'+data[i].voucher_money+'</td>'+
				                        '<td class="tdjianju" data-type="lowConsume">'+data[i].low_consume+'</td>'+
				                        '<td class="tdjianju" data-type="shopIds">'+data[i].shop_info+'</td>'+
				                        '<td class="hide" data-type="shopInfo">'+data[i].shop_ids+'</td>'+
				                        '<td class="tdjianju">'+startTime+'</td>'+
				                        '<td class="tdjianju">'+endTime+'</td>'+
				                        '<td class="hide" data-type="startTime">'+data[i].start_time+'</td>'+
				                        '<td class="hide" data-type="endTime">'+data[i].end_time+'</td>'+
				                        '<td class="hide" data-type="voucherMoney">'+data[i].voucher_money+'</td>'+
				                        '<td class="tdjianju" data-type="giveOut">'+(data[i].give_out == 1 ? '消费返赠' : '')+'</td>'+
				                        (perIsEdit['抵用劵添加修改'] == undefined ? '' :
				                        '<td class="total-caozuo" clearfix>'+
				                            '<span>'+
				                            	'<input type="button" value="修改" data-type="update" class="stores-caozuo-btn">'+
				                            '</span>'+
				                        '</td>')+
				                    '</tr>';
					}
					// 添加到页面中
					$('#tbodys').html(content);
			},

			// 请求接口显示限制单数
			voucheLimit: function () {
				var self = this;

                setAjax(AdminUrl.infoVoucherTriesLimit, {}, $('#prompt-message'), {20: ''}, function(respnoseText) {
					// 得到返回数据
                    var data = respnoseText.data;
                    // 显示数据
                    if (data == 0) {
						$('#radio_no').prop('checked', true);
						$('#radio_yes').prop('checked', false);
						$('#limitNum').val(0);
                    } else {
						$('#radio_no').prop('checked', false);
						$('#radio_yes').prop('checked', true);
						$('#limitNum').val(data);
					}
                }, 1);
			},

			// 绑定点击事件
			VouchersBind: function () {
				var self = this;
				// 点击修改
				$('#tbodys').delegate('tr', 'click', function(event) {
                    var self = this,
                    voucherId = $(self).attr('voucher-id'),
                    type = $(event.target).attr('data-type');

                    if (type == 'update') {
	                    // 点击修改的时候，创建一个数据，存储要修改的这一行的信息，然后存到缓存中，到修改页面取出来填充到页面中去
	                    // 员工姓名和门店
	                    var voucherName = $(self).find('td[data-type="voucherName"]').text();
	                    var voucherMoney =$(self).find('td[data-type="voucherMoney"]').text();
	                    var lowConsume =$(self).find('td[data-type="lowConsume"]').text();
	                    var shopIds =$(self).find('td[data-type="shopInfo"]').text();
	                    var startTime =$(self).find('td[data-type="startTime"]').text();
	                    var endTime =$(self).find('td[data-type="endTime"]').text();
	                    var giveOut =$(self).find('td[data-type="giveOut"]').text();
	                    if (giveOut == '消费返赠') {
	                    	giveOut = 1;
	                    }



	                    var vouUp = {
							'voucher_id': voucherId,
							'vou_status': vouStatus,
							'voucher_name': voucherName,
							'voucher_money': voucherMoney,
							'low_consume': lowConsume,
							'shop_ids': shopIds,
							'start_time': startTime,
							'end_time': endTime,
							'give_out': giveOut
	                    };
	                    Cache.set('vouUp',vouUp);

						window.location.replace('vouchersEdit.html?voucher_id='+voucherId+'&type='+vouStatus);
					}
				});

				// 点击抵用劵列表
				$('#vouchersMan').unbind('click').bind('click', function () {
					self.clickLabel(0);
				});

				// 点击下架列表
				$('#vouchersShe').unbind('click').bind('click', function () {
					self.clickLabel(1);
				});

				// 点击每日领用限制
				$('#vouchersLimit').unbind('click').bind('click', function () {
					self.clickLabel(2);
				});

				// 输入限制数量校验，只能输入数字
				$('#limitNum').unbind('input').bind('input', function () {
					var num1 = $(this).val();
					//正则表达式验证必须为数字或者两位小数
		            var numPro = /^\d*$/;
		            //查找输入字符第一个为0
		            var resultle = num1.substr(0,1);
		            var result2 = num1.substr(1,1);
		            if(numPro.test(num1)){
		                if(resultle == 0 && num1.length > 1 && result2 != '.'){
						    //替换0为空
						    $(this).val(num1.replace(/0/,""));
						    if(num1.substr(0,1) == '.'){
						        $(this).val(0);
						    }
						}
		                if (num1 == '') {
		                    $(this).val(0);
		                }
		            }else{
		                $(this).val(0);
		            }
				});

				// 点击每日领用限制 保存按钮
				$('#limitbtn').unbind('click').bind('click', function () {
					var num = 0;
					var is_num = 0;
					if ($('#radio_no').is(':checked')) {
						num = 0;
						is_num = 0;
					} else {
						num = $('#limitNum').val();
						is_num = 1;
					}

					if (is_num == 1 && num == 0) {
						displayMsg(ndPromptMsg, '限制数必须大于0！', 2000);
						return;
					}

	                setAjax(AdminUrl.infoVoucherTriesLimitUp, {
	                    'voucher_tries_limit': num
	                }, $('#prompt-message'), {20: ''}, function(respnoseText) {
						// 得到返回数据
	                    var data = respnoseText.data;
	                    // 显示数据
	                    displayMsg(ndPromptMsg, respnoseText.message, 2000);
	                    if (is_num == 0) {
	                    	$('#limitNum').val(0);
	                	}
	                }, 1);
				});

				// 点击添加
				$('#updatebtn').unbind('click').bind('click', function () {
					window.location.replace('vouchersEdit.html?type='+vouStatus);
				});
			},

			// 点击标签页显示隐藏 调用数据
			clickLabel: function (type) {
				var self = this;

				switch(type) {
					case 0:
						// 点击抵用劵列表，删除不选中的样式，添加选中的样式
						$('#vouchersMan').removeClass('caipin-fenleinucheck');
						$('#vouchersMan').addClass('caipin-fenleicheck');
						// 下架列表，每日领用限额，删除选中样式，添加不选中的样式
						$('#vouchersShe,#vouchersLimit').removeClass('caipin-fenleicheck');
						$('#vouchersShe,#vouchersLimit').addClass('caipin-fenleinucheck');

						$('#vouchersList').removeClass('hide');
						$('#dayLimit,#limitDispalay').addClass('hide');
						if (is_edit == 0) {
							$('#permissions').removeClass('hide');
						}


						self.VouchersData(0);

						// 把状态存到缓存，然后到传到修改页面
						vouStatus = 0;
					break;
					case 1:
						// 点击下架列表，删除不选中的样式，添加选中的样式
						$('#vouchersShe').removeClass('caipin-fenleinucheck');
						$('#vouchersShe').addClass('caipin-fenleicheck');
						// 抵用劵列表，每日领用限额，删除选中样式，添加不选中的样式
						$('#vouchersMan,#vouchersLimit').removeClass('caipin-fenleicheck');
						$('#vouchersMan,#vouchersLimit').addClass('caipin-fenleinucheck');

						$('#vouchersList').removeClass('hide');
						$('#dayLimit,#limitDispalay').addClass('hide');
						if (is_edit == 0) {
							$('#permissions').removeClass('hide');
						}

						self.VouchersData(1);

						// 把状态存到缓存，然后到传到修改页面
						vouStatus = 1;
					break;
					case 2:
						// 点击每日领用限额，删除不选中的样式，添加选中的样式
						$('#vouchersLimit').removeClass('caipin-fenleinucheck');
						$('#vouchersLimit').addClass('caipin-fenleicheck');
						// 抵用劵列表，下架列表，删除选中样式，添加不选中的样式
						$('#vouchersMan,#vouchersShe').removeClass('caipin-fenleicheck');
						$('#vouchersMan,#vouchersShe').addClass('caipin-fenleinucheck');

						$('#vouchersList,#permissions').addClass('hide');
						$('#dayLimit').removeClass('hide');

						// 判断如果等于undefined说明没有修改权限
						if (perIsEdit['抵用劵管理限制次数'] == undefined) {
							$('#limitDispalay').addClass('hide');
							$('#dayLimit').find('input').attr('disabled','disabled');
						} else {
							$('#limitDispalay').removeClass('hide');
						}

						// 请求接口显示限制单数
						self.voucheLimit();
					break;
				}
			}
		}

		VouchersManage.init();

});
