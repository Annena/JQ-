$(function () {
	// 修改会员卡信息cardManageEdit



        // 从缓存中获取到列表存储的修改数据
        var data = Cache.get('totalcardData');

        var CID = $.cookie('cid');
        // 商户英文名
        var business = location.href.split("//")[1].split('.')[0];

		var cardManageEdit = {

			init: function () {
				// 显示数据
				this.CardManageList(data);
				// 绑定点击事件
				this.CardManageBind();
			},

			// 显示数据
			/*CardManageData: function () {
				var self = this;
                setAjax(AdminUrl.infoCardInfo, {
                    'cid': Cache.get('getCID'))
                }, $('#prompt-message'), {20: ''}, function(respnoseText) {
					// 得到返回数据
                    var data = respnoseText.data;

                    // 显示基本数据
                    self.CardManageList(data);
                    

                }, 2);
			},*/

			// 显示基本数据
			CardManageList: function (data) {
				// 从缓存中获取到cardId
				var cardId = person_get_data().card_id;
				// 会员卡logo
				if (data.is_logo == 0) {
					$('#cardLogo').attr('src','../../img/base/no-pic.png');
					// 会员卡、商户页背景预览效果 logo
					$('#cardLogo-1').attr('src','../../img/base/no-pic.png');
					$('#cardLogo-2').attr('src','../../img/base/no-pic.png');
				} else {
					$('#cardLogo').attr('src','../../img/business/'+cardId+'/logo.jpg?'+Math.random());
					// 会员卡、商户页背景预览效果 logo
					$('#cardLogo-1').attr('src','../../img/business/'+cardId+'/logo.jpg?'+Math.random());
					$('#cardLogo-2').attr('src','../../img/business/'+cardId+'/logo.jpg?'+Math.random());
				};

				//$('#cardLogo').attr('src','../../img/business/'+cardId+'/logo.jpg?'+Math.random());
				//alert(data.card_name);
				// 会员卡名称
				$('#cardName').val(data.card_name);
				// 会员卡、商户页背景预览效果 会员卡名称
				$('#cardName-1').text(data.card_name);
				$('#cardName-2').text(data.card_name);

				// 适用范围
				$('#cardScope').val(data.card_scope);
				// 会员卡背景预览效果 适用范围
				$('#cardScope-1').text(data.card_scope);

				// 会员价适用范围

				$('.member_price_used').find('input[type="checkbox"]').each(function(i,valt){
					for (var i in data.member_price_used) {
						//alert(data.member_price_used[i]);
						if (data.member_price_used[i] == valt.value) {
							//alert(data.member_price_used[i]+'---');
							$(this).attr('checked','checked');
						}
					}
				});

				var cardBg = data.card_background;
				var companyBg = data.company_background;
				
				// 会员卡背景   图片路径后面添加一个随机数，这样第一次修改图片之后，再次修改图片，图片名称虽然不变，但是图片就会改变，不会再缓存
				$('#card_'+cardBg).attr('checked','checked');
				$('#card_custom').attr('src','../../img/business/'+cardId+'/card_background.jpg?'+Math.random());
				
				
				// 商户背景
				$('#company_'+companyBg).attr('checked','checked');
				$('#company_custom').attr('src','../../img/business/'+cardId+'/company_background.jpg?'+Math.random());

				// 会员卡、商户页背景预览效果 背景图片
				if (cardBg == 0) {
					$('#card_custom_1').attr('src','../../img/business/'+cardId+'/card_background.jpg?'+Math.random());
				} else {
					$('#card_custom_1').attr('src','../../img/base/bg0'+cardBg+'.png');
				}

				if (companyBg == 0) {
					$('#company_custom_1').attr('src','../../img/business/'+cardId+'/company_background.jpg?'+Math.random());
				} else {
					$('#company_custom_1').attr('src','../../img/base/bg0'+companyBg+'.png');
				}
			},

			// 绑定点击事件
			CardManageBind: function () {
				var _self = this;
				// 点击保存
				$('#consumebtn').unbind('click').bind('click', function () {
					_self.CardManageUpdate();
				});
				// 点击取消
				$('#exitbtn').unbind('click').bind('click', function () {
					window.location.replace('cardManage.html');
				});

				// 点击会员卡背景自定义选择图片，选中
				$("#card_file").change(function(){
	                var objUrl = getObjectURL(this.files[0]) ;
	                // 判断文件类型必须是JPG，png，bump中的一种
	                if(checkImgType(this)){
		                if (objUrl) {
		                    $("#card_custom").attr("src", objUrl);
		                    $('#card_0').attr('checked','true');
							$('#card_0').val('0');
		                    //$('#menuPic').html('<img src="'+objUrl+'">');
		                	// 会员卡背景预览效果 背景图片
		                	$('#card_custom_1').attr('src',objUrl);
		                }
	            	}
	            }) ;

	            // 点击商户背景自定义选择图片，选中
				$("#company_file").change(function(){
	                var objUrl = getObjectURL(this.files[0]) ;
					// 判断文件类型必须是JPG，png，bump中的一种
				 	if(checkImgType(this)){
	                	$('#company_0').attr('checked','true');
				 		$('#company_0').val('0');
				 	
		                if (objUrl) {
		                    $("#company_custom").attr("src", objUrl);
		                    //$('#menuPic').html('<img src="'+objUrl+'">');
		                    // 商户页背景预览效果 背景图片
		                    $('#company_custom_1').attr('src',objUrl);
		                }
		            }
	            });

				// 点击会员卡logo图片按钮后存取生成图片路径
				$("#logo_picture").change(function(){
	                var objUrl = getObjectURL(this.files[0]) ;
	                //alert(objUrl+'---5');
	                // 判断文件类型必须是JPG，png，bump中的一种
	                if(checkImgType(this)){

		                //$('#menuPic').removeClass('hide');
		                //console.log("objUrl = "+objUrl) ;
		                if (objUrl) {
		                    $("#cardLogo").attr("src", objUrl);
		                    //$('#menuPic').html('<img src="'+objUrl+'">');
							// 会员卡、商户页背景预览效果 logo
							$('#cardLogo-1').attr('src',objUrl);
							$('#cardLogo-2').attr('src',objUrl);
		                }
	            	}
	            });

				// 会员卡四个单选按钮的点击事件，为了预览效果的实现
	            $('#card_0,#card_1,#card_2,#card_3').unbind('click').bind('click', function () {
	            	//alert($(this).parent().parent().find('img').attr('src'));
	            	$('#card_custom_1').attr('src',$(this).parent().parent().find('img').attr('src'));
	            });

				// 商户页四个单选按钮的点击事件，为了预览效果的实现
	            $('#company_0,#company_1,#company_2,#company_3').unbind('click').bind('click', function () {
	            	$('#company_custom_1').attr('src',$(this).parent().parent().find('img').attr('src'));
	            });

	            //建立一個可存取到該file的url
	            function getObjectURL(file) {
	                var url = null ;
	                if (window.createObjectURL!=undefined) { // basic
	                    url = window.createObjectURL(file) ;
	                } else if (window.URL!=undefined) { // mozilla(firefox)
	                    url = window.URL.createObjectURL(file) ;
	                } else if (window.webkitURL!=undefined) { // webkit or chrome
	                    url = window.webkitURL.createObjectURL(file) ;
	                }
	                return url ;
	            }

			},

			// 表单提交数据
			CardManageUpdate: function () {
				// 获取到各个数据，请求接口提交数据
				// 把cid放进去
				$('#CID').val(CID);
				$('#companyNameEn').val(business);

				var cardScope = $('#cardScope').val();
				//var rel = /^[\u4E00-\u9FA5]+$/;
				var rel = /^[\u4E00-\u9FA5\s]+$/;
				if (!rel.test(cardScope)) {
					displayMsg($('#prompt-message'), '使用范围必须输入汉字或字母或空格', 2000);
					return;
				}
				var l = cardScope.length;
				var blen = 0;

				for(i=0; i<l; i++) {
					if ((cardScope.charCodeAt(i) & 0xff00) != 0) {
						blen++;
					}
					blen++;
				}
				if (blen.length > 10) {
				   displayMsg($('#prompt-message'), '使用范围最多二十个字符', 2000);
					return;
				}

				// 会员价适用范围
				var memberArray = new Array();
				var num = 1;
				$('.member_price_used').find('input[type="checkbox"]').each(function(i,valt){
					if ($(this).is(':checked')) {
						memberArray[num] = valt.value;
						num++;
					}
				});


				// 发卡额度
				var maxCardRate = $('#maxCardRate').val();


				// 效验数据通过才能修改
				if (this.dataCheck()) {
	                $("#form").ajaxSubmit({
	                    type: 'post',
	                    xhrFields:{withCredentials:true},
	                    url: AdminUrl.infoCardInfoUpdate,
	                    data: {
	                    	'member_price_used': memberArray
	                    },
	                    success: function (respnoseText) {
	                        //respnoseText = JSON.parse(respnoseText);
	                        console.log(respnoseText);
	                        var data = respnoseText.data;
	                        if (respnoseText.code == 20) {
	                            displayMsg($('#prompt-message'), respnoseText.message, 1000, function () {
	                                layer.close(layerBox);
	                                window.location.replace('cardManage.html');
	                            });
	                        } else {
	                            displayMsg($('#prompt-message'), respnoseText.message, 2000);
	                        }
	                    },
	                    error: function (XmlHttpRequest, textStatus, errorThrown) {
	                        displayMsg($('#prompt-message'), '图片上传失败', 2000);
	                    }
	                });
				}

                /*setAjax(AdminUrl.infoCardInfoUpdate, {
                    'card_name': infoId,
                    'card_background': infoId,
                    'company_background': infoId,
                    'cid': Cache.get('getCID'))
                }, $('#prompt-message'), {20: ''}, function(respnoseText) {
					// 得到返回数据
                    var data = respnoseText.data;

                }, 2);*/
				
			},

			// 效验要修改的数据
			dataCheck: function () {
	            if ( dataTest('#cardName', '#prompt-message', { 'empty': '不能为空'})
	            
	            ) {
	            	//alert('tt');
	                return true;
	            }

	            return false;
			}
		}

		cardManageEdit.init();

});