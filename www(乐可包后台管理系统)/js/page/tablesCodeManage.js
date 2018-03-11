$(function () {
	
	// 桌台二维码

	var tableCode = {

		shopName: '',
		isSelect: 1,	// 是否查询，0是 1 否

		init: function () {
			// 加载店铺数据（public.js中的公共调用方法）
			shopData();
			// 绑定点击事件
			this.bindTable();
		},

		// 绑定点击事件
		bindTable: function () {
			var self = this;

			// 点击搜索
			$('#selectbtn').unbind('click').bind('click', function () {
				self.selectTable();
			});

			// 点击下载
			$('#download').unbind('click').bind('click', function () {
				if (self.isSelect == 0) {
					self.downloadCode();
				} else {
					displayMsg(ndPromptMsg, '请先查询在下载！', 2000);
				}
			});
		},

		// 查询桌台
		selectTable: function () {
			var self = this;

			var shop_id = $('#shopList').val();
			self.shopName = $('#shopList option:selected').text();

			setAjax(AdminUrl.infoTableList, {
                'shop_id': shop_id
			 }, $('#prompt-message'), {20: ''}, function(respnoseText) {
				if (respnoseText.code == 20) {
					self.isSelect = 0;
					self.selectTableDate(respnoseText.data);
				} else {
					displayMsg(ndPromptMsg, respnoseText.message, 2000);
				}
            }, 0);
		},

		// 显示桌台二维码
		selectTableDate: function (data) {
			var content = '';

			// id用
			var num = 0;

			for (var i in data) {
				content += '<li class="clearfix" data-name="'+data[i].table_name+'">'+
			                    '<div class="table_code" id="table_'+num+'">'+
			                        
			                    '</div>'+
			                    '<div class="table_name">'+
			                        data[i].table_name
								'</div>'+
			                '</li>';
			    num++;
			}

			$('#selectTableDate').html(content);

			// id用
			var num1 = 0;
			var card_id = person_get_data().card_id;

			for (var j in data) {
				// 二十一位二维码
				var scanCode = phpTableCode+'?2'+ card_id.substring(2,13) + data[j].table_id.substring(2,13);

				/*correctLevel
				level L : 最大 7% 的错误能够被纠正；
				level M : 最大 15% 的错误能够被纠正；
				level Q : 最大 25% 的错误能够被纠正；
				level H : 最大 30% 的错误能够被纠正；*/
	            // 图片会生成到id是qrcode的里面
	            var qrcode = new QRCode('table_'+num1, {
	                width : 250,//设置宽高
	                height : 250,
					//colorDark : '#000000',	// 前景色
					//colorLight : '#ffffff',	// 背景色
	                correctLevel : QRCode.CorrectLevel.L//纠错等级  
	            });
	            // 将二维码内容填充，并生成二维码
	            qrcode.makeCode(scanCode);
	            num1++;
			}
		},

		// 下载二维码
		downloadCode: function () {
			var self = this;

			// 初始化压缩
			var zip = new JSZip();
			// 创建一个文件夹
			//var img = zip.folder("images");

			// 循环得到二维码base64编码和id
			$('#selectTableDate').find('li').each(function () {
				// 得到桌台名称
				var name = $(this).attr('data-name');
				// 得到base64码
				var base = $(this).find('img').attr('src').substring(22);
				zip.file(name+".png", base, {base64: true});
				//img.file(name+".png", base, {base64: true});
			});

			zip.generateAsync({type:"blob"}).then(function(content) {
                // see FileSaver.js
                saveAs(content, self.shopName+".zip");
            });
		}

	}

	tableCode.init();
});
