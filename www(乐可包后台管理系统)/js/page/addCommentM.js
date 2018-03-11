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
    var    voucher_id
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
                // // 注册时间
                // $("#register_start").val(getOffsetDateTime().start_day);
                // $("#register_end").val(getOffsetDateTime().end_day);
                //沉默发放时间
                $("#start_time").val(getOffsetDateTime().start_day);
                $("#end_time").val(getOffsetDateTime().end_day);

            }
            // 判断是抵用券添加页面还是积分添加页面
            if(give_type==1){
                $('#contentSel,#contentRule').removeClass('hide');
                $('#giveIntegral,#ContRule').addClass('hide');
                $('#giveIntegralInp').val('');
            }else if(give_type==2){
                $('#contentSel,#contentRule').addClass('hide');
                $('#giveIntegral,#ContRule').removeClass('hide');
                $('#contentSel').val('');
                $('#contentRule').val('');
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
            //修改返回数据点评内容有限制
            if(dataPro.condition.content_len!=0){
                $('#font_2').click();
                $('#content_len').val(dataPro.condition.content_len)
            }

            //修改返回数据点评图片有限制 
            if(dataPro.condition.picture_num!=0){
                $('#picture_2').click();
                $('#picture_num').val(dataPro.condition.picture_num)
            }
            //修改返回抵用券规则
            // var aaa = dataPro.condition.give_rule
            // console.log(+aaa)
            // $("input[name='rule'][value='+aaa']").attr("checked",true);  

             // $("input[name='rule'][value='aaa']").attr("checked",true);  
             // 判断是抵用券添加页面还是积分添加页面
            if(give_type==1){
                    //修改返回抵用券规则
                 if(dataPro.condition.give_rule==1){
                    $('#rule_1').click();
                 }else if(dataPro.condition.give_rule==2){
                    $('#rule_2').click();
                 }else{
                    $('#rule_3').click();
                 }
             }else if(give_type==2){
                    //修改返回抵用券规则
                 if(dataPro.condition.give_rule==1){
                    $('#rule_11').click();
                 }else if(dataPro.condition.give_rule==2){
                    $('#rule_12').click();
                 }else{
                    $('#rule_13').click();
                 }
             }
            
             //显示赠送积分数
             $('#giveIntegralInp').val(dataPro.condition.integral_num)
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
                window.location.replace('comment.html');
            });
            $('#sub').unbind('click').bind('click', function() {
                _self.DishesAdd();
            });
            $('#updatebtn').unbind('click').bind('click', function() {
                _self.DishesUnde();
            });
            $('')
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
            // var user_sex = $('#user_sex option:selected').val();
            // var advance_day = $('#advance_day').val();
            // var day_num = $('#day_num').val();
            var voucher_id = $('#voucher option:selected').val();
            var start_time = $('#start_time').val();
            var end_time = $('#end_time').val();
            var integral_num = $('#giveIntegralInp').val();
            var revContent = $('#revContent input[name="font"]:checked ').val();
            var revPicture = $('#revPicture input[name="picture"]:checked ').val();
            var contentRule = ''
            // 判断是抵用券添加页面还是积分添加页面
            if(give_type==1){
                contentRule = $('#contentRule input[name="rule"]:checked ').val();
            }else if(give_type==2){
                contentRule = $('#ContRule input[name="rule2"]:checked ').val();
            }
            
            var content_len = '';//点评内容的最小长度
            var picture_num='';//上传照片的张数
            if(revContent==0){
                $('#content_len').val('');
                content_len = 0;
            }else{
                if($('#content_len').val()==''){
                    displayMsgTime(ndPromptMsg, '请输入点评内容字数限制', 2000);
                    return false
                }
                content_len = $('#content_len').val();
            };
            //上传照片的张数,为0不受限
            if(revPicture==0){
                $('#picture_num').val('');
                picture_num = 0;
            }else{
                if( $('#picture_num').val()==''){
                    displayMsgTime(ndPromptMsg, '请输入点评图片张数限制', 2000);
                    return false
                }else{
                    picture_num = $('#picture_num').val();
                }
            };
            
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

            //give_type = 1，voucher_id不能为空;give_type = 2，integral_num必须大于0
            if(market_name==''){
                displayMsgTime(ndPromptMsg, '请输入方案名称！', 2000);
                    return false
            }

            if(give_type == 1){
                if(voucher_id==''){
                    displayMsgTime(ndPromptMsg, '请选择抵用券', 2000);
                    return false
                }
            }else if(give_type == 2){
                if(integral_num>0){

                }else{
                    displayMsgTime(ndPromptMsg, '积分数必须大于零', 2000);
                    return false
                }
            }
            
            setAjax(AdminUrl.member_marketAdd, {
                // 'type': type,
                'type': 4,
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
                'content_len': content_len,
                'picture_num': picture_num,
                'give_rule': contentRule,//发放抵用券规则
                'integral_num': integral_num //发放积分数
            }, $('#prompt-message'), { 20: '' }, function(respnoseText) {
                // 得到返回数据
                if (respnoseText.code == 20) {
                    window.location.replace('comment.html');
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
            var integral_num = $('#giveIntegralInp').val();
            var voucher_id = $('#voucher option:selected').val();
            // var market_id = dataPro.market_id;
            var start_time = $('#start_time').val();
            var end_time = $('#end_time').val();
            var revContent = $('#revContent input[name="font"]:checked ').val();
            var revPicture = $('#revPicture input[name="picture"]:checked ').val();
             var contentRule = ''
            // 判断是抵用券添加页面还是积分添加页面
            if(give_type==1){
                contentRule = $('#contentRule input[name="rule"]:checked ').val();
            }else if(give_type==2){
                contentRule = $('#ContRule input[name="rule2"]:checked ').val();
            }
            var content_len = '';//点评内容的最小长度
            var picture_num=1;//上传照片的张数
            if(revContent==0){
                $('#content_len').val('');
                content_len = 0;
            }else{
                if($('#content_len').val()==''){
                    displayMsgTime(ndPromptMsg, '请输入点评内容字数限制', 2000);
                    return false
                }
                content_len = $('#content_len').val();
            };
            //上传照片的张数,为0不受限
            if(revPicture==0){
                $('#picture_num').val('');
                picture_num = 0;
            }else{
                if( $('#picture_num').val()==''){
                    displayMsgTime(ndPromptMsg, '请输入点评图片张数限制', 2000);
                    return false
                }else{
                    picture_num = $('#picture_num').val();
                }
            };
            if(market_name==''){
                displayMsgTime(ndPromptMsg, '请输入方案名称！', 2000);
                    return false
            }
            if(give_type == 1){
                if(voucher_id==''){
                    displayMsgTime(ndPromptMsg, '请选择抵用券', 2000);
                    return false
                }
            }else if(give_type == 2){
                if(integral_num>0){

                }else{
                    displayMsgTime(ndPromptMsg, '积分数必须大于零', 2000);
                    return false
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
                'type': 4,
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
                'voucher_id': voucher_id,
                // 'advance_day': advance_day,
                // 'holiday': holiday,
                'market_id': market_id,
                'start_time': start_time,
                'end_time': end_time,
                'content_len': content_len,
                'picture_num': picture_num,
                'give_rule': contentRule,//发放抵用券规则
                'integral_num': integral_num //发放积分数
            }, $('#prompt-message'), { 20: '' }, function(respnoseText) {
                // 得到返回数据
                if (respnoseText.code == 20) {
                    Cache.del('nextData');
                    window.location.replace('comment.html');
                } else {
                    displayMsgTime(ndPromptMsg, respnoseText.message, 2000);
                }

            }, 0);
        }
    }
    DishesManageAdd.init();

});
