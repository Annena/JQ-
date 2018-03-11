$(function () {
    // 桌台添加修改

       // 获取到修改传过来的id
		var regionId = getQueryString('region_id');
		// 判断是修改还是添加 0；添加，1：修改
        // 判断是修改还是添加 0；添加，1：修改
        var addIsUp = 0;

        var shop_id = getQueryString('shop_id');
        var is_select = getQueryString('is_select');


        $('#shop_list').attr('href', 'shopManage.html?is_select='+is_select);
        $('#shop_tables').attr('href', 'shopTables.html?is_select='+is_select+'&shop_id='+shop_id);

           // 判断是修改还是添加
			if (regionId != null && regionId != undefined) {
				addIsUp = 1;
				$('#addAndedit').text('区域修改');
				// 显示数据
				TablesList();
			} else {
				$('#addAndedit').text('区域添加');
				addIsUp = 0;
				
			}

			// 绑定点击事件
			TablesBind();

			// 显示数据
			function TablesList () {
				// 显示数据
				// 桌台名称
				$('#regionName').val(decodeURIComponent(getQueryString('region_name')));
			}
		

            
            // 绑定点击事件
			function TablesBind () {
				// 点击修改
				$('#updatebtn').unbind('click').bind('click', function () {
					if (addIsUp == 0) {
						RegionAdd();
					} else if (addIsUp == 1) {
						RegionUpdate();
					}
				});
                // 点击取消
                $('#exitbtn').unbind('click').bind('click', function () {
                    window.location.replace('shopTables.html?is_select='+is_select+'&shop_id='+shop_id);
                });

            }

            // 添加
           function RegionAdd () {
                // 桌台名称
               var regionName = $('#regionName').val();
				//桌台名称不可以为空
				// if ( regionName == '') {
				// 	displayMsg(ndPromptMsg, '区域名称不能为空', 2000);
				// 	return;
				// }

                if (dataCheck()) {
                   setAjax(AdminUrl.regionAdd, {
	                    'region_name': regionName,
                        'shop_id':shop_id
                    }, $('#prompt-message'), {20: ''}, function(respnoseText) {
                        if (respnoseText.code == 20) {
                            displayMsg(ndPromptMsg, respnoseText.message, 2000, function () {
                                // 得到返回数据
                                var data = respnoseText.data;
                            });
                             setTimeout(function(){
		                    	  window.location.replace('shopTables.html?is_select='+is_select+'&shop_id='+shop_id);
		                    },3000)
                        } else {
                            displayMsg(ndPromptMsg, respnoseText.message, 2000);
                        }
                    }, 0);
                }
            }

            // 修改
            function RegionUpdate () {
               // 桌台名称
				var regionName = $('#regionName').val();
				
                if (dataCheck()) {
	                setAjax(AdminUrl.regionUpdate, {
                        'region_id':regionId,
	                    'region_name': regionName,
                        'shop_id':shop_id
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
	            if ( dataTest('#regionName', '#prompt-message', { 'empty': '不能为空'})) {
	            	//alert('tt');
	                return true;
	            }

	            return false;
			}

});

