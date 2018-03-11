$(function () {

    topButtonScroll(".stores-content_1",".out_table_title_1");//无分页
    // 支付对账 lw 2016.3.28
    var menuStatus = 2; //当前选中的标签data-type的值 1:正常 2:反清机
    var $cardTypeContent = $("#nav0-content").find(".tbodys"); //当前显示的内容jQ对象
    var $totalBox = $("#nav0_totalBox"); //汇总部分
    var cleanData = {};  // 存储店铺列表数据变量
    var order_by = 'check_status'; // 排序字段 （add_time, check_status）
    var sort_by = 'DESC'; // 排序顺序 ASC：正序，DESC：倒序
    var epay_mode = 1;//
    $("#start-date").val(getOffsetDateTime().start_day);
    $("#end-date").val(getOffsetDateTime().end_day);
    // 对账状态  0未对账，1对账成功；2无结算记录；3对账失败；4无支付记录
    var account_stat = {
        0: 'color:#666666 !important;',
        1: 'color:#229c15 !important',
        2: 'color:#1654c5 !important',
        3: 'color:#fe2828 !important',
        4: 'color:#f9700c !important'
    };
    var check_status = {
        0: '待对账',
        1: '对账成功',
        2: '无结账记录',
        3: '对账失败',
        4: '无支付记录'
    };
    //var localData = getLocalDateMin();
    var defaults = {
        /*start: localData,
        end: localData,*/
        shop: ['all']
    };
    // 添加滚动条，上下左右可以移动滚动条
    topButtonScroll4(".navContent",".out_table_title");//有分页，

    //获取对账账号选项
    balanceAccount();
    // 绑定点击事件
    CashierBind();

    // 绑定点击事件
    function CashierBind () {

        // //添加切换事件
        $('#nva1').click(function(){
            $('#nva1').addClass('caipin-fenleicheck').siblings('div').removeClass('caipin-fenleicheck').addClass('caipin-fenleinucheck');
            epay_mode = 1 ;

            $('#transaction_div,#download,[data-type="display_1"],#nav0-content,#nav0_search_page').removeClass('hide');
            $('.stores-content_1,#nav1_search_page,#nav1-content').addClass('hide');
            $cardTypeContent = $("#nav0-content").find(".tbodys"); //刷入对应的 内容 Jq对象

            //获取对账账号选项
            balanceAccount();
        });
        $('#nav2').click(function(){
            $('#nav2').addClass('caipin-fenleicheck').siblings('div').removeClass('caipin-fenleicheck').addClass('caipin-fenleinucheck');
            epay_mode = 2;

            $('#transaction_div').addClass('hide');
            $('#download,[data-type="display_1"],#nav1-content,#nav1_search_page').removeClass('hide');
            $('.stores-content_1,#nav0_search_page,#nav0-content').addClass('hide');
            $cardTypeContent = $("#nav1-content").find(".tbodys"); //刷入对应的 内容 Jq对象

            //获取对账账号选项
            balanceAccount();
        });
        $('#nav3').click(function(){
            $('#nav3').addClass('caipin-fenleicheck').siblings('div').removeClass('caipin-fenleicheck').addClass('caipin-fenleinucheck');
            epay_mode = 3;

            $('#transaction_div,#download,[data-type="display_1"],#nav0-content,#nav1-content,#nav0_search_page,#nav1_search_page').addClass('hide');
            $('.stores-content_1').removeClass('hide');

        });
        // 点击搜索
        $('#selectbtn').unbind('click').bind('click', function () {
            if(epay_mode == 3){
                SumList();//储值通用统计
            }else{
                selectCashier();
            }
        });

        // 点击下载
        $('#download').unbind('click').bind('click', function () {
            downloadSelect();
        });

        // 点击店铺
        $('#shopList').unbind('click').bind('click', function () {
            DishesDatashop(cleanData);
        });

        $('.tbodys').delegate('tr', 'click', function(event) {
            var self = this,
                type = $(event.target).attr('data-type'),
                payid = $(self).find('td[data-type="payid"]').text();
            var pa = /.*\((.*)\)/;
            // var payid = payid.match(pa)[1];
            // 点击详情
            if (type == "payid" && payid != '' && payid != '——') {
                // 显示弹出框
                $('#handoveLay').removeClass('hide');
                displayAlertMessage('#handoveLay', '#can-alert');

                setAjax(AdminUrl.recordPayInfo, {
                    'pay_id': payid
                }, $('#prompt-message'), {20: ''}, function(respnoseText) {
                    if (respnoseText.code == 20) {
                        // 得到返回数据
                        var data = respnoseText.data;
                        public_details(data);
                    } else {
                        displayMsg(ndPromptMsg, respnoseText.message, 2000);
                    }
                }, 0);
            }
        });

        //分页标签 切换查询
        $(".search_page").on("click",".home_page",function(){
            var $this = $(this);
            //alert($(this).attr("data-start-date"));
            var searchObj = {  //要传输的参数对象
                start_date : $this.attr("data-start-date"),
                end_date : $this.attr("data-end-date"),
                type : $this.attr("data-type"),
                page : $this.attr("data-page")

            };
            selectCashier (searchObj.page,searchObj);
        });

        //分页输入页数 点击查询部分
        $(".search_page").on("click",".page_go",function(){
            var $this = $(this);
            var $page_just = $(this).siblings(".page_just");
            var _temp = parseInt($page_just.val());
            var maxPage = $page_just.attr("data-page");

            var searchObj = {  //要传输的参数对象
                start_date : $page_just.attr("data-start-date"),
                end_date : $page_just.attr("data-end-date"),
                type : $page_just.attr("data-type")
            };

            if(_temp <= maxPage){
                searchObj.page = _temp
                selectCashier (searchObj.page,searchObj);
            }else{
                displayMsg(ndPromptMsg, '请输入正确的页码', 2000);
            }
        });

        //点击对账状态排序
        $('#account_stat,#account_stat_1').unbind('click').bind('click', function () {
            order_by = 'check_status';
            // order_by // 排序字段 （add_time, check_status）
            // sort_by  // 排序顺序 ASC：正序，DESC：倒序
            if(sort_by == 'DESC'){
                sort_by = 'ASC';
                $(this).find('.botjt').addClass('botjtCurrent');
                $(this).find('.menu_consume .topjt').removeClass('topjtCurrent');
                selectCashier();
            } else if(sort_by == 'ASC'){
                sort_by = 'DESC';
                $(this).find('.menu_consume .botjt').removeClass('botjtCurrent');
                $(this).find('.topjt').addClass('topjtCurrent');
                selectCashier();
            }
        });
        //点击交易时间排序
        $('#transaction,#transaction_2').unbind('click').bind('click', function () {
            order_by = 'add_time';
            // order_by // 排序字段 （add_time, check_status）
            // sort_by  // 排序顺序 ASC：正序，DESC：倒序
            if(sort_by == 'DESC'){
                sort_by = 'ASC';
                $(this).find('.menu_cash .topjt').removeClass('topjtCurrent');
                $(this).find('.botjt').addClass('botjtCurrent');
                selectCashier();
            }else if(sort_by == 'ASC'){
                sort_by = 'DESC';
                $(this).find('.menu_cash .botjt').removeClass('botjtCurrent');
                $(this).find('.topjt').addClass('topjtCurrent');
                selectCashier();
            }
        });
    }

    // 支付对账下载
    function downloadSelect () {
        // 开始时间
        var startDate = $("#start-date").val();
        // 结束时间
        var endDate = $("#end-date").val();
        //对账状态  0未对账，1对账成功；2无结算记录；3对账失败；4无支付记录  全部时传空
        var check_status = $("#check_status  option:selected").val();
        var check_type_2 = $('#check_type').val();
        var transaction_type_2 = $('#transaction_type').val();
        var account_status = $('#account_status').val();
        // 日期
        if ($('#shopList').val() == "全部") {
            defaults.shop = "all";
        }
        if (startDate > endDate) {
            displayMsg(ndPromptMsg, '开始时间应小于结束时间!', 2000);
            return;
        }
        var CID = $.cookie('cid');
        var business = location.href.split("//")[1].split('.')[0];

        $('form').attr('action',AdminUrl.pay_count_wx_order_download);
        $('#start_date_1').val(startDate);
        $('#end_date_1').val(endDate);
        $('#shop_ids').val(defaults.shop);
        $('#check_status_d').val(check_status);
        $('#order').val(order_by);
        $('#sort').val(sort_by);
        $('#page').val(1);
        $('#check_type_2').val(check_type_2);
        $('#transaction_type_2').val(transaction_type_2);
        $('#cid').val(CID);
        $('#company_name_en').val(business);
        $('#account_key_1').val(account_status);
        $('#epay_mode').val(epay_mode);

        setAjax(AdminUrl.pay_count_wx_order_check, {
            'start_time': startDate,
            'end_time' : endDate,
            'page': 1,
            'check_type': check_type_2,
            'type': transaction_type_2,
            'shop_ids': defaults.shop,
            'check_status': check_status,
            'order': order_by,
            'sort': sort_by,
            'account_key': account_status,
            'epay_mode':epay_mode
        }, $('#prompt-message'), {20: ''}, function(respnoseText) {
            if (respnoseText.code == 20) {
                // 下载
                $('form').submit();
            } else {
                displayMsg(ndPromptMsg, respnoseText.message, 2000);
            }
        }, 0);
    }
    // 储值通用统计（储值通用消费明细）
    function SumList() {
        var startDate = $("#start-date").val();
        var endDate = $("#end-date").val();
        setAjax(AdminUrl.sumList, {
            'start_time': startDate,
            'end_time': endDate
        }, $('#prompt-message'), {20: ''}, function(respnoseText) {
            if (respnoseText.code == 20) {
                // 得到返回数据
                var data = respnoseText.data;
                $('#nav0-content').addClass('hide');
                $('#nav0_search_page').addClass('hide');
                $('#nav1-content').addClass('hide');
                $('#nav1_search_page').addClass('hide');

                $('.stores-content_1 .out_table_title_1').removeClass('hide');
                if(data==''){
                    $('#tbodys_2').html('');
                    displayMsg(ndPromptMsg, '没有相关数据信息', 2000);
                }else{
                    Statistics(data);//储值通用统计显示数据
                    $('.out_table_title_1').removeClass('hide');
                }
            } else {
                $('.out_table_title_1').addClass('hide');
                displayMsg(ndPromptMsg, respnoseText.message, 2000);
            }
        }, 1);
    }
    //获取对账账号选项
    function balanceAccount () {

        $('#account_status').val('all');
        $('#shopList').val('全部');
        $('#check_status').val('all');
        $('#check_type').val('all');
        $('#transaction_type').val('all')
        var content_1 = '<option value="all">全部</option>' ;
        // 开始时间
        var startDate = $("#start-date").val();
        // 结束时间
        var endDate = $("#end-date").val();
        //对账状态  0未对账，1对账成功；2无结算记录；3对账失败；4无支付记录  全部时传空
        var check_status = $("#check_status  option:selected").val();
        var check_type_2 = $('#check_type').val();
        var transaction_type_2 = $('#transaction_type').val();
        var accountKey = $('#account_status').val()
        // 日期
        if ($('#shopList').val() == "全部") {
            defaults.shop = "all";
        }
        if (startDate > endDate) {
            displayMsg(ndPromptMsg, '开始时间应小于结束时间!', 2000);
            return;
        }
        setAjax(AdminUrl.pay_count_wx_order_check, {
            'start_time': startDate,
            'end_time' : endDate,
            'page': 1,
            'shop_ids': defaults.shop,
            'check_status': check_status,
            'check_type': check_type_2,
            'type': transaction_type_2,
            'order': order_by,
            'sort': sort_by,
            'account_key': accountKey,
            'epay_mode':epay_mode
        }, $('#prompt-message'), {20: ''}, function(respnoseText) {
            var data = respnoseText.data;
            cleanData = data;
            for(var i in data.account_list){
                content_1 += '<option value="'+i+'">'+data.account_list[i].mch_name+'</option>'
            }
            $('#account_status').html(content_1);
            // 点击店铺
            $('#shopList').unbind('click').bind('click', function () {
                DishesDatashop(data);

            });


        }, 1);
    }

    // 获取店铺列表
    function DishesDatashop (data) {
        var account_status = $('#account_status').val()
        var listContent = '<li data-value="all" data-selected="1">全部</li>';
        for (var i in data.account_list) {
            if(i==account_status || account_status == 'all'){
                for(var t in data.account_list[i].shop_list){
                    listContent += '<li data-value="' + data.account_list[i].shop_list[t].shop_id + '" data-selected="1">' + data.account_list[i].shop_list[t].shop_name + '</li>';
                }
            }
        }
        $('#set-favorable').html(listContent);
        $('#favorable-title').html('店铺选择');
        isHaveElement('#set-favorable', '#show-favorable');
        setFavorableData();
        displayAlertMessage('#favorable-message', '');

        $('#cancel-favorable').unbind('click').bind('click', function () {
            defaults.shop = [];
            layer.close(layerBox);
            countCancel(($('#shopList').val().split(',')));
            countSale(defaults.shop, '#shopList');
        });

        $('#definite-favorable').unbind('click').bind('click', function () {
            defaults.shop = [];
            layer.close(layerBox);
            countSale(defaults.shop, '#shopList');
        });
    }

    // 搜索显示门店的分页部分
    function selectCashier (thePage,searchObj) {//thepage是请求的第几页

        // 搜索显示数据之前先清空数据
        $cardTypeContent.html('');
        // 开始时间
        var startDate = $("#start-date").val();
        // 结束时间
        var endDate = $("#end-date").val();
        // 清单类型
        var selectType = epay_mode;
        //对账状态  0未对账，1对账成功；2无结算记录；3对账失败；4无支付记录  全部时传空
        var check_status = $("#check_status  option:selected").val();
        var check_type_2 = $('#check_type').val();
        var transaction_type_2 = $('#transaction_type').val();
        var account_status = $('#account_status').val();
        //清单对应的分页标签
        var $searchPage;
        switch(selectType){
            case 1:
                $searchPage = $("#nav0_search_page");
                break;
            case 2:
                $searchPage = $("#nav1_search_page");
                break;
        }

        //如果是分页请求就替换相应值
        if(searchObj){
            startDate = searchObj.start_date;
            endDate = searchObj.end_date;
            selectType = searchObj.type;
        }

        if (startDate > endDate) {
            //ndPromptMsg公用提示条
            displayMsg(ndPromptMsg, '开始时间应小于结束时间!', 2000);
            return;
        }

        if ($('#shopList').val() == "全部") {
            defaults.shop = "all";
        }

        // order_by // 排序字段 （add_time, check_status）
        // sort_by  // 排序顺序 ASC：正序，DESC：倒序

        //分页信息用的参数
        var pageObj = {
            'start_date': startDate,  //开始时间
            'end_date' : endDate,     //结束时间
            'page': thePage||1,       //请求的页数
            '$search_page': $searchPage,  //分页对应的分页位置
            'shop_ids': defaults.shop,
            'check_status': check_status,
            'check_type': check_type_2,
            'transaction_type': transaction_type,
            'type': selectType,
            'order': order_by,
            'sort': sort_by,
            'account_key': account_status,
            'epay_mode':epay_mode
        };
        setAjax(AdminUrl.pay_count_wx_order_check, {
            'start_time': startDate,
            'end_time' : endDate,
            'page': thePage||1,
            'shop_ids': defaults.shop,
            'check_status': check_status,
            'check_type': check_type_2,
            'type': transaction_type_2,
            'order': order_by,
            'sort': sort_by,
            'account_key': account_status,
            'epay_mode':epay_mode

        }, $('#prompt-message'), {20: ''}, function(respnoseText) {
            $('.stores-content_1 .out_table_title_1').addClass('hide');
            if (respnoseText.code == 20 && respnoseText.data.order_list != '') {
                // 显示出来页面的标题
                if (selectType == 1) {
                    $('#nav0-content .out_table_title').removeClass('hide');
                    $('#nav0-content .Records_content').removeClass('hide');
                    $('#table2Dispaly').removeClass('hide');
                    $('#nav0_search_page').removeClass('hide');
                } else {
                    $('#nav1-content .out_table_title').removeClass('hide');
                    $('#nav1-content .Records_content').removeClass('hide');
                    $('#table3Dispaly').removeClass('hide');
                    $('#nav1_search_page').removeClass('hide');
                }
                // 得到返回数据
                var data = respnoseText.data;
                CashierList(data,$cardTypeContent,pageObj,$totalBox); //数据,对应的JQ包裹div,请求页面的信息,总计对应的div
            } else {
                if (selectType == 1) {
                    $('#nav0-content .out_table_title').addClass('hide');
                    $('#nav0-content .Records_content').addClass('hide');
                    $('#table2Dispaly').addClass('hide');
                    $('#nav0_search_page').addClass('hide');
                } else {
                    $('#nav1-content .out_table_title').addClass('hide');
                    $('#nav1-content .Records_content').addClass('hide');
                    $('#table3Dispaly').addClass('hide');
                    $('#nav1_search_page').addClass('hide');
                }
                if (respnoseText.data && respnoseText.data.order_list == '') {
                    displayMsg(ndPromptMsg, '暂无数据！', 2000);
                } else {
                    displayMsg(ndPromptMsg, respnoseText.message, 2000);
                }
            }
        }, 0);
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
                class_cl = 'grayLine';
            }
            return class_cl;
        }
    }
    //显示储值通用对账表格信息
    function Statistics (data){

        var _self = this;

        // 总合计
        var totalContent = '';
        // 菜品分类
        var contentmenu = '';
        // 菜品数据
        var content = '';
        var theCt = {}; //用于存放分类合计

        // 总合计数据
        var allCt = data.ct; //读取并删除全部合计
        // allCt.menu_num = parseFloat(allCt.menu_num);
        // var jingshoubi = accSubtr(accSubtr(allCt.original_price,allCt.give_money),allCt.discount_money)
        // delete data.ct;

        // 分类排名
        var num1 = 0;
        var num = 0;
        var color = '';//颜色
        for (var i in data) {

            //读取并删除分类合计
            theCt = data[i].ct;
            // var theCtjingshoubi = accSubtr(accSubtr(theCt.original_price,theCt.give_money),theCt.discount_money)
            // theCt.menu_num = parseFloat(theCt.menu_num);
            // delete data[i].ct;

            content = '';
            // 列表排名


            for (var j in data[i]) {


                if(j!='ct'){
                    // console.log(data[i][j])

                    content += '<tr>'+
                        '<td width="6.3%"></td>'+
                        '<td width="12.3%" class="report_text">'+data[i][j].shop_name+'</td>'+
                        // '<td width="8.3%" class="report_num  ">'+(data[i][j].order_stored==0?'————':data[i][j].order_stored)+'</td>'+
                        '<td width="8.3%" class="report_num '+ ClassColor(data[i][j].pay_stored)+'">'+(data[i][j].pay_stored==0?'————':data[i][j].pay_stored)+'</td>'+
                        '<td width="8.3%" class="report_num '+ ClassColor(data[i][j].pay_principal)+'">'+(data[i][j].pay_principal==0?'————':data[i][j].pay_principal)+'</td>'+
                        '<td width="8.3%" class="report_num '+ ClassColor(data[i][j].order_stored)+'">'+(data[i][j].order_stored==0?'————':data[i][j].order_stored)+'</td>'+
                        '<td width="8.3%" class="report_num '+ ClassColor(data[i][j].order_principal)+'">'+(data[i][j].order_principal==0?'————':data[i][j].order_principal)+'</td>'+
                        '<td width="8.3%" class="report_num '+ ClassColor(data[i][j].order_stored_refund)+'">'+(data[i][j].order_stored_refund==0?'————':data[i][j].order_stored_refund)+'</td>'+
                        '<td width="8.3%" class="report_num '+ ClassColor(data[i][j].order_principal_refund)+'">'+(data[i][j].order_principal_refund==0?'————':data[i][j].order_principal_refund)+'</td>'+
                        '<td width="8.3%" class="report_num '+ ClassColor(data[i][j].pay_stored_refund)+'">'+(data[i][j].pay_stored_refund==0?'————':data[i][j].pay_stored_refund)+'</td>'+
                        '<td width="8.3%" class="report_num  '+ ClassColor(data[i][j].pay_principal_refund)+'">'+(data[i][j].pay_principal_refund==0?'————':data[i][j].pay_principal_refund)+'</td>'+
                        '<td width="8.3%" class="report_num '+ ClassColor(data[i][j].sum_stored)+'">'+(data[i][j].sum_stored==0?'————':data[i][j].sum_stored)+'</td>'+ //对账金额储值
                        '<td width="8.3%" class="report_num '+ ClassColor(data[i][j].sum_principal)+'">'+(data[i][j]    .sum_principal==0?'————':data[i][j].sum_principal)+'</td>'+ //对账金额本金
                        '</tr>';

                }
            }

            if(i!='ct'){
                num++;
                contentmenu += '<div class="content_classify" data-type="menuTypeIds">'+
                    '<table class="nav_content_classify" cellspacing="0" cellpadding="0"  data-type="menuType">'+
                    '<tr>'+
                    '<td width="6.3%">'+num+'</td>'+
                    '<td width="12.3%" class="report_text">'+data[i].ct.card_name+'</td>'+

                    '<td width="8.3%" class="report_num '+ ClassColor(data[i].ct.pay_stored)+'">'+(data[i].ct.pay_stored==0?'————':data[i].ct.pay_stored)+'</td>'+
                    '<td width="8.3%" class="report_num '+ ClassColor(data[i].ct.pay_principal)+'">'+(data[i].ct.pay_principal==0?'————':data[i].ct.pay_principal)+'</td>'+
                    '<td width="8.3%" class="report_num '+ ClassColor(data[i].ct.order_stored)+'">'+(data[i].ct.order_stored==0?'————':data[i].ct.order_stored)+'</td>'+
                    '<td width="8.3%" class="report_num '+ClassColor(data[i].ct.order_principal)+'">'+(data[i].ct.order_principal==0?'————':data[i].ct.order_principal)+'</td>'+
                    '<td width="8.3%" class="report_num  '+ ClassColor(data[i].ct.order_stored_refund)+'">'+(data[i].ct.order_stored_refund==0?'————':data[i].ct.order_stored_refund)+'</td>'+
                    '<td width="8.3%" class="report_num '+ ClassColor(data[i].ct.order_principal_refund)+'">'+(data[i].ct.order_principal_refund==0?'————':data[i].ct.order_principal_refund)+'</td>'+
                    '<td width="8.3%" class="report_num '+ ClassColor(data[i].ct.pay_stored_refund)+'">'+(data[i].ct.pay_stored_refund==0?'————':data[i].ct.pay_stored_refund)+'</td>'+
                    '<td width="8.3%" class="report_num '+ ClassColor(data[i].ct.pay_principal_refund)+'">'+(data[i].ct.pay_principal_refund==0?'————':data[i].ct.pay_principal_refund)+'</td>'+
                    '<td width="8.3%" class="report_num '+ ClassColor(data[i].ct.sum_stored)+'">'+(data[i].ct.sum_stored==0?'————':data[i].ct.sum_stored)+'</td>'+ //对账金额储值
                    '<td width="8.3%" class="report_num '+ ClassColor(data[i].ct.sum_principal)+'">'+(data[i].ct.sum_principal==0?'————':data[i].ct.sum_principal)+'</td>'+ //对账金额本金
                    '</tr>'+
                    '</table>'+
                    '<table class="con_content_classify" data-type="menuList" cellspacing="0" cellpadding="0" style="display: none;">'+content+'</table>'+
                    '</div>';
            }
        }
        // 总合计
        totalContent += '<div class="content_classify">'+
            '<table class="nav_content_classify" cellspacing="0" cellpadding="0">'+
            '<tr>'+
            '<td width="6.3%"></td>'+
            '<td width="12.3%" class="report_text">合计</td>'+

            '<td width="8.3%" class="report_num '+ ClassColor(allCt.pay_stored)+'">'+(allCt.pay_stored==0?'————':allCt.pay_stored)+'</td>'+
            '<td width="8.3%" class="report_num '+ ClassColor(allCt.pay_principal)+'">'+(allCt.pay_principal==0?'————':allCt.pay_principal)+'</td>'+
            '<td width="8.3%" class="report_num '+ ClassColor(allCt.order_stored)+'">'+(allCt.order_stored==0?'————':allCt.order_stored)+'</td>'+
            '<td width="8.3%" class="report_num '+ ClassColor(allCt.order_principal)+'">'+(allCt.order_principal==0?'————':allCt.order_principal)+'</td>'+
            '<td width="8.3%" class="report_num '+ ClassColor(allCt.order_stored_refund)+'">'+(allCt.order_stored_refund==0?'————':allCt.order_stored_refund)+'</td>'+
            '<td width="8.3%" class="report_num '+ ClassColor(allCt.order_principal_refund)+'">'+(allCt.order_principal_refund==0?'————':allCt.order_principal_refund)+'</td>'+
            '<td width="8.3%" class="report_num '+ ClassColor(allCt.pay_stored_refund)+'">'+(allCt.pay_stored_refund==0?'————':allCt.pay_stored_refund)+'</td>'+
            '<td width="8.3%" class="report_num '+ ClassColor(allCt.pay_principal_refund)+'">'+(allCt.pay_principal_refund==0?'————':allCt.pay_principal_refund)+'</td>'+
            '<td width="8.3%" class="report_num '+ ClassColor(allCt.sum_stored)+'">'+(allCt.sum_stored==0?'————':allCt.sum_stored)+'</td>'+ //对账金额储值
            '<td width="8.3%" class="report_num '+ ClassColor(allCt.sum_principal)+'">'+(allCt.sum_principal==0?'————':allCt.sum_principal)+'</td>'+ //对账金额本金
            '</tr>'+
            '</table>'+
            '</div>'+contentmenu;

        // 添加到页面中
        $('#tbodys_2').html(totalContent);

        $('#tbodys_2').find('div[data-type="menuTypeIds"]').each(function () {
            var self = this;
            $(self).find('table[data-type="menuType"]').unbind('click').bind('click', function () {
                $(self).find('table[data-type="menuList"]').stop().toggle('hide');
            });
        });
    }

    //分离创建表头表单头部信息,返回原有data
    function tableHead(data,pageObj,$tbodys,$theTotalBox){
        //合计
        var ct = data.ct; //合计部分
        delete data.ct;

        //多少页   
        var page = data.pages;//总共页数 
        delete data.pages;

        //tableHead部分   
        var ctNumArr = []; //解析出对应位置 ct1fjdkjhrxm
        var ctToNameArr = []; //解析出支付方式对应的中文名字 微信

        //自定义支付方式的id号和对应中文
        var payDict = ct.pay_other;
        delete ct.pay_other;


        //var ctNum = 0; //位置计数
        var thMap=[];
        var _srt = '';
        for (var i in data) { //这个是根据页面当前的自定义付款方式显示,删除对应st开头字符串
            _srt = i.slice(0,2);
            if(_srt == 'ct'){
                //ctNumArr.push(i);
                //ctToNameArr.push(data[i]);
                delete data[i.toString()];
            }
        }


        //生成th部分
        var content = ''; //表头空文件
        var content1 = '';// 优惠
        var num1 = 0; // 多少个其他支付方式  


        var otherTh_rec =  $tbodys.parents("table").find(".otherTh_rec"); //获取当前页面的其它列
        var otherTh_dis =  $tbodys.parents("table").find(".otherTh_dis"); //获取当前页面的其它列

        $(otherTh_rec[0]).siblings(".otherTh_rec").remove(); //删除除了第一列以外的动态添加列
        otherTh_rec.replaceWith(content); //替换第一列为最新的列

        $(otherTh_dis[0]).siblings(".otherTh_dis").remove(); //删除除了第一列以外的动态添加列
        otherTh_dis.replaceWith(content1); //替换第一列为最新的列

        // 增加悬浮头的地方
        var otherPay_rec;
        var otherPay_dis;

        if (pageObj.type == 1) {
            // 增加悬浮头的地方
            otherPay_rec = $('#nav0-content .out_table_title').find(".otherTh_rec");
            otherPay_dis = $('#nav0-content .out_table_title').find(".otherTh_dis");
        } else {
            otherPay_rec = $('#nav1-content .out_table_title').find(".otherTh_rec");
            otherPay_dis = $('#nav1-content .out_table_title').find(".otherTh_dis");
        }


        $(otherPay_rec[0]).siblings(".otherTh_rec").remove();
        otherPay_rec.replaceWith(content);

        $(otherPay_dis[0]).siblings(".otherTh_dis").remove();
        otherPay_dis.replaceWith(content1);
        //$tbodys.parents("table").find(".otherTh").replaceWith(content); //获取当前显示页面头部并替换对应其他方式

        // 得到有多少个其他支付方式，然后3000px  每增加一个增加200px，设置样式
        //var otherClass = num1 * 200 + 3000;536
        var otherClass = accAdd(accMul(accMul(num1, 2), 134), 1588);  //支付宝 美团 百度 饿了么 3平台优惠 +1400 -1200px
        $('#nav0-content table').css('width', otherClass+'px');
        $('#nav1-content table').css('width', otherClass+'px');

        //生成表内样式 启用
        content = '';


        content += '<tr class="total-tr">'+
            '<td clas="twidth" data-type="payid">'+'——'+'</td>'+ // 对账状态
            '<td clas="totaltwidth" data-type="btn" colspan="2">合计</td>'+// 交易时间、店铺名称

            '<td class="report_num totalt112">'+parseFloat(ct.s_money).toFixed(2)+'</td>'+               //应付金额
            '<td class="report_num totalt112">'+parseFloat(ct.s_refund_money).toFixed(2)+'</td>'+        //退款金额
            '<td class="report_num totalt112">'+parseFloat(ct.s_pay_money).toFixed(2)+'</td>'+           //应收金额
            '<td class="report_num totalt112">'+parseFloat(ct.s_check_hongbao).toFixed(2)+'</td>'+       //微信红包
            '<td class="report_num totalt112">'+parseFloat(ct.s_check_fee).toFixed(2)+'</td>'+           //微信佣金
            '<td class="report_num totalt112">'+parseFloat(ct.s_check_money).toFixed(2)+'</td>'+         //微信结算金额

            '<td class="twidth200">——</td>'+ //订单号
            '<td class="twidth" data-type="is_unusual">——</td>'+//结账单号
            '</tr>';

        //$tbodys.parents("table").find(".otherTh").replaceWith(content); //获取当前显示页面头部并替换对应其他方式

        //合计显示判断
        var notShowId = {
            "#nav0-content" : true,   //显示
            "#nav1-content" : true //不显示
        }
        var _id='';
        for (i in notShowId){
            if(notShowId[i]){
                $tbodys.parents(i).find("table .total-tr").remove();
                $tbodys.parents(i).find(".Records_content thead").append(content);
            }
        }

        //创建查询分页
        pageAct(page,pageObj);
        return {
            data:data,
            thMap:thMap
        };
    }

    //创建分页
    function pageAct(MaxPageNum,searchObj){ //分页按钮包裹div,最大页数,分野查询参数对象

        var content='';
        var content2='';
        searchObj.$search_page.html('');

        if(MaxPageNum<=1){ //分页小于等于1页

        }else if((MaxPageNum > 1 ) && (MaxPageNum < 5 )){ //分页在1~5之间
            for(var i=1;i<=MaxPageNum;i++){

                content += '<a href="javascript:void(0)" data-start-date="'+ searchObj.start_date +'" data-end-date="'+searchObj.end_date+'" data-type="'+ searchObj.type +'" data-page="'+ i +'" class="home_page'+( i == searchObj.page?" on ":"")+'">'+i+'</a>';

            }

        }else if(MaxPageNum >=5){ //分页大于5


            for(var i=1;i<=MaxPageNum;i++){
                content += '<a href="javascript:void(0)" data-start-date="'+ searchObj.start_date +'" data-end-date="'+searchObj.end_date+'" data-type="'+ searchObj.type +'" data-page="'+ i +'" class="home_page'+( i == searchObj.page?" on ":"")+'">'+i+'</a>&';

            }

            var contentArr = content.split("&"); //分割数组
            var _strTemp;

            if(searchObj.page < 5){//前十个
                //alert(searchObj.page);
                _strTemp = contentArr.slice(0,5);
                content = _strTemp.toString();
                content = content.replace(/,/g,'');
                content = content + "<span>...</span>";


            }else if((5 <= searchObj.page)&&(searchObj.page <= MaxPageNum-5)){ //中间

                _strTemp = contentArr.slice(parseInt(searchObj.page)-3,parseInt(searchObj.page)+2);
                //alert(searchObj.page-5+"%"+searchObj.page+5);
                content = _strTemp.toString();
                content = content.replace(/,/g,'');
                content = "<span>...</span>" + content + "<span>...</span>";
                ;

            }else if((MaxPageNum-5 <= searchObj.page)&&(searchObj.page <= MaxPageNum)){ //后十个

                _strTemp = contentArr.slice(MaxPageNum-5,MaxPageNum);
                content = _strTemp.toString();
                content = content.replace(/,/g,'');
                content = "<span>...</span>"+content;
            }


        }


        content2 =  '<a href="javascript:void(0)" data-start-date="'+ searchObj.start_date +'" data-end-date="'+searchObj.end_date+'" data-type="'+ searchObj.type +'" data-page="1" class="home_page">首 页</a>'+
            content +
            '<a href="javascript:void(0)" data-start-date="'+searchObj.start_date+'" data-end-date="'+searchObj.end_date+'" data-type="'+ searchObj.type+ '" data-page="'+MaxPageNum+'" class="home_page">尾 页</a>'


        //添加输入跳转部分
        //content2 += '跳转到：<input type="text" value="'+ searchObj.page +" / "+ MaxPageNum+'" class="page_just"><input type="button" value="GO" class="page_go">' 
        content2 += '跳转到：<input type="text" data-description="页码" placeholder=""  autocomplete="off" data-start-date="'+ searchObj.start_date +'" data-end-date="'+ searchObj.end_date +'"data-type="'+searchObj.type+'" data-page="'+ MaxPageNum +'" value="'+searchObj.page +" / "+ MaxPageNum +'" class="page_just"><input type="button" value="GO" class="page_go">';


        searchObj.$search_page.html(content2);
    }

    //pageAct($("#nav0_search_page"),7,{},3);

    // 显示数据
    function CashierList (data,$tbodys,pageObj,$theTotalBox) {
        var dataObj =  tableHead(data,pageObj,$tbodys,$theTotalBox); //要过滤的数据和请求页的数据 注:分页函数在tableHead中调用
        var thMap = dataObj.thMap;//其它方式map
        //var ct = dataObj.ct//合计对象
        var content = '';
        var _str = '';
        data = dataObj.data.order_list;

        for (var i in data) {

            var payno;
            if(!data[i].pay_no) {
                payno = '';
            } else {
                payno = data[i].pay_no;
            }
            content +=  '<tr class="total-tr">'+

                '<td class="totalt112 text_align_left font_weight_bold" style="'+account_stat[data[i].check_status]+'">'+check_status[data[i].check_status]+'</td>'+ // 对账状态
                '<td class="twidth">'+getAppointTimeSec(data[i].add_time)+'</td>'+// 交易时间
                '<td class="twidth180 text_align_left">'+data[i].shop_name+'</td>'+// 店铺名称

                '<td class="report_num totalt112">'+parseFloat(data[i].money).toFixed(2)+'</td>'+               //应付金额
                '<td class="report_num totalt112">'+parseFloat(data[i].refund_money).toFixed(2)+'</td>'+        //退款金额
                '<td class="report_num totalt112">'+parseFloat(data[i].pay_money).toFixed(2)+'</td>'+           //应收金额
                '<td class="report_num totalt112">'+parseFloat(data[i].check_hongbao).toFixed(2)+'</td>'+       //微信红包
                '<td class="report_num totalt112">'+parseFloat(data[i].check_fee).toFixed(2)+'</td>'+           //微信佣金
                '<td class="report_num totalt112">'+parseFloat(data[i].check_money).toFixed(2)+'</td>'+         //微信结算金额

                '<td class="twidth200">'+data[i].transaction_id+'</td>'+ //订单号
                '<td class="twidth click_color" data-type="payid" class="tr_td">'+data[i].pay_id+'</td>'+//结账单号

                '</tr>';
        }
        // 添加到页面中
        $tbodys.html(content);
    }
});
