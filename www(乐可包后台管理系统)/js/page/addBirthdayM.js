$(function() {


    // 获取type值，type = 1生日营销，2，节日营销，3会员唤醒
    var type = getQueryString('type');
    // 判断是修改还是添加 1,添加，2,修改
    var addIsUp = getQueryString('addIsUp');
    var register_time = '1';
    var age_num = '1';
    var birthday_time = '1';
    var subUrl = '';
    var holiday_time = '1';
    var holiday_or = '';
    var holidayList = {};
    var birthday_start,
        birthday_end,
        register_start,
        register_end,
        age_start,
        age_end,
        voucher_id,
        holiday = '';
    // 获取到修改传过来的缓存
    var dataPro = Cache.get('nextData');
    var DishesManageAdd = {
        init: function() {
            //添加生日的时候，隐藏沉默会员，节日的选项
            if (type == '1') {
                $('#addAndedit').text('添加会员生日营销方案');
                $('.scanCode_li').addClass('hide');
                $('.festival_li').addClass('hide');
                //生日时间
                $("#birthday_start").val(getOffsetDateTime().start_day);
                $("#birthday_end").val(getOffsetDateTime().end_day);
            } else if (type == '2') {
                $('#addAndedit').text('添加会员节日营销方案');
                $('.scanCode_li').addClass('hide');
                $('.birthday_li').addClass('hide');
                this.holidayList();
            } else if (type == '3') {
                $('#addAndedit').text('添加沉默会员唤醒方案');
                $('.birthday_li').addClass('hide');
                $('.festival_li').addClass('hide');
                $('.advance_day_li').addClass('hide');
                $('.start_time_li').removeClass('hide');

            };

            if (addIsUp == '2') {
                $('#sub').attr('id', 'updatebtn')
                this.DishesData();
            } else {
                // 注册时间
                $("#register_start").val(getOffsetDateTime().start_day);
                $("#register_end").val(getOffsetDateTime().end_day);
                //沉默发放时间
                $("#start_time").val(getOffsetDateTime().start_day);
                $("#end_time").val(getOffsetDateTime().end_day);

            }


            // 绑定点击事件
            this.DishesAddBind();
            //查询抵用券
            this.voucherData();
        },
        //查询抵用券
        voucherData: function() {
            var _self = this;
            setAjax(AdminUrl.voucherVoucherList, {
                'vou_status': '0'
            }, $('#prompt-message'), { 20: '' }, function(respnoseText) {
                // 得到返回数据
                var data = respnoseText.data;
                if (respnoseText.code == 20) {
                    _self.voucherList(data);
                } else {
                    displayMsgTime(ndPromptMsg, respnoseText.message, 2000);
                }
            }, 0);
        },
        voucherList: function(data) {
            var content = '';
            for (var i in data) {
                content += '<option value="' + data[i].voucher_id + '">' + data[i].voucher_name + '</option>'
            }
            $('#voucher').html(content)
            if (addIsUp == '2') {
                $('#voucher').val(dataPro.voucher_id)
            }
        },
        //显示节日
        holidayList: function() {
            var myDate = new Date;
            var year = myDate.getFullYear(); //获取当前年
            var month = myDate.getMonth(); //月
            var day = myDate.getDate(); //获取当前日

            var zhongqiu = calendar.lunar2solar(year, 08, 15) //中秋节
            var dunawu = calendar.lunar2solar(year, 05, 05) //端午节
            var yuanxiao = calendar.lunar2solar(year, 01, 15) //元宵节
            var qixi = calendar.lunar2solar(year, 07, 07) //七夕节
            var chongyang = calendar.lunar2solar(year, 09, 09) //重阳节

            var content = {
                yuadan: { year: year, month: '01', day: '01', name: '元旦' },
                yuanxiao: { year: yuanxiao.cYear, month: (yuanxiao.cMonth < 10 ? '0' + yuanxiao.cMonth : yuanxiao.cMonth), day: (yuanxiao.cDay < 10 ? '0' + yuanxiao.cDay : yuanxiao.cDay), name: '元宵节' },
                qingren: { year: year, month: '02', day: '04', name: '情人节' },
                funv: { year: year, month: '03', day: '08', name: '妇女节' },
                laodong: { year: year, month: '05', day: '01', name: '劳动节' },
                qingnian: { year: year, month: '05', day: '04', name: '青年节' },
                duanwu: { year: dunawu.cYear, month: (dunawu.cMonth < 10 ? '0' + dunawu.cMonth : dunawu.cMonth), day: (dunawu.cDay < 10 ? '0' + dunawu.cDay : dunawu.cDay), name: '端午节' },
                qingnian: { year: year, month: '06', day: '01', name: '儿童节' },
                jianjun: { year: year, month: '08', day: '01', name: '建军节' },
                qixi: { year: qixi.cYear, month: (qixi.cMonth < 10 ? '0' + qixi.cMonth : qixi.cMonth), day: (qixi.cDay < 10 ? '0' + qixi.cDay : qixi.cDay), name: '七夕节' },
                jiaoshi: { year: year, month: '09', day: '10', name: '教师节' },
                zhongqiu: { year: zhongqiu.cYear, month: (zhongqiu.cMonth < 10 ? '0' + zhongqiu.cMonth : zhongqiu.cMonth), day: (zhongqiu.cDay < 10 ? '0' + zhongqiu.cDay : zhongqiu.cDay), name: '中秋节' },
                guoqing: { year: year, month: '10', day: '01', name: '国庆节' },
                chongyang: { year: chongyang.cYear, month: (chongyang.cMonth < 10 ? '0' + chongyang.cMonth : chongyang.cMonth), day: (chongyang.cDay < 10 ? '0' + chongyang.cDay : chongyang.cDay), name: '重阳节' },
                shengdan: { year: year, month: '12', day: '25', name: '圣诞节' }

            };
            var data = '';

            for (var i in content) {
                if (addIsUp == '2') {
                    if (dataPro.condition.holiday == content[i].time) {
                        holiday_or = '1'
                    }
                }

                if (content[i].month < month + 1) {
                    data += '<option value="' + parseInt(content[i].year + 1) + '-' + content[i].month + '-' + content[i].day + '">' + parseInt(content[i].year + 1) + '年&nbsp;' + content[i].name + '</option>'
                } else if (content[i].month == month + 1 && content[i].day < day) {
                    data += '<option value="' + parseInt(content[i].year + 1) + '-' + content[i].month + '-' + content[i].day + '">' + parseInt(content[i].year + 1) + '年&nbsp;' + content[i].name + '</option>'
                } else {
                    data += '<option value="' + content[i].year + '-' + content[i].month + '-' + content[i].day + '">' + content[i].year + '年&nbsp;' + content[i].name + '</option>'
                }
            };
            $('#festival').html(data)
            if (addIsUp == '2') {
                if (holiday_or == '1') {
                    $('#festival').val(dataPro.condition.holiday)
                    $("#festival_time").val(getOffsetDateTime().start_day);
                } else {
                    $('#festival_end_radio').click();
                    $('#festival_time').val(dataPro.condition.holiday)
                }
            } else {
                $("#festival_time").val(getOffsetDateTime().start_day);
            }
        },
        // 显示基本数据
        DishesData: function() {
            if (type == '1') {
                $('#addAndedit').text('修改会员生日营销方案');
            } else if (type == '2') {
                $('#addAndedit').text('修改会员节日营销方案');
            } else {
                $('#addAndedit').text('修改沉默会员唤醒方案');
            }
            $('#day_num').val(dataPro.condition.day_num)
            $('#market_name').val(dataPro.market_name);
            $('#market_status').val(dataPro.market_status);
            $('#start_time').val(dataPro.condition.start_time);
            $('#end_time').val(dataPro.condition.end_time);

            //如果是修改，判断是否是全部会员，如果不是，则显示传过来的时间，是显示默认时间
            if (dataPro.condition.register_end != '') {
                $('#register_end_raido').click();
                $('#register_start').val(dataPro.condition.register_start)
                $('#register_end').val(dataPro.condition.register_end)
                register_time = '2';
            } else {
                $("#register_start").val(getOffsetDateTime().start_day);
                $("#register_end").val(getOffsetDateTime().end_day);
            };
            if (dataPro.condition.age_end != '') {
                $('#age_end_radio').click();
                $('#age_start').val(dataPro.condition.age_start)
                $('#age_end').val(dataPro.condition.age_end)
                age_num = '2';
            };
            if (dataPro.condition.user_sex != '') {
                $('#user_sex').val(dataPro.condition.user_sex)
            };
            if (dataPro.condition.birthday_end != '') {
                $('#birthday_end_radio').click();
                $('#birthday_start').val(dataPro.condition.birthday_start)
                $('#birthday_end').val(dataPro.condition.birthday_end)
                birthday_time = '2'
            };

            $('#advance_day').val(dataPro.condition.advance_day);
        },

        // 绑定点击事件
        DishesAddBind: function() {
            var _self = this;
            // 点击取消
            $('#exitbtn').unbind('click').bind('click', function() {
                // 跳转
                if (type == '1') {
                    window.location.replace('memberBirthday.html');
                } else if (type == '2') {
                    window.location.replace('memberFestival.html');
                } else {
                    window.location.replace('memberWakeup.html');
                }
            });
            $('#sub').unbind('click').bind('click', function() {
                _self.DishesAdd();
            });
            $('#updatebtn').unbind('click').bind('click', function() {
                _self.DishesUnde();
            });
            $('#birthday_start_radio').unbind('click').bind('click', function() {
                birthday_time = '1';
            });
            $('#birthday_end_radio').unbind('click').bind('click', function() {
                birthday_time = '2';
            });
            $('#register_start_raido').unbind('click').bind('click', function() {
                register_time = '1';
            });
            $('#register_end_raido').unbind('click').bind('click', function() {
                register_time = '2';
            });

            $('#festival_start_radio').unbind('click').bind('click', function() {
                holiday_or = '1';
                holiday_time = '1';
            });
            $('#festival_end_radio').unbind('click').bind('click', function() {
                holiday_time = '2';
            });

            $('#age_start_radio').unbind('click').bind('click', function() {
                $('#age_start').val('')
                $('#age_end').val('')
                age_num = '1';
            });
            $('#age_end_radio').unbind('click').bind('click', function() {
                age_num = '2';
            });

            //点击自定义时间的时候选中前面的radio
            $('#register_start').unbind('click').bind('click', function() {
                $('#register_end_raido').prop('checked', true);
                register_time = '2';
            });
            $('#register_end').unbind('click').bind('click', function() {
                $('#register_end_raido').prop('checked', true)
                register_time = '2';
            });

            $('#age_start').unbind('click').bind('click', function() {
                $('#age_end_radio').prop('checked', 'checked')
                age_num = '2';
            });
            $('#age_end').unbind('click').bind('click', function() {
                $('#age_end_radio').prop('checked', 'checked')
                age_num = '2';
            });

            $('#birthday_start').unbind('click').bind('click', function() {
                $('#birthday_end_radio').prop('checked', 'checked')
                birthday_time = '2';
            });
            $('#birthday_end').unbind('click').bind('click', function() {
                $('#birthday_end_radio').prop('checked', 'checked')
                birthday_time = '2';
            });

            $('#festival_time').unbind('click').bind('click', function() {
                $('#festival_end_radio').prop('checked', 'checked')
                holiday_time = '2';
            });


        },

        // 校验数据
        checkData: function() {
            //如果输入的有空格，删除空格
            $('#form ul input').each(function() {
                if ($(this).val() != '') {
                    if ($(this).attr('id') != 'menuPictt') {
                        $(this).val($(this).val().replace(/\s/g, ""))
                    }
                }
            })
            return true;
        },


        // 添加
        DishesAdd: function() {
            var _self = this;
            // 获取到各个数据，请求接口提交数据
            var market_name = $('#market_name').val();
            var market_status = $('#market_status option:selected').val();
            var user_sex = $('#user_sex option:selected').val();
            var advance_day = $('#advance_day').val();
            var day_num = $('#day_num').val();
            var voucher_id = $('#voucher option:selected').val();
            if (type == '3') {
                var start_time = $('#start_time').val();
                var end_time = $('#end_time').val();
            } else {
                var start_time = '';
                var end_time = '';
            }
            if (type == '2') {
                if (holiday_time == '1') {
                    holiday = $('#festival option:selected').val();
                } else {
                    holiday = $('#festival_time').val();
                }
            };
            if (type == '3' && day_num == '') {
                displayMsgTime(ndPromptMsg, '请输入沉默时间', 2000);
                return false
            };
            if (birthday_time == '1') {
                birthday_start = '';
                birthday_end = '';
            } else {
                birthday_start = $('#birthday_start').val();
                birthday_end = $('#birthday_end').val();
                if (birthday_start > birthday_end) {
                    displayMsgTime(ndPromptMsg, '生日开始日期应小于结束日期', 2000);
                    return false
                }
            };
            if (register_time == '1') {
                register_start = '';
                register_end = '';
            } else {
                register_start = $('#register_start').val();
                register_end = $('#register_end').val();
                if (register_start > register_end) {
                    displayMsgTime(ndPromptMsg, '注册开始日期应小于结束日期', 2000);
                    return false
                }

            };

            //判断年龄
            if (age_num == '1') {
                age_start = '';
                age_end = '';
            } else {
                age_start = $('#age_start').val();
                age_end = $('#age_end').val();
                if (age_start == '') {
                    displayMsgTime(ndPromptMsg, '请输入起始年龄', 2000);
                    return false
                }
                if (age_end == '') {
                    displayMsgTime(ndPromptMsg, '请输入结束年龄', 2000);
                    return false
                }
                if (parseInt(age_end) < parseInt(age_start)) {
                    displayMsgTime(ndPromptMsg, '起始年龄应该小于结束年龄', 2000);
                    return false
                }
            };

            setAjax(AdminUrl.member_marketAdd, {
                'type': type,
                'market_name': market_name,
                'market_status': market_status,
                'user_sex': user_sex,
                'day_num': day_num,
                'birthday_start': birthday_start,
                'birthday_end': birthday_end,
                'register_start': register_start,
                'register_end': register_end,
                'age_start': age_start,
                'age_end': age_end,
                'voucher_id': voucher_id,
                'advance_day': advance_day,
                'holiday': holiday,
                'start_time': start_time,
                'end_time': end_time
            }, $('#prompt-message'), { 20: '' }, function(respnoseText) {
                // 得到返回数据
                if (respnoseText.code == 20) {
                    if (type == '1') {
                        window.location.replace('memberBirthday.html');
                    } else if (type == '2') {
                        window.location.replace('memberFestival.html');
                    } else {
                        window.location.replace('memberWakeup.html');
                    }
                } else {
                    displayMsgTime(ndPromptMsg, respnoseText.message, 2000);
                }

            }, 0);
        },
        //修改
        DishesUnde: function() {
            var _self = this;
            // 获取到各个数据，请求接口提交数据
            var market_name = $('#market_name').val();
            var market_status = $('#market_status option:selected').val();
            var user_sex = $('#user_sex option:selected').val();
            var day_num = $('#day_num').val();
            var advance_day = $('#advance_day').val();
            var voucher_id = $('#voucher option:selected').val();
            var market_id = dataPro.market_id;
            if (type == '3') {
                var start_time = $('#start_time').val();
                var end_time = $('#end_time').val();
            } else {
                var start_time = '';
                var end_time = '';
            }
            if (type == '2') {
                if (holiday_time == '1' && holiday_or == '1') {
                    holiday = $('#festival option:selected').val();
                } else {
                    holiday = $('#festival_time').val();
                }
            };
            if (birthday_time == '1') {
                birthday_start = '';
                birthday_end = '';
            } else {
                birthday_start = $('#birthday_start').val();
                birthday_end = $('#birthday_end').val();
                if (birthday_start > birthday_end) {
                    displayMsgTime(ndPromptMsg, '生日开始日期应小于结束日期', 2000);
                    return false
                }
            };
            if (register_time == '1') {
                register_start = '';
                register_end = '';
            } else {
                register_start = $('#register_start').val();
                register_end = $('#register_end').val();
                if (register_start > register_end) {
                    displayMsgTime(ndPromptMsg, '注册开始日期应小于结束日期', 2000);
                    return false
                }

            };
            if (type == '3' && day_num == '') {
                displayMsgTime(ndPromptMsg, '请输入沉默时间', 2000);
                return false
            };

            //判断年龄
            if (age_num == '1') {
                age_start = '';
                age_end = '';
            } else {
                age_start = $('#age_start').val();
                age_end = $('#age_end').val();
                if (age_start == '') {
                    displayMsgTime(ndPromptMsg, '请输入起始年龄', 2000);
                    return false
                }
                if (age_end == '') {
                    displayMsgTime(ndPromptMsg, '请输入结束年龄', 2000);
                    return false
                }
                if (parseInt(age_end) < parseInt(age_start)) {
                    displayMsgTime(ndPromptMsg, '起始年龄应该小于结束年龄', 2000);
                    return false
                }
            };

            setAjax(AdminUrl.member_marketUpdate, {
                'type': type,
                'market_name': market_name,
                'market_status': market_status,
                'user_sex': user_sex,
                'day_num': day_num,
                'birthday_start': birthday_start,
                'birthday_end': birthday_end,
                'register_start': register_start,
                'register_end': register_end,
                'age_start': age_start,
                'age_end': age_end,
                'voucher_id': voucher_id,
                'advance_day': advance_day,
                'holiday': holiday,
                'market_id': market_id,
                'start_time': start_time,
                'end_time': end_time
            }, $('#prompt-message'), { 20: '' }, function(respnoseText) {
                // 得到返回数据
                if (respnoseText.code == 20) {
                    Cache.del('nextData');
                    if (type == '1') {
                        window.location.replace('memberBirthday.html');
                    } else if (type == '2') {
                        window.location.replace('memberFestival.html');
                    } else {
                        window.location.replace('memberWakeup.html');
                    }
                } else {
                    displayMsgTime(ndPromptMsg, respnoseText.message, 2000);
                }

            }, 0);
        }
    }
    DishesManageAdd.init();

});