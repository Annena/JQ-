$(function () {
    var type = 1;
    var menuStatus = 1; //当前选中的标签data-type的值 1:未使用 2:已使用 3:已作废
    var menuType = 1; //1，会员储值类型；2，实体卡储值类型
    var $cardTypeContent = $('#cardTypeContent_1 .tbodys');//jQ初始对象存储对应的内容DIV
    // 储值统计 cardStatistics 

    var localData = getLocalDate();
    var defaults = {
        start: localData,
        end: localData,
        shop: ['all']
    };

    /*$("#start-date").val(getLocalDate());
    $("#end-date").val(getLocalDate());*/
    /*$("#end-date_2").val(getLocalDate());*/

    $("#start-date").val(getOffsetDateTime().start_day);
    $("#end-date").val(getOffsetDateTime().end_day);
    $("#end-date_2").val(getOffsetDateTime().start_day);
    // 添加滚动条，上下左右可以移动滚动条
    //topButtonScroll(".navContent",".out_table_title");//无分页
    // topButtonScroll2(".stores-content",".out_table_title");//有分页，
    topButtonScroll6(".stores-content",".out_table_title");//有分页，
    // 绑定点击事件
    CashierBind();


        
    // 绑定点击事件
    function CashierBind () {
         //添加切换事件
        $("#cardType_1,#cardType_2,#cardType_3,#cardType_6,#cardType_7").click(function(){
            
            $(".caipin-fenleicheck").removeClass("caipin-fenleicheck").addClass("caipin-fenleinucheck");
            menuStatus = $(this).removeClass("caipin-fenleinucheck").addClass("caipin-fenleicheck").attr("data-type");
            menuStatus = parseInt(menuStatus);
            menuType = $(this).attr("type");
            menuType = parseInt(menuType);
           
            //显示内容
            $(".stores-content").addClass("hide");
            $('#shopSel').addClass("hide");
            $("#cardTypeDate").removeClass('hide');

            if (menuStatus == 1 || menuStatus == 2 || menuStatus == 3 || menuType == 2) {
                $('#download').removeClass('hide');
            } else {
                $('#download').addClass('hide');
            }


            switch(menuStatus)
            {   // 定义菜品状态参数 1:未使用 2:已使用 3:已作废
                case 1:
                    var $theContent = $("#cardTypeContent_1");
                    $theContent.removeClass("hide");
                    $cardTypeContent = $theContent.find(".tbodys");
                     $(".search_page").addClass("hide");
                    //alert(menuStatus);
                    //DishesData(0);
                break;
                case 2:
                    var $theContent = $("#cardTypeContent_2");
                    $theContent.removeClass("hide");
                    $cardTypeContent = $theContent.find(".tbodys");
                    $(".search_page").addClass("hide");
                    
                    //alert(menuStatus);
                    //DishesData(1);
                break;
                case 3:
                    var $theContent =  $("#cardTypeContent_3");
                    $theContent.removeClass("hide");
                    $cardTypeContent = $theContent.find(".tbodys");
                    $(".search_page").addClass("hide");
                    //alert(menuStatus);
                    //DishesData(2);
                break;
                case 6:
                    var $theContent =  $("#cardTypeContent_6");
                    $theContent.removeClass("hide");
                    $cardTypeContent = $theContent.find(".tbodys");
                    $(".search_page").addClass("hide");
                    //alert(menuStatus);
                    //DishesData(2);
                break;
                case 7:
                    var $theContent =  $("#cardTypeContent_7");
                    $theContent.removeClass("hide");
                    $cardTypeContent = $theContent.find(".tbodys");
                    $('#shopSel').removeClass("hide");
                    $("#nav1_search_page").removeClass("hide");
                    //alert(menuStatus);
                    //DishesData(2);
                break;
            
            }
            if (menuType == 2) {
                var $theContent =  $("#cardTypeContent_6");
                $theContent.removeClass("hide");
                $cardTypeContent = $theContent.find(".tbodys");
                $(".search_page").addClass("hide");
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
            ConsumeList (searchObj.page,searchObj);
            
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
                searchObj.page = _temp
                ConsumeList (searchObj.page,searchObj);
            }else{
                displayMsg(ndPromptMsg, '请输入正确的页码', 2000);
            }
        });
        // 点击搜索
        $('#selectbtn').unbind('click').bind('click', function () {
            
          
            if(menuStatus==7){
                ConsumeList();//储值通用统计（储值通用消费明细）
            }else{
                var selectType = menuStatus;//获取当前类型标签
                var storedType = menuType;//获取当前储值类型
                //此处有可能页面进入后默认显示某日搜索，顾用变量$cardTypeContent，未纯参数传递
                selectCashier(selectType,$cardTypeContent,storedType); 
            }
        });

        // 点击下载
        $('#download').unbind('click').bind('click', function () {
            var selectType = menuStatus;//获取当前类型标签
            var storedType = menuType;//获取当前储值类型
            //此处有可能页面进入后默认显示某日搜索，顾用变量$cardTypeContent，未纯参数传递
            downloadSelect(selectType,$cardTypeContent,storedType);
        });

        // 点击店铺
        $('#shopList').unbind('click').bind('click', function () {
            DishesDatashop();
        });
        // 点击通用商户
        $('#region_sel').unbind('click').bind('click', function () {
            CurrencyCard();
        });

        // 实时账户统计
        $('#cardType_4').unbind('click').bind('click', function () {
            $(".caipin-fenleicheck").removeClass("caipin-fenleicheck").addClass("caipin-fenleinucheck");
            $(this).removeClass("caipin-fenleinucheck").addClass("caipin-fenleicheck");
            $("#cardTypeContent_1").addClass('hide');
            $("#cardTypeContent_2").addClass('hide');
            $("#cardTypeContent_3").addClass('hide');
            $("#cardTypeContent_4").removeClass('hide');
            $("#cardTypeContent_5").addClass('hide');
            $("#cardTypeContent_6").addClass('hide');
            $("#cardTypeContent_7").addClass('hide');
            $("#cardTypeDate").addClass('hide');
            setAjax(AdminUrl.storedCountUserStatistics,'', $('#prompt-message'), {20: ''}, function(respnoseText) {
                if (respnoseText.code == 20) {
                    // 得到返回数据
                    var data = respnoseText.data;
                    // 储值乐币
                    $('#stored_amount').text(data.stored_amount);
                    // 消费乐币
                    $('#stored_consume').text(data.stored_consume);
                    // 乐币剩余
                    $('#stored_surplus').text(data.stored_surplus);
                    // 储值本金
                    $('#principal_amount').text(data.principal_amount);
                    // 消费本金
                    $('#principal_consume').text(data.principal_consume);
                    // 储值剩余
                    $('#principal_surplus').text(data.principal_surplus);
                    // 积分累计
                    $('#integral_amount').text(data.integral_amount);
                    // 积分消费
                    $('#integral_consume').text(data.integral_consume);
                    // 积分剩余
                    $('#integral_surplus').text(data.integral_surplus);
                } else {
                    displayMsg(ndPromptMsg, respnoseText.message, 2000);
                }
            }, 0);
        });

        // 历史账户统计
        $('#cardType_5').unbind('click').bind('click', function () {
            $(".caipin-fenleicheck").removeClass("caipin-fenleicheck").addClass("caipin-fenleinucheck");
            $(this).removeClass("caipin-fenleinucheck").addClass("caipin-fenleicheck");
            $("#cardTypeContent_1").addClass('hide');
            $("#cardTypeContent_2").addClass('hide');
            $("#cardTypeContent_3").addClass('hide');
            $("#cardTypeContent_4").addClass('hide');
            $("#cardTypeContent_5").removeClass('hide');
            $("#cardTypeContent_6").addClass('hide');
            $("#cardTypeContent_7").addClass('hide');
            $("#cardTypeDate").addClass('hide');

            historyStat();
        });

        // 点击历史账户统计搜索
        $('#selectbtn_2').click(function(){
            historyStat();
        });

        // 储值通用统计详情
        $('#cardTypeContent_7').on('click', 'td[data-type="pay_id"]', function () {
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
                    public_details(data);
                } else {
                    displayMsg(ndPromptMsg, respnoseText.message, 2000);
                }
            }, 0);
        });
    }

    // 历史账户统计数据
    function historyStat() {
        setAjax(AdminUrl.oldStoredCountUserStatistics,{
            'start_date': $("#end-date_2").val()
        }, $('#prompt-message'), {20: ''}, function(respnoseText) {
            if (respnoseText.code == 20) {
                // 得到返回数据
                var data = respnoseText.data;
                // 储值乐币
                $('#stored_amount_2').text(data.stored_amount);
                // 消费乐币
                $('#stored_consume_2').text(data.stored_consume);
                // 乐币剩余
                $('#stored_surplus_2').text(data.stored_surplus);
                // 储值本金
                $('#principal_amount_2').text(data.principal_amount);
                // 消费本金
                $('#principal_consume_2').text(data.principal_consume);
                // 储值剩余
                $('#principal_surplus_2').text(data.principal_surplus);
                // 积分累计
                $('#integral_amount_2').text(data.integral_amount);
                // 积分消费
                $('#integral_consume_2').text(data.integral_consume);
                // 积分剩余
                $('#integral_surplus_2').text(data.integral_surplus);
                // 总未储乐币
                $('#not_stored_2').text(data.not_stored);
                // 总未储本金
                $('#stored_money_2').text(data.stored_money);
                // 总未储赠送
                $('#give_money_2').text(data.give_money);
            } else if (respnoseText.code == 205136) {
                displayMsg(ndPromptMsg, respnoseText.message, 2000);
                // 储值乐币
                $('#stored_amount_2').text('0.00');
                // 消费乐币
                $('#stored_consume_2').text('0.00');
                // 乐币剩余
                $('#stored_surplus_2').text('0.00');
                // 储值本金
                $('#principal_amount_2').text('0.00');
                // 消费本金
                $('#principal_consume_2').text('0.00');
                // 储值剩余
                $('#principal_surplus_2').text('0.00');
                // 积分累计
                $('#integral_amount_2').text('0.00');
                // 积分消费
                $('#integral_consume_2').text('0.00');
                // 积分剩余
                $('#integral_surplus_2').text('0.00');
                // 总未储乐币
                $('#not_stored_2').text('0.00');
                // 总未储本金
                $('#stored_money_2').text('0.00');
                // 总未储赠送
                $('#give_money_2').text('0.00');
            } else {
                displayMsg(ndPromptMsg, respnoseText.message, 2000);
            }
        }, 0);
    }
     // 储值通用统计（储值通用消费明细）
    function ConsumeList(thePage,searchObj) {//thepage是请求的第几页
        var _self = this;
        var startDate = $("#start-date").val();
        var endDate = $("#end-date").val();
        if ($('#shopList').val() == "全部") {
            defaults.shop = "all";
        }
        if($('#region_sel').val() == "全部") {
            defaults.card = "all";
        }
        $('#shop_ids').val(defaults.shop);
        //清单对应的分页标签
        var $searchPage= $("#nav1_search_page");

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
        setAjax(AdminUrl.consume, {
            'start_time': startDate,
            'end_time': endDate,
            'card_ids': defaults.card,
            'shop_ids': defaults.shop,
            'page': thePage || 1
        }, $('#prompt-message'), {20: ''}, function(respnoseText) {
             if (respnoseText.code == 20) {
                 // 得到返回数据
                var data = respnoseText.data;
                
                if(data==''){
                    $('#tbodys_1').html('');
                   displayMsg(ndPromptMsg, '没有相关数据信息', 2000);
                }else{
                    Statistics(data,pageObj);//储值通用统计显示数据
                }
             } else {
                displayMsg(ndPromptMsg, respnoseText.message, 2000);
            }
        }, 1);
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
                defaults.shop = [];
                layer.close(layerBox);
                countCancel(($('#region_sel').val().split(',')));
                countSale(defaults.shop, '#region_sel');
            });

            $('#definite-favorable2').unbind('click').bind('click', function () {
                defaults.shop = [];
                layer.close(layerBox);
                countSale2(defaults.shop, '#region_sel');
            });
        }, 1);
    }
    //  function CurrencyCard () {
    //     //console.log($('a.current')[0]);
    //     // region_sel
    //     setAjax(AdminUrl.currencyCard, {
            
    //     }, $('#prompt-message'), {20: ''}, function(respnoseText) {
    //         var data = respnoseText.data;
    //         var listContent = '<li data-value="all" data-selected="1">全部</li>';
    //         for (var i in data.currency_stored) {
    //             listContent += '<li data-value="' + i + '" data-selected="1">' + data.currency_stored[i] + '</li>';
    //         }
    //         $('#set-favorable_1').html(listContent);
    //         $('#favorable-title_1').html('通用商户选择');
    //         isHaveElement('#set-favorable_1', '#show-favorable_1');
    //         setFavorableData();
    //         displayAlertMessage('#favorable-message_1', '');

    //         $('#cancel-favorable_1').unbind('click').bind('click', function () {
    //             defaults.card = [];
    //             layer.close(layerBox);
    //             countCancel(($('#region_sel_1').val().split(',')));
    //             countSale(defaults.card, '#region_sel');
    //         });

    //         $('#definite-favorable').unbind('click').bind('click', function () {
    //             defaults.card = [];
    //             layer.close(layerBox);
    //             countSale(defaults.card, '#region_sel');
    //         });
    //     }, 1);
    // }
    // 获取店铺列表
    function DishesDatashop(index) {
        // AdminUrl.currencyCard
        setAjax(AdminUrl.shopShopList, {
            'type': 2
        }, $('#prompt-message'), { 20: '' }, function(respnoseText) {
            var data = respnoseText.data;
            var listContent = '<li data-value="all" data-selected="1">全部</li><li data-value="ssssssssssss" data-selected="1">在线自助购买</li>';
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

    // 下载
    function downloadSelect(selectType,$theContent,storedType) {
        var startDate = $("#start-date").val();
        var endDate = $("#end-date").val();
        // 搜索显示数据之前先清空数据
        
        //$theContent.html('');
        // 日期
        if ($('#shopList').val() == "全部") {
            defaults.shop = "all";
        }
        if (startDate > endDate) {
            displayMsg(ndPromptMsg, '开始日期应小于结束日期!', 2000);
            return;
        }
        var CID = $.cookie('cid');
        var business = location.href.split("//")[1].split('.')[0];

        /*var form = $('<form method="post" action="'+AdminUrl.storedCountDownload+'">'+
            '<input type="text" name="start_date" value="' + startDate + '">'+
            '<input type="text" name="end_date" value="' + endDate + '">'+
            '<input type="text" name="type" value="' + selectType + '">'+
            '<input type="text" name="shop_ids" value="' + defaults.shop + '">'+
            '<input type="text" name="cid" value="' + CID + '">'+
            '<input type="text" name="company_name_en" value="'+ business+'">'+
        '</form>');
        //alert('ddd');
        form.submit();*/
        $('form').attr('action',AdminUrl.storedCountDownload);
        $('#start_date').val(startDate);
        $('#end_date').val(endDate);
        $('#stored_count_type').val(selectType);
        $('#shop_ids').val(defaults.shop);
        $('#cid').val(CID);
        $('#company_name_en').val(business);
        $('#stored_type').val(storedType);
        //$('form').submit();


        /*$('form').submit({
            type: 'post',
            url: AdminUrl.storedCountDownload,
            data: {
                'start_date': startDate,
                'end_date': endDate,
                'type': selectType, //传输类型
                'shop_ids': defaults.shop,
                'cid': CID,
                'company_name_en': business
            },
            success: function (respnoseText) {
                //respnoseText = JSON.parse(respnoseText);
                //console.log(respnoseText);
                var data = respnoseText.data;
                if (respnoseText.code == 20) {
                    displayMsg($('#prompt-message'), respnoseText.message, 1000, function () {
                        //layer.close(layerBox);
                        //window.location.replace('newsInformation.html');
                    });
                } else {
                    displayMsg($('#prompt-message'), respnoseText.message, 2000);
                }
            },
            error: function (XmlHttpRequest, textStatus, errorThrown) {
                displayMsg($('#prompt-message'), '请求服务器失败，请重试！', 2000);
            }
        });*/

        /*$('form').ajaxSubmit({
            type: 'POST',
            url: AdminUrl.storedCountDownload,
            data: {
                'start_date': startDate,
                'end_date': endDate,
                'type': selectType, //传输类型
                'shop_ids': defaults.shop,
                'cid': CID,
                'company_name_en': business
            },
            //xhrFields:{withCredentials:true},
            //dataType:"json",
            //crossDomain: true,// 跨域请求用的
            //xhrFields:{withCredentials:true},
            timeout: 30000,
            error: function() {
                //alert('tt');
                displayMsg(dialog, '请求服务器失败，请重试！', 2000);
            },
            success: function(respnoseText) {
                //$('form').submit();
                alert('ddd');
            }
        });*/

        setAjax(AdminUrl.storedCountFirst, {
            'start_date': startDate,
            'end_date': endDate,
            'stored_count_type': selectType, //传输类型
            'shop_ids': defaults.shop,
            'stored_type':storedType
        }, $('#prompt-message'), {20: ''}, function(respnoseText) {
            //alert('ddd');
            if (respnoseText.code == 20) {
                // 下载
                $('form').submit();
            } else {
                displayMsg(ndPromptMsg, respnoseText.message, 2000);
            }
        }, 0);
    }

    // 搜索发卡日期
    function selectCashier (selectType,$theContent,storedType) { // (类型，指向应显示的内容jQ)
        var startDate = $("#start-date").val();
        var endDate = $("#end-date").val();
        // 搜索显示数据之前先清空数据
        
        $theContent.html('');
        // 日期
        if ($('#shopList').val() == "全部") {
            defaults.shop = "all";
        }
        if (startDate > endDate) {
            displayMsg(ndPromptMsg, '开始日期应小于结束日期!', 2000);
            return;
        }

        setAjax(AdminUrl.storedCountFirst, {
            'start_date': startDate,
            'end_date': endDate,
            'stored_count_type': selectType, //传输类型
            'shop_ids': defaults.shop,
            'stored_type':storedType
        }, $('#prompt-message'), {20: ''}, function(respnoseText) {
            
            if (respnoseText.code == 20) {
                if (storedType == 2) {
                    $('#cardTypeContent_6 .out_table_title').removeClass('hide');
                    $('#cardTypeContent_6 .Records_content').removeClass('hide');
                } else {
                    $('#cardTypeContent_'+selectType+' .out_table_title').removeClass('hide');
                    $('#cardTypeContent_'+selectType+' .Records_content').removeClass('hide');
                }
                // 得到返回数据
                var data = respnoseText.data;
                CashierList(data,$theContent);
            } else {
                if (storedType == 2) {
                    $('#cardTypeContent_6 .out_table_title').addClass('hide');
                    $('#cardTypeContent_6 .Records_content').addClass('hide');
                } else {
                    $('#cardTypeContent_'+selectType+' .out_table_title').addClass('hide');
                    $('#cardTypeContent_'+selectType+' .Records_content').addClass('hide');
                }
                displayMsg(ndPromptMsg, respnoseText.message, 2000);
            }
        }, 0);
    }
    //更改数据信息颜色
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
    // 显示储值通用统计数据
    function Statistics (data,pageObj){
        var content = '';
        var content_1 = '';
        var contents = '';
        var add_time = '';
        var ct = data.ct;
        pageAct(ct.pages,pageObj);
       // pageAct(10,pageObj);

           
        // content += '<tr class="stores_title">'+
        //                 '<td width="7%" class="report_text">合计</td>'+
        //                 '<td width="12%">————</td>'+
        //                 '<td width="16%">————</td>'+
        //                 '<td width="12%">————</td>'+
        //                 '<td width="7%" class="report_num addColor">'+data.ct.order_stored+'</td>'+
        //                 '<td width="7%" class="report_num addColor">'+data.ct.order_stored+'</td>'+
        //                 '<td width="7%" class="report_num reduColor">'+data.ct.order_stored+'</td>'+
        //                 '<td width="7%" class="report_num reduColor">'+data.ct.order_stored+'</td>'
        //             '</tr>'
        for (var i in data) { 
           // add_time =  getYMDHMS(data[i].add_time)
           add_time =  getAppointTimePro(data[i].add_time);
           // getAppointTimePro
           // console.log(add_time)
           if(i=='ct'){
                content += '<tr class="stores_title">'+
                        '<td width="16%" class="report_text">合计</td>'+
                        '<td width="20%">————</td>'+
                        '<td width="12%">————</td>'+
                        '<td width="12%">————</td>'+
                        '<td width="7%" class="report_num '+ ClassColor(data[i].pay_stored)+'">'+(data[i].pay_stored==0?'————':data[i].pay_stored)+'</td>'+
                        '<td width="7%" class="report_num '+ ClassColor(data[i].pay_principal)+'">'+(data[i].pay_principal==0?'————':data[i].pay_principal)+'</td>'+
                        '<td width="7%" class="report_num '+ ClassColor(data[i].order_stored)+'">'+(data[i].order_stored==0?'————':data[i].order_stored)+'</td>'+
                        '<td width="7%" class="report_num '+ ClassColor(data[i].order_principal)+'">'+(data[i].order_principal==0?'————':data[i].order_principal)+'</td>'+
                    '</tr>'
           }else{
                content_1 += '<tr class="stores_title">'+
                        '<td width="16%" class="report_text">'+add_time+'</td>'+
                        '<td width="20%" class="report_text">'+data[i].order_card_name+'<span>('+data[i].order_shop_name+')</span></td>'+
                        '<td width="12%" class="report_text hyperLink" data-type="pay_id"  data_pay_id="' + data[i].pay_id + '">'+data[i].pay_id+'</td>'+
                        '<td width="12%" class="report_text">'+data[i].pay_card_name+'<span>'+(data[i].entity_id==null?'(储值账户)':'(实体卡)')+'</td>'+
                        '<td width="7%" class="report_num '+ ClassColor(data[i].pay_stored)+'">'+(data[i].pay_stored==0?'————':data[i].pay_stored)+'</td>'+
                        '<td width="7%" class="report_num '+ ClassColor(data[i].pay_principal)+'">'+(data[i].pay_principal==0?'————':data[i].pay_principal)+'</td>'+
                        '<td width="7%" class="report_num '+ ClassColor(data[i].order_stored)+'">'+(data[i].order_stored==0?'————':data[i].order_stored)+'</td>'+
                        '<td width="7%" class="report_num '+ ClassColor(data[i].order_principal)+'">'+(data[i].order_principal==0?'————':data[i].order_principal)+'</td>'+
                       
                    '</tr>'
           }
           contents = content + content_1
        }
        // console.log(content)
        $('#tbodys_1').html(contents);
        // $theContent.html(content);
    }
    // 显示数据
    function CashierList (data,$theContent) {
        var content = '';
        var contentPro = '';
        
        var totalStoredMoney = 0,   // 合计储值金额
            totalGiveMoney = 0,     // 合计赠送金额
            totalCards = 0,         // 合计卡数
            totalCash = 0,          // 现金
            totalCard = 0,          // 银行卡
            totalFree = 0,          // 免单
            wxpay_shop = 0,         // 银台微信
            alipay_shop = 0,        // 银台支付宝
            wxpay = 0,              // 微信支付
            alipay = 0;             // 支付宝支付

            var count = 0;          // 售卖数量
           
        for (var i in data) {
                //console.log(data);
                content +=  '<tr class="total-tr">'+
                                '<td class="report_text total-addr" data-type="storedName">'+data[i].stored_name+'</td>'+   // 储值名称
                                '<td class="report_num report_num total-tel" data-type="storedMoney">'+data[i].stored_money+'</td>'+  // 储值金额
                                '<td class="report_num report_num total-tel" data-type="giveMoney">'+data[i].give_money+'</td>'+      // 赠送金额
                                '<td class="report_num report_num total-tel">'+parseFloat(data[i].stored_num)+'</td>'+//售卖数量
                                '<td class="report_num report_num total-tel" data-type="cash">'+parseFloat(data[i].cash).toFixed(2)+'</td>'+  // 现金
                                '<td class="report_num report_num total-tel" data-type="card">'+parseFloat(data[i].card).toFixed(2)+'</td>'+  // 银行卡
                                '<td class="report_num report_num total-tel" data-type="free">'+parseFloat(data[i].free).toFixed(2)+'</td>'+  // 免单
                                '<td class="report_num report_num total-tel">'+(data[i].wxpay_shop == null ? '0' : parseFloat(data[i].wxpay_shop).toFixed(2))+'</td>'+    // 银台微信
                                '<td class="report_num report_num total-tel">'+(data[i].alipay_shop == null ? '0' : parseFloat(data[i].alipay_shop).toFixed(2))+'</td>'+  // 银台支付宝
                                '<td class="report_num report_num total-tel">'+parseFloat(data[i].wxpay).toFixed(2)+'</td>'+   // 微信支付
                                '<td class="report_num report_num total-tel">'+parseFloat(data[i].alipay).toFixed(2)+'</td>'+  //支付宝支付

                                '<td class="hide" data-type="stored_count_type">'+data[i].stored_count_type+'</td>'+ //状态  1 售卖  2已使用   3作废  
                                '<td class="hide" data-type="recordId">'+data[i].record_id+'</td>'+        //记录ID
                                '<td class="hide" data-type="aUserName">'+data[i].a_user_name+'</td>'+  //操作人
                                '<td class="hide" data-type="storedMoney">'+data[i].stored_money+'</td>'+   //储值金额
                                '<td class="hide" data-type="giveMoney">'+data[i].stored_count_type+'</td>'+     //反赠金额
                            '</tr>';

            totalStoredMoney += parseFloat(data[i].stored_money);// 合计储值金额
            totalGiveMoney += parseFloat(data[i].give_money);// 合计赠送金额
            totalCash += parseFloat(data[i].cash);          // 现金
            totalCard += parseFloat(data[i].card);          // 银行卡
            totalFree += parseFloat(data[i].free);          // 免单
            wxpay_shop += (data[i].wxpay_shop == null ? 0 : parseFloat(data[i].wxpay_shop));            // 银台微信
            alipay_shop += (data[i].alipay_shop == null ? 0 : parseFloat(data[i].alipay_shop));         // 银台支付宝
            totalCards ++; // 合计实收金额
            count += parseFloat(data[i].stored_num);
            wxpay += parseFloat(data[i].wxpay);
            alipay += parseFloat(data[i].alipay);
        }

        // 合计
        contentPro +=  '<tr class="total-trheji">'+
                        '<td class="total-addr">合计</td>'+
                        '<td class="report_num total-addr">'+totalStoredMoney.toFixed(2)+'</td>'+
                        '<td class="report_num total-addr">'+totalGiveMoney.toFixed(2)+'</td>'+
                        '<td class="report_num">'+count.toFixed(0)+'</td>'+
                        '<td class="report_num total-addr">'+totalCash.toFixed(2)+'</td>'+
                        '<td class="report_num total-addr">'+totalCard.toFixed(2)+'</td>'+
                        '<td class="report_num total-addr">'+totalFree.toFixed(2)+'</td>'+
                        '<td class="report_num total-addr">'+wxpay_shop.toFixed(2)+'</td>'+
                        '<td class="report_num total-addr">'+alipay_shop.toFixed(2)+'</td>'+
                        '<td class="report_num total-addr">'+wxpay.toFixed(2)+'</td>'+
                        '<td class="report_num total-addr">'+alipay.toFixed(2)+'</td>'+
                    '</tr>'+content;

        // 添加到页面中
        $theContent.html(contentPro);

    };
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
    
});
