$(function () {
	// 门店菜品库查看
	var contentShop = Cache.get('contentShop');
	$('#dishesLook').text('菜品查看');
    // 把cid放进去
	var CID = $.cookie('cid');
    var company_name_en = $.cookie('company_name_en') == undefined ? '' : $.cookie('company_name_en');
    // 从缓存中获取到cardId
	var cardId = person_get_data().card_id;
	// 店铺id
	$.cookie('shopListcookie',contentShop.shopName);
	// 点击取消按钮
	$('#exitbtn').unbind('click').bind('click', function () {
		// 跳转
		window.location.replace('dishesManage.html?is_select=2&type='+getQueryString('type'));
	});
	// 菜品分类的全部数据
	var disCategoryData = {};
	var disPrintData = {};
	// 页面初始化
	function init(){
		// 调用菜品分类接口
		CategoryData();
		PrintData();
		for(var i in contentShop){
				getShopData(i);
			}
		// 图片
		$('#menuPic').html('<img src="../../img/business/'+cardId+'/menu/'+contentShop.menu_id+'.jpg?'+Math.random()+'">');
	};
// 图片
// $('#menuPic').html('<img class="img-polaroid" src="../../img/business/'+cardId+'/menu/'+data.menu_id+'.jpg?'+Math.random()+'">');
	// 页面数据填充
	function getShopData(type){
		var content = '';
		if(contentShop[type] == ''){
			if(type.indexOf('father') != -1){
				content = " (无)";
			}else{
				content = '无';
			}
			
		}else{
			content = contentShop[type];
			// 特定商品转换
			if(type == 'special_type' || type == 'father_special_type'){
				if(type == 'father_special_type'){
					content = ' ('+isSpecialType(contentShop[type]) +')';
				}else{
					content = isSpecialType(contentShop[type]);
				}
				
			}
			// 是否打折转换
			if(type == 'is_discount' || type == 'father_is_discount'){
				if(type == 'father_is_discount'){
					content = ' ('+isDiscount(contentShop[type]) +')';
				}else{
					content = isDiscount(contentShop[type]);
				}
				
			}
			// 是否半价转换
			if(type =='is_give' || type=='father_is_give'){

				if(type == 'father_is_give'){
					content = ' ('+isGive(contentShop[type]) +')';
				}else{
					content = isGive(contentShop[type]);
				}
				
			}
			// 适用范围转换
			if(type == 'menu_scope' || type == 'father_menu_scope'){
				if(type == 'father_menu_scope'){
					content = ' ('+menuScope(contentShop[type]) +')';
				}else{
					content = menuScope(contentShop[type]);
				}
				
			}
			// 适用制作类型转换
			if(type == 'produce_type' || type == 'father_produce_type'){
				if(type == 'father_produce_type'){
					content = ' ('+isProduceType(contentShop[type]) +')';
				}else{
					content = isProduceType(contentShop[type]);
				}
				
			}
			//打印机
			if(type == 'printer_id' || type =='jardiniere_printer_id' || type == 'pass_printer_id' || type == 'produce_printer_id' || type == 'tag_printer_id'
				|| type == 'father_printer_id' || type == 'father_jardiniere_printer_id' || type == 'father_pass_printer_id' || type == 'father_produce_printer_id' || type == 'father_tag_printer_id'){
				if(type.indexOf('father') != -1){
					content = ' (' +printList(contentShop[type])+ ')';
				}else{
					content = printList(contentShop[type]);
				}
			}


			// 菜品分类转换
			if(type == 'menu_type_id'){
				content = categoryList(contentShop[type]);
			}



			// 下单类型设置
			if(type == 'is_store'){
				if(contentShop[type] == 1){
					$('.is_store').attr('id',type);
					content = '支持商城售卖';
				}
			}
			if(type == 'is_order'){
				if(contentShop[type] == 1){
					$('.is_store').attr('id',type);
					content = '支持堂食订单';
				}
			}
			if(type == 'is_takeout'){
				if(contentShop[type] == 1){
					$('.is_store').attr('id',type);
					content = '支持外卖订单';
				}
			}
			if(type == 'is_pack'){
				if(contentShop[type] == 1){
					$('.is_store').attr('id',type);
					content = '支持打包订单';
				}
			}

			if(contentShop.shopName == 'all'){
				// 总部查看数据
				// 返回的数据为数组的话，把他变成字符串类型
				if(Array.prototype.isPrototypeOf(contentShop[type]) == true){
					content = contentShop[type].toString();
				}
				if(type == 'sale_commission'){
					content = contentShop[type].all;
				}
			}else{
				// 门店查看数据
				// 返回的数据为数组的话，把他变成字符串类型
				if(Array.prototype.isPrototypeOf(contentShop[type]) == true){
					content = contentShop[type].toString();
				}
				// 假如有span的话，表示有自定义，那么把span去掉
				if(typeof(contentShop[type]) == 'string'){
					if(contentShop[type].indexOf('</span>') != -1){
						content = contentShop[type].substr(contentShop[type].indexOf('</span>')+7);
					}
				}				
				// 假如总部有设置的话，用()显示
				if(type.indexOf('father') != -1){
					if(contentShop[type] != null){
						if(type == 'father_menu_price' || type == 'father_member_price'){
							content = ' (￥' + contentShop[type] + ')';
						}else if(type == 'father_sale_commission'){
							content = ' ('+contentShop[type].all + ')';
						}else if(type == 'father_menu_name'){
							content = ' (' + contentShop[type] + ')';
						}	
					}	
				}

			}
		}	
		$('#'+type).text(content);		
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
	};
	function CategoryData() {
    	$.ajax({
  			url: AdminUrl.menuMenuTypeList,
  			type:'POST',
  			async: false,
  			data:{cid:CID,company_name_en:company_name_en},  			  			
			success:function(respnoseText){
				disCategoryData =  respnoseText.data;
			}
		});
	};
	// 显示菜品分类数据
	function categoryList(menu_type_id){
		console.log(disCategoryData)
		for (var i in disCategoryData){
			if(menu_type_id == i){
				return disCategoryData[i].menu_type;
			}
		}
	};
	// 请求打印机列表
	function PrintData() {
		$.ajax({
  			url: AdminUrl.printerMenuPrinterList,
  			type:'POST',
  			async: false,
  			data:{cid:CID,company_name_en:company_name_en},  			  			
			success:function(respnoseText){
				disPrintData =  respnoseText.data;
			}
		});
	};
	// 显示打印机数据
	function printList(printer_id){
		for(var i in disPrintData){
			if(printer_id == disPrintData[i].printer_id){
				return disPrintData[i].printer_name;
			}
		}
	};
	init();
	
});