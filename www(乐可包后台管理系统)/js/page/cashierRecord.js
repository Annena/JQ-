$(function () {
    
    // 收银记录 lw 2016.3.28

    var menuStatus = 2; //当前选中的标签data-type的值 1:正常 2:反清机
    var $cardTypeContent = $("#nav0-content").find(".tbodys"); //当前显示的内容jQ对象
    var $totalBox = $("#nav0_totalBox"); //汇总部分
    var cleanData = '';  // 存储列表数据变量
    var order_by = 0; //排序
    /*$("#start-date").val(getLocalDate()+' 00:00:00');
    $("#end-date").val(getLocalDate()+' 23:59:59');*/

    $("#start-date").val(getOffsetDateTime().start_date);
    $("#end-date").val(getOffsetDateTime().end_date);

    //var localData = getLocalDateMin();
    var defaults = {
        /*start: localData,
        end: localData,*/
        shop: ['all']
    };
    // 添加滚动条，上下左右可以移动滚动条
    //topButtonScroll(".navContent",".out_table_title");//无分页
    topButtonScroll2(".navContent",".out_table_title");//有分页，

    //$("#end-date").val(getLocalDateMin());
    // 绑定点击事件
    CashierBind();

    // 绑定点击事件
    function CashierBind () {
        
        //添加切换事件
        $("#nva1,#nav2").click(function(){
            
            $(".caipin-fenleicheck").removeClass("caipin-fenleicheck").addClass("caipin-fenleinucheck");
            menuStatus = $(this).removeClass("caipin-fenleinucheck").addClass("caipin-fenleicheck").attr("data-type");
            menuStatus = parseInt(menuStatus);
            //显示内容
            $(".navContent").addClass("hide");//全部隐藏
            
            switch(menuStatus)
            {   // 定义菜品状态参数 0:退单 1:退菜 2:退款
                case 2:
                    var $theContent = $("#nav0-content");
                    $theContent.removeClass("hide");
                    $cardTypeContent = $theContent.find(".tbodys"); //刷入对应的 内容 Jq对象
                    $(".search_page,.totalheji,totalheji").addClass("hide");
                    $("#nav0_search_page,#nav0_totalBox").removeClass("hide");
                    $totalBox =  $("#nav0_totalBox"); //汇总位置
                break;
                case 3:
                    var $theContent = $("#nav1-content");
                    $theContent.removeClass("hide");
                    $cardTypeContent = $theContent.find(".tbodys"); //刷入对应的 内容 Jq对象
                    $(".search_page,.totalheji,totalheji").addClass("hide");
                    $("#nav1_search_page,#nav1_totalBox").removeClass("hide");
                    $totalBox =  $("#nav1_totalBox"); //汇总位置
                break;
            }
        });
        
        // 点击搜索
        $('#selectbtn').unbind('click').bind('click', function () {
            selectCashier();
        });

        // 点击店铺
        $('#shopList').unbind('click').bind('click', function () {
            DishesDatashop();
        });
        
        //lw 添加反结账按钮事件 
        $('#nav0-content').on('click','[data-type="UncashierRecord"]',function(){
            
            var $tr = $(this).parents('tr');
            var UncashierRecord_Id = $tr.find('td[data-type="payid"]').text();//与后端确定清机所需 pay_id
            var pa = /.*\((.*)\)/;
            var UncashierRecord_Id = UncashierRecord_Id.match(pa)[1];
            // 现金退款
            var cash = $tr.find('td[data-type="cash"]').text();
            // 银行卡退款
            var card = $tr.find('td[data-type="card"]').text();
            // 快捷支付退款
            //var quickPay = $tr.find('td[data-type="quickpay"]').text();
            // 其他退款
            var other = $tr.find('td[data-type="other"]').text();

            showUncashierRecord(UncashierRecord_Id,cash,card,other);
        });
        
        $('.tbodys').delegate('tr .xiangqingbtn', 'click', function(event) {
            //alert(1);
            var self = this,
                type = $(event.target).attr('data-type'),
                payid = $(self).parents('tr').find('td[data-type="payid"]').text();
            var pa = /.*\((.*)\)/;
            payid = payid.match(pa)[1];
            var re_pay_id = $(self).parents('tr').find('td[data-type="payid"]').attr('re_pay_id');
            if (menuStatus == 3) {
                payid = re_pay_id;
            }
            // 点击详情
            if (type == "handoverxq") {
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
        //点击消费金额排序
        $('#menu_consume').unbind('click').bind('click', function () {
            if(order_by == 0){
                order_by = 1
                $('.botjt').addClass('botjtCurrent')
                $('.menu_consume .topjt').removeClass('topjtCurrent')
                selectCashier()
            }else if(order_by != 0 && order_by == 1){
                order_by = 2
                $('.menu_consume .botjt').removeClass('botjtCurrent')
                $('.topjt').addClass('topjtCurrent')
                selectCashier()
            }else if(order_by != 0 && order_by == 2){
                order_by = 1
                $('.menu_consume .topjt').removeClass('topjtCurrent')
                $('.botjt').addClass('botjtCurrent')
                selectCashier() 
            }else{
                order_by = 1
                $('.botjt').addClass('botjtCurrent')
                $('.topjt').addClass('topjtCurrent') 
                $('.menu_consume .topjt').removeClass('topjtCurrent')
                selectCashier()
            }
        })
        //点击现金支付排序
        $('#menu_cash').unbind('click').bind('click', function () {
            if(order_by == 0){
                order_by = 3
                $('.menu_cash .topjt').removeClass('topjtCurrent')
                $('.botjt').addClass('botjtCurrent')
                selectCashier()
            }else if(order_by != 0 && order_by == 3){
                order_by = 4
                $('.menu_cash .botjt').removeClass('botjtCurrent')
                $('.topjt').addClass('topjtCurrent') 
                selectCashier()
            }else if(order_by != 0 && order_by == 4){
                order_by = 3
                $('.menu_cash .topjt').removeClass('topjtCurrent')
                $('.botjt').addClass('botjtCurrent')
                selectCashier() 
            }else{
                order_by = 3
                $('.botjt').addClass('botjtCurrent')
                $('.topjt').addClass('topjtCurrent') 
                $('.menu_cash .topjt').removeClass('topjtCurrent')
                selectCashier()
            }
        })
        //点击储值支付排序
        $('#menu_pri_money').unbind('click').bind('click', function () {
            if(order_by == 0){
                order_by = 5
                $('.menu_pri_money .topjt').removeClass('topjtCurrent')
                $('.botjt').addClass('botjtCurrent')
                selectCashier()
            }else if(order_by != 0 && order_by == 5){
                order_by = 6
                $('.menu_pri_money .botjt').removeClass('botjtCurrent')
                $('.topjt').addClass('topjtCurrent') 
                selectCashier()
            }else if(order_by != 0 && order_by == 6){
                order_by = 5
                $('.menu_pri_money .topjt').removeClass('topjtCurrent')
                $('.botjt').addClass('botjtCurrent')
                selectCashier() 
            }else{
                order_by = 5
                $('.botjt').addClass('botjtCurrent')
                $('.topjt').addClass('topjtCurrent') 
                $('.menu_pri_money .topjt').removeClass('topjtCurrent')
                selectCashier()
            }
        })
        //点击微信支付排序
        $('#menu_wxpay').unbind('click').bind('click', function () {
            if(order_by == 0){
                order_by = 7
                $('.menu_wxpay .topjt').removeClass('topjtCurrent')
                $('.botjt').addClass('botjtCurrent')
                selectCashier()
            }else if(order_by != 0 && order_by == 7){
                order_by = 8
                $('.menu_wxpay .botjt').removeClass('botjtCurrent')
                $('.topjt').addClass('topjtCurrent') 
                selectCashier()
            }else if(order_by != 0 && order_by == 8){
                order_by = 7
                $('.menu_wxpay .topjt').removeClass('topjtCurrent')
                $('.botjt').addClass('botjtCurrent')
                selectCashier() 
            }else{
                order_by = 7
                $('.botjt').addClass('botjtCurrent')
                $('.topjt').addClass('topjtCurrent')
                $('.menu_wxpay .topjt').removeClass('topjtCurrent')
                selectCashier()
            }
        })
        //点击支付宝支付排序
        $('#menu_alipay').unbind('click').bind('click', function () {
            if(order_by == 0){
                order_by = 9
                $('.menu_alipay .topjt').removeClass('topjtCurrent')
                $('.botjt').addClass('botjtCurrent')
                selectCashier()
            }else if(order_by != 0 && order_by == 9){
                order_by = 10
                $('.menu_alipay .botjt').removeClass('botjtCurrent')
                $('.topjt').addClass('topjtCurrent') 
                selectCashier()
            }else if(order_by != 0 && order_by == 10){
                order_by = 9
                $('.menu_alipay .topjt').removeClass('topjtCurrent')
                $('.botjt').addClass('botjtCurrent')
                selectCashier() 
            }else{
                order_by = 9
                $('.botjt').addClass('botjtCurrent')
                $('.topjt').addClass('topjtCurrent')
                $('.menu_alipay .topjt').removeClass('topjtCurrent')
                selectCashier()
            }
        })
        
    }
    // 获取店铺列表
    function DishesDatashop () {
        //console.log($('a.current')[0]);
        setAjax(AdminUrl.shopShopList, {
            'type': 2
        }, $('#prompt-message'), {20: ''}, function(respnoseText) {
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
        }, 1);
    }

    // 搜索显示门店的分页部分
    function selectCashier (thePage,searchObj) {//thepage是请求的第几页
       
        // 搜索显示数据之前先清空数据
        $cardTypeContent.html('');
        // 日期
        var startDate = $("#start-date").val();
        // 结束月份
        var endDate = $("#end-date").val();
        //清单类型
        var selectType = menuStatus;
        // //清单类型
        // var selectType = menuStatus;

        //订单属性范围 0 全部  1 堂食 2 外卖
        var order_property = $("#order_property  option:selected").val();


        //清单对应的分页标签
        var $searchPage;
        switch(selectType){
            case 2:
                $searchPage = $("#nav0_search_page");
            break;
            case 3 :
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

        //分页信息用的参数
        var pageObj = {
            'start_date': startDate,  //开始时间
            'end_date' : endDate,     //结束时间
            'type': selectType,       //请求类型
            'page': thePage||1,       //请求的页数
            '$search_page': $searchPage,  //分页对应的分页位置
            'shop_ids': defaults.shop,
            'order_property':order_property,
            'order_by':order_by
        };
        setAjax(AdminUrl.recordPayRecord, {
            'start_date': startDate,
            'end_date' : endDate,
            'type': selectType,
            'page': thePage||1,
            'shop_ids': defaults.shop,
            'order_property':order_property,
            'order_by':order_by
        }, $('#prompt-message'), {20: ''}, function(respnoseText) {
            if (respnoseText.code == 20) {
                // 显示出来页面的标题
                if (selectType == 2) {
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
                if (selectType == 2) {
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
                displayMsg(ndPromptMsg, respnoseText.message, 2000);
            }
        }, 0);
    }

    //分离创建表头表单头部信息,返回原有data
    function tableHead(data,pageObj,$tbodys,$theTotalBox){
        //合计
        var ct = data.ct; //合计部分
        delete data.ct;
        
        //多少页   
        var page = data.page;//总共页数 
        delete data.page;
        delete data.is_re_pay;
            
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
        
        for(var i in payDict){ //解析出订单查询的自定义方式
            ctNumArr.push(i);
            ctToNameArr.push(payDict[i].pay_type_name);
        }
        
        //生成th部分
        var content = ''; //表头空文件
        var content1 = '';// 优惠
        var num1 = 0; // 多少个其他支付方式  
        for(var y = 0; y<ctNumArr.length;y++){
            var tr_name = other_take_name(ctNumArr[y]);
            num1++;
            content += "<th class='otherTh_rec twidth'>"+ctToNameArr[y]+tr_name.pay_money_name+"</th>"; // 实收
            content1 += "<th class='otherTh_dis twidth'>"+ctToNameArr[y]+tr_name.pre_money_name+"</th>"; // 优惠
            thMap[y] = ctNumArr[y]; //返回给生成td用的参数
        }

        var otherTh_rec =  $tbodys.parents("table").find(".otherTh_rec"); //获取当前页面的其它列
        var otherTh_dis =  $tbodys.parents("table").find(".otherTh_dis"); //获取当前页面的其它列

        $(otherTh_rec[0]).siblings(".otherTh_rec").remove(); //删除除了第一列以外的动态添加列
        otherTh_rec.replaceWith(content); //替换第一列为最新的列

        $(otherTh_dis[0]).siblings(".otherTh_dis").remove(); //删除除了第一列以外的动态添加列
        otherTh_dis.replaceWith(content1); //替换第一列为最新的列
        
        // 增加悬浮头的地方
        var otherPay_rec;
        var otherPay_dis;

        if (pageObj.type == 2) {
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
        var otherClass = accAdd(accMul(accMul(num1, 2), 134), 3550);  //支付宝 美团 百度 饿了么 3平台优惠 +1400 -1200px
        if (pageObj.type == 2) {
            $('#nav0-content table').css('width', otherClass+'px');
        } else if (pageObj.type == 3) {
            $('#nav1-content table').css('width', otherClass+'px');
        }
    
        //生成表内样式 启用
        content = '';
        //for (var i in data) {
            var _tempOther_rec = '';// 自定义支付方式实收
            var _tempOther_dis = '';// 自定义支付方式优惠
            
            // 其他支付实收金额之和
            var pref_money = 0;
            // 其他支付实优惠金额之和
            var you_money = 0;

            for(var y=0;y<thMap.length;y++){
                _str = thMap[y];
                //alert(typeof(thMap[y]));
                //console.log(data[i]);
                //if(ct[_str] ){
                    // 得到实收、优惠
                    var pay_money = 0;
                    var preferential_money = 0;

                    for (var k in payDict) {
                        if (k == _str) {
                            pay_money = parseFloat(payDict[k].pay_money);
                            if (payDict[k].preferential_money == undefined) {
                                preferential_money = 0;
                            } else {
                                preferential_money = parseFloat(payDict[k].preferential_money);
                            }
                        }
                    }

                    // 显示实收、优惠
                    //_tempOther_rec += "<th  data-type='"+_str+"'>"+ct[_str]+"</th>";
                    _tempOther_rec +="<td class='report_num' data-type='"+_str+"'>"+parseFloat(pay_money).toFixed(2)+"</td>";
                    _tempOther_dis +="<td class='report_num' data-type='"+_str+"'>"+parseFloat(preferential_money).toFixed(2)+"</td>";

                    pref_money += parseFloat(pay_money);
                    you_money += preferential_money;
                /*}else{
                     _tempOther_rec += "<th>0</th>";
                     _tempOther_dis += "<th>0</th>";
                }*/
                
            }

            /*
                收银统计，收银记录，清机记录，计算金额方法
                data：               数据
                pay_money：          自定义支付方式实收
                preferential_money： 自定义支付方式优惠
             */
            var cal_data = calculation_money(ct, pref_money, you_money);

            // 计算各种金额
            /*var con_money = 0;      // 消费金额
            var res_money = 0;      // 实收金额
            var dis_money = 0;      // 优惠总金额
            var pac_money = 0;      // 套餐优惠
            var str_money = 0;      // 乐币
            var sts_money = 0;      // 储值优惠
            var sub_money = 0;      // 银台折扣
            var pri_money = 0;      // 储值本金消费
            var vou_money = 0;      // 抵用劵金额
            var wxp_money = 0;      // 微信金额
            var use_money = 0;      // 人均消费
            var re_principal = 0;   // 退储值本金
            var re_stsprgive = 0;   // 退储值赠送*/

            //alert('ddd');
            content +=  '<tr class="total-tr">'+
                    '<td data-type="payid">合计</td>'+ //结账单号
                    '<td data-type="btn">'+'——'+'</td>'+               
                    '<td data-type="ordertime">'+'——'+'</td>'+ //结账时间
                    '<td data-type="ordertime">'+'——'+'</td>'+ // 店铺
                    '<td class="report_num">'+cal_data.con_money+'</td>'+               //消费金额
                    '<td class="report_num">'+cal_data.res_money+'</td>'+               //实收金额
                    '<td class="report_num">'+ct.cash+'</td>'+                 //现金收入
                    '<td class="report_num">'+ct.card+'</td>'+                 //银行卡收入
                    '<td class="report_num">'+cal_data.wxp_money+'</td>'+//微信收入
                    '<td class="report_num">'+cal_data.alip_money+'</td>'+//支付宝收入
                    '<td class="report_num">'+cal_data.pri_money+'</td>'+ //储值本金
                    _tempOther_rec +                        // 自定义支付方式实收

                    '<td class="report_num">'+cal_data.dis_money+'</td>'+               //优惠总金额

                    '<td class="report_num">'+ct.sub_user_price+'</td>'+      //会员价优惠
                    '<td class="report_num">'+ct.sub_user_discount+'</td>'+      //会员折扣优惠
                    '<td class="report_num">'+ct.small_change+'</td>'+         //抹零
                    '<td class="report_num">'+cal_data.vou_money+'</td>'+//抵用卷
                    '<td class="report_num">'+cal_data.sub_money+'</td>'+            //银台折扣

                    '<td class="report_num">'+cal_data.pac_money+'</td>'+               //套餐优惠
                    '<td class="report_num">'+cal_data.sts_money+'</td>'+               //储值优惠

                    '<td class="report_num">'+ct.give_menu_consume+'</td>'+    //赠送
                    _tempOther_dis +                        // 自定义支付方式优惠
                    
                    '<td data-type="ordertime">'+'——'+'</td>'+ //开台时间
                    '<td data-type="tableid" >'+'——'+'</td>'+ //桌台名称
                    '<td data-type="ausername">'+'——'+'</td>'+ //结账员工
                    '<td class="report_num">'+parseFloat(ct.user_num)+'</td>'+           //就餐人数
                    '<td class="report_num">'+cal_data.use_money+'</td>'+ //人均消费
                    '<td data-type="is_unusual">'+'——'+'</td>'+//状态
                    
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
        var _tempOther_rec = '';// 自定义支付方式实收
        var _tempOther_dis = '';// 自定义支付方式优惠
        var _str = '';
        data = dataObj.data;
            
        for (var i in data) {
            _tempOther_rec = '';
            _tempOther_dis = '';
            // 其他支付实收金额之和
            var pref_money = 0;
            // 其他支付实优惠金额之和
            var you_money = 0;
            for(var y=0;y<thMap.length;y++){
                _str = thMap[y];
                //alert(typeof(thMap[y]));
                //console.log(data[i]);
                if(data[i].pay_other != undefined && data[i].pay_other[_str]){
                    var preferential_money = 0;
                    if (data[i].pay_other[_str].preferential_money == undefined) {
                        preferential_money = 0;
                    } else {
                        preferential_money = parseFloat(data[i].pay_other[_str].preferential_money);
                    }

                    _tempOther_rec +="<td class='report_num' data-type='"+_str+"'>"+parseFloat(data[i].pay_other[_str].pay_money).toFixed(2)+"</td>";
                    _tempOther_dis +="<td class='report_num' data-type='"+_str+"'>"+parseFloat(preferential_money).toFixed(2)+"</td>";

                    pref_money += parseFloat(data[i].pay_other[_str].pay_money);
                    you_money += preferential_money;
                }else{
                    //_tempOther_rec += "<th>0</th>";
                    _tempOther_rec  +=  '<td class="report_num">0.00</td>';
                    _tempOther_dis  +=  '<td class="report_num">0.00</td>';
                }
                
            }

            /*
                收银统计，收银记录，清机记录，计算金额方法
                data：               数据
                pay_money：          自定义支付方式实收
                preferential_money： 自定义支付方式优惠
             */
            var cal_data = calculation_money(data[i], pref_money, you_money);

            // 计算各种金额
            /*var con_money = 0;      // 消费金额
            var res_money = 0;      // 实收金额
            var dis_money = 0;      // 优惠总金额
            var pac_money = 0;      // 套餐优惠
            var str_money = 0;      // 乐币
            var sts_money = 0;      // 储值优惠
            var sub_money = 0;      // 银台折扣
            var pri_money = 0;      // 储值本金消费
            var vou_money = 0;      // 抵用劵金额
            var wxp_money = 0;      // 微信金额
            var use_money = 0;      // 人均消费
            var re_principal = 0;   // 退储值本金
            var re_stsprgive = 0;   // 退储值赠送*/
            var payno;
            if(!data[i].pay_no) {
                payno = '';
            } else {
                payno = data[i].pay_no;
            }   
            //alert(_tempOther);
            /*temp = data[i].is_del== 0 ? '未反结账' : '已反结账';*/
            content +=  '<tr class="total-tr">'+
                        '<td data-type="btn">'+
                            '<input type="button" value="详情" data-type="handoverxq" class="xiangqingbtn">'+
                            /*(data[i].is_allow == 1 ?
                            '<input type="button" value="反结账" data-type="UncashierRecord" class="fanjiezhang">': '')+*/
                        '</td>'+
                        '<td data-type="payid" re_pay_id="'+data[i].re_pay_id+'" class="payid_css">'+ pay_no_he(payno)+'&nbsp;'+'('+data[i].pay_id+')'+'</td>'+ //结账单号
                        
                        '<td data-type="ordertime">'+getAppointTimePro(data[i].add_time)+'</td>'+ //结账时间
                        '<td class="report_text">'+data[i].shop_name+'</td>'+ //店铺



                        '<td class="report_num">'+cal_data.con_money+'</td>'+               //消费金额
                        '<td class="report_num">'+cal_data.res_money+'</td>'+               //实收金额

                        '<td class="report_num">'+parseFloat(data[i].cash).toFixed(2)+'</td>'+                 //现金收入
                        '<td class="report_num">'+parseFloat(data[i].card).toFixed(2)+'</td>'+                 //银行卡收入
                        '<td class="report_num">'+cal_data.wxp_money+'</td>'+//微信收入
                        '<td class="report_num">'+cal_data.alip_money+'</td>'+//支付宝收入
                        
                        '<td class="report_num">'+cal_data.pri_money+'</td>'+ //储值本金
                        _tempOther_rec +                        // 自定义支付方式实收

                        '<td class="report_num">'+cal_data.dis_money+'</td>'+               //优惠总金额

                        '<td class="report_num">'+parseFloat(data[i].sub_user_price).toFixed(2)+'</td>'+      //会员价优惠
                        '<td class="report_num">'+parseFloat(data[i].sub_user_discount).toFixed(2)+'</td>'+      //会员折扣优惠
                        '<td class="report_num">'+parseFloat(data[i].small_change).toFixed(2)+'</td>'+         //抹零
                        '<td class="report_num">'+parseFloat(accSubtr(data[i].voucher, data[i].re_voucher)).toFixed(2)+'</td>'+//抵用卷
                        '<td class="report_num">'+cal_data.sub_money+'</td>'+            //银台折扣

                        '<td class="report_num">'+cal_data.pac_money+'</td>'+               //套餐优惠
                        '<td class="report_num">'+cal_data.sts_money+'</td>'+               //储值优惠

                        '<td class="report_num">'+parseFloat(data[i].give_menu_consume).toFixed(2)+'</td>'+    //赠送
                        _tempOther_dis +                        // 自定义支付方式优惠
                        '<td data-type="ordertime">'+getAppointTimePro(data[i].order_time)+'</td>'+ //开台时间
                        '<td class="report_text" data-type="tableid" data-a_user_id="'+data[i].table_id+'">'+data[i].table_name+'</td>'+ //桌台名称
                        '<td class="report_text" data-type="ausername">'+data[i].a_user_name+'</td>'+ //结账员工
                        '<td class="report_num">'+data[i].user_num+'</td>'+           //就餐人数
                        '<td class="report_num">'+cal_data.use_money+'</td>'+ //人均消费
                        '<td data-type="is_unusual">'+(data[i].is_unusual == 0 ? '' : '异常')+'</td>'+//状态
                                
                        '<td class="hide" data-type="useridt">'+data[i].user_id+'</td>'+
                        '<td class="hide" data-type="other">'+data[i].other+'</td>'+
                        '<td class="hide" data-type="consume">'+data[i].consume+'</td>'+
                        '<td class="hide" data-type="money">'+(data[i].consume - data[i].money).toFixed(2)+'</td>'+
                        //'<td class="hide" data-type="quickpay">'+data[i].quick_pay+'</td>'+
                        '<td class="hide" data-type="cashier">'+data[i].cashier+'</td>'+
                        '<td class="hide" data-type="checkuprecordid">'+data[i].checkup_record_id+'</td>'+
                        '<td class="hide" data-type="paygive">'+data[i].pay_give+'</td>'+
                        '<td class="hide" data-type="givevoucher">'+data[i].give_voucher+'</td>'+
                                
                        '<td class="hide" data-type="principal">'+data[i].principal+'</td>'+
                        '<td class="hide" data-type="promo">'+data[i].promo+'</td>'+
                        '<td class="hide" data-type="discountrate">'+data[i].discount_rate+'</td>'+
                                

                    '</tr>';

             
        }
        // 添加到页面中
        $tbodys.html(content);
    }
    
    //lw 结账显示提示
    function showUncashierRecord(payId,cash,card,other){
            
        $('#UncashierRecord-information').removeClass('hide');
        displayAlertMessage('#UncashierRecord-information', '#UncashierRecord-information #can-alert,#UncashierRecord-btn');

        // 现金退款
        $('#cash-lay').val(cash);
        // 银行卡退款
        $('#card-lay').val(card);
        // 快捷支付退款
        //$('#quickPay-lay').val(quickPay);
        // 其他退款
        $('#other-lay').val(other);


        $('#UncashierRecord-information').off('click','#UncashierRecord-btn').on('click','#UncashierRecord-btn',function(){
            var UncashierRecord_remark = $('#UncashierRecord_remark').val();//备注信息
            $('#UncashierRecord_remark').val("");//清楚备注信息
                
                //发送
                
            setAjax(AdminUrl.rePay, { // 未添加 添加探出层
                're_note': UncashierRecord_remark,
                'pay_id': payId
            }, $('#prompt-message'), {20: ''}, function(respnoseText) {
                    if (respnoseText.code == 20) {
                    
                        displayMsg(ndPromptMsg, respnoseText.message, 2000,function(){
                            selectCashier();
                        });
                        
                    
                    } else {
                        displayMsg(ndPromptMsg, respnoseText.message, 2000);
                }
            }, 0);
                
                
                
                
                
                
                
        });
        
        //alert(UnCleaner_Id);
        
    }
});
