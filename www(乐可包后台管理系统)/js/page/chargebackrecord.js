$(function () {
   
    // 退单记录 lw 2016.3.29
    var menuStatus = 1; //当前选中的标签data-type的值 0:正常 1:反清机
    var $cardTypeContent = $("#nav1-content").find(".tbodys");//当前显示的内容jQ对象
    var cleanData = '';  // 存储列表数据变量
    
    //var localData = getLocalDateMin();
    var defaults = {
        /*start: localData,
        end: localData,*/
        shop: ['all']
    };
    // 添加滚动条，上下左右可以移动滚动条
    topButtonScroll(".navContent",".out_table_title");//无分页

    /*$("#start-date").val(getLocalDate()+' 00:00:00');
    $("#end-date").val(getLocalDate()+' 23:59:59');*/

    $("#start-date").val(getOffsetDateTime().start_date);
    $("#end-date").val(getOffsetDateTime().end_date);
    // 绑定点击事件
    CashierBind();
    
    // 绑定点击事件
    function CashierBind () {
        
        //添加切换事件
        $("#nav1,#nav2,#nav3").click(function(){
            
            $(".caipin-fenleicheck").removeClass("caipin-fenleicheck").addClass("caipin-fenleinucheck");
            menuStatus = $(this).removeClass("caipin-fenleinucheck").addClass("caipin-fenleicheck").attr("data-type");
            menuStatus = parseInt(menuStatus);
            
            //显示内容
            $(".navContent").addClass("hide");//全部隐藏
            
            switch(menuStatus)
            {   // 定义菜品状态参数 0:退单 1:退菜 2:退款
                case 1:
                    var $theContent = $("#nav1-content");
                    $theContent.removeClass("hide");
                    $cardTypeContent = $theContent.find(".tbodys");
                    
                    
                break;
                case 2:
                    var $theContent = $("#nav2-content");
                    $theContent.removeClass("hide");
                    $cardTypeContent = $theContent.find(".tbodys");
                    
                    
                break;
                case 3:
                    var $theContent =  $("#nav3-content");
                    $theContent.removeClass("hide");
                    $cardTypeContent = $theContent.find(".tbodys");
                    
                    //alert(menuStatus);
                    //DishesData(2);
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
        $('.stores-content').off('click','[data-type="UncashierRecord"]').on('click','[data-type="UncashierRecord"]',function(){
            
            var $tr = $(this).parents('tr');
            var UncashierRecord_Id = $tr.find('td[data-type="payid"]').text();//与后端确定清机所需 pay_id
            var pa = /.*\((.*)\)/;
            var UncashierRecord_Id = UncashierRecord_Id.match(pa)[1];
            showUncashierRecord(UncashierRecord_Id);
        });
        
        //详情
        $('.tbodys').delegate('tr .xiangqingbtn', 'click', function(event) {
            //alert(1);
            var self = this,
                type = $(event.target).attr('data-type'),
                payid = $(self).parents('tr').find('td[data-type="payid"]').text(),
                orderid = $(self).parents('tr').find('td[data-type="orderid"]').text();
            var pa = /.*\((.*)\)/;
            var payid = payid.match(pa)[1];
            // 点击详情
            if (type == "handoverxq") {
                // 显示弹出框
                $('#handoveLay').removeClass('hide');
                displayAlertMessage('#handoveLay', '#can-alert');

                setAjax(AdminUrl.backOrderInfo, {
                    'order_id': orderid
                }, $('#prompt-message'), {20: ''}, function(respnoseText) {
                    if (respnoseText.code == 20) {
                        // 得到返回数据
                        var data = respnoseText.data;
                        displayDetails(data);
                    } else {
                        displayMsg(ndPromptMsg, respnoseText.message, 2000);
                    }
                }, 0);
            }
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

    // 显示订单详情
    function displayDetails (data) {
        // 日期时间
        $('#add_time').text(getAppointTimePro(data.add_time));
        // 订单号
        $('#order_id').text(data.order_id);
        // 结账id
        if (data.pay_id == '') {
            $('#payId').text('无');
        } else {
            if(!data.pay_no) {
                $('#payId').text(data.pay_id);
            } else {
                $('#payId').text(pay_no_he(data.pay_no)+' '+'( '+data.pay_id+' )');
            }
            // $('#payId').text(data.pay_no+'('+data.pay_id+')');
        }
        // 退单人
        $('#aUserName').text(data.a_user_name);
        // 桌台名称
        $('#tableName').text(data.table_name);
        var consume_money = parseFloat(accSubtr(accSubtr(data.order_menu_consume, data.cancel_menu_consume), data.rotate_menu_consume)).toFixed(2);
        if (consume_money == 0) {
            $('#consumeDisplay').addClass('hide');
        } else {
            $('#consumeDisplay').removeClass('hide');
            // 消费
            $('#consume').text(consume_money);
        }

        if (data.give_menu_consume == 0 || data.give_menu_consume == undefined) {
            $('#giveDispaly').addClass('hide');
        } else {
            $('#giveDispaly').removeClass('hide');
            // 赠菜金额
            $('#giveMenuConsume').text(data.give_menu_consume);
        }
        if (data.cancel_menu_consume == 0 || data.cancel_menu_consume == undefined) {
            $('#cancelDisplay').addClass('hide');
        } else {
            $('#cancelDisplay').removeClass('hide');
            // 退菜金额
            $('#cancelMenuConsume').text(data.cancel_menu_consume);
        }
        // 转菜金额
        if (data.rotate_menu_consume == 0 || data.rotate_menu_consume == undefined) {
            $('#rotateDisplay').addClass('hide');
        } else {
            $('#rotateDisplay').removeClass('hide');
            // 转菜金额
            $('#rotateMenuConsume').text(data.rotate_menu_consume);
        }

        // 菜品
        var content = '';
        var contentPro = '';
        for (var i in data.menu_info) {
            for (var j in data.menu_info[i].menu) {
                // 转菜数量
                var rotate_menu_num = 0;
                if (data.menu_info[i].menu[j].rotate_menu_num == undefined || data.menu_info[i].menu[j].rotate_menu_num == 0) {
                    rotate_menu_num = 0;
                } else {
                    rotate_menu_num = data.menu_info[i].menu[j].rotate_menu_num;
                }
                var menu_num = (parseFloat(data.menu_info[i].menu[j].menu_num)+parseFloat(data.menu_info[i].menu[j].give_menu_num)+parseFloat(data.menu_info[i].menu[j].cancel_menu_num)+parseFloat(rotate_menu_num)).toFixed(1);
                contentPro +=   '<p class="mengtc" id="'+data.menu_info[i].menu[j].menu_id+'">'+
                                    '<span class="onemengtc">'+data.menu_info[i].menu[j].menu_name+'</span>'+
                                    '<span>'+data.menu_info[i].menu[j].menu_price+'</span>'+
                                    '<span>'+menu_num+'</span>'+
                                    '<span>'+parseFloat(accMul(data.menu_info[i].menu[j].menu_price, menu_num)).toFixed(2)+'</span>'+
                                '</p>';
                // 如果增菜个数大于0，就在桌台上显示着一条记录   caipinsuojin缩进样式
                if (data.menu_info[i].menu[j].give_menu_num > 0) {
                    contentPro +=   '<p class="mengtc" id="'+data.menu_info[i].menu[j].menu_id+'">'+
                                        '<span class="onemengtc">'+data.menu_info[i].menu[j].menu_name+'<i>赠</i></span>'+
                                        '<span>0</span>'+
                                        '<span>'+data.menu_info[i].menu[j].give_menu_num+'</span>'+
                                        '<span>0</span>'+
                                    '</p>';
                }
                // 如果退菜个数大于0，就在桌台上显示着一条记录
                if (data.menu_info[i].menu[j].cancel_menu_num > 0) {
                    contentPro +=   '<p class="mengtc" id="'+data.menu_info[i].menu[j].menu_id+'">'+
                                        '<span class="onemengtc">'+data.menu_info[i].menu[j].menu_name+'<i>退</i></span>'+
                                        '<span>'+data.menu_info[i].menu[j].menu_price+'</span>'+
                                        '<span>-'+data.menu_info[i].menu[j].cancel_menu_num+'</span>'+
                                        '<span>-'+parseFloat(accMul(data.menu_info[i].menu[j].menu_price, data.menu_info[i].menu[j].cancel_menu_num)).toFixed(2)+'</span>'+
                                    '</p>';
                }

                // 如果转菜个数大于0，就在桌台上显示着一条记录
                if (rotate_menu_num > 0) {
                    contentPro +=   '<p class="mengtc" id="'+data.menu_info[i].menu[j].menu_id+'">'+
                                        '<span class="onemengtc">'+data.menu_info[i].menu[j].menu_name+'<i>退</i></span>'+
                                        '<span>'+data.menu_info[i].menu[j].menu_price+'</span>'+
                                        '<span>-'+rotate_menu_num+'</span>'+
                                        '<span>-'+parseFloat(accMul(data.menu_info[i].menu[j].menu_price, rotate_menu_num)).toFixed(2)+'</span>'+
                                    '</p>';
                }
            }
        }
        content +=  '<p class="mengtop">'+
                        '<span class="onespan">菜品名称</span>'+
                        '<span class="">单价</span>'+
                        '<span>数量</span>'+
                        '<span>金额</span>'+
                    '</p>'+contentPro;
        $('#menuList').html(content);
        $(".lanheight li:odd").css("background","#fafafa");
        $(".lanheight li:even").css("background","#fff");

    }

    // 搜索显示门店
    function selectCashier () {
        // 搜索显示数据之前先清空数据
         $cardTypeContent.html('');
        // 日期
        var endDate = $("#end-date").val();
        var startDate = $("#start-date").val();
        
        if (startDate > endDate) {
            displayMsg(ndPromptMsg, '开始时间应小于结束时间!', 2000);
            return;
        }
        if ($('#shopList').val() == "全部") {
            defaults.shop = "all";
        }
        //清单类型
        var selectType = menuStatus;
    
        setAjax(AdminUrl.orderRecord, {
            'start_date': startDate,
            'end_date' : endDate,
            'type': selectType,
            'shop_ids': defaults.shop
        }, $('#prompt-message'), {20: ''}, function(respnoseText) {
            if (respnoseText.code == 20) {
                $('#nav'+selectType+'-content .out_table_title').removeClass('hide');
                $('#nav'+selectType+'-content .Records_content').removeClass('hide');
                // 得到返回数据
                var data = respnoseText.data;
                CashierList(data,$cardTypeContent);
            } else {
                $('#nav'+selectType+'-content .out_table_title').addClass('hide');
                $('#nav'+selectType+'-content .Records_content').addClass('hide');
                displayMsg(ndPromptMsg, respnoseText.message, 2000);
            }
        }, 0);
    }

    // 显示数据
    function CashierList (data,$tbodys) {
            var content = '';
            var totalContent = '';
            /*var temp;*/

            
            var totalConsume = 0,       // 合计消费金额
                totalMoney = 0,         // 合计线上优惠金额
                totalAfterDiscount = 0, // 合计实收金额
                // totalSmallChange = 0,   // 合计抹零金额
                // totalSubMoney = 0,      // 合计线下优惠金额
                // totalCard = 0,          // 合计银行卡
                // totalCash = 0,          // 合计现金
                totalVoucher = 0,       // 合计抵用劵支付金额
                totalStored = 0,        // 合计储值支付金额
                totalwxpay = 0,        // 合计微信支付金额
                // totalOther = 0;         // 合计其他支付方式
                trNum = 0;              //条数合计  

            var backOrder = '';// 退单人
            var payno;
            for (var i in data) {
                trNum++;
                    if (menuStatus == 1) {
                        backOrder = '系统';
                    } else {
                        backOrder = data[i].a_user_name;
                    }
                    
                    if(!data[i].pay_no) {
                        payno = '';
                    } else {
                        payno = data[i].pay_no;
                    } 
                    content +=  '<tr class="total-tr">'+
                                '<td class="addtime">'+getAppointTimePro(data[i].add_time)+'</td>'+ //日期时间
                                '<td class="report_text addtime">'+data[i].shop_name+'</td>'+ //店铺
                                '<td class="" data-type="orderid">'+data[i].order_id+'</td>'+ //订单号
                                '<td class="payid_css" data-type="payid">'+pay_no_he(payno)+'&nbsp;'+'('+data[i].pay_id+')'+'</td>'+ //结账ID
                                '<td class="report_text" data-type="ausername">'+backOrder+'</td>'+ //收银员
                                '<td class="hide" data-type="auserid">'+data[i].a_user_id+'</td>'+ //收银员ID
                                '<td class="report_num" data-type="consume">'+data[i].consume+'</td>'+ //消费
                                 /*'<td class="" data-type="consume">'+data[i].discount_rate+'% </td>'+ //会员折扣
                                '<td class="" data-type="money">'+data[i].pay_money+'</td>'+ //应收
                                '<td class="" data-type="stored">'+data[i].stored+'</td>'+ //储值支付
                                '<td class="" data-type="voucher">'+data[i].voucher+'</td>'+ //抵用卷支付
                                '<td class="" data-type="wxpay">'+data[i].wxpay+'</td>'+ //微信支付
                                '<td class="hide" data-type="afterdiscount">'+data[i].after_discount +'</td>'+ //实收*/
                                
                                '<td class="" data-type="btn">'+
                                    '<input type="button" value="详情" data-type="handoverxq" class="xiangqingbtn">'+
                                '</td>'+
                            '</tr>';

                totalConsume += parseFloat(data[i].consume);             // 合计消费金额
                //totalMoney += parseFloat(data[i].consume - data[i].money);// 合计线上优惠金额
                totalAfterDiscount += parseFloat(data[i].after_discount); // 合计实收金额
                // totalSmallChange += parseFloat(data[i].small_change);    // 合计抹零金额
                // totalSubMoney += parseFloat(data[i].sub_money);          // 合计线下优惠金额
                // totalCard += parseFloat(data[i].card);                   // 合计银行卡
                // totalCash += parseFloat(data[i].cash);                   // 合计现金
                totalVoucher += parseFloat(data[i].voucher);             // 合计抵用劵支付金额
                totalStored += parseFloat(data[i].stored);               // 合计储值支付金额
                totalwxpay += parseFloat(data[i].wxpay);               // 合计微信支付金额
                // totalOther += parseFloat(data[i].other);                 // 合计其他支付方式
            }

            // 合计
            totalContent =  '<tr class="total-trheji">'+
                            '<td>合计</td>'+
                            '<td class="report_text">'+trNum+'条记录'+'</td>'+
                            '<td>——</td>'+
                            '<td>——</td>'+
                            '<td>——</td>'+
                            '<td class="report_num">'+totalConsume.toFixed(2)+'</td>'+
                            //'<td >——</td>'+
                            //'<td >'+totalSubMoney.toFixed(2)+'</td>'+
                            // '<td >'+totalSmallChange.toFixed(2)+'</td>'+
                            //'<td >'+totalAfterDiscount.toFixed(2)+'</td>'+
                            // '<td >'+totalCash.toFixed(2)+'</td>'+
                            // '<td >'+totalCard.toFixed(2)+'</td>'+
                            // '<td >'+totalVoucher.toFixed(2)+'</td>'+
                            // '<td >'+totalStored.toFixed(2)+'</td>'+
                            // '<td>'+totalOther.toFixed(2)+'</td>'+
                            //'<td>'+totalStored.toFixed(2)+'</td>'+
                            //'<td>'+totalVoucher.toFixed(2)+'</td>'+
                            //'<td>'+totalwxpay.toFixed(2)+'</td>'+
                            '<td>——</td>'+
                            /*'<td></td>'+*/
                        '</tr>'+ content;



            // 添加到页面中
            $tbodys.html(totalContent);
    }
    
    // //lw 结账显示提示
        // function showUncashierRecord(payId){
            
            // $('#UncashierRecord-information').removeClass('hide');
            // displayAlertMessage('#UncashierRecord-information', '#UncashierRecord-information #can-alert,#UncashierRecord-btn');
            
            // $('#UncashierRecord-btn').click(function(){
                // var UncashierRecord_remark = $('#UncashierRecord_remark').val();//备注信息
                // $('#UncashierRecord_remark').val("");//清楚备注信息
                
                // //发送
                
                // setAjax(AdminUrl.rePay, { // 未添加 添加探出层
                    // //'re_note': UncashierRecord_remark,
                    // 'order_id': payId
                // }, $('#prompt-message'), {20: ''}, function(respnoseText) {
                    // if (respnoseText.code == 20) {
                    
                        // displayMsg(ndPromptMsg, respnoseText.message, 2000,function(){
                            // selectCashier();
                        // });
                        
                    
                    // } else {
                        // displayMsg(ndPromptMsg, respnoseText.message, 2000);
                // }
            // }, 0);
                
             // });
            
            // //alert(UnCleaner_Id);
            
        // }


});
