$(function() {
    topButtonScroll2(".stores-content_1",".out_table_title_1");//有分页，
    // 汇总记录 lw 2016.3.28
    var menuStatus = 1; //当前选中的标签data-type的值
                        // 0:正常 1:反清机
    var $cardTypeContent = $("#nav3-content").find(".tbodys"); //当前显示的内容jQ对象
    var cleanData = ''; // 存储列表数据变量
    var $totalBox = $("#nav3_totalBox"); //汇总部分

    /*$("#start-date").val(getLocalDate()+' 00:00:00');
    $("#end-date").val(getLocalDate()+' 23:59:59');*/
    // topButtonScroll2(".stores-content",".out_table_title");//有分页，

    $("#start-date").val(getOffsetDateTime().start_day);
    $("#end-date").val(getOffsetDateTime().end_day);
    //var localData = getLocalDateMin();
    var defaults = {
        /*start: localData,
        end: localData,*/
        shop: ['all']
    };

    // 绑定点击事件
    CashierBind();


    // 绑定点击事件
    function CashierBind() {
        //添加切换事件
        $("#cardType_1,#cardType_2").click(function(){
            $('#shopSel').addClass("hide");
            $(".caipin-fenleicheck").removeClass("caipin-fenleicheck").addClass("caipin-fenleinucheck");
            menuStatus = $(this).removeClass("caipin-fenleinucheck").addClass("caipin-fenleicheck").attr("data-type");
            menuStatus = parseInt(menuStatus);
            // menuType = $(this).attr("type");
            // menuType = parseInt(menuType);
            //显示内容
            $(".stores-content").addClass("hide");
            // $("#cardTypeDate").removeClass('hide');
            switch(menuStatus)
            {   // 定义菜品状态参数 1:未使用 2:已使用 3:已作废
                case 1:
                    var $theContent = $("#nav3-content");
                    $theContent.removeClass("hide");
                    $cardTypeContent = $theContent.find(".tbodys");
                    $(".search_page,.stores-content_1").addClass("hide");
                    $("#nav3_search_page").removeClass("hide");
                    //alert(menuStatus);
                    //DishesData(0);
                    break;
                case 2:
                    var $theContent = $("#cardTypeContent_2");
                    $theContent.removeClass("hide");
                    $cardTypeContent = $theContent.find(".tbodys");
                    $(".search_page").addClass("hide");
                    $('#shopSel,#nav2_search_page').removeClass("hide");

                    //alert(menuStatus);
                    //DishesData(1);
                    break;
            }
        });
        // 分页标签 切换查询
        $(".search_page").on("click",".home_page",function(){
            var $this = $(this);
            //alert($(this).attr("data-start-date"));
            var searchObj = {  //要传输的参数对象
                type : $this.attr("data-type"),
                page : $this.attr("data-page")

            };
            if(menuStatus==1){
                var start = $.trim($('#start-date').val());
                var end = $.trim($('#end-date').val());
                searchObj.start_date = start;
                searchObj.end_date = end;
                selectCashier(searchObj.page,searchObj);
            }else if(menuStatus==2){
                RefundList (searchObj.page,searchObj);
            }
        });

        // 分页输入页数 点击查询部分
        $(".search_page").on("click",".page_go",function(){
            var $this = $(this);
            var $page_just = $(this).siblings(".page_just");
            var _temp = parseInt($page_just.val());
            var maxPage = $page_just.attr("data-page");

            var searchObj = {  //要传输的参数对象
                type : $page_just.attr("data-type")
            };

            if(_temp <= maxPage){
                searchObj.page = _temp;
                if(menuStatus==1){
                    var start = $.trim($('#start-date').val());
                    var end = $.trim($('#end-date').val());
                    searchObj.start_date = start;
                    searchObj.end_date = end;
                    selectCashier(searchObj.page,searchObj);
                }else if(menuStatus==2){
                    RefundList (searchObj.page,searchObj);
                }
            }else{
                displayMsg(ndPromptMsg, '请输入正确的页码', 2000);
            }
        });
        // 点击搜索
        $('#selectbtn').unbind('click').bind('click', function() {
            if(menuStatus==1){
                selectCashier();
            }else if(menuStatus==2){
                RefundList();
            }
        });

        // 点击店铺
        $('#shopList').unbind('click').bind('click', function() {
            DishesDatashop();
        });
        // 点击通用商户
        $('#region_sel').unbind('click').bind('click', function () {
            CurrencyCard();
        });

        $("#nav3-content").on("click", ".unPayId", function() {
            displayMsg(ndPromptMsg, '收银员结账之后才有结账单号', 2000);
        });

        $('.tbodys').delegate('tr .xiangqingbtn', 'click', function(event) {
            //alert(1);
            var self = this,
                type = $(event.target).attr('data-type'),
                //payid = $(self).parents('tr').find('td[data-type="payid"]').text(),
                refundid = $(self).parents('tr').find('td[data-type="refundid"]').text();

            // 点击详情
            if (type == "handoverxq") {
                // 显示弹出框
                /*$('#handoveLay').removeClass('hide');
                displayAlertMessage('#handoveLay', '#can-alert');*/

                setAjax(AdminUrl.backOrderInfo, {
                    //'pay_id': payid //或者 order_id
                    'refund_id': refundid
                }, $('#prompt-message'), { 20: '' }, function(respnoseText) {
                    if (respnoseText.code == 20) {
                        //alert('bbb');
                        // 得到返回数据
                        var data = respnoseText.data;
                        $('#hand_title').text('退款汇总详情');
                        displayDetails(data);
                    } else {
                        displayMsg(ndPromptMsg, respnoseText.message, 2000);
                    }
                }, 0);
            }
        });

        //订单绑定
        $("#nav3-content").on("click", ".order_btn", function() {
            var refund_id = $(this).attr("data-refundid");

            setAjax(AdminUrl.recordPayInfo, {
                'pay_id': refund_id
            }, $('#prompt-message'), { 20: '' }, function(respnoseText) {
                if (respnoseText.code == 20) {
                    $('#handoveLay').removeClass('hide');
                    displayAlertMessage('#handoveLay', '#can-alert');
                    //alert('ttt');
                    // 得到返回数据
                    var data = respnoseText.data;
                    $('#hand_title').text('退款汇总详情');
                    public_details(data);
                } else {
                    displayMsg(ndPromptMsg, respnoseText.message, 2000);
                }
            }, 0);
        });

        //结账单绑定
        $("#nav3-content").on("click", ".payid", function() {
            var refund_id = $(this).attr("data-refundid");

            //alert(pay_id);
            setAjax(AdminUrl.recordPayInfo, {
                'pay_id': refund_id
            }, $('#prompt-message'), { 20: '' }, function(respnoseText) {
                if (respnoseText.code == 20) {
                    $('#handoveLay').removeClass('hide');
                    displayAlertMessage('#handoveLay', '#can-alert');
                    //alert('ddd');
                    // 得到返回数据
                    var data = respnoseText.data;
                    $('#hand_title').text('退款汇总详情');
                    public_details(data);
                } else {
                    displayMsg(ndPromptMsg, respnoseText.message, 2000);
                }
            }, 0);
        });

        // 储值通用统计详情
        $('#cardTypeContent_2').on('click', 'td[data-type="pay_id"]', function () {
            var data_pay_id = $(this).attr('data_pay_id');
            setAjax(AdminUrl.recordPayInfo, {
                'pay_id': data_pay_id
            }, $('#prompt-message'), { 20: '' }, function(respnoseText) {
                if (respnoseText.code == 20) {
                    $('#handoveLay').removeClass('hide');
                    displayAlertMessage('#handoveLay', '#can-alert');
                    //alert('ddd');
                    // 得到返回数据
                    var data = respnoseText.data;
                    $('#hand_title').text('储值通用统计详情');
                    public_details(data);
                } else {
                    displayMsg(ndPromptMsg, respnoseText.message, 2000);
                }
            }, 0);
        });
    }
    //获取通用商户
    function CurrencyCard () {
        //console.log($('a.current')[0]);
        // region_sel
        setAjax(AdminUrl.currencyCard, {

        }, $('#prompt-message'), {20: ''}, function(respnoseText) {
            var data = respnoseText.data;
            var listContent = '<li data-value="all" data-selected="1">全部</li>';
            for (var i in data.currency_stored) {
                listContent += '<li data-value="'+i+'" data-selected="1">' + data.currency_stored[i] + '</li>';
            }
            $('#set-favorable2').html(listContent);
            $('#favorable-title2').html('通用商户选择');
            isHaveElement('#set-favorable2', '#show-favorable2');
            setFavorableData1();
            displayAlertMessage('#favorable-message2', '');

            $('#cancel-favorable2').unbind('click').bind('click', function () {
                defaults.card = [];
                layer.close(layerBox);
                countCancel(($('#region_sel').val().split(',')));
                countSale(defaults.card, '#region_sel');
            });

            $('#definite-favorable2').unbind('click').bind('click', function () {
                defaults.card = [];
                layer.close(layerBox);
                countSale2(defaults.card, '#region_sel');
            });
        }, 1);
    }

    // 获取店铺列表
    function DishesDatashop(index) {
        // AdminUrl.currencyCard
        setAjax(AdminUrl.shopShopList, {
            'type': 2
        }, $('#prompt-message'), { 20: '' }, function(respnoseText) {
            var data = respnoseText.data;
            var listContent = '<li data-value="all" data-selected="1">全部</li>';
            for (var i in data) {
                listContent += '<li data-value="' + data[i].shop_id + '" data-selected="1">' + data[i].shop_name + '</li>';
            }
            $('#set-favorable').html(listContent);
            $('#favorable-title').html('店铺选择');
            isHaveElement('#set-favorable', '#show-favorable');
            setFavorableData();
            displayAlertMessage('#favorable-message', '');
            $('#cancel-favorable').unbind('click').bind('click', function() {
                defaults.shop = [];
                layer.close(layerBox);
                countCancel(($('#shopList').val().split(',')));
                countSale(defaults.shop, '#shopList');
            });

            $('#definite-favorable').unbind('click').bind('click', function() {
                defaults.shop = [];
                layer.close(layerBox);
                countSale(defaults.shop, '#shopList');
            });
        }, 1);
    }
    // 储值通用统计（储值通用消费明细）
    function RefundList(thePage,searchObj) {
        var startDate = $("#start-date").val();
        var endDate = $("#end-date").val();
        if ($('#shopList').val() == "全部") {
            defaults.shop = "all";
        }
        if($('#region_sel').val() == "全部") {
            defaults.card = "all";
        }
        //清单类型
        var selectType = menuStatus;
        var $searchPage;
        switch(selectType){
            case 2:
                $searchPage = $("#nav2_search_page");
                break;
            case 3 :
                $searchPage = $("#nav3_search_page");
                break;
        }

        //如果是分页请求就替换相应值
        if(searchObj){
            startDate = searchObj.start_date;
            endDate = searchObj.end_date;
            selectType = searchObj.type;
        }
        //分页信息用的参数
        var pageObj = {
            'start_time': startDate,
            'end_time': endDate,
            'card_ids': defaults.card,
            'shop_ids': defaults.shop,
            'page': thePage || 1,
            '$search_page': $searchPage,  //分页对应的分页位置
        };
        //console.log($('a.current')[0]);
        setAjax(AdminUrl.refund, {
            'start_time': startDate,
            'end_time': endDate,
            'card_ids': defaults.card,
            'shop_ids': defaults.shop
        }, $('#prompt-message'), {20: ''}, function(respnoseText) {
            if (respnoseText.code == 20) {
                // 得到返回数据
                var data = respnoseText.data;

                if(data==''){
                    $('#tbodys_1').html('')
                    displayMsg(ndPromptMsg, '没有相关数据信息', 2000);
                }else{
                    Statistics(data,pageObj);//储值通用统计显示数据
                    $('#cardTypeContent_2 .out_table_title').removeClass('hide');
                    $('#cardTypeContent_2 .Records_content').removeClass('hide');
                    $('#nav2_search_page').removeClass('hide');
                    $('#nav2_totalBox').removeClass('hide');
                }
            } else {
                $('#nav2-content .out_table_title').addClass('hide');
                $('#nav2-content .Records_content').addClass('hide');
                $('#nav2_totalBox').addClass('hide');
                $('#nav2_search_page').addClass('hide');
                displayMsg(ndPromptMsg, respnoseText.message, 2000);
            }
        }, 1);
    }

    // 显示订单详情 收银样式
    function displayDetails(data, pay_id) {
        $('li[data-type="delt"]').remove();
        var add_time = getAppointTimePro(data.add_time);
        if (data.add_time == undefined) {
            // add_time = '无';
            $('#add_time').hide();
        }
        // 日期时间
        $('#add_time').text(add_time);
        var order_ids = data.order_ids;
        if (data.order_ids == undefined) {
            // order_id = '无';
            $('#order_id').hide();
        }
        // 订单号
        $('#order_id').text(order_ids);
        // 结账id
        if (data.pay_id == undefined || data.pay_id == '') {
            $('#payId').text(pay_id);
        } else {
            // $('#payId').text(data.pay_id);
            if (!data.pay_no) {
                $('#payId').text(data.pay_id);
            } else {
                $('#payId').text(pay_no_he(data.pay_no) + ' ' + '( ' + data.pay_id + ' )');
            }
        }
        // 收银员
        $('#aUserName').text(data.a_user_name);
        // 桌台名称
        $('#tableName').text(data.table_name);

        // 自定义支付方式实收、优惠金额之和
        var pay_money = 0;
        var preferential_money = 0;
        var payOther = '';
        var preOther = '';
        // 自定义支付方式
        if (data.pay_other == '') {
            payOther = '';
            preOther = '';
        }

        for (var i in data.pay_other) {
            if (i == undefined) {
                payOther += '';
                preOther += '';
            } else {
                // 自定义支付方式
                var tr_name = other_take_name(data.pay_other[i].pay_type_id);
                if (data.pay_other[i].pay_money != 0) {
                    payOther += '<li class="clearfix" data-type="delt">' +
                        '<div class="billname">' + data.pay_other[i].pay_type_name + tr_name.pay_money_name + '</div>' + // 实收
                        '<div class="billxuhao">' + data.pay_other[i].pay_money + '</div>' +
                        '</li>';
                }
                if (data.pay_other[i].preferential_money != 0) {
                    preOther += '<li class="clearfix" data-type="delt">' +
                        '<div class="billname">' + data.pay_other[i].pay_type_name + tr_name.pre_money_name + '</div>' + // 优惠
                        '<div class="billxuhao">' + data.pay_other[i].preferential_money + '</div>' +
                        '</li>';
                }

                pay_money += parseFloat(data.pay_other[i].pay_money);
                preferential_money += parseFloat(data.pay_other[i].preferential_money);
            }
        }

        /*
            收银统计，收银记录，清机记录，计算金额方法
            data：               数据
            pay_money：          自定义支付方式实收
            preferential_money： 自定义支付方式优惠
         */
        var cal_data = calculation_money(data, pay_money, preferential_money);

        // 人均消费
        $('#use_money').text(cal_data.use_money);

        // 消费金额
        if (cal_data.con_money == 0) {
            $('#consumeDisplay').addClass('hide');
        } else {
            $('#consumeDisplay').removeClass('hide');
            $('#consume').text(cal_data.con_money);
        }
        // 实收金额
        if (cal_data.res_money == 0) {
            $('#afterDiscountDisplay').addClass('hide');
        } else {
            $('#afterDiscountDisplay').removeClass('hide');
            $('#afterDiscount').text(cal_data.res_money);
        }
        // 现金支付
        if (data.cash == undefined || data.cash == 0) {
            $('#cashDisplay').addClass('hide');
        } else {
            $('#cashDisplay').removeClass('hide');
            $('#cash').text(data.cash);
        }
        // 银行卡支付
        if (data.card == undefined || data.card == 0) {
            $('#cardDisplay').addClass('hide');
        } else {
            $('#cardDisplay').removeClass('hide');
            $('#card').text(data.card);
        }
        // 微信支付
        if (cal_data.wxp_money == 0) {
            $('#wxpayDisplay').addClass('hide');
        } else {
            $('#wxpayDisplay').removeClass('hide');
            $('#wxpay').text(cal_data.wxp_money);
        }
        // 支付宝支付
        if (cal_data.alip_money == 0) {
            $('#alipayDisplay').addClass('hide');
        } else {
            $('#alipayDisplay').removeClass('hide');
            $('#alipay').text(cal_data.alip_money);
        }
        // 储值本金消费
        if (cal_data.pri_money == 0) {
            $('#pri_moneyDisplay').addClass('hide');
        } else {
            $('#pri_moneyDisplay').removeClass('hide');
            $('#pri_money').text(cal_data.pri_money);
        }
        // 自定义支付方式实收
        $('#other_pay_mon').after(payOther);
        $('#other_pay_mon').addClass('hide');
        // 优惠金额
        if (cal_data.dis_money == 0) {
            $('#dis_money_dis').addClass('hide');
        } else {
            $('#dis_money_dis').removeClass('hide');
            $('#dis_money').text(cal_data.dis_money);
        }
        // 会员价优惠
        if (data.sub_user_price == undefined || data.sub_user_price == 0) {
            $('#sub_user_price_dis').addClass('hide');
        } else {
            $('#sub_user_price_dis').removeClass('hide');
            $('#sub_user_price').text(data.sub_user_price);
        }
        // 会员折扣优惠
        if (data.sub_user_discount == undefined || data.sub_user_discount == 0) {
            $('#sub_user_discount_dis').addClass('hide');
        } else {
            $('#sub_user_discount_dis').removeClass('hide');
            $('#sub_user_discount').text(data.sub_user_discount);
        }
        // 抹零
        if (data.small_change == undefined || data.small_change == 0) {
            $('#smallChangeDisplay').addClass('hide');
        } else {
            $('#smallChangeDisplay').removeClass('hide');
            $('#smallChange').text(data.small_change);
        }
        // 抵用劵支付
        if (cal_data.vou_money == 0) {
            $('#voucherDisplay').addClass('hide');
        } else {
            $('#voucherDisplay').removeClass('hide');
            $('#voucher').text(cal_data.vou_money);
        }
        // 银台折扣
        if (data.sub_money == undefined || data.sub_money == 0) {
            $('#subMoneyDisplay').addClass('hide');
        } else {
            $('#subMoneyDisplay').removeClass('hide');
            $('#subMoney').text(data.sub_money);
        }
        // 套餐优惠
        if (cal_data.pac_money == 0) {
            $('#pac_moneyDisplay').addClass('hide');
        } else {
            $('#pac_moneyDisplay').removeClass('hide');
            $('#pac_money').text(cal_data.pac_money);
        }
        // 储值赠送消费
        if (cal_data.sts_money == 0) {
            $('#sts_moneyDisplay').addClass('hide');
        } else {
            $('#sts_moneyDisplay').removeClass('hide');
            $('#sts_money').text(cal_data.sts_money);
        }
        // 赠送
        if (data.give_menu_consume == undefined || data.give_menu_consume == 0) {
            $('#give_menu_consumeDisplay').addClass('hide');
        } else {
            $('#give_menu_consumeDisplay').removeClass('hide');
            $('#give_menu_consume').text(data.give_menu_consume);
        }

        // 自定义支付方式优惠
        $('#other_pay_pre').after(preOther);
        $('#other_pay_pre').addClass('hide');


        /*// 退微信
        if (data.re_wxpay == 0) {
            $('#re_wxpay_display').addClass('hide');
        } else {
            $('#re_wxpay_display').removeClass('hide');
            $('#re_wxpay').text(data.re_wxpay);
        }
        // 退乐币
        if (data.re_stored == 0) {
            $('#re_stored_display').addClass('hide');
        } else {
            $('#re_stored_display').removeClass('hide');
            $('#re_stored').text(data.re_stored);
        }
        // 退抵用劵
        if (data.re_voucher == 0) {
            $('#re_voucher_display').addClass('hide');
        } else {
            $('#re_voucher_display').removeClass('hide');
            $('#re_voucher').text(data.re_voucher);
        }
        // 消费返券
        if (data.give_voucher == '' || data.give_voucher.voucher_name == undefined) {
            $('#giveVoucherDisplay').addClass('hide');
        } else {
            $('#giveVoucherDisplay').removeClass('hide');
            $('#giveVoucher').text(data.give_voucher.voucher_name+'x'+data.give_voucher.voucher_num);
        }*/





        // 菜品
        var content = '';
        var contentPro = '';
        for (var i in data.menu_info) {
            for (var j in data.menu_info[i].menu) {
                // 转菜数量
                var rotate_menu_num = 0;
                if (data.menu_info[i].menu[j].rotate_menu_num == undefined || data.menu_info[i].menu[j].rotate_menu_num == 0) {
                    rotate_menu_num = 0;
                } else {
                    rotate_menu_num = data.menu_info[i].menu[j].rotate_menu_num;
                }
                var menu_num = (parseFloat(data.menu_info[i].menu[j].menu_num) + parseFloat(data.menu_info[i].menu[j].give_menu_num) + parseFloat(data.menu_info[i].menu[j].cancel_menu_num) + parseFloat(rotate_menu_num)).toFixed(1);
                contentPro += '<p class="mengtc" id="' + data.menu_info[i].menu[j].menu_id + '">' +
                    '<span class="onemengtc">' + data.menu_info[i].menu[j].menu_name + '</span>' +
                    '<span>' + data.menu_info[i].menu[j].menu_price + '</span>' +
                    '<span>' + menu_num + '</span>' +
                    '<span>' + parseFloat(accMul(data.menu_info[i].menu[j].menu_price, menu_num)).toFixed(2) + '</span>' +
                    '</p>';
                // 如果增菜个数大于0，就在桌台上显示着一条记录   caipinsuojin缩进样式
                if (data.menu_info[i].menu[j].give_menu_num > 0) {
                    contentPro += '<p class="mengtc" id="' + data.menu_info[i].menu[j].menu_id + '">' +
                        '<span class="onemengtc">' + data.menu_info[i].menu[j].menu_name + '<i>赠</i></span>' +
                        '<span>0</span>' +
                        '<span>' + data.menu_info[i].menu[j].give_menu_num + '</span>' +
                        '<span>0</span>' +
                        '</p>';
                }
                // 如果退菜个数大于0，就在桌台上显示着一条记录
                if (data.menu_info[i].menu[j].cancel_menu_num > 0) {
                    contentPro += '<p class="mengtc" id="' + data.menu_info[i].menu[j].menu_id + '">' +
                        '<span class="onemengtc">' + data.menu_info[i].menu[j].menu_name + '<i>退</i></span>' +
                        '<span>' + data.menu_info[i].menu[j].menu_price + '</span>' +
                        '<span>-' + data.menu_info[i].menu[j].cancel_menu_num + '</span>' +
                        '<span>-' + parseFloat(accMul(data.menu_info[i].menu[j].menu_price, data.menu_info[i].menu[j].cancel_menu_num)).toFixed(2) + '</span>' +
                        '</p>';
                }

                // 如果转菜个数大于0，就在桌台上显示着一条记录
                if (rotate_menu_num > 0) {
                    contentPro += '<p class="mengtc" id="' + data.menu_info[i].menu[j].menu_id + '">' +
                        '<span class="onemengtc">' + data.menu_info[i].menu[j].menu_name + '<i>退</i></span>' +
                        '<span>' + data.menu_info[i].menu[j].menu_price + '</span>' +
                        '<span>-' + rotate_menu_num + '</span>' +
                        '<span>-' + parseFloat(accMul(data.menu_info[i].menu[j].menu_price, rotate_menu_num)).toFixed(2) + '</span>' +
                        '</p>';
                }
            }
        }
        content += '<p class="mengtop">' +
            '<span class="onespan">菜品名称</span>' +
            '<span class="">单价</span>' +
            '<span>数量</span>' +
            '<span>金额</span>' +
            '</p>' + contentPro;
        $('#menuList').html(content);
        $(".lanheight li:odd").css("background", "#fafafa");
        $(".lanheight li:even").css("background", "#fff");
    }
    // 搜索显示门店的分页部分
    function selectCashier(thePage, searchObj) {
        // 搜索显示数据之前先清空数据
        $cardTypeContent.html('');
        // 日期
        var endDate = $("#end-date").val();
        var startDate = $("#start-date").val();
        //清单类型
        var selectType = menuStatus;
        var $searchPage;
        switch (selectType) {
            case 1:
                $searchPage = $("#nav3_search_page");
                break;
            case 2:
                $searchPage = $("#nav0_search_page");
                break;
            case 3:
                $searchPage = $("#nav3_search_page");
                break;
        }

        //如果是分页请求就替换相应值
        if (searchObj) {
            startDate = searchObj.start_date;
            endDate = searchObj.end_date;
            selectType = searchObj.type;
        }


        if (startDate > endDate) {
            displayMsg(ndPromptMsg, '开始时间应小于结束时间!', 2000);
            return;
        }

        if ($('#shopList').val() == "全部") {
            defaults.shop = "all";
        }

        //分页信息用的参数
        var pageObj = {
            'start_date': startDate, //开始时间
            'end_date': endDate, //结束时间
            'type': selectType, //请求类型
            'page': thePage || 1, //请求的页数
            '$search_page': $searchPage, //分页对应的分页位置
            'shop_ids': defaults.shop
        };


        setAjax(AdminUrl.money, {

            'start_time': startDate,
            'end_time': endDate,
            'type': selectType,
            'page': thePage || 1,
            'shop_ids': defaults.shop

        }, $('#prompt-message'), { 20: '' }, function(respnoseText) {
            if (respnoseText.code == 20) {
                $('#nav3-content .out_table_title').removeClass('hide');
                $('#nav3-content .Records_content').removeClass('hide');
                $('#nav3_search_page').removeClass('hide');
                $('#nav3_totalBox').removeClass('hide');
                // 得到返回数据
                var data = respnoseText.data;
                //console.log(data);
                CashierList(data, $cardTypeContent, pageObj, $totalBox);
            } else {
                $('#nav3-content .out_table_title').addClass('hide');
                $('#nav3-content .Records_content').addClass('hide');
                $('#nav3_totalBox').addClass('hide');
                $('#nav3_search_page').addClass('hide');
                displayMsg(ndPromptMsg, respnoseText.message, 2000);
            }
        }, 0);
    }

    //分离创建表头表单头部信息,返回原有data,汇总在这个函数创造
    function tableHead(data, pageObj, $tbodys, $theTotalBox) {
        //多少页
        var page = data.page; //返回页数
        delete data.page;

        var ctNumArr = []; //非订单过滤
        var content = ''; //合计内容
        // pageAct(page,pageObj);
        //pageAct(10,pageObj);

        for (var i in data) { //这个是根据页面当前的自定义付款方式显示,删除对应st开头字符串

            if (i.length == 1 || i.length == 2 || i.substr(0, 2) == 'ct') {
                ctNumArr.push(data[i]);
                delete data[i];
            }
        }
        //alert(ctNumArr);
        for (i in ctNumArr) {
            content += "<li><span>" + ctNumArr[i].pay_type_name + " : </span>" + "<span> " + ctNumArr[i].money + "</span></li>";
        }
        content = '<ul> <li class="totalhejili"><b>合计</b></li>' + content + "</ul>";
        $theTotalBox.html(content);

        pageAct(page, pageObj);

        return { data: data };

    }
    // 显示储值通用统计数据
    function Statistics (data,pageObj){
        var ct = data.ct;
        pageAct(ct.pages,pageObj);
        var content = '';
        var content_1 = '';
        var contents = '';
        var add_time = '';

        // content += '<tr class="stores_title">'+
        //                 '<td width="16%" class="report_text">合计</td>'+
        //                 '<td width="12%">————</td>'+
        //                 '<td width="16%">————</td>'+
        //                 '<td width="12%">————</td>'+
        //                 '<td width="10%" class="report_num addColor">'+data.ct.order_stored+'</td>'+
        //                 '<td width="10%" class="report_num addColor">'+data.ct.order_stored+'</td>'+
        //                 '<td width="10%" class="report_num reduColor">'+data.ct.order_stored+'</td>'+
        //                 '<td width="10%" class="report_num reduColor">'+data.ct.order_stored+'</td>'
        //             '</tr>'
        for (var i in data) {
            add_time =  getAppointTimePro(data[i].add_time);

            if(i=='ct'){
                content += '<tr class="stores_title">'+
                    '<td width="12%" class="report_text">合计</td>'+
                    '<td width="20%">————</td>'+
                    '<td width="12%">————</td>'+
                    '<td width="12%">————</td>'+
                    '<td width="7%" class="report_num '+ ClassColor(data[i].order_stored)+'">'+(data[i].order_stored==0?'————':data[i].order_stored)+'</td>'+
                    '<td width="7%" class="report_num '+ ClassColor(data[i].order_principal)+'">'+(data[i].order_principal==0?'————':data[i].order_principal)+'</td>'+
                    '<td width="7%" class="report_num '+ ClassColor(data[i].pay_stored)+'">'+(data[i].pay_stored==0?'————':data[i].pay_stored)+'</td>'+
                    '<td width="7%" class="report_num '+ ClassColor(data[i].pay_principal)+'">'+(data[i].pay_principal==0?'————':data[i].pay_principal)+'</td>'+
                    '</tr>';
            }else{
                content_1 += '<tr class="stores_title">'+
                    '<td width="12%" class="report_text">'+add_time+'</td>'+
                    '<td width="20%" class="report_text">'+data[i].order_card_name+'<span class="spanLeft">('+data[i].order_shop_name+')</span></td>'+
                    '<td width="12%" class="report_text hyperLink" data-type="pay_id"  data_pay_id="' + data[i].pay_id + '">'+ data[i].pay_id + '</td>'+
                    '<td width="12%" class="report_text">'+data[i].pay_card_name+'<span>'+(data[i].entity_id==null?'(储值账户)':'(实体卡)')+'</span></td>'+
                    '<td width="7%" class="report_num '+ ClassColor(data[i].order_stored)+'">'+(data[i].order_stored==0?'————':data[i].order_stored)+'</td>'+
                    '<td width="7%" class="report_num '+ ClassColor(data[i].order_principal)+'">'+(data[i].order_principal==0?'————':data[i].order_principal)+'</td>'+
                    '<td width="7%" class="report_num '+ ClassColor(data[i].pay_stored)+'">'+(data[i].pay_stored==0?'————':data[i].pay_stored)+'</td>'+
                    '<td width="7%" class="report_num '+ ClassColor(data[i].pay_principal)+'">'+(data[i].pay_principal==0?'————':data[i].pay_principal)+'</td>'+
                    '</tr>';
            }
            contents = content + content_1;
        }
        // console.log(content)
        $('#tbodys_1').html(contents);
        // $theContent.html(content);
    }
    // 显示数据
    function CashierList(data, $tbodys, pageObj, $theTotalBox) {

        var dataObj = tableHead(data, pageObj, $tbodys, $theTotalBox); //要过滤的数据和请求页的数据 注:分页函数在tableHead中调用

        data = dataObj.data;

        var content = '';
        /*var temp;*/


        var totalConsume = 0, // 合计消费金额
            totalMoney = 0, // 合计线上优惠金额
            totalAfterDiscount = 0, // 合计实收金额
            // totalSmallChange = 0,   // 合计抹零金额
            // totalSubMoney = 0,      // 合计线下优惠金额
            // totalCard = 0,          // 合计银行卡
            // totalCash = 0,          // 合计现金
            // totalVoucher = 0,       // 合计抵用劵支付金额
            // totalStored = 0,        // 合计储值支付金额
            // totalOther = 0;         // 合计其他支付方式
            trNum = 0; //条数合计
        var _idTemp = ''; //判断结账单号的缓存
        var _orderTemp = ''; //订单好缓存
        var _order_idArry = [];
        var payno;

        for (var i in data) {
            trNum++;
            _idTemp = '';
            _orderTemp = '';
            if (!data[i].pay_no) {
                payno = '';
            } else {
                payno = data[i].pay_no;
            }
            //处理结账单号提示问题
            if (data[i].pay_id) {
                _idTemp = '<td class="ordert_undine payid payid_css" data-refundid="' + data[i].pay_id + '">' + pay_no_he(payno) + '&nbsp;' + '(' + data[i].pay_id + ')' + '</td>';
            } else {
                _idTemp = '<td class="unPayId">' + '——' + '</td>';
            }
            //alert(data[i].a_user_id);
            //处理订单好分割
            _order_idArry = data[i].order_id == undefined ? '' : data[i].order_id.split(",");

            //_orderTemp
            for (var z = 0; z < _order_idArry.length; z++) {
                _orderTemp += (z > 0 ? "," : '') + '<span class="order_btn" data-refundid="' + data[i].pay_id + '"> ' + _order_idArry[z] + ' </span> ';
            }

            //console.log(_orderTemp);



            content += '<tr class="total-tr">' +
                '<td class=""   data-type="addtime">' + getAppointTimePro(data[i].add_time) + '</td>' + //日期时间
                '<td>' + data[i].shop_name + '</td>' + //店铺
                '<td class="hide" data-type="type">' + data[i].type + '</td>' + //方式
                '<td class=""   data-type="paytypename">' + data[i].pay_type_name + '</td>' + //方式
                '<td class=""   data-type="money">' + data[i].money + '</td>' + //金额
                '<td class="ordert_undine" data-type="orderid">' + _orderTemp + '</td>' + //订单号
                //'<td class="" data-type="addtime">'+data[i].record_id+'</td>'+ //结账单号
                _idTemp +
                '<td class="hide" data-type="btn">' +
                '<input type="button" value="详情" data-type="handoverxq" class="xiangqingbtn">' +
                '</td>' +
                '</tr>';
        }

        // 添加到页面中
        $tbodys.html(content);
    }

    //创建分页
    function pageAct(MaxPageNum, searchObj) { //分页按钮包裹div,最大页数,分野查询参数对象

        var content = '';
        var content2 = '';
        searchObj.$search_page.html('');

        if (MaxPageNum <= 1) { //分页小于等于1页

        } else if ((MaxPageNum > 1) && (MaxPageNum < 5)) { //分页在1~5之间
            for (var i = 1; i <= MaxPageNum; i++) {

                content += '<a href="javascript:void(0)" data-start-date="' + searchObj.start_date + '" data-end-date="' + searchObj.end_date + '" data-type="' + searchObj.type + '" data-page="' + i + '" class="home_page' + (i == searchObj.page ? " on " : "") + '">' + i + '</a>';

            }

        } else if (MaxPageNum >= 5) { //分页大于5


            for (var i = 1; i <= MaxPageNum; i++) {
                content += '<a href="javascript:void(0)" data-start-date="' + searchObj.start_date + '" data-end-date="' + searchObj.end_date + '" data-type="' + searchObj.type + '" data-page="' + i + '" class="home_page' + (i == searchObj.page ? " on " : "") + '">' + i + '</a>&';

            }
            //console.log(content);
            var contentArr = content.split("&"); //分割数组
            var _strTemp;

            if (searchObj.page < 5) { //前十个
                //alert(searchObj.page);
                _strTemp = contentArr.slice(0, 5);
                content = _strTemp.toString();
                content = content.replace(/,/g, '');
                content = content + "<span>...</span>";


            } else if ((5 <= searchObj.page) && (searchObj.page <= MaxPageNum - 5)) { //中间
                // 如果是10页面下面两个数都是5，如果是5也下面两个数 3 2
                _strTemp = contentArr.slice(parseInt(searchObj.page) - 3, parseInt(searchObj.page) + 2);
                //alert(searchObj.page-5+"%"+searchObj.page+5);
                content = _strTemp.toString();
                content = content.replace(/,/g, '');
                content = "<span>...</span>" + content + "<span>...</span>";

            } else if ((MaxPageNum - 5 <= searchObj.page) && (searchObj.page <= MaxPageNum)) { //后十个

                _strTemp = contentArr.slice(MaxPageNum - 5, MaxPageNum);
                content = _strTemp.toString();
                content = content.replace(/,/g, '');
                content = "<span>...</span>" + content;
            }


        }


        content2 = '<a href="javascript:void(0)" data-start-date="' + searchObj.start_date + '" data-end-date="' + searchObj.end_date + '" data-type="' + searchObj.type + '" data-page="1" class="home_page">首 页</a>' +
            content +
            '<a href="javascript:void(0)" data-start-date="' + searchObj.start_date + '" data-end-date="' + searchObj.end_date + '" data-type="' + searchObj.type + '" data-page="' + MaxPageNum + '" class="home_page">尾 页</a>'


        //添加输入跳转部分
        //content2 += '跳转到：<input type="text" value="'+ searchObj.page +" / "+ MaxPageNum+'" class="page_just"><input type="button" value="GO" class="page_go">'
        content2 += '跳转到：<input type="text" data-description="页码" placeholder=""  autocomplete="off" data-start-date="' + searchObj.start_date + '" data-end-date="' + searchObj.end_date + '"data-type="' + searchObj.type + '" data-page="' + MaxPageNum + '" value="' + searchObj.page + " / " + MaxPageNum + '" class="page_just"><input type="button" value="GO" class="page_go">';


        searchObj.$search_page.html(content2);
    }
    function ClassColor(name) {
        if(name!=undefined){
            var class_cl ='';
            // if (name.split('+')) {
            if (name.indexOf('+') != -1){
                class_cl = 'addColor';
            } else if (name.indexOf('-') != -1) {
                class_cl = 'reduColor';
            } else{
                class_cl = 'grayLine'
            }
            return class_cl;
        }
    }
});
