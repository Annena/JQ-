$(function () {
    // 桌台添加修改

        // 获取到修改传过来的id
        var tableId = getQueryString('table_id');
        var region_id_t = getQueryString('region_id');
        // 判断是修改还是添加 0；添加，1：修改
        var addIsUp = 0;

        var shop_id = getQueryString('shop_id');
        var is_select = getQueryString('is_select');


        $('#shop_list').attr('href', 'shopManage.html?is_select='+is_select);
        $('#shop_tables').attr('href', 'shopTables.html?is_select='+is_select+'&shop_id='+shop_id);

            // 判断是修改还是添加
            if (tableId != null && tableId != undefined) {
                addIsUp = 1;
                $('#addAndedit').text('桌台修改');
                // 显示数据
                TablesList();
            } else {
                $('#addAndedit').text('桌台添加');
                addIsUp = 0;
            }

            // 获取打印机列表
            PrintData();

            // 绑定点击事件
            TablesBind();

            //显示区域选择
			RegionList();

            // 显示数据
            function TablesList () {
                // 区域名称
                // 显示数据

                // 桌台名称
                $('#tableName').val(decodeURIComponent(getQueryString('table_name')));
                // 桌台类型 不是大厅就是包间  1大厅，2包间
                if (decodeURIComponent(getQueryString('table_type')) == 1) {
                    $('#theHall').attr('checked','checked');
                } else {
                    $('#rooms').attr('checked','checked');
                }
              // 区域选择
				$('#region_id').val(decodeURIComponent(getQueryString('region_id')));
                 // 区域选择
				$('#region_name').val(decodeURIComponent(getQueryString('region_name')));
				
                // 座位数量
                $('#tableSeatNum').val(decodeURIComponent(getQueryString('table_seat_num')));
                // 描述
                $('#tableInfo').text(decodeURIComponent(getQueryString('table_info')));
                //二维码数据
                $('#scanCode').val(decodeURIComponent(getQueryString('scanCode')));
            }
            //区域选择
		    function RegionList() {
               
				setAjax(AdminUrl.regionList, {
                    'shop_id': shop_id
                }, $('#prompt-message'), {20: ''}, function(respnoseText) {
					var data = respnoseText.data;
                    var regionList = '<option value="" data-selected="1">请选择区域</option>';
                    for (var i in data) {
                        regionList += '<option value="' + data[i].region_id + '" data-selected="1">' + data[i].region_name + '</option>';
                    }
                    $('#region_id').html(regionList);
                    if (addIsUp == 1) {
                       if(region_id_t=='all'){
							region_id_t=''
						}
						$('#region_id').val(region_id_t);
                    }
                }, 0);
			}

            // 请求打印机列表
            function PrintData() {
                var self = this;
                setAjax(AdminUrl.printerShopPrinter, {
                    'shop_id': shop_id
                }, $('#prompt-message'), {20: ''}, function(respnoseText) {
                    // 得到返回数据
                    var data = respnoseText.data;
                    // 显示数据
                    PrintList(data);
                }, 0);
            }

            // 显示打印机数据
            function PrintList(data) {
                // 打印机设置
                var content = '<option value="no" checked>无</option>';

                for (var i in data) {
                    if (data[i].printer_id == 'ap1fhba8r6nd' && data[i].printer_name == '收银打印机') {
                        continue;
                    }
                    content +=  '<option value="'+data[i].printer_id+'">'+data[i].printer_name+'</option>';
                }
                // 添加到页面中 对菜打印机设置
                $('#d_printer').html(content);
                // 预结打印机
                $('#y_printer').html(content);
                // 如果是修改的话，把修改传过来的数据选中打印机
                if (addIsUp == 1) {
                    var d_printer = decodeURIComponent(getQueryString('d_printer'));
                    var y_printer = decodeURIComponent(getQueryString('y_printer'));
                    
                    if (d_printer == '' || d_printer == 'null') {
                        d_printer = 'no';
                    }
                    if (y_printer == '' || y_printer == 'null') {
                        y_printer = 'no';
                    }
                    // 对菜打印机
                    $('#d_printer').val(d_printer);
                    // 预结打印机
                    $('#y_printer').val(y_printer);
                }
            }

            // 绑定点击事件
            function TablesBind () {
                // 点击修改
                $('#updatebtn').unbind('click').bind('click', function () {
                    if (addIsUp == 0) {
                        TablesAdd();
                    } else if (addIsUp == 1) {
                        TablesUpdate();
                    }
                });

                // 点击取消
                $('#exitbtn').unbind('click').bind('click', function () {
                    window.location.replace('shopTables.html?is_select='+is_select+'&shop_id='+shop_id);
                });

                // 座位数量输入校验
                $('#tableSeatNum').unbind('input').bind('input', function () {
                    checkNum('tableSeatNum', 0);
                });
            }

            // 添加
            function TablesAdd () {
                // 桌台名称
                var tableName = $('#tableName').val();

               // 区域id
				var region_id = $('#region_id').val();
               // 区域名称
				var region_name = $('#region_name').val();

                // 桌台类型  如果大厅选中了
                var tableType = '';
                if ($('#theHall').is(':checked')) {
                    tableType = 1;//大厅
                } else {
                    tableType = 2;// 包间
                }

                // 座位数量
                var tableSeatNum = $('#tableSeatNum').val();
                var scanCode = $('#scanCode').val();
                var exp = /^10\d{4}$/;

                if (tableSeatNum == 0) {
                    displayMsg(ndPromptMsg, '座位数量不能为0', 2000);
                    return;
                }
                if(scanCode != "") {
                    if(!exp.test(scanCode)) {
                        displayMsg(ndPromptMsg, '条形码格式不正确', 2000);
                        return;
                    }
                }

                // 对菜打印机
                var d_printer = $('#d_printer').val();
                // 预结打印机
                var y_printer = $('#y_printer').val();
                if (d_printer == 'no') {
                    d_printer = '';
                }
                if (y_printer == 'no') {
                    y_printer = '';
                }

                // 描述
                var tableInfo = $('#tableInfo').val();
                if (dataCheck()) {
                    setAjax(AdminUrl.tableTableAdd, {
                        'table_name': tableName,
                        'table_type': tableType,
                        'table_seat_num': tableSeatNum,
                        'd_printer': d_printer,
                        'y_printer': y_printer,
                        'table_info': tableInfo,
                        'shop_id': shop_id,
                        'barcode': scanCode,
                        'region_id': region_id,
	                    'region_name': region_name


                    }, $('#prompt-message'), {20: ''}, function(respnoseText) {
                        if (respnoseText.code == 20) {
                            displayMsg(ndPromptMsg, respnoseText.message, 2000, function () {
                                // 得到返回数据
                                var data = respnoseText.data;
                                window.location.replace('shopTables.html?is_select='+is_select+'&shop_id='+shop_id);
                            });
                        } else {
                            displayMsg(ndPromptMsg, respnoseText.message, 2000);
                        }
                    }, 0);
                }
            }

            // 修改
            function TablesUpdate () {
                // 桌台名称
                var tableName = $('#tableName').val();
                // 区域id
				var region_id = $('#region_id').val();
				// 区域名称
				var region_name = $('#region_name').val();
                
                // 桌台类型  如果大厅选中了
                var tableType = '';
                if ($('#theHall').is(':checked')) {
                    tableType = 1;
                } else {
                    tableType = 2;
                }
                // 座位数量
                var tableSeatNum = $('#tableSeatNum').val();

                if (tableSeatNum == 0) {
                    displayMsg(ndPromptMsg, '座位数量不能为0', 2000);
                    return;
                }

                var scanCode = $('#scanCode').val();
                var exp = /^10\d{4}$/;

                if(scanCode != "") {
                    if(!exp.test(scanCode)) {
                        displayMsg(ndPromptMsg, '条形码格式不正确', 2000);
                        return;
                    }
                }
             

                // 对菜打印机
                var d_printer = $('#d_printer').val();
                // 预结打印机
                var y_printer = $('#y_printer').val();
                if (d_printer == 'no') {
                    d_printer = '';
                }
                if (y_printer == 'no') {
                    y_printer = '';
                }

                // 描述
                var tableInfo = $('#tableInfo').val();
                if (dataCheck()) {
                    setAjax(AdminUrl.tableTableUpdate, {
                        'table_id': tableId,
                        'table_name': tableName,
                        'table_type': tableType,
                        'table_seat_num': tableSeatNum,
                        'd_printer': d_printer,
                        'y_printer': y_printer,
                        'table_info': tableInfo,
                        'shop_id': shop_id,
                        'barcode': scanCode,
                        'region_id': region_id,
	                    'region_name': region_name
                    }, $('#prompt-message'), {20: ''}, function(respnoseText) {
                        if (respnoseText.code == 20) {
                            displayMsg(ndPromptMsg, respnoseText.message, 2000, function () {
                                // 得到返回数据
                                var data = respnoseText.data;
                                window.location.replace('shopTables.html?is_select='+is_select+'&shop_id='+shop_id);
                            });
                        } else {
                            displayMsg(ndPromptMsg, respnoseText.message, 2000);
                        }
                    }, 0);
                  
                }
            }

            // 效验提交的数据
            function dataCheck () {
                if ( dataTest('#tableName', '#prompt-message', { 'empty': '不能为空'})
                    && dataTest('#tableSeatNum', '#prompt-message', { 'empty': '不能为空','numberTwo':'必须为两位数字'})) {
                    //alert('tt');
                    return true;
                }
                 if ( dataTest('#region_name', '#prompt-message', { 'empty': '不能为空'})) {
	            	//alert('tt');
	                return true;
	            }

                return false;
            }

});

