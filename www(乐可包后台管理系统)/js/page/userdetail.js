$(function () {
    var type = 1;//会员记录接口数据类型 1消费记录，2储值记录，3抵用券记录，4积分记录

    var user_mobile ;
    var menuStatus = 2; //当前选中的标签data-type的值 1:正常 2:反清机
    var $cardTypeContent = $("#nav0-content").find(".tbodys"); //当前显示的内容jQ对象
    var $totalBox = $("#nav0_totalBox"); //汇总部分
    var cleanData = '';  // 存储列表数据变量
    var order_by = 0; //排序
    // 是否支持实体卡的开关
    var is_entity_card = $.cookie('is_entity_card');
    // 从缓存中得到用户是否有添加修改权限
    var is_up = 0;   // 是否有修改权限 0 否 1 是
    if ($.cookie('card_shell') == 1) {
        is_up = authority_judgment('会员冻结和余额扣减');
    } else {
        is_up = authority_cookie('membersManage');
    }
    // type 1 门店点击直接进入这个详情的 2 实体卡点击进入详情的
    var type_url = getQueryString('type');
    var list_card_barcode = getQueryString('card_barcode');
    var list_card_no = getQueryString('card_no');
    var list_entity_id = getQueryString('entity_id');
    var is_del = '';

    $("#start-date").val(getOffsetDateTime().start_date);
    $("#end-date").val(getOffsetDateTime().end_date);

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
    // CashierBind();
    // 会员信息
    var userid = '' ;//用户的id
    var MembersInformation = {

        init: function() {

            // 显示数据
            this.MembersList();
            // 绑定点击事件
            this.MembersBind();
            // 在壳子里才显示
            if ($.cookie('card_shell') == 1) {
                // 绑定键盘事件
                bind_key();
                // 绑定全键盘
                bind_total_key();
            }
            if(type_url == undefined || type_url == 2){
                user_mobile = getQueryString('user_mobile');
                this.selectMobileMembers();
            }
            $('#user_tit').text('用户详情');
            if(type_url == 1){
                // 储值余额、导航会员列表、余额扣减、记录详情、记录列表、冻结按钮、页面数据、已冻结按钮
                $('.storedValue,#navigation,.deduction,.detailed,.stores-con,.btn_1,.btn_2,.stores-content_1,.frozen_text').addClass('hide');
                if (is_entity_card == 0) {
                    $('#option_tab_1').addClass('hide');
                } else {
                    $('#option_tab_1').removeClass('hide');
                }
            } else if (type_url == 2) {
                $('#user_tit').text('实体卡详情');
                // 储值余额、实体卡会员信息、导航会员列表、记录详情、记录列表、页面数据、搜索卡号
                $('.storedValue,#card_stored_value,#navigation,.detailed,.stores-con,.stores-content_1,#select_card').removeClass('hide');
                // 资料信息、记录详情抵用劵记录、积分记录、搜索手机号
                $('#frozen,#option_tab div[data-type="3"],#option_tab div[data-type="4"],#stores3,#stores4,#select_user').addClass('hide');
                // 判断如果等于undefined说明没有修改权限
                if (is_up == 0) {
                    // 余额扣减、冻结按钮，已冻结按钮
                    $('.deduction,.btn_1,.frozen_text').addClass('hide');
                } else {
                    $('.deduction,.btn_1').removeClass('hide');
                }
            } else {
                // 实体卡会员信息、搜索卡号
                $('#card_stored_value,#select_card').addClass('hide');
                // 资料信息、储值余额、记录详情抵用劵记录、积分记录、导航会员列表、记录详情、记录列表、页面数据、搜索手机号
                $('#frozen,.storedValue,#option_tab div[data-type="3"],#option_tab div[data-type="4"],#navigation,.detailed,.stores-con,.stores-content_1,#select_user').removeClass('hide');
                // 判断如果等于undefined说明没有修改权限
                if (is_up == 0) {
                    // 余额扣减、冻结按钮，已冻结按钮
                    $('.deduction,.btn_1,.frozen_text').addClass('hide');
                } else {
                    $('.deduction,.btn_1').removeClass('hide');
                }
            }
            is_scan_monitor = 1;
            // 调用监控键盘(public.js)
            keydown_monitor('#card_barcode');
        },

        // 显示数据
        MembersList: function(data) {
            $("#start-date").val(getOffsetDateTime().start_day);
            $("#jieshudate").val(getOffsetDateTime().end_day);
        },

        // 绑定点击事件
        MembersBind: function() {
            var _self = this;
            // 点击查询按钮
            $('#selectbtn').unbind('click').bind('click', function() {
                user_mobile = $("#userMobile").val(); // 用户手机号
                var  re = /^1\d{10}$/;    //正则表达式
   
                if(user_mobile == ''){
                    displayMsgTime(ndPromptMsg,'用户手机号不能为空', 2000);
                } else if(!re.test(user_mobile)) { //判断字符是否是11位数字
                    displayMsgTime(ndPromptMsg,'请输入11位手机号', 2000);
                } else {
                    $('.storedValue').removeClass('hide');
                    $('.deduction').addClass('hide');
                    $('.detailed').removeClass('hide');
                    $('.stores-con').removeClass('hide');
                    $('.btn_1').addClass('hide');
                    $('.stores-content_1').removeClass('hide');
                    _self.selectMobileMembers();
                }
            });

            // 点击查询实体卡按钮
            $('#selectbtn_card').unbind('click').bind('click', function() {
                list_card_barcode = $("#card_barcode").val();
                list_card_no = $("#card_no").val();

                if (list_card_barcode == '' && list_card_no == '') {
                    displayMsg(ndPromptMsg, '请放卡或输入卡号！', 2000);
                    return;
                }
                if (list_card_no != '' && !Pattern.entity_card.test(list_card_no)) {
                    displayMsg(ndPromptMsg, '请输入正确的卡号！', 2000);
                    return;
                }
                _self.selectMobileMembers();
            });

              // 解冻和冻结的
            $('.frozen,#card_stored_value').delegate('.frozen_left','click', function(event) {
                var self = this;
                var user_id = $(self).attr('id');
                // var user_id = 'uu2lr7fmytlk'
                var type_1 = $(event.target).attr('data-type');
                var is_del = 0;

                var user_mobile = $(self).find('span[data-type="user_mobile"]').text();
                if (type_url == 2) {
                    user_mobile = $(self).find('span[data-type="card_no"]').text();
                    $('#user_name').text('卡号：');
                } else {
                    $('#user_name').text('用户：');
                }
               
                var del_note = $(self).find('td[data-type="del_note"]').text();

                // 冻结
                if (type_1 == 'frozen') {
                    is_del = 1;
                    $('#alert-title').html('冻结账户');
                    $('#del_note').val('');
                } else if (type_1 == 'thaw') { // 解冻
                    is_del = 0;
                    $('#alert-title').html('解冻账户');
                    $('#del_note').val(del_note);
                }

                if (type_1 == 'frozen' || type_1 == 'thaw') {
                    //$('#alert-content').html('您确定要冻结该账户吗？');
                    // 用户
                    $('#user_mobile').text(user_mobile);

                    displayAlertMessage('#alert-message', '#cancel-alert');

                    $('#definite-alert').unbind('click').bind('click', function() {
                        var delnote = $('#del_note').val();
                        if (is_del == 0) {
                            is_del = 2;
                        }
                        var url = '',data = {};
                        if (type_url == 2) {
                            url = AdminUrl.entity_card_freeze;
                            data = {
                                'entity_id': user_id,
                                'is_del': parseInt(is_del),
                                'del_note': delnote
                            };
                        } else {
                            url = AdminUrl.memberUserFreeze;
                            data = {
                                'user_id': user_id,
                                'is_del': parseInt(is_del),
                                'del_note': delnote
                            };
                        }
                        setAjax(url, data, $('#prompt-message'), { 20: '' }, function(respnoseText) {
                            // 得到返回数据
                            var data = respnoseText.data;
                            if (respnoseText.code == 20) {
                                layer.close(layerBox);
                                displayMsgTime(ndPromptMsg, respnoseText.message, 2000, function() {
                                    // 搜索刷新数据
                                    // _self.clickSelect();
                                    _self.selectMobileMembers();
                                });
                            } else {
                                layer.close(layerBox);
                                displayMsgTime(ndPromptMsg, respnoseText.message, 2000);
                            }
                        }, 0);
                    });
                }
            });

            //余额扣减点击确认
            $('#other-logoin').unbind('click').bind('click', function() {
                layer.close(confirmLayerBox);
                var self = this;
                var user_id = $('.frozen_left').attr('id');
                var deduct_principal =  $('#deduct_principal').val(); //获取输入的扣减本金金额
                var deduct_gift = $('#deduct_gift').val();//获取输入的扣减赠送金额
                var resPrincipal = $('#resPrincipal').text();//获取剩余本金的金额
                var surGift = $('#surGift').text();//获取剩余赠送的金额
                var  reason = '' ;
            
                deduct_principal = parseFloat(deduct_principal).toFixed(2); //扣减本金保留两位小数
                deduct_gift = parseFloat(deduct_gift).toFixed(2); //扣减赠送金额保留两位小数
                reason = $('#reason').val(); //获取扣减原因

                 if(resPrincipal>=0&&surGift>=0){
                    var url = '',data = {};
                    if (type_url == 2) {
                        url = AdminUrl.entity_card_amount_minus;
                        data = {
                            'entity_id': user_id,
                            'principal_amount': deduct_principal, //本金金额
                            'give_money': deduct_gift ,    //赠送金额
                            'journal_note': reason
                        };
                    } else {
                        url = AdminUrl.BalanceDeduct;
                        data = {
                            'user_id': user_id,
                            'principal_amount': deduct_principal, //本金金额
                            'give_money': deduct_gift ,    //赠送金额
                            'journal_note': reason
                        };
                    }
                   setAjax(url, data, $('#prompt-message'), { 20: '' }, function(respnoseText) {
                        // 得到返回数据
                        var data = respnoseText.data;
                        if (respnoseText.code == 20) {
                            displayMsgTime(ndPromptMsg, respnoseText.message, 2000, function() {
                                // 搜索刷新数据
                                //_self.clickSelect();
                            });
                              // 跳转
                             window.location.replace('');
                        } else {
                            displayMsgTime(ndPromptMsg, respnoseText.message, 2000);
                        }
                    }, 0);
                }else if(resPrincipal<0){
                     displayMsgTime(ndPromptMsg, '扣减本金必须大于0，小于剩余本金', 2000);
                }else if(surGift<0){
                    displayMsgTime(ndPromptMsg,' 扣减赠送必须大于0，小于剩余赠送金额', 2000);
                }else{
                    displayMsgTime(ndPromptMsg, '输入的必须为数字金额', 2000);
                }
            });

            // 选项卡点击
            $('#option_tab_1').on('click', 'div', function () {
                // 查询之前清空数据
                $('#tbodys_1').html('');
                $('#tbodys_2').html('');
                $('#tbodys_3').html('');            
                $('#tbodys_4').html('');
                var data_type = $(this).attr('data-type');
                $(this).removeClass('caipin-fenleinucheck').addClass('caipin-fenleicheck').siblings('div').removeClass('caipin-fenleicheck').addClass('caipin-fenleinucheck');
                type_url = data_type;
                // 储值余额、导航会员列表、余额扣减、记录详情、记录列表、冻结按钮、页面数据、已冻结按钮
                $('.storedValue,#navigation,.deduction,.detailed,.stores-con,.btn_1,.btn_2,.stores-content_1,.frozen_text').addClass('hide');
                if (type_url == 1) {
                    $('#select_user').removeClass('hide');
                    $('#select_card').addClass('hide');
                } else {
                    $('#select_user').addClass('hide');
                    $('#select_card').removeClass('hide');
                }
                $('.search_page').addClass('hide');
            });

            // 记录选项卡点击
            $('#option_tab').on('click', 'div', function () {
                var data_type = $(this).attr('data-type');
                $(this).addClass('selected').siblings('div').removeClass('selected').addClass('select');
                $('#stores'+data_type).removeClass('hide').siblings('div').addClass('hide');
                $(".search_page").addClass("hide");
                $("#nav"+data_type+"_search_page").removeClass("hide");
                type = data_type;
                _self.recordDetails();
            });

            // 分页标签 切换查询
            $(".search_page").on("click",".home_page",function(){
                var $this = $(this);
                //alert($(this).attr("data-start-date"));
                var searchObj = {  //要传输的参数对象
                    type : $this.attr("data-type"),
                    page : $this.attr("data-page")
                };
                var that = this;
                // selectCashier (searchObj.page,searchObj);
                _self.recordDetails(searchObj.page,searchObj);
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
                    searchObj.page = _temp;
                    // selectCashier (searchObj.page,searchObj);
                   _self.recordDetails(searchObj.page,searchObj);
                }else{
                    displayMsg(ndPromptMsg, '请输入正确的页码', 2000);
                }
            });
        },

        //记录详情请求
        recordDetails: function(thePage,searchObj){//thepage是请求的第几页
           // 查询之前清空数据
            $('#tbodys_1').html('');
            $('#tbodys_2').html('');
            $('#tbodys_3').html('');
            $('#tbodys_4').html('');
            var _self = this;
            var user_id = $('.frozen_left').attr('id');

            //清单对应的分页标签
            var $searchPage;
            switch(parseFloat(type)){
                case 1:
                    $searchPage = $("#nav1_search_page");
                break;
                case 2:
                    $searchPage = $("#nav2_search_page");
                break;
                case 3:
                    $searchPage = $("#nav3_search_page");
                break;
                case 4:
                    $searchPage = $("#nav4_search_page");
                break;
            }
            
            //如果是分页请求就替换相应值
            if(searchObj){
                type = searchObj.type;
            }

            var url = type_url == 2 ? AdminUrl.entity_card_record : AdminUrl.userRecord;
        
            //分页信息用的参数
            var pageObj = {
                'type': type,
                'user_id': user_id,
                'entity_id': list_entity_id,
                'page': thePage || 1,
                '$search_page': $searchPage,  //分页对应的分页位置
            };
            setAjax(url, {
                'type': type,
                'user_id': user_id,
                'entity_id': list_entity_id,
                'page': thePage || 1
            }, $('#prompt-message'), { 20: '' }, function(respnoseText) {
                // 得到返回数据
                var data = respnoseText.data;
                if (respnoseText.code == 20 && data.ct.count != 0) {
                    // 显示搜索出来的数据
                    _self.recordDetailShow(data, pageObj);
                } else if (respnoseText.code != 20) {
                    displayMsgTime(ndPromptMsg, respnoseText.message, 2000);
                }
            }, 0);
        },
        //记录详情显示
        recordDetailShow: function(data, pageObj){

            var ct = data.ct;
            delete data.ct;

            this.pageAct(ct.pages,pageObj);

             var content = '';
                
             if(type==1){
                var num = 1;

                 for (var i in data) {
                    if(i!='ct'){
                        if (type_url == 1 || type_url == undefined) {
                         content += '<tr class="stores_title">'+
                                        '<th style="width:10%">'+num+'</th>'+
                                        '<th style="width:8%">'+ getAppointTime(data[i].add_time) +'</th>'+
                                        '<th style="width:17%" class="report_num">'+ data[i].pay_no+'('+data[i].pay_id +')</th>'+
                                        '<th style="width:10%" class="report_text">'+ data[i].shop_name +'</th>'+
                                        '<th style="width:20%" class="report_num">'+ data[i].consume  +'</th>'+
                                        '<th style="width:10%" class="report_num">'+ data[i].money +'</th>'+
                                    '</tr>';
                        } else if (type_url == 2) {
                            content += '<tr class="stores_title">'+
                                            '<th style="width:10%">'+num+'</th>'+
                                            '<th style="width:8%">'+ getAppointTime(data[i].add_time) +'</th>'+
                                            '<th style="width:17%" class="report_num">'+ data[i].journal_class +'</th>'+
                                            '<th style="width:10%" class="report_text">'+ data[i].shop_name +'</th>'+
                                            '<th style="width:20%" class="report_num">'+ data[i].journal_money  +'</th>'+
                                            '<th style="width:10%" class="report_num">'+ data[i].journal_num +'</th>'+
                                        '</tr>';
                        }
                    }
                    num++;
                 }
                if (type_url == 1 || type_url == undefined) {
                    $('#consume_sum').html(ct.consume);
                    $('#money_sum').html(ct.money);
                    $('#stores1 thead tr').eq(0).find('th').eq(4).text('消费金额');
                    $('#stores1 thead tr').eq(0).find('th').eq(5).text('实收金额');
                } else if (type_url == 2) {
                    $('#consume_sum').html(ct.journal_money);
                    $('#money_sum').html(ct.journal_num);
                    $('#stores1 thead tr').eq(0).find('th').eq(4).text('金额');
                    $('#stores1 thead tr').eq(0).find('th').eq(5).text('本金');
                }
                 // 添加到页面中
                 $('#tbodys_1').html(content);
             }
             if(type==2){
                 var num = 1;
                 var add_sub = '';
                 var TypeColor = '';
                 for (var i in data) {
                     if(i!='ct'){
                        if(data[i].journal_type.toString().substring(0,1) ==1 || data[i].journal_type.toString().substring(0,1) == 3){
                            add_sub = '+' ;
                            TypeColor = '#02af16';
                        }else{
                            add_sub = '-' ;
                            TypeColor ='#b0020b';
                        }
                         content += '<tr class="stores_title">'+
                                        '<th style="width:5%">'+  num +'</th>'+
                                        '<th style="width:10%;">'+ getAppointTime(data[i].add_time) +'</th>'+
                                        '<th style="width:8.5%" class="report_text">'+ data[i].journal_type_name +'</th>'+
                                        '<th style="width:14%" class="report_num user_mobile">'+ (data[i].journal_about == 'integral' ? '——' : data[i].journal_about) +'</th>'+
                                        '<th style="width:13%" class="report_text">'+ (data[i].card_name == '' || data[i].card_name == undefined ? '——' : data[i].card_name) +'</th>'+
                                        '<th style="width:13%" class="report_text">'+ (data[i].journal_about == 'integral' ? '——' : data[i].shop_name) +'</th>'+
                                        '<th style="width:7%;color:'+TypeColor+'!important" class="report_num">'+add_sub+ data[i].journal_money +'</th>'+
                                        '<th style="width:7%;color:'+TypeColor+'!important" class="report_num">'+add_sub+ data[i].journal_num+'</th>'+
                                    '</tr>';
                       
                         num++;
                    }
                }
                 // 添加到页面中
                 $('#tbodys_2').html(content);
             }

             if(type==3){
                var num =1;
                 for (var i in data) {
                    if(i!='ct'){
                     content += '<tr class="stores_title">'+
                                    '<th style="width:10%">'+ num +'</th>'+
                                    '<th style="width:8%;" class="report_text">'+ data[i].voucher_name+'</th>'+
                                    '<th style="width:8%;">'+ getAppointTime(data[i].add_time) +'</th>'+
                                    '<th style="width:10%" class="report_text">'+ data[i].voucher_from_type +'</th>'+
                                    '<th style="width:20%">'+ getAppointTime(data[i].start_time)+'——'+getAppointTime(data[i].end_time) +'</th>'+
                                    '<th style="width:10%" class="report_num">'+ data[i].voucher_money +'</th>'+
                                    (data[i].up_time == 0 || data[i].use_money<=0?
                                    '<th style="width:10%"></th>':
                                    '<th style="width:10%">'+ getAppointTime(data[i].up_time) +'</th>')+
                                    '<th style="width:10%" class="report_num">'+ data[i].use_money +'</th>'+
                                '</tr>';
                    num++;

                    }
                 }
                 // 添加到页面中
                 $('#tbodys_3').html(content);
             }
             if(type==4){
                num = 1 ;
                var add_sub = '';
                var TypeColor = '';
                for (var i in data) {
                    if(i!='ct'){
                        if(data[i].journal_type.toString().substring(0,1) ==1 || data[i].journal_type.toString().substring(0,1) == 3){
                            add_sub = '+' ;
                            TypeColor = '#02af16';
                        }else{
                            add_sub = '-' ;
                            TypeColor ='#b0020b';
                        }
                       
                         content += '<tr class="stores_title">'+
                                        '<th style="width:10%">'+ num +'</th>'+
                                        '<th style="width:8%;">'+ getAppointTime(data[i].add_time) +'</th>'+
                                        '<th style="width:17%" class="report_text">'+ data[i].journal_type_name +'</th>'+
                                        '<th style="width:10%" class="report_num">'+ (data[i].journal_about == 'stored' ? '——' : data[i].journal_about) +'</th>'+
                                        '<th style="width:20%" class="report_text">'+ (data[i].journal_about == 'stored' ? '——' : data[i].shop_name)  +'</th>'+
                                        '<th style="width:10%;color:'+TypeColor+'!important"class="report_num" ><span class="journalType">'+ add_sub +'</span>'+ data[i].journal_num +'</th>'+
                                    '</tr>';
                        
                        num++;
                    }
                }
                // 添加到页面中
                $('#tbodys_4').html(content);
             }
        },

        // 按用户查询
        selectMobileMembers: function() {
            // 搜索之前清空数据
            $('#frozen').html('');

            if (getQueryString('type') == 1) {
                if (type_url == 1 || type_url == undefined) {
                    // 实体卡会员信息、搜索卡号
                    $('#card_stored_value,#select_card').addClass('hide');
                    // 资料信息、储值余额、记录详情抵用劵记录、积分记录、导航会员列表、记录详情、记录列表、页面数据、搜索手机号
                    $('#frozen,.storedValue,#option_tab div[data-type="3"],#option_tab div[data-type="4"],#navigation,.detailed,.stores-con,.stores-content_1,#select_user').removeClass('hide');
                    // 判断如果等于undefined说明没有修改权限
                    if (is_up == 0) {
                        // 余额扣减、冻结按钮，已冻结按钮
                        $('.deduction,.btn_1,.frozen_text').addClass('hide');
                    } else {
                        $('.deduction,.btn_1').removeClass('hide');
                    }
                } else if (type_url == 2) {
                    // 储值余额、实体卡会员信息、导航会员列表、记录详情、记录列表、页面数据、搜索卡号
                    $('.storedValue,#card_stored_value,#navigation,.detailed,.stores-con,.stores-content_1,#select_card').removeClass('hide');
                    // 资料信息、记录详情抵用劵记录、积分记录、搜索手机号
                    $('#frozen,#option_tab div[data-type="3"],#option_tab div[data-type="4"],#stores3,#stores4,#select_user').addClass('hide');
                    // 判断如果等于undefined说明没有修改权限
                    if (is_up == 0) {
                        // 余额扣减、冻结按钮，已冻结按钮
                        $('.deduction,.btn_1,.frozen_text').addClass('hide');
                    } else {
                        $('.deduction,.btn_1').removeClass('hide');
                    }
                }
            }

            var self = this;

            var url = '',data = {};
            if (type_url == 2) {
                url = AdminUrl.entity_card_info;
                data = {
                    'card_barcode': list_card_barcode,
                    'card_no': list_card_no
                };
            } else {
                url = AdminUrl.memberUserInfo;
                data = {
                    'user_mobile': user_mobile
                };
            }
            $('#nav1_search_page').removeClass('hide');
            // 获取到搜索的项
            setAjax(url, data, $('#prompt-message'), { 20: '' }, function(respnoseText) {
                // 得到返回数据
                var data = respnoseText.data;
                if (respnoseText.code == 20) {
                    is_del = data.is_del;
                    list_entity_id = data.entity_id;
                    // 显示搜索出来的数据
                    self.selectList(data);
                    if(data.user_id == ''){
                        $('.storedValue,.deduction,.detailed,.stores-con,.btn_1,.btn_2').addClass('hide');
                        if(is_del==1){
                            $('.frozen_text').removeClass('hide');
                        }else{
                            $('.frozen_text').addClass('hide');
                        }
                    }
                     // 判断如果等于undefined说明没有修改权限
                    if (is_up==0) {
                        // 冻结解冻按钮隐藏
                        if (type_url == 2) {
                            $('.btn_1,.btn_2').addClass('hide');
                        }
                        if(is_del==1){
                            $('.frozen_text').removeClass('hide');
                        }else{
                            $('.frozen_text').addClass('hide');
                        }
                    }else{
                        //如果为冻结的时候 不显示余额扣减
                        if(data.is_del==1){
                            $('.deduction').addClass('hide');
                            if (type_url == 2) {
                                $('.btn_2').removeClass('hide');
                                $('.btn_1').addClass('hide');
                            }
                        }else{
                            $('.deduction').removeClass('hide');
                            if (type_url == 2) {
                                $('.btn_1').removeClass('hide');
                                $('.btn_2').addClass('hide');
                            }
                        }
                    }
                    $('.stores-content_1').removeClass('hide');
                    if(type_url==1){
                        $('.btn_1,.btn_2').addClass('hide');
                        if(is_del==1){
                            $('.frozen_text').removeClass('hide');
                        }else{
                            $('.frozen_text').addClass('hide');
                        }
                     } else if (type_url == 2) {
                        
                     }else{
                        // 冻结、解冻、余额扣减、已冻结
                        if (is_up==0) {
                            $('.btn_1,.btn_2').addClass('hide');
                            $('.deduction').addClass('hide');
                            if(is_del==1){
                                $('.frozen_text').removeClass('hide');
                            }else{
                                $('.frozen_text').addClass('hide');
                            }
                        }
                    }
                } else {
                    displayMsgTime(ndPromptMsg, respnoseText.message, 2000);
                    $('.stores-content_1,.search_page').addClass('hide');
                }
            }, 0);
        },

        // 根据用户搜索出来的数据
        selectList: function(data) {
            var content = '';
            var content_1 = '';
            var is_authority = ''; // 是否授权，0：否，1：是
            if (data.is_authority == undefined || data.is_authority == 0) {
                is_authority = '否';
            } else if (data.is_authority == 1) {
                is_authority = '是';
            }
            var user_sex = '';
            if (data.user_sex == 1) {
                user_sex = '男';
            } else if (data.user_sex == 2) {
                user_sex = '女';
            } else {
                user_sex = '保密';
            }
            var stored_gift = '';  //储值赠送
            var consumptive_gift = '';//消费赠送
            var reserve_balance ='' ;//储值余额
            var reserve_balance_1 =  '';//储值余额减冻结
            var principal_balance = '' ;//本金余额
            var gift_balance = '';//赠送本金
            var freezing_balance = ''; //冻结余额
          
            stored_gift =  accAdd(data.stored_amount , - data.principal_amount);
            // stored_gift =  accAdd(stored_gift , - data.hold_money );
            consumptive_gift = accAdd(data.stored_consume , - data.principal_consume);

            // var timestamp = Date.parse(new Date()); ; //获取当前时间戳
            var timestamp = Math.round(new Date().getTime()/1000).toString();
            var effec = '';
           if(data.end_time < timestamp){
                effec = '(已过期)'
           }
            //比较冻结时间和当前时间
            if(data.hold_time >= timestamp){
                //冻结金额为获取
                freezing_balance = data.hold_money;
            }else{
                //冻结金额为零
                freezing_balance = 0 ;
            }
            reserve_balance = accAdd(data.stored_amount ,  - data.stored_consume);
            reserve_balance_1 = accAdd(reserve_balance ,  - freezing_balance);
            principal_balance = accAdd(data.principal_amount , - data.principal_consume);
            gift_balance = accAdd(reserve_balance , - principal_balance);
            integral_amount_1  = accSubtr(data.integral_amount , data.integral_consume);
            if (type_url == 2) {
                content += '<div class="frozen_left" id="'+data.entity_id+'">'+
                                '<img src="../../img/base/nologo.png">'+
                                '<td>'+
                                    (data.is_del == 0 ?
                                    '<input type="button" value="冻结" class="stores-caozuo-btn btn_1" data-type="frozen">':
                                    '<input type="button" value="解冻" class="stores-caozuo-btn btn_2 hide" data-type="thaw">')+
                                '</td>'+
                                '<div class="frozen_text hide">已冻结</div>'+
                            '</div>'+
                            '<ul class="cardData_left">'+
                                '<li><span>读取卡号</span>：<span>'+data.card_barcode+'</span></li>'+
                                '<li><span>录入卡号</span>：<span data-type="card_no">'+data.card_no+'</span></li>'+
                                '<li><span>姓<i></i>名</span>：<span>'+data.user_name+'</span></li>'+
                                '<li><span>电<i></i>话</span>：<span>'+data.user_mobile+'</span></li>'+
                            '</ul>'+
                            '<ul class="cardData_right">'+
                                '<li><span>领卡时间</span>：<span>'+getAppointTime(data.add_time)+'</span></li>'+
                                '<li><span>有<em></em>效<em></em>期</span>：<span>'+getAppointTime(data.end_time)+'<span class="effec">'+effec+'</span></span></li>'+
                                '<li><span>性<i></i>别</span>：<span>'+user_sex+'</span></li>'+
                                '<li><span>出生日期</span>：<span>'+data.user_birthday+'</span></li>'+
                            '</ul>';
            } else {
             content += '<div class="frozen_left"  id="' + data.user_id + '">' +
                            '<img src="../../img/base/nologo.png">' +
                            '<td>' +
                                (data.is_del == 0 ?
                                    '<input type="button" value="冻结" class="stores-caozuo-btn btn_1" data-type="frozen">' :
                                    '<input type="button" value="解冻" class="stores-caozuo-btn btn_1" data-type="thaw">') +
                            '</td>' +
                            '<div class="frozen_text hide">已冻结</div>' +
                        '</div>' +
                        '<div class="frozen_right">' +
                            '<h3><span data-type="user_mobile" id="user_mob">' + data.user_mobile + '</span><span> ( ' + data.user_name + '  &nbsp;&nbsp;' + user_sex + ' ) </span></h3>' +
                            '<div class="frozen_right2">' +
                                '<div class="frozen_left21">' +
                                    '<div>' +
                                         '<span>生&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;日 ：</span><span>' + data.user_birthday + '</span>' +
                                    '</div>' +
                                    '<div>' +
                                        '<span>折扣额度 ：</span><span>' + data.discount_rate + '</span>' +
                                    '</div>' +
                                    '<div>' +
                                    (data.discount_rate == 100 || data.discount_rate == 0||data.discount_rate == ''?
                                        '<span>折扣有效期 ：</span><span>无</span>' :
                                        '<span>折扣有效期 ：</span><span>' + getAppointTime(data.discount_end_time)+ '</span>') +
                                    '</div>' +
                                '</div>' +
                                '<div class="frozen_left22">' +
                                    '<div>' +
                                        '<span>领卡时间 ：</span><span> ' + (data.add_time == 0 ? '未领卡' : getAppointTime(data.add_time)) + '</span>' +
                                    '</div>' +
                                    '<div>' +
                                        '<span>是否授权 ：</span><span>' + is_authority + '</span>' +
                                    '</div>' +
                                    '<div>' +
                                        '<span>积&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;分 ：</span><span>' + integral_amount_1 + '</span>' +
                                    '</div>' +
                                '</div>' +
                            '</div>'+
                        '</div>';
            }
            content_1 +='<div class="storedValue_left">' +
                            '<p>储值余额</p>' +
                            '<b>' + reserve_balance_1 + '</b>' +
                            '<div class="storedValue_left1">' +
                                '<h4 id="principal_1">' +
                                    '<span>本金</span>' +
                                    '<dd>' + principal_balance + '</dd>' +
                                '</h4>' +
                                '<i></i>' +
                                '<h4 id="give_1">' +
                                    '<span>赠送</span>' +
                                    '<dd>' + gift_balance + '</dd>' +
                                '</h4>' +
                                '<i></i>' +
                                '<h4 id="frozen_1">' +
                                    '<span>冻结</span>' +
                                    '<dd>' + freezing_balance + '</dd>' +
                                '</h4>' +
                            '</div>' +
                        '</div>' +
                        '<div class="storedValue_right">' +
                            '<div class="frozen_left21 frozen_left24">' +
                                '<div>' +
                                     '<span>累计储值 ：</span><span>' + data.stored_amount + '</span>' +
                                '</div>' +
                                '<div>' +
                                    '<span>储值本金 ：</span><span>'+ data.principal_amount +'</span>' +
                                '</div>' +
                                '<div>' +
                                   '<span>储值赠送 ：</span><span>' + stored_gift + '</span>' +
                                '</div>' +
                            '</div>' +
                            '<div class="frozen_left22 frozen_left23">' +
                                '<div>' +
                                    '<span>累计消费 ：</span><span>' + data.stored_consume + '</span>' +
                                '</div>' +
                                '<div>' +
                                    '<span>本金消费 ：</span><span>' + data.principal_consume + '</span>' +
                                '</div>' +
                                '<div>' +
                                    '<span>赠送消费 ：</span><span>' + consumptive_gift + '</span>' +
                                '</div>' +
                            '</div>' +
                        '</div>';
            if(principal_balance==0){
                $('#principal_1').addClass('hide');
            }
            if(gift_balance==0){
                $('#give_1').addClass('hide');
            }
            if(freezing_balance==0){
                $('#frozen_1').addClass('hide');
            }

            //扣减余额弹出层
            $('#buttonSure').unbind('click').bind('click', function() {
                var deduct_principal =  $('#deduct_principal').val(); //获取输入的扣减本金金额
                var deduct_gift = $('#deduct_gift').val();//获取输入的扣减赠送金额
                var residual_Principal = accAdd(principal_balance , - deduct_principal); //剩余本金
                var surplus_Gift = accAdd(gift_balance , - deduct_gift); //剩余赠送
                var reason = $('#reason').val(); //获取扣减原因
                var content_2 = '' ;
                if(deduct_principal!=0 || deduct_gift!=0){
                     $('#confirm-message').removeClass('hide');
                     displayAlertMessage('#confirm-message', '#cancel-confirm');
                     confirmLayerBox = $('#confirm-message').parent().parent().parent().attr('times');
                }
                content_2 +=    '<div class="account">'+
                                    ' <b>用户'+(type_url == 2 ? '卡号' : '账户')+'：</b>'+
                                     '<span>' + (type_url == 2 ? data.card_no : data.user_mobile) + '</span>'+
                                '</div>'+
                                '<div class="amountMoney">'+
                                    '<div>'+
                                        '<span>当前本金：</span><span>' + principal_balance +'</span>'+
                                    '</div>'+
                                    '<div>'+
                                        '<span>当前赠送：</span><span>' + gift_balance +'</span>'+
                                    '</div>'+
                                    '<div>'+
                                        '<span>扣减本金：</span><span>' + deduct_principal +'</span>'+
                                    '</div>'+
                                    '<div>'+
                                         '<span>扣减赠送：</span><span>' + deduct_gift +'</span>'+
                                    '</div>'+
                                    '<div>'+
                                        '<span>剩余本金：</span><span id="resPrincipal">' + residual_Principal +'</span>'+
                                    '</div>'+
                                    '<div>'+
                                        '<span>剩余赠送：</span><span id="surGift">' + surplus_Gift +'</span>'+
                                    '</div>'+
                                '</div>'+
                                '<div class="account1">'+
                                     '<b>扣减理由：</b>'+
                                     '<span>' + reason +'</span>'+
                                '</div>';

                $('#confirm').html(content_2);
              
                //点击关闭按钮
                $('#cancel-confirm').unbind('click').bind('click', function() {
                    $('#confirm-message').addClass('hide');
                    layer.close(confirmLayerBox);
                });
            });

            // 添加到页面中
            if (type_url == 2) {
                $('#card_stored_value').html(content);
            } else {
                $('#frozen').html(content);
            }
            $('#storedValue').html(content_1);

            // 加载消费记录数据
            if (data.pay_list != '' && data.pay_list.ct.count != 0 && type == 1) {
                //分页信息用的参数
                var pageObj = {
                    'type': 1,
                    'user_id': $('.frozen_left').attr('id'),
                    'entity_id': list_entity_id,
                    'page': 1,
                    '$search_page': $("#nav1_search_page"),  //分页对应的分页位置
                };
                this.recordDetailShow(data.pay_list, pageObj);
            }
        },

        //创建分页
        pageAct: function(MaxPageNum,searchObj){ //分页按钮包裹div,最大页数,分野查询参数对象
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
                }else if((MaxPageNum-5 <= searchObj.page)&&(searchObj.page <= MaxPageNum)){ //后十个
                    _strTemp = contentArr.slice(MaxPageNum-5,MaxPageNum);
                    content = _strTemp.toString();
                    content = content.replace(/,/g,'');
                    content = "<span>...</span>"+content;
                }
            }
            content2 =  '<a href="javascript:void(0)" data-start-date="'+ searchObj.start_date +'" data-end-date="'+searchObj.end_date+'" data-type="'+ searchObj.type +'" data-page="1" class="home_page">首 页</a>'+
                content + '<a href="javascript:void(0)" data-start-date="'+searchObj.start_date+'" data-end-date="'+searchObj.end_date+'" data-type="'+ searchObj.type+ '" data-page="'+MaxPageNum+'" class="home_page">尾 页</a>';
            
            //添加输入跳转部分
            //content2 += '跳转到：<input type="text" value="'+ searchObj.page +" / "+ MaxPageNum+'" class="page_just"><input type="button" value="GO" class="page_go">' 
            content2 += '跳转到：<input type="text" data-description="页码" placeholder=""  autocomplete="off" data-start-date="'+ searchObj.start_date +'" data-end-date="'+ searchObj.end_date +'"data-type="'+searchObj.type+'" data-page="'+ MaxPageNum +'" value="'+searchObj.page +" / "+ MaxPageNum +'" class="page_just"><input type="button" value="GO" class="page_go">';
            searchObj.$search_page.html(content2);
        }
    };

    MembersInformation.init();
});

