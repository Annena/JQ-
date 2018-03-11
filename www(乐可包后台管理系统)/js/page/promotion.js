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
    var company_name_en = $.cookie('company_name_en');
    var dayData = ''; // 数据
    var taotalData = {};
    sessionStorage.removeItem("shop_name");
    sessionStorage.removeItem("shop_id");

    // 总合计
    var totalContent = '';

    // 从缓存中得到用户是否有添加修改权限
    var perIsEdit = Cache.get('perIsEdit');

    // 获取到上一页面传递过来的参数 page返回地址，card_id搜索页面跳转过来的id ,listScroll列表滚动

    if (returnd == 3) {
        $("#statDate").val(sessionStorage.getItem("statDate"));
        $("#endDate").val(sessionStorage.getItem("endDate"));
        selectMember();
    } else {
        $("#statDate").val(getOffsetDateTime().start_day);
        $("#endDate").val(getOffsetDateTime().end_day);
    }

    // 判断如果等于undefined说明没有添加修改权限
    if (perIsEdit['下载人员促销报表'] == undefined) {
        $('#downDisplay').addClass('hide');
    } else {
        $('#downDisplay').removeClass('hide');
    }
    

    // 绑定点击事件
    merchantBindClick();

    function merchantBindClick() {
        //下载报表
        $('#downloadbtn').unbind('click').bind('click', function() {
            downloadShop()
        });
        //产品销量
        $('#productSales').unbind('click').bind('click', function() {
            if (productSales == 1) {
                $('.botjt').addClass('botjtCurrent')
                $('.topjt').addClass('topjtCurrent')
                $('.menu_productSales .topjt').removeClass('topjtCurrent')
                productSales = 2
                productSalesCom = 1
                storedSales = 1
                storedSalesCom = 1
                comTotal = 1

                function Sorts(a, b) {
                    return b.menu_sale_num - a.menu_sale_num;
                }
                linshishuju.sort(Sorts);
                afterSotr()
            } else if (productSales == 2) {
                $('.topjt').addClass('topjtCurrent')
                $('.botjt').addClass('botjtCurrent')
                $('.menu_productSales .botjt').removeClass('botjtCurrent')
                productSales = 1
                productSalesCom = 1
                storedSales = 1
                storedSalesCom = 1
                comTotal = 1

                function Sorts(a, b) {
                    return a.menu_sale_num - b.menu_sale_num;
                }
                linshishuju.sort(Sorts);
                afterSotr()
            }
        });
        //销量提成
        $('#productSalesCom').unbind('click').bind('click', function() {
            if (productSalesCom == 1) {
                $('.topjt').addClass('topjtCurrent')
                $('.botjt').addClass('botjtCurrent')
                $('.menu_productSalesCom .topjt').removeClass('topjtCurrent')
                productSales = 1
                productSalesCom = 2
                storedSales = 1
                storedSalesCom = 1
                comTotal = 1

                function Sorts(a, b) {
                    return b.menu_sale_money - a.menu_sale_money;
                }
                linshishuju.sort(Sorts);
                afterSotr()

            } else if (productSalesCom == 2) {
                $('.topjt').addClass('topjtCurrent')
                $('.botjt').addClass('botjtCurrent')
                $('.menu_productSalesCom .botjt').removeClass('botjtCurrent')
                productSales = 1
                productSalesCom = 1
                storedSales = 1
                storedSalesCom = 1
                comTotal = 1

                function Sorts(a, b) {
                    return a.menu_sale_money - b.menu_sale_money;
                }
                linshishuju.sort(Sorts);
                afterSotr()
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
    //下载数据
    function downloadShop() {

        var statDate = $('#statDate').val();
        var endDate = $('#endDate').val();
        var CID = $.cookie('cid');
        var company_name_en = location.href.split("//")[1].split('.')[0];
        if (statDate > endDate) {
            Message.show('#msg', '开始日期应小于结束日期!', 2000);
            return;
        }

        $('#form').attr('action', AdminUrl.promotionDownload);
        $('#start_date').val(statDate);
        $('#end_date').val(endDate);
        $('#cid').val(CID);
        $('#company_name_en').val(company_name_en);

        setAjax(AdminUrl.promotiondian, {
            'start_date': statDate,
            'end_date': endDate
        }, ndPromptMsg, { 20: '' }, function(respnoseText) {
            var data = respnoseText.data;
            if (respnoseText.code == '20') {
                $('#form').submit();
            } else {
                displayMsg(ndPromptMsg, respnoseText.message, 2000);
            }
        }, 0);
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
        //储存时间，带到前后页面
        sessionStorage.setItem("statDate", statDate);
        sessionStorage.setItem("endDate", endDate);
        // 加载数据之前先清空数据
        $('#menuTbodys').html('');
        setAjax(AdminUrl.promotiondian, {
            'start_date': statDate,
            'end_date': endDate,
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
            bb = { 'mendianTicheng': mendianTicheng, 'shop_name': data[i].shop_name, 'shop_id': data[i].shop_id, 'menu_sale_money': data[i].menu_sale_money, 'menu_sale_num': data[i].menu_sale_num, 'stored_sale_money': data[i].stored_sale_money, 'stored_sale_num': data[i].stored_sale_num }
                //添加sorts数据
            linshishuju = linshishuju.concat(bb)
        }

        totalContent += '<tr>' +
            '<td data_name="按员工统计" data-type="total" class="text_decoration leftTd"><u>小计</u></td>' +
            '<td>' + parseFloat(allCt.menu_sale_num).toFixed(1) + '</td>' +
            '<td>' + parseFloat(allCt.menu_sale_money).toFixed(2) + '</td>' +
            '<td>' + parseFloat(allCt.stored_sale_num).toFixed(1) + '</td>' +
            '<td>' + parseFloat(allCt.stored_sale_money).toFixed(2) + '</td>' +
            '<td>' + parseFloat(allTicheng).toFixed(2) + '</td>' +
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
                '<td class="leftTd" data_name="' + linshishuju[i].shop_name + '" data-type="shop_id" id="' + linshishuju[i].shop_id + '"><u>' + linshishuju[i].shop_name + '</u></td>' +
                '<td data-type="menu_sale_num">' + parseFloat(linshishuju[i].menu_sale_num).toFixed(1) + '</td>' +
                '<td data-type="menu_sale_money">' + parseFloat(linshishuju[i].menu_sale_money).toFixed(2) + '</td>' +
                '<td data-type="stored_sale_num">' + parseFloat(linshishuju[i].stored_sale_num).toFixed(1) + '</td>' +
                '<td data-type="stored_sale_money">' + parseFloat(linshishuju[i].stored_sale_money).toFixed(2) + '</td>' +
                '<td>' + parseFloat(mendianTicheng) + '</td>' +
                '</tr>'
        }
        $('#tbodys').html(totalContent + contentmenu)

        $('#tbodys').find('td[data-type="shop_id"]').unbind('click').bind('click', function() {
            var self = this;
            var dianming = $(this).attr('data_name');
            var id = $(this).attr('id');
            sessionStorage.setItem("shop_name", dianming);
            sessionStorage.setItem("shop_id", id)
            window.location.replace('promotionUser.html?data=1&v='+version);
        });
        // 点击小计
        $('#tbodys').find('td[data-type="total"]').unbind('click').bind('click', function() {
            var dianming = $(this).attr('data_name');
            sessionStorage.setItem("shop_name", dianming);
            sessionStorage.setItem("shop_id", '');
            sessionStorage.setItem('is_subtotal', 1);
            window.location.replace('promotionUser.html?data=1&v='+version);
        });
    }

});