$(function () {

	// 员工管理---员工身份列表



        // 获取到修改传过来的a_user_id
		var aUserId = getQueryString('a_user_id');
		var status_type = {} //身份ID临时数据
 		// 获取到传过来的员工姓名缓存
		var aUserNameIde = Cache.get('aUserNameIde');
        // 从缓存中得到用户是否有添加修改权限
        var perIsEdit = Cache.get('perIsEdit');


		var EmployeesIdentity = {

			init: function () {
				// 判断如果等于undefined说明没有添加修改权限
				if (perIsEdit['员工身份添加修改'] == undefined) {
					$('#permissions').addClass('hide');
					$('#operation').addClass('hide');
				} else {
					$('#permissions').removeClass('hide');
					$('#operation').removeClass('hide');
				}
				// 显示数据
				this.EmployeesData(aUserId);
				// 绑定点击事件
				this.EmployeesBind();
			},


			// 显示数据
			EmployeesData: function (aUserId) {
				var self = this;
                setAjax(AdminUrl.staffStaffStatusList, {
                    'a_user_id': aUserId
                }, $('#prompt-message'), {20: ''}, function(respnoseText) {
					// 得到返回数据
                    var data = respnoseText.data;
                    self.EmployeesList(data);

                }, 1);
			},

			// 显示数据
			EmployeesList: function (data) {
                setAjax(AdminUrl.user_status_list, {
                    'a_user_id': aUserId
                }, $('#prompt-message'), {20: ''}, function(respnoseText) {
					// 得到返回数据
                    status_type = respnoseText.data;
					var content = '';	
					for (var i in data) {
						var lala = 0;
						for (var k in status_type) {
							if(data[i].status_name == status_type[k].status_name){
								if(status_type[k].status_category == 1 && status_type[k].status_type == 2){
									lala = 1;
								} 
								if(status_type[k].status_category == 2 && (status_type[k].status_type == 1 || status_type[k].status_type == 2 || status_type[k].status_type == 4)) {
									lala = 1;
								}
							}
						}
						content += '<tr class="total-tr" status-id="'+data[i].status_id+'" staus_name="'+data[i].status_name+'">'+
				                        '<td class="shopnametxt report_text" data-type="aUserNameIde">'+aUserNameIde+'</td>'+
				                        '<td class="total-tel report_text" data-type="shopNames">'+data[i].shop_names+'</td>'+
				                        '<td class="hide " data-type="shopIds">'+data[i].shop_ids+'</td>'+
				                        '<td data-name="shopName" class="shopnametxt preInfor report_text" data-type="preInfor">'+data[i].status_name+'</td>'+
				                        (perIsEdit['员工身份添加修改'] == undefined ? '' :
				                        '<td class="total-caozuo clearfix">'+
				                            '<span>'+
				                            	(lala == 1 ? '<input type="button" value="修改" data-type="update" class="stores-caozuo-btn">' : '')+
				                            '</span>'+
											'<span>'+
				                            	'<input type="button" value="删除" data-type="delete" class="stores-caozuo-quxiao-btn">'+
				                            '</span>'+
				                        '</td>')+
				                    '</tr>';
					}
					// 添加到页面中
					$('#tbodys').html(content);
				}, 1);	
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

			// 绑定点击事件
			EmployeesBind: function () {

				//查看权限中的取消图标和确认按钮
				$('#other-logoin').unbind('click').bind('click',  function() {
					// $('#confirm-message').addClass('hide');
					layer.close(layerBox);
				});

				// 点击修改
				$('#tbodys').delegate('tr', 'click', function(event) {
                    var self = this,
                    statusId = $(self).attr('status-id'),
                    StatusName = $(self).attr('staus_name'),
                    type = $(event.target).attr('data-type');

                    if (type == 'update') {
	                    // 点击修改的时候，创建一个数据，存储要修改的这一行的信息，然后存到缓存中，到修改页面取出来填充到页面中去
	                    // 员工姓名和门店
	                    var shopIds = $(self).find('td[data-type="shopIds"]').text();
	                    var aUserNameIdePro =$(self).find('td[data-type="aUserNameIde"]').text();
	                    //alert(aUserId);
	                    var ideUp = {
							'shop_ids': shopIds,
							'aUserNameIde': aUserNameIdePro,
							'a_user_id': aUserId,
							'status_id': statusId
	                    };
	                    //alert(data.a_user_id);
	                    Cache.set('ideUp',ideUp);

						window.location.replace('empIdentityEdit.html?status_id='+statusId+'&a_user_id='+aUserId);
					} else if (type == 'delete') {
						//$(self).unbind('click');
						//第一个是弹出层id   第二个是叉号id
						$('#alert-content').html('您确定要删除员工的身份吗？');
				        displayAlertMessage('#alert-message', '#cancel-alert');

				        // 点击确认删除,在绑定点击事件delegate里面加click点击事件不能用
				        // $('#definite-alert').click(function({这个因为这样就会造成，我点击一次点击事件在点击一次点击事件，点确认删除，就会执行两次点击事件，所以要用unbind、bind，先取消前一个点击事件，在绑定点击事件，这样就可以了
				        $('#definite-alert').unbind('click').bind('click', function () {
			                setAjax(AdminUrl.staffStaffStatusDel, {
								'a_user_id': aUserId,
			                    'status_id':statusId
			                }, $('#prompt-message'), {20: ''}, function(respnoseText) {
								// 得到返回数据
			                    var data = respnoseText.data;
			                    layer.close(layerBox);
			                    $(self).remove();
			                    displayMsg($('#prompt-message'), '删除成功!', 2000);
			                    //window.location.replace('printerManage.html');
			                }, 0);
				        });
					} else if(type == 'preInfor'){
						displayAlertMessage('#confirm-message','#cancel-confirm');
						// $('#confirm-message').removeClass('hide');
						//身份的id
						var statusListId = statusId;
						//显示身份
						$('#permName').text(StatusName);
						//查询并添加数据
						EmployeesIdentity.selectDateMembers(statusListId);
					}
				});

				// 点击添加
				$('#addbtn').unbind('click').bind('click', function () {
					var shopName = $(self).find('td[data-name="shopName"]').text();
					window.location.replace('empIdentityEdit.html?a_user_id='+aUserId+'&shopName='+shopName);
				});


			} 
		}

		EmployeesIdentity.init();

});
