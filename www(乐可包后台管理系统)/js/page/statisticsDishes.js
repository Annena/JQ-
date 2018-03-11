$(function () {

	    topButtonScroll5(".stores-content",".wrap_title_classify");//无分页
		var localData = getLocalDate();
	
		var defaults = {
			start: localData,
			end: localData,
			shop: ['all'],
			dishes: ['all'],
			property: ['all']
		};
	
		// 菜品销售
		var statisticsDishes = {

			init: function () {
				// 显示时段
				this.DishesListmenu();
				// 显示数据
				this.DishesList();
				// 绑定点击事件
				this.DishesBind();
				//区域选择
				this.RegionList();
				//默认禁用
				this.Disabled();
				
			},

			// 获取时段
			DishesListmenu: function () {
				var content = '';
				for (var i = 0; i< 24; i++) {
					content += '<option value="'+i+'">'+i+'</option>';
				}

				$('#start_hour').html(content);
				$('#end_hour').html(content);

			},
			// 区域选择禁用
			Disabled: function(){
				$("#region_sel").attr("disabled","disabled");  
				$("#region_sel").addClass('color','#ccc');
			},


			 // 区域选择
		   	RegionList: function () {
				var shopIdPro = ''
				for(var i in defaults.shop){
					shopIdPro = defaults.shop[i];
				}
				setAjax(AdminUrl.regionList, {
					'shop_id': shopIdPro
				}, $('#prompt-message'), {20: ''}, function(respnoseText) {
					var data = respnoseText.data;
                    var regionList = '<option value="all" data-selected="1">全部</option>';
                    for (var i in data) {
                        regionList += '<option value="' + data[i].region_id + '" data-selected="1">' + data[i].region_name + '</option>';
                    }
                    $('#region_sel').html(regionList);
                }, 1);
			},


		    // 显示数据
			DishesList: function (data) {
				// 显示当前日期
	            /*$("#start-date").val(getLocalDate());
	            $("#end-date").val(getLocalDate());*/

	            $("#start-date").val(getOffsetDateTime().start_day);
	            $("#end-date").val(getOffsetDateTime().end_day);
				// 显示时段
				/*$('#start_hour').val('0');
				$('#end_hour').val('23');*/
				$('#start_hour').val(getOffsetDateTime().start_hours);
				$('#end_hour').val(getOffsetDateTime().end_hours);
				$("#dishesList").val();
			},
			
			// 绑定点击事件
			DishesBind: function () {
				var stat = 0; //0分类 1属性；2套餐
				
				var  _self = this;
				// 点击查询按钮
				$('#selectbtn').unbind('click').bind('click', function () {
					// var searchefs = $("#searchefs").val();	// 搜索方式，1：按日期，2：按用户
					if(stat == 0){
                		 _self.statisticsdishes(defaults.$tbody);
					}else if (stat == 1) {
                		_self.propertystatistics(defaults.$tbody);
                	}else{
                		_self.statisticsPackage(defaults.$tbody);
                	}
				});
				
			
				
				// 点击菜品分类
				$('#dishesList').unbind('click').bind('click', function () {					
					if(stat == 0){
						_self.DishesListshop();
					}else{
						_self.PropertyListshop();
					}
				});

				// 点击店铺
				$('#shopList').unbind('click').bind('click', function () {
					_self.DishesDatashop();
				});

                // 点击下载
                $('#download').unbind('click').bind('click', function () {
                	if(stat == 0){
                		 _self.downloadSelect(defaults.$tbody);
                	}else if(stat == 1){
                		 _self.downloadProperty(defaults.$tbody);
                	}else{
                		_self.downloadPackage(defaults.$tbody);
                	}
                   
                });
                // 点击按分类
				$('#Navigation').unbind('click').bind('click', function () {
					stat = 0;
					$('#explain').html('菜品分类统计：<span>含单菜、套餐所属菜品（不含套餐）</span>')
					// 按分类统计，删除不选中的样式，添加选中的样式
					$('#Navigation').removeClass('caipin-fenleinucheck');
					$('#Navigation').addClass('caipin-fenleicheck');
					// 按属性统计，删除不选中的样式，添加选中的样式
					$('#EnProperty').removeClass('caipin-fenleicheck');
					$('#EnProperty').addClass('caipin-fenleinucheck');
					// 删除套餐统计样式
					$('#package').removeClass('caipin-fenleicheck');
					$('#package').addClass('caipin-fenleinucheck');
					//把分类统计的div显示出来，其他隐藏起来
					$('#tbodys').removeClass('hide');
					$('#propertyTbodys').addClass('hide');
					//分类的总div显示，其他隐藏
					$('#nav0-content').removeClass('hide');
					$('#nav1-content').addClass('hide');
					$('#nav2-content').addClass('hide');
					//表头 菜品分类:全部 和 菜品属性:全部 切换
					 $("#Names").html("菜品分类：");
					 $("#Names").parent('p').removeClass('hide')
					 if($('#tbodys table').html() != undefined){
					 	$('.mengBottom').removeClass('hide')
					 }else{
					 	$('.mengBottom').addClass('hide')
					 }
					
				});
				//点击按属性
				$('#EnProperty').unbind('click').bind('click', function () {
					stat = 1;
					$('#explain').html('菜品属性统计：<span>含单菜、套餐所属菜品（不含套餐）</span>')
					// 分类菜品，菜品删除不选中的样式，添加选中的样式
					$('#EnProperty').removeClass('caipin-fenleinucheck');
					$('#EnProperty').addClass('caipin-fenleicheck');
					// 属性菜品，菜品删除不选中的样式，添加选中的样式
					$('#Navigation').removeClass('caipin-fenleicheck');
					$('#Navigation').addClass('caipin-fenleinucheck');
					// 删除套餐统计样式
					$('#package').removeClass('caipin-fenleicheck');
					$('#package').addClass('caipin-fenleinucheck');
					//把属性统计的div显示出来，其他隐藏起来										
					$('#tbodys').addClass('hide');
					$('#propertyTbodys').removeClass('hide');				
					//属性的总div显示，其他隐藏
					$('#nav0-content').addClass('hide');
					$('#nav1-content').removeClass('hide');
					$('#nav2-content').addClass('hide');
					//表头 菜品分类:全部 和 菜品属性:全部 切换
					$("#Names").html("菜品属性：");
					$("#Names").parent('p').removeClass('hide')
					if($('#propertyTbodys table').html() != undefined){
						$('.mengBottom').removeClass('hide')
					}else{
					 	$('.mengBottom').addClass('hide')
					}
				});
				//点击套餐统计
				$('#package').unbind('click').bind('click',function(){
					stat = 2;
					// 删除套餐统计样式
					$('#explain').html('菜品套餐统计：<span>仅包含套餐（套餐所属菜品）</span>')
					$('#package').removeClass('caipin-fenleinucheck');
					$('#package').addClass('caipin-fenleicheck');
					// 属性菜品，菜品删除不选中的样式，添加选中的样式
					$('#Navigation').removeClass('caipin-fenleicheck');
					$('#Navigation').addClass('caipin-fenleinucheck');
					// 按属性统计，删除不选中的样式，添加选中的样式
					$('#EnProperty').removeClass('caipin-fenleicheck');
					$('#EnProperty').addClass('caipin-fenleinucheck');
					//套餐的总div显示，其他隐藏
					$('#nav0-content').addClass('hide');
					$('#nav1-content').addClass('hide');
					$('#nav2-content').removeClass('hide');
					//表头 菜品分类:全部 和 菜品属性:全部 切换
					$("#Names").parent('p').addClass('hide')
					if($('#packageTable table').html() != undefined){
					 	$('.mengBottom').removeClass('hide')
					}else{
					 	$('.mengBottom').addClass('hide')
					}
				})
			},

            // 下载分类
            downloadSelect: function($tbody) {
                var startDate = $("#start-date").val();
                var endDate = $("#end-date").val();
                var start_hour = $('#start_hour').val();
				var end_hour = $('#end_hour').val();
				var regionSel = $("#region_sel").val();	    // 查询区域选项
                // 搜索显示数据之前先清空数据
                
                //$tbody.html('');

	            if (startDate > endDate) {
	                displayMsg(ndPromptMsg, '开始日期应小于结束日期!', 2000);
	                return;
	            }
	            /*if (parseInt(start_hour) > parseInt(end_hour)) {
	                displayMsg(ndPromptMsg, '开始时段应小于结束时段!', 2000);
	                return;
	            }*/
				if ($('#dishesList').val() == "全部") {
                    defaults.dishes = "all";
                }

                if ($('#shopList').val() == "全部") {
                    defaults.shop = "all";
                }

                var CID = $.cookie('cid');
                var business = location.href.split("//")[1].split('.')[0];


                $('form').attr('action',AdminUrl.menuCountDownload);
                $('#start_date').val(startDate);
                $('#end_date').val(endDate);
                $('#start_hourF').val(parseInt(start_hour));
                $('#end_hourF').val(parseInt(end_hour));
                $('#type').val(1);
                $('#shop_ids').val(defaults.shop);
                $('#region_id_t').val(regionSel);
                $('#menu_type_ids').val(defaults.dishes);
                $('#cid').val(CID);
                $('#company_name_en').val(business);
                

				setAjax(AdminUrl.menuCountFirst, {
					'start_date': startDate,
		            'end_date': endDate,
					'start_hour': parseInt(start_hour),
					'end_hour': parseInt(end_hour),
					'menu_type_ids': defaults.dishes,
		            'shop_ids': defaults.shop,
					'type': 1,
					'region_id':regionSel
				}, $('#prompt-message'), {20: ''}, function(respnoseText) {
                    if (respnoseText.code == 20) {
						$('form').submit();
                    } else {
                        displayMsg(ndPromptMsg, respnoseText.message, 2000);
                    }
		        }, 0);
            },
            
		    // 获取菜品分类列表
			DishesListshop: function () {
				setAjax(AdminUrl.menuAllMenuTypeList, {}, $('#prompt-message'), {20: ''}, function(respnoseText) {
					var data = respnoseText.data;
                    var listContent = '<li data-value="all" data-selected="1">全部</li>';
                    for (var i in data) {
                        listContent += '<li data-value="' + data[i].menu_type_id + '" data-selected="1">' + data[i].menu_type + '</li>';
                    }
                    $('#set-dishes').html(listContent);
                    $('#dishes-title').html('菜品分类选择');
                    isHaveElement('#set-dishes', '#show-dishes');
                    setFavorableDataDis();
                    displayAlertMessage('#dishes-message', '');

                    $('#cancel-dishes').unbind('click').bind('click', function () {
                        defaults.dishes = [];
                        layer.close(layerBox);
                        countCancelDis(($('#dishesList').val().split(',')));
                        countSaleDis(defaults.dishes, '#dishesList');
                    });

                    $('#definite-dishes').unbind('click').bind('click', function () {
                        defaults.dishes = [];
                        layer.close(layerBox);
                        countSaleDis(defaults.dishes, '#dishesList');
                    });
                }, 1);
			},

			//获取菜品属性列表
			PropertyListshop: function () {
				setAjax(AdminUrl.menuAllMenuAttributeList, {}, $('#prompt-message'), {20: ''}, function(respnoseText) {
					var data = respnoseText.data;
                    var listContent = '<li data-value="all" data-selected="1">全部</li>';
                    for (var i in data) {
                        listContent += '<li data-value="' + data[i].menu_attribute_id + '" data-selected="1">' + data[i].menu_attribute + '</li>';
                    }
                    $('#set-property').html(listContent);
                    $('#property-title').html('菜品属性选择');
                    isHaveElement('#set-property', '#show-property');
                    setPropertyDataDis();
                    displayAlertMessage('#property-message', '');

                    $('#cancel-property').unbind('click').bind('click', function () {
                        defaults.property = [];
                        layer.close(layerBox);
                        propertyCancelDis(($('#dishesList').val().split(',')));
                        countPropertySaleDis(defaults.property, '#dishesList');
                    });

                    $('#definite-property').unbind('click').bind('click', function () {
                        defaults.property = [];
                        layer.close(layerBox);
                        countPropertySaleDis(defaults.property, '#dishesList');
                    });
                }, 1);
			},

		    // 获取店铺列表
			DishesDatashop: function () {
				var _self = this;
				//console.log($('a.current')[0]);
				setAjax(AdminUrl.shopShopList, {
					'type': 2
				}, $('#prompt-message'), {20: ''}, function(respnoseText) {
					var data = respnoseText.data;
                    var listContent = '<li data-value="all" data-selected="1">全部</li>';
                    for (var i in data) {
                        listContent += '<li data-value="' + data[i].shop_id + '" data-selected="1">' + data[i].shop_name + '</li>';
                    }
                    $('#set-favorable').html(listContent);
                    $('#favorable-title').html('店铺选择');
                    isHaveElement('#set-favorable', '#show-favorable');
                    setFavorableData();
                    displayAlertMessage('#favorable-message', '');

                    $('#cancel-favorable').unbind('click').bind('click', function () {
                        defaults.shop = [];
                        layer.close(layerBox);
                        countCancel(($('#shopList').val().split(',')));
                        countSale(defaults.shop, '#shopList');
                    });
				
                    $('#definite-favorable').unbind('click').bind('click', function () {
                        defaults.shop = [];
                        layer.close(layerBox);
                        countSale(defaults.shop, '#shopList');
						if(defaults.shop == 'all' || defaults.shop.indexOf(',') != -1 || defaults.shop.length > 1){
							$("#region_sel").attr("disabled","disabled");  
							$("#region_sel").addClass('color','#ccc');
							$('#region_sel').html('<option data-value="all" data-selected="1">全部</option>');
						}else{
							$("#region_sel").removeAttr("disabled","disabled");  
							$("#region_sel").removeClass('color','#ccc');
							_self.RegionList()
						}
                    });
                }, 1);
			},

			// 菜品查询
			statisticsdishes: function ($tbody) {
				// 搜索之前清空数据
				$('#tbodys').html('');
					
				var self = this;
				
				// 获取到搜索的项
				var startdate = $("#start-date").val(),		// 查询开始日期
					enddate = $("#end-date").val(),			// 查询结束日期
					disheslist = $("#dishesList").val(),	// 查询菜品分类
					start_hour = $('#start_hour').val(),	// 开始时段
					end_hour = $('#end_hour').val();		// 结束时段
					regionSel = $("#region_sel").val();	    // 查询区域选项

				if (startdate == "" || enddate == "") {
					displayMsg(ndPromptMsg, '请选择开始日期和结束日期!', 2000);
	                return;
	            }

	            if (startdate > enddate) {
	                displayMsg(ndPromptMsg, '开始日期应小于结束日期!', 2000);
	                return;
	            }

	            /*if (parseInt(start_hour) > parseInt(end_hour)) {
	                displayMsg(ndPromptMsg, '开始时段应小于结束时段!', 2000);
	                return;
	            }*/

				if ($('#dishesList').val() == "全部") {
                    defaults.dishes = "all";
                }

                if ($('#shopList').val() == "全部") {
                    defaults.shop = "all";
                }

				setAjax(AdminUrl.menuCountFirst, {
					'start_date': startdate,
		            'end_date': enddate,
					'start_hour': parseInt(start_hour),
					'end_hour': parseInt(end_hour),
					'menu_type_ids': defaults.dishes,
		            'shop_ids': defaults.shop,
					'type': 1,
					'region_id':regionSel
				}, $('#prompt-message'), {20: ''}, function(respnoseText) {
                    if (respnoseText.code == 20) {
						$('#kindHeader').removeClass('hide');
						// 得到返回数据
			            var data = respnoseText.data;
			            // 显示搜索出来的数据
						self.memberList(data);
			            $('.mengBottom').removeClass('hide')
                    } else {
                    	$('.mengBottom').addClass('hide')
						$('#kindHeader').addClass('hide');
                        displayMsg(ndPromptMsg, respnoseText.message, 2000);
                    }
		        }, 0);
			},
			
			// 显示分类查询出来的数据
			memberList: function (data) {
				var _self = this;

				// 总合计
				var totalContent = '';
				// 菜品分类
				var contentmenu = '';
				// 菜品数据
				var content = '';
				var theCt = {}; //用于存放分类合计

				// 总合计数据
				var allCt = data.ct; //读取并删除全部合计
				allCt.menu_num = parseFloat(allCt.menu_num);
				var jingshoubi = accSubtr(accSubtr(allCt.original_price,allCt.give_money),allCt.discount_money)
				delete data.ct;

				// 分类排名
				var num1 = 0;

				for (var i in data) {
					
					//读取并删除分类合计
					theCt = data[i].ct;
					var theCtjingshoubi = accSubtr(accSubtr(theCt.original_price,theCt.give_money),theCt.discount_money)
					theCt.menu_num = parseFloat(theCt.menu_num);
					delete data[i].ct;
					
					content = '';
					// 列表排名
					var num = 0;

					for (var j in data[i].menu_list) {
						num++;
						content += '<tr>'+
                                        '<td class="report_text" width="7%">'+data[i].menu_list[j].menu_name+'</td>'+ // 菜品名称
                                        '<td width="4.89%">'+num+'</td>'+							   // 序号
                                        '<td class="report_num" width="4.89%">'+parseFloat(data[i].menu_list[j].average_price).toFixed(2)+'</td>'+// 均价
                                        '<td width="4.89%">'+data[i].menu_list[j].menu_unit+'</td>'+ // 单位
                                        '<td class="report_num" width="4.89%">'+parseFloat(data[i].menu_list[j].sale_num_total).toFixed(1)+'</td>'+  //销售总量
                                        '<td class="report_num" width="4.89%">'+parseFloat(data[i].menu_list[j].sale_money_total).toFixed(2)+'</td>'+   // 销售总额
                                        '<td class="report_num" width="4.89%">'+parseFloat(data[i].menu_list[j].cancel_menu_num).toFixed(1)+'</td>'+// 退菜数量
                                        '<td class="report_num" width="4.89%">'+parseFloat(data[i].menu_list[j].cancel_menu_money).toFixed(2)+'</td>'+	  // 退菜金额
                                        '<td class="report_num" width="4.89%">'+parseFloat(data[i].menu_list[j].menu_num).toFixed(1)+'</td>'+  //销售数量
                                        '<td class="report_num" width="4.89%">'+parseFloat(data[i].menu_list[j].original_price).toFixed(2)+'</td>'+   // 销售金额
                                        '<td class="report_num" width="4.89%">'+parseFloat(data[i].menu_list[j].give_menu_num).toFixed(1)+'</td>'+// 赠送数量
                                        '<td class="report_num" width="4.89%">'+parseFloat(data[i].menu_list[j].give_money).toFixed(2)+'</td>'+	  // 赠送金额
                                        '<td class="report_num" width="4.89%">'+parseFloat(data[i].menu_list[j].net_sale_num).toFixed(1)+'</td>'+// 净销售量
                                        '<td class="report_num" width="4.89%">'+parseFloat(data[i].menu_list[j].net_sale_money).toFixed(2)+'</td>'+// 净销售额
                                        '<td class="report_num" width="4.89%">'+parseFloat(data[i].menu_list[j].discount_money).toFixed(2)+'</td>'+//折扣金额
                                        '<td class="report_num" width="4.89%">'+parseFloat(data[i].menu_list[j].pay_money).toFixed(2)+'</td>' +//结账金额
                                        // '<td class="report_num" width="4.89%">'+parseFloat(accSubtr(accSubtr(data[i].menu_list[j].original_price,data[i].menu_list[j].give_money),data[i].menu_list[j].discount_money)).toFixed(2)+'</td>'+ //销售净额
                                        '<td class="report_num" width="4.89%">'+data[i].menu_list[j].baifenbi+'</td>'+  //占比
                                        '<td class="report_num" width="4.89%">'+accMul(parseFloat(accDiv(accSubtr(accSubtr(data[i].menu_list[j].original_price,data[i].menu_list[j].give_money),data[i].menu_list[j].discount_money),theCtjingshoubi)).toFixed(4),100)+'%</td>'+  //净额占比
                                        '<td class="report_num" width="4.89%">'+data[i].menu_list[j].zhekoulv+'</td>'+  //折扣率
                                    '</tr>';
					}
					num1++;
					contentmenu += '<div class="content_classify" data-type="menuTypeIds">'+
		                                '<table class="nav_content_classify" cellspacing="0" cellpadding="0"  data-type="menuType">'+
		                                    '<tr>'+
		                                        '<td class="report_text" width="7%">'+
		                                        	'<a>'+theCt.menu_type+'</a>'+	// 分类名称
		                                        '</td>'+
		                                        '<td width="4.89%">'+num1+'</td>'+				// 序号
												'<td width="4.89%">——</td>'+
												'<td width="4.89%">——</td>'+
												'<td class="report_num" width="4.89%">'+parseFloat(theCt.sale_num_total).toFixed(1)+'</td>'+  //销售总量
		                                        '<td class="report_num" width="4.89%">'+parseFloat(theCt.sale_money_total).toFixed(2)+'</td>'+   // 销售总额
		                                        '<td class="report_num" width="4.89%">'+parseFloat(theCt.cancel_menu_num).toFixed(1)+'</td>'+// 退菜数量
		                                        '<td class="report_num" width="4.89%">'+parseFloat(theCt.cancel_menu_money).toFixed(2)+'</td>'+	  // 退菜金额
								                '<td class="report_num" width="4.89%">'+parseFloat(theCt.menu_num).toFixed(1)+'</td>'+		// 销售数量
												'<td class="report_num" width="4.89%">'+parseFloat(theCt.original_price).toFixed(2)+'</td>'+		// 销售金额
								                '<td class="report_num" width="4.89%">'+parseFloat(theCt.give_menu_num).toFixed(1)+'</td>'+	// 赠送数量
								                '<td class="report_num" width="4.89%">'+parseFloat(theCt.give_money).toFixed(2)+'</td>'+	// 赠送金额
								                '<td class="report_num" width="4.89%">'+parseFloat(theCt.net_sale_num).toFixed(1)+'</td>'+// 净销售量
                                       			'<td class="report_num" width="4.89%">'+parseFloat(theCt.net_sale_money).toFixed(2)+'</td>'+// 净销售额
												'<td class="report_num" width="4.89%">'+parseFloat(theCt.discount_money).toFixed(2)+'</td>'+// 折扣金额
												'<td class="report_num" width="4.89%">'+parseFloat(theCt.pay_money).toFixed(2)+'</td>'+// 折扣金额
												// '<td class="report_num" width="4.89%">'+parseFloat(accSubtr(accSubtr(theCt.original_price,theCt.give_money),theCt.discount_money)).toFixed(2)+'</td>'+ 	// 销售净额
												'<td class="report_num" width="4.89%">'+theCt.baifenbi+'</td>'+		// 占比
												'<td class="report_num" width="4.89%">'+accMul(parseFloat(accDiv(accSubtr(accSubtr(theCt.original_price,theCt.give_money),theCt.discount_money),jingshoubi)).toFixed(4),100)+'%</td>'+	//净额占比
												'<td class="report_num" width="4.89%">'+theCt.zhekoulv+'</td>'+ 		// 折扣率
		                                    '</tr>'+
		                                '</table>'+
		                                '<table class="con_content_classify" data-type="menuList" cellspacing="0" cellpadding="0" style="display: none;">'+content+'</table>'+
		                            '</div>';
				}
				// 总合计
				totalContent += '<div class="content_classify">'+
	                                '<table class="nav_content_classify" cellspacing="0" cellpadding="0">'+
	                                    '<tr>'+
											'<td width="7%">合计</td>'+
											'<td width="4.89%">——</td>'+
											'<td width="4.89%">——</td>'+
											'<td width="4.89%">——</td>'+
											'<td class="report_num" class="report_num" width="4.89%">'+parseFloat(allCt.sale_num_total).toFixed(1)+'</td>'+  //销售总量
	                                        '<td class="report_num" class="report_num" width="4.89%">'+parseFloat(allCt.sale_money_total).toFixed(2)+'</td>'+   // 销售总额
	                                        '<td class="report_num" class="report_num" width="4.89%">'+parseFloat(allCt.cancel_menu_num).toFixed(1)+'</td>'+// 退菜数量
	                                        '<td class="report_num" class="report_num" width="4.89%">'+parseFloat(allCt.cancel_menu_money).toFixed(2)+'</td>'+	  // 退菜金额
							                '<td class="report_num" class="report_num" width="4.89%">'+parseFloat(allCt.menu_num).toFixed(1)+'</td>'+		// 销售数量
											'<td class="report_num" class="report_num" width="4.89%">'+parseFloat(allCt.original_price).toFixed(2)+'</td>'+		// 销售金额
							                '<td class="report_num" class="report_num" width="4.89%">'+parseFloat(allCt.give_menu_num).toFixed(1)+'</td>'+	// 赠送数量
							                '<td class="report_num" class="report_num" width="4.89%">'+parseFloat(allCt.give_money).toFixed(2)+'</td>'+	// 赠送金额
							                '<td class="report_num" class="report_num" width="4.89%">'+parseFloat(allCt.net_sale_num).toFixed(1)+'</td>'+// 净销售量
							                '<td class="report_num" class="report_num" width="4.89%">'+parseFloat(allCt.net_sale_money).toFixed(2)+'</td>'+// 净销售额
											'<td class="report_num" class="report_num" width="4.89%">'+parseFloat(allCt.discount_money).toFixed(2)+'</td>'+// 折扣金额
											'<td class="report_num" class="report_num" width="4.89%">'+parseFloat(allCt.pay_money).toFixed(2)+'</td>'+// 折扣金额
											// '<td class="report_num" class="report_num" width="7%">'+parseFloat(accSubtr(accSubtr(allCt.original_price,allCt.give_money),allCt.discount_money)).toFixed(2)+'</td>'+ 	// 销售净额
											'<td width="4.89%">——</td>'+		// 占比
											'<td width="4.89%">——</td>'+		// 净额占比
											'<td class="report_num" class="report_num" width="4.89%">'+allCt.zhekoulv+'</td>'+ 		// 折扣率
	                                    '</tr>'+
	                                '</table>'+
	                            '</div>'+contentmenu;
				// 添加到页面中
				$('#tbodys').html(totalContent);

				$('#tbodys').find('div[data-type="menuTypeIds"]').each(function () {
					var self = this;
					$(self).find('table[data-type="menuType"]').unbind('click').bind('click', function () {
						$(self).find('table[data-type="menuList"]').stop().toggle('hide');
					});
				});
			},
			 // 下载套餐
            downloadPackage: function($tbody) {
                var startDate = $("#start-date").val();
                var endDate = $("#end-date").val();
                var start_hour = $('#start_hour').val();
				var end_hour = $('#end_hour').val();
				var regionSel = $("#region_sel").val();	    // 查询区域选项
                // 搜索显示数据之前先清空数据
                
                //$tbody.html('');

	            if (startDate > endDate) {
	                displayMsg(ndPromptMsg, '开始日期应小于结束日期!', 2000);
	                return;
	            }
	            /*if (parseInt(start_hour) > parseInt(end_hour)) {
	                displayMsg(ndPromptMsg, '开始时段应小于结束时段!', 2000);
	                return;
	            }*/
				if ($('#dishesList').val() == "全部") {
                    defaults.property = "all";
                }

                if ($('#shopList').val() == "全部") {
                    defaults.shop = "all";
                }
                var CID = $.cookie('cid');
                var business = location.href.split("//")[1].split('.')[0];


                $('form').attr('action',AdminUrl.packageDownload);
                $('#start_date').val(startDate);
                $('#end_date').val(endDate);
                $('#start_hourF').val(parseInt(start_hour));
                $('#end_hourF').val(parseInt(end_hour));
                $('#type').val(1);
                $('#shop_ids').val(defaults.shop);
                $('#region_id_t').val(regionSel);
                $('#cid').val(CID);
                $('#company_name_en').val(business);


				setAjax(AdminUrl.packageFirst, {
					'start_date': startDate,
		            'end_date': endDate,
					'start_hour': parseInt(start_hour),
					'end_hour': parseInt(end_hour),
		            'shop_ids': defaults.shop,
					'type': 1,
					'region_id':regionSel
					
				}, $('#prompt-message'), {20: ''}, function(respnoseText) {
                    if (respnoseText.code == 20) {
						$('form').submit();
                    } else {
                        displayMsg(ndPromptMsg, respnoseText.message, 2000);
                    }
		        }, 0);
            },

			// 套餐查询
			statisticsPackage: function ($tbody) {
				// 搜索之前清空数据
				$('#packageTable').html('');
					
				var self = this;
				
				// 获取到搜索的项
				var startdate = $("#start-date").val(),		// 查询开始日期
					enddate = $("#end-date").val(),			// 查询结束日期
					disheslist = $("#dishesList").val(),	// 查询菜品分类
					start_hour = $('#start_hour').val(),	// 开始时段
					end_hour = $('#end_hour').val();		// 结束时段
					regionSel = $("#region_sel").val();	    // 查询区域选项

				if (startdate == "" || enddate == "") {
					displayMsg(ndPromptMsg, '请选择开始日期和结束日期!', 2000);
	                return;
	            }

	            if (startdate > enddate) {
	                displayMsg(ndPromptMsg, '开始日期应小于结束日期!', 2000);
	                return;
	            }

	            /*if (parseInt(start_hour) > parseInt(end_hour)) {
	                displayMsg(ndPromptMsg, '开始时段应小于结束时段!', 2000);
	                return;
	            }*/

				if ($('#dishesList').val() == "全部") {
                    defaults.dishes = "all";
                }

                if ($('#shopList').val() == "全部") {
                    defaults.shop = "all";
                }

				setAjax(AdminUrl.packageFirst, {
					'start_date': startdate,
		            'end_date': enddate,
					'start_hour': parseInt(start_hour),
					'end_hour': parseInt(end_hour),
		            'shop_ids': defaults.shop,
					'type': 1,
					'region_id':regionSel
				}, $('#prompt-message'), {20: ''}, function(respnoseText) {
                    if (respnoseText.code == 20) {
						$('#padkageHeader').removeClass('hide');
						$('#packageTable').removeClass('hide');
						;
						// 得到返回数据
			            var data = respnoseText.data;
			            // 显示搜索出来的数据
			            self.packageList(data);
			            $('.mengBottom').removeClass('hide')
                    } else {
						$('#padkageHeader').addClass('hide');
						$('.mengBottom').addClass('hide');
						$('#packageTable').addClass('hide');
                        displayMsg(ndPromptMsg, respnoseText.message, 2000);
                    }
		        }, 0);
			},
			
			// 显示套餐查询出来的数据
			packageList: function (data) {
				var _self = this;

				// 总合计
				var totalContent = '';
				// 菜品分类
				var contentmenu = '';
				// 菜品数据
				var content = '';
				var theCt = {}; //用于存放分类合计

				// 总合计数据
				var allCt = data.ct; //读取并删除全部合计
				allCt.menu_num= parseFloat(allCt.menu_num);
				var jingshoubi = accSubtr(accSubtr(allCt.original_price,allCt.give_money),allCt.discount_money)
				delete data.ct;

				// 分类排名
				var num1 = 0;
				//套餐合计
				var packageNum = 0;
				//总赠套餐数量
				var allSet_give_menu_num = 0;

				for (var i in data) {
					theCt = data[i].ct;
		            packageNum += parseFloat(theCt.menu_num); //总销售数量

				}
				for (var i in data) {
					
					//读取并删除分类合计
					theCt = data[i].ct;
					theCt.menu_num = parseFloat(theCt.menu_num);
					var theCtjingshoubi = accSubtr(accSubtr(theCt.original_price,theCt.give_money),theCt.discount_money)
					delete data[i].ct;
					
					content = '';
					// 列表排名
					var num = 0;

					for (var j in data[i].menu_list) {
						num++;
						content += '<tr>'+
                                        '<td class="report_text" width="7%">'+data[i].menu_list[j].menu_name+'</td>'+ // 菜品名称
                                        '<td width="4.89%">'+num+'</td>'+							   // 序号
                                        '<td class="report_num" width="4.89%">'+parseFloat(data[i].menu_list[j].average_price).toFixed(2)+'</td>'+// 均价
                                        '<td width="4.89%">'+data[i].menu_list[j].menu_unit+'</td>'+ // 单位
                                        '<td class="report_num" width="4.89%">'+parseFloat(data[i].menu_list[j].sale_num_total).toFixed(1)+'</td>'+  //销售总量
                                        '<td class="report_num" width="4.89%">'+parseFloat(data[i].menu_list[j].sale_money_total).toFixed(2)+'</td>'+   // 销售总额
                                        '<td class="report_num" width="4.89%">'+parseFloat(data[i].menu_list[j].cancel_menu_num).toFixed(1)+'</td>'+// 退菜数量
                                        '<td class="report_num" width="4.89%">'+parseFloat(data[i].menu_list[j].cancel_menu_money).toFixed(2)+'</td>'+	  // 退菜金额
                                        '<td class="report_num" width="4.89%">'+parseFloat(data[i].menu_list[j].menu_num).toFixed(1)+'</td>'+  //销售数量
                                        '<td class="report_num" width="4.89%">'+parseFloat(data[i].menu_list[j].original_price).toFixed(2)+'</td>'+   // 销售金额
                                        '<td class="report_num" width="4.89%">'+parseFloat(data[i].menu_list[j].consume).toFixed(2)+'</td>'+   // 售卖金额
                                        '<td class="report_num" width="4.89%">'+parseFloat(data[i].menu_list[j].give_menu_num).toFixed(1)+'</td>'+// 赠送数量
                                        '<td class="report_num" width="4.89%">'+parseFloat(data[i].menu_list[j].give_money).toFixed(2)+'</td>'+	  // 赠送金额
                                        '<td class="report_num" width="4.89%">'+parseFloat(data[i].menu_list[j].net_sale_num).toFixed(1)+'</td>'+// 净销售量
                                        '<td class="report_num" width="4.89%">'+parseFloat(data[i].menu_list[j].net_sale_money).toFixed(2)+'</td>'+// 净销售额
                                        '<td class="report_num" width="4.89%">'+parseFloat(data[i].menu_list[j].discount_money).toFixed(2)+'</td>'+//折扣金额
                                        '<td class="report_num" width="4.89%">'+parseFloat(data[i].menu_list[j].pay_money).toFixed(2)+'</td>'+//折扣金额
                                        // '<td class="report_num" width="4.89%">'+parseFloat(accSubtr(accSubtr(data[i].menu_list[j].original_price,data[i].menu_list[j].give_money),data[i].menu_list[j].discount_money)).toFixed(2)+'</td>'+ //销售净额
                                        '<td class="report_num" width="4.89%">'+data[i].menu_list[j].baifenbi+'</td>'+  //占比
                                        '<td class="report_num" width="4.89%">'+accMul(parseFloat(accDiv(accSubtr(accSubtr(data[i].menu_list[j].original_price,data[i].menu_list[j].give_money),data[i].menu_list[j].discount_money),theCtjingshoubi)).toFixed(4),100)+'%</td>'+  //净额占比
                                        '<td class="report_num" width="4.89%">'+data[i].menu_list[j].zhekoulv+'</td>'+  //折扣率
                                    '</tr>';
					}
					num1++;
					contentmenu += '<div class="content_classify" data-type="menuTypeIds">'+
		                                '<table class="nav_content_classify" cellspacing="0" cellpadding="0"  data-type="menuType">'+
		                                    '<tr>'+
		                                        '<td class="report_text" width="7%">'+
		                                        	'<a>'+theCt.set_menu_name+'</a>'+	// 分类名称
		                                        '</td>'+
		                                        '<td width="4.89%">'+num1+'</td>'+				// 序号
												'<td class="report_num" width="4.89%">'+parseFloat(theCt.average_price).toFixed(2)+'</td>'+
												'<td width="4.89%">'+theCt.menu_set_menu_unit+'</td>'+
												'<td class="report_num" width="4.89%">'+parseFloat(theCt.sale_num_total).toFixed(1)+'</td>'+  //销售总量
		                                        '<td class="report_num" width="4.89%">'+parseFloat(theCt.sale_money_total).toFixed(2)+'</td>'+   // 销售总额
		                                        '<td class="report_num" width="4.89%">'+parseFloat(theCt.cancel_menu_num).toFixed(1)+'</td>'+// 退菜数量
		                                        '<td class="report_num" width="4.89%">'+parseFloat(theCt.cancel_menu_money).toFixed(2)+'</td>'+	  // 退菜金额
								                '<td class="report_num" width="4.89%">'+parseFloat(theCt.menu_num).toFixed(1)+'</td>'+	// 销售数量
												'<td class="report_num" width="4.89%">'+parseFloat(theCt.original_price).toFixed(2)+'</td>'+		// 销售金额
												'<td class="report_num" width="4.89%">'+parseFloat(theCt.consume).toFixed(2)+'</td>'+   // 售卖金额
								                '<td class="report_num" width="4.89%">'+parseFloat(theCt.give_menu_num).toFixed(1)+'</td>'+	// 赠送数量
								                '<td class="report_num" width="4.89%">'+parseFloat(theCt.give_money).toFixed(2)+'</td>'+	// 赠送金额
								                '<td class="report_num" width="4.89%">'+parseFloat(theCt.net_sale_num).toFixed(1)+'</td>'+// 净销售量
                                       			'<td class="report_num" width="4.89%">'+parseFloat(theCt.net_sale_money).toFixed(2)+'</td>'+// 净销售额
												'<td class="report_num" width="4.89%">'+parseFloat(theCt.discount_money).toFixed(2)+'</td>'+// 折扣金额
												'<td class="report_num" width="4.89%">'+parseFloat(theCt.pay_money).toFixed(2)+'</td>'+// 折扣金额
												// '<td class="report_num" width="4.89%">'+parseFloat(accSubtr(accSubtr(theCt.original_price,theCt.give_money),theCt.discount_money)).toFixed(2)+'</td>'+ 	// 销售净额
												'<td class="report_num" width="4.89%">'+theCt.baifenbi+'</td>'+		// 占比
												'<td class="report_num" width="4.89%">'+accMul(parseFloat(accDiv(accSubtr(accSubtr(theCt.original_price,theCt.give_money),theCt.discount_money),jingshoubi)).toFixed(4),100)+'%</td>'+	//净额占比
												'<td class="report_num" width="4.89%">'+theCt.zhekoulv+'</td>'+ 		// 折扣率
		                                    '</tr>'+  
		                                '</table>'+
		                                '<table class="con_content_classify" data-type="menuList" cellspacing="0" cellpadding="0" style="display: none;">'+content+'</table>'+
		                            '</div>';
		            //packageNum += parseFloat(theCt.set_menu_num); //总销售数量
		            allSet_give_menu_num += parseFloat(theCt.give_menu_num);  //总赠套餐数量
				}
				// 总合计
				totalContent += '<div class="content_classify">'+
	                                '<table class="nav_content_classify" cellspacing="0" cellpadding="0">'+
	                                    '<tr>'+
											'<td width="7%">合计</td>'+
											'<td width="4.89%">——</td>'+
											'<td width="4.89%">——</td>'+
											'<td width="4.89%">——</td>'+
											'<td class="report_num" class="report_num" width="4.89%">'+parseFloat(allCt.sale_num_total).toFixed(1)+'</td>'+  //销售总量
	                                        '<td class="report_num" class="report_num" width="4.89%">'+parseFloat(allCt.sale_money_total).toFixed(2)+'</td>'+   // 销售总额
	                                        '<td class="report_num" class="report_num" width="4.89%">'+parseFloat(allCt.cancel_menu_num).toFixed(1)+'</td>'+// 退菜数量
	                                        '<td class="report_num" class="report_num" width="4.89%">'+parseFloat(allCt.cancel_menu_money).toFixed(2)+'</td>'+	  // 退菜金额
							                '<td class="report_num" class="report_num" width="4.89%">'+parseFloat(packageNum).toFixed(1)+'</td>'+		// 销售数量
											'<td class="report_num" class="report_num" width="4.89%">'+parseFloat(allCt.original_price).toFixed(2)+'</td>'+		// 销售金额
											'<td class="report_num" class="report_num" width="4.89%">'+parseFloat(allCt.consume).toFixed(2)+'</td>'+   // 售卖金额
							                '<td class="report_num" class="report_num" width="4.89%">'+parseFloat(allCt.give_menu_num).toFixed(1)+'</td>'+	// 赠送数量
							                '<td class="report_num" class="report_num" width="4.89%">'+parseFloat(allCt.give_money).toFixed(2)+'</td>'+	// 赠送金额
							                '<td class="report_num" class="report_num" width="4.89%">'+parseFloat(allCt.net_sale_num).toFixed(1)+'</td>'+// 净销售量
							                '<td class="report_num" class="report_num" width="4.89%">'+parseFloat(allCt.net_sale_money).toFixed(2)+'</td>'+// 净销售额
											'<td class="report_num" class="report_num" width="4.89%">'+parseFloat(allCt.discount_money).toFixed(2)+'</td>'+// 折扣金额
											'<td class="report_num" class="report_num" width="4.89%">'+parseFloat(allCt.pay_money).toFixed(2)+'</td>'+// 折扣金额
											// '<td class="report_num" class="report_num" width="4.89%">'+parseFloat(accSubtr(accSubtr(allCt.original_price,allCt.give_money),allCt.discount_money)).toFixed(2)+'</td>'+ 	// 销售净额
											'<td width="4.89%">——</td>'+		// 占比
		                                    '<td width="4.89%">——</td>'+  //净额占比
											'<td class="report_num" class="report_num" width="4.89%">'+allCt.zhekoulv+'</td>'+ 		// 折扣率
	                                    '</tr>'+
	                                '</table>'+
	                            '</div>'+contentmenu;
				// 添加到页面中
				$('#packageTable').html(totalContent);

				$('#packageTable').find('div[data-type="menuTypeIds"]').each(function () {
					var self = this;
					$(self).find('table[data-type="menuType"]').unbind('click').bind('click', function () {
						$(self).find('table[data-type="menuList"]').stop().toggle('hide');
					});
				});
			},

			 // 下载属性
            downloadProperty: function($tbody) {
                var startDate = $("#start-date").val();
                var endDate = $("#end-date").val();
                var start_hour = $('#start_hour').val();
				var end_hour = $('#end_hour').val();
				var regionSel = $("#region_sel").val();	    // 查询区域选项
                // 搜索显示数据之前先清空数据
                
                //$tbody.html('');

	            if (startDate > endDate) {
	                displayMsg(ndPromptMsg, '开始日期应小于结束日期!', 2000);
	                return;
	            }
	            /*if (parseInt(start_hour) > parseInt(end_hour)) {
	                displayMsg(ndPromptMsg, '开始时段应小于结束时段!', 2000);
	                return;
	            }*/
				if ($('#dishesList').val() == "全部") {
                    defaults.property = "all";
                }

                if ($('#shopList').val() == "全部") {
                    defaults.shop = "all";
                }
                var CID = $.cookie('cid');
                var business = location.href.split("//")[1].split('.')[0];


                $('form').attr('action',AdminUrl.propertyDownload);
                $('#start_date').val(startDate);
                $('#end_date').val(endDate);
                $('#start_hourF').val(parseInt(start_hour));
                $('#end_hourF').val(parseInt(end_hour));
                $('#type').val(1);
                $('#shop_ids').val(defaults.shop);
                $('#region_id_t').val(regionSel);
                $('#menu_attribute_ids').val(defaults.property);
                $('#cid').val(CID);
                $('#company_name_en').val(business);


				setAjax(AdminUrl.propertytFirst, {
					'start_date': startDate,
		            'end_date': endDate,
					'start_hour': parseInt(start_hour),
					'end_hour': parseInt(end_hour),
					'menu_attribute_ids': defaults.property,
		            'shop_ids': defaults.shop,
					'type': 1,
					'region_id':regionSel
				}, $('#prompt-message'), {20: ''}, function(respnoseText) {
                    if (respnoseText.code == 20) {
						$('form').submit();
                    } else {
                        displayMsg(ndPromptMsg, respnoseText.message, 2000);
                    }
		        }, 0);
            },
			//属性查询
			propertystatistics: function ($tbody) {
				// 搜索之前清空数据
				$('#propertyTbodys').html('');
					
				var self = this;
				
				// 获取到搜索的项
				var startdate = $("#start-date").val(),		// 查询开始日期
					enddate = $("#end-date").val(),			// 查询结束日期
					disheslist = $("#dishesList").val(),	// 查询菜品分类
					start_hour = $('#start_hour').val(),	// 开始时段
					end_hour = $('#end_hour').val();		// 结束时段
					regionSel = $("#region_sel").val();	    // 查询区域选项


				if (startdate == "" || enddate == "") {
					displayMsg(ndPromptMsg, '请选择开始日期和结束日期!', 2000);
	                return;
	            }

	            if (startdate > enddate) {
	                displayMsg(ndPromptMsg, '开始日期应小于结束日期!', 2000);
	                return;
	            }

	            /*if (parseInt(start_hour) > parseInt(end_hour)) {
	                displayMsg(ndPromptMsg, '开始时段应小于结束时段!', 2000);
	                return;
	            }*/

				if ($('#dishesList').val() == "全部") {
                    defaults.property = "all";
                }

                if ($('#shopList').val() == "全部") {
                    defaults.shop = "all";
                }

				setAjax(AdminUrl.propertytFirst, {
					'start_date': startdate,
		            'end_date': enddate,
					'start_hour': parseInt(start_hour),
					'end_hour': parseInt(end_hour),
					'menu_attribute_ids': defaults.property,
		            'shop_ids': defaults.shop,
					'type': 1,
					'region_id':regionSel
				}, $('#prompt-message'), {20: ''}, function(respnoseText) {
                    if (respnoseText.code == 20) {
						$('#propertyHeader').removeClass('hide');
						// 得到返回数据
			            var data = respnoseText.data;
			            // 显示搜索出来的数据
			            self.propertyList(data);
						$('.mengBottom').removeClass('hide');
                    } else {
						$('#propertyHeader').addClass('hide');
						$('.mengBottom').addClass('hide');
                        displayMsg(ndPromptMsg, respnoseText.message, 2000);
                    }
		        }, 0);
			},
			// 显示属性查询出来的数据
			propertyList: function (data) {
				var _self = this;

				// 总合计
				var totalContent = '';
				// 菜品分类
				var contentmenu = '';
				// 菜品数据
				var content = '';
				var theCt = {}; //用于存放分类合计
				// 总合计数据
				var allCt = data.ct; //读取并删除全部合计
				allCt.menu_num= parseFloat(allCt.menu_num);
				var jingshoubi = accSubtr(accSubtr(allCt.original_price,allCt.give_money),allCt.discount_money)
				delete data.ct;

				// 分类排名
				var num1 = 0;

				for (var i in data) {
					
					//读取并删除分类合计
					theCt = data[i].ct;
					theCt.menu_num = parseFloat(theCt.menu_num);
					var theCtjingshoubi = accSubtr(accSubtr(theCt.original_price,theCt.give_money),theCt.discount_money)
					delete data[i].ct;
					
					content = '';
					// 列表排名
					var num = 0;
					for (var j in data[i].menu_list) {
						num++;
						content += '<tr>'+
                                        '<td class="report_text" width="7%">'+data[i].menu_list[j].menu_name+'</td>'+ // 菜品名称
                                        '<td width="4.89%">'+num+'</td>'+							   // 序号
                                        '<td class="report_num" width="4.89%">'+parseFloat(data[i].menu_list[j].average_price).toFixed(2)+'</td>'+// 均价
                                        '<td width="4.89%">'+data[i].menu_list[j].menu_unit+'</td>'+ // 单位
                                        '<td class="report_num" width="4.89%">'+parseFloat(data[i].menu_list[j].sale_num_total).toFixed(1)+'</td>'+  //销售总量
                                        '<td class="report_num" width="4.89%">'+parseFloat(data[i].menu_list[j].sale_money_total).toFixed(2)+'</td>'+   // 销售总额
                                        '<td class="report_num" width="4.89%">'+parseFloat(data[i].menu_list[j].cancel_menu_num).toFixed(1)+'</td>'+// 退菜数量
                                        '<td class="report_num" width="4.89%">'+parseFloat(data[i].menu_list[j].cancel_menu_money).toFixed(2)+'</td>'+	  // 退菜金额
                                        '<td class="report_num" width="4.89%">'+parseFloat(data[i].menu_list[j].menu_num).toFixed(1)+'</td>'+  //销售数量
                                        '<td class="report_num" width="4.89%">'+parseFloat(data[i].menu_list[j].original_price).toFixed(2)+'</td>'+   // 销售金额
                                        '<td class="report_num" width="4.89%">'+parseFloat(data[i].menu_list[j].give_menu_num).toFixed(1)+'</td>'+// 赠送数量
                                        '<td class="report_num" width="4.89%">'+parseFloat(data[i].menu_list[j].give_money).toFixed(2)+'</td>'+	  // 赠送金额
                                        '<td class="report_num" width="4.89%">'+parseFloat(data[i].menu_list[j].net_sale_num).toFixed(1)+'</td>'+// 净销售量
                                        '<td class="report_num" width="4.89%">'+parseFloat(data[i].menu_list[j].net_sale_money).toFixed(2)+'</td>'+// 净销售额
                                        '<td class="report_num" width="4.89%">'+parseFloat(data[i].menu_list[j].discount_money).toFixed(2)+'</td>'+//折扣金额
                                        '<td class="report_num" width="4.89%">'+parseFloat(data[i].menu_list[j].pay_money).toFixed(2)+'</td>'+//折扣金额
                                        // '<td class="report_num" width="4.89%">'+parseFloat(accSubtr(accSubtr(data[i].menu_list[j].original_price,data[i].menu_list[j].give_money),data[i].menu_list[j].discount_money)).toFixed(2)+'</td>'+ //销售净额
                                        '<td class="report_num" width="4.89%">'+data[i].menu_list[j].baifenbi+'</td>'+  //占比
                                        '<td class="report_num" width="4.89%">'+accMul(parseFloat(accDiv(accSubtr(accSubtr(data[i].menu_list[j].original_price,data[i].menu_list[j].give_money),data[i].menu_list[j].discount_money),theCtjingshoubi)).toFixed(4),100)+'%</td>'+  //净额占比
                                        '<td class="report_num" width="4.89%">'+data[i].menu_list[j].zhekoulv+'</td>'+  //折扣率
                                    '</tr>';
					}
					num1++;
					contentmenu += '<div class="content_classify" data-type="menuTypeIds">'+
		                                '<table class="nav_content_classify" cellspacing="0" cellpadding="0"  data-type="menuType">'+
		                                    '<tr>'+
		                                        '<td class="report_text" width="7%">'+
		                                        	'<a>'+theCt.menu_attribute+'</a>'+	// 属性名称
		                                        '</td>'+
		                                        '<td width="4.89%">'+num1+'</td>'+				// 序号
												'<td width="4.89%">——</td>'+
												'<td width="4.89%">——</td>'+
												'<td class="report_num" width="4.89%">'+parseFloat(theCt.sale_num_total).toFixed(1)+'</td>'+  //销售总量
		                                        '<td class="report_num" width="4.89%">'+parseFloat(theCt.sale_money_total).toFixed(2)+'</td>'+   // 销售总额
		                                        '<td class="report_num" width="4.89%">'+parseFloat(theCt.cancel_menu_num).toFixed(1)+'</td>'+// 退菜数量
		                                        '<td class="report_num" width="4.89%">'+parseFloat(theCt.cancel_menu_money).toFixed(2)+'</td>'+	  // 退菜金额
								                '<td class="report_num" width="4.89%">'+parseFloat(theCt.menu_num).toFixed(1)+'</td>'+		// 销售数量
												'<td class="report_num" width="4.89%">'+parseFloat(theCt.original_price).toFixed(2)+'</td>'+		// 销售金额
								                '<td class="report_num" width="4.89%">'+parseFloat(theCt.give_menu_num).toFixed(1)+'</td>'+	// 赠送数量
								                '<td class="report_num" width="4.89%">'+parseFloat(theCt.give_money).toFixed(2)+'</td>'+	// 赠送金额
								                '<td class="report_num" width="4.89%">'+parseFloat(theCt.net_sale_num).toFixed(1)+'</td>'+// 净销售量
                                       			'<td class="report_num" width="4.89%">'+parseFloat(theCt.net_sale_money).toFixed(2)+'</td>'+// 净销售额
												'<td class="report_num" width="4.89%">'+parseFloat(theCt.discount_money).toFixed(2)+'</td>'+// 折扣金额
												'<td class="report_num" width="4.89%">'+parseFloat(theCt.pay_money).toFixed(2)+'</td>'+// 折扣金额
												// '<td class="report_num" width="4.89%">'+parseFloat(accSubtr(accSubtr(theCt.original_price,theCt.give_money),theCt.discount_money)).toFixed(2)+'</td>'+ 	// 销售净额
												'<td class="report_num" width="4.89%">'+theCt.baifenbi+'</td>'+		// 占比
												'<td class="report_num" width="4.89%">'+accMul(parseFloat(accDiv(accSubtr(accSubtr(theCt.original_price,theCt.give_money),theCt.discount_money),jingshoubi)).toFixed(4),100)+'%</td>'+	//净额占比
												'<td class="report_num" width="4.89%">'+theCt.zhekoulv+'</td>'+ 		// 折扣率
		                                    '</tr>'+
		                                '</table>'+
		                                '<table class="con_content_classify" data-type="menuList" cellspacing="0" cellpadding="0" style="display: none;">'+content+'</table>'+
		                            '</div>';
				}

				// 总合计
				totalContent += '<div class="content_classify">'+
	                                '<table class="nav_content_classify" cellspacing="0" cellpadding="0">'+
	                                    '<tr>'+
											'<td width="7%">合计</td>'+
											'<td width="4.89%">——</td>'+
											'<td width="4.89%">——</td>'+
											'<td width="4.89%">——</td>'+
											'<td class="report_num" width="4.89%">'+parseFloat(allCt.sale_num_total).toFixed(1)+'</td>'+  //销售总量
	                                        '<td class="report_num" width="4.89%">'+parseFloat(allCt.sale_money_total).toFixed(2)+'</td>'+   // 销售总额
	                                        '<td class="report_num" width="4.89%">'+parseFloat(allCt.cancel_menu_num).toFixed(1)+'</td>'+// 退菜数量
	                                        '<td class="report_num" width="4.89%">'+parseFloat(allCt.cancel_menu_money).toFixed(2)+'</td>'+	  // 退菜金额
							                '<td class="report_num" width="4.89%">'+parseFloat(allCt.menu_num).toFixed(1)+'</td>'+		// 销售数量
											'<td class="report_num" width="4.89%">'+parseFloat(allCt.original_price).toFixed(2)+'</td>'+		// 销售金额
							                '<td class="report_num" width="4.89%">'+parseFloat(allCt.give_menu_num).toFixed(1)+'</td>'+	// 赠送数量
							                '<td class="report_num" width="4.89%">'+parseFloat(allCt.give_money).toFixed(2)+'</td>'+	// 赠送金额
							                '<td class="report_num" width="4.89%">'+parseFloat(allCt.net_sale_num).toFixed(1)+'</td>'+// 净销售量
							                '<td class="report_num" width="4.89%">'+parseFloat(allCt.net_sale_money).toFixed(2)+'</td>'+// 净销售额
											'<td class="report_num" width="4.89%">'+parseFloat(allCt.discount_money).toFixed(2)+'</td>'+// 折扣金额
											'<td class="report_num" width="4.89%">'+parseFloat(allCt.pay_money).toFixed(2)+'</td>'+// 折扣金额
											// '<td class="report_num" width="4.89%">'+parseFloat(accSubtr(accSubtr(allCt.original_price,allCt.give_money),allCt.discount_money)).toFixed(2)+'</td>'+ 	// 销售净额
											'<td width="4.89%">——</td>'+		// 占比
											'<td width="4.89%">——</td>'+ //净额占比
											'<td class="report_num" width="4.89%">'+allCt.zhekoulv+'</td>'+ 		// 折扣率
	                                    '</tr>'+
	                                '</table>'+
	                            '</div>'+contentmenu;

				// 添加到页面中
				$('#propertyTbodys').html(totalContent);

				$('#propertyTbodys').find('div[data-type="menuTypeIds"]').each(function () {
					var self = this;
					$(self).find('table[data-type="menuType"]').unbind('click').bind('click', function () {
						$(self).find('table[data-type="menuList"]').stop().toggle('hide');
					});
				});
			},
		}


		statisticsDishes.init();
});
