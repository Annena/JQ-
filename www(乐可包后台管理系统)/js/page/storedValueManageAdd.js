$(function () {
	// 储值卡添加修改

        // 获取到修改传过来的id
		var storedId = getQueryString('stored_id');
		// 获取到修改传过来的缓存
		var dataStred = Cache.get('stoUp');
		console.log(dataStred);
		// 判断是修改还是添加 0；添加，1：修改
		var addIsUp = getQueryString('addIsUp');
		// 列表修改传过来的赠送抵用劵id
		var giveVoucherId = '';
		// 店铺数据
		var shopid = ''
		var shop_date = {};
	    var defaults = {
	        shop: []
	    };
		var shop_ids =''
	    var is_repeat = 0;  //储值金额,增抵用券方式
	    var rightText = ''
	    var shop_dateCurrent = {} //临时数据
		var StoredValueManage = {

			init: function () {
				// 判断是修改还是添加
				if (storedId != undefined && storedId != null && dataStred != undefined && dataStred != null &&addIsUp == 1) {
					// 把状态显示
					$('#give_integral').attr('disabled','disabled');
					$('#give_integral').css('background-color','#ececec');
					$('#addNoDisplay').removeClass('hide');
					$('#addAndedit').text('储值卡修改');
					giveVoucherId = dataStred.give_voucher_id;
	   				shop_ids = dataStred.shop_id
	   				shopid = dataStred.shopid
					if(dataStred.shopid == 'all'){
						$('#allAdd').removeClass('hide')
						$('#otherAdd').remove()
					}else{
						$('#allAdd').remove()
						// 如果不是在线储值修改过来的，才显示提成金额
						if(dataStred.shopid != 'ssonlinesale'){
							$('#otherAdd').removeClass('hide')
						}
					}

					// 显示数据
					this.StoredValueList(dataStred);
				} else {
					
					// 把状态隐藏
					$('#give_integral').removeAttr('disabled','disabled');
					$('#give_integral').css('background-color','');
					$('#addNoDisplay').addClass('hide');
					$('#addAndedit').text('储值卡添加');
					$('#shopListSpan').addClass('hide')  //是添加隐藏选择门店
					$('#allAdd').removeClass('hide')
					$('#otherAdd').remove()
				}

				// 获取抵用劵列表（赠送）
				this.VouchersData();

				// 获取店铺数据
				//this.DishesDatashop();

				// 绑定点击事件
				this.StoredValueBind();
			},

			// 显示数据
			StoredValueList: function (data) {
				// 显示数据
				// 禁用radio    disabled
				// 名称
				var _self = this
				$('#storedName').val(data.stored_name);
				//alert(data.is_custom);
				// 储值金额  is_custom是否任意金额，0：否，1：是
				if (data.is_custom == 0) {
					// 选中固定金额
					$('#stored_money').val(data.stored_money);
					$('#stored').find('input[value="0"]').attr('checked','checked');
					// 显示赠送金额
					$('#give_money_dis').removeClass('hide');
					$('#give_rate_dis').addClass('hide');
					// 显示积分金额
					$("#give_integral_dis").removeClass('hide');
					$("#give_integral_rate").addClass('hide');
					// 赠送金额冻结
					$('#give_money').val(data.give_money);
					$('#give_money').attr('disabled','disabled');
					$('#give_money').css('background-color','#ececec');
				} else {
					// 选中任意金额
					$('#stored_money').val('0');
					$('#stored').find('input[value="0"]').attr('checked','false');
					$('#stored').find('input[value="1"]').attr('checked','checked');
					// 显示赠送百分比
					$('#give_money_dis').addClass('hide');
					$('#give_rate_dis').removeClass('hide');
					// 显示积分百分比
					$('#give_integral_dis').addClass('hide');
					$('#give_integral_rate').removeClass('hide');
					// 赠送百分比冻结
					$('#give_rate').val(data.give_rate);
					$('#give_rate').attr('disabled','disabled');
					$('#give_rate').css('background-color','#ececec');
				}
				
				$('#stored').find('input').attr('disabled','disabled');
				$('#stored').find('input').css('background-color','#ececec');
				//积分
				$("#give_integral").val(data.integral_num);
				// 上架日期
				$('#openTime').val(data.start_time);
				// 下架日期
				$('#closeTime').val(data.end_time);
				// 售卖方式
				$('#saleMode').val(data.sale_mode);
				// 状态
				$('#stoStatus').val(data.stored_status);
				if(data.is_custom == 1){
					$('#saleMode').html('<option value="0">无</option><option value="4">仅支持全部门店售卖</option><option value="5">仅支持指定门店售卖</option>')
					$('#saleMode').val(data.sale_mode)
				}else{
					$('#saleMode').html('<option value="0">无</option><option value="1">线上售卖+全部门店售卖</option><option value="2">线上售卖+指定门店售卖</option><option value="3">仅支持线上售卖</option><option value="4">仅支持全部门店售卖</option><option value="5">仅支持指定门店售卖</option>')
					$('#saleMode').val(data.sale_mode)

				}
				if(data.sale_mode == 5 || data.sale_mode == 2){
					$('#shopListSpan').removeClass('hide')
					_self.DishesDatashop(1)
				}
				//总部提成金额
				$('#allTicheng').text(data.allSale_commission)
				$('#allTicheng').val(data.allSale_commission)
				if(data.sale_commission != 'ssssssssssss'){
					$('#ticheng').val(parseFloat(data.sale_commission).toFixed(2))
					$('#ticheng').parent('span').prev('input').attr('checked',true)
					$('#allTicheng').prev('input').attr('checked',false)
				}else{
					$('#ticheng').val(parseFloat(0).toFixed(2))
					$('#allTicheng').prev('input').attr('checked',true)
					$('#ticheng').parent('span').prev('input').attr('checked',false)
				}
				$('.shopName').text(data.shopName)
				// 缓存中的数据取出之后删除
				Cache.del('stoUp');
			},

			// 赠抵用劵
			VouchersData: function () {
				var self = this;
                setAjax(AdminUrl.voucherVoucherList, {
                    'vou_status': 0
                }, $('#prompt-message'), {20: ''}, function(respnoseText) {
					// 得到返回数据
                    var data = respnoseText.data;
                    // 显示数据
                    self.VouchersList(data);
                }, 0);
			},

			// 获取抵用劵数据
			VouchersList: function (data) {
				var content = '<option value="null" selected>无</option>';

				for (var i in data) {
					content += '<option value="'+data[i].voucher_id+'">'+data[i].voucher_name+'</option>';
				}
				// 添加到页面中
				$('#give_voucher').html(content);
				// 如果是修改的话，就填充列表修改传过来的抵用劵id
				if (addIsUp == 1) {
					if (giveVoucherId == 'null' || giveVoucherId == '') {
						$('#giveVoucherId').val(null);
						//alert(giveVoucherId);
						$('#radio1,#radio2,#radio3').addClass('hide');
						$('#give_voucher_num_1,#give_voucher_num_2,#give_voucher_num_3').val('0');
						$('#give_voucher_money,#each_voucher_money').val('0');
					} else {
						//$('#give_voucher').val(giveVoucherId);
						// 找到列表中所有的option
						$('#give_voucher option').each(function(i,val){
							// 如果当前抵用劵id 等于 循环中的某个option
							if(val.value == giveVoucherId){
								//alert('ddd');
								// 选中当前的option
								$(this).attr('selected','selected');
							}
						});
						// is_custom是否任意金额，0：否，1：是
						if (dataStred.is_custom == 0) {
							$('#radio1').removeClass('hide');
							$('#radio2,#radio3').addClass('hide');

							$('#give_voucher_num_1').val(dataStred.give_voucher_num);
							$('#give_voucher_num_2,#give_voucher_num_3').val('0');
							$('#give_voucher_money,#each_voucher_money').val('0');

							$('#give').find('input[value="1"]').attr('checked','false');
						} else {
							// is_repeat = 1可以累计
							if (dataStred.is_repeat == 0) {
								$('#radio2').removeClass('hide');
								$('#radio1,#radio3').addClass('hide');

								$('#give_voucher_num_1,#give_voucher_num_3').val('0');
								$('#give_voucher_num_2').val(dataStred.give_voucher_num);
								$('#give_voucher_money').val(dataStred.give_voucher_money);
								$('#give').find('input[value="1"]').attr('checked','checked');
							} else {
								$('#radio3').removeClass('hide');
								$('#give_voucher_num_1,#radio2').addClass('hide');

								$('#give_voucher_num_1,#give_voucher_num_2').val('0');
								$('#give_voucher_num_3').val(dataStred.give_voucher_num);
								$('#each_voucher_money').val(dataStred.give_voucher_money);
								$('#give').find('input[value="1"]').attr('checked','false');
								$('#give').find('input[value="2"]').attr('checked','checked');
							}
						}
					}
					// 冻结抵用劵
					$('#give').find('input').attr('disabled','disabled');
					$('#give').find('input').css('background-color','#ececec');
					$('#give_voucher').attr('disabled','disabled');
					$('#give_voucher').css('background-color','#ececec');
				} else {
					$('#radio1').addClass('hide');
					$('#radio2').addClass('hide');
					$('#radio3').addClass('hide');
				}
			},

		    // 获取店铺数据
		    DishesDatashop: function (num) {
		        setAjax(AdminUrl.shopShopList, {
		            'type': 2
		        }, $('#prompt-message'), {20: ''}, function(respnoseText) {
		            shop_date = respnoseText.data;
		            shop_dateCurrent = respnoseText.data;
		            if(num == 1){
		            	var leng = shop_ids.split(',').length;
		            	var name = ''
						for (var i = 0;i<leng;i++) {
							for(var k in shop_date){
								if(shop_ids.split(',')[i] == shop_date[k].shop_id){
									defaults.shop = [k];
									if(leng > 1){
										name += shop_date[k].shop_name + ','
									}else{
										name = shop_date[k].shop_name
									}
								}
							}
						}
						$('#shopList').val(name);
		            }else{
			            for (var i in shop_date) {
			            	defaults.shop = [i];
			            	$('#shopList').val(shop_date[i].shop_name);
			            	break;
			            }
		            }
		        }, 1);
		    },

			// 绑定点击事件
			StoredValueBind: function () {
				var _self = this;
				// 点击保存修改
				$('#updatebtn').unbind('click').bind('click', function () {
					// 校验
					if (addIsUp == 0) {
						_self.StoredValueAdd();
					} else if (addIsUp == 1) {
						_self.StoredValueUpdate();
					}	
				});

				// 点击取消
				$('#exitbtn').unbind('click').bind('click', function () {
					window.location.replace('storedValueManage.html?is_select=1&type='+getQueryString('type'));
				});

				// 点击导航
				$('#selectJump').unbind('click').bind('click', function () {
					window.location.replace('storedValueManage.html?is_select=1&type='+getQueryString('type'));
				});

				// 选择下拉框赠抵用劵的change事件
				$('#give_voucher').unbind('input').bind('input', function () {
					if ($(this).val() == 'null') {
						$('#radio1,#radio2,#radio3').addClass('hide');
						$('#give_voucher_num_1,#give_voucher_num_2,#give_voucher_num_3').val('0');
						$('#give_voucher_money,#each_voucher_money').val('0');
					} else {
						// 判断是否选中了任意金额
						if ($('#stored').find('input[value="1"]').is(':checked') || $('#stored').find('input[value="1"]').attr('checked') == true) {
							$('#radio1').addClass('hide');
							$('#radio2,#radio3').removeClass('hide');
						} else {
							$('#radio1').removeClass('hide');
							$('#radio2,#radio3').addClass('hide');
						}
					}
				});

				var is_custom = 0; // 是否任意金额
				// 储值金额
				$('#stored').find('input[type="radio"]').each(function () {
					$(this).unbind('change').bind('change', function () {
						// 0 ,固定金额，1，任意金额
						if ($(this).attr('value') == 0) {
							is_custom = 0;
						} else if ($(this).attr('value') == 1) {
							is_custom = 1;
						}

						// 判断选中了任意金额，赠送金额就变成赠送百分比，增抵用劵，增几张就变成满多少赠几张
						if ($('#stored').find('input[value="1"]').is(':checked') || $('#stored').find('input[value="1"]').attr('checked') == true) {
							// 显示赠送百分比
							$('#give_money_dis').addClass('hide');
							$('#give_rate_dis').removeClass('hide');
							// 显示积分百分比
							$('#give_integral_dis').addClass('hide');
							$('#give_integral_rate').removeClass('hide');
							if ($('#give_voucher').val() != 'null') {
								// 显示满多少赠几张
								$('#radio2,#radio3').removeClass('hide');
								$('#radio1').addClass('hide');
							}
							$('#saleMode').html('<option value="0">无</option><option value="4">仅支持全部门店售卖</option><option value="5">仅支持指定门店售卖</option>')
						} else {
							// 显示赠送金额
							$('#give_money_dis').removeClass('hide');
							$('#give_rate_dis').addClass('hide');
							// 显示积分金额
							$('#give_integral_dis').removeClass('hide');
							$('#give_integral_rate').addClass('hide');
							if ($('#give_voucher').val() != 'null') {
								// 显示增几张
								$('#radio2,#radio3').addClass('hide');
								$('#radio1').removeClass('hide');
							}
							$('#saleMode').html('<option value="0">无</option><option value="1">线上售卖+全部门店售卖</option><option value="2">线上售卖+指定门店售卖</option><option value="3">仅支持线上售卖</option><option value="4">仅支持全部门店售卖</option><option value="5">仅支持指定门店售卖</option>')
						}
					})
				});

				// 固定金额输入校验
				$('#stored_money').unbind('input').bind('input', function () {
					if (is_custom == 0) {
						checkNum('stored_money', 1);
					} else if (is_custom == 1) {
						$('#stored_money').val('0');
					}
				});
				$('#ticheng').unbind('click').bind('click',function(){
					$(this).val('')
				})
				$('#allTicheng').unbind('click').bind('click',function(){
					$(this).val('')
				})

				// 赠（抵用劵）几张 输入校验
				$('#give_voucher_num_1').unbind('input').bind('input', function () {
					if (is_custom == 0) {
						checkNum('give_voucher_num_1', 0);
					} else {
						$('#give_voucher_num_1').val('0');
					}
				});

				// 赠送金额输入校验
				$('#give_money').unbind('input').bind('input', function () {
					checkNum('give_money', 1);
				});

				// 赠送百分比输入校验
				$('#give_rate').unbind('input').bind('input', function () {
					checkNum('give_rate', 1);
				});

				// 赠送积分校验
				$('#give_integral').unbind('input').bind('input',function(){
					checkNum('give_integral',1);
				});

				var is_select = 1; // 选择方式
				// 赠抵用劵（任意金额）
				$('#give').find('input[type="radio"]').each(function () {
					$(this).unbind('change').bind('change', function () {
						// 1 ,满几元赠几张，2，每满几元赠几张
						if ($(this).attr('value') == 1) {
							is_select = 1;
						} else if ($(this).attr('value') == 2) {
							is_select = 2;
						}
					})
				});

				// （抵用劵）满多少元 输入校验
				$('#give_voucher_money').unbind('input').bind('input', function () {
					if (is_select == 1) {
						checkNum('give_voucher_money', 1);
					} else {
						$('#give_voucher_money').val('0');
					}
				});
				// （抵用劵）赠几张 输入校验
				$('#give_voucher_num_2').unbind('input').bind('input', function () {
					if (is_select == 1) {
						checkNum('give_voucher_num_2', 0);
					} else {
						$('#give_voucher_num_2').val('0');
					}
				});

				// （抵用劵）每满多少元 输入校验
				$('#each_voucher_money').unbind('input').bind('input', function () {
					if (is_select == 2) {
						checkNum('each_voucher_money', 1);
					} else {
						$('#each_voucher_money').val('0');
					}
				});
				// （抵用劵）赠几张 输入校验
				$('#give_voucher_num_3').unbind('input').bind('input', function () {
					if (is_select == 2) {
						checkNum('give_voucher_num_3', 0);
					} else {
						$('#give_voucher_num_3').val('0');
					}
				});

		        // 点击店铺
		        $('#shopList').unbind('click').bind('click', function () {
		            _self.select_shop(shop_date);

		        });


				$("#saleMode").change(function () {
					var thisval = $("#saleMode").val()
					if(thisval == 2 || thisval == 5){
						$('#shopListSpan').removeClass('hide')  //判断售卖方式显示选择门店
						_self.DishesDatashop()
					}else{
						$('#shopListSpan').addClass('hide')     
						$('#set-favorable').html('')            //隐藏店铺时删除店铺列表
						$('#shopList').val('')
						defaults.shop = ''
						rightText = ''
					}
				});
			},
			// 点击选择店铺
			select_shop: function (data) {
				var _self = this
	            var listContent = '';
	            var listContentRight = ''
	            var str = $('#shopList').val()
	            for (var i in data) {
	                listContent += '<li data-value="' + data[i].shop_id + '" data-selected="1">' + data[i].shop_name + '</li>';
	            }
	            if(str.indexOf(",") == -1){
		            for(var i in data){
		            	if(data[i].shop_name == $('#shopList').val()){
		            		listContentRight += '<li data-value="' + data[i].shop_id + '" data-selected="1">' + data[i].shop_name + '</li>';
		            	}
		            }
	            	$('#show-favorable').html(listContentRight)
	            }else{
					var tempStr = $('#shopList').val();
					var tempArr = tempStr.split(",");
					for(var i in tempArr){
			            for(var k in data){
			            	if(data[k].shop_name == tempArr[i]){
			            		listContentRight += '<li data-value="' + data[k].shop_id + '" data-selected="1">' + data[k].shop_name + '</li>';
			            	}
			            }
					}
					$('#show-favorable').html(listContentRight)
	            }
	            $('#set-favorable').html(listContent);
	            $('#favorable-title').html('店铺选择');
	            _self.isHaveElement('#set-favorable', '#show-favorable');
	            _self.setFavorableData();
	            displayAlertMessage('#favorable-message', '');

	            $('#cancel-favorable').unbind('click').bind('click', function () {
	                defaults.shop = [];
	                layer.close(layerBox);
	                _self.countCancel(($('#shopList').val().split(',')));
	                _self.countSale(defaults.shop, '#shopList');
	            });

	            $('#definite-favorable').unbind('click').bind('click', function () {
	                defaults.shop = [];
	                layer.close(layerBox);
	                _self.countSale(defaults.shop, '#shopList');
	                rightText = $('#show-favorable').html()
	            });
			},
		    // 查看是否包含元素
		    isHaveElement: function (leftDom, rightDom) {
		        for (var i = 0; i < $(leftDom).find('li').length; i++) {
		            for (var j = 0; j < $(rightDom).find('li').length; j++) {
		                if ($($(leftDom).find('li')[i]).text() == $($(rightDom).find('li')[j]).text()) {
		                    //$($(leftDom).find('li')[i]).addClass('select').attr('data-selected', 2);
		                    $($(leftDom).find('li')[i]).css('background-color', '#FBE04A').attr('data-selected', 2);
		                }
		            }
		        }
		    },		    
		    // 店铺选择
		    setFavorableData: function() {
		        $('#set-favorable > li').each(function () {
		            $(this).unbind('click').bind('click', function () {
		                if ($(this).attr('data-value') == 'all') {
		                    if ($(this).attr('data-selected') == 1) {
		                        $('#show-favorable li').remove();
		                        $('#set-favorable li').css('background-color', '#FFFFFF').attr('data-selected', 1);
		                        $(this).css('background-color', '#FBE04A').attr('data-selected', 2);
		                        var that = $(this).clone();
		                        that = that.css('background-color', '#FFFFFF');
		                        $('#show-favorable').append(that);
		                    } else {
		                        $('#show-favorable').find('li[data-value="all"]').remove();
		                        $(this).css('background-color', '#FFFFFF').attr('data-selected', 1);
		                    }
		                } else {
		                    if ($(this).attr('data-selected') == 1) {
		                        $('#show-favorable').find('li[data-value="all"]').remove();
		                        $('#set-favorable').find('li[data-value="all"]').css('background-color', '#FFFFFF').attr('data-selected', 1);
		                        $(this).css('background-color', '#FBE04A').attr('data-selected', 2);
		                        var that = $(this).clone();
		                        that = that.css('background-color', '#FFFFFF');
		                        $('#show-favorable').append(that);
		                    } else {
		                        $(this).css('background-color', '#FFFFFF').attr('data-selected', 1);
		                        $('#show-favorable').find('li[data-value="' + $(this).attr('data-value') + '"]').remove();
		                    }
		                }
		            });
		        });
		    },
			// 计算方案
		    countSale: function (ary, element) {
		        var inputContent = [];
		        if ($('#show-favorable li').length > 0) {
		            for (var i = 0; i < $('#show-favorable li').length; i++) {
		                ary.push($($('#show-favorable li')[i]).attr('data-value'));
		                inputContent.push($($('#show-favorable li')[i]).text());
		            }
		        }
		        if (inputContent.length == 0) {
		            for (var i in shop_dateCurrent) {
		            	defaults.shop = [i];
		            	inputContent[0] = shop_dateCurrent[i].shop_name;
		            	ary[0] = shop_dateCurrent[i].shop_id;
		            	break;
		            }		        
		        }		        
		        $(element).val(inputContent.join(','));
		    },
		    countCancel: function (list) {
		        $('#show-favorable').html('');
		        for (var i = 0; i < list.length; i++) {
		            for (var j = 0; j < $('#set-favorable li').length; j++) {
		                if (list[i] == $($('#set-favorable li')[j]).text()) {
		                    var newli = $($('#set-favorable li')[j]).clone();
		                    newli = newli.css('background-color', '#FFFFFF');
		                    $('#show-favorable').append(newli);
		                }
		            }
		        }
		    },			
		    // 添加
			StoredValueAdd: function () {
				// 获取到各个数据，请求接口提交数据
				var self = this;
	
				// 名称
				var storedName = $('#storedName').val();

				// is_repeat = 1可以累计
				// 赠送百分比 give_rate  只支持1-2位的整数

				//提成金额
				var sale_commission = $('#allTicheng').val()
				if(sale_commission == ''){
					sale_commission = 0
				}

				// 储值金额
				var stored_money = $('#stored_money').val();
				var is_custom = 0; // 是否任意金额 0 :否，1：是
				// 储值金额
				$('#stored').find('input[type="radio"]').each(function () {
					//alert('ddd'+$(this).attr('checked'));
					// 是否选中
					if ($(this).is(':checked')) {
						if ($(this).val() == 0) {
							is_custom = 0;
							$('#give_rate').val(0)
						} else {
							is_custom = 1;
							$('#give_money').val(0)
						}
					}
				});
				if (is_custom == 0) {
					stored_money = $('#stored_money').val();
					if (stored_money == 0) {
						displayMsg(ndPromptMsg, '固定金额不能为0！', 2000);
						return;
					}
				} else {
					stored_money = 0;
				}
				// 赠送金额
				var give_money = $('#give_money').val();
				//赠送百分比
				var give_rate = $('#give_rate').val()
				// 赠送积分
				var integral_num = $('#give_integral').val();
				// 赠抵用劵id
				var give_voucher = $('#give_voucher').val();
				// 赠送抵用券张数
				var give_voucher_num = 0;
				// 赠送抵用券金额
				var give_voucher_money = 0;
				if (give_voucher == 'null') {
					give_voucher = '';
					give_voucher_num = 0;
					give_voucher_money = 0;
				} else {
					var is_select = 0; // 选择方式
					// 增抵用劵，增几张0，满几元赠几张1
					$('#give').find('input[type="radio"]').each(function () {
						//alert($(this).is(':checked')+'---'+$(this).attr('checked'));
						// 是否选中
						if ($(this).is(':checked')) {
							if ($(this).val() == 0) {
								is_select = 0;
								is_repeat = 0;
							}else if($(this).val() == 1){
								is_select = 1;
								is_repeat = 0;
							}else if($(this).val() == 2){
								is_select = 2;
								is_repeat =1;
							}
						}
					});
					//alert(is_select);
					if (is_select == 0) {
						give_voucher_num = $('#give_voucher_num_1').val();
						give_voucher_money = 0;
					} else if(is_select == 1){
						give_voucher_num = $('#give_voucher_num_2').val();
						give_voucher_money = $('#give_voucher_money').val();
					}else if(is_select == 2){
						give_voucher_num = $('#give_voucher_num_3').val();
						give_voucher_money = $('#each_voucher_money').val();
					}
					if (give_voucher_num == 0) {
						displayMsg(ndPromptMsg, "赠送抵用劵数量不能为0", 2000);
						return;
					}
				}

				// 上架日期
				var openTime = $('#openTime').val();
				// 下架日期
				var closeTime = $('#closeTime').val();
				// 售卖方式
				var saleMode = $('#saleMode').val();
				// 效验数据通过才能修改
				if (this.dataCheck() && this.checkCondition()) {
					//判断储值卡名称
					if(storedName.length > 15){
						displayMsg(ndPromptMsg, '请输入小于15个字!', 2000);
						return false
					}
					setAjax(AdminUrl.storedStoredAdd, {
	                    'stored_name': storedName,
	                    'is_custom': is_custom,
	                    'stored_money': parseFloat(stored_money).toFixed(2),
	                    'give_money': parseFloat(give_money).toFixed(2),
	                    'integral_num':integral_num,
	                    'give_voucher_id': give_voucher,
	                    'give_voucher_num': give_voucher_num,
	                    'give_voucher_money': parseFloat(give_voucher_money).toFixed(2),
						'start_time': openTime,
	                    'end_time': closeTime,
	                    'sale_mode': saleMode,
	                    'shop_id':defaults.shop,
	                    'is_repeat':is_repeat,
	                    'give_rate':give_rate,
						'sale_shop_id':'all',
						'sale_commission':parseFloat(sale_commission).toFixed(2)
	                }, $('#prompt-message'), {20: ''}, function(respnoseText) {
						// 得到返回数据
	                    var data = respnoseText.data;
	                    window.location.replace('storedValueManage.html?is_select=0&type='+getQueryString('type'));
	                }, 2);
				}
			},

			// 修改
			StoredValueUpdate: function () {
				// 获取到各个数据，请求接口提交数据
				var self = this;
				// alert($('#give_voucher_num_1').val());
				// 名称
				var storedName = $('#storedName').val();
				// 储值金额
				var storedMoney = $('#stored_money').val();
				// 赠送金额
				var giveMoney = dataStred.give_money;
				// 赠送百分比
				var give_rate = dataStred.give_rate;
				// 赠送积分
				var integral_num = $('#give_integral').val();
				// 上架日期
				var openTime = $('#openTime').val();
				// 下架日期
				var closeTime = $('#closeTime').val();
				// 售卖方式
				var saleMode = $('#saleMode').val();
				// 状态
				var stoStatus = $('#stoStatus').val();

	            var allOrShop = $('input:radio[name="ticheng"]:checked').val();

				if(allOrShop == 'all'){
					sale_commission = 'all'
				}else if($('#ticheng').val() != undefined){
					sale_commission = parseFloat($('#ticheng').val()).toFixed(2)
				}else{
					sale_commission = parseFloat($('#allTicheng').val()).toFixed(2)
				}
				
				var shop_id = '';
				if (saleMode == 2 || saleMode == 5) {
					//shop_id = ;
				}
				is_repeat = dataStred.is_repeat
				// 效验数据通过才能修改
				if (this.dataCheck() && this.checkCondition()) {
					//判断储值卡名称
					if(storedName.length > 15){
						displayMsg(ndPromptMsg, '请输入小于15个字!', 2000);
						return false
					}	
					setAjax(AdminUrl.storedStoredUpdate, {
	                    'stored_id': storedId,
	                    'is_custom': dataStred.is_custom,
	                    'stored_name': storedName,
	                    'stored_money': parseFloat(storedMoney).toFixed(2),
	                    'give_money': parseFloat(giveMoney).toFixed(2),
	                    'give_rate': give_rate,
	                    'integral_num':integral_num,
	                    'shop_id': defaults.shop,
						'start_time': openTime,
	                    'end_time': closeTime,
	                    'sale_mode': saleMode,
	                    'stored_status': stoStatus,
	                    'is_repeat':is_repeat,
	                    'give_voucher_id': dataStred.give_voucher_id,
	                    'give_voucher_num': dataStred.give_voucher_num,
	                    'give_voucher_money': parseFloat(dataStred.give_voucher_money).toFixed(2),
						'sale_shop_id':shopid,
						'sale_commission':sale_commission
	                }, $('#prompt-message'), {20: ''}, function(respnoseText) {
						// 得到返回数据
	                    var data = respnoseText.data;
	                    window.location.replace('storedValueManage.html?is_select=1&type='+getQueryString('type'));
	                }, 2);
				}
			},

			// 效验要修改的数据
			dataCheck: function () {
	            if ( dataTest('#storedName', '#prompt-message', { 'empty': '不能为空'})
	            	/*&& dataTest('#storedMoney', '#prompt-message', { 'empty': '不能为空', 'number': '必须为数字'})
	                && dataTest('#shopTel', '#prompt-message', { 'empty': '不能为空'})*/
	                && dataTest('#openTime', '#prompt-message', { 'empty': '不能为空'})
	                && dataTest('#closeTime', '#prompt-message', { 'empty': '不能为空'})
	            
	            ) {
	            	//alert('tt');
	                return true;
	            }

	            return false;
			},

			// 检测条件
	        checkCondition: function() {
	            var _self = this;

	            // 上架下架日期
	            var start = $('#openTime').val(),
	                end = $('#closeTime').val();
	            if (start == "" || end == "") {
	                displayMsg(ndPromptMsg, '请选择上架日期和下架日期!', 2000);
	                return false;
	            }

	            if (start > end) {
	                displayMsg(ndPromptMsg, '上架日期应小于下架日期!', 2000);
	                return false;
	            }

	            // 售卖方式
	            var saleMode = $('#saleMode').val();
	            if (saleMode == '0') {
	                displayMsg(ndPromptMsg, '请选择一种售卖方式!', 2000);
	                return false;
	            }

	            return true;
	   //          if (addIsUp == 0) {
				// 	_self.StoredValueAdd();
				// } else if (addIsUp == 1) {
				// 	_self.StoredValueUpdate();
				// }
	        }
		}

		StoredValueManage.init();

});

