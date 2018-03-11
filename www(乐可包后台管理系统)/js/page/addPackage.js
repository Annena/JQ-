$(function() {
    // 套餐菜品添加修改
    var person_get = person_get_data();
    // 商户英文名
    var business = person_get.company_name_en;
    // 获取到修改传过来的sale_shop_id
    var menuId = getQueryString('menu_id');
    // 获取到修改传过来的缓存
    var dataPro = Cache.get('disUp');
    // 判断是修改还是添加 0;添加，1：修改
    var addIsUp = 0;
    // 菜品状态
    var menuStatusPro = '';
    var dishData = '';
    // 价格策略列表
    var menu_price_list = {};
    // 价格策略列表
    var member_price_list = {}; 
    //价格策略对应的弹窗1代表普通价格2代表价格策略
    var priceType = 1;
    
    //修改时判断是否已经有价格策略默认为false不存在价格策略
    var is_price = false;
    //修改时判断是否已经有会员价格策略默认为false不存在价格策略
    var is_member_price = false;
    //套餐数据
    var set_menu_infoOther = {};
    //通过编辑默认套餐打开是0.通过是否替换是1
    var whatF = 0;
    //通过编辑默认套餐打开点击确认数据
    var set_menu_infoOtherTwo = {};
    //辨认实在哪个ID点的可换菜
    var whatId = '';
    // 列表修改传过来的门店集合
    var shopIdPros = '';
    var mengData = {};
    var sale_shop_id = '';
    //是否显示大图 勾选值为2，不勾选值1
    var list_style = 0;
    var DishesManageAdd = {
        init: function() {           
            // 判断是修改还是添加
            if (menuId != null && menuId != undefined && dataPro != null && dataPro != undefined) {
                addIsUp = 1;
                menuStatusPro = dataPro.menuStatus;
                
                    // 修改显示菜品图片
                $('#menuPic').removeClass('hide');
                // 修改显示状态
                $('#disDisplay').removeClass('hide');
                $('#addAndedit').text('菜品修改');
                if (dataPro.sale_commission.all) {
                    $('#allAdd').removeClass('hide')
                    $('#otherAdd').remove()
                } else {
                    $('#allAdd').remove()
                    $('#otherAdd').removeClass('hide')
                }
                $('#isGive').val(dataPro.is_give);
                if(JSON.stringify(dataPro.menu_price_list) == "{}"){
                    $('#PriceContent').addClass("hide");
                }
                if(JSON.stringify(dataPro.member_price_list) == "{}"){
                    $('#PriceMemberContent').addClass("hide");
                }
                this.DishesData(dataPro);
                modifyDish(dataPro);
            } else {
                addIsUp = 0;
                menuStatusPro = getQueryString('menu_status');
                // 添加隐藏菜品图片
                $('#menuPic').addClass('hide');
                // 添加隐藏状态
                $('#addAndedit').text('菜品添加');
                $('#disDisplay').addClass('hide')
                    //隐藏下架列表
                $('#yixiajia').addClass('hide')
                $('#allAdd').removeClass('hide')
                $('#otherAdd').remove()

            }
            // 定义菜品状态参数 0:正常，1：估清，2：下架，默认是0显示正常菜品列表
            //alert(data.menu_status);
            // 如果是正常的话，就显示正常的分类列表
            if (menuStatusPro == 0) {
                // 获取到菜品分类填充到页面
                this.disCategoryData();
                //获取到菜品属性填充到页面
                this.propertyData();
            } else if (menuStatusPro == 2) { // 如果是下架的话，就显示所有的分类列表

                this.disCategoryDataTwo();
                // 如果是下架的话，就显示所有的属性列表
                this.propertyDataTwo();
            }

            // 显示所有店铺数据，调用public.js中公用的方法
            this.shopData();
            //新增类型显示
            this.showMessage();
            //打包盒
            this.packOut();
            // 绑定点击事件
            this.DishesAddBind();
        },

        // 显示基本数据
        DishesData: function(data) {
            // 从缓存中获取到cardId
            var cardId = person_get.card_id;
            // 显示数据
            //特定商品显示隐藏
            this.typeShow(data.special_type);

            //菜品适用范围                
            $('#menuScope').val(data.menuScope);

            // 菜品did
            $('#menuDid').val(data.menu_did);
            // 菜品名称
            $('#menuName').val(data.menu_name);
            // 菜品标签
            var menuByname = data.menu_byname;
            var menu_byname = '';              
            if (menuByname == '') {
                menu_byname = '';
            } else {                    
                for (var i = 0; i < menuByname.length; i++) {
                    if ((menuByname.length - 1) == i) {
                        menu_byname += menuByname[i];
                    } else {
                        menu_byname += menuByname[i]+'\n';
                    }
                }
            }       
            $('#menu_byname').html(menu_byname);
            //把价格策复制给公共的
            for(var i in data.menu_price_list){
                menu_price_list[i] = data.menu_price_list[i];
                menu_price_list[i]['price_id']=i;
            }
            //把会员价格策复制给公共的
            for(var i in data.member_price_list){
                member_price_list[i] = data.member_price_list[i];   
                member_price_list[i]['price_id']=i;
            }
            //判断是否显示价格策略表
            if(JSON.stringify(data.menu_price_list) == "{}"){
                $('#PriceContent').addClass("hide");
            }else{
                $('#PriceContent').removeClass("hide");
                 // 菜品价格 price_data对数组进行填充
                for(var key in menu_price_list){
                    $('#add_price_tbodys').append(price_data(menu_price_list[key],1));
                }
            }
            //判断是否显示会员价格策略表
            if(JSON.stringify(data.member_price_list) == "{}"){
                $('#PriceMemberContent').addClass("hide");
            }else{
                $('#PriceMemberContent').removeClass("hide");
                //菜品会员价格price_data对数组进行填充           
                for(var key in member_price_list){
                    $('#add_memprice_tbodys').append(price_data(member_price_list[key],1));                                 
                }
            }
            
            // 菜品图片
            $('#menuPic').html('<img src="../../img/business/' + cardId + '/menu/' + data.menu_id + '.jpg?' + Math.random() + '">');
            // 菜品说明
            $('#menuInfo').val(data.menu_info);
            //alert($('#disCategoryTbodys').html());
            // 菜品分类 因为如果在这里显示修改的分类的话，分类类别会在运行完这句代码之后再显示出来菜品分类，这样就不能显示用户之前选中你的菜品分类了，所以把下面这句代码放到了菜品分类列表显示到页面之后运行，打印机和这个一样
            //$('#disCategoryTbodys').val(data.menu_type_id);
            // 是否打折
            $('#isDiscount').val(data.is_discount);
            // 打印机
            //$('#printLisTbodys').val(data.printer_id);
            // 状态
            $('#menuStatus').val(data.menuStatus);
            // 是否输入数量
            $('#isInput').val(data.is_input);

            //菜品适用范围
            $('#menuScope').val(data.menu_scope);

            // 菜品注记码
            $('#searchCode').val(data.search_code);

            //条形码
            $('#scanCode').val(data.scanCode);
            //是否大图
            if (data.list_style == 2) {
                $('#list_style').attr('checked', true)
            } else {
                $('#list_style').attr('checked', false)
            }

            //总部提成金额
            $('#allTicheng').text(data.allSale_commission)

            //指定商品
            $('#foodsType').val(data.special_type);
            //打包盒id
            $('#packbox').val(data.pack_id);
            //是否支持餐厅售卖
            if (data.is_shop == '1') $('#sell-sites input[name="shopSell"]').attr("checked", true);
            //是否支持商城售卖
            if (data.is_store == '1') $('#sell-sites input[name="sell"]').attr("checked", true);
            //是否支持堂食订单
            if (data.is_order == '1') $('#order-type input[name="shop"]').attr("checked", true);
            //是否支持外卖订单
            if (data.is_takeout == '1') $('#order-type input[name="takeout"]').attr("checked", true);
            // 是否支持打包订单
            if (data.is_pack == '1') $('#order-type input[name="pack"]').attr("checked", true);
            
            if (data.sale_commission.all == undefined) {
                $('#ticheng').val(parseFloat(data.sale_commission).toFixed(2));
                $('#ticheng').parent('span').prev('input').attr('checked', true)
                $('#allTicheng').prev('input').attr('checked', false)
            } else {
                
                $('#allTicheng').html(parseFloat(data.sale_commission.all).toFixed(2));
                $('#ticheng').val(parseFloat(0).toFixed(2));
                $('#allTicheng').prev('input').attr('checked', true)
                $('#ticheng').parent('span').prev('input').attr('checked', false)
            }

            //店铺名称
            $('.shopName').text(data.shopName)
                // 缓存中的数据取出之后删除
            Cache.del('disUp');

        },

        // 绑定点击事件
        DishesAddBind: function() {
            var _self = this;
            // 点击修改
            $('#updatebtn').unbind('click').bind('click', function() {
                var list_styleC = $('#list_style').prop("checked");
                if (list_styleC == true) {
                    list_style = 2;
                } else {
                    list_style = 1;
                };
                // 校验数据在进行添加修改
                if (_self.checkData()) {
                    if (addIsUp == 0) {
                        _self.DishesAdd();
                    } else if (addIsUp == 1) {
                        _self.DishesUpdate();
                    }
                }
            });

            // 点击导航
            $('#selectJump').unbind('click').bind('click', function() {
                window.location.replace('dishesManage.html?is_select=1&type=' + getQueryString('type'));
            });

            // 点击取消
            $('#exitbtn').unbind('click').bind('click', function() {
                // 跳转
                window.location.replace('dishesManage.html?is_select=1&type=' + getQueryString('type'));
            });

            //点击自动生成
            $('#autoGene').unbind('click').bind('click', function () {
                //通过汉字生成拼音
                if( $('#menuName').val() != ''){
                    var hanzi = $('#menuName').val();
                    var pinyin = toPinyin(hanzi);
                    var lowerPinyin = conversion_case(pinyin)
                    $('#searchCode').val(lowerPinyin);
                }else{
                    displayMsg($('#prompt-message'), '请输入菜品名称', 2000);
                }
                    
            });

            //用户删除菜品名称时，菜品助记码清空
            $('#menuName').unbind('input propertychange').bind('input propertychange', function () {
                if( $('#menuName').val() == ''){
                    $('#searchCode').val("");
                }
            });

            //点击添加价格策略时
            $('#addPrice').unbind('click').bind('click',function(){                 
                var self = this;     
                priceType=1;                
                //1代表普通价格2代表会员价格 public公共方法里面
                PriceAdd($(self),1);
            });
            
            //点击修改/删除价格策略时
            $('#PriceContent table').delegate('tr', 'click', function(event) {
                var self = this,                    
                type = $(event.target).attr('data-type');
                 //1代表价格策略，2代表会员价格策略
                priceType=1;   
                //给修改价格策略函数传值，type是操作的类型是删除还是修改               
                // public公共方法里面
               menu_price_list=PriceUpdate($(self),type,menu_price_list);
            });

            //点击添加会员价格策略时
            $('#addmemberPrice').unbind('click').bind('click',function(){                   
                var self = this;  
                priceType=2;   
                //1代表普通价格2代表会员价格 public公共方法里面
                PriceAdd($(self),2);
            });
            //点击修改/删除会员价格策略
            $('#PriceMemberContent table').delegate('tr', 'click', function(event) {
                var self = this,                    
                type = $(event.target).attr('data-type');
                //1代表价格策略，2代表会员价格策略 
                priceType=2;   
                //给修改价格策略函数传值，type是操作的类型是删除还是修改 
                //public公共方法里面
                member_price_list=PriceUpdate($(self),type,member_price_list);
            });
            
            
            //点击会员价格/会员价格策略弹出的保存按钮时
            $('#dialog_price_sava_btn').unbind('click').bind('click',function(){
                var self = this;
                var dataType=$('#dialog_price_sava_btn').attr('data-type');
                //type 1：表示普通价格2：表示会员价格
                //dataType update：表示修改，add表示保存
                ////1代表价格2代表会员价格                
                if(priceType == 1){
                    menu_price_list=Pricesave(1,dataType,menu_price_list);
                }else{
                    member_price_list=Pricesave(2,dataType,member_price_list);
                }
                
            });
            //点击会员价格/会员价格策略弹框的取消按钮时
            $('#dialog_price_cancel_btn').unbind('click').bind('click',function(){
                layer.close(layerBox);
            });
            //时间自定义下面的表单置灰
            $('input[name="pricedate"]').each(function(){                   
                $(this).unbind('click').bind('click', function () {
                    clickradio($(this).val(),$('.second-width'));     
                });
            });
            //星期自定义下面的表单置灰
            $('input[name="week_radio"]').each(function(){                  
                $(this).unbind('click').bind('click', function () {
                    clickradio($(this).val(),$('input[name="weekcheckbox"]'));        
                });
            });
            //时段自定义下面的表单置灰
            $('input[name="hour_radio"]').each(function(){                  
                $(this).unbind('click').bind('click', function () {
                    clickradio($(this).val(),$('.hour_select'));          
                });
            });

            $('#ticheng').unbind('click').bind('click', function() {
                $(this).val('')
            })
            $('#allTicheng').unbind('click').bind('click', function() {
                    $(this).val('')
                })
                // 点击选择图片按钮后存取生成图片路径
            $("#menuPictt").change(function() {
                var objUrl = getObjectURL(this.files[0]);
                $('#menuPic').removeClass('hide');
                // 判断文件类型必须是JPG，png，bump中的一种
                if (checkImgType(this)) {
                    //console.log("objUrl = "+objUrl) ;
                    if (objUrl) {
                        $("#menuPic").attr("src", objUrl);
                        $('#menuPic').html('<img id="dishesmenupic" src="' + objUrl + '">');

                    }
                }
            });

            //点击是否特定商品
            $("#foodsType").change(function() {
                var value = $(this).val();
                _self.typeShow(value);
            });



            //建立一個可存取到該file的url
            function getObjectURL(file) {
                var url = null;
                if (window.createObjectURL != undefined) { // basic
                    url = window.createObjectURL(file);
                } else if (window.URL != undefined) { // mozilla(firefox)
                    url = window.URL.createObjectURL(file);
                } else if (window.webkitURL != undefined) { // webkit or chrome
                    url = window.webkitURL.createObjectURL(file);
                }
                return url;
            }
        },
        // 特殊商品部分不显示
        typeShow: function(value) {
            var _self = this;
            var abstellbar = $('.clearfix[data-name="abstellbar"]');
            var menuscope = $('.clearfix[data-name="menuscope"]');
            this.changeText(value, $(".test_t .font"));
            if (value != "0") {
                menuscope.addClass('hide');
                abstellbar.addClass('hide');
                $("#isDiscount").val("0");
                if (parseInt(value) >= 6 && parseInt(value) != 11 && parseInt(value) != 12 && parseInt(value) != 13) {
                    abstellbar.removeClass('hide');
                }
            } else {
                abstellbar.removeClass('hide');
                menuscope.removeClass('hide');
                $("#isDiscount").val("1");
            }
            // if (value == "5") {
            //     $('#shopIds div input[type="checkbox"]').each(function(i, val) {
            //         $(this).prop('checked', true);
            //         $(this).prop('disabled', true);
            //     });
            //     shopIds = 'all';
            // } else {
            //     $('#shopIds div input[type="checkbox"]').each(function(i, val) {
            //         $(this).prop('disabled', false);
            //     });
            // }

            // 三种特殊商品类型：11 百度外卖配送费12 饿了么外卖配送费13 美团外卖配送费，在APP、点菜宝、收银台点菜界面不显示
            if (value == "11" || value == "12" || value == "13") {
                $('#menuScope').val(3);
                $('#menuScope').prop('disabled', true);
            } else {
                $('#menuScope').val(3);
                $('#menuScope').prop('disabled', false);
            }

        },
        //指定商品提示文字
        changeText: function(index, box) {
            switch (index) {
                case "0":
                    box.html("");
                    break;
                case "1":
                    box.html("*如果需要按就餐人数收取堂食餐具费，每个门店可以设置一个堂食餐包");
                    break;
                case "2":
                    box.html("*如果需要按就餐人数收取外卖餐包费，每个门店可以设置一个外卖餐包");
                    break;
                case "3":
                    box.html("*如果外卖订单需要自动收取送餐费，每个门店可以设置一个外卖送餐费");
                    break;
                case "11": 
                    box.html("*如果外卖订单需要自动收取送餐费，每个门店可以设置一个外卖送餐费");
                    break;
                case "12": 
                    box.html("*如果外卖订单需要自动收取送餐费，每个门店可以设置一个外卖送餐费");
                    break;
                case "13": 
                    box.html("*如果外卖订单需要自动收取送餐费，每个门店可以设置一个外卖送餐费");
                    break;
                case "4":
                    box.html("*如果商城订单需要自动收取商城配送费，每个门店可以设置一个商城配送费");
                    break;
                case "5":
                    box.html("*如果需要给外卖、打包商品设置打包盒，就需要先添加对应的打包盒");
                    break;
                case "6":
                    box.html("*设置需要必点锅底的菜品才能生效");
                    break;
                case "7":
                    box.html("*设置需要必点小料的菜品才能生效");
                    break;
                case "8":
                    box.html("*如果要让设置的必点商品生效，需要设置点了哪些条件商品，才会要求必点商品。比如涮菜、配菜");
                    break;
            }
        },

        // 校验数据
        checkData: function() {
            // 菜品助记码
            var searchCode = $('#searchCode').val();
            //alert(searchCode);
            if (searchCode != '') {
                var searchReg = /^[0-9|a-zA-Z|0-9a-zA-Z]{0,32}$/;
                if (!searchReg.test(searchCode)) {
                    displayMsg($('#prompt-message'), '菜品助记码必须是数字和字母32位', 2000);
                    return false;
                }
            }
            //菜品标签
            var menuByname = $('#menu_byname').val();
            //以换行符为分隔符将内容分割成数组
            var menuBynameArry = menuByname.split("\n");
            var numByname = 0;  // 菜品标注行数
            var sale_commission = $('#ticheng').val();
            if($('#ticheng').val() != ''){
                if(!check_sale(sale_commission)){
                    return;
                }
            }
            //最多支持12个汉字，最多支持5个标签(字母数字符号算半个)             
            for (var h = 0; h < menuBynameArry.length; h++) {
                if (menuBynameArry[h] == '') {
                    continue;
                }                   
                var l = menuBynameArry[h].replace(/[ ]/g,"").length;
                var blen = 0;

                for(i=0; i<l; i++) {
                    if ((menuBynameArry[h].replace(/[ ]/g,"").charCodeAt(i) & 0xff00) != 0) {
                        blen++;
                    }
                    blen++;
                }                   
                if (blen > 24) {
                    displayMsg($('#prompt-message'), '菜品标签只能输入12个汉字', 2000);
                    return false;
                }
                numByname++;
            }

            if (numByname > 5) {
                displayMsg($('#prompt-message'), '菜品标签不能超过五个', 2000);
                return false;
            }
            
            var naryByname = menuBynameArry.sort();
            for(var i = 0; i < naryByname.length - 1; i++){
                if (naryByname[i] == naryByname[i+1]){
                    displayMsg($('#prompt-message'), '菜品标签不能出现重复', 2000);
                    return false;
                }
            }
            // 菜品说明不能超过85个字
            var menu_info = $('#menuInfo').val();
            var len2 = menu_info.length;
            var reg2 = /[\u4e00-\u9fa5]{1,}/g;
            if(reg2.test(menu_info)){
                len2 += menu_info.match(reg2).join("").length;
            }
            if(len2 > 340){
                displayMsg($('#prompt-message'), '菜品说明最多支持170个汉字、字母、数字、符号', 3000);
                return false;
            }

            //如果输入的有空格，删除空格
            $('#form ul input').each(function() {
                if ($(this).val() != '') {
                    if ($(this).attr('id') != 'menuPictt') {
                        $(this).val($(this).val().replace(/\s/g, ""))
                    }
                }
            })

            return true;
        },


        // 请求显示店铺
        shopData: function() {
            var self = this;
            //alert(shopStatusList);
            setAjax(AdminUrl.shopShopList, {
                'type': 2
            }, $('#prompt-message'), { 20: '' }, function(respnoseText) {
                // 得到返回数据
                var data = respnoseText.data;
                // self.shopList(data);

            }, 0);
        },
        // 添加
        DishesAdd: function() {
            // 获取到各个数据，请求接口提交数据
            var self = this;
            // 把cid放进去
            $('#CID').val($.cookie('cid'));
            $('#companyNameEn').val(business);
            var menuPrice = '';
            if ($('#menuPrice').val() != '') {
                // 菜品价格转换为两位小数
                menuPrice = parseFloat($('#menuPrice').val()).toFixed(2);
            }
            //提成金额
            var sale_commission=new Object();
            if($('#ticheng').val() != ''){
                sale_commission['all'] = parseFloat($('#ticheng').val()).toFixed(2);
            }else {
                sale_commission['all'] = 0.00;
            }

            // 菜品价格列表
            var menupricelist = [];
            for(var i in menu_price_list){
                
                for(var key in menu_price_list[i]){
                    if(key == 'hour_time' || key == 'week_day'){
                        if(isArray(menu_price_list[i][key])){
                            menu_price_list[i][key] = menu_price_list[i][key].toString();
                        }
                    }
                }
                menupricelist.push(menu_price_list[i]);
            }                
            // 会员价列表
            var memberpricelist = [];  
            for(var i in member_price_list){
               
                for(var key in member_price_list[i]){
                    if(key == 'hour_time' || key == 'week_day'){
                        if(isArray(member_price_list[i][key])){
                            member_price_list[i][key] = member_price_list[i][key].toString();
                        }
                    }
                }
                memberpricelist.push(member_price_list[i])
            }             
            

            //alert(memberPrice);
            //菜品适用范围
            var menuScope = $('#menuScope').val();

            // 菜品单位 
            var menuUnit = $('#menuUnit').val();
            if (menuUnit == '') {
                menuUnit = '份';
            }


            var set_menu_info = {};
            var num1 = 0;
            var num2 = 0;

            if ($('.replaceCenter ul').find('p').length == '0') {
                displayMsg($('#prompt-message'), '请选择套餐内容', 2000);
                return;
            };
            // 循环得到套餐内容数据
            $('.replaceCenter ul').find('p').each(function() {
                //var id = $(this).attr('data_type').split('_')[0];
                var id = $(this).attr('data_type').split('_')[0];

                var ids = $(this).attr('data_type').split('_')[1];
                var dataNum = $(this).attr('data_num');

                if (ids == 'yes') {

                    set_menu_info[num1] = {};
                    num2 = 0;
                    set_menu_info[num1][num2] = {};
                    set_menu_info[num1][num2].menu_id = id.substring(0, 12);
                    set_menu_info[num1][num2].menu_num = parseFloat(dataNum).toFixed(1);
                    set_menu_info[num1][num2].is_choose = '1';

                    $('.replaceCenter ul').find('p').each(function() {
                        var id2 = $(this).attr('data_type').split('_')[0];
                        var id3 = $(this).attr('data_type').split('_')[1];
                        var menu_id = $(this).attr('id');
                        var dataNum2 = $(this).attr('data_num');

                        if (id3 == 'no') {
                            if (id == id2) {
                                num2++;
                                set_menu_info[num1][num2] = {};
                                set_menu_info[num1][num2].menu_id = menu_id;
                                set_menu_info[num1][num2].menu_num = parseFloat(dataNum2).toFixed(1);
                                set_menu_info[num1][num2].is_choose = '0';
                            }
                        }
                    });

                    num1++;
                }
            });

            
            // 效验数据通过才能修改
            if (this.dataCheck()) {
                

                //特殊商品售卖地点和下单类型赋值
                var isStore, isOrder, isTakeout, isPack;
                var foodsType = $('#foodsType').val();

                if (foodsType == "1") {
                    isStore = "0";
                    isOrder = "1";
                    isTakeout = "0";
                    isPack = "1";
                } else if (foodsType == "2") {
                    isStore = "0";
                    isOrder = "0";
                    isTakeout = "1";
                    isPack = "1";
                } else if (foodsType == "3" || foodsType == "11" || foodsType == "12" || foodsType == "13") {
                    isStore = "0";
                    isOrder = "0";
                    isTakeout = "1";
                    isPack = "0";
                } else if (foodsType == "4") {
                    isStore = "1";
                    isOrder = "0";
                    isTakeout = "0";
                    isPack = "0";
                } else if (foodsType == "5") {
                    isStore = "1";
                    isOrder = "1";
                    isTakeout = "1";
                    isPack = "1";
                } else {
                    // isShop = $("#sell-sites input[name='shopSell']").is(':checked') ? "1" : "0";
                    isStore = $("#order-type input[name='sell']").is(':checked') ? "1" : "0";
                    isOrder = $("#order-type input[name='shop']").is(':checked') ? "1" : "0";
                    isTakeout = $("#order-type input[name='takeout']").is(':checked') ? "1" : "0";
                    isPack = $("#order-type input[name='pack']").is(':checked') ? "1" : "0";
                }

                // 只有一个显示的时候赋值处理
                var orderL = $('#order-type .fendian').not(".hide").length;
                if (orderL == 1) {
                    $("#order-type div[data-shop]").hasClass('hide') ? isOrder = '0' : isOrder = '1';
                    $('#order-type div[data-takeout]').hasClass('hide') ? isTakeout = '0' : isTakeout = '1';
                    $('#order-type div[data-pack').hasClass('hide') ? isPack = '0' : isPack = '1';
                    $('#order-type div[data-sell]').hasClass('hide') ? isStore = '0' : isStore = '1';
                }

                //条形码验证
                var scanCode = $('#scanCode').val();
                var exp = /^20\d{4}$/;
                if (scanCode != "") {
                    if (!exp.test(scanCode)) {
                        displayMsg(ndPromptMsg, '条形码格式不正确', 2000);
                        return;
                    }
                }

                // 下单数据类型无选中
                var typeLength = 0;
                $('#order-type input[type="checkbox"]').each(function(i) {
                    if ($(this).is(':checked')) {
                        typeLength += 1;
                    }
                })
                if (typeLength == 0 && (foodsType == 0 || foodsType == 6 || foodsType == 7 || foodsType == 8)) {
                    displayMsg($('#prompt-message'), '请勾选下单类型', 3000);
                    return;
                }

                // 菜品标签
                var menuByname=$('#menu_byname').val();
                //以换行符为分隔符将内容分割成数组
                var menuBynameArry = menuByname.split("\n");
                var menuBy = new Array();
                var bynameNum = 0;
                if (menuByname == '') {
                    menuBy = '';
                } else {
                    for (var h = 0;h<menuBynameArry.length;h++) {
                        if (menuBynameArry[h] == '') {
                            continue;
                        } else {
                            menuBy[bynameNum] = menuBynameArry[h].replace(/[ ]/g,"");
                            //noteArray[noteNUm] = JSON.stringify(menuNo);
                            bynameNum++;
                        }
                    }
                }    
                var is_discount=$('#isDiscount').val();
                var is_give=$('#isGive').val();               
                var is_set_menu=1;                
                var menu_attribute_id=$('#propertyContent').val();
                var menu_did=$('#menuDid').val();
                var menu_info=$('#menuInfo').val();
                var menu_name= $('#menuName').val(); 
                var pack_id = $('#packbox').val();                 
                var search_code=$('#searchCode').val();
                var special_type= $('#foodsType').val();           
                $("#form").ajaxSubmit({
                    type: 'post',
                    data: {
                        'menu_unit': menuUnit,
                        'menu_scope': menuScope,
                        'menu_price_list': menupricelist,
                        'member_price_list': memberpricelist,
                        'is_set_menu': '1',
                        'is_half': '0',
                        'menu_flavor': '',
                        'menu_note': '',
                        'menu_status': '0',
                        'printer_id': '',                        
                        'is_input': '0',
                        'menu_byname': menuBy,
                        'set_menu_info': set_menu_info,
                        'list_style': list_style,                        
                        'sale_shop_id': 'all',
                        'sale_commission': sale_commission,
                        'is_store': isStore,
                        'is_order': isOrder,
                        'is_takeout': isTakeout,
                        'is_pack': isPack,
                        'barcode': scanCode,
                        'produce_type': 1,
                        'produce_time': 0,
                        'is_discount':is_discount,
                        'is_give':is_give,
                        'menu_attribute_id':menu_attribute_id,
                        'menu_did':menu_did,
                        'menu_info':menu_info,
                        'menu_name':menu_name,
                        'pack_id':pack_id,
                        'search_code':search_code,
                        'special_type':special_type
                    },
                    xhrFields: { withCredentials: true },
                    url: AdminUrl.menuMenuAdd,
                    success: function(respnoseText) {
                        //respnoseText = JSON.parse(respnoseText);
                        //console.log(respnoseText);
                        var data = respnoseText.data;
                        if (respnoseText.code == 20) {
                            displayMsgTime($('#prompt-message'), respnoseText.message, 2000, function() {
                                //layer.close(layerBox);
                                window.location.replace('dishesManage.html?is_select=1&type=' + getQueryString('type'));
                            });
                        } else {
                            displayMsg($('#prompt-message'), respnoseText.message, 2000);
                        }
                    },
                    error: function(XmlHttpRequest, textStatus, errorThrown) {
                        displayMsg($('#prompt-message'), '图片上传失败', 2000);
                    }
                });
            }

           
        },

        // 修改
        DishesUpdate: function() {
            // 获取到各个数据，请求接口提交数据
            var self = this;
            // 把cid放进去
            $('#CID').val($.cookie('cid'));
            $('#companyNameEn').val(business);
            $('#menuId').val(dataPro.menu_id);
            // 菜品适用范围   
            var menuScope = $('#menuScope').val();

            var sale_commission= new Object();
            
            if ($('#ticheng').val() != '') {
                sale_commission['all'] = parseFloat($('#ticheng').val()).toFixed(2);
            }else{
                sale_commission['all'] = 0.00;
            }

            // 菜品价格列表
            var menupricelist = [];
            for(var i in menu_price_list){
                delete menu_price_list[i].price_id;
                for(var key in menu_price_list[i]){
                    if(key == 'hour_time' || key == 'week_day'){
                        if(isArray(menu_price_list[i][key])){
                            menu_price_list[i][key] = menu_price_list[i][key].toString();
                        }
                    }
                }
                menupricelist.push(menu_price_list[i]);
            }                
            // 会员价列表
            var memberpricelist = [];  
            for(var i in member_price_list){
                delete member_price_list[i].price_id;
                for(var key in member_price_list[i]){
                    if(key == 'hour_time' || key == 'week_day'){
                        if(isArray(member_price_list[i][key])){
                            member_price_list[i][key] = member_price_list[i][key].toString();
                        }
                    }
                }
                memberpricelist.push(member_price_list[i])
            } 

            if ($('.replaceCenter ul').find('p').length == '0') {
                displayMsg($('#prompt-message'), '请选择套餐内容', 2000);
                return;
            };

            // 菜品单位
            var menuUnit = $('#menuUnit').val();
            if (menuUnit == '') {
                menuUnit = '份';
            }

            var set_menu_info = {};
            var num1 = 0;
            var num2 = 0;
            // 循环得到套餐内容数据
            $('.replaceCenter ul').find('p').each(function() {
                var id = $(this).attr('data_type').split('_')[0];
                var ids = $(this).attr('data_type').split('_')[1];
                var dataNum = $(this).attr('data_num');
                if (ids == 'yes') {
                    set_menu_info[num1] = {};
                    num2 = 0;
                    set_menu_info[num1][num2] = {};
                    set_menu_info[num1][num2].menu_id = id.substring(0, 12);
                    set_menu_info[num1][num2].menu_num = parseFloat(dataNum).toFixed(1);
                    set_menu_info[num1][num2].is_choose = '1';
                    $('.replaceCenter ul').find('p').each(function() {
                        var id2 = $(this).attr('data_type').split('_')[0];
                        var id3 = $(this).attr('data_type').split('_')[1];
                        var menu_id = $(this).attr('id');
                        var dataNum2 = $(this).attr('data_num');
                        if (id3 == 'no') {
                            if (id == id2) {
                                num2++;
                                set_menu_info[num1][num2] = {};
                                set_menu_info[num1][num2].menu_id = menu_id;
                                set_menu_info[num1][num2].menu_num = parseFloat(dataNum2).toFixed(1);
                                set_menu_info[num1][num2].is_choose = '0';
                            }
                        }
                    });
                    num1++;
                }
            });
            
            // 效验数据通过才能修改
            if (this.dataCheck()) {
                
                //特殊商品售卖地点和下单类型赋值
                var isStore, isOrder, isTakeout, isPack;
                var foodsType = $('#foodsType').val();

                if (foodsType == "1") {
                    isStore = "0";
                    isOrder = "1";
                    isTakeout = "0";
                    isPack = "1";
                } else if (foodsType == "2") {
                    isStore = "0";
                    isOrder = "0";
                    isTakeout = "1";
                    isPack = "1";
                } else if (foodsType == "3" || foodsType == "11" || foodsType == "12" || foodsType == "13") {
                    isStore = "0";
                    isOrder = "0";
                    isTakeout = "1";
                    isPack = "0";
                } else if (foodsType == "4") {
                    isStore = "1";
                    isOrder = "0";
                    isTakeout = "0";
                    isPack = "0";
                } else if (foodsType == "5") {
                    isStore = "1";
                    isOrder = "1";
                    isTakeout = "1";
                    isPack = "1";
                } else {
                    // isShop = $("#sell-sites input[name='shopSell']").is(':checked') ? "1" : "0";
                    isStore = $("#order-type input[name='sell']").is(':checked') ? "1" : "0";
                    isOrder = $("#order-type input[name='shop']").is(':checked') ? "1" : "0";
                    isTakeout = $("#order-type input[name='takeout']").is(':checked') ? "1" : "0";
                    isPack = $("#order-type input[name='pack']").is(':checked') ? "1" : "0";
                }

                var orderL = $('#order-type .fendian').not(".hide").length;
                if (orderL == 1) {
                    $("#order-type div[data-shop]").hasClass('hide') ? isOrder = '0' : isOrder = '1';
                    $('#order-type div[data-takeout]').hasClass('hide') ? isTakeout = '0' : isTakeout = '1';
                    $('#order-type div[data-pack').hasClass('hide') ? isPack = '0' : isPack = '1';
                    $('#order-type div[data-sell]').hasClass('hide') ? isStore = '0' : isStore = '1';
                }

                //条形码验证
                var scanCode = $('#scanCode').val();
                var exp = /^20\d{4}$/;
                if (scanCode != "") {
                    if (!exp.test(scanCode)) {
                        displayMsg(ndPromptMsg, '条形码格式不正确', 2000);
                        return;
                    }
                }

                // 下单数据类型无选中
                var typeLength = 0;
                $('#order-type input[type="checkbox"]').each(function(i) {
                    if ($(this).is(':checked')) {
                        typeLength += 1;
                    }
                })
                if (typeLength == 0 && (foodsType == 0 || foodsType == 6 || foodsType == 7 || foodsType == 8)) {
                    displayMsg($('#prompt-message'), '请勾选下单类型', 3000);
                    return;
                }
                // 菜品标签
                var menuByname=$('#menu_byname').val();
                //以换行符为分隔符将内容分割成数组
                var menuBynameArry = menuByname.split("\n");
                var menuBy = new Array();
                var bynameNum = 0;
                if (menuByname == '') {
                    menuBy = '';
                } else {
                    for (var h = 0;h<menuBynameArry.length;h++) {
                        if (menuBynameArry[h] == '') {
                            continue;
                        } else {
                            menuBy[bynameNum] = menuBynameArry[h].replace(/[ ]/g,"");
                            //noteArray[noteNUm] = JSON.stringify(menuNo);
                            bynameNum++;
                        }
                    }
                }  
              
                var is_discount=$('#isDiscount').val();
                var is_give=$('#isGive').val();          
                var menu_attribute_id=$('#propertyContent').val();
                var menu_did=$('#menuDid').val();
                var menu_info=$('#menuInfo').val();
                var menu_name= $('#menuName').val();                
                var menu_type_id=dataPro.menu_type_id;
                var pack_id = $('#packbox').val();                 
                var search_code=$('#searchCode').val();
                var special_type= $('#foodsType').val();

                $("#form").ajaxSubmit({
                    type: 'post',
                    data: {
                        'menu_unit': menuUnit,
                        'menu_scope': menuScope,
                        'menu_price_list': menupricelist,
                        'member_price_list': memberpricelist,
                        'is_set_menu': '1',
                        'is_half': '0',
                        'menu_flavor': '',
                        'menu_note': '',
                        'menu_status': $('#menuStatus').val(),
                        'printer_id': '',                        
                        'is_input': '0',
                        'menu_byname': menuBy,
                        'set_menu_info': set_menu_info,                        
                        'list_style': list_style,                        
                        'sale_shop_id': 'all',
                        'sale_commission': sale_commission,
                        'is_store': isStore,
                        'is_order': isOrder,
                        'is_takeout': isTakeout,
                        'is_pack': isPack,
                        'barcode': scanCode,
                        'produce_type': 1,
                        'produce_time': 0,
                        'is_discount':is_discount,
                        'is_give':is_give,                        
                        'menu_attribute_id':menu_attribute_id,
                        'menu_did':menu_did,
                        'menu_info':menu_info,
                        'menu_name':menu_name,
                        'menu_type_id':menu_type_id,
                        'pack_id':pack_id,
                        'search_code':search_code,
                        'special_type':special_type,
                        'menu_id':menuId

                    },
                    xhrFields: { withCredentials: true },
                    url: AdminUrl.menuMenuUpdate,
                    success: function(respnoseText) {
                        //respnoseText = JSON.parse(respnoseText);
                        //console.log(respnoseText);
                        var data = respnoseText.data;
                        if (respnoseText.code == 20) {
                            displayMsgTime($('#prompt-message'), respnoseText.message, 2000, function() {
                                //alert('ddd');
                                //layer.close(layerBox);
                                window.location.replace('dishesManage.html?is_select=1&type=' + getQueryString('type'));
                            });
                        } else {
                            displayMsg($('#prompt-message'), respnoseText.message, 2000);
                        }
                    },
                    error: function(XmlHttpRequest, textStatus, errorThrown) {
                        displayMsg($('#prompt-message'), '图片上传失败', 2000);
                    }
                });
            }
            
        },       
        // 请求正常的属性列表
        propertyData: function() {
            var self = this;
            setAjax(AdminUrl.menuMenuAttributeList, {}, $('#prompt-message'), { 20: '' }, function(respnoseText) {
                // 得到返回数据
                var data = respnoseText.data;
                // 显示数据
                self.propertyDataList(data);
            }, 0);
        },
        // 请求所有的属性列表，包括正常、估清、下架
        propertyDataTwo: function() {
            var self = this;
            setAjax(AdminUrl.menuAllMenuAttributeList, {}, $('#prompt-message'), { 20: '' }, function(respnoseText) {
                // 得到返回数据
                var data = respnoseText.data;
                // 显示数据
                self.propertyDataList(data);
            }, 0);
        },
        // 显示属性数据
        propertyDataList: function(data) {
            var content = '<option value="">不设置菜品属性</option>';

            for (var i in data) {
                content += '<option value="' + data[i].menu_attribute_id + '">' + data[i].menu_attribute + '</option>';
            }

            $('#propertyContent').html(content);
            // 如果是修改的话，把修改传过来的数据选中属性
            if (addIsUp == 1) {
                // 菜品属性
                $('#propertyContent').val(dataPro.menu_attribute_id);
            }
        },
        // 请求正常的分类列表
        disCategoryData: function() {
            var self = this;
            setAjax(AdminUrl.menuMenuTypeList, {}, $('#prompt-message'), { 20: '' }, function(respnoseText) {
                // 得到返回数据
                var data = respnoseText.data;
                // 显示数据
                self.disCategoryList(data);
            }, 0);
        },

        // 请求所有的分类列表，包括正常、估清、下架
        disCategoryDataTwo: function() {
            var self = this;
            setAjax(AdminUrl.menuAllMenuTypeList, {}, $('#prompt-message'), { 20: '' }, function(respnoseText) {
                // 得到返回数据
                var data = respnoseText.data;
                // 显示数据
                self.disCategoryList(data);
            }, 0);
        },

        // 显示分类数据
        disCategoryList: function(data) {
            var content = '';

            for (var i in data) {
                content += '<option value="' + data[i].menu_type_id + '">' + data[i].menu_type + '</option>';
            }
            $('#disCategoryTbodys').html(content);
            // 如果是修改的话，把修改传过来的数据选中分类
            if (addIsUp == 1) {
                // 菜品分类
                $('#disCategoryTbodys').val(dataPro.menu_type_id);
            }
        },
        // 效验要修改的数据
        dataCheck: function() {
            if ( dataTest('#menuName', '#prompt-message', { 'empty': '不能为空'})) { 
                return true;                    
            }
            return false;
        },
        //添加售卖地点设置显示
        showMessage: function() {
            var msg = Cache.get('getMessage');
            var shopOrder = msg.is_shop_order,
                shopTake = msg.is_shop_takeout,
                shopPack = msg.is_shop_pack,
                storeTake = msg.is_store_takeout;
            if (Number(storeTake) == 0) {
                $('#order-type div[data-sell]').addClass('hide');
            }
            if (Number(shopOrder) == 0) {
                $("#order-type div[data-shop]").addClass('hide');
            }
            if (Number(shopTake) == 0) {
                $('#order-type div[data-takeout]').addClass('hide');
            }
            if (Number(shopPack) == 0) {
                $('#order-type div[data-pack').addClass('hide');
            }
            var orderL = $('#order-type .fendian').not(".hide").length;
            if (orderL == 1) {
                $('.clearfix[data-type="order-type"]').addClass('hide');
            }


            //是否特定商品显示设置

            if (shopOrder == '0') $('#foodsType option[value="1"]').addClass('hide');
            if (storeTake == '0') $('#foodsType option[value="4"]').addClass('hide');
            if (shopTake == '0' && shopPack == '0' && storeTake == '0')
                $('#foodsType option[value=5]').addClass('hide');

            // 下面代码注释掉是因为，原本是想要改成不支持外卖 并且 不支持外卖平台才隐藏外卖餐包和外卖配送费，问过刘总，又改成不管外卖支不支持都可以添加外卖餐包和外卖配送费，所以注释掉
            /*if(shopTake == '0') {
                $('#foodsType option[value="2"]').addClass('hide');
                $('#foodsType option[value="3"]').addClass('hide');
            }*/

        },
        packOut: function() {
            setAjax(AdminUrl.special, { "special_type": '5' }, $('#prompt-message'), { 20: '' }, function(respnoseText) {
                // 得到返回数据
                var data = respnoseText.data;
                //data = {"1":{"menu_id": "123", "menu_name": "无"}, "2": {"menu_id": "145", "menu_name": "打包盒0.5元"}, "3": {"menu_id": "dd", "menu_name": "打包盒1元"}};
                var html = '<option value="">无</option>';
                for (var i in data) {
                    html += '<option value=' + data[i].menu_id + '>' + data[i].menu_name + '</option>'
                }
                $('#packbox').html(html);
                if (addIsUp == 1) {
                    //打包盒id
                    if (dataPro.pack_id) {
                        $('#packbox').val(dataPro.pack_id);
                    } else {
                        $('#packbox').val("");
                    }
                }

            }, 0);
        }
    }
    var dishData = {}; //菜品数据
    var dishDataNum = {};

    //修改套餐菜品
    function modifyDish(dataPro) {
        //查询分类
        setAjax(AdminUrl.menuMenuList, {
            menu_status: '0',
            'is_shop': '0',
            'sale_shop_id': 'all'
        }, $('#prompt-message'), {
            'sale_shop_id': 'all'
        }, function(respnoseText) {
            delete respnoseText.data.depot_info;
            dishDataNum = respnoseText.data;
            //菜品分类
            showDish(dishData);
            mengData = respnoseText.data;

            dishData = {};
            dishData = dishesStackHandle(dishDataNum, dishData);

            var num = 0;
            var numTwo = 0;
            var numparo = 0;
            set_menu_info = dataPro.set_menu_info
            for (var i in set_menu_info) {
                for (c in set_menu_info[i]) {
                    var dd = dishesLoopJudgeId(set_menu_info[i][c].menu_id);
                    var xiajia = $('#yixiajia').text()
                    if (dd == false) {
                        $('#yixiajia').text(set_menu_info[i][c].menu_name + "." + xiajia)
                        if (set_menu_info[i][c].is_choose == 1) {
                            delete set_menu_info[i]
                            break
                        } else {
                            delete set_menu_info[i][c]
                        }
                    }
                }
            }
            if ($('#yixiajia').text() == '已经下架') {
                $('#yixiajia').addClass('hide')
            } else {
                $('#yixiajia').removeClass('hide')
            }
            var list = "";
            var replaceCenterHtml = $('.replaceCenter ul').html()
            for (var i in set_menu_info) {
                var d = '';
                for (var k in set_menu_info[i]) {
                    if (JSON.stringify(set_menu_info[i]).length > 1) {
                        if (set_menu_info[i][k].is_choose == 1) {
                            d = set_menu_info[i][k].menu_id
                        }
                    }
                }
                set_menu_infoOtherTwo[d + numparo] = {};
                for (var j in set_menu_info[i]) {
                    var num55 = 0;
                    for (var m in set_menu_info[i]) {
                        num55++;
                    }
                    if (num55 > 1) {
                        if (set_menu_info[i][j].is_choose == 0) {
                            set_menu_infoOtherTwo[d + numparo][num] = {};
                            set_menu_infoOtherTwo[d + numparo][num].menu_name = set_menu_info[i][j].menu_name;
                            set_menu_infoOtherTwo[d + numparo][num].menu_id = set_menu_info[i][j].menu_id;
                            set_menu_infoOtherTwo[d + numparo][num].menu_num = set_menu_info[i][j].menu_num;
                            set_menu_infoOtherTwo[d + numparo][num].is_choose = 0;
                            set_menu_infoOtherTwo[d + numparo][num].whoChildren = d + numparo;
                            list += '<p data_type="' + d + numparo + '_no" data_num="' + set_menu_info[i][j].menu_num + '" ' + (num % 2 == 0 ? 'class="currett new"' : 'class="new"') + ' id="' + set_menu_info[i][j].menu_id + '">' +
                                '<span class="w190" id="' + set_menu_info[i][j].menu_name + '"></span>' +
                                '<span class="w145"></span>' +
                                '<span class="w185">' + set_menu_info[i][j].menu_name + '</span>' +
                                '</p>';

                        } else {
                            whatId = set_menu_info[i][j].menu_id + num
                            set_menu_infoOther[num] = {};
                            set_menu_infoOther[num][numTwo] = {}
                            set_menu_infoOther[num][numTwo].menu_name = set_menu_info[i][j].menu_name;
                            set_menu_infoOther[num][numTwo].menu_id = set_menu_info[i][j].menu_id;
                            set_menu_infoOther[num][numTwo].menu_num = set_menu_info[i][j].menu_num;
                            set_menu_infoOther[num][numTwo].is_choose = 1;

                            list += '<p ' + (num % 2 == 0 ? 'class="currett"' : '') + ' data_num="' + set_menu_info[i][j].menu_num + '" data_type="' + set_menu_info[i][j].menu_id + numparo + '_yes" id="' + set_menu_info[i][j].menu_id + '' + numparo + '">' +
                                '<span class="w190">' + set_menu_info[i][j].menu_name + '</span>' +
                                '<span class="w145">' +
                                '<u class="is_chooseO">是<input data_type="yes"  name="' + num + 'only" type="radio" checked/></u>' +
                                '<u class="is_chooseF">否<input data_type="no" name="' + num + 'only" type="radio"/></u>' +
                                '</span>' +
                                '<span class="w185"><a class="">点击选择可替换菜品</a></span>' +
                                '</p>';
                            num++;
                            numTwo++;
                        }
                    } else {
                        set_menu_infoOther[num] = {};
                        set_menu_infoOther[num][numTwo] = {}
                        set_menu_infoOther[num][numTwo].menu_name = set_menu_info[i][j].menu_name;
                        set_menu_infoOther[num][numTwo].menu_id = set_menu_info[i][j].menu_id;
                        set_menu_infoOther[num][numTwo].menu_num = set_menu_info[i][j].menu_num;
                        set_menu_infoOther[num][numTwo].is_choose = 1;
                        list += '<p ' + (num % 2 == 0 ? 'class="currett"' : '') + ' data_num="' + set_menu_info[i][j].menu_num + '" data_type="' + set_menu_info[i][j].menu_id + num + '_yes" id="' + set_menu_info[i][j].menu_id + '' + num + '">' +
                            '<span class="w190">' + set_menu_info[i][j].menu_name + '</span>' +
                            '<span class="w145">' +
                            '<u class="is_chooseO">是<input data_type="yes" name="' + num + 'only" type="radio" /></u>' +
                            '<u class="is_chooseF">否<input data_type="no" name="' + num + 'only" type="radio" checked/></u>' +
                            '</span>' +
                            '<span class="w185"><a class="hide">点击选择可替换菜品</a></span>' +
                            '</p>';
                    }
                    num++;
                }
                numparo++;
            }
            $('.replace').removeClass('hide')
            $('.replaceCenter ul').html(list)
            $('.dishSelect').addClass('hide')
            selectDish()
            OorF()
        }, 0);
    }

    //点击查询菜品分类，
    $('#addPackageBtn').click(function() {
        if (addIsUp == 1) {}

        whatF = 0;
        $('.dishSelect').removeClass('hide')
        setAjax(AdminUrl.menuMenuList, {
            menu_status: '0',
            'is_shop':'0',
            'sale_shop_id': 'all'
        }, $('#prompt-message'), { 20: '' }, function(respnoseText) {
            delete respnoseText.data.depot_info;
            dishDataNum = respnoseText.data;
            //菜品分类
            showDish(dishData)
        }, 0);
    })

    // 解决两个对象 堆栈 出现的父对象和子对象相关联的问题
    function dishesStackHandle(p, c) {
        var c = c || {};
        for (var i in p) {
            if (typeof p[i] === 'object') {
                if (i == 'null' || i == null || p[i] == null) {
                    c[i] = {};
                } else {
                    c[i] = (p[i].constructor === Array) ? [] : {};
                }
                dishesStackHandle(p[i], c[i]);
            } else {
                c[i] = p[i];
            }
        }
        return c;
    }

    //菜品分类数据
    function showDish(dishData) {
        dishData = {};
        dishData = dishesStackHandle(dishDataNum, dishData);
        dishData = dishData.menu_store;
        $('#dishSelectCenterRCC ul').html('')
        var list2 = '';
        var num = 1;
        var content = '<li class="current" menuType-id="allDish">全部</li>';
        for (var i in dishData) {          
            content += '<li menuType-id="' + i + '" >' + dishData[i].menu_type + '</li>'
        };
        var zhenWhatId = whatId.substring(0, 12);
        for (var i in dishData) {
            for (var j in dishData[i].menu_list) {
                if (dishData[i].menu_list[j].is_set_menu != '1') {
                    if (whatF == '1') {
                        if (zhenWhatId == dishData[i].menu_list[j].menu_id) {
                            delete dishData[i].menu_list[j]
                        } else {
                            var num7 = 0;
                            for (var u in set_menu_infoOtherTwo) {
                                for (var o in set_menu_infoOtherTwo[u]) {
                                    if (set_menu_infoOtherTwo[u][o].whoChildren == whatId) {
                                        if (set_menu_infoOtherTwo[u][o].menu_id == dishDataNum[i].menu_list[j].menu_id) {
                                            num7 = 1;
                                            delete dishData[i].menu_list[j];
                                        }
                                    }
                                }
                            }

                            if (num7 == 0) {
                                if (num % 2 == 0) {
                                    list2 += '<li data_menu_id="' + dishData[i].menu_list[j].menu_id + '" ><span class="is_half" is_half="' + dishData[i].menu_list[j].is_half + '">' + dishData[i].menu_list[j].menu_name + '</span><i>￥' + dishData[i].menu_list[j].menu_price + '</i><img src="../../img/base/rjiantou.png" alt="" /></li>'
                                } else {
                                    list2 += '<li data_menu_id="' + dishData[i].menu_list[j].menu_id + '"  class="currett"><span class="is_half" is_half="' + dishData[i].menu_list[j].is_half + '">' + dishData[i].menu_list[j].menu_name + '</span><i>￥' + dishData[i].menu_list[j].menu_price + '</i><img src="../../img/base/rjiantou.png" alt="" /></li>'
                                }
                                num++;
                            }
                        }
                    } else {
                        if (num % 2 == 0) {
                            list2 += '<li data_menu_id="' + dishData[i].menu_list[j].menu_id + '" ><span class="is_half" is_half="' + dishData[i].menu_list[j].is_half + '">' + dishData[i].menu_list[j].menu_name + '</span><i>￥' + dishData[i].menu_list[j].menu_price + '</i><img src="../../img/base/rjiantou.png" alt="" /></li>'
                        } else {
                            list2 += '<li data_menu_id="' + dishData[i].menu_list[j].menu_id + '"  class="currett"><span class="is_half" is_half="' + dishData[i].menu_list[j].is_half + '">' + dishData[i].menu_list[j].menu_name + '</span><i>￥' + dishData[i].menu_list[j].menu_price + '</i><img src="../../img/base/rjiantou.png" alt="" /></li>'
                        }
                        num++;
                    }

                }

            }
        }
        // 显示数据
        $('.dishSelectCenterLeftCCLUl').html(content)
        $('.dishSelectCenterLeftCCRUl').html(list2);
        if (whatF == 0) {
            // 循环得到已选列表数据
            if (JSON.stringify(set_menu_infoOther) != '{}') {
                var list_add = '';
                var num2 = -1;
                for (i in set_menu_infoOther) {
                    for (j in set_menu_infoOther[i]) {
                        var dataList = dishesLoopJudgeId(set_menu_infoOther[i][j].menu_id);
                        if (dataList === false) {
                            continue;
                        }
                        var classT = '';
                        if (num2 % 2 == 0) {
                            classT = '';
                        } else {
                            classT = 'currett';
                        }
                        num2++;
                        list_add += '<p class="' + classT + '"><span data_menu_id="' + set_menu_infoOther[i][j].menu_id + '" class="dishNume"><em>' + dataList.menu_name + '</em><i>￥' + dataList.menu_price + '</i></span><span><b><img class="reduceNum"  src="../../img/base/reduce.png" alt="" /></b><u class="menu_num">' + set_menu_infoOther[i][j].menu_num + '</u><b><img class="addNum" src="../../img/base/add.png" alt="" /></b></span><span class="removeDish"><img src="../../img/base/remove.png" alt=""></span></p>';
                    }
                }
                $('#dishSelectCenterRCC ul').html('')
                $('#dishSelectCenterRCC ul').html(list_add)
            }
        } else {
            if (JSON.stringify(set_menu_infoOtherTwo) != '{}') {
                var list_addd = '';
                var num2 = 0;
                for (i in set_menu_infoOtherTwo) {
                    for (j in set_menu_infoOtherTwo[i]) {
                        if (whatId == set_menu_infoOtherTwo[i][j].whoChildren) {
                            var dataList = dishesLoopJudgeId(set_menu_infoOtherTwo[i][j].menu_id);
                            if (dataList === false) {
                                continue;
                            }
                            var classT = '';
                            if (num2 % 2 == 1) {
                                classT = '';
                            } else {
                                classT = 'currett';
                            }
                            num2++;
                            list_addd += '<p class="' + classT + '"><span data_menu_id="' + set_menu_infoOtherTwo[i][j].menu_id + '" class="dishNume"><em>' + dataList.menu_name + '</em><i>￥' + dataList.menu_price + '</i></span><span><b><img class="reduceNum" src="../../img/base/reduce.png" alt="" /></b><u class="menu_num">' + set_menu_infoOtherTwo[i][j].menu_num + '</u><b><img class="addNum" src="../../img/base/add.png" alt="" /></b></span><span class="removeDish"><img src="../../img/base/remove.png" alt=""></span></p>';
                        }
                    }
                }

                $('#dishSelectCenterRCC ul').html('')
                $('#dishSelectCenterRCC ul').html(list_addd)
            }
        }

        //点击菜品分类查询菜品名称
        $('.dishSelectCenterLeftCCLUl li').on('click', function() {
            //判断字符长度
            var sizeNum = $('dishSelectCenterLeftCCRUl li span').length
            $(this).addClass('current').siblings().removeClass('current')
            var menuTypeId = $(this).attr('menuType-id')
            $('.dishSelectCenterLeftCCRUl').html('')
            var list = '';
            if (menuTypeId == 'allDish') {
                for (var i in dishData) {
                    for (var j in dishData[i].menu_list) {
                        if (dishData[i].menu_list[j].is_set_menu != '1') {
                            if (num % 2 == 0) {
                                list += '<li data_menu_id="' + dishData[i].menu_list[j].menu_id + '" ><span class="is_half" is_half="' + dishData[i].menu_list[j].is_half + '">' + dishData[i].menu_list[j].menu_name + '</span><i>￥' + dishData[i].menu_list[j].menu_price + '</i><img src="../../img/base/rjiantou.png" alt="" /></li>'
                            } else {
                                list += '<li data_menu_id="' + dishData[i].menu_list[j].menu_id + '"  class="currett"><span class="is_half" is_half="' + dishData[i].menu_list[j].is_half + '">' + dishData[i].menu_list[j].menu_name + '</span><i>￥' + dishData[i].menu_list[j].menu_price + '</i><img src="../../img/base/rjiantou.png" alt="" /></li>'
                            }
                            num++;
                        }
                    }
                }
            } else {
                for (var j in dishData[menuTypeId].menu_list) {
                    if (dishData[menuTypeId].menu_list[j].is_set_menu != '1') {
                        if (num % 2 == 0) {
                            list += '<li data_menu_id="' + dishData[menuTypeId].menu_list[j].menu_id + '" ><span class="is_half" is_half="' + dishData[menuTypeId].menu_list[j].is_half + '">' + dishData[menuTypeId].menu_list[j].menu_name + '</span><i>￥' + dishData[menuTypeId].menu_list[j].menu_price + '</i><img src="../../img/base/rjiantou.png" alt="" /></li>'
                        } else {
                            list += '<li data_menu_id="' + dishData[menuTypeId].menu_list[j].menu_id + '"  class="currett"><span class="is_half" is_half="' + dishData[menuTypeId].menu_list[j].is_half + '">' + dishData[menuTypeId].menu_list[j].menu_name + '</span><i>￥' + dishData[menuTypeId].menu_list[j].menu_price + '</i><img src="../../img/base/rjiantou.png" alt="" /></li>'
                        }
                        num++;
                    }
                }
            }
            $('.dishSelectCenterLeftCCRUl').html(list);
            clickDish();
        })
        clickDish();
        removeDish();
    }

    // 根据菜品id循环得到当前菜品数据
    function dishesLoopJudgeId(menu_id) {
        for (var i in mengData) {
            for (var j in mengData[i].menu_list) {
                if (mengData[i].menu_list[j].menu_id == menu_id) {
                    return mengData[i].menu_list[j];
                }
            }
        }
        return false;
    }
    //点击菜品名称，
    var list_add = '';

    function clickDish() {
        $('.dishSelectCenterLeftCCRUl li').on('click', function() {
            var dishNume = $(this).children('span').html()
            var dishMoney = $(this).children('i').html()
            var selectedList = $('#dishSelectCenterRCC ul').html()
            var menu_id = $(this).attr('data_menu_id')
            var num = $('#dishSelectCenterRCC ul p').length
            var is_half = $(this).children('.is_half').attr('is_half')
            if (num % 2 == 1) {
                list_add = '<p><span data_menu_id="' + menu_id + '" class="dishNume"><em>' + dishNume + '</em><i>' + dishMoney + '</i></span>' + '<span><b><img class="reduceNum" src="../../img/base/reduce.png" alt="" /></b><u data-num="' + (is_half == 0 ? '1' : '0.5') + '" class="menu_num">' + (is_half == 0 ? '1' : '0.5') + '</u><b><img class="addNum" src="../../img/base/add.png" alt="" /></b></span>' + '<span class="removeDish"><img src="../../img/base/remove.png" alt=""></span></p>'
            } else {
                list_add = '<p class="currett"><span data_menu_id="' + menu_id + '" class="dishNume"><em>' + dishNume + '</em><i>' + dishMoney + '</i></span><span><b><img class="reduceNum" src="../../img/base/reduce.png" alt="" /></b><u data-num="' + (is_half == 0 ? '1' : '0.5') + '" class="menu_num">' + (is_half == 0 ? '1' : '0.5') + '</u><b><img class="addNum" src="../../img/base/add.png" alt="" /></b></span>' + '<span class="removeDish"><img src="../../img/base/remove.png" alt=""></span></p>'
            }
            $('#dishSelectCenterRCC ul').html(selectedList + list_add)
                //调整滚动条高度
            var num = $('#dishSelectCenterRCC ul').scrollTop();
            $('#dishSelectCenterRCC ul').scrollTop(num + 30);
            if (whatF == '1') {
                $(this).remove()
            }
            removeDish()
        })
    }
    //点击删除已选菜品
    function removeDish() {
        $('.removeDish').on('click', function() {
                $(this).parent('p').remove()
                if (whatF == '0') {
                    set_menu_infoOther = {};
                } else {
                    set_menu_infoOtherTwo = {};
                }
            })
            //加减0.5菜
        $('.reduceNum').click(function() {
            var num = $(this).parent('b').next('u').attr('data-num')
            var dataNum = $(this).parent('b').next('u').html()
            if (num == 1) {
                dataNum = parseFloat(dataNum) - 1
            } else {
                dataNum = parseFloat(dataNum) - 0.5
            }
            if (dataNum == 0) {
                $(this).parent('b').parent('span').parent('p').remove()
            }
            $(this).parent('b').next('u').html(dataNum);

        })
        $('.addNum').click(function() {
            var num = $(this).parent('b').prev('u').attr('data-num')
            var dataNum = $(this).parent('b').prev('u').html();
            if (num == 1) {
                dataNum = parseFloat(dataNum) + 1
            } else {
                dataNum = parseFloat(dataNum) + 0.5
            }
            if (dataNum == 0) {
                $(this).parent('b').parent('span').parent('p').remove()
            }
            $(this).parent('b').prev('u').html(dataNum);

        })
    }
    //选菜确认按钮
    $('#subDish').click(function() {
        if (whatF == 0) {
            set_menu_infoOther = {};
            set_menu_infoOtherTwo = {};
            var num = 0;
            var numTwo = 0;
            $('.dishSelectCenterRight .dishSelectCenterRCC p').each(function() {
                    var menu_id = $(this).find('span').attr('data_menu_id')
                    var menu_num = $(this).find('.menu_num').text();
                    var menu_name = $(this).find('.dishNume').children('em').text()
                    set_menu_infoOther[num] = {};
                    set_menu_infoOther[num][numTwo] = {}
                    set_menu_infoOther[num][numTwo].menu_name = menu_name;
                    set_menu_infoOther[num][numTwo].menu_id = menu_id;
                    set_menu_infoOther[num][numTwo].menu_num = menu_num;
                    set_menu_infoOther[num][numTwo].is_choose = 1;
                    num++;
                    numTwo++;
                })
                //Cache.set('dd',set_menu_infoOther);
            var list = "";
            var replaceCenterHtml = $('.replaceCenter ul').html()
            for (i in set_menu_infoOther) {
                for (j in set_menu_infoOther[i])
                    num++;
                list += '<p ' + (num % 2 == 0 ? 'class="currett"' : '') + ' data_num="' + set_menu_infoOther[i][j].menu_num + '" data_type="' + set_menu_infoOther[i][j].menu_id + num + '_yes" id="' + set_menu_infoOther[i][j].menu_id + '' + num + '">' +
                    '<span class="w190">' + set_menu_infoOther[i][j].menu_name + '</span>' +
                    '<span class="w145">' +
                    '<u class="is_chooseO">是<input data_type="yes" name="' + num + 'only" type="radio" /></u>' +
                    '<u class="is_chooseF">否<input data_type="no" name="' + num + 'only" type="radio" checked/></u>' +
                    '</span>' +
                    '<span class="w185"><a class="hide">点击选择可替换菜品</a></span>' +
                    '</p>';
            }
            $('.replace').removeClass('hide')
            $('.replaceCenter ul').html(list)
            $('.dishSelect').addClass('hide')
            OorF()
        } else {
            var num = 0;
            set_menu_infoOtherTwo[whatId] = {};
            $('.dishSelectCenterRight .dishSelectCenterRCC p').each(function() {
                var menu_id = $(this).find('span').attr('data_menu_id')
                var menu_num = $(this).find('.menu_num').text();
                var menu_name = $(this).find('.dishNume').children('em').text();
                var whoChildren = $(this).parent('span').parent('p').attr('id')

                set_menu_infoOtherTwo[whatId][num] = {};
                set_menu_infoOtherTwo[whatId][num].menu_name = menu_name;
                set_menu_infoOtherTwo[whatId][num].menu_id = menu_id;
                set_menu_infoOtherTwo[whatId][num].menu_num = menu_num;
                set_menu_infoOtherTwo[whatId][num].is_choose = 0;
                set_menu_infoOtherTwo[whatId][num].whoChildren = whatId;
                num++;
            });
            var detailsID = whatId;
            $('.replaceCenter ul').find('p').each(function() {
                var ter = this;
                var detailsID2 = $(this).attr('data_type').split('_')[1]
                var detailsID3 = $(this).attr('data_type').split('_')[0]
                if (detailsID2 == 'no') {
                    if (detailsID == detailsID3) {
                        //alert(1)
                        $(ter).remove()
                    }
                }
            });
            var list = "";
            var replaceCenterHtml = $('.replaceCenter ul').html()
            for (i in set_menu_infoOtherTwo) {
                for (j in set_menu_infoOtherTwo[i]) {
                    if (whatId == set_menu_infoOtherTwo[i][j].whoChildren) {
                        num++;
                        list += '<p data_type="' + whatId + '_no" data_num="' + set_menu_infoOtherTwo[i][j].menu_num + '" ' + (num % 2 == 0 ? 'class="currett new"' : 'class="new"') + ' id="' + set_menu_infoOtherTwo[i][j].menu_id + '">' +
                            '<span class="w190" id="' + set_menu_infoOtherTwo[i][j].menu_name + '"></span>' +
                            '<span class="w145"></span>' +
                            '<span class="w185">' + set_menu_infoOtherTwo[i][j].menu_name + '</span>' +
                            '</p>';
                    }
                }
            }
            $('#' + whatId + '').after(list)
            $('.dishSelect').addClass('hide')
        }
    });
    //取消按钮
    $('.dishSelectBotL input').click(function() {
        $('.dishSelect').addClass('hide');
        $('#dishSelectCenterRCC ul').html('')
        $('.dishSelectCenterLeftCCRUl').html('')
    });
    //切换是否换菜
    function OorF() {
        $('.replaceCenter ul p input').on('click', function() {
            var isYorN = $(this).attr('data_type');
            if (isYorN == 'yes') {
                $(this).parent('u').parent('span').next('.w185').children('a').removeClass('hide')
                selectDish()
            }
            if (isYorN == 'no') {
                $(this).parent('u').parent('span').next('.w185').children('a').addClass('hide')
                var detailsID = $(this).parent('u').parent('span').parent('p').attr('data_type').split('_')[0];
                $('.replaceCenter ul').find('p').each(function() {
                    var detailsID2 = $(this).attr('data_type').split('_')[1]
                    var detailsID3 = $(this).attr('data_type').split('_')[0]
                    if (detailsID2 == 'no') {
                        if (detailsID == detailsID3) {
                            $(this).remove()
                            set_menu_infoOtherTwo[detailsID] = {}
                        }
                    }
                })

            }
        })
    };
    //替换菜
    function selectDish() {
        $('.replaceCenter ul p').each(function() {
            $(this).find('a').unbind('click').bind('click', function() {
                whatF = 1;
                $('.dishSelect').removeClass('hide')
                whatId = $(this).parent('span').parent('p').attr('id')
                    //菜品分类
                showDish(dishData);
            })
        })
    };
    DishesManageAdd.init();

});