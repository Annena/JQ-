$(function() {

    // 会员信息

    // 是否支持实体卡的开关
    var is_entity_card = $.cookie('is_entity_card');
    // 选项卡 1会员 2实体卡
    var option_tab = 1;

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
            // 判断是否支持实体卡，显示隐藏选项卡
            if (is_entity_card == 0) {
                $('#option_tab').addClass('hide');
                $('#station').css('height', '116px');
            } else {
                $('#option_tab').removeClass('hide');
                $('#station').css('height', '181px');
            }
            // 调用监控键盘(public.js)
            keydown_monitor('#card_barcode');

            // 根据屏幕分辨率判断，input框宽度调整
            if (window.screen.width < 1100) {
                $('.clearfix_p input').addClass('window_width');
            } else {
                $('.clearfix_p input').removeClass('window_width');
            }
        },

        // 显示数据
        MembersList: function(data) {
            // 领卡日期显示当前日期
            /*$("#start-date").val(getLocalDate());
            $("#end-date").val(getLocalDate());*/

            $("#start-date,#start_date").val(getOffsetDateTime().start_day);
            $("#jieshudate,#end_date").val(getOffsetDateTime().end_day);
        },

        // 绑定点击事件
        MembersBind: function() {
            var _self = this;
            // 点击会员查询按钮
            $('#serchermember').unbind('click').bind('click', function() {
                var searchefs = $("#searchefs").val(); // 搜索方式，1：按日期，2：按用户
                // 查询
                _self.selectDateMembers(searchefs);
            });

            // 搜索方式改变事件
            $('#searchefs').change(function() {
                if ($(this).val() == 1) {
                    $('#userid').addClass('hide');
                    $('#datetime').removeClass('hide');
                }

                if ($(this).val() == 2) {
                    $('#datetime').addClass('hide');
                    $('#userid').removeClass('hide');
                    $('#useraccount').val('');
                }
            });
            // 会员列表手机号点击进入详情
            $('#membertbodys').delegate('tr', 'click', function(event) {
                var self = this;
                var type = $(event.target).attr('data-type');

                var user_mobile = $(self).find('td[data-type="user_mobile"]').text();
                // 手机号
                if (type == 'user_mobile') {
                    window.location.replace('userdetail.html?v='+Math.random()+'&user_mobile='+user_mobile);
                }
            });

            // 点击实体卡查询按钮
            $('#serchermember_1').unbind('click').bind('click', function() {
                var choice = $("#choice").val(); // 搜索方式，1：按日期，2：按用户
                _self.select_card(choice);
            });
            // 搜索方式改变事件
            $('#choice').change(function() {
                if ($(this).val() == 1) {
                    $('#datetime_1').removeClass('hide');
                    $('#barcode_display,#no_display').addClass('hide');
                    is_scan_monitor = 0;
                }
                if ($(this).val() == 2) {
                    $('#datetime_1').addClass('hide');
                    $('#barcode_display,#no_display').removeClass('hide');
                    is_scan_monitor = 1;
                    $('#card_barcode').focus();
                    $('#card_barcode,#card_no').val('');
                }
            });
            // 会员列表手机号点击进入详情
            $('#membertbodys_1').delegate('tr', 'click', function(event) {
                var self = this;
                var type = $(event.target).attr('data-type');
                var entity_id = $(this).attr("id");
                var card_barcode = $(this).find('td[data-type="card_barcode"]').text();
                var card_no = $(this).find('td[data-type="card_no"]').text();

                // 手机号
                if (type == 'card_barcode') {
                    window.location.replace('userdetail.html?v='+Math.random()+'&card_barcode='+card_barcode+'&card_no='+card_no+'&type=2&entity_id='+entity_id);
                }
            });

            // 选项卡点击
            $('#option_tab').on('click', 'div', function () {
                var data_type = $(this).attr('data-type');
                $(this).addClass('caipin-fenleicheck').siblings('div').removeClass('caipin-fenleicheck').addClass('caipin-fenleinucheck');
                $('#stafffloat table[data-type="'+data_type+'"]').removeClass('hide').siblings('table').addClass('hide');
                $('#stafffloat li[data-type="'+data_type+'"]').removeClass('hide').siblings('li').addClass('hide');
                $('#stores-content table[data-type="'+data_type+'"]').removeClass('hide').siblings('table').addClass('hide');
                option_tab = data_type;
                is_scan_monitor = data_type == 1 ? 0 : 1;
            });
        },

        // 按日期查询
        selectDateMembers: function(searchefs) {
            // 搜索之前清空数据
            $('#membertbodys').html('');

            var self = this;
            // 获取到搜索的项
            var startdate = $("#start-date").val(); // 领卡日期开始
            var enddate = $("#jieshudate").val(); // 领卡日期结束
            var userid = $("#useraccount").val(); // 用户手机号
            var url = '';
            var data = {};
            if (searchefs == 1) {
                if (startdate == "" || enddate == "") {
                    displayMsg(ndPromptMsg, '请选择开始日期和结束日期!', 2000);
                    return;
                }
                if (startdate > enddate) {
                    displayMsg(ndPromptMsg, '开始日期应小于结束日期!', 2000);
                    return;
                }
                url = AdminUrl.memberUserListDate;
                data = {
                    'start_date': startdate,
                    'end_date': enddate
                };
            } else {
                if (!dataTest('#useraccount', '#prompt-message', { 'empty': '不能为空', 'mobileNumber': '不正确' })) {
                    return;
                }
                url = AdminUrl.memberUserInfo;
                data = {
                    'user_mobile': userid
                };
            }

            setAjax(url, data, $('#prompt-message'), { 20: '' }, function(respnoseText) {
                // 得到返回数据
                var data = respnoseText.data;
                if (respnoseText.code == 20) {
                    // 显示搜索出来的数据
                    self.selectListMem(data, searchefs);
                } else {
                    displayMsgTime(ndPromptMsg, respnoseText.message, 2000);
                }
            }, 0);
        },

        // 领卡日期搜索出来的数据
        selectListMem: function(data, searchefs) {
            var content = '';
            var is_authority = ''; // 是否授权，0：否，1：是
            var user_sex = '';

            if (searchefs == 2) {
                if (data.is_authority == undefined || data.is_authority == 0) {
                    is_authority = '否';
                } else if (data.is_authority == 1) {
                    is_authority = '是';
                }
                if (data.user_sex == 1) {
                    user_sex = '男';
                } else if (data.user_sex == 2) {
                    user_sex = '女';
                } else {
                    user_sex = '保密';
                }

                content += '<tr class="total-tr" id="' + data.user_id + '">' +
                    '<td class="tdjianju user_mobile" data-type="user_mobile">' + data.user_mobile + '</td>' +
                    '<td class="tdjianju">' + data.user_name + '</td>' +
                    '<td class="tdjianju">' + user_sex + '</td>' +
                    '<td class="tdjianju">' + data.user_birthday + '</td>' +
                    '<td class="tdjianju">' + parseFloat(accSubtr(data.stored_amount, data.stored_consume)).toFixed(2) + '</td>' +
                    '<td class="tdjianju">' + data.stored_amount + '</td>' +
                    '<td class="tdjianju">' + data.stored_consume + '</td>' +
                    '<td class="tdjianju">' + data.discount_rate + '</td>' +
                    '<td class="tdjianju">' + data.integral_amount + '</td>' +
                    '<td class="tdjianju">' + (data.add_time == 0 ? '未领卡' : getAppointTime(data.add_time)) + '</td>' +
                    '<td class="tdjianju">' + is_authority + '</td>' +
                    // (data.add_time == 0 ? '' :
                    //     '<td>' +
                    //     ((data.del_note == null || data.del_note == '') ? '' :
                    //         '<div class="freeze_remark">' +
                    //         '<span>备注：</span>' +
                    //         '<span>' + data.del_note + '</span>' +
                    //         '</div>') +
                    //     (data.is_del == 0 ?
                    //         '<input type="button" value="冻结" class="stores-caozuo-btn" data-type="frozen">' :
                    //         '<input type="button" value="解冻" class="stores-caozuo-btn" data-type="thaw">') +
                    //     '</td>') +
                    '</tr>';
            } else {
                for (var i in data) {
                    if (data[i].is_authority == undefined || data[i].is_authority == 0) {
                        is_authority = '否';
                    } else if (data[i].is_authority == 1) {
                        is_authority = '是';
                    }

                    if (data[i].user_sex == 1) {
                        user_sex = '男';
                    } else if (data[i].user_sex == 2) {
                        user_sex = '女';
                    } else {
                        user_sex = '保密';
                    }

                    content += '<tr class="total-tr" id="' + data[i].user_id + '">' +
                        '<td class="tdjianju user_mobile" data-type="user_mobile">' + data[i].user_mobile + '</td>' +
                        '<td class="tdjianju">' + data[i].user_name + '</td>' +
                        '<td class="tdjianju">' + user_sex + '</td>' +
                        '<td class="tdjianju">' + data[i].user_birthday + '</td>' +
                        '<td class="tdjianju">' + parseFloat(accSubtr(data[i].stored_amount, data[i].stored_consume)).toFixed(2) + '</td>' +
                        '<td class="tdjianju">' + data[i].stored_amount + '</td>' +
                        '<td class="tdjianju">' + data[i].stored_consume + '</td>' +
                        '<td class="tdjianju">' + data[i].discount_rate + '</td>' +
                        '<td class="tdjianju">' + data[i].integral_amount + '</td>' +
                        '<td class="tdjianju">' + getAppointTime(data[i].add_time) + '</td>' +
                        '<td class="hide" data-type="del_note">' + data[i].del_note + '</td>' +
                        '<td class="tdjianju">' + is_authority + '</td>' +
                        // '<td>' +
                        // ((data[i].del_note == null || data[i].del_note == '') ? '' :
                        //     '<div class="freeze_remark">' +
                        //     '<span>备注：</span>' +
                        //     '<span>' + data[i].del_note + '</span>' +
                        //     '</div>') +
                        //  (data[i].is_del == 0 ?
                        //     '<input type="button" value="冻结" class="stores-caozuo-btn" data-type="frozen">' :
                        //     '<input type="button" value="解冻" class="stores-caozuo-btn" data-type="thaw">') +
                        // '</td>' +
                        '</tr>';
                }
            }

            // 添加到页面中
            $('#membertbodys').html(content);
        },

        // 按实体卡查询
        select_card: function (choice) {
            // 搜索之前清空数据
            $('#membertbodys_1').html('');

            var _self = this;
            // 获取到搜索的项
            var card_barcode = $('#card_barcode').val();// 读写卡号
            var card_no = $('#card_no').val();          // 录入卡号
            var start_date = $('#start_date').val();
            var end_date = $('#end_date').val();
            var data = {};
            var url = '';

            if (choice == 2) {
                if (card_barcode == '' && card_no == '') {
                    displayMsg(ndPromptMsg, '请放卡或输入卡号！', 2000);
                    return;
                }
                if (card_no != '' && !Pattern.entity_card.test(card_no)) {
                    displayMsg(ndPromptMsg, '请输入正确的卡号！', 2000);
                    return;
                }
            }
            if (choice == 1) {
                data = {
                    'start_date': start_date,
                    'end_date': end_date
                };
                url = AdminUrl.entity_card_list;
            } else {
                data = {
                    'card_barcode': card_barcode,
                    'card_no': card_no
                };
                url = AdminUrl.entity_card_info;
            }

            setAjax(url, data, $('#prompt-message'), { 20: '' }, function(respnoseText) {
                // 得到返回数据
                var data = respnoseText.data;
                if (respnoseText.code == 20) {
                    // 显示搜索出来的数据
                    _self.select_card_data(data, choice);
                } else {
                    displayMsgTime(ndPromptMsg, respnoseText.message, 2000);
                }
            }, 0);
        },

        // 实体卡列表数据渲染
        select_card_data: function (data, choice) {
            var content = '';
            var timestamp = Math.round(new Date().getTime()/1000).toString();
            var effec = '';
            if (choice == 2) {
                if(data.end_time < timestamp){
                     TypeColor ='#b0020b';
                }else{
                      TypeColor = '#02af16';
                }
                content += '<tr class="total-tr" id="'+data.entity_id+'">'+
                                '<td class="tdjianju user_mobile report_text" data-type="card_barcode">'+data.card_barcode+'</td>'+
                                '<td class="tdjianju report_text" data-type="card_no">'+data.card_no+'</td>'+
                                '<td class="tdjianju report_num">'+parseFloat(accSubtr(data.stored_amount, data.stored_consume)).toFixed(2)+'</td>'+
                                '<td class="tdjianju report_num">'+data.stored_amount+'</td>'+
                                '<td class="tdjianju report_num">'+data.stored_consume+'</td>'+
                                '<td class="tdjianju addColor">'+getAppointTime(data.add_time)+'</td>'+
                                '<td class="tdjianju" style="color:'+TypeColor+'!important">'+getAppointTime(data.end_time)+'</td>'+
                            '</tr>';
                
            } else {
                for (var i in data) {
                    if(data[i].end_time < timestamp){
                        TypeColor ='#b0020b';
                    }else{
                        TypeColor = '#02af16';
                    }
                    content += '<tr class="total-tr" id="'+data[i].entity_id+'">'+
                                    '<td class="tdjianju user_mobile report_text" data-type="card_barcode">'+data[i].card_barcode+'</td>'+
                                    '<td class="tdjianju report_text" data-type="card_no">'+data[i].card_no+'</td>'+
                                    '<td class="tdjianju report_num">'+parseFloat(accSubtr(data[i].stored_amount, data[i].stored_consume)).toFixed(2)+'</td>'+
                                    '<td class="tdjianju report_num">'+data[i].stored_amount+'</td>'+
                                    '<td class="tdjianju report_num">'+data[i].stored_consume+'</td>'+
                                    '<td class="tdjianju">'+getAppointTime(data[i].add_time)+'</td>'+
                                    '<td class="tdjianju" style="color:'+TypeColor+'!important">'+getAppointTime(data[i].end_time)+'</td>'+
                                '</tr>';
                }
            }
            $('#membertbodys_1').html(content);
          
          
        }
    }

    MembersInformation.init();

});