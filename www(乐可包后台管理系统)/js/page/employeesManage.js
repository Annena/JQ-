$(function () {

	// 员工管理列表

        // 从缓存中得到用户是否有添加修改权限
        var perIsEdit = Cache.get('perIsEdit');
        //是否查询 0否  1是
        var is_select = 0;
        // 获取存储查询数据的缓存
        var selectData = Cache.get('selectData');

		var EmployeesManage = {

			init: function () {
				// 判断如果等于undefined说明没有添加修改权限
				if (perIsEdit['员工添加修改'] == undefined) {
					$('#permissions').addClass('hide');
				} else {
					$('#permissions').removeClass('hide');
				}
				// 显示省份、城市、区域,门店,点击事件
				this.procityArea();
			},

			// 显示省份、城市、区域、门店
			procityArea: function () {
				var self = this;
                setAjax(AdminUrl.shopPositionList, {}, $('#prompt-message'), {20: ''}, function(respnoseText) {
					// 得到返回数据
                    var data = respnoseText.data;

                    // 判断是否是从添加或者修改 返回回来的
					if (getQueryString('is_select') == 1 && selectData) {
						is_select = getQueryString('is_select');
						
						addressInit('area','cmbProvince','cmbCity','cmbArea',selectData.shop_province, selectData.shop_city, selectData.shop_area, selectData.a_user_organization,data);
						$("#shopStatusList").val(selectData.staff_status);
						// 点击搜索的时候获取到搜索按钮旁边的条件选的是什么
						// 然后保存到缓存中，点击列表中的修改时传给修改
						Cache.set('shopStatusList', $("#shopStatusList").val());

						self.selectEmployees();
					} else {
	                    // 默认显示的省份城市区域门店
						addressInit('area','cmbProvince','cmbCity','cmbArea','总部', '总部', '总部', '总部',data);
					}

					// 绑定点击事件
					self.EmployeesBind();
                }, 0);
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
	                    var shopId =$(self).find('td[data-type="shopId"]').text();
	                    var aUserNickname = $(self).find('td[data-type="aUserNickname"]').text();
	                    
	                    var shopStatusList = Cache.get('shopStatusList');
	                    // 上面获取完shopStatusList这个缓存，就把缓存删除掉
	                    Cache.del('shopStatusList');

	                    var empUp = {
							'a_user_id': aUserId,
							'a_user_did': aUserDid,
							'a_user_name': aUserName,
							'a_user_mobile': aUserMobile,
							'shop_id': shopId,
							'staff_status': shopStatusList,
							'a_user_nickname': aUserNickname
	                    };
	                    Cache.set('empUp',empUp);

						window.location.replace('employeesEdit.html?v=' + version + '&a_user_id='+aUserId+'&is_select='+is_select);

					} else if (type == 'iden') {// 点击身份
						// 把员工姓名获取过来，然后传到下个页面
						var aUserNameIde =$(self).find('td[data-type="aUserName"]').text();
						Cache.set('aUserNameIde',aUserNameIde);
						window.location.replace('empIdentity.html?v=' + version +'&a_user_id='+aUserId+'&is_select='+is_select);
						
					}
				});

				// 点击添加
				$('#consumebtn').unbind('click').bind('click', function () {
					window.location.replace('employeesEdit.html?v='+ version +'&is_select='+is_select);
					
				});

				// 点击搜索
				$('#selectbtn').unbind('click').bind('click', function () {
					is_select = 1;
					_self.selectEmployees();

					// 点击搜索的时候获取到搜索按钮旁边的条件选的是什么
					// 然后保存到缓存中，点击列表中的修改时传给修改
					Cache.set('shopStatusList', $("#shopStatusList").val());
				});

				// 省份下拉框改变事件
				/*$("#shopProvince").unbind('input').bind('input', function () {
					//_self.shopData();
				});

				// 城市下拉框改变事件
				$("#shopCity").unbind('input').bind('input', function () {
					//_self.shopData();
				});

				// 区域下拉框改变事件
				$("#shopArea").unbind('input').bind('input', function () {
					//_self.shopData();
				});*/
			},

			// 点击搜索的时候请求接口
			selectEmployees: function () {
				var self = this;
				// 搜索之前清空列表内容
				$('#tbodys').html('');
				// 获取到搜索的项
				// 省份
				var shopProvince = $("#area").val();
				// 城市
				var shopCity = $("#cmbProvince").val();
				// 区域
				var shopArea = $("#cmbCity").val();
				// 门店
				var aUserOrganization = $('#cmbArea').val();
				var aUserOrganizationName = $('#cmbArea option:selected').text();
				//alert(aUserOrganization);
				// 状态
				var staffStatus = $('#shopStatusList').val();

				// 存储查询数据
				var selectDa = {
                    'shop_province': shopProvince,
                    'shop_city': shopCity,
                    'shop_area': shopArea,
                    'a_user_organization': aUserOrganization,
                    'aUserOrganizationName':aUserOrganizationName,
                    'staff_status': staffStatus
				};
				Cache.set('selectData', selectDa);

				//alert(shopStatusList);
                setAjax(AdminUrl.staffStaffList, {
                    'shop_province': shopProvince,
                    'shop_city': shopCity,
                    'shop_area': shopArea,
                    'a_user_organization': aUserOrganization,
                    'staff_status': staffStatus
                }, $('#prompt-message'), {20: ''}, function(respnoseText) {
					// 得到返回数据
                    var data = respnoseText.data;

					self.shopManageList(data);

                }, 2);	
			},

			// 显示搜索出来的数据
			shopManageList: function (data) {
				var content	= '';

				for (var i in data) {
					//alert(i);
					//for (var j in data[i]) {
						//alert(j);
						content += '<tr class="total-tr" a-user-id="'+data[i].a_user_id+'">'+
				                        '<td class="total-shopnametxt" data-type="aUserDid">'+data[i].a_user_did+'</td>'+
				                        '<td  data-type="aUserName">'+data[i].a_user_name+'</td>'+
				                        '<td  data-type="aUserNickname">'+data[i].a_user_nickname+'</td>'+
				                        '<td  data-type="aUserMobile">'+data[i].a_user_mobile+'</td>'+
				                        '<td >'+data[i].a_user_organization+'</td>'+
				                        (perIsEdit['员工添加修改'] == undefined &&　perIsEdit['员工身份列表'] == undefined ? '' :
				                        '<td class="total-caozuo clearfix">'+
				                        	(perIsEdit['员工添加修改'] == undefined ? '' :
				                            '<span>'+
				                            	'<input type="button" value="修改" data-type="update" id="updateBtn" class="stores-caozuo-btn">'+
				                            '</span>')+
				                            (perIsEdit['员工身份列表'] == undefined ? '' :
				                            '<span >'+
				                            	'<input type="button" value="身份" data-type="iden" class="stores-caozuo-btn">'+
				                            '</span>')+
				                        '</td>')+
				                        '<td class="hide" data-type="shopId">'+data[i].shop_id+'</td>'+
				                    '</tr>';
					//}
				}
				// 添加到页面中
				$('#tbodys').html(content);
			}

			/*// 三级级联显示门店
			shopData: function () {
				var self = this;
				// 获取到搜索的项
				// 省份
				var shopProvince = $("#shopProvince").val();
				//alert(shopProvince);
				// 城市
				var shopCity = $("#shopCity").val();
				// 区域
				var shopArea = $("#shopArea").val();
				// 状态是0，因为查询的是正常的店
				var shopStatusList = 0;

				//alert(shopStatusList);
                setAjax(AdminUrl.shopAreaShopList, {
                    'shop_province': shopProvince,
                    'shop_city': shopCity,
                    'shop_area': shopArea,
                    'shop_status': shopStatusList,
                    'company_name_en':business,
                    'cid': Cache.get('getCID')
                }, $('#prompt-message'), {20: ''}, function(respnoseText) {
					// 得到返回数据
                    var data = respnoseText.data;

					self.shopList(data);

                }, 0);
			},

			// 显示数据
			shopList: function (data) {
					var content = '';
					if (data) {
						//content	= '<option value="all">全部门店</option>';
					} else {
						content	= '<option value="">没有门店</option>';
					}
					
					for (var i in data) {
						content += '<option value="'+data[i].shop_id+'">'+data[i].shop_name+'</option>';
					}
					// 添加到页面中
					$('#shopList').html(content);
			}*/
		}

		EmployeesManage.init();
		// 城市省份区域门店四级联动
		var addressInit = function(_carea,_cmbProvince, _cmbCity, _cmbArea,defaultarea1, defaultProvince, defaultCity, defaultArea, data){

			// 四个数组，分别代表省份、城市、区域、门店
			
			var ar2 = new Array();
			var ar3 = new Array();
			var ar4 = new Array();
			
			var numA = 0;
			var numC = 0;
			var numP = 0;
			var numT = 0;

			for (var i in data) {
				var ar3 = new Array();
				var areaT = {};
				numC = 0;
				for (var j in data[i]) {
					var ar4 = new Array();
					var cmbProvinceT = {};
					numP = 0;
					for (var n in data[i][j]) {
						var cmbAreaT = new Array();
						var cmbCityT = {};
						numT = 0;
						for (var k in data[i][j][n]) {
							cmbAreaT[numT] = data[i][j][n][k].shop_name +'---'+ data[i][j][n][k].shop_id;
							numT ++ ;
						}
						cmbCityT['name'] = n;
						cmbCityT['areaList'] = cmbAreaT;
						ar4[numP] = cmbCityT;
						numP ++;
					}
					cmbProvinceT['name'] = j;
					cmbProvinceT['cityList'] = ar4;
					ar3[numC] = cmbProvinceT;
					//console.log(ar3[numC]);
					numC ++;					
				}
				areaT['_area'] = i;
				areaT['Allcity'] = ar3;
				ar2[numA] = areaT;
				numA ++;
				
			}
			
			//cmbCityT.areaList   JSON.stringify(
			//console.log( ar2);
			var provinceList = ar2;

		    var area=document.getElementById(_carea);
		    var cmbProvince = document.getElementById(_cmbProvince);
		    var cmbCity = document.getElementById(_cmbCity);
		    var cmbArea = document.getElementById(_cmbArea);
		    function cmbSelect(cmb, str){
		        for(var i=0; i<cmb.options.length; i++)
		        {
		            
		            if(cmb.options[i].value == str)
		            {
		                cmb.selectedIndex = i;
		                return;
		            }
		        }
		    }
		    function cmbAddOption(cmb, str, obj){
		        //alert(cmb+'---'+str+'----'+obj);
		        var option = document.createElement("OPTION");
		        if (str.indexOf('---') == -1) {
		            option.innerHTML = str;
		            option.value = str;
		        } else {
		            option.innerHTML = str.split('---')[0];
		            option.value = str.split('---')[1];
		        }
		        
		        option.obj = obj;
		        cmb.options.add(option);
		    }
		    
		    function changeCity(){
		        cmbArea.options.length = 0;
		        if(cmbCity.selectedIndex == -1)return;
		        var item = cmbCity.options[cmbCity.selectedIndex].obj;
		        for(var i=0; i<item.areaList.length; i++)
		        {
		            cmbAddOption(cmbArea, item.areaList[i], null);
		        }
		        cmbSelect(cmbArea, defaultArea);
		    }
		    function changeProvince(){
		        cmbCity.options.length = 0;
		        cmbCity.onchange = null;
		        if(cmbProvince.selectedIndex == -1)return;
		        
		        var item = cmbProvince.options[cmbProvince.selectedIndex].obj;
		        for(var i=0; i<item[cmbProvince.selectedIndex].cityList.length; i++)
		        {
		            cmbAddOption(cmbCity, item[cmbProvince.selectedIndex].cityList[i].name, item[cmbProvince.selectedIndex].cityList[i]);
		        }
		        cmbSelect(cmbCity, defaultCity);
		        changeCity();
		        cmbCity.onchange = changeCity;
		    }
		    function changeArea(){
		        cmbProvince.options.length = 0;
		        cmbProvince.onchange = null;
		        if(area.selectedIndex == -1)return;
		        var item=area.options[area.selectedIndex].obj;
		        for(var i=0;i<item.Allcity.length;i++)
		        {
		            cmbAddOption(cmbProvince,item.Allcity[i].name,item.Allcity);
		        }
		        cmbSelect(cmbProvince,defaultProvince);
		        changeProvince();
		        cmbProvince.onchange=changeProvince;
		    }
		         
		    for(var i=0; i<provinceList.length; i++){
		    //alert(provinceList[i].Allcity[0].name);
		    //var mess=provinceList[i].Allcity.join('--');
		    //alert(mess);
		        cmbAddOption(area, provinceList[i]._area, provinceList[i]);
		    }
		    
		    cmbSelect(area, defaultarea1);
		    changeArea();
		    area.onchange = changeArea;
		};
});
