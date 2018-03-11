$(function() {

    // 会员生日营销
    var nextData = {};
    var nowData = {};
    var SystemHint = {

        init: function() {
            // 显示数据
            this.selectDateMembers();
            // 绑定点击事件
            this.MembersBind();

        },
        // 绑定点击事件
        MembersBind: function() {
            var _self = this;
            // 点击查询按钮
            $('#serchermember').unbind('click').bind('click', function() {
                _self.selectDateMembers();
            });
            //点击添加
            $('#permissions').unbind('click').bind('click', function() {
                window.location.replace('addBirthdayM.html?type=3&addIsUp=1');
            });
            // 删除
            $('#membertbodys').delegate('input[data-type="delete"]', 'click', function() {
                var market_id = $(this).parent('td').parent('tr').attr('id');
                $('#alert-content').html('您确定要删除该营销方案吗？');
                displayAlertMessage('#alert-message', '#cancel-alert');
                $('#definite-alert').unbind('click').bind('click', function() {
                    setAjax(AdminUrl.member_marketDelete, {
                        'type': '3',
                        'market_id': market_id
                    }, $('#prompt-message'), { 20: '' }, function(respnoseText) {
                        // 得到返回数据
                        var data = respnoseText.data;
                        if (respnoseText.code == 20) {
                            window.location.replace('memberWakeup.html');
                        } else {
                            displayMsgTime(ndPromptMsg, respnoseText.message, 2000);
                        }
                    }, 0);
                });
            });

            // 启用/禁用
            $('#membertbodys').delegate('input[data-type="market_status"]', 'click', function() {
                var market_id = $(this).parent('td').parent('tr').attr('id');
                var market_status = $(this).attr('statusVal');
                setAjax(AdminUrl.market_status, {
                    'type': '3',
                    'market_id': market_id,
                    'market_status': market_status
                }, $('#prompt-message'), { 20: '' }, function(respnoseText) {
                    // 得到返回数据
                    if (respnoseText.code == 20) {
                        window.location.replace('memberWakeup.html');
                    } else {
                        displayMsgTime(ndPromptMsg, respnoseText.message, 2000);
                    }
                }, 0);
            });
            // 修改
            $('#membertbodys').delegate('input[data-type="update"]', 'click', function() {
                var market_id = $(this).parent('td').parent('tr').attr('id');
                nextData = nowData[market_id];
                Cache.set('nextData', nextData);
                window.location.replace('addBirthdayM.html?type=3&addIsUp=2');
            });

        },

        // 查询
        selectDateMembers: function() {
            // 搜索之前清空数据
            $('#membertbodys').html('');
            var self = this;
            setAjax(AdminUrl.member_market, {
                'type': '3'
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
            var age = '';
            var birthday = '';
            var register = '';
            var user_sex = '';
            for (var i in data) {

                if (data[i].condition.age_end == '') {
                    age = '全部会员'
                } else {
                    age = data[i].condition.age_start + '-' + data[i].condition.age_end
                };

                if (data[i].condition.register_end == '') {
                    register = '全部会员'
                } else {
                    register = data[i].condition.register_start + '-' + data[i].condition.register_end
                }
                if (data[i].condition.user_sex == '') {
                    user_sex = '全部会员'
                } else if (data[i].condition.user_sex == '1') {
                    user_sex = '男性会员'
                } else if (data[i].condition.user_sex == '2') {
                    user_sex = '女性会员'
                };

                content += '<tr class="total-tr" id="' + data[i].market_id + '">' +
                    '<td market_id=' + data[i].market_id + ' class="tdjianju" data-type="user_mobile">' + data[i].market_name + '</td>' +
                    '<td class="tdjianju">' + register + '</td>' +
                    '<td class="tdjianju">' + age + '</td>' +
                    '<td class="tdjianju">' + user_sex + '</td>' +
                    '<td class="tdjianju">' + data[i].condition.day_num + '</td> ' +
                    '<td class="tdjianju">' + data[i].condition.start_time + '至' + data[i].condition.end_time + '</td>' +
                    '<td class="tdjianju">' + data[i].voucher_name + '</td>' +
                    '<td>' +
                    (data[i].market_status == '0' ? '<input type="button" value="启用" class="stores-caozuo-btn" statusVal="1" data-type="market_status"><input type="button" value="修改" class="stores-caozuo-btn" data-type="update">' : '<input type="button" value="禁用" statusVal="0" class="stores-caozuo-btn" data-type="market_status"><input style="background: #cacaca;" type="button" value="修改" class="stores-caozuo-btn" data-type="">') +
                    '<input type="button" value="删除" class="stores-caozuo-btn delete_btn" data-type="delete">' +
                    '</td>' +
                    '</tr>';
            }

            // 添加到页面中
            $('#membertbodys').html(content);
        },
    }

    SystemHint.init();

});