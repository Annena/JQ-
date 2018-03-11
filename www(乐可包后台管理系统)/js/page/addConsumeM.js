$(function() {


    // 获取type值，type = 1生日营销，2，节日营销，3会员唤醒
    var type = getQueryString('type');
    // 获取赠送类型：give_type : 1:赠送抵用券，2是赠送积分
    var give_type = getQueryString('give_type');

    // var give_type = 2;
    //修改数据的id
    var market_id = '';
    market_id = getQueryString('market_id');
    // 判断是修改还是添加 1,添加，2,修改
    var addIsUp = getQueryString('addIsUp');
    // 列表修改传过来的门店集合
    var shopIdPros = '';
    // var register_time = '1';
    // var age_num = '1';
    // var birthday_time = '1';
    // var subUrl = '';
    // var holiday_time = '1';
    // var holiday_or = '';
    // var holidayList = {};
    // var birthday_start,
    //     birthday_end,
    //     register_start,
    //     register_end,
    //     age_start,
    //     age_end,
    var    voucher_id;
    //     holiday = '';
    // 获取到修改传过来的缓存
    var dataPro = Cache.get('nextData');
    var DishesManageAdd = {
        init: function() {
            //添加的时候give_type= 1抵用券，2积分
            if(addIsUp == 1){
                if(give_type == 1){
                     $('#addAndedit').text('添加抵用券营销');
                }else if(give_type == 2){
                    $('#addAndedit').text('添加积分营销');
                }
            }

            if (addIsUp == '2') {
                $('#sub').attr('id', 'updatebtn');
                this.DishesData();
            } else {
                // 注册时间
                $("#register_start").val(getOffsetDateTime().start_day);
                $("#register_end").val(getOffsetDateTime().end_day);
                //沉默发放时间
                $("#start_time").val(getOffsetDateTime().start_day);
                $("#end_time").val(getOffsetDateTime().end_day);

            }
            //判断是抵用券添加页面还是积分添加页面
            if(give_type==1){
                $('#contentSel').removeClass('hide');
                $('#giveIntegral').addClass('hide');
                $('#integral_num').val('');
            }else if(give_type==2){
                $('#contentSel').addClass('hide');
                $('#giveIntegral').removeClass('hide');
                $('#contentSel').val('');

            }

            // 绑定点击事件
            this.DishesAddBind();
            //查询抵用券
            this.voucherData();
            //渲染支付方式
            this.payData();
            
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
                content += '<option value="' + data[i].voucher_id + '">' + data[i].voucher_name + '</option>';
            }
            $('#voucher').html(content);
            if (addIsUp == '2') {
                $('#voucher').val(dataPro.voucher_id);
            }
        },
        // 显示基本数据
        DishesData: function() {
            //修改的时候，give_type= 1抵用券，2积分
            if(addIsUp == 2){
                if(give_type == 1){
                    $('#addAndedit').text('修改抵用券营销');
                }else if(give_type == 2){
                    $('#addAndedit').text('修改积分营销');
                }
            }
            // $('#day_num').val(dataPro.condition.day_num)
    
            $('#market_name').val(dataPro.market_name);
            $('#market_status').val(dataPro.market_status);
            $('#start_time').val(getAppointTime(dataPro.condition.start_time));
            $('#end_time').val(getAppointTime(dataPro.condition.end_time));
            //显示最低消费金额
            $('#low_consumption').val(dataPro.condition.low_consumption);
            //显示赠送积分数
            $('#integral_num').val(dataPro.condition.integral_num);
          
            
            
            // $("input[type='radio']").removeAttr('checked')
            //如果是修改，判断是否是全部会员，如果不是，则显示传过来的时间，是显示默认时间
            // if (dataPro.condition.register_end != '') {
            //     $('#register_end_raido').click();
            //     $('#register_start').val(dataPro.condition.register_start)
            //     $('#register_end').val(dataPro.condition.register_end)
            //     register_time = '2';
            // } else {
            //     $("#register_start").val(getOffsetDateTime().start_day);
            //     $("#register_end").val(getOffsetDateTime().end_day);
            // };
            // if (dataPro.condition.age_end != '') {
            //     $('#age_end_radio').click();
            //     $('#age_start').val(dataPro.condition.age_start)
            //     $('#age_end').val(dataPro.condition.age_end)
            //     age_num = '2';
            // };
            // if (dataPro.condition.user_sex != '') {
            //     $('#user_sex').val(dataPro.condition.user_sex)
            // };
            // if (dataPro.condition.birthday_end != '') {
            //     $('#birthday_end_radio').click();
            //     $('#birthday_start').val(dataPro.condition.birthday_start)
            //     $('#birthday_end').val(dataPro.condition.birthday_end)
            //     birthday_time = '2'
            // };

            // $('#advance_day').val(dataPro.condition.advance_day);
           
        },

        // 绑定点击事件
        DishesAddBind: function() {
            var _self = this;
            // 点击取消
            $('#exitbtn').unbind('click').bind('click', function() {
                 // 跳转
                window.location.replace('consume.html');
            });
            $('#sub').unbind('click').bind('click', function() {
                _self.DishesAdd();
            });
         

            $('#updatebtn').unbind('click').bind('click', function() {
                _self.DishesUnde();
            });
            //  if ($('#all').is(':checked') || $('#all').attr('checked') == true) {
            //     payWay = 'all';
            // } else {
            //     // 找到列表中所有的checkbox，然后循环每个checkbox，
            //     $('#payWay div input[type="checkbox"]').each(function(i,val){
            //         // 判断不是（所有门店）才去判断是否选中，然后在拼字符串
            //         if (val.name != 'all') {
            //             // 如果当前循环的checkbox 被选中了
            //             if($(this).is(':checked')){
            //                 // 就把checkbox中的名字取出来，并用逗号拼接起来
            //                 payWay += val.value+',';
            //             }
            //         }
            //     });
            //     // 因为用逗号拼接起来，这个字符串最后会带一个逗号，所以用substring把除去最后一个逗号之外的字符取出来
            //     payWay = payWay.substring(0,payWay.length-1);
            // }
            // console.log($('#payWay div input[type="checkbox"]'))

            $('#payWay div input[type="checkbox"]').unbind('click').bind('click', function() {
               
                $('#payWay div input[type="checkbox"]').each(function(i,val){
                  
                    if (val.name != 'all') {
                      
                        // 如果当前循环的checkbox 被选中了
                        var notChecked = $("input:checkbox").not("input:checked") ;
                       
                        // if($(this).is(':checked')){
                        //     // 就把checkbox中的名字取出来，并用逗号拼接起来
                            
                        // }
                    }
                });
            });
            
            // $('#birthday_start_radio').unbind('click').bind('click', function() {
            //     birthday_time = '1';
            // });
            // $('#birthday_end_radio').unbind('click').bind('click', function() {
            //     birthday_time = '2';
            // });
            // $('#register_start_raido').unbind('click').bind('click', function() {
            //     register_time = '1';
            // });
            // $('#register_end_raido').unbind('click').bind('click', function() {
            //     register_time = '2';
            // });

            // $('#festival_start_radio').unbind('click').bind('click', function() {
            //     holiday_or = '1';
            //     holiday_time = '1';
            // });
            // $('#festival_end_radio').unbind('click').bind('click', function() {
            //     holiday_time = '2';
            // });

            // $('#age_start_radio').unbind('click').bind('click', function() {
            //     $('#age_start').val('')
            //     $('#age_end').val('')
            //     age_num = '1';
            // });
            // $('#age_end_radio').unbind('click').bind('click', function() {
            //     age_num = '2';
            // });

            // //点击自定义时间的时候选中前面的radio
            // $('#register_start').unbind('click').bind('click', function() {
            //     $('#register_end_raido').prop('checked', true);
            //     register_time = '2';
            // });
            // $('#register_end').unbind('click').bind('click', function() {
            //     $('#register_end_raido').prop('checked', true)
            //     register_time = '2';
            // });

            // $('#age_start').unbind('click').bind('click', function() {
            //     $('#age_end_radio').prop('checked', 'checked')
            //     age_num = '2';
            // });
            // $('#age_end').unbind('click').bind('click', function() {
            //     $('#age_end_radio').prop('checked', 'checked')
            //     age_num = '2';
            // });

            // $('#birthday_start').unbind('click').bind('click', function() {
            //     $('#birthday_end_radio').prop('checked', 'checked')
            //     birthday_time = '2';
            // });
            // $('#birthday_end').unbind('click').bind('click', function() {
            //     $('#birthday_end_radio').prop('checked', 'checked')
            //     birthday_time = '2';
            // });

            // $('#festival_time').unbind('click').bind('click', function() {
            //     $('#festival_end_radio').prop('checked', 'checked')
            //     holiday_time = '2';
            // });


        },
       
        // 请求支付方式
        payData: function () {
            var self = this;
            //alert(shopStatusList);
            setAjax(AdminUrl.payTypePayTypeList, {
                'pay_type_status': 0
            }, $('#prompt-message'), {20: ''}, function(respnoseText) {
                // 得到返回数据
                var data = respnoseText.data;

                self.shopList(data);
            }, 0);
        },

        // 显示支付方式
        shopList: function (data) {
            var  nums = '';
            if (addIsUp == '2') {
                nums = dataPro.condition.pay_type_id;
            }
            var num_class = '';

            var content = '<div class="clearfix">'+
                                '<label>'+
                                    // '<input id="checkall" class="radio"'+(shopIdPros == 'all' ? 'checked=checked' : '' )+' type="checkbox" value="all" name="checkall">'+
                                     '<input id="all" class="radio"'+(nums == 'all' ? 'checked=checked' : '' )+' type="checkbox" value="all" name="all" >'+
                                     // '<input name="all" id="all" '+(shopIdPros == 'all' ? 'checked=checked' : '' )+' type="checkbox" value="all">'+
                                     ' <span class="payType_span">全部</span>'+
                                '</label>';
            // num用来区分改隐藏的更多门店
            var num = 0;
            for (var i in data) {
                if(data[i].pay_type_id.indexOf('ctplatform') != -1){
                    continue;
                }
                if(data[i].receipts_integral == 0 && data[i].preferential_integral == 0){
                    continue;
                }
                num_class = '';
                if (addIsUp == '2') {

                    if (nums == 'all') {
                        num_class = 'checked';
                    } else {
                        nums = nums.toString().split(',');
                        for (var j=0;j<nums.length;j++) {
                            if (nums[j] == data[i].pay_type_id) {
                                num_class = 'checked';
                            }
                        }
                    }
                }
                 content += '<label>'+
                                '<input id="'+data[i].pay_type_id+'" class="radio radio_type" type="checkbox" value="'+data[i].pay_type_id+'" name="'+data[i].pay_type_id+'" '+num_class+'>'+
                                ' <span class="payType_span">'+data[i].pay_type_name+'</span>'+
                            '</label>';
                 num ++;
            }


            content += '</div>';
            // 添加到页面中
            $('#payWay').html(content);

            // 调用public.js中公共的方法（点击全选，选中所有的，点击其中某一个，如果这时候是全选就把全选取消）
            selectShopAll('#payWay', '#payWay label input[type="checkbox"]', $('#all'));
        },


        // 校验数据
        checkData: function() {
            //如果输入的有空格，删除空格
            $('#form ul input').each(function() {
                if ($(this).val() != '') {
                    if ($(this).attr('id') != 'menuPictt') {
                        $(this).val($(this).val().replace(/\s/g, ""));
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
            // var user_sex = $('#user_sex option:selected').val();
            // var advance_day = $('#advance_day').val();
            // var day_num = $('#day_num').val();
            var voucher_id = $('#voucher option:selected').val();
            var start_time = $('#start_time').val();
            var end_time = $('#end_time').val();
            // 适用门店
            var payWay = '';
            // 如果所有门店被选中，就传all，否则传选中的店铺组成的字符串
            if ($('#all').is(':checked') || $('#all').attr('checked') == true) {
                payWay = 'all';
            } else {
                // 找到列表中所有的checkbox，然后循环每个checkbox，
                $('#payWay div input[type="checkbox"]').each(function(i,val){
                    // 判断不是（所有门店）才去判断是否选中，然后在拼字符串
                    if (val.name != 'all') {
                        // 如果当前循环的checkbox 被选中了
                        if($(this).is(':checked')){
                            // 就把checkbox中的名字取出来，并用逗号拼接起来
                            payWay += val.value+',';
                        }
                    }
                });
                // 因为用逗号拼接起来，这个字符串最后会带一个逗号，所以用substring把除去最后一个逗号之外的字符取出来
                payWay = payWay.substring(0,payWay.length-1);
            }
            var low_consumption = $('#low_consumption').val();
            low_consumption = parseFloat(low_consumption).toFixed(2); //最小消费保留两位小数
            var integral_num = $('#integral_num').val();
            if(market_name==''){
                displayMsgTime(ndPromptMsg, '请输入方案名称！', 2000);
                    return false;
            }
            if(give_type == 1){
                if(voucher_id==''){
                    displayMsgTime(ndPromptMsg, '请选择抵用券', 2000);
                    return false;
                }
            }else if(give_type == 2){
                if(integral_num>0){

                }else{
                    displayMsgTime(ndPromptMsg, '积分数必须大于零', 2000);
                    return false;
                }
            }
          
            // if (type == '3') {
            //     var start_time = $('#start_time').val();
            //     var end_time = $('#end_time').val();
            // } else {
            //     var start_time = '';
            //     var end_time = '';
            // }
            // if (type == '2') {
            //     if (holiday_time == '1') {
            //         holiday = $('#festival option:selected').val();
            //     } else {
            //         holiday = $('#festival_time').val();
            //     }
            // };
            // if (type == '3' && day_num == '') {
            //     displayMsgTime(ndPromptMsg, '请输入沉默时间', 2000);
            //     return false
            // };
            // if (birthday_time == '1') {
            //     birthday_start = '';
            //     birthday_end = '';
            // } else {
            //     birthday_start = $('#birthday_start').val();
            //     birthday_end = $('#birthday_end').val();
            //     if (birthday_start > birthday_end) {
            //         displayMsgTime(ndPromptMsg, '生日开始日期应小于结束日期', 2000);
            //         return false
            //     }
            // };
            // if (register_time == '1') {
            //     register_start = '';
            //     register_end = '';
            // } else {
            //     register_start = $('#register_start').val();
            //     register_end = $('#register_end').val();
            //     if (register_start > register_end) {
            //         displayMsgTime(ndPromptMsg, '注册开始日期应小于结束日期', 2000);
            //         return false
            //     }

            // };

            //判断年龄
            // if (age_num == '1') {
            //     age_start = '';
            //     age_end = '';
            // } else {
            //     age_start = $('#age_start').val();
            //     age_end = $('#age_end').val();
            //     if (age_start == '') {
            //         displayMsgTime(ndPromptMsg, '请输入起始年龄', 2000);
            //         return false
            //     }
            //     if (age_end == '') {
            //         displayMsgTime(ndPromptMsg, '请输入结束年龄', 2000);
            //         return false
            //     }
            //     if (parseInt(age_end) < parseInt(age_start)) {
            //         displayMsgTime(ndPromptMsg, '起始年龄应该小于结束年龄', 2000);
            //         return false
            //     }
            // };

            setAjax(AdminUrl.member_marketAdd, {
                // 'type': type,
                'type': 6,
                'give_type': give_type,
                'market_name': market_name,
                'market_status': market_status,
                // 'user_sex': user_sex,
                // 'day_num': day_num,
                // 'birthday_start': birthday_start,
                // 'birthday_end': birthday_end,
                // 'register_start': register_start,
                // 'register_end': register_end,
                // 'age_start': age_start,
                // 'age_end': age_end,
                
                // 'advance_day': advance_day,
                // 'holiday': holiday,
                'voucher_id': voucher_id,
                'start_time': start_time,
                'end_time': end_time,
                'pay_type_id':payWay, //支付方式（全部：all，多个支付方式用逗号隔开）
                'low_consumption':low_consumption,//最低消费金额
                'integral_num':integral_num//赠送积分数
            }, $('#prompt-message'), { 20: '' }, function(respnoseText) {
                // 得到返回数据
                if (respnoseText.code == 20) {
                     window.location.replace('consume.html');
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
            // var day_num = $('#day_num').val();
            // var advance_day = $('#advance_day').val();
            var voucher_id = $('#voucher option:selected').val();
            // var market_id = dataPro.market_id;
            var start_time = $('#start_time').val();
            var end_time = $('#end_time').val();
            var integral_num = $('#integral_num').val();
            var low_consumption = $('#low_consumption').val();
            low_consumption = parseFloat(low_consumption).toFixed(2); //最小消费保留两位小数
            // 适用门店
            var payWay = '';
            // 如果所有门店被选中，就传all，否则传选中的店铺组成的字符串
            if ($('#all').is(':checked') || $('#all').attr('checked') == true) {
                payWay = 'all';
            } else {
                // 找到列表中所有的checkbox，然后循环每个checkbox，
                $('#payWay div input[type="checkbox"]').each(function(i,val){
                    // 判断不是（所有门店）才去判断是否选中，然后在拼字符串
                    if (val.name != 'all') {
                        // 如果当前循环的checkbox 被选中了
                        if($(this).is(':checked')){
                            // 就把checkbox中的名字取出来，并用逗号拼接起来
                            payWay += val.value+',';
                        }
                    }
                });
                // 因为用逗号拼接起来，这个字符串最后会带一个逗号，所以用substring把除去最后一个逗号之外的字符取出来
                payWay = payWay.substring(0,payWay.length-1);
            }

            if(market_name==''){
                displayMsgTime(ndPromptMsg, '请输入方案名称！', 2000);
                    return false;
            }
             if(give_type == 1){
                if(voucher_id==''){
                    displayMsgTime(ndPromptMsg, '请选择抵用券', 2000);
                    return false;
                }
            }else if(give_type == 2){
                if(integral_num>0){

                }else{
                    displayMsgTime(ndPromptMsg, '积分数必须大于零', 2000);
                    return false;
                }
            }
            
            // if (type == '3') {
            //     var start_time = $('#start_time').val();
            //     var end_time = $('#end_time').val();
            // } else {
            //     var start_time = '';
            //     var end_time = '';
            // }
            // if (type == '2') {
            //     if (holiday_time == '1' && holiday_or == '1') {
            //         holiday = $('#festival option:selected').val();
            //     } else {
            //         holiday = $('#festival_time').val();
            //     }
            // };
            // if (birthday_time == '1') {
            //     birthday_start = '';
            //     birthday_end = '';
            // } else {
            //     birthday_start = $('#birthday_start').val();
            //     birthday_end = $('#birthday_end').val();
            //     if (birthday_start > birthday_end) {
            //         displayMsgTime(ndPromptMsg, '生日开始日期应小于结束日期', 2000);
            //         return false
            //     }
            // };
            // if (register_time == '1') {
            //     register_start = '';
            //     register_end = '';
            // } else {
            //     register_start = $('#register_start').val();
            //     register_end = $('#register_end').val();
            //     if (register_start > register_end) {
            //         displayMsgTime(ndPromptMsg, '注册开始日期应小于结束日期', 2000);
            //         return false
            //     }

            // };
            // if (type == '3' && day_num == '') {
            //     displayMsgTime(ndPromptMsg, '请输入沉默时间', 2000);
            //     return false
            // };

            //判断年龄
            // if (age_num == '1') {
            //     age_start = '';
            //     age_end = '';
            // } else {
            //     age_start = $('#age_start').val();
            //     age_end = $('#age_end').val();
            //     if (age_start == '') {
            //         displayMsgTime(ndPromptMsg, '请输入起始年龄', 2000);
            //         return false
            //     }
            //     if (age_end == '') {
            //         displayMsgTime(ndPromptMsg, '请输入结束年龄', 2000);
            //         return false
            //     }
            //     if (parseInt(age_end) < parseInt(age_start)) {
            //         displayMsgTime(ndPromptMsg, '起始年龄应该小于结束年龄', 2000);
            //         return false
            //     }
            // };

            setAjax(AdminUrl.member_marketUpdate, {
                'type': 6,
                'give_type': give_type,
                'market_name': market_name,
                'market_status': market_status,
                // 'user_sex': user_sex,
                // 'day_num': day_num,
                // 'birthday_start': birthday_start,
                // 'birthday_end': birthday_end,
                // 'register_start': register_start,
                // 'register_end': register_end,
                // 'age_start': age_start,
                // 'age_end': age_end,
               
                // 'advance_day': advance_day,
                // 'holiday': holiday,
                'voucher_id': voucher_id,
                'market_id': market_id,
                'start_time': start_time,
                'end_time': end_time,
                'pay_type_id':payWay, //支付方式（全部：all，多个支付方式用逗号隔开）
                'low_consumption':low_consumption,//最低消费金额
                'integral_num':integral_num//赠送积分数
            }, $('#prompt-message'), { 20: '' }, function(respnoseText) {
                // 得到返回数据
                if (respnoseText.code == 20) {
                    Cache.del('nextData');
                    window.location.replace('consume.html');
                } else {
                    displayMsgTime(ndPromptMsg, respnoseText.message, 2000);
                }

            }, 0);
        }
    }
    DishesManageAdd.init();

});