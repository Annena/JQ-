$(function () {
    
    // 营业报表
    
    var consumptionToday = 2; //默认今日消费  1。从大到小  2。从小到大
    var paymentToday = 1; //点击今日实收      1。从大到小  2。从小到大
    var ordersNumM = 1; //点击订单数量         1。从大到小  2。从小到大
    var everyConsumption = 1; //点击人均消费  1。从大到小  2。从小到大
    var linshishuju = new Array();

    var page = getQueryString('page');
    var returnd = getQueryString('returnd');
    // var isBusiness = getQueryString('isBusiness');
    var self = this;
    var dayData = ''; // 数据
    var taotalData = {};

    var MerchantHP = {

        init: function() {
            var selfM = this;
            // 默认显示当前日期

            $("#statDate").val(getOffsetDateTime().start_day);
            $("#endDate").val(getOffsetDateTime().end_day);
            // 默认显示数据
            this.selectMember();

            // 绑定点击事件
            this.merchantBindClick();

            //今日消费排序
            $('#consumptionToday').unbind('click').bind('click', function() {
                if (consumptionToday == 1) {
                    $('.botjt').addClass('botjtCurrent')
                    $('.topjt').addClass('topjtCurrent')
                    $('.menu_productSales .topjt').removeClass('topjtCurrent')
                    consumptionToday = 2;
                    paymentToday = 1;
                    ordersNumM = 1;
                    everyConsumption = 1;

                    function Sorts(a, b) {
                        return b.order_menu_consume - a.order_menu_consume;
                    }
                    linshishuju.sort(Sorts);
                    selfM.afterSotr();
                } else if (consumptionToday == 2) {
                    $('.topjt').addClass('topjtCurrent')
                    $('.botjt').addClass('botjtCurrent')
                    $('.menu_productSales .botjt').removeClass('botjtCurrent')
                    consumptionToday = 1;
                    paymentToday = 1;
                    ordersNumM = 1;
                    everyConsumption = 1;

                    function Sorts(a, b) {
                        return a.order_menu_consume - b.order_menu_consume;
                    }
                    linshishuju.sort(Sorts);
                    selfM.afterSotr();
                }
            });
            //今日实收排序
            $('#paymentToday').unbind('click').bind('click', function() {
                if (paymentToday == 1) {
                    $('.topjt').addClass('topjtCurrent')
                    $('.botjt').addClass('botjtCurrent')
                    $('.menu_productSalesCom .topjt').removeClass('topjtCurrent')
                    consumptionToday = 1;
                    paymentToday = 2;
                    ordersNumM = 1;
                    everyConsumption = 1;

                    function Sorts(a, b) {
                        return b.ordersNumM - a.ordersNumM;
                    }
                    linshishuju.sort(Sorts);
                    selfM.afterSotr();

                } else if (paymentToday == 2) {
                    $('.topjt').addClass('topjtCurrent')
                    $('.botjt').addClass('botjtCurrent')
                    $('.menu_productSalesCom .botjt').removeClass('botjtCurrent')
                    consumptionToday = 1;
                    paymentToday = 1;
                    ordersNumM = 1;
                    everyConsumption = 1;

                    function Sorts(a, b) {
                        return a.ordersNumM - b.ordersNumM;
                    }
                    linshishuju.sort(Sorts);
                    selfM.afterSotr();
                }
            });
            //订单数量排序
            $('#ordersNum').unbind('click').bind('click', function() {
                if (ordersNumM == 1) {
                    $('.topjt').addClass('topjtCurrent')
                    $('.botjt').addClass('botjtCurrent')
                    $('.menu_storedSales .topjt').removeClass('topjtCurrent')
                    consumptionToday = 1;
                    paymentToday = 1;
                    ordersNumM = 2;
                    everyConsumption = 1;

                    function Sorts(a, b) {
                        return b.count - a.count;
                    }
                    linshishuju.sort(Sorts);
                    selfM.afterSotr();
                } else if (ordersNumM == 2) {
                    $('.topjt').addClass('topjtCurrent')
                    $('.botjt').addClass('botjtCurrent')
                    $('.menu_storedSales .botjt').removeClass('botjtCurrent')
                    consumptionToday = 1;
                    paymentToday = 1;
                    ordersNumM = 1;
                    everyConsumption = 1;

                    function Sorts(a, b) {
                        return a.count - b.count;
                    }
                    linshishuju.sort(Sorts);
                    selfM.afterSotr();
                }
            });
            //人均消费排序
            $('#everyConsumption').unbind('click').bind('click', function() {
                if (everyConsumption == 1) {
                    $('.topjt').addClass('topjtCurrent')
                    $('.botjt').addClass('botjtCurrent')
                    $('.menu_storedSalesCom .topjt').removeClass('topjtCurrent')
                    consumptionToday = 1;
                    paymentToday = 1;
                    ordersNumM = 1;
                    everyConsumption = 2;

                    function Sorts(a, b) {
                        return b.user_price - a.user_price;
                    }
                    linshishuju.sort(Sorts);
                    selfM.afterSotr();
                } else if (everyConsumption == 2) {
                    $('.topjt').addClass('topjtCurrent')
                    $('.botjt').addClass('botjtCurrent')
                    $('.menu_storedSalesCom .botjt').removeClass('botjtCurrent')
                    consumptionToday = 1;
                    paymentToday = 1;
                    ordersNumM = 1;
                    everyConsumption = 1;

                    function Sorts(a, b) {
                        return a.user_price - b.user_price;
                    }
                    linshishuju.sort(Sorts);
                    selfM.afterSotr();
                }
            });
        },

        // 绑定点击事件
        merchantBindClick: function() {
            var _self = this;

            // 根据日期搜索，点击查询
            $('#memberBtn').unbind('click').bind('click', function() {
                returnd = 2;
                _self.selectMember();
            });

            //下载报表
            $('#downloadbtn').unbind('click').bind('click', function() {
                _self.downloadShop();
            });
        },

       //下载数据
        downloadShop: function () {
            var statDate = $('#statDate').val();
            var endDate = $('#endDate').val();
            var CID = $.cookie('cid');
            var company_name_en = location.href.split("//")[1].split('.')[0];
            if (statDate > endDate) {
                displayMsg(ndPromptMsg, '开始日期应小于结束日期!', 2000);
                return;
            }

            $('#form').attr('action', AdminUrl.menu_count_day_status_download);
            $('#start_date').val(statDate);
            $('#end_date').val(endDate);
            $('#cid').val(CID);
            $('#company_name_en').val(company_name_en);

            setAjax(AdminUrl.menu_count_day_status, {
                'start_date': statDate,
                'end_date': endDate
            }, $('#prompt-message'), {20: ''}, function(respnoseText) {
                var data = respnoseText.data;
                if (respnoseText.code == '20') {
                    $('#form').submit();
                } else {
                    displayMsg(ndPromptMsg, respnoseText.message, 2000);
                }
            }, 0);
        },

        // 显示数据
        selectMember: function() {
            linshishuju = new Array();
            var self = this;

            var statDate = $('#statDate').val();
            var endDate = $('#endDate').val();

            if (statDate > endDate) {
                displayMsg(ndPromptMsg, '开始日期应小于结束日期!', 2000);
                return;
            }
            // 加载数据之前先清空数据
            $('#tbodys').html('');

            if (returnd == 2) {
                setAjax(AdminUrl.menu_count_day_status, {
                    'start_date': statDate,
                    'end_date': endDate
                }, $('#prompt-message'), {20: ''}, function(respnoseText) {
                    var data = respnoseText.data;
                    if (respnoseText.code == '20') {
                        //将数据储存进session
                        sessionStorage.setItem("jsonKey", JSON.stringify(data));
                        var jsonDate = {
                            'start_date': statDate,
                            'end_date': endDate
                        }
                        sessionStorage.setItem("jsonDate", JSON.stringify(jsonDate));
                        self.memberList(data);
                    } else {
                        displayMsg(ndPromptMsg, respnoseText.message, 2000);
                        var totalCon = '<tr>' +
                                            '<td data-type="total" class="text_center text_decoration" colspan="2">小计</td>' +
                                            '<td>0</td>' +
                                            '<td>0</td>' +
                                            '<td>0</td>' +
                                            '<td>0</td>' +
                                        '</tr>';
                        $('#tbodys').html(totalCon);
                    }
                }, 2);
            } else if (returnd == 1) {
                var resultDate = JSON.parse(sessionStorage.getItem("jsonDate"));
                $('#statDate').val(resultDate.start_date);
                $('#endDate').val(resultDate.end_date);
                //进店铺详情返回后不请求接口，请求session数据，跳回管理报表页面删除session
                var result = JSON.parse(sessionStorage.getItem("jsonKey"));
                self.memberList(result);
            }
        },

        // 显示列表数据
        memberList: function(data) {
            var _self = this;
            // 总合计
            var totalContent = '';
            // 菜品分类
            var contentmenu = '';

            //app_count APP订单数   count 订单数量  not_count 未结订单  consume 应收    pay_money 其他支付方式实收  cash 现金 user_num 就餐人数  user_price 人均消费not_consume  未结金额

            taotalData = data.ct;

            // 总合计数据
            var allCt = data.ct; //读取并删除全部合计
            delete data.ct;
            // 分类排名
            var num1 = 0;

            var cancel_menu_consumePro = 0;
            var rotate_menu_consumePro = 0;

            dayData = data;

            var totalpay_money = 0;
            var aa = new Array();

            var shopName = '';

            for (var i in data) {
                var ceshi = parseFloat(accAdd(accSubtr(accSubtr(data[i].order_menu_consume, data[i].cancel_menu_consume), data[i].rotate_menu_consume), data[i].not_consume));
                if (data[i].s_stored_money == 0 && ceshi == 0) {
                    continue;
                }

                num1++;

                var pay_money = 0;
                if (data[i].pay_other != '') {
                    for (var j in data[i].pay_other) {
                        pay_money = accAdd(pay_money, data[i].pay_other[j].pay_money);
                    }
                }

                totalpay_money = accAdd(totalpay_money, pay_money);
                var shop_quick_pay = accSubtr(data[i].principal, data[i].re_principal);
                //订单数量
                ordersNum = accSubtr(accSubtr(accAdd(accAdd(accAdd(accAdd(accAdd(data[i].cash, data[i].card), shop_quick_pay), data[i].wxpay), data[i].alipay), pay_money), data[i].re_wxpay), data[i].re_alipay);
                var order_menu_consumePro = 0;
                order_menu_consumePro = accAdd(accSubtr(accSubtr(data[i].order_menu_consume, data[i].cancel_menu_consume), data[i].rotate_menu_consume), data[i].not_consume);
                if (ordersNum.toString().indexOf('.') > -1) {
                    ordersNum = ordersNum.toString().split('.')[0];
                }
                if (order_menu_consumePro.toString().indexOf('.') > -1) {
                    order_menu_consumePro = order_menu_consumePro.toString().split('.')[0];
                }
                var table_num_t = accAdd(data[i].table_num, (data[i].not_count == null ? 0 : data[i].not_count));

                var user_num_t = accAdd(data[i].user_num, data[i].not_user_num);

                cancel_menu_consumePro = accAdd(cancel_menu_consumePro, data[i].cancel_menu_consume);
                rotate_menu_consumePro = accAdd(rotate_menu_consumePro, data[i].rotate_menu_consume);
                //将json对象转换成json数组，才能用sorts排序       
                bb = { 'shop_name': data[i].shop_name, 'shop_id': data[i].shop_id, 'order_menu_consume': order_menu_consumePro, 'ordersNum': ordersNum, 'table_num': table_num_t, 'user_price': data[i].user_price, 'consume': data[i].consume, 'user_num': user_num_t }
                    //添加sorts数据
                linshishuju = linshishuju.concat(bb);

            }

            var principal = accSubtr(allCt.principal, allCt.re_principal);

            var consume_money = accAdd(accSubtr(accSubtr(allCt.order_menu_consume, cancel_menu_consumePro), rotate_menu_consumePro), allCt.not_consume);
            var con_money = accSubtr(accSubtr(accAdd(accAdd(accAdd(accAdd(accAdd(allCt.cash, allCt.card), principal), allCt.wxpay), allCt.alipay), totalpay_money), allCt.re_wxpay), allCt.re_alipay);

            var user_num_b = accAdd(allCt.user_num, allCt.not_user_num);

            var use_num = user_num_b == 0 ? '0' : accDiv(consume_money, user_num_b);
            if (consume_money.toString().indexOf('.') > -1) {
                consume_money = consume_money.toString().split('.')[0];
            }
            if (con_money.toString().indexOf('.') > -1) {
                con_money = con_money.toString().split('.')[0];
            }
            use_num = use_num.toString();
            if (use_num.toString().indexOf('.') > -1) {
                use_num = use_num.toString().split('.')[0];
            }

            totalContent += '<tr>' +
                                '<td data-type="total" class="text_center text_decoration" colspan="2">小计</td>' +
                                '<td>' + consume_money + '</td>' +
                                '<td>' + con_money + '</td>' +
                                '<td>' + parseFloat(accAdd(allCt.table_num, (allCt.not_count == null ? 0 : allCt.not_count))) + '</td>' +
                                '<td>' + use_num + '</td>' +
                            '</tr>' + contentmenu;
            $('#tbodys').html(totalContent);

            function Sorts(a, b) {
                return b.order_menu_consume - a.order_menu_consume;
            }
            linshishuju.sort(Sorts);
            _self.afterSotr();
        },

        //点击排序后数据
        afterSotr: function() {
            var _self = this;
            var num1 = 0;
            var contentmenu = '';
            $('#tbodys tr[data-type="menuTypeIds"]').remove();
            var beforeHtml = $('#tbodys').html();
            for (var i in linshishuju) {
                num1++;

                var use_num = linshishuju[i].user_num == 0 ? '0' : accDiv(linshishuju[i].order_menu_consume, linshishuju[i].user_num);
                use_num = use_num.toString();
                if (use_num.toString().indexOf('.') > -1) {
                    use_num = use_num.toString().split('.')[0];
                }


                contentmenu += '<tr data-type="menuTypeIds">' +
                                    '<td>' + num1 + '</td>' +
                                    '<td data-type="shop_id" class="text_left" id="' + linshishuju[i].shop_id + '">' + linshishuju[i].shop_name + '</td>' +
                                    '<td data-type="order_menu_consume">' + linshishuju[i].order_menu_consume + '</td>' +
                                    '<td data-type="ordersNum">' + linshishuju[i].ordersNum + '</td>' +
                                    '<td data-type="count">' + parseFloat(linshishuju[i].table_num) + '</td>' +
                                    '<td data-type="user_price">' + use_num + '</td>' +
                                '</tr>';
            }
            $('#tbodys').html(beforeHtml + contentmenu);

            $('#tbodys').find('tr[data-type="menuTypeIds"]').each(function() {
                var self = this;
                $(self).find('td[data-type="shop_id"]').unbind('click').bind('click', function() {

                    var id = $(this).attr('id');
                    //获取点击的指定的数据
                    var cheData = _self.selectData(id);
                    Cache.set('dayData', cheData);
                    window.location.replace('daybusinesDetails.html');
                });
            });
            // 点击小计
            $('#tbodys').find('td[data-type="total"]').unbind('click').bind('click', function() {
                taotalData.shop_name = '小计';
                Cache.set('dayData', taotalData);
                window.location.replace('daybusinesDetails.html');
            });
        },
        // 获取指定的数据
        selectData: function(id) {
            for (var i in dayData) {
                if (id == dayData[i].shop_id) {
                    return dayData[i];
                }
            }
        }
    };

    MerchantHP.init();

});
