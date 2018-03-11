$(function () {
	var menuStatus = 1; //当前选中的标签data-type的值 0:退单 1:退菜 2:退款
	// 总部收银员登录====授权会员码
			var countdown;
			var count = 60;
			var clicknum = 1 ; //点击确认授权可用
			// 绑定点击事件
			StoredValueBind();
			
	        // 在壳子里才显示
	        if ($.cookie('card_shell') == 1) {
	            // 绑定键盘事件
	            bind_key();
		        // 绑定全键盘
		        bind_total_key();
	        }

			// 绑定点击事件
			function StoredValueBind () {

				//获取手机验证码
			
				$('#authorization-smd').unbind('click').bind('click', function () {
					
					Phoneverification()
				});

				// 确认打印授权会员二维码
				
				$('#sellingMine').unbind('click').bind('click', function () {
					if(clicknum == 1 ){
						clicknum = 0 ; //点击确认授权不可用
						sellingMineData();
					}
				});
				//判断是打印授权二维码还是直接授权二维码
				var clickdif
				$('#nohavaDiscount').unbind('click').bind('click', function () {
					clickdif = 0;
				});
				$('#haveDiscount').unbind('click').bind('click', function () {
					clickdif = 1;
				});
				
				// 确认作废
				
				$('#invalidMine').unbind('click').bind('click', function () {
					if(clicknum == 1){
						clicknum = 0 ;//点击确认作废不可用
						invalidMineData();
					}
				});

				
				

				//添加切换事件
				$("#cardType_4,#cardType_5").click(function(){
					$(".caipin-fenleicheck").removeClass("caipin-fenleicheck").addClass("caipin-fenleinucheck");
					menuStatus = $(this).removeClass("caipin-fenleinucheck").addClass("caipin-fenleicheck").attr("data-type");
					menuStatus = parseInt(menuStatus);
					
					//显示内容
					$(".stores-content").addClass("hide");
					
					switch(menuStatus)
					{	// 定义菜品状态参数 0:退单 1:退菜 2:退款
						case 1:
							var $theContent = $("#cardTypeContent_4");
							$theContent.removeClass("hide");
							//$cardTypeContent = $theContent.find(".tbodys");
							
							//alert(menuStatus);
							//DishesData(0);
						break;
						case 2:
							var $theContent = $("#cardTypeContent_5");
							$theContent.removeClass("hide");
							//$cardTypeContent = $theContent.find(".tbodys");
							
							//alert(menuStatus);
							//DishesData(1);
						break;
					}
				})
				//添加手机号验证码的显示隐藏
				$("#nohavaDiscount").click(function(){
					$(".authorization").addClass("hide")
					$(".explain-text").removeClass("hide")
				})
				$("#haveDiscount").click(function(){
					$(".explain-text").addClass("hide")
					$(".authorization").removeClass("hide")

				})

                // 发送授权验证码
                $('#sendCode').unbind('click').bind('click', function () {
                    // 得到输入框中的手机号
                    if($('#sendCode').attr('disabled-data') == ''){
                        var phone_input = $('#authorization-psn').val();
                        if (phone_input == '') {
                            displayMsg(ndPromptMsg, '请输入手机号！', 2000);
                            clicknum = 1 ; //确认废除按钮可以使用
                            return;
                        }
                        // 发送验证码接口，和验证码倒计时在可重新发送处理
                        get_author_code(phone_input);
                    }
                });


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
                        'sms_type': 5,
                        'user_mobile': phone_input,
                    }, $('#prompt-message'), {20: ''}, function(respnoseText) {
                        if (respnoseText.code == 200103) {
                            // 得到返回数据
                            var data = respnoseText.data;
                            countdown = setInterval(CountDown, 1000);
                            displayMsg(ndPromptMsg, respnoseText.message, 2000);
                            clicknum = 1 ; //确认废除按钮可以使用

                        } else {
                            displayMsg(ndPromptMsg, respnoseText.message, 2000);
                            clicknum = 1 ; //确认废除按钮可以使用

                        }
                    }, 0);
                }
				
			// 请求打印高级会员授权二维码
			function sellingMineData () {
				//手机号
				var authorization_spn=$("#authorization-psn").val();
				//验证码
				var authorization_psw=$("#authorization-psw").val();
				// $("#haveDiscount").click(function(){
				// })
				// 备注
				var note = $("#note_userMobile").val();
				// 判断是否打印
                var isPrint = $('input:radio[name="discount"]:checked').val();
                // alert(isPrint)
                var is_print;
                if (isPrint == 1) {
                	is_print = 1;
				} else {
                    is_print = 0;
				}
				if (is_print == 0) {
                    if(authorization_spn == ''){
                        // alert("请输入手机号和手机验证码")
                        displayMsg(ndPromptMsg, '请输入手机号!', 2000);
                        clicknum = 1 ;//点击确认授权按钮可用
                        return;
                    } else if(authorization_psw == ''){
                        // alert("请输入手机号和手机验证码")
                        displayMsg(ndPromptMsg, '请输入手机验证码!', 2000);
                        clicknum = 1 ;//点击确认授权按钮可用
                        return;
                    }

				}
				
				// $('#sellingMine').attr('disabled', true);
				// 限定时间在显示按钮
				timeLimit('sellingMine');
				var note = $('#note_user').val();

				// 请求接口
				setAjax(AdminUrl.memberAuthorityPay, {
					'note': note,
					'user_mobile': authorization_spn,
					'sms_code': authorization_psw,
					'is_print_ticket': is_print
				}, $('#prompt-message'), {20: ''}, function(respnoseText) {
					if (respnoseText.code == 20) {
						// 得到返回数据
						var data = respnoseText.data;
						// 清空备注
						$('#note').val('');
						// 显示数据生成二维码
						// sellingMineList(data);
						if (is_print == 1) {
                            sellingMineList(data);
                            clicknum = 1 ;//点击确认授权按钮可用
						}
						if(clickdif == 1){
							displayMsg(ndPromptMsg, respnoseText.message, 2000);
							clicknum = 1 ;//点击确认授权按钮可用
						}
						
						clicknum = 1 ; //点击确认授权可用

					} else {
						displayMsg(ndPromptMsg, respnoseText.message, 2000);
						clicknum = 1 ; //点击确认授权可用
					}
				}, 0);
				
			}

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

                    $('#confirm-print').removeClass('hide')

                    // 图片会生成到id是qrcode的里面
                    var qrcode = new QRCode(document.getElementById("qrcode"), {
                        width : 252,//设置宽高
                        height : 252
                    });
                    // 将二维码内容填充，并生成二维码
                    qrcode.makeCode(data.soft_app_down+'?'+data.print_code);

                    // 填充订单编号
                    $('#ordernumber').text(data.print_code);
                    $('#can-alert').click(function () {
                        layer.close($('#qr-code').parent().parent().parent().attr('times'));
                    });


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

			// 限定时间在显示授权二维码打印
			function timeLimit (name) {
				setTimeout(function() {
					$('#'+name).attr('disabled', false);
				}, 2000);
			}

			// 请求作废授权码
			function invalidMineData () {
				// 授权码
				var scanCode = $('#scanCode').val();//31fczgbkoyy1fjui37sc3
				// 店长账号
				var userMobile = $('#userMobile').val();
				// 店长密码
				var userPass = $('#userPass').val();
				//alert(scanCode);

				// 效验数据通过才能修改
				if (dataCheck()) {
	                setAjax(AdminUrl.memberAuthorityDel, {
						'scan_code': scanCode,
						'a_user_mobile': userMobile,
						'a_user_pass': userPass
	                }, ndPromptMsg, {20: ''}, function(respnoseText) {
	                	if (respnoseText.code == 20) {
							// 得到返回数据
		                    var data = respnoseText.data;
		                    displayMsg($('#prompt-message'), '二维码已作废', 3000);
		                    $('#scanCode').val('');
		                    $('#userMobile').val('');
		                    $('#userPass').val('');
		                    clicknum = 1 ;//点击确认作废可用
	                	} else {
	                		displayMsg(ndPromptMsg, respnoseText.message, 2000);
	                		clicknum = 1 ;//点击确认作废可用
	                	}
	                }, 0);
	            }else{
	            	clicknum = 1 ;//点击确认作废可用
	            }
            }

            // 效验要修改的数据
			function dataCheck () {
	            if ( dataTest('#scanCode', '#prompt-message', { 'empty': '不能为空'})
	            	 && dataTest('#userMobile', '#prompt-message', { 'empty': '不能为空'})
	                 && dataTest('#userPass', '#prompt-message', { 'empty': '不能为空'})) {
	            	clicknum = 1 ; //确认废除按钮可以使用
	                return true;
	            }
	            clicknum = 1 ; //确认废除按钮可以使用
	            return false;
			}

			//验证手机号验证码
			function Phoneverification() {
				//手机号
				var authorization_spn=$("#authorization-psn").val();
				//验证码
				var authorization_psw=$("#authorization-psw").val();
				if(authorization_spn!=''){
					// 效验数据通过才能修改
					if (dataCheck()) {
						setAjax(AdminUrl.memberAuthorityDel, {
							'authorization_psw':authorization_psw,
							'authorization_psw':authorization_psw
						}, ndPromptMsg, {20: ''}, function(respnoseText) {
							if (respnoseText.code == 20) {
								// 得到返回数据
								var data = respnoseText.data;
								displayMsg($('#prompt-message'), '手机号校验成功', 3000);
								clicknum = 1 ; //确认废除按钮可以使用
								$("#authorization-psn").val('');
								$("#authorization-psw").val('');
							
							} else {
								displayMsg(ndPromptMsg, respnoseText.message, 2000);
								clicknum = 1 ; //确认废除按钮可以使用
							}
						}, 0);
					}
				}else{
					// alert("请输入手机号获取验证码")
					displayMsg(ndPromptMsg, '请输入手机号获取验证码', 2000);
					clicknum = 1 ; //确认废除按钮可以使用
				}
				
            }
			}

});
