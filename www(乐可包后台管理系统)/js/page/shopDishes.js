$(function () {

	// 门店后台  菜品列表
		
		document.onselectstart=new Function("event.returnValue=true;");
        // 定义菜品状态参数 0:正常，1：估清，2：下架，默认是0显示正常菜品列表
        var menuStatus = 0;
        var shop_ids = $.cookie("shop_id");
        var menu_price_list = [];
        var father_menu_price_list = [];
        var member_price_list = [];
        var father_member_price_list = [];
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
				// 显示菜品数据
				this.DishesData(menuStatus);
				// 绑定点击事件
				this.DishesBind();
			},

			// 显示菜品数据 菜品列表和下架列表
			DishesData: function (menuStatus) {
				// 请求显示列表数据之前先清空列表数据
				$('#dishesMaContent').html('');				
				var self = this;
				console.log(shop_ids+"menuStatus"+menuStatus);
                setAjax(AdminUrl.menuMenuList, {
                    'menu_status': menuStatus,
                    'sale_shop_id':shop_ids,
                    'is_shop': 1
                }, $('#prompt-message'), {20: ''}, function(respnoseText) {
					// 得到返回数据
                    var data = respnoseText.data;
                    delete data.depot_info;
                    // 显示数据
                    self.DishesList(data, menuStatus);
                }, 1);
			},

			// 显示数据
			DishesList: function (data, menuStatus) {
				// 分类总共
				var content = '';				
				// 菜品
				var contentShop = '';
				var contentPro = '';
				// 菜品列表每一行的背景颜色不一样
				var totalBackgrund = 'total-tr';
				console.log(data);
				 // 内容信息
				for (var i in data.menu_store) {
					contentPro = '';
					var x=0;
					for (var j in data.menu_store[i].menu_list) {
						shopData[j] = {};
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
								shopData[j].father_store_name = isFather(data.menu[j],data.menu_store[i].menu_list[j],'menu_name');
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
								// x=x+1;
								// 判断提成金额
								console.log(111)
								if(data.menu_store[i].menu_list[j].sale_commission.all != undefined){
									shopData[j].sale_commission = shopData[j].sale_commission.all;
								}
							}
							
							// 门店不是菜品库内容
							contentShop += '<tr class="total-tr" menu-sort="'+data.menu_store[i].menu_list[j].menu_sort+'" menu-id="'+shopData[j].menu_id  +'">'+
								'<td style="width:6%" class="total-addr inp_align_left">'+shopData[j].menu_id +'</td>'+
			                	'<td style="width:16%" data-type="menuName" class="total-addr inp_align_left">'+shopData[j].menu_name+'</td>'+ //data-name="'+data.menu_store[i].menu_list[j].menu_name
			               		'<td style="width:8%" class="price menu_price inp_align_right" data-id="'+data.menu_store[i].menu_list[j].menu_id+'" data-name = "'+shopData[j].father_store_name+'">'+isPrice(shopData[j].menu_price)+'</td>'+
			               		'<td style="width:8%" class="price member_price inp_align_right" data-id="'+data.menu_store[i].menu_list[j].menu_id+'" data-name="'+shopData[j].father_store_name+'">'+isPrice(shopData[j].member_price)+'</td>'+
			                        // '<td class="hide" data-type="shopIds">'+data.menu_store[i].menu_list[j].shop_ids+'</td>'+
			                	'<td style="width:4%" class=""><span data-type="menuUnit">'+shopData[j].menu_unit +'<span></td>'+
			                	'<td style="width:4%" class="" data-type="isDiscount">'+ isDiscount(shopData[j].is_discount)+'</td>'+
			               		'<td style="width:4%" class="" data-type="isGive">'+ isGive(shopData[j].is_give)+'</td>'+			                	
								'<td style="width:6%" class="inp_align_left" data-type="menuScope">'+menuScope(shopData[j].menu_scope)+'</td>'+
								'<td style="width:6%" class="inp_align_right" data-type="sale_commission">'+shopData[j].sale_commission+'</td>'+
								'<td  class="inp_align_left">'+isSpecialType(shopData[j].special_type) + '</td></tr>';
						}
						
					}
					// 标题
					content += '<div menu-type-id="'+i+'" data-type="menuTypeIds">'+
								'<div class="stores_title-fenlei" >'+data.menu_store[i].menu_type+								
								'</div>'+
					    		'<table cellpadding="0" cellspacing="0">'+
					                '<thead>'+
					                    '<tr class="stores_title">'+
					                    	'<th style="width:4%">菜品id</th>'+
					                        '<th style="width:16%">名称</th>'+
					                        '<th style="width:7%">价格</th>'+
					                        '<th style="width:7%">会员价</th>'+
					                        '<th style="width:5%">单位</th>'+
					                        '<th style="width:5%">打折</th>'+
					                        '<th style="width:5%">半份</th>'+
					                        '<th style="width:10%">适用范围</th>'+
					                        '<th style="width:10%">提成金额</th>'+
					                        '<th style="width:10%">特定商品</th>' +
					                    '</tr>'+
					                '</thead>'+
					                '<tbody>'+contentShop+'</tbody>'+
					            '</table>'+
				            '</div>';
				}
				// 添加到页面中
				$('#dishesMaContent').html(content);
				// 列表数据每一行奇数偶数背景颜色不同
				$('#dishesMaContent tr:even').attr('class','total-tr');
			    $('#dishesMaContent tr:odd').attr('class','total-tr-backgrund');
			    // 当门店时，判断是否自定义
			    function isFather(shopData,fatherData,type){
					// if(shopData[type] != null){
						return fatherData[type];
					// }else{
					// 	return null;
					// }
				};
				// 判断价格
				function isPrice(price){
					if(price == ''){
						return '暂无价格'
					}else{
						return price;
					}
				};
			    //判断特定商品
				function isSpecialType(specialType){
					if(specialType == 0){
						return '普通商品';
					}else if(specialType == 1){
						return '堂食餐包';
					}else if(special_type == 2){
						return '外卖餐包';
					}else if(special_type == 3){
						return '外卖送餐费';
					}else if(special_type == 4){
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
				}
				// 点击价格的框出窗
				$('#dishesMaContent table').unbind('click').bind('click','.menu_price', function(event) {
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
				$('#dishesMaContent table').unbind('click').bind('click','.member_price', function(evnet) {
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
			},
			
			// 绑定点击事件
			DishesBind: function () {
				var self = this;

				// 点击估清管理
				$('#disCategory').unbind('click').bind('click', function () {
					// 估清菜品，菜品删除不选中的样式，添加选中的样式
					$('#disCategory').removeClass('caipin-fenleinucheck');
					$('#disCategory').addClass('caipin-fenleicheck');
					// 下架菜品，删除选中样式，添加不选中的样式
					$('#shelves').removeClass('caipin-fenleicheck');
					$('#shelves').addClass('caipin-fenleinucheck');
					// 菜品，删除选中样式，添加不选中的样式
					$('#dishesMa').removeClass('caipin-fenleicheck');
					$('#dishesMa').addClass('caipin-fenleinucheck');

					// 显示数据
					self.DishesData(1);
				});

				// 点击菜品管理
				$('#dishesMa').unbind('click').bind('click', function () {
					// 点击菜品，菜品删除不选中的样式，添加选中的样式
					$('#dishesMa').removeClass('caipin-fenleinucheck');
					$('#dishesMa').addClass('caipin-fenleicheck');
					// 下架菜品，删除选中样式，添加不选中的样式
					$('#shelves').removeClass('caipin-fenleicheck');
					$('#shelves').addClass('caipin-fenleinucheck');
					// 估清菜品，删除选中样式，添加不选中的样式
					$('#disCategory').removeClass('caipin-fenleicheck');
					$('#disCategory').addClass('caipin-fenleinucheck');

					self.DishesData(0);
				});

				// 点击下架管理
				$('#shelves').unbind('click').bind('click', function () {
					// 点击下架，菜品删除不选中的样式，添加选中的样式
					$('#shelves').removeClass('caipin-fenleinucheck');
					$('#shelves').addClass('caipin-fenleicheck');
					// 菜品，删除选中样式，添加不选中的样式
					$('#dishesMa').removeClass('caipin-fenleicheck');
					$('#dishesMa').addClass('caipin-fenleinucheck');
					// 估清菜品，删除选中样式，添加不选中的样式
					$('#disCategory').removeClass('caipin-fenleicheck');
					$('#disCategory').addClass('caipin-fenleinucheck');

					self.DishesData(2);
				});

				//价格策略确定
				$('#other-logoin').unbind('click').bind('click',  function() {
					layer.close(layerBox);
				});

				//会员价格策略的确定
				$('#Member-logoin').unbind('click').bind('click',  function() {
					layer.close(layerBox);
				});				
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
						content = '￥' + funData[typeName];
					}
				}else{
					content = funData[typeName];
				}
				
			}
			return content;
		}
});
