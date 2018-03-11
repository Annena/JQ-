$(function() {

    var localData = getLocalDate();
    var page = ''
    var defaults = {
        start: localData,
        end: localData,
        shop: ['all'],
        dishes: ['all'],
        property: ['all']
    };
    var statisticsDishes = {

        init: function() {
            // 显示数据
            this.DishesList();
            // 绑定点击事件
            this.DishesBind();
        },

        // 显示数据
        DishesList: function(data) {
            // 显示当前日期
            /*$("#start-date").val(getLocalDate());
            $("#end-date").val(getLocalDate());*/

            $("#start-date").val(getOffsetDateTime().start_day);
            $("#end-date").val(getOffsetDateTime().end_day);

            $("#dishesList").val();
            //次数数据
            var list = ''
            for (i = 1; i <= 99; i++) {
                list += '<option value=' + i + '>' + i + '</option>'
            }
            $('#num').html(list)
        },
        // 绑定点击事件
        DishesBind: function() {
            var _self = this;
            // 点击查询按钮
            $('#selectbtn').unbind('click').bind('click', function() {
                _self.statisticsdishes(defaults.$tbody);
            });
            // 点击店铺
            $('#shopList').unbind('click').bind('click', function() {
                _self.DishesDatashop();
            });
            //分页标签 切换查询
            $(".search_page").on("click", ".home_page", function() {

                var $this = $(this);
                //alert($(this).attr("data-start-date"));
                var searchObj = { //要传输的参数对象
                    start_date: $this.attr("data-start-date"),
                    end_date: $this.attr("data-end-date"),
                    page: $this.attr("data-page"),
                    num: $this.attr("data-num")
                };
                _self.statisticsdishes(searchObj.page, searchObj);

            });

            //分页输入页数 点击查询部分
            $(".search_page").on("click", ".page_go", function() {
                var $this = $(this);
                var $page_just = $(this).siblings(".page_just");
                var _temp = parseInt($page_just.val());
                var maxPage = $page_just.attr("data-page");

                var searchObj = { //要传输的参数对象
                    start_date: $page_just.attr("data-start-date"),
                    end_date: $page_just.attr("data-end-date"),
                    num: $this.attr("data-num")
                };

                if (_temp <= maxPage) {
                    searchObj.page = _temp
                    _self.statisticsdishes(searchObj.page, searchObj);
                } else {
                    displayMsg(ndPromptMsg, '请输入正确的页码', 2000);
                }
            });


        },

        // 获取店铺列表
        DishesDatashop: function() {
            //console.log($('a.current')[0]);
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
        },

        // 查询
        statisticsdishes: function(thePage, searchObj) {
            // 搜索之前清空数据
            $('#tbodys table').html('');

            var self = this;

            // 获取到搜索的项
            var startdate = $("#start-date").val(), // 查询开始日期
                enddate = $("#end-date").val(); // 查询结束日期
            num = $('#num').val() //次数

            //如果是分页请求就替换相应值
            if (searchObj) {
                startdate = searchObj.start_date;
                enddate = searchObj.end_date;
                num = searchObj.num;
            }

            if (startdate == "" || enddate == "") {
                displayMsg(ndPromptMsg, '请选择开始日期和结束日期!', 2000);
                return;
            }

            if (startdate > enddate) {
                displayMsg(ndPromptMsg, '开始日期应小于结束日期!', 2000);
                return;
            }

            if ($('#shopList').val() == "全部") {
                defaults.shop = "all";
            }
            //清单对应的分页标签
            var $searchPage;
            $searchPage = $("#nav0_search_page");


            //分页信息用的参数
            var pageObj = {
                'start_date': startdate, //开始时间
                'end_date': enddate, //结束时间
                'num': num,
                'shop_ids': defaults.shop,
                '$search_page': $searchPage, //分页对应的分页位置
                'page': thePage || 1, //请求的页数
            };
            setAjax(AdminUrl.voucher, {
                'start_date': startdate,
                'end_date': enddate,
                'shop_ids': defaults.shop,
                'num': num,
                'page': thePage || 1,
            }, $('#prompt-message'), { 20: '' }, function(respnoseText) {
                if (respnoseText.code == 20) {
                    $('#kindHeader').removeClass('hide');
                    // 得到返回数据
                    var data = respnoseText.data;
                    // 显示搜索出来的数据
                    self.memberList(data, pageObj);
                } else {
                    $('#kindHeader').addClass('hide');
                    displayMsg(ndPromptMsg, respnoseText.message, 2000);
                }
            }, 0);
        },

        // 显示查询出来的数据
        memberList: function(data, pageObj) {
            var _self = this;

            // 二级数据
            var contentmenu = '';
            // 一级数据
            var content = '';
            var theCt = {}; //用于存放合计

            //多少页   
            page = data.page; //总共页数 
            delete data.page;

            // 消费金额总计
            var allNum = 0;
            // 返券金额总计
            var allNumTwo = 0;


            for (var i in data) {

                //读取合计
                theCt = data[i];

                content = '';
                // 列表排名
                var payno;
                for (var j in data[i].set_menu) {

                    if (!data[i].set_menu[j].pay_no) {
                        payno = '';
                    } else {
                        payno = data[i].set_menu[j].pay_no;
                    }
                    content += '<tr>' +
                        '<td width="12%">——</td>' + // 账号
                        '<td width="12%">——</td>' + // 次数
                        '<td width="12%" class="payid_css">' + pay_no_he(payno) + '&nbsp;' + '(' + data[i].set_menu[j].pay_id + ')' + '</td>' + // 结账单号
                        '<td width="12%">' + getAppointTimePro(data[i].set_menu[j].add_time) + '</td>' + // 时间
                        '<td class="report_text" width="12%">' + data[i].set_menu[j].shop_name + '</td>' + //店面
                        '<td class="report_num" width="12%">' + data[i].set_menu[j].consume + '</td>' + // 消费金额
                        '<td class="report_num" width="12%">' + data[i].set_menu[j].voucher_money + '</td>' + // 返券金额
                        '<td class="report_text" width="12%">' + data[i].set_menu[j].a_user_name + '</td>' + // 服务员
                        '</tr>';
                    allNum += parseFloat(data[i].set_menu[j].consume);
                    allNumTwo += parseFloat(((data[i].set_menu[j].voucher_money).slice(-3) == ".00" ? data[i].set_menu[j].voucher_money.split('.')[0] : data[i].set_menu[j].voucher_money));
                }
                contentmenu += '<div class="content_classify" data-type="menuTypeIds">' +
                    '<table style="border-bottom: none" class="nav_content_classify" cellspacing="0" cellpadding="0"  data-type="menuType">' +
                    '<tr>' +
                    '<td width="12%">' +
                    '<a>' + theCt.user_mobile + '</a>' + // 账号
                    '</td>' +
                    '<td class="report_num" width="12%">' + theCt.count + '</td>' + //次数
                    '<td width="12%">——</td>' + // 订单号
                    '<td width="12%">——</td>' + // 时间
                    '<td class="report_text" width="12%">——</td>' + // 店面
                    '<td class="report_num" width="12%">' + allNum + '</td>' + // 消费金额
                    '<td class="report_num" width="12%">' + allNumTwo + '</td>' + // 返券金额
                    '<td class="report_text" width="12%">——</td>' + // 服务员
                    '</tr>' +
                    '</table>' +
                    '<table class="con_content_classify" data-type="menuList" cellspacing="0" cellpadding="0" style="display: none;">' + content + '</table>' +
                    '</div>';

            }
            // 添加到页面中
            $('#tbodys').html(contentmenu);

            $('#tbodys').find('div[data-type="menuTypeIds"]').each(function() {
                var self = this;
                $(self).find('table[data-type="menuType"]').unbind('click').bind('click', function() {
                    $(self).find('table[data-type="menuList"]').stop().toggle('hide');
                });
            });
            //创建查询分页
            pageAct(page, pageObj);

        },
    }
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


        content2 = '<a href="javascript:void(0)" data-num="' + searchObj.num + '" data-start-date="' + searchObj.start_date + '" data-end-date="' + searchObj.end_date + '"  data-page="1" class="home_page">首 页</a>' +
            content +
            '<a href="javascript:void(0)" data-num="' + searchObj.num + '" data-start-date="' + searchObj.start_date + '" data-end-date="' + searchObj.end_date + '"  data-page="' + MaxPageNum + '" class="home_page">尾 页</a>'


        //添加输入跳转部分
        //content2 += '跳转到：<input type="text" value="'+ searchObj.page +" / "+ MaxPageNum+'" class="page_just"><input type="button" value="GO" class="page_go">' 
        content2 += '跳转到：<input type="text" data-description="页码" placeholder=""  autocomplete="off" data-start-date="' + searchObj.start_date + '" data-end-date="' + searchObj.end_date + '" data-page="' + MaxPageNum + '" data-num="' + searchObj.num + '" value="' + searchObj.page + " / " + MaxPageNum + '" class="page_just"><input type="button" value="GO" class="page_go">';


        searchObj.$search_page.html(content2);

    }
    statisticsDishes.init();
});
