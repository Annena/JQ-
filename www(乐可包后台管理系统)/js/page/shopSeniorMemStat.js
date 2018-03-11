$(function () {
        // ipad滚动条无法滚动的解决
        scrollHei('.stores-nav', '.stores-content', '.stafffloatdivs');
        var menuStatus = 2; //当前选中的标签data-type的值 1:未使用 2:已使用 3:已作废
        var $cardTypeContent = $('#cardTypeContent_2 .tbodys');//jQ初始对象存储对应的内容DIV
        // 门店高级会员授权统计 cardStatistics 

            /*$("#start-date").val(getLocalDate());
            $("#end-date").val(getLocalDate());*/

            $("#start-date").val(getOffsetDateTime().start_day);
            $("#end-date").val(getOffsetDateTime().end_day);
            
            // 绑定点击事件
            CashierBind();
            var shopIdPro = $.cookie('shop-shop_id');
            
            
            //添加切换事件
            $("#cardType_1,#cardType_2,#cardType_3").click(function(){
                
                $(".caipin-fenleicheck").removeClass("caipin-fenleicheck").addClass("caipin-fenleinucheck");
                menuStatus = $(this).removeClass("caipin-fenleinucheck").addClass("caipin-fenleicheck").attr("data-type");
                menuStatus = parseInt(menuStatus);
                
                //显示内容
                $(".stores-content").addClass("hide");
                
                switch(menuStatus)
                {   // 定义授权会员参数 1:未使用 2:已使用 3:已作废
                    case 1:
                        var $theContent = $("#cardTypeContent_1");
                        $theContent.removeClass("hide");
                        $cardTypeContent = $theContent.find(".tbodys");
                        
                        //alert(menuStatus);
                        //DishesData(0);
                    break;
                    case 2:
                        var $theContent = $("#cardTypeContent_2");
                        $theContent.removeClass("hide");
                        $cardTypeContent = $theContent.find(".tbodys");
                        
                        //alert(menuStatus);
                        //DishesData(1);
                    break;
                    case 3:
                        var $theContent =  $("#cardTypeContent_3");
                        $theContent.removeClass("hide");
                        $cardTypeContent = $theContent.find(".tbodys");
                        
                        //alert(menuStatus);
                        //DishesData(2);
                    break;
                
                }
                
                
            });
            
            // 绑定点击事件
            function CashierBind () {
                // 点击搜索
                $('#selectbtn').unbind('click').bind('click', function () {
                    var selectType = menuStatus;//获取当前类型标签
                    
                    //此处有可能页面进入后默认显示某日搜索，顾用变量$cardTypeContent，未纯参数传递
                    selectCashier(selectType,$cardTypeContent);
                });

                // 点击下载
                $('#download').unbind('click').bind('click', function () {
                    var selectType = menuStatus;//获取当前类型标签
                    //此处有可能页面进入后默认显示某日搜索，顾用变量$cardTypeContent，未纯参数传递
                    downloadSelect(selectType,$cardTypeContent);
                });
                
            }

            // 下载
            function downloadSelect(selectType,$theContent) {
                var startDate = $("#start-date").val();
                var endDate = $("#end-date").val();
                // 搜索显示数据之前先清空数据
                
                //$theContent.html('');

                if (startDate > endDate) {
                    displayMsg(ndPromptMsg, '开始日期应小于结束日期!', 2000);
                    return;
                }

                var CID = $.cookie('cid');
                var business = location.href.split("//")[1].split('.')[0];


                $('form').attr('action',AdminUrl.userCountDownload);
                $('#start_date').val(startDate);
                $('#end_date').val(endDate);
                $('#type').val(selectType);
                $('#shop_ids').val(shopIdPro);
                $('#cid').val(CID);
                $('#company_name_en').val(business);
                
                setAjax(AdminUrl.userCountMemberAuthorization, {
                    'start_date': startDate,
                    'end_date': endDate,
                    'type': selectType, //传输类型
                    'shop_ids': shopIdPro
                }, $('#prompt-message'), {20: ''}, function(respnoseText) {
                    
                    if (respnoseText.code == 20) {
                        $('form').submit();
                    } else {
                        displayMsg(ndPromptMsg, respnoseText.message, 2000);
                    }
                }, 0);


                
            }

            // 搜索发卡日期
            function selectCashier (selectType,$theContent) { // (类型，指向应显示的内容jQ)
                var startDate = $("#start-date").val();
                var endDate = $("#end-date").val();
                // 搜索显示数据之前先清空数据
                
                $theContent.html('');
                // 日期
                
                setAjax(AdminUrl.userCountMemberAuthorization, {
                    'start_date': startDate,
                    'end_date': endDate,
                    'type': selectType, //传输类型
                    'shop_ids': shopIdPro
                }, $('#prompt-message'), {20: ''}, function(respnoseText) {
                    
                    if (respnoseText.code == 20) {
                        $('#cardTypeContent_'+selectType+' .out_table_title').removeClass('hide');
                        $('#cardTypeContent_'+selectType+' .Records_content').removeClass('hide');
                        // 得到返回数据
                        var data = respnoseText.data;
                        CashierList(data,$theContent);
                    } else {
                        $('#cardTypeContent_'+selectType+' .out_table_title').addClass('hide');
                        $('#cardTypeContent_'+selectType+' .Records_content').addClass('hide');
                        displayMsg(ndPromptMsg, respnoseText.message, 2000);
                    }
                }, 0);
            }

            // 显示数据
            function CashierList (data,$theContent) {
                    var content = '';
                    var contentPro = '';
                    
                    var num = 0;   // 合计个数
                    var totalCards = 0;

                    for (var i in data) {
                        //console.log(data);
                        content +=  '<tr class="total-tr">'+
                                        '<td class="total-addr" data-type="storedName">'+data[i].count_day+'</td>'+ // 日期
                                        '<td class="report_text total-tel" data-type="storedMoney">'+data[i].shop_name+'</td>'+ // 店铺
                                        '<td class="report_num total-tel" data-type="giveMoney">'+data[i].user_sum+'</td>'+        // 个数
                                    '</tr>';

                        num += parseFloat(data[i].user_sum);// 合计个数
                        totalCards ++;
                    }

                    // 合计
                    contentPro +=  '<tr class="total-trheji">'+
                                    '<td class="total-addr">合计</td>'+
                                    '<td class="total-addr">——</td>'+
                                    '<td class="report_num total-addr">'+num+'</td>'+
                                '</tr>'+content;



                    // 添加到页面中
                    $theContent.html(contentPro);
            }
            
          
 


});
