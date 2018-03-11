$(function () {
    
    // 日结清机记录 lw 2016.3.25.2
    var menuStatus = 2; //当前选中的标签data-type的值 0:正常 1:反清机
    var $cardTypeContent = $("#nav0-content").find(".tbodys");//当前显示的内容jQ对象

    //var localData = getLocalDateMin();
    var defaults = {
        /*start: localData,
        end: localData,*/
        shop: ['all']
    };
   // 添加滚动条，上下左右可以移动滚动条
    topButtonScroll(".navContent",".out_table_title");//无分页
    // topButtonScroll2(".navContent",".out_table_title");//有分页，

    /*$("#start-date").val(getLocalDate()+' 00:00:00');
    $("#end-date").val(getLocalDate()+' 23:59:59');*/

    $("#start-date").val(getOffsetDateTime().start_date);
    $("#end-date").val(getOffsetDateTime().end_date);

    // 绑定点击事件
    CleanerBind();
    // 存储列表数据变量
    var cleanData = '';

    // 绑定点击事件
    function CleanerBind () {
        
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
                    $cardTypeContent = $theContent.find(".tbodys");
                    
                    //alert(menuStatus);
                    //DishesData(0);
                break;
                case 3:
                    var $theContent = $("#nav1-content");
                    $theContent.removeClass("hide");
                    $cardTypeContent = $theContent.find(".tbodys");
                    
                    //alert(menuStatus);
                    //DishesData(1);
                break;
                // case 2:
                    // var $theContent =  $("#cardTypeContent_3");
                    // $theContent.removeClass("hide");
                    // $cardTypeContent = $theContent.find(".tbodys");
                    
                    // //alert(menuStatus);
                    // //DishesData(2);
                // break;
            
            }
            
            
        });
        // 点击搜索
        $('#selectbtn').unbind('click').bind('click', function () {
            selectCleaner();
        });
        // 点击店铺
        $('#shopList').unbind('click').bind('click', function () {
            DishesDatashop();
        });

        $('.tbodys').delegate('tr .xiangqingbtn', 'click', function(event) {
            var self = $(this).parents("tr"),
                type = $(event.target).attr('data-type');
            var recordid=$(self).find('td[data-type="recordid"]').text();
                
            // 点击详情
            if (type == "handoverxq") {
                // 显示弹出框
                $('#handoveLay').removeClass('hide');
                displayAlertMessage('#handoveLay', '#handoveLay #can-alert');
                
                setAjax(AdminUrl.recordCheckupInfo, {
                    'record_id': recordid
                }, $('#prompt-message'), {20: ''}, function(respnoseText) {
                    if (respnoseText.code == 20) {
                        // 得到返回数据
                        var data = respnoseText.data;
                        listData(data);
                    } else {
                        displayMsg(ndPromptMsg, respnoseText.message, 2000);
                    }
                }, 0);

            }
            //testre_pay(); //测试 反清机接口
        });
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

    function listData (cleanData) {

        // 自定义支付方式实收、优惠金额之和
        var pay_money = 0;
        var preferential_money = 0;
        var payOther = '';
        var preOther = '';
        // 自定义支付方式
        if (cleanData.pay_other == '') {
            payOther = '';
            preOther = '';
        }
        
        for (var i in cleanData.pay_other) {
            if (i == undefined) {
                payOther += '';
                preOther += '';
            } else {
                // 自定义支付方式
                var tr_name = other_take_name(cleanData.pay_other[i].pay_type_id);
                if (cleanData.pay_other[i].pay_money != 0) {
                    var pay_type_num = cleanData.pay_other[i].pay_type_num == undefined ? 0 : cleanData.pay_other[i].pay_type_num;
                    payOther += '<li class="laycontent">'+cleanData.pay_other[i].pay_type_name+tr_name.pay_money_name+'</li>'+ // 实收
                                '<li class="laycontentright">'+cleanData.pay_other[i].pay_money+'</li>'+
                                '<li class="laycontent">'+cleanData.pay_other[i].pay_type_name+tr_name.pay_money_name+'支付次数</li>'+ // 实收
                                '<li class="laycontentright">'+pay_type_num+'</li>';
                }
                if (cleanData.pay_other[i].preferential_money != 0) {
                    preOther += '<li class="laycontent">'+cleanData.pay_other[i].pay_type_name+tr_name.pre_money_name+'</li>'+ // 优惠
                                '<li class="laycontentright">'+cleanData.pay_other[i].preferential_money+'</li>'+
                                '<li class="laycontent">'+cleanData.pay_other[i].pay_type_name+tr_name.pre_money_name+'支付次数</li>'+ // 优惠
                                '<li class="laycontentright">'+pay_type_num+'</li>';
                }

                pay_money += parseFloat(cleanData.pay_other[i].pay_money);
                preferential_money += parseFloat(cleanData.pay_other[i].preferential_money);
            }
        }

        /*
            收银统计，收银记录，清机记录，计算金额方法
            data：               数据
            pay_money：          自定义支付方式实收
            preferential_money： 自定义支付方式优惠
         */
        var cal_data = calculation_money(cleanData, pay_money, preferential_money);

        // 把要填充页面的详情数据填入页面
        $('#addTime').text(getAppointTimePro(cleanData.add_time));            // 日期时间
        $('#auserName').text(cleanData.a_user_name);            // 收银员

        // 美团单数
        $('#mt_order_num').text(cleanData.mt_order_num == null || cleanData.mt_order_num == '' ? 0 : cleanData.mt_order_num);
        // 百度单数
        $('#bd_order_num').text(cleanData.bd_order_num == null || cleanData.bd_order_num == '' ? 0 : cleanData.bd_order_num);
        // 饿了么单数
        $('#ele_order_num').text(cleanData.ele_order_num == null || cleanData.ele_order_num == '' ? 0 : cleanData.ele_order_num);

        // 桌台数
        $('#pay_num').text(cleanData.pay_num);
        // 就餐人数
        $('#user_num').text(cleanData.user_num);
        // 人均消费
        $('#use_money').text(cal_data.use_money);


        $('#consume').text(cal_data.con_money);            // 消费
        // 实收金额
        $('#res_money').text(cal_data.res_money);
        $('#cash').text(cleanData.cash);                  // 现金
        $('#cash_num').text(cleanData.cash_num);                  // 现金支付次数
        $('#card').text(cleanData.card);                  // 银行卡
        $('#card_num').text(cleanData.card_num);                  // 银行卡支付次数
        $('#wxpay').text(cal_data.wxp_money);               // 微信
        $('#wxpay_num').text(cleanData.wxpay_num);          // 微信支付次数
        $('#alipay').text(cal_data.alip_money);             // 支付宝
        $('#alipay_num').text(cleanData.alipay_num);        // 支付宝支付次数
        
        $('#pri_money').text(cal_data.pri_money);           // 储值本金消费
        // 自定义支付方式实收
        $('#other_pay_mon').after(payOther);
        $('#other_pay_mon').addClass('hide');

        $('#dis_money').text(cal_data.dis_money);          // 优惠金额
        $('#sub_user_price').text(cleanData.sub_user_price);          // 会员价优惠
        $('#sub_user_discount').text(cleanData.sub_user_discount);          // 会员折扣优惠
        $('#smallchange').text(cleanData.small_change);    // 抹零
        $('#voucher').text(cal_data.vou_money); // 抵用卷
        $('#voucher_num').text(cleanData.voucher_num); // 抵用卷支付次数
        $('#sub_money').text(cal_data.sub_money); // 银台折扣
        $('#pac_money').text(cal_data.pac_money); // 套餐优惠
        $('#sts_money').text(cal_data.sts_money); // 储值赠送消费
        // 赠送
        $('#giveMenuConsume').text(cleanData.give_menu_consume);
        // 自定义支付方式优惠
        $('#other_pay_pre').after(preOther);
        $('#other_pay_pre').addClass('hide');
    }



    //lw 添加反清机按钮事件 class = fanxiangqingbtn
    $('#nav0-content').on('click','[data-type="UnCleaner"]',function(){
        var $tr = $(this).parents('tr');
        var UnCleaner_Id = $tr.find("[data-type='recordid']").text();//与后端确定清机所需id
        // 反清机用户id
        var reUserId = $tr.find('[data-type="reUserId"]').text();
        showCleanerRecords(UnCleaner_Id,reUserId);
    });
    
    //lw 反清机显示提示
    function showCleanerRecords(UnCleaner_Id, reUserId){
        
        $('#UnCleaner-information').removeClass('hide');
        displayAlertMessage('#UnCleaner-information', '#UnCleaner-information #can-alert,#UncashierRecord-btn');
        
        
        $('#UnCleaner-information').off('click').on('click','#UncashierRecord-btn',function(){
        
            var UnCleanerRemark = $('#UnCleaner-remark').val();//备注信息
            
            setAjax(AdminUrl.rollbackRePay, { //实际
                're_note': UnCleanerRemark,// 备注
                'record_id': UnCleaner_Id,  // 清机id
                're_user_id': reUserId// 清机用户id
            }, $('#prompt-message'), {20: ''}, function(respnoseText) {
                if (respnoseText.code == 20) {
                
                // 得到返回数据
                    displayMsg(ndPromptMsg, respnoseText.message, 2000,function(){
                        selectCleaner();//刷新当日的页面
                    });
                    
                } else {
                    displayMsg(ndPromptMsg, respnoseText.message, 2000);
                    
                }
            }, 0);
            
            
        });
        
        //alert(UnCleaner_Id);
        
    }
    
    // 搜索显示门店
    function selectCleaner () {
        
        // 搜索显示数据之前先清空列表数据
        $cardTypeContent.html('');
        // 开始月份
        var startDate = $("#start-date").val();
        // 结束月份
        var endDate = $("#end-date").val();
        /*开始年  开始月
        开始日期：开始年-开始月-01

        结束年 结束月
        if (结束月 = 12) {
            结束月 = 1
            结束年 = 结束年+1
        } else {
            结束月 = 结束月+1
        }
        结束时间 = 时间戳(结束年-结束月-01 00:00:00) - 1
        结束日期 = 日期转换(结束时间)*/
        /*var year = parseFloat(endDate.split('-')[0]);
        var month = parseFloat(endDate.split('-')[1]);
        if (month == 12) {
            month = 1;
            year = year + 1;
        } else {
            month = month + 1;
        }
        var exitDate = year+'-'+month+'-01 00:00:00';
        var newstr = exitDate.replace(/-/g,'/');
        var date =  new Date(newstr); 
        var time_str = date.getTime().toString();
        exitDate = time_str.substr(0, 10) - 1;
        endDate = getAppointTime(exitDate);*/
        
        //清单类型
        var selectType = menuStatus;
        
        if (startDate > endDate) {
            //ndPromptMsg公用提示条
            displayMsg(ndPromptMsg, '开始时间应小于结束时间!', 2000);
            return;
        }

        if ($('#shopList').val() == "全部") {
            defaults.shop = "all";
        }

         //setAjax("../php/test_unqingji.php", { //测试用
        setAjax(AdminUrl.recordCheckupRecord, { //实际
            'start_date': startDate,
            'end_date': endDate,
            'type':selectType, //查询类型
            'shop_ids': defaults.shop
        }, $('#prompt-message'), {20: ''}, function(respnoseText) {
            if (respnoseText.code == 20) {
                if (selectType == 2) {
                    $('#nav0-content .out_table_title').removeClass('hide');
                    $('#nav0-content .cleanerRecords-content').removeClass('hide');
                } else if (selectType == 3) {
                    $('#nav1-content .out_table_title').removeClass('hide');
                    $('#nav1-content .cleanerRecords-content').removeClass('hide');
                }
                // 得到返回数据
                cleanData = respnoseText.data;
                CleanerList(cleanData,$cardTypeContent);
            } else {
                if (selectType == 2) {
                    $('#nav0-content .out_table_title').addClass('hide');
                    $('#nav0-content .cleanerRecords-content').addClass('hide');
                } else if (selectType == 3) {
                    $('#nav1-content .out_table_title').addClass('hide');
                    $('#nav1-content .cleanerRecords-content').addClass('hide');
                }
                displayMsg(ndPromptMsg, respnoseText.message, 2000);
            }
        }, 0);
    }

    // 显示数据
    function CleanerList (data,$tbodys) {


        //分离创建表头表单头部信息

        var dataA = dishesStackHandle(data, dataA);

        // 得到所有的支付方式
        var ctBrray = '';
        for (var i in data) {
            if (ctBrray == '') {
                ctBrray = {};
                ctBrray = dataA[i].pay_other;
            } else {
                for (var j in data[i].pay_other) {
                    for (var k in ctBrray) {
                        if (k != j) {
                            ctBrray[j] = dataA[i].pay_other[j];

                            ctBrray[j].pay_type_num = ctBrray[j].pay_type_num == undefined ? 0 :ctBrray[j].pay_type_num;
                            ctBrray[j].preferential_integral = ctBrray[j].preferential_integral == undefined ? 0 : ctBrray[j].preferential_integral;
                            ctBrray[j].receipts_integral = ctBrray[j].receipts_integral == undefined ? 0 : ctBrray[j].receipts_integral;
                        }
                    }
                }
            }
        }

        for (var i in ctBrray) {
            ctBrray[i].pay_type_num = 0;
            ctBrray[i].preferential_integral = 0;
            ctBrray[i].receipts_integral = 0;

            ctBrray[i].pay_money = 0;
            ctBrray[i].preferential_money = 0;
        }

        for (var i in data) {
            for (var j in data[i].pay_other) {
                for (var k in ctBrray) {
                    if (k == j) {
                        //ctBrray[j].pay_money = 0;
                        ctBrray[j].pay_money = parseFloat(accAdd(ctBrray[j].pay_money, data[i].pay_other[j].pay_money)).toFixed(2);

                        //ctBrray[j].pay_type_num = 0;
                        var pay_type_num = data[i].pay_other[j].pay_type_num == undefined ? 0 : data[i].pay_other[j].pay_type_num;
                        ctBrray[j].pay_type_num = parseFloat(accAdd(ctBrray[j].pay_type_num, pay_type_num));

                        //ctBrray[j].preferential_integral = 0;
                        var preferential_integral = data[i].pay_other[j].preferential_integral == undefined ? 0 : data[i].pay_other[j].preferential_integral;
                        ctBrray[j].preferential_integral = parseFloat(accAdd(ctBrray[j].preferential_integral, preferential_integral));

                        //ctBrray[j].preferential_money = 0;
                        ctBrray[j].preferential_money = parseFloat(accAdd(ctBrray[j].preferential_money, data[i].pay_other[j].preferential_money)).toFixed(2);

                        //ctBrray[j].receipts_integral = 0;
                        var receipts_integral = data[i].pay_other[j].receipts_integral == undefined ? 0 : data[i].pay_other[j].receipts_integral;
                        ctBrray[j].receipts_integral = parseFloat(accAdd(ctBrray[j].receipts_integral, receipts_integral));
                    }
                }
            }
        }
        
        // 所有支付方式循环
        var num = 0;
        var con = '';
        var con1 = '';
        for (var i in ctBrray) {
            var tr_name = other_take_name(ctBrray[i].pay_type_id);
            num++;
            con += "<th width='132'>"+ctBrray[i].pay_type_name+tr_name.pay_money_name+"</th>"+ // 实收
                   "<th width='132'>"+ctBrray[i].pay_type_name+tr_name.pay_money_name+"支付次数</th>"; // 实收
            con1+= "<th width='132'>"+ctBrray[i].pay_type_name+tr_name.pre_money_name+"</th>"+ // 优惠
                   "<th width='132'>"+ctBrray[i].pay_type_name+tr_name.pre_money_name+"支付次数</th>"; // 优惠
        }

        var otherTh_rec =  $tbodys.parents("table").find(".otherTh_rec"); //获取当前页面的其它列
        var otherTh_dis =  $tbodys.parents("table").find(".otherTh_dis"); //获取当前页面的其它列

        $(otherTh_rec[0]).siblings(".otherTh_rec").remove(); //删除除了第一列以外的动态添加列
        otherTh_rec.replaceWith(con); //替换第一列为最新的列

        $(otherTh_dis[0]).siblings(".otherTh_dis").remove(); //删除除了第一列以外的动态添加列
        otherTh_dis.replaceWith(con1); //替换第一列为最新的列
        
        // 增加悬浮头的地方
        var otherPay_rec;
        var otherPay_dis;

        if (menuStatus == 2) {
        // 增加悬浮头的地方
            otherPay_rec = $('#nav0-content .out_table_title').find(".otherTh_rec");
            otherPay_dis = $('#nav0-content .out_table_title').find(".otherTh_dis");
        } else {
            otherPay_rec = $('#nav1-content .out_table_title').find(".otherTh_rec");
            otherPay_dis = $('#nav1-content .out_table_title').find(".otherTh_dis");
        }
        $(otherPay_rec[0]).siblings(".otherTh_rec").remove();
        otherPay_rec.replaceWith(con);

        $(otherPay_dis[0]).siblings(".otherTh_dis").remove();
        otherPay_dis.replaceWith(con1);

        // 得到有多少个其他支付方式，然后3000px  每增加一个增加200px，设置样式
        //var otherClass = num1 * 200 + 3000;
        // var otherClass = accAdd(accMul(accMul(num, 4), 134), 3484);
        var otherClass = accAdd(accMul(accMul(num, 4), 134), 4284);  // 支付宝 美团 百度 饿了么 3平台优惠 +1400 -1200 +3*200
        $('#nav0-content table').css('width', otherClass+'px');
        $('#nav1-content table').css('width', otherClass+'px');

        var _tempOther_rec = '';// 自定义支付方式实收
        var _tempOther_dis = '';// 自定义支付方式优惠
        
        // 其他支付实收金额之和
        var pref_money = 0;
        // 其他支付实优惠金额之和
        var you_money = 0;
        /*// 其他支付实收次数之和
        var pref_money_num = 0;
        // 其他支付优惠次数之和
        var you_money_num = 0;*/

        for (var i in ctBrray) {
            // 显示实收、优惠
            //_tempOther_rec += "<th  data-type='"+_str+"'>"+ct[_str]+"</th>";
            _tempOther_rec +=   "<th class='report_num' width='132'>"+ctBrray[i].pay_money+"</th>"+
                                "<th class='report_num' width='132'>"+ctBrray[i].pay_type_num+"</th>";
            _tempOther_dis +=   "<th class='report_num' width='132'>"+ctBrray[i].preferential_money+"</th>"+
                                "<th class='report_num' width='132'>"+ctBrray[i].pay_type_num+"</th>";

            pref_money += ctBrray[i].pay_money;
            you_money += ctBrray[i].preferential_money;
        }



        var content = '';
        var totalContent = '';
        /*var temp;*/

        var totalConsume = 0,       // 合计消费金额
            totalMoney = 0,         // 会员价优惠
            totalMoneyDis = 0,      // 会员折扣优惠
            totalAfterDiscount = 0, // 合计实收金额
            totalSmallChange = 0,   // 合计抹零金额
            totalstr_money = 0,     // 储值消费
            totoalprincipal = 0,    // 储值本金
            totalsts_money = 0,     // 储值优惠
            totaldis_money = 0,     // 优惠总金额
            totalgiv_moeny = 0,     // 赠送
            totalpac_money = 0,     // 套餐优惠合计
            totalSubMoney = 0,      // 合计线下优惠金额
            totalCard = 0,          // 合计银行卡
            card_num = 0,           // 银行卡支付次数
            totalCash = 0,          // 合计现金
            cash_num = 0,           // 现金支付次数
            totalVoucher = 0,       // 合计抵用劵支付金额
            voucher_num = 0,        // 抵用券支付次数
            totalStored = 0,        // 合计储值支付金额
            stored_num = 0,         // 乐币支付次数
            wxpay = 0,              // 微信支付金额
            wxpay_num = 0,          // 微信支付次数
            alipay = 0,             // 支付宝支付金额
            alipay_num = 0,         // 支付宝支付次数
          
            totalPay = 0,           // 合计其他支付方式实收
            totalPreferential = 0,  // 合计其他支付方式优惠
            other_num = 0,          // 其他支付次数

            
            mt_order_num = 0,           // 合计美团单数
            bd_order_num = 0,           // 合计百度单数
            ele_order_num = 0,          // 合计饿了么单数
            pay_num = 0,            // 结账单数
            user_num = 0,           // 人数
            user_money = 0,         // 人均消费
            re_wxpay_total = 0,     // 退微信
            re_alipay_total = 0,    // 退支付宝
            re_principal_total = 0, // 退储值本金
            re_stsprgive_total = 0, // 退储值赠送
            re_voucher_total = 0;   // 退抵用劵
            
        for (var i in data) {
            /*temp = data[i].is_del == 0?"未反清机":"已反清机";*/
            
            // 优惠实收
            var pay_money = 0;
            var preferential_money = 0;

            var other_rec = '';
            var other_dis = '';

            for (var j in ctBrray) {
                if(data[i].pay_other != undefined && data[i].pay_other[j]){
                    var num_num = data[i].pay_other[j].pay_type_num == undefined ? 0 : data[i].pay_other[j].pay_type_num;
                    other_rec +="<td class='report_num'>"+data[i].pay_other[j].pay_money+"</td>"+
                                "<td class='report_num'>"+num_num+"</td>";
                    other_dis +="<td class='report_num'>"+data[i].pay_other[j].preferential_money+"</td>"+
                                "<td class='report_num'>"+num_num+"</th>";

                    pay_money += parseFloat(data[i].pay_other[j].pay_money);
                    preferential_money += parseFloat(data[i].pay_other[j].preferential_money);
                } else {
                    other_rec  +=  '<td class="report_num">0.00</td><td class="report_num">0</td>';
                    other_dis  +=  '<td class="report_num">0.00</td><td class="report_num">0</td>';
                }
            }

            /*
                收银统计，收银记录，清机记录，计算金额方法
                data：               数据
                pay_money：          自定义支付方式实收
                preferential_money： 自定义支付方式优惠
             */
            var cal_data = calculation_money(data[i], pay_money, preferential_money);

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

            content +=  '<tr class="total-tr">'+
                            '<td data-type="addTime">'+
                                '<input type="button" value="详情" data-type="handoverxq" class="xiangqingbtn">'+
                            '</td>'+
                            //显示部分
                            '<td data-type="addTime">'+(data[i].up_time == 0 ? getAppointTimePro(data[i].add_time):getAppointTimePro(data[i].up_time))+'</td>'+ //日期时间
                            '<td class="report_text">'+data[i].shop_name+'</td>'+ //店铺
                            '<td class="report_text" data-type="a_user_name">'+data[i].a_user_name+'</td>'+ //收银员 姓名

                            '<td class="report_num">'+cal_data.con_money+'</td>'+               //消费金额
                            '<td class="report_num">'+cal_data.res_money+'</td>'+               //实收金额

                            '<td class="report_num" data-type="cash">'+parseFloat(data[i].cash).toFixed(2)+'</td>'+    //现金
                            '<td class="report_num" data-type="cash_num">'+data[i].cash_num+'</td>'+   //现金支付次数
                            '<td class="report_num" data-type="card">'+parseFloat(data[i].card).toFixed(2)+'</td>'+ //银行卡
                            '<td class="report_num" data-type="card_num">'+data[i].card_num+'</td>'+ //银行卡支付次数
                            '<td class="report_num" data-type="wxpay">'+cal_data.wxp_money+'</td>'+  //微信
                            '<td class="report_num" data-type="wxpay_num">'+data[i].wxpay_num+'</td>'+ //微信支付次数
                            '<td class="report_num" data-type="alipay">'+cal_data.alip_money+'</td>'+  //支付宝
                            '<td class="report_num" data-type="alipay_num">'+data[i].alipay_num+'</td>'+ //支付宝支付次数
                            
                            '<td class="report_num">'+cal_data.pri_money+'</td>'+ //储值本金

                             other_rec +                        // 自定义支付方式实收

                            '<td class="report_num">'+cal_data.dis_money+'</td>'+               //优惠总金额

                            '<td class="report_num">'+parseFloat(data[i].sub_user_price).toFixed(2)+'</td>'+      //会员价优惠
                            '<td class="report_num">'+parseFloat(data[i].sub_user_discount).toFixed(2)+'</td>'+      //会员折扣优惠
                            '<td class="report_num">'+parseFloat(data[i].small_change).toFixed(2)+'</td>'+         //抹零
                            '<td class="report_num" data-type="voucher">'+cal_data.vou_money+'</td>'+    //抵用券
                            '<td class="report_num" data-type="voucher_num">'+data[i].voucher_num+'</td>'+ //抵用券支付次数
                            '<td class="report_num">'+cal_data.sub_money+'</td>'+            //银台折扣

                            '<td class="report_num">'+cal_data.pac_money+'</td>'+               //套餐优惠
                            '<td class="report_num">'+cal_data.sts_money+'</td>'+               //储值优惠

                            '<td class="report_num">'+parseFloat(data[i].give_menu_consume).toFixed(2)+'</td>'+    //赠送
                            other_dis +                        // 自定义支付方式优惠
                            '<td class="report_num" data-type="mt_order_num">'+((!data[i].mt_order_num) == true ? 0 : data[i].mt_order_num)+'</td>'+ // 美团单数
                            '<td class="report_num" data-type="bd_order_num">'+((!data[i].bd_order_num) == true ? 0 : data[i].bd_order_num)+'</td>'+ // 百度单数
                            '<td class="report_num" data-type="ele_order_num">'+((!data[i].ele_order_num) == true ? 0 : data[i].ele_order_num)+'</td>'+ // 饿了么单数
                            '<td class="report_num" data-type="pay_num">'+data[i].pay_num+'</td>'+ //桌台数
                            '<td class="report_num" data-type="user_num">'+data[i].user_num+'</td>'+   //人数
                            '<td class="report_num" data-type="user_money">'+cal_data.use_money+'</td>'+  //人均消费
                            
                            //隐藏部分
                            '<td class="hide" data-type="recordid">'+data[i].record_id+'</td>'+ //清机id
                            '<td class="hide" data-type="reUserId">'+data[i].re_user_id+'</td>'+ //反清机用户id
                            '<td class="hide" data-type="cashier">'+data[i].cashier+'</td>'+
                            '<td class="hide" data-type="checkuprecordid">'+data[i].checkup_record_id+'</td>'+
                            '<td class="hide" data-type="paygive">'+data[i].pay_give+'</td>'+
                            '<td class="hide" data-type="paymoney">'+data[i].pay_money+'</td>'+
                            '<td class="hide" data-type="principal">'+data[i].principal+'</td>'+
                            /*'<td data-type="is_del">'+temp+'</td>'+*/

                        '</tr>';
            
            totalConsume += parseFloat(cal_data.con_money);             // 合计消费金额
            totalAfterDiscount += parseFloat(cal_data.res_money); // 合计实收金额

            totalCash += parseFloat(data[i].cash);                   // 合计现金
            cash_num += parseFloat(data[i].cash_num);           // 现金支付次数
            totalCard += parseFloat(data[i].card);                   // 合计银行卡
            card_num += parseFloat(data[i].card_num);           // 银行卡支付次数
            wxpay += parseFloat(cal_data.wxp_money); // 合计微信支付金额
            wxpay_num += parseFloat(data[i].wxpay_num);// 微信支付次数
            alipay += parseFloat(cal_data.alip_money); // 合计支付宝支付金额
            alipay_num += parseFloat(data[i].alipay_num);// 支付宝支付次数
            
            totoalprincipal += parseFloat(cal_data.pri_money);// 储值本金

            //_tempOther_rec +                        // 自定义支付方式实收

            totaldis_money += parseFloat(cal_data.dis_money);    // 优惠总金额

            totalMoney += parseFloat(data[i].sub_user_price);// 合计会员价优惠
            totalMoneyDis += parseFloat(data[i].sub_user_discount);// 合计会员折扣优惠
            totalSmallChange += parseFloat(data[i].small_change);    // 合计抹零金额
            totalVoucher += parseFloat(cal_data.vou_money);// 合计抵用劵支付金额
            voucher_num += parseFloat(data[i].voucher_num);     // 抵用券支付次数
            totalSubMoney += parseFloat(cal_data.sub_money);          // 银台折扣

            totalpac_money += parseFloat(cal_data.pac_money);        // 套餐优惠
            totalsts_money += parseFloat(cal_data.sts_money);// 储值优惠

            totalgiv_moeny += parseFloat(data[i].give_menu_consume);            // 赠送

             //_tempOther_dis +                        // 自定义支付方式优惠
            mt_order_num += parseFloat((!data[i].mt_order_num) == true ? 0 : data[i].mt_order_num); // 合计 美团单数
            bd_order_num += parseFloat((!data[i].bd_order_num) == true ? 0 : data[i].bd_order_num); // 合计 百度单数
            ele_order_num += parseFloat((!data[i].ele_order_num) == true ? 0 : data[i].ele_order_num); // 合计 饿了么单数
            pay_num += parseFloat(data[i].pay_num);         // 结账单数
            user_num += parseFloat(data[i].user_num);           // 人数
            user_money += parseFloat(cal_data.use_money);         // 人均消费
        }
        // 合计
        totalContent =  '<tr class="total-trheji">'+
                        '<th>合计</th>'+
                        '<th>——</th>'+
                        '<th>——</th>'+
                        '<th>——</th>'+
                        '<th class="report_num" >'+totalConsume.toFixed(2)+'</th>'+
                        '<th class="report_num" >'+totalAfterDiscount.toFixed(2)+'</th>'+
                        '<th class="report_num" >'+totalCash.toFixed(2)+'</th>'+
                        '<th class="report_num" >'+cash_num+'</th>'+
                        '<th class="report_num" >'+totalCard.toFixed(2)+'</th>'+
                        '<th class="report_num" >'+card_num+'</th>'+
                        '<th class="report_num" >'+wxpay.toFixed(2)+'</th>'+
                        '<th class="report_num" >'+wxpay_num+'</th>'+
                        '<th class="report_num" >'+alipay.toFixed(2)+'</th>'+
                        '<th class="report_num" >'+alipay_num+'</th>'+
                        
                        '<th class="report_num" >'+totoalprincipal.toFixed(2)+'</th>'+
                        _tempOther_rec+
                        '<th class="report_num" >'+totaldis_money.toFixed(2)+'</th>'+
                        '<th class="report_num" >'+totalMoney.toFixed(2)+'</th>'+
                        '<th class="report_num" >'+totalMoneyDis.toFixed(2)+'</th>'+
                        '<th class="report_num" >'+totalSmallChange.toFixed(2)+'</th>'+
                        '<th class="report_num" >'+totalVoucher.toFixed(2)+'</th>'+
                        '<th class="report_num" >'+voucher_num+'</th>'+
                        '<th class="report_num" >'+totalSubMoney.toFixed(2)+'</th>'+
                        '<th class="report_num" >'+totalpac_money.toFixed(2)+'</th>'+
                        '<th class="report_num" >'+totalsts_money.toFixed(2)+'</th>'+
                        '<th class="report_num" >'+totalgiv_moeny.toFixed(2)+'</th>'+
                        _tempOther_dis+
                        '<td class="report_num">'+mt_order_num+'</td>'+ // 合计美团单数
                        '<td class="report_num">'+bd_order_num+'</td>'+ // 合计百度单数
                        '<td class="report_num">'+ele_order_num+'</td>'+ // 合计饿了么单数
                        '<th class="report_num">'+pay_num+'</th>'+ // 桌台数
                        '<th class="report_num">'+user_num+'</th>'+
                        '<th class="report_num">'+user_money.toFixed(2)+'</th>'+
                        
                    '</tr>'+ content;


        // 添加到页面中
        $tbodys.html(totalContent);
    }
});


