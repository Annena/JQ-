    var layerBox;       // 弹出框
    var layerStrip;     // 弹出条
    var cn_2 = 0;
    var version = 201802221448;       //版本号
    var is_btnd = 0;
    // 键盘监控公共变量
    var lastTime_monitor = new Date().getTime();
    var nextTime_monitor;
    var is_scan_monitor = 0;            // 是否需要监控
    // 生成桌台二维码的地址
    var phpTableCode = 'http://interface.lekabao.net/app.php';
    // 请求接口地址（域名）
    var ajax_php_ress = 'http://admin.lekabao.net';

    // 城市省份区域三级联动
    function PCAST(){
        this.SelP=document.getElementsByName(arguments[0])[0];
        this.SelC=document.getElementsByName(arguments[1])[0];
        this.SelA=document.getElementsByName(arguments[2])[0];
        this.DefP=this.SelA?arguments[3]:arguments[2];
        this.DefC=this.SelA?arguments[4]:arguments[3];
        this.DefA=this.SelA?arguments[5]:arguments[4];
        this.SelP.PCA=this;this.SelC.PCA=this;
        this.SelP.onchange=function(){
            PCAST.SetC(this.PCA)
        };
        if(this.SelA)this.SelC.onchange=function(){
            PCAST.SetA(this.PCA)
        };
        PCAST.SetP(this)
    };
    PCAST.SetP=function(PCA){
        for(i=0;i<PCAP.length;i++){
            PCAPT=PCAPV=PCAP[i];
            if(PCAPT==SPT)PCAPV="";
            PCA.SelP.options.add(new Option(PCAPT,PCAPV));
            if(PCA.DefP==PCAPV)
            PCA.SelP[i].selected=true
        }
        PCAST.SetC(PCA)
    };
    PCAST.SetC=function(PCA){
        PI=PCA.SelP.selectedIndex;
        PCA.SelC.length=0;
        for(i=1;i<PCAC[PI].length;i++){
            PCACT=PCACV=PCAC[PI][i];
            if(PCACT==SCT)
                PCACV="";
            PCA.SelC.options.add(new Option(PCACT,PCACV));
            if(PCA.DefC==PCACV)
                PCA.SelC[i-1].selected=true
        }
        if(PCA.SelA)PCAST.SetA(PCA)
    };
    PCAST.SetA=function(PCA){
        PI=PCA.SelP.selectedIndex;
        CI=PCA.SelC.selectedIndex;
        PCA.SelA.length=0;
        for(i=1;i<PCAA[PI][CI].length;i++){
            PCAAT=PCAAV=PCAA[PI][CI][i];
            if(PCAAT==SAT)PCAAV="";
            PCA.SelA.options.add(new Option(PCAAT,PCAAV));
            if(PCA.DefA==PCAAV)PCA.SelA[i-1].selected=true
        }
    };
    // 添加滚动条，上下左右可以移动滚动条
        var ua = navigator.userAgent.toLowerCase(); 
        // document.onselectstart=new Function("event.returnValue=false;"); //禁止选择,也就是无法复制
        function topButtonScroll(nav,table) {
            if(ua.match(/iPad/i)!="ipad") { 
                $(window).load(
                 function(){
                      var h=$(window).height()-200;
                      return $(nav).height(h);
                     }
                 );
                $(window).resize(
                     function(){
                      var h=$(window).height()-200;
                      return $(nav).height(h);
                     }
                 );
            }
           $(nav).scroll(
                function(){
                    $(table).scrollLeft($(this).scrollLeft());
                }
                );
           $(table).scroll(
                function(){
                    $(nav).scrollLeft($(this).scrollLeft());
                }
            );

        }

        function topButtonScroll2(nav,table) {
            if(ua.match(/iPad/i)!="ipad") {  
                $(window).load(
                 function(){
                      var h=$(window).height()-235;
                      return $(nav).height(h);
                     }
                 );
                $(window).resize(
                     function(){
                      var h=$(window).height()-235;
                      return $(nav).height(h);
                     }
                 );
            } else {
                $(nav).height($.cookie('windowHei')-330)
            }

           $(nav).scroll(
                function(){
                    $(table).scrollLeft($(this).scrollLeft());
                }
                );
               $(table).scroll(
                function(){
                    $(nav).scrollLeft($(this).scrollLeft());
                }
            );

        }

        function topButtonScroll3(nav,table) {
            if(ua.match(/iPad/i)!="ipad") { 
                $(window).load(
                 function(){
                      var h=$(window).height()-142;
                      return $(nav).height(h);
                     }
                 );
                $(window).resize(
                    function(){
                     var h=$(window).height()-142;
                     return $(nav).height(h);
                    }
                );
            }

           $(nav).scroll(
                function(){
                    $(table).scrollLeft($(this).scrollLeft());
                }
                );
               $(table).scroll(
                function(){
                    $(nav).scrollLeft($(this).scrollLeft());
                }
            );

        }
        function topButtonScroll4(nav,table) {
            if(ua.match(/iPad/i)!="ipad") { 
                $(window).load(
                 function(){
                      var h=$(window).height()-142-177;
                      return $(nav).height(h);
                     }
                 );
                $(window).resize(
                    function(){
                     var h=$(window).height()-142-177;
                     return $(nav).height(h);
                    }
                );
            }

           $(nav).scroll(
                function(){
                    $(table).scrollLeft($(this).scrollLeft());
                }
                );
               $(table).scroll(
                function(){
                    $(nav).scrollLeft($(this).scrollLeft());
                }
            );

        }
        function topButtonScroll5(nav,table,reduce) {
            if(ua.match(/iPad/i)!="ipad") { 
                $(window).load(
                 function(){
                      var h=$(window).height()-197;
                      return $(nav).height(h);
                     }
                 );
                $(window).resize(
                    function(){
                     var h=$(window).height()-197;
                     return $(nav).height(h);
                    }
                );
            }

           $(nav).scroll(
                function(){
                    $(table).scrollLeft($(this).scrollLeft());
                }
                );
               $(table).scroll(
                function(){
                    $(nav).scrollLeft($(this).scrollLeft());
                }
            );

        }
    function topButtonScroll6(nav,table,reduce) {
        if(ua.match(/iPad/i)!="ipad") {
            $(window).load(
                function(){
                    var h=$(window).height()-235-20;
                    return $(nav).height(h);
                }
            );
            $(window).resize(
                function(){
                    var h=$(window).height()-235-20;
                    return $(nav).height(h);
                }
            );
        }

        $(nav).scroll(
            function(){
                $(table).scrollLeft($(this).scrollLeft());
            }
        );
        $(table).scroll(
            function(){
                $(nav).scrollLeft($(this).scrollLeft());
            }
        );

    }
    function downloadMsg(msg){
        //下载提示
        displayMsg($('#prompt-message'), msg, 2000);
    }
    // 三级级联显示店铺
    function shopData() {
        //alert(shopStatusList);
        setAjax(AdminUrl.shopShopList, {
            'type': 2
        }, $('#prompt-message'), {20: ''}, function(respnoseText) {
            // 得到返回数据
            var data = respnoseText.data;

            shopList(data);

        }, 0);
    }


    // 助记码大小写转换
    function conversion_case(text) {
      // 转换为小写 toLowerCase() 转换为大写 toUpperCase()
      var reg = /[A-Z]/;  // 正则的意思是 判断某一个字母是否是大写;
      var content = '';

      for (var i=0;i<text.length;i++) {
        if (reg.test(text[i])) {
          content += text[i].toLowerCase();
        } else {
          content += text[i];
        }
      }
      return content;
    }

    // windows壳子上调用退出登录接口
    function call_exit_login() {
      $('#exit-system').click();
    }
    // windows壳子上调用切换商户
    function header_shop_select() {
        $("#header-mercheant").click();
    }
    // windows壳子上调用切换门店
    function header_mercheant() {
        $("#header-shop-select span").click();
    }

    // 权限判断
    function authority_judgment (name) {
        var perIsEdit = Cache.get('perIsEdit');
        var is_up = 0;  // 是否有修改权限 0 否 1 是
        if (perIsEdit[name] != undefined) {
            is_up = 1;
        }
        return is_up;
    }

    // java壳子用权限判断
    function authority_cookie (name) {
        var perIsEdit = $.cookie('perIs_cookie');
        var is_up = 0;  // 是否有修改权限 0 否 1 是
        if (perIsEdit.indexOf(name) > -1) {
            is_up = 1;
        }
        return is_up;
    }

    // 封装获取数据方法
    function person_get_data () {
        var card_id = $.cookie('card_id');
        var company_name_en = $.cookie('company_name_en');

        return {
            'card_id': card_id,
            'company_name_en': company_name_en
        };
    }


    // 监控键盘，判断刷卡
    function keydown_monitor (id) {
        var scan_code_pay = '';     // 扫码枪扫描到的字符串
        //按下键盘回车键确认
        $(window).keydown(function (event) {
            // 刷卡
            if (is_scan_monitor == 1) {
                scan_hele_monitor(event.key, event.keyCode, id);
            }
        });
        // 扫码枪处理
        function scan_hele_monitor (key, keyCode, id) {
            if (keyCode == 13) {// 回车键
                if (scan_code_pay == '') {
                    return;
                }
                if (scan_code_pay.length < 3) {
                    scan_code_pay = '';
                    return;
                }
                var scan_code_txt = scan_code_pay;
                var ct_scan_code = '';
                scan_code_pay = '';
                // 校验必须连续是数字
                var reltest = /^[0-9]{1}$/;
                var scan_num = 0;
                var error_num = 0;
                for (var i in scan_code_txt) {
                    if (reltest.test(scan_code_txt[i])) {
                        scan_num++;
                    } else {
                        error_num++;
                    }
                    ct_scan_code += scan_code_txt[i];
                }
                // 如果输入框有焦点，就截取掉扫码枪输入的数据
                $('input[type="text"]').each(function () {
                    if ($(this).val().indexOf(ct_scan_code) != -1) {
                        $(this).val($(this).val().split(ct_scan_code)[0]);
                    }
                    // 输入框失去焦点
                    $(this).blur();
                });
                /*// 不是连续数字就退出，没有效果
                if (error_num != 0) {
                    return;
                }
                // 付款码是16~24位
                if (scan_num < 16 || scan_num > 24) {
                    return;
                }*/
                // if (scan_code_txt.length > 1) {
                    $(id).val('');
                    $(id).val(scan_code_txt);
                // }
            } else {
                // 扫码枪输入的时间间隔一般在8毫秒，偶尔会有16毫秒，而键盘输入一般都在80毫秒以上，因此我设定当输入间隔小于等于80毫秒时，判断为扫码枪输入
                nextTime_monitor = new Date().getTime();

                if(nextTime_monitor - lastTime_monitor > 80) {
                    scan_code_pay = key;
                } else {
                    scan_code_pay = scan_code_pay + key;
                }
                lastTime_monitor = nextTime_monitor;
            }
        }
    }

    // 显示订单详情公共方法
    function public_details (data) {
        // order_step  订单状态：1下单 2到店  3确认出单 9已结账 0门店取消订单
        var order_step = {
            1: '未结账',
            2: '未结账',
            3: '未结账',
            9: '已结账',
            0: '已退单'
        };
        $('#order_step').text(order_step[data.order_step]);

        $('li[data-type="delt"]').remove();
        // 桌台名称
        $('#tableName').text(data.table_name);
        // 订单属性
        // if(data.order_property == 1) {
        //     $('#orderProperty').html('堂食');
        // } else if(data.order_property == 2) {
        //     $('#orderProperty').html('外卖');
        // }
        var order_type_text = '';
        if (data.order_property == 1) {
            order_type_text = '餐厅堂食';
        } else if (data.order_property == 2) {
            order_type_text = '外卖送餐';
        } else if (data.order_property == 3) {
            order_type_text = '门店自取';
        } else if (data.order_property == 4) {
            order_type_text = '商城配送';
        }
        $('#orderProperty').text(order_type_text);
        // console.log(data.order_property);
        // 就餐人数
        $('#user_num').text(data.pay_info.user_num);
        // console.log(data.user_num);
        // 收银员
        $('#aUserName').text(data.pay_info.a_user_name);
        var add_time = getAppointTimePro(data.pay_info.add_time);
        if (data.pay_info.add_time == undefined || data.pay_info.add_time == 0) {
            // add_time = '无';
            $('#add_time').parent().addClass('hide');
        } else {
            $('#add_time').parent().removeClass('hide');
        }
        // 日期时间
        $('#add_time').text(add_time);
        if (data.pay_info.order_time == undefined || data.pay_info.order_time == 0) {
            $('#order_time').parent().addClass('hide');
        } else {
            $('#order_time').parent().removeClass('hide');
        }
        // 开台时间
        $('#order_time').text(getAppointTimePro(data.pay_info.order_time));
        // 流水单号
        if(!data.pay_info.pay_no) {
            $('#payId').text(data.pay_id);
        } else {
            $('#payId').text(pay_no_he(data.pay_info.pay_no)+' '+'( '+data.pay_id+' )');
        }
        
        // if (data.order_property == 1) {
        //     $('#order_property').html('堂食');
        // } else if (data.order_property == 2) {
        //     $('#order_property').html('外卖');
        // }


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
        
        for (var i in data.pay_info.pay_other) {
            if (i == undefined) {
                payOther += '';
                preOther += '';
            } else {
                // 自定义支付方式
                var tr_name = other_take_name(data.pay_info.pay_other[i].pay_type_id);
                if (data.pay_info.pay_other[i].pay_money != 0) {
                    payOther += '<li class="clearfix" data-type="delt">'+
                                    '<div class="billname">'+data.pay_info.pay_other[i].pay_type_name+tr_name.pay_money_name+'</div>'+ // 实收
                                    '<div class="billxuhao">'+data.pay_info.pay_other[i].pay_money+'</div>'+
                                '</li>';
                }
                if (data.pay_info.pay_other[i].preferential_money != 0) {
                    preOther += '<li class="clearfix" data-type="delt">'+
                                    '<div class="billname">'+data.pay_info.pay_other[i].pay_type_name+tr_name.pre_money_name+'</div>'+ // 优惠
                                    '<div class="billxuhao">'+data.pay_info.pay_other[i].preferential_money+'</div>'+
                                '</li>';
                }

                pay_money += parseFloat(data.pay_info.pay_other[i].pay_money);
                preferential_money += parseFloat(data.pay_info.pay_other[i].preferential_money);
            }
        }

        /*
            收银统计，收银记录，清机记录，计算金额方法
            data：               数据
            pay_money：          自定义支付方式实收
            preferential_money： 自定义支付方式优惠
         */
        var cal_data = calculation_money(data.pay_info, pay_money, preferential_money, '', 1, data);
        if (cal_data.use_money == 0) {
            $('#use_money').parent().addClass('hide');
        } else {
            $('#use_money').parent().removeClass('hide');
            // 人均消费
            $('#use_money').text(cal_data.use_money);
        }


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
        if (data.pay_info.cash == 0) {
            $('#cashDisplay').addClass('hide');
        } else {
            $('#cashDisplay').removeClass('hide');
            $('#cash').text(data.pay_info.cash);
        }
        // 银行卡支付
        if (data.pay_info.card == 0) {
            $('#cardDisplay').addClass('hide');
        } else {
            $('#cardDisplay').removeClass('hide');
            $('#card').text(data.pay_info.card);
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
        if (data.pay_info.sub_user_price == 0) {
            $('#sub_user_price_dis').addClass('hide');
        } else {
            $('#sub_user_price_dis').removeClass('hide');
            $('#sub_user_price').text(data.pay_info.sub_user_price);
        }
        // 会员折扣优惠
        if (data.pay_info.sub_user_discount == 0) {
            $('#sub_user_discount_dis').addClass('hide');
        } else {
            $('#sub_user_discount_dis').removeClass('hide');
            $('#sub_user_discount').text(data.pay_info.sub_user_discount);
        }
        // 抹零
        if (data.pay_info.small_change == 0 || data.pay_info.small_change == undefined) {
            $('#smallChangeDisplay').addClass('hide');
        } else {
            $('#smallChangeDisplay').removeClass('hide');
            $('#smallChange').text(data.pay_info.small_change);
        }
        // 抵用劵支付
        if (cal_data.vou_money == 0) {
            $('#voucherDisplay').addClass('hide');
        } else {
            $('#voucherDisplay').removeClass('hide');
            $('#voucher').text(cal_data.vou_money);
        }
        // 银台折扣
        if (data.pay_info.sub_money == 0) {
            $('#subMoneyDisplay').addClass('hide');
        } else {
            $('#subMoneyDisplay').removeClass('hide');
            $('#subMoney').text(data.pay_info.sub_money);
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
        if (data.give_menu_consume == 0) {
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
        // 退储值本金
        if (cal_data.re_principal == 0) {
            $('#re_principal_display').addClass('hide');
        } else {
            $('#re_principal_display').removeClass('hide');
            $('#re_principal').text(cal_data.re_principal);
        }
        // 退储值赠送
        if (cal_data.re_stsprgive == 0) {
            $('#re_stsprgive_display').addClass('hide');
        } else {
            $('#re_stsprgive_display').removeClass('hide');
            $('#re_stsprgive').text(cal_data.re_stsprgive);
        }
        // 退抵用劵
        if (data.re_voucher == 0) {
            $('#re_voucher_display').addClass('hide');
        } else {
            $('#re_voucher_display').removeClass('hide');
            $('#re_voucher').text(data.re_voucher);
        }*/
        /*// 消费返券
        if (data.give_voucher == '' || data.give_voucher.voucher_name == undefined) {
            $('#giveVoucherDisplay').addClass('hide');
        } else {
            $('#giveVoucherDisplay').removeClass('hide');
            $('#giveVoucher').text(data.give_voucher.voucher_name+'x'+data.give_voucher.voucher_num);
        }*/

        // 菜品
        var content = '';
        var contentPro = '';
        for (var i in data.menu) {
            for (var j in data.menu[i]) {
                // 转菜数量
                var rotate_menu_num = 0;
                if (data.menu[i][j].rotate_menu_num == undefined || data.menu[i][j].rotate_menu_num == 0) {
                    rotate_menu_num = 0;
                } else {
                    rotate_menu_num = data.menu[i][j].rotate_menu_num;
                }
                var menu_num = (parseFloat(data.menu[i][j].menu_num)+parseFloat(data.menu[i][j].give_menu_num)+parseFloat(data.menu[i][j].cancel_menu_num)+parseFloat(rotate_menu_num)).toFixed(1);
                contentPro +=   '<p class="mengtc" id="'+data.menu[i][j].menu_id+'">'+
                                    '<span class="onemengtc">'+data.menu[i][j].menu_name+'</span>'+
                                    '<span>'+data.menu[i][j].menu_price+'</span>'+
                                    '<span>'+menu_num+'</span>'+
                                    '<span>'+parseFloat(accMul(data.menu[i][j].menu_price, menu_num)).toFixed(2)+'</span>'+
                                '</p>';
                // 如果增菜个数大于0，就在桌台上显示着一条记录   caipinsuojin缩进样式
                if (data.menu[i][j].give_menu_num > 0) {
                    contentPro +=   '<p class="mengtc" id="'+data.menu[i][j].menu_id+'">'+
                                        '<span class="onemengtc">'+data.menu[i][j].menu_name+'<i>赠</i></span>'+
                                        '<span>0</span>'+
                                        '<span>'+data.menu[i][j].give_menu_num+'</span>'+
                                        '<span>0</span>'+
                                    '</p>';
                }
                // 如果退菜个数大于0，就在桌台上显示着一条记录
                if (data.menu[i][j].cancel_menu_num > 0) {
                    contentPro +=   '<p class="mengtc" id="'+data.menu[i][j].menu_id+'">'+
                                        '<span class="onemengtc">'+data.menu[i][j].menu_name+'<i>退</i></span>'+
                                        '<span>'+data.menu[i][j].menu_price+'</span>'+
                                        '<span>-'+data.menu[i][j].cancel_menu_num+'</span>'+
                                        '<span>-'+parseFloat(accMul(data.menu[i][j].menu_price, data.menu[i][j].cancel_menu_num)).toFixed(2)+'</span>'+
                                    '</p>';
                }

                // 如果转菜个数大于0，就在桌台上显示着一条记录
                if (rotate_menu_num > 0) {
                    contentPro +=   '<p class="mengtc" id="'+data.menu[i][j].menu_id+'">'+
                                        '<span class="onemengtc">'+data.menu[i][j].menu_name+'<i>退</i></span>'+
                                        '<span>'+data.menu[i][j].menu_price+'</span>'+
                                        '<span>-'+rotate_menu_num+'</span>'+
                                        '<span>-'+parseFloat(accMul(data.menu[i][j].menu_price, rotate_menu_num)).toFixed(2)+'</span>'+
                                    '</p>';
                }
            }
        }
        content +=  '<p class="mengtop">'+
                        '<span class="onespan">菜品名称</span>'+
                        '<span class="">单价</span>'+
                        '<span>数量</span>'+
                        '<span>金额</span>'+
                    '</p>'+contentPro;
        $('#menuList').html(content);
        $(".lanheight li:odd").css("background","#fafafa");
        $(".lanheight li:even").css("background","#fff");
    }


    // 判断显示的自定义支付方式（百度、美团、饿了么）名称
    function other_take_name (pay_type_id) {
        var pay_money_name = '实收',pre_money_name = '优惠';
        if (pay_type_id == 'ctplatform01' || pay_type_id == 'ctplatform02' || pay_type_id == 'ctplatform03') {
            pre_money_name = '佣金配送';
        } else if (pay_type_id == 'ctplatform11' || pay_type_id == 'ctplatform12' || pay_type_id == 'ctplatform13') {
            pay_money_name = '商户承担';
            pre_money_name = '平台承担';
        }
        return {
            'pay_money_name': pay_money_name,
            'pre_money_name': pre_money_name
        };
    }

    // 除法函数
    function accDiv(arg1,arg2){ 
        var t1=0,t2=0,r1,r2; 
        try{t1=arg1.toString().split(".")[1].length}catch(e){} 
        try{t2=arg2.toString().split(".")[1].length}catch(e){} 
        with(Math){ 
            r1=Number(arg1.toString().replace(".","")) 
            r2=Number(arg2.toString().replace(".","")) 
            return (r1/r2)*pow(10,t2-t1); 
        } 
    }
    // 乘法函数
    function accMul(arg1,arg2){ 
        var m=0,s1=arg1.toString(),s2=arg2.toString(); 
        try{m+=s1.split(".")[1].length}catch(e){} 
        try{m+=s2.split(".")[1].length}catch(e){} 
        return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m) 
    }
    // 加法函数
    function accAdd(arg1,arg2){ 
        var r1,r2,m; 
        try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0} 
        try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0} 
        m=Math.pow(10,Math.max(r1,r2)) 
        //return (arg1*m+arg2*m)/m 
        return accDiv((accMul(arg1,m)+accMul(arg2,m)),m) 
    } 
    // 减法函数
    function accSubtr(arg1, arg2, type) {
        var r1, r2, m, n;
        try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
        try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
        r1 = parseFloat(r1);
        r2 = parseFloat(r2);
        m = Math.pow(10, Math.max(r1, r2));
        //动态控制精度长度
        n=(r1>=r2)?r1:r2;

        // 处理Math.pow出现科学计数法造成后面无法计算
        m = new Number(m);
        m = m.toLocaleString();
        if (type == 1) {
            return parseFloat((parseFloat(arg1) * parseFloat(m) - parseFloat(arg2) * parseFloat(m)) / parseFloat(m));
        } else {
            return parseFloat((parseFloat(arg1) * parseFloat(m) - parseFloat(arg2) * parseFloat(m)) / parseFloat(m)).toFixed(n);//.toFixed(n)
        }
        // return ((parseFloat(arg1) * parseFloat(m) - parseFloat(arg2) * parseFloat(m)) / parseFloat(m)); //.toFixed(n)
    }

    /*
        收银统计，收银记录，清机记录，计算金额方法
        data：               数据
        pay_money：          自定义支付方式实收
        preferential_money： 自定义支付方式优惠
        is_re:               1 需要包含退款
        is_pay_type:         1 收银记录详情改了格式所以用这个标识一些参数
     */
    function calculation_money (data, pay_money, preferential_money, is_re, is_pay_type, is_data) {
        // 计算各种金额
        var con_money = 0;      // 消费金额
        var res_money = 0;      // 实收金额
        var dis_money = 0;      // 优惠总金额
        var pac_money = 0;      // 套餐优惠
        var str_money = 0;      // 乐币
        var sts_money = 0;      // 储值优惠
        var sub_money = data.sub_money == undefined ? 0 : data.sub_money;      // 银台折扣
        var pri_money = 0;      // 储值本金消费
        var vou_money = 0;      // 抵用劵金额
        var wxp_money = 0;      // 微信金额
        var alip_money = 0;     // 支付宝金额


        var use_money = 0;      // 人均消费
        var re_principal = data.re_principal == undefined ? 0 : data.re_principal;   // 退储值本金
        var re_stsprgive = 0;   // 退储值赠送

        var wxpay = data.wxpay == undefined ? 0 : data.wxpay;
        var re_wxpay = data.re_wxpay == undefined ? 0 : data.re_wxpay;
        var alipay = data.alipay == undefined ? 0 : data.alipay;
        var re_alipay = data.re_alipay == undefined ? 0 : data.re_alipay;



        var voucher = data.voucher == undefined ? 0 : data.voucher;
        var re_voucher = data.re_voucher == undefined ? 0 : data.re_voucher;
        var principal = data.principal == undefined ? 0 : data.principal;
        var stored = data.stored == undefined ? 0 : data.stored;
        var re_stored = data.re_stored == undefined ? 0 : data.re_stored;
        var order_menu_consume = 0;
        var cancel_menu_consume = 0;
        var rotate_menu_consume = 0;
        var give_menu_consume = 0;
        var consume = data.consume == undefined ? 0 : data.consume;
        if (is_pay_type == 1) {
            order_menu_consume = is_data.order_menu_consume == undefined ? 0 : is_data.order_menu_consume;
            cancel_menu_consume = is_data.cancel_menu_consume == undefined ? 0 : is_data.cancel_menu_consume;
            rotate_menu_consume = is_data.rotate_menu_consume == undefined ? 0 : is_data.rotate_menu_consume;
            give_menu_consume = is_data.give_menu_consume == undefined ? 0 : is_data.give_menu_consume;
            consume = data.consumes == undefined ? 0 : data.consumes;
        } else {
            order_menu_consume = data.order_menu_consume == undefined ? 0 : data.order_menu_consume;
            cancel_menu_consume = data.cancel_menu_consume == undefined ? 0 : data.cancel_menu_consume;
            rotate_menu_consume = data.rotate_menu_consume == undefined ? 0 : data.rotate_menu_consume;
            give_menu_consume = data.give_menu_consume == undefined ? 0 : data.give_menu_consume;
            consume = data.consume == undefined ? 0 : data.consume;
        }
        
        var cash = data.cash == undefined ? 0 :  data.cash;
        var card = data.card == undefined ? 0 : data.card;
        var sub_user_price = data.sub_user_price == undefined ? 0 : data.sub_user_price;
        var sub_user_discount = data.sub_user_discount == undefined ? 0 : data.sub_user_discount;
        var small_change = data.small_change == undefined ? 0 : data.small_change;
        var user_num = data.user_num == undefined ? 0 : data.user_num;

        /*if (is_re == 1) {
            wxp_money = parseFloat(data.wxpay).toFixed(2);
            vou_money = parseFloat(data.voucher).toFixed(2);
            pri_money = parseFloat(data.principal).toFixed(2);
            str_money = parseFloat(data.stored).toFixed(2);
            re_principal = parseFloat(data.re_principal).toFixed(2);
            re_stsprgive = parseFloat(data.re_stored, data.re_principal).toFixed(2);
        } else {*/
            wxp_money = parseFloat(accSubtr(wxpay, re_wxpay)).toFixed(2);
            alip_money = parseFloat(accSubtr(alipay, re_alipay)).toFixed(2);


            vou_money = parseFloat(accSubtr(voucher, re_voucher)).toFixed(2);
            pri_money = parseFloat(accSubtr(principal, re_principal)).toFixed(2);
            str_money = parseFloat(accSubtr(stored, re_stored)).toFixed(2);
        /*}*/

        // 银台折扣 = 银台折扣 - 其他支付方式优惠（因为php返回的sub_money包含了其他支付方式优惠）
        sub_money = parseFloat(sub_money).toFixed(2);

        // 储值优惠 = 乐币 - 本金
        sts_money = parseFloat(accSubtr(str_money, pri_money)).toFixed(2);

        // 消费金额=实收金额+优惠金额+储值消费
        con_money = parseFloat(accSubtr(accSubtr(order_menu_consume, cancel_menu_consume), rotate_menu_consume)).toFixed(2);

        // 套餐优惠 = order_menu_consume - cancel_menu_consume - give_menu_consume - rotate_menu_consume - consume;
        pac_money = parseFloat(accSubtr(accSubtr(con_money, give_menu_consume), consume)).toFixed(2);

        // 实收金额=现金+银行卡+微信（不含微信退款）+储值本金消费+其他支付方式实收
        // res_money = parseFloat(accAdd(accAdd(accAdd(accAdd(cash, card), wxp_money), pri_money), pay_money)).toFixed(2);
        // 实收金额=现金+银行卡+微信（不含微信退款）+储值本金消费+其他支付方式实收+支付宝
        res_money = parseFloat(accAdd(accAdd(accAdd(accAdd(accAdd(cash, card), wxp_money), pri_money), pay_money), alip_money)).toFixed(2);
        // 优惠金额=会员优惠+抹零+抵用券+银台折扣+套餐优惠+储值赠送消费+赠送+其他支付方式优惠（不含抵用券退款）+ 平台优惠
        dis_money = parseFloat(accAdd(accAdd(accAdd(accAdd(accAdd(accAdd(accAdd(accAdd(sub_user_price, sub_user_discount), small_change), vou_money), sub_money), pac_money), sts_money), give_menu_consume), preferential_money)).toFixed(2);

        use_money = parseFloat((user_num == 0 || user_num == null) ? con_money : accDiv(con_money, user_num)).toFixed(2);

        return {
            'con_money' : con_money,      // 消费金额
            'res_money' : res_money,      // 实收金额
            'dis_money' : dis_money,      // 优惠总金额
            'pac_money' : pac_money,      // 套餐优惠
            'str_money' : str_money,      // 乐币
            'sts_money' : sts_money,      // 储值优惠
            'sub_money' : sub_money,      // 银台折扣
            'pri_money' : pri_money,      // 储值本金消费
            'vou_money' : vou_money,      // 抵用劵金额
            'wxp_money' : wxp_money,      // 微信金额
            'alip_money' : alip_money,    // 支付宝金额
            'use_money' : use_money,      // 人均消费
            're_principal': re_principal, // 退储值本金
            're_stsprgive': re_stsprgive  // 退储值赠送
        };
    }

    // 解决 堆栈 出现的父对象和子对象相关联的问题
    function dishesStackHandle (p, c) {
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

    // 校验数字  num 0:整数，1：非整数
    function checkNum(name, num) {

        var num1 = $('#'+name).val();
        //正则表达式验证必须为数字
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
                //若以0开头，把0替换掉
                $('#'+name).val(num1.replace(/0/,""));
                if(num1.substr(0,1) == '.'){
                    $('#'+name).val(0);
                }
            }
            if (num1 == '') {
                $('#'+name).val(0);
            }
        }else{
            $('#'+name).val(0);
        }
    }
    // 校验数字  num 0:整数，1：非整数
    function checkNumNew(name, num) {

        var num1 = name.val();
        //正则表达式验证必须为数字
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
                //若以0开头，把0替换掉
                $('#'+name).val(num1.replace(/0/,""));
                if(num1.substr(0,1) == '.'){
                    $('#'+name).val(0);
                }
            }
            if (num1 == '') {
                $('#'+name).val(0);
            }
        }else{
            $('#'+name).val(0);
        }
    }

    /* 
    * 判断图片类型 
    *  
    * @param ths  
    *          type="file"的javascript对象 
    * @return true-符合要求,false-不符合 
    */ 
    function checkImgType(ths){
        //alert(ths.value);
        if (ths.value == "") {
            //displayMsg($('#prompt-message'), '请上传图片', 2000);
            return false;
        } else {
            var filetypes =[".jpg",".png"];
            var isnext = false;
            var filepath = ths.value;
            var fileend = filepath.substring(filepath.indexOf("."));
            //alert(fileend);
            if(filetypes && filetypes.length>0){
                for(var i =0; i<filetypes.length;i++){
                    if(filetypes[i] == fileend){
                        isnext = true;
                        break;
                    }
                }
            }
            if(!isnext){
                displayMsg($('#prompt-message'), '图片类型必须是jpg,png中的一种', 3000);
                ths.value ="";
                return false;
            } else {
                //alert(ths.value+'--1');
                //alert(ths.files[0]+'--2');
                var filesize = ths.files[0].size / 1024;
                while(true){
                    //alert(ths.files[0].size+'--tt');
                    if(filesize > 0){
                        //alert('bbbb');
                        if(filesize > 2*1024){
                            displayMsg($('#prompt-message'), '图片不能大于2M。', 2000);
                            ths.value = '';
                            return false;
                        }
                        break;
                    } else {
                        displayMsg($('#prompt-message'), '图片不能是0M。', 2000);
                        ths.value = '';
                        return false;
                    }
                    break;
                }
            }
            /*//var img = null;
            //img = document.createElement("img");
            //document.body.insertAdjacentElement("beforeEnd", img); // firefox不行  
            //img.style.visibility = "hidden";
            //img.src = ths.value;
            var imgwidth = ths.files[0].width;
            var imgheight = ths.files[0].height;
               
            alert(imgwidth + "," + imgheight);
               
            if(imgwidth != 400 || imgheight != 340) {
                alert("图的尺寸应该是400x340");
                ths.value = "";
                return false;
            }*/
        }

        return true;
    }

    // 显示店铺
    function shopList(data) {
        var content = '';
                    
        for (var i in data) {
            content += '<option value="'+data[i].shop_id+'">'+data[i].shop_name+'</option>';
        }
        // 添加到页面中
        $('#shopList').html(content);
    }

    // 点击全选，选中所有的，点击其中某一个，如果这时候是全选就把全选取消 all全部的id
    function selectShopAll(list, select, all) {
         all=all?all:$('#all');
        // 如果所有门店选中了，这时候取消选中某一个门店，所有门店取消选中
        $(list).delegate('input[type="checkbox"]', 'click', function() {
            // 如果点击的是所有门店，就选中所有门店
            if ($(this).attr('name') == 'all') {
                // 找到列表中所有的checkbox，然后循环每个checkbox，
                $(select).each(function(i,val){
                    //如果所有门店 被选中了
                    if(all.is(':checked') || all.attr('checked') == true){
                        $(this).prop('checked',true);
                    } else {
                        $(this).prop('checked',false);
                    }
                });
            } else {
                //如果点击的是其他门店，判断所有门店有没有选中，如果所有门店选中了，就取消所有门店的选中
                if (all.is(':checked')) {
                    all.prop('checked',false);
                } else {
                    var is_checked = 1;
                    // 找到列表中所有的checkbox，然后循环每个checkbox，
                    $(select).each(function(i,val){
                        //如果all没有选中，所有门店 被选中了
                        if((!$(this).is(':checked') || $(this).attr('checked') == false) && $(this).attr('name') != 'all'){
                            is_checked = 0;
                        }
                    });
                    if (is_checked == 1) {
                        all.prop('checked',true);
                    }
                }
            }
        });
    }

    function countCancel(list) {
        $('#show-favorable').html('');
        for (var i = 0; i < list.length; i++) {
            for (var j = 0; j < $('#set-favorable li').length; j++) {
                if (list[i] == $($('#set-favorable li')[j]).text()) {
                    var newli = $($('#set-favorable li')[j]).clone();
                    newli = newli.css('background-color', '#FFFFFF');
                    $('#show-favorable').append(newli);
                }
            }
        }
    }

    function countCancelDis(list) {
        $('#show-dishes').html('');
        for (var i = 0; i < list.length; i++) {
            for (var j = 0; j < $('#set-dishes li').length; j++) {
                if (list[i] == $($('#set-dishes li')[j]).text()) {
                    var newli = $($('#set-dishes li')[j]).clone();
                    newli = newli.css('background-color', '#FFFFFF');
                    $('#show-dishes').append(newli);
                }
            }
        }
    }
    //属性
     function propertyCancelDis(list) {
        $('#show-property').html('');
        for (var i = 0; i < list.length; i++) {
            for (var j = 0; j < $('#set-property li').length; j++) {
                if (list[i] == $($('#set-property li')[j]).text()) {
                    var newli = $($('#set-property li')[j]).clone();
                    newli = newli.css('background-color', '#FFFFFF');
                    $('#show-property').append(newli);
                }
            }
        }
    }

    // 计算方案
    function countSale(ary, element) {
        var inputContent = [];
        if ($('#show-favorable li').length > 0) {
            for (var i = 0; i < $('#show-favorable li').length; i++) {
                ary.push($($('#show-favorable li')[i]).attr('data-value'));
                inputContent.push($($('#show-favorable li')[i]).text());
            }
        }
        if (inputContent.length == 0) {
            inputContent[0] = '全部';
            ary[0] = 'all';
        }
        $(element).val(inputContent.join(','));
    }

    function countSale2(ary, element) {
        var inputContent = [];
        if ($('#show-favorable2 li').length > 0) {
            for (var i = 0; i < $('#show-favorable2 li').length; i++) {
                ary.push($($('#show-favorable2 li')[i]).attr('data-value'));
                inputContent.push($($('#show-favorable2 li')[i]).text());
            }
        }
        if (inputContent.length == 0) {
            inputContent[0] = '全部';
            ary[0] = 'all';
        }
        $(element).val(inputContent.join(','));
    }


    // 计算方案
    function countSaleDis(ary, element) {
        var inputContent = [];
        if ($('#show-dishes li').length > 0) {
            for (var i = 0; i < $('#show-dishes li').length; i++) {
                ary.push($($('#show-dishes li')[i]).attr('data-value'));
                inputContent.push($($('#show-dishes li')[i]).text());
            }
        }
        if (inputContent.length == 0) {
            inputContent[0] = '全部';
            ary[0] = 'all';
        }
        $(element).val(inputContent.join(','));
    }

     // 计算方案属性
    function countPropertySaleDis(ary, element) {
        var inputContent = [];
        if ($('#show-property li').length > 0) {
            for (var i = 0; i < $('#show-property li').length; i++) {
                ary.push($($('#show-property li')[i]).attr('data-value'));
                inputContent.push($($('#show-property li')[i]).text());
            }
        }
        if (inputContent.length == 0) {
            inputContent[0] = '全部';
            ary[0] = 'all';
        }
        $(element).val(inputContent.join(','));
    }

    // 查看是否包含元素
    function isHaveElement(leftDom, rightDom) {
        for (var i = 0; i < $(leftDom).find('li').length; i++) {
            for (var j = 0; j < $(rightDom).find('li').length; j++) {
                if ($($(leftDom).find('li')[i]).text() == $($(rightDom).find('li')[j]).text()) {
                    //$($(leftDom).find('li')[i]).addClass('select').attr('data-selected', 2);
                    $($(leftDom).find('li')[i]).css('background-color', '#FBE04A').attr('data-selected', 2);
                }
            }
        }
    }
    // 店铺选择
    function setFavorableData() {
        // $('#set-favorable > li').each(function () {
        $('#set-favorable > li').unbind('click').bind('click', function () {
            if ($(this).attr('data-value') == 'all') {
                if ($(this).attr('data-selected') == 1) {
                    $('#show-favorable li').remove();
                    $('#set-favorable li').css('background-color', '#FFFFFF').attr('data-selected', 1);
                    $(this).css('background-color', '#FBE04A').attr('data-selected', 2);
                    var that = $(this).clone();
                    that = that.css('background-color', '#FFFFFF');
                    $('#show-favorable').append(that);
                } else {
                    $('#show-favorable').find('li[data-value="all"]').remove();
                    $(this).css('background-color', '#FFFFFF').attr('data-selected', 1);
                }
            } else {
                if ($(this).attr('data-selected') == 1) {
                    $('#show-favorable').find('li[data-value="all"]').remove();
                    $('#set-favorable').find('li[data-value="all"]').css('background-color', '#FFFFFF').attr('data-selected', 1);
                    $(this).css('background-color', '#FBE04A').attr('data-selected', 2);
                    var that = $(this).clone();
                    that = that.css('background-color', '#FFFFFF');
                    $('#show-favorable').append(that);
                } else {
                    $(this).css('background-color', '#FFFFFF').attr('data-selected', 1);
                    $('#show-favorable').find('li[data-value="' + $(this).attr('data-value') + '"]').remove();
                }
            }
        });
        // });
    }

    function setFavorableData1() {
        // $('#set-favorable > li').each(function () {
        $('#set-favorable2 > li').unbind('click').bind('click', function () {
            if ($(this).attr('data-value') == 'all') {
                if ($(this).attr('data-selected') == 1) {
                    $('#show-favorable2 li').remove();
                    $('#set-favorable2 li').css('background-color', '#FFFFFF').attr('data-selected', 1);
                    $(this).css('background-color', '#FBE04A').attr('data-selected', 2);
                    var that = $(this).clone();
                    that = that.css('background-color', '#FFFFFF');
                    $('#show-favorable2').append(that);
                } else {
                    $('#show-favorable2').find('li[data-value="all"]').remove();
                    $(this).css('background-color', '#FFFFFF').attr('data-selected', 1);
                }
            } else {
                if ($(this).attr('data-selected') == 1) {
                    $('#show-favorable2').find('li[data-value="all"]').remove();
                    $('#set-favorable2').find('li[data-value="all"]').css('background-color', '#FFFFFF').attr('data-selected', 1);
                    $(this).css('background-color', '#FBE04A').attr('data-selected', 2);
                    var that = $(this).clone();
                    that = that.css('background-color', '#FFFFFF');
                    $('#show-favorable2').append(that);
                } else {
                    $(this).css('background-color', '#FFFFFF').attr('data-selected', 1);
                    $('#show-favorable2').find('li[data-value="' + $(this).attr('data-value') + '"]').remove();
                }
            }
        });
        // });
    }

    // 店铺选择
    function setFavorableDataDis() {
        $('#set-dishes > li').each(function () {
            $(this).unbind('click').bind('click', function () {
                if ($(this).attr('data-value') == 'all') {
                    if ($(this).attr('data-selected') == 1) {
                        $('#show-dishes li').remove();
                        $('#set-dishes li').css('background-color', '#FFFFFF').attr('data-selected', 1);
                        $(this).css('background-color', '#FBE04A').attr('data-selected', 2);
                        var that = $(this).clone();
                        that = that.css('background-color', '#FFFFFF');
                        $('#show-dishes').append(that);
                    } else {
                        $('#show-dishes').find('li[data-value="all"]').remove();
                        $(this).css('background-color', '#FFFFFF').attr('data-selected', 1);
                    }
                } else {
                    if ($(this).attr('data-selected') == 1) {
                        $('#show-dishes').find('li[data-value="all"]').remove();
                        $('#set-dishes').find('li[data-value="all"]').css('background-color', '#FFFFFF').attr('data-selected', 1);
                        $(this).css('background-color', '#FBE04A').attr('data-selected', 2);
                        var that = $(this).clone();
                        that = that.css('background-color', '#FFFFFF');
                        $('#show-dishes').append(that);
                    } else {
                        $(this).css('background-color', '#FFFFFF').attr('data-selected', 1);
                        $('#show-dishes').find('li[data-value="' + $(this).attr('data-value') + '"]').remove();
                    }
                }
            });
        });
    }
    //店铺选择 属性
    function setPropertyDataDis() {
        $('#set-property > li').each(function () {
            $(this).unbind('click').bind('click', function () {
                if ($(this).attr('data-value') == 'all') {
                    if ($(this).attr('data-selected') == 1) {
                        $('#show-property li').remove();
                        $('#set-property li').css('background-color', '#FFFFFF').attr('data-selected', 1);
                        $(this).css('background-color', '#FBE04A').attr('data-selected', 2);
                        var that = $(this).clone();
                        that = that.css('background-color', '#FFFFFF');
                        $('#show-property').append(that);
                    } else {
                        $('#show-property').find('li[data-value="all"]').remove();
                        $(this).css('background-color', '#FFFFFF').attr('data-selected', 1);
                    }
                } else {
                    if ($(this).attr('data-selected') == 1) {
                        $('#show-property').find('li[data-value="all"]').remove();
                        $('#set-property').find('li[data-value="all"]').css('background-color', '#FFFFFF').attr('data-selected', 1);
                        $(this).css('background-color', '#FBE04A').attr('data-selected', 2);
                        var that = $(this).clone();
                        that = that.css('background-color', '#FFFFFF');
                        $('#show-property').append(that);
                    } else {
                        $(this).css('background-color', '#FFFFFF').attr('data-selected', 1);
                        $('#show-property').find('li[data-value="' + $(this).attr('data-value') + '"]').remove();
                    }
                }
            });
        });
    }

    // 根据时间戳获取年月日时分秒
    function getYMDHMS(time) {
        var year = time.getFullYear(),
            month = time.getMonth() + 1,
            date = time.getDate(),
            hours = time.getHours(),
            minute = time.getMinutes(),
            second = time.getSeconds();

        if (month < 10) { month = '0' + month; }
        if (date < 10) { date = '0' + date; }
        if (hours < 10) { hours = '0' + hours; }
        if (minute < 10) { minute = '0' + minute; }
        if (second < 10) { second = '0' + second; }

        return {
            year: year,
            month: month,
            date: date,
            hours: hours,
            minute: minute,
            second: second
        }
    }

    // 获取当前日期
    function getLocalDate() {
        var times = getYMDHMS(new Date());
        return times.year + "-" + times.month + "-" + times.date;
    }

    // 获取当前年月
    function getLocalYearMonth() {
        var times = getYMDHMS(new Date());
        return times.year + "-" + times.month;
    }
    // 根据传的日期获取
    function getLocalDateTime(time) {
        var times = getYMDHMS(time);
        return times.year + "-" + times.month + "-" + times.date;
    }

    // 时间戳转换年月日
    function getAppointTime(time) {
        var timett = time * 1000;

        var times = getYMDHMS(new Date(timett));
        return times.year + "-" + times.month + "-" + times.date;
    }
    
    // 时间戳转换年月日时秒
    function getAppointTimeSec(time) {
        var timett = time * 1000;

        var times = getYMDHMS(new Date(timett));
        return times.year + "-" + times.month + "-" + times.date + " " + times.hours + ":" + times.minute + ":" + times.second;
    }

    // 时间戳转换年月日时分秒
    function getAppointTimePro(time) {
        var timett = time * 1000;
        var times = getYMDHMS(new Date(timett));
        return times.year + "-" + times.month + "-" + times.date + " " + times.hours + ":" + times.minute + ':' + times.second;
    }




    // 时间戳转换年月日时分秒
    function getReturnTime(time) {
        var timett = time * 1000;
        var times = getYMDHMS(new Date(timett));
        return {
            'timeDate': times.year + "-" + times.month + "-" + times.date + " " + times.hours + ":" + times.minute + ':' + times.second,                           // 年月日时分秒
            'timeDay': times.year + "-" + times.month + "-" + times.date,    // 年月日
            'timeHours': times.hours    // 小时
        };
    }

    // 获取当前年月日时分秒
    function getLocalDateMin() {
        var times = getYMDHMS(new Date());
        return times.year + "-" + times.month + "-" + times.date + " " + times.hours + ":" + times.minute + ":" + times.second;
    }

    // 传入当天0点Date得到显示
    function getLocalDateSecondthis(date) {
        var times = getYMDHMS(date);
        return times.year + "-" + times.month + "-" + times.date + " " + times.hours + ":" + times.minute + ':' + times.second;
    }

    // 时间转化时间戳
    function dateTotTime(str){
        var new_str = str.replace(/:/g,'-');
        new_str = new_str.replace(/ /g,'-');
        var arr = new_str.split("-");
        var datum = new Date(Date.UTC(arr[0],arr[1]-1,arr[2],arr[3]-8,arr[4],arr[5]));
        return strtotime = datum.getTime() / 1000;
    }

    // 菜品统计用
    function getLocalDate_1() {
        var times = getYMDHMS(new Date());
        return {
            'year': times.year,
            'month': times.month,
            'date': times.date,
            'hours': times.hours,
            'minute': times.minute,
            'second': times.second
        };
    }

    // 根据偏移量得到实际开始日期，结束日期
    function getOffsetDateTime() {
        // 营业周期偏移秒数（ 偏移量 time_offset）
        var time_offset = $.cookie('time_offset') == undefined ? 0 : $.cookie('time_offset');//var time_offset = 3600 * 6;
        time_offset = parseFloat(time_offset);
        // 当前时间的time时间戳
        var thisDate = dateTotTime(getLocalDateMin());
        // 今天0点的time时间戳
        var today = new Date();
        today.setHours(0);today.setMinutes(0);today.setSeconds(0);today.setMilliseconds(0);
        var thislingDate = dateTotTime(getLocalDateSecondthis(today));
        // 计算“今天” = 0点时间戳 - ((当前时间戳 - 0点时间戳) > 偏移量 ? 0 : 86400) 86400(24小时)
        var calculation = thislingDate - ((thisDate - thislingDate) > time_offset ? 0 : 86400);
        // 开始日期 = “今天” + 偏移量
        // 结束日期 = “今天” + 偏移量 + 86399(24小时-1秒)
        var start1 = calculation + time_offset;
        var end1 = calculation + time_offset + 86399;

        var end2 = calculation + time_offset + 86400;

        return {
            'start_date': getReturnTime(start1).timeDate,   // 开始日期（年月日时分秒）
            'end_date': getReturnTime(end1).timeDate,       // 结束日期（年月日时分秒）
            'start_day': getReturnTime(start1).timeDay,//getReturnTime(start1).timeDay,     // 开始日期（年月日）
            'end_day': getReturnTime(start1).timeDay,//getReturnTime(end1).timeDay,         // 结束日期（年月日）
            'end_day_2': getReturnTime(end1).timeDay,//getReturnTime(end1).timeDay,         // 结束日期（年月日）
            'start_hours': parseFloat(getReturnTime(start1).timeHours), // 开始时段
            'end_hours': parseFloat(getReturnTime(end1).timeHours)      // 结束时段
        };
    }
    // 根据偏移量得到实际开始日期，结束日期
    function getOffsetDateTime_1() {
        // 营业周期偏移秒数（ 偏移量 time_offset）
        var time_offset = $.cookie('time_offset') == undefined ? 0 : $.cookie('time_offset');//var time_offset = 3600 * 6;
        time_offset = parseFloat(time_offset);
        // 当前时间的time时间戳
        var thisDate = dateTotTime(getLocalDateMin());
        // 今天0点的time时间戳
        var today = new Date();
        today.setHours(0);today.setMinutes(0);today.setSeconds(0);today.setMilliseconds(0);
        var thislingDate = dateTotTime(getLocalDateSecondthis(today));
        // 计算“今天” = 0点时间戳 - ((当前时间戳 - 0点时间戳) > 偏移量 ? 0 : 86400) 86400(24小时)
        var calculation = thislingDate - ((thisDate - thislingDate) > time_offset ? 0 : 86400);
        // 开始日期 = “今天” - 86399(24小时-1秒)
        // 结束日期 = “今天” -1（1秒）
        var start1 = calculation - 86399;
        var end1 = calculation-1;
        return {
            'start_date': getReturnTime(start1).timeDate,   // 开始日期（年月日时分秒）
            'end_date': getReturnTime(end1).timeDate,       // 结束日期（年月日时分秒）
            'start_day': getReturnTime(start1).timeDay,//getReturnTime(start1).timeDay,     // 开始日期（年月日）
            'end_day': getReturnTime(start1).timeDay,//getReturnTime(end1).timeDay,         // 结束日期（年月日）
            'end_day_2': getReturnTime(end1).timeDay,//getReturnTime(end1).timeDay,         // 结束日期（年月日）
            'start_hours': parseFloat(getReturnTime(start1).timeHours), // 开始时段
            'end_hours': parseFloat(getReturnTime(end1).timeHours)      // 结束时段
        };
    }

    // 显示弹出框
    function displayAlertMessage(dom, closeAlertBtn, fn) {
        layerBox = $.layer({
            type: 1,
            shade: [0.6 , '#000' , true],
            title: false,
            closeBtn: false,
            area: ['0px','0px'],
            page: {
                dom: dom
            },
            success: function() {
                if (typeof fn == 'function') {
                    fn();
                }
            }
        });

        // console.log('box' + layerBox);
        // alert('box' + layerBox);

        $(closeAlertBtn).click(function() {
            //alert('ddd');
            layer.close(layerBox);
        });
    }
    $(document).unbind('click').bind('click', function (eve) {
        // if (cn_2 == 0) {
            eve.stopPropagation();
            $('.test_dilog_t,.main_logoin_y').addClass('hide');
        // } else {
            cn_2 = 0;
        // }
        if (layerStrip != false && layerStrip != undefined) {
            is_btnd = 1;
            layer.close(layerStrip);
            layerStrip = false;
            // 结束弹出层，淡出事件
            $('#prompt-message').stop();
        }
    });

    // 绑定键盘事件
    function bind_key () {
        /*$('body').on("focus","input[name='qrCode']",function(){
            document.activeElement.blur();//屏蔽默认键盘弹出；
        });*/
        // 处理点输入框的时候不隐藏键盘弹出层
        
        $(document).unbind('focus').bind('focus', function (eve) {
            eve.stopPropagation();
            $('.test_dilog_t,.main_logoin_y').addClass('hide');
        });

        var input_val;
        // 输入框点击
        $('body').on('click', '.test_key', function (eve) {
            cn_2 = 1;
            eve.stopPropagation();
          // 当前输入框
          input_val = $(this);
          // console.log(input_val.offset().top)
          
          $('.main_logoin_y').addClass('hide');       // 隐藏字母键盘
          
          $('.test_dilog_t').removeClass('hide');     // 显示键盘弹出层
          var offsetWidth = $(this)[0].offsetWidth;   // 输入框宽度
          var offsetHeight = $(this)[0].offsetHeight; // 输入框高度
          var offsetLeft = $(this).offset().left;     // 输入框距左的距离$(this)[0].offsetLeft
          var offsetTop = $(this).offset().top;       // 输入框距上的距离$(this)[0].offsetTop
          var win_width = $(window).width();          // 屏幕宽度
          var win_height = $(window).height();        // 屏幕高度

          // 弹出层距上的距离 = 输入框距上的距离 + 输入框的高度
          var dilog_top = offsetTop+offsetHeight;
          // 弹出层距左的距离 = 输入框距左的距离
          var dilog_left = offsetLeft;
          // 弹出层宽度 = 输入框宽度
          var dilog_width = 330;// offsetWidth
          // 弹出层高度 = 输入框宽度
          var dilog_height = 330;// offsetWidth
          // 弹出层每个按钮宽度 = (弹出层宽度 - 24) / 3
          var dilog_btn_width = (dilog_width - 46) / 3;
          // 弹出层每个按钮高度 = (弹出层高度 - 32) / 4
          var dilog_btn_height = (dilog_height - 58) / 4;

          // 如果屏幕高度 - 输入框距上的距离 - 输入框的高度 - 弹出层的高度 = 负数 就把弹出层弹在输入框的上面，否则弹在下面
          var total = win_height - offsetTop - offsetHeight - dilog_height;
          if (total < 0) {
            // 弹出层距上的距离 = 输入框距上的距离 - 弹出层的高度
            dilog_top = offsetTop - dilog_height - 10;
          }

          // 如果(弹出层距左的距离 + 弹出层宽度) > 屏幕宽度
          if ((dilog_left + dilog_width) > win_width) {
            // 弹出层距左的距离 = 弹出层距左的距离 - (弹出层宽度 - 输入框宽度)
            dilog_left = dilog_left - (dilog_width - offsetWidth);
          }

          /*$('.test_dilog_t').css('width', dilog_width+'px');    // 弹出层宽度
          $('.test_dilog_t').css('height', dilog_height+'px');  // 弹出层高度*/
          $('.test_dilog_t').css('top', dilog_top+'px');        // 弹出层距上的距离
          $('.test_dilog_t').css('left', dilog_left+'px');      // 弹出层距左的距离

          /*$('.test_dilog_t li').css('width', dilog_btn_width+'px');     // 弹出层每个按钮宽度
          $('.test_dilog_t li').css('height', dilog_btn_height+'px');   // 弹出层每个按钮高度
          $('.test_dilog_t li').css('line-height', dilog_btn_height+'px');   // 弹出层每个按钮高度
          $('.test_dilog_t li').css('box-sizing', 'initial');   // 弹出层每个按钮样式*/

          /*// 如果按钮的宽度小于70 ，则调整右下角删除按钮图片位置
          if (dilog_btn_width < 60) {
              $('.test_dilog_t li span[class="del_t"]').css('background', 'url(../../img/base/del.png) no-repeat -4px -9px');
          } else {
            $('.test_dilog_t li span[class="del_t"]').css('background', 'url(../../img/base/del.png) no-repeat');
          }*/
        });
        $('.test_dilog_t').unbind('click').bind('click', function (e) {
          e.stopPropagation();
        });
        $('.test_dilog_t').on('click', 'li', function (e) {
            e.stopPropagation();
          // console.log(1)
          var data_key = $(this).attr('data-key');
          if (data_key == 10) {
            if (input_val.val() == 0 || input_val.val() == '') {
                // input_val.val(0);
            } else {
                input_val.val(input_val.val().slice(0,-1));
            }
            // 触发输入事件
            input_val.trigger("input");
            return;
          } else if (data_key == 'enter') {
            $('.test_dilog_t').addClass('hide');
            return;
          }
          var val = input_val.val() + data_key;
          input_val.val(val);

          // 触发输入事件
          input_val.trigger("input");
        });
    }
     // 绑定全键盘事件
    function bind_total_key () {
        /*$('body').on("focus","input[name='qrCode']",function(){
            document.activeElement.blur();//屏蔽默认键盘弹出；
        });*/
        var input_val;
        // 输入框点击
        $('body').on('click', '.test_total_key', function (eve) {
            cn_2 = 1;
            eve.stopPropagation();
          // 当前输入框
          input_val = $(this);
          // console.log(input_val.offset().top)
          
          $('.test_dilog_t').addClass('hide');        // 隐藏数字键盘

          $('.main_logoin_y').removeClass('hide');    // 显示键盘弹出层
          var offsetWidth = $(this)[0].offsetWidth;   // 输入框宽度
          var offsetHeight = $(this)[0].offsetHeight; // 输入框高度
          var offsetLeft = $(this).offset().left;     // 输入框距左的距离$(this)[0].offsetLeft
          var offsetTop = $(this).offset().top;       // 输入框距上的距离$(this)[0].offsetTop
          var win_width = $(window).width();          // 屏幕宽度
          var win_height = $(window).height();        // 屏幕高度

          // 弹出层距上的距离 = 输入框距上的距离 + 输入框的高度
          var dilog_top = offsetTop+offsetHeight;
          // 弹出层距左的距离 = 输入框距左的距离
          var dilog_left = offsetLeft;
          // 弹出层宽度 = 输入框宽度
          var dilog_width = 663;// offsetWidth
          // 弹出层高度 = 输入框宽度
          var dilog_height = 251;// offsetWidth
          // 弹出层每个按钮宽度 = (弹出层宽度 - 24) / 3
          var dilog_btn_width = (dilog_width - 46) / 3;
          // 弹出层每个按钮高度 = (弹出层高度 - 32) / 4
          var dilog_btn_height = (dilog_height - 58) / 4;

          // 如果屏幕高度 - 输入框距上的距离 - 输入框的高度 - 弹出层的高度 = 负数 就把弹出层弹在输入框的上面，否则弹在下面
          var total = win_height - offsetTop - offsetHeight - dilog_height;
          if (total < 0) {
            // 弹出层距上的距离 = 输入框距上的距离 - 弹出层的高度
            dilog_top = offsetTop - dilog_height - 10;
          }


          // 让全键盘弹出层挨着底部显示
          // dilog_top = win_height - dilog_height - 68;


          // 如果(弹出层距左的距离 + 弹出层宽度) > 屏幕宽度
          if ((dilog_left + dilog_width) > win_width) {
            // 弹出层距左的距离 = 弹出层距左的距离 - (弹出层宽度 - 输入框宽度)
            dilog_left = dilog_left - (dilog_width - offsetWidth);
          }
          
          // 如果弹出层距左的距离 < 0
          if (dilog_left < 0) {
            // 如果弹出层距左的距离 = （屏幕宽度 - 弹出层宽度） / 2
            dilog_left = (win_width - dilog_width) / 2;
          }

          /*$('.main_logoin_y').css('width', dilog_width+'px');    // 弹出层宽度
          $('.main_logoin_y').css('height', dilog_height+'px');  // 弹出层高度*/
          $('.main_logoin_y').css('top', dilog_top+'px');        // 弹出层距上的距离
          $('.main_logoin_y').css('left', dilog_left+'px');      // 弹出层距左的距离

          /*$('.main_logoin_y li').css('width', dilog_btn_width+'px');     // 弹出层每个按钮宽度
          $('.main_logoin_y li').css('height', dilog_btn_height+'px');   // 弹出层每个按钮高度
          $('.main_logoin_y li').css('line-height', dilog_btn_height+'px');   // 弹出层每个按钮高度
          $('.main_logoin_y li').css('box-sizing', 'initial');   // 弹出层每个按钮样式*/

          /*// 如果按钮的宽度小于70 ，则调整右下角删除按钮图片位置
          if (dilog_btn_width < 60) {
              $('.main_logoin_y li span[class="del_t"]').css('background', 'url(../../img/base/del.png) no-repeat -4px -9px');
          } else {
            $('.main_logoin_y li span[class="del_t"]').css('background', 'url(../../img/base/del.png) no-repeat');
          }*/
        });
        $('.main_logoin_y').unbind('click').bind('click', function (e) {
          e.stopPropagation();
        });
        $('.main_logoin_y').on('click', 'li', function (e) {
            e.stopPropagation();
            if (input_val.val() == '输入菜品助记码') {
                input_val.val('');
            }
          // console.log(1)
          var data_key = $(this).attr('data-key');
        if(data_key==12){   // 转换大小写
            var letter = $('.letter');
            var reg = /[A-Z]/;  // 正则的意思是 判断某一个字母是否是大写;
            for(var i=0,len=letter.length;i<len;i++){ // 遍历所有的英文键盘
                var key = letter.eq(i).attr('data-key');  // 获取到每个键盘上对应的英文字母
                if(reg.test(key)) {                       // 如果是大些  就全部转为小写
                    letter.eq(i).attr('data-key',key.toLowerCase());
                    letter.eq(i).find('span').html(key.toLowerCase());
                }else{                                    // 否则 就转换回大写
                    letter.eq(i).attr('data-key',key.toUpperCase());
                    letter.eq(i).find('span').html(key.toUpperCase());
                }
            }
            return;
        }else if (data_key == 10) {
            if (input_val.val() == 0 || input_val.val() == '') {
                // input_val.val(0);
            } else {
                input_val.val(input_val.val().slice(0,-1));
            }
            // 触发输入事件
            input_val.trigger("input");
            return;
        } else if (data_key == 'enter') {
            $('.main_logoin_y').addClass('hide');
            return;
        }
          var val = input_val.val() + data_key;
          input_val.val(val);

          // 触发输入事件
          input_val.trigger("input");
        });
    }
    
    // 显示提示消息
    function displayMsg(dom, description, time, fn) {
        if (is_btnd == 0 || description == '') {
            displayTime(dom, '',0, function () {
                displayTime(dom, description, time, function () {
                    if (fn) {
                        fn();
                    }
                });
            });
            is_btnd = 1;
        } else {
          setTimeout(function () {
            displayTime(dom, '',0, function () {
                displayTime(dom, description, time, function () {
                    if (fn) {
                        fn();
                    }
                });
            });
          }, 200);
          is_btnd = 0;
        }
        /*if (time !== false) {
            $(dom).fadeOut(time, function() {
                $(this).html('');
                layer.close(layerStrip);
                layerStrip = false;

                if (fn) {
                    fn();
                }
            });
        }*/
    }
    function displayTime(dom, description, time, fn) {
        // setTimeout(function () {
          // alert(66666)
        if (layerStrip){
            //alert('bb');
            layer.close(layerStrip);
            layerStrip = false;
        }

        $(dom).html(description).show();
        layerStrip = $.layer({
            type: 1,
            shade: 0,//设置成0则不显示遮罩这样弹出层之外的内容就可以点击//[0 , '#000' , true]
            title: false,
            closeBtn: false,
            area: ['0px','0px'],
            // time: 2,// 自动关闭等待秒数，整数值。0表示不自动关闭，若3秒后自动关闭，time: 3即可
            page: {
                dom: dom
            }
        });

        if (time != 0 && time != false) {
            time = 3000;
        }
        $(dom).fadeOut(time, function() {});
        if (fn) {
            fn();
        }
    }
    // 显示提示消息（这个弹出消息是用的layer内置的时间自动关闭），跟上面的那个区别就是如果当前有弹出层，这个弹出层可以弹在最上面
    function displayMsgTime(dom, description, time, fn) {
        if (is_btnd == 0 || description == '') {
            displayTime(dom, '',0, function () {
                displayTime(dom, description, time, function () {
                    if (fn) {
                        fn();
                    }
                });
            });
            is_btnd = 1;
        } else {
          setTimeout(function () {
            displayTime(dom, '',0, function () {
                displayTime(dom, description, time, function () {
                    if (fn) {
                        fn();
                    }
                });
            });
          }, 200);
          is_btnd = 0;
        }
        /*if (time !== undefined) {
            $(dom).fadeOut(time, function() {
                $(this).html('');
                layer.close(layerStrip);
                layerStrip = false;

                if (fn) {
                    fn();
                }
            });
        }*/
        // alert('strip' + layerStrip);
    }

    // status 0：前后都不显示  1：只在请求前显示  2：只在成功后显示  undefined：前后都显示
    // url: 请求地址
    // data:传给后台的数据
    // dialog 弹出提示框
    // successFn 成功的请求   successAry: 页面请求成功的标志数组
    function setAjax(url, data, dialog, successAry, successFn, status) {
        //alert(successAry[20]);
        if (status == 1 || typeof(status) == 'undefined') {
            displayMsg(dialog, '服务器请求中...请稍候...', false);
        }
        // 获取到cookie里面的cid和URL里面的商户英文名称
        var CID = $.cookie('cid');
        var company_name_en = $.cookie('company_name_en') == undefined ? '' : $.cookie('company_name_en');
        
        if (CID == undefined && url != AdminUrl.userCid) {
            $.ajax({
                type: "POST",
                url: AdminUrl.userCid,
                data: '',
                ifModified: true,
                cache: false,
                // dataType:"json",
                /*crossDomain: true,// 跨域请求用的
                xhrFields:{withCredentials:true},*/
                timeout: 500,
                error: function() {
                    //alert('tt');
                    displayMsg(dialog, '请求服务器失败，请重试！', 2000);
                },
                success: function(respnoseText) {
                    CID = respnoseText.data;
                    $.cookie('cid', CID);
                }
            });
        }
        //alert(CID);
        var page = {
            'cid': CID,
            'company_name_en': company_name_en
        };
        // Jquery的扩展方法extend是我们在写插件的过程中常用的方法，该方法有一些重载原型
        // 它的含义是将src1,src2,src3...合并到dest中,返回值为合并后的dest,由此可以看出该方法合并后，是修改了dest的结构的。
        // 如果想要得到合并的结果却又不想修改dest的结构，可以如下使用：
        // var newSrc=$.extend({},src1,src2,src3...)
        // 也就是将"{}"作为dest参数。这样就可以将src1,src2,src3...进行合并，然后将合并结果返回给newSrc了。
        // 如下例：var result=$.extend({},{name:"Tom",age:21},{name:"Jerry",sex:"Boy"})
        // 那么合并后的结果result={name:"Jerry",age:21,sex:"Boy"}
        // 也就是说后面的参数如果和前面的参数存在相同的名称，那么后面的会覆盖前面的参数值。
        
        var dataAjax = $.extend({}, page, data);
        var ua = navigator.userAgent.toLowerCase();  //判断是否是ipad
        //alert(url);
        $.ajax({
            type: "POST",
            url: url,
            data: dataAjax,
            ifModified: true,
            cache: false,
            // dataType:"json",
            //crossDomain: true,// 跨域请求用的
            //xhrFields:{withCredentials:true},
            timeout: 30000,
            error: function() {
                //alert('tt');
                
                // 报错反馈给box
                if ($.cookie('card_shell') == 1 && url == AdminUrl.userSso) {
                    window.parent.feedback_call(2, 0);
                }

                displayMsg(dialog, '请求服务器失败，请重试！', 2000);
            },
            success: function(respnoseText) {
                if (respnoseText.code == 508) {
                    displayMsg(dialog, respnoseText.message, 2000, function() {
                        window.location.replace(IndexUrl.yintaiUrl);
                    });
                }

                // 405101您需要登录后才能访问,退出登录
                if (respnoseText.code == 405101) {
                    // 指定域名 清除cookie
                    /*$.removeCookie('a_login_time', {path:'/',domain:'.lekabao.net'});
                    $.removeCookie('a_user_id', {path:'/',domain:'.lekabao.net'});
                    $.removeCookie('a_user_mobile', {path:'/',domain:'.lekabao.net'});
                    $.removeCookie('a_user_name', {path:'/',domain:'.lekabao.net'});*/
                    $.removeCookie('a_user', {path: '/'});
                    //layer.close(layerBox);
                    displayMsgTime(ndPromptMsg, respnoseText.message, 2, function () {
                        setTimeout(function() {
                            $.cookie('return_2', 2, {path:'/html',domain:'.lekabao.net'});
                            if ($.cookie('card_shell') == 1) {
                                if(ua.match(/iPad/i)=="ipad") {
                                    window.top.location.href = 'http://cashier.lekabao.net/html/box_ipad.html?v='+version+'&return=2';
                                } else {
                                    window.top.location.href = 'http://cashier.lekabao.net/html/box.html?v='+version+'&return=2';
                                }
                            } else {
                                window.top.location.href = ajax_php_ress+'/html/index.html';
                            }
                        }, 2000);
                    });
                } else if (url != AdminUrl.userInfo && url != AdminUrl.userCid) {
                    $.cookie('return_2', 0, {path:'/html',domain:'.lekabao.net'});
                }

                if (respnoseText.code != 400) {
                    //alert(respnoseText.code);
                    for (var i in successAry) {
                        if (i == respnoseText.code) {
                            if (status == 2) {
                                //alert('ttt');
                                displayMsg(dialog, '', 0, function() {
                                    var message = (successAry[i] != '') ? successAry[i] : respnoseText.message;
                                    displayMsg(dialog, message, 2000, function() {
                                        successFn(respnoseText);
                                    });
                                });
                            } else {
                                //alert('sdfs');
                                displayMsg(dialog, '', 0, function() {
                                    displayMsg(dialog, '', 0, function() {
                                        //alert('bb');
                                        successFn(respnoseText);
                                    });
                                });
                            }
                            return;
                        }
                    }
                }
                   //alert(status); 
                if (status != 0) {
                    if (respnoseText.code != 200) {
                        displayMsg(dialog, respnoseText.message, 2000);
                        return;
                    }
                }
                
                if (status == 2 || typeof(status) == 'undefined') {
                    displayMsg(dialog, respnoseText.message, 500, function() {
                        //alert('bb');
                        successFn(respnoseText);
                    });
                } else {
                    displayMsg(dialog, '', 0, function() {
                        successFn(respnoseText);
                    });
                }

            }
        });
    }


    function arrayToJson(o) {
        var arr = [];
        var fmt = function(s) {
            if (typeof s == 'object' && s != null) return arrayToJson(s);
            return /^(string)$/.test(typeof s) ? '"' + s + '"' : s;
        }
        for (var i in o) arr.push('"' + i + '":' + fmt(o[i]));
        return '{' + arr.join(',') + '}';
    }

    function getQueryString(paras) {
        var url = location.href;
        var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
        var paraObj = {}
        for (i = 0; j = paraString[i]; i++) {
            paraObj[j.substring(0, j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=") + 1, j.length);
        }
        var returnValue = paraObj[paras.toLowerCase()];
        if (typeof returnValue == undefined) {
            return "";
        } else {
            return returnValue;
        }
    }

    // 字母数字验证码
    function alphaNumCode(){
        // 定义验证码
        var code = "";
        //验证码的长度
        var codeLength = 4;
        //alert(codeLength);
        var selectChar = new Array(0,1,2,3,4,5,6,7,8,9,'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z');
              
        for(var i=0;i<codeLength;i++) {
           var charIndex = Math.floor(Math.random()*60);
           //alert(charIndex);
          code +=selectChar[charIndex];
        }

        //alert(selectChar.length);
        if(code.length != codeLength){
            //alert('dd');
          alphaNumCode();
        }
        return code;
    }

    // 汉字验证码
    function textCode(){
        var code = "";
        var codeLength = 4;//验证码的长度

        var selectChar = new Array(2,3,4,5,6,7,8,9,'A','B','C','D','E','F','G','H','J','K','L','M','N','P','Q','R','S','T','U','V','W','X','Y','Z','\u7684','\u4e00','\u4e86','\u662f','\u6211','\u4e0d','\u5728','\u4eba','\u4eec','\u6709','\u6765','\u4ed6','\u8fd9','\u4e0a','\u7740','\u4e2a','\u5730','\u5230','\u5927','\u91cc','\u8bf4','\u5c31','\u53bb','\u5b50','\u5f97','\u4e5f','\u548c','\u90a3','\u8981','\u4e0b','\u770b','\u5929','\u65f6','\u8fc7','\u51fa','\u5c0f','\u4e48','\u8d77','\u4f60','\u90fd','\u628a','\u597d','\u8fd8','\u591a','\u6ca1','\u4e3a','\u53c8','\u53ef','\u5bb6','\u5b66','\u53ea','\u4ee5','\u4e3b','\u4f1a','\u6837','\u5e74','\u60f3','\u751f','\u540c','\u8001','\u4e2d','\u5341','\u4ece','\u81ea','\u9762','\u524d','\u5934','\u9053','\u5b83','\u540e','\u7136','\u8d70','\u5f88','\u50cf','\u89c1','\u4e24','\u7528','\u5979','\u56fd','\u52a8','\u8fdb','\u6210','\u56de','\u4ec0','\u8fb9','\u4f5c','\u5bf9','\u5f00','\u800c','\u5df1','\u4e9b','\u73b0','\u5c71','\u6c11','\u5019','\u7ecf','\u53d1','\u5de5','\u5411','\u4e8b','\u547d','\u7ed9','\u957f','\u6c34','\u51e0','\u4e49','\u4e09','\u58f0','\u4e8e','\u9ad8','\u624b','\u77e5','\u7406','\u773c','\u5fd7','\u70b9','\u5fc3','\u6218','\u4e8c','\u95ee','\u4f46','\u8eab','\u65b9','\u5b9e','\u5403','\u505a','\u53eb','\u5f53','\u4f4f','\u542c','\u9769','\u6253','\u5462','\u771f','\u5168','\u624d','\u56db','\u5df2','\u6240','\u654c','\u4e4b','\u6700','\u5149','\u4ea7','\u60c5','\u8def','\u5206','\u603b','\u6761','\u767d','\u8bdd','\u4e1c','\u5e2d','\u6b21','\u4eb2','\u5982','\u88ab','\u82b1','\u53e3','\u653e','\u513f','\u5e38','\u6c14','\u4e94','\u7b2c','\u4f7f','\u5199','\u519b','\u5427','\u6587','\u8fd0','\u518d','\u679c','\u600e','\u5b9a','\u8bb8','\u5feb','\u660e','\u884c','\u56e0','\u522b','\u98de','\u5916','\u6811','\u7269','\u6d3b','\u90e8','\u95e8','\u65e0','\u5f80','\u8239','\u671b','\u65b0','\u5e26','\u961f','\u5148','\u529b','\u5b8c','\u5374','\u7ad9','\u4ee3','\u5458','\u673a','\u66f4','\u4e5d','\u60a8','\u6bcf','\u98ce','\u7ea7','\u8ddf','\u7b11','\u554a','\u5b69','\u4e07','\u5c11','\u76f4','\u610f','\u591c','\u6bd4','\u9636','\u8fde','\u8f66','\u91cd','\u4fbf','\u6597','\u9a6c','\u54ea','\u5316','\u592a','\u6307','\u53d8','\u793e','\u4f3c','\u58eb','\u8005','\u5e72','\u77f3','\u6ee1','\u65e5','\u51b3','\u767e','\u539f','\u62ff','\u7fa4','\u7a76','\u5404','\u516d','\u672c','\u601d','\u89e3','\u7acb','\u6cb3','\u6751','\u516b','\u96be','\u65e9','\u8bba','\u5417','\u6839','\u5171','\u8ba9','\u76f8','\u7814','\u4eca','\u5176','\u4e66','\u5750','\u63a5','\u5e94','\u5173','\u4fe1','\u89c9','\u6b65','\u53cd','\u5904','\u8bb0','\u5c06','\u5343','\u627e','\u4e89','\u9886','\u6216','\u5e08','\u7ed3','\u5757','\u8dd1','\u8c01','\u8349','\u8d8a','\u5b57','\u52a0','\u811a','\u7d27','\u7231','\u7b49','\u4e60','\u9635','\u6015','\u6708','\u9752','\u534a','\u706b','\u6cd5','\u9898','\u5efa','\u8d76','\u4f4d','\u5531','\u6d77','\u4e03','\u5973','\u4efb','\u4ef6','\u611f','\u51c6','\u5f20','\u56e2','\u5c4b','\u79bb','\u8272','\u8138','\u7247','\u79d1','\u5012','\u775b','\u5229','\u4e16','\u521a','\u4e14','\u7531','\u9001','\u5207','\u661f','\u5bfc','\u665a','\u8868','\u591f','\u6574','\u8ba4','\u54cd','\u96ea','\u6d41','\u672a','\u573a','\u8be5','\u5e76','\u5e95','\u6df1','\u523b','\u5e73','\u4f1f','\u5fd9','\u63d0','\u786e','\u8fd1','\u4eae','\u8f7b','\u8bb2','\u519c','\u53e4','\u9ed1','\u544a','\u754c','\u62c9','\u540d','\u5440','\u571f','\u6e05','\u9633','\u7167','\u529e','\u53f2','\u6539','\u5386','\u8f6c','\u753b','\u9020','\u5634','\u6b64','\u6cbb','\u5317','\u5fc5','\u670d','\u96e8','\u7a7f','\u5185','\u8bc6','\u9a8c','\u4f20','\u4e1a','\u83dc','\u722c','\u7761','\u5174','\u5f62','\u91cf','\u54b1','\u89c2','\u82e6','\u4f53','\u4f17','\u901a','\u51b2','\u5408','\u7834','\u53cb','\u5ea6','\u672f','\u996d','\u516c','\u65c1','\u623f','\u6781','\u5357','\u67aa','\u8bfb','\u6c99','\u5c81','\u7ebf','\u91ce','\u575a','\u7a7a','\u6536','\u7b97','\u81f3','\u653f','\u57ce','\u52b3','\u843d','\u94b1','\u7279','\u56f4','\u5f1f','\u80dc','\u6559','\u70ed','\u5c55','\u5305','\u6b4c','\u7c7b','\u6e10','\u5f3a','\u6570','\u4e61','\u547c','\u6027','\u97f3','\u7b54','\u54e5','\u9645','\u65e7','\u795e','\u5ea7','\u7ae0','\u5e2e','\u5566','\u53d7','\u7cfb','\u4ee4','\u8df3','\u975e','\u4f55','\u725b','\u53d6','\u5165','\u5cb8','\u6562','\u6389','\u5ffd','\u79cd','\u88c5','\u9876','\u6025','\u6797','\u505c','\u606f','\u53e5','\u533a','\u8863','\u822c','\u62a5','\u53f6','\u538b','\u6162','\u53d4','\u80cc','\u7ec6');

        for(var i=0;i<codeLength;i++) {
           var charIndex = Math.floor(Math.random()*550);
           code +=selectChar[charIndex];
        }
        if(code.length != codeLength){
           textCode();
        }
        return code;
    }

    // 处理流水号小于三位数的时候显示001类似
    // function pay_no_he(pay_no) {
    //     if(!pay_no){
    //         return '';
    //     } else if (pay_no < 100) {
    //         if (parseFloat(pay_no).toString().length == 1) {
    //             return '00'+parseFloat(pay_no);
    //         } else if (parseFloat(pay_no).toString().length == 2) {
    //             return '0'+parseFloat(pay_no);
    //         }
    //     } else {
    //         return pay_no;
    //     }
    // }
    function pay_no_he(pay_no) {
        if(!pay_no){
            return '';
        } else {
            return pay_no;
        }
    }
    // 设置出现滚动条时候的高度兼容ipad
    var ua = navigator.userAgent.toLowerCase(); 
    if(ua.match(/iPad/i)=="ipad") { 
        $('.stores-nav').height(accSubtr($.cookie('windowHei'), 112));
        $('.stores-content').height(accSubtr(accSubtr($.cookie('windowHei'), $('.stafffloat').outerHeight()), 102));
        $('.stores-nav').width(accSubtr($.cookie('windowWid'), 220));
        $('.stores-content').width(accSubtr($.cookie('windowWid'), 220));

    }
// ipad高度无止境高控制高度并能拖动
function scrollHei(nav, content, headerH) {
    var ua = navigator.userAgent.toLowerCase();
    var windowHeight = $.cookie('windowHeight');
    var windowWidth = $.cookie('windowWidth');
    if (ua.match(/iPad/i) == "ipad") {
        var navH = accSubtr(windowHeight, 30);
        var nav = $(nav);
        var content = $(content);
        nav.height(navH);
        content.height(accSubtr(navH, $(headerH).outerHeight()));
        nav.width(accSubtr(windowWidth, 220));
        content.width(accSubtr(windowWidth, 220));
        nav.css('overflow', 'hidden');
        content.css('overflow', 'auto');

    }
}


//点击价格策略弹窗的单选按钮将其下面的input等置灰和恢复
function clickradio(value,obj){
    if(value=="自定义" || value == '1')
    {    
        for(var i=0;i<obj.length;i++){                  
            obj[i].disabled=false;                      
        }
    }else{      
        for(var i=0;i<obj.length;i++){                  
            obj[i].disabled=true;                       
        }
    }
}
//星期的数字转换成文字
function weektext(num){
    var num=parseInt(num);
    switch(num){
        case 1: return "周一"; break;
        case 2: return "周二";break;
        case 3: return "周三"; break;
        case 4: return "周四";break;
        case 5: return "周五"; break;
        case 6: return "周六";break;
        case 7: return "周日"; break;
    }
}
function isArray(o){
    return Object.prototype.toString.call(o)=='[object Array]';
}
//价格策略内容遍历
function price_data(obj,type){
    var content_str = '';
    var price_date='',price_week='',hour_time=''; 
    //日期
    if(obj.start_time)
    {
        getAppointTime(obj.start_time) ? " " : obj.start_time = getAppointTime(obj.start_time);
        getAppointTime(obj.end_time) ? " " : obj.end_time = getAppointTime(obj.end_time);
        price_date += obj.start_time+'至'+ obj.end_time; 
    }else{
        price_date="不限";
    }
    //星期
    if(obj.week_day){
        if(!isArray(obj.week_day))
        {
            obj.week_day = obj.week_day.split(',');
        }
        for(var j=0;j<obj.week_day.length;j++){
            if(obj.week_day.length-1 ==j){
                price_week += weektext(obj.week_day[j]);//将数字变成文字
            }else{
                price_week += weektext(obj.week_day[j])+'\、';
            }
        }
    }else{
        price_week="不限";
    }
    //时段
    if(obj.hour_time){
        if(!isArray(obj.hour_time))
        {
            obj.hour_time = obj.hour_time.split(',');
        }        
        for(var k=0;k<obj.hour_time.length;k++){
            if(obj.hour_time.length-1 == k){
                hour_time += obj.hour_time[k]+'时';
            }else{
                hour_time += obj.hour_time[k]+'时至';
            }
        }
    }else{
        hour_time="不限";
    }
    
    content_str += '<tr class="price-tr dishesContent" price-id='+obj.price_id+
    '><td class="report_num addColor" data-type="menuPrice">￥'+obj.menu_price
    +'</td><td class="report_text" data-type="menuType">'+price_date
    +'</td><td class="report_text" data-type="menuType">'+price_week
    +'</td><td class="report_text" data-type="menuType">'+hour_time
    +'</td><td><span class="changeBtn"><input type="button" value="修改" data-type="update" class="stores-caozuo-btn"></span><span><input type="button" value="删除" data-type="delete" class="stores-caozuo-btn"></span></td></tr>';
    return content_str;
}
//修改价格策略/obj当前对象type判断要执行的操作update修改delete删除，1代表价格策略，2代表会员价格策略
function PriceUpdate(obj,type,price_list){
    var priceId =obj.attr('price-id'),
    title_message = '',
    AlertMessage='',
    price_con = new Object(),
    _self=this;
    
    //选择要修改的内容
    for(var i in price_list)
    {
        if(i == priceId){
           price_con = price_list[priceId];
        }
    }
      
    //判断price_con.price_type文字
    if(price_con.price_type == 1){
        title_message = '修改价格策略';
        AlertMessage = '您确定要删除价格策略吗？';
        
    }else{
        title_message = '修改会员价格策略';
        AlertMessage = '您确定要删除该会员价格策略吗？';    
    }  

    if (type == 'update'){//点击修改价格策略 
        //点击保存时是否为修改
        $('#dialog_price_sava_btn').attr('data-type','update');
        //每行的价格的标识
        $('#dialog_price_sava_btn').attr('price-id',priceId);                   
            $('#add_price_strategy').removeClass('hide');
            displayAlertMessage('#add_price_strategy', '#select_close');
            $('.title-text').html(title_message);                                       
            $('#PriceStrategy').val(parseFloat(price_con.menu_price).toFixed(2));
            if(price_con.start_time){                           
                $("#start-date").val(price_con.start_time);
                $("#end-date").val(price_con.end_time);
            }else{
                $('#pricedate').checked = true;
            }
            if(price_con.week_day)
            {
                var boxes=$("input[name='weekcheckbox']");
                for(var i=0; i<boxes.length; i++){
                    for(j=0;j<price_con.week_day.length;j++){
                        if(boxes[i].value == price_con.week_day[j]){
                            boxes[i].checked = true;
                            break;
                        }
                    }
                }
            }else{
                $('#week_radio').checked = true;
            }
            if(price_con.hour_time){
                price_con.hour_time = price_con.hour_time.split(',');
                for(var i=0;i<24;i++){                              
                    $('#hour_stat_select').append('<option value="'+i+'"'+(i==price_con.hour_time[0] ? 'selected="selected"' : '')+'>'+i+'</option>');
                    $('#hour_end_select').append('<option value="'+i+'"'+(i==price_con.hour_time[1] ? 'selected="selected"' : '')+'>'+i+'</option>'); 
                }
            }else{
                $('#hour_radio').checked = true;
                for(var i=0;i<24;i++){                              
                    $('#hour_stat_select').append('<option value="'+i+'">'+i+'</option>');
                    $('#hour_end_select').append('<option value="'+i+'">'+i+'</option>'); 
                }
            }                       
        }else if(type == 'delete'){//点击删除价格策略
            $('#alert-content').html(AlertMessage);
            displayAlertMessage('#alert-message', '#cancel-alert');
            $('#definite-alert').unbind('click').bind('click', function () {
                // 在这里设置一个解除点击事件的代码，因为当到这里的时候会绑定两个点击事件，删除就会运行两次
                //$(self).unbind('click');
                //alert('ttt');
                // 删除价格策略               
               price_list = Picedelete(priceId,price_con.price_type,price_list);   
               layer.close(layerBox);                        
            });
            $('#cancel-alert').unbind('click').bind('click', function () {
                layer.close($('#cancel-alert').parent().parent().parent().parent().parent().attr('times'));
            });
        }
    return price_list;
}
//删除价格策略
//priceId删除那一行的表示 type 1：代表普通价格2：代表会员价格
function Picedelete(priceId,type,priceList){
    
    if(type==1){
        
        $("#PriceContent .price-tr[price-id='"+ priceId +"'").remove();
    }else{
        
        $("#PriceMemberContent .price-tr[price-id='"+ priceId +"'").remove();
    }
    
    for(var i in priceList){
        if(priceList[i].price_id == priceId ){
            delete priceList[i];                    
        }
    }
    if(type==1){
        //如果.price-tr删完将PriceContent隐藏
        if($("#PriceContent .price-tr").length==0){
            $("#PriceContent").addClass('hide');
            layer.close(layerBox);
        }       
    }else{
        //如果.price-tr删完将PriceMemberContent隐藏
        if($("#PriceMemberContent .price-tr").length==0){
            $("#PriceMemberContent").addClass('hide');
            layer.close(layerBox);
        }
       
    }
    displayMsg($('#prompt-message'), '删除成功!', 2000); 
    return priceList;               
}
//添加价格策略保存
//type 1：表示普通价格2：表示会员价格
//dataType update：表示修改，add表示保存
//price_list 价格策略对象
function Pricesave(type,dataType,price_list){
    var price_array = {},_self=this;            
    price_array['price_type'] = type;
    price_array['hour_time'] = "";
    price_array['start_time']="";
    price_array['end_time']="";
    price_array['week_day'] = "";
    //每行的价格的标识
    var priceId = $('#dialog_price_sava_btn').attr('price-id');   
    var pricedate=$("#price_strategy input[name='pricedate']:checked");
    var week_radio=$("#price_strategy input[name='week_radio']:checked");
    var hour_radio=$("#price_strategy input[name='hour_radio']:checked"); 
    
    var integer   = /^[0]\d+$/;//第一位为0正则
    var decimals   = /^(([0-9]+\d*)|([0-9]+\d*\.\d{1,2}))$/;//精确到两位小数正则
    var PriceStrategy = $("#PriceStrategy").val();//价格
    if(PriceStrategy == ""){       
        displayMsg($('#prompt-message'), '价格不能为空', 3000);
        return false;
    }
    if(PriceStrategy < 0){
        displayMsg($('#prompt-message'), '价格不能小于0', 3000);
        return false;
    }
    if(PriceStrategy.indexOf("+") > -1 || isNaN(PriceStrategy)){//数字带+号或者非数字类型
        displayMsg($('#prompt-message'), '价格必须为数字类型', 3000);
        return false;  
    }
    if(integer.test(PriceStrategy)){
        displayMsg($('#prompt-message'), '价格第一位不能为0', 3000);
        return false;      
    }
    price_array.menu_price = parseFloat($('#PriceStrategy').val()).toFixed(2);
    var pricedate = $("input[name='pricedate']:checked").val();//时间选择
    var start_data = $("#start-date").val();
    var end_data = $("#end-date").val();
    if(pricedate == "自定义"){
        if(start_data == ""){
          
            displayMsg($('#prompt-message'), '开始时间不能为空', 3000);
            return false;  
        }
        if(end_data == ""){           
            displayMsg($('#prompt-message'), '结束时间不能为空', 3000);
            return false;  
        }
        if(start_data > end_data){
            
            displayMsg($('#prompt-message'), '结束时间必须大于开始时间', 3000);
            return false;  
        }
        price_array['start_time']=start_data;
        price_array['end_time']=end_data;
    }
    var week_radio = $("input[name='week_radio']:checked").val();
    var weekcheckbox = $("input[name='weekcheckbox']:checked");//星期选择
    if(week_radio == "自定义"){
        if(weekcheckbox.length <= 0){            
            displayMsg($('#prompt-message'), '请选择星期', 3000);
            return false;  
        }else{
           for(var i=0;i<weekcheckbox.length;i++){
                if(i==weekcheckbox.length-1){
                    price_array['week_day'] += weekcheckbox[i].value;
                }else{
                    price_array['week_day'] += weekcheckbox[i].value+',';
                }               
           } 
        }
        
    }
    var hour_radio = $("input[name='hour_radio']:checked").val();//时段选择
    var hourstartselect = $("#hour_stat_select").val();
    var hourendselect = $("#hour_end_select").val();
    if(hour_radio == "自定义"){
        if(hourstartselect == ""){            
            displayMsg($('#prompt-message'), '请选择开始时段', 3000);
            return false;  
        }
        if(hourendselect == ""){            
            displayMsg($('#prompt-message'), '请选择结束时段', 3000);
            return false;  
        }
        if(hourstartselect > hourendselect){            
            displayMsg($('#prompt-message'), '结束时段必须大于开始时段', 3000);
            return false;  
        }
        price_array['hour_time'] = hourstartselect+','+hourendselect;
    }
    //判断是价格的添加和修改还是会员价格的添加和修改
    //1代表价格2代表会员价格 add代表添加，update代表修改
    if(type == 1){
        if(dataType == "add"){  
            price_array['price_id'] = $('#add_price_tbodys tr').length;                                       
            price_list[$('#add_price_tbodys tr').length]=price_array;

             if(check_pice(price_array,price_list)){
                $('#add_price_tbodys').append(price_data(price_array,1));
                layer.close(layerBox);
             }  

        }else if(dataType == "update"){                     
            
            if(check_pice(price_array,price_list)){
                $('#add_price_tbodys').html("");
                for(var i in price_list){
                    if(price_list[i].price_id == priceId ){                    
                        price_list[i] = price_array; 
                        price_list[i]['price_id'] = i;                              
                    }
                }
               
                for(var i in price_list)
                {
                    
                    $('#add_price_tbodys').append(price_data(price_list[i],1));
                }
                layer.close(layerBox);
            } 

        }
        //如果策略列表没有显示
        if($('#PriceContent').hasClass("hide")){
            $('#PriceContent').removeClass("hide");
        }
        return price_list;
    }else if(type == 2){        
        if(dataType == "add"){
            price_array['price_id'] = $('#add_price_tbodys tr').length;                                       
            price_list[$('#add_price_tbodys tr').length]=price_array;
            if(check_pice(price_list,price_list)){
                $('#add_memprice_tbodys').append(price_data(price_array,2));
                layer.close(layerBox);
            }
        }else if(dataType == "update"){                     
            
            if(check_pice(price_array,price_list)){
                $('#add_memprice_tbodys').html("");
                for(var i in price_list){
                    if(price_list[i].price_id == priceId){                   
                        price_list[i] = price_array;
                        price_list[i]['price_id'] = i;
                    }
                }            
                for(var i in price_list)
                {
                   $('#add_memprice_tbodys').append(price_data(price_list[i],2));
                }
                layer.close(layerBox);
            }
            
        }
        //如果策略列表没有显示
        if($('#PriceMemberContent').hasClass("hide")){
            $('#PriceMemberContent').removeClass("hide");
        }
        return price_list;
    }
}
//添加价格策略/obj当前对象,id:1代表价格策略，2代表会员价格策略。
function PriceAdd(obj,id){
    var priceId = obj.attr('price-id'),
    title_message = '',
    AlertMessage='';
    $('#dialog_price_sava_btn').attr('data-type','add');
    if(id == 1){
        title_message = '价格策略';                                 
    }else{
        title_message = '会员价格策略';                               
    }
    $('#add_price_strategy').removeClass('hide');    
    $('.title-text').html(title_message);                           
    for(var i=0;i<24;i++){  
        if(i==0)  {
            $('#hour_stat_select').append('<option value="'+i+'"'+' selected="selected"'+'>'+i+'</option>');
            $('#hour_end_select').append('<option value="'+i+'"'+' selected="selected"'+'>'+i+'</option>'); 
        }else{
            $('#hour_stat_select').append('<option value="'+i+'"'+'>'+i+'</option>');
            $('#hour_end_select').append('<option value="'+i+'"'+'>'+i+'</option>'); 
        } 
    }
    $("#PriceStrategy").val("");
    $("#start-date").val("");
    $("#end-date").val("");             
    var weekcheckbox=$('#weekcheckbox input[name="weekcheckbox"]');
    for(var i=0;i<weekcheckbox.length;i++){
        weekcheckbox[i].checked=false;
    }
    dialog_radio($("#price_strategy input[name='pricedate']"),$('.second-width'));
    dialog_radio($("#price_strategy input[name='week_radio']"),$('#weekcheckbox input[name="weekcheckbox"]'));
    dialog_radio($("#price_strategy input[name='hour_radio']"),$('.hour_select'));
    displayAlertMessage('#add_price_strategy', '#select_close');                
}
//弹框页面的radio重置
//data：需要重置的input框 obj需要置灰的元素
function dialog_radio(data,obj){
    for(var i=0;i<data.length;i++){
        if(data[i].value=="不限"){                        
            data[i].checked="checked";
            clickradio("不限",obj);
        }
    }

}
//验证价格策略的数据
function check_pice(price_array,priceList){  
    if(price_array.start_time){
        if(price_array.start_time>price_array.end_time){
            displayMsg($('#prompt-message'), '开始时间不能大于结束时间', 2000);
            return false;
        }
        if(!price_array.end_time){
            displayMsg($('#prompt-message'), '有开始时间必须有结束时间', 2000);
            return false;
        }            
    }
    if(price_array.end_time){
        if(!price_array.start_time){
            displayMsg($('#prompt-message'), '有结束时间必须有结束时间', 2000);
            return false;
        }    
        if(price_array.start_time>price_array.end_time){
            displayMsg($('#prompt-message'), '开始时间不能大于结束时间', 2000);
            return false;
        }
                
    }
    if(price_array.hour_time){
        if(price_array.hour_time[0] == price_array.hour_time[1]){
            displayMsg($('#prompt-message'), '开始时段不能等于结束时段', 2000);
            return false;
        }
    } 
    for(var key in priceList){
        if(price_array.price_id != priceList[key].price_id){
            if( price_array.start_time == priceList[key].start_time && price_array.end_time == priceList[key].end_time &&
            price_array.hour_time.toString() == priceList[key].hour_time && price_array.week_day.toString() == priceList[key].week_day)
            {
                displayMsg($('#prompt-message'), '菜品价格策略中时间有重复', 2000);
                return false;
            }
        }        
    }                      
    return true;
}
//验证提成数据
function check_sale(obj){
    var integer   = /^[0]\d+$/;//第一位为0正则
    var decimals   = /^(([0-9]+\d*)|([0-9]+\d*\.\d{1,2}))$/;//精确到两位小数正则    
    if(obj < 0){
        displayMsg($('#prompt-message'), '提成不能小于0', 3000);
        return false;
    }
    if(obj.indexOf("+") > -1 || isNaN(obj)){//数字带+号或者非数字类型
        displayMsg($('#prompt-message'), '提成必须为数字类型', 3000);
        return false;  
    }
    if(integer.test(obj)){
        displayMsg($('#prompt-message'), '提成第一位不能为0', 3000);
        return false;      
    }
    return true;
}