$(function () {

			// 总部收银员登录====会员注册
			var countdown;
			var count = 60;
			// 储值卡id
			var storedIdPro = '';
			var clicknum = 1; //点击注册为可用
			var url_type = getQueryString('type');
		    // 是否支持实体卡的开关
		    var is_entity_card = $.cookie('is_entity_card');
			// 从url取出来，是总部跳转过来的
			var stored_type = url_type == undefined ? 1 : url_type;// 1会员 2实体卡


            // 判断是否支持实体卡，显示隐藏选项卡
            if (is_entity_card == 0) {
				$('#option_tab').addClass('hide');
            } else {
				$('#option_tab').removeClass('hide');
            }

            // 如果是2说明是总部过来的，隐藏选项卡
            if (stored_type == 2) {
				$('#option_tab').addClass('hide');
				is_scan_monitor = 1;
				$('#user_display,#user_register,#give_display,#give_integral,#registerLogin').addClass('hide');
				$('#card_display,#purchase_display,#confirmation_sale').removeClass('hide');
				$('#quick-selA').removeClass('hide');
				// 隐藏售卖服务员，总部不需要选
				$('#total_display').addClass('hide');
				storedIdPro = '';
				$('#user_ce').text('实体卡发放');
				EffectiveAll();//总部有效期
            } else {
				// 显示售卖服务员，门店需要选
				$('#total_display').removeClass('hide');
				$('#user_ce').text('会员注册');
				Effective()	// 有效期，
            }
			// 显示数据
			StoredValueData();
			// 绑定点击事件
			StoredValueBind();

			// 放入乘数2
			var ciend = $.cookie('Faciend');
			if (ciend == undefined || ciend == '') {
				$('#Faciend').val('0');
			} else {
				$('#Faciend').val(ciend);
			}

			// is_input 0：点击单选，1：输入金额
			var is_input = 0;

			// 是否任意金额 0：否，1：是
			var is_custom = 0;
			// 储值金额
			var stored_money = 0;
			// 赠送金额
			var give_money = 0;

			// 在壳子里才显示
	       	if ($.cookie('card_shell') == 1) {
		        // 绑定全键盘
		        bind_key();
		        // 绑定全键盘
		        bind_total_key();
	        }

            // 调用监控键盘(public.js)
            keydown_monitor('#card_barcode');

			// 设置会员时,输入框自动显示日期
			$("#discountStartTime").val(getOffsetDateTime().start_day);
			$("#discountEndTime").val(getOffsetDateTime().start_day);
			// 通过手机号 发送验证码 然后获取验证码 需要跨域

			
			
			// $('#end_time').val(getOffsetDateTime().start_day);

			// 出生日期，默认今天
			$('#user_birthday').val(getOffsetDateTime().start_day);

			// 发送授权验证码
			$('#sendCode1').unbind('click').bind('click', function () {
				if(clicknum == 1){
					clicknum = 0;//点击按钮不可用
					// 得到输入框中的手机号
					if($('#sendCode1').attr('disabled-data') == ''){
						var phone_input = $('#userMobile').val();
						if (phone_input == '') {
							displayMsg(ndPromptMsg, '请输入手机号！', 2000);
							clicknum = 1;//点击注册为可用
							return;
						}
						// 发送验证码接口，和验证码倒计时在可重新发送处理
						get_author_code(phone_input);
					}
				}
			});

			// 验证码倒计时
			function CountDown() {
				$("#sendCode1").attr("disabled-data", 'disabled');
				$("#sendCode1").css('color','#999')
				$("#sendCode1").text(count+'重新发送');
				if (count == 0) {
					$("#sendCode1").text("发送验证码").attr("disabled-data",'');
					$("#sendCode1").css('color','#ff7247')
					clearInterval(countdown);
					count = 60;
				}
				count--;
			}
			// 发送验证码接口，和验证码倒计时在可重新发送处理
			function get_author_code(phone_input) {
				setAjax(AdminUrl.verificatCode, {
					'sms_type': 1,
					'user_mobile': phone_input
					// 'cid': 'ci2shuqvr5a4'
				}, $('#prompt-message'), {20: ''}, function(respnoseText) {
					if (respnoseText.code == 200103) {
						// 得到返回数据
						var data = respnoseText.data;
						countdown = setInterval(CountDown, 1000);
						displayMsg(ndPromptMsg, respnoseText.message, 2000);
						//点击按钮可用
						window.setTimeout(function(){
							clicknum = 1;
						},2000);
					} else {
						window.setTimeout(function(){
							clicknum = 1;
						},2000);
						displayMsg(ndPromptMsg, respnoseText.message, 2000);
					}
				}, 0);
			}
			//有效期门店
			function Effective(){
                setAjax(AdminUrl.shopShopInfo, {

                }, $('#prompt-message'), {20: ''}, function(respnoseText) {
                	// 得到返回数据
					var data = respnoseText.data;
                    var entity_card_time =  data.company_info.entity_card_time;
                    var myDate = new Date();
                    var year = accAdd(myDate.getFullYear(),entity_card_time); //获取完整的年份(4位,1970-????)
                    var month = myDate.getMonth()+1; //获取当前月份(0-11,0代表1月)
                    var day = myDate.getDate(); //获取当前日(1-31)
                    var end_time1 = '';//有效期
                    if(month<10){
                        month = '0'+month
                    }
                    if(day<10){
                        day = '0'+day
                    }
                    $('#end_time').val(year+'-'+month+'-'+day)

                }, 0);
			}
			// 有效期总部
			function EffectiveAll(){
              	var entity_card_time =  $.cookie('entity_card_time');
		        var myDate = new Date();
				var year = accAdd(myDate.getFullYear(),entity_card_time); //获取完整的年份(4位,1970-????)
				var month = myDate.getMonth()+1; //获取当前月份(0-11,0代表1月)
				var day = myDate.getDate(); //获取当前日(1-31)
				var end_time1 = '';//有效期
				if(month<10){
					month = '0'+month
				}
				if(day<10){
					day = '0'+day
				}
				$('#end_time').val(year+'-'+month+'-'+day)
               
			}
			// 添加设置折扣事件
			$("#haveDiscount, #haveDis").unbind('click').bind('click', function () {
				$("#set-discountA").removeClass("hide");
			})
			$("#nohavaDiscount, #noHave").unbind('click').bind('click', function () {
				$("#set-discountA").addClass("hide");
			});
			// 添加会员授权
			$("#storedCard, #storeCard").unbind('click').bind('click', function () {
				$("#set-discountB").removeClass("hide");
			})
			$("#noStoreCard, #noStore").unbind('click').bind('click', function () {
				$("#set-discountB").addClass("hide");
			});
			// 设置储值卡
			$("#haveMember, #member-author").unbind('click').bind('click', function () {
				$("#quick-selA").removeClass("hide");
			})
			$("#notMember, #noMember").unbind('click').bind('click', function () {
				$("#quick-selA").addClass("hide");
			});

			// 阻止默认事件
			function stopDefault( e ) {
				if ( e && e.preventDefault ){
					e.preventDefault();
				} else {
					window.event.returnValue = false;
				}
			}
			$("#calculator").unbind('click').bind('click', function (e) {
                stopDefault(e);
			});
			
			// 注册账户 提交注册信息
			$('#registerLogin').unbind('click').bind('click', function () {
				if(clicknum == 1 ){
					clicknum = 0;
					sellingMineData();
				}
            });

			// 实体卡发放，确认售卖
			$('#confirmation_sale').unbind('click').bind('click', function () {
				if(clicknum == 1 ){
					clicknum = 0;
					cardSellingData();
				}
            });
            
			// 请求显示数据
			function StoredValueData () {
				setAjax(AdminUrl.storedSellList, {
					'type': stored_type,
					'shop_id': url_type == undefined ? '' : 'ssssssssssss'
				}, $('#prompt-message'), {20: ''}, function(respnoseText) {
					if (respnoseText.code == 20) {
						// 得到返回数据
						var data = respnoseText.data;
						// 显示数据
						StoredValueList(data);
					} else {
						displayMsg(ndPromptMsg, respnoseText.message, 2000);
					}
				}, 0);
			}

			// 显示数据
			function StoredValueList (data) {
				var content = '';
				var userList = '<option value="null">无</option>'
				for (var i in data.stored_list) {
					var st_text = data.stored_list[i].is_repeat == 0 ? '满' : '每满';
					content +=  '<tr class="gray-font" stored-id="'+data.stored_list[i].stored_id+'">'+
									'<td class="tdborder">'+
										'<input type="radio" data-type="update" value="radio" name="stored">'+
									'</td>'+
									'<td class="tdborder">'+data.stored_list[i].stored_name+'</td>'+
									'<td class="tdborder" data-type="storedMoney">'+(data.stored_list[i].is_custom == 0 ? data.stored_list[i].stored_money : '任意金额')+'</td>'+
									'<td class="tdborder">'+(data.stored_list[i].is_custom == 0 ? data.stored_list[i].give_money : (data.stored_list[i].give_rate == 0 ? 0 : data.stored_list[i].give_rate+'%'))+'</td>'+
									(stored_type == 2 ? '' :
									'<td class="tdborder">'+
									((data.stored_list[i].give_voucher_id == null || data.stored_list[i].give_voucher_id == '') ? '无':data.stored_list[i].give_voucher_name+'<br>'+
										((data.stored_list[i].give_voucher_money == 0 || data.stored_list[i].give_voucher_money == null) ? ''
											: st_text+data.stored_list[i].give_voucher_money+'元')+'赠'+data.stored_list[i].give_voucher_num+'张')+
									'</td>')+
									(stored_type == 2 ? '' :
									'<td class="tdborder">'+data.stored_list[i].integral_num+
									'</td>')+
									'<td class="hide" data-type="is_custom">'+data.stored_list[i].is_custom+'</td>'+
									'<td class="hide" data-type="stored_money">'+data.stored_list[i].stored_money+'</td>'+
									'<td class="hide" data-type="give_money">'+data.stored_list[i].give_money+'</td>'+
								'</tr>';
				}
				// 添加到页面中
				$('#tbodys').html(content);
				//售卖服务员
				for (var u in data.user_list) {
					userList += '<option value="'+data.user_list[u].a_user_id+'">'+data.user_list[u].a_user_name+'</option>';
				}
				$('#user_list').html(userList);
			}

			// 绑定点击事件
			function StoredValueBind () {
				$('.quickpay-table').height(accSubtr(accSubtr($.cookie('windowHei'), $('.stafffloat').outerHeight()), 100));
				$('.quickpay-table').width(accSubtr($.cookie('windowWid'), 222));
				// 点击选择储值卡
				$('#tbodys').delegate('tr', 'click', function(event) {
					var self = this,
					storedId = $(self).attr('stored-id'),
					type = $(event.target).attr('data-type');

					// 是否任意金额 0：否，1：是
					is_custom = $(self).find('td[data-type="is_custom"]').text();
					// 储值金额
					stored_money = $(self).find('td[data-type="stored_money"]').text();
					// 赠送金额
					give_money = $(self).find('td[data-type="give_money"]').text();

					// 赋值给储值卡id
					storedIdPro = storedId;
					// 选中当前
					$(this).find('input').prop('checked',true);
					// 计算金额单选框全部显示
					$('#calculation_amount').find('input[type="radio"]').each(function () {
						$(this).removeClass('hide');
					});

					if (is_custom == 0) {
						$('#is_custom_1').addClass('hide');
						$('#is_custom_0').removeClass('hide');
						$('#stored_money_0').text(stored_money);
						$('#give_money_0').text(give_money);
					} else if (is_custom == 1) {
						$('#is_custom_1').removeClass('hide');
						$('#is_custom_0').addClass('hide');
						$('#stored_money_1').val('0');
						$('#give_money_1').text(give_money);
					}

					// 计算金额的填充
					$('#calculation_amount').find('input[type="radio"]').each(function () {
						if (is_custom == 1) {
							$(this).parent().next().val('0');
						} else {
							if ($(this).is(':checked')) {
								$(this).parent().next().val(stored_money);
							} else {
								$(this).parent().next().val('0');
							}
						}
					});

					// 给计算金额绑定点击事件 单选框
					$('#calculation_amount').find('input[type="radio"]').each(function () {
						var self = this;
						var money = stored_money;
						//alert(is_custom);
						if (is_custom == 0) {
							money = stored_money;
						} else {
							money = $('#stored_money_1').val();
						}
						// 添加绑定点击事件
						$(this).unbind('click').bind('click', function () {
							//alert(stored_money+'--ddd--'+$('#stored_money_1').val()+'---'+is_custom);
							// 计算金额的填充
							$('#calculation_amount').find('input[type="radio"]').each(function () {
								if ($(this).is(':checked')) {
									//alert(money);
									$(this).parent().next().val(money);
									//alert($(this).parent().next().val());
								} else {
									$(this).parent().next().val('0');
								}
							});
						});
					});
				});
				//添加计算器弹出事件
				$('#cav').unbind('click').bind('click', function () {
					$('#calculate_num').removeClass('hide');
					displayAlertMessage('#calculate_num','#calculate_tool_close');
				});
				// 任意金额输入校验
				$('#stored_money_1').unbind('input').bind('input', function () {
					var self = this;
					checkNum($(this), 1);
					// 单选框全部显示
					$('#calculation_amount').find('input[type="radio"]').each(function () {
						$(this).removeClass('hide');
					});
					// 计算金额的填充
					$('#calculation_amount').find('input[type="radio"]').each(function () {
						if ($(this).is(':checked')) {
							$(this).parent().next().val($(self).val());
						} else {
							$(this).parent().next().val('0');
						}
					});
				});

				// 计算输入金额  文本框
				$('#calculation_amount').find('input[type="text"]').each(function () {
					var self = this;
					var money = $('#alipay_shop').val();
					// 绑定输入事件
					$(this).unbind('input').bind('input', function () {
						//alert('ddd');
						// 校验输入金额
						checkNum($(self), 1);
						// 单选框全部隐藏
						$('#calculation_amount').find('input[type="radio"]').each(function () {
							$(this).addClass('hide');
						});
					});
				});

				// 计算小工具 乘数1、乘数2
				// var calculation_value = 0;
                // $('#calculation_value').val(0);
				$('#multiplier,#Faciend').unbind('input').bind('input', function () {
					checkNum($('#multiplier'), 1);
					checkNum($('#Faciend'), 1);
					// 乘数1
					var multiplier = $('#multiplier').val();
					// 乘数2
					var Faciend = $('#Faciend').val();
					$.cookie('Faciend', Faciend);
					// 填入结果
					var calculation_value = accMul(multiplier,Faciend);
                    $('#calculation_value').val(calculation_value);
				});
                // 放入储值金额
                $('#confirm_stored').unbind('click').bind('click', function () {
					var a = $('#multiplier').val();
					var b = $('#Faciend').val();

					if (a == 0 || b == 0) {
						var calculation_value = 0;
					} else {
                        var calculation_value = $('#calculation_value').val();
					}
                    $('#stored_money_1').val(calculation_value);
                    // 单选框全部显示
                    $('#calculation_amount').find('input[type="radio"]').each(function () {
                        $(this).removeClass('hide');
                    });
                    // 计算金额的填充
                    $('#calculation_amount').find('input[type="radio"]').each(function () {
                        if ($(this).is(':checked')) {
                            $(this).parent().next().val(calculation_value);
                        } else {
                            $(this).parent().next().val('0');
                        }
                    });
                    layer.close(layerBox);
                });

                // 选项卡点击
                $('#option_tab').on('click', 'div', function () {
					var data_type = $(this).attr('data-type');
					//清空表格比例内容
					$('colgroup').html('')
					var content_sel = '';
					$(this).addClass('caipin-fenleicheck').siblings('div').removeClass('caipin-fenleicheck').addClass('caipin-fenleinucheck');
					if (data_type == 1) {
						$('#user_display,#user_register,#give_display,#give_integral,#registerLogin').removeClass('hide');
						$('#card_display,#purchase_display,#confirmation_sale').addClass('hide');
						if ($('#member-author').is(':checked')) {
							$('#quick-selA').removeClass('hide');
						} else {
							$('#quick-selA').addClass('hide');
						}
						is_scan_monitor = 0;
						//恢复表格原有的比例
						content_sel += ' <col width="10%">'+
		                               ' <col width="20%">'+
		                               ' <col width="15%">'+
		                               ' <col width="15%">'+
		                               ' <col width="25%">'+
		                               ' <col width="15%">'
						$('colgroup').html(content_sel);
					} else {
						is_scan_monitor = 1;
						$('#user_display,#user_register,#give_display,#give_integral,#registerLogin').addClass('hide');
						$('#card_display,#purchase_display,#confirmation_sale').removeClass('hide');
						$('#quick-selA').removeClass('hide');
						//有数据隐藏重新定义比例（兼容Java壳子）
						content_sel += ' <col width="20%">'+
		                               ' <col width="30%">'+
		                               ' <col width="25%">'+
		                               ' <col width="25%">'
						$('colgroup').html(content_sel);
					}
					stored_type = data_type;
					storedIdPro = '';
					// 加载储值卡数据
					StoredValueData();
                });
			}

			// 金额校验
			function checkNum (name, num) {
				//正则表达式验证必须为数字
				var numPro = /^\d*\.{0,1}\d{0,2}$/;
				if (num == 0) {
					numPro = /^\d*$/;
				} else {
					numPro = /^\d*\.{0,1}\d{0,2}$/;
				}
				//查找输入字符第一个为0
				var resultle = name.val().substr(0,1);
				if(numPro.test(name.val())){
					if(resultle == 0){
						// 替换0为空
						name.val(name.val().replace(/0/,""));
						if(name.val().substr(0,1) == '.'){
							name.val(0);
						}
					}
					if (name.val() == '') {
						name.val(0);
					}
				}else{
					name.val(0);
				}
			}

			// 注册用户
			function sellingMineData () {
                // 获取手机号码 验证码 备注文本框信息
                var telephone = $('#userMobile').val();
                // 获取输入框验证码
                var vertical = $('#vertical-code').val();

                if (telephone == "" ) {
                    displayMsg(ndPromptMsg, '手机号不能为空，请输入手机号！', 2000);
                    clicknum=1;//点击按钮可用
                    return;
                }
                if (vertical == "") {
                    displayMsg(ndPromptMsg, '验证码不能为空，请输入验证码！', 2000);
                    clicknum=1;//点击按钮可用
                    return;
                }
                // 备注信息
                var note = $('#note').val();

                // 是否打折
                var zhekouDis = $('input:radio[name="discount"]:checked').val()
                if (zhekouDis === 'haveDiscount') {
                    is_zhekouDis = 1;
                    // 设置卡折扣
                    var discountRate = $("#discountRate").val();
                    // 会员卡开始时间
                    var discountStartTime = $("#discountStartTime").val();
                    // 会员卡结束时间
                    var discountEndTime = $("#discountEndTime").val();
                    if (discountStartTime == discountEndTime) {
                        displayMsg(ndPromptMsg, '请输入有效的会员卡日期！', 2000);
                        clicknum=1;//点击按钮可用
                        return;
					}
                    if (discountRate == "") {
                        displayMsg(ndPromptMsg, '请输入折扣信息！', 2000);
                        clicknum=1;//点击按钮可用
						return;
					}
                } else {
                    is_zhekouDis = 0;
                }
                // 是否授权会员
                var storeDis = $('input:radio[name="storeCard"]:checked').val();
                if (storeDis === 'storeCard') {
                    is_storeDis = 1;
                } else {
                    is_storeDis = 0;
                }
                // 是否购买储值卡
                var member = $('input:radio[name="member"]:checked').val();
                if (member === 'member') {
                    is_storeDisVul = 1;
                    if (storedIdPro == '') {
                        displayMsg(ndPromptMsg, '请选择要售卖的储值卡！', 2000);
                        clicknum=1;//点击按钮可用
                        return;
                    }
                    //售卖收银员
                    var userid = $('#user_list').val();
                    // 判断售卖员是否选择
                    if(userid == 'null'){
                        displayMsg(ndPromptMsg,'请选择售卖收银员', 2000);
                        clicknum=1;//点击按钮可用
                        return false;
                    }
                    // 现金
                    var cash = $('#cash').val();
                    // 银行卡
                    var card = $('#card').val();
                    // 免单
                    var free = $('#free').val();

                    // 任意金额输入的金额
                    var custom_money = $('#stored_money_1').val();
                    if (is_custom == 0) {
                        custom_money = 0;
                    } else {
                        custom_money = $('#stored_money_1').val();
                    }
                    // 银台微信
                    var wxpay_shop = $('#wxpay_shop').val();
                    // 银台支付宝
                    var alipay_shop = $('#alipay_shop').val();
					// 判断金额框是否为空
					if (cash == "0" && card == "0" && free == "0" && wxpay_shop == "0" && alipay_shop == "0" ) {
                        displayMsg(ndPromptMsg,'请输入付款金额', 2000);
                        clicknum=1;//点击按钮可用
                        return;
					}
                } else {
                    is_storeDisVul = 0;
                }
                timeLimit('sellingMine');
                setAjax(AdminUrl.registerLogin, {
                    'stored_id': storedIdPro,
                    'stored_type': 1,
                    'cash': parseFloat(cash).toFixed(2),
                    'card': parseFloat(card).toFixed(2),
                    'free': parseFloat(free).toFixed(2),
                    'note': note,
                    'custom_money': parseFloat(custom_money).toFixed(2),
                    'wxpay_shop': parseFloat(wxpay_shop).toFixed(2),
                    'alipay_shop': parseFloat(alipay_shop).toFixed(2),
                    'a_user_id':userid,
                    'user_mobile': telephone,
                    'sms_type': 1,
                    'sms_code': vertical,
                    'discount_rate': discountRate,
                    'start_date': discountStartTime,
                    'end_date': discountEndTime,
                    // 'storeDis': storeDis,
                    // 'storeDisVul': member,
                    'is_register_discount': is_zhekouDis,
                    'is_register_authority': is_storeDis,
                    'is_register_stored': is_storeDisVul
                }, $('#prompt-message'), {20: ''}, function(respnoseText) {
                    if (respnoseText.code == 20) {
                        // 得到返回数据
                        var data = respnoseText.data;
                        displayMsg(ndPromptMsg, respnoseText.message, 2000);
                        clicknum = 1;//点击注册可用
                        //$.base64.utf8encode = true;
                        //console.log(data.print_data);
                        //alert(data.print_data);
                        //alert(window.atob(data.print_data));js转码方式
                        //alert($.base64.decode(data.print_data));

                        // 隐藏页面东西
                        $("#set-discountA,#set-discountB,#quick-selA").addClass("hide");
                        $('#noHave,#noStore,#noMember').prop('checked', true);
                        $('#haveDis,#storeCard,#member-author').prop('checked', false);
                        $('#note').text('');
                        $('#userMobile,#vertical-code,#discountRate').val('');
						$("#discountStartTime,#discountEndTime").val(getOffsetDateTime().start_day);
						$('#tbodys tr td input[type="radio"]').prop('checked', false);
						$('#user_list').val("null");
						$('#cash,#card,#free,#wxpay_shop,#alipay_shop,#stored_money_1').val(0);
                    } else {
						clicknum = 1;//点击注册可用
                        displayMsg(ndPromptMsg, respnoseText.message, 2000);
                        return;
                    }
                }, 0);
			}

			// 实体卡发放请求接口
			function cardSellingData () {
				var card_barcode = $('#card_barcode').val();
				var card_no = $('#card_no').val();
				var end_time = $('#end_time').val();
				var user_mobile = $('#user_mobile').val();
				var user_name = $('#user_name').val();
				var user_sex = $('#user_sex').val();
				var user_birthday = $('#user_birthday').val();

                if (card_barcode == "") {
                    displayMsg(ndPromptMsg, '请先读取卡号！', 2000);
                    clicknum=1;//点击按钮可用
                    return;
                }
                if (card_no == "") {
                    displayMsg(ndPromptMsg, '请先输入卡号！', 2000);
                    clicknum=1;//点击按钮可用
                    return;
                }
                if (card_no != '' && !Pattern.entity_card.test(card_no)) {
                    displayMsg(ndPromptMsg, '请输入正确的卡号！', 2000);
                    clicknum=1;//点击按钮可用
                    return;
                }

                // 是否购买储值卡
                var is_storeDisVul = 1;
                if (storedIdPro == '') {
                    is_storeDisVul = 0;
                } else {
	                //售卖收银员
	                var userid = $('#user_list').val();
	                // 判断售卖员是否选择
	                if(userid == 'null' && url_type == undefined){
	                    displayMsg(ndPromptMsg,'请选择售卖收银员', 2000);
	                    clicknum=1;//点击按钮可用
	                    return false
	                }
	                // 现金
	                var cash = $('#cash').val();
	                // 银行卡
	                var card = $('#card').val();
	                // 免单
	                var free = $('#free').val();

	                // 任意金额输入的金额
	                var custom_money = $('#stored_money_1').val();
	                if (is_custom == 0) {
	                    custom_money = 0;
	                } else {
	                    custom_money = $('#stored_money_1').val();
	                }
	                // 银台微信
	                var wxpay_shop = $('#wxpay_shop').val();
	                // 银台支付宝
	                var alipay_shop = $('#alipay_shop').val();
					// 判断金额框是否为空
					if (cash == "0" && card == "0" && free == "0" && wxpay_shop == "0" && alipay_shop == "0" ) {
	                    displayMsg(ndPromptMsg,'请输入付款金额', 2000);
	                    clicknum=1;//点击按钮可用
	                    return;
					}
				}
                timeLimit('sellingMine');
                setAjax(AdminUrl.entity_card_register, {
                	'card_barcode': card_barcode,
                	'card_no': card_no,
                	'end_time': end_time,
                	'user_mobile': user_mobile,
                	'user_name': user_name,
                	'user_sex': user_sex,
                	'user_birthday': user_birthday,
                	'stored_type': 2,
                    'stored_id': storedIdPro,
                    'cash': parseFloat(cash).toFixed(2),
                    'card': parseFloat(card).toFixed(2),
                    'free': parseFloat(free).toFixed(2),
                    'custom_money': parseFloat(custom_money).toFixed(2),
                    'wxpay_shop': parseFloat(wxpay_shop).toFixed(2),
                    'alipay_shop': parseFloat(alipay_shop).toFixed(2),
                    'a_user_id':userid,
                    'is_print_ticket': 0,
                    'is_register_stored': is_storeDisVul,
                    'shop_id': url_type == undefined ? '' : 'ssssssssssss'
                }, $('#prompt-message'), {20: ''}, function(respnoseText) {
                    if (respnoseText.code == 20) {
                        // 得到返回数据
                        var data = respnoseText.data;
                        displayMsg(ndPromptMsg, respnoseText.message, 2000);
                        clicknum = 1;//点击注册可用

                        $("#end_time,#user_birthday").val(getOffsetDateTime().start_day);
						$('#tbodys tr td input[type="radio"]').prop('checked', false);
						$('#user_list').val("null");
						$('#user_sex').val(3);
						$('#cash,#card,#free,#wxpay_shop,#alipay_shop,#stored_money_1').val(0);
						$('#card_barcode,#card_no,#user_name,#user_mobile').val('');
                    } else {
						clicknum = 1;//点击注册可用
                        displayMsg(ndPromptMsg, respnoseText.message, 2000);
                        return;
                    }
                }, 0);
			}

			// 限定时间在显示确认售卖按钮
			function timeLimit (name) {
				setTimeout(function() {
					$('#'+name).attr('disabled', false);
				}, 2000);
			}

			//验证手机号验证码
			function Phoneverification() {
				//手机号
				var authorization_spn=$("#storedsale-psn").val();
				//验证码
				var authorization_psw=$("#storedsale-psw").val();
				if(authorization_spn != ''){
					// 效验数据通过才能修改
					if (dataCheck()) {
						setAjax(AdminUrl.memberAuthorityDel, {
							'authorization_spn':authorization_spn,
							'authorization_psw':authorization_psw
						}, ndPromptMsg, {20: ''}, function(respnoseText) {
							if (respnoseText.code == 20) {
								// 得到返回数据
								var data = respnoseText.data;
								displayMsg($('#prompt-message'), '手机号校验成功', 3000);
								$("#storedsale-psn").val('');
								$("#storedsale-psw").val('');
								clicknum = 1 ;//点击可以使用
							} else {
								displayMsg(ndPromptMsg, respnoseText.message, 2000);
								clicknum = 1 ;//点击可以使用
							}
						}, 0);
					}else{
						clicknum = 1 ;//点击可以使用
					}
				}else{
					displayMsg(ndPromptMsg, '请输入手机号获取验证码', 2000);
					clicknum=1;//点击按钮可用
				}
			}

			// 效验要修改的数据
			function dataCheck () {
				if ( dataTest('#scanCode', '#prompt-message', { 'empty': '不能为空'})
					 && dataTest('#userMobile', '#prompt-message', { 'empty': '不能为空'})
					 && dataTest('#userPass', '#prompt-message', { 'empty': '不能为空'})) {
					clicknum=1;//点击按钮可用
					return true;
				}
				clicknum=1;//点击按钮可用
				return false;
			}

			// 是否直接储值
			function invalidMineData () {
				//打印授权会员二维码
				var nohavaDiscount=$("#nohavaDiscount").val();
				//直接授权
				var haveDiscount=$("#haveDiscount").val();

				//是否直接授权二维码
				if (dataCheck()) {
					setAjax(AdminUrl.storedSellDel, {
						'nohavaDiscount':nohavaDiscount,
						'haveDiscount':haveDiscount
					}, ndPromptMsg, {20: ''}, function(respnoseText) {
							if (respnoseText.code == 20) {
								// 得到返回数据
								var data = respnoseText.data;
								displayMsg($('#prompt-message'), '储值码已作废', 3000);
								$('#nohavaDiscount').val('');
								$('#haveDiscount').val('');
								clicknum=1;//点击按钮可用
							} else {
								displayMsg(ndPromptMsg, respnoseText.message, 2000);
								clicknum=1;//点击按钮可用
							}
					}, 0);
				}
			}

			$('#cash').bind('click', function () {
                var money_store;
                if (is_custom == 0) {
                    money_store = $('#stored_money_0').text();
                } else if (is_custom == 1) {
                    money_store = $('#stored_money_1').val();
                }
                if (money_store == '') {
                	return;
                }
                var cashMoney = accSubtr(accSubtr(accSubtr(accSubtr(money_store, $('#free').val()), $('#card').val()), $('#wxpay_shop').val()), $('#alipay_shop').val());
                $(this).val(cashMoney);
            });
			$('#free').bind('click', function () {
				var money_store;
				if (is_custom == 0) {
					money_store = $('#stored_money_0').text();
				} else if (is_custom == 1) {
					money_store = $('#stored_money_1').val();
				}
                if (money_store == '') {
                	return;
                }
				var freeMoney = accSubtr(accSubtr(accSubtr(accSubtr(money_store, $('#card').val()), $('#cash').val()), $('#wxpay_shop').val()), $('#alipay_shop').val());
                $(this).val(freeMoney);
			});
			$('#card').bind('click', function () {
				var money_store;
				if (is_custom == 0) {
					money_store = $('#stored_money_0').text();
				} else if (is_custom == 1) {
					money_store = $('#stored_money_1').val();
				}
                if (money_store == '') {
                	return;
                }
                var cardMoney = accSubtr(accSubtr(accSubtr(accSubtr(money_store, $('#free').val()), $('#cash').val()), $('#wxpay_shop').val()), $('#alipay_shop').val());
                $(this).val(cardMoney);
			});
			$('#wxpay_shop').bind('click', function () {
				var money_store;
				if (is_custom == 0) {
					money_store = $('#stored_money_0').text();
				} else if (is_custom == 1) {
					money_store = $('#stored_money_1').val();
				}
                if (money_store == '') {
                	return;
                }
                var wxpayMoney = accSubtr(accSubtr(accSubtr(accSubtr(money_store, $('#free').val()), $('#cash').val()), $('#card').val()), $('#alipay_shop').val());
                $(this).val(wxpayMoney);
			});
			$('#alipay_shop').bind('click', function () {
				var money_store;
				if (is_custom == 0) {
					money_store = $('#stored_money_0').text();
				} else if (is_custom == 1) {
					money_store = $('#stored_money_1').val();
				}
                if (money_store == '') {
                	return;
                }
                var aipayMoney = accSubtr(accSubtr(accSubtr(accSubtr(money_store, $('#free').val()), $('#cash').val()), $('#wxpay_shop').val()), $('#card').val());
                $(this).val(aipayMoney);
			});
});
