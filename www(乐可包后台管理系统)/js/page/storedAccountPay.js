$(function () {

    // 总部收银员登录====用户账户支付 storedAccountPay
    var countdown;
    var clicknum = 1 ;//点击确定按钮可用
    var shop_type_info = 0;
    //order_step  订单状态：1下单  3确认出单 9已结账 0门店取消订单
    var count = 60;
    var vouchersPrice = 0,          // 抵用劵金额
        canuseVouchePrice = 0,      // 是否选择了使用抵用劵（抵用劵金额）
        recordId = '',              // 抵用劵id
        canuseRecordId = 0,         // 是否选择了使用抵用劵（抵用劵id）
        leMoney = 0,                // 乐币余额
        leAmount = 0,               // 乐币金额
        lepay = 0,                  // 乐币需要支付的金额
        wxpay = 0,                  // 微信支付金额
        alipay = 0,
        cashier = 0,                // 银台支付金额
        discountSrice = 100,        // 折扣额度
        totalPurchase = 0,          // 用来计算的消费金额
        dishesConsume = 0,          // 消费金额
        memberPrice = 0,            // 会员价
        calculationPrice = 0,       // 用来计算是消费金额还是会员价
        distinguishCount = 0,       // 区分用是消费金额还是会员价 0：消费金额，1：会员价
        nDiscountMoney = 0,         // 不参与打折的消费金额
        totalConsumption = 0,       // 应付金额（乐币+抵用劵） = 消费金额 - 优惠金额
        trueTotalConsumption = 0,   // 实付金额（折后金额）（会员卡折扣） = 消费金额 - 优惠金额
        preferentialPrice = 0,      // 优惠金额

        payorderInfo = {},          // 存储所有数据
        change_tableInfo = {},      // 可改变内容的存储所有数据
        conflict_pay_info = {},     // 存储冲突用的支付信息
        ch_menu_money_info = {},    // 存储计算处理的优惠金额数组

        orderData = '',             // 订单数据（有用处就用，没有用处就不用）
        isHasPay = false,           // 是否支付过（部分支付）

        isUseLe = true,             // 是否可以使用乐币支付
        isLecoin = true,            // 是否选择了使用乐币
        isUseVoucher = true,        // 是否可以使用抵用劵支付
        isVoucher = true,           // 是否选择了使用抵用劵
        isUseDiscount = true,       // 是否可以使用折扣支付
        is_member_price = 0,        // 是否可以使用会员价 0 否 1 是
        isDiscount = true,          // 是否选择了折扣
        isMember = true,            // 是否选择了会员价
        is_wxpay = true,            // 是否支持微信支付
        isWxpay = false,            // 是否选择了微信
        is_alipay = true,           // 是否支持支付宝
        isAlipay = false,           // 是否选择了支付宝
        is_cashier_pay = 0,         // 是否授权收银员支付储值 1授权 0未授权

        yesNoWxPay = true,          // 微信中是否无乐币、无抵用劵默认使用微信支付
        yesNoAliPay = true,         // 

        is_load = 0,                // 是否第一次加载(刷新也算)0 否 1 是
        storage_one = {},           // 存储缓存应对只弹出一次一种类型冲突(初始化)

        stored_type = 1,            // 1会员 2实体卡

        phone_input_pay = '',       // 传给支付接口的手机号，点击查询按钮就存储
        is_pay_mode = 1,            // 传给支付接口的支付方式，点击查询按钮就存储

        is_prompt = 0,              // 是否优惠方案不支持乐币

        isNoDis = false,            // 是否折扣不可取消 true:不可取消，false:可取消
        isNoMem = false,            // 是否会员价不可取消 true:不可取消，false:可取消
        isNoWx = false,             // 是否微信不可取消 true:不可取消，false:可取消
        isNoAli = false,
        sumMenuNum = 0,             // 菜品个数，不是份数
        dishesMenu = '';            // 菜品数据
        
    var ua = navigator.userAgent.toLowerCase();  //判断是否是ipad
    // 是否支持实体卡的开关
    var is_entity_card = $.cookie('is_entity_card');

    // 在壳子里才显示
    if ($.cookie('card_shell') == 1) {
        // 绑定键盘事件
        bind_key();
        // 绑定全键盘
        bind_total_key();
    }
    // 判断是否支持实体卡，显示隐藏选项卡
    if (is_entity_card == 0) {
        $('#mode_consumption').addClass('hide');
    } else {
        $('#mode_consumption').removeClass('hide');
    }
    // 调用监控键盘(public.js)
    keydown_monitor('#card_barcode');

    // 绑定页面事件
    bindEvents();

    if ($.cookie('pay_id') != undefined) {
        // 结帐号赋值
        $('#account_input,#account_input_1').val($.cookie('pay_id'));
    }

    // 绑定页面事件
    function bindEvents() {
        //点击选项卡切换
        $("#stored_lab").unbind('click').bind('click', function () {
            $("#stored_count").removeClass("hide");
            $("#card_count").addClass("hide");
            is_scan_monitor = 0;
            stored_type = 1;
        });
        $("#card_lab").unbind('click').bind('click', function () {
            $("#card_count").removeClass("hide");
            $("#stored_count").addClass("hide");
            is_scan_monitor = 1;
            stored_type = 2;
        });

        // 确定查询结账单接口
        $('#confirm_select,#confirm_select_1').unbind('click').bind('click', function () {
            if(clicknum == 1){
            // 得到输入框中的结账号pay_id和手机号
                var account_input = $('#account_input').val();
                var account_input_1 = $('#account_input_1').val();
                var phone_input = $('#phone_input').val();
                var card_barcode = $('#card_barcode').val();
                var card_no = $('#card_no').val();
                clicknum = 0 ;//点击确定按钮不可用


                if (stored_type == 1) {
                    if (account_input == '') {
                        displayMsg(ndPromptMsg, '请输入结帐号！', 2000);
                        clicknum = 1 ;//点击确定按钮可用
                        return;
                    }
                    if (phone_input == '') {
                        displayMsg(ndPromptMsg, '请输入手机号！', 2000);
                        clicknum = 1 ;//点击确定按钮可用
                        return;
                    }
                    // 读取结账单信息及用户账户信息
                    getOrderInfo(account_input, phone_input, card_barcode, card_no);
                } else {
                    if (account_input_1 == '') {
                        displayMsg(ndPromptMsg, '请输入结帐号！', 2000);
                        clicknum = 1 ;//点击确定按钮可用
                        return;
                    }
                    if (card_barcode == '' && card_no == '') {
                        displayMsg(ndPromptMsg, '请放卡或输入卡号！', 2000);
                        clicknum = 1 ;//点击确定按钮可用
                        return;
                    }
                    if (card_no != '' && !Pattern.entity_card.test(card_no)) {
                        displayMsg(ndPromptMsg, '请输入正确的卡号！', 2000);
                        clicknum=1;//点击按钮可用
                        return;
                    }
                    // 读取结账单信息及用户账户信息
                    getOrderInfo(account_input_1, phone_input, card_barcode, card_no);
                }
            }
        });

        // 点击结账号输入框清除按钮，清空内容
        $('#eliminate').unbind('click').bind('click', function () {
            $('#account_input').val('');
        });

        // 发送授权验证码
        $('#author_code').unbind('click').bind('click', function () {
            // 得到输入框中的手机号
            if($('#author_code').attr('disabled-data') == ''){
                var phone_input = $('#phone_input').val();
                if (phone_input == '') {
                    displayMsg(ndPromptMsg, '请输入手机号！', 2000);
                    clicknum = 1 ; //点击确定按钮可用
                    return;
                }
                // 发送验证码接口，和验证码倒计时在可重新发送处理
                get_author_code(phone_input);
            }
        });

        // 无乐币、抵用劵，点击返回收银台
        $('#no_detail').unbind('click').bind('click', function () {
            $.cookie('storedPay_1', 1, {path:'/html',domain:'.lekabao.net'});
            // 区分是不是壳子
            if ($.cookie('card_shell') == 1) {
                // 跳转回收银台
                if(ua.match(/iPad/i)=="ipad") {
                    window.top.location.href='http://cashier.lekabao.net/html/box_ipad.html';
                } else {
                    // 调用父级iframe
                    window.parent.stored_pay_father();
                    // window.top.location.href='http://cashier.lekabao.net/html/box.html';
                }
            } else {
                window.top.location.href='http://cashier.lekabao.net/html/dishes.html';
            }
        });

        // 抵用劵点击事件
        $('#clickVouch').unbind('click').bind('click', function() {
            // 是否选择了抵用劵，选择了抵用劵才可以点击
            if (isVoucher == true) {
                selectVoucher();
            }
        });
    
        // 点击确认支付按钮
        $('#confirm_pay').unbind('click').bind('click', function () {
            if(clicknum == 1 ){
                clicknum = 0 ;//不可以点击确定支付
                orderPay();
            }
        });
       
        

        // 折扣选择框点击(选择|取消)
        $('#isDiscount').unbind('click').bind('click', function () {
            // 是否可以取消折扣，可以取消
            if (isNoDis == false) {
                // 添加隐藏选择框是否选中
                $('#isDiscount').toggleClass('gouCurrent');
                // 判断是否有选中样式
                if ($('#isDiscount').hasClass('gouCurrent')) {
                    // 是否选择了折扣，为true
                    isDiscount = true;

                    /*// 可以使用抵用劵
                    if (isUseVoucher == true) {
                        isVoucher = false;
                        $('#isVoucher').removeClass('gouCurrent');
                        $('#clickVouch').addClass('setBg');
                    }
                    // 可以使用乐币
                    if (isUseLe == true) {
                        isLecoin = false;
                        $('#clickUseLe').addClass('setCol');
                        $('#isLecoin').removeClass('gouCurrent');
                        $('#stored').addClass('setCol')
                        $('#stored').val(0)
                        $('#stored').prop('readonly', true);
                    }*/

                    // 计算金额
                    //calculationAmount(isUseLe,isUseVoucher,isUseDiscount);
                    // 生成当前选择的支付方案，提交检查冲突，之后在计算金额
                    generate_choice_submit('', 1);
                } else {

                    /*// 可以使用抵用劵
                    if (isUseVoucher == true) {
                        isVoucher = true;
                        $('#isVoucher').addClass('gouCurrent');
                        $('#clickVouch').removeClass('setBg');
                    }
                    // 可以使用乐币
                    if (isUseLe == true) {
                        isLecoin = true;
                        $('#clickUseLe').removeClass('setCol');
                        $('#isLecoin').addClass('gouCurrent');
                        $('#stored').removeClass('setCol')
                        $('#stored').prop('readonly', false);
                    }*/

                    conflict_pay_info['discount_rate'] = 100;

                    // 是否选择了折扣，为false
                    isDiscount = false;
                    // 计算金额
                    //calculationAmount(isUseLe,isUseVoucher,isUseDiscount);
                    // 生成当前选择的支付方案，提交检查冲突，之后在计算金额
                    generate_choice_submit('', 0, 1);
                }
            }
        });

        // 乐币选择框点击(选择|取消)
        $('#isLecoin').unbind('click').bind('click', function () {
            // 如果可以使用折扣，乐币才可以选中取消，否则不能点击取消
            /*if (isUseDiscount == true) {*/
                // 添加隐藏选择框是否选中
                $('#isLecoin').toggleClass('gouCurrent');
                // 判断是否有选中样式
                if ($('#isLecoin').hasClass('gouCurrent')) {
                    //alert('ddd');
                    // 是否选择了乐币，为true
                    isLecoin = true;
                    $('#clickUseLe').removeClass('setCol');
                    $('#stored').removeClass('setCol')
                    $('#stored').prop('readonly', false);
                    // 可以使用抵用劵(不强制使用乐币抵用劵所以注释掉)
                    /*if (isUseVoucher == true) {
                        isVoucher = true;
                        $('#isVoucher').addClass('gouCurrent');
                        $('#clickVouch').removeClass('setBg');
                    }*/
                    // 可以使用折扣 应用冲突的时候应该注释掉
                    /*if (isUseDiscount == true) {
                        isDiscount = false;
                        $('#isDiscount').removeClass('gouCurrent');
                        conflict_pay_info['discount_rate'] = 100;
                    }*/
                    lepay = 1;// 解决如果我选中的时候默认有那么一块钱，但是到了计算金额的地方就变化了主要是应付冲突
                    is_load= 1;
                    // 计算金额
                    // 生成当前选择的支付方案，提交检查冲突，之后在计算金额
                    generate_choice_submit('');
                } else {
                    // 是否选择了乐币，为false
                    isLecoin = false;
                    $('#clickUseLe').addClass('setCol');
                    $('#stored').addClass('setCol')
                    $('#stored').val(0)
                    $('#stored').prop('readonly', true);                            
                    // 可以使用抵用劵(不强制使用乐币抵用劵所以注释掉)
                    /*if (isUseVoucher == true) {
                        isVoucher = false;
                        $('#isVoucher').removeClass('gouCurrent');
                        $('#clickVouch').addClass('setBg');
                    }*/
                    lepay = 0;
                    is_load = 2;// 微信用
                    // 如果没有选择抵用劵，说明两个都取消了，这时候才可以使用折扣
                    /*if (isVoucher == false) {
                        // 可以使用折扣
                        if (isUseDiscount == true) {
                            isDiscount = true;
                            $('#isDiscount').addClass('gouCurrent');
                        }
                    }*/

                    // 计算金额
                    // 生成当前选择的支付方案，提交检查冲突，之后在计算金额
                    generate_choice_submit('');
                }
            /*}*/
        });

        // 抵用劵选择框点击(选择|取消)
        $('#isVoucher').unbind('click').bind('click', function () {
            // 如果可以使用折扣，抵用劵才可以选中取消，否则不能点击取消
            /*if (isUseDiscount == true) {*/
                // 添加隐藏选择框是否选中
                $('#isVoucher').toggleClass('gouCurrent');
                // 判断是否有选中样式
                if ($('#isVoucher').hasClass('gouCurrent')) {
                    // 是否选择了抵用劵，为true
                    isVoucher = true;
                    $('#clickVouch').removeClass('setBg');

                    // 可以使用乐币(不强制使用乐币抵用劵所以注释掉)
                    /*if (isUseLe == true) {
                        isLecoin = true;
                        $('#isLecoin').addClass('gouCurrent');
                        $('#clickUseLe').removeClass('setCol');
                    }*/
                    // 可以使用折扣 应用冲突的时候应该注释掉
                    /*if (isUseDiscount == true) {
                        isDiscount = false;
                        $('#isDiscount').removeClass('gouCurrent');
                        conflict_pay_info['discount_rate'] = 100;
                    }*/
                    vouchersPrice = canuseVouchePrice;
                    is_load= 1;
                    // 计算金额
                    // 生成当前选择的支付方案，提交检查冲突，之后在计算金额
                    generate_choice_submit('');
                } else {
                    // 是否选择了抵用劵，为false
                    isVoucher = false;
                    $('#clickVouch').addClass('setBg');
                    is_load = 2;// 微信用
                    // 可以使用乐币(不强制使用乐币抵用劵所以注释掉)
                    /*if (isUseLe == true) {
                        isLecoin = false;
                        $('#isLecoin').removeClass('gouCurrent');
                        $('#clickUseLe').addClass('setCol');
                    }*/
                    vouchersPrice = 0;

                    // 如果没有选择乐币，说明两个都取消了，这时候才可以使用折扣
                    /*if (isLecoin == false) {
                        // 可以使用折扣
                        if (isUseDiscount == true) {
                            isDiscount = true;
                            $('#isDiscount').addClass('gouCurrent');
                        }
                    }*/

                    // 计算金额
                    // 生成当前选择的支付方案，提交检查冲突，之后在计算金额
                    generate_choice_submit('');
                }
            /*}*/
        });

        // 乐币支付输入值变化
        $('#stored').unbind('input').bind('input', function (){
            is_load = 2;// 微信用
            // 校验输入值
            checkNum('stored', 1);
            /*var yingfujine = $('#copeWithPay').text();           //获取应付金额
            var stored = $(this).val();                     //获取输入金额
            var wxVal = $('#wxpay').val();                      //获取微信输入金额
            if(parseFloat(stored) + parseFloat(wxVal) > yingfujine){
                $('#stored').val(yingfujine - wxVal);
            }*/
        });
    }

    // 读取结账单信息及用户账户信息
    function getOrderInfo(account_input, phone_input, card_barcode, card_no) {
        var data = {};
        if (stored_type == 1) {
            data = {
                'pay_id': account_input,
                'user_mobile': phone_input,
                'stored_type': stored_type
            };
        } else {
            data = {
                'pay_id': account_input,
                'stored_type': stored_type,
                'card_barcode': card_barcode,
                'card_no': card_no
            };
        }
        phone_input_pay = phone_input;
        is_pay_mode = stored_type;
        is_prompt = 0;
        setAjax(AdminUrl.orderInfo, data, $('#prompt-message'), {20: ''}, function(respnoseText) {
            if (respnoseText.code == 20) {
                clicknum = 1 ; //点击按钮可用
                // 得到返回数据
                var data = respnoseText.data;
                // 基本赋值
                basicReplication(data);
            } else {
                clicknum = 1 ;//点击确定按钮可用
                displayMsg(ndPromptMsg, respnoseText.message, 2000);
                // 隐藏结账单信息
                $('#main_display').addClass('hide');
                // 隐藏无乐币、抵用劵提示
                $('#no_detail').addClass('hide');
            }
        }, 0);
    }
    function CountDown() {
        $("#author_code").attr("disabled-data", 'disabled');
        $("#author_code").css('color','#999')
        $("#author_code").text(count+'重新发送');
        if (count == 0) {
            $("#author_code").text("发送验证码").attr("disabled-data",'');
            $("#author_code").css('color','#ff7247');
            clearInterval(countdown);
            count = 60;
        }
        count--;
    }
    // 基本赋值
    function basicReplication(data) {

        // (初始化一次弹出层数据)存储缓存应对只弹出一次一种类型冲突(九种冲突0就是没弹层1就是弹出层了)
        storage_one = {1: 0,2: 0,3: 0,4: 0,5: 0,6: 0,7: 0,8: 0,9: 0};

        // 存储所有数据
        payorderInfo = dishesStackHandle(data, payorderInfo);
        // 可改变内容的存储所有数据
        change_tableInfo = dishesStackHandle(data, change_tableInfo);
        // 存储冲突用的支付信息
        conflict_pay_info = dishesStackHandle(data.pay_info, conflict_pay_info);

        // is_cashier_pay 是否授权收银员支付储值 1授权 0未授权
        if (data.user_account.is_cashier_pay == 0 && is_pay_mode == 1) {
            $('#author_code_display').removeClass('hide');
        } else {
            $('#author_code_display').addClass('hide');
        }
        is_cashier_pay = data.user_account.is_cashier_pay;

        // 将以下属性添加到页面
        $('#payorderScroll').removeClass('hide');

        if (data.pay_info.promo.promo_name != undefined) {
            //银台优惠名称
            $('#sub_moneyu').text('（'+data.pay_info.promo.promo_name+'）');
        }

        //显示取消支付
        if (data.pay_info.wxpay_temp != 0) {
            $('#cancelPay').removeClass('hide');
        } else {
            $('#cancelPay').addClass('hide');
        }

        if (data.pay_info.alipay_temp != 0) {
            $('#cancelPay').removeClass('hide');
        } else {
            $('#cancelPay').addClass('hide');
        }

        // 如果菜品个数不是undefined就赋值
        if (data.order.new_order != undefined) {
            // 菜品个数，不是份数
            sumMenuNum = data.order.new_order.sum_menu_num;
            // 菜品数据
            dishesMenu = data.order.new_order.menu;
        }

        // 判断是否支付过， isHasPay = false 没有支付过， isHasPay = true 支付过
        if (data.pay_info.stored == 0 && data.pay_info.voucher == 0 && data.pay_info.wxpay == 0 && data.pay_info.wxpay_temp == 0 && data.pay_info.alipay == 0 && data.pay_info.alipay_temp == 0 && data.pay_info.cash == 0 && data.pay_info.card == 0 && data.pay_info.other == 0) {
            isHasPay = false;
        } else {
            isHasPay = true;
        }

        // 折扣额度 判断 已登陆 并且 是未使用乐币、抵用劵支付过的订单（微信可以支付过）
        if ($.cookie("a_user_mobile") && data.pay_info.stored == 0 && data.pay_info.voucher == 0){
            if ((data.pay_info.discount_rate != 100 && data.pay_info.member_price_cashier == '') || data.pay_info.member_price_cashier != '' || data.pay_info.wxpay != 0 || data.pay_info.wxpay_temp != 0 || data.pay_info.alipay != 0 || data.pay_info.alipay_temp != 0 || data.pay_info.cash != 0 || data.pay_info.card != 0 || data.pay_info.other != 0) {
                discountSrice = data.pay_info.discount_rate;
            } else {
                discountSrice = data.user_account.discount_rate == undefined ? 100 : data.user_account.discount_rate;
            }

            // 如果付过钱，并且银台优惠方案是折扣方案并且不支持会员折扣，就赋值折扣额度=100
            // 是否支付过， isHasPay = false 没有支付过， isHasPay = true 支付过
            if (isHasPay == true && data.pay_info.promo_id != '' && data.pay_info.promo.discount_amount != 100 && data.pay_info.promo.is_member_discount == 0) {
                discountSrice = 100;
            }
        } else {
            discountSrice = 100;
        }
        // 下面都判断如果 discount_rate 会员折扣==100才使用乐币抵用劵，否则不能使用

        // 没有抵用劵 
        if ($.cookie("a_user_mobile") && (data.pay_info.discount_rate == 100 || (data.pay_info.discount_rate != 100 && data.pay_info.wxpay == 0 && data.pay_info.wxpay_temp == 0 && data.pay_info.alipay == 0 && data.pay_info.alipay_temp == 0))){
            if (

                data.user_voucher == undefined || data.user_voucher.voucher_check == '' || data.user_voucher.voucher_check == undefined || 
                (isHasPay == true && data.pay_info.promo_id != '' && data.pay_info.promo.discount_amount != 100 && (data.pay_info.promo.pay_type['all'] == 0 || data.pay_info.promo.pay_type['ct0000000004'] == 0))

                ){
                // 是否选择了抵用劵
                isVoucher = false;
                // 没有选择抵用劵，把抵用劵选择框样式去掉
                $('#isVoucher').removeClass('gouCurrent');
                // 隐藏抵用劵
                $('#selectVouch').addClass('hide');
                // 是否可以使用抵用劵支付
                isUseVoucher = false;
            } else {
                // 是否选择了抵用劵
                isVoucher = true;
                // 选择抵用劵，把抵用劵选择框样式加上
                $('#isVoucher').addClass('gouCurrent');

                // 抵用劵金额
                vouchersPrice = data.user_voucher.voucher_check.voucher_money;
                // 是否选择了使用抵用劵（抵用劵金额）
                canuseVouchePrice = data.user_voucher.voucher_check.voucher_money;
                // 抵用劵id
                recordId = data.user_voucher.voucher_check.record_id;
                // 是否选择了使用抵用劵（抵用劵id）
                canuseRecordId = data.user_voucher.voucher_check.record_id;

                // 是否可以使用抵用劵支付
                isUseVoucher = true;
                // 显示抵用劵
                $('#selectVouch').removeClass('hide');
                // 抵用劵id填充
                $('#voucher').attr('record-id', data.user_voucher.voucher_check.record_id);

                // 可用抵用劵数据填充
                voucherList(data.user_voucher.voucher_list);
            }
        }
        // 乐币余额
        if ($.cookie("a_user_mobile") && (data.pay_info.discount_rate == 100 || (data.pay_info.discount_rate != 100 && data.pay_info.wxpay == 0 && data.pay_info.wxpay_temp == 0 && data.pay_info.alipay == 0 && data.pay_info.aliay_temp == 0))){
            var pay_card_money = data.user_account.currency_stored == undefined || data.user_account.currency_stored == null ? 0 : data.user_account.currency_stored;
            leMoney = data.user_account.stored_balance == undefined ? 0 : accAdd(data.user_account.stored_balance, pay_card_money);

            // 如果付过钱，并且银台优惠方案是折扣方案并且不支持乐币，就赋值乐币余额=0
            // 是否支付过， isHasPay = false 没有支付过， isHasPay = true 支付过
            if (isHasPay == true && data.pay_info.promo_id != '' && data.pay_info.promo.discount_amount != 100 && (data.pay_info.promo.pay_type['all'] == 0 || data.pay_info.promo.pay_type['ct0000000003'] == 0)) {
                leMoney = 0;
                is_prompt = 1;
            }
        } else {
            leMoney = 0;
        }

        //判断显示会员登录支付
        if ($.cookie("a_user_mobile")){
            $('#backNomelogin').addClass('hide')
        }else{
            $('#backNomelogin').removeClass('hide')
        }

        if (leMoney == 0 && (data.pay_info.discount_rate == 100 || (data.pay_info.discount_rate != 100 && data.pay_info.wxpay == 0 && data.pay_info.wxpay_temp == 0&& data.pay_info.alipay == 0 && data.pay_info.alipay_temp == 0))) {
            $('#menglebi').removeClass('hide');

            // 如果付过钱，并且银台优惠方案是折扣方案并且不支持乐币，就赋值乐币余额=0
            // 是否支付过， isHasPay = false 没有支付过， isHasPay = true 支付过
            if (isHasPay == true && data.pay_info.promo_id != '' && data.pay_info.promo.discount_amount != 100 && (data.pay_info.promo.pay_type['all'] == 0 || data.pay_info.promo.pay_type['ct0000000003'] == 0)) {
                $('#menglebi').addClass('hide');
            }
        } else {
            $('#menglebi').addClass('hide');
        }

        // 是否可以使用乐币支付
        if (leMoney == 0){
            // 是否选择了乐币
            isLecoin = false;
            // 没有选择乐币，把乐币选择框样式去掉
            $('#isLecoin').removeClass('gouCurrent');

            isUseLe = false;
            // 隐藏
            $('#UseLe').addClass('hide');
        } else {
            // 是否选择了乐币
            isLecoin = true;
            // 选择乐币，把乐币选择框样式加上
            $('#isLecoin').addClass('gouCurrent');
            lepay = 1;
            isUseLe = true;
            // 显示
            $('#UseLe').removeClass('hide');
        }

        // 如果用户乐币，抵用劵都没有，就提示信息，返回收银台
        if (isVoucher == false && isLecoin == false) {
            $('#main_display').addClass('hide');
            $('#no_detail').removeClass('hide');
             clicknum = 1 ; //点击确定按钮可用
            if (is_prompt == 1) {
                $('#no_detail').text('订单使用的优惠方案不支持乐币支付，请返回收银台！');
            } else {
                $('#no_detail').text('该用户没有乐币、抵用劵，请返回收银台！');
            }
            return;
        } else {
            $('#no_detail').addClass('hide');
            $('#main_display').removeClass('hide');
        }

        // 消费金额 = 消费 + 退菜 + 赠菜 + 转菜
        dishesConsume = accAdd(accAdd(accAdd(data.consumes, data.cancel_menu_consume) , data.give_menu_consume), data.rotate_menu_consume);
        // 消费金额
        $('#consume').text(parseFloat(dishesConsume).toFixed(2));
        dishesConsume = data.consumes;

        // 已付 = 乐币 + 抵用劵 + 微信
        var one_money = accAdd(accAdd(accAdd(accAdd(accAdd(accAdd(data.pay_info.stored, data.pay_info.voucher), data.pay_info.wxpay), data.pay_info.alipay), data.pay_info.cash), data.pay_info.card), data.pay_info.other);
        // 已付金额显示
        if (one_money != 0) {
            $('#pay_order_data').removeClass('hide');
            $('#pay_order_data_money').text(parseFloat(one_money).toFixed(2));
        } else {
            $('#pay_order_data').addClass('hide');
            $('#pay_order_data_money').text(parseFloat(0).toFixed(2));
        }

        // member_price_cashier 该字段有值时，APP上不管用户使用有会员价资格，是否使用会员价属性不允许变更。不再使用a_user_id判断。

        // is_member_price   是否适用会员价 0，否，1：是
        // 是否支付过， isHasPay = false 没有支付过， isHasPay = true 支付过
        if ($.cookie("a_user_mobile")){
            if (data.pay_info.member_price_cashier != '' || isHasPay == true || data.pay_info.discount_rate != 100) {
                is_member_price = data.pay_info.is_member_price;
            } else {
                if (data.user_account == undefined || data.user_account.is_member_price == undefined || data.user_account.is_member_price === '') {
                    is_member_price = data.pay_info.is_member_price;
                } else {
                    is_member_price = data.user_account.is_member_price;
                }
            }
        } else {
            is_member_price = data.pay_info.is_member_price;
        }

        // 不显示会员价
        $('#moneyDisplay').addClass('hide');

        // 是否支持微信支付
        is_wxpay = data.is_wxpay;
        is_alipay = data.is_alipay;

        // 如果折扣等于100 就隐藏折扣，否则显示
        if (discountSrice == 100) {
            // 如果没有折扣，折后金额 = 消费金额
            trueTotalConsumption = calculationPrice;
            // 是否选择了折扣
            isDiscount = false;
            // 没有选择折扣，把折扣选择框样式去掉
            $('#isDiscount').removeClass('gouCurrent');
            // 这里折扣在赋值100是因为扫描的快捷支付订单，不显示会员折扣
            discountSrice = 100;
            // 是否可以使用折扣支付
            isUseDiscount = false;
            // 隐藏
            $('#discountDisplay').addClass('hide');
        } else {
            // 如果有折扣默认选择了折扣
            isDiscount = true;
            // 选择折扣，把折扣选择框样式加上
            $('#isDiscount').addClass('gouCurrent');
            // 是否可以使用折扣支付
            isUseDiscount = true;
            conflict_pay_info['discount_rate'] = discountSrice;
            // 显示
            $('#discountDisplay').removeClass('hide');
            // 如果折扣是0的话就显示0，否则页面显示折扣除以10之后的额度
            if (discountSrice == 0) {
                // 折扣额度填充
                $('#discountRate').text(discountSrice);
            } else {
                $('#discountRate').text(discountSrice/10);
            }
        }

        // 下面都判断如果 discount_rate 会员折扣==100才使用乐币抵用劵，否则不能使用
        // 是否支付过， isHasPay = false 没有支付过， isHasPay = true 支付过
        if (data.pay_info.discount_rate != 100 && isHasPay == true) {// 不等于100 不能取消会员折扣
            isNoDis = true;
        } else {
            isNoDis = false;
        }

        // 进行转类型，因为返回的是字符串类型需要转成两位小数,toFixed(2)这个函数是用于parseFloat转型之后相加出现精度不准的情况下进行修正精度为两位小数

        // 消费金额
        dishesConsume = parseFloat(dishesConsume);
        // 会员价
        memberPrice = parseFloat(memberPrice);
        // 用来计算的金额
        calculationPrice = parseFloat(calculationPrice);
        // 用来计算的消费金额
        totalPurchase = parseFloat(totalPurchase);
        // 抵用劵金额
        vouchersPrice = parseFloat(vouchersPrice);
        // 是否选择了使用抵用劵（抵用劵金额）
        canuseVouchePrice = parseFloat(canuseVouchePrice);
        // 乐币余额
        leMoney = parseFloat(leMoney);
        // 折后金额
        trueTotalConsumption = parseFloat(trueTotalConsumption);

        // 如果没有菜品的话（只有快捷支付订单才没有菜品）
        if (data.menu == undefined || data.menu == '') {
            // 隐藏菜品信息那一行文字
            $('#menuDispaly').addClass('hide');
            // 隐藏菜品的div
            $('#menuDispalyT').addClass('hide');
        } else {
            // 显示菜品信息那一行文字
            $('#menuDispaly').removeClass('hide');
            // 显示菜品的div
            $('#menuDispalyT').removeClass('hide');
            // 显示菜品信息
            menuList(data);
        }

        is_load = 1;// 是否第一次加载(刷新也算)0 否 1 是

        // 计算金额
        // 生成当前选择的支付方案，提交检查冲突，之后在计算金额
        generate_choice_submit(is_member_price);

        //如果是未登录隐藏会员折扣，乐币 。稍后支付
        if (!$.cookie("a_user_mobile")) {
            $('#discountDisplay').addClass('hide');
            $('#menglebi').addClass('hide');
            //$('.loadpay').addClass('hide');
        }
    }

    // 显示菜品数据
    function menuList(data) {
        var contentMain = '';   // 全部订单
        var content = '';// 单个订单<li class="state"><p><u>'+getDate()+'</u><u>进行中</u></p></li>
        var contentRe = '';// 套餐菜
        var menu_unit = '';

        // 菜品数量
        var mneuNum = 0;
        var num99 = '';

        var quxiao = 1; //1是已取消，

        var exit_step_money = 0;// 取消订单金额
        var ex_order_menu_consume = 0;// 订单金额

        for (var i in data.order) {
            if (data.order[i].order_step != 0) {
                quxiao = 0;
            }
            if (data.order[i].order_step == 0) {
                exit_step_money = exit_step_money + parseFloat(data.order[i].consume);
            }
            ex_order_menu_consume = ex_order_menu_consume + parseFloat(data.order[i].consume);
        }

        if (exit_step_money == 0) {
            $('#order_money_disp,#exit_step_disp').addClass('hide');
        } else {
            $('#order_money_disp,#exit_step_disp').removeClass('hide');
            // 订单金额
            $('#order_menu_consume').text(parseFloat(ex_order_menu_consume).toFixed(2));
            // 取消订单金额
            $('#exit_step_money').text(parseFloat(exit_step_money).toFixed(2));
        }
    }

    // 发送验证码接口，和验证码倒计时在可重新发送处理
    function get_author_code(phone_input) {
        setAjax(AdminUrl.orderSms, {
            'sms_type': 3,
            'user_mobile': phone_input
        }, $('#prompt-message'), {20: ''}, function(respnoseText) {
            if (respnoseText.code == 200103) {
                // 得到返回数据
                var data = respnoseText.data;
                countdown = setInterval(CountDown, 1000);
                displayMsg(ndPromptMsg, respnoseText.message, 2000);   
                clicknum = 1 ;//点击确定按钮可用     
            } else {
                displayMsg(ndPromptMsg, respnoseText.message, 2000);
                 clicknum = 1 ;//点击确定按钮可用
            }
        }, 0);
    }

    // 可用抵用劵列表填充
    function voucherList(data, is_judge, moneysPro) {
        var content = '';

        // is_enable 0 灰色不可用，1 可选择
        //var className = 'vouchers-content';// 默认可用

        for (var i in data) {

            /*if (data[i].is_enable == 0) {
                className = 'vouchers-content-gq';
            } else if (data[i].is_enable == 1) {  
                className = 'vouchers-content';
            }*/

            // is_judge == 1 的时候根据应付金额进行最低消费判断
            if (is_judge == 1) {
                if (moneysPro < data[i].low_consume) {
                    continue;
                }
            }

            content += '<nav class="vouchers-content" is-enable="'+data[i].is_enable+'" record-id="'+data[i].record_id+'">'+
                            '<div class="'+(data[i].is_check == 0 ? '' : 'vorchers-check')+'" data-type="isNO"></div>'+
                            '<div class="vouchers-left">'+
                                '<div class="vorchers-explain-title">'+data[i].voucher_name+'</div>'+
                                '<div class="vorchers-explain-futitle">满'+parseInt(data[i].low_consume)+'元使用</br>'+data[i].shop_info+'</div>'+
                            '</div>'+
                            '<div class="vouchers-right">'+
                                '<div class="vorchers-right-title">'+
                                     '<span></span>'+
                                     '<b data-type="voucherMoney">'+parseInt(data[i].voucher_money)+'</b>'+
                                '</div>'+
                                '<div class="vorchers-right-futitle">'+getLocalDate(data[i].start_time)+
                                    '<p>-</p>'+
                                    '<p>'+getLocalDate(data[i].end_time)+'</p>'+
                                '</div>'+
                            '</div>'+
                            (data[i].is_enable == 1 ? '' :
                            '<div class="overdata-unavailable"></div>')+
                        '</nav>';
        }

        $('#voucherList').html(content);
    }

    // 校验输入数字 num 0：整数  1：非整数
    function checkNum(name , num) {
        var self = this;
        var num1 = $('#'+name).val();
        //正则表达式验证必须为数字或者两位小数
         var numPro = /^\d*\.{0,1}\d{0,2}$/;
         if (num == 0) {
            numPro = /^\d*$/;
         } else {
            numPro = /^\d*\.{0,1}\d{0,2}$/;
         }
        //查找输入字符第一个为0
        var resultle = num1.substr(0,1);
        var result2 = num1.substr(1,1);
        if(numPro.test(num1)){
            if(resultle == 0 && num1.length > 1 && result2 != '.'){
                //替换0为空
                $('#'+name).val(num1.replace(/0/,""));
                if(num1.substr(0,1) == '.'){
                    $('#'+name).val(0);
                }
            }
            if (num1 == '') {
                $('#'+name).val(0);
            }
            // 生成当前选择的支付方案，提交检查冲突，之后在计算金额
            generate_choice_submit('');
        }else{
            $('#'+name).val(0);
            // 生成当前选择的支付方案，提交检查冲突，之后在计算金额
            generate_choice_submit('');
        }
    }

    // 计算金额
    function calculationAmount(isUseLe, isUseVoucher, isUseDiscount, menu_money_info) {
        /*var menu_money_info = {
            'consumes'          :   '0',    //消费金额汇总
            'sub_user_price'    :   '0',    //会员价优惠
            'sub_user_discount' :   '0',    //会员折扣优惠
            'sub_user'          :   '0',    //会员优惠
            'sub_money'         :   '0',    //银台折扣
            'pay_sub_moneys'    :   '0',    //优惠金额汇总
            'pay_moneys'        :   '0'     //实收金额汇总                
        };*/

        ch_menu_money_info = dishesStackHandle(menu_money_info, ch_menu_money_info);

        // 会员价 = 消费金额 - 会员价优惠
        var sub_user_price = parseFloat(accSubtr(menu_money_info.consumes, menu_money_info.sub_user_price)).toFixed(2)
        $('#memberPrice').text(sub_user_price);
        // 已优惠页面显示
        if(menu_money_info.pay_sub_moneys == 0){
            $('#preferentialPrice').parent('p').addClass('hide')
            $('.order-footer-preferential .order-footer-small p').css('height','50px')
            $('.order-footer-preferential .order-footer-small p').css('line-height','50px')
        }else{
            $('#preferentialPrice').parent('p').removeClass('hide')
            $('#preferentialPrice').text(parseFloat(menu_money_info.pay_sub_moneys).toFixed(2));
        }
        // 会员价优惠
        if(menu_money_info.sub_user_price == 0){
            $('#userPriceDispled').addClass('hide');
            $('#sub_user_price').text(parseFloat(0).toFixed(2));
        } else {
            $('#userPriceDispled').removeClass('hide');
            $('#sub_user_price').text(parseFloat(menu_money_info.sub_user_price).toFixed(2));
        }
        // 会员折扣优惠
        if(menu_money_info.sub_user_discount == 0){
            $('#userDiscountDispled').addClass('hide');
            $('#sub_user_discount').text(parseFloat(0).toFixed(2));
        } else {
            $('#userDiscountDispled').removeClass('hide');
            $('#sub_user_discount').text(parseFloat(menu_money_info.sub_user_discount).toFixed(2));
        }
        //银台折扣
        if(menu_money_info.sub_money == 0 && conflict_pay_info['promo_id'] == ''){
            $('#sub_money').addClass('hide');
            $('#tableDiscount').text(parseFloat(0).toFixed(2));
        }else{
            $('#sub_money').removeClass('hide');
            $('#tableDiscount').text(parseFloat(menu_money_info.sub_money).toFixed(2));
        }
        // app考虑退款的情况，比如下了100的单付了50 退了20的菜，APP打开应付金额应该是100-50+20，应付金额要是70
        // 应付金额 = 实收金额汇总 - 已付乐币 - 已付抵用劵 - 已付微信 - 已付现金 - 已付银行卡 - 已付自定义支付
        var moneysPro = accSubtr(accSubtr(accSubtr(accSubtr(accSubtr(accSubtr(accSubtr(menu_money_info.pay_moneys, payorderInfo.pay_info['stored']), payorderInfo.pay_info['voucher']), payorderInfo.pay_info['wxpay']), payorderInfo.pay_info['alipay']), payorderInfo.pay_info['cash']), payorderInfo.pay_info['card']), payorderInfo.pay_info['other']);
        // 上面减完在加上 退款乐币、抵用劵、微信
        moneysPro = accAdd(accAdd(accAdd(accAdd(moneysPro, payorderInfo.pay_info['re_stored']), payorderInfo.pay_info['re_voucher']), payorderInfo.pay_info['re_wxpay']),payorderInfo.pay_info['re_alipay']);

        // 应付金额
        $('#copeWithPay').text(parseFloat(moneysPro).toFixed(2));
        // 实付金额页面显示
        $('#realPay').text(parseFloat(moneysPro).toFixed(2));

        if (isVoucher == true) {
            // 使用应付金额判断所有可用抵用劵最低消费是否满足，满足的使用，不满足的不使用
            var low_1 = 0;
            for (var t in payorderInfo.user_voucher.voucher_list) {
                if (t == canuseRecordId) {
                    low_1 = payorderInfo.user_voucher.voucher_list[t].low_consume;
                }
            }
            if (moneysPro < low_1) {
                var voucher_rb = payorderInfo.user_voucher.voucher_list;
                var vou_mon = 0;
                var vou_id = '';
                for (var i in voucher_rb) {
                    if (moneysPro >= voucher_rb[i].low_consume) {
                        if (voucher_rb[i].voucher_money > vou_mon) {
                            vou_mon = voucher_rb[i].voucher_money;
                            vou_id = voucher_rb[i].record_id;
                        }
                    }
                }
                canuseVouchePrice = vou_mon;
                canuseRecordId = vou_id;
                $('#voucher').text(vou_mon);
                $('#voucher').attr('record-id', vou_id);
            }
            
            // 判断可用抵用劵，重新填充抵用劵列表
            voucherList(payorderInfo.user_voucher.voucher_list, 1, moneysPro);
        }

        // 判断如果应付金额<=0 说明可能是下了一个单支付了然后银台抛弃了用户在追单过来变成负数就不可以在使用乐币抵用劵付钱了
        if (moneysPro <= 0) {
            isVoucher = false;
            isUseVoucher = false;
            $('#clickVouch').addClass('setBg');
            $('#isVoucher').removeClass('gouCurrent');
            isLecoin = false;
            isWxpay = false;
            isAlipay = false;
            $('#isLecoin').removeClass('gouCurrent');
            $('#clickUseLe').addClass('setCol');
            $('#stored').addClass('setCol')
            $('#stored').val(0)
            $('#stored').prop('readonly', true);
            $('#isWxpay').removeClass('gouCurrent');
            $('#wxpay').addClass('setCol');
            $('#wxpay').prop('readonly', true);
            $('#isAlipay').removeClass('gouCurrent');
            $('#alipay').addClass('setCol');
            $('#alipay').prop('readonly', true);
        }

        // 微信输入金额
        wxpay = $('#wxpay').val();
        var wxpaydian = wxpay;
        wxpay = parseFloat(wxpay);

        alipay = $('#alipay').val();
        var alipaydian = alipay;
        alipay = parseFloat(alipay);

        var lepay_m = $('#stored').val();
        var lebidina = lepay_m;
        lepay_m = parseFloat(lepay_m);

        // 会员优惠 = 会员价优惠 + 会员折扣优惠
        preferentialPrice = menu_money_info.sub_user;
        // 实付金额 = 消费金额 - 优惠金额汇总
        trueTotalConsumption = moneysPro;

        // 是否选择了抵用劵
        if (isVoucher == true) {//calculationPrice
            // 是否选择了使用抵用劵（抵用劵金额）canuseVouchePrice
            vouchersPrice = canuseVouchePrice;
            // 是否选择了使用抵用劵（抵用劵id）canuseRecordId
            recordId = canuseRecordId;
            // 优惠金额 = 抵用劵金额
            //preferentialPrice = vouchersPrice;
        } else {
            // 没有选择抵用劵，这三个金额都是0
            vouchersPrice = 0;
            recordId = '';
            //preferentialPrice = 0;
        }
        // 是否可以使用抵用劵，如果可以使用抵用劵
        if (isUseVoucher == true) {
            // 抵用劵id填充
            $('#voucher').attr('record-id', recordId);
            // 抵用劵页面显示金额
            $('#voucher').text(vouchersPrice);
        }

        // 应付金额 = 实付金额 - 抵用劵金额
        trueTotalConsumption = parseFloat(accSubtr(trueTotalConsumption, vouchersPrice));

        // 应付金额小于0，那么应付金额就等于0
        if (trueTotalConsumption < 0) {
            vouchersPrice = moneysPro;
            
            trueTotalConsumption = 0;
        }

        //is_load = 0;// 是否第一次加载(刷新也算)0 否 1 是
        var is_load_p = 1;

        // 是否选择了乐币
        if (isLecoin == true) {
            if (is_load == 1) {
                lebidina = trueTotalConsumption;
                leAmount = trueTotalConsumption;
                is_load_p = 0;
            } else {
                leAmount = lepay_m;
                // 乐币输入的金额 > 乐币应该支付的金额 并且 乐币应该支付的金额 <= 乐币余额
                if (leAmount > trueTotalConsumption && trueTotalConsumption <= leMoney) {
                    leAmount = trueTotalConsumption;
                    lebidina = trueTotalConsumption;
                }
            }
        } else {
            leAmount = 0;
        }

        // 如果乐币需要支付的金额 > 乐币余额
        if (leAmount > leMoney) {
            leAmount = leMoney;
            lebidina = leMoney;
        }

        // 是否选择了微信
        if (isWxpay == true) {
            if (is_load == 1 || is_load == 2) {
                wxpaydian = parseFloat(accSubtr(trueTotalConsumption, leAmount));
                wxpay = parseFloat(accSubtr(trueTotalConsumption, leAmount));
                is_load_p = 0;
            }
        } else {
            wxpay = 0;
        }

        if (isAlipay == true) {
            if (is_load == 1 || is_load == 2) {
                alipaydian = parseFloat(accSubtr(trueTotalConsumption, leAmount));
                alipay = parseFloat(accSubtr(trueTotalConsumption, leAmount));
                is_load_p = 0;
            }
        } else {
            alipay = 0;
        }

        // 赋值 避免出现"冲突"问题
        lepay = leAmount;
        if (is_load_p == 0) {
            is_load = 0;
        }

        // 应付金额不是0并且大于0，剩余的应付金额赋值给银台金额
        if (trueTotalConsumption != 0 && trueTotalConsumption > 0) {

            /*// 如果应付金额 大于乐币余额 leMoney 乐币余额
            if (trueTotalConsumption > leMoney || isLecoin == false) {*/

                // shop_type_info 0 桌台模式  1叫号 2台卡
                // 是桌台模式 并且 （浏览器打开 或者 没有选中微信支付）
                if (shop_type_info == 0 && (yesNoWxPay == false || isWxpay == false || yesNoAliPay == false || isAlipay == false)) {
                    if(isWxpay == true){
                        cashier = parseFloat(accSubtr(accSubtr(trueTotalConsumption, leAmount), wxpay));

                        // 如果银台支付金额小于0，那就说明微信支付金额输入的超过实付金额了
                        if (cashier < 0) {
                            cashier = 0;

                            wxpay = parseFloat(accSubtr(trueTotalConsumption, leAmount));
                            $('#wxpay').val(parseFloat(wxpay));
                        }
                    }else if(isAlipay == true){
                        cashier = parseFloat(accSubtr(accSubtr(trueTotalConsumption, leAmount), alipay));
                        // 如果银台支付金额小于0，那就说明支付宝支付金额输入的超过实付金额了
                        if (cashier < 0) {
                            cashier = 0;
                            alipay = parseFloat(accSubtr(trueTotalConsumption, leAmount));
                            $('#alipay').val(parseFloat(alipay));
                        }
                    }else{
                        cashier = parseFloat(accSubtr(trueTotalConsumption, leAmount));
                        if (cashier < 0) {
                            cashier = 0;
                        }
                    }
                    // 把银台支付金额显示出来
                    $('#cashierDisplay').removeClass('hide');
                } else {
                    trueTotalConsumption = parseFloat(accSubtr(trueTotalConsumption, leAmount));
                    if ((trueTotalConsumption > wxpay) || (trueTotalConsumption > alipay)) {
                        // 把微信支付金额显示出来
                        if (shop_type_info == 0 && isWxpay == true) {
                            // 银台支付金额 = 应付金额 - 微信金额
                            cashier = parseFloat(accSubtr(trueTotalConsumption, wxpay));
                            // 如果银台支付金额小于0，那就说明微信支付金额输入的超过实付金额了
                            if (cashier <= 0) {
                                cashier = 0;
                                wxpay = trueTotalConsumption;
                            }
                            // 把银台支付金额显示出来
                            $('#cashierDisplay').removeClass('hide');
                        }else if(shop_type_info == 0 && isAlipay == true){
                            // 银台支付金额 = 应付金额 - 支付宝金额
                            cashier = parseFloat(accSubtr(trueTotalConsumption, alipay));
                            // 如果银台支付金额小于0，那就说明支付宝支付金额输入的超过实付金额了
                            if (cashier <= 0) {
                                cashier = 0;
                                alipay = trueTotalConsumption;
                            }
                            // 把银台支付金额显示出来
                            $('#cashierDisplay').removeClass('hide');
                        }
                    } else {
                        if(isWxpay == true){
                            wxpay = trueTotalConsumption;
                            wxpaydian = trueTotalConsumption;
                        }else if(isAlipay == true){
                            alipay = trueTotalConsumption;
                            alipaydian = trueTotalConsumption;
                        }
                    }
                    if(isWxpay == true){
                        cashier = parseFloat(accSubtr(trueTotalConsumption, wxpay));
                    }else{
                        cashier = parseFloat(accSubtr(trueTotalConsumption, alipay));
                    }
                }
            /*} else {
                // 应付金额小于0，那么乐币金额就等于0
                if (trueTotalConsumption < 0) {
                    leAmount = 0;
                } else {
                    // 乐币金额 = 应付金额
                    leAmount = trueTotalConsumption;
                }

                // 银台应付金额为0
                cashier = 0;
                wxpay = 0;
                $('#wxpay').val(0);
                // 把微信支付金额隐藏出来
                $('#wxpayDisplay').addClass('hide');
                // 把银台支付金额隐藏出来
                $('#cashierDisplay').addClass('hide');
            }*/
        } else {
            cashier = 0;
        }
        // 如果银台值金额 == 0 隐藏
        if (cashier == 0) {
            // 把银台支付金额隐藏出来
            $('#cashierDisplay').addClass('hide');
        }

        if (wxpay == 0 && isWxpay == true) {
            $('#wxpayDisplay').addClass('hide');
        } else {
            $('#wxpayDisplay').removeClass('hide');
        }

        if (alipay == 0 && isAlipay == true) {
            $('#alipayDisplay').addClass('hide');
        } else {
            $('#alipayDisplay').removeClass('hide');
        }

        // 乐币金额
        if (lebidina != 0) {
            $('#stored').val(lebidina);
        } else {
            $('#stored').val(parseFloat(leAmount));
        }

        // 如果是桌台模式 才赋值到页面
        if (shop_type_info == 0) {
            // 银台支付金额
            $('#cashier').text(parseFloat(cashier).toFixed(2));
        }

        // 判断如果应付金额<=0 说明可能是下了一个单支付了然后银台抛弃了用户在追单过来变成负数就不可以在使用乐币抵用劵付钱了
        if (moneysPro <= 0) {
            $('#selectVouch,#UseLe').addClass('hide');
        }
    }

    // 选择抵用劵
    function selectVoucher() {
        var _self = this;

        // 是否可以使用抵用劵，如果可以使用抵用劵就弹出框
        if (isUseVoucher == true) {
            $('#choice_vourcher').removeClass('hide');

            displayAlertMessage('#choice_vourcher', '');

            $('#voucherList').delegate('nav', 'click', function() {
                var self = this,
                recordsId = $(self).attr('record-id'),
                isEnable = $(self).attr('is-enable');//0灰色不可点，1可用

                if (isEnable == 0) {
                    clicknum = 1 ; //点击确定按钮可用
                    return;
                } else {
                    var voucherMoney = $(self).find('b[data-type="voucherMoney"]').text();
                    // 选中当前的，取消其他的选中
                    $(this).find('div[data-type="isNO"]').addClass('vorchers-check').end()
                    .siblings('nav').find('div[data-type="isNO"]').removeClass('vorchers-check');
                    //alert(recordsId);
                    //alert(voucherMoney);
                    // 抵用劵id
                    recordId = recordsId;
                    // 是否选择了使用抵用劵（抵用劵id）
                    canuseRecordId = recordsId;
                    // 抵用劵金额
                    vouchersPrice = voucherMoney;
                    // 是否选择了使用抵用劵（抵用劵金额）
                    canuseVouchePrice = voucherMoney;
                    // 关闭弹出层
                    layer.close(layerBox);
                    // 计算金额
                    // 生成当前选择的支付方案，提交检查冲突，之后在计算金额
                    generate_choice_submit('');
                }
            });
        }

        // 点击选择抵用劵左上角返回
        $('#returnPayorder').unbind('click').bind('click', function () {
            // 关闭弹出层
            layer.close(layerBox);
        });
    }

    // 订单支付
    function orderPay() {
        // is_cashier_pay 是否授权收银员支付储值 1授权 0未授权
        if (is_cashier_pay == 0 && is_pay_mode == 1) {
            if ($('#author_code_input').val() == '') {
                displayMsg(ndPromptMsg, '请输入授权验证码，在继续操作！', 2000);
                clicknum = 1 ; //点击按钮可用
                return;
            }
        }

        // 如果选中了折扣样式，并且选择了折扣，并且可以使用折扣
        if (conflict_pay_info['discount_rate'] != 100 && isDiscount == true && isUseDiscount == true) {
            // 就把乐币支付金额清零
            leAmount = '0.00';
            // 抵用劵id清空
            recordId = '';
        } else {// 否则的话就设置折扣额度为100
            discountSrice = 100;
        }

        // 判断是扫描过来的，并且是扫描的结账单二维码
        orderScanOrderPay();
    }

    // 扫描过来的结账单进行支付
    function orderScanOrderPay() {
        //乐币输入金额
        var storedd = $('#stored').val();
        //微信输入的金额
        var wxppay = $('#wxpay').val();
        var alippay = $('#alipay').val();

        // 点了下单（稍候支付）乐币抵用劵微信全部赋值给银台支付
        var storedwait = 0,voucherwait = 0,wxpaywait = 0,alipaywait = 0,voucher_ridwait = '',cashierwait = 0;

        storedwait = storedd;
        voucherwait = vouchersPrice;
        wxpaywait = wxppay;
        alipaywait = alippay;
        voucher_ridwait = recordId;
        cashierwait = cashier;

        var pay_moneys = accSubtr(dishesConsume, ch_menu_money_info['pay_sub_moneys']);

        var sms_code = $('#author_code_input').val();

        var data = {
            'card_id': '',                              // 会员卡id
            'openid': '',
            'sms_code': sms_code,
            'stored_type': is_pay_mode,
            'card_barcode': payorderInfo.user_account.card_barcode,
            'card_no': payorderInfo.user_account.card_no,
            'user_id': payorderInfo.user_id,
            'user_mobile': phone_input_pay,
            'pay_id': payorderInfo.pay_id,                      // 结账id
            'trade_type': 'JSAPI',
            'voucher':parseFloat(voucherwait).toFixed(2),
            'is_member_price': conflict_pay_info['is_member_price'],
            'promo_id': conflict_pay_info['promo_id'],
            'promo': conflict_pay_info['promo'],
            'pay_sub_moneys': parseFloat(ch_menu_money_info['pay_sub_moneys']).toFixed(2),// 优惠金额汇总
            'pay_moneys': parseFloat(pay_moneys).toFixed(2),// 实收金额汇总
            'consumes': parseFloat(dishesConsume).toFixed(2),// 订单消费金额
            'discount_rate': discountSrice,                 // 折扣额度
            'money': parseFloat(trueTotalConsumption).toFixed(2),// 实收金额（折后金额）
            'stored': parseFloat(storedwait).toFixed(2),        // 储值账户（乐币）支付金额
            'voucher_rid': voucher_ridwait,                     // 抵用劵账户支付金额
            'cashier': parseFloat(cashierwait).toFixed(2),      // 收银台支付金额
            'wxpay': parseFloat(0).toFixed(2),          // 微信支付金额
            'alipay': parseFloat(0).toFixed(2),         
            'cid': $.cookie('cid')
        };

        setAjax(AdminUrl.orderPay, data, $('#prompt-message'), {20: ''}, function(respnoseText) {
            if (respnoseText.code == 200214 || respnoseText.code == 200213 || respnoseText.code == 200210) {
                // 得到返回数据
                var data = respnoseText.data;
                displayMsg(ndPromptMsg, '储值支付成功！如果收银台尚未更新支付数据，请等待几秒后刷新。。', 2000, function () {
                    $.cookie('storedPay_1', 1, {path:'/html',domain:'.lekabao.net'});
                    // 区分是不是壳子
                    if ($.cookie('card_shell') == 1) {
                        // 跳转回收银台
                        if(ua.match(/iPad/i)=="ipad") {
                            window.top.location.href='http://cashier.lekabao.net/html/box_ipad.html';
                        } else {
                            // 调用父级iframe
                            window.parent.stored_pay_father();
                            // window.top.location.href='http://cashier.lekabao.net/html/box.html';
                        }
                    } else {
                        window.top.location.href='http://cashier.lekabao.net/html/dishes.html';
                    }
                });
                clicknum = 1 ;//点击可以确定支付
            } else {
                displayMsg(ndPromptMsg, respnoseText.message, 2000);
                clicknum = 1 ;//点击可以确定支付
            }
        }, 0);
    }

    // 生成当前选择的支付方案，提交检查冲突 // is_dis=1 是否点了取消会员折扣
    function generate_choice_submit(is_member_price, is_member_discount, is_dis, is_type_t) {

        if (is_member_price === '') {
            // conflict_pay_info 支付信息
            is_member_price = conflict_pay_info['is_member_price'];
        }

        // 先赋值原始数据 conflict_pay_info 支付信息
        var u_pay_info = dishesStackHandle(conflict_pay_info, u_pay_info);
        // 赋值改变的数据
        /*var stored = $('#stored').val();      //乐币
        var wxpay = $('#wxpay').val();          //微信*/

        // 是否使用会员价 0 否 1 是
        u_pay_info['is_member_price'] = is_member_price;

        // 是否使用会员折扣 is_member_discount 0 不支持 1 支持
        if (is_member_discount == 1) {
            u_pay_info['discount_rate'] = payorderInfo.user_account.discount_rate;
        } else if (is_member_discount === 0) {
            u_pay_info['discount_rate'] = 100;
        }

        // 出现问题，当选中会员折扣的时候，因为和优惠方案有冲突，所以会取消优惠方案，再取消选中会员折扣的时候，和优惠方案没有冲突但是没有在选中优惠方案，所以提交支付的时候会报错，无冲突不能取消银台优惠方案
        if (is_type_t != 8 && payorderInfo.pay_info.promo_id != '' &&

            ((payorderInfo.pay_info.promo.pay_type['ct0000000003'] == 0 && lepay == 0) || payorderInfo.pay_info.promo.pay_type['ct0000000003'] != 0) &&
            ((payorderInfo.pay_info.promo.pay_type['ct0000000004'] == 0 && vouchersPrice == 0) || payorderInfo.pay_info.promo.pay_type['ct0000000004'] != 0) &&
            ((payorderInfo.pay_info.promo.pay_type['ct0000000005'] == 0 && wxpay == 0) || payorderInfo.pay_info.promo.pay_type['ct0000000005'] != 0) &&
            ((payorderInfo.pay_info.promo.pay_type['ct0000000006'] == 0 && alipay == 0) || payorderInfo.pay_info.promo.pay_type['ct0000000006'] != 0) 
            &&
        (
            (payorderInfo.pay_info.promo.is_member_discount == 0 && u_pay_info['discount_rate'] == 100 && payorderInfo.pay_info.promo.is_member_price == 1) || 
            (payorderInfo.pay_info.promo.is_member_price == 0 && u_pay_info['is_member_price'] == 0 && payorderInfo.pay_info.promo.is_member_discount == 1) || 
            (payorderInfo.pay_info.promo.is_member_discount == 1 && payorderInfo.pay_info.promo.is_member_price == 1) ||
            (u_pay_info['discount_rate'] == 100 && u_pay_info['is_member_price'] == 0) || 
            (u_pay_info['discount_rate'] == 100 && payorderInfo.pay_info.promo.is_member_price == 0 && is_dis == 1)

        )) {
            if (u_pay_info['discount_rate'] == 100 && payorderInfo.pay_info.promo.is_member_price == 0 && is_dis == 1) {
                u_pay_info['is_member_price'] = 0;
            }
            conflict_pay_info['promo_id'] = payorderInfo['pay_info']['promo_id']; 
            conflict_pay_info['promo'] = dishesStackHandle(payorderInfo['pay_info']['promo'], conflict_pay_info['promo']);
            //alert(u_pay_info['promo']['pay_type']['all'])
        }

        // 常规支付方式（乐币、抵用劵、微信）
        u_pay_info['stored'] = lepay;
        u_pay_info['voucher'] = vouchersPrice;
        u_pay_info['wxpay'] = wxpay;
        u_pay_info['alipay'] = alipay;

        //return u_pay_info;
        // 解决所有冲突
        check_pay_temp_user(u_pay_info);

    }
    /**
     *  检查支付方案：用户端，处理所有冲突
     *  u_pay_info：用户提交的支付方案
     *  order_info：用户的订单信息
     **/
    function check_pay_temp_user(u_pay_info, order_info) {
        var self = this;

        //获取当前的支付信息
        var u_pay_temp          = dishesStackHandle(conflict_pay_info, u_pay_temp);
        //获取支付方式信息: 1现金 2银行卡 3乐币 4抵用券 5微信
        var pay_type_info_re    = dishesStackHandle(payorderInfo.pay_type, pay_type_info_re);
        //校验后的支付信息：u_pay_info + u_pay_temp
        var pay_info_check      = dishesStackHandle(u_pay_temp, pay_info_check);

        //加入用户账户信息
        pay_info_check['user_account'] = dishesStackHandle(payorderInfo.user_account, pay_info_check['user_account']);

        //支付方式整理：只需要校验u_pay_info中有金额的，pay_info_check忽略
        pay_info_check['pay_type']  = {};
        if (u_pay_info['stored'] != 0) {
            pay_info_check['pay_type']['ct0000000003'] = _format_pay_type('ct0000000003', u_pay_info['stored'], u_pay_info['principal'], pay_type_info_re);
            pay_info_check['stored']    = parseFloat(accAdd(pay_info_check['stored'], u_pay_info['stored'])).toFixed(2);
        }
        if (u_pay_info['voucher'] != 0) {
            pay_info_check['pay_type']['ct0000000004'] = _format_pay_type('ct0000000004', '0', u_pay_info['voucher'], pay_type_info_re);
            pay_info_check['voucher']   = parseFloat(accAdd(pay_info_check['voucher'], u_pay_info['voucher'])).toFixed(2);
        }
        if (u_pay_info['wxpay'] != 0) {
            pay_info_check['pay_type']['ct0000000005'] = _format_pay_type('ct0000000005', u_pay_info['wxpay'], '0', pay_type_info_re);
            pay_info_check['wxpay'] = parseFloat(accAdd(pay_info_check['wxpay'], u_pay_info['wxpay'])).toFixed(2);
        }
        
        if (u_pay_info['alipay'] != 0) {
            pay_info_check['pay_type']['ct0000000005'] = _format_pay_type('ct0000000005', u_pay_info['alipay'], '0', pay_type_info_re);
            pay_info_check['alipay']    = parseFloat(accAdd(pay_info_check['alipay'], u_pay_info['alipay'])).toFixed(2);
        }
        
        //优惠方案与支付方式处理
        var check_member_price_pay_type         = _check_member_price_pay_type(pay_info_check['pay_type'], pay_type_info_re);
        var check_member_discount_pay_type      = _check_member_discount_pay_type(pay_info_check['pay_type'], pay_type_info_re);
        var check_promo_info_pay_type           = true;
        u_pay_info['promo'] = {};
        pay_info_check['low_consumption'] = '0';
        if (u_pay_info['promo_id'] != ''){

            if (u_pay_info['promo_id'] == pay_info_check['promo_id']) {
                u_pay_info['promo'] = payorderInfo.pay_info['promo'];//pay_info_check['promo']
            }

            check_promo_info_pay_type = _check_promo_info_pay_type(u_pay_info['promo']['pay_type'], pay_info_check['pay_type']);
            pay_info_check['low_consumption'] = parseFloat(accAdd(pay_info_check['low_consumption'], ((check_promo_info_pay_type === false) ? '0' : check_promo_info_pay_type))).toFixed(2);
        }

        //存在支付记录
        // 是否支付过， isHasPay = false 没有支付过， isHasPay = true 支付过
        if (

            (payorderInfo['pay_info']['cash']       != 0 || 
            payorderInfo['pay_info']['card']        != 0 || 
            payorderInfo['pay_info']['other']       != 0 || 
            payorderInfo['pay_info']['wxpay']       != 0 || 
            payorderInfo['pay_info']['wxpay_temp']  != 0 ||
            payorderInfo['pay_info']['alipay']      != 0 || 
            payorderInfo['pay_info']['alipay_temp'] != 0 ||
            payorderInfo['pay_info']['stored']      != 0 ||
            payorderInfo['pay_info']['voucher']     != 0) &&

            (
                payorderInfo.pay_info.promo_id == '' || 
                (payorderInfo.pay_info.promo_id != '' && payorderInfo.pay_info.promo.discount_amount != 100)
            )

            ) {

            //提交的优惠方式与之前的不符，不能变更预结账方案
            if (u_pay_info['discount_rate']     != u_pay_temp['discount_rate'] ||
                u_pay_info['is_member_price']   != u_pay_temp['is_member_price'] ||
                u_pay_info['promo_id']          != u_pay_temp['promo_id']) {
                Message.show('#msg', '已经支付过的订单，不能再变更优惠方式！', 2000);
                if (u_pay_temp['is_member_price'] == 1) {
                    // 选中会员价
                    $('#isMember').addClass('gouCurrent');
                    // 是否选择了会员价，为true
                    isMember = true;
                } else {
                    // 选中会员价
                    $('#isMember').removeClass('gouCurrent');
                    // 是否选择了会员价，为true
                    isMember = false;
                }
                if (u_pay_temp['discount_rate'] != 100) {
                    // 选中会员折扣
                    $('#isDiscount').removeClass('gouCurrent');
                    // 是否选择了会员折扣，为true
                    isDiscount = false;
                } else {
                    // 选中会员折扣
                    $('#isDiscount').removeClass('gouCurrent');
                    // 是否选择了会员折扣，为true
                    isDiscount = false;
                }

                conflict_pay_info['discount_rate'] = u_pay_temp['discount_rate'];

                conflict_pay_info['promo_id'] = u_pay_temp['promo_id'];
                conflict_pay_info['promo'] = u_pay_temp['promo'];

                // 生成当前选择的支付方案，提交检查冲突，之后在计算金额
                generate_choice_submit(u_pay_temp['is_member_price']);
                clicknum = 1 ; //点击确定按钮可用
                return;
            }

            //不改变优惠方案的前提下，只有做支付方式的判断。
            
            //会员价与支付方式判断
            /*if (u_pay_info['is_member_price'] != 0 && check_member_price_pay_type === false) {
                Message.show('#msg', '支付方式与会员价冲突！', 2000);
                //conflict_layder()
                return;
            }

            //会员折扣与支付方式判断
            if (u_pay_info['discount_rate'] != '100' && check_member_discount_pay_type === false) {
                Message.show('#msg', '支付方式与会员折扣冲突！', 2000);
                //conflict_layder()
                return;
            }

            //银台优惠与支付方式判断
            if (u_pay_info['promo_id'] != '' && check_promo_info_pay_type === false) {
                Message.show('#msg', '支付方式与优惠方案冲突！', 2000);
                return;
            }*/
        } else {

            //银台折扣方案变更判断
            /*if (u_pay_info['promo_id'] != pay_info_check['promo_id']) {

                //提交的非空，或者是本来为空
                if (u_pay_info['promo_id'] != '' || pay_info_check['promo_id'] == '') {
                    Message.show('#msg', '不能变更银台折扣方案！', 2000);
                    return;
                }

                //优惠方案与 会员价 或 会员折扣 或 支付方式 没有冲突不能取消
                if (check_promo_info_pay_type !== false &&
                    (u_pay_info['is_member_price'] == 0 || pay_info_check['promo']['is_member_price'] == '2') &&
                    (u_pay_info['discount_rate'] == '100' || pay_info_check['promo']['is_member_discount'] == '2')) {
                    Message.show('#msg', '无冲突不能取消银台折扣方案！', 2000);
                    return;
                }

                //优惠方案信息
                pay_info_check['promo_id']  = '';
                pay_info_check['promo'] = {};
                pay_info_check['a_user_id']= '';
            }*/

            //会员价判断
            if (u_pay_info['is_member_price'] != pay_info_check['is_member_price']) {
                
                if (u_pay_info['is_member_price'] == 0) {

                    //不做资格判断，无冲突应以之前的为准。

                    //无会员折扣或无冲突 且 无银台优惠或无冲突 且 无支付方式冲突
                    if (check_member_price_pay_type != false &&
                        (u_pay_info['discount_rate'] == '100' || pay_info_check['is_member_price_discount'] != '0') &&
                        (pay_info_check['promo_id'] == '' || pay_info_check['promo']['is_member_price'] != 0)) {
                        Message.show('#msg', '无冲突不能取消会员价！', 2000);
                        // 选中会员价
                        $('#isMember').addClass('gouCurrent');
                        // 是否选择了会员价，为true
                        isMember = true;
                        // 生成当前选择的支付方案，提交检查冲突，之后在计算金额
                        generate_choice_submit(1);
                        clicknum = 1; //点击按钮可用
                        return;
                    }
                } else {

                    //无会员价使用资格 或 有会员折扣且有冲突 或 有银台优惠且有冲突 或 有支付方式冲突
                    if (pay_info_check['user_account']['is_member_price'] == 0 && pay_info_check[
                    'member_price_cashier'] != '' && pay_info_check['is_member_price'] == 0){
                        //是否支持会员价 理论上不会走到这里，因为加载数据的时候有判断
                        Message.show('#msg', '不支持会员价！', 2000);
                        clicknum = 1; //点击按钮可用
                        return;
                    } else if (check_member_price_pay_type === false ) {
                        // 提示消息
                        var ma_1 = '';
                        // 是否有乐币抵用劵选中 0 否 1 是
                        var ct_3 = 0;
                        var ct_4 = 0;
                        // 乐币抵用劵是否支持会员价 0 否 1 是
                        var is_3 = 0;
                        var is_4 = 0;

                        for (var i in pay_info_check['pay_type']) {
                            if ('ct0000000003' == i) {
                                ct_3 = 1;
                            }
                            if ('ct0000000004' == i) {
                                ct_4 = 1;
                            }
                            if (pay_info_check['pay_type'][i].pay_type_id != '' && pay_type_info_re['ct0000000003']['is_member_price'] == 1) {
                                is_3 = 1;
                            }
                            if (pay_info_check['pay_type'][i].pay_type_id != '' && pay_type_info_re['ct0000000004']['is_member_price'] == 1) {
                                is_3 = 1;
                            }
                        }
                        if (ct_3 == 1 && ct_4 == 1 && is_3 == 0 && is_4 == 0) {
                            ma_1 = '会员价与乐币、抵用券冲突！';
                        } else if (ct_3 == 1 && is_3 == 0 && (ct_4 == 0 || is_4 == 1)) {
                            ma_1 = '会员价与乐币冲突！';
                        } else {
                            ma_1 = '会员价与抵用券冲突！';
                        }

                        conflict_layder(ma_1, '会员价', 1, u_pay_temp, u_pay_info);
                        clicknum = 1; //点击按钮可用
                        return;
                    } else if (u_pay_info['discount_rate'] != '100' && pay_info_check['is_member_price_discount'] == 0) {
                        conflict_layder('会员价与会员折扣有冲突！', '会员价', 2, u_pay_temp, u_pay_info);
                        clicknum = 1; //点击按钮可用
                        return;
                    } else if (pay_info_check['promo_id'] != '' && pay_info_check['promo']['is_member_price'] == 0) {
                        conflict_layder('会员价与银台优惠有冲突！', '会员价', 3, u_pay_temp, u_pay_info);
                        clicknum = 1; //点击按钮可用
                        return;
                    }
                }
                pay_info_check['is_member_price'] = u_pay_info['is_member_price'];
            }

            //会员折扣判断
            if (u_pay_info['discount_rate'] != pay_info_check['discount_rate'] || u_pay_info['promo_id'] != '') {

                if (u_pay_info['discount_rate'] == '100') {
                    //不做资格判断，无冲突应以之前的为准。

                    //无会员折扣或无冲突 且 无银台优惠或无冲突 且 无支付方式冲突
                    if (check_member_discount_pay_type !== false &&
                        (u_pay_info['is_member_price'] == 0 || pay_info_check['is_member_price_discount'] != 0) &&
                        (u_pay_info['promo_id'] == '' || pay_info_check['promo']['is_member_discount'] != 0)) {
                        Message.show('#msg', '无冲突不能取消会员折扣！', 2000);
                        clicknum = 1; //点击按钮可用
                        return;
                    }
                } else {
                    //无会员折扣使用资格 或 有会员价且有冲突 或 有银台优惠且有冲突 或 有支付方式冲突
                    if (u_pay_info['discount_rate'] != pay_info_check['user_account']['discount_rate']){
                        Message.show('#msg', '不支持会员折扣！', 2000);
                        clicknum = 1; //点击按钮可用
                        return;
                    } else if (check_member_discount_pay_type === false) {
                        // 提示消息
                        var ma_1 = '';
                        var ma_2 = '';
                        // 是否有乐币抵用劵选中 0 否 1 是
                        var ct_3 = 0;
                        var ct_4 = 0;
                        // 乐币抵用劵是否支持会员折扣 0 否 1 是
                        var is_3 = 0;
                        var is_4 = 0;

                        for (var i in pay_info_check['pay_type']) {
                            if ('ct0000000003' == i) {
                                ct_3 = 1;
                            }
                            if ('ct0000000004' == i) {
                                ct_4 = 1;
                            }
                            if (pay_info_check['pay_type'][i].pay_type_id != '' && pay_type_info_re['ct0000000003']['is_member_discount'] == 1) {
                                is_3 = 1;
                            }
                            if (pay_info_check['pay_type'][i].pay_type_id != '' && pay_type_info_re['ct0000000004']['is_member_discount'] == 1) {
                                is_3 = 1;
                            }
                        }
                        if (ct_3 == 1 && ct_4 == 1 && is_3 == 0 && is_4 == 0) {
                            ma_1 = '会员折扣与乐币、抵用券冲突！';
                        } else if (ct_3 == 1 && is_3 == 0 && (ct_4 == 0 || is_4 == 1)) {
                            ma_1 = '会员折扣与乐币冲突！';
                        } else {
                            ma_1 = '会员折扣与抵用券冲突！';
                        }

                        conflict_layder(ma_1, '会员折扣', 4, u_pay_temp, u_pay_info);
                        clicknum = 1; //点击按钮可用
                        return;
                    } else if (u_pay_info['is_member_price'] != 0 && pay_info_check['is_member_price_discount'] == 0) {
                        conflict_layder('会员折扣与会员价有冲突！', '会员折扣', 5, u_pay_temp, u_pay_info);
                        clicknum = 1; //点击按钮可用
                        return;
                    } else if (u_pay_info['promo_id'] != '' && pay_info_check['promo_id'] != '' && pay_info_check['promo']['is_member_discount'] == 0) {
                        conflict_layder('会员折扣与优惠方案有冲突！', '会员折扣', 6, u_pay_temp, u_pay_info);
                        clicknum = 1; //点击按钮可用
                        return;
                    }
                }
                pay_info_check['discount_rate'] = u_pay_info['discount_rate'];
            }

            // 支付方式判断
            var is_payment = 0;// 是否有支付方式 0 否 1 是
            for (var i in pay_info_check['pay_type']) {
                is_payment = 1;
                break;
            }
            // u_pay_temp['pay_type'] !== pay_info_check['pay_type']有可能没用
            if (is_payment == 1 && u_pay_temp['pay_type'] !== pay_info_check['pay_type']) {
                //会员价与支付方式判断
                if (u_pay_info['is_member_price'] != 0 && check_member_price_pay_type === false) {
                    // 提示消息
                    var ma_1 = '';
                    var ma_2 = '';
                    // 是否有乐币抵用劵选中 0 否 1 是
                    var ct_3 = 0;
                    var ct_4 = 0;
                    // 乐币抵用劵是否支持会员价 0 否 1 是
                    var is_3 = 0;
                    var is_4 = 0;

                    for (var i in pay_info_check['pay_type']) {
                        if ('ct0000000003' == i) {
                            ct_3 = 1;
                        }
                        if ('ct0000000004' == i) {
                            ct_4 = 1;
                        }
                        if (pay_info_check['pay_type'][i].pay_type_id != '' && pay_type_info_re['ct0000000003']['is_member_price'] == 1) {
                            is_3 = 1;
                        }
                        if (pay_info_check['pay_type'][i].pay_type_id != '' && pay_type_info_re['ct0000000004']['is_member_price'] == 1) {
                            is_3 = 1;
                        }
                    }
                    if (ct_3 == 1 && ct_4 == 1 && is_3 == 0 && is_4 == 0) {
                        ma_1 = '乐币、抵用券与会员价冲突！';
                        ma_2 = '乐币抵用券';
                    } else if (ct_3 == 1 && is_3 == 0 && (ct_4 == 0 || is_4 == 1)) {
                        ma_1 = '乐币与会员价冲突！';
                        ma_2 = '乐币';
                    } else {
                        ma_1 = '抵用券与会员价冲突！';
                        ma_2 = '抵用券';
                    }

                    // 冲突弹出层
                    conflict_layder(ma_1, ma_2, 7, u_pay_temp, u_pay_info);
                    clicknum = 1; //点击按钮可用
                    return;
                }

                //银台优惠与支付方式判断
                if (u_pay_info['promo_id'] != '' && check_promo_info_pay_type === false) {
                    // 提示消息
                    var ma_1 = '';
                    var ma_2 = '';
                    // 是否有乐币抵用劵选中 0 否 1 是
                    var ct_3 = 0;
                    var ct_4 = 0;
                    // 乐币抵用劵是否支持优惠方案 0 否 1 是
                    var is_3 = 0;
                    var is_4 = 0;

                    for (var i in pay_info_check['pay_type']) {
                        if ('ct0000000003' == i) {
                            ct_3 = 1;
                        }
                        if ('ct0000000004' == i) {
                            ct_4 = 1;
                        }
                    }
                    if (u_pay_info['promo']['pay_type']['all'] != undefined && u_pay_info['promo']['pay_type']['all'] != 0) {
                        is_3 = 1;
                        is_4 = 1;
                    } else if (u_pay_info['promo']['pay_type']['all'] == undefined && u_pay_info['promo']['pay_type']['ct0000000003'] != 0 && u_pay_info['promo']['pay_type']['ct0000000004'] != 0) {
                        is_3 = 1;
                        is_4 = 1;
                    } else if (u_pay_info['promo']['pay_type']['all'] == undefined && u_pay_info['promo']['pay_type']['ct0000000003'] != 0 && u_pay_info['promo']['pay_type']['ct0000000004'] == 0) {
                        is_3 = 1;
                    } else if (u_pay_info['promo']['pay_type']['all'] == undefined && u_pay_info['promo']['pay_type']['ct0000000003'] == 0 && u_pay_info['promo']['pay_type']['ct0000000004'] != 0) {
                        is_4 = 1;
                    }

                    if (ct_3 == 1 && ct_4 == 1 && is_3 == 0 && is_4 == 0) {
                        ma_1 = '乐币、抵用券与优惠方案冲突！';
                        ma_2 = '乐币抵用券';
                    } else if (ct_3 == 1 && is_3 == 0 && (ct_4 == 0 || is_4 == 1)) {
                        ma_1 = '乐币与优惠方案冲突！';
                        ma_2 = '乐币';
                    } else {
                        ma_1 = '抵用券与优惠方案冲突！';
                        ma_2 = '抵用券';
                    }

                    // 冲突弹出层
                    conflict_layder(ma_1, ma_2, 8, u_pay_temp, u_pay_info);
                    clicknum = 1; //点击按钮可用
                    return;
                }

                //会员折扣与支付方式判断
                if (u_pay_info['discount_rate'] != '100' && check_member_discount_pay_type === false) {
                    // 提示消息
                    var ma_1 = '';
                    var ma_2 = '';
                    // 是否有乐币抵用劵选中 0 否 1 是
                    var ct_3 = 0;
                    var ct_4 = 0;
                    // 乐币抵用劵是否支持会员折扣 0 否 1 是
                    var is_3 = 0;
                    var is_4 = 0;

                    for (var i in pay_info_check['pay_type']) {
                        if ('ct0000000003' == i) {
                            ct_3 = 1;
                        }
                        if ('ct0000000004' == i) {
                            ct_4 = 1;
                        }
                        if (pay_info_check['pay_type'][i].pay_type_id != '' && pay_type_info_re['ct0000000003']['is_member_discount'] == 1) {
                            is_3 = 1;
                        }
                        if (pay_info_check['pay_type'][i].pay_type_id != '' && pay_type_info_re['ct0000000004']['is_member_discount'] == 1) {
                            is_3 = 1;
                        }
                    }
                    if (ct_3 == 1 && ct_4 == 1 && is_3 == 0 && is_4 == 0) {
                        ma_1 = '乐币、抵用券与会员折扣冲突！';
                        ma_2 = '乐币抵用券';
                    } else if (ct_3 == 1 && is_3 == 0 && (ct_4 == 0 || is_4 == 1)) {
                        ma_1 = '乐币与会员折扣冲突！';
                        ma_2 = '乐币';
                    } else {
                        ma_1 = '抵用券与会员折扣冲突！';
                        ma_2 = '抵用券';
                    }

                    // 冲突弹出层
                    conflict_layder(ma_1, ma_2, 9, u_pay_temp, u_pay_info);
                    clicknum = 1; //点击按钮可用
                    return;
                }
            }
        }

        //输出数据
        //return pay_info_check;

        // 赋值校验过的支付方案，下次在点击的时候有用
        conflict_pay_info = dishesStackHandle(pay_info_check, conflict_pay_info);
        // 计算优惠金额（ change_tableInfo 可改变内容的所有信息）
        check_sub_moneys(pay_info_check, change_tableInfo);
    }
    /**
     *  冲突弹出层
     *  manage  ：提示消息
     *  choice  ：选择什么冲突（会员价、支付方式、优惠方案）
     *  type    ：1 会员价与支付方式冲突   2 会员价与会员折扣冲突 3 会员价与银台优惠冲突
     *            4 会员折扣与支付方式冲突 5 会员折扣与会员价冲突 6 会员折扣与银台优惠冲突
     *            7 支付方式与会员价冲突   8 支付方式与优惠方案冲突 9 支付方式与会员折扣冲突
     *  u_pay_temp ：银台的支付数据
     *  u_pay_info ：银台提交的支付信息
     **/
    function conflict_layder(manage, choice, type, u_pay_temp, u_pay_info) {
        var self = this;

        // (初始化一次弹出层数据)存储缓存应对只弹出一次一种类型冲突(九种冲突0就是没弹层1就是弹出层了)
        //storage_one = {1: 0,2: 0,3: 0,4: 0,5: 0,6: 0,7: 0,8: 0,9: 0};

        if (storage_one[type] == 1) {
            _chongtu_conflict(type, u_pay_temp, u_pay_info);// 弹出层过一次了就直接触发点击确认按钮事件
        } else {
            $('#alert-content').html(manage+'是否选择'+choice+'，请确认！');
            var is_member_price = '';
            var member_or_discount = '';

            displayAlertMessage('#alert-message', '#cancel-alert');

            // 点击确认
            $('#definite-alert').unbind('click').bind('click', function () {
                _chongtu_conflict(type, u_pay_temp, u_pay_info);
            });
            // 点击取消
            $('#cancel-alert').unbind('click').bind('click', function () {
                if (storage_one[type] == 0) {
                    storage_one[type] = 1;// 弹出一次了就赋值1
                    // 关闭弹出层 conflict_pay_info
                    layer.close(layerBox);
                }

                // 1、2、3会员价 4、5、6会员折扣冲突 7、8、9支付方式冲突
                if (type == 1 || type == 2 || type == 3) {
                    // 取消选中会员价
                    _pay_mode_up(1, type);
                    conflict_pay_info['is_member_price'] = 0;
                } else if (type == 4 || type == 5 || type == 6) {
                    // 取消选中会员折扣
                    _pay_mode_up(2, type);
                    conflict_pay_info['discount_rate'] = 100;
                } else if (type == 7 || type == 9) {
                    if (type == 7) {
                        member_or_discount = 'is_member_price';
                        conflict_pay_info['is_member_price'] = 1;
                    } else {
                        member_or_discount = 'is_member_discount';
                        conflict_pay_info['discount_rate'] = payorderInfo['user_account']['discount_rate'];
                        conflict_pay_info['is_member_price'] = u_pay_info['is_member_price'];
                    }
                    // 常规支付方式清0 并且取消选中
                    if (payorderInfo.pay_type['ct0000000003'][member_or_discount] == 0 && u_pay_info['stored'] != 0) {
                        // 取消选中乐币
                        _pay_mode_up(3);
                    }
                    if (payorderInfo.pay_type['ct0000000004'][member_or_discount] == 0 && u_pay_info['voucher'] != 0) {
                        // 取消选中抵用劵
                        _pay_mode_up(4);
                    }
                    if (payorderInfo.pay_type['ct0000000005'][member_or_discount] == 0 && u_pay_info['wxpay'] != 0) {
                        // 取消选中微信
                        _pay_mode_up(5);
                    }
                    if (payorderInfo.pay_type['ct0000000006'][member_or_discount] == 0 && u_pay_info['alipay'] != 0) {
                        // 取消选中微信
                        _pay_mode_up(6);
                    }
                    generate_choice_submit('');
                } else if (type == 8) {
                    // 常规支付方式冲突清0
                    if (payorderInfo.pay_info.promo.pay_type != '' && payorderInfo.pay_info.promo.pay_type != 'all') {
                        if (payorderInfo.pay_info.promo.pay_type['ct0000000003'] == 0 && u_pay_info['stored'] != 0) {
                            // 取消选中乐币
                            _pay_mode_up(3);
                        }
                        if (payorderInfo.pay_info.promo.pay_type['ct0000000004'] == 0 && u_pay_info['voucher'] != 0) {
                            // 取消选中抵用劵
                            _pay_mode_up(4);
                        }
                        if (payorderInfo.pay_info.promo.pay_type['ct0000000005'] == 0 && u_pay_info['wxpay'] != 0) {
                            // 取消选中微信
                            _pay_mode_up(5);
                        }
                        if (payorderInfo.pay_info.promo.pay_type['ct0000000006'] == 0 && u_pay_info['alipay'] != 0) {
                            // 取消选中微信
                            _pay_mode_up(6);
                        }
                    }
                    // 请求解决冲突和计算金额方法（合并解决方法）
                    generate_choice_submit('');
                }
            });
        }
    }
    // 点击确认执行的事情
    function _chongtu_conflict(type, u_pay_temp, u_pay_info) {
        var self = this;

        // is_dis=1 是否点了取消会员折扣
        var is_dis = '';

        if (storage_one[type] == 0) {
            storage_one[type] = 1;// 弹出一次了就赋值1
            // 关闭弹出层 conflict_pay_info
            layer.close(layerBox);
        }
        if (type == 1 || type == 4) {
            if (type == 1) {
                is_member_price = 1;
                member_or_discount = 'is_member_price';
            }
            if (type == 4) {
                conflict_pay_info['discount_rate'] = payorderInfo['user_account']['discount_rate'];
                member_or_discount = 'is_member_discount';
            }
            // 常规支付方式清0 并且取消选中
            if (payorderInfo.pay_type['ct0000000003'][member_or_discount] == 0 && u_pay_info['stored'] != 0) {
                // 取消选中乐币
                _pay_mode_up(3);
            }
            if (payorderInfo.pay_type['ct0000000004'][member_or_discount] == 0 && u_pay_info['voucher'] != 0) {
                // 取消选中抵用劵
                _pay_mode_up(4);
            }
            if (payorderInfo.pay_type['ct0000000005'][member_or_discount] == 0 && u_pay_info['wxpay'] != 0) {
                // 取消选中微信
                _pay_mode_up(5);
            }   
            if (payorderInfo.pay_type['ct0000000006'][member_or_discount] == 0 && u_pay_info['alipay'] != 0) {
                // 取消选中微信
                _pay_mode_up(6);
            }
        } else if (type == 2) {
            // 取消选中会员折扣
            _pay_mode_up(2);
            conflict_pay_info['discount_rate'] = 100;
            is_member_price = 1;
            is_dis = 1;
        } else if (type == 3 || type == 6 || type == 8) {
            conflict_pay_info['promo_id'] = '';
            conflict_pay_info['promo'] = '';
            if (type == 3) {
                is_member_price = 1;
            }
            if (type == 6) {
                conflict_pay_info['discount_rate'] = payorderInfo['user_account']['discount_rate'];
            }
        } else if (type == 5 || type == 7) {
            // 取消选中会员价
            _pay_mode_up(1);
            is_member_price = 0;
        } else if (type == 9) {
            // 取消选中会员折扣
            _pay_mode_up(2);
            conflict_pay_info['discount_rate'] = 100;
            is_dis = 1;

            // 选中乐币、抵用劵样式
            $('#isVoucher').addClass('gouCurrent');
            $('#clickVouch').removeClass('setBg');
            $('#clickUseLe').removeClass('setCol');
            $('#stored').removeClass('setCol')
            $('#stored').prop('readonly', false);
            $('#isLecoin').addClass('gouCurrent');
        }

        // 请求解决冲突和计算金额方法（合并解决方法）
        generate_choice_submit(is_member_price, '', is_dis, type);
    }
    // 选择框取消选中 type 1 会员价 2 会员折扣 3 乐币 4 抵用劵 5 微信
    function _pay_mode_up(type, is_type) {
        if (type == 1) {
            // 取消选中会员价
            $('#isMember').removeClass('gouCurrent');
            // 是否选择了会员价，为false
            isMember = false;
            is_member_price = 0;
            if (is_type == 3) {

                // 请求解决冲突和计算金额方法（合并解决方法）
                generate_choice_submit(is_member_price);
            }
        } else if (type == 2) {
            // 取消选中会员折扣
            $('#isDiscount').removeClass('gouCurrent');
            // 是否选择了折扣，为false
            isDiscount = false;
            if (is_type == 6 || is_type == 4) {
                is_member_discount = 0;
                lepay = 1;
                vouchersPrice = canuseVouchePrice;
                is_load = 1;
                isVoucher = true;
                $('#isVoucher').addClass('gouCurrent');
                $('#clickVouch').removeClass('setBg');
                isLecoin = true;
                isWxpay = true;
                isAlipay = true;
                $('#clickUseLe').removeClass('setCol');
                $('#stored').removeClass('setCol')
                $('#stored').prop('readonly', false);
                $('#isLecoin').addClass('gouCurrent');
                // 请求解决冲突和计算金额方法（合并解决方法）
                generate_choice_submit('', is_member_discount, 1);
            }
        } else if (type == 3) {
            lepay = 0;
            is_load= 1;
            // 取消选中乐币
            $('#isLecoin').removeClass('gouCurrent');
            // 是否选择了乐币，为false
            isLecoin = false;
            $('#clickUseLe').addClass('setCol');
            $('#stored').addClass('setCol');
            $('#stored').val('0.00');
            $('#stored').prop('readonly', true);
        } else if (type == 4) {
            vouchersPrice = 0;
            is_load= 1;
            conflict_pay_info['voucher'] = 0;
            // 取消选中抵用劵
            $('#isVoucher').removeClass('gouCurrent');
            // 是否选择了抵用劵，为false
            isVoucher = false;
            $('#clickVouch').addClass('setBg');
        } else if (type == 5) {
            wxpay = 0;
            is_load= 1;
            // 取消选中微信
            $('#isWxpay').removeClass('gouCurrent');
            // 是否选择了微信，为false
            isWxpay = false;
            $('#wxpay').addClass('setCol');
            $('#wxpay').prop('readonly', true);
            wxpay = 0;$('#wxpay').val(parseFloat(wxpay).toFixed(2));
        }else if(type == 6){
            alipay = 0;
            is_load= 1;
            // 取消选中微信
            $('#isAlipay').removeClass('gouCurrent');
            // 是否选择了微信，为false
            isAlipay = false;
            $('#alipay').addClass('setCol');
            $('#alipay').prop('readonly', true);
            alipay = 0;$('#alipay').val(parseFloat(alipay).toFixed(2));
        }
    }
    /**
     *  格式化支付信息
     **/
    function _format_pay_type($pay_type_id, $pay_money, $preferential_money, $pay_type_info) {
        //输出数据
        return {
            'pay_type_id'           :   $pay_type_id,
            'pay_type_name'         :   $pay_type_info[$pay_type_id]['pay_type_name'],
            'pay_money'             :   $pay_money,             //实收金额
            'preferential_money'    :   $preferential_money,    //优惠金额
            'receipts_integral'     :   $pay_type_info[$pay_type_id]['receipts_integral'],
            'preferential_integral' :   $pay_type_info[$pay_type_id]['preferential_integral']
        };
    }
    /**
     *  会员价与支付方式判断
     **/
    function _check_member_price_pay_type($order_pay_type, $pay_type_info) {
        for (var i in $order_pay_type) {
            if ($order_pay_type[i].pay_type_id != '' && $pay_type_info[$order_pay_type[i].pay_type_id]['is_member_price'] == 0) {

                return false;
            }
        }
        return true;
    }
    /**
     *  会员折扣与支付方式判断
     **/
    function _check_member_discount_pay_type($order_pay_type, $pay_type_info) {
        for (var i in $order_pay_type) {
            if ($order_pay_type[i].pay_type_id != '' && $pay_type_info[$order_pay_type[i].pay_type_id]['is_member_discount'] == 0) {
                return false;
            }
        }
        return true;
    }
    /**
     *  银台优惠与常规支付方式判断
     **/
    function _check_promo_info_pay_type($promo_info, $order_pay_type) {
        /*if (!$.isArray($order_pay_type) || !$.isArray($promo_info)) {
            return false;//或者应该是return 0;
        }*/
        //返回可计入满额优惠部分
        var $low_consumption = '0';
        for (var i in $order_pay_type) {
            //单独设置的优先级，高于全部
            if ($promo_info['all'] != undefined && i != 'all') {//isset($promo_info['all']) && !isset($promo_info[$key])
                $promo_info[i] = $promo_info['all'];
            }
            if ($promo_info[i] == '2' || $promo_info == 'all') {//!$.isArray($promo_info) || 
                //全部支持、或者是满额金额状态为2，实收和优惠都记入满额
                $low_consumption = parseFloat(accAdd($low_consumption, $order_pay_type[i]['pay_money'])).toFixed(2);
                $low_consumption = parseFloat(accAdd($low_consumption, $order_pay_type[i]['preferential_money'])).toFixed(2);
            } else if ($promo_info[i] == '') {
                //配置中不存在
                return false;
            } else if ($promo_info[i] == '1') {
                //满额金额状态为1，实收可记入满额
                $low_consumption = parseFloat(accAdd($low_consumption, $order_pay_type[i]['pay_money'])).toFixed(2);
            } else if ($promo_info[i] == '3') {
                //满额金额状态为0，全部不记入满额
                continue;
            } else {
                //配置错误
                return false;
            }
        }
        return $low_consumption;
    }
    /**
     *  计算优惠金额：该方法不考虑任何冲突问题(用于结账、支付前校验)
     *  pay_info_check ：用户提交的支付方案与之前保存的支付方案u_pay_temp经过校验后的支付方案
     *  order_info ：用户的订单信息
     **/
    function check_sub_moneys(pay_info_check, order_info) {
        //计算金额
        var menu_money_info = {
            'consumes'          :   '0',    //消费金额汇总
            'sub_user_price'    :   '0',    //会员价优惠
            'sub_user_discount' :   '0',    //会员折扣优惠
            'sub_user'          :   '0',    //会员优惠
            'sub_money'         :   '0',    //银台折扣
            'pay_sub_moneys'    :   '0',    //优惠金额汇总
            'pay_moneys'        :   '0'     //实收金额汇总                
        };

        var member_price = 0,discount_rate = 100,menu_price = 0,_consume = 0,_sub_user_price = 0,_sub_user_discount = 0;

        /****
            打折的最低消费额度，只能是会员价、会员折扣后的消费额度。
            根据支付方式不同，算出来的最低消费额度low_consumption，只能影响返券。
            因为如果影响打折，会有逻辑问题：消费满200，会员价、会员折扣后是100，银台打8折，支付80元。
            程序判断80元就不够满额了，因此只能用100算，就是会员价、会员折扣后的消费额。
        ****/

        //整理优惠方案菜品范围 最低消费额度
        var discount_menu_type_ids = {};
        if (pay_info_check['promo_id'] != '' && 
            pay_info_check['promo']['discount_menu_type_ids'] != '') {// 注释这个是因为提交给php的时候php需要判断前端不需要判断 &&pay_info_check['low_consumption'] >= pay_info_check['promo']['low_consumption']
            //菜品优惠处理：预算一下会员价、会员折扣后的消费额，用来看是否满足银台折扣额度
            var _menu_consumes = '0.00';        
            for (var i in order_info['menu']) {
                for (var j in order_info['menu'][i]) {

                    //取消的订单不算入优惠金额
                    if (order_info['menu'][i][j]['order_step'] == 0) {
                        continue;
                    }

                    //会员价
                    member_price = (pay_info_check['is_member_price'] == 0) ? order_info['menu'][i][j]['menu_price'] : order_info['menu'][i][j]['member_price'];

                    //折扣额度：会员折扣额度
                    discount_rate = (order_info['menu'][i][j]['is_discount'] == 0) ? '100' : pay_info_check['discount_rate'];

                    //会员价与会员折扣冲突1处理
                    if (member_price != order_info['menu'][i][j]['menu_price']) {
                        if (discount_rate != '100' &&
                            pay_info_check['is_member_price_discount'] == '1') {
                            //有冲突1时，谁的优惠力度大用谁
                            menu_price = parseFloat(accMul(order_info['menu'][i][j]['menu_price'], accDiv(discount_rate, 100))).toFixed(2);
                            if (member_price > menu_price) {
                                member_price = order_info['menu'][i][j]['menu_price'];
                            } else {
                                discount_rate = '100';
                            }
                        }
                    }

                    //菜品金额计算
                    _consume            = parseFloat(accMul(order_info['menu'][i][j]['menu_price'], order_info['menu'][i][j]['menu_num']));
                    _sub_user_price     = parseFloat(accMul(accSubtr(order_info['menu'][i][j]['menu_price'], member_price), order_info['menu'][i][j]['menu_num']));
                    _sub_user_discount  = parseFloat(accMul(accMul(member_price, accDiv(accSubtr(100, discount_rate), 100)), order_info['menu'][i][j]['menu_num']));
                    _consume                = parseFloat(accSubtr(_consume, _sub_user_price));
                    _consume                = parseFloat(accSubtr(_consume, _sub_user_discount));
                    _menu_consumes          = parseFloat(accAdd(_menu_consumes, _consume));
                }
            }

            //满足额度的，菜品才能进行相应的打折
            if (_menu_consumes >= pay_info_check['promo']['low_consumption']) {
                //优惠方案适用菜品整理
                if (!$.isArray(pay_info_check['promo']['discount_menu_type_ids'])) {
                    if (pay_info_check['promo']['discount_menu_type_ids'] == 'all') {
                        discount_menu_type_ids = 'all';
                    } else {
                        displayMsgTime(ndPromptMsg, '优惠方案所属菜品解析失败！');
                        clicknum = 1; //点击按钮可用
                        return;
                    }
                } else {
                    for (var i in pay_info_check['promo']['discount_menu_type_ids']) {
                        if (pay_info_check['promo']['discount_menu_type_ids'][i]['menu_type_id'] == undefined || pay_info_check['promo']['discount_menu_type_ids'][i]['menu_ids'] == '') {
                            displayMsgTime(ndPromptMsg, '优惠方案所属菜品解析失败！');
                            clicknum = 1; //点击按钮可用
                            return;
                        }
                        discount_menu_type_ids[pay_info_check['promo']['discount_menu_type_ids'][i].menu_type_id] = pay_info_check['promo']['discount_menu_type_ids'][i]['menu_ids'];
                    }
                }
            }
        }

        member_price = 0,discount_rate = 100,menu_price = 0,_consume = 0,_sub_user_price = 0,_sub_user_discount = 0;

        //菜品优惠处理
        for (var i in order_info['menu']) {
            for (var j in order_info['menu'][i]) {

                //会员价
                member_price = (pay_info_check['is_member_price'] == 0) ? order_info['menu'][i][j]['menu_price'] : order_info['menu'][i][j]['member_price'];

                //折扣额度：会员折扣额度
                discount_rate = (order_info['menu'][i][j]['is_discount'] == 0) ? '100' : pay_info_check['discount_rate'];

                //折扣额度：优惠方案折扣额度
                var discount_amount = '100';
                if (discount_menu_type_ids[order_info['menu'][i][j]['menu_type_id']] != undefined) {
                    if (discount_menu_type_ids[order_info['menu'][i][j]['menu_type_id']] != undefined && 
                        (discount_menu_type_ids[order_info['menu'][i][j]['menu_type_id']] == 'all' || 
                        discount_menu_type_ids[order_info['menu'][i][j]['menu_type_id']].indexOf(order_info['menu'][i][j]['menu_id']) != -1)) {
                        //优惠方案折扣额度
                        discount_amount = pay_info_check['promo']['discount_amount'];
                    }
                } else if (discount_menu_type_ids == 'all') {
                    //优惠方案折扣额度
                    discount_amount = pay_info_check['promo']['discount_amount'];
                }

                //优惠方案与会员折扣冲突1处理
                if (discount_amount != '100' &&
                    discount_rate != '100' &&
                    pay_info_check['promo']['is_member_discount'] == '1') {
                    //有冲突1时，谁的优惠力度大用谁
                    if (discount_amount > discount_rate) {
                        discount_amount = '100';
                    } else {
                        discount_rate = '100';
                    }
                }
                member_price = parseFloat(member_price);
                //会员价与优惠折扣冲突1处理
                if (member_price != order_info['menu'][i][j]['menu_price']) {
                    if (discount_amount != '100' &&
                        pay_info_check['promo']['is_member_price'] == '1') {
                        //有冲突1时，谁的优惠力度大用谁
                        menu_price = parseFloat(accMul(order_info['menu'][i][j]['menu_price'], accDiv(discount_amount, 100))).toFixed(2);
                        if (member_price > menu_price) {
                            member_price = order_info['menu'][i][j]['menu_price'];
                        } else {
                            discount_amount = '100';
                        }
                    }
                }

                //会员价与会员折扣冲突1处理
                if (member_price != order_info['menu'][i][j]['menu_price']) {
                    if (discount_rate != '100' &&
                        pay_info_check['is_member_price_discount'] == '1') {
                        //有冲突1时，谁的优惠力度大用谁
                        menu_price = parseFloat(accMul(order_info['menu'][i][j]['menu_price'], accDiv(discount_rate, 100))).toFixed(2);
                        if (member_price > menu_price) {
                            member_price = order_info['menu'][i][j]['menu_price'];
                        } else {
                            discount_rate = '100';
                        }
                    }
                }

                //菜品结账价
                order_info['menu'][i][j]['menu_pay_price']  = parseFloat(accDiv(accMul(accMul(member_price, discount_rate), discount_amount), 10000));
        
                //取消的订单不算入优惠金额
                if (payorderInfo.order[i].order_step != 0) {
                    //菜品金额计算
                    _consume            = parseFloat(accMul(order_info['menu'][i][j]['menu_price'], order_info['menu'][i][j]['menu_num']));
                    _sub_user_price     = parseFloat(accMul(accSubtr(order_info['menu'][i][j]['menu_price'], member_price), order_info['menu'][i][j]['menu_num']));


                    // （单价 - （单价 * 折扣额度）） * 数量 （会员折扣）
                    var user_discount_money = accMul(member_price, accDiv(discount_rate, 100));
                    if (user_discount_money.toString().indexOf('.') != -1) {
                        user_discount_money = parseFloat('0.'+user_discount_money.toString().split('.')[1].substring(0,2))+parseInt(user_discount_money);
                    }

                    _sub_user_discount  = accMul(accSubtr(member_price, user_discount_money), order_info['menu'][i][j]['menu_num']);
                    if (_sub_user_discount.toString().indexOf('.') != -1) {
                        _sub_user_discount = parseFloat('0.'+_sub_user_discount.toString().split('.')[1].substring(0,2))+parseInt(_sub_user_discount);
                    }

                    // （单价 - （单价 * 折扣额度）） * 数量 （银台折扣）
                    var sub_money_money = accMul(member_price, accDiv(discount_amount, 100));
                    if (sub_money_money.toString().indexOf('.') != -1) {
                        sub_money_money = parseFloat('0.'+sub_money_money.toString().split('.')[1].substring(0,2))+parseInt(sub_money_money);
                    }

                    var _sub_money = accMul(accSubtr(member_price, sub_money_money), order_info['menu'][i][j]['menu_num']);
                    if (_sub_money.toString().indexOf('.') != -1) {
                        _sub_money = parseFloat('0.'+_sub_money.toString().split('.')[1].substring(0,2))+parseInt(_sub_money);
                    }



                    var _sub_user           = parseFloat(accAdd(_sub_user_price, _sub_user_discount));
                    var _pay_sub_moneys         = parseFloat(accAdd(_sub_money, _sub_user));
                    var _pay_moneys             = parseFloat(accSubtr(_consume, _pay_sub_moneys));
                    
                    menu_money_info['consumes']         = parseFloat(accAdd(menu_money_info['consumes'], _consume));
                    menu_money_info['sub_user_price']   = parseFloat(accAdd(menu_money_info['sub_user_price'], _sub_user_price));
                    menu_money_info['sub_user_discount']= parseFloat(accAdd(menu_money_info['sub_user_discount'], _sub_user_discount));
                    menu_money_info['sub_user']         = parseFloat(accAdd(menu_money_info['sub_user'], _sub_user));
                    menu_money_info['sub_money']        = parseFloat(accAdd(menu_money_info['sub_money'], _sub_money));
                    menu_money_info['pay_sub_moneys']       = parseFloat(accAdd(menu_money_info['pay_sub_moneys'], _pay_sub_moneys));
                    menu_money_info['pay_moneys']           = parseFloat(accAdd(menu_money_info['pay_moneys'], _pay_moneys));
                }
            }
        }

        // 下面这个公式是应对，当优惠金额出现三位小数（15.667）的时候，只取15.66，如果用toFixed(2)的话就会四舍五入变成15.67，所以用下面这个公式
        if (menu_money_info['sub_money'].toString().indexOf('.') != -1) {
            menu_money_info['sub_money'] = parseFloat('0.'+menu_money_info['sub_money'].toString().split('.')[1].substring(0,2))+parseInt(menu_money_info['sub_money']);
        }
        if (menu_money_info['sub_user'].toString().indexOf('.') != -1) {
            menu_money_info['sub_user'] = parseFloat('0.'+menu_money_info['sub_user'].toString().split('.')[1].substring(0,2))+parseInt(menu_money_info['sub_user']);
        }

        // 兼容以前数据存储格式的几个值计算
        /*pay_info_check['money']       = parseFloat(accSubtr(pay_info_check['consumes'], menu_money_info['sub_user']));
        pay_info_check['cashier']   = parseFloat(accSubtr(pay_info_check['money'], pay_info_check['stored']));
        pay_info_check['cashier']   = parseFloat(accSubtr(pay_info_check['cashier'], pay_info_check['voucher']));
        pay_info_check['cashier']   = parseFloat(accSubtr(pay_info_check['cashier'], pay_info_check['wxpay']));
        pay_info_check['pay_money'] = parseFloat(accSubtr(pay_info_check['cashier'], menu_money_info['sub_money']));
        pay_info_check['pay_money'] = parseFloat(accAdd(pay_info_check['pay_money'], pay_info_check['re_stored']));
        pay_info_check['pay_money'] = parseFloat(accAdd(pay_info_check['pay_money'], pay_info_check['re_voucher']));
        pay_info_check['pay_money'] = parseFloat(accAdd(pay_info_check['pay_money'], pay_info_check['re_wxpay']));*/

        // 赋值校验过的支付方案，下次在点击的时候有用
        conflict_pay_info = dishesStackHandle(pay_info_check, conflict_pay_info);

        // 输出数据
        /*return {
            'menu_money_info'   :   menu_money_info,
            'menu'              :   order_info['menu']
        };*/
        // 计算金额
        calculationAmount(isUseLe,isUseVoucher,isUseDiscount, menu_money_info);
    }
    // 解决菜品对象和分类对象 堆栈 出现的父对象和子对象相关联的问题
    function dishesStackHandle(p, c) {
        var self = this;
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

});
