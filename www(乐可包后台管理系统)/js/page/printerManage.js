$(function () {

	// 打印机列表
		
        // 从缓存中得到用户是否有添加修改权限
        var perIsEdit = Cache.get('perIsEdit');

		var Print = {

			init: function () {
				// 判断如果等于undefined说明没有添加修改权限
				if (perIsEdit['打印机添加修改'] == undefined) {
					$('#permissions').addClass('hide');
				} else {
					$('#permissions').removeClass('hide');
				}
				// 显示数据
				this.PrintData();
				// 绑定点击事件
				this.PrintBind();
			},

			// 请求显示数据
			PrintData: function () {
				var self = this;
                setAjax(AdminUrl.printerPrinterList, {}, $('#prompt-message'), {20: ''}, function(respnoseText) {
					// 得到返回数据
                    var data = respnoseText.data;
                    // 显示数据
                    self.PrintList(data);
                }, 1);
			},

			// 显示数据
			PrintList: function (data) {
					var content = '';
					var num = 0;
					// is_del是否删除  0：正常，1：删除
					for (var i in data) {
						// 如果是删除的话，就循环下一个
						if (data[i].is_del == 1) {
							continue;
						}
						num ++;
						content +=  '<tr class="total-tr" printer-id="'+data[i].printer_id+'">'+
										'<td class="total-shopnametxt">'+num+'</td>'+
										'<td class="total-addr" data-type="printerName">'+data[i].printer_name+'</td>'+
										(perIsEdit['打印机添加修改'] == undefined ? '' :
										'<td class="total-shopnametxt clearfix">'+
				                            '<span>'+
				                                (data[i].printer_type == 3 ? '<input type="button" value="修改" data-type="update" class="stores-caozuo-btn">': '<input type="button" value="修改" disabled="disabled" class="stores-jinyong-btn">')+
				                             '</span>'+
				                             '<span>'+
				                                (data[i].is_del == 0 && data[i].printer_type == 3 ?'<input type="button" value="删除" data-type="delete" class="stores-quxiao-btn">' : 
													'<input type="button" value="删除" disabled="disabled" class="stores-jinyong-btn">')+
				                            '</span>'+
				                        '</td>')+
				                    '</tr>';
					}
					// 添加到页面中
					$('#tbodys').html(content);
			},

			// 绑定点击事件
			PrintBind: function () {
				var _self = this;
				// 点击修改
				$('#tbodys').delegate('tr', 'click', function(event) {
                    var self = this,
                    printerId = $(self).attr('printer-id'),
                    type = $(event.target).attr('data-type');

                    if (type == 'update') {
	                    // 点击修改的时候，创建一个数据，存储要修改的这一行的信息，然后存到缓存中，到修改页面取出来填充到页面中去
	                    var printerName =$(self).find('td[data-type="printerName"]').text();

	                    var priUp = {
	                    	'printer_id': printerId,
							'printer_name': printerName
	                    };
	                    Cache.set('priUp',priUp);

						window.location.replace('printerEdit.html?printer_id='+printerId);
					} else if (type == 'delete') {


						$('#alert-content').html('您确定要删除该打印机吗？');
				        displayAlertMessage('#alert-message', '#cancel-alert');

				        // 点击确认删除,在绑定点击事件delegate里面加click点击事件不能用
				        // $('#definite-alert').click(function({这个因为这样就会造成，我点击一次点击事件在点击一次点击事件，点确认删除，就会执行两次点击事件，所以要用unbind、bind，先取消前一个点击事件，在绑定点击事件，这样就可以了
				        $('#definite-alert').unbind('click').bind('click', function () {
							// 在这里设置一个解除点击事件的代码，因为当到这里的时候会绑定两个点击事件，删除就会运行两次
							//$(self).unbind('click');
							//alert('ttt');
							// 删除分类
			                setAjax(AdminUrl.printerPrinterDel, {
								'printer_id': printerId
			                }, $('#prompt-message'), {20: ''}, function(respnoseText) {
			                	if (respnoseText.code == 20) {
									// 得到返回数据
				                    var data = respnoseText.data;
				                    layer.close(layerBox);
				                    $(self).remove();
				                    displayMsg($('#prompt-message'), '删除成功!', 2000);
				                    //window.location.replace('printerManage.html');
			                	} else {
			                		displayMsg($('#prompt-message'), respnoseText.message, 2000);
			                		layer.close(layerBox);
			                	}
			                }, 0);
			             });
					}
				});

				// 点击添加
				$('#addbtn').unbind('click').bind('click', function () {
					//alert('ddd');
					window.location.replace('printerEdit.html');
				});
			} 
		}

		Print.init();

});
