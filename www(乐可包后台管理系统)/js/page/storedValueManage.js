$(function () {

	//  储值卡管理
		// 定义状态参数 0:正常，1：下架，默认是0显示正常列表
        var storedStatus = 0;
        // 从缓存中得到用户是否有添加修改权限
        var perIsEdit = Cache.get('perIsEdit');
 		var sale_shop_id = 'all'
 		var shopid = '' //搜索的门店ID
 		var shopName = '' //搜索的门店名称
 		var shuju = {}
		var StoredValueManage = {

			init: function () {
				var self = this;
				self.shopList()
				//判断如果等于undefined说明没有添加修改权限
				if (perIsEdit['储值卡添加修改'] == undefined) {
					$('#permissions').addClass('hide');
					$('#operation').addClass('hide');
				} else {
					$('#permissions').removeClass('hide');
					$('#operation').removeClass('hide');
				}

				// 是否从添加修改 返回回来的
				if (getQueryString('is_select') == 1) {
					self.clickLabel(parseFloat(getQueryString('type')));
				} else {
					// 显示数据\
					this.StoredValueData(storedStatus);
				}

				// 绑定点击事件
				this.StoredValueBind();
			},
		    // 显示店铺
		    shopList:function(data)  {
		    	var self = this;
		    	var content = '<option value="all">全部</option><option value="ssonlinesale">在线售卖</option>';          
		        setAjax(AdminUrl.shopShopList, {
		            'type': 2
		        }, $('#prompt-message'), {20: ''}, function(respnoseText) {
		            // 得到返回数据
		            var data = respnoseText.data;
			        for (var i in data) {
			            content += '<option value="'+data[i].shop_id+'">'+data[i].shop_name+'</option>';
			        }
			        // 添加到页面中
			        $('#shopList').html(content);
		        }, 0);
		    },
		    // 请求显示数据
			StoredValueData: function (storedStatus) {
				// 请求数据之前先清空列表内容
				$('#tbodys').html('');
				var self = this;
                setAjax(AdminUrl.storetStoredList, {
                    'stored_status': storedStatus,
                    'sale_shop_id':sale_shop_id
                }, $('#prompt-message'), {20: ''}, function(respnoseText) {
					// 得到返回数据
                    var data = respnoseText.data;
                    shuju = respnoseText.data;
                    // 显示数据
                    self.StoredValueList(data);
                }, 1);
			},
			// 显示数据
			StoredValueList: function (data) {

				var sale = {
					1: '线上售卖+全部门店售卖',
					2: '线上售卖+指定门店售卖',
					3: '仅支持线上售卖',
					4: '仅支持全部门店售卖',
					5: '仅支持指定门店售卖'
				}

				var content = '';
				//查询的是门店还是总部
	            shopid = $('#shopList').val()
	            shopName = $('#shopList option:selected').text()
	            $('#shopName').text($('#shopList option:selected').text())
	            if($('#shopList option:selected').text() == '全部'){
					 $('#shopName').text('全部适用门店')
				}

		        // 如果是在线售卖查询过来的不显示提成金额列
		        if (sale_shop_id == 'ssonlinesale') {
		        	$('#sale_display').addClass('hide');
		        } else {
		        	$('#sale_display').removeClass('hide');
		        }

				for (var i in data) {
					var st_text = data[i].is_repeat == 0 ? '满' : '每满';

					content += '<tr class="total-tr" stored-id="'+data[i].stored_id+'">'+
			                        '<td class="tdjianju" data-type="storedName">'+data[i].stored_name+'</td>'+
			                        '<td class="tdjianju" data-type="storedMoney">'+(data[i].is_custom == 0 ? data[i].stored_money : '任意金额')+'</td>'+
			                        '<td class="tdjianju" data-type="giveMoney">'+(data[i].is_custom == 0 ? data[i].give_money : (data[i].give_rate == 0 ? 0 : data[i].give_rate+'%'))+'</td>'+
			                       
			                        '<td class="tdjianju">'+
			                        ((data[i].give_voucher_id == null || data[i].give_voucher_id == '') ? '无':data[i].give_voucher_name+'<br>'+
			                        	((data[i].give_voucher_money == 0 || data[i].give_voucher_money == null) ? '' 
											: st_text+data[i].give_voucher_money+'元')+'赠'+data[i].give_voucher_num+'张')+
			                        '</td>'+
			                        '<td class="tdjianju" data-type="integralName">'+data[i].integral_num+'</td>'+
			                        '<td class="tdjianju" data-type="startTime">'+getAppointTime(data[i].start_time)+'</td>'+
			                        '<td class="tdjianju" data-type="endTime">'+getAppointTime(data[i].end_time)+'</td>'+
			                        '<td class="tdjianju">'+sale[data[i].sale_mode]+'</td>'+

			                        // 如果是在线售卖查询过来的不显示提成金额列
			                        (sale_shop_id == 'ssonlinesale' ? '' :
									'<td style="width:6%" data-type="sale_commission">'+(data[i].sale_commission[shopid] == undefined ? data[i].sale_commission.all : data[i].sale_commission[shopid])+'</td>')+

									'<td class="hide" data-type="allSale_commission">'+data[i].sale_commission.all+'</td>'+

									'<td class="hide" data-type="saleCommission">'+(shopid != 'all' && data[i].sale_commission[shopid]!= undefined ? data[i].sale_commission[shopid] : '')+'</td>'+
									'<td class="hide" data-type="integral_num">'+data[i].integral_num+'</td>'+
			                        '<td class="hide" data-type="saleMode">'+data[i].sale_mode+'</td>'+
			                        '<td class="hide" data-type="is_custom">'+data[i].is_custom+'</td>'+
			                        '<td class="hide" data-type="give_voucher_id">'+data[i].give_voucher_id+'</td>'+
			                        '<td class="hide" data-type="give_rate">'+data[i].give_rate+'</td>'+
			                        '<td class="hide" data-type="is_repeat">'+data[i].is_repeat+'</td>'+
			                        '<td class="hide" data-type="shop_ids">'+data[i].shop_ids+'</td>'+
			                        '<td class="hide" data-type="give_voucher_num">'+data[i].give_voucher_num+'</td>'+
			                        '<td class="hide" data-type="give_voucher_money">'+data[i].give_voucher_money+'</td>'+
			                        (perIsEdit['储值卡添加修改'] == undefined ? '' :
			                        '<td class="total-caozuo" clearfix>'+
			                            '<span>'+
			                                '<input type="button" value="修改" data-type="update" class="stores-caozuo-btn">'+
			                            '</span>'+
			                        '</td>')+
			                    '</tr>';
				}
				// 添加到页面中
				$('#tbodys').html(content);
			},

			// 绑定点击事件
			StoredValueBind: function () {
				var self = this;
				// 点击修改
				$('#tbodys').delegate('tr', 'click', function(event) {
                    var self = this,
                    storedId = $(self).attr('stored-id'),
                    type = $(event.target).attr('data-type');

                    if (type == 'update') {
	                    // 点击修改的时候，创建一个数据，存储要修改的这一行的信息，然后存到缓存中，到修改页面取出来填充到页面中去
	                    
	                    var storedName = $(self).find('td[data-type="storedName"]').text();
	                    var storedMoney =$(self).find('td[data-type="storedMoney"]').text();
	                    var integral_num =$(self).find('td[data-type="integral_num"]').text();
	                    var giveMoney =$(self).find('td[data-type="giveMoney"]').text();
	                    var startTime =$(self).find('td[data-type="startTime"]').text();
	                    var endTime =$(self).find('td[data-type="endTime"]').text();
	                    var saleMode =$(self).find('td[data-type="saleMode"]').text();
	                    var shop_ids = $(self).find('td[data-type="shop_ids"]').text();
	                    var is_custom = $(self).find('td[data-type="is_custom"]').text();
	                    var give_voucher_id = $(self).find('td[data-type="give_voucher_id"]').text();
	                    var give_voucher_num = $(self).find('td[data-type="give_voucher_num"]').text();
	                    var give_voucher_money = $(self).find('td[data-type="give_voucher_money"]').text();
	                    var allSale_commission = $(self).find('td[data-type="allSale_commission"]').text(); 
	                    var saleCommission = $(self).find('td[data-type="saleCommission"]').text(); 
	                    //提成金额
	                    if(saleCommission != ''){
	                    	sale_commission = saleCommission
	                    }else{
	                    	sale_commission = 'ssssssssssss'
	                    }                    
	                    //  is_repeat = 1可以累计
	                    var is_repeat = $(self).find('td[data-type="is_repeat"]').text();
	                    // 赠送百分比
	                    var give_rate =  $(self).find('td[data-type="give_rate"]').text();


	                    var stoUp = {
							'stored_id': storedId,
							'stored_name': storedName,
							'stored_money': storedMoney,
							'integral_num': integral_num,
							'give_money': giveMoney,
							'start_time': startTime,
							'end_time': endTime,
							'sale_mode': saleMode,
							'stored_status': storedStatus,
							'is_custom': is_custom,
							'give_voucher_id': give_voucher_id,
							'give_voucher_num': give_voucher_num,
							'give_voucher_money': give_voucher_money,
							'is_repeat': is_repeat,
							'give_rate': give_rate,
							'shop_id':shop_ids,
							'allSale_commission':allSale_commission,
							'sale_commission':sale_commission,
							'shopid':shopid,
							'shopName':shopName
	                    };
	                    Cache.set('stoUp',stoUp);

						window.location.replace('storedValueEdit.html?stored_id='+storedId+'&type='+storedStatus+'&addIsUp=1');
					}
				});

				// 点击储值卡列表
				$('#storedMan').unbind('click').bind('click', function () {
					self.clickLabel(0);
				});

				// 点击下架列表
				$('#storedShe').unbind('click').bind('click', function () {
					self.clickLabel(1);
				});
				
				// 点击当日可用额度
				$('#todayCreditBtn').unbind('click').bind('click', function () {
					
					// 点击下架列表，删除选中样式，添加不选中的样式
					$('#storedShe').removeClass('caipin-fenleicheck');
					$('#storedShe').addClass('caipin-fenleinucheck');
					
					$('#permissions').addClass('hide');
					$('#permissionsSave').removeClass('hide');
					
					// 储值卡列表，删除选中样式，添加不选中的样式
					$('#storedMan').removeClass('caipin-fenleicheck');
					$('#storedMan').addClass('caipin-fenleinucheck');
					
					// 当日可用额度，删除不选中的样式，添加选中的样式
					$('#todayCreditBtn').removeClass('caipin-fenleinucheck');
					$('#todayCreditBtn').addClass('caipin-fenleicheck');
					
					
					if (perIsEdit['储值卡添加修改'] == undefined) {
						$('#permissions').addClass('hide');
						$('#permissionsSave').addClass('hide');
					} 
						
					//添加储值卡保存切换
					$('.stores-content').addClass('hide');
					$('#todayCreditBox').removeClass('hide');

					self.todayCreditSend(0);//刷入数值

					// storedStatus传到修改页面
					//storedStatus = 1;
				});
				
				// 点击添加
				$('#updatebtn').unbind('click').bind('click', function () {
					window.location.replace('storedValueEdit.html?type='+storedStatus+'&addIsUp=0');
				});
				
				//添加设定储值卡当日额度上传按钮
				$("#todayCreditEdit").click(function(){
					self.todayCreditSend(1);
				});

				// 当日可用额度输入校验
				$('#todayCredit').unbind('input').bind('input', function () {
					checkNum('todayCredit', 0);
				});
				// 点击搜索
				$('#selectbtn').unbind('click').bind('click', function () {
					sale_shop_id = $('#shopList').val();
					self.StoredValueData(storedStatus)
				});				

			},

			// 点击标签页显示隐藏 调用数据
			clickLabel: function (type) {
				var self = this;

				switch(type) {
					case 0:
						// 点击储值卡列表，删除不选中的样式，添加选中的样式
						$('#storedMan').removeClass('caipin-fenleinucheck');
						$('#storedMan').addClass('caipin-fenleicheck');
						// 下架列表，删除选中样式，添加不选中的样式
						$('#storedShe').removeClass('caipin-fenleicheck');
						$('#storedShe').addClass('caipin-fenleinucheck');

						// 当日可用额度，删除选中的样式，添加不选中的样式
						$('#todayCreditBtn').removeClass('caipin-fenleicheck');
						$('#todayCreditBtn').addClass('caipin-fenleinucheck');
						
						if (perIsEdit['储值卡添加修改'] == undefined) {
							$('#permissions').addClass('hide');
						} else {
							//添加储值卡保存切换
						$('#permissions').removeClass('hide');
						$('#permissionsSave').addClass('hide');
							
						}
						self.StoredValueData(0);
						
						$('.stores-content').removeClass('hide');
						$('#todayCreditBox').addClass('hide');

						// storedStatus传到修改页面
						storedStatus = 0;
					break;
					case 1:
						// 点击下架列表，删除不选中的样式，添加选中的样式
						$('#storedShe').removeClass('caipin-fenleinucheck');
						$('#storedShe').addClass('caipin-fenleicheck');
						
						// 储值卡列表，删除选中样式，添加不选中的样式
						$('#storedMan').removeClass('caipin-fenleicheck');
						$('#storedMan').addClass('caipin-fenleinucheck');
						//添加储值卡保存切换
						if (perIsEdit['储值卡添加修改'] == undefined) {
							$('#permissions').addClass('hide');
						} else {
							
						$('#permissions').removeClass('hide');
						$('#permissionsSave').addClass('hide');
							
						}
						// 当日可用额度，删除选中的样式，添加不选中的样式
						$('#todayCreditBtn').removeClass('caipin-fenleicheck');
						$('#todayCreditBtn').addClass('caipin-fenleinucheck');

						self.StoredValueData(1);
						
						$('.stores-content').removeClass('hide');
						$('#todayCreditBox').addClass('hide');

						// storedStatus传到修改页面
						storedStatus = 1;
					break;
				}
			},


			//设置当日可用额度
			todayCreditSend: function(state){
				if(state == 0){//刷入数值
					$('#todayCredit').val('');
					var self = this;
					
					setAjax(AdminUrl.storedQuotaInfo, {
						//'stored_status': storedStatus
					}, $('#prompt-message'), {20: ''}, function(respnoseText) {
					
					// 得到返回数据
                    var data = respnoseText.data;
                    
					// 显示数据
                    $('#todayCredit').val(data);
					
					//self.StoredValueList(data);
					
					}, 1);
				}
				
				if(state == 1){//上传数值
					var _num = $('#todayCredit').val();
					var reg = /^([0-9]?[0-9]|100)$/;//正则只能是数字
					
					if(reg.test(_num)&&_num<=100&&_num>0){//上传额度
					
						setAjax(AdminUrl.setStoredQuota, {
							'used_stored_quota': _num
						}, $('#prompt-message'), {20: ''}, function(respnoseText) {
							if (respnoseText.code == 20) {
							
							// 得到返回数据
								displayMsg(ndPromptMsg, respnoseText.message, 2000);
							} else {
								displayMsg(ndPromptMsg, respnoseText.message, 2000);
							}
						},0);
					}else{
						displayMsg(ndPromptMsg,"只能输入数字，且1-100的整数", 2000);
						return false;
					}
					
					
				}
			}
		}

		StoredValueManage.init();

});

