$(function () {
	//积分修改

		var IntegralManage = {

			init: function () {
				
				// 显示数据
				this.IntegralList();
				// 绑定点击事件
				this.IntegralBind();
			},

			// 显示数据
			IntegralList: function () {
				var self = this;
                setAjax(AdminUrl.infointegralInfo, {
                    // 'order_id': infoId,
                    // 'is_integral': '1',
                }, $('#prompt-message'), {20: ''}, function(respnoseText) {
					// 得到返回数据
                    var data = respnoseText.data;
                    // 把获取到的数据挨个填充到页面
                    self.IntegralManage(data);

                }, 1);
			},

			// 显示基本数据
			IntegralManage: function (data) {
				// 状态
				// // $('#integralstatus').val('data.is_integral');
				// console.log(data);
				var is_integral = data;
				$('#integralstatus').val(is_integral.is_integral_exchange);
				$("#integral").val(is_integral.integral_exchange_num);
				$("#stored").val(is_integral.stored_exchange_num);
			},

			IntegralBind: function () {
				var self = this;
				// 点击保存按钮
				$('#consumebtn').unbind('click').bind('click', function () {
					//提交数据
						self.IntegralUpdate();
				   
				});
				//校验积分
				$('#integral').unbind('keyup').bind('keyup', function () {
					self.checkNumLength('integral', 1);
				});
				//校验乐币
				$('#stored').unbind('keyup').bind('keyup', function () {
					self.checkNumLength('stored', 1);
				});
			},


			//验证1-8位长的数字
			// 校验数字  num 0:整数，1：非整数
    		checkNumLength: function(name, num) {
       	 		var num1 = $('#'+name).val();
       	 		//长度小于8
       	 		if(num1.length > 8){
       	 			$('#'+name).val(num1.substr(0,8))
       	 		}
       	 		//不可包含小数
       	 		if(num1.indexOf('.')>-1){
       	 			$("#"+name).val(0);
       	 		}
        		//正则表达式验证必须为数字
        		var numPro = /^\d*\.{0,1}\d{0,2}$/;
        		if (num == 0) {
            		numPro = /^\d*$/;
        		} else {
            		numPro = /^\d*\.{0,1}\d{0,2}$/;
        		}
       			//查找输入字符第一个为0 
        		var resultle = num1.substr(0,1);
        		var result2 = num1.substr(1,1);
        		if(numPro.test(num1)){
            		if(resultle == 0 && num1.length > 1 && result2 != '.'){
                		//若以0开头，把0替换掉
                		$('#'+name).val(num1.replace(/0/,""));
                		if(num1.substr(0,1) == '.'){
                    		$('#'+name).val(0);
                		}
            		}
            		if (num1 == '') {
                		$('#'+name).val(0);
            		}
        		}else{
            		$('#'+name).val(0);
        		}
    		},


			// 提交数据
			IntegralUpdate: function () {
				// 获取到各个数据，请求接口提交数据

				var integralstatus = $('#integralstatus').val();
				var integral = $("#integral").val();
				var stored =$("#stored").val();


				// console.log(integralstatus);
				// console.log(integral);
				// console.log(stored);
                setAjax(AdminUrl.infoIntegralLeiji, {
                    'is_integral_exchange': integralstatus,
                    'integral_exchange_num':integral,
                    'stored_exchange_num':stored
                }, $('#prompt-message'), {20: ''}, function(respnoseText) {
					// 得到返回数据
                    var data = respnoseText.data;

                }, 2);
			}
		}

		IntegralManage.init();

});

