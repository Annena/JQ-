$(function() {

    // 会员点评
    var _self = this;
    //判断table面，1：抵用券 2:积分
    if(getQueryString('give_type') == undefined){
        var give_type=1;
    }else{
        var give_type=getQueryString('give_type');
    }

    if(give_type == 1){
        $('#integral').addClass('hide');
        $("#voucher").removeClass('hide');
        $("#addCom").text("添加抵用券营销");
        $("#memberSel").addClass('caipin-fenleicheck').siblings('div').removeClass('caipin-fenleicheck').addClass('caipin-fenleinucheck');
    }else{
        $('#integral').removeClass('hide');
        $("#voucher").addClass('hide');
        $("#addCom").text("添加积分营销");
        $("#cardSel").addClass('caipin-fenleicheck').siblings('div').removeClass('caipin-fenleicheck').addClass('caipin-fenleinucheck');
    }
    var nextData = {};
    var nowData = {};
    var SystemHint = {

        init: function() {
            // 显示数据
            this.selectDateMembers(give_type);
            // 绑定点击事件
            this.MembersBind();


        },
        // 绑定点击事件
        MembersBind: function() {
          //Table的点击事件  
            //抵用券的的点击事件
            $("#memberSel").unbind('click').bind('click',function() {
                $('#integral').addClass('hide');
                $("#voucher").removeClass('hide');
                $("#addCom").text("添加抵用券营销");
                _self.selectDateMembers(1);
                give_type=1;
            });
            //积分的点击事件
            $("#cardSel").unbind('click').bind('click',function() {
                $('#integral').removeClass('hide');
                $("#voucher").addClass('hide');
                $("#addCom").text("添加积分营销");
                _self.selectDateMembers(2);
                give_type=2;
            });
            // $('#normal').unbind('click').bind('click', function () {
            //         $('paynormal').removeClass('hide');
            //         $('payshelves').addClass('hide');
            //         $('#shelves').removeClass('caipin-fenleicheck');
            //         $('#shelves').addClass('caipin-fenleinucheck');
            //         $('#normal').addClass('caipin-fenleicheck');
            //         $('#normal').removeClass('caipin-fenleinucheck');

            //         _self.newPayWayData(payStatus,0);

            //         payStatus = 0;
            //     });




            // 选项卡点击添加样式
            $('#option_tab').on('click', 'div', function () {
                var data_type = $(this).attr('data-type');
                $(this).addClass('caipin-fenleicheck').siblings('div').removeClass('caipin-fenleicheck').addClass('caipin-fenleinucheck');
            });
            var _self = this;
            // 点击查询按钮
            $('#serchermember').unbind('click').bind('click', function() {
                _self.selectDateMembers();
            });
            //点击添加
            $('#addCom').unbind('click').bind('click', function() {
                // console.log(give_type);
                window.location.replace('addCommentM.html?type=4&addIsUp=1&give_type='+give_type);
            });
            // 删除
            $('#membertbodysVoucher,#membertbodysIntegral').delegate('input[data-type="delete"]', 'click', function() {
                var market_id = $(this).parent('td').parent('tr').attr('id');
                $('#alert-content').html('您确定要删除该营销方案吗？');
                displayAlertMessage('#alert-message', '#cancel-alert');
                $('#definite-alert').unbind('click').bind('click', function() {
                    setAjax(AdminUrl.member_marketDelete, {
                        'type': '4',
                        'give_type':give_type,
                        'market_id': market_id
                    }, $('#prompt-message'), { 20: '' }, function(respnoseText) {
                        // 得到返回数据
                        var data = respnoseText.data;
                        if (respnoseText.code == 20) {
                            window.location.replace('comment.html?give_type='+give_type);
                        } else {
                            displayMsgTime(ndPromptMsg, respnoseText.message, 2000);
                        }
                    }, 0);
                });
            });

            // 启用/禁用
            $('#membertbodysVoucher,#membertbodysIntegral').delegate('input[data-type="market_status"]', 'click', function() {
                var market_id = $(this).parent('td').parent('tr').attr('id');
                var market_status = $(this).attr('statusVal');
                setAjax(AdminUrl.market_status, {
                    'type': '4',
                    'give_type':give_type,
                    'market_id': market_id,
                    'market_status': market_status
                }, $('#prompt-message'), { 20: '' }, function(respnoseText) {
                    // 得到返回数据
                    if (respnoseText.code == 20) {
                        window.location.replace('comment.html?give_type='+give_type);
                    } else {
                        displayMsgTime(ndPromptMsg, respnoseText.message, 2000);
                    }
                }, 0);
            });
            // 修改
            $('#membertbodysVoucher,#membertbodysIntegral').delegate('input[data-type="update"]', 'click', function() {
                var market_id = $(this).parent('td').parent('tr').attr('id');
                nextData = nowData[market_id];
                Cache.set('nextData', nextData);
                window.location.replace('addCommentM.html?type=4&addIsUp=2&give_type='+give_type+'&market_id='+market_id);
            });

        },

        // 查询
        selectDateMembers: function(give_type) {
            // 搜索之前清空数据
            $('#membertbodys').html('');
            var self = this;
            setAjax(AdminUrl.member_market, {
                'type': '4',
                'give_type':give_type
            }, $('#prompt-message'), { 20: '' }, function(respnoseText) {
                // 得到返回数据
                var data = respnoseText.data;
                if (respnoseText.code == 20) {
                    nowData = data
                    self.selectListMem(data);
                } else {
                    displayMsgTime(ndPromptMsg, respnoseText.message, 2000);
                }
            }, 0);
        },
        // 查询数据
        selectListMem: function(data) {
            var content = '';
            var ruleStr = '';
            var givetypeCont = '';
            var content_len = '';
            var picture_num = '';
            var date_start = new Date();
            var date_End = new Date();
            // var age = '';
            // var birthday = '';
            // var register = '';
            // var user_sex = '';
            for (var i in data) {

                //时间戳
                    var data_start = getAppointTime(data[i].condition.start_time);
                    var data_end = getAppointTime(data[i].condition.end_time);

                //文字图片的限制判断
                    if(data[i].condition.content_len == 0){
                        content_len = '不限制';
                    }else{
                        content_len = data[i].condition.content_len;
                    }
                    if(data[i].condition.picture_num == 0){
                        picture_num = '不限制';
                    }else{
                        picture_num = data[i].condition.picture_num;
                    }
                    //抵用券规则的判断
                    function voucherRule(){
                        if(data[i].condition.give_rule == 1){
                            ruleStr = "点评1次赠送1张"; 
                        }else if(data[i].condition.give_rule == 2){
                            ruleStr = "下单点评1次赠送1张";
                        }else{
                            ruleStr = "1天点评多次赠送1张";
                        }
                        return ruleStr;
                    };
                    
                    //积分规则的判断   
                    function integRule(){
                        if(data[i].condition.give_rule == 1){
                            ruleStr = "点评1次赠送1次积分"; 
                        }else if(data[i].condition.give_rule == 2){
                            ruleStr = "下单点评1次赠送1次积分";
                        }else{
                            ruleStr = "1天点评多次赠送1次积分";
                        }
                        return ruleStr;
                    };
                    
                   

                    //判断积分还是抵用券
                    if(give_type == 1){
                        givetypeCont =  '<td class="tdjianju">' + data[i].voucher_name + '</td>' +
                                        '<td class="tdjianju">' + voucherRule() + '</td>';
                    }else{
                        givetypeCont =  
                                        '<td class="tdjianju">' + data[i].condition.integral_num + '</td>'+
                                        '<td class="tdjianju">' + integRule() + '</td>';
                    }

                     content += '<tr class="total-tr" id="' + data[i].market_id + '">' +
                    '<td market_id=' + data[i].market_id + ' class="tdjianju" data-type="user_mobile">' + data[i].market_name + '</td>' +
                    '<td class="tdjianju">' + content_len + '</td>' +
                    '<td class="tdjianju">' + picture_num + '</td>' +
                    '<td class="tdjianju">' + data_start + '</td> ' +
                    '<td class="tdjianju">' + data_end + '</td>' +
                     givetypeCont+
                    // '<td class="tdjianju">' + data[i].voucher_name + '</td>' +
                    '<td>' +
                    (data[i].market_status == '0' ? '<input type="button" value="启用" class="stores-caozuo-btn" statusVal="1" data-type="market_status"><input type="button" value="修改" class="stores-caozuo-btn" data-type="update">' : '<input type="button" value="禁用" statusVal="0" class="stores-caozuo-btn" data-type="market_status"><input style="background: #cacaca;" type="button" value="修改" class="stores-caozuo-btn" data-type="">') +
                    '<input type="button" value="删除" class="stores-caozuo-btn delete_btn" data-type="delete">' +
                    '</td>' +
                    '</tr>';
                // }
            }
            // 添加到页面中
          $('#membertbodysVoucher').html(content);        },    }

    SystemHint.init();

});
