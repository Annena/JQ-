$(function () {
	
	// 优惠方案添加身份


        // 获取到修改传过来的id
		var promoId = getQueryString('promo_id');
		// 获取到修改传过来的缓存
		var data = Cache.get('preUp');
		// 判断是修改还是添加 0；添加，1：修改
		var addIsUp = 0;
		// 列表修改传过来的门店集合
		var shopIdPros = '';
		// 列表修改传过来的折扣菜品集合对象
		var discountTypeIds = '';

		// 列表修改传过来的赠送抵用劵id
		var giveVoucherId = '';
		// 赠送券 张数
		var give_voucher_num = 0;

		var PreferentiaManageAdd = {

			init: function () {
				// 显示所有店铺数据，调用public.js中公用的方法
				//this.shopData();
				// 赠送抵用劵
				//this.VouchersData();
				// 显示折扣菜品、赠送菜品
				//this.DishesData();

				// 判断是修改还是添加
				if (promoId != null && promoId != undefined && data != null && data != undefined) {
					addIsUp = 1;
					discountTypeIds = data.discount_menu_type_ids;

					giveVoucherId = data.give_voucher_id;
					// 把从列表传过来的门店集合赋值
					shopIdPros = data.shop_ids;

					// 把状态显示
					$('#addNoDisplay').removeClass('hide');
					$('#addAndedit').text('优惠方案修改');
					// 显示数据
					this.PreferentiaList(data);
				} else {
						$('#addAndedit').text('优惠方案添加');
					if ($('#isAuto').val() == 1) {
						$('#isAuthorization').html('<option value="0">仅银台使用，不需要授权</option>');
					} else {
						$('#isAuthorization').html('<option value="0">仅银台使用，不需要授权</option><option value="1">仅银台使用，需要店长授权</option><option value="2" >用户下单可直接使用</option>');
					}
					addIsUp = 0;
					// 把状态隐藏
					$('#addNoDisplay').addClass('hide');
				}

				// 显示所有店铺数据，调用public.js中公用的方法
				this.shopData();
				// 赠送抵用劵
				this.VouchersData();
				// 显示折扣菜品、赠送菜品
				this.DishesData();

				// 绑定点击事件
				//this.PreferentiaBind();

			},

			// 显示数据
			PreferentiaList: function (data) {
				// 显示数据

				// 方案名称
	            $('#promoName').val(data.promo_name);
	            // 是否自动，1自动0手动
	            $('#isAuto').val(data.is_auto);
	            // 是否店长授权
	            $('#isAuthorization').val(data.is_authorization);

				/*// 适用门店
				var shopIds = data.shop_ids;
				// 找到列表中所有的checkbox，然后循环每个checkbox，
				$('#shopIds div input[type="checkbox"]').each(function(i,val){
					// 如果当前用户的授权门店 等于 循环中的某个checkbox
					if(shopIds.split(',')[i] == val.name){
						// 选中当前的checkbox
						$(this).attr('checked','checked');
					}
				});*/

				// 赠送抵用劵张数
				if (data.give_voucher_num != 0) {
					$('#give_voucher_display').removeClass('hide');
					$('#multiple_input').val(data.give_voucher_num);
				}


	            // 开始时间结束时间
	            $('#startTime').val(getAppointTime(data.start_time));
	            $('#endTime').val(getAppointTime(data.end_time));
	            // 是否累计
	            $('#isRepeat').val(data.is_repeat);
				//立减金额
				 $('#amountreduced').val(data.minus_amount);
				//立减累计
			    $('#cumulative-depreciation').val(data.minus_is_repeat);
	            // 最低消费
	            $('#lowConsumption').val(data.low_consumption);
	            // 当最低消费为0的时候，隐藏累计下拉框
				if(data.low_consumption != 0 && data.low_consumption > 0) {
					$('#RepeatIsDisplay').removeClass('hide');
					$('#RepeatIsDisplay_y').removeClass('hide');
					console.log(1)
				} else {
					$('#RepeatIsDisplay').addClass('hide');
					$('#RepeatIsDisplay_y').addClass('hide');
					console.log(2)
				}
				
				
				// 赠送抵用劵
				/*var giveVoucherId = data.give_voucher_id;
				// 找到列表中所有的radio，然后循环每个radio
				$('#giveVoucherId li input[type="radio"]').each(function(i,val){
					//alert(val.value+'----'+giveVoucherId);
					// 如果当前抵用劵id 等于 循环中的某个radio
					if(val.value == giveVoucherId){
						// 选中当前的radio
						$(this).attr('checked','checked');
					}
				});*/


	            /*// 折扣菜品
	            var discountMenuTypeIds = '';
	            for (var i in data.discount_menu_type_ids) {
	            	discountMenuTypeIds += data.discount_menu_type_ids[i].menu_type_id+',';
	            }
	            // 因为用逗号拼接起来，这个字符串最后会带一个逗号，所以用substring把除去最后一个逗号之外的字符取出来
	            discountMenuTypeIds = discountMenuTypeIds.substring(0,discountMenuTypeIds.length-1);

				// 找到列表中所有的checkbox，然后循环每个checkbox，
				$('#discountDishes ul li input[type="checkbox"]').each(function(i,val){
					// 如果当前用户的授权门店 等于 循环中的某个checkbox
					if(discountMenuTypeIds.split(',')[i] == val.value){
						// 选中当前的checkbox
						$(this).attr('checked','checked');
					}
				});*/
				//赠送抵用劵
				//var giveVoucherId = data.give_voucher_id;
                $('#discountAmount').val(data.discount_amount);
	            // 折扣额度
	            $('#discountAmount').val(data.discount_amount);
	            // 状态
	            $('#promoStatus').val(data.promo_status);

				// 缓存中的数据取出之后删除
				Cache.del('preUp');

				//判断哪种优惠方法
				//如果是优惠方式里里面有打折，显示打折页面
				var ul = $(".tab_box ul.tab_ul");

				var btns = $(".nav-itinfo-tab input[type=button]");
				if(data.discount_amount !=100 ){
					btns.removeClass("checked");
					 btns.eq(0).addClass("checked");
					 ul.eq(0).show().siblings(ul).hide();
				}else if(data.minus_amount!=0){
					 btns.removeClass("checked");
					 btns.eq(1).addClass("checked");
					 ul.eq(1).show().siblings(ul).hide();
				}else{
					 btns.removeClass("checked");
					 btns.eq(2).addClass("checked");
					 ul.eq(2).show().siblings(ul).hide();
				}
			},

			// 绑定点击事件
			PreferentiaBind: function () {
				var _self = this;
				//输入立减不能打折
				//立减金额-如果立减有立减就不能使用打折，如果打折就不能使用立减
			
				// 绑定输入折扣额度事件
				$('#discountAmount').unbind('input').bind('input', function () {
					if ($(this).val() != 100) {
						$('#amountreduced').val('0');
						$('#cumulative-depreciation').val(0);
					}
				});
				// 绑定输入立减金额事件
				$('#amountreduced').unbind('input').bind('input', function () {
					if ($(this).val() != 0) {
						$('#discountAmount').val('100');
					}
				});
				//打折优惠、返券优惠、立减优惠至少要选择一个
				$('#updatebtn').on('click',function(){
					alert(1)
					if ($('#discountAmount').val()==100 && $('#amountreduced').val()==0 && $('#voucher_input').val()==0  ) {
						alert('打折优惠、返券优惠、立减优惠至少要选择一个');
					}
				});
				


				//点击切换优惠内容
			
				var ul = $(".tab_box ul.tab_ul");
				var btns = $("input[type=button]");
				btns.click(function(){
					var ind = $(this).index();
					btns.each(function(index, value){
						$(value).removeClass("checked");
					});
				    btns.removeClass("checked");
					$(this).addClass("checked");
					//$(this).removeClass("checked").eq(ind).addClass("checked");
					ul.eq(ind).show().siblings(ul).hide();
					// ul.addClass('hide');
					// ul.eq(ind).removeClass('hide');
					
				});


				// 点击修改
				$('#updatebtn').unbind('click').bind('click', function () {
					// 检查条件是否满足，在进行添加修改
					_self.checkCondition();
				});

				// 点击取消
				$('#exitbtn').unbind('click').bind('click', function () {
					window.location.replace('preferentiaManage.html?is_select=1&type='+getQueryString('type'));
				});

				// 点击导航
				$('#selectJump').unbind('click').bind('click', function () {
					window.location.replace('preferentiaManage.html?is_select=1&type='+getQueryString('type'));
				});

				// 点击查看更多门店
				$('#clickMore').unbind('click').bind('click', function () {
					// 删除隐藏，显示隐藏的那部分门店
					$('#more').removeClass('hide');
					// 隐藏   查看更多门店按钮
					$('#clickMore').addClass('hide');
				});

				// 当自动和手动切换的时候，自动：店长授权必须为不需要，手动：店长授权可为不需要或需要
				$('#isAuto').change(function(){
					// 自动
					if ($("#isAuto").val() == 1) {
						if($('#isAuthorization').val()==0){
							$('#isAuthorization').html('<option value="0">仅银台使用，不需要授权</option><option value="2">用户下单可直接使用</option>');
						}else if($('#isAuthorization').val()==1){
							$('#isAuthorization').html('<option value="0">仅银台使用，不需要授权</option><option value="2">用户下单可直接使用</option>');
						}else if($('#isAuthorization').val()==2){
							$('#isAuthorization').html('<option value="2">用户下单可直接使用</option><option value="0">仅银台使用，不需要授权</option>');
						}
					};
					// 手动
					if ($("#isAuto").val() == 0) {
						if($('#isAuthorization').val()==0){
							$('#isAuthorization').html('<option value="0">仅银台使用，不需要授权</option><option value="1">仅银台使用，需要店长授权</option><option value="2">用户下单可直接使用</option>');
						}else if($('#isAuthorization').val()==1){
							$('#isAuthorization').html('<option value="1">仅银台使用，需要店长授权</option><option value="0">仅银台使用，不需要授权</option><option value="2">用户下单可直接使用</option>');
						}else if($('#isAuthorization').val()==2){
							$('#isAuthorization').html('<option value="2">用户下单可直接使用</option><option value="0">仅银台使用，不需要授权</option><option value="1">仅银台使用，需要店长授权</option>');
						}
						
					};
				});

				// 当最低消费为0的时候，隐藏累计下拉框
				$('#lowConsumption').unbind('input').bind('input', function () {
                    var num1 = $(this).val();                
                    //正则表达式验证必须为数字或者两位小数
                    var numPro = /^\d*\.{0,1}\d{0,2}$/;
                    //查找输入字符第一个为0
                    var resultle = num1.substr(0,1);
                    var result2 = num1.substr(1,1);
                    if(numPro.test(num1)){
                        if(resultle == 0 && num1.length > 1 && result2 != '.'){
                        	//替换0为空
                            $(this).val(num1.replace(/0/,""));

                            if(num1.substr(0,1) == '.'){
                                $(this).val(0);
                            }
                        }
                        if (num1 == '') {
                            $(this).val(0);
                        }
                    }else{
                        $(this).val(0);
                    }


					if($('#lowConsumption').val() != 0 && $('#lowConsumption').val() > 0) {
						$('#RepeatIsDisplay').removeClass('hide');
						$('#RepeatIsDisplay_y').removeClass('hide');
					} else {
						$('#RepeatIsDisplay').addClass('hide');
						$('#RepeatIsDisplay_y').addClass('hide');
					}
				});

				// 点击折扣菜品分类选中所有此分类的菜品
				$('#discountClassif').delegate('li input[type="checkbox"]', 'click', function(event) {
					var self = this;
                    //alert($('#discountClassif').find('li').length);
					// 如果点击的是全部菜品，就选中全部菜品
			 		if ($(this).attr('name') == 'all') {
			 			//alert('tt');
			 			// 循环左侧分类列表中所有的checkbox，然后循环每个checkbox
						$('#discountClassif li input[type="checkbox"]').each(function(i,val){
							//alert('bb');
		                    // 如果全部菜品 被选中了，就选中全部分类
		                    if($('#disAll').is(':checked') || $('#disAll').attr('checked') == true){
		                    	//alert('rr');
		                        $(this).prop('checked',true);
		                    } else {
		                        $(this).prop('checked',false);
		                    }
		                });
		                // 循环右侧分类列表中所有的checkbox，然后循环每个checkbox
		                $('#discountDishes ul li input[type="checkbox"]').each(function(i,val){
		                    // 如果全部菜品 被选中了，就选中全部菜品
		                    if($('#disAll').is(':checked')){
		                        $(this).prop('checked',true);
		                    } else {
		                        $(this).prop('checked',false);
		                    }
		                });
					} else {
		                // 如果点击的是其他门店，判断所有门店有没有选中，如果所有门店选中了，就取消所有门店的选中
		                if ($('#disAll').is(':checked') || $('#disAll').attr('checked') == true) {
		                    $('#disAll').prop('checked',false);
		                }
	                    // 点击折扣菜品分类多选框的时候
	                    // 首先获取到跟input处于元素的href（这个也就是分类跳转右侧分类所属菜品的id）
	                    var jumpId = $(self).next().attr('href');
	                    // 因为这个href包含一个#号，所以获取到除#号之外的，就是右侧菜品分类的name值
	                    jumpId = jumpId.split('#')[1];
	                    // 循环右侧所有的菜品分类a标签
	                    $('#discountDishes').find('ul a').each(function(i,val){
	                    	// 如果当前a标签name值等于当前点击分类的href值
	                    	if ($(this).attr('name') == jumpId) {
	                    		// 查找到a标签父级的父级下的input，进行循环
	                    		$(this).parent().parent().find('input[type="checkbox"]').each(function(i,val){
	                    			// 如果左侧分类被选中了就选中所有的input，否则就取消
	                    			if ($(self).is(':checked')){
	                    				$(this).prop('checked',true);
	                    			} else {
	                    				$(this).prop('checked',false);
	                    			}
	                    		});
	                    	}  
						});


	                    // 计算选中的分类有几个
	                    var disNUm = 0;
						// 循环左侧分类，如果所有分类都选中了就选中全部菜品，否则取消全部菜品
						$('#discountClassif li input[type="checkbox"]').each(function(i,val){
							if (val.value != 'all') {
								if ($(this).is(':checked')) {
									disNUm ++;
								}
							}
						});

						// 判断选中的分类有几个，是不是跟获取到左侧所有分类不包含全部菜品的长度一样
						if (disNUm == ($('#discountClassif').find('li').length - 1)) {
							$('#disAll').prop('checked',true);
						} else {
							$('#disAll').prop('checked',false);
						}
                	}

				});
				// 点击右侧菜品的时候
				$('#discountDishes').delegate('ul li input[type="checkbox"]', 'click', function() {
					//alert('tt');
					var self = this;

					// 找到当前父级的父级下a标签的name值
					var jumpPro = $(this).parent().parent().find('a').attr('name');
					// 因为这个name缺少一个#号，所以添加一个#号，就是左侧菜品分类的href
					//jumpPro = '#'+jumpPro;

					var num = 0;
                    // 循环右侧所有的菜品分类a标签==当前a标签的name值，找到他的父级的父级下的input，进行循环
                    $('#discountDishes').find('ul a[name="'+jumpPro+'"]').parent().parent().find('li input').each(function(i,val){
                    	// 如果当前选中了就++
                    	 if ($(this).is(':checked')) {
                    	 	num ++;
                    	 }
					});
                    // 添加#号，为了和左侧菜品分类href一样
					jumpPro = '#'+jumpPro;
					// 循环左侧菜品下a标签
                    $('#discountClassif').find('li a').each(function(i,val){
						//alert($(this).attr('href')+'----'+jumpPro);
						// 如果当前a标签的href值等于当前点击菜品的name值
						if ($(this).attr('href') == jumpPro) {
							// 为菜品的name值添加#号
							jumpPro = jumpPro.split('#')[1];
							// 判断当前右侧菜品所代表的分类下的所有菜品是不是全都选中了
							if ($('#discountDishes').find('ul a[name="'+jumpPro+'"]').parent().parent().find('li').length == num) {
								// 右侧菜品全都选中就选中左侧分类
								$(this).parent().find('input[type="checkbox"]').prop('checked',true);
							} else {
								// 否则取消左侧分类
								$(this).parent().find('input[type="checkbox"]').prop('checked',false);
							}	
						}
					});

	                // 计算选中的分类有几个
	                var disNUm = 0;
					// 循环左侧分类，如果所有分类都选中了就选中全部菜品，否则取消全部菜品
					$('#discountClassif li input[type="checkbox"]').each(function(i,val){
						if (val.value != 'all') {
							if ($(this).is(':checked')) {
								disNUm ++;
							}
						}
					});

					// 判断选中的分类有几个，是不是跟获取到左侧所有分类不包含全部菜品的长度一样
					if (disNUm == ($('#discountClassif').find('li').length - 1)) {
						$('#disAll').prop('checked',true);
					} else {
						$('#disAll').prop('checked',false);
					}
				});
				
				// 点击赠送菜品的时候，（赠送菜品原来是单选框，现在改成了多选框，改成多选框是因为多选框可以点击取消选中），把多选框实现和单选框一样的效果可以单选不可以多选，
			    /*$('#cfDishes ul li input[type="checkbox"]').click(function(){
			        if($(this).is(':checked')) {
			        	//当前的框选中，siblings遍历除当前之外的框，取消选中
			        	$(this).siblings('#cfDishes ul li input[type="checkbox"]').attr('checked',false);
			        }
			    });*/
			},

			// 检测条件
	        checkCondition: function() {

	            var _self = this;

	            var start = $('#startTime').val(),
	                end = $('#endTime').val();
                    promoName= $('#promoName').val();

                if (promoName == "") {
	                displayMsg(ndPromptMsg, '方案名称不能为空', 2000);
	                return;
	            }


	            if (start == "" || end == "") {
	                displayMsg(ndPromptMsg, '请选择开始时间和结束时间!', 2000);
	                return;
	            }

	            if (start > end) {
	                displayMsg(ndPromptMsg, '开始时间应小于结束时间!', 2000);
	                return;
	            }

	            // defaults.start = start;
	            // defaults.end = end;
	            // defaults.del = $('#status').val();

	            if (addIsUp == 0) {
						_self.PreferentiaAdd();
					} else if (addIsUp == 1) {
						_self.PreferentiaUpdate();
					}
	        },

			// 添加
			PreferentiaAdd: function () {
				// 获取到各个数据，请求接口提交数据
				var self = this;
				
				// 方案名称
	            var promoName = $('#promoName').val();
	            // 是否自动，1自动0手动
	            var isAuto = $('#isAuto').val();
	            // 是否店长授权
	            var isAuthorization = $('#isAuthorization').val();

				// 适用门店
				var shopIds = '';
				// 如果所有门店被选中，就传all，否则传选中的店铺组成的字符串
				if ($('#all').is(':checked') || $('#all').attr('checked') == true) {
					shopIds = 'all';
				} else {
					// 找到列表中所有的checkbox，然后循环每个checkbox，
					$('#shopIds div input[type="checkbox"]').each(function(i,val){
						// 判断不是（所有门店）才去判断是否选中，然后在拼字符串
						if (val.name != 'all') {
							// 如果当前循环的checkbox 被选中了
							if($(this).is(':checked')){
								// 就把checkbox中的名字取出来，并用逗号拼接起来
								shopIds += val.value+',';
							}
						}
					});
					// 因为用逗号拼接起来，这个字符串最后会带一个逗号，所以用substring把除去最后一个逗号之外的字符取出来
					shopIds = shopIds.substring(0,shopIds.length-1);
				}

	            // 开始时间结束时间
	            var startTime = $('#startTime').val();
	            var endTime = $('#endTime').val();
	            // 是否累计
	            var isRepeat = '';

	            // 最低消费
	            var lowConsumption = $('#lowConsumption').val();
	            // 当最低消费为0的时候，不可以累计
				if(lowConsumption != 0 && lowConsumption > 0) {
					isRepeat = $('#isRepeat').val();
				} else {
					isRepeat = '0';
				}

				// 赠送抵用劵
				var giveVoucherId = '';
				// 找到列表中所有的radio，然后循环每个radio，
				$('#giveVoucherId li input[type="radio"]').each(function(i,val){
					// 如果当前循环的radio 被选中了
					if($(this).is(':checked')){
						// 就把radio中的名字取出来，并用逗号拼接起来
						giveVoucherId = val.value;
					}
				});

	            // 折扣菜品
				var discountMenuTypeIds = '';
				// 如果全部菜品选中了他就是一个字符串，否则就是一个json数组
				if ($('#disAll').is(':checked') || $('#disAll').attr('checked') == true) {
					discountMenuTypeIds = '';
				} else {
					//alert('tt');
					discountMenuTypeIds = {};
				}

				/*jquery each循环,要实现break和continue的功能： 
				break----用return false; continue --用return ture;﻿*/
				var tt = 0;
				var bb = {};
				var rr = new Array();
				//alert('ttt');
				// 循环左侧分类
				$('#discountClassif li input[type="checkbox"]').each(function(i,val){
					var self = this;
					// 判断是全部菜品
					if (val.name == 'all') {
						//alert('dd');
						// 如果当前（全部菜品）被选中了，就赋值all，并且跳出循环
						if ($(this).is(':checked') || $(this).attr('checked') == true) {

							discountMenuTypeIds = 'all';
							//alert('dd---' +discountMenuTypeIds);
							// 跳出循环
							return false;
						}
					} else {// 否则不是全部菜品而是其他分类
						//discountMenuTypeIds = {};
						// 如果当前分类被选中了
						if ($(this).is(':checked') || $(this).attr('checked') == true) {
							// 就把当前分类赋值过去
							//discountMenuTypeIds[val.value] = 'all';
							
							bb['menu_type_id'] = val.value;
							bb['menu_ids'] = 'all';
							//alert(tt+'----'+JSON.stringify(bb));
							rr[tt] = JSON.stringify(bb);
							tt++;
						} else {// 如果当前分类没有选中，就循环右侧当前分类下的菜品是否有选中的
							// 定义一个变量来接收当前分类选中的菜品的menu_id组成的字符串
							var disMenuIds = '';
							// 定义一个变量来判断当前分类下是否有选中的菜品,0:没有，1：有
							var disYesNo = 0;

		                    // 首先获取到跟当前分类的input的下一个同级元素的href（这个也就是分类跳转右侧分类所属的id）
		                    var jumpId = $(self).next().attr('href');
		                    // 因为这个href包含一个#号，所以获取到除#号之外的，就是右侧菜品分类的name值
		                    jumpId = jumpId.split('#')[1];
		                    // 循环右侧所有的菜品分类a标签
		                    $('#discountDishes').find('ul a').each(function(){
		                    	// 如果当前a标签name值等于当前点击分类的href值
		                    	if ($(this).attr('name') == jumpId) {
		                    		// 查找到a标签父级的父级下的input(也就是当前分类下的所有菜品)，进行循环
		                    		$(this).parent().parent().find('input[type="checkbox"]').each(function(i,valt){
		                    			// 如果左侧分类被选中了就选中所有的input，否则就取消
		                    			if ($(this).is(':checked')){
											// 就把checkbox中的名字取出来，并用逗号拼接起来
											disMenuIds += valt.value+',';
		                    				disYesNo = 1;
		                    			}
		                    		});
		                    	}  
							});

		                    // 如果当前分类下有选中的菜品
		                    if (disYesNo == 1) {
								// 因为用逗号拼接起来，这个字符串最后会带一个逗号，所以用substring把除去最后一个逗号之外的字符取出来
								disMenuIds = disMenuIds.substring(0,disMenuIds.length-1);
								// 放入json数组
								//discountMenuTypeIds[val.value] = disMenuIds;
								
								bb['menu_type_id'] = val.value;
								bb['menu_ids'] = disMenuIds;
								//alert(tt+'----'+JSON.stringify(bb));
								rr[tt] = JSON.stringify(bb);
								tt++;
								
		                    }
						}
					}
					
				});
				//console.log(JSON.stringify(rr));
				//alert(JSON.stringify(discountMenuTypeIds));
				
				// 把json转成一个数组
				/*var menuPar  = new Array();
	            var numDis = 0;
	            for (var i in discountMenuTypeIds) {
	            	//alert(i);
	            	menuPar[numDis]['menu_type_id'] += i;
	            	menuPar[numDis]['menu_ids'] += discountMenuTypeIds[i];
	            	numDis++;
	            }*/

	            //console.log(JSON.stringify(menuPar));


				// 判断如果数组是是空的话
				if (discountMenuTypeIds != 'all' && rr.length == 0) {
					//alert('bbb');
					discountMenuTypeIds = '';
				} else {
					if (discountMenuTypeIds != 'all') {
						discountMenuTypeIds = JSON.stringify(rr);
					}
				}
				//alert('dd---' +discountMenuTypeIds);
				//discountMenuTypeIds = JSON.stringify(rr);
				//console.log(discountMenuTypeIds);
	            // 折扣额度
	            var discountAmount = $('#discountAmount').val();
	            // //  
	            // if(!($('.voucher_zero').is(':checked'))) {
	            // 	give_voucher_num = $('#multiple_input').val();
	            // 	console.log('没选中');
	            // }
	            if($('.voucher_zero').is(':checked') || $('input[name="voucherOne"]').is(':checked') == false) {
	            	give_voucher_num = 0;
	            } else {
	            	give_voucher_num = $('#multiple_input').val();
	            }
				//立减金额
				var minusamount = $('#amountreduced').val();

				//立减累计
				var minusisrepeat = $('#cumulative-depreciation').val();
	            // 效验数据通过才能修改
				if (this.dataCheck()) {
	                setAjax(AdminUrl.promoPromoAdd, {
	                    'promo_name': promoName,
	                    'is_auto': isAuto,
						'minus_amount': minusamount,
						'minus_is_repeat':minusisrepeat,
	                    'is_authorization': isAuthorization,
						'shop_ids': shopIds,
	                    'start_time': startTime,
	                    'end_time': endTime,
	                    'low_consumption': parseFloat(lowConsumption).toFixed(2),
	                    'is_repeat': isRepeat,
	                    'discount_amount': discountAmount,
	                    'discount_menu_type_ids': discountMenuTypeIds,
	                    'give_menu_id': '',
	                    'give_voucher_id': giveVoucherId,
	                    'give_voucher_num':give_voucher_num
	                }, $('#prompt-message'), {20: ''}, function(respnoseText) {
						// 得到返回数据
	                    var data = respnoseText.data;
	                    window.location.replace('preferentiaManage.html?is_select=1&type='+getQueryString('type'));
	                }, 2);
	            }
			},

			// 修改
			PreferentiaUpdate: function () {
				// 获取到各个数据，请求接口提交数据
				var self = this;

				// 方案名称
	            var promoName = $('#promoName').val();
	            // 是否自动，1自动0手动
	            var isAuto = $('#isAuto').val();
	            // 是否店长授权
	            var isAuthorization = $('#isAuthorization').val();

				// 适用门店
				var shopIds = '';
				// 如果所有门店被选中，就传all，否则传选中的店铺组成的字符串
				if ($('#all').is(':checked') || $('#all').attr('checked') == true) {
					shopIds = 'all';
				} else {
					// 找到列表中所有的checkbox，然后循环每个checkbox，
					$('#shopIds div input[type="checkbox"]').each(function(i,val){
						// 判断不是（所有门店）才去判断是否选中，然后在拼字符串
						if (val.name != 'all') {
							// 如果当前循环的checkbox 被选中了
							if($(this).is(':checked')){
								// 就把checkbox中的名字取出来，并用逗号拼接起来
								shopIds += val.value+',';
							}
						}
					});
					// 因为用逗号拼接起来，这个字符串最后会带一个逗号，所以用substring把除去最后一个逗号之外的字符取出来
					shopIds = shopIds.substring(0,shopIds.length-1);
				}

	            // 开始时间结束时间
	            var startTime = $('#startTime').val();
	            var endTime = $('#endTime').val();
	            // 是否累计
	            var isRepeat = '';

	            // 最低消费
	            var lowConsumption = $('#lowConsumption').val();
	            // 当最低消费为0的时候，不可以累计
	            
				if(lowConsumption != 0 && lowConsumption > 0) {
					isRepeat = $('#isRepeat').val();
				} else {
					isRepeat = '0';
				}

				// 赠送抵用劵
				var giveVoucherId = '';
				// 找到列表中所有的radio，然后循环每个radio，
				$('#giveVoucherId li input[type="radio"]').each(function(i,val){
					// 如果当前循环的radio 被选中了
					if($(this).is(':checked')){
						// 就把radio中的名字取出来，并用逗号拼接起来
						giveVoucherId = val.value;
					}
				});

	            // 折扣菜品
				var discountMenuTypeIds = '';
				// 如果全部菜品选中了他就是一个字符串，否则就是一个json数组
				if ($('#disAll').is(':checked') || $('#disAll').attr('checked') == true) {
					discountMenuTypeIds = '';
				} else {
					//alert('tt');
					discountMenuTypeIds = {};
				}

				/*jquery each循环,要实现break和continue的功能： 
				break----用return false; continue --用return ture;﻿*/
				var tt = 0;
				var bb = {};
				var rr = new Array();
				// 循环左侧分类
				$('#discountClassif li input[type="checkbox"]').each(function(i,val){
					var self = this;
					// 判断是全部菜品
					if (val.name == 'all') {
						// 如果当前（全部菜品）被选中了，就赋值all，并且跳出循环
						if ($(this).is(':checked') || $(this).attr('checked') == true) {
							discountMenuTypeIds = 'all';
							//alert('dd---' +discountMenuTypeIds);
							// 跳出循环
							return false;
						}
					} else {// 否则不是全部菜品而是其他分类
						//discountMenuTypeIds = {};
						// 如果当前分类被选中了
						if ($(this).is(':checked') || $(this).attr('checked') == true) {
							// 就把当前分类赋值过去
							//discountMenuTypeIds[val.value] = 'all';
							
							bb['menu_type_id'] = val.value;
							bb['menu_ids'] = 'all';
							//alert(tt+'----'+JSON.stringify(bb));
							rr[tt] = JSON.stringify(bb);
							tt++;
						} else {// 如果当前分类没有选中，就循环右侧当前分类下的菜品是否有选中的
							// 定义一个变量来接收当前分类选中的菜品的menu_id组成的字符串
							var disMenuIds = '';
							// 定义一个变量来判断当前分类下是否有选中的菜品,0:没有，1：有
							var disYesNo = 0;

		                    // 首先获取到跟当前分类的input的下一个同级元素的href（这个也就是分类跳转右侧分类所属的id）
		                    var jumpId = $(self).next().attr('href');
		                    // 因为这个href包含一个#号，所以获取到除#号之外的，就是右侧菜品分类的name值
		                    jumpId = jumpId.split('#')[1];
		                    // 循环右侧所有的菜品分类a标签
		                    $('#discountDishes').find('ul a').each(function(){
		                    	// 如果当前a标签name值等于当前点击分类的href值
		                    	if ($(this).attr('name') == jumpId) {
		                    		// 查找到a标签父级的父级下的input(也就是当前分类下的所有菜品)，进行循环
		                    		$(this).parent().parent().find('input[type="checkbox"]').each(function(i,valt){
		                    			// 如果左侧分类被选中了就选中所有的input，否则就取消
		                    			if ($(this).is(':checked')){
											// 就把checkbox中的名字取出来，并用逗号拼接起来
											disMenuIds += valt.value+',';
		                    				disYesNo = 1;
		                    			}
		                    		});
		                    	}  
							});

		                    // 如果当前分类下有选中的菜品
		                    if (disYesNo == 1) {
								// 因为用逗号拼接起来，这个字符串最后会带一个逗号，所以用substring把除去最后一个逗号之外的字符取出来
								disMenuIds = disMenuIds.substring(0,disMenuIds.length-1);
								// 放入json数组
								//discountMenuTypeIds[val.value] = disMenuIds;
								
								bb['menu_type_id'] = val.value;
								bb['menu_ids'] = disMenuIds;
								//alert(tt+'----'+JSON.stringify(bb));
								rr[tt] = JSON.stringify(bb);
								tt++;
								
		                    }
						}
					}
					
				});
				//console.log(JSON.stringify(rr));
				//alert(JSON.stringify(discountMenuTypeIds));
				
				// 把json转成一个数组
				/*var menuPar  = new Array();
	            var numDis = 0;
	            for (var i in discountMenuTypeIds) {
	            	//alert(i);
	            	menuPar[numDis]['menu_type_id'] += i;
	            	menuPar[numDis]['menu_ids'] += discountMenuTypeIds[i];
	            	numDis++;
	            }*/

	            //console.log(JSON.stringify(menuPar));

	            //alert('dd---' +discountMenuTypeIds);
				// 判断如果数组是是空的话
				if (discountMenuTypeIds != 'all' && rr.length == 0) {
					//alert('bbb');
					discountMenuTypeIds = '';
				} else {
					if (discountMenuTypeIds != 'all') {
						discountMenuTypeIds = JSON.stringify(rr);
					}
				}
				//alert('dd---' +discountMenuTypeIds);
				//discountMenuTypeIds = JSON.stringify(rr);
				//console.log(discountMenuTypeIds);


	            // 折扣额度
	            if ($('#discountAmount').val() !== '') {
	            	var discountAmount = $('#discountAmount').val();
	            };

	            if ($('#discountAmount').val() == '') {
	            	var discountAmount = 100
	            };

	            // if(!($('.voucher_zero').is(':checked'))) {
	            // 	give_voucher_num = $('#multiple_input').val();
	            // }
	            if($('.voucher_zero').is(':checked') || $('input[name="voucherOne"]').is(':checked') == false) {
	            	give_voucher_num = 0;
	            } else {
	            	give_voucher_num = $('#multiple_input').val();
	            }
	            // 状态
	            var promoStatus = $('#promoStatus').val();
				//立减金额
				var minusamount = $('#amountreduced').val();

				//立减累计
				var minusisrepeat = $('#cumulative-depreciation').val();

	            // 效验数据通过才能修改
				if (this.dataCheck()) {
	                setAjax(AdminUrl.promoPromoUpdate, {
	                	'promo_id': promoId,
	                    'promo_name': promoName,
						'minus_amount': minusamount,
						'minus_is_repeat':minusisrepeat,
	                    'is_auto': isAuto,
	                    'is_authorization': isAuthorization,
						'shop_ids': shopIds,
	                    'start_time': startTime,
	                    'end_time': endTime,
	                    'low_consumption': parseFloat(lowConsumption).toFixed(2),
	                    'is_repeat': isRepeat,
	                    'discount_amount': discountAmount,
	                    'discount_menu_type_ids': discountMenuTypeIds,
	                    'give_menu_id': '',
	                    'give_voucher_id': giveVoucherId,
	                    'promo_status': promoStatus,
	                    'give_voucher_num':give_voucher_num
	                }, $('#prompt-message'), {20: ''}, function(respnoseText) {
						// 得到返回数据
	                    var data = respnoseText.data;
	                    window.location.replace('preferentiaManage.html?is_select=1&type='+getQueryString('type'));
	                }, 2);
				}
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

					self.shopList(data);

                }, 0);
			},

			// 显示店铺
			shopList: function (data) {
					var content = '<div class="clearfix">'+
										'<div class="fendian">'+
		                                	'<input name="all" id="all" '+(shopIdPros == 'all' ? 'checked=checked' : '' )+' type="checkbox" value="all">所有门店'+
		                            	'</div>';
					// num用来区分改隐藏的更多门店
					var num = 0;
					for (var i in data) {
						if (num == 15) {
							content += '</div>'+
										'<div class="more" id="clickMore">点击查看更多门店</div>'+
										'<div class="clearfix hide" id="more">'+
											'<div class="fendian">'+
			                                	'<input name="'+data[i].shop_name+'" type="checkbox"  value="'+data[i].shop_id+'">'+data[i].shop_name+
			                            	'</div>';
						} else {
							content += '<div class="fendian">'+
		                                	'<input name="'+data[i].shop_name+'" type="checkbox"   value="'+data[i].shop_id+'">'+data[i].shop_name+
		                            	'</div>';	
						}
		                num ++;
					}

					content += '</div>';
					// 添加到页面中
					$('#shopIds').html(content);

					// 找到列表中所有的checkbox，然后循环每个checkbox，
					$('#shopIds div input[type="checkbox"]').each(function(i,val){
						if (shopIdPros == 'all') {
							$(this).attr('checked','checked');
						} else {
							var leng = shopIdPros.split(',').length;
							for (var i = 0;i<leng;i++) {
								// 如果当前用户的授权门店 等于 循环中的某个checkbox
								if(shopIdPros.split(',')[i] == val.value){
									// 选中当前的checkbox
									$(this).attr('checked','checked');
								}
							}
						}
					});

					// 调用public.js中公共的方法（点击全选，选中所有的，点击其中某一个，如果这时候是全选就把全选取消）
					selectShopAll('#shopIds', '#shopIds div input[type="checkbox"]');
			},

			// 显示抵用劵
			VouchersData: function () {
				var self = this;
                setAjax(AdminUrl.voucherVoucherList, {
                    'vou_status': 0
                }, $('#prompt-message'), {20: ''}, function(respnoseText) {
					// 得到返回数据
                    var data = respnoseText.data;
                    // 显示数据
                    self.VouchersList(data);
                }, 0);
			},

			// 显示数据抵用劵
			VouchersList: function (data) {
				var content = '';

				for (var i in data) {
					content += '<li>'+
		                            '<input id="voucher_input" name="voucherOne" type="radio" value="'+data[i].voucher_id+'">'+data[i].voucher_name+
		                        '</li>';
				}
				// 添加到页面中
				$('#giveVoucherId').append(content);
								//选项点击事件
				this.radioClick();
				// 如果是修改的话，就填充列表修改传过来的抵用劵id
				if (addIsUp == 1) {
					// 找到列表中所有的radio，然后循环每个radio
					$('#giveVoucherId li input[type="radio"]').each(function(i,val){
						//alert(val.value+'----'+giveVoucherId);
						// 如果当前抵用劵id 等于 循环中的某个radio
						if(val.value == giveVoucherId){
							// 选中当前的radio
							$(this).attr('checked','checked');
						}
					});
				}
			},
			// 选项点击事件
			radioClick:function () {
				$('#giveVoucherId li input[type="radio"]').on('click', function () {
					//alert(val.value+'----'+giveVoucherId);
					// 如果当前抵用劵id 等于 循环中的某个radio
					if($(this).val() == 0){
						$('.multiple').addClass('hide');
					} else {
						$('.multiple').removeClass('hide');
					}
				});
			},
			// 显示菜品数据 
			DishesData: function () {
				var self = this;
                setAjax(AdminUrl.menuMenuList, {
                    'menu_status': 0,
                    'sale_shop_id':'all'
                }, $('#prompt-message'), {20: ''}, function(respnoseText) {
					// 得到返回数据
                    var data = respnoseText.data;
                    delete data.depot_info;
                    // 显示数据
                    delete data.depot_info;
                    self.DishesList(data);
                }, 0);
			},

			// 显示数据菜品数据 
			DishesList: function (data) {

				/*// 修改传过来的折扣菜品集合
				var discountMenuTypeIds = '';
				// 判断如果是修改的话
				if (addIsUp == 1) {
					// 修改传过来的折扣菜品
		            for (var i in discount_menu_type_ids) {
		            	discountMenuTypeIds += discount_menu_type_ids[i].menu_type_id+',';
		            }
		            // 因为用逗号拼接起来，这个字符串最后会带一个逗号，所以用substring把除去最后一个逗号之外的字符取出来
		            discountMenuTypeIds = discountMenuTypeIds.substring(0,discountMenuTypeIds.length-1);

					// 找到列表中所有的checkbox，然后循环每个checkbox，
					$('#discountDishes ul li input[type="checkbox"]').each(function(i,val){
						// 如果当前用户的授权门店 等于 循环中的某个checkbox
						if(discountMenuTypeIds.split(',')[i] == val.value){
							// 选中当前的checkbox
							$(this).attr('checked','checked');
						}
					});
				}*/

				// 赠送菜品的参数
				// 分类
				var classifi = '';
				// 菜品
				var content = '';

				// 如果是修改在转格式，因为添加会报错
				if (addIsUp == 1) {
					//console.log(discountTypeIds);
					// json字符从转成数组eval
					discountTypeIds = eval('('+discountTypeIds+')');
					/*alert(discountTypeIds[0]);
					for (var i in discountTypeIds) {
						alert(discountTypeIds[i].menu_type_id);
						return;
					}*/
				}

				//alert(discountTypeIds);
				// 折扣菜品的参数
				// 分类
				var discountCl = '<li>'+
									'<input type="checkbox" id="disAll" name="all" value="all" '+(discountTypeIds == 'all' ? 'checked=checked' : '' )+'>全部菜品'+
                            	'</li>';
				// 菜品
				var discountDis = '';
				// 用户折扣菜品通过分类找到右侧分类所代表的菜品的，标识
				var num = 0;

				// 定义一个变量来记录每个分类有几个菜品
				var numDis = 0;
				// 定义一个变量来标识修改传过来的和当前菜品是否对应，并且选中，1：选中，0：不选中
				var selectDis = 0;
				// 定义一个变量来记录当前分类选中了几个菜品
				var currentSelect = 0;
				// 定义一个变量来标识当前分类是否要选中，1：选中，0：不选中
				var currentYesNo = 0;


				for (var i in data) {
					// 赠送菜品
					content += '<ul class="neimargin">'+
								'<div class="dishesclass"><a name="'+i+'">'+data[i].menu_type+'</a></div>';

					for (var j in data[i].menu_list) {
						content += '<li class="titleclass">'+
                                		'<input name="discount_input" type="radio" value="'+data[i].menu_list[j].menu_id+'">'+data[i].menu_list[j].menu_name+
                            		'</li>';
					}

					content += '</ul>';


					// 在这里清零，是循环下一个分类的时候清零，这样循环下面这个分类的菜品就重新从零开始记录当前分类有几个菜品
	                numDis = 0;
	                // 在这里清零，是循环下一个分类的时候清零，这样循环下面当前分类选中了几个菜品就会从零开始
	                currentSelect = 0;
	                // 选中分类请零
	                currentYesNo = 0;

                    // 折扣菜品
					discountDis += '<ul class="neimargin">'+
									'<div class="dishesclass"><a name="'+i+num+'">'+data[i].menu_type+'</a></div>';

					for (var j in data[i].menu_list) {
						// 标识修改传过来的和当前菜品是否对应，当循环下一个菜品的时候，要清零0，变成不选中
						selectDis = 0;

						// 判断不是all   json数组不是discountTypeIds = {};
						if (discountTypeIds != 'all' && discountTypeIds.length != 0) {
							
							// 循环数组
							for (var b in discountTypeIds) {
								//alert('--'+b);
								//alert(discountTypeIds[b].menu_type_id);
								// 判断数组中当前分类id==当前循环的菜品分类id
								if (discountTypeIds[b].menu_type_id == i) {
									//alert(discountTypeIds[b].menu_type_id);
									//alert('bb');
									// 如果数组中当前分类==all,说明要选中整个分类
									if (discountTypeIds[b].menu_ids == 'all') {
										// 选中分类
										currentYesNo = 1;
										// 选中菜品
										selectDis = 1;
									} else {
										// 获取到修改传过来的折扣菜品集合的长度，就是集合里面有几个菜品
										var leng = discountTypeIds[b].menu_ids.split(',').length;
										for (var k = 0;k<leng;k++) {
											if (discountTypeIds[b].menu_ids.split(',')[k] == data[i].menu_list[j].menu_id) {
												currentYesNo = 0;
												selectDis = 1;
												//alert('dd');
												currentSelect++;
											}
										}
									}
								}
							}
						}


						discountDis += '<li class="titleclass">'+
                                		'<input name="discount_input" type="checkbox" '+(discountTypeIds == 'all' ? 'checked=checked' : selectDis == 1 ? 'checked=checked' : '')+' value="'+data[i].menu_list[j].menu_id+'">'+data[i].menu_list[j].menu_name+
                            		'</li>';
                        numDis++;
					}

					discountDis += '</ul>';

					if (currentYesNo != 1) {
						// 判断如果当前分类菜品的数量 等于 当前分类选中了几个菜品，就说明当前分类所有菜品都被选中了，所以就把当前分类选中
						if (numDis == currentSelect) {
							currentYesNo = 1;
						} else {
							currentYesNo = 0;
						}
					}

					// 分类循环出来填充
					discountCl += '<li>'+
									'<input type="checkbox" '+(discountTypeIds == 'all' ? 'checked=checked' : currentYesNo == 1 ? 'checked=checked' : '')+' name="discount_input" value="'+i+'">'+
                                	'<a href="#'+i+num+'">'+data[i].menu_type+'</a>'+
                            	'</li>';

                    num++;

                 	/*// 在这里清零，是循环下一个分类的时候清零，这样循环下面这个分类的菜品就重新从零开始记录当前分类有几个菜品
	                    numDis = 0;
	                    // 在这里清零，是循环下一个分类的时候清零，这样循环下面当前分类选中了几个菜品就会从零开始
	                    currentSelect = 0;

	                    // 折扣菜品
						discountDis += '<ul class="neimargin">'+
										'<div class="dishesclass"><a name="'+i+num+'">'+data[i].menu_type+'</a></div>';

						for (var j in data[i].menu_list) {
							// 标识修改传过来的和当前菜品是否对应，当循环下一个菜品的时候，要清零0，变成不选中
							selectDis = 0;

							// 循环修改传过来的那几个菜品id
							for (var k = 0;k<leng;k++) {
								//alert(data[i].menu_list[j].menu_id);
								// 如果当前用户的授权门店 等于 循环中的某个checkbox
								if(discount_menu_type_ids.split(',')[k] == data[i].menu_list[j].menu_id){
									selectDis = 1;
									//alert('dd');
									currentSelect++;
								}
							}
							//alert(selectDis);
							discountDis += '<li class="titleclass">'+
	                                		'<input name="discount_input" type="checkbox" '+(selectDis == 1 ? 'checked=checked' : '')+' value="'+data[i].menu_list[j].menu_id+'">'+data[i].menu_list[j].menu_name+
	                            		'</li>';
	                        numDis++;
						}

						discountDis += '</ul>';
						// 判断如果当前分类菜品的数量 等于 当前分类选中了几个菜品，就说明当前分类所有菜品都被选中了，所以就把当前分类选中
						if (numDis == currentSelect) {
							currentYesNo = 1;
						} else {
							currentYesNo = 0;
						}

						// 分类循环出来填充
						discountCl += '<li>'+
										'<input type="checkbox" '+(currentYesNo == 1 ? 'checked=checked' : '')+' name="discount_input" value="'+i+'">'+
	                                	'<a href="#'+i+num+'">'+data[i].menu_type+'</a>'+
	                            	'</li>';
                    num++;*/
				}
				// 填充赠送菜品
				// 填充分类

				// 填充菜品
				$('#cfDishes').html(content);

				// 填充折扣菜品
				// 填充分类
				$('#discountClassif').html(discountCl);
				// 填充菜品
				$('#discountDishes').html(discountDis);

				this.PreferentiaBind();
			},

			// 效验要修改的数据
			dataCheck: function () {

	            if ( dataTest('#promoName', '#prompt-message', { 'empty': '不能为空'})
	            	// && dataTest('#startTime', '#prompt-message', { 'empty': '不能为空'})
	            	// && dataTest('#endTime', '#prompt-message', { 'empty': '不能为空'})
	                // && dataTest('#discountAmount', '#prompt-message', { 'sale': '必须为整数且不超过100'})
	            
	            ) {
	            	//alert('tt');
	                return true;
	            };

	            if ($('#discountAmount').val() !== '') {
	            	if ( dataTest('#discountAmount', '#prompt-message', { 'sale': '必须为整数且不超过100'})
		            
		            ) {
		            	//alert('tt');
		                return true;
		            }
	            };

	            return false;
			}
		}

		PreferentiaManageAdd.init();

});

