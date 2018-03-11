$(function () {

	// 门店后台    员工信息

		
        // 员工状态
        var staffStatus = 0;

        // 从缓存中得到用户是否有添加修改权限
        var perIsEdit = Cache.get('perIsEdit');
        // 添加修改员工
        var empjurisdiction = 0;// 0：有修改权限，1：没有权限
        // 身份列表
        var idejurisdiction = 0;// 0：有修改权限，1：没有权限

		// 判断如果等于undefined说明没有修改权限
		if (perIsEdit['员工添加修改'] == undefined) {
			jurisdiction = 1;
			// 添加新员工按钮不显示
			$('#permissions').addClass('hide');
		} else {
			jurisdiction = 0;
			// 添加新员工按钮显示
			$('#permissions').removeClass('hide');
		}

		// 判断如果等于undefined说明没有修改权限
		if (perIsEdit['员工身份列表'] == undefined) {
			idejurisdiction = 1;
		} else {
			idejurisdiction = 0;
		}

		// 如果添加修改员工和身份列表都没有权限，就隐藏标题（操作）
		if (jurisdiction == 1 && idejurisdiction == 1) {
			// 不显示标题（操作）
			$('#operation').addClass('hide');
		} else {
			// 显示标题（操作）
			$('#operation').removeClass('hide');
		}

		var EmployeesManage = {

			init: function () {
				// 是否从添加修改 返回回来的
				if (getQueryString('is_select') == 1) {
					this.clickLabel(parseFloat(getQueryString('type')));
				} else {
					// 显示员工数据，默认显示正常
					this.selectEmployees(staffStatus);
				}

				// 绑定点击事件
				this.EmployeesBind();
			},

			// 默认显示正常的员工列表
			selectEmployees: function (staffStatus) {
				// 请求显示列表数据之前先清空列表数据
				$('#tbodys').html('');
				
				var self = this;
                setAjax(AdminUrl.staffStaffList, {
                    'staff_status': staffStatus
                }, ndPromptMsg, {20: ''}, function(respnoseText) {
					if (respnoseText.code == 20) {
						// 得到返回数据
	                    var data = respnoseText.data;
						self.shopManageList(data);
					} else {
						displayMsg(ndPromptMsg, respnoseText.message, 2000);
					}
                }, 0);	
			},

			// 显示数据
			shopManageList: function (data) {
				var content	= '';

				for (var i in data) {
						content += '<tr class="total-tr" a-user-id="'+data[i].a_user_id+'">'+
				                        '<td class="total-shopnametxt" data-type="aUserDid">'+data[i].a_user_did+'</td>'+
				                        '<td class="total-tel" data-type="aUserName">'+data[i].a_user_name+'</td>'+
				                        '<td class="total-tel" data-type="aUserNickname">'+data[i].a_user_nickname+'</td>'+
				                        '<td class="total-tel" data-type="aUserMobile">'+data[i].a_user_mobile+'</td>'+
				                        '<td class="total-tel hide" data-type="a_user_organization">'+data[i].a_user_organization+'</td>'+
				                        (jurisdiction == 1 && idejurisdiction == 1 ? '' :
										'<td class="total-caozuo clearfix">'+
				                        	(jurisdiction == 1 ? '' :
				                            '<span>'+
				                            	'<input type="button" value="修改" data-type="update" id="updateBtn" class="stores-caozuo-btn">'+
				                            '</span>')+
				                            (idejurisdiction == 1 ? '' :
				                            '<span class="btn-jianju">'+
				                            	'<input type="button" value="身份" data-type="iden" class="stores-caozuo-btn">'+
				                            '</span>')+
				                        '</td>')+
				                    '</tr>';
				}
				// 添加到页面中
				$('#tbodys').html(content);
			},

			// 绑定点击事件
			EmployeesBind: function () {
				var _self = this;

				// 点击修改
				$('#tbodys').delegate('tr', 'click', function(event) {
                    var self = this,
                    aUserId = $(self).attr('a-user-id'),
                    type = $(event.target).attr('data-type');

                    if (type == 'update') {
	                    // 点击修改的时候，创建一个数据，存储要修改的这一行的信息，然后存到缓存中，到修改页面取出来填充到页面中去
	                    var aUserDid = $(self).find('td[data-type="aUserDid"]').text();
	                    var aUserName =$(self).find('td[data-type="aUserName"]').text();
	                    var aUserMobile =$(self).find('td[data-type="aUserMobile"]').text();
	                    var aUserNickname = $(self).find('td[data-type="aUserNickname"]').text();
	                    var empUp = {
							'a_user_id': aUserId,
							'a_user_did': aUserDid,
							'a_user_name': aUserName,
							'a_user_nickname': aUserNickname,
							'a_user_mobile': aUserMobile,
							'staff_status': staffStatus,
							'a_user_organization':a_user_organization
	                    };
	                    Cache.set('empUp',empUp);

						window.location.replace('shopEmployeesEdit.html?a_user_id='+aUserId+'&type='+staffStatus);
					} else if (type == 'iden') {// 点击身份
						// 把员工姓名获取过来，然后传到下个页面
						var aUserNameIde =$(self).find('td[data-type="aUserName"]').text();
	                    var a_user_organization = $(self).find('td[data-type="a_user_organization"]').text();
						Cache.set('aUserNameIde',aUserNameIde);
						Cache.set('a_user_organization',a_user_organization);
						window.location.replace('shopEmpIdentity.html?a_user_id='+aUserId+'&type='+staffStatus);
					}
				});

				// 点击添加
				$('#consumebtn').unbind('click').bind('click', function () {
					window.location.replace('shopEmployeesEdit.html?type='+staffStatus);
				});

				// 点击支付方式列表
				$('#normal').unbind('click').bind('click', function () {
					_self.clickLabel(0);
				});

				// 点击下架列表
				$('#shelves').unbind('click').bind('click', function () {
					_self.clickLabel(1);
				});
			},

			// 点击标签页显示隐藏 调用数据
			clickLabel: function (type) {
				var _self = this;

				switch(type) {
					case 0:
						// 点击支付方式列表，删除不选中的样式，添加选中的样式
						$('#normal').removeClass('caipin-fenleinucheck');
						$('#normal').addClass('caipin-fenleicheck');
						// 下架列表，删除选中样式，添加不选中的样式
						$('#shelves').removeClass('caipin-fenleicheck');
						$('#shelves').addClass('caipin-fenleinucheck');

						_self.selectEmployees(0);
						staffStatus = 0;
					break;
					case 1:
						// 点击下架列表，删除不选中的样式，添加选中的样式
						$('#shelves').removeClass('caipin-fenleinucheck');
						$('#shelves').addClass('caipin-fenleicheck');
						// 支付方式列表，删除选中样式，添加不选中的样式
						$('#normal').removeClass('caipin-fenleicheck');
						$('#normal').addClass('caipin-fenleinucheck');

						_self.selectEmployees(1);
						staffStatus = 1;
					break;
				}
			}


		}

		EmployeesManage.init();

});
