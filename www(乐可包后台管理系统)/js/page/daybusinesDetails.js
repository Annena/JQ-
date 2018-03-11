$(function () {

    // 营业报表详情

    var returnd = getQueryString('returnd');
    // 获取字段
    var isBusiness = getQueryString('isBusiness');
    // 获取缓存中详情数据
    var dayData = Cache.get('dayData');
    // alert(dayData);

    $('#daybusines').attr('href', 'daybusinessstate.html?returnd='+returnd);

    var MerchantHP = {
        init: function() {
            var self = this;
            var time_date = getOffsetDateTime().start_day;
            var time_date1 = getOffsetDateTime().end_day;
            if (isBusiness == 1) {
                // $("#daybusines").css("cursor", "default");
                // $("#daybusines").click(function (event) {
                //     event.preventDefault();
                //     return false;
                // })
                $("#shop_name").addClass('hide');
                $("#shop_b").addClass('hide');
                $("#statDate").val(time_date);
                $("#endDate").val(time_date1);

                var a = $.cookie('shop_id');
                 if (a == 'ssssssssssss') {
                    $("#printBtn").addClass("hide");
                } else {

                }
                // 请求查询数据接口
                this.closeBusinessBtn();
            } else {
                var huouqDate = JSON.parse(sessionStorage.getItem("jsonDate"));
                $("#statDate").val(huouqDate.start_date);
                $("#endDate").val(huouqDate.end_date);
                var a = dayData.shop_name;
                // alert(a);
                if (a == '小计') {
                    $("#printDisplay").addClass("hide");
                } else {

                }
                // 显示详情数据
                this.selectShopMembers(dayData);
            }

            // 绑定点击事件
            this.merchantBindClick();
             //下载报表
            $('#downloadbtn').unbind('click').bind('click', function() {
                self.downloadShop();
            });
        },
         // 绑定点击事件
        merchantBindClick: function() {
            var _self = this;

            // 根据日期搜索，点击查询
            $('#memberBtn1').unbind('click').bind('click', function() {
                // alert('AA23456789')
                _self.closeBusinessBtn();
            });

            // 打印报表
            $('#printDisplay').unbind('click').bind('click', function() {
                _self.printShop();
            });

            //下载报表
            // $('#downloadbtn').unbind('click').bind('click', function() {
            //     _self.downloadShop();
            // });
        },

        //下载数据
        downloadShop: function () {
            var resultDate = JSON.parse(sessionStorage.getItem("jsonDate"));

            var CID = $.cookie('cid');
            var company_name_en = location.href.split("//")[1].split('.')[0];
            if (isBusiness == 1) {
                var shop_id = $.cookie('shop_id');
            } else {
                var shop_id = dayData.shop_id;
            }

            $('#form1').attr('action', AdminUrl.menu_count_day_status_download);
            $('#start_date').val(resultDate.start_date);
            $('#end_date').val(resultDate.end_date);
            $('#shop_id').val(shop_id);
            $('#cid').val(CID);
            $('#company_name_en').val(company_name_en);
            

            setAjax(AdminUrl.menu_count_day_status, {
                'start_date': resultDate.start_date,
                'end_date': resultDate.end_date,
                'shop_id': shop_id
            }, $('#prompt-message'), {20: ''}, function(respnoseText) {
                var data = respnoseText.data;
                if (respnoseText.code == '20') {
                    $('#form1').submit();
                } else {
                    displayMsg(ndPromptMsg, respnoseText.message, 2000);
                }
            }, 0);
        },

        //打印数据
        printShop: function () {
            var resultDate = JSON.parse(sessionStorage.getItem("jsonDate"));
            if (isBusiness == 1) {
                var shop_id = $.cookie('shop_id');
            } else {
                var shop_id = dayData.shop_id;
            }
            $('#start_date').val(resultDate.start_date);
            $('#end_date').val(resultDate.end_date);
         
            setAjax(AdminUrl.menu_count_day_status_print, {
                'start_date': resultDate.start_date,
                'end_date': resultDate.end_date,
                'shop_id': shop_id
            }, $('#prompt-message'), {20: ''}, function(respnoseText) {
                var data = respnoseText.data;
                if (respnoseText.code == '20') {
                    // $('#form').submit();
                    displayMsg(ndPromptMsg, respnoseText.message, 2000);
                } else {
                    displayMsg(ndPromptMsg, respnoseText.message, 2000);
                }
            }, 0);
            // alert(123456)
        },

        // 请求数据
        closeBusinessBtn: function () {
                var _self = this;
                var statDate = $('#statDate').val();
                var endDate = $('#endDate').val();
                if (isBusiness == 1) {
                    var shop_id = $.cookie('shop_id'); 
                    // alert(shop_id);
                } else {
                    var shop_id = dayData.shop_id;
                }
                if (shop_id == 'ssssssssssss') {
                    setAjax(AdminUrl.menu_count_day_status, {
                        'start_date': statDate,
                        'end_date': endDate,
                        'shop_id': shop_id
                    }, $('#prompt-message'), {20: ''}, function(respnoseText) {
                        var data = respnoseText.data['ct'];
                        if (respnoseText.code == '20') {
                            _self.selectShopMembers(data);
                            //将数据储存进session
                            sessionStorage.setItem("jsonKey", JSON.stringify(data));
                            var jsonDate = {
                                'start_date': statDate,
                                'end_date': endDate
                            }
                            sessionStorage.setItem("jsonDate", JSON.stringify(jsonDate));
                            // self.memberList(data);
                        } else {
                            displayMsg(ndPromptMsg, respnoseText.message, 2000);
                        }
                    }, 2); 
                } else {
                     // 请求查询接口
                    setAjax(AdminUrl.menu_count_day_status, {
                        'start_date': statDate,
                        'end_date': endDate,
                        'shop_id': shop_id
                    }, $('#prompt-message'), {20: ''}, function(respnoseText) {
                        var data = respnoseText.data[shop_id];
                        if (respnoseText.code == '20') {
                            _self.selectShopMembers(data);
                            //将数据储存进session
                            sessionStorage.setItem("jsonKey", JSON.stringify(data));
                            var jsonDate = {
                                'start_date': statDate,
                                'end_date': endDate
                            }
                            sessionStorage.setItem("jsonDate", JSON.stringify(jsonDate));
                            // self.memberList(data);
                        } else {
                            displayMsg(ndPromptMsg, respnoseText.message, 2000);
                        }
                    }, 2); 
                }
               
        },

        // 显示详情数据
        selectShopMembers: function(data) {
            var seft = this;
            // alert(data.shop_name)
            var shopData = data.shop_name;
            if (shopData == "线上会员") {
                $('#shop_name').text("小计");
            } else {
                $('#shop_name').text(data.shop_name);
            }

            // var shop_id = data.shop_id;

            // 抵用劵金额
            var voucher_money = parseFloat(accSubtr(data.voucher, data.re_voucher)).toFixed(2);
            /*if (voucher_money == 0) {
                $('#voucherDisplay').addClass('hide');
            } else {*/
                $('#voucherDisplay').removeClass('hide');
                $('#voucherMoney').text(voucher_money);
            /*}*/
            // 套餐优惠
            var useMenuDiscount = parseFloat(accSubtr(data.order_menu_consume, (accAdd(accAdd(accAdd(data.cancel_menu_consume, data.give_menu_consume), data.rotate_menu_consume), data.consume)))).toFixed(2);
            /*if (useMenuDiscount == 0) {
                $('#useMenuDiscountDisplay').addClass('hide');
            } else {*/
                $('#useMenuDiscountDisplay').removeClass('hide');
                $('#useMenuDiscount').text(useMenuDiscount);
            /*}*/
            // 银台折扣
            /*if (data.sub_money == 0) {
                $('#sub_moneyDisplay').addClass('hide');
            } else {*/
                $('#sub_moneyDisplay').removeClass('hide');
                $('#sub_money').text(data.sub_money);
            /*}*/
            var stored = accSubtr(data.stored, data.re_stored);
            var principal = accSubtr(data.principal, data.re_principal);
            // 储值赠送消费 = 乐币 - 本金
            var sts_money = parseFloat(accSubtr(stored, principal)).toFixed(2);
            // 储值本金消费 = 储值本金 - 退款本金
            var str_money = parseFloat(accSubtr(data.principal, data.re_principal)).toFixed(2);
            if (sts_money == 0) {
                $('#sts_money').text('0.00');
                //$('#sts_moneyDisplay').addClass('hide');
            } else {
                $('#sts_money').text(sts_money);
            }
            // 储值消费
            $('#p_g_moeny').text(parseFloat(accAdd(str_money, sts_money)).toFixed(2));
            if (str_money == 0) {
                $('#str_money').text('0.00');
                //$('#str_moneyDisplay').addClass('hide');
            } else {
                $('#str_money').text(str_money);
            }
            if (str_money == 0) {
                $('#principal_money').text('0.00');
                //$('#principalDisplay').addClass('hide');
            } else {
                $('#principal_money').text(str_money);
            }
            if (sts_money == 0) {
                $('#give_money').text('0.00');
                //$('#give_moneyDisplay').addClass('hide');
            } else {
                $('#give_money').text(sts_money);
            }
            // 储值金额
            $('#s_money').text(parseFloat(accAdd(data.s_stored_money, data.s_give_money)).toFixed(2));
            // 储值本金
            $('#s_sto_money').text(data.s_stored_money);
            // 储值消费
            $('#s_give_money').text(data.s_give_money);
            // 其他支付方式优惠、实收
            var preferential_money = 0;
            var pay_money = 0;
            var payCont = '';
            var preCont = '';
            var sumCont = '';
            if (data.pay_other != '') {
                var num1 = 0;
                var num2 = 0;
                for (var j in data.pay_other) {
                    if (data.pay_other[j].pay_money != 0) {
                        num1++;
                    }
                    if (data.pay_other[j].preferential_money != 0) {
                        num2++;
                    }
                }
                var num3 = 0;
                var num4 = 0;
                for (var j in data.pay_other) {
                    pay_money = accAdd(pay_money, data.pay_other[j].pay_money);
                    preferential_money = accAdd(preferential_money, data.pay_other[j].preferential_money);
                    // 加载显示数据
                    if (data.pay_other[j].pay_money != 0) {
                        num3 = num3 + 1;
                        var class_pay = 'back_color';
                        if (num1 == num3) {
                            class_pay = 'back_bottom_b';
                        }
                        payCont += '<tr class="haderBr hide ' + class_pay + '" data-type="pay_money">' + '<td class="ileftclass">' + data.pay_other[j].pay_type_name + '</td>' + '<td class="irightclass">' + data.pay_other[j].pay_money + '</td>' + '</tr>';
                        sumCont += '<tr class="haderBr hide ' + class_pay + '" data-type="sum_money">' + '<td class="ileftclass">' + data.pay_other[j].pay_type_name + '</td>' + '<td class="irightclass">' + data.pay_other[j].pay_money + '</td>' + '</tr>';
                    }
                    if (data.pay_other[j].preferential_money != 0) {
                        num4 = num4 + 1;
                        var class_pre = 'back_color';
                        if (num2 == num4) {
                            class_pre = 'back_bottom';
                        }
                        preCont += '<tr class="haderBr hide ' + class_pre + '" data-type="pre_money">' + '<td class="ileftclass">' + data.pay_other[j].pay_type_name + '</td>' + '<td class="irightclass">' + data.pay_other[j].preferential_money + '</td>' + '</tr>';
                    }
                }
            }
            $('[data-type="pay_money"]').remove();
            $('[data-type="sum_money"]').remove();
            $('[data-type="pre_money"]').remove();
            $('#preferential_moneyDisplay').after(preCont);
            $('#other_pay_moneyDisplay').after(payCont);
            $('#summary_pay_moneyDisplay').after(sumCont);

            // 其他支付方式优惠
            preferential_money = parseFloat(preferential_money).toFixed(2);
            if (preferential_money == 0) {
                $('#preferential_moneyDisplay').addClass('hide');
            } else {
                $('#preferential_moneyDisplay').removeClass('hide');
                $('#prefe_money').text(preferential_money);
            }
            // 其他支付方式实收
            pay_money = parseFloat(pay_money).toFixed(2);
            if (pay_money == 0) {
                $('#other_pay_moneyDisplay').addClass('hide');
                $('#summary_pay_moneyDisplay').addClass('hide');
            } else {
                $('#other_pay_moneyDisplay').removeClass('hide');
                $('#summary_pay_moneyDisplay').removeClass('hide');
                $('#other_money').text(pay_money);
                $('#summary_money').text(pay_money);
            }
            // 赠菜金额
            /*if (data.give_menu_consume == 0) {
                $('#give_menu_consumeDisplay').addClass('hide');
            } else {*/
                $('#give_menu_consumeDisplay').removeClass('hide');
                $('#give_menu_consume').text(data.give_menu_consume);
            /*}*/
            // 退菜金额
            /*if (data.cancel_menu_consume == 0) {
                $('#cancel_menu_consumeDisplay').addClass('hide');
            } else {*/
                $('#cancel_menu_consumeDisplay').removeClass('hide');
                $('#cancel_menu_consume').text(data.cancel_menu_consume);
            /*}*/
            // 抹零金额
            /*if (data.small_change == 0) {
                $('#small_changeDisplay').addClass('hide');
            } else {*/
                $('#small_changeDisplay').removeClass('hide');
                $('#small_change').text(data.small_change);
            /*}*/
            //现金
            if (data.s_cash == 0) {
                $('#stored_cash').parent().addClass('hide');
            } else {
                $('#stored_cash').parent().removeClass('hide');
                $('#stored_cash').text(data.s_cash);
            }
            //银行卡
            if (data.s_card == 0) {
                $('#stored_card').parent().addClass('hide');
            } else {
                $('#stored_card').parent().removeClass('hide');
                $('#stored_card').text(data.s_card);
            }
            //免单
            if (data.s_free == 0) {
                $('#stored_free').parent().addClass('hide');
            } else {
                $('#stored_free').parent().removeClass('hide');
                $('#stored_free').text(data.s_free);
            }
            //银台微信
            if (data.s_wxpay_shop == 0) {
                $('#stored_wxpay_shop').parent().addClass('hide');
            } else {
                $('#stored_wxpay_shop').parent().removeClass('hide');
                $('#stored_wxpay_shop').text(data.s_wxpay_shop);
            }
            //在线微信
            if (data.s_wxpay == 0) {
                $('#stored_wxpay').parent().addClass('hide');
            } else {
                $('#stored_wxpay').parent().removeClass('hide');
                $('#stored_wxpay').text(data.s_wxpay);
            }
            //银台支付宝
            if (data.s_alipay_shop == 0) {
                $('#stored_alipay_shop').parent().addClass('hide');
            } else {
                $('#stored_alipay_shop').parent().removeClass('hide');
                $('#stored_alipay_shop').text(data.s_alipay_shop);
            }
            //在线支付宝
            if (data.s_alipay == 0) {
                $('#stored_alipay').parent().addClass('hide');
            } else {
                $('#stored_alipay').parent().removeClass('hide');
                $('#stored_alipay').text(data.s_alipay);
            }
            // 会员价优惠
            $('#sub_user_price').text(data.sub_user_price);
            // 会员折扣优惠
            $('#sub_user_discount').text(data.sub_user_discount);

            // //平台优惠
            // var platform_preferential = parseFloat(accAdd(accAdd(data.sub_mt_pay, data.sub_bd_pay), data.sub_ele_pay));
            // $('#platform_preferential').text(platform_preferential);
                // 今日优惠 = 前面优惠之和
            var dayDiscount = parseFloat(accSubtr(accAdd(accAdd(accAdd(accAdd(accAdd(accAdd(accAdd(accAdd(data.sub_user_price, data.sub_user_discount), data.voucher), useMenuDiscount), data.sub_money), preferential_money), data.give_menu_consume), data.small_change), sts_money), data.re_voucher)).toFixed(2);
            $('#dayDiscount').text(dayDiscount);
            // 今日实收（元）
            // var daypay_money = parseFloat(accSubtr(accAdd(accAdd(accAdd(accAdd(data.cash, data.card), data.wxpay), str_money), pay_money), data.re_wxpay)).toFixed(2);
            var daypay_money = parseFloat(accSubtr(accSubtr(accAdd(accAdd(accAdd(accAdd(accAdd(data.cash, data.card), data.wxpay), str_money), pay_money), data.alipay), data.re_wxpay), data.re_alipay)).toFixed(2);
            $('#pay_money').text(daypay_money);
            var consumePro = parseFloat(accAdd(dayDiscount, daypay_money)).toFixed(2);
            // 今日应收（元）
            $('#consume').text(consumePro);
            // 未结金额（元）
            /*if (data.not_consume == 0) {
                $('#not_consumeDisplay').addClass('hide');
            } else {
                $('#not_consumeDisplay').removeClass('hide');
                $('#not_consume').text(parseFloat(data.not_consume).toFixed(2));
            }*/
            $('#not_consume').text(parseFloat(data.not_consume).toFixed(2));
            var total_consume = accAdd(consumePro, data.not_consume);
            // 销售汇总消费金额
            $('#total_consume').text(parseFloat(total_consume).toFixed(2));
            var total_table_num = accAdd(data.table_num, data.not_count);
            // 桌均消费 = 消费金额 / 开台数量
            var table_money = total_table_num == 0 ? '0.00' : parseFloat(accDiv(total_consume, total_table_num)).toFixed(2);
            $('#table_money').text(table_money);


            // 储值预收
            $('#stored_money').text(data.stored_money);
            // 开台数量
            $('#table_num').text(data.table_num);
            // 就餐人数
            $('#user_num').text(data.user_num);
            // 未结开台数量订单
            $('#not_count').text(data.not_count);
            var not_user_num = data.not_user_num == null ? 0 : data.not_user_num;
            // 未结就餐人数
            $('#not_user_num').text(not_user_num);

            // 销售汇总开台数量
            $('#total_count').text(total_table_num);
            var total_user_num = accAdd(data.user_num, not_user_num);
            // 销售汇总就餐人数
            $('#total_user_num').text(total_user_num);

            var user_price = total_user_num == 0 ? '0.00' : parseInt(accDiv(total_consume, total_user_num));
                // 人均消费 = data.consume / 人数
            $('#user_price').text(user_price);


            // 现金收入（元）
            /*if (data.cash == 0) {
                $('#cashDisplay').addClass('hide');
            } else {*/
                 $('#cashDisplay').removeClass('hide');
                $('#cash').text(data.cash);
            /*}*/
            // 银行卡收入（元）
            /*if (data.card == 0) {
                $('#cardDisplay').addClass('hide');
            } else {*/
                $('#cardDisplay').removeClass('hide');
                $('#card').text(data.card);
            /*}*/
            // 微信支付（元）
            var wxpay = parseFloat(accSubtr(data.wxpay, data.re_wxpay)).toFixed(2);
            /*if (wxpay == 0) {
                $('#wxpayDisplay').addClass('hide');
            } else {*/
                $('#wxpayDisplay').removeClass('hide');
                $('#wxpay').text(wxpay);
            /*}*/
            // 支付宝支付（元）
            var alipay = parseFloat(accSubtr(data.alipay, data.re_alipay)).toFixed(2);
            /*if (alipay == 0) {
                $('#alipayDisplay').addClass('hide');
            } else {*/
                $('#alipayDisplay').removeClass('hide');
                $('#alipay').text(alipay);
            /*}*/
            // // 美团支付（元）
            // var mtpay = parseFloat(accSubtr(data.mt_pay, data.re_mt_pay)).toFixed(2);
            // if (mtpay == 0) {
            //     $('#mtpayDisplay').addClass('hide');
            // } else {
            //     $('#mtpay').text(mtpay);
            // }
            // // 百度支付（元）
            // var bdpay = parseFloat(accSubtr(data.bd_pay, data.re_bd_pay)).toFixed(2);
            // if (bdpay == 0) {
            //     $('#bdpayDisplay').addClass('hide');
            // } else {
            //     $('#bdpay').text(bdpay);
            // }
            // // 饿了么支付（元）
            // var elepay = parseFloat(accSubtr(data.ele_pay, data.re_ele_pay)).toFixed(2);
            // if (elepay == 0) {
            //     $('#elepayDisplay').addClass('hide');
            // } else {
            //     $('#elepay').text(elepay);
            // }
            var all_cash = 0; //汇总现金
            var all_card = 0; //汇总银行卡
            var all_wxpay = 0; //汇总微信
            var all_wxpay_shop = 0; //汇总银台微信
            var all_alipay = 0; //汇总支付宝
            var all_alipay_shop = 0; //汇总银台支付宝

            // var all_mtpay = 0; //汇总美团
            // var all_bdpay = 0; //汇总百度
            // var all_elepay = 0; //汇总饿了么

            var all_money = 0; //金额汇总
            all_cash = parseFloat(accAdd(data.cash, data.s_cash)).toFixed(2);
            all_card = parseFloat(accAdd(data.card, data.s_card)).toFixed(2);
            all_wxpay = parseFloat(accAdd(wxpay, data.s_wxpay)).toFixed(2);

            // all_mtpay = parseFloat(accAdd(mtpay, data.sub_mt_pay)).toFixed(2);
            // all_bdpay = parseFloat(accAdd(bdpay, data.sub_bd_pay)).toFixed(2);
            // all_elepay = parseFloat(accAdd(elepay, data.sub_ele_pay)).toFixed(2);

            all_wxpay_shop = data.s_wxpay_shop;
            all_alipay = parseFloat(accAdd(alipay, data.s_alipay)).toFixed(2);
            all_alipay_shop = data.s_alipay_shop;
            // all_money = parseFloat(accAdd(accAdd(accAdd(accAdd(accAdd(accAdd(accAdd(accAdd(accAdd(all_cash, all_card), all_wxpay_shop), all_wxpay), all_alipay_shop), all_alipay), pay_money), all_mtpay), all_bdpay), all_elepay)).toFixed(2);
            all_money = parseFloat(accAdd(accAdd(accAdd(accAdd(accAdd(accAdd(all_cash, all_card), all_wxpay_shop), all_wxpay), all_alipay_shop), all_alipay), pay_money)).toFixed(2);
            $('#all_cash').text(all_cash);
            $('#all_card').text(all_card);
            $('#all_wxpay').text(all_wxpay);
            $('#all_wxpay_shop').text(all_wxpay_shop);
            $('#all_alipay').text(all_alipay);
            $('#all_alipay_shop').text(all_alipay_shop);

            // $('#all_mtpay').text(all_mtpay);
            // $('#all_bdpay').text(all_bdpay);
            // $('#all_elepay').text(all_elepay);

            $('#summary').text(all_money);

            // APP订单数
            $('#app_count').text(data.app_count);
            var adaptive = document.body.scrollWidth / 23.4375 - 2;
            $('.divclass').attr('style', 'font-size:' + adaptive + 'px;');
            $('#preferential_money').removeClass('icon-upward').addClass('icon-down');
            $('#memberScorll').find('table tr[data-type="pre_money"]').each(function() {
                $(this).addClass('hide');
            }); 
            // 绑定点击其他支付方式优惠点击事件
            $('#preferential_moneyDisplay').unbind('click').bind('click', function() {
                if ($('#preferential_money').is('.icon-down')) {
                    $('#preferential_money').removeClass('icon-down').addClass('icon-upward');
                    $('#memberScorll').find('table tr[data-type="pre_money"]').each(function() {
                        $(this).removeClass('hide');
                    });
                } else {
                    $('#preferential_money').removeClass('icon-upward').addClass('icon-down');
                    $('#memberScorll').find('table tr[data-type="pre_money"]').each(function() {
                        $(this).addClass('hide');
                    });
                }
            });
            $('#other_pay_money').removeClass('icon-upward').addClass('icon-down');
            $('#memberScorll').find('table tr[data-type="pay_money"]').each(function() {
                $(this).addClass('hide');
            });
            // 绑定点击其他支付方式实收点击事件
            $('#other_pay_moneyDisplay').unbind('click').bind('click', function() {
                if ($('#other_pay_money').is('.icon-down')) {
                    $('#other_pay_money').removeClass('icon-down').addClass('icon-upward');
                    $('#memberScorll').find('table tr[data-type="pay_money"]').each(function() {
                        $(this).removeClass('hide');
                    });
                } else {
                    $('#other_pay_money').removeClass('icon-upward').addClass('icon-down');
                    $('#memberScorll').find('table tr[data-type="pay_money"]').each(function() {
                        $(this).addClass('hide');
                    });
                }
            });
            $('#summary_pay_money').removeClass('icon-upward').addClass('icon-down');
            $('#memberScorll').find('table tr[data-type="sum_money"]').each(function() {
                $(this).addClass('hide');
            });
            // 绑定点击其他支付方式实收点击事件
            $('#summary_pay_moneyDisplay').unbind('click').bind('click', function() {
                if ($('#summary_pay_money').is('.icon-down')) {
                    $('#summary_pay_money').removeClass('icon-down').addClass('icon-upward');
                    $('#memberScorll').find('table tr[data-type="sum_money"]').each(function() {
                        $(this).removeClass('hide');
                    });
                } else {
                    $('#summary_pay_money').removeClass('icon-upward').addClass('icon-down');
                    $('#memberScorll').find('table tr[data-type="sum_money"]').each(function() {
                        $(this).addClass('hide');
                    });
                }
            });
            // // 绑定点击平台优惠点击事件
            // $('#platform_preferentialDisplay').unbind('click').bind('click', function() {
            //     if ($('#platform_preferential').is('.icon-down')) {
            //         $('#platform_preferential').removeClass('icon-down').addClass('icon-upward');
            //         $('#memberScorll').find('table tr[data-type="platform_money"]').each(function() {
            //             $(this).removeClass('hide');
            //         });
            //     } else {
            //         $('#platform_preferential').removeClass('icon-upward').addClass('icon-down');
            //         $('#memberScorll').find('table tr[data-type="platform_money"]').each(function() {
            //             $(this).addClass('hide');
            //         });
            //     }
            // });
            $('#s_stored_money').removeClass('icon-upward').addClass('icon-down');
            $('.storedClick').addClass('hide');
            $('#s_stored_money').unbind('click').bind('click', function() {
                if ($('#s_stored_money').is('.icon-down')) {
                    $('#s_stored_money').removeClass('icon-down').addClass('icon-upward');
                    $('.storedClick').each(function() {
                        if ($(this).find('td[data-type="stored"]').text() != 0 && $(this).find('td[data-type="stored"]').text() != '') {
                            $(this).removeClass('hide');
                        }
                    });
                    $('.storedClick:last').css('border-bottom', '1px solid #dfdfdf');
                } else {
                    $('#s_stored_money').removeClass('icon-upward').addClass('icon-down');
                    $('.storedClick').addClass('hide');
                }
            });
        }
    };
    MerchantHP.init();
});
