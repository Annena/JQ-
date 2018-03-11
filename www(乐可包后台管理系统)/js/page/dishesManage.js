$(function () {
	// 菜品列表
		document.onselectstart=new Function("event.returnValue=true;");
        // 定义菜品状态参数 0:正常，1：估清，2：下架，默认是0显示正常菜品列表
        var CID = $.cookie('cid');
    	var company_name_en = $.cookie('company_name_en') == undefined ? '' : $.cookie('company_name_en');
        var menuStatus = 0;
        // 从缓存中得到用户是否有添加修改权限
        var perIsEdit = Cache.get('perIsEdit');
        var isMenuType = 0;// 0:有权限，1：没权限
        // 门店且为菜品库时的id
        var libraryId={};
        // 用户修改之后的菜品数据
        var shopLibraryData = {};
        var DelShopLibraryData = [''];
        var ShopMenuList = {};
        var shop_menu_list = [];

        // 在批量修改时，用户点击单个修改时的this
        var typeThis;

        var shopData = {};
        var isFatherPriceList = false;
        var isFatherMemberList = false;
	    var shop_id = '';
		var shopName = '';
		var dishesData = '';
        var shop_ids = 'all';
        var isLabrary = false;
        var menu_price_list = [];
        var father_menu_price_list = [];
        var member_price_list = [];
        var father_member_price_list = [];
        var typeTy = 3; //页面的type值
        var top = '';
        var special_type = {
			0: '普通商品',
			1: '堂食餐包',
			2: '外卖餐包',
			3: '外卖送餐费',
			11: '百度外卖配送费',
			12: '饿了么外卖配送费',
			13: '美团外卖配送费',
			4: '商城配送费',
			5: '打包盒',
			6: '必点商品集1',
			7: '必点商品集2',
			8: '必点条件商品'
		};


		var DishesManage = {

			init: function () {
				var self = this;
				// 加载店铺数据（public.js中的公共调用方法）
				self.shopData();
				// 获得打印机数据
				self.PrintData();
				// 判断如果等于undefined说明没有添加修改权限
				if (perIsEdit['菜品添加修改'] == undefined) {
					$('#permissions').addClass('hide');
					$('#operation').addClass('hide');
				} else {
					$('#permissions').removeClass('hide');
					$('#operation').removeClass('hide');
				}
				// 判断如果等于undefined说明没有添加修改权限
				if (perIsEdit['菜品属性添加修改'] == undefined) {
					$('#permissionsProp').addClass('hide');
					$('#operation').addClass('hide');
				} else {
					$('#permissionsProp').removeClass('hide');
					$('#operation').removeClass('hide');
				}
				// 判断如果等于undefined说明没有添加修改权限
				if (perIsEdit['菜品类别添加修改'] == undefined) {
					$('#permissionsPro').addClass('hide');
					$('#operation').addClass('hide');
					// 保存排序隐藏
					$('#sortDisplay').addClass('hide');
					isMenuType = 1;
				} else {
					$('#permissionsPro').removeClass('hide');
					$('#operation').removeClass('hide');
					// 保存排序显示
					$('#sortDisplay').removeClass('hide');
					isMenuType = 0;
				}
				if (perIsEdit['菜品添加修改'] == undefined && perIsEdit['菜品类别添加修改'] == undefined && perIsEdit['菜品属性添加修改'] == undefined) {
					$('#updatebtn').addClass('hide');
				} else {
					$('#updatebtn').removeClass('hide');
				}

				// 是否从添加修改 返回回来的
				if (getQueryString('is_select') == 1) {
					// 返回时判断是否是门店
					if($.cookie('shopListcookie') != undefined){
						shop_ids = $.cookie('shopListcookie');
					}
					//判断哪一个table页
					typeTy = getQueryString('type');
					self.clickLabel(parseFloat(getQueryString('type')), 1);
					
					/*返回上次浏览位置*/					
					if ($.cookie('typeTy'+typeTy)) {
						$("html,body").animate({ scrollTop: $.cookie('typeTy'+typeTy) }, 0);
					}
					// 为2时是查看回来的
				}else if(getQueryString('is_select') == 2){
					// 获取从查看里面返回时，id从cookie中取得
					if($.cookie('shopListcookie') != undefined){
						shop_ids = $.cookie('shopListcookie');
					}
					// 标签
					typeTy = getQueryString('type');
					self.clickLabel(parseFloat(getQueryString('type')), 1)
					// shop_ids = ($.cookie('shopListcookie') != undefined ?  : 'all');
					
				}else{
					this.DishesData(menuStatus, 1);
				}
				// 绑定点击事件
				//this.DishesBind();
			},
		    // 三级级联显示店铺
		    shopData:function() {
		    	var self = this;
		        setAjax(AdminUrl.shopShopList, {
		            'type': 2
		        }, $('#prompt-message'), {20: ''}, function(respnoseText) {
		            // 得到返回数据
		            var data = respnoseText.data;
		            self.shopList(data);

		        }, 0);
		    },
		    // 显示店铺
		    shopList:function(data)  {
		        var content = '<option value="all">全部</option>';
		        for (var i in data) {
		            content += '<option value="'+data[i].shop_id+'">'+data[i].shop_name+'</option>';
		        }
		        // 添加到页面中
		        $('#shopList').html(content);
		        // ($('#shopList option:selected'))
		        if($.cookie('shopListcookie') != undefined){
					$('#shopList').val($.cookie('shopListcookie'))
				}
		       
		    },
			// 显示菜品数据 菜品列表和下架列表
			DishesData: function (menuStatus, num) {
				// 查询数据之前，先清空数据
				$('#dishesMaContent').html('');
				var self = this;
                setAjax(AdminUrl.menuMenuList, {
                    'menu_status': menuStatus,
                    'sale_shop_id':shop_ids,
                    // 是否为菜品库，1为售卖、下架，0为菜品库
                    'is_shop':(typeTy == '5' ? 0 : 1)
                }, $('#prompt-message'), {20: ''}, function(respnoseText) {
					// 得到返回数据
                    dishesData = respnoseText.data;
                    if (respnoseText.code == 20) {
						// 存储是否支持物料消耗（套餐不支持物料消耗设置）
						$.cookie('is_consume_materiel', dishesData.depot_info.is_consume_materiel);
						delete dishesData.depot_info;
						// 显示数据
						self.DishesList(dishesData,menuStatus);
					} else {
						displayMsg($('#prompt-message'), respnoseText.message, 2000);
					}
					if (num == 1) {
                    // 绑定点击事件
                    self.DishesBind();
					}
                }, 0);
			},
			// 显示菜品数据
			DishesList: function (data,menuStatus) {
				// 删除 是否支持物料消耗，避免加载列表数据把他加载出来
				delete data.depot_info;
				shopData = {};
				// 分类总共
				var content = '';
				var self = this;
				// 菜品
				var contentShop = '';
				var contentPro = '';
				// var shopData = {};
				var allData = {};
				var totalBackgrund = 'total-tr';
				shopName = $('#shopList option:selected').text()
				if(shopName == '全部'){
					shopName = '全部适用门店';
				}
		  		//查询的是门店还是总部
	            shop_id = $('#shopList').val();
	            // 内容信息
				for (var i in data.menu_store) {
					contentPro = '';
					var x=0;
					for (var j in data.menu_store[i].menu_list) {
						shopData[j] = {};
						if(shop_id != 'all'){

							$('#addPackage').addClass('hide');
							//门店的信息
							if(data.menu_store[i].menu_list[j] == 0){
								// 提示数据为空
							}else{
								// 门店的信息初始化
								shopData[j] = data.menu_store[i].menu_list[j];
								// 查看门店信息是否有个性化/自定义
								if(data.menu[j] != undefined){ 
									shopData[j].menu_id = data.menu[j].menu_id;
									shopData[j].father_menu_name = isFather(data.menu[j],data.menu_store[i].menu_list[j],'menu_name');
									shopData[j].menu_name = isFollow(data.menu[j],data.menu_store[i].menu_list[j],'menu_name');
									shopData[j].father_menu_price = isFather(data.menu[j],data.menu_store[i].menu_list[j],'menu_price');									
									shopData[j].menu_price = isFollow(data.menu[j],data.menu_store[i].menu_list[j],'menu_price');
									shopData[j].father_member_price = isFather(data.menu[j],data.menu_store[i].menu_list[j],'member_price');
									shopData[j].member_price = isFollow(data.menu[j],data.menu_store[i].menu_list[j],'member_price');
									
									// 价格策略、价格会员策略
									father_menu_price_list[j] = isFather(data.menu[j],data.menu_store[i].menu_list[j],'menu_price_list');
									menu_price_list[j] = isFollow(data.menu[j],data.menu_store[i].menu_list[j],'menu_price_list');
									father_member_price_list[j] = isFather(data.menu[j],data.menu_store[i].menu_list[j],'member_price_list');
									member_price_list[j] = isFollow(data.menu[j],data.menu_store[i].menu_list[j],'member_price_list');
									
									// shopData[j].menu_unit = data.menu_store[i].menu_list[j].menu_unit;
									shopData[j].father_is_discount = isFather(data.menu[j],data.menu_store[i].menu_list[j],'is_discount');
									shopData[j].is_discount = isFollow(data.menu[j],data.menu_store[i].menu_list[j],'is_discount');
									shopData[j].father_is_give = isFather(data.menu[j],data.menu_store[i].menu_list[j],'is_give');								
									shopData[j].is_give =  isFollow(data.menu[j],data.menu_store[i].menu_list[j],'is_give');
									
									shopData[j].father_special_type = isFather(data.menu[j],data.menu_store[i].menu_list[j],'special_type');
									shopData[j].special_type = isFollow(data.menu[j],data.menu_store[i].menu_list[j],'special_type');
									shopData[j].father_sale_commission = isFather(data.menu[j],data.menu_store[i].menu_list[j],'sale_commission');								
									shopData[j].sale_commission = isFollow(data.menu[j],data.menu_store[i].menu_list[j],'sale_commission');
									
									// 不显示在页面上，但是门店可以自定义的属性
									shopData[j].father_pack_id = isFather(data.menu[j],data.menu_store[i].menu_list[j],'sale_commission');
									shopData[j].pack_id = isFollow(data.menu[j],data.menu_store[i].menu_list[j],'pack_id');
									shopData[j].father_printer_id = isFather(data.menu[j],data.menu_store[i].menu_list[j],'printer_id');
									shopData[j].printer_id = isFollow(data.menu[j],data.menu_store[i].menu_list[j],'printer_id');
									shopData[j].father_pass_printer_id = isFather(data.menu[j],data.menu_store[i].menu_list[j],'pass_printer_id');
									shopData[j].pass_printer_id = isFollow(data.menu[j],data.menu_store[i].menu_list[j],'pass_printer_id');
									shopData[j].father_jardiniere_printer_id = isFather(data.menu[j],data.menu_store[i].menu_list[j],'jardiniere_printer_id');
									shopData[j].jardiniere_printer_id = isFollow(data.menu[j],data.menu_store[i].menu_list[j],'jardiniere_printer_id');
									shopData[j].father_produce_printer_id = isFather(data.menu[j],data.menu_store[i].menu_list[j],'produce_printer_id');
									shopData[j].produce_printer_id = isFollow(data.menu[j],data.menu_store[i].menu_list[j],'produce_printer_id');
									shopData[j].father_produce_type = isFather(data.menu[j],data.menu_store[i].menu_list[j],'produce_type');
									shopData[j].produce_type = isFollow(data.menu[j],data.menu_store[i].menu_list[j],'produce_type');
									shopData[j].father_tag_printer_id = isFather(data.menu[j],data.menu_store[i].menu_list[j],'tag_printer_id');
									shopData[j].tag_printer_id = isFollow(data.menu[j],data.menu_store[i].menu_list[j],'tag_printer_id');
									
									x+=1;
								}else{
									x=x+1;
									// 判断提成金额
									if(data.menu_store[i].menu_list[j].sale_commission.all != undefined){
										shopData[j].sale_commission = shopData[j].sale_commission.all;
									}
								}
								// 内容填充
								if(isLabrary == true){
									// 门店并且是菜品库内容
									var checked = self.getcheckBoxcheked(data.menu[j]);
									// if(checked != ''){
									// 	style
									// }
									contentPro += '<tr class="total-tr shopLibrary" menu-sort="'+data.menu_store[i].menu_list[j].menu_sort+'" menu-id="'+shopData[j].menu_id  +'">'+//checked="'+self.getcheckBoxcheked(data.menu_store[i].menu_list[j])
										'<td style="width:6%" class="total-addr"><input type="checkbox" id="isCheckBox" data-table = "'+shopData[j].menu_id+'"'+checked+' />'+x+'</td>'+
						            	'<td style="width:10%" data-type="menuName" class="total-addr inp_align_left">'+shopData[j].menu_name+'</td>'+
						            	'<td style="width:8%" class="inp_align_right" id="" data-type="menu_price" data-id="'+data.menu_store[i].menu_list[j].menu_id+'" data-name="'+(shopData[j].father_menu_name ?shopData[j].father_menu_name : data.menu_store[i].menu_list[j].menu_name) +'">'+isPrice(shopData[j].menu_price)+'</td>'+
						            	'<td style="width:8%" class="inp_align_right" id="" data-type="member_price" data-id="'+data.menu_store[i].menu_list[j].menu_id+'" data-name="'+(shopData[j].father_menu_name ?shopData[j].father_menu_name : data.menu_store[i].menu_list[j].menu_name)+'">'+isPrice(shopData[j].member_price)+'</td>'+
						            	'<td style="width:8%" class="inp_align_left" data-type="produce_type">'+isProduceType(shopData[j].produce_type) +'</td>'+
						            	'<td style="width:8%" data-type="special_type" class="inp_align_left">'+isSpecialType(shopData[j].special_type)+'</td>'+
						            	'<td style="width:4%" data-type="is_discount" class="">'+isDiscount(shopData[j].is_discount)+'</td>'+
						              	'<td style="width:4%" data-type="is_give" class="">'+isGive(shopData[j].is_give)+'</td>'+
										'<td style="width:8%" data-type="sale_commission" class="inp_align_right">'+shopData[j].sale_commission+'</td>'+
										'<td style="width:8%" data-type="print" class="inp_align_left ">'+'自定义'+'</td>'+
						            	(perIsEdit['菜品添加修改'] == undefined ? '' :
						            	'<td style="width:16%" class="total-caozuo clearfix">'+
						                	'<span class="caozuo">'+
						                    	'<input type="button" value="修改" data-type="update" disabled="disabled" class="stores-caozuo-btn" style="margin-right:6px;background:#e4e4e4">'+
						                    	'<input type="button" value="查看" data-type="look" disabled="disabled" class="stores-caozuo-btn" style="background:#e4e4e4">'+
						                 	'</span>'+
						            	'</td>')+
					                	'</tr>';
								}else{
									// 门店不是菜品库内容
									contentShop += '<tr class="total-tr" menu-sort="'+data.menu_store[i].menu_list[j].menu_sort+'" menu-id="'+shopData[j].menu_id  +'">'+
										'<td style="width:6%" class="total-addr inp_align_left">'+shopData[j].menu_id +'</td>'+
					                	'<td style="width:16%" data-type="menuName" class="total-addr inp_align_left">'+shopData[j].menu_name+'</td>'+ //data-name="'+data.menu_store[i].menu_list[j].menu_name
					               		'<td style="width:8%" class="price menu_price inp_align_right" data-id="'+data.menu_store[i].menu_list[j].menu_id+'" data-name = "'+shopData[j].father_menu_name+'">'+'￥'+shopData[j].menu_price+'</td>'+
					               		'<td style="width:8%" class="price member_price inp_align_right" id="member_price" data-id="'+data.menu_store[i].menu_list[j].menu_id+'" data-name="'+shopData[j].father_menu_name+'">'+'￥'+shopData[j].member_price+'</td>'+
					                        // '<td class="hide" data-type="shopIds">'+data.menu_store[i].menu_list[j].shop_ids+'</td>'+
					                	'<td style="width:4%" class=""><span data-type="menuUnit">'+shopData[j].menu_unit +'<span></td>'+
					                	'<td style="width:4%" class="" data-type="isDiscount">'+ isDiscount(shopData[j].is_discount)+'</td>'+
					               		'<td style="width:4%" class="" data-type="isGive">'+ isGive(shopData[j].is_give)+'</td>'+
					                	'<td style="width:6%" class="inp_align_left" data-type="propertyId">'+shopData[j].attribute_name+'</td>'+
										'<td style="width:6%" class="inp_align_left" data-type="menuScope">'+menuScope(shopData[j].menu_scope)+'</td>'+
										'<td style="width:6%" class="inp_align_right" data-type="sale_commission">'+shopData[j].sale_commission+'</td>'+
										'<td  class="inp_align_left">'+isSpecialType(shopData[j].special_type) + '</td>' +
					                        (perIsEdit['菜品添加修改'] == undefined ? '' :
					                	'<td style="width:12%" class="total-caozuo clearfix">'+
					                    	'<span>'+
					                    	// typeTy为3时，表示是售卖菜品列表
				                                '<input type="button" value="'+(typeTy == 3 ? '查看' : '修改')+'" data-type="'+(typeTy == 3 ? 'look' : 'update')+'" class="stores-caozuo-btn">'+
					                    	'</span>'+
					                    '</td>')+
					                    '</tr>';
								}
								
							}
							
						}else{
							//总部的内容
							menu_price_list[j] = data.menu_store[i].menu_list[j].menu_price_list;
							member_price_list[j] = data.menu_store[i].menu_list[j].member_price_list;
							allData[j] = data.menu_store[i].menu_list[j];
							// if(data.menu_store[i].menu_list[j].menu_price == ''){
							// 	menu_price = '暂无价格';
							// }else{
							// 	menu_price ='￥' + data.menu_store[i].menu_list[j].menu_price;
							// }
							// if(data.menu_store[i].menu_list[j].member_price == ''){
							// 	member_price = '暂无价格'
							// }else{
							// 	member_price ='￥' + data.menu_store[i].menu_list[j].member_price;
							// }
							contentPro += '<tr class="total-tr" menu-sort="'+data.menu_store[i].menu_list[j].menu_sort+'" menu-id="'+data.menu_store[i].menu_list[j].menu_id+'">'+
										'<td style="width:6%" class="total-addr menu_id inp_align_left">'+data.menu_store[i].menu_list[j].menu_id+'</td>'+
				                        '<td style="width:16%" data-type="menuName" class="total-addr inp_align_left">'+data.menu_store[i].menu_list[j].menu_name+'</td>'+
				                        '<td style="width:8%" class="price menu_price inp_align_right" data-id="'+data.menu_store[i].menu_list[j].menu_id+'" data-name="'+data.menu_store[i].menu_list[j].menu_name+'">'+isPrice(data.menu_store[i].menu_list[j].menu_price)+'</td>'+
				                        '<td style="width:8%" class="price member_price inp_align_right" data-id="'+data.menu_store[i].menu_list[j].menu_id+'" data-name="'+data.menu_store[i].menu_list[j].menu_name+'">'+isPrice(data.menu_store[i].menu_list[j].member_price)+'</td>'+
				                        '<td style="width:4%" class=""><span data-type="menuUnit">'+data.menu_store[i].menu_list[j].menu_unit +'<span></td>'+
				                        '<td style="width:4%" class="" data-type="isDiscount ">'+isDiscount(data.menu_store[i].menu_list[j].is_discount)+'</td>'+
				                        '<td style="width:4%" class="" data-type="isHalf">'+isGive(data.menu_store[i].menu_list[j].is_give) +'</td>'+
				                        '<td style="width:6%" class="inp_align_left" data-type="propertyId">'+data.menu_store[i].menu_list[j].attribute_name +'</td>'+
										'<td style="width:6%" class="inp_align_left" data-type="menuScope">'+menuScope(data.menu_store[i].menu_list[j].menu_scope)+'</td>'+
										'<td class="hide inp_align_right" style="width:6%" data-type="allSale_commission">'+data.menu_store[i].menu_list[j].sale_commission.all+'</td>'+
										'<td class="inp_align_left" style="width:6%" class="price inp_align_right" data-type="sale_commission">'+(data.menu_store[i].menu_list[j].sale_commission[shop_id] == undefined ? data.menu_store[i].menu_list[j].sale_commission.all : data.menu_store[i].menu_list[j].sale_commission[shop_id])+'</td>'+
										'<td class="inp_align_left">'+ isSpecialType(data.menu_store[i].menu_list[j].special_type)+ '</td>' +
				                        (perIsEdit['菜品添加修改'] == undefined ? '' :
				                        '<td style="width:12%" class="total-caozuo clearfix">'+
				                            '<span>'+
				                            // typeTy为3时，表示是售卖菜品列表
				                                '<input type="button" value="'+(typeTy == 3 ? '查看' : '修改')+'" data-type="'+(typeTy == 3 ? 'look' : 'update')+'" class="stores-caozuo-btn">'+
				                            '</span>'+
				                        '</td>')+
				                    '</tr>';
						}
	
					}
					// 部分的标题shop_id != 'all'
					if(shop_id == 'all'){	
						// 总部标题
						content += '<div menu-type-id="'+i+'" data-type="menuTypeIds">'+
									'<div class="stores_title-fenlei" >'+data.menu_store[i].menu_type+
										(isMenuType == 0 ?
										'<div class="caipin-save-btn">'+
						                	'<span>'+
						                		'<input type="button" data-type="sortBtn" value="保存排序" class="stores-save-btn hide">'+
						                	'</span>'+
						            	'</div>': '')+
									'</div>'+
						    		'<table cellpadding="0" cellspacing="0">'+
						                '<thead>'+
						                    '<tr class="stores_title">'+
						                    	'<th style="width:6%">菜品id</th>'+
						                        '<th style="width:10%">名称</th>'+
						                        '<th style="width:8%">价格</th>'+
						                        '<th style="width:8%">会员价</th>'+
						                        '<th style="width:4%">单位</th>'+
						                        '<th style="width:4%">打折</th>'+
						                        '<th style="width:4%">半份</th>'+
						                        '<th style="width:6%">属性</th>'+
												'<th style="width:10%">适用范围</th>'+
												'<th style="width:12%">提成金额<br/>('+shopName+')</th>'+
												'<th style="width:10%">特定商品</th>' +
												(perIsEdit['菜品添加修改'] == undefined ? '' :
						                        '<th style="width:12%">操作</th>')+
						                    '</tr>'+
						                '</thead>'+
						                '<tbody>'+contentPro+'</tbody>'+
						            '</table>'+
					            '</div>';
					 }else{
					 	// 门店标题
					 	if(isLabrary == true){
					 		// 门店并且是菜品库
					 		content += '<div menu-type-id="'+i+'" data-type="menuTypeIds">'+
									'<div class="stores_title-fenlei" >'+data.menu_store[i].menu_type+
										(isMenuType == 0 ?
										'<div class="caipin-save-btn">'+
						                	'<span>'+
						                		'<input type="button" data-type="save" value="保存" class="stores-save-btn hide" id="shopLibrarySave">'+
						                	'</span>'+
						            	'</div>': '')+
									'</div>'+
						    		'<table cellpadding="0" cellspacing="0">'+
						                '<thead>'+
						                    '<tr class="stores_title">'+
						                    	'<th style="width:6%" class="isLibraryNum">序号</th>'+
						                        '<th style="width:10%">名称</th>'+
						                        '<th style="width:8%">价格</th>'+
						                        '<th style="width:8%">会员价</th>'+
						                        '<th style="width:8%">制作类型</th>'+
						                        '<th style="width:8%">特定商品</th>'+
						                        '<th style="width:4%">打折</th>'+
						                        '<th style="width:4%">赠菜</th>'+
												'<th style="width:8%">提成金额<br/>('+shopName+')</th>'+
												'<th style="width:8%">打印机设置</th>' +
												(perIsEdit['菜品添加修改'] == undefined ? '' :
						                        '<th style="width:16%">操作</th>')+
						                    '</tr>'+
						                '</thead>'+
						                '<tbody>'+contentPro+'</tbody>'+
						            '</table>'+
					            '</div>';
					 	}else{
					 		// 门店但是不是菜品库
					 		content = '<div menu-type-id="'+i+'" data-type="menuShopTypeIds">'+

					        		'<table cellpadding="0" cellspacing="0">'+
						            	'<thead>'+
						                 	'<tr class="stores_title">'+
						                    	'<th style="width:6%">菜品id</th>'+
						                    	'<th style="width:10%">名称</th>'+
						                    	'<th style="width:8%">价格</th>'+
						                   		'<th style="width:8%">会员价</th>'+
						                    	'<th style="width:4%">单位</th>'+
						                    	'<th style="width:4%">打折</th>'+
						                    	'<th style="width:4%">半份</th>'+
						                    	'<th style="width:6%">属性</th>'+
												'<th style="width:10%">适用范围</th>'+
												'<th style="width:12%">提成金额<br/>('+shopName+')</th>'+
												'<th style="width:10%">特定商品</th>' +
												(perIsEdit['菜品添加修改'] == undefined ? '' :
						                    	'<th style="width:12%">操作</th>')+
						                	'</tr>'+
						                	'</thead>'+
						                	'<tbody>'+contentShop+'</tbody>'+
						        	'</table>'+
						       	'</div>';
					 	}
					 	
					}
					
				}

				// 添加到页面中
				$('#dishesMaContent').html(content);

                //判断页面的高度，修改UL的高度
                var winHei = $(window).height()-224;
                $('#dishesMaContent').height(winHei);
               
				// 门店菜品库时的初始化页面
				if(isLabrary == true && shop_id != 'all'){
					var num = 0;
					ShopMenuList = {};
					DelShopLibraryData = [''];

					$("table input:checkbox").each(function(){
    					if($(this).attr("checked") == "checked"){
    						num = 1;
    						$('#shopLibrarySave').removeClass('hide');
    						// shopLibraryData 初始化
							var id = $(this).attr('data-table');
							ShopMenuList[id] = {};
							shopLibraryData[id] = {};
							shopLibraryData[id].menu_id = id;
							shopLibraryData[id].menu_name = self.shopLibraryDataInit(shopData[id].menu_name);
							shopLibraryData[id].member_price = self.shopLibraryDataInit(shopData[id].member_price);
							shopLibraryData[id].menu_price = self.shopLibraryDataInit(shopData[id].menu_price);
							shopLibraryData[id].special_type = self.shopLibraryDataInit(shopData[id].special_type);
							shopLibraryData[id].produce_type = self.shopLibraryDataInit(shopData[id].produce_type);
							shopLibraryData[id].is_discount = self.shopLibraryDataInit(shopData[id].is_discount);
							shopLibraryData[id].is_give = self.shopLibraryDataInit(shopData[id].is_give);
							shopLibraryData[id].sale_commission = self.shopLibraryDataInit(shopData[id].sale_commission);

							shopLibraryData[id].printer_id = self.shopLibraryDataInit(shopData[id].printer_id);
							shopLibraryData[id].pass_printer_id = self.shopLibraryDataInit(shopData[id].pass_printer_id);
							shopLibraryData[id].jardiniere_printer_id = self.shopLibraryDataInit(shopData[id].jardiniere_printer_id);
							shopLibraryData[id].produce_printer_id = self.shopLibraryDataInit(shopData[id].produce_printer_id);
							shopLibraryData[id].tag_printer_id = self.shopLibraryDataInit(shopData[id].tag_printer_id);

							shopLibraryData[id].menu_price_list = (isFatherPriceList ? menu_price_list : null);
							shopLibraryData[id].member_price_list = (isFatherMemberList ? member_price_list : null);

							// 把对象添加到数组中

							ShopMenuList[id]=shopLibraryData[id];
							// shop_menu_list.unshift(ShopMenuList)
        					$(this).parent().parent().css('background','#FAFAFA');
    						$(this).parent().parent().children('td').addClass('price');
    						$(this).parent().parent().children('td').children('span.caozuo').children('input').removeAttr('disabled');
    						$(this).parent().parent().children('td').children('span.caozuo').children('input').css('background','#E79D06');
    					}else if(num == 0){
    						$('#shopLibrarySave').addClass('hide');
    					}
					});
				}
				// // 菜品库是否出现复选框
				// if(isLabrary == true){
				// 	//出现复选框
				//     $('.isLabrary,.isLibraryNum').removeClass('hide');
				// }else{
				// 	//出现复选框
				//     $('.isLabrary,.isLibraryNum').addClass('hide');
				// }
				// 当门店时，判断是否自定义
				function isFather(shopData,fatherData,type){
					// if(shopData[type] != null){
						return fatherData[type];
					// }
					// else{
					// 	return fatherData[type];
					// }
				};
				// 判断价格
				function isPrice(price){
					if(price == ''){
						return '暂无价格'
					}else{
						return  '￥'+price;
					}
				};
				
				// 点击菜品管理修改
				$('#dishesMaContent table').delegate('tr', 'click', function(event) {
                    var self = this,
                    content = new Object(),
                    is_set_menu = '',
                    menuId = $(self).attr('menu-id'),
                    type = $(event.target).attr('data-type');
                    if (type == 'update') {
						// 判断是门店还是总部
						if(shop_id != 'all'){
							// 门店时当前的数据
							content = shopData[menuId];
							content["shopName"]= $('#shopList').val();
							// is_set_menu = content.is_set_menu;
							content.menu_price_list = menu_price_list[menuId];
							content.member_price_list = member_price_list[menuId];
							content.father_menu_price_list = father_menu_price_list[menuId];
							content.father_member_price_list = father_member_price_list[menuId];
						}else{
							// 总部时当前的数据
							content = allData[menuId];
							is_set_menu = content.is_set_menu;
						}
						content["menuStatus"] = menuStatus;
						Cache.set('disUp',content);
						var type = 3;
	                    if (menuStatus == 0) {
	                    	// 售卖	                    	
	                    	if(isLabrary == true){
	                    		// 菜品库
	                    		type = 5;
	                    	}else{
	                    		type = 3;
	                    	}
	                    	
	                    } else if (menuStatus == 2) {
	                    	// 下架
	                    	type = 4;
	                    }
	                    if(shop_id != 'all' && isLabrary == true){
	                    	top = $(document).scrollTop();
					 		$.cookie('typeTy'+typeTy, top);
	                    	window.location.replace('dishesStoreEdit.html?v='+ version +'&menu_id='+menuId+'&type='+type);
	                    }else if(is_set_menu == 1){
	                    	// 修改菜品
	                    	top = $(document).scrollTop();
					 		$.cookie('typeTy'+typeTy, top);
	                    	window.location.replace('addPackage.html?v='+ version +'&menu_id='+menuId+'&type='+type);
	                    }else if (is_set_menu == 0) {
	                    	// 修改菜品套餐
	                    	top = $(document).scrollTop();
							$.cookie('typeTy'+typeTy, top);

	                    	window.location.replace('dishesEdit.html?v='+ version +'&menu_id='+menuId+'&type='+type);
	                    }
	                }else if(type == 'look'){
	                	// 查看
	                	// 当前记录的数据
	                	if(shop_id != 'all'){
							// 门店时当前的数据
							content = shopData[menuId];
							content["shopName"]= $('#shopList').val();
							// is_set_menu = content.is_set_menu;
							content.menu_price_list = menu_price_list[menuId];
							content.member_price_list = member_price_list[menuId];
							content.father_menu_price_list = father_menu_price_list[menuId];
							content.father_member_price_list = father_member_price_list[menuId];
						}else{
							// 总部时当前的数据
							content = allData[menuId];
							content["shopName"]= $('#shopList').val();
							is_set_menu = content.is_set_menu;
						}
						// 获得type 5:菜品库 3:售卖 4:下架
						if (menuStatus == 0) {
	                    	// 售卖	                    	
	                    	if(isLabrary == true){
	                    		// 菜品库
	                    		type = 5;
	                    	}else{
	                    		type = 3;
	                    	}
	                    	
	                    } else if (menuStatus == 2) {
	                    	// 下架
	                    	type = 4;
	                    }
						Cache.set('contentShop',content);
	                	window.location.replace('dishesShopLook.html?v='+ version +'&menu_id='+menuId+'&type='+type);
	                } 
				});	
				// 点击价格的框出窗
				$('#dishesMaContent table').on('click','.menu_price', function() {
					var date = '',
						week_day = '',
						hour_time = '';
					$('#StrategyName').html('价格');
                    $('#StrategyNameTh').html('价格');
                    $('#StrategyNameKu').html('价格');
					var content = '';
					$('#Member-cancel').addClass('hide');
                    $('#Member-logoin').addClass('hide');
                    $('#Strategy-cancel').removeClass('hide');
                    $('#other-logoin').removeClass('hide');
					
					var menu_id = $(event.target).attr('data-id');
					var menu_name = $(event.target).attr('data-name');
					for(var i in menu_price_list[menu_id])
			        {
			            content += new_price_data(menu_price_list[menu_id][i],menu_id,menu_name);
			        }									
					
					//填充到页面中
					$('#StrategyTbody').html(content);
					displayAlertMessage('#Strategy-message','#Strategy-cancel');

				});
				// 点击会员价格的框出窗
				$('#dishesMaContent table').on('click','.member_price', function() {
					var date = '',
						week_day = '',
						hour_time = '';
                    $('#StrategyName').html('会员价');
                    $('#StrategyNameTh').html('会员价');
                    $('#StrategyNameKu').html('会员价');
                    var content = '';
                    $('#Member-cancel').removeClass('hide');
                    $('#Member-logoin').removeClass('hide');
                    $('#Strategy-cancel').addClass('hide');
                    $('#other-logoin').addClass('hide');
                    
                    var member_id = $(event.target).attr('data-id');
                    var member_name = $(event.target).attr('data-name');
     
					for(var i in member_price_list[member_id])
			        {
			            content += new_price_data(member_price_list[member_id][i],member_id,member_name);
			        }
					//填充到页面中去
					$('#StrategyTbody').html(content);
					displayAlertMessage('#Strategy-message','#Member-cancel');

				});
				function new_price_data(obj,id,name){
				    var content_str = '';
				    var price_date='',price_week='',hour_time=''; 
				    //日期
				    if(obj.start_time)
				    {
				        getAppointTime(obj.start_time) ? " " : obj.start_time = getAppointTime(obj.start_time);
				        getAppointTime(obj.end_time) ? " " : obj.end_time = getAppointTime(obj.end_time);
				        price_date += obj.start_time+'至'+ obj.end_time; 
				    }else{
				        price_date="不限";
				    }
				    //星期
				    if(obj.week_day){
				        if(!isArray(obj.week_day))
				        {
				            obj.week_day = obj.week_day.split(',');
				        }
				        for(var j=0;j<obj.week_day.length;j++){
				            if(obj.week_day.length-1 ==j){
				                price_week += weektext(obj.week_day[j]);//将数字变成文字
				            }else{
				                price_week += weektext(obj.week_day[j])+'\、';
				            }
				        }
				    }else{
				        price_week="不限";
				    }
				    //时段
				    if(obj.hour_time){
				        if(!isArray(obj.hour_time))
				        {
				            obj.hour_time = obj.hour_time.split(',');
				        }        
				        for(var k=0;k<obj.hour_time.length;k++){
				            if(obj.hour_time.length-1 == k){
				                hour_time += obj.hour_time[k]+'时';
				            }else{
				                hour_time += obj.hour_time[k]+'时至';
				            }
				        }
				    }else{
				        hour_time="不限";
				    }
				    
				    content_str += '<tr class="price-tr dishesContent" price-id='+id+
				    '><td class="report_text" data-type="menuName">'+ name +
				    '</td><td class="report_num addColor" data-type="menuPrice">￥'+obj.menu_price+
				    '</td><td class="report_text" data-type="menuType">'+price_date+
				    '</td><td class="report_text" data-type="menuType">'+price_week+
				    '</td><td class="report_text" data-type="menuType">'+hour_time+
				    '</td></tr>'
				    return content_str;
				}			
				/*返回上次浏览位置*/
				
				if ($.cookie('typeTy'+typeTy)) {
					$("html,body").animate({ scrollTop: $.cookie('typeTy'+typeTy) }, 0);
				}
		
			},
			// checkbox是否选中
			getcheckBoxcheked:function(data){
				// for(var i in data){ 
					if(data != undefined){
						return 'checked= checked';
						// break;
					}
				// }
				return '';
			},
			//修改价格策略/obj当前对象type判断要执行的操作update修改delete删除，1代表价格策略，2代表会员价格策略
			PriceUpdate: function(obj,type,price_list){
			    var priceId =obj.attr('price-id'),
			    title_message = '',
			    AlertMessage='',
			    price_con = new Object(),
			    _self=this;
			    
			    //选择要修改的内容
			    for(var i in price_list)
			    {
			        if(i == priceId){
			           price_con = price_list[priceId];
			        }
			    }
			      
			    //判断price_con.price_type文字
			    if(price_con.price_type == 1){
			        title_message = '修改价格策略';
			        AlertMessage = '您确定要删除价格策略吗？';
			        
			    }else{
			        title_message = '修改会员价格策略';
			        AlertMessage = '您确定要删除该会员价格策略吗？';    
			    }  

			    if (type == 'update'){//点击修改价格策略 
			        //点击保存时是否为修改
			        $('#dialog_price_sava_btn').attr('data-type','update');
			        //每行的价格的标识
			        $('#dialog_price_sava_btn').attr('price-id',priceId);                   
			            $('#add_price_strategy').removeClass('hide');
			            displayAlertMessage('#add_price_strategy', '#select_close');
			            $('.title-text').html(title_message);                                       
			            $('#PriceStrategy').val(parseFloat(price_con.menu_price).toFixed(2));
			            if(price_con.start_time){                           
			                $("#start-date").val(price_con.start_time);
			                $("#end-date").val(price_con.end_time);
			            }else{
			                $('#pricedate').checked = true;
			            }
			            if(price_con.week_day)
			            {
			                var boxes=$("input[name='weekcheckbox']");
			                for(var i=0; i<boxes.length; i++){
			                    for(j=0;j<price_con.week_day.length;j++){
			                        if(boxes[i].value == price_con.week_day[j]){
			                            boxes[i].checked = true;
			                            break;
			                        }
			                    }
			                }
			            }else{
			                $('#week_radio').checked = true;
			            }
			            if(price_con.hour_time){
			                price_con.hour_time = price_con.hour_time.split(',');
			                for(var i=0;i<24;i++){                              
			                    $('#hour_stat_select').append('<option value="'+i+'"'+(i==price_con.hour_time[0] ? 'selected="selected"' : '')+'>'+i+'</option>');
			                    $('#hour_end_select').append('<option value="'+i+'"'+(i==price_con.hour_time[1] ? 'selected="selected"' : '')+'>'+i+'</option>'); 
			                }
			            }else{
			                $('#hour_radio').checked = true;
			                for(var i=0;i<24;i++){                              
			                    $('#hour_stat_select').append('<option value="'+i+'">'+i+'</option>');
			                    $('#hour_end_select').append('<option value="'+i+'">'+i+'</option>'); 
			                }
			            }                       
			        }else if(type == 'delete'){//点击删除价格策略
			            $('#alert-content').html(AlertMessage);
			            displayAlertMessage('#alert-message', '#cancel-alert');
			            $('#definite-alert').unbind('click').bind('click', function () {
			                // 在这里设置一个解除点击事件的代码，因为当到这里的时候会绑定两个点击事件，删除就会运行两次
			                //$(self).unbind('click');
			                //alert('ttt');
			                // 删除价格策略               
			               price_list = Picedelete(priceId,price_con.price_type,price_list);   
			               layer.close(layerBox);                        
			            });
			            $('#cancel-alert').unbind('click').bind('click', function () {
			                layer.close($('#cancel-alert').parent().parent().parent().parent().parent().attr('times'));
			            });
			        }
			    return price_list;
			},
			//删除价格策略
			//priceId删除那一行的表示 type 1：代表普通价格2：代表会员价格
			Picedelete:function(priceId,type,priceList){
			    
			    $("#shopLibraryPrice_shop_table .dishesContent[price-id='"+ priceId +"'").remove();
			    
			    for(var i in priceList){
			        if(priceList[i].price_id == priceId ){
			            delete priceList[i];                    
			        }
			    }
		        //如果.price-tr删完将PriceContent隐藏
		        if($("#shopLibraryPrice_shop_table .dishesContent").length==0){
		            $("#shopLibraryPrice_shop_table").addClass('hide');
		            layer.close(layerBox);
		        }
			    displayMsg($('#prompt-message'), '删除成功!', 2000); 
			    return priceList;               
			},
			// 添加策略的内容填充
			getShopLibraryPriceData:function(data,name,is_store){
				var content = '';
				var date = '',
					week_day = '',
					hour_time = '';
				var price_id = '';
				if(data[i].record_id == undefined){
					price_id = data[i].priceId; 
				}else{
					price_id = data[i].record_id; 
				}
				for(var i in data){
				// 判断日期、时间、小时是不是为空
				//日期
				    if(data.start_time)
				    {
				        getAppointTime(data.start_time) ? " " : data.start_time = getAppointTime(data.start_time);
				        getAppointTime(data.end_time) ? " " : data.end_time = getAppointTime(data.end_time);
				        date += data.start_time+'至'+ data.end_time; 
				    }else{
				        date="不限";
				    }
				    //星期
				    if(data.week_day){
				        if(!isArray(data.week_day))
				        {
				            data.week_day = data.week_day.split(',');
				        }
				        for(var j=0;j<data.week_day.length;j++){
				            if(data.week_day.length-1 ==j){
				                price_week += weektext(data.week_day[j]);//将数字变成文字
				            }else{
				                price_week += weektext(data.week_day[j])+'\、';
				            }
				        }
				    }else{
				        price_week="不限";
				    }
				    //时段
				    if(data.hour_time){
				        if(!isArray(data.hour_time))
				        {
				            data.hour_time = data.hour_time.split(',');
				        }        
				        for(var k=0;k<data.hour_time.length;k++){
				            if(data.hour_time.length-1 == k){
				                hour_time += data.hour_time[k]+'时';
				            }else{
				                hour_time += data.hour_time[k]+'时至';
				            }
				        }
				    }else{
				        hour_time="不限";
				    }
					content += '<tr class="dishesContent" price-id="'+price_id'">'+
								'<td class="report_text">'+name+'</td>'+
								'<td class="report_num reduColor">'+data[i].menu_price +'</td> '+
								'<td class="report_text">'+date+'</td>'+
								'<td class="report_text">'+week_day+'</td>'+
								'<td class="report_text">'+hour_time+'</td>';
					if(is_store != "all"){
				    	content += '<td><span class="changeBtn"><input type="button" value="修改" data-type="update" class="stores-caozuo-btn addInitAll"></span><span><input type="button" value="删除" data-type="delete" class="stores-caozuo-btn addInitAll"></span></td>';
				    }
				    	content += '</tr>';
					}
					return content;
						
			},
			// 门店菜品库时，点击确定时，获得用户输入数据
			getShopLibraryFlexData:function(id,type){
				var isTrueComm = true;
				switch(type){
					case 1:
						if($("input[type='radio']:checked").val() == 0){
							shopLibraryData[id].menu_name = null;
							$(typeThis).html(shopData[id].father_menu_name);
						}else{
							shopLibraryData[id].menu_name = $('#menuName_name').val();
							$(typeThis).html('<span class="isCustom"></span>'+$('#menuName_name').val());
						}
						return isTrueComm;						
					break;
					case 2:
						if($("input[type='radio']:checked").val() == 0){
							shopLibraryData[id].sale_commission = null;
							$(typeThis).html(shopData[id].father_sale_commission.all);							
						}else{
							
							var integer   = /^[0]\d+$/;//第一位为0正则
    						var decimals   = /^(([0-9]+\d*)|([0-9]+\d*\.\d{1,2}))$/;//精确到两位小数正则
    						var CommissionStrategy = $('#sale_commission_name').val();//价格
						    if(CommissionStrategy == ""){       
						        displayMsg($('#prompt-message'), '价格不能为空', 3000);
						        isTrueComm = false;
						    }
						    if(CommissionStrategy < 0){
						        displayMsg($('#prompt-message'), '价格不能小于0', 3000);
						        isTrueComm = false;
						    }
						    if(CommissionStrategy.indexOf("+") > -1 || isNaN(CommissionStrategy)){//数字带+号或者非数字类型
						        displayMsg($('#prompt-message'), '价格必须为数字类型', 3000);
						        isTrueComm = false;  
						    }
						    if(integer.test(CommissionStrategy)){
						        displayMsg($('#prompt-message'), '价格第一位不能为0', 3000);
						        isTrueComm = false;      
						    }
						    if(isTrueComm == true){
						    	shopLibraryData[id].sale_commission = $('#sale_commission_name').val();
								$(typeThis).html('<span class="isCustom"></span>'+$('#sale_commission_name').val());
						    }		
						}
						return isTrueComm;
					break;
					case 3:
						if($("input[type='radio']:checked").val() == 0){
							shopLibraryData[id].produce_type = null;
							$(typeThis).html(isProduceType(shopData[id].father_produce_type));
						}else{
							shopLibraryData[id].produce_type = isProduceType($('#produce_type_name').val());
							$(typeThis).html('<span class="isCustom"></span>' + isProduceType($('#produce_type_name').val()));
						}
						return isTrueComm;	
					break;
					case 4:
						if($("input[type='radio']:checked").val() == 0){
							shopLibraryData[id].special_type = null;
							$(typeThis).html(isSpecialType(shopData[id].father_special_type));
						}else{
							shopLibraryData[id].special_type = $('#special_type_name').val();
							$(typeThis).html('<span class="isCustom"></span>' + isSpecialType($('#special_type_name').val()));
						}
						return isTrueComm;						
					break;
					case 5:
						if($("input[type='radio']:checked").val() == 0){
							shopLibraryData[id].is_discount = null;
							$(typeThis).html(isDiscount(shopData[id].father_is_discount));
						}else{
							shopLibraryData[id].is_discount = $('#is_discount_name').val();
							$(typeThis).html('<span class="isCustom"></span>' + isDiscount($('#is_discount_name').val()));
						}
						return isTrueComm;						
					break;
					case 6:
						if($("input[type='radio']:checked").val() == 0){
							shopLibraryData[id].is_give = null;
							$(typeThis).html(isGive(shopData[id].father_is_give));
						}else{
							shopLibraryData[id].is_give = $('#is_give_name').val();
							$(typeThis).html('<span class="isCustom"></span>' + isGive($('#is_give_name').val()));
						}
						return isTrueComm;
					break;
				}
			},
			//计算现在的价格
			now_price: function(price_list){
				var time = new Date();
				date = getLocalDate();
				week = time.getDay()+1;
				hour = time.getHours();
				for(var key in price_list){
					var weekArray = price_list[key].week_day.split("\\.");
					var hourArray = price_list[key].hour_time.split("\\.");
					if(price_list[key].start_time > date && price_list[key].end_time < date){
						for(var i = 0; i<weekArray.length; i++){
							if(weekArray[i] == week){
								if(hourArray.length == 2){
									if(hourArray[0] >= hour && hourArray[0] <= hour){
										return price_list.price;
									}
								}
							}
						}
					}else if(price_list[key].start_time == "" &&  price_list[key].end_time && price_list[key].week_day == "" && price_list[key].hour_time == ""){
						return price_list.price;
					}
				}
				return "暂无价格";
			},
			// 在修改时，点击弹窗的确定
			getShopLibraryFlex:function(contentId,closeId,menuId,type,name){
				displayAlertMessage(contentId,closeId);
				libraryId = {id:menuId,type:type,name:name};
			},
			// 请求打印机列表
			PrintData: function () {
				var self = this;
                setAjax(AdminUrl.printerMenuPrinterList, {}, $('#prompt-message'), {20: ''}, function(respnoseText) {
					// 得到返回数据
                    var data = respnoseText.data;
                    // 显示数据
                    self.PrintList(data);
                }, 0);
			},

			// 显示打印机数据
			PrintList: function (data) {
				// 打印机设置
				var content = '';
				// 传菜打印机设置 配菜打印机 划菜打印机
				var passContent = '<option value="">不设置传菜打印机</option>',
					tagContent = '<option value="">不设置标签打印机</option>',
					sideContent = '<option value="">不设置配菜打印机</option>',
					printContent = '<option value="">不设置生产打印机</option>',
					drawContent = '<option value="">不设置划菜打印机</option>';
				var matchPrinters = '';

				for (var i in data) {
					if (data[i].printer_id == 'ap1fhba8r6nd' && data[i].printer_name == '收银打印机') {
						continue;
					}
					matchPrinters +=  '<option value="'+data[i].printer_id+'">'+data[i].printer_name+'</option>';
				}
				// 生产打印机设置
				$('#printLisTbodys').html(printContent+ matchPrinters);
				// 传菜打印机设置
				$('#passPrinterId').html(passContent + matchPrinters);
				// 标签打印机
				$('#tagPrinterId').html(tagContent + matchPrinters);
				// 配菜打印机
				$('#matchPrinter').html(sideContent + matchPrinters);
				// 划菜打印机
				$('#producePrinterId').html(drawContent + matchPrinters)
			},
			// 在用户批量修改之前进行初始化
			shopLibraryDataInit : function(data){
				data = data + '';
				if(data.indexOf('span') != -1){
					// console.log(data.substr(data.indexOf('</span>')+7))
					return data.substr(data.indexOf('</span>')+7);
				}else{
					return 'null';
				}
			},

			// 绑定点击事件
			DishesBind: function () {
				var _self = this;

				// 点击菜品中的保存排序
				$('#dishesMaContent div[data-type="menuTypeIds"]').unbind('click').bind('click',function(event) {
					var self = this,
                    menuTypeId = $(self).attr('menu-type-id'),
                    type = $(event.target).attr('data-type');

                    // 点击保存排序的时候
                    if (type == 'sortBtn') {
                    	//var selfSort = this;
		                var menu_sorts_array = {};
	                	var menusortsarray = new Array();
	                	var num = 0;
		                //alert($(this).parent().next().html());
		                $(self).find('tbody tr').each(function() {
		                    //menu_sorts_array['menu_sort'] = $(this).attr('menu-sort');
		                    menu_sorts_array[num] = $(this).attr('menu-id');
		                    //menusortsarray[num] = JSON.stringify(menu_sorts_array);
		                    num++;
		                });

			            setAjax(AdminUrl.menuMenuSort, {
			            	'menu_type_id': menuTypeId,
			            	'menu_sorts': JSON.stringify(menu_sorts_array)
			            }, $('#prompt-message'), {20: ''}, function(respnoseText) {
							// 得到返回数据
		                    var data = respnoseText.data;
		                    if (respnoseText.code == 20) {
		                    	displayMsg($('#prompt-message'), respnoseText.message, 2000, function () {
		                    		$(self).find('input[data-type="sortBtn"]').addClass('hide');
		                    	});
		                    } else {
		                    	displayMsg($('#prompt-message'), respnoseText.message, 2000);
		                    }
		                }, 0);
                    }
				});

				// 点击搜索
				$('#selectbtn').unbind('click').bind('click', function () {
					shop_ids = $('#shopList').val();
					if(isLabrary == true && shop_ids != 'all'){
						displayAlertMessage('#inputLibrary','#inputLibraryClose');
					}
					_self.DishesData(menuStatus,1)

					$.cookie('shopListcookie',$('#shopList').val())
				//$('#shopList option:selected').val($.cookie('shopListcookie'))
				});				
				// 点击分类添加
				$('#disCategoryAdd').unbind('click').bind('click', function () {
					top = $(document).scrollTop();
					$.cookie('typeTy'+typeTy, top);
					window.location.replace('dishesCategoryEdit.html?v=' + version);


				});

				// 点击菜品添加
				$('#dishesMaAdd').unbind('click').bind('click', function () {
					window.location.replace('dishesEdit.html?v=' + version + '&menu_status='+menuStatus+'&type='+typeTy);
					top = $(document).scrollTop();
					$.cookie('typeTy'+typeTy, top);
				});
				// 点击添加套餐
				$('#addPackage').unbind('click').bind('click', function () {
					window.location.replace('addPackage.html?v=' + version + '&menu_status='+menuStatus+'&type='+typeTy);
					top = $(document).scrollTop();
					$.cookie('typeTy'+typeTy, top);
				});
				// 点击保存排序
				$('#sort-btn').unbind('click').bind('click', function () {
	                var menu_type_sorts_array = {};
	                var menutypesortsarray = new Array();
	                var num = 0;
	                $('#disCategoryTbodys tr').each(function() {
	                    //menu_type_sorts_array['menu_type_sort'] = $(this).attr('menu-type-sort');
	                    menu_type_sorts_array[num] = $(this).attr('menu-type-id');
	                   //menutypesortsarray[num] = JSON.stringify(menu_type_sorts_array);
	                    num++;
	                });//JSON.stringify(bb)
	                //menutypesortsarray[0] = menu_type_sorts_array;
		            setAjax(AdminUrl.menuMenuTypeSort, {
		            	'menu_type_sorts': JSON.stringify(menu_type_sorts_array)
		            }, $('#prompt-message'), {20: ''}, function(respnoseText) {
						// 得到返回数据
	                    var data = respnoseText.data;
	                    if (respnoseText.code == 20) {
	                    	displayMsg($('#prompt-message'), respnoseText.message, 2000, function () {
	                    		$('#storesDisplay').addClass('hide');
	                    	});
	                    } else {
	                    	displayMsg($('#prompt-message'), respnoseText.message, 2000);
	                    }
	                }, 0);
				});

				// 点击属性添加
				$('#propertyAdd').unbind('click').bind('click', function () {
					top = $(document).scrollTop();
					$.cookie('typeTy'+typeTy, top);
					window.location.replace('dishesPropertyEdit.html');
				});


				// 点击分类管理
				$('#disCategory').unbind('click').bind('click', function () {
					_self.clickLabel(1);
					
				});

				// 点击属性管理
				$('#s_caipin_property').unbind('click').bind('click', function () {
					_self.clickLabel(2);
					
				});

				// 点击菜品管理
				$('#dishesMa').unbind('click').bind('click', function () {
					_self.clickLabel(3);
					
				});

				// 点击下架管理
				$('#shelves').unbind('click').bind('click', function () {
					_self.clickLabel(4);
					
				});

				// 点击菜品库管理
				$('#menu_store').unbind('click').bind('click', function () {
					_self.clickLabel(5);
					
				});

				//价格策略确定
				$('#other-logoin').unbind('click').bind('click',  function() {
					layer.close(layerBox);
				});
				//会员价格策略的确定
				$('#Member-logoin').unbind('click').bind('click',  function() {
					layer.close(layerBox);
				});
				// 拖拽
				if (menuStatus !== 2) {
					// 调用拖拽方法，jQuery UI 里面的方法
					$("#dishesMaContent tbody").sortable();
					// 只能垂直拖拽
					$("#dishesMaContent tbody").sortable({ axis: "y" });
					// 约束在盒子里
					$("#dishesMaContent tbody").sortable({ containment: "parent" });
					// 当排序动作开始时触发此事件
					$("#dishesMaContent tbody").sortable({ start: function(event, ui) {
						// 让当前的父级的父级下的input删除隐藏也就是（保存排序的按钮显示）
	                    $(this).parent().parent().find('input').removeClass('hide');
					}});
					// 列表数据每一行奇数偶数背景颜色不同
					//$('#dishesMaContent tbody tr:even').attr('class','total-tr');
				    //$('#dishesMaContent tbody tr:odd').attr('class','total-tr-backgrund');
				};
				// 菜品库门店的checkBox点击事件
				$('#dishesMaContent table').off('click','#isCheckBox').on('click','#isCheckBox', function() {
					var id = $(this).attr('data-table');
					if($(this).is(':checked')) {
						// shopLibraryData 初始化
						
						ShopMenuList[id] = {};
						shopLibraryData[id] = {};
						shopLibraryData[id].menu_id = id;
						shopLibraryData[id].menu_name = _self.shopLibraryDataInit(shopData[id].menu_name);
						shopLibraryData[id].member_price = _self.shopLibraryDataInit(shopData[id].member_price);
						shopLibraryData[id].menu_price = _self.shopLibraryDataInit(shopData[id].menu_price);
						shopLibraryData[id].special_type = _self.shopLibraryDataInit(shopData[id].special_type);
						shopLibraryData[id].produce_type = _self.shopLibraryDataInit(shopData[id].produce_type);
						shopLibraryData[id].is_discount = _self.shopLibraryDataInit(shopData[id].is_discount);
						shopLibraryData[id].is_give = _self.shopLibraryDataInit(shopData[id].is_give);
						shopLibraryData[id].sale_commission = _self.shopLibraryDataInit(shopData[id].sale_commission);

						shopLibraryData[id].printer_id = _self.shopLibraryDataInit(shopData[id].printer_id);
						shopLibraryData[id].pass_printer_id = _self.shopLibraryDataInit(shopData[id].pass_printer_id);
						shopLibraryData[id].jardiniere_printer_id = _self.shopLibraryDataInit(shopData[id].jardiniere_printer_id);
						shopLibraryData[id].produce_printer_id = _self.shopLibraryDataInit(shopData[id].produce_printer_id);
						shopLibraryData[id].tag_printer_id = _self.shopLibraryDataInit(shopData[id].tag_printer_id);

						shopLibraryData[id].menu_price_list = (isFatherPriceList ? menu_price_list : 'null');
						shopLibraryData[id].member_price_list = (isFatherMemberList ? member_price_list : 'null');
						//把这个对象添加到数组中
						ShopMenuList[id]=shopLibraryData[id];

						$('#shopLibrarySave').removeClass('hide');
    					$(this).parent().parent().css('background','#FAFAFA');
    					$(this).parent().parent().children('td').addClass('price');
    					$(this).parent().parent().children('td').children('span.caozuo').children('input').removeAttr('disabled');
    					$(this).parent().parent().children('td').children('span.caozuo').children('input').css('background','#E79D06');
					}else{
						// 删除的id
						if(DelShopLibraryData == ''){
							DelShopLibraryData = [];
						}
						
						DelShopLibraryData.unshift($(this).attr('data-table'));
						// 把数据在shopMenuList中删除掉
						delete ShopMenuList[id]; 
						$(this).parent().parent().css('background','#f1f1f1');
						$(this).parent().parent().children('td').removeClass('price');
						$(this).parent().parent().children('td').children('span.caozuo').children('input').attr('disabled','disabled');
    					$(this).parent().parent().children('td').children('span.caozuo').children('input').css('background','#e4e4e4');
    					// 保存按钮在所有都取消时才会消失
    					if($(this).parent().parent().parent().children().children('td.price').length == 0){
    						$('#shopLibrarySave').addClass('hide');
    					}
					}
				});
				// 菜品库门店批量修改
				$('#dishesMaContent table').off('click', 'tr.shopLibrary td.price').on('click', 'tr.shopLibrary td.price', function() {
					typeThis = this;
					// console.log(this);
					// 判断是不是checkBox
					var libraryContent = '';
					if($(this).children('input#isCheckBox').length == 0){
						
						// 1：判断
						// if($(this).attr('data-type') == 'menuName' || $(this).attr('data-type') == 'sale_commission'){
							
							// 判断是名称还是提成金额
							if($(this).attr('data-type') == 'menuName'){

								$('#menuNameSale').text('名称');
								libraryContent = '<li class="clearfix clearfix_2">'+
													'<div class="used">'+
														'<input type="radio" name="'+$(this).attr('data-type')+'"value="0">沿用总部'+
                    								'</div>'+
                    								'<div class="custom">'+
                    									'<input type="radio" name="'+$(this).attr('data-type')+'"value="1">自定义'+
                        								'<input type="text" name=""  class="indent" id="'+$(this).attr('data-type')+'_name"'+'value="'+$(this).text()+'">'+
                    								'</div>'+
                        						'</li>';
                    			
                    			$('#shopLibrary_content').html(libraryContent);

                    			$('input[name="menuName"]').each(function(){		    		
		    						$(this).unbind('click').bind('click', function () {
										clickradio($(this).val(),$('#menuName_name'));    	
									});
		  						});
                    			_self.getShopLibraryFlex('#shopLibrary_name_sale','#menuName_close',$(this).parent().attr('menu-id'),1);
							}else if($(this).attr('data-type') == 'sale_commission'){
								$('#menuNameSale').text('提成金额');
								libraryContent = '<li class="clearfix clearfix_2">'+
													'<div class="used">'+
														'<input type="radio" name="'+$(this).attr('data-type')+'" value="0">沿用总部'+
                    								'</div>'+
                    								'<div class="custom">'+
                    									'<input type="radio" name="'+$(this).attr('data-type')+'" value="1">自定义'+
                        								'<input type="text" name=""  class="indent" id="'+$(this).attr('data-type')+'_name"'+'value="'+$(this).text()+'">'+
                    								'</div>'+
                        						'</li>';
                        		$('#shopLibrary_content').html(libraryContent);
                        		$('input[name="sale_commission"]').each(function(){		    		
						    		$(this).unbind('click').bind('click', function () {
										clickradio($(this).val(),$('#sale_commission_name'));      	
									});
						  		});
                        		_self.getShopLibraryFlex('#shopLibrary_name_sale','#menuName_close',$(this).parent().attr('menu-id'),2);
							}else if($(this).attr('data-type') == 'produce_type'){
								$('#menuNameSale').text('制作类型');
								libraryContent = '<li class="clearfix clearfix_2">'+
													'<div class="used">'+
														'<input type="radio" name="'+$(this).attr('data-type')+'" value="0">沿用总部'+
                    								'</div>'+
                    								'<div class="custom">'+
                    									'<label>'+
                    									'<input type="radio" name="'+$(this).attr('data-type')+'" value="1">自定义'+
                        								'<select class="indent" id="'+$(this).attr('data-type')+'_name"'+'value="'+$(this).text()+'">'+
                        									'<option value="1">直接制作</option>'+
                        									'<option value="2">批量制作</option>'+
                        								'</select>'+
                        								'</label>'+
                    								'</div>'+
                        						'</li>';
                        		$('#shopLibrary_content').html(libraryContent);
                        		$('input[name="produce_type"]').each(function(){		    		
						    		$(this).unbind('click').bind('click', function () {
										clickradio($(this).val(),$('#produce_type_name'));      	
									});
						  		});
                        		_self.getShopLibraryFlex('#shopLibrary_name_sale','#menuName_close',$(this).parent().attr('menu-id'),3);
							}else if($(this).attr('data-type') == 'special_type'){
								$('#menuNameSale').text('特定商品');
								libraryContent = '<li class="clearfix clearfix_2">'+
													'<div class="used">'+
														'<input type="radio" name="'+$(this).attr('data-type')+'" value="0">沿用总部'+
                    								'</div>'+
                    								'<div class="custom">'+
                    									'<label>'+
                    									'<input type="radio" name="'+$(this).attr('data-type')+'" value="1">自定义'+
                        								'<select class="indent" id="'+$(this).attr('data-type')+'_name">'+
                        									'<option value="0">普通商品</option><option value="1">堂食餐包</option>'+
                                    						'<option value="2">外卖餐包</option><option value="3">外卖送餐费</option>'+
                                    						'<option value="11">百度外卖配送费</option><option value="12">饿了么外卖配送费</option>'+
                                    						'<option value="13">美团外卖配送费</option><option value="4">商城配送费</option>'+
                                    						'<option value="5">打包盒</option><option value="6">必点商品1</option>'+                                                                     
                                    						'<option value="7">必点商品2</option><option value="8">必点条件商品</option>'+
                       									'</select>'+
                        								'</label>'+
                    								'</div>'+
                        						'</li>';
                        		$('#shopLibrary_content').html(libraryContent);
                        		$('input[name="special_type"]').each(function(){		    		
						    		$(this).unbind('click').bind('click', function () {
										clickradio($(this).val(),$('#special_type_name'));      	
									});
						  		});
                        		_self.getShopLibraryFlex('#shopLibrary_name_sale','#menuName_close',$(this).parent().attr('menu-id'),4);
							}else if($(this).attr('data-type') == 'is_discount'){
								$('#menuNameSale').text('打折');
								libraryContent = '<li class="clearfix clearfix_2">'+
													'<div class="used">'+
														'<input type="radio" name="'+$(this).attr('data-type')+'" value="0">沿用总部'+
                    								'</div>'+
                    								'<div class="custom">'+
                    									'<label>'+
                    									'<input type="radio" name="'+$(this).attr('data-type')+'" value="1">自定义'+
                        								'<select class="indent" id="'+$(this).attr('data-type')+'_name">'+
                        									'<option value="1">是</option>'+
                        									'<option value="0">否</option>'+
                        								'</select>'+
                        								'</label>'+
                    								'</div>'+
                        						'</li>';
                        		$('#shopLibrary_content').html(libraryContent);
                        		$('input[name="is_discount"]').each(function(){		    		
						    		$(this).unbind('click').bind('click', function () {
										clickradio($(this).val(),$('#is_discount_name'));      	
									});
						  		});
                        		_self.getShopLibraryFlex('#shopLibrary_name_sale','#menuName_close',$(this).parent().attr('menu-id'),5);		  		
							}else if($(this).attr('data-type') == 'is_give'){
								$('#menuNameSale').text('赠菜');
								libraryContent = '<li class="clearfix clearfix_2">'+
													'<div class="used">'+
														'<input type="radio" name="'+$(this).attr('data-type')+'" value="0">沿用总部'+
                    								'</div>'+
                    								'<div class="custom">'+
                    									'<label>'+
                    									'<input type="radio" name="'+$(this).attr('data-type')+'" value="1">自定义'+
                        								'<select class="indent" id="'+$(this).attr('data-type')+'_name">'+
                        									'<option value="1">是</option>'+
                        									'<option value="0">否</option>'+
                        								'</select>'+
                        								'</label>'+
                    								'</div>'+
                        						'</li>';
                        		$('#shopLibrary_content').html(libraryContent);
                        		$('input[name="is_give"]').each(function(){		    		
						    		$(this).unbind('click').bind('click', function () {
										clickradio($(this).val(),$('#is_give_name'));      	
									});
						  		});
                        		_self.getShopLibraryFlex('#shopLibrary_name_sale','#menuName_close',$(this).parent().attr('menu-id'),6,$(this).parent().attr('menu-id'));
							}else if($(this).attr('data-type') == 'print'){
								// 打印机
								$('.shopLibraryPrint_radio').attr('name',$(this).attr('data-type'));	
								_self.getShopLibraryFlex('#shopLibraryPrint_content','#shopLibraryPrint_close',$(this).parent().attr('menu-id'),7);
          
							}else if($(this).attr('data-type') == 'menu_price'){
								$('.shopLibraryPrice_radio').attr('name','menu_price');
								$('#shopLibraryPrice_top_title').text('价格');
								$('.shopLibraryPrice_th').text('价格');
								$('#shopLibraryPrice_footer_title').text('价格');
								$('#addMemberPrice').val('价格策略添加');
								$('.shopLibraryPrice_radio').attr('name',$(this).attr('data-type'))
								// 价格策略
								var content ='';
								var date = '',
									week_day = '',
									hour_time = '';
								var menu_name = $(this).attr('data-name');
								if(father_menu_price_list[$(this).parent().attr('menu-id')] != undefined){
								// 沿用总部的数据
									content = _self.getShopLibraryPriceData(father_menu_price_list[$(this).parent().attr('menu-id')],menu_name,"all");

									if(content == ''){
										$('#shopLibraryPrice_father_table').addClass('hide');
									}
									$('#shopLibraryPrice_father_tbody').html(content);
								}
								//自定义
								if(menu_price_list[$(this).parent().attr('menu-id')] != undefined){
								//
									content = _self.getShopLibraryPriceData(menu_price_list[$(this).parent().attr('menu-id')],menu_name,"自定义");
									
									if(content == ''){
										$('#shopLibraryPrice_shop_table').addClass('hide');
									}
									$('#shopLibraryPrice_shop_tbody').html(content);
								}
								// 判断菜品库门店价格/会员价格策略中的选择框
		  						$('input.shopLibraryPrice_radio').each(function(){		    		
		    						$(this).unbind('click').bind('click', function () {
		    							if($(this).val() != "1"){
						    				$('#addMemberPrice').css("background","#e4e4e4");
						    				$('.stores-caozuo-btn').css("background","#e4e4e4");
						    			}else{
						    				$('#addMemberPrice').css("background","#FF8366");
						    				$('.stores-caozuo-btn').css("background","#E79D06");
						    			}
										clickradio($(this).val(),$('.addInitAll'));      	
									});
		  						});
								_self.getShopLibraryFlex('#shopLibraryPrice','#shopLibraryPrice_close',$(this).parent().attr('menu-id'),8,$(this).attr('data-name'));
							}else if($(this).attr('data-type') == 'member_price'){
								$('.shopLibraryPrice_radio').attr('name','member_price');								
								$('#shopLibraryPrice_top_title').text('会员价');
								$('.shopLibraryPrice_th').text('会员价');
								$('#shopLibraryPrice_footer_title').text('会员价');
								$('#addMemberPrice').val('会员价格策略添加');
								var content ='';
								var date = '',
									week_day = '',
									hour_time = '';
								var member_name = $(this).attr('data-name');
								// 沿用总部的数据
								if(father_member_price_list[$(this).parent().attr('menu-id')] != undefined){
									content = _self.getShopLibraryPriceData(father_member_price_list[$(this).parent().attr('menu-id')],member_name,"all");
									
									if(content == ''){
										$('#shopLibraryPrice_father_table').addClass('hide');
									}
									$('#shopLibraryPrice_father_tbody').html(content);
								}
								//自定义
								if(member_price_list[$(this).parent().attr('menu-id')] != undefined){
									content = _self.getShopLibraryPriceData(member_price_list[$(this).parent().attr('menu-id')],member_name,"自定义");
									
									if(content == ''){
										$('#shopLibraryPrice_shop_table').addClass('hide');
									}
									$('#shopLibraryPrice_shop_tbody').html(content);
								}
								// 判断菜品库门店价格/会员价格策略中的选择框
		  						$('input.shopLibraryPrice_radio').each(function(){		    		
		    						$(this).unbind('click').bind('click', function () {
										clickradio($(this).val(),$('.addInitAll'));      	
									});
		  						});
								_self.getShopLibraryFlex('#shopLibraryPrice','#shopLibraryPrice_close',$(this).parent().attr('menu-id'),9,$(this).attr('data-name'));

							}
							// 判断是不是沿用总部 0：沿用总部 1：自定义
							if($(this).children('span.isCustom').length == 0){
								$("input[name="+$(this).attr('data-type')+"][value=0]").prop("checked",true);
								$("input[name="+$(this).attr('data-type')+"][value=1]").prop("checked",false);
								if($(this).attr('data-type') == 'print'){
									$('.printTbodys').attr('disabled',true);
								}else if($(this).attr('data-type') == 'menu_price' || $(this).attr('data-type') == 'member_price'){
									$('.addInitAll').attr('disabled',true);
									$('.addInitAll').css('background','#e4e4e4');
								}
								$("input[name="+$(this).attr('data-type')+"][value=1]").siblings().attr('disabled',true)
							}else{
								$("input[name="+$(this).attr('data-type')+"][value=0]").prop("checked",false);
								$("input[name="+$(this).attr('data-type')+"][value=1]").prop("checked",true);
								$("input[name="+$(this).attr('data-type')+"][value=1]").siblings().attr('disabled',false)
								if($(this).attr('data-type') == 'print'){
									$('.printTbodys').attr('disabled',false);
								}else if($(this).attr('data-type') == 'menu_price' || $(this).attr('data-type') == 'member_price'){
									$('.addInitAll').attr('disabled',false);
								}								
							}
						}
						// var contentId = $(this).attr('data-type')
						
					// }
					
					// "menuName"
				});
				// 判断打印选择框
				$('input[name="print"]').each(function(){		    		
		    		$(this).unbind('click').bind('click', function () {
						clickradio($(this).val(),$('.printTbodys'));      	
					});
		  		});
		  		
		  	// 	// 判断菜品库门店会员价格策略中的选择框
		  	// 	$('input[name="member_price"]').each(function(){		    		
		   //  		$(this).unbind('click').bind('click', function () {
					// 	clickradio($(this).val(),$('.addInitAll'));      	
					// });
		  	// 	});
				// 判断菜品库门店添加价格策略中的选择框
				$('input[name="pricedate"]').each(function(){		    		
		    		$(this).unbind('click').bind('click', function () {
						clickradio($(this).val(),$('.second-width'));    	
					});
		  		});
		    	$('input[name="week_radio"]').each(function(){		    		
		    		$(this).unbind('click').bind('click', function () {
						clickradio($(this).val(),$('input[name="weekcheckbox"]'));      	
					});
		  		});
		    	$('input[name="hour_radio"]').each(function(){		    		
		    		$(this).unbind('click').bind('click', function () {
						clickradio($(this).val(),$('.hour_select'));      	
					});
		  		});
				// 菜品库门店价格中添加策略
				$('#addMemberPrice').unbind('click').bind('click', function () {	
					var self = this;
					// libraryId.type 8:添加价格策略 9：添加会员价格策略
					if(libraryId.type == 8){   
                    	PriceAdd($(self),1);
					}else{
						PriceAdd($(self),2);
					}							
				});
				//价格策略弹窗里面的修改和删除
				$('#shopLibraryPrice_shop_table').delegate('tr', 'click', function(event) {
					var self = this;                    
                    var type = $(event.target).attr('data-type');
                    priceType=2;
                    //给修改价格策略函数传值，1代表价格策略，2代表会员价格策略
                    member_price_list = _self.PriceUpdate($(self),type,member_price_list);
				});
				//点击会员价格/会员价格策略弹出的保存按钮时
				$('#dialog_price_sava_btn').unbind('click').bind('click',function(){
					// var self = this;
					var content= '';
					var dataType=$('#dialog_price_sava_btn').attr('data-type');					
					if(libraryId.type == 8){
	             		menu_price_list[libraryId.id] = Pricesave(1,dataType,menu_price_list[libraryId.id]);
	             		content = _self.getShopLibraryPriceData(menu_price_list[libraryId.id],libraryId.name);
	             		$('#shopLibraryPrice_shop_tbody').html(content);
	            	}else{
	            		member_price_list[libraryId.id] = Pricesave(2,dataType,member_price_list[libraryId.id]);
	             		content = _self.getShopLibraryPriceData(member_price_list[libraryId.id],libraryId.name);
	            		$('#shopLibraryPrice_shop_tbody').html(content);
	        		}
				});
				//点击会员价格/会员价格策略弹框的取消按钮时
				$('#dialog_price_cancel_btn').unbind('click').bind('click',function(){
					layer.close(layerBox);
				});
				// 菜品库门店除去打印以及价格策略的弹出框中的确定
				$('#shopLibrary_footer').off('click', '#menuName_login').on('click', '#menuName_login', function() {
					var isTrueComm = true;
					isTrueComm = _self.getShopLibraryFlexData(libraryId.id,libraryId.type);
					if(isTrueComm == true){
						layer.close(layerBox);
					}
				});
				// 菜品库门店价格和会员价格的确定
				$('#shopLibraryPrice_footer_but').unbind('click').bind('click',function(){
					if(libraryId.type == 8){

						if($("#shopLibraryPrice input[type='radio']:checked").val() == 0){
							shopLibraryData[libraryId.id].menu_price_list = null
						}else{
							shopLibraryData[libraryId.id].menu_price_list = menu_price_list[libraryId.id];
						}
						
					}else{
						if($("#shopLibraryPrice input[type='radio']:checked").val() == 0){
							shopLibraryData[libraryId.id].member_price_list = null
						}else{
							shopLibraryData[libraryId.id].member_price_list = member_price_list[libraryId.id];
						}
					}
					layer.close($('#shopLibraryPrice').parent().parent().parent().attr('times'));
				});
				// 菜品库门店价格和会员价格的确定
				$('#shopLibraryPrice_close').unbind('click').bind('click',function(){
					layer.close($('#shopLibraryPrice').parent().parent().parent().attr('times'));
				});

				// 菜品库门店打印机弹出框中的确定
				$('#shopLibraryPrint_footer').off('click', '#shopLibraryPrint_save').on('click', '#shopLibraryPrint_save', function() {
					//shopLibraryPrint
					if($("#shopLibraryPrint input[type='radio']:checked").val() == 0){
						shopLibraryData[libraryId.id].pass_printer_id = null;
						shopLibraryData[libraryId.id].printer_id  = null;
						shopLibraryData[libraryId.id].jardiniere_printer_id  = null;
						shopLibraryData[libraryId.id].produce_printer_id  = null;
						shopLibraryData[libraryId.id].tag_printer_id  = null;
					}else{
						shopLibraryData[libraryId.id].pass_printer_id = $('#passPrinterId').val();
						shopLibraryData[libraryId.id].printer_id = $('#printLisTbodys').val();
						shopLibraryData[libraryId.id].jardiniere_printer_id = $('#matchPrinter').val();
						shopLibraryData[libraryId.id].produce_printer_id = $('#producePrinterId').val();
						shopLibraryData[libraryId.id].tag_printer_id = $('#tagPrinterId').val();
					}
					layer.close(layerBox);
				});
				// 
				// 菜品库门店中的保存按钮
				$('#dishesMaContent').off('click','#shopLibrarySave').on('click','#shopLibrarySave', function() {
         			

					var num = 0;
					setAjax(AdminUrl.menuMenuSubmit,{
        				'menu_del' : DelShopLibraryData,
        				'sale_shop_id':shop_id,
        				'menu_list' : ShopMenuList
        			} , $('#prompt-message'), {20: ''}, function(respnoseText) {
					// 得到返回数据
                    	var data = respnoseText.data;
                   		if (respnoseText.code == 20) {
	                    	displayMsgTime($('#prompt-message'), respnoseText.message, 2000, function () {
	                            // 0代表售卖
	                            _self.DishesData(0,1)
								shop_ids = $('#shopList').val();
								typeTy = 5;
	                		});
                		} else {
                			displayMsg($('#prompt-message'), respnoseText.message, 2000);
                		}
               	 	}, 0);
				});
			},

			// 点击标签页显示隐藏 调用数据
			clickLabel: function (type, num) {
				var self = this;
				if(num != 1){
					top = $(document).scrollTop();
					$.cookie('typeTy'+typeTy, top);
					typeTy = type;//选项卡每个分页的type值
				}
				switch(type) {
					case 1:
						isLabrary = false;
						// 分类菜品，菜品删除不选中的样式，添加选中的样式
						$('#disCategory').removeClass('caipin-fenleinucheck');
						$('#disCategory').addClass('caipin-fenleicheck');
						// 属性菜品，菜品删除不选中的样式，添加选中的样式
						$('#s_caipin_property').removeClass('caipin-fenleicheck');
						$('#s_caipin_property').addClass('caipin-fenleinucheck');
						//菜品库，删除选中样式，添加不选中的样式
						$('#menu_store').removeClass('caipin-fenleicheck');
						$('#menu_store').addClass('caipin-fenleinucheck');
						// 下架菜品，删除选中样式，添加不选中的样式
						$('#shelves').removeClass('caipin-fenleicheck');
						$('#shelves').addClass('caipin-fenleinucheck');
						// 菜品，删除选中样式，添加不选中的样式
						$('#dishesMa').removeClass('caipin-fenleicheck');
						$('#dishesMa').addClass('caipin-fenleinucheck');
						// 把菜品管理的div显示出来，其他隐藏起来
						$('#disCategoryContent').removeClass('hide');
						$('#dishesMaContent').addClass('hide');
						$('#propertyContent').addClass('hide');
						// 显示分类添加按钮，隐藏菜品添加按钮
						$('#updatebtn').removeClass('hide');	
						$('#disCategoryAdd').removeClass('hide');
						$('#propertyAdd').addClass('hide');
						$('#dishesMaAdd').addClass('hide');
						$('#addPackage').addClass('hide');
						if (perIsEdit['菜品类别添加修改'] == undefined) {
							$('#disCategoryAdd').addClass('hide');
						}
						if (perIsEdit['菜品添加修改'] == undefined && perIsEdit['菜品类别添加修改'] == undefined && perIsEdit['菜品属性添加修改'] == undefined) {
								$('#updatebtn').addClass('hide');
						} else {
								$('#updatebtn').removeClass('hide');
						}

						//$('#updatebtn').addClass('hide');
						
						// 隐藏保存排序按钮,只有触发排序的时候才显示
						$('#storesDisplay').addClass('hide');
						if (num == 1) {
							// 显示数据
							self.disCategoryData(1);
						} else {
							self.disCategoryData();
						}
					break;
					case 2:
						isLabrary = false;
						// 属性，菜品删除不选中的样式，添加选中的样式
						$('#s_caipin_property').removeClass('caipin-fenleinucheck');
						$('#s_caipin_property').addClass('caipin-fenleicheck');
						// 分类菜品，菜品删除不选中的样式，添加选中的样式
						$('#disCategory').removeClass('caipin-fenleicheck');
						$('#disCategory').addClass('caipin-fenleinucheck');
						//菜品库，删除选中样式，添加不选中的样式
						$('#menu_store').removeClass('caipin-fenleicheck');
						$('#menu_store').addClass('caipin-fenleinucheck');
						// 下架菜品，删除选中样式，添加不选中的样式
						$('#shelves').removeClass('caipin-fenleicheck');
						$('#shelves').addClass('caipin-fenleinucheck');
						// 菜品，删除选中样式，添加不选中的样式
						$('#dishesMa').removeClass('caipin-fenleicheck');
						$('#dishesMa').addClass('caipin-fenleinucheck');
						// 把菜品管理的div显示出来，其他隐藏起来
						$('#propertyContent').removeClass('hide');
						$('#disCategoryContent').addClass('hide');
						$('#dishesMaContent').addClass('hide');
						// 显示属性添加按钮，隐藏菜品添加按钮
						$('#updatebtn').removeClass('hide');	
						$('#propertyAdd').removeClass('hide');
						$('#disCategoryAdd').addClass('hide');
						$('#dishesMaAdd').addClass('hide');
						$('#addPackage').addClass('hide');
						if (perIsEdit['菜品属性添加修改'] == undefined) {
							$('#propertyAdd').addClass('hide');
						}
						if (perIsEdit['菜品添加修改'] == undefined && perIsEdit['菜品类别添加修改'] == undefined && perIsEdit['菜品属性添加修改'] == undefined) {
								$('#updatebtn').addClass('hide');
						} else {
								$('#updatebtn').removeClass('hide');
						}

						//$('#updatebtn').addClass('hide');
						
						// 隐藏保存排序按钮,只有触发排序的时候才显示
						$('#storesDisplay').addClass('hide');
						
						if (num == 1) {
							// 显示数据
							self.propertyData(1);
						} else {
							self.propertyData();
						}
					break;
					case 3:
						isLabrary = false;
						// 点击菜品，菜品删除不选中的样式，添加选中的样式
						$('#dishesMa').removeClass('caipin-fenleinucheck');
						$('#dishesMa').addClass('caipin-fenleicheck');
						// 下架菜品，删除选中样式，添加不选中的样式
						$('#shelves').removeClass('caipin-fenleicheck');
						$('#shelves').addClass('caipin-fenleinucheck');
						//菜品库，删除选中样式，添加不选中的样式
						$('#menu_store').removeClass('caipin-fenleicheck');
						$('#menu_store').addClass('caipin-fenleinucheck');
						// 属性，菜品删除不选中的样式，添加选中的样式
						$('#s_caipin_property').removeClass('caipin-fenleicheck');
						$('#s_caipin_property').addClass('caipin-fenleinucheck');
						// 分类菜品，删除选中样式，添加不选中的样式
						$('#disCategory').removeClass('caipin-fenleicheck');
						$('#disCategory').addClass('caipin-fenleinucheck');
						// 把菜品管理的div显示出来，其他隐藏起来
						$('#dishesMaContent').removeClass('hide');
						$('#disCategoryContent').addClass('hide');
						$('#propertyContent').addClass('hide');
						// 显示菜品添加按钮，隐藏分类添加按钮\
						$('#updatebtn').removeClass('hide');	
						$('#dishesMaAdd').removeClass('hide');
						$('#addPackage').removeClass('hide');
						$('#disCategoryAdd').addClass('hide');
						$('#propertyAdd').addClass('hide');
						
						if (perIsEdit['菜品添加修改'] == undefined) {
							$('#dishesMaAdd').addClass('hide');
						}
						if (perIsEdit['菜品添加修改'] == undefined && perIsEdit['菜品类别添加修改'] == undefined && perIsEdit['菜品属性添加修改'] == undefined ) {
							$('#updatebtn').addClass('hide');
						} else {
							$('#updatebtn').removeClass('hide');
						}
						// 隐藏保存排序按钮
						$('#storesDisplay').addClass('hide');

						if (num == 1) {
							// 显示数据
							self.DishesData(0, 1);
						} else {
							self.DishesData(0);
						}
						// 状态0
						menuStatus = 0;
					break;
					case 4:
						isLabrary = false;
						// 点击下架，菜品删除不选中的样式，添加选中的样式
						$('#shelves').removeClass('caipin-fenleinucheck');
						$('#shelves').addClass('caipin-fenleicheck');
						// 菜品，删除选中样式，添加不选中的样式
						$('#dishesMa').removeClass('caipin-fenleicheck');
						$('#dishesMa').addClass('caipin-fenleinucheck');
						//菜品库，删除选中样式，添加不选中的样式
						$('#menu_store').removeClass('caipin-fenleicheck');
						$('#menu_store').addClass('caipin-fenleinucheck');
						// 属性，菜品删除不选中的样式，添加选中的样式
						$('#s_caipin_property').removeClass('caipin-fenleicheck');
						$('#s_caipin_property').addClass('caipin-fenleinucheck');
						// 分类菜品，删除选中样式，添加不选中的样式
						$('#disCategory').removeClass('caipin-fenleicheck');
						$('#disCategory').addClass('caipin-fenleinucheck');
						// 把下架管理的div显示出来，其他隐藏起来
						$('#dishesMaContent').removeClass('hide');
						$('#disCategoryContent').addClass('hide');
						$('#propertyContent').addClass('hide');
						// 隐藏所有添加按钮
						$('#updatebtn').addClass('hide');					
						// 隐藏保存排序按钮
						$('#storesDisplay').addClass('hide');

						if (num == 1) {
							// 显示数据
							self.DishesData(2, 1);
						} else {
							self.DishesData(2);
						}
						// 状态2
						menuStatus = 2;
					break;
					case 5:
					// 点击菜品库，菜品删除不选中的样式，添加选中的样式
						// shop_id = 
						if(shop_id != 'all' && shop_ids != 'all'){
							displayAlertMessage('#inputLibrary','#inputLibraryClose');
						}
						$('#menu_store').removeClass('caipin-fenleinucheck');
						$('#menu_store').addClass('caipin-fenleicheck');
						// 下架菜品，删除选中样式，添加不选中的样式
						$('#shelves').removeClass('caipin-fenleicheck');
						$('#shelves').addClass('caipin-fenleinucheck');
						// 菜品，删除选中样式，添加不选中的样式
						$('#dishesMa').removeClass('caipin-fenleicheck');
						$('#dishesMa').addClass('caipin-fenleinucheck');
						// 属性，菜品删除不选中的样式，添加选中的样式
						$('#s_caipin_property').removeClass('caipin-fenleicheck');
						$('#s_caipin_property').addClass('caipin-fenleinucheck');
						// 分类菜品，删除选中样式，添加不选中的样式
						$('#disCategory').removeClass('caipin-fenleicheck');
						$('#disCategory').addClass('caipin-fenleinucheck');

						// 把菜品管理的div显示出来，其他隐藏起来
						$('#dishesMaContent').removeClass('hide');
						$('#disCategoryContent').addClass('hide');
						$('#propertyContent').addClass('hide');
						// 显示菜品添加按钮，隐藏分类添加按钮\
						$('#updatebtn').removeClass('hide');	
						$('#dishesMaAdd').removeClass('hide');
						$('#addPackage').removeClass('hide');
						$('#disCategoryAdd').addClass('hide');
						$('#propertyAdd').addClass('hide');
						
						if (perIsEdit['菜品添加修改'] == undefined) {
							$('#dishesMaAdd').addClass('hide');
						}
						if (perIsEdit['菜品添加修改'] == undefined && perIsEdit['菜品类别添加修改'] == undefined && perIsEdit['菜品属性添加修改'] == undefined ) {
							$('#updatebtn').addClass('hide');
						} else {
							$('#updatebtn').removeClass('hide');
						}
						// 隐藏保存排序按钮
						$('#storesDisplay').addClass('hide');
						// menustoreContent
						//调用菜品库数据
						if (num == 1) {
							// 显示数据
							self.DishesData(0, 1);
						} else {
							self.DishesData(0);
						}
						// 状态3
						menuStatus = 0;

						isLabrary = true;
				}
			},

			// 请求分类列表
			disCategoryData: function (num) {
				// 显示分类列表之前先清空列表数据
				$('#disCategoryTbodys').html('');

				var self = this;
                setAjax(AdminUrl.menuMenuTypeList, {}, $('#prompt-message'), {20: ''}, function(respnoseText) {
					// 得到返回数据
                    var data = respnoseText.data;
                   	if (respnoseText.code == 20) {
	                    // 显示数据
	                    self.disCategoryList(data);
                	} else {
                		displayMsg($('#prompt-message'), respnoseText.message, 2000);
                	}
                	if (num == 1) {
                    // 绑定点击事件
                    self.DishesBind();
                    }
                }, 0);
			},

			// 显示分类数据
			disCategoryList: function (data) {
				var content = '';

				for (var i in data) {
					content += '<tr class="total-tr" menu-type-sort="'+data[i].menu_type_sort+'" menu-type-id="'+data[i].menu_type_id+'">'+
			                        '<td class="total-caozuo clearfix" data-type="menuTypeDid">'+data[i].menu_type_did+'</td>'+
			                        '<td class="total-addr" data-type="menuType">'+data[i].menu_type+'</td>'+
			                     (perIsEdit['菜品类别添加修改'] == undefined ? '' :
			                        '<td class="total-caozuo clearfix">'+
			                            '<span>'+
			                                '<input type="button" value="修改" data-type="update" class="stores-caozuo-btn">'+
			                            '</span>'+
			                            '<span>'+
			                                '<input type="button" value="删除" data-type="delete" class="stores-caozuo-delbtn">'+
			                            '</span>'+
			                        '</td>')+
			                    '</tr>';
				}

				$('#disCategoryTbodys').html(content);
				// 调用拖拽方法，jQuery UI 里面的方法
				$("#disCategoryTbodys").sortable();
				// 只能垂直拖拽
				$("#disCategoryTbodys").sortable({ axis: "y" });
				// 约束在盒子里
				$("#disCategoryTbodys").sortable({ containment: "parent" });
				// 当排序动作开始时触发此事件
				$("#disCategoryTbodys").sortable({ start: function(event, ui) {
					//alert('ddd');
					$('#storesDisplay').removeClass('hide');
				}});

				// 点击分类菜品修改
				$('#disCategoryTbodys').delegate('tr', 'click', function(event) {
                    var self = this,
                    menuTypeId = $(self).attr('menu-type-id'),
                    type = $(event.target).attr('data-type');

                    if (type == 'update') {
	                    // 点击修改的时候，创建一个数据，存储要修改的这一行的信息，然后存到缓存中，到修改页面取出来填充到页面中去
	                    // 员工姓名和门店
	                    var menuTypeDid = $(self).find('td[data-type="menuTypeDid"]').text();
	                    var menuType =$(self).find('td[data-type="menuType"]').text();
	                    
	                    var disUp = {
							'menu_type_did': menuTypeDid,
							'menu_type': menuType,
							'menu_type_id': menuTypeId
	                    }; 
	                    Cache.set('disUp',disUp);
	                    top = $(document).scrollTop();
						$.cookie('typeTy'+typeTy, top);
						window.location.replace('dishesCategoryEdit.html?menu_type_id='+menuTypeId);
					} else if (type == 'delete') {

						$('#alert-content').html('您确定要删除该菜品分类吗？');
				        displayAlertMessage('#alert-message', '#cancel-alert');

				        // 点击确认删除,在绑定点击事件delegate里面加click点击事件不能用
				        // $('#definite-alert').click(function({这个因为这样就会造成，我点击一次点击事件在点击一次点击事件，点确认删除，就会执行两次点击事件，所以要用unbind、bind，先取消前一个点击事件，在绑定点击事件，这样就可以了
				        $('#definite-alert').unbind('click').bind('click', function () {
							// 在这里设置一个解除点击事件的代码，因为当到这里的时候会绑定两个点击事件，删除就会运行两次
							//$(self).unbind('click');
							//alert('ttt');
							// 删除分类
			                setAjax(AdminUrl.menuMenuTypeDel, {
			                	'menu_type_id': menuTypeId
			                }, $('#prompt-message'), {20: ''}, function(respnoseText) {
								// 得到返回数据
			                    var data = respnoseText.data;
								if(data != ''){
                                    displayMsg($('#prompt-message'), '该分类下有菜品，不能删除!', 2000);
                                }else{
				                    //layer.close(layerBox);
				                    layer.close($('#definite-alert').parent().parent().parent().parent().parent().attr('times'));
				                    $(self).remove();
				                    displayMsg($('#prompt-message'), '删除成功!', 2000);
			                	}
			                }, 0);
		                });
		                $('#cancel-alert').unbind('click').bind('click', function () {
		                	layer.close($('#cancel-alert').parent().parent().parent().parent().parent().attr('times'));
		                });
					}
				});
				/*返回上次浏览位置*/
		
				if ($.cookie('typeTy'+typeTy)) {
					$("html,body").animate({ scrollTop: $.cookie('typeTy'+typeTy) }, 0);
				}
						
				
			},

			// 请求属性列表
			propertyData: function (num) {
				// 显示分类列表之前先清空列表数据
				$('#propertyTbodys').html('');

				var self = this;
                setAjax(AdminUrl.menuMenuAttributeList, {}, $('#prompt-message'), {20: ''}, function(respnoseText) {
					// 得到返回数据
                    var data = respnoseText.data;

                   	if (respnoseText.code == 20) {
	                    // 显示数据
	                    self.propertyList(data);
                	} else {
                		displayMsg($('#prompt-message'), respnoseText.message, 2000);
                	}
                	if (num == 1) {
                    // 绑定点击事件
                    self.DishesBind();
                    }
                }, 0);
			},
			propertyList: function (data) {
				var content = '';

				for (var i in data) {
					content += '<tr class="total-tr" menu-type-id="'+data[i].menu_attribute_id+'">'+
			                        '<td class="total-caozuo clearfix" data-type="menuTypeDid">'+data[i].menu_attribute_did+'</td>'+
			                        '<td class="total-addr" data-type="menuType">'+data[i].menu_attribute+'</td>'+
			                        (perIsEdit['菜品属性添加修改'] == undefined ? '' :
			                        '<td class="total-caozuo clearfix">'+
			                            '<span>'+
			                                '<input type="button" value="修改" data-type="update" class="stores-caozuo-btn">'+
			                            '</span>'+
			                            '<span>'+
			                                '<input type="button" value="删除" data-type="delete" class="stores-caozuo-delbtn">'+
			                            '</span>'+
			                        '</td>')+
			                    '</tr>';
				}
				$('#propertyTbodys').html(content);

				// 点击属性菜品修改
				$('#propertyTbodys').delegate('tr', 'click', function(event) {
                    var self = this,
                    menuTypeId = $(self).attr('menu-type-id'),
                    type = $(event.target).attr('data-type');

                    if (type == 'update') {
	                    // 点击修改的时候，创建一个数据，存储要修改的这一行的信息，然后存到缓存中，到修改页面取出来填充到页面中去
	                    // 员工姓名和门店
	                    var menuTypeDid = $(self).find('td[data-type="menuTypeDid"]').text();
	                    var menuType =$(self).find('td[data-type="menuType"]').text();
	                    
	                    var disUp = {
							'menu_attribute_did': menuTypeDid,
							'menu_attribute': menuType,
							'menu_attribute_id': menuTypeId
	                    }; 
	                    Cache.set('disUp',disUp);
	                 	top = $(document).scrollTop();
						$.cookie('typeTy'+typeTy, top);
						window.location.replace('dishesPropertyEdit.html?menu_attribute_id='+menuTypeId);
					} else if (type == 'delete') {

						$('#alert-content').html('您确定要删除该菜品属性吗？');
				        displayAlertMessage('#alert-message', '#cancel-alert');

				        // 点击确认删除,在绑定点击事件delegate里面加click点击事件不能用
				        // $('#definite-alert').click(function({这个因为这样就会造成，我点击一次点击事件在点击一次点击事件，点确认删除，就会执行两次点击事件，所以要用unbind、bind，先取消前一个点击事件，在绑定点击事件，这样就可以了
				        $('#definite-alert').unbind('click').bind('click', function () {
							// 在这里设置一个解除点击事件的代码，因为当到这里的时候会绑定两个点击事件，删除就会运行两次
							//$(self).unbind('click');
							//alert('ttt');
							// 删除属性
			                setAjax(AdminUrl.menuMenuAttributeDel, {
			                	'menu_attribute_id': menuTypeId
			                }, $('#prompt-message'), {20: ''}, function(respnoseText) {
								// 得到返回数据
			                    var data = respnoseText.data;	
			                   
			                    if (respnoseText.code == 20) {
				                  	if(respnoseText.data != ''){
                                        displayMsg($('#prompt-message'), '该属性下有菜品，不能删除!', 2000);
                                    }else{
                                        //layer.close(layerBox);
                                        //页面重复点击之后 弹出层获取不对所以加上这个
                                        layer.close($('#definite-alert').parent().parent().parent().parent().parent().attr('times'));
                                        $(self).remove();
                                        displayMsg($('#prompt-message'), '删除成功!', 2000);
                                    }

			                	}else{
			                		displayMsg($('#prompt-message'), respnoseText.message, 2000);
			                	}
			                }, 0);
		                });
		                $('#cancel-alert').unbind('click').bind('click', function () {
		                	//alert($('#cancel-alert').parent().parent().parent().parent().parent().attr('times'));
		                	layer.close($('#cancel-alert').parent().parent().parent().parent().parent().attr('times'));
		                });
					}
				});
				/*返回上次浏览位置*/
					
				if ($.cookie('typeTy'+typeTy)) {
					$("html,body").animate({ scrollTop: $.cookie('typeTy'+typeTy) }, 0);
				}
			
			}

		}

		DishesManage.init();
		// 判断不否沿用
		function isFollow(shopData,funData,typeName){
			if(shopData[typeName] != null){					
				content ='<span class="isCustom"></span>'+shopData[typeName];
				if(typeName == 'menu_price'){
					if(shopData[typeName] == ''){
						content = '<span class="isCustom"></span>暂无价格';
					}else{
						content = '<span class="isCustom"></span>' + '￥'+shopData[typeName];
					}
				}
				if(typeName == 'member_price'){
					if(shopData[typeName] == ''){
						content = '<span class="isCustom"></span>暂无价格';
					}else{
						content = '<span class="isCustom"></span>' + '￥'+shopData[typeName];
					}					
				}
				if(typeName == 'menu_price_list' || typeName == 'member_price_list'){
					// 判断是否有自定义price_list和member_list
					if(typeName == 'menu_price_list'){
						isFatherPriceList = true;
					}else{
						isFatherMemberList = true;
					}
					content = shopData[typeName];
				}
			}else{
				if(typeName == 'sale_commission'){
					content = funData[typeName].all;
				}else if(typeName == 'menu_price' || typeName == 'member_price'){
					if(funData[typeName] == ''){
						content = '暂无价格';
					}else{
						content = funData[typeName];
					}
				}else{
					content = funData[typeName];
				}
				
			}
			return content;
		};
		//判断特定商品
		function isSpecialType(specialType){
			if(specialType == 0){
				return '普通商品';
			}else if(specialType == 1){
				return '堂食餐包';
			}else if(specialType == 2){
				return '外卖餐包';
			}else if(specialType == 3){
				return '外卖送餐费';
			}else if(specialType == 4){
				return '商城配送费';
			}else{
				return '打包盒';
			}
		};
		//判断是否打折
		function isDiscount(isDiscount){
			// ==1 ? '是':'否'
			if(isDiscount == 1){
				return '是';
			}else{
				return '否';
			}
		};
		//是否半份
		function isGive(isGive){
			 //==1 ? '是':'否'
			 if(isGive == 1){
			 	return '是';
			 }else{
			 	return '否';
			 }
		};
		//适用范围
		function menuScope(menuScope){
			if(menuScope == 1){
				return '仅支持在线售卖';
			}else if(menuScope == 2){
				return '仅支持门店售卖';
			}else{
				return '在线/门店售卖';
			}
		};
		// 制作类型
		function isProduceType(produceType){
			if(produceType == 1){
				return '直接制作';
			}else{
				return '批量制作';
			}
		};

});
