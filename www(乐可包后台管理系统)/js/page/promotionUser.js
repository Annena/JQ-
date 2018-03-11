$(function() {
    var productSales = 1; //默认今日消费  1。从大到小  2。从小到大
    var productSalesCom = 1; //点击今日实收      1。从大到小  2。从小到大
    var storedSales = 1; //点击订单数量         1。从大到小  2。从小到大
    var storedSalesCom = 1; //点击人均消费  1。从大到小  2。从小到大
    var comTotal = 1; //点击合计提成    1。从大到下  2。从小到大
    var linshishuju = new Array();

    var page = getQueryString('page');
    var returnd = getQueryString('returnd');
    var self = this;
    var shop_id = sessionStorage.getItem("shop_id");
    var shop_name = sessionStorage.getItem('shop_name');
    sessionStorage.removeItem("user_name");
    sessionStorage.removeItem("user_id");
    var dayData = ''; // 数据
    var taotalData = {};
    // 总合计
    var totalContent = '';
    //显示时间
    $("#statDate").val(sessionStorage.getItem("statDate"));
    $("#endDate").val(sessionStorage.getItem("endDate"));
    $('#shopName').text(shop_name);

    // 绑定点击事件
    merchantBindClick();
    selectMember()

    function merchantBindClick() {
        $('#openPromo').unbind('click').bind('click', function() {
            window.location.replace('promotion.html?returnd=3&v='+version);
        });
        //产品销量
        $('#productSales').unbind('click').bind('click', function() {
            if (productSales == 1) {
                $('.botjt').addClass('botjtCurrent');
                $('.topjt').addClass('topjtCurrent');
                $('.menu_productSales .topjt').removeClass('topjtCurrent');
                productSales = 2;
                productSalesCom = 1;
                storedSales = 1;
                storedSalesCom = 1;
                comTotal = 1;

                function Sorts(a, b) {
                    return b.menu_sale_num - a.menu_sale_num;
                }
                linshishuju.sort(Sorts);
                afterSotr();
            } else if (productSales == 2) {
                $('.topjt').addClass('topjtCurrent');
                $('.botjt').addClass('botjtCurrent');
                $('.menu_productSales .botjt').removeClass('botjtCurrent');
                productSales = 1;
                productSalesCom = 1;
                storedSales = 1;
                storedSalesCom = 1;
                comTotal = 1;

                function Sorts(a, b) {
                    return a.menu_sale_num - b.menu_sale_num;
                }
                linshishuju.sort(Sorts);
                afterSotr();
            }
        });
        //销量提成
        $('#productSalesCom').unbind('click').bind('click', function() {
            if (productSalesCom == 1) {
                $('.topjt').addClass('topjtCurrent');
                $('.botjt').addClass('botjtCurrent');
                $('.menu_productSalesCom .topjt').removeClass('topjtCurrent');
                productSales = 1;
                productSalesCom = 2;
                storedSales = 1;
                storedSalesCom = 1;
                comTotal = 1;

                function Sorts(a, b) {
                    return b.menu_sale_money - a.menu_sale_money;
                }
                linshishuju.sort(Sorts);
                afterSotr();

            } else if (productSalesCom == 2) {
                $('.topjt').addClass('topjtCurrent');
                $('.botjt').addClass('botjtCurrent');
                $('.menu_productSalesCom .botjt').removeClass('botjtCurrent');
                productSales = 1;
                productSalesCom = 1;
                storedSales = 1;
                storedSalesCom = 1;
                comTotal = 1;

                function Sorts(a, b) {
                    return a.menu_sale_money - b.menu_sale_money;
                }
                linshishuju.sort(Sorts);
                afterSotr();
            }
        });
        //储值数量
        $('#storedSales').unbind('click').bind('click', function() {
            if (storedSales == 1) {
                $('.topjt').addClass('topjtCurrent')
                $('.botjt').addClass('botjtCurrent')
                $('.menu_storedSales .topjt').removeClass('topjtCurrent')
                productSales = 1
                productSalesCom = 1
                storedSales = 2
                storedSalesCom = 1
                comTotal = 1

                function Sorts(a, b) {
                    return b.stored_sale_num - a.stored_sale_num;
                }
                linshishuju.sort(Sorts);
                afterSotr()
            } else if (storedSales == 2) {
                $('.topjt').addClass('topjtCurrent')
                $('.botjt').addClass('botjtCurrent')
                $('.menu_storedSales .botjt').removeClass('botjtCurrent')
                productSales = 1
                productSalesCom = 1
                storedSales = 1
                storedSalesCom = 1
                comTotal = 1

                function Sorts(a, b) {
                    return a.stored_sale_num - b.stored_sale_num;
                }
                linshishuju.sort(Sorts);
                afterSotr()
            }
        });
        //储值提成
        $('#storedSalesCom').unbind('click').bind('click', function() {
            if (storedSalesCom == 1) {
                $('.topjt').addClass('topjtCurrent')
                $('.botjt').addClass('botjtCurrent')
                $('.menu_storedSalesCom .topjt').removeClass('topjtCurrent')
                productSales = 1
                productSalesCom = 1
                storedSales = 1
                comTotal = 1
                storedSalesCom = 2

                function Sorts(a, b) {
                    return b.stored_sale_money - a.stored_sale_money;
                }
                linshishuju.sort(Sorts);
                afterSotr()
            } else if (storedSalesCom == 2) {
                $('.topjt').addClass('topjtCurrent')
                $('.botjt').addClass('botjtCurrent')
                $('.menu_storedSalesCom .botjt').removeClass('botjtCurrent')
                productSales = 1
                productSalesCom = 1
                storedSales = 1
                storedSalesCom = 1
                comTotal = 1

                function Sorts(a, b) {
                    return a.stored_sale_money - b.stored_sale_money;
                }
                linshishuju.sort(Sorts);
                afterSotr()
            }
        });
        //点击提成合计
        $('#comTotal').unbind('click').bind('click', function() {
            if (comTotal == 1) {
                $('.topjt').addClass('topjtCurrent')
                $('.botjt').addClass('botjtCurrent')
                $('.menu_comTotal .topjt').removeClass('topjtCurrent')
                productSales = 1
                productSalesCom = 1
                storedSales = 1
                storedSalesCom = 1
                comTotal = 2

                function Sorts(a, b) {
                    return b.mendianTicheng - a.mendianTicheng;
                }
                linshishuju.sort(Sorts);
                afterSotr()
            } else if (comTotal == 2) {
                $('.topjt').addClass('topjtCurrent')
                $('.botjt').addClass('botjtCurrent')
                $('.menu_comTotal .botjt').removeClass('botjtCurrent')
                productSales = 1
                productSalesCom = 1
                storedSales = 1
                storedSalesCom = 1
                comTotal = 1

                function Sorts(a, b) {
                    return a.mendianTicheng - b.mendianTicheng;
                }
                linshishuju.sort(Sorts);
                afterSotr()
            }
        })
        $('#selectbtn').unbind('click').bind('click', function() {
            selectMember()
        })
    }


    // 显示数据
    function selectMember() {
        linshishuju = new Array();

        var statDate = $('#statDate').val();
        var endDate = $('#endDate').val();

        if (statDate > endDate) {
            Message.show('#msg', '开始日期应小于结束日期!', 2000);
            return;
        }
        if (shop_id == null) {
            shop_id = ''
        }
        //储存时间，带到前后页面
        sessionStorage.setItem("statDate", statDate);
        sessionStorage.setItem("endDate", endDate);

        // 加载数据之前先清空数据
        $('#menuTbodys').html('');
        setAjax(AdminUrl.promotionUsre, {
            'start_date': statDate,
            'end_date': endDate,
            'shop_id': shop_id
        }, ndPromptMsg, { 20: '' }, function(respnoseText) {
            var data = respnoseText.data;
            if (respnoseText.code == '20') {
                memberList(data);
            } else {
                displayMsg(ndPromptMsg, respnoseText.message, 2000);
            }
        }, 2);
    }

    // 显示列表数据
    function memberList(data) {
        // 菜品分类
        var contentmenu = '';
        totalContent = '';
        taotalData = data.ct;

        // 总合计数据
        var allCt = data.ct; //读取并删除全部合计
        delete data.ct;
        // 分类排名
        var num1 = 0;

        dayData = data;

        var allTicheng = 0;
        allTicheng = accAdd(allCt.menu_sale_money, allCt.stored_sale_money)
        var aa = new Array()
        var mendianTicheng = 0
        for (var i in data) {
            mendianTicheng = accAdd(data[i].menu_sale_money, data[i].stored_sale_money)
                //将json对象转换成json数组，才能用sorts排序       
            bb = { 'mendianTicheng': mendianTicheng, 'user_name': data[i].a_user_name, 'user_id': data[i].a_user_id, 'menu_sale_money': data[i].menu_sale_money, 'menu_sale_num': data[i].menu_sale_num, 'stored_sale_money': data[i].stored_sale_money, 'stored_sale_num': data[i].stored_sale_num }
                //添加sorts数据
            linshishuju = linshishuju.concat(bb)
        }

        totalContent += '<tr>' +
            '<td data_name="按菜品统计" data-type="total" class="text_decoration leftTd"><u>小计</u></td>' +
            '<td>' + allCt.menu_sale_num + '</td>' +
            '<td>' + parseFloat(allCt.menu_sale_money) + '</td>' +
            '<td>' + parseFloat(allCt.stored_sale_num) + '</td>' +
            '<td>' + parseFloat(allCt.stored_sale_money) + '</td>' +
            '<td>' + parseFloat(allTicheng) + '</td>' +
            '</tr>'

        $('#tbodys').html(totalContent)

        function Sorts(a, b) {
            return b.order_menu_consume - a.order_menu_consume;
        }
        linshishuju.sort(Sorts);
        afterSotr()
    }

    //点击排序后数据
    function afterSotr() {
        var contentmenu = '';
        var mendianTicheng = 0
        $('#tbodys').html('')
        for (var i in linshishuju) {
            mendianTicheng = accAdd(linshishuju[i].menu_sale_money, linshishuju[i].stored_sale_money)
            contentmenu += '<tr>' +
                '<td class="leftTd" data_name="' + linshishuju[i].user_name + '" data-type="user_id" id="' + linshishuju[i].user_id + '"><u>' + linshishuju[i].user_name + '</u></td>' +
                '<td data-type="menu_sale_num">' + linshishuju[i].menu_sale_num + '</td>' +
                '<td data-type="menu_sale_money">' + parseFloat(linshishuju[i].menu_sale_money) + '</td>' +
                '<td data-type="stored_sale_num">' + parseFloat(linshishuju[i].stored_sale_num) + '</td>' +
                '<td data-type="stored_sale_money">' + parseFloat(linshishuju[i].stored_sale_money) + '</td>' +
                '<td>' + parseFloat(mendianTicheng) + '</td>' +
                '</tr>'
        }
        $('#tbodys').html(totalContent + contentmenu)

        $('#tbodys').find('td[data-type="user_id"]').unbind('click').bind('click', function() {
            var self = this;
            var user_name = $(this).attr('data_name');
            var id = $(this).attr('id');
            sessionStorage.setItem("user_name", user_name);
            sessionStorage.setItem("user_id", id);
            window.location.replace('promotionMenu.html?v='+version)
        });
        // 点击小计
        $('#tbodys').find('td[data-type="total"]').unbind('click').bind('click', function() {
            var user_name = $(this).attr('data_name');
            sessionStorage.setItem("user_name", user_name);
            sessionStorage.setItem('user_id', '')
            window.location.replace('promotionMenu.html?v='+version)
        });
    }
});