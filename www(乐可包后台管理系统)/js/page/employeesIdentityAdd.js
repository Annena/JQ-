$(function () {
	// 员工管理 --- 员工身份--修改添加身份

        // 获取到修改传过来的shop_id
		var statusId = getQueryString('status_id');
		// 获取到添加和修改传过来的
		var aUserIdADD = getQueryString('a_user_id');
		//门店名称
		var shopName = decodeURIComponent(getQueryString('shopName'))
		// 获取到修改传过来的缓存
		var dataPro = Cache.get('ideUp');
		// 判断是修改还是添加 0；添加，1：修改
		var addIsUp = 0;
		var shifou = ''
		// 获取到传过来的员工姓名缓存
		var aUserNameIde = Cache.get('aUserNameIde');
		// 根据规则，管理员和总部观察员身份只能选择授权总部，其他身份可以授权其他门店不能授权总部
		// 适用门店
		var shopIds = '';
		var shopName =  Cache.get('selectData');
		var EmployeesIdentityAdd = {

			init: function () {

				// 判断是修改还是添加
				if (statusId != null && statusId != undefined && dataPro != null && dataPro != undefined) {
					// 身份不可修改 
                    $('#statusList').attr('disabled','disabled');
					// 适用门店
					shopIds = dataPro.shop_ids;
					$('#addAndedit').text('身份修改');
					$('#statusList').addClass('nav-selectcheck');
					addIsUp = 1;
					// 显示数据
					this.EmployeesAddList(dataPro);
					this.selectDateMembers(dataPro.status_id);
				} else {
					// 身份可修改，去除不可修改属性
					$('#tuidan').remove()
                    $('#statusList').removeAttr('disabled');
					$('#addAndedit').text('身份添加');
					addIsUp = 0;
				}

				// 显示所有店铺数据
				this.shopData();
				this.shenfenData();
				//alert(aUserNameIde);
				// 员工姓名 添加修改都显示，并且不能修改
				$('#aUserNameIde').val(aUserNameIde);
				// 绑定点击事件
				this.EmployeesAddBind();
			},

			// 显示数据
			EmployeesAddList: function (data) {
				// 显示数据
				// 员工id
				//$('#aUserId').val(data.a_user_id);
				// 身份id
				$('#statusList').val(data.status_id);
				
				// 适用门店
				//var shopIds = data.shop_names;
				// 找到列表中所有的checkbox，然后循环每个checkbox，
				/*$('#shopList li input[type="checkbox"]').each(function(i,val){
					// 如果当前用户的授权门店 等于 循环中的某个checkbox
					if(shopIds.split(',')[i] == val.name){
						// 选中当前的checkbox
						$(this).attr('checked','checked');
					}
				});*/

				// 缓存中的数据取出之后删除
				Cache.del('ideUp');
			},

			// 绑定点击事件
			EmployeesAddBind: function () {
				var _self = this;
				// 点击修改
				$('#updatebtn').unbind('click').bind('click', function () {
					if (addIsUp == 0) {
						_self.employeesAdd();
					} else if (addIsUp == 1) {
						_self.employeesUpdate(dataPro);
					}
				});
				//查看权限
				$('#preInfor').unbind('click').bind('click',  function() {
					displayAlertMessage('#confirm-message','#cancel-confirm');
					//身份的id
					var statusListId = $('#statusList').val();
					if(statusList != undefined || statusList != '' || statusList != null){
						//权限名字确定
						$('#permName').text($('#statusList').find("option:selected").text())
						//查询并添加数据
						_self.selectDateMembers(statusListId);
					}
				});
				//点击取消权限弹框, 
				$('#other-logoin').unbind('click').bind('click',  function() {
					layer.close(layerBox);
				});
				// 点击取消
				$('#exitbtn').unbind('click').bind('click', function () {
					//Cache.set('aUserIdADD',aUserIdADD);
					window.location.replace('empIdentity.html?a_user_id='+aUserIdADD);
				});
				// 点击身份列表
				$('#empIdentitylist').unbind('click').bind('click', function () {
					window.location.replace('empIdentity.html?a_user_id='+aUserIdADD);
				});
				// 身份的值改变的时候
				$('#statusList').change(function(){
					var stat = $('#statusList option:selected').attr('status_type');
					var category = $('#statusList option:selected').attr('status_category');
					if(category == 1) {
						$('#depotList').addClass('hide');
						if (stat == 2) {
							$('#shopMain').removeClass('hide');
							$('#shopList').removeClass('hide');
							$('#suoshul').addClass('hide');
							$('#shouquan').removeClass('hide');
							shifou = '';
						} else if(stat == 1){
							$('#shopMain').addClass('hide');
							$('#shopList').addClass('hide');
							$('#suoshul').removeClass('hide');
							$('#shouquan').addClass('hide');
							$('#suoshu').text(shopName.aUserOrganizationName);
							shifou = 2;
						}else if(stat == 3){
							$('#suoshul').removeClass('hide');
							$('#shouquan').addClass('hide');
							$('#shopMain').addClass('hide');
							$('#shopList').addClass('hide');
							$('#suoshu').text(shopName.aUserOrganizationName);
							shifou = 1;
						}
					} else if(category == 2) {
						if(stat == 0){
							$('#shopMain').addClass('hide');
							$('#shopList').addClass('hide');
							$('#suoshul').removeClass('hide');
							$('#shouquan').addClass('hide');
							$('#suoshu').text(shopName.aUserOrganizationName);
							shifou = 2;
						}else if(stat == 3){
							$('#suoshul').removeClass('hide');
							$('#shouquan').addClass('hide');
							$('#shopMain').addClass('hide');
							$('#shopList').addClass('hide');
							$('#suoshu').text(shopName.aUserOrganizationName);
							shifou = 1;
						} else {
							_self.depotData(stat);
							// $('#shopMain').removeClass('hide');
							$('#depotList').removeClass('hide');
							$('#suoshul').addClass('hide');
							$('#shopList').addClass('hide');
							$('#shouquan').removeClass('hide');
							shifou = '';
						}
					}
				});
			},
			//查询可添加身份
			shenfenData : function(){
				var _self = this;
                setAjax(AdminUrl.user_status_list, {
                    'a_user_id':aUserIdADD,
                }, $('#prompt-message'), {20: ''}, function(respnoseText) {
					// 得到返回数据
                    if(respnoseText.code == 20){
                    	var data = respnoseText.data;
                    	var content = ''
                    	for (var i in data) {
                    		content += '<option status_type="'+data[i].status_type+'" value="'+data[i].status_id+'" status_category="' + data[i].status_category + '">'+data[i].status_name+'</option>'
                    	}
                    	$('#statusList').html(content)
                    	if(addIsUp == 1){
                		    $('#statusList').val(dataPro.status_id);
                		    var stat = $('#statusList option:selected').attr('status_type');
                		    var category = $('#statusList option:selected').attr('status_category');
                		    if(category == 1) {
                		    	$('#depotList').addClass('hide');
                		    	if (stat == 2) {
                		    		$('#shopMain').removeClass('hide');
                		    		$('#shopList').removeClass('hide');
                		    		$('#suoshul').addClass('hide');
                		    		$('#shouquan').removeClass('hide');
                		    		shifou = '';
                		    	} else if(stat == 1){
                		    		$('#shopMain').addClass('hide');
                		    		$('#shopList').addClass('hide');
                		    		$('#suoshul').removeClass('hide');
                		    		$('#shouquan').addClass('hide');
                		    		$('#suoshu').text(shopName.aUserOrganizationName);
                		    		shifou = 2;
                		    	}else if(stat == 3){
                		    		$('#suoshul').removeClass('hide');
                		    		$('#shouquan').addClass('hide');
                		    		$('#shopMain').addClass('hide');
                		    		$('#shopList').addClass('hide');
                		    		$('#suoshu').text(shopName.aUserOrganizationName);
                		    		shifou = 1;
                		    	}
                		    } else if(category == 2) {
                		    	if(stat == 0){
                		    		$('#shopMain').addClass('hide');
                		    		$('#shopList').addClass('hide');
                		    		$('#suoshul').removeClass('hide');
                		    		$('#shouquan').addClass('hide');
                		    		$('#suoshu').text(shopName.aUserOrganizationName);
                		    		shifou = 2;
                		    	}else if(stat == 3){
                		    		$('#suoshul').removeClass('hide');
                		    		$('#shouquan').addClass('hide');
                		    		$('#shopMain').addClass('hide');
                		    		$('#shopList').addClass('hide');
                		    		$('#suoshu').text(shopName.aUserOrganizationName);
                		    		shifou = 1;
                		    	} else {
                		    		_self.depotData(stat);
                		    		// $('#shopMain').removeClass('hide');
                		    		$('#depotList').removeClass('hide');
                		    		$('#suoshul').addClass('hide');
                		    		$('#shopList').addClass('hide');
                		    		$('#shouquan').removeClass('hide');
                		    		shifou = '';
                		    	}
                		    }
							// $('#shopMain').removeClass('hide');
							// $('#shopList').removeClass('hide');
							// $('#suoshul').addClass('hide')
						} else {
							var stat = $('#statusList option:selected').attr('status_type');
							var category = $('#statusList option:selected').attr('status_category');
							if (stat == 2) {
								$('#shopMain').removeClass('hide');
								$('#shopList').removeClass('hide');
								$('#suoshul').addClass('hide');
								$('#shouquan').removeClass('hide');
								shifou = '';
							} else if(stat == 1){
								$('#shopMain').addClass('hide');
								$('#shopList').addClass('hide');
								$('#suoshul').removeClass('hide');
								$('#shouquan').addClass('hide');
								$('#suoshu').text(shopName.aUserOrganizationName);
								shifou = 2;
							}else if(stat == 3){
								$('#suoshul').removeClass('hide');
								$('#shouquan').addClass('hide');
								$('#shopMain').addClass('hide');
								$('#shopList').addClass('hide');
								$('#suoshu').text(shopName.aUserOrganizationName);
								shifou = 1;
							}
						}
                    }else{
                    	displayMsg($('#prompt-message'), respnoseText.message, 2000);
                    }
                }, 0);
			},
			//权限Ajax查询
        	selectDateMembers: function(id) {
            	var self = this;
            	setAjax(AdminUrl.staffStaffStatusPermList, {
                    'status_id': id
                },  $('#prompt-message'), { 20: '' }, function(respnoseText) {
                // 得到返回数据
                	var data = respnoseText.data;
                	if (respnoseText.code == 20) {
                    	nowData = data
                    	self.getPermData(data);
                	} else {
                    	displayMsgTime(ndPromptMsg, respnoseText.message, 2000);
                	}
            	}, 0);
        	},
			//查询该身份所拥有的权限
			getPermData : function(data){
				var content = '';
	
                    for(var key in data){
                    	//判断权限
                    	if(key == 'shop'){
                    		content += '<div class="powerShop"><div class="powerShop_t">'+'门店管理'+'</div>'+
                    		'<p>'+data[key].toString().replace(/,/g, '，')+'</p>'+'</div>'
                    	}
                    	if(key == 'cashier'){
                    		content += '<div class="powerCashier"><div class="powerCashier_t">'+'收银系统'+'</div>'+
                    		'<p>'+data[key].toString().replace(/,/g, '，')+'</p>'+'</div>'
                    	}
                    	if(key == 'admin'){
                    		content += '<div class="powerAdmin"><div class="powerAdmin_t">'+'总部管理'+'</div>'+
                    		'<p>'+data[key].toString().replace(/,/g, '，')+'</p>'+'</div>'
                    	}
                    	if(key == 'm_admin'){
                    		content += '<div class="powerM_Admin"><div class="powerM_Admin_t">'+'商户版'+'</div>'+
                    		'<p>'+data[key].toString().replace(/,/g, '，')+'</p>'+'</div>'
                    	}
                    	if(key == 'depot'){
                    		content += '<div class="powerSupplyChain"><div class="powerSupplyChain_t">'+'供应链'+'</div>'+
                    		'<p>'+data[key].toString().replace(/,/g, '，')+'</p>'+'</div>'
                    	}
                    	if(key == 'pos'){
                    		content += '<div class="powerPos"><div class="powerPos_t">'+'点菜宝'+'</div>'+
                    		'<p>'+data[key].toString().replace(/,/g, '，')+'</p>'+'</div>'
                    	}
                    	                  	                    	                    	                   	
                    }
                     $('#confirm').html(content); 
			},
			// 添加
			employeesAdd: function () {
				var _self = this;
				var stat = $('#statusList option:selected').attr('status_type');
				var category = $('#statusList option:selected').attr('status_category');

				// 获取到各个数据，请求接口提交数据
				var self = this;
				// 身份id
				var statusList = $('#statusList').val();
				// 获取身份的名称
				var statusListPro = $('#statusList').find("option:selected").text();
				// 门店
				var shopIds = '';
				if($('#shopMain input').is(':checked')){
					shopIds = 'ssssssssssss,'
				}
				if(category == 1) {
					if(stat == 3){
						shopIds = 'all';
					} else if (stat == 1) {
						shopIds = 'ssssssssssss';
					} else if(stat == 2){
						// 所有门店是all否被选中 0：没有选中，1：选中了
						var isAll = 0;
						// 找到列表中所有的checkbox，然后循环每个checkbox，
						$('#shopList li input[type="checkbox"]').each(function(i,val){
							// 如果所有门店all被选中了
							if($('#all').is(':checked') || $('#all').attr('checked') == true){
								isAll = 1;
							} else {
								// 如果当前循环出来所有门店all之外的checkbox 被选中了
								if($(this).is(':checked')){
									// 就把checkbox中的名字取出来，并用逗号拼接起来
									shopIds += val.value+',';
								}	
							}
						});
						// 如果所有门店被选中了
						if (isAll == 1){
							if($('#shopMain input').is(':checked')){
								shopIds = 'all,ssssssssssss';
							}else{
								shopIds = 'all'
							}
						} else {
							// 因为用逗号拼接起来，这个字符串最后会带一个逗号，所以用substring把除去最后一个逗号之外的字符取出来
							shopIds = shopIds.substring(0,shopIds.length-1);
						}
						if (!$('#shopList li input[type="checkbox"]').is(':checked') && !$('#shopMain input').is(':checked')){
							displayMsg($('#prompt-message'), '请选择授权门店!', 2000);
							return;
						}
					}
				} else if(category == 2) {
					if(stat == 3){
						shopIds = 'all';
					} else if (stat == 0) {
						shopIds = 'ssssssssssss';
					} else {
						_self.depotData(stat);
						// 所有门店是all否被选中 0：没有选中，1：选中了
						var isAlls = 0;
						$('#depotList li input[type="checkbox"]').each(function(i,val){
							// 如果所有门店all被选中了
							if($('#alldepot').is(':checked') || $('#alldepot').attr('checked') == true){
								isAlls = 1;
							} else {
								// 如果当前循环出来所有门店all之外的checkbox 被选中了
								if($(this).is(':checked')){
									// 就把checkbox中的名字取出来，并用逗号拼接起来
									shopIds += val.value+',';
								}	
							}
						});
						// 如果所有门店被选中了
						if (isAlls == 1){
							shopIds = 'all'
						} else {
							// 因为用逗号拼接起来，这个字符串最后会带一个逗号，所以用substring把除去最后一个逗号之外的字符取出来
							shopIds = shopIds.substring(0,shopIds.length-1);
						}
						if (!$('#depotList li input[type="checkbox"]').is(':checked') && !$('#shopMain input').is(':checked')){
							displayMsg($('#prompt-message'), '请选择授权仓库!', 2000);
							return;
						}
					}
				}

                setAjax(AdminUrl.staffStaffStatusAdd, {
                    'a_user_id': aUserIdADD,
                    'status_id': statusList,
                    'shop_ids': shopIds
                }, $('#prompt-message'), {20: ''}, function(respnoseText) {
					// 得到返回数据
                    var data = respnoseText.data;	
                    
                    window.location.replace('empIdentity.html?a_user_id='+aUserIdADD);
                }, 2);
			},

			// 修改
			employeesUpdate: function (data) {
				var stat = $('#statusList option:selected').attr('status_type');
				var category = $('#statusList option:selected').attr('status_category');
				// 获取到各个数据，请求接口提交数据
				var self = this;

				// 员工id
				var aUserId = data.a_user_id;
				// 身份id
				var statusList = $('#statusList').val();
				// 获取身份的名称
				var statusListPro = $('#statusList').find("option:selected").text();
				// 门店
				var shopIds = '';
				if($('#shopMain input').is(':checked')){
					shopIds = 'ssssssssssss,'
				}
				if(category == 1) {
					if(stat == 3){
						shopIds = 'all';
					} else if (stat == 1) {
						shopIds = 'ssssssssssss';
					} else if(stat == 2){
						// 所有门店是all否被选中 0：没有选中，1：选中了
						var isAll = 0;
						// 找到列表中所有的checkbox，然后循环每个checkbox，
						$('#shopList li input[type="checkbox"]').each(function(i,val){
							// 如果所有门店all被选中了
							if($('#all').is(':checked') || $('#all').attr('checked') == true){
								isAll = 1;
							} else {
								// 如果当前循环出来所有门店all之外的checkbox 被选中了
								if($(this).is(':checked')){
									// 就把checkbox中的名字取出来，并用逗号拼接起来
									shopIds += val.value+',';
								}	
							}
						});
						// 如果所有门店被选中了
						if (isAll == 1){
							if($('#shopMain input').is(':checked')){
								shopIds = 'all,ssssssssssss';
							}else{
								shopIds = 'all'
							}
						} else {
							// 因为用逗号拼接起来，这个字符串最后会带一个逗号，所以用substring把除去最后一个逗号之外的字符取出来
							shopIds = shopIds.substring(0,shopIds.length-1);
						}
						if (!$('#shopList li input[type="checkbox"]').is(':checked') && !$('#shopMain input').is(':checked')){
							displayMsg($('#prompt-message'), '请选择授权门店!', 2000);
							return;
						}
					}
				} else if(category == 2) {
					if(stat == 3){
						shopIds = 'all';
					} else if (stat == 0) {
						shopIds = 'ssssssssssss';
					} else {
						self.depotData(stat);
						// 所有门店是all否被选中 0：没有选中，1：选中了
						var isAlls = 0;
						$('#depotList li input[type="checkbox"]').each(function(i,val){
							// 如果所有门店all被选中了
							if($('#alldepot').is(':checked') || $('#alldepot').attr('checked') == true){
								isAlls = 1;
							} else {
								// 如果当前循环出来所有门店all之外的checkbox 被选中了
								if($(this).is(':checked')){
									// 就把checkbox中的名字取出来，并用逗号拼接起来
									shopIds += val.value+',';
								}	
							}
						});
						// 如果所有门店被选中了
						if (isAlls == 1){
							// if($('#shopMain input').is(':checked')){
							// 	shopIds = 'all,ssssssssssss';
							// }else{
							// 	shopIds = 'all'
							// }
							shopIds = 'all'
						} else {
							// 因为用逗号拼接起来，这个字符串最后会带一个逗号，所以用substring把除去最后一个逗号之外的字符取出来
							shopIds = shopIds.substring(0,shopIds.length-1);
						}
						if (!$('#depotList li input[type="checkbox"]').is(':checked') && !$('#shopMain input').is(':checked')){
							displayMsg($('#prompt-message'), '请选择授权仓库!', 2000);
							return;
						}
					}
				}

                setAjax(AdminUrl.staffStaffStatusUpdate, {
                    'a_user_id': aUserId,
                    'status_id': statusList,
                    'shop_ids': shopIds
                }, $('#prompt-message'), {20: ''}, function(respnoseText) {
					// 得到返回数据
                    var data = respnoseText.data;	
                    
                    window.location.replace('empIdentity.html?a_user_id='+aUserId);
                }, 2);
			},

			// 仓库数据
			depotData: function (status_type) {
				var self = this;
				//alert(shopStatusList);
                setAjax(AdminUrl.shopDepotList, {
                	'status_type': status_type
                }, $('#prompt-message'), {20: ''}, function(respnoseText) {
					// 得到返回数据
                    var data = respnoseText.data;
					self.shopList(data, '#depotList', 'alldepot', '所有仓库');
                }, 0);
			},
			// 三级级联显示店铺
			shopData: function () {
				var self = this;
				//alert(shopStatusList);
                setAjax(AdminUrl.shopShopList, {
                	'type': 1
                }, $('#prompt-message'), {20: ''}, function(respnoseText) {
					// 得到返回数据
                    var data = respnoseText.data;
					self.shopList(data, '#shopList', 'all', '所有门店');

                }, 0);
			},
			// 显示店铺、仓库
			shopList: function (data, shopList, alldepot, allname) {
					//alert(shopIds);
					var content = '<li>'+
										'<input name="all" type="checkbox" '+(shopIds.indexOf('all') > -1 ? 'checked=checked' : '' )+' id="' + alldepot + '" value="all">'+ allname
									'</li>';
					// 填充另一个ul
					var conMain = '';

					for (var i in data) {
						// 如果是总部的话，就填充到另一个ul
						if (data[i].shop_name == '总部') {
							conMain = '<li><input type="checkbox" name="'+data[i].shop_name+'" value="'+data[i].shop_id+'">'+data[i].shop_name+'</li>';
							continue;
						}
						content += '<li>'+
										'<input name="'+data[i].shop_name+'" type="checkbox" value="'+data[i].shop_id+'">'+data[i].shop_name+
									'</li>';
					}
					// 添加到页面中
					$(shopList).html(content);
					// 填充到另一个ul(总部)
					$('#shopMain').html(conMain);

					// 找到列表中所有的checkbox，然后循环每个checkbox，
					$(shopList).find('li input[type="checkbox"]').each(function(i,val){
						if (shopIds.indexOf('all') > -1) {
							$(this).attr('checked','checked');
						} else {
							var leng = shopIds.split(',').length;
							for (var i = 0;i<leng;i++) {
								// 如果当前用户的授权门店 等于 循环中的某个checkbox
								if(shopIds.split(',')[i] == val.value){
									// 选中当前的checkbox
									$(this).attr('checked','checked');
								}
							}
						}
					});
					$('#shopMain li input[type="checkbox"]').each(function(i,val){
						var leng = shopIds.split(',').length;
						for (var i = 0;i<leng;i++) {
								// 如果当前用户的授权门店 等于 循环中的某个checkbox
								if(shopIds.split(',')[i] == val.value){
									// 选中当前的checkbox
									$(this).attr('checked','checked');
								}
							}
					})

			// 调用public.js中公共的方法（点击全选，选中所有的，点击其中某一个，如果这时候是全选就把全选取消）
					selectShopAll($(shopList), $(shopList).find('li input[type="checkbox"]'), $('#' + alldepot));
			}
		}

		EmployeesIdentityAdd.init();

});

