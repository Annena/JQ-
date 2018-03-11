$(function () {
	
	// 总部发卡员
			var userInfoTemp = {}; //用于判断是否修改的信息,可以不用
			
	        // 在壳子里才显示
	        if ($.cookie('card_shell') == 1) {
	            // 绑定键盘事件
	            bind_key();
	        }
			

			// 点击保存
			$('#updatebtn').unbind('click').bind('click', function () {
				shopManageData();
			});

			// 点击搜索
			$('#selectbtn').unbind('click').bind('click', function () {
				selectShopMembers();
			});



			// 保存提交数据
			function shopManageData () {
				
				// 获取到搜索的项
				var startdate = $("#discountStartTime").val(),		// 查询开始日期
					enddate = $("#discountEndTime").val();			// 查询结束日期
				
				if (startdate == "" || enddate == "") {
					displayMsg(ndPromptMsg, '请选择开始日期和结束日期!', 2000);
	                return;
	            }

	            if (startdate > enddate) {
	                displayMsg(ndPromptMsg, '开始日期应小于结束日期!', 2000);
	                return;
	            }
				
				
				var discountRate = $('#discountRate').val();
				
				if (dataTest('#discountRate', '#prompt-message', { 'empty': '不能为空', 'sale': '是整数并小于等于100并大于0'})){
					//alert('ddd');
					//alert(discountRate+'--'+userInfoTemp.max_card_rate);
					var num = parseFloat(userInfoTemp.max_card_rate);
	                if(discountRate < num){
	                	//alert('rrrr');
						displayMsg(ndPromptMsg, '当前额度大于最大额度', 2000);
						return false;
					}
					setAjax(AdminUrl.setDiscountInfo, {
	                    'discount_rate': discountRate,
	                    'user_mobile': $("#userPhone").text(),
	                    'note': $('#note').val(),
						'start_date' : startdate,
						'end_date' : enddate
						
					 }, $('#prompt-message'), {20: ''}, function(respnoseText) {
	                	//alert(respnoseText);
						if (respnoseText.code == 20 || respnoseText.code == 205130) {
	                		displayMsg(ndPromptMsg, respnoseText.message, 2000, function () {
			                	$('#discountRate').val('');
								// 添加隐藏
								$('#membersDisplay').addClass('hide');
								// 得到返回数据
			                    var data = respnoseText.data;
		                    });
	                	} else {
	                		displayMsg(ndPromptMsg, respnoseText.message, 2000);
	                	}
	                }, 0);
				}
			}

			// 点击搜索的时候请求接口
			function selectShopMembers () {
				
				// 用户的手机号码
				var userMobile = $("#userMobile").val();

				if (dataCheck()) {
	                setAjax(AdminUrl.memberUserInfo, {
	                    'user_mobile': userMobile
	                }, $('#prompt-message'), {20: ''}, function(respnoseText) {
	                	
						//判断是字符还是json如果是json则解析
						if(typeof respnoseText == "string"){
							respnoseText = JSON.parse(respnoseText);
						}
						
						if (respnoseText.code == 20) {
							// 删除隐藏，显示出来账户信息
							$('#membersDisplay').removeClass('hide');

							// 得到返回数据
		                    var data = respnoseText.data;
							
							//缓存客户原始信息
							userInfoTemp = data;
							//console.log(userInfoTemp);
							
							// 会员账户
		                   	$("#userPhone").text(userMobile);


		                   	// 13645264585 未领卡账户
		                   	if (data.user_id == '' && data.add_time == '0') {
		                   		$('#totalConsumeHide').addClass('hide');
		                   		$('#discountRateProHide').addClass('hide');
		                   		$('#addTime').text('未领卡');
		                   	} else {
		                   		$('#totalConsumeHide').removeClass('hide');
		                   		$('#discountRateProHide').removeClass('hide');
								// 领卡日期
		                   		$('#addTime').text(getAppointTimeSec(data.add_time));
			                    // 累计消费
			                    $("#totalConsume").text(parseFloat(data.stored_consume).toFixed(2));
			                    // 当前卡折扣
			                    $("#discountRatePro").text(data.discount_rate+'%'); //百分比
		                	}

		                    // 设置卡折扣
							$("#discountRate").val(data.discount_rate);
							//maxCardRateInfo
							//最大折扣值提示
							$('#maxCardRateInfo').text(data.max_card_rate);
							
							// 会员卡开始时间
							$("#discountStartTime").val(getAppointTime(data.discount_start_time));
							
							// 会员卡结束时间
							$("#discountEndTime").val(getAppointTime(data.discount_end_time));
							
		                    // 备注信息
		                    $('#note').val(data.user_note); 
						} else {
							displayMsg(ndPromptMsg, respnoseText.message, 2000);
						}
	                }, 0);
	            }
			}

			// 效验要修改的数据
			function dataCheck () {
				
				
	            if ( dataTest('#userMobile', '#prompt-message', { 'empty': '不能为空', 'phoneNumber': '格式不正确'})) {
	            	//alert('tt');
	                return true;
	            }
	            return false;
			}


});
