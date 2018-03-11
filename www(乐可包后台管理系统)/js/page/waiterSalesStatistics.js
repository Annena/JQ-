$(function () {
    
    // 选总部服务员销售统计 lw 2016.3.28
        
        /*$("#start-date").val(getLocalDate());
        $("#end-date").val(getLocalDate());*/

        $("#start-date").val(getOffsetDateTime().start_day);
        $("#end-date").val(getOffsetDateTime().end_day);
        var shopIdPro = $.cookie('shop_id');

        var localData = getLocalDate();
        var defaults = {
            waiter: ['all']
        };

        // 添加滚动条，上下左右可以移动滚动条
        topButtonScroll3(".navContent",".out_table_title");//无分页
        //topButtonScroll2(".navContent",".out_table_title");//有分页

        // 显示所有店铺  公共方法
        shopData();
        // 绑定点击事件
        CashierBind();

        // 绑定点击事件
        function CashierBind () {
            // 点击搜索
            $('#selectbtn').unbind('click').bind('click', function () {
                selectCashier();
            });

            // 点击服务员
            $('#waiterList').unbind('click').bind('click', function () {
                DishesDatashop();
            });
                    
            // 点击下载
            $('#download').unbind('click').bind('click', function () {
                downloadSelect();
            });
        }

        // 下载
        function downloadSelect() {
            var startDate = $("#start-date").val();
            var endDate = $("#end-date").val();
            var shop_id = $('#shopList').val();

            if (startDate > endDate) {
                displayMsg(ndPromptMsg, '开始日期应小于结束日期!', 2000);
                return;
            }
            // 服务员
            if ($('#waiterList').val() == "全部") {
                defaults.waiter = "all";
            }

            var CID = $.cookie('cid');
            var business = location.href.split("//")[1].split('.')[0];

            $('form').attr('action',AdminUrl.menuCountWaiterStatisticsDownload);
            $('#start_date').val(startDate);
            $('#end_date').val(endDate);
            $('#shop_id').val(shop_id);
            $('#a_user_ids').val(defaults.waiter);// 服务员
            $('#cid').val(CID);
            $('#company_name_en').val(business);

            setAjax(AdminUrl.menuCountWaiterStatistics, {
                'start_date': startDate,
                'end_date' : endDate,
                'shop_id': shop_id,
                'a_user_ids': defaults.waiter
            }, $('#prompt-message'), {20: ''}, function(respnoseText) {
                if (respnoseText.code == 20) {
                    $('form').submit();
                } else {
                    displayMsg(ndPromptMsg, respnoseText.message, 2000);
                }
            }, 0);
        }

        // 获取服务员列表
        function DishesDatashop () {
            setAjax(AdminUrl.staffStaffStatusShopList, {
                'shop_id': $('#shopList').val()
            }, $('#prompt-message'), {20: ''}, function(respnoseText) {
                var data = respnoseText.data;
                var listContent = '<li data-value="all" data-selected="1">全部</li>';
                for (var i in data) {
                    listContent += '<li data-value="' + data[i].a_user_id + '" data-selected="1">' + data[i].a_user_name + '</li>';
                }
                $('#set-favorable').html(listContent);
                $('#favorable-title').html('服务员选择');
                isHaveElement('#set-favorable', '#show-favorable');
                setFavorableData();
                displayAlertMessage('#favorable-message', '');

                $('#cancel-favorable').unbind('click').bind('click', function () {
                    defaults.waiter = [];
                    layer.close(layerBox);
                    countCancel(($('#waiterList').val().split(',')));
                    countSale(defaults.waiter, '#waiterList');
                });

                $('#definite-favorable').unbind('click').bind('click', function () {
                    defaults.waiter = [];
                    layer.close(layerBox);
                    countSale(defaults.waiter, '#waiterList');
                });
            }, 1);
        }

        // 搜索数据
        function selectCashier() {
                   
            // 搜索显示数据之前先清空数据
            $('#tbodys').html('');
            // 开始日期
            var startDate = $("#start-date").val();
            // 结束日期
            var endDate = $("#end-date").val();
            // 店铺
            var shop_id = $('#shopList').val();

            if (startDate > endDate) {
                displayMsg(ndPromptMsg, '开始日期应小于结束日期!', 2000);
                return;
            }
            // 服务员
            if ($('#waiterList').val() == "全部") {
                defaults.waiter = "all";
            }

            setAjax(AdminUrl.menuCountWaiterStatistics, {
                'start_date': startDate,
                'end_date' : endDate,
                'shop_id': shop_id,
                'a_user_ids': defaults.waiter
            }, $('#prompt-message'), {20: ''}, function(respnoseText) {
                if (respnoseText.code == 20) {
                    // 显示出来页面的标题
                    $('#nav0-content .out_table_title').removeClass('hide');
                    $('#nav0-content .Records_content').removeClass('hide');
                    // 得到返回数据
                    var data = respnoseText.data;
                    CashierList(data);
                } else {
                    // 隐藏页面的标题
                    $('#nav0-content .out_table_title').addClass('hide');
                    $('#nav0-content .Records_content').addClass('hide');
                    displayMsg(ndPromptMsg, respnoseText.message, 2000);
                }
            }, 0);
        }

        // 显示数据
        function CashierList(data) {
            var content = '';
            var num = 1;
            for (var i in data) {
                content +=  '<tr class="total-tr">'+
                                '<td class="report_num">'+num+'</td>'+                 // 排名
                                '<td class="report_text">'+(data[i].a_user_name == undefined || data[i].a_user_name == '' ? '自助下单' : data[i].a_user_name)+'</td>'+ // 服务员
                                '<td class="report_num">'+data[i].table_sum+'</td>'+   // 桌台数
                                '<td class="report_num">'+data[i].consume+'</td>'+     // 消费金额
                            '</tr>';
                num++;
            }
            // 添加到页面中
            $('#tbodys').html(content);
        }

});
