$(function () {

	// 桌台列表
	var CID = $.cookie("cid");
	//获取权限
	//获取权限
	// var is_up = authority_judgment('tablesEdit');	// 是否有修改权限 0 否 1 是
	// if (is_up == 0) {
	// 	$('#add_table').addClass('hide');
	// }

	var shop_id = getQueryString('shop_id');
	var is_select = getQueryString('is_select');


	$('#shop_list').attr('href', 'shopManage.html?is_select='+is_select);

	// 显示数据
	TablesData();
	// 绑定点击事件
	TablesBind();

	// 请求显示数据
	function TablesData () {
        setAjax(AdminUrl.tableList, {
			'shop_id': shop_id
        }, $('#prompt-message'), {20: ''}, function(respnoseText) {
			if (respnoseText.code == 20) {
				// 得到返回数据
                var data = respnoseText.data;
                // 显示数据
                TablesList(data);
			} else {
				displayMsg(ndPromptMsg, respnoseText.message, 2000);
			}
        }, 0);
	}

	// 显示数据
	function TablesList (data) {
			var content = '';

			for (var i in data) {
				    
				content +=  '<tr class="total-tr" table-id="'+data[i].table_id+'">'+
		                        '<td data-type="tableName">'+data[i].table_name+'</td>'+
		                        '<td>'+(data[i].table_type == 1 ? '大厅' : '包间')+'</td>'+
		                        '<td class="hide" data-type="tableType">'+data[i].table_type+'</td>'+
		                        '<td class="hide" data-type="scanCode">' +data[i].barcode+ '</td>' +
		                        '<td  data-type="tableSeatNum">'+data[i].table_seat_num+'</td>'+
		                        '<td>'+(data[i].region_id == '' || data[i].region_id == null ? '无' : data[i].region_name)+'</td>'+
		                        '<td class="hide" data-type="region_name">'+data[i].region_name+'</td>'+
		                        '<td >'+(data[i].d_printer_name == '' || data[i].d_printer_name == null ? '无' : data[i].d_printer_name)+'</td>'+
		                        '<td >'+(data[i].y_printer_name == '' || data[i].y_printer_name == null ? '无' : data[i].y_printer_name)+'</td>'+
		                        '<td class="hide" data-type="d_printer">'+data[i].d_printer+'</td>'+
		                        '<td class="hide" data-type="y_printer">'+data[i].y_printer+'</td>'+
		                        '<td class="hide"   data-type="region_id">'+data[i].region_id+'</td>'+
		                        '<td class="total-shopnametxt" data-type="tableInfo">'+data[i].table_info+'</td>'+
		                        //(is_up == 0 ? '' :
		                        '<td class="total-caozuo clearfix">'+
		                            '<span>'+
		                                '<input type="button" value="修改" data-type="update" class="stores-caozuo-btn">'+
		                            '</span>'+
		                            '<span class="btn-jianju">'+
		                                '<input type="button" value="删除" data-type="delete" class="stores-caozuo-delbtn">'+
		                            '</span>'+
		                        '</td>'+//)+
		                    '</tr>';
			}
			// 添加到页面中
			$('#tbodys').html(content);
	}

	// 绑定点击事件
	function TablesBind () {
		// 点击修改
		$('#tbodys').delegate('tr', 'click', function(event) {
            var self = this,
            tableId = $(self).attr('table-id'),
            type = $(event.target).attr('data-type');

            if (type == 'update') {
                // 点击修改的时候，创建一个数据，存储要修改的这一行的信息，然后存到缓存中，到修改页面取出来填充到页面中去
                // 桌台名称
                var tableName = $(self).find('td[data-type="tableName"]').text();
                // 桌台类型
                var tableType =$(self).find('td[data-type="tableType"]').text();
                // 桌位数量
                var tableSeatNum =$(self).find('td[data-type="tableSeatNum"]').text();
				 // 区域选择
                var region_name =$(self).find('td[data-type="region_name"]').text();
                // 区域选择
                var region_id =$(self).find('td[data-type="region_id"]').text();
                // 对菜打印机
                var d_printer =$(self).find('td[data-type="d_printer"]').text();
                // 预结打印机s
                var y_printer =$(self).find('td[data-type="y_printer"]').text();
                // 描述
                var tableInfo =$(self).find('td[data-type="tableInfo"]').text();
                //二维码
                var barcode = $(self).find('td[data-type="scanCode"]').text();
                var scanCode = (barcode == 'null') ? "" : barcode;


				window.location.replace('shopTablesEdit.html?is_select='+is_select+'&table_id='+tableId+'&table_name='+tableName+'&table_type='+tableType+'&region_id='+region_id+'&region_name='+region_name+'&table_seat_num='+tableSeatNum+'&table_info='+tableInfo+'&d_printer='+d_printer+'&y_printer='+y_printer+'&scanCode='+ scanCode+'&shop_id='+shop_id);
			} else if (type == 'delete') {
				// 用户点击删除的时候
				 // 桌台名称
				var regionName = $('#regionName').val();
				$('#alert-content').html('您确定要删除该桌台吗？');
		        displayAlertMessage('#alert-message', '#cancel-alert');

		        // 点击确认删除,在绑定点击事件delegate里面加click点击事件不能用
		        // $('#definite-alert').click(function({这个因为这样就会造成，我点击一次点击事件在点击一次点击事件，点确认删除，就会执行两次点击事件，所以要用unbind、bind，先取消前一个点击事件，在绑定点击事件，这样就可以了
		        $('#definite-alert').unbind('click').bind('click', function () {
					// 在这里设置一个解除点击事件的代码，因为当到这里的时候会绑定两个点击事件，删除就会运行两次
					//$(self).unbind('click');
					//alert('ttt');
					// 删除分类
	                setAjax(AdminUrl.tableTableDel, {
						'table_id': tableId,
						'shop_id': shop_id
	                }, $('#prompt-message'), {20: '',436115: ''}, function(respnoseText) {
	                	if (respnoseText.code == 436115) {
	                		layer.close(layerBox);
	                		displayMsg(ndPromptMsg, respnoseText.message, 2000);
						}
						if (respnoseText.code == 20) {
							// 得到返回数据
		                    var data = respnoseText.data;
		                    layer.close(layerBox);
		                    $(self).remove();
		                    displayMsg(ndPromptMsg, '删除成功！', 2000);
	    				} else {
							layer.close(layerBox);
	                		displayMsg(ndPromptMsg, respnoseText.message, 2000);
	                	}
	                }, 0);
	            });
			}
		});
	}


	// 获取权限 桌台添加修改
	var is_up = authority_judgment('tablesEdit');	// 是否有修改权限 0 否 1 是
	if (is_up == 0) {
		$('#add_table').addClass('hide');
	}
    // 显示数据
	RegionalData();
	// 绑定点击事件
	RegionalBind();

	// 请求显示数据（区域）
	function RegionalData () {
        setAjax(AdminUrl.regionList, {
			'shop_id':shop_id
		}, $('#prompt-message'), {20: ''}, function(respnoseText) {
			if (respnoseText.code == 20) {
				// 得到返回数据
                var data = respnoseText.data;
                // 显示数据
                RegionList(data);
			} else {
				displayMsg(ndPromptMsg, respnoseText.message, 2000);
			}
        }, 0);
	}

     // 显示数据（区域）
	function RegionList (data) {
			var content = '';

			for (var i in data) {
		           
				content +=  '<tr data-type="region_id" class="total-tr" region_id="'+data[i].region_id+'">'+
		                        '<td data-type="region_name">'+data[i].region_name+'</td>'+
								
		                       // (is_up == 0 ? '' :
		                        '<td class="total-caozuo clearfix">'+
		                            '<span>'+
		                                '<input type="button" value="修改" data-type="update" class="stores-caozuo-btn">'+
		                            '</span>'+
		                            '<span class="btn-jianju">'+
		                                '<input type="button" value="删除" data-type="delete" class="stores-caozuo-delbtn">'+
		                            '</span>'+
		                        '</td>'+//)+
		                    '</tr>';
			}
			// 添加到页面中
			$('#tbodys_reg').html(content);
	}

	// 绑定点击事件（区域）
	function RegionalBind () {
		// 点击修改
		$('#tbodys_reg').delegate('tr', 'click', function(event) {
            var self = this,
			region_id = $(self).attr('region_id'),
            region_name = $(self).attr('region_name'),
            type = $(event.target).attr('data-type');

            if (type == 'update') {
                // 点击修改的时候，创建一个数据，存储要修改的这一行的信息，然后存到缓存中，到修改页面取出来填充到页面中去
                // 区域ID
               // var regionId = $(self).find('tr[data-type="region_id"]').text();
               //区域名称
                var region_name =$(self).find('td[data-type="region_name"]').text();
               
				//window.location.replace('regionalEdit.html?region_id='+region_id+'&region_name='+region_name);
				// window.location.replace('regionalEdit.html?region_id='+region_id+'&region_name='+region_name);
				window.location.replace('shopregionalEdit.html?is_select='+is_select+'&region_id='+region_id+'&region_name='+region_name+'&shop_id='+shop_id);
			} else if (type == 'delete') {
				// 用户点击删除的时候

				$('#alert-content').html('您确定要删除该区域吗？');
		        displayAlertMessage('#alert-message', '#cancel-alert');

		        // 点击确认删除,在绑定点击事件delegate里面加click点击事件不能用
		        // $('#definite-alert').click(function({这个因为这样就会造成，我点击一次点击事件在点击一次点击事件，点确认删除，就会执行两次点击事件，所以要用unbind、bind，先取消前一个点击事件，在绑定点击事件，这样就可以了
		        $('#definite-alert').unbind('click').bind('click', function () {
					// 在这里设置一个解除点击事件的代码，因为当到这里的时候会绑定两个点击事件，删除就会运行两次
					//$(self).unbind('click');
					//alert('ttt');
					// 删除分类
	                setAjax(AdminUrl.regionDel, {
						'shop_id': shop_id,
						'region_id': region_id,
						'region_name':region_name
	                }, $('#prompt-message'), {20: '',436115: ''}, function(respnoseText) {
	                	if (respnoseText.code == 436115) {
	                		layer.close(layerBox);
	                		displayMsg(ndPromptMsg, respnoseText.message, 2000);
						}
						if (respnoseText.code == 20) {
							// 得到返回数据
		                    var data = respnoseText.data;
		                    layer.close(layerBox);
		                    $(self).remove();
		                    displayMsg(ndPromptMsg, '删除成功！', 2000);
	    				} else {
							layer.close(layerBox);
	                		displayMsg(ndPromptMsg, respnoseText.message, 2000);
	                	}
	                }, 0);
	            });
			}
		});

		

		// 点击添加
		$('#addbtn').unbind('click').bind('click', function () {
			window.location.replace('shopTablesEdit.html?is_select='+is_select+'&shop_id='+shop_id);
		});
		//点击添加区域
		$('#addregbtn').unbind('click').bind('click', function () {
			window.location.replace('shopregionalEdit.html?is_select='+is_select+'&shop_id='+shop_id);
		});
		// 点击桌台管理
		$('#deskManagement').unbind('click').bind('click', function () {
			clickLabel(0);
		});
		// 点击区域管理
		$('#regionalManagement').unbind('click').bind('click', function () {
			clickLabel(1);
		});
	}




	// 点击标签页显示隐藏 调用数据
	function clickLabel(type) {

		switch(type) {
			case 0:
				$('#regionalManagement').removeClass('caipin-fenleicheck');
				$('#regionalManagement').addClass('caipin-fenleinucheck');
				$('#deskManagement').addClass('caipin-fenleicheck');
				$('#deskManagement').removeClass('caipin-fenleinucheck');
				$('#desk_table').removeClass('hide');
				$('#regional_table').addClass('hide');
				$('#addbtn').removeClass('hide');
				$('#addregbtn').addClass('hide');


				// PayWayData(0);
				// payStatus = 0;
			break;
			case 1:
				$('#regionalManagement').addClass('caipin-fenleicheck');
				$('#regionalManagement').removeClass('caipin-fenleinucheck');
				$('#deskManagement').removeClass('caipin-fenleicheck');
				$('#deskManagement').addClass('caipin-fenleinucheck');
				$('#desk_table').addClass('hide');
				$('#regional_table').removeClass('hide');
				$('#addbtn').addClass('hide');
				$('#addregbtn').removeClass('hide');

				
				// PayWayData(1);
				// payStatus = 1;
			break;
		}
	}

});







