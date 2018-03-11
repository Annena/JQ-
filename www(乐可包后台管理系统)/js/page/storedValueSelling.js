$(function () {
	
	// 总部收银员登录====储值卡售卖

        // 储值卡id
        var storedIdPro = '';
		var countdown;
		var count = 60;
		var clicknum = 1 ;//点击确认售卖可用
		var menuStatus = 1; //当前选中的标签data-type的值 0:退单 1:退菜 2:退款
	    // 是否支持实体卡的开关
	    var is_entity_card = $.cookie('is_entity_card');

        // 在壳子里才显示
        if ($.cookie('card_shell') == 1) {
            // 绑定键盘事件
            bind_key();
	        // 绑定全键盘
	        bind_total_key();
        }
        // 判断是否支持实体卡，显示隐藏选项卡
        if (is_entity_card == 0) {
			$('#cardType_8').addClass('hide');
        } else {
			$('#cardType_8').removeClass('hide');
        }
        
        // 调用监控键盘(public.js)
        keydown_monitor('#card_barcode');

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
		

		// 请求显示数据
		function StoredValueData () {
            setAjax(AdminUrl.storedSellList, {
				'type': menuStatus == 1 ? 1 : 2
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
		                            (menuStatus == 3 ? '' :
									'<td class="tdborder">'+
									((data.stored_list[i].give_voucher_id == null || data.stored_list[i].give_voucher_id == '') ? '无':data.stored_list[i].give_voucher_name+'<br>'+
										((data.stored_list[i].give_voucher_money == 0 || data.stored_list[i].give_voucher_money == null) ? '' 
											: st_text+data.stored_list[i].give_voucher_money+'元')+'赠'+data.stored_list[i].give_voucher_num+'张')+
									'</td>')+
									(menuStatus == 3  ? '' :
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
					userList += '<option value="'+data.user_list[u].a_user_id+'">'+data.user_list[u].a_user_name+'</option>'
				}
				$('#user_list').html(userList)
		}

		// 绑定点击事件
		function StoredValueBind () {
			/*$('.quickpay-table').height(accSubtr(accSubtr($.cookie('windowHei'), $('.stafffloat').outerHeight()), 100));
			$('.quickpay-table').width(accSubtr($.cookie('windowWid'), 222));*/

			//获取手机验证码
			// $('#sendCode').unbind('click').bind('click', function () {
			// 	Phoneverification()
			// });
			//添加计算器弹出事件
			$('#cav').unbind('click').bind('click', function () {
				 $('#calculate_num').removeClass('hide');
                 displayAlertMessage('#calculate_num','#calculate_tool_close');
				
			});

			//添加切换事件
			$("#cardType_6,#cardType_7,#cardType_8").click(function(){
				$(".caipin-fenleicheck").removeClass("caipin-fenleicheck").addClass("caipin-fenleinucheck");
				menuStatus = $(this).removeClass("caipin-fenleinucheck").addClass("caipin-fenleicheck").attr("data-type");
				menuStatus = parseInt(menuStatus);
				
				//显示内容
				$(".stores-content").addClass("hide");

				//清空表格比例内容
				$('colgroup').html('')
				var content_sel = '';
				switch(menuStatus)
				{	// 定义菜品状态参数 1购买储值 2储值码作废 3实体卡储值
					case 1:
						var $theContent = $(".cardTypeContent_6");
					
						$theContent.removeClass("hide");
						$(".cardTypeContent_66").removeClass("hide");
						//$cardTypeContent = $theContent.find(".tbodys");
						$('#give_display,#give_integral').removeClass('hide');

						is_scan_monitor = 0;
						
						//DishesData(0);
						// 请求加载储值列表
						StoredValueData();
						//恢复表格原有的比例
						content_sel += ' <col width="10%">'+
		                               ' <col width="20%">'+
		                               ' <col width="15%">'+
		                               ' <col width="15%">'+
		                               ' <col width="25%">'+
		                               ' <col width="15%">'
						$('colgroup').html(content_sel);
					break;
					case 2:
						var $theContent = $(".cardTypeContent_7");
						$theContent.removeClass("hide");
						//$cardTypeContent = $theContent.find(".tbodys");
						is_scan_monitor = 0;
						//alert(menuStatus);
						//DishesData(1);
					break;
					case 3:
						var $theContent = $(".cardTypeContent_6");
						$theContent.removeClass("hide");
						$(".cardTypeContent_68").removeClass("hide");
						//$cardTypeContent = $theContent.find(".tbodys");
						is_scan_monitor = 1;
						$('#give_display,#give_integral').addClass('hide');
						//alert(menuStatus);
						//DishesData(1);

						// 请求加载储值列表
						StoredValueData();
						//有数据隐藏重新定义比例（兼容Java壳子）
						content_sel += ' <col width="20%">'+
		                               ' <col width="30%">'+
		                               ' <col width="25%">'+
		                               ' <col width="25%">'
						$('colgroup').html(content_sel);
					break;
				}
			})
				//添加手机号验证码的显示隐藏
			$("#nohavaDiscount").click(function(){
				$(".authorization").addClass("hide")
				$(".explain-text").removeClass("hide")
			})
			$("#haveDiscount").click(function(){
				$(".authorization").removeClass("hide")
				$(".explain-text").addClass("hide")
			})
			
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

				// 给结账的计算金额绑定点击事件 单选框
				$('#calculation_amount').find('input[type="radio"]').each(function () {
					var self = this;
					 money = stored_money;
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
							
								$(this).parent().next().val(money);
								//alert($(this).parent().next().val());
							} else {
								$(this).parent().next().val('0');
							}
							
	                    });
					});
				});
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
				// var money = $('#alipay_shop').val();
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

			// 计算小工具
			// 乘数1、乘数2
			$('#multiplier,#Faciend').unbind('input').bind('input', function () {
				checkNum($('#multiplier'), 1);
				checkNum($('#Faciend'), 1);
				// 乘数1
				var multiplier = $('#multiplier').val();
				// 乘数2
				var Faciend = $('#Faciend').val();
				// $.cookie('Faciend', Faciend);
				// 填入结果
				calculation_value = accMul(multiplier,Faciend);
				$('#calculation_value').val(calculation_value);
			});

			// 放入储值金额
			$('#confirm_stored').unbind('click').bind('click', function () {
                var a = $('#multiplier').val();
                var b = $('#Faciend').val();

                if (a == 0 || b == 0) {
                    var calculation_value = 0
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
			
			// 确认售卖
			$('#sellingMine').unbind('click').bind('click', function () {
				if(clicknum == 1){
					clicknum = 0;//点击确认售卖不可用
					sellingMineData();
				}
			});
			
			// 确认作废
			$('#invalidMine').unbind('click').bind('click', function () {
				if(clicknum == 1){
					clicknum = 0 //点击确认作废不可用
					invalidMineData();
				}
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
                    //替换0为空
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

		// 请求确定售卖
		function sellingMineData () {
			//手机号
			var storedsale_spn=$("#storedsale-psn").val();
			//验证码
			var storedsale_psw=$("#storedsale-psw").val();
			// 备注
			var note = $("#note_userMobile").val();
			// 判断是否打印
            var isPrint = $('input:radio[name="discount"]:checked').val();

            // 实体卡卡号
            var card_barcode = $('#card_barcode').val();
            var card_no = $('#card_no').val();

            // alert(isPrint)
            var is_print;
            if (isPrint == 1 && menuStatus != 3) {
                // 打印储值二维码
            	is_print = 1;
			} else {
                // 直接储值
                is_print = 0;
			}
			if (is_print == 0) {
	            if (menuStatus == 3) {
					if(card_barcode == '' && card_no == ''){
						displayMsg(ndPromptMsg, '请放卡或输入卡号！!', 2000);
						clicknum = 1 ;//点击按钮可用
						return;
					}
	                if (card_no != '' && !Pattern.entity_card.test(card_no)) {
	                    displayMsg(ndPromptMsg, '请输入正确的卡号！', 2000);
	                    clicknum=1;//点击按钮可用
	                    return;
	                }
	            } else {
					if(storedsale_spn == ''){
						// alert("请输入手机号和手机验证码")
						displayMsg(ndPromptMsg, '请输入手机号!', 2000);
						clicknum = 1 ;//点击按钮可用
						return;
					}
					if(storedsale_psw == ''){
						// alert("请输入手机号和手机验证码")
						displayMsg(ndPromptMsg, '请输入手机验证码!', 2000);
						clicknum = 1 ;//点击按钮可用
	                    return;
					}
				}
				if (storedIdPro == '') {
					displayMsg(ndPromptMsg, '请选择要售卖的储值卡！', 2000);
					clicknum = 1 ;//点击按钮可用
					return;
				}
			} else {
            	if (storedIdPro == '') {
                    displayMsg(ndPromptMsg, '请选择要售卖的储值卡！', 2000);
                    clicknum = 1 ;//点击按钮可用
                    return;
                }
			}

			// 现金
			var cash = $('#cash').val();
			// 银行卡
			var card = $('#card').val();
			// 免单
			var free = $('#free').val();
			// 备注
			// var note = $('#note').val();
			//售卖收银员
			var userid = $('#user_list').val();
			if(userid == 'null'){
				displayMsg(ndPromptMsg,'请选择售卖收银员', 2000);
				clicknum = 1 ;//点击按钮可用
				return false
			}
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
                clicknum = 1 ;//点击按钮可用
                return;
            }

			$('#sellingMine').attr('disabled', true);
			// 限定时间在显示按钮
			timeLimit('sellingMine');

            setAjax(AdminUrl.storedSellPay, {
				'stored_id': storedIdPro,
				'cash': parseFloat(cash).toFixed(2),
				'card': parseFloat(card).toFixed(2),
				'free': parseFloat(free).toFixed(2),
				'custom_money': parseFloat(custom_money).toFixed(2),
				'wxpay_shop': parseFloat(wxpay_shop).toFixed(2),
				'alipay_shop': parseFloat(alipay_shop).toFixed(2),
				'a_user_id':userid,
				'user_mobile': storedsale_spn,
				'sms_code': storedsale_psw,
                'note': note,
				'is_print_ticket': is_print,
				'stored_type': menuStatus == 1 ? 1 : 2,
				'card_barcode': card_barcode,
				'card_no': card_no
            }, $('#prompt-message'), {20: ''}, function(respnoseText) {
				if (respnoseText.code == 20 || respnoseText.code == 200208) {
					// 得到返回数据
                    var data = respnoseText.data;
                    //$.base64.utf8encode = true;
                    //console.log(data.print_data);
                    //alert(data.print_data);
                    
                    //alert(window.atob(data.print_data));js转码方式
                    //alert($.base64.decode(data.print_data));
                    // 显示数据生成二维码
					// alert(isPrint)
                    if (is_print == 1) {
                        sellingMineList(data);
					} else {
						displayMsg(ndPromptMsg, respnoseText.message, 2000);
					}
					clicknum = 1 ;//点击确认售卖可用

                    $("#storedsale-psn,#storedsale-psw,#note_userMobile,#card_barcode,#card_no").val('');
					$('#tbodys tr td input[type="radio"]').prop('checked', false);
					$('#user_list').val("null");
					$('#cash,#card,#free,#wxpay_shop,#alipay_shop,#stored_money_1,#stored_money_0').val(0);
				} else {
					displayMsg(ndPromptMsg, respnoseText.message, 2000);
					clicknum = 1 ;//点击确认售卖可用
				}
            }, 0);
		}

		// 储值卡售卖生成二维码打印
		function sellingMineList (data) {
            //打印机IP   端口   和要打印的数据  
                // 要打印的数据PHP返回的是base64位编码，需要解码一下
                // http://www.cnblogs.com/wqing/p/3329624.html这个网址有解码
            // 获取到返回的数据
            // 生成二维码
            // 打印二维码
             
            // 生成二维码之前先清空二维码那个div
            $('#qrcode').html('');

            // 显示弹出框
            $('#qr-code').removeClass('hide');

            //$('#ale-content').html('储值码二维码');
            displayAlertMessage('#qr-code', '#can-alert');

            // 图片会生成到id是qrcode的里面
            var qrcode = new QRCode(document.getElementById("qrcode"), {
                width : 252,//设置宽高
                height : 252
            });
            // 将二维码内容填充，并生成二维码
            qrcode.makeCode(data.soft_app_down+'?'+data.print_code);

			// 填充订单编号
			$('#ordernumber').text(data.print_code);

            $('#confirm-print').click(function () {
                //alert('要打印了');
                // 关闭弹框
                layer.close(layerBox);
                /*setAjax(AdminUrl.logoutUrl, null, ndAlertProMsg, function (respnoseText) {
                    layer.close(layerBox);
                    displayMsg($('#prompt-message'), '服务器请求中...请稍候...', 30000);
                    window.location.replace(AdminUrl.indexUrl);
                });*/
            });
		}

		// 限定时间在显示确认售卖按钮
		function timeLimit (name) {
			setTimeout(function() {
				$('#'+name).attr('disabled', false);
			}, 2000);
		}

		// 请求作废储值码
		function invalidMineData () {
			// 充值码
			var scanCode = $('#scanCode').val();//31fczgbkoyy1fjui37sc3
			// 授权工号
			var userMobile = $('#userMobile').val();
			// 密码
			var userPass = $('#userPass').val();
			//alert(scanCode);

			// 效验数据通过才能修改
			if (dataCheck()) {
                setAjax(AdminUrl.storedSellDel, {
					'scan_code': scanCode,
					'a_user_mobile': userMobile,
					'a_user_pass': userPass
                }, ndPromptMsg, {20: ''}, function(respnoseText) {
                	if (respnoseText.code == 20) {
						// 得到返回数据
	                    var data = respnoseText.data;
	                    displayMsg($('#prompt-message'), '储值码已作废', 3000);
	                    $('#scanCode').val('');
	                    $('#userMobile').val('');
	                    $('#userPass').val('');
	                    clicknum = 1 //点击确认作废可用
                	} else {
                		displayMsg(ndPromptMsg, respnoseText.message, 2000);
                		clicknum = 1 //点击确认作废可用
                	}
                }, 0);
            }
        }

        // 效验要修改的数据
		function dataCheck () {
            if ( dataTest('#scanCode', '#prompt-message', { 'empty': '不能为空'})
            	 && dataTest('#userMobile', '#prompt-message', { 'empty': '不能为空'})
                 && dataTest('#userPass', '#prompt-message', { 'empty': '不能为空'})) {
            	clicknum = 1 //点击确认作废可用
                return true;
            }
            clicknum = 1 //点击确认作废可用
            return false;
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
						
						} else {
							displayMsg(ndPromptMsg, respnoseText.message, 2000);
						}
					}, 0);
				}
			}else{
				// alert("请输入手机号获取验证码")
				displayMsg(ndPromptMsg, '手机号不能为空，请输入手机号获取验证码', 2000);
			}
			
        }

		// 发送授权验证码
		$('#sendCode').unbind('click').bind('click', function () {
			if(clicknum==1){
				// 得到输入框中的手机号
				if($('#sendCode').attr('disabled-data') == ''){
					var phone_input = $('#storedsale-psn').val();
					clicknum=0;//点击不可用
					if (phone_input == '') {
						displayMsg(ndPromptMsg, '请输入手机号！', 2000);
						return;
					}
					// 发送验证码接口，和验证码倒计时在可重新发送处理
					get_author_code(phone_input);
				}
			}
			
		});

		// 验证码倒计时
		function CountDown() {
			$("#sendCode").attr("disabled-data", 'disabled');
			$("#sendCode").css('color','#999')
			$("#sendCode").text(count+'重新发送');
			if (count == 0) {
				$("#sendCode").text("发送验证码").attr("disabled-data",'');
				$("#sendCode").css('color','#ff7247')
				clearInterval(countdown);
				count = 60
			}
			count--;
		}
		// 发送验证码接口，和验证码倒计时在可重新发送处理
		function get_author_code(phone_input) {
			setAjax(AdminUrl.verificatCode, {
				'sms_type': 4,
				'user_mobile': phone_input,
			}, $('#prompt-message'), {20: ''}, function(respnoseText) {
				if (respnoseText.code == 200103) {
					// 得到返回数据
					var data = respnoseText.data;
					window.setTimeout(function(){
							clicknum = 1
					},2000)
						
					countdown = setInterval(CountDown, 1000);
					displayMsg(ndPromptMsg, respnoseText.message, 2000);
				} else {
					window.setTimeout(function(){
							clicknum = 1
					},2000)
					displayMsg(ndPromptMsg, respnoseText.message, 2000);
				}
			}, 0);
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
        // 金额输入框计算差值
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
