$(function () {

    // 退赠转菜记录pa

            var shopIdPro = $.cookie('shop_id');

            // 定义状态参数 1:退菜，2：赠菜，3：转菜，4：折扣菜品,默认是0显示退菜列表
            var backStatus = 1;

            /*$("#start-date").val(getLocalDate()+' 00:00:00');
            $("#end-date").val(getLocalDate()+' 23:59:59');*/

            $("#start-date").val(getOffsetDateTime().start_date);
            $("#end-date").val(getOffsetDateTime().end_date);

             //topButtonScroll(".navContent",".out_table_title");//无分页
            // topButtonScroll2(".navContent",".out_table_title");//有分页，
            // 绑定点击事件
            HandoverBind();
            // 存储列表数据变量
            var handData = '';

            // 绑定点击事件
            function HandoverBind () {
                // 点击搜索
                $('#selectbtn').unbind('click').bind('click', function () {
                    selectHandover(backStatus);
                });

                // 点击下载
                $('#download').unbind('click').bind('click', function () {
                    downloadSelect(backStatus);
                });

                // 点击退菜
                $('#nav1').unbind('click').bind('click', function () {
                    $(this).addClass('caipin-fenleicheck').removeClass('caipin-fenleinucheck').siblings().removeClass('caipin-fenleicheck').addClass('caipin-fenleinucheck');
                    
                    /*$('#nav2').removeClass('caipin-fenleicheck');
                    $('#nav2').addClass('caipin-fenleinucheck');
                    $('#nav1').addClass('caipin-fenleicheck');
                    $('#nav1').removeClass('caipin-fenleinucheck');*/

                    // 显示下载按钮
                    $('#formDisplay').removeClass('hide');

                    $('#nav0-content').removeClass('hide');
                    $('#nav1-content').addClass('hide');
                    $('#nav2-content').addClass('hide');
                    $('#nav3-content').addClass('hide');

                    $('#nav0_search_page').removeClass('hide');
                    $('#nav1_search_page').addClass('hide');
                    $('#nav2_search_page').addClass('hide');
                    $('#nav3_search_page').addClass('hide');
                    backStatus = 1;
                });
                // 点击赠菜
                $('#nav2').unbind('click').bind('click', function () {
                    $(this).addClass('caipin-fenleicheck').removeClass('caipin-fenleinucheck').siblings().removeClass('caipin-fenleicheck').addClass('caipin-fenleinucheck');

                    /*$('#nav2').addClass('caipin-fenleicheck');
                    $('#nav2').removeClass('caipin-fenleinucheck');
                    $('#nav1').removeClass('caipin-fenleicheck');
                    $('#nav1').addClass('caipin-fenleinucheck');*/

                    // 显示下载按钮
                    $('#formDisplay').removeClass('hide');

                    $('#nav1-content').removeClass('hide');
                    $('#nav0-content').addClass('hide');
                    $('#nav2-content').addClass('hide');
                    $('#nav3-content').addClass('hide');

                    $('#nav1_search_page').removeClass('hide');
                    $('#nav0_search_page').addClass('hide');
                    $('#nav2_search_page').addClass('hide');
                    $('#nav3_search_page').addClass('hide');

                    backStatus = 2;
                });
                // 点击转菜
                $('#nav3').unbind('click').bind('click', function () {
                    $(this).addClass('caipin-fenleicheck').removeClass('caipin-fenleinucheck').siblings().removeClass('caipin-fenleicheck').addClass('caipin-fenleinucheck');
                    
                    /*$('#nav2').addClass('caipin-fenleicheck');
                    $('#nav2').removeClass('caipin-fenleinucheck');
                    $('#nav1').removeClass('caipin-fenleicheck');
                    $('#nav1').addClass('caipin-fenleinucheck');*/

                    // 隐藏下载按钮
                    $('#formDisplay').addClass('hide');

                    $('#nav2-content').removeClass('hide');
                    $('#nav0-content').addClass('hide');
                    $('#nav1-content').addClass('hide');
                    $('#nav3-content').addClass('hide');

                    $('#nav2_search_page').removeClass('hide');
                    $('#nav0_search_page').addClass('hide');
                    $('#nav1_search_page').addClass('hide');
                    $('#nav3_search_page').addClass('hide');

                    backStatus = 3;
                });
                // 折扣菜品
                $('#nav4').unbind('click').bind('click', function () {
                    $(this).addClass('caipin-fenleicheck').removeClass('caipin-fenleinucheck').siblings().removeClass('caipin-fenleicheck').addClass('caipin-fenleinucheck');
                    
                    /*$('#nav2').addClass('caipin-fenleicheck');
                    $('#nav2').removeClass('caipin-fenleinucheck');
                    $('#nav1').removeClass('caipin-fenleicheck');
                    $('#nav1').addClass('caipin-fenleinucheck');*/

                    // 隐藏下载按钮
                    $('#formDisplay').addClass('hide');
                    $('#nav3-content').removeClass('hide');
                    $('#nav0-content').addClass('hide');
                    $('#nav1-content').addClass('hide');
                    $('#nav2-content').addClass('hide');

                    $('#nav3_search_page').removeClass('hide');
                    $('#nav0_search_page').addClass('hide');
                    $('#nav1_search_page').addClass('hide');
                    $('#nav2_search_page').addClass('hide');

                    backStatus = 4;
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
                    
                    selectHandover(backStatus, searchObj.page, searchObj);
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
                        searchObj.page = _temp;
                        selectHandover(backStatus, searchObj.page, searchObj);
                    }else{
                        displayMsg(ndPromptMsg, '请输入正确的页码', 2000);
                    }
                });

            }

            // 下载
            function downloadSelect(Status) {
                // 开始时间
                var startDate = $("#start-date").val();
                // 结束时间
                var endDate = $("#end-date").val();
                
                // 日期
                if (startDate > endDate) {
                    displayMsg(ndPromptMsg, '开始时间应小于结束时间!', 2000);
                    return;
                }
                var CID = $.cookie('cid');
                var business = location.href.split("//")[1].split('.')[0];

                $('form').attr('action',AdminUrl.menuCountBackMenuDownload);
                $('#start_date').val(startDate);
                $('#end_date').val(endDate);
                $('#shop_ids').val(shopIdPro);
                $('#type').val(backStatus);
                $('#page').val(1);
                $('#cid').val(CID);
                $('#company_name_en').val(business);

                setAjax(AdminUrl.menuCountBackMenu, {
                    'start_date': startDate,
                    'end_date': endDate,
                    'shop_ids': shopIdPro,
                    'type': backStatus,
                    'page': 1
                }, $('#prompt-message'), {20: ''}, function(respnoseText) {
                    if (respnoseText.code == 20) {
                        // 下载
                        $('form').submit();
                    } else {
                        displayMsg(ndPromptMsg, respnoseText.message, 2000);
                    }
                }, 0);
            }

            // 搜索显示门店
            function selectHandover (Status, thePage, searchObj) {//thepage是请求的第几页
                var self = this;
                //alert(thePage);
                var $cardTypeContent = $('#nav0-content').find('.tbodys');
                var $totalBox = $("#nav0_totalBox");
                // 搜索显示数据之前先清空列表
                if (Status == 1) {
                    $cardTypeContent = $('#nav0-content').find('.tbodys');
                    $totalBox = $("#nav0_totalBox");
                } else if (Status == 2) {
                    $cardTypeContent = $('#nav1-content').find('.tbodys');
                    $totalBox = $("#nav1_totalBox");
                } else if (Status == 3) {
                    $cardTypeContent = $('#nav2-content').find('.tbodys');
                    $totalBox = $("#nav2_totalBox");
                } else if (Status == 4) {
                    $cardTypeContent = $('#nav3-content').find('.tbodys');
                    $totalBox = $("#nav3_totalBox");
                }
                $cardTypeContent.html('');

                // 开始时间
                var startDate = $("#start-date").val();
                // 结束时间
                var endDate = $("#end-date").val();

                //清单对应的分页标签
                var $searchPage;
                switch(Status){
                    case 1:
                        $searchPage = $("#nav0_search_page");
                    break;
                    case 2:
                        $searchPage = $("#nav1_search_page");
                    break;
                    case 3:
                        $searchPage = $("#nav2_search_page");
                    break;
                    case 4:
                        $searchPage = $("#nav3_search_page");
                    break;
                }
                
                //如果是分页请求就替换相应值
                if(searchObj){
                    startDate = searchObj.start_date;
                    endDate = searchObj.end_date;
                    Status = searchObj.type;
                }


                if (startDate > endDate) {
                    displayMsg(ndPromptMsg, '开始时间应小于结束时间!', 2000);
                    return;
                }

                //分页信息用的参数
                var pageObj = {
                    'start_date': startDate,  //开始时间
                    'end_date' : endDate,     //结束时间
                    'type': Status,           //请求类型
                    'page': thePage||1,       //请求的页数
                    '$search_page': $searchPage,  //分页对应的分页位置
                    'shop_ids': shopIdPro
                };

                setAjax(AdminUrl.menuCountBackMenu, {
                    'start_date': startDate,
                    'end_date': endDate,
                    'shop_ids': shopIdPro,
                    'type': Status,
                    'page': thePage||1
                }, $('#prompt-message'), {20: ''}, function(respnoseText) {
                    if (respnoseText.code == 20) {
                        if (Status == 1) {
                            $('#nav0-content .out_table_title').removeClass('hide');
                            $('#nav0-content .Records_content').removeClass('hide');
                            $('#nav0_search_page').removeClass('hide');
                        } else if (Status == 2) {
                            $('#nav1-content .out_table_title').removeClass('hide');
                            $('#nav1-content .Records_content').removeClass('hide');
                            $('#nav1_search_page').removeClass('hide');
                        } else if (Status == 3) {
                            $('#nav2-content .out_table_title').removeClass('hide');
                            $('#nav2-content .Records_content').removeClass('hide');
                            $('#nav2_search_page').removeClass('hide');
                        } else if (Status == 4) {
                            $('#nav3-content .out_table_title').removeClass('hide');
                            $('#nav3-content .Records_content').removeClass('hide');
                            $('#nav3_search_page').removeClass('hide');
                        }
                        // 得到返回数据
                        handData = respnoseText.data;
                        HandoverList(handData, $cardTypeContent, pageObj, $totalBox);
                    } else {
                        if (Status == 1) {
                            $('#nav0-content .out_table_title').addClass('hide');
                            $('#nav0-content .Records_content').addClass('hide');
                            $('#nav0_search_page').addClass('hide');
                        } else if (Status == 2) {
                            $('#nav1-content .out_table_title').addClass('hide');
                            $('#nav1-content .Records_content').addClass('hide');
                            $('#nav1_search_page').addClass('hide');
                        } else if (Status == 3) {
                            $('#nav2-content .out_table_title').addClass('hide');
                            $('#nav2-content .Records_content').addClass('hide');
                            $('#nav2_search_page').addClass('hide');
                        } else if (Status == 4) {
                            $('#nav3-content .out_table_title').addClass('hide');
                            $('#nav3-content .Records_content').addClass('hide');
                            $('#nav3_search_page').addClass('hide');
                        }
                        displayMsg(ndPromptMsg, respnoseText.message, 2000);
                    }
                }, 0);
            }

            // 显示数据
            function HandoverList (data, $tbodys, pageObj, $theTotalBox) {
                    var dataObj =  tableHead(data, pageObj, $tbodys, $theTotalBox); //要过滤的数据和请求页的数据 注:分页函数在tableHead中调用

                    data = dataObj.data;

                    var content = '';
                    //var totalContent = '';

                    var num = 1;

                    var count = 0;      // 退赠转菜数量
                    var money = 0;      // 退赠转菜金额
                    /*var ct;
                    if (data.ct != undefined) {
                        ct = data.ct;
                        delete data.ct;
                    }*/

                    var payno;
                    for (var i in data) {
                        // backStatus 1 退菜，2 赠菜
                        if (backStatus == 1) {
                            count = data[i].cancel_menu_num;
                            money = data[i].cancel_menu_money;
                        } else if (backStatus == 2) {
                            count = data[i].give_menu_num;
                            money = data[i].give_menu_money;
                        } else if (backStatus == 3) {
                            count = data[i].rotate_menu_num;
                            money = data[i].rotate_menu_money;
                        } else if (backStatus == 4) {
                            count = data[i].rotate_menu_num;
                            money = data[i].rotate_menu_money;
                        }

                        // 显示退、赠、转菜原因
                        var note = '';
                        if (data[i].reason == '') {
                            note = '';
                        } else {
                            for (var y in data[i].reason) {
                                if (data[i].reason[y].re_note == '') {
                                    note += '';
                                } else {
                                    note += '<p>'+data[i].reason[y].re_note+'</p>';
                                }
                            }
                            if (note != '') {
                                var noteTo = '<div class="addSetInner" data-type="note">'+note+'</div>';
                                note = noteTo;
                            }
                        }
                        if(!data[i].pay_no) {
                            payno = '';
                        } else {
                            payno = data[i].pay_no;
                        }

                         if(backStatus == 4){
                           
                            content +=  '<tr class="total-tr">'+
                                        '<td>'+num+'</td>'+
                                        '<td>'+getAppointTimePro(data[i].add_time)+'</td>'+
                                        '<td class="report_text">'+data[i].shop_name+'</td>'+
                                        '<td class="report_text">'+data[i].table_name+'</td>'+
                                        '<td class="report_text">'+data[i].menu_name+'</td>'+
                                        '<td class="report_num">'+data[i].menu_price+'</td>'+
                                        '<td class="report_num">'+data[i].menu_num+'</td>'+
                                        '<td class="report_num">'+data[i].menu_money+'</td>'+
                                        '<td class="report_num">'+data[i].discount_money+'</td>'+
                                        '<td class="report_num">'+data[i].discount_rate+'</td>'+
                                        '<td class="payid_css">'+pay_no_he(payno)+'&nbsp;'+'('+data[i].pay_id+')'+'</td>'+
                                    '</tr>';
                            num++;
                        }else{
                            content +=  '<tr class="total-tr">'+
                                        '<td>'+num+'</td>'+
                                        '<td>'+getAppointTimePro(data[i].add_time)+'</td>'+
                                        // '<td class="report_text">'+data[i].shop_name+'</td>'+
                                        '<td class="report_text">'+data[i].menu_name+'</td>'+
                                        '<td class="report_num">'+parseFloat(data[i].menu_price).toFixed(2)+'</td>'+
                                        '<td class="report_num">'+parseFloat(count).toFixed(1)+'</td>'+
                                        '<td class="report_num">'+parseFloat(money).toFixed(2)+'</td>'+
                                        '<td class="payid_css">'+pay_no_he(payno)+'&nbsp;'+'('+data[i].pay_id+')'+'</td>'+
                                        '<td class="wrapAdd">'+note+'</td>'+
                                    '</tr>';
                            num++;
                        }

                    }

                    // 合计
                    /*totalContent =  '<tr class="total-trheji">'+
                                    '<td>合计</td>'+
                                    '<td></td>'+
                                    '<td></td>'+
                                    '<td></td>'+
                                    '<td>'+countTotal+'</td>'+
                                    '<td>'+moneyTotal+'</td>'+
                                    '<td></td>'+
                                '</tr>'+content;*/

                    // 添加到页面中
                    $tbodys.html(content);

                    $tbodys.find('div[data-type="note"]').each(function () {
                        $(this).unbind('click').bind('click', function () {
                            $(this).toggleClass('addSetInner');
                        });
                    });

            }

            //分离创建表头表单头部信息,返回原有data,汇总在这个函数创造
            function tableHead(data,pageObj,$tbodys,$theTotalBox){
                //多少页   
                var page = data.page; //返回页数 
                delete data.page;
                
                var ctNumArr; //非订单过滤
                var content = '';  //合计内容
                
                for (var i in data) { //这个是根据页面当前的自定义付款方式显示,删除对应st开头字符串
                    
                    if(i.length == 2 && i.substr(0, 2) == 'ct'){
                        ctNumArr = data[i];
                        delete data[i];
                    }
                }

                var countTotal = 0;// 退赠转菜数量合计
                var moneyTotal = 0;// 退赠转菜金额合计

                    if (backStatus == 1) {
                        countTotal = ctNumArr.cancel_menu_num;
                        moneyTotal = ctNumArr.cancel_menu_money;
                    } else if (backStatus == 2) {
                        countTotal = ctNumArr.give_menu_num;
                        moneyTotal = ctNumArr.give_menu_money;
                    } else if (backStatus == 3) {
                        countTotal = ctNumArr.rotate_menu_num;
                        moneyTotal = ctNumArr.rotate_menu_money;
                    } else if (backStatus == 4) {
                        countTotal = ctNumArr.rotate_menu_num;
                        moneyTotal = ctNumArr.rotate_menu_money;
                    }

                    if(backStatus == 4){
                            content = '<tr class="total-trheji">'+
                                        '<td>合计</td>'+
                                        '<td></td>'+
                                        '<td></td>'+
                                        '<td></td>'+
                                        '<td></td>'+
                                        '<td class="report_num">'+parseFloat(countTotal).toFixed(1)+'</td>'+
                                        '<td class="report_num">'+parseFloat(moneyTotal).toFixed(2)+'</td>'+
                                        '<td></td>'+
                                        '<td></td>'+
                                        '<td></td>'+
                                    '</tr>';
                    }else{
                            content = '<tr class="total-trheji">'+
                                        '<td>合计</td>'+
                                        /*'<td></td>'+*/
                                        '<td></td>'+
                                        '<td></td>'+
                                        '<td></td>'+
                                        '<td class="report_num">'+parseFloat(countTotal).toFixed(1)+'</td>'+
                                        '<td class="report_num">'+parseFloat(moneyTotal).toFixed(2)+'</td>'+
                                        '<td></td>'+
                                        '<td></td>'+
                                    '</tr>';
                    }
                $theTotalBox.html(content);
                
                pageAct(page,pageObj);
                
                return {data:data};
                
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
                    //console.log(content);
                    var contentArr = content.split("&"); //分割数组
                    var _strTemp;
                    
                    if(searchObj.page < 5){//前十个
                        //alert(searchObj.page);
                        _strTemp = contentArr.slice(0,5);
                        content = _strTemp.toString();
                        content = content.replace(/,/g,'');
                        content = content + "<span>...</span>";
                        
                        
                    }else if((5 <= searchObj.page)&&(searchObj.page <= MaxPageNum-5)){ //中间
                        // 如果是10页面下面两个数都是5，如果是5也下面两个数 3 2
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

});

