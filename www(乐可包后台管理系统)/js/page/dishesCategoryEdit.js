$(function () {
	// 菜品管理---菜品分类添加修改

        // 获取到修改传过来的shop_id
		var menuTypeId = getQueryString('menu_type_id');
		// 获取到修改传过来的缓存
		var data = Cache.get('disUp');
		// 判断是修改还是添加 0；添加，1：修改
		var addIsUp = 0;

		var DishesCategoryEdit = {

			init: function () {
				// 判断是修改还是添加
				if (menuTypeId != null && menuTypeId != undefined && data != null && data != undefined) {
					addIsUp = 1;
					$('#addAndedit').text('分类修改');
					// 显示数据
					this.dishesCategoryData(data);
				} else {
					addIsUp = 0;
					$('#addAndedit').text('分类添加');
				}

				// 绑定点击事件
				this.dishesCategoryEditBind();
			},


			// 显示数据
			dishesCategoryData: function (data) {
				// 显示数据
				
				// 分类编号
				$('#menuTypeDid').val(data.menu_type_did);
				// 分类名称
				$('#menuType').val(data.menu_type);

				// 缓存中的数据取出之后删除
				Cache.del('disUp');
			},

			// 绑定点击事件
			dishesCategoryEditBind: function () {
				var _self = this;
				// 点击修改
				$('#updatebtn').unbind('click').bind('click', function () {
					if (addIsUp == 0) {
						_self.categoryAdd();
					} else if (addIsUp == 1) {
						_self.categoryUpdate();
					}
				});

				// 点击取消
				$('#exitbtn').unbind('click').bind('click', function () {
					// 跳转
					window.location.replace('dishesManage.html?is_select=1&type=1');
				});

				// 点击导航
				$('#selectJump').unbind('click').bind('click', function () {
					window.location.replace('dishesManage.html?is_select=1&type=1');
				});

			},

			// 添加
			categoryAdd: function () {
				// 获取到各个数据，请求接口提交数据
				var self = this;
				// 门店名称
				var menuType = $('#menuType').val();
				// 门店编号
				var menuTypeDid = $('#menuTypeDid').val();

				// 效验数据通过才能修改
				if (this.dataCheck()) {
	                setAjax(AdminUrl.staffMenuTypeAdd, {
	                    'menu_type': menuType,
	                    'menu_type_did': menuTypeDid,
	                    'menu_type_sort': ''
	                }, $('#prompt-message'), {20: ''}, function(respnoseText) {
						// 得到返回数据
	                    var data = respnoseText.data;	
	                    
	                    window.location.replace('dishesManage.html?is_select=1&type=1');
	                }, 2);
	            }
			},

			// 修改
			categoryUpdate: function () {
				// 获取到各个数据，请求接口提交数据
				var self = this;
				// 分类名称
				var menuType = $('#menuType').val();
				// 分类编号
				var menuTypeDid = $('#menuTypeDid').val();

				// 效验数据通过才能修改
				if (this.dataCheck()) {
	                setAjax(AdminUrl.staffMenuTypeUpdate, {
	                	'menu_type': menuType,
	                    'menu_type_id': menuTypeId,
	                    'menu_type_did': menuTypeDid
	                }, $('#prompt-message'), {20: ''}, function(respnoseText) {
						// 得到返回数据
	                    var data = respnoseText.data;	
	                    
	                    window.location.replace('dishesManage.html?is_select=1&type=1');
	                }, 2);
	            }
			},

			// 效验要修改的数据
			dataCheck: function () {
	            if ( dataTest('#menuType', '#prompt-message', { 'empty': '不能为空'})
	            
	            ) {
	            	//alert('tt');
	                return true;
	            }

	            return false;
			}
		}

		DishesCategoryEdit.init();

});

