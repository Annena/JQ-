$(function() {
    // 门店管理--添加修改门店（根据有没有传id来判断是添加还是修改）shopManageAdd
    // ipad滚动条无法滚动的解决
    scrollHei('.nav', '.nav-content', '.stafffloatdivt');

    // 获取到修改传过来的shop_id
    var shopId = getQueryString('shop_id');
    // 获取到修改传过来的缓存
    var data = Cache.get('shopUp');
    // 判断是修改还是添加 0；添加，1：修改
    var addIsUp = 0;

    // 经纬度 (天安门)addr_lng经度 addr_lat纬度
    var addr_lng = '';
    var addr_lat = '';


    var ShopManageAdd = {

        init: function() {
            // 判断是修改还是添加
            if (shopId != null && shopId != undefined && data != null && data != undefined) {
                addIsUp = 1;
                // 把状态显示
                $('#addNoDisplay').removeClass('hide');
                $('#addAndedit').text('门店修改');
                // 显示数据
                this.ShopManageList(data);
            } else {
                addIsUp = 0;
                // 默认显示的省份城市区域
                new PCAS("province", "city", "area", "北京市", "北京", "朝阳区");
                // 把状态隐藏
                $('#addNoDisplay').addClass('hide');
                $('#addAndedit').text('门店添加');
            }
            // 百度地图初始化
            this.mapInitialization(data);

            // 绑定点击事件
            this.ShopManageBind();
        },

        // 显示数据
        ShopManageList: function(data) {
            // 显示数据

            // 门店编号
            $('#shopDid').val(data.shop_did);
            // 门店名称
            $('#shopName').val(data.shop_name);


            // 显示的省份城市区域
            new PCAS("province", "city", "area", data.shop_province, data.shop_city, data.shop_area);
            // 详细地址
            $('#shopAddr').val(data.shop_addr);
            // 联系电话
            $('#shopTel').val(data.shop_tel);

            // 是否默认使用此折扣
            $('#isAutoMember').val(data.is_auto_member);

            // 抹零方式
            $('#smallChangeType').val(data.small_change_type);

            // 是否打印退菜单
            $('#isPrintCheck').val(data.is_print_check);

            // 是否打印退单确认单
            $('#is_print_order_cancel').val(data.is_print_order_cancel);


            // 折扣卡是否允许
            //$('#discountMax').val(data.discount_max);
            var disMax = data.discount_max;
            // 如果折扣返回的是100，就是不允许折扣卡，否则就是允许并且显示折扣额度
            if (disMax == 100) {
                $('#discountMaxNo').attr('checked', 'checked');
                // 并且显示百分号
                $('#baifen').addClass('hide');
            } else {
                $('#discountMax').attr('checked', 'checked');
                // 并且显示出来折扣文本框
                $('#discountMaxPro').removeClass('hide');
                // 折扣填充到页面
                $('#discountMaxPro').val(disMax);
                // 并且显示百分号
                $('#baifen').removeClass('hide');
                // 显示是否默认使用此折扣
                $('#isDiscountDisplay').removeClass('hide');
            }

            // 营业时间  开始时间
            $('#openTime').val(data.open_time);
            // 结束时间
            $('#closeTime').val(data.close_time);

            // 门店状态
            //$('#shopStatus').val(data.shop_status);
            var shopSt = data.shop_status;
            // 如果状态是0就是正常，下拉文本框就选中正常
            if (shopSt == 0) {
                $('#shopStatusList').find('option[value="0"]').attr("selected", true);
            } else if (shopSt == 1) {
                $('#shopStatusList').find('option[value="1"]').attr("selected", true);
            }

            // 是否显示点赞信息
            $('#is_like').val(data.is_like);

            //APP点餐模式
            if (data.shop_type_info == '0') {
                $('#shop_type_info0').attr("checked", 'checked')
            } else if (data.shop_type_info == '1') {
                $('#shop_type_info1').attr("checked", 'checked')
            } else if (data.shop_type_info == 2) {
                $('#shop_type_info2').attr("checked", 'checked')
            }
            // 缓存中的数据取出之后删除
            Cache.del('shopUp');
        },

        // 百度地图初始化
        mapInitialization: function(data) {
            var _self = this;
            //var map = new BMap.Map("allmap");    // 创建Map实例
            var map = new BMap.Map("allmap", { enableMapClick: false }); //构造底图时，关闭底图可点功能
            map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
            //左上角，仅包含平移和缩放按钮
            //map.addControl(new BMap.NavigationControl({anchor: BMAP_ANCHOR_TOP_LEFT, type: BMAP_NAVIGATION_CONTROL_SMALL}));



            // 创建点初始坐标(北京天安门)
            var point = new BMap.Point(116.403958, 39.915049);

            var num = 11;
            // 添加还是修改
            if (addIsUp == 0) { // 添加
                point = new BMap.Point(116.403958, 39.915049);
                num = 11;
            } else { // 修改
                if (data.addr_lat == '' && data.addr_lng == '') {
                    point = new BMap.Point(116.403958, 39.915049);
                    num = 11;
                } else {
                    // google转换百度坐标
                    var x_pi = 3.14159265358979324 * 3000.0 / 180.0;
                    var x = data.addr_lng,
                        y = data.addr_lat;
                    var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);
                    var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);
                    var lng = z * Math.cos(theta) + 0.0065;
                    var lat = z * Math.sin(theta) + 0.006;

                    //alert(lng+'------dddddd--------'+lat);
                    point = new BMap.Point(lng, lat);
                    // 根据坐标创建动画标注点
                    _self.establishAnimation(map, point);
                    // 逆地址解析
                    _self.inverseAddress(map, point);
                    num = 18;
                    //var points = _self.coordinateUpdate(data.addr_lng, data.addr_lat);
                    //point = new BMap.Point(points.lng, points.lat);
                }
            }

            // 正地址解析
            //_self.justAddress(map);

            //setTimeout(function () {

            map.centerAndZoom(point, num); // 初始化地图,设置中心点坐标和地图级别。
            //}, 1000);

            //单击获取点击的经纬度
            map.addEventListener("click", function(e) {
                //alert(e.Custompoi.address);
                //alert(e.pixel  + "," + e.target + "," + e.overlay);
                // 创建点击坐标
                var animation = new BMap.Point(e.point.lng, e.point.lat);
                // 逆地址解析
                _self.inverseAddress(map, animation);
                // 创建动画标注点
                _self.establishAnimation(map, animation);
            });

            /*setTimeout(function () {
                console.log(map.getInfoWindow());
                console.log(map.getOverlays());
                console.log(map.getPanes());
            }, 5000);*/

            // 智能搜索
            _self.mapSelect(map);
        },

        // 逆地址解析
        inverseAddress: function(map, point) {
            var geoc = new BMap.Geocoder();
            geoc.getLocation(point, function(rs) {
                var addComp = rs.addressComponents;
                //alert(rs.address);
                // 省市区街道
                //alert(addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber);
                // 放入输入框
                $('#baiduMap').val(addComp.city + addComp.district + addComp.street + addComp.streetNumber);
            });
        },

        // 正地址解析
        justAddress: function(map, address) {
            // 创建地址解析器实例
            var myGeo = new BMap.Geocoder();
            // 将地址解析结果显示在地图上,并调整地图视野
            myGeo.getPoint("北京市海淀区上地10街", function(point) {
                if (point) {
                    map.centerAndZoom(point, 16);
                    map.addOverlay(new BMap.Marker(point));
                } else {
                    //alert("您选择地址没有解析到结果!");
                }
            }, "");
        },

        //google坐标转百度坐标
        coordinateUpdate: function(lng, lat) {
            /*var x_pi = accDiv(accMul(3.14159265358979324,3000.0),180.0);
            var x = lng, y = lat;  
            var z =Math.Sqrt(x * x + y * y) + 0.00002 * Math.Sin(y * x_pi);  
            var theta = Math.Atan2(y, x) + 0.000003 * Math.Cos(x * x_pi);  
            lng = z * Math.Cos(theta) + 0.0065;  
            lat = z * Math.Sin(theta) + 0.006;

            alert(lng+'--------------'+lat);*/


            // 百度地图API功能
            //谷歌坐标
            var x = lng;
            var y = lat;
            var ggPoint = new BMap.Point(x, y);


            //坐标转换完之后的回调函数
            translateCallback = function(data) {
                if (data.status === 0) {
                    //alert(data.points[0].lng+'--------------'+data.points[0].lat);
                    return {
                        'lng': data.points[0].lng,
                        'lat': data.points[0].lat
                    };
                }
            }

            var convertor = new BMap.Convertor();
            var pointArr = [];
            pointArr.push(ggPoint);
            convertor.translate(pointArr, 3, 5, translateCallback);
        },

        // 创建动画标注点
        establishAnimation: function(map, point) {
            map.clearOverlays(); // 清除所有覆盖物

            var marker = new BMap.Marker(point); // 创建动画标注点
            map.addOverlay(marker); // 将标注添加到地图中
            //marker.setAnimation(BMAP_ANIMATION_BOUNCE);//跳动的动画
            var p = marker.getPosition(); //获取marker的位置

            //alert("marker的位置是" + p.lng + "," + p.lat); 
            addr_lng = p.lng;
            addr_lat = p.lat;

            // 坐标转换
            var x_pi = accDiv(accMul(3.14159265358979324, 3000.0), 180.0);
            // 转为谷歌坐标经纬度

            var x = addr_lng - 0.0065,
                y = addr_lat - 0.006;

            var z = Math.sqrt(accAdd(accMul(x, x), accMul(y, y)))- accMul(0.00002, Math.sin(accMul(y, x_pi)));

            var theta = Math.atan2(y, x)- accMul(0.000003, Math.cos(accMul(x, x_pi)));
            addr_lng = accMul(z, Math.cos(theta)); //.toFixed(10)
            addr_lat = accMul(z, Math.sin(theta));
            //console.log("marker的位置是" + addr_lng + "," + addr_lat);
            //alert("marker的位置是" + addr_lng + "," + addr_lat); 
        },

        // 智能搜索
        mapSelect: function(map) {
            var _self = this;
            // 百度地图API功能
            function G(id) {
                return document.getElementById(id);
            }

            var ac = new BMap.Autocomplete( //建立一个自动完成的对象
                {
                    "input": "baiduMap",
                    "location": map
                });

            //鼠标放在下拉列表上的事件
            ac.addEventListener("onhighlight", function(e) {
                var str = "";
                var _value = e.fromitem.value;
                var value = "";
                if (e.fromitem.index > -1) {
                    value = _value.province + _value.city + _value.district + _value.street + _value.business;
                }
                str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;

                value = "";
                if (e.toitem.index > -1) {
                    _value = e.toitem.value;
                    value = _value.province + _value.city + _value.district + _value.street + _value.business;
                }
                str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
                G("searchResultPanel").innerHTML = str;
            });

            //鼠标点击下拉列表后的事件
            var myValue;
            ac.addEventListener("onconfirm", function(e) {
                var _value = e.item.value;
                myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
                G("searchResultPanel").innerHTML = "onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;

                setPlace();
            });

            function setPlace() {
                map.clearOverlays(); //清除地图上所有覆盖物
                function myFun() {
                    var pp = local.getResults().getPoi(0).point; //获取第一个智能搜索的结果
                    map.centerAndZoom(pp, 18);
                    // 创建动画标注点
                    _self.establishAnimation(map, pp);
                }
                var local = new BMap.LocalSearch(map, { //智能搜索
                    onSearchComplete: myFun
                });
                local.search(myValue);
            }
        },

        // 绑定点击事件
        ShopManageBind: function() {
            var _self = this;
            // 点击修改
            $('#consumebtn').unbind('click').bind('click', function() {

                _self.checkCondition();
                // if (addIsUp == 0) {
                //  _self.shopManageAdd();
                // } else if (addIsUp == 1) {
                //  _self.shopManageUpdate();
                // }
            });

            // 点击取消
            $('#exitbtn').unbind('click').bind('click', function() {
                // 跳转
                window.location.replace('shopManage.html?is_select=' + getQueryString('is_select'));
            });

            // 点击不允许的时候
            $('#discountMaxNo').unbind('click').bind('click', function() {
                // 折扣文本框清空
                //$('#discountMaxPro').val('');
                // 并且隐藏折扣文本框
                $('#discountMaxPro').addClass('hide');
                // 并且隐藏百分号
                $('#baifen').addClass('hide');
                // 隐藏是否默认使用此折扣
                $('#isDiscountDisplay').addClass('hide');
            });

            // 点击允许的时候
            $('#discountMax').unbind('click').bind('click', function() {
                // 并且显示折扣文本框
                $('#discountMaxPro').removeClass('hide');
                // 并且显示百分号
                $('#baifen').removeClass('hide');
                // 显示是否默认使用此折扣
                $('#isDiscountDisplay').removeClass('hide');
            });

            $('#discountMaxPro').unbind('input').bind('input', function() {
                //alert($('#discountMaxPro').val());
                //正则表达式验证必须为数字
                var numPro = /^\d*\.{0,1}\d{0,2}$/;
                //查找输入字符第一个为0 
                var resultle = $('#discountMaxPro').val().substr(0, 1);
                if (numPro.test($('#discountMaxPro').val())) {
                    if (resultle == 0) {
                        //替换0为空
                        $('#discountMaxPro').val($('#discountMaxPro').val().replace(/0/, ""));
                        if ($('#discountMaxPro').val().substr(0, 1) == '.') {
                            $('#discountMaxPro').val(0);
                        }
                    }
                    if ($('#discountMaxPro').val() == '') {
                        $('#discountMaxPro').val(0);
                    }

                } else {
                    $('#discountMaxPro').val(0);

                }
            });
        },

        // 添加
        shopManageAdd: function() {
            // 获取到各个数据，请求接口提交数据
            var self = this;
            // 门店编号
            var shopDid = $('#shopDid').val();
            // 门店名称
            var shopName = $('#shopName').val();
            // 省份
            var shopProvince = $("#shopProvince").val();
            // 城市
            var shopCity = $("#shopCity").val();
            // 区域
            var shopArea = $("#shopArea").val();
            // 详细地址
            var shopAddr = $('#shopAddr').val();
            // 联系电话
            var shopTel = $('#shopTel').val();

            // 是否默认使用此折扣
            var isAutoMember = 0;
            // 折扣
            var discountMax;
            // 如果不允许选中了
            if ($('#discountMaxNo').is(':checked')) {
                //alert('ddtt');
                discountMax = $('#discountMaxNo').val();
                isAutoMember = 0;
            } else {
                //alert('dd');
                discountMax = $('#discountMaxPro').val();
                isAutoMember = $('#isAutoMember').val();
            }

            // 营业时间  开始时间
            var openTime = $('#openTime').val();
            // 结束时间
            var closeTime = $('#closeTime').val();
            //alert($('#discountMaxNo').is(':checked')+'----'+$('#discountMaxPro').is(':checked'));
            // 如果两个都没有选中提示用户选择折扣卡
            if (!$('#discountMaxNo').is(':checked') && !$('#discountMax').is(':checked')) {

                //alert('bb');
                displayMsg(ndPromptMsg, '请选择是否允许使用折扣卡!', 2000);
                return;

            }

            // 抹零方式
            var smallChangeType = $('#smallChangeType').val();

            // 是否打印退菜单
            var isPrintCheck = $('#isPrintCheck').val();

            // 是否打印退单确认单
            var is_print_order_cancel = $('#is_print_order_cancel').val();

            // 是否显示点赞信息
            var is_like = $('#is_like').val();

            //APP点餐模式
            var shop_type_info = $('.appPattern ').find('input:checked').val();

            // 效验数据通过才能修改
            if (this.dataCheck()) {
                setAjax(AdminUrl.shopShopAdd, {
                    'shop_name': shopName,
                    'shop_addr': shopAddr,
                    'shop_tel': shopTel,
                    'shop_province': shopProvince,
                    'shop_city': shopCity,
                    'shop_area': shopArea,
                    'discount_max': discountMax,
                    'open_time': openTime,
                    'close_time': closeTime,
                    'shop_did': shopDid,
                    'is_auto_member': isAutoMember,
                    'small_change_type': smallChangeType,
                    'is_print_check': isPrintCheck,
                    'is_print_order_cancel': is_print_order_cancel,
                    'addr_lng': addr_lng,
                    'addr_lat': addr_lat,
                    'is_like': is_like
                        //'shop_type_info':shop_type_info
                }, $('#prompt-message'), { 20: '' }, function(respnoseText) {
                    // 得到返回数据
                    var data = respnoseText.data;

                    window.location.replace('shopManage.html?is_select=' + getQueryString('is_select'));
                }, 2);
            }
        },

        // 修改
        shopManageUpdate: function() {
            // 获取到各个数据，请求接口提交数据
            var self = this;
            // 门店编号
            var shopDid = $('#shopDid').val();
            // 门店名称
            var shopName = $('#shopName').val();
            // 省份
            var shopProvince = $("#shopProvince").val();
            // 城市
            var shopCity = $("#shopCity").val();
            // 区域
            var shopArea = $("#shopArea").val();
            // 详细地址
            var shopAddr = $('#shopAddr').val();
            // 联系电话
            var shopTel = $('#shopTel').val();
            // 状态
            var shopStatusList = $("#shopStatusList").val();

            // 是否默认使用此折扣
            var isAutoMember = 0;
            // 折扣
            var discountMax;
            // 如果不允许选中了
            if ($('#discountMaxNo').is(':checked')) {
                //alert('ddtt');
                discountMax = $('#discountMaxNo').val();
                isAutoMember = 0;
            } else {
                //alert('dd');
                discountMax = $('#discountMaxPro').val();
                isAutoMember = $('#isAutoMember').val();
            }

            // 营业时间  开始时间
            var openTime = $('#openTime').val();
            // 结束时间
            var closeTime = $('#closeTime').val();

            // 抹零方式
            var smallChangeType = $('#smallChangeType').val();

            // 是否打印退菜单
            var isPrintCheck = $('#isPrintCheck').val();

            // 是否打印退单确认单
            var is_print_order_cancel = $('#is_print_order_cancel').val();


            // 是否显示点赞信息
            var is_like = $('#is_like').val();

            //APP点餐模式
            var shop_type_info = $('.appPattern ').find('input:checked').val();
            // 效验数据通过才能修改
            if (this.dataCheck()) {
                setAjax(AdminUrl.shopShopUpdate, {
                    'shop_id': shopId,
                    'shop_name': shopName,
                    'shop_addr': shopAddr,
                    'shop_tel': shopTel,
                    'shop_province': shopProvince,
                    'shop_city': shopCity,
                    'shop_area': shopArea,
                    'discount_max': discountMax,
                    'open_time': openTime,
                    'close_time': closeTime,
                    'shop_did': shopDid,
                    'shop_status': shopStatusList,
                    'is_auto_member': isAutoMember,
                    'small_change_type': smallChangeType,
                    'is_print_check': isPrintCheck,
                    'is_print_order_cancel': is_print_order_cancel,
                    'addr_lng': addr_lng,
                    'addr_lat': addr_lat,
                    'is_like': is_like
                        //'shop_type_info':shop_type_info
                }, $('#prompt-message'), { 20: '' }, function(respnoseText) {
                    // 得到返回数据
                    var data = respnoseText.data;
                    window.location.replace('shopManage.html?is_select=' + getQueryString('is_select'));
                }, 2);
            }
        },

        // 效验要修改的数据
        dataCheck: function() {
            var boolCheck = $('#discountMax').is(":checked");

            if (dataTest('#shopName', '#prompt-message', { 'empty': '不能为空' }) &&
                dataTest('#shopAddr', '#prompt-message', { 'empty': '不能为空' }) &&
                dataTest('#shopTel', '#prompt-message', { 'empty': '不能为空', 'phoneNumber': '不正确' })
                // && dataTest('#discountMaxPro', '#prompt-message', { 'empty': '不能为空', 'sphoneNumberale': '折扣额度必须为整数且超过100'})

            ) {
                if (boolCheck == true) {
                    if (dataTest('#discountMaxPro', '#prompt-message', { 'empty': '不能为空', 'sale': '必须为0-100的正整数' })) {
                        return true;
                    };
                    return false;
                };
                //alert('tt');
                return true;
            }

            return false;
        },

        // 检测条件
        checkCondition: function() {

            var _self = this;

            var start = $('#openTime').val(),
                end = $('#closeTime').val();

            if (start == "" || end == "") {
                displayMsg(ndPromptMsg, '请选择开始时间和结束时间!', 2000);
                return;
            }

            if (start > end) {
                displayMsg(ndPromptMsg, '开始时间应小于结束时间!', 2000);
                return;
            }

            // defaults.start = start;
            // defaults.end = end;
            // defaults.del = $('#status').val();

            if (addIsUp == 0) {
                _self.shopManageAdd();
            } else if (addIsUp == 1) {
                _self.shopManageUpdate();
            }
        },
    }

    ShopManageAdd.init();

});