$(function () {

	// 修改商户信息 informationEdit

		var infoThis = this;
		// 从URL里面取到取到id
		var id = location.href.split('?')[1];

 

        var data = Cache.get('totalInfoData');

		var InformationEditPage = {

			init: function () {
				// 显示数据
				this.InformationList(data);
				// 绑定点击事件
				this.InformationBind();
			},



			// 显示数据
			/*InformationData: function () {
				var self = this;
                setAjax(AdminUrl.infoCompanyInfo, {
                    'cid': Cache.get('getCID')
                }, $('#prompt-message'), {20: ''}, function(respnoseText) {
					// 得到返回数据
                    var data = respnoseText.data;
                    
                    // 把获取到的数据挨个填充到页面
                    self.InformationList(data);
                }, 2);
			},*/

			// 显示基本数据
			InformationList: function (data) {
				// 公司名称
				$('#companyName').text(data.company_name);
				// 公司英文名
				$('#companyNameEn').text(data.company_name_en);
				// 企业法人
				$('#companyLegal').text(data.company_legal);
				// 联系人
				$('#merchantPer').val(data.merchant_per);
				// 公司电话
				$('#merchantTel').val(data.merchant_tel);
				// 店铺最大折扣
				$('#maxCardRate').val(data.max_card_rate);
				
				// it管理员名称
				$('#itPer').val(data.it_per);
				// it电话
				$('#itTel').val(data.it_tel);
				// 删除从列表传过来的数据
				Cache.del('totalInfoData');
			},

			// 绑定点击事件
			InformationBind: function () {
				var self = this;
				// 点击保存按钮
				$('#consumebtn').unbind('click').bind('click', function () {
					// 提交数据
					self.InformationSubmit();
				});

				// 点击取消按钮
				$('#exitbtn').unbind('click').bind('click', function () {
					window.location.replace('information.html');
				});
			},

			// 提交数据
			InformationSubmit: function () {
				// 获取到修改的值
				// 联系人
				var merchantPer = $('#merchantPer').val();
				// 公司电话
				var merchantTel = $('#merchantTel').val();
				// it管理员名称
				var itPer = $('#itPer').val();
				// it电话
				var itTel = $('#itTel').val();
				
				var maxCardRate = $('#maxCardRate').val();
				
				
				
				
				if (dataTest('#maxCardRate', '#prompt-message', { 'empty': '不能为空', 'sale': '是整数并小于100大于0'})){	
					setAjax(AdminUrl.infoCompanyInfoUpdate, {
	                    'merchant_tel': merchantTel,
	                    'merchant_per': merchantPer,
	                    'it_tel': itTel,
	                    'it_per': itPer,
						'max_card_rate': maxCardRate
	                }, $('#prompt-message'), {20: ''}, function(respnoseText) {
						// 修改成功跳转到商户信息页面
						window.location.replace('information.html');
	                }, 2);
				}


			},

			// 效验要修改的数据
			dataCheck: function () {
	            if ( Pattern.dataTest('#login-name', '#msg', { 'empty': '不能为空', 'mobileNumber': '必须为手机号'})
	                && Pattern.dataTest('#sms-verification', '#msg', { 'empty': '不能为空', 'number': '必须为数字', 'smsVerification': '效验失败'})
	                && Pattern.dataTest('#new-password', '#msg', { 'empty': '不能为空', 'passLength': '应为6~16个字符'})
	                && Pattern.dataTest('#repeat-password', '#msg', { 'empty': '不能为空'})
	            ) {
	                return true;
	            }

	            return false;
        	}
		}

		InformationEditPage.init();

});