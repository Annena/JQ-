$(function () {
	// 打印机修改


        // 获取到修改传过来的printer_id
		var printerId = getQueryString('printer_id');
		// 获取到修改传过来的缓存
		var data = Cache.get('priUp');
		// 判断是修改还是添加 0；添加，1：修改
		var addIsUp = 0;

		var PrintEdit = {

			init: function () {
				// 判断是修改还是添加
				if (printerId != null && printerId != undefined && data != null && data != undefined) {
					addIsUp = 1;
					// 显示数据
					this.PrintList(data);
				} else {
					addIsUp = 0;
				}
				// 绑定点击事件
				this.PrintBind();
			},

			// 显示数据
			PrintList: function (data) {
				// 显示数据

				// 打印机名称
				$('#printerName').val(data.printer_name);

				// 缓存中的数据取出之后删除
				Cache.del('priUp');
			},

			// 绑定点击事件
			PrintBind: function () {
				var _self = this;
				// 点击修改
				$('#updatebtn').unbind('click').bind('click', function () {
					if (addIsUp == 0) {
						_self.PrintAdd();
					} else if (addIsUp == 1) {
						_self.PrintUpdate();
					}
				});

				// 点击取消
				$('#exitbtn').unbind('click').bind('click', function () {
					window.location.replace('printerManage.html');
				});
			},

			// 修改
			PrintUpdate: function () {
				// 获取到各个数据，请求接口提交数据
				var self = this;

				// 打印机名称
				var printerName = $('#printerName').val();

				// 效验数据通过才能修改
				if (this.dataCheck()) {
	                setAjax(AdminUrl.printerPrinterUpdate, {
						'printer_id': data.printer_id,
	                    'printer_name': printerName,
	                    'printer_type': 3
	                }, $('#prompt-message'), {20: ''}, function(respnoseText) {
						// 得到返回数据
	                    var data = respnoseText.data;
	                    window.location.replace('printerManage.html');
	                }, 2);
	            }
			},

			// 添加
			PrintAdd: function () {
				// 获取到各个数据，请求接口提交数据
				var self = this;
				
				// 打印机名称
				var printerName = $('#printerName').val();

				// 效验数据通过才能修改
				if (this.dataCheck()) {
	                setAjax(AdminUrl.printerPrinterAdd, {
						'printer_name': printerName,
						'printer_type': 3
	                }, $('#prompt-message'), {20: ''}, function(respnoseText) {
						// 得到返回数据
	                    var data = respnoseText.data;
	                    window.location.replace('printerManage.html');
	                }, 2);
	            }
			},

			// 效验要修改的数据
			dataCheck: function () {
	            if ( dataTest('#printerName', '#prompt-message', { 'empty': '不能为空'})
	            	// && dataTest('#shopAddr', '#prompt-message', { 'empty': '不能为空'})
	             //    && dataTest('#shopTel', '#prompt-message', { 'empty': '不能为空', 'mobileNumber': '电话号码不正确'})
	            
	            ) {
	            	//alert('tt');
	                return true;
	            }

	            return false;
			}
		}

		PrintEdit.init();

});

