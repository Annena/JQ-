$(function () {
	// 菜品添加修改


		// 消耗单位数组，用于处理哪个单位的可选择（规格、计量单位），这个数组最大只有两条数据
		var consume_company = {};
		
		// 消耗物料总数据数组
		var material_deduction = {};
		// 消耗物料数据序号标识
		var material_num = 0;
		// 编辑消耗物料数据序号标识
		var update_ma_num = '';

		var is_meterial = 0;// 是否选中了行物料

		// 是否点击了选择物料消耗的物料名称/规格
		var is_mat_sele = 0;

		/*$outarray['depot_info']['is_consume_materiel'] = '1'
		有物料消耗设置项，并进行物料消耗扣减。
		新增、修改菜品时，物料消耗根据设置项传。

		$outarray['depot_info']['is_consume_materiel'] = '0'
		无物料消耗设置项，不进行物料消耗扣减，
		新增菜品时，物料消耗传空。
		修改菜品时，物料消耗传空，数据库保持原来设置的值不做更新。*/

		// 是否支持物料消耗
		var is_consume_materiel = $.cookie('is_consume_materiel');


        // 商户英文名
        var business = location.href.split("//")[1].split('.')[0];
        // 获取到修改传过来的sale_shop_id
		var menuId = getQueryString('menu_id');
		// 获取到修改传过来的缓存
		var dataPro = Cache.get('disUp');
		// 判断是修改还是添加 0;添加，1：修改
		var addIsUp = 0;
		// 菜品状态
		var menuStatusPro = '';
		// 列表修改传过来的门店集合
		var shopIdPros = '';
		//是否显示大图 勾选值为2，不勾选值1
		var sale_shop_id = '';
		var list_style = 0;


		// 物料分类数据
		var categoryData = {};
		// 物料数据
		var materiel_list_array = {};
		// 搜索物料赋值的数据（只是一个数据中间值，避免 merge_data()方法执行次数过多）
		var materiel_middle = {};


		//物料消耗 选中时的 索引
		var trNum;
		// 物料选择名称/规格 选中时的 内容
		// var mater_norm = {};
		// 价格策略列表
		var menu_price_list = new Object();
		// 价格策略列表
		var member_price_list = new Object();			
		//点击价格状态
		var priceType = 1;
		// 创建层级数组
		var array_me = {};
		// 填充页面数据
		var content_cater = '';
		// 指定分类的上级分类的数组
		var specified = {};
		// 修改过来的id
		var category_value_id = '';


		var DishesManageAdd = {

			init: function () {
				var self = this;
				// 判断是修改还是添加
				if (menuId != null && menuId != undefined && dataPro != null && dataPro != undefined) {
					addIsUp = 1;
					menuStatusPro = dataPro.menuStatus;					
					// 修改显示菜品图片
					$('#menuPic').removeClass('hide');
					// 修改显示状态
					$('#disDisplay').removeClass('hide');
					$('#addAndedit').text('菜品修改');
					if(dataPro.sale_commission.all){
						$('#allAdd').removeClass('hide');
						$('#otherAdd').remove();
					}else{
						$('#allAdd').remove();
						$('#otherAdd').removeClass('hide');
					}
					$('#isGive').val(dataPro.is_give);
					if(JSON.stringify(dataPro.menu_price_list) == "{}"){
	                    $('#PriceContent').addClass("hide");
	                }
	                if(JSON.stringify(dataPro.member_price_list) == "{}"){
	                    $('#PriceMemberContent').addClass("hide");
	                }
					this.DishesData(dataPro);
				} else {
					addIsUp = 0;
					menuStatusPro = getQueryString('menu_status');
					// 添加隐藏菜品图片
					$('#menuPic').addClass('hide');
					// 添加隐藏状态
					$('#disDisplay').addClass('hide');
					$('#addAndedit').text('菜品添加');
					$('#allAdd').removeClass('hide');
					$('#otherAdd').remove();
				}
				// 支持物料消耗，才请求物料分类接口，显示物料消耗
				if (is_consume_materiel == 1) {
					$('#consume_materiel').removeClass('hide');
					//分类列表
			        this.category_ajax_list(function(data) {
			            categoryData = data;
			        });
			        var list = {};
			        if (addIsUp == 1) {
			        	var list_num = 0;
			        	for (var i in dataPro.consume_materiel_list) {
			        		for (var j in dataPro.consume_materiel_list[i].materiel_id) {
			                    list[list_num] = {};
			                    list[list_num]['materiel_id'] = dataPro.consume_materiel_list[i].materiel_id[j];
			                    list_num++;
			        		}
			        	}
			        }
			        // 物料列表
			        this.depotMaterielListShow('', '', 1, function () {
			        	if (addIsUp == 1) {
			        		self.update_mete(dataPro);
			        	}
			        }, list);
		    	} else {
		    		$('#consume_materiel').addClass('hide');
		    	}
				// 定义菜品状态参数 0:正常，1：估清，2：下架，默认是0显示正常菜品列表
				//alert(data.menu_status);
				// 如果是正常的话，就显示正常的分类列表
				if (menuStatusPro == 0) {
					// 获取到菜品分类填充到页面
					this.disCategoryData();
					//获取到菜品属性填充到页面
					this.propertyData();
				} else if(menuStatusPro == 2) { // 如果是下架的话，就显示所有的分类列表

					this.disCategoryDataTwo();
					// 如果是下架的话，就显示所有的属性列表
					this.propertyDataTwo();
				}
				// 显示所有店铺数据，调用public.js中公用的方法
				this.shopData();				
				// 获取到打印机填充到页面
				this.PrintData();

				//新增类型显示
				this.showMessage();
				//打包盒
				this.packOut();

				// 绑定点击事件
				this.DishesAddBind();
			},					
			// 修改显示物料消耗数据
			update_mete: function (data) {
				// 物料消耗数据填充
				for (var i in data.consume_materiel_list) {
					material_num++;// 消耗物料数据序号标识
				}
				if (material_num != 0) {
					$('#mater_table table').removeClass('hide');
				}
				// 消耗物料总数据数组
				material_deduction = dishesStackHandle(data.consume_materiel_list, material_deduction);
				// 加载页面物料消耗数据
				this.meteral_loading_data();
			},

			// 显示基本数据
			DishesData: function (data) {
				// 从缓存中获取到cardId
				var cardId = person_get_data().card_id;
				// 显示数据
				// 
				//特定商品显示隐藏
				this.typeShow(data.special_type);

				//菜品适用范围				
				$('#menuScope').val(data.menuScope);	

				// 菜品did
				$('#menuDid').val(data.menu_did);
				// 菜品名称
				$('#menuName').val(data.menu_name);
				// 菜品标签
				
				var menuByname = data.menu_byname;
				var menu_byname = '';				
								
				if (menuByname == '') {
					menu_byname = '';
				} else {					
					for (var i = 0; i < menuByname.length; i++) {
						if ((menuByname.length - 1) == i) {
							menu_byname += menuByname[i];
						} else {
							menu_byname += menuByname[i]+'\n';
						}
					}
				}		
				$('#menu_byname').html(menu_byname);

				//把价格策复制给公共的
				for(var i in data.menu_price_list){
					menu_price_list[i] = data.menu_price_list[i];
					menu_price_list[i]['price_id']=i;
				}
				//把会员价格策复制给公共的
				for(var i in data.member_price_list){
					member_price_list[i] = data.member_price_list[i];	
					member_price_list[i]['price_id']=i;
				}
				 //判断是否显示价格策略表
	            if(JSON.stringify(data.menu_price_list) == "{}"){
	                $('#PriceContent').addClass("hide");
	            }else{
	            	 $('#PriceContent').removeClass("hide");
	                 // 菜品价格 price_data对数组进行填充
	                for(var key in menu_price_list){
	                    $('#add_price_tbodys').append(price_data(menu_price_list[key],1));
	                }
	            }
	            //判断是否显示会员价格策略表
	            if(JSON.stringify(data.member_price_list) == "{}"){
	                $('#PriceMemberContent').addClass("hide");
	            }else{
	            	 $('#PriceMemberContent').removeClass("hide");
	                //菜品会员价格price_data对数组进行填充           
	                for(var key in member_price_list){
	                    $('#add_memprice_tbodys').append(price_data(member_price_list[key],1));                                 
	                }
	            }
				// 菜品图片
				$('#menuPic').html('<img src="../../img/business/'+cardId+'/menu/'+data.menu_id+'.jpg?'+Math.random()+'">');
				// 菜品说明
				$('#menuInfo').val(data.menu_info);
				//alert($('#disCategoryTbodys').html());
				// 菜品分类 因为如果在这里显示修改的分类的话，分类类别会在运行完这句代码之后再显示出来菜品分类，这样就不能显示用户之前选中你的菜品分类了，所以把下面这句代码放到了菜品分类列表显示到页面之后运行，打印机和这个一样
				$('#disCategoryTbodys').val(data.menu_type_id);
				// 是否打折
				$('#isDiscount').val(data.is_discount);
				// 是否半份
				$('#isHalf').val(data.is_half);
				// 打印机
				//$('#printLisTbodys').val(data.printer_id);
				// 状态
				$('#menuStatus').val(data.menuStatus);
				// 菜品单位
				$('#menuUnit').val(data.menu_unit);
				//总部提成金额
				$('#allTicheng').text(data.allSale_commission);
				//指定商品
				$('#foodsType').val(data.special_type);
				//条形码
				$('#scanCode').val(data.scanCode);
				//制作类型
				$('#take_type input[value="'+data.produce_type+'"]').attr("checked", true)
				//制作时间
				data.produce_time == 0 ? '' : $('#take_time').val(data.produce_time);

				//是否支持餐厅售卖
				// if(data.is_shop == '1') $('#sell-sites input[name="shopSell"]').attr("checked", true);
				//是否支持商城售卖
				if(data.is_store == '1') $('#order-type input[name="sell"]').attr("checked", true);
				//是否支持堂食订单
				if(data.is_order == '1') $('#order-type input[name="shop"]').attr("checked", true);
				//是否支持外卖订单
				if(data.is_takeout == '1') $('#order-type input[name="takeout"]').attr("checked", true);
				// 是否支持打包订单
				if(data.is_pack == '1') $('#order-type input[name="pack"]').attr("checked", true);
				
	            if (data.sale_commission.all == undefined) {
	                $('#ticheng').val(parseFloat(data.sale_commission).toFixed(2));
	                $('#ticheng').parent('span').prev('input').attr('checked', true)
	                $('#allTicheng').prev('input').attr('checked', false)
	            } else {	                
	                $('#allTicheng').html(parseFloat(data.sale_commission.all).toFixed(2));
	                $('#ticheng').val(parseFloat(0).toFixed(2));
	                $('#allTicheng').prev('input').attr('checked', true)
	                $('#ticheng').parent('span').prev('input').attr('checked', false)
	            }			
				
				
				// 菜品口味
				var menuFlavor = data.menu_flavor;
				var menu_flavor = '';
				if (menuFlavor == '') {
					menu_flavor = '';
				} else {
					for (var i = 0; i < menuFlavor.length; i++) {
						if ((menuFlavor.length - 1) == i) {
							menu_flavor += menuFlavor[i];
						} else {
							menu_flavor += menuFlavor[i]+'\n';
						}
					}
				}
				$('#menuFlavor').html(menu_flavor);
				// 菜品备注
				var menuNote = data.menu_note;
				var menu_note = '';
				if (menuNote == '') {
					menu_note = '';
				} else {
					for (var i = 0; i < menuNote.length; i++) {
						if ((menuNote.length - 1) == i) {
							menu_note += menuNote[i];
						} else {
							menu_note += menuNote[i]+'\n';
						}
					}
				}
				$('#menuNote').html(menu_note);
				// 是否输入数量
				$('#isInput').val(data.is_input);
				
				//菜品适用范围
				$('#menuScope').val(data.menu_scope);
				
				// 菜品注记码
				$('#searchCode').val(data.search_code);
				//是否大图
				if(data.list_style == 2){
					$('#list_style').attr('checked',true);
				} else {
					$('#list_style').attr('checked',false);
				}

				// 缓存中的数据取出之后删除
				Cache.del('disUp');
			},
			// 请求显示店铺
			shopData: function () {
				var self = this;
				//alert(shopStatusList);
                setAjax(AdminUrl.shopShopList, {
					'type': 2
                }, $('#prompt-message'), {20: ''}, function(respnoseText) {
					// 得到返回数据
                    var data = respnoseText.data;
					// self.shopList(data);					
                }, 0);
			},
			
			// 绑定点击事件
			DishesAddBind: function () {
				var _self = this;
				// 点击修改
				$('#updatebtn').unbind('click').bind('click', function () {
					var list_styleC = $('#list_style').prop("checked"); 
					if(list_styleC == true){
						list_style = 2;
					}else{
						list_style = 1;
					};
					// 校验数据在进行添加修改
					if (_self.checkData()) {
						if (addIsUp == 0) {
							_self.DishesAdd();
						} else if (addIsUp == 1) {
							_self.DishesUpdate();
						}
					}
				});
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
				// 点击导航
				$('#selectJump').unbind('click').bind('click', function () {
					window.location.replace('dishesManage.html?is_select=1&type='+getQueryString('type'));
				});

				// 点击取消按钮
				$('#exitbtn').unbind('click').bind('click', function () {
					// 跳转
					window.location.replace('dishesManage.html?is_select=1&type='+getQueryString('type'));
				});

				//点击自动生成
				$('#autoGene').unbind('click').bind('click', function () {
					//通过汉字生成拼音
					if( $('#menuName').val() != ''){
						var hanzi = $('#menuName').val();
						var pinyin = toPinyin(hanzi);
						var lowerPinyin = conversion_case(pinyin)
						$('#searchCode').val(lowerPinyin);
					}else{
						displayMsg($('#prompt-message'), '请输入菜品名称', 2000);
					}
					
				});
				//点击添加价格策略时
				$('#addPrice').unbind('click').bind('click',function(){					
     				var self = this; 
     				//priceType1代表普通价格2代表会员价格
     				priceType=1;   
                    PriceAdd($(self),1);
				});
				
				//点击修改/删除价格策略时
				$('#PriceContent table').on('click','tr', function(event) {
					var self = this,                    
                    type = $(event.target).attr('data-type');
                    //给修改价格策略函数传值
                    //type：update修改，add保存
                    //1代表价格策略，2代表会员价格策略
                    //给修改价格策略函数传值，1代表价格策略，2代表会员价格策略
	                // public公共方法里面
	              
	               priceType=1;
	               menu_price_list=PriceUpdate($(self),type,menu_price_list);
				});

				//点击添加会员价格策略时
				$('#addmemberPrice').unbind('click').bind('click',function(){					
            		var self = this; 
            		//priceType1代表普通价格2代表会员价格
            		priceType=2;
                    PriceAdd($(self),2);
				});
				//点击修改/删除会员价格策略
				$('#PriceMemberContent table').on('click','tr', function(event) {
					var self = this,
					type = $(event.target).attr('data-type');
					priceType=2;
                    //给修改价格策略函数传值，1代表价格策略，2代表会员价格策略
                    //public公共方法里面
                	member_price_list=PriceUpdate($(self),type,member_price_list);
				});
				//点击会员价格/会员价格策略弹出的保存按钮时
				$('#dialog_price_sava_btn').unbind('click').bind('click',function(){
					var self = this;
					var dataType=$('#dialog_price_sava_btn').attr('data-type');					
					if(priceType == 1){
	                    menu_price_list=Pricesave(1,dataType,menu_price_list);
	                }else{
	                    member_price_list=Pricesave(2,dataType,member_price_list);
	                }
					
				});
				//点击会员价格/会员价格策略弹框的取消按钮时
				$('#dialog_price_cancel_btn').unbind('click').bind('click',function(){
					layer.close(layerBox);
				});
				//用户删除菜品名称时，菜品助记码清空
				$('#menuName').unbind('input propertychange').bind('input propertychange', function () {
					if( $('#menuName').val() == ''){
						$('#searchCode').val("");
					}
				});

				$('#ticheng').unbind('click').bind('click',function(){
					$(this).val('');
				});
				$('#allTicheng').unbind('click').bind('click',function(){
					$(this).val('');
				});
				// 是否可输入数量选择下拉框的事件，如果可输入数量就必须是半份，不可输入数量可以是半份也可以不是半份  isInput 0：否，1：是，isHalf 0：否，1：是
				$('#isInput').change(function(){
					if ($('#isInput').val() == 1) {
						$('#isHalf').html('<option value="1">是</option>');
					} else {
						$('#isHalf').html('<option value="0">否</option><option value="1">是</option>');
					}
				});

				// 点击选择图片按钮后存取生成图片路径
				$("#menuPictt").change(function(){
	                var objUrl = getObjectURL(this.files[0]) ;
	                $('#menuPic').removeClass('hide');
					// 判断文件类型必须是JPG，png，bump中的一种
				 	if(checkImgType(this)){
		                //console.log("objUrl = "+objUrl) ;
		                if (objUrl) {
		                    $("#menuPic").attr("src", objUrl) ;
		                    $('#menuPic').html('<img id="dishesmenupic" src="'+objUrl+'">');

		                }
	            	}
	            });

	            //点击是否特定商品
	            $("#foodsType").change(function() {
	            	var value = $(this).val();
	            	_self.typeShow(value);
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

		        // 物料编号查询点击事件
		        $('#add_mater_tbodys').off('blur').on('blur', 'tr td[name="td_commodity"] input', function() {
		            var self = $(this);
		            var parent = self.parent().parent(); // tr当前这行
		            var keyword = self.val();

		            // 请求接口找到物料
			        _self.depotMaterielListShow(keyword, '', 1, function () {
			            for (var i in materiel_list_array) {
			                if (materiel_list_array[i].materiel_code == keyword) {
			                	var is_false = _self.loop_materiel_id(materiel_list_array[i].materiel_id);
			                	
			                    // 如果没有一样的物料消耗单位就不能点击 或者 是相同的物料不能添加
			                    if ((JSON.stringify(consume_company) != '{}' && (
			                    		(consume_company[0] && consume_company[0].unit_name != materiel_list_array[i].unit_list[materiel_list_array[i].unit_id].unit_name) ||
			                    		(consume_company[1] && consume_company[1].specification_name != materiel_list_array[i].specification_name)
			                    	)) || is_false == true) {
			                    	displayMsg($('#prompt-message'), '不能添加相同的物料！', 2000);
			                    	return;
			                    } else {
				                    _self.autoFill(parent, materiel_list_array[i]);
				            		// 处理物料规格和基本计量单位数组
				            		_self.handle_mater_tbody();
				            		return;
			                    }
			                }
			            }
			        });
		        });

	            // 点击添加物料按钮，弹出层"选择物料消耗"弹出层
	            $('#addM_wrap_btn').unbind('click').bind('click', function() {
		    		$('#select_mater_deplete').removeClass('hide');
            		displayAlertMessage('#select_mater_deplete', '#select_close');
            		// 清空内容
            		$('#add_mater_tbodys').html('');
					// 编辑消耗物料数据序号标识赋值为空
					update_ma_num = '';
					// 消耗数量，消耗单位清空
					$('#deplete_num_cost').val('');$('#deplete_num_unit').html('');
            		// 物料规格和基本计量单位 清空
            		consume_company = {};
		        	// 调用添加项方法
		        	_self.addMaterApplication(1);
		        });

		        // 点击"选择物料消耗"弹出层里面的“添加项”
		        $('#add_mater_deplete').unbind('click').bind('click', function() {
		        	// 调用添加项方法
		        	_self.addMaterApplication(1);
		        });

		        // 点击"选择物料消耗"弹出层里面的“删除”
		        $('#add_mater_tbodys').on('click', 'input[name="delete-btn"]', function(){
		        	var num_type = $(this).parent('span').parent('td').parent('tr').attr('num-type');
		        	var num_text = $(this).parent('span').parent('td').parent('tr').find('.td_serial_num').text();
		        	$(this).parent('span').parent('td').parent('tr').remove();

		        	if (num_type == 1 && $('#add_mater_tbodys tr').length != 0) {
		        		$('#add_mater_tbodys tr[num-type="2"]').prepend('<td class="td_serial_num" rowspan="1">'+num_text+'</td>');
		        	}
		            var num = 1;
		            $("#add_mater_tbodys tr").each(function() {
		                $(this).find('.td_serial_num').text(num);
		                $(this).attr('num-type', num);
		                num++;
		            });
		            $('#add_mater_tbodys tr').eq(0).find('td').eq(0).attr('rowspan', $('#add_mater_tbodys tr').length);
		        });

		        // 消耗数量输入校验
		        $('#deplete_num_cost').unbind('input').bind('input', function () {
		        	if ($('#deplete_num_unit').val() == '') {
		        		checkNum('deplete_num_cost', 1);
		        	} else {
		        		checkNum('deplete_num_cost', 0);
		        	}
		        });

		        // 点击"选择物料消耗"弹出层里面的“确定”
		        $('#dialog_deplete_btn').on('click', function(){  	
		        	// 消耗数量
		        	var dnu =  $("#deplete_num_cost").val();

		        	if ($('#add_mater_tbodys tr').length == 0 || $('#deplete_num_unit').val() == null) {
		        		displayMsg($('#prompt-message'), '请最少添加一个物料！', 2000);
		        		return;
		        	}
		        	if (!dnu) {
		        		displayMsg($('#prompt-message'), '请填写消耗数量！', 2000);
		        		return;
		        	}
		        	if ($('#deplete_num_unit').val() != '' && parseFloat(dnu).toString().indexOf('.') != -1) {
		        		displayMsg($('#prompt-message'), '最小单位消耗时消耗数量必须为整数！', 2000);
		        		return;
		        	}

		        	// 生成表格内容的函数
		        	_self.renderTable();
            		layer.close(layerBox);
            		// 如果页面没有显示出来，就显示出来
            		if ($('#mater_table table').hasClass('hide')) {
            			$('#mater_table table').removeClass('hide');
            		}
		        });

		        // 点击“物料规格/名称”弹出层
		        $('#add_mater_tbodys').on('click', 'td[name="td_unit"]', function(){
		         	layer.close(layerBox);

		        	// 记录 对应行数 索引
		        	trNum = $(this).parent('tr').attr('num-type');

	                if (categoryData != '') {
	                	is_mat_sele = 1;
	                	var category_id = $(this).find('p').attr('category_id'); //分类id
	                	var keyword = $(this).find('p').attr('materiel_code'); //物料编号
	                	$('#dialog_unit_btn').attr("tNum", trNum); //标识点的是哪一行
	                    // 展示弹出层分类数据
	                    _self.category_dialog(categoryData, '#select_mater_norm', '', '#material_category_list', 3, category_id);
	                    // 搜索物料清空
	                    $('#serach_code').val('');
	                    // 显示默认物料
	                    _self.depotMaterielListShow('', '');
	                } else {
	                    displayMsgTime(ndPromptMsg, '没有物料分类，请先添加物料分类！', 2000);
	                }
		        });

		        // "选择物料规格/名称"弹窗 右上角叉号
		        $('#mater_norm_exit').unbind('click').bind('click', function() {
		    		layer.close(layerBox);
		    		is_mat_sele = 0;
		    		is_meterial = 0;
		    		// 弹出"选择物料消耗"弹出层
		    		$('#select_mater_deplete').removeClass('hide');
            		displayAlertMessage('#select_mater_deplete', '#select_close');
		        });

		        // 点击“物料规格/名称”弹窗内的查询按钮
		        $("#keywordSearch").unbind('click').bind('click', function() {
		        	_self.depotMaterielListShow($('#serach_code').val(), '');
		        });

		        //点击分类切换
		        $('#material_category_list').on('click', 'ul li div[data-id]', function() {
		            var category_id = $(this).attr("data-id");
		            _self.depotMaterielListShow('', category_id);
		        });
		       
            	// “物料规格/名称” 选中行 事件
            	$('#material_list').on('click', 'tr', function(){
            		if (!$(this).hasClass('color_gray')) {
            			is_meterial = 1;
	            		// 物料编码
	            		$(this).addClass('cur').siblings().removeClass('cur');
            		}
		            /*$('#material_list tr').removeClass('cur');
		            $(this).addClass('cur');*/
		        });
		        // 点击“物料规格/名称”弹窗内的确定按钮
		        $('#dialog_unit_btn').on('click', function(){
		        	// 是否选中了行物料
		        	if (is_meterial == 0) {
		        		displayMsgTime(ndPromptMsg, '请选择物料！', 2000);
		        		return;
		        	}
		        	is_mat_sele = 0;
            		layer.close(layerBox);

            		// 合并物料数据
            		_self.merge_data(materiel_middle);

            		var tNum = $(this).attr('tNum');
		            var materialList = $('#material_list .cur').attr('materiel_list');
		            var materialData = JSON.parse(materialList)
		            var parent = $('#add_mater_tbodys').find('tr[num-type="' + tNum + '"]');
		            _self.autoFill(parent, materialData);

		        	is_meterial = 0;

		    		// 弹出"选择物料消耗"弹出层
		    		$('#select_mater_deplete').removeClass('hide');
            		displayAlertMessage('#select_mater_deplete', '#select_close');

            		// 处理物料规格和基本计量单位数组
            		_self.handle_mater_tbody();
		        });
			},

			// 处理物料规格和基本计量单位数组
			handle_mater_tbody: function () {
        		// 物料规格和基本计量单位循环放到数组里面
        		consume_company = {};
        		var dialog_num = 0;
        		$('#add_mater_tbodys').find('tr').each(function () {
        			var unit_id = $(this).find('td[name="td_quantity"]').attr('unit_id');
        			var unit_name = $(this).find('td[name="td_quantity"]').html();
        			var specification_quantity = $(this).find('td[name="td_unit"] input').attr('specification_quantity');
        			var specification_name = $(this).find('td[name="td_unit"] input').attr('specification_name');

        			if (dialog_num == 0) {
            			consume_company[0] = {};
            			consume_company[0]['unit_id'] = unit_id;
            			consume_company[0]['unit_name'] = unit_name;
						consume_company[1] = {};
            			consume_company[1]['specification_quantity'] = specification_quantity;
            			consume_company[1]['specification_name'] = specification_name;
        			} else {
        				if (consume_company[1] && consume_company[0] && consume_company[0]['unit_name'] == unit_name && consume_company[1]['specification_name'] == specification_name) {
        				} else if (consume_company[0] && consume_company[0]['unit_name'] == unit_name) {
        					delete consume_company[1];
        				} else if (consume_company[1] && consume_company[1]['specification_name'] == specification_name) {
        					delete consume_company[0];
        				}
        			}
        			dialog_num++;
        		});
        		// 填充消耗单位
        		var select_conte = '';
        		if (consume_company[0]) {
        			select_conte += '<option value="'+consume_company[0].unit_id+'" name="'+consume_company[0].unit_name+'">'+consume_company[0].unit_name+'</option>';
        		}
        		if (consume_company[1]) {
        			select_conte += '<option value="" name="'+consume_company[1]['specification_name']+'">'+consume_company[1]['specification_name']+'</option>';
        		}
        		$('#deplete_num_unit').html(select_conte);
			},

		    //点击和输入自动补齐功能
		    //parent tr 当前的tr 用来查找元素
		    //materialData 物料数据 用阿里填充数据
		    autoFill: function (parent, materialData) {
		        parent.find('td[name="td_unit"] input').val(materialData.materiel_name+' '+materialData.specification_quantity + materialData.specification_name).attr({'specification_quantity':materialData.specification_quantity,'specification_name':materialData.specification_name });
		        parent.find('td[name="td_quantity"]').html(materialData.unit_list[materialData.unit_id].unit_name).attr('unit_id', materialData.unit_id);
		        parent.find('td[name="td_commodity"] input').val(materialData.materiel_code);
		        parent.attr('materiel_id', materialData.materiel_id);
		    },
 
			// 添加修改前校验数据
			checkData: function () {
				// 菜品口味
				var menuFlavor = $('#menuFlavor').val();
				// 菜品备注
				var menuNote = $('#menuNote').val();
				//菜品标签
				var menuByname = $('#menu_byname').val();
				// 菜品单位
				var menuUnit = $('#menuUnit').val();
				// 菜品提成
				var sale_commission = $('#ticheng').val();

				if (menuUnit != '') {
					var reg=/^[\u4E00-\u9FA5]+$/;
					var rel = /^[a-zA-Z]*$/;
					if (!reg.test(menuUnit) && !rel.test(menuUnit)){
						displayMsg($('#prompt-message'), '菜品单位必须输入汉字或字母', 2000);
						return false;
					}

					var l = menuUnit.length;
					var blen = 0;

					for(i=0; i<l; i++) {
						if ((menuUnit.charCodeAt(i) & 0xff00) != 0) {
							blen++;
						}
						blen++;
					}
					if (blen.length > 10) {
						displayMsg($('#prompt-message'), '菜品单位汉字不能超过5个，字符不能超过10个', 2000);
						return;
					}
				}
				if($('#ticheng').val() != ''){
					if(!check_sale(sale_commission)){
						return;
					}
				}
				
				//alert('1');
				//以换行符为分隔符将内容分割成数组
				var menuFlavorArry = menuFlavor.split("\n");
				var menuNoteArry = menuNote.split("\n");
				var menuBynameArry = menuByname.split("\n");
				//str.replace(/[ ]/g,"")//去除字符串中的空格
				var numFla = 0;		// 菜品口味行数
				var numNote = 0;	// 菜品备注行数
				var numByname = 0;	// 菜品标注行数
				for (var k = 0; k < menuFlavorArry.length; k++) {
					if (menuFlavorArry[k] == '') {
						continue;
					}
					var l = menuFlavorArry[k].replace(/[ ]/g,"").length;
					var blen = 0;

					for(i=0; i<l; i++) {
						if ((menuFlavorArry[k].replace(/[ ]/g,"").charCodeAt(i) & 0xff00) != 0) {
							blen++;
						}
						blen++;
					}

					if (blen.length > 20) {
						displayMsg($('#prompt-message'), '菜品口味每一行不能超过十个字', 2000);
						return false;
					}
					numFla++;
				}
				

				var naryFlavor = menuFlavorArry.sort();
				for(var i = 0; i < naryFlavor.length - 1; i++){
					if (naryFlavor[i] == naryFlavor[i+1]){
						displayMsg($('#prompt-message'), '菜品口味不能出现重复', 2000);
						return false;
					}
				}
				
				for (var e = 0; e < menuNoteArry.length; e++) {
					if (menuNoteArry[e] == '') {
						continue;
					}					
					var l = menuNoteArry[e].replace(/[ ]/g,"").length;
					var blen = 0;

					for(i=0; i<l; i++) {
						if ((menuNoteArry[e].replace(/[ ]/g,"").charCodeAt(i) & 0xff00) != 0) {
							blen++;
						}
						blen++;
					}

					if (blen > 20) {
						displayMsg($('#prompt-message'), '菜品备注每一行不能超过十个字', 2000);
						return false;
					}
					numNote++;
				}

				/*if (numNote > 10) {
					displayMsg($('#prompt-message'), '菜品备注不能超过十个', 2000);
					return false;
				}*/

				var naryNote = menuNoteArry.sort();
				for(var i = 0; i < naryNote.length - 1; i++){
					if (naryNote[i] == naryNote[i+1]){
						displayMsg($('#prompt-message'), '菜品备注不能出现重复', 2000);
						return false;
					}
				}
				//alert('4');
				if (menuFlavor == '' || menuNote == '') {
					//return true;
				} else {
					
					for (var i = 0; i < menuFlavorArry.length; i++) {
						if (menuFlavorArry[i] == '') {
							continue;// 口味的某一行如果是空就运行下一个循环
						}
						for (var n = 0; n < menuNoteArry.length; n++) {
							if (menuNoteArry[n] == '') {
								continue;
							}
							if (menuFlavorArry[i].replace(/[ ]/g,"") == menuNoteArry[n].replace(/[ ]/g,"")) {
								displayMsg($('#prompt-message'), '菜品口味与菜品备注不能重复', 2000);
								return false;
							}
						}
					}
				}
				//alert('5');
				//菜品标签
				//最多支持12个汉字，最多支持5个标签(字母数字符号算半个)				
				for (var h = 0; h < menuBynameArry.length; h++) {
					if (menuBynameArry[h] == '') {
						continue;
					}					
					var l = menuBynameArry[h].replace(/[ ]/g,"").length;
					var blen = 0;

					for(i=0; i<l; i++) {
						if ((menuBynameArry[h].replace(/[ ]/g,"").charCodeAt(i) & 0xff00) != 0) {
							blen++;
						}
						blen++;
					}					
					if (blen > 24) {
						displayMsg($('#prompt-message'), '菜品标签只能输入12个汉字', 2000);
						return false;
					}
					numByname++;
				}

				if (numByname > 5) {
					displayMsg($('#prompt-message'), '菜品标签不能超过五个', 2000);
					return false;
				}
				
				var naryByname = menuBynameArry.sort();
				for(var i = 0; i < naryByname.length - 1; i++){
					if (naryByname[i] == naryByname[i+1]){
						displayMsg($('#prompt-message'), '菜品标签不能出现重复', 2000);
						return false;
					}
				}
				// 菜品助记码
				var searchCode = $('#searchCode').val();
				//alert(searchCode);
				if (searchCode != '') {
					
					var searchReg = /^[0-9|a-zA-Z|0-9a-zA-Z]{0,32}$/;
					if (!searchReg.test(searchCode)) {
						displayMsg($('#prompt-message'), '菜品助记码必须是数字和字母32位', 2000);
						return false;
					}
				}		
			

			    // 菜品说明不能超过85个字
			    var menu_info = $('#menuInfo').val();
				var len2 = menu_info.length;
			    var reg2 = /[\u4e00-\u9fa5]{1,}/g;
			    if(reg2.test(menu_info)){
			        len2 += menu_info.match(reg2).join("").length;
			    }
			    if(len2 > 340){
			        displayMsg($('#prompt-message'), '菜品说明最多支持170个汉字、字母、数字、符号', 3000);
			        return false;
			    }

				//如果输入的有空格，删除空格
				$('#form ul input').each(function(){
					if($(this).val() != ''){
						if($(this).attr('id') != 'menuPictt'){
							$(this).val($(this).val().replace(/\s/g, ""))
						}
					}
				})
				return true;
			},
			// 特定商品显示隐藏设置
			typeShow: function(value) {
				var _self = this;
				var abstellbar = $('.clearfix[data-name="abstellbar"]');
				var menuscope = $('.clearfix[data-name="menuscope"]');
				this.changeText(value, $(".test_t .font"));
				if(value != "0") {
					menuscope.addClass('hide');
					abstellbar.addClass('hide');
					$("#isDiscount").val("0");
					// $("#sell-sites input[name='shopSell']").attr("checked", false)
					if(parseInt(value) >= 6 && parseInt(value) != 11 && parseInt(value) != 12 && parseInt(value) != 13
						) {
						abstellbar.removeClass('hide');
					}
				} else {
					abstellbar.removeClass('hide');
					menuscope.removeClass('hide');
					$("#isDiscount").val("1");
				}
				if(value == "5") {
					$('#shopIds div input[type="checkbox"]').each(function(i,val){
						$(this).prop('checked', true);
						$(this).prop('disabled', true)
					});
					shopIds = 'all';
				} else {
					$('#shopIds div input[type="checkbox"]').each(function(i,val){
						$(this).prop('disabled', false)
					});
				}

	            // 三种特殊商品类型：11 百度外卖配送费12 饿了么外卖配送费13 美团外卖配送费，在APP、点菜宝、收银台点菜界面不显示
	            if (value == "11" || value == "12" || value == "13") {
	                $('#menuScope').val(3);
	                $('#menuScope').prop('disabled', true);
	            } else {
	                $('#menuScope').val(3);
	                $('#menuScope').prop('disabled', false);
	            }
			},
			//指定商品提示文字
			changeText: function(index, box) {
				switch(index) {
					case "0": 
						box.html("");
						break;
					case "1": 
						box.html("*如果需要按就餐人数收取堂食餐具费，每个门店可以设置一个堂食餐包");
						break;
					case "2":
						box.html("*如果需要按就餐人数收取外卖餐包费，每个门店可以设置一个外卖餐包");
						break;
					case "3": 
						box.html("*如果外卖订单需要自动收取送餐费，每个门店可以设置一个外卖送餐费");
						break;
					case "11": 
						box.html("*如果外卖订单需要自动收取送餐费，每个门店可以设置一个外卖送餐费");
						break;
					case "12": 
						box.html("*如果外卖订单需要自动收取送餐费，每个门店可以设置一个外卖送餐费");
						break;
					case "13": 
						box.html("*如果外卖订单需要自动收取送餐费，每个门店可以设置一个外卖送餐费");
						break;
					case "4":
						box.html("*如果商城订单需要自动收取商城配送费，每个门店可以设置一个商城配送费");
						break;
					case "5": 
						box.html("*如果需要给外卖、打包商品设置打包盒，就需要先添加对应的打包盒");
						break;
					case "6": 
						box.html("*设置需要必点锅底的菜品才能生效");
						break;
					case "7": 
						box.html("*设置需要必点小料的菜品才能生效");
						break;
					case "8": 
						box.html("*如果要让设置的必点商品生效，需要设置点了哪些条件商品，才会要求必点商品。比如涮菜、配菜");
						break;
				}
			},
			
			// 添加
			DishesAdd: function () {
				// 获取到各个数据，请求接口提交数据
				var self = this;
				// 把cid放进去
				$('#CID').val($.cookie('cid'));
				$('#companyNameEn').val(business);
				
				// 菜品口味
				var menuFlavor = $('#menuFlavor').val();
				// 菜品备注
				var menuNote = $('#menuNote').val();
				// 菜品标签
				var menuByname=$('#menu_byname').val();
				// 提成金额
				var sale_commission= new Object();
            
	            if ($('#ticheng').val() != '') {
	                sale_commission['all'] = parseFloat($('#ticheng').val()).toFixed(2);
	            }else{
	                sale_commission['all'] = 0.00;
	            }
				//以换行符为分隔符将内容分割成数组
				var menuFlavorArry = menuFlavor.split("\n");
				var menuNoteArry = menuNote.split("\n");
				var menuBynameArry = menuByname.split("\n");
				var menuFlav = {};
				var menuNo = {};
				var menuBy = new Array();
				var flavorArray = new Array();
				var noteArray = new Array();
				var flavorNum = 1;
				var noteNUm = 1;
				var bynameNum = 0;

				//特殊商品售卖地点和下单类型赋值
			   	var isStore, isOrder, isTakeout, isPack;
			   	var foodsType = $('#foodsType').val();
			   	var is_discount=$('#isDiscount').val();
			   	var is_give= $('#isGive').val();
			   	var is_half=$('#isHalf').val();
			   	var is_input= $('#isInput').val();
			   	var special_type=foodsType;
			   	// 配菜打印机
			   	var jardiniere_printer_id=$('#matchPrinter').val();
			   	// 划菜打印机
			   	var produce_printer_id=$('#producePrinterId').val();
			   	// 生产打印机设置
			   	var printer_id=	$('#printLisTbodys').val();
			   	//标签打印机
			   	var tag_printer_id = $("#tagPrinterId").val();
			   	// 传菜打印机设置
			   	var pass_printer_id=$('#passPrinterId').val();

			   	var menu_attribute_id=$('#propertyContent').val();
			   	var menu_did=$('#menuDid').val();
			   	var menu_id=$('#menuId').val();
			   	var menu_info=$('#menuInfo').val();
				var menu_name=$('#menuName').val();	
				var menu_type_id=$('#disCategoryTbodys').val();
				var pass_printer_name='未设置传菜打印机';
				var printer_name='未设置生产打印机';	
				if(pass_printer_id){
					pass_printer_name=$("#passPrinterId").find("option[value='"+ pass_printer_id +"']").text();
				}				
				if(printer_id){
					printer_name=$("#printLisTbodys").find("option[value='"+ printer_id +"']").text();
				}	

   				if(foodsType == "1") {
   					isStore = "0"; isOrder = "1"; isTakeout = "0"; isPack = "1";
   				} else if(foodsType == "2") {
   		   			isStore = "0"; isOrder = "0"; isTakeout = "1"; isPack = "1";
   		   		} else if(foodsType == "3" || foodsType == "11" || foodsType == "12" || foodsType == "13") {
   		   			isStore = "0"; isOrder = "0"; isTakeout = "1"; isPack = "0";
   		   		} else if(foodsType == "4") {
   		   			isStore = "1"; isOrder = "0"; isTakeout = "0"; isPack = "0";
   		   		} else if(foodsType == "5") {
   		   			isStore = "1"; isOrder = "1"; isTakeout = "1"; isPack = "1";
   		   		} else {
   			   		// isShop = $("#sell-sites input[name='shopSell']").is(':checked') ? "1" : "0";
   			   		isStore = $("#order-type input[name='sell']").is(':checked') ? "1" : "0";
   				    isOrder = $("#order-type input[name='shop']").is(':checked') ? "1" : "0";
   				    isTakeout = $("#order-type input[name='takeout']").is(':checked') ? "1" : "0";
   					isPack = $("#order-type input[name='pack']").is(':checked') ? "1" : "0";
   		   		}

   		   		// 只有一个显示的时候赋值处理
   		   		var orderL = $('#order-type .fendian').not(".hide").length;
   		   		if(orderL == 1) {
   		   			$("#order-type div[data-shop]").hasClass('hide')? isOrder = '0' : isOrder = '1';
   		   			$('#order-type div[data-takeout]').hasClass('hide')? isTakeout = '0': isTakeout= '1';
   		   			$('#order-type div[data-pack').hasClass('hide')? isPack = '0' : isPack = '1';
   		   			$('#order-type div[data-sell]').hasClass('hide')? isStore = '0' : isStore = '1';
   		   		}

   		   		//菜品口味
				if (menuFlavor == '') {
					menuFlav = '';
				} else {
					for (var i = 0;i<menuFlavorArry.length;i++) {
						if (menuFlavorArry[i] == '') {
							continue;
						} else {
							menuFlav[flavorNum] = menuFlavorArry[i].replace(/[ ]/g,"");
							//flavorArray[flavorNum] = JSON.stringify(menuFlav);
							flavorNum++;
						}
					}
				}
				//菜品备注
				if (menuNote == '') {
					menuNo = '';
				} else {
					for (var k = 0;k<menuNoteArry.length;k++) {
						if (menuNoteArry[k] == '') {
							continue;
						} else {
							menuNo[noteNUm] = menuNoteArry[k].replace(/[ ]/g,"");
							//noteArray[noteNUm] = JSON.stringify(menuNo);
							noteNUm++;
						}
					}
				}
				//菜品标签
				if (menuByname == '') {
					menuBy = '';
				} else {
					for (var h = 0;h<menuBynameArry.length;h++) {
						if (menuBynameArry[h] == '') {
							continue;
						} else {
							menuBy[bynameNum] = menuBynameArry[h].replace(/[ ]/g,"");							
							bynameNum++;
						}
					}
				}
				// 菜品单位
				var menuUnit = $('#menuUnit').val();
				if (menuUnit == '') {
					menuUnit = '份';
				}
				 // 菜品价格列表
	            var menupricelist = [];
	            for(var i in menu_price_list){
	            	delete menu_price_list[i].price_id;
	            	for(var key in menu_price_list[i]){
						if(key == 'hour_time' || key == 'week_day'){
							if(isArray(menu_price_list[i][key])){
								menu_price_list[i][key] = menu_price_list[i][key].toString();
							}
						}
					}
	            	menupricelist.push(menu_price_list[i]);
	            }                
	            // 会员价列表
	            var memberpricelist = [];  
				for(var i in member_price_list){
					delete member_price_list[i].price_id;
					for(var key in member_price_list[i]){
						if(key == 'hour_time' || key == 'week_day'){
							if(isArray(member_price_list[i][key])){
								member_price_list[i][key] = member_price_list[i][key].toString();
							}
						}
					}
					memberpricelist.push(member_price_list[i])
				}
				//alert(memberPrice);
				//菜品适用范围
				var menuScope = $('#menuScope').val();

				if (this.dataCheck()) {
			   	//条形码验证
			   	var scanCode = $('#scanCode').val();
			   	var exp = /^20\d{4}$/;
			   	if(scanCode != "") {
			   		if(!exp.test(scanCode)) {
			   			displayMsg(ndPromptMsg, '条形码格式不正确', 2000);
			   			return;
			   		}
			   	}

			   	// 下单数据类型无选中
			   	var typeLength = 0;
			   	$('#order-type input[type="checkbox"]').each(function(i) {
			   		if($(this).is(':checked')) {
			   			typeLength += 1;
			   		}
			   	})
			   	if(typeLength == 0 && (foodsType == 0 || foodsType == 6 || foodsType == 7 || foodsType == 8)) {
			   		displayMsg($('#prompt-message'), '请勾选下单类型', 3000);
			   		return;
			   	}

			   	//制作时间和制作类型
			   	var produce_type = $('#take_type input[name="takeType"]:checked').val();
			   	var produce_time = $('#take_time').val() == '' ? 0 : $('#take_time').val();
			   	if (produce_time < 0) {
			   		displayMsg(ndPromptMsg, '制作时间必须大于0', 2000);
			   		return;
			   	}
			   	if(produce_type == 2) {
			   		if($('#producePrinterId').val() == '') {
			   			displayMsg(ndPromptMsg, '批量制作必须设置划菜打印机', 2000);
			   			return;
			   		}
			   	}
			   	//标签打印机
			   	var tag_printer_id = $("#tagPrinterId").val();	
			   	//状态
			   	var menustatus = 0;	
			   	$("#form").ajaxSubmit({
	                    type: 'post',
	                    data: {
			                'menu_flavor': menuFlav,
			                'menu_note': menuNo,
			                'menu_unit': menuUnit,
			                'flavor_num': flavorNum - 1,
			                'note_count': noteNUm - 1,
							'menu_scope': menuScope,
							'menu_status':menustatus,
							'menu_price_list': menupricelist,
							'member_price_list': memberpricelist,
							'is_set_menu':'0',
							'list_style':list_style,							
							'sale_shop_id':'all',
							'sale_commission':sale_commission,
							'is_store': isStore,
							'is_order': isOrder,
							'is_takeout': isTakeout,
							'is_pack': isPack,
							'barcode': scanCode,
							'menu_byname': menuBy,
							'produce_type': produce_type,
							'produce_time': produce_time,
							'is_discount':is_discount, 
							'is_give':is_give,
			 				'is_half':is_half,
			   				'is_input':is_input,
					   		'jardiniere_printer_id':jardiniere_printer_id,
			   				'produce_printer_id':produce_printer_id,
			   				'printer_id':printer_id,
			   				'tag_printer_id':tag_printer_id,
			   				'pass_printer_id':pass_printer_id,
			   				'menu_attribute_id':menu_attribute_id,
			   		 		'menu_did':menu_did,
			   		 		'menu_id':menu_id,
			   				'menu_info':menu_info,	
							'menu_name':menu_name,
							'menu_type_id':menu_type_id,
							'pass_printer_name':pass_printer_name,
							'printer_name':	printer_name,
							'special_type':special_type,
							'consume_materiel_list': material_deduction // 物料消耗数组
			            },
	                    xhrFields:{withCredentials:true},
	                    url: AdminUrl.menuMenuAdd,
	                    success: function (respnoseText) {
	                        //respnoseText = JSON.parse(respnoseText);
	                        //console.log(respnoseText);
	                        var data = respnoseText.data;
	                        if (respnoseText.code == 20) {
	                            displayMsgTime($('#prompt-message'), respnoseText.message, 2000, function () {
	                                //layer.close(layerBox);
	                                window.location.replace('dishesManage.html?is_select=1&type='+getQueryString('type'));
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
				
			},

			// 修改
			DishesUpdate: function () {
				// 获取到各个数据，请求接口提交数据
				var self = this;
				// 把cid放进去
				$('#CID').val($.cookie('cid'));
				$('#companyNameEn').val(business);
				$('#menuId').val(dataPro.menu_id);
	            var sale_commission= new Object();            
	            if ($('#ticheng').val() != '') {
	                sale_commission['all'] = parseFloat($('#ticheng').val()).toFixed(2);
	            }else{
	                sale_commission['all'] = 0.00;
	            }
				// 菜品口味
				var menuFlavor = $('#menuFlavor').val();
				// 菜品备注
				var menuNote = $('#menuNote').val();
				// 菜品标签
				var menuByname = $('#menu_byname').val();
				// 菜品适用范围
				var menuScope = $('#menuScope').val();
				
				//以换行符为分隔符将内容分割成数组
				var menuFlavorArry = menuFlavor.split("\n");
				var menuNoteArry = menuNote.split("\n");
				var menuBynameArry = menuByname.split("\n");
				var menuFlav = {};
				var menuNo = {};
				var menuBy = new Array();
				var flavorArray = new Array();
				var noteArray = new Array();
				var bynameArray = new Array();
				var flavorNum = 1;
				var noteNUm = 1;
				var bynameNum = 0;
				//特殊商品售卖地点和下单类型赋值
			   	var isStore, isOrder, isTakeout, isPack;
			   	var foodsType = $('#foodsType').val();	

			   	var is_discount=$('#isDiscount').val();
			   	var is_give= $('#isGive').val();
			   	var is_half=$('#isHalf').val();
			   	var is_input= $('#isInput').val();
			   	// 配菜打印机
			   	var jardiniere_printer_id=$('#matchPrinter').val();
			   	// 划菜打印机
			   	var produce_printer_id=$('#producePrinterId').val();
			   	// 生产打印机设置
			   	var printer_id=	$('#printLisTbodys').val();
			   	//标签打印机
			   	var tag_printer_id = $("#tagPrinterId").val();
			   	// 传菜打印机设置
			   	var pass_printer_id=$('#passPrinterId').val();	

			   	var menu_attribute_id=$('#propertyContent').val();

			   	if(!$('#propertyContent').val()){
					menu_attribute_id = dataPro.menu_attribute_id;
				}		

			   	var menu_did=$('#menuDid').val();
			   	var menu_id=$('#menuId').val();
			   	var menu_info=$('#menuInfo').val();
				var menu_name=$('#menuName').val();	

				var menu_type_id=$('#disCategoryTbodys').val();

				if(!$('#disCategoryTbodys').val()){
					menu_type_id = dataPro.menu_type_id;
				}							

				var pass_printer_name='未设置传菜打印机';
				var printer_name='未设置生产打印机';	
				if(pass_printer_id){
					pass_printer_name=$("#passPrinterId").find("option[value='"+ pass_printer_id +"']").text();
				}				
				if(printer_id){
					printer_name=$("#printLisTbodys").find("option[value='"+ printer_id +"']").text();
				}	

				//制作时间和制作类型
			   	var produce_type = $('#take_type input[name="takeType"]:checked').val();
			   	var produce_time = $('#take_time').val() == '' ? 0 : $('#take_time').val();
			   	if (produce_time < 0) {
			   		displayMsg(ndPromptMsg, '制作时间必须大于0', 2000);
			   		return;
			   	}
			   	if(produce_type == 2) {
			   		if($('#producePrinterId').val() == '') {
			   			displayMsg(ndPromptMsg, '批量制作必须设置划菜打印机', 2000);
			   			return;
			   		}
			   	}
				var special_type=foodsType;
   				if(foodsType == "1") {
   					isStore = "0"; isOrder = "1"; isTakeout = "0"; isPack = "1";
   				} else if(foodsType == "2") {
   		   			isStore = "0"; isOrder = "0"; isTakeout = "1"; isPack = "1";
   		   		} else if(foodsType == "3" || foodsType == "11" || foodsType == "12" || foodsType == "13") {
   		   			isStore = "0"; isOrder = "0"; isTakeout = "1"; isPack = "0";
   		   		} else if(foodsType == "4") {
   		   			isStore = "1"; isOrder = "0"; isTakeout = "0"; isPack = "0";
   		   		} else if(foodsType == "5") {
   		   			isStore = "1"; isOrder = "1"; isTakeout = "1"; isPack = "1";
   		   		} else {
   			   		// isShop = $("#sell-sites input[name='shopSell']").is(':checked') ? "1" : "0";
   			   		isStore = $("#order-type input[name='sell']").is(':checked') ? "1" : "0";
   				    isOrder = $("#order-type input[name='shop']").is(':checked') ? "1" : "0";
   				    isTakeout = $("#order-type input[name='takeout']").is(':checked') ? "1" : "0";
   					isPack = $("#order-type input[name='pack']").is(':checked') ? "1" : "0";
   		   		}

   		   		var orderL = $('#order-type .fendian').not(".hide").length;
   		   		if(orderL == 1) {
   		   			$("#order-type div[data-shop]").hasClass('hide')? isOrder = '0' : isOrder = '1';
   		   			$('#order-type div[data-takeout]').hasClass('hide')? isTakeout = '0': isTakeout= '1';
   		   			$('#order-type div[data-pack').hasClass('hide')? isPack = '0' : isPack = '1';
   		   			$('#order-type div[data-sell]').hasClass('hide')? isStore = '0' : isStore = '1';
   		   		}
   		   		//菜品口味
				if (menuFlavor == '') {
					menuFlav = '';
				} else {
					for (var i = 0;i<menuFlavorArry.length;i++) {
						if (menuFlavorArry[i] == '') {
							continue;
						} else {
							menuFlav[flavorNum] = menuFlavorArry[i].replace(/[ ]/g,"");
							//flavorArray[flavorNum] = JSON.stringify(menuFlav);
							flavorNum++;
						}
					}
				}
				//菜品备注
				if (menuNote == '') {
					menuNo = '';
				} else {
					for (var k = 0;k<menuNoteArry.length;k++) {
						if (menuNoteArry[k] == '') {
							continue;
						} else {
							menuNo[noteNUm] = menuNoteArry[k].replace(/[ ]/g,"");
							//noteArray[noteNUm] = JSON.stringify(menuNo);
							noteNUm++;
						}
					}
				}
				//菜品标签
				if (menuByname == '') {
					menuBy = '';
				} else {
					for (var h = 0;h<menuBynameArry.length;h++) {
						if (menuBynameArry[h] == '') {
							continue;
						} else {
							menuBy[bynameNum] = menuBynameArry[h].replace(/[ ]/g,"");
							//noteArray[noteNUm] = JSON.stringify(menuNo);
							bynameNum++;
						}
					}
				}
			
				
				// 菜品单位
				var menuUnit = $('#menuUnit').val();
				if (menuUnit == '') {
					menuUnit = '份';
				}

				if (this.dataCheck()) {
			   	//条形码验证
			   	var scanCode = $('#scanCode').val();
			   	var exp = /^20\d{4}$/;
			   	if(scanCode != "") {
			   		if(!exp.test(scanCode)) {
			   			displayMsg(ndPromptMsg, '条形码格式不正确', 2000);
			   			return;
			   		}
			   	}

			   	// 下单数据类型无选中
			   	var typeLength = 0;
			   	$('#order-type input[type="checkbox"]').each(function(i) {
			   		if($(this).is(':checked')) {
			   			typeLength += 1;
			   		}
			   	})
			   	if(typeLength == 0 && (foodsType == 0 || foodsType == 6 || foodsType == 7 || foodsType == 8)) {
			   		displayMsg($('#prompt-message'), '请勾选下单类型', 3000);
			   		return;
			   	}

			   	//制作时间和制作类型
			   	var produce_type = $('#take_type input[name="takeType"]:checked').val();
			   	var produce_time = $('#take_time').val() == '' ? 0 : $('#take_time').val();
			   	if (produce_time < 0) {
			   		displayMsg(ndPromptMsg, '制作时间必须大于0', 2000);
			   		return;
			   	}


			   	if(produce_type == 2) {
			   		if($('#producePrinterId').val() == '') {
			   			displayMsg(ndPromptMsg, '批量制作必须设置划菜打印机', 2000);
			   			return;
			   		}
			   	}
			   	//标签打印机
			   	var tag_printer_id = $("#tagPrinterId").val();
			   	//状态
			   	var menustatus = $("#menuStatus").val();
			   	if(!menustatus){
			   		menustatus = 0;
			   	}	
			   	 // 菜品价格列表
	            var menupricelist = [];
	            for(var i in menu_price_list){
	            	delete menu_price_list[i].price_id;
	            	for(var key in menu_price_list[i]){
						if(key == 'hour_time' || key == 'week_day'){
							if(isArray(menu_price_list[i][key])){
								menu_price_list[i][key] = menu_price_list[i][key].toString();
							}
						}
					}
	            	menupricelist.push(menu_price_list[i]);
	            }                
	            // 会员价列表
	            var memberpricelist = [];  
				for(var i in member_price_list){
					delete member_price_list[i].price_id;
					for(var key in member_price_list[i]){
						if(key == 'hour_time' || key == 'week_day'){
							if(isArray(member_price_list[i][key])){
								member_price_list[i][key] = member_price_list[i][key].toString();
							}
						}
					}
					memberpricelist.push(member_price_list[i]);
				}
			   
			   	$("#form").ajaxSubmit({
	                    type: 'post',
	                    data: {
			                'menu_flavor': menuFlav,
			                'menu_note': menuNo,
			                'menu_unit': menuUnit,
			                'flavor_num': flavorNum - 1,
			                'note_count': noteNUm - 1,
							'menu_scope': menuScope,
							'menu_status': menustatus,
							'menu_price_list': menupricelist,
							'member_price_list': memberpricelist,
							'is_set_menu':'0',
							'list_style':list_style,							
							'sale_shop_id':"all",
							'sale_commission':sale_commission,
							'is_store': isStore,
							'is_order': isOrder,
							'is_takeout': isTakeout,
							'is_pack': isPack,
							'menu_byname': menuBy,
							'barcode': scanCode,
							'produce_type': produce_type,
							'produce_time': produce_time,
							'is_discount':is_discount, 
							'is_give':is_give,
			 				'is_half':is_half,
			   				'is_input':is_input,
					   		'jardiniere_printer_id':jardiniere_printer_id,
			   				'produce_printer_id':produce_printer_id,
			   				'printer_id':printer_id,
			   				'tag_printer_id':tag_printer_id,
			   				'pass_printer_id':pass_printer_id,
			   				'menu_attribute_id':menu_attribute_id,
			   		 		'menu_did':menu_did,
			   		 		'menu_id':menu_id,
			   				'menu_info':menu_info,	
							'menu_name':menu_name,
							'menu_type_id':menu_type_id,
							'pass_printer_name':pass_printer_name,
							'printer_name':	printer_name,
							'special_type':special_type,
							'consume_materiel_list': material_deduction // 物料消耗数组
			            },
	                    xhrFields:{withCredentials:true},
	                    url: AdminUrl.menuMenuUpdate,
	                    success: function (respnoseText) {
	                        //respnoseText = JSON.parse(respnoseText);
	                        //console.log(respnoseText);
	                        var data = respnoseText.data;
	                        if (respnoseText.code == 20) {
	                            displayMsgTime($('#prompt-message'), respnoseText.message, 2000, function () {
	                            	//alert('ddd');
	                                //layer.close(layerBox);
	                                window.location.replace('dishesManage.html?is_select=1&type='+getQueryString('type'));
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
			},

			// 请求正常的属性列表
			propertyData: function () {
				var self = this;
                setAjax(AdminUrl.menuMenuAttributeList, {}, $('#prompt-message'), {20: ''}, function(respnoseText) {
					// 得到返回数据
                    var data = respnoseText.data;
                    // 显示数据
                    self.propertyDataList(data);
                }, 0);
			},
			// 请求所有的属性列表，包括正常、估清、下架
			propertyDataTwo: function () {
				var self = this;
	            setAjax(AdminUrl.menuAllMenuAttributeList, {}, $('#prompt-message'), {20: ''}, function(respnoseText) {
					// 得到返回数据
	                var data = respnoseText.data;
	                // 显示数据
	                self.propertyDataList(data);
	            }, 0);
			},
			// 显示属性数据
			propertyDataList: function (data) {
				var content = '<option value="">不设置菜品属性</option>';
				
				for (var i in data) {
					content += '<option value="'+data[i].menu_attribute_id+'">'+data[i].menu_attribute+'</option>';
				}

				$('#propertyContent').html(content);
				// 如果是修改的话，把修改传过来的数据选中属性
				if (addIsUp == 1) {
					// 菜品属性
					$('#propertyContent').val(dataPro.menu_attribute_id);
				}
			},
			// 请求正常的分类列表
			disCategoryData: function () {
				var self = this;
                setAjax(AdminUrl.menuMenuTypeList, {}, $('#prompt-message'), {20: ''}, function(respnoseText) {
					// 得到返回数据
                    var data = respnoseText.data;
                    // 显示数据
                    self.disCategoryList(data);
                }, 0);
			},

			// 请求所有的分类列表，包括正常、估清、下架
			disCategoryDataTwo: function () {
				var self = this;
                setAjax(AdminUrl.menuAllMenuTypeList, {}, $('#prompt-message'), {20: ''}, function(respnoseText) {
					// 得到返回数据
                    var data = respnoseText.data;
                    // 显示数据
                    self.disCategoryList(data);
                }, 0);
			},

			// 显示分类数据
			disCategoryList: function (data) {
				var content = '';

				for (var i in data) {
					content += '<option value="'+data[i].menu_type_id+'">'+data[i].menu_type+'</option>';
				}

				$('#disCategoryTbodys').html(content);
				// 如果是修改的话，把修改传过来的数据选中分类
				if (addIsUp == 1) {
					// 菜品分类
					$('#disCategoryTbodys').val(dataPro.menu_type_id);
				}
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
				// 添加到页面中 打印机设置
				// $('#printLisTbodys').html(content + matchPrinters);
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
				// 如果是修改的话，把修改传过来的数据选中打印机
				if (addIsUp == 1) {
					// 打印机设置
					$('#printLisTbodys').val(dataPro.printer_id);
					// 传菜打印机设置
					$('#passPrinterId').val(dataPro.pass_printer_id);
					// 标签打印机
					$('#tagPrinterId').val(dataPro.tag_printer_id);
					// 配菜打印机
					$('#matchPrinter').val(dataPro.jardiniere_printer_id);
					// 划菜打印机
					$('#producePrinterId').val(dataPro.produce_printer_id)
				}
			},
			// 效验要修改的数据
			dataCheck: function () {
	            if ( dataTest('#menuName', '#prompt-message', { 'empty': '不能为空'})) { 
		           return true;	            	
	            }
	            return false;
			},
			//添加售卖地点设置显示
			showMessage: function() {
				var msg = Cache.get('getMessage');
				// var msg = {"is_shop_order": 0, "is_shop_takeout": 0, "is_shop_pack": 0, "is_store_order": 1, "is_store_takeout": 0,"is_store_pack": 1}
				var shopOrder = msg.is_shop_order,
					shopTake = msg.is_shop_takeout,
					shopPack = msg.is_shop_pack,
					storeTake = msg.is_store_takeout;
				if(Number(storeTake) == 0) {
					$('#order-type div[data-sell]').addClass('hide');
				}
				if(Number(shopOrder) == 0) {
					$("#order-type div[data-shop]").addClass('hide');
				}
				if(Number(shopTake) == 0) {
					$('#order-type div[data-takeout]').addClass('hide');
				}
				if(Number(shopPack) == 0) {
					$('#order-type div[data-pack').addClass('hide');
				}
				var orderL = $('#order-type .fendian').not(".hide").length;
				if(orderL == 1) {
					$('.clearfix[data-type="order-type"]').addClass('hide');
				}

				//是否特定商品显示设置
				
				if(shopOrder == '0') $('#foodsType option[value="1"]').addClass('hide');
				if(shopTake == '0' && shopPack == '0' && storeTake == '0') 
					$('#foodsType option[value=5]').addClass('hide');

				// 下面代码注释掉是因为，原本是想要改成不支持外卖 并且 不支持外卖平台才隐藏外卖餐包和外卖配送费，问过刘总，又改成不管外卖支不支持都可以添加外卖餐包和外卖配送费，所以注释掉
				/*if(shopTake == '0') {
					$('#foodsType option[value="2"]').addClass('hide');
					$('#foodsType option[value="3"]').addClass('hide');
				}*/
				if(storeTake == '0') {
					$('#foodsType option[value="4"]').addClass('hide');
				}
			},
            packOut: function() {
                setAjax(AdminUrl.special, {"special_type": '5'}, $('#prompt-message'), {20: ''}, function(respnoseText) {
					// 得到返回数据
                    var data = respnoseText.data;
                    //data = {"1":{"menu_id": "123", "menu_name": "无"}, "2": {"menu_id": "145", "menu_name": "打包盒0.5元"}, "3": {"menu_id": "dd", "menu_name": "打包盒1元"}};
                    var html = '<option value="">无</option>';
                    for(var i in data) {
                    	html+= '<option value=' + data[i].menu_id + '>' + data[i].menu_name + '</option>'
                    }
                    $('#packbox').html(html);
                    if(addIsUp == 1) {
                    	//打包盒id
                    	if(dataPro.pack_id) {
                    		$('#packbox').val(dataPro.pack_id);
                    	} else {
                    		$('#packbox').val("");
                    	}
                    }
                }, 0);
            },
            // 点击"选择物料消耗"弹出层里面的“添加项”，添加一项
            // type 1 点击添加项 2 点击编辑过来的展示数据
            addMaterApplication: function(type) {
            	var content = '';
            	if (type == 1) {
	            	var num = $('#add_mater_tbodys tr').length +1;
	            	content = '<tr class="total-tr" num-type="'+num+'">'+
	            					($('#add_mater_tbodys tr').length == 0 ?
			                        '<td class="td_serial_num" rowspan="1">1</td> ': '')+
			                        '<td name="td_commodity"><input class="add_mater_num" type="text" placeholder="填写编号"></td>'+
			                        '<td name="td_unit"><input class="add_mater_norm" readonly="true" type="text" placeholder="物料名称/规格"><i class="arrow"></i></td>'+
			                        '<td class="add_mater_unit" name="td_quantity"></td>'+
			                        '<td><span><input type="button" name="delete-btn" value="删除" class="caozuo-btn delete-btn"></span></td>'+
			                    '</tr>';
			        $('#add_mater_tbodys').append(content);
		    	} else if (type == 2) {
		    		var up_num = 1;
					for (var j in material_deduction[update_ma_num].materiel_id) {
						var mete_this = materiel_list_array[material_deduction[update_ma_num].materiel_id[j]];

		            	content += '<tr class="total-tr" num-type="'+up_num+'" materiel_id="'+mete_this.materiel_id+'">'+
		            					(up_num == 1 ?
				                        '<td class="td_serial_num" rowspan="1">'+(parseFloat(update_ma_num)+1)+'</td> ': '')+
				                        '<td name="td_commodity"><input class="add_mater_num" type="text" placeholder="填写编号" value="'+mete_this.materiel_code+'"></td>'+
				                        '<td name="td_unit">'+
					                        '<input class="add_mater_norm" readonly="true" type="text" placeholder="物料名称/规格" value="'+mete_this.materiel_name+' '+mete_this.specification_quantity + mete_this.specification_name+'" specification_quantity="'+mete_this.specification_quantity+'" specification_name="'+mete_this.specification_name+'">'+
					                        '<i class="arrow"></i>'+
				                        '</td>'+
				                        '<td class="add_mater_unit" name="td_quantity" unit_id="'+mete_this.unit_id+'">'+mete_this.unit_list[mete_this.unit_id].unit_name+'</td>'+
				                        '<td><span><input type="button" name="delete-btn" value="删除" class="caozuo-btn delete-btn"></span></td>'+
				                    '</tr>';
				        up_num++;
					}
					$('#add_mater_tbodys').html(content);
		    	}

		        $('#add_mater_tbodys tr').eq(0).find('td').eq(0).attr('rowspan', $('#add_mater_tbodys tr').length);
            },

            // 获取物料分类数据 fn 回调函数
			category_ajax_list:function (fn) {
			    setAjax(AdminUrl.materielCategoryList, {}, $('#prompt-message'), { 20: '' }, function(respnoseText) {
			        if (respnoseText.code == 20) {
			            fn(respnoseText.data);
			        } else {
		            	// 如果在执行报错之前有报错，就延迟两秒在执行这个报错
		            	if (layerStrip) {
		            		setTimeout(function () {
		            			displayMsgTime(ndPromptMsg, respnoseText.message, 2000);
		            		}, 2000);
		            	} else {
		                	displayMsgTime(ndPromptMsg, respnoseText.message, 2000);
		            	}
			        }
			    }, 0);
			},

			// 主页面 表格内容生成
			renderTable:function() {
				// 消耗数量和消耗单位
				var deplete_num_cost = $('#deplete_num_cost').val();
				var deplete_num_id = $('#deplete_num_unit').val();
				var deplete_num_name = $('#deplete_num_unit option:checked').text();

				var handle_num = 0;
				// 处理如果 消耗物料数据序号的递增和修改指定序号
				if (update_ma_num == '') {
					if (JSON.stringify(material_deduction) == '{}') {
						handle_num = 0;
					} else {
						material_num = material_num + 1;
						handle_num = material_num;
					}
				} else {
					handle_num = update_ma_num;
				}

				// 存储到数组中
				material_deduction[handle_num] = {};

				// 消耗单位：最小单位id和规格
				material_deduction[handle_num]['unit_id'] = deplete_num_id == undefined ? '' : deplete_num_id;
				// material_deduction[handle_num]['unit_name'] = deplete_num_name;
				// 消耗数量：最小单位消耗时必须为整数，规格消耗时可以为小数
				material_deduction[handle_num]['consume_quantity'] = parseFloat(deplete_num_cost).toFixed(2);
				// 物料数组
				material_deduction[handle_num]['materiel_id'] = {};

				var mete_num = 0;

				$("#add_mater_tbodys tr").each(function(){
					var materiel_id = $(this).attr('materiel_id');
					if (materiel_id) {
						material_deduction[handle_num]['materiel_id'][mete_num] = materiel_id;
						mete_num++;
					}
				});

				// console.log(material_deduction)

				// 加载页面物料消耗数据
				this.meteral_loading_data();
			},

			// 加载页面物料消耗数据
			meteral_loading_data: function () {
				var content_main = '';
				var content = '';
				var serial = 1;
				for (var i in material_deduction) {
					content = '';
					var rowspan_num = 0;
					for (var j in material_deduction[i].materiel_id) {
						rowspan_num++;
					}

					var content_num = 1;
					for (var j in material_deduction[i].materiel_id) {
						var mete_this = materiel_list_array[material_deduction[i].materiel_id[j]];
						// 如果找不到，说明物料被禁用，所有不显示禁用的，在提交的时候不提交禁用的
						if (mete_this == undefined) {
							delete material_deduction[i].materiel_id[j];
							if (material_deduction[i].materiel_id == '') {
								material_deduction[i] = {};
							}
							continue;
						}
						if (content_num == 1) {
							content += '<tr class="total-tr" data-type="in" num="'+i+'">'+
		                                   	'<td rowspan="'+rowspan_num+'" class="td_serial_num">'+serial+'</td>'+
		                                    '<td class="report_text">'+mete_this.materiel_name+mete_this.specification_quantity+mete_this.specification_name+'</td>'+
		                                    '<td rowspan="'+rowspan_num+'">'+material_deduction[i].consume_quantity+'</td>'+
		                                    '<td rowspan="'+rowspan_num+'">'+(material_deduction[i].unit_id == '' ? mete_this.specification_name : mete_this.unit_list[mete_this.unit_id].unit_name)+'</td>'+
		                                    '<td rowspan="'+rowspan_num+'">'+
		                                        '<span><input type="button" data-type="update" value="编辑" class="caozuo-btn"></span>'+
		                                        '<span><input type="button" data-type="delete" name="delete-btn" value="删除" class="caozuo-btn delete-btn"></span>'+
		                                    '</td>'+
		                                '</tr>';
		                } else {
							content += '<tr class="total-tr" num="'+i+'">'+
		                                    '<td class="report_text">'+mete_this.materiel_name+mete_this.specification_quantity+mete_this.specification_name+'</td>'+
		                                '</tr>';
		                }
		                content_num++;
                    }
                    serial++;
                    content_main += content;
				}
				$('#material_deduction').html(content_main);

				// 绑定编辑删除事件
				this.meteral_bind();
			},

			// 绑定编辑删除事件
			meteral_bind: function () {
				var _self = this;
		        // 页面上物料列表点击删除按钮
		        $('#material_deduction').find('tr[data-type="in"]').each(function () {
		        	var self = this;
		        	var m_num = $(this).attr('num');
		        	$(this).find('input[data-type="update"]').unbind('click').bind('click', function () {
		        		// 编辑消耗物料数据序号标识赋值
		        		update_ma_num = m_num;
		        		// 编辑物料消耗并弹出层显示加载数据
		        		_self.update_ma_headle();
		        	});
		        	$(this).find('input[data-type="delete"]').unbind('click').bind('click', function () {
		        		$('#material_deduction').find('tr[num="'+m_num+'"]').remove();
		        		// 页面数据序号重新排序
			            var num = 1;
			            $("#material_deduction tr").each(function() {
			                $(this).find('.td_serial_num').text(num);
			                $(this).attr('num-type', num);
			                num++;
			            });
			            delete material_deduction[m_num];
			            material_num = material_num - 1;
			            // 如果删除完了就隐藏页面物料
			            if ($('#material_deduction tr').length == 0) {
			            	$('#mater_table table').addClass('hide');
			            }
		        	});
		        });
			},

			// 编辑物料消耗并弹出层显示加载数据
			update_ma_headle: function () {
	    		$('#select_mater_deplete').removeClass('hide');
        		displayAlertMessage('#select_mater_deplete', '#select_close');

        		// 显示物料数据
        		this.addMaterApplication(2);
				// 消耗数量，消耗单位填充
				$('#deplete_num_cost').val(material_deduction[update_ma_num].consume_quantity);
        		// 处理物料规格和基本计量单位数组
        		this.handle_mater_tbody();
        		$('#deplete_num_unit').val(material_deduction[update_ma_num].unit_id);
			},

			// 展示弹出层分类数据
			/*
			    categoryData：分类数据
			    btn：弹出层id
			    exit：弹出层右上角叉号id
			    html_t：填充页面的id
			*/
			category_dialog: function (categoryData, btn, exit, html_t, type, value_id) {
			    // 打开分类弹出层
			    $(btn).removeClass('hide');
			    displayAlertMessage(btn, exit);

			    // 调用public.js里面的公共方法
			    content_cater = '';

			    // 不是0才显示“全部分类”
			    if (type != 0) {
			        var all_total = '全部分类';
			        if (type == 4) {
			            all_total = '添加一级分类';
			        }
			        if (type != 3) {
			            content_cater = '<ul class="clearfix cateUl">' +
			                    '<li class="clearfix">' +
			                    '<div class="cate_list_title" data-id="" category_code="" category_name="'+all_total+'">' +
			                    '<span data-type="fold" style="background:url()"></span>'+all_total+'</div></li></ul>';
			        } else if (type == 3) {
			            content_cater = '<ul class="clearfix">'+
			                    '<li>' +
			                    '<div class="ul_title clearfix cate_list_title" data-id="" category_code="" category_name="'+all_total+'">' +
			                    '<span class="right_span" data-type="fold" style="background:url()"></span>'+all_total+'</div></li></ul>';
			        }
			    }

			    specified = {};
			    // 找到指定分类id的上级分类都有什么，用于展开分类选中指定分类
			    this.specified_categor(categoryData, value_id);

			    category_value_id = value_id;

			    var c_specified = {};

			    for (var i in specified) {
			        c_specified[specified[i]] = '1';
			    }

			    specified = dishesStackHandle(c_specified, specified);

			    c_specified = {};

			    array_me = {};
			    if (type == 3) {
			        // 自调用循环分类数据
			        this.loopIficData(categoryData, 3);
			    } else {
			        // 自调用循环分类数据
			        this.loopIficData(categoryData, 2);
			    }
			    // 填充页面
			    $(html_t).html(content_cater);

			    category_value_id = '';

			    $(html_t).find('div').each(function() {
			        var _self = this;
			        var category_id = $(_self).attr('data-id');
			        var category_code = $(_self).attr('category_code');
			        var category_name = $(_self).attr('category_name');

			        // 处理列表点击折叠展开、选中事件
			        $(_self).unbind('click').bind('click', function(eve) {
			            // 没有这个样式说明没展开，就展开curCheck就把加号变成减号
			            if (!$(_self).hasClass('curCheck')) {
			                // 关闭非当前的展开
			                $(_self).parent().parent().siblings('ul').find('ul').addClass('hide');
			                $(_self).parent().parent().siblings('ul').find('div').removeClass('curCheck');
			                // 展开当前
			                $(_self).siblings('ul').removeClass('hide');
			                $(_self).addClass('curCheck');
			            } else {
			                $(_self).removeClass('curCheck');
			                $(_self).siblings('ul').addClass('hide');
			            }
			            // 给当前加上选中样式 cateSelected
			            if (!$(_self).hasClass('cateSelected')) {
			                $(html_t).find('div').each(function() {
			                    $(this).removeClass('cateSelected');
			                });
			                $(_self).addClass('cateSelected');
			            }
			        });
			    });
			},

			// 找到指定分类id的上级分类都有什么，用于展开分类选中指定分类
			specified_categor: function (data, category_id) {
				var self = this;
			    for (var i in data) {
			        if (data[i].category_id == category_id) {
			            specified = dishesStackHandle(data[i].parent_list, specified);
			        }
			        if (data[i].children != '') {
			            self.specified_categor(data[i].children, category_id);
			        }
			    }
			},

			// 物料分类公共处理方法 type 1列表 2弹出层 3
			loopIficData: function (data, type, category_name) {
				var self = this;
			    var class_c = '';
			    var class_sty = '';
			    var is_t = '';
			    var type2_class = '';
			    var type_class = '';
			    var type_c = '';
			    for (var i in data) {
			        // 层级存到数组
			        if (data[i].parent_category == 'cccccccccccc') {
			            array_me[data[i].category_id] = 1;
			        } else {
			            array_me[data[i].category_id] = array_me[data[i].parent_category] + 1;
			        }

			        class_c = '';
			        if (data[i].parent_category == 'cccccccccccc') {
			            if (type == 1) {
			                class_c = 'top_ul';
			            }
			            is_t = '';
			            type2_class = 'background:url()';
			            if (data[i].children != '') {
			                is_t = '+';
			                type2_class = '';
			            }
			        } else {
			            if (data[i].children != '') {
			                is_t = '+';
			                type2_class = '';
			            } else {
			                is_t = '';
			                type2_class = 'background:url()';
			            }
			            class_c = ' hide';
			        }

			        // 修改过来的展开父级，选中当前级
			        if (specified != '' && specified[data[i].category_id] == 1) {
			            class_c = class_c == ' hide' ? '' : class_c;
			            if (data[i].category_id != category_value_id) {
			                type_class = ' curCheck';
			            }
			        } else {
			            type_class = '';
			        }
			        if (data[i].category_id == category_value_id) {
			            type_c = ' cateSelected';
			        } else {
			            type_c = '';
			        }


			        // 根据数组中层级展示不同间隔
			        if (type == 1) {
			            class_sty = 'text-indent: ' + array_me[data[i].category_id] * 30 + 'px;';
			        } else {
			            if (array_me[data[i].category_id] != 1) {
			                class_sty = 'padding-left: ' + array_me[data[i].category_id] * 20 + 'px;;width:'+(100+array_me[data[i].category_id] * 5)+'%;';
			            } else {
			                class_sty = '';
			            }
			        }


			        if (type == 1) {
			            content_cater += '<ul class="' + class_c + '" data-type="">' +
			                '<li>' +
			                '<div data-id="' + data[i].category_id + '" category_code="' + data[i].category_code + '" category_name="' + data[i].category_name + '" parent_name="' + category_name + '" parent_category="' + data[i].parent_category + '" children="' + data[i].children + '">' +
			                '<span class="left_span">' +
			                '<input class="caozuo-btn" type="button" data-type="cate_update" value="编辑">' +
			                '<input class="caozuo-btn delete-btn" data-type="cate_del" type="button" value="删除">' +
			                '</span>' +
			                '<span class="right_span" data-type="fold" style="' + class_sty + '"><i>' + is_t + '</i>' + data[i].category_name + '</span>' +
			                '</div>';
			        } else if (type == 2) {
			            content_cater += '<ul class="clearfix cateUl' + class_c + '">' +
			                '<li class="clearfix">' +
			                '<div class="cate_list_title'+type_class+type_c+'" style="' + class_sty + '" data-id="' + data[i].category_id + '" category_code="' + data[i].category_code + '" category_name="' + data[i].category_name + '">' +
			                '<span data-type="fold" style="'+type2_class+'"></span>' + data[i].category_name +
			                '</div>';
			        } else if (type == 3) {
			            content_cater += '<ul class="clearfix ' + class_c + '">' +
			                '<li>' +
			                '<div class="ul_title clearfix cate_list_title'+type_class+type_c+'" style="' + class_sty + '" data-id="' + data[i].category_id + '" category_code="' + data[i].category_code + '" category_name="' + data[i].category_name + '">' +
			                '<span class="right_span" data-type="fold" style="'+type2_class+'"></span>' + data[i].category_name + '' +
			                '</div>';
			        }


			        if (data[i].children != '') {
			            self.loopIficData(data[i].children, type, data[i].category_name);
			        }
			        content_cater += '</li></ul>';
			    }
			},


			//可用物料列表展示
		    //keyword //物料编号 //用来选中
		    //category_id 分类id
		    //keywordSearch 搜索的时候物料编号 //用来展示
		    //type 1 初始化物料数据赋值，其他是操作用的
		    depotMaterielListShow:function (keyword, category_id, type, fn, list) {
		    	var self = this;
		        setAjax(AdminUrl.materielMaterielList, {
                    'keyword': keyword,
                    'category_id': category_id,
                    'list': list,
                    'page': 1
		        }, $('#prompt-message'), { 20: '' }, function(respnoseText) {
		            if (respnoseText.code == 20) {
		            	if (type == 1) {
		            		// 合并物料数据
		            		self.merge_data(respnoseText.data.list);
		            		fn();
		            	} else {
			                var data = respnoseText.data.list;
			                // 赋值中间变量
			                materiel_middle = respnoseText.data.list;
			                self.materielListData(data, keyword, '');
		            	}
		            } else {
		            	// 如果在执行报错之前有报错，就延迟两秒在执行这个报错
		            	if (layerStrip) {
		            		setTimeout(function () {
		            			displayMsgTime(ndPromptMsg, respnoseText.message, 2000);
		            		}, 2000);
		            	} else {
		                	displayMsgTime(ndPromptMsg, respnoseText.message, 2000);
		            	}
		            }
		        }, 0);
		    },

		    // 显示物料列表数据
		   	materielListData: function (data, keyword, keywordSearch) {
		   		var self = this;
		        var content = '';
		        var cur = '';
		        var gray_class = '';
		        var contentList = {};
		        keyword = (keyword == undefined) ? '' : keyword;
		        keywordSearch = (keywordSearch == undefined) ? '' : keywordSearch;
		        for (var i in data) {
		            cur = data[i].materiel_code == keyword ? 'cur' : '';

	                // 无分类id时如果是搜索只有对应的显示，不是搜索当前分类全部显示对应选中
	                if (keywordSearch != '' && keywordSearch != data[i].materiel_code) {
	                    content += '';
	                } else {
	                    contentList = data[i];

	                    var is_false = self.loop_materiel_id(data[i].materiel_id);

	                    // 如果没有一样的物料消耗单位就不能点击 或者 是相同的物料不能添加
	                    if (
	                    	(is_mat_sele == 1 && $('#add_mater_tbodys tr').length != 1 &&
	                    	
	                    	(JSON.stringify(consume_company) != '{}' && 
	                    		(
	                    		(
	                    		consume_company[0] && consume_company[0].unit_name != data[i].unit_list[data[i].unit_id].unit_name &&
	                    		consume_company[1] && consume_company[1].specification_name != data[i].specification_name
	                    		) ||
	                    		(!consume_company[0] && consume_company[1] && consume_company[1].specification_name != data[i].specification_name) || 
	                    		(!consume_company[1] && consume_company[0] && consume_company[0].unit_name != data[i].unit_list[data[i].unit_id].unit_name) 
	                    		)
	                    	) 
	                    	
	                    	)|| is_false == true
	                    	) {
	                    	gray_class = ' color_gray';
	                    } else {
	                    	gray_class = '';
	                    }

	                    content += '<tr class="total-tr ' + cur +gray_class+ '" materiel_list = \'' + JSON.stringify(data[i]) + '\'>' +
	                        '<td>' + data[i].materiel_code + '</td>' +
	                        '<td>' + data[i].materiel_py + '</td>' +
	                        '<td class="report_text">' + data[i].materiel_name + '</td>' +
	                        '<td>' + data[i].unit_list[data[i].unit_id].unit_name + '</td>' +
	                        '<td>' + data[i].specification_quantity + data[i].specification_name + '</td>' +
	                        '</tr>';
	                }
		        }
		        $('#material_list').html(content);
		   	},

		   	// 循环判断是否存在某个物料id
		   	loop_materiel_id: function (materiel_id) {
		   		var is_true = 0;
		   		for (var i in material_deduction) {
		   			for (var j in material_deduction[i].materiel_id) {
			   			if (material_deduction[i].materiel_id[j] == materiel_id) {
			   				is_true = 1;
			   				// return true;
			   			}
		   			}
		   		}
		   		if (is_true == 0) {
					$("#add_mater_tbodys tr").each(function(){
						var id = $(this).attr('materiel_id');
						if (id == materiel_id) {
							is_true = 1;
						}
					});
				}
				if (is_true == 1) {
					return true;
				} else {
		   			return false;
		   		}
		   	},

		   	// 合并物料数据（因为物料数据有分页所以需要合并）
		   	merge_data: function (data) {
		   		for (var i in data) {
		   			if (JSON.stringify(materiel_list_array) == '{}' || materiel_list_array[i] == undefined) {
		   				materiel_list_array[i] = {};
		   				materiel_list_array[i] = dishesStackHandle(data[i], materiel_list_array[i]);
		   			}
		   		}
		   		
		   	}
		}

		DishesManageAdd.init();
});

