$(function () {
	// 会员卡管理cardManage
        // 数据
        var data;
        // 从缓存中得到用户是否有添加修改权限
        var perIsEdit = Cache.get('perIsEdit');

		var CardManagePage = {

			init: function () {
				// 显示数据
				this.CardManageData();
				// 判断如果等于undefined说明没有修改权限
				if (perIsEdit['会员卡修改'] == undefined) {
					$('#permissions').addClass('hide');
				} else {
					$('#permissions').removeClass('hide');
					// 绑定点击事件
					this.CardManageBind();
				}
			},

			// 显示数据
			CardManageData: function (infoId) {
				var self = this;
                setAjax(AdminUrl.infoCardInfo, {}, $('#prompt-message'), {20: ''}, function(respnoseText) {
					// 得到返回数据
                    data = respnoseText.data;

                    // 显示基本数据
					self.CardManageList(data);

                }, 0);
			},

			// 显示基本数据
			CardManageList: function (data) {
				// 从缓存中获取到cardId
				var cardId = person_get_data().card_id;
				// 每次读取图片之前先清空里面的图片
				//$('#cardLogo').attr('src','');
				// 会员卡logo

				if (data.is_logo == 0) {
					$('#cardLogo').html('<img class="vipcard-content-img" src="../../img/base/no-pic.png">');
				} else {
					$('#cardLogo').html('<img class="vipcard-content-img" src="../../img/business/'+cardId+'/logo.jpg?'+Math.random()+'">');
				};

				// $('#cardLogo').html('<img class="vipcard-content-img" src="../../img/business/'+cardId+'/logo.jpg?'+Math.random()+'">');

				// 会员卡名称
				$('#cardName').text(data.card_name);
				// 使用范围
				$('#cardScope').text(data.card_scope);

				// 会员价适用范围
				var memberPriceUsed = '';
				if (data.member_price_used == '') {
					memberPriceUsed += '都不适用';
				} else {
					for (var i in data.member_price_used) {
						//alert(' ');
						if (data.member_price_used[i] == 1) {
							memberPriceUsed += '普通会员（所有领卡会员都可享受会员价）<br/>';
						} else if (data.member_price_used[i] == 2) {
							memberPriceUsed += '储值会员（储值过，且有余额，才享受会员价)<br/>';
						} else if (data.member_price_used[i] == 3) {
							memberPriceUsed += '折扣会员（仅有打折额度的会员可享受会员价）<br/>';
						} else if (data.member_price_used[i] == 4) {
							memberPriceUsed += '授权会员（仅扫码授权过的会员可享受会员价）<br/>';
						} else {
							memberPriceUsed += '都不适用';
						}
					}
				}

				$('#memberPriceUsed').html(memberPriceUsed);


				var cardBg = data.card_background;
				var companyBg = data.company_background;

				// 会员卡背景
				if (cardBg == 1 || cardBg == 2 || cardBg == 3) {
					$('#cardBackground').html('<img src="../../img/base/bg0'+cardBg+'.png?'+Math.random()+'">');
				} else if (cardBg == 0) {
					$('#cardBackground').html('<img src="../../img/business/'+cardId+'/card_background.jpg?'+Math.random()+'">');
				}
				
				// 商户背景
				if (companyBg == 1 || companyBg == 2 || companyBg == 3) {
					$('#companyBackground').html('<img src="../../img/base/bg0'+companyBg+'.png?'+Math.random()+'">');
				} else if (companyBg == 0) {
					$('#companyBackground').html('<img src="../../img/business/'+cardId+'/company_background.jpg?'+Math.random()+'">');
				}
				
			},

			// 绑定点击事件
			CardManageBind: function () {
				// 点击修改商户信息
				$('#consumebtn').unbind('click').bind('click', function () {
					Cache.set('totalcardData',data);
					// 跳转到修改
					window.location.replace('cardEdit.html?v=' + version);
				});
			} 
		}

		CardManagePage.init();

});