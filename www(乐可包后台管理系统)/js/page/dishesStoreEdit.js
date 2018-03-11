$(function () {
	// 菜品库门店修改
		// 消耗单位数组，用于处理哪个单位的可选择（规格、计量单位），这个数组最大只有两条数据
		var consume_company = {};	     
        // 获取到修改传过来的menu_id
		var menuId = getQueryString('menu_id');
		// 获取到修改传过来的缓存
		var dataPro = Cache.get('disUp');		
		// 判断是修改还是添加 0；添加，1：修改
		var addIsUp = 1;
		// 菜品状态
		var menuStatusPro = '';
		// 列表修改传过来的门店ID
		var sale_shop_id = '';
		
		var sale_shop_name = '';

		var list_style = 0;
		
		var menu_name;
		// 价格策略列表
		var menu_price_list = {};
		// 价格策略列表
		var member_price_list = {};
		//总部 价格策略列表
		var father_menu_price_list = {};
		//总部 会员价格策略列表
		var father_member_price_list = {};
		//获取cookie值
		var databus = new Object();
		var DishesManageAdd = {

			init: function () {
				var self = this;

				// 判断是修改还是显示
				if (menuId != null && menuId != undefined && dataPro != null && dataPro != undefined) {
					addIsUp = 1;
					menuStatusPro = dataPro.menu_status;					
					sale_shop_id = dataPro.sale_shop_id;					
					// 修改显示状态
					$('#disDisplay').removeClass('hide');
					
					this.DishesData(dataPro);
				}
				// 获取到打印机填充到页面
				this.PrintData();
				// 显示所有店铺数据，调用public.js中公用的方法
				this.shopData();				
				//打包盒
				// this.packOut();
				// 绑定点击事件
				this.DishesAddBind();
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
					for(var key in data){
						if(data[key].shop_id == dataPro.shopName){
							sale_shop_name = data[key].shop_name;
						}
					}
					$('#addAndedit').text(sale_shop_name+'>>菜品修改');						
                }, 0);
			},
			// 判断字符串长度
			getChars: function(str) {  

		        var i       = 0;  
		        var c       = 0.0;  
		        var unicode = 0;  
		        var len     = 0;  
		      
		        if (str == null || str == "") {  
		            return 0;  
		        }  
		        len = str.length;  
		        for(i = 0; i < len; i++) {  
		            unicode = str.charCodeAt(i);  
		            if (unicode < 127 && unicode != 94) { //判断是单字符还是双字符  
		                c += 1;  
		            } else {  //chinese  
		                c += 2;  
		            }  
		        }  
		        return c;  
		    },
			// 数据验证
			validData: function(){
				var menu_name = $("input[name='selName']:checked").val();//菜品名称
				var menuName = $("#menuName").val();
				if(menu_name == 1){
					if(menuName == ""){
						alert("菜品名称不能为空")
						return false;
					}
					if(getChars(menuName) > 10){
						displayMsg($('#prompt-message'), '菜品名称超过10个汉字', 3000);
						return false;
					}
				}
				var foods_type = $("input[name='special_type_radio']:checked").val();//特定商品
				var foodsType = $("#foodsType").val();
				if(foods_type == 1 && foodsType == ""){
					displayMsg($('#prompt-message'), '请选择特定商品', 3000);
					return false;
				}
				var take_type = $("input[name='takeType_radio']:checked").val();//制作类型
				var takeType = $("#takeType").val();
				if(take_type == 1 && takeType == ""){
					displayMsg($('#prompt-message'), '请选择制作类型', 3000);
					return false;
				}
				var is_discount_radio = $("input[name='is_discount_radio']:checked").val();//打折
				var is_discount= $("#isDiscount").val();
				if(is_discount_radio == 1 && is_discount == ""){
					displayMsg($('#prompt-message'), '请选择打折', 3000);
					return false;
				}
				var is_give = $("input[name='is_give_radio']:checked").val();//赠菜
				var isGive = $("#isGive").val();
				if(is_give == 1 && isGive == ""){
					displayMsg($('#prompt-message'), '请选择赠菜', 3000);
					return false;
				}
				var sale_commission_radio = $("input[name='sale_commission_radio']:checked").val();//赠菜
				var sale_commission = $("#sale_commission").val();
				if(sale_commission_radio == 1 ){
					if($("#sale_commission").val() != ''){
						if(!check_sale(sale_commission)){
							return;
						}
					}			
					
				}
				return true;
				// var menu_printer = $("input[name='menu_printer']:checked").val();//打印机
				// var matchPrinter = $("#matchPrinter").val();//配菜打印机
				// var printLisTbodys = $("#printLisTbodys").val();//生产打印机
				// var passPrinterId = $("#passPrinterId").val();//传菜打印机
				// var producePrinterId = $("#producePrinterId").val();//划菜打印机
				// if(menu_printer == 1){
				// 	if(matchPrinter == ""){
				// 		displayMsg($('#prompt-message'), '请选择配菜打印机', 3000);
				// 		return false;
				// 	}
				// 	if(printLisTbodys == ""){
				// 		displayMsg($('#prompt-message'), '请选择生产打印机', 3000);
				// 		return false;
				// 	}
				// 	if(passPrinterId == ""){
				// 		displayMsg($('#prompt-message'), '请选择传菜打印机', 3000);
				// 		return false;
				// 	}
				// 	if(producePrinterId == ""){
				// 		displayMsg($('#prompt-message'), '请选择划菜打印机', 3000);
				// 		return false;
				// 	}
				// }
			},
			//判断是否引用总部true为引用false为自定义
			isFather: function(obj){
				// 假如有span的话，表示有自定义
				if(typeof(obj) == 'string'){
					if(obj.indexOf('</span>') != -1){
						return false;
					}else{
						return true;
					}
				}else{
					return true;
				}
			},
			//判断是否引用总部true为引用false为自定义
			isText: function(obj){
				var content = obj;
				// 假如有span的话，表示有自定义，那么把span去掉
				if(typeof(obj) == 'string'){
					if(obj.indexOf('</span>') != -1){
						content = obj.substr(obj.indexOf('</span>')+7);
					}
				}	
				return content;
			},
			//str是判断内容，className为class
			setRadio: function(str,className){
				
				if(this.isFather(str)){					
					$("input[class='"+ className +"'][value='沿用总部']").prop('checked',true);
				}else{					
					$("input[class='"+ className +"'][value='自定义']").prop('checked',true);
				}
			},			
			// 显示基本数据
			DishesData: function (data) {
				// 从缓存中获取到cardId
				var cardId = person_get_data().card_id;	
				
				// 显示数据
				// 菜品名称
				menu_name = this.isText(data.menu_name);
				$('#menuName').val(menu_name);
				var print_tag =false;				
				//遍历data并进行初始化填充
				for(var key in data){
					databus[key] = data[key];					
					if(key == 'menu_name'){
						
						this.setRadio(data[key],'name');	
						if(this.isFather(data[key])){
							clickradio("沿用总部",$('#menuName'));
						}else{
							clickradio("自定义",$('#menuName'));
						}			
					}
					if(key == 'menu_price'){						
						this.setRadio(data[key],'menu_price');
						for(var keys in data.father_menu_price_list){
							father_menu_price_list[keys] = data.father_menu_price_list[keys];
							father_menu_price_list[keys]["all"] = "all";
							father_menu_price_list[keys]['menu_name']= menu_name;
						}
						
					}
					if(key == 'member_price'){
						
						this.setRadio(data[key],'member_price');
						for(var keys in data.father_member_price_list){
							father_member_price_list[keys] = data.father_member_price_list[keys];
							father_member_price_list[keys]["all"] = "all";
							father_member_price_list[keys]['menu_name']= menu_name;
						}
						
					}
					if(key == 'produce_type'){
						
						// 制作类型
						this.setRadio(data[key],'takeType');
						if(this.isFather(data[key])){
							clickradio("沿用总部",$('#takeType'));
						}else{
							clickradio("自定义",$('#takeType'));
							$('#takeType').val(this.isText(data[key]));
						}
					}
					if(key == 'special_type'){
						
						// 特定商品
						this.setRadio(data[key],'special_type');
						if(this.isFather(data[key])){							
							clickradio("沿用总部",$('#foodsType'));
						}else{
							clickradio("自定义",$('#foodsType'));
							$('#foodsType').val(this.isText(data[key]));
						}
					}
					if(key == 'is_discount'){
						
						// 是否打折
						this.setRadio(data[key],'is_discount');
						if(this.isFather(data[key])){
							clickradio("沿用总部",$('#isDiscount'));
						}else{
							clickradio("自定义",$('#isDiscount'));
							$('#isDiscount').val(this.isText(data[key]));
						}
					}
					if(key == 'is_give'){
						
						// 是否赠菜
						this.setRadio(data[key],'is_give');
						if(this.isFather(data[key])){
							clickradio("沿用总部",$('#isGive'));
						}else{
							clickradio("自定义",$('#isGive'));
							$('#isGive').val(this.isText(data[key]));
						}
					}
					if(key == 'sale_commission'){
						
						// 提成金额
						this.setRadio(data[key],'sale_commission');
						if(this.isFather(data[key])){
							clickradio("沿用总部",$('#sale_commission'));
						}else{
							clickradio("自定义",$('#sale_commission'));
							$('#sale_commission').val(parseFloat(this.isText(data[key])).toFixed(2));
						}
					}
					if(key == 'printer_id' || key == 'pass_printer_id' || key == 'tag_printer_id' || key == 'jardiniere_printer_id' || key == 'produce_printer_id'){
						if(print_tag){
							continue;
						}						
						this.setRadio(data[key],'printer');
						if(this.isFather(data[key])){
							print_tag =true;																						
							clickradio("沿用总部",$('#printLisTbodys'));
							clickradio("沿用总部",$('#jardiniere_printer_id'));
							clickradio("沿用总部",$('#tagPrinterId'));
							clickradio("沿用总部",$('#passPrinterId'));
							clickradio("沿用总部",$('#producePrinterId'));
						}else{	
							print_tag =true;	
							clickradio("自定义",$('#printLisTbodys'));
							clickradio("自定义",$('#jardiniere_printer_id'));
							clickradio("自定义",$('#tagPrinterId'));
							clickradio("自定义",$('#passPrinterId'));
							clickradio("自定义",$('#producePrinterId'));
						}			
					}
				}
				//把价格策复制给公共的
	            for(var i in data.menu_price_list){
	                menu_price_list[i] = dataPro.menu_price_list[i];
	                menu_price_list[i]['price_id']=i;
	                menu_price_list[i]['all']= "门店";
	                menu_price_list[i]['menu_name']= menu_name;
	            }
	            //把会员价格策复制给公共的
	            for(var i in data.member_price_list){
	                member_price_list[i] = dataPro.member_price_list[i];   
	                member_price_list[i]['price_id'] = i;
	                member_price_list[i]['all'] = "门店";
	                member_price_list[i]['menu_name']= menu_name;
	            }
	   		
	    		var all_menu_name = menu_name;
	    		if(dataPro.father_store_name != null){
	    			all_menu_name = dataPro.father_store_name;
	    		}
	            // 菜品价格 price_dataPro对数组进行填充
	            for(var i in menu_price_list){
	                $('#add_price_tbodys').append(this.new_price_data(menu_price_list[i],"门店"));
	            }  
	            //菜品会员价格price_dataPro对数组进行填充           
	            for(var j in member_price_list){
	                $('#add_memprice_tbodys').append(this.new_price_data(member_price_list[j],"门店"));                                 
	            }
				if(this.isFather(dataPro.menu_price)){
					
				}

				if(this.isFather(data.menu_price)){							
					$('#addPrice').css("background","#e4e4e4");
			    	$('#PriceContent .stores-caozuo-btn').css("background","#e4e4e4");		
	    			clickradio("沿用总部",$('#addPrice')); 
					clickradio("沿用总部",$('#PriceContent .stores-caozuo-btn'));
				}else{
					$('#addPrice').css("background","#FF8366");
			    	$('#PriceContent .stores-caozuo-btn').css("background","#FF8366");			
	    			clickradio("自定义",$('#addPrice')); 
					clickradio("自定义",$('#PriceContent .stores-caozuo-btn'));
				}

				if(this.isFather(dataPro.member_price)){
					$('#addmemberPrice').css("background","#e4e4e4");
			    	$('#PriceMemberContent .stores-caozuo-btn').css("background","#e4e4e4");		
	    			clickradio("沿用总部",$('#addmemberPrice')); 
					clickradio("沿用总部",$('#PriceMemberContent  .stores-caozuo-btn'));
				}else{	
					$('#addmemberPrice').css("background","#FF8366");
			    	$('#PriceMemberContent .stores-caozuo-btn').css("background","#FF8366");
	    			clickradio("自定义",$('#addmemberPrice')); 
					clickradio("自定义",$('#PriceMemberContent  .stores-caozuo-btn'));
				}

				
				//总部 菜品价格 price_data对数组进行填充
	            for(var k in father_menu_price_list){
	                $('#all_price_tbodys').append(this.new_price_data(father_menu_price_list[k],"all"));
	            }  
	            //总部 菜品会员价格price_data对数组进行填充           
	            for(var f in father_member_price_list){
	                $('#all_memprice_tbodys').append(this.new_price_data(father_member_price_list[f],'all'));                                 
	            }
	            //判断各个价格策略是否有内容，有则显示，没有则隐藏
				this.is_show_tbody($("#PriceContent .price-tr"),$("#PriceContent"));
				this.is_show_tbody($("#allPriceContent .price-tr"),$("#allPriceContent"));
				this.is_show_tbody($("#allPriceMemContent .price-tr"),$("#allPriceMemContent"));
				this.is_show_tbody($("#PriceMemberContent .price-tr"),$("#PriceMemberContent"));
				// $('#ticheng').val(parseFloat(0).toFixed(2))
				// $('#allTicheng').prev('input').attr('checked',true)
				// $('#ticheng').parent('span').prev('input').attr('checked',false)
				
				//店铺名称
				$('.shopName').text(data.shopName);
				// 缓存中的数据取出之后删除
				Cache.del('disUp');
			},
			//tbody为传过来的tbody，obj为需要显示或者隐藏的元素
			is_show_tbody: function(tbody,obj){
				if(tbody.length == 0){
					obj.addClass('hide');
				}else{
					obj.removeClass('hide');
				}
			},	
			//is_store:all不显示删除和修改按钮，门店 显示删除和按钮
			new_price_data: function(obj,is_store){
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
			    
			    content_str += '<tr class="price-tr dishesContent" price-id='+obj.price_id+
			    '><td class="report_text" data-type="menuName">'+ obj.menu_name +
			    '</td><td class="report_num addColor" data-type="menuPrice">￥'+obj.menu_price+
			    '</td><td class="report_text" data-type="menuType">'+price_date+
			    '</td><td class="report_text" data-type="menuType">'+price_week+
			    '</td><td class="report_text" data-type="menuType">'+hour_time+
			    '</td>'
			    if(is_store != "all"){
			    	content_str += '<td><span class="changeBtn"><input type="button" value="修改" data-type="update" class="stores-caozuo-btn"></span><span><input type="button" value="删除" data-type="delete" class="stores-caozuo-btn"></span></td>';
			    }
			    content_str += '</tr>';
			    return content_str;
			},
			//添加价格策略保存
			//type 1：表示普通价格2：表示会员价格
			//dataType update：表示修改，add表示保存
			Pricesave: function(type,dataType,price_list){
			    var price_array = {},_self=this;
			    price_array['price_type'] = type;
			    price_array['hour_time'] = "";
			    price_array['start_time']="";
			    price_array['end_time']="";
			    price_array['week_day'] = "";
			    price_array['menu_name'] = menu_name;
			    //每行的价格的标识
			    var priceId = $('#dialog_price_sava_btn').attr('price-id');   
			    var pricedate=$("#price_strategy input[name='pricedate']:checked");
			    var week_radio=$("#price_strategy input[name='week_radio']:checked");
			    var hour_radio=$("#price_strategy input[name='hour_radio']:checked"); 
			    
			    var integer   = /^[0]\d+$/;//第一位为0正则
			    var decimals   = /^(([0-9]+\d*)|([0-9]+\d*\.\d{1,2}))$/;//精确到两位小数正则
			    var PriceStrategy = $("#PriceStrategy").val();//价格
			    if(PriceStrategy == ""){       
			        displayMsg($('#prompt-message'), '价格不能为空', 3000);
			        return false;
			    }
			    if(PriceStrategy < 0){
			        displayMsg($('#prompt-message'), '价格不能小于0', 3000);
			        return false;
			    }
			    if(PriceStrategy.indexOf("+") > -1 || isNaN(PriceStrategy)){//数字带+号或者非数字类型
			        displayMsg($('#prompt-message'), '价格必须为数字类型', 3000);
			        return false;  
			    }
			    if(integer.test(PriceStrategy)){
			        displayMsg($('#prompt-message'), '价格第一位不能为0', 3000);
			        return false;      
			    }
			    price_array.menu_price = parseFloat($('#PriceStrategy').val()).toFixed(2);
			    var pricedate = $("input[name='pricedate']:checked").val();//时间选择
			    var start_data = $("#start-date").val();
			    var end_data = $("#end-date").val();
			    if(pricedate == "自定义"){
			        if(start_data == ""){

			            displayMsg($('#prompt-message'), '开始时间不能为空', 3000);
			            return false;  
			        }
			        if(end_data == ""){           
			            displayMsg($('#prompt-message'), '结束时间不能为空', 3000);
			            return false;  
			        }
			        if(start_data > end_data){
			            
			            displayMsg($('#prompt-message'), '结束时间必须大于开始时间', 3000);
			            return false;  
			        }
			        price_array['start_time']=start_data;
			        price_array['end_time']=end_data;
			    }
			    var week_radio = $("input[name='week_radio']:checked").val();
			    var weekcheckbox = $("input[name='weekcheckbox']:checked");//星期选择
			    if(week_radio == "自定义"){
			        if(weekcheckbox.length <= 0){            
			            displayMsg($('#prompt-message'), '请选择星期', 3000);
			            return false;  
			        }else{
			           for(var i=0;i<weekcheckbox.length;i++){
			                if(i==weekcheckbox.length-1){
			                    price_array['week_day'] += weekcheckbox[i].value;
			                }else{
			                    price_array['week_day'] += weekcheckbox[i].value+',';
			                }               
			           } 
			        }
			        
			    }
			    var hour_radio = $("input[name='hour_radio']:checked").val();//时段选择
			    var hourstartselect = $("#hour_stat_select").val();
			    var hourendselect = $("#hour_end_select").val();
			    if(hour_radio == "自定义"){
			        if(hourstartselect == ""){            
			            displayMsg($('#prompt-message'), '请选择开始时段', 3000);
			            return false;  
			        }
			        if(hourendselect == ""){            
			            displayMsg($('#prompt-message'), '请选择结束时段', 3000);
			            return false;  
			        }
			        if(hourstartselect > hourendselect){            
			            displayMsg($('#prompt-message'), '结束时段必须大于开始时段', 3000);
			            return false;  
			        }
			        price_array['hour_time'] = hourstartselect+','+hourendselect;
			    }
			    //判断是价格的添加和修改还是会员价格的添加和修改
			    //1代表价格2代表会员价格 add代表添加，update代表修改
			    if(type == 1){
			        
			        if(dataType == "add"){  
			            price_array['price_id'] = $('#add_price_tbodys tr').length;                                       
			            price_list[$('#add_price_tbodys tr').length]=price_array;
			            //如果价格验证成功 对页面进行填充         
			            if(check_pice(price_array,menu_price_list)){
			            	$('#add_price_tbodys').append(this.new_price_data(price_array,"门店"));
			            	layer.close(layerBox);
			            }

			        }else if(dataType == "update"){   
			        	//如果价格验证成功 对页面进行填充                    
			            if(check_pice(price_array,menu_price_list)){
			            	$('#add_price_tbodys').html("");
				            for(var i in price_list){
				                if(price_list[i].price_id == priceId ){                    
				                    price_list[i] = price_array; 
				                    price_list[i]['price_id'] = i;                              
				                }
				            }
				           
				            for(var i in price_list)
				            {
				                $('#add_price_tbodys').append(this.new_price_data(price_list[i],"门店"));
				            }
				            layer.close(layerBox);
			            }		            

			        }
			        //如果策略列表没有显示
			        if($('#PriceContent').hasClass("hide")){
			            $('#PriceContent').removeClass("hide");
			        }
			        return price_list;
			    }else if(type == 2){        
			        if(dataType == "add"){
			            price_array['price_id'] = $('#add_price_tbodys tr').length;                                       
			            price_list[$('#add_price_tbodys tr').length]=price_array;
			            if(check_pice(price_list,member_price_list)){
			            	$('#add_memprice_tbodys').append(this.new_price_data(price_array,"门店"));
			            	layer.close(layerBox);
			            }
			             

			        }else if(dataType == "update"){                     
			            
			            if(check_pice(price_array,member_price_list)){
			            	$('#add_memprice_tbodys').html("");
				            for(var i in price_list){
				                if(price_list[i].price_id == priceId){                   
				                    price_list[i] = price_array;
				                    price_list[i]['price_id'] = i;
				                }
				            }            
				            for(var i in price_list)
				            {
				               $('#add_memprice_tbodys').append(this.new_price_data(price_list[i],"门店"));
				            }
				            layer.close(layerBox);
			            }			            
			        }
			        //如果策略列表没有显示
			        if($('#PriceMemberContent').hasClass("hide")){
			            $('#PriceMemberContent').removeClass("hide");
			        }
			        return price_list;
			    }
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
					if (_self.validData()) {
						_self.DishesUpdate();
					}
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

				//点击添加价格策略时
				$('#addPrice').unbind('click').bind('click',function(){		
     				var self = this; 
     				var type = $(event.target).attr('data-type');
     				//priceType1代表普通价格2代表会员价格
     				priceType=1; 
     				//添加价格策略id:1代表价格策略，2代表会员价格策略。
                    PriceAdd($(self),1);
				});
				
				//点击修改/删除价格策略时
				// $('#add_price_tbodys table').on('click','tr', function(event) {
				   $('#menu_gray table').on('click','tr', function(event) {
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
                    var type = $(event.target).attr('data-type');
                    priceType=2;
                    //添加价格策略id:1代表价格策略，2代表会员价格策略。
                    PriceAdd($(self),2);
				});
				//点击修改/删除会员价格策略
				// $('#add_memprice_tbodys table').delegate('tr', 'click', function(event) {
				$('#member_gray table').delegate('tr', 'click', function(event) {
					var self = this;                    
                    var type = $(event.target).attr('data-type');
                    priceType=2;
                    //给修改价格策略函数传值，1代表价格策略，2代表会员价格策略
                    member_price_list=PriceUpdate($(self),type,member_price_list);
				});
				
				
				//点击会员价格/会员价格策略弹出的保存按钮时
				$('#dialog_price_sava_btn').unbind('click').bind('click',function(){
					var self = this;
					var dataType=$('#dialog_price_sava_btn').attr('data-type');					
					if(priceType == 1){
	                    menu_price_list = _self.Pricesave(1,dataType,menu_price_list);
	                }else{
	                    member_price_list = _self.Pricesave(2,dataType,member_price_list);
	                }
				});
				//点击会员价格/会员价格策略弹框的取消按钮时
				$('#dialog_price_cancel_btn').unbind('click').bind('click',function(){
					layer.close(layerBox);
				});

				$('#ticheng').unbind('click').bind('click',function(){
					$(this).val('');
				});
				//点击价格策略弹窗的时间单选按钮相应的置灰
				$('input[name="pricedate"]').each(function(){		    		
		    		$(this).unbind('click').bind('click', function () {
						clickradio($(this).val(),$('.second-width'));    	
					});
		  		});
		  		//点击价格策略弹窗的星期单选按钮相应的置灰
		    	$('input[name="week_radio"]').each(function(){		    		
		    		$(this).unbind('click').bind('click', function () {
						clickradio($(this).val(),$('input[name="weekcheckbox"]'));      	
					});
		  		});
		  		//点击价格策略弹窗的时段按钮相应的置灰
		    	$('input[name="hour_radio"]').each(function(){		    		
		    		$(this).unbind('click').bind('click', function () {
						clickradio($(this).val(),$('.hour_select'));      	
					});
		  		});
				//点击按钮对应内容置灰clickradio公共方法
				$('input[name="selName"]').each(function(){		    		
		    		$(this).unbind('click').bind('click', function () {
						clickradio($(this).val(),$('#menuName'));    	
					});
		  		});
		    	$('input[name="menu_price_radio"]').each(function(){		    		
		    		$(this).unbind('click').bind('click', function () {
		    			if($(this).val() != "自定义"){
		    				$('#addPrice').css("background","#e4e4e4");
		    				$('#PriceContent .stores-caozuo-btn').css("background","#e4e4e4");
		    			}else{
		    				$('#addPrice').css("background","#FF8366");
		    				$('#PriceContent .stores-caozuo-btn').css("background","#FF8366");
		    			}
						clickradio($(this).val(),$('#addPrice'));  
						clickradio($(this).val(),$('.stores-caozuo-btn'));  	
					});
		  		});
		    	$('input[name="member_price_radio"]').each(function(){		    		
		    		$(this).unbind('click').bind('click', function () {
		    			if($(this).val() != "自定义"){
		    				$('#addmemberPrice').css("background","#e4e4e4");
		    				$('#PriceMemberContent .stores-caozuo-btn').css("background","#e4e4e4");
		    			}else{
		    				$('#addmemberPrice').css("background","#FF8366");
		    				$('#PriceMemberContent .stores-caozuo-btn').css("background","#FF8366");
		    			}
						clickradio($(this).val(),$('#addmemberPrice')); 
						clickradio($(this).val(),$('#PriceMemberContent .stores-caozuo-btn'));						   	
					});
		  		});
		  		$('input[name="takeType_radio"]').each(function(){		    		
		    		$(this).unbind('click').bind('click', function () {
						clickradio($(this).val(),$('#takeType'));    	
					});
		  		});
		    	$('input[name="special_type_radio"]').each(function(){		    		
		    		$(this).unbind('click').bind('click', function () {
						clickradio($(this).val(),$('#foodsType'));      	
					});
		  		});
		    	$('input[name="is_discount_radio"]').each(function(){		    		
		    		$(this).unbind('click').bind('click', function () {
						clickradio($(this).val(),$('#isDiscount'));      	
					});
		  		});
		  		$('input[name="is_give_radio"]').each(function(){		    		
		    		$(this).unbind('click').bind('click', function () {
						clickradio($(this).val(),$('#isGive'));      	
					});
		  		});
		  		$('input[name="sale_commission_radio"]').each(function(){		    		
		    		$(this).unbind('click').bind('click', function () {
						clickradio($(this).val(),$('#sale_commission'));      	
					});
		  		});
		  		$('input[name="printer_radio"]').each(function(){		    		
		    		$(this).unbind('click').bind('click', function () {
						clickradio($(this).val(),$('.printList'));      	
					});
		  		});
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
			//将价格转换为标准格式
			price_num: function(num){
				var price = '';
				if(this.isText(num) != "暂无价格"){
					price = this.isText(num).replace(/\￥/g, "");
				}
				return price;
			},
			// 修改
			DishesUpdate: function () {
				// 获取到各个数据，请求接口提交数据
				var self = this;
				// 把cid放进去
				$('#CID').val($.cookie('cid'));					
				// 获取到修改传过来的sale_shop_id
				// var sale_shop_id = getQueryString('sale_shop_id');	
				// console.log(sale_shop_id)	
				var menuName,
					menuPrice,
					memberPrice,
					is_discount,
					printer_id,
					pass_printer_id,
					jardiniere_printer_id,
					tag_printer_id,
					produce_printer_id,
					special_type,
					is_give,
					pack_id,
					produce_type,
					sale_commission,
					menupriceobj = new Object(),
					memberpriceobj = new Object(),
					menupricelist = new Array(),
					memberpricelist = new Array();
				var sale_shop_id = databus.shopName;
				var menu_id = databus.menu_id;
				var pack_id = this.isText(databus.pack_id) == "" ? this.isText(databus.father_pack_id) :this.isText(databus.pack_id);
				var menu_name_radio_c=$('input[name="selName"]:checked');
				var menu_price_radio_c=$('input[name="menu_price_radio"]:checked');
				var member_price_radio_c=$('input[name="member_price_radio"]:checked');
				var takeType_radio_c=$('input[name="takeType_radio"]:checked');
				var special_type_radio_c=$('input[name="special_type_radio"]:checked');
				var is_discount_radio_c=$('input[name="is_discount_radio"]:checked');
				var is_give_radio_c=$('input[name="is_give_radio"]:checked');
				var sale_commis_radio_c=$('input[name="sale_commission_radio"]:checked');
				var printer_radio_c=$('input[name="printer_radio"]:checked');

				//名称
				if(menu_name_radio_c.val() == "沿用总部"){
					menuName = null;
				}else{
					menuName = $('#menuName').val();
				}
				//菜品价格
				if(menu_price_radio_c.val() == "沿用总部"){					
					menupriceobj = null;
					menuPrice = null;
				}else{
					for(var i in menu_price_list){
						menupriceobj[i] = menu_price_list[i];
					}
					menuPrice = 1;
				}
				//会员价格
				if(member_price_radio_c.val() == "沿用总部"){
					memberpriceobj = null;
					memberPrice = null;
				}else{
					// memberpriceobj = member_price_list;
					for(var i in member_price_list){
						memberpriceobj[i] = member_price_list[i];
					}					
					memberPrice = 1;
				}
				//制作类型
				if(takeType_radio_c.val() == "沿用总部"){
					produce_type = null;
				}else{
					produce_type = $('#takeType').val();
				}
				//商品类型
				if(special_type_radio_c.val() == "沿用总部"){
					special_type = null;
				}else{
					special_type = $('#foodsType').val();
				}
				//是否赠菜
				if(is_give_radio_c.val() == "沿用总部"){
					is_give = null;
				}else{
					is_give = $('#isGive').val();
				}
				//是否打折
				if(is_discount_radio_c.val() == "沿用总部"){
					is_discount = null;
				}else{
					is_discount = $('#isDiscount').val();
				}	
				//是否有提成			
				if(sale_commis_radio_c.val() == "沿用总部"){
					sale_commission = null;					
				}else{
					if($('#sale_commission').val() == " "){
						sale_commission = 0.00;
					}else{
						sale_commission = parseFloat($('#sale_commission').val()).toFixed(2);
					}
				}
				//打印机
				if(printer_radio_c.val() == "沿用总部"){				
					printer_id = null;
					pass_printer_id = null;
					jardiniere_printer_id = null;
					tag_printer_id = null;
					produce_printer_id = null;
				}else{
					printer_id = $('#printLisTbodys').val();
					pass_printer_id = $('#passPrinterId').val();
					jardiniere_printer_id = $('#jardiniere_printer_id').val();
					tag_printer_id = $('#tagPrinterId').val();
					produce_printer_id = $('#producePrinterId').val();
				}
				if(menupriceobj == null){
					menupricelist = null;
				}else{
				 // 菜品价格列表
					for(var i in menupriceobj){
		            	
		            	delete menupriceobj[i].menu_name;
		            	delete menupriceobj[i].all;
		            	for(var key in menupriceobj[i]){
							if(key == 'hour_time' || key == 'week_day'){
								if(isArray(menupriceobj[i][key])){
									menupriceobj[i][key] = menupriceobj[i][key].toString();
								}
							}
						}
		            	menupricelist.push(menupriceobj[i]);
		            }          
				}
	            if(memberpriceobj == null){
					memberpricelist = null;
				}else{      
		            // 会员价列表	             
					for(var i in memberpriceobj){
						
						delete memberpriceobj[i].menu_name;
						delete memberpriceobj[i].all;
						for(var key in memberpriceobj[i]){
							if(key == 'hour_time' || key == 'week_day'){
								if(isArray(memberpriceobj[i][key])){
									memberpriceobj[i][key] = memberpriceobj[i][key].toString();
								}
							}
						}
						memberpricelist.push(memberpriceobj[i])
					}
				}				
			   	// $("#form").ajaxSubmit({
			   		$.ajax({
	                    type: 'post',
	                    data: {
	                    	'cid':$.cookie('cid'),
	                    	'sale_shop_id': sale_shop_id,
			                'menu_id': menu_id,
			                'menu_name': menuName,
			                'menu_price': menuPrice,
			                'member_price': memberPrice,
			                'is_discount': is_discount,
							'printer_id': printer_id,
							'pass_printer_id': pass_printer_id,
							'jardiniere_printer_id': jardiniere_printer_id,
							'tag_printer_id':tag_printer_id,
							'produce_printer_id':produce_printer_id,
							'special_type': special_type,
							'is_give':is_give,
							'pack_id':pack_id,
							'produce_type': produce_type,
							'sale_commission':sale_commission,
							'menu_price_list': menupricelist,
							'member_price_list': memberpricelist
			            },
	                    // xhrFields:{withCredentials:true},
	                    url: AdminUrl.storeUpdate,
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
	                        displayMsg($('#prompt-message'), '请稍后再试', 2000);
	                    }
	            });
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
				// 总部打印机设置
				var printLisText="未设置生产打印机";
				var jardiniere_printer_id="未设置配菜打印机";
				var tagPrinterText="未设置标签打印机";
				var passPrinterText="未设置传菜打印机";
				var producePrinterText="未设置划菜打印机";
				for (var i in data) {
					if (data[i].printer_id == 'ap1fhba8r6nd' && data[i].printer_name == '收银打印机') {
						continue;
					}
					matchPrinters +=  '<option value="'+data[i].printer_id+'">'+data[i].printer_name+'</option>';
					//判断是否为沿用总部，如果是则使用printer_id，如果不是则使用father_printer_id
					if(this.isFather(dataPro.printer_id)){
						addIsUp = 0;
						if(data[i].printer_id == dataPro.printer_id){
							printLisText = data[i].printer_name;
						}
					}else{						
						if(data[i].printer_id == dataPro.father_printer_id){
							printLisText = data[i].printer_name;
						}
					}
					//判断是否为沿用总部，如果是则使用pass_printer_id，如果不是则使用father_pass_printer_id
					if(this.isFather(dataPro.pass_printer_id)){
						addIsUp = 0;
						if(data[i].printer_id == dataPro.pass_printer_id){
							jardiniere_printer_id = data[i].printer_name;
						}
					}else{
						
						if(data[i].printer_id == dataPro.father_pass_printer_id){
							jardiniere_printer_id = data[i].printer_name;
						}
					}
					//判断是否为沿用总部，如果是则使用tag_printer_id，如果不是则使用father_tag_printer_id
					if(this.isFather(dataPro.tag_printer_id)){
						addIsUp = 0;
						if(data[i].printer_id == dataPro.tag_printer_id){
							tagPrinterText =  data[i].printer_name;
						}
					}else{
						
						if(data[i].printer_id == dataPro.father_tag_printer_id){
							tagPrinterText =  data[i].printer_name;
						}
					}
					//判断是否为沿用总部，如果是则使用jardiniere_printer_id，如果不是则使用father_jardiniere_printer_id
					if(this.isFather(dataPro.jardiniere_printer_id)){
						addIsUp = 0;
						if(data[i].printer_id == dataPro.jardiniere_printer_id){
							passPrinterText =  data[i].printer_name;
						}
					}else{
						if(data[i].printer_id == dataPro.father_jardiniere_printer_id){
							passPrinterText =  data[i].printer_name;
						}
					}
					//判断是否为沿用总部，如果是则使用produce_printer_id，如果不是则使用father_produce_printer_id
					if(this.isFather(dataPro.produce_printer_id)){
						addIsUp = 0;						
						if(data[i].printer_id == dataPro.produce_printer_id){
							producePrinterText =  data[i].printer_name;
						}
					}else{						
						if(data[i].printer_id == dataPro.father_produce_printer_id){
							producePrinterText =  data[i].printer_name;
						}
					}
				
				}
				//页面显示
				$('#printLisText').find('span').html(printLisText);
				$('#matchPrinterText').find('span').html(jardiniere_printer_id);
				$('#tagPrinterText').find('span').html(tagPrinterText);
				$('#passPrinterText').find('span').html(passPrinterText);
				$('#producePrinterText').find('span').html(producePrinterText);
				// 添加到页面中 打印机设置
				// $('#printLisTbodys').html(content + matchPrinters);
				// 生产打印机设置
				$('#printLisTbodys').html(printContent+ matchPrinters);
				// 传菜打印机设置
				$('#passPrinterId').html(passContent + matchPrinters);
				// 标签打印机
				$('#tagPrinterId').html(tagContent + matchPrinters);
				// 配菜打印机
				$('#jardiniere_printer_id').html(sideContent + matchPrinters);
				// 划菜打印机
				$('#producePrinterId').html(drawContent + matchPrinters)
				// 如果是修改的话，把修改传过来的数据选中打印机
				if (addIsUp == 1) {
					// 打印机设置
					$('#printLisTbodys').val(this.isText(dataPro.printer_id));
					// 传菜打印机设置
					$('#passPrinterId').val(this.isText(dataPro.pass_printer_id));
					// 标签打印机
					$('#tagPrinterId').val(this.isText(dataPro.tag_printer_id));
					// 配菜打印机
					$('#matchPrinter').val(this.isText(dataPro.jardiniere_printer_id));
					// 划菜打印机
					$('#producePrinterId').val(this.isText(dataPro.produce_printer_id));
				}
			}
			
   
        }
			
		DishesManageAdd.init();
});

