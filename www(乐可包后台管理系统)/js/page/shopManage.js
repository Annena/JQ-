$(function () {

	// 门店管理shopManage
		

        // 从缓存中得到用户是否有添加修改权限
        var perIsEdit = Cache.get('perIsEdit');
        //是否查询 0否  1是
        var is_select = 0;
        // 获取存储查询数据的缓存
        var selectData = Cache.get('selectData');
        // 是否三十秒到了 0 否 1 是
        var is_second = 0;
        // 是否有门店
        var is_shop = 0;

		var ShopManagePage = {

			init: function () {
				// 判断如果等于undefined说明没有添加修改权限
				if (perIsEdit['门店添加修改'] == undefined) {
					$('#permissions').addClass('hide');
					$('#operation').addClass('hide');
				} else {
					$('#permissions').removeClass('hide');
					$('#operation').removeClass('hide');
				}
				// 显示省份、城市、区域
				this.procityArea();
				//alert('ddd');
				// 绑定点击事件
				this.ShopManageBind();
			},

			// 显示省份、城市、区域、门店
			procityArea: function () {
				var self = this;
                setAjax(AdminUrl.shopPositionList, {}, $('#prompt-message'), {20: ''}, function(respnoseText) {
                    var data = respnoseText.data;
                    // 显示三级联动
                    self.cityAreaList(data);
                }, 0);
			},

			// 显示省份、城市、区域数据三级联动
			cityAreaList: function (data) {

				SPT="";
				SCT="";
				SAT="";
				ShowT=1;		//提示文字 0:不显示 1:显示
				PCAD = '';
				var num = 0;
				var num1 = 0;
				for (var i in data) {
					// 如果是总部的话就跳过总部
					if (i == '总部') {
						continue;
					}
					//alert('-=-iiiii'+i);s// 省份
					if (num1 == 0) {
						PCAD += i;
					} else {
						PCAD += '#'+i;
					}
					num1 ++;
					num = 0;
					for (var j in data[i]) {
						//alert('-=-jjjjj'+j);// 城市
						if (num == 0) {
							//alert('dd');
							PCAD += '$'+j;
						} else {
							PCAD += '|'+j;
						}
						num ++;
						for (var k in data[i][j]) {
							//alert(data[i][j][k]);// 区域
							PCAD += ','+k;
						}
					}
				}
				if (PCAD != '') {
					if(ShowT)PCAD=PCAD;PCAArea=[];
					PCAP=[];
					PCAC=[];
					PCAA=[];
					PCAN=PCAD.split("#");
					for(i=0;i<PCAN.length;i++){
						PCAA[i]=[];
						TArea=PCAN[i].split("$")[1].split("|");
						for(j=0;j<TArea.length;j++){
							PCAA[i][j]=TArea[j].split(",");
							if(PCAA[i][j].length==1)PCAA[i][j][1]=SAT;
							TArea[j]=TArea[j].split(",")[0]
						}
						PCAArea[i]=PCAN[i].split("$")[0]+","+TArea.join(",");
						PCAP[i]=PCAArea[i].split(",")[0];PCAC[i]=PCAArea[i].split(',')
					}
				
					if (getQueryString('is_select') == 1 && selectData) {
						is_select = getQueryString('is_select');
						
						new PCAST("province","city","area",selectData.shop_province,selectData.shop_city,selectData.shop_area);
						$("#shopStatusList").val(selectData.shop_status);
						// 点击搜索的时候获取到搜索按钮旁边的条件选的是什么
						// 然后保存到缓存中，点击列表中的修改时传给修改
						Cache.set('shopStatusList', $("#shopStatusList").val());

						this.selectShop();
					} else {
						// 默认显示的省份城市区域
						new PCAST("province","city","area","北京市","北京","朝阳区");
					}
				} else {
					is_shop = 1;
				}
			},

			// 绑定点击事件
			ShopManageBind: function () {
				var _self = this;
				// 点击修改
				$('#tbodys').delegate('tr', 'click', function(event) {
                    var self = this,
                    shopId = $(self).attr('shop-id'),
                    type = $(event.target).attr('data-type');

                    if (type == 'update') {
	                    // 点击修改的时候，创建一个数据，存储要修改的这一行的信息，然后存到缓存中，到修改页面取出来填充到页面中去
	                    var shopName = $(self).find('td[data-type="shopName"]').text();
	                    var shopTel =$(self).find('td[data-type="shopTel"]').text();
	                    var shopProvince =$(self).find('td[data-type="shopProvince"]').text();
	                    var shopCity =$(self).find('td[data-type="shopCity"]').text();
	                    var shopArea =$(self).find('td[data-type="shopArea"]').text();
	                    var shopAddr =$(self).find('td[data-type="shopAddr"]').text();
	                    var discountMax =$(self).find('td[data-type="discountMax"]').text();
	                    var openTime =$(self).find('td[data-type="openTime"]').text();
	                    var closeTime =$(self).find('td[data-type="closeTime"]').text();
	                    var shopDid =$(self).find('td[data-type="shopDid"]').text();
	                    var isAutoMember = $(self).find('td[data-type="isAutoMember"]').text();
	                    // 抹零方式
	                    var smallChangeType = $(self).find('td[data-type="smallChangeType"]').text();
	                    // 是否打印退菜单 isPrintCheck
	                    var isPrintCheck = $(self).find('td[data-type="isPrintCheck"]').text();
	                    // 是否打印退单确认单
	                    var is_print_order_cancel = $(self).find('td[data-type="is_print_order_cancel"]').text();

	                    // 经纬度
	                    var addr_lat = $(self).find('td[data-type="addr_lat"]').text();
	                    var addr_lng = $(self).find('td[data-type="addr_lng"]').text();

	                    // 是否显示点赞信息
	                    var is_like = $(self).find('td[data-type="is_like"]').text();
	                    
	                    //APP点餐模式
	                    var shop_type_info = $(self).find('td[data-type="shop_type_info"]').text();

	                    var shopStatusList = Cache.get('shopStatusList');
	                    // 上面获取完shopStatusList这个缓存，就把缓存删除掉
	                    Cache.del('shopStatusList');

	                    var shopUp = {
							'shop_id': shopId,
							'shop_name': shopName,
							'shop_tel': shopTel,
							'shop_province': shopProvince,
							'shop_city': shopCity,
							'shop_area': shopArea,
							'shop_addr': shopAddr,
							'discount_max': discountMax,
							'open_time': openTime,
							'close_time': closeTime,
							'shop_status': shopStatusList,
							'shop_did': shopDid,
							'is_auto_member': isAutoMember,
							'small_change_type': smallChangeType,
							'is_print_check': isPrintCheck,
							'is_print_order_cancel': is_print_order_cancel,
							'addr_lat': addr_lat,
							'addr_lng': addr_lng,
							'is_like': is_like,
							'shop_type_info':shop_type_info
	                    };
	                    Cache.set('shopUp',shopUp);

						window.location.replace('shopEdit.html?v='+ version +'&shop_id='+shopId+'&is_select=1');
					} else if (type == 'zip') {// 下载
						if (is_second == 0) {
							is_second = 1;
							setTimeout(function () {
								is_second = 0;
							}, 6000);
							var CID = $.cookie('cid');
					        var business = location.href.split("//")[1].split('.')[0];

					        $('form').attr('action',AdminUrl.download_zip);
					        $('#cid').val(CID);
					        $('#company_name_en').val(business);
					        $('#shop_id').val(shopId);

					        $('form').submit();
				    	} else {
				    		displayMsg(ndPromptMsg, '正在下载中，请耐心等待！', 2000);
				    	}
					} else if (type == 'table') {// 预设桌台
						window.location.replace('shopTables.html?v='+ version +'&shop_id='+shopId+'&is_select=1');
					}
				});

				// 点击添加
				$('#consumebtn').unbind('click').bind('click', function () {
					window.location.replace('shopEdit.html?v='+ version +'&is_select='+is_select);
				});

				// 点击搜索
				$('#selectbtn').unbind('click').bind('click', function () {
					if (is_shop == 1) {
						displayMsgTime(ndPromptMsg, '请添加门店！', 2000);
						return;
					}
					is_select = 1;

					_self.selectShop();
					// 点击搜索的时候获取到搜索按钮旁边的条件选的是什么
					// 然后保存到缓存中，点击列表中的修改时传给修改
					Cache.set('sho pStatusList', $("#shopStatusList").val());
				});
			},

			// 搜索显示门店
			selectShop: function () {
				var self = this;
				
				$('#tbodys').html('');

				// 获取到搜索的项
				// 省份
				var shopProvince = $("#shopProvince").val();
				// 城市
				var shopCity = $("#shopCity").val();
				// 区域
				var shopArea = $("#shopArea").val();
				// 状态
				var shopStatusList = $("#shopStatusList").val();

				// 存储查询数据
				var selectDa = {
                    'shop_province': shopProvince,
                    'shop_city': shopCity,
                    'shop_area': shopArea,
                    'shop_status': shopStatusList
				};
				Cache.set('selectData', selectDa);

				//alert(shopStatusList);
                setAjax(AdminUrl.shopAreaShopList, {
                    'shop_province': shopProvince,
                    'shop_city': shopCity,
                    'shop_area': shopArea,
                    'shop_status': shopStatusList
                }, $('#prompt-message'), {20: ''}, function(respnoseText) {
					// 得到返回数据
                    var data = respnoseText.data;

					self.ShopManageList(data);

                }, 2);
			},

			// 显示数据
			ShopManageList: function (data) {
					var content = '';

					for (var i in data) {
						content += '<tr class="total-tr" shop-id="'+data[i].shop_id+'">'+
				                        '<td class="total-shopnametxt" data-type="shopName">'+data[i].shop_name+'</td>'+
				                        '<td class="total-addr">'+data[i].shop_province+data[i].shop_city+data[i].shop_area+data[i].shop_addr+'</td>'+
				                        '<td class="total-tel" data-type="shopTel">'+data[i].shop_tel+'</td>'+
				                        (perIsEdit['门店添加修改'] == undefined ? '' :
				                        '<td class="'+(data[i].is_download == 0 ? 'total-caozuo':'total-caozuo-2')+' clearfix">'+
				                            '<span>'+
				                                '<input type="button" value="修改" data-type="update" class="stores-caozuo-btn">'+
				                            '</span>'+
				                            '<span>'+
				                                '<input type="button" value="下载" data-type="zip" class="stores-caozuo-btn">'+
				                            '</span>'+
				                            //is_download==1时，预设桌台按钮不显示或者不允许点击
				                            (data[i].is_download == 1 ? '' :
											'<span>'+
				                                '<input type="button" value="预设桌台" data-type="table" class="stores-caozuo-btn">'+
				                            '</span>')+
				                        '</td>')+
				                        '<td class="hide" data-type="shop_type_info">'+data[i].shop_type_info+'</td>'+
				                        '<td class="hide" data-type="shopProvince">'+data[i].shop_province+'</td>'+
				                        '<td class="hide" data-type="isAutoMember">'+data[i].is_auto_member+'</td>'+
				                        '<td class="hide" data-type="smallChangeType">'+data[i].small_change_type+'</td>'+
				                        '<td class="hide" data-type="isPrintCheck">'+data[i].is_print_check+'</td>'+
				                        '<td class="hide" data-type="is_print_order_cancel">'+data[i].is_print_order_cancel+'</td>'+
				                        '<td class="hide" data-type="shopCity">'+data[i].shop_city+'</td>'+
				                        '<td class="hide" data-type="shopArea">'+data[i].shop_area+'</td>'+
				                        '<td class="hide" data-type="shopAddr">'+data[i].shop_addr+'</td>'+
				                        '<td class="hide" data-type="discountMax">'+data[i].discount_max+'</td>'+
				                        '<td class="hide" data-type="openTime">'+data[i].open_time+'</td>'+
				                        '<td class="hide" data-type="closeTime">'+data[i].close_time+'</td>'+
				                        '<td class="hide" data-type="shopDid">'+data[i].shop_did+'</td>'+
				                        '<td class="hide" data-type="addr_lat">'+data[i].addr_lat+'</td>'+
				                        '<td class="hide" data-type="addr_lng">'+data[i].addr_lng+'</td>'+
				                        '<td class="hide" data-type="is_like">'+data[i].is_like+'</td>'+
				                    '</tr>';
					}
					// 添加到页面中
					$('#tbodys').html(content);
			}

		}

		ShopManagePage.init();

});
