$(function () {


	// 显示页面首页商户信息information
        //alert($('#exit-system').text());
        // 返回的数据
        var data;
        // 从缓存中得到用户是否有添加修改权限
        var perIsEdit = Cache.get('perIsEdit');

		var InformationPage = {

			init: function () {
				var self = this;
				// 显示数据
				self.InformationData();
				
				if (perIsEdit == null) {
					// 延迟一秒加载是因为在左侧加载完之后再加载这个
					setTimeout(function(){
						perIsEdit = Cache.get('perIsEdit');
						// 判断如果等于undefined说明没有修改权限
						if (perIsEdit['商户信息修改'] == undefined) {
							$('#permissions').addClass('hide');
						} else {
							$('#permissions').removeClass('hide');
							// 绑定修改点击事件
							self.InformationBind();
						}
					}, 1000);
				} else {
					$('#permissions').removeClass('hide');
					// 绑定修改点击事件
					self.InformationBind();
				}
			},

			// 显示数据
			InformationData: function () {
				var self = this;
                setAjax(AdminUrl.infoCompanyInfo, {}, $('#prompt-message'), {20: ''}, function(respnoseText) {
					// 得到返回数据
                    data = respnoseText.data;
                    if (respnoseText.code == 20) {
	                    Cache.set('getMessage', data);
	                    self.InformationList(data);
					} else {
						displayMsg(ndPromptMsg, respnoseText.message, 2000);
					}
                }, 0);
			},

			// 显示基本数据
			InformationList: function (data) {
				// 公司名称
				$('#companyName').text(data.company_name);
				// 公司英文名
				$('#companyNameEn').text(data.company_name_en);
				// 企业法人
				$('#companyLegal').text(data.company_legal);
				// 联系人
				$('#merchantPer').text(data.merchant_per);
				// 公司电话
				$('#merchantTel').text(data.merchant_tel);
				// it管理员名称
				$('#itPer').text(data.it_per);
				// it管理员电话
				$('#itTel').text(data.it_tel);
				// 门店最大发卡额度
				$('#maxCardRate').text(data.max_card_rate + " %");

				// 储值通用商户
				if (data.currency_stored == '' || data.currency_stored == undefined) {
					$('#stored_1').addClass('hide');
				} else {
					$('#stored_1').removeClass('hide');
					$('#StoredType').text(data.currency_stored);
				}
				// 储值卡通用商户
				if (data.currency_entity == '' || data.currency_entity == undefined) {
					$('#stored_2').addClass('hide');
				} else {
					$('#stored_2').removeClass('hide');
					$('#StoredRange').text(data.currency_entity);
				}

				// 是否支持实体卡的开关
				$.cookie('is_entity_card', data.is_entity_card, {path:'/html'});
				//
				$.cookie('entity_card_time', data.entity_card_time, {path:'/html'});
			},

			// 绑定点击事件
			InformationBind: function () {
				
				// 点击修改商户信息
				$('#consumebtn').unbind('click').bind('click', function () {
					//alert(data.company_name);
					Cache.set('totalInfoData',data);
					// 跳转到修改商户信息
					window.location.replace('informationEdit.html');
				});
			} 
		}

		InformationPage.init();
});