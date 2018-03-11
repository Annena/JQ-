
        // 登录页面login
        var ndAlertProMsg = $('#alert-prompt-message'),      // 页面弹出框提示条
            ndPromptMsg = $('#prompt-message'),              // 页面提示条
            ndUsername = $('#username'),                     // 用户名
            ndPassword = $('#password');                     // 密码
            code = null;                                     // 验证码变量
        var loginUser = $.cookie('loginUser');

        var ua = navigator.userAgent.toLowerCase(); 
        if(loginUser != '' && loginUser != undefined){
            $('#username').val(loginUser)
        } else {
            if (ua.match(/iPad/i)=="ipad" && localStorage["keptUser"] != '' && localStorage["keptUser"] != undefined) {
                $('#username').val(localStorage["keptUser"])
            }
        }
        if ($.cookie('card_shell') == 1) {
            $.cookie('return_2_2', 1, { path: '/html', domain: '.lekabao.net' });
        }
        if(ua.match(/iPad/i) == "ipad") {
            $.cookie('windowWidth', $(window).width(), {expires: 365 });
            $.cookie('windowHeight', $(window).height(), {expires: 365 });
        }
        // 调整登录页面图片高度
        $('.pat_bg').height($(window).height());

        $.removeCookie('cardName', { path: '/html', domain: '.lekabao.net' });
       
        // 在壳子里才显示
        if ($.cookie('card_shell') == 1) {
            bind_key();
            // box显示登录按钮
            $('#exit_btn').addClass('hide');
            $('#submit-btn').removeClass('login_box');
            // $('#minimize,#close_t').removeClass('hide');
        } else {
            // 显示退出系统和登录按钮
            $('#exit_btn').removeClass('hide');
            $('#submit-btn').addClass('login_box');
            // $('#minimize,#close_t').addClass('hide');
        }

        // “最小化”按钮点击事件
        $('#minimize').unbind('click').bind('click',function(){
            lkb.miniWin();
        });
        
        /*if(/msie [6]\./i.test(navigator.userAgent)){
            alert(6)
        } else if(/msie [7]\./i.test(navigator.userAgent)){
            alert(7)
        } else if(/msie [8]\./i.test(navigator.userAgent) || navigator.appVersion .split(";")[1].replace(/[ ]/g,"")=="MSIE8.0"){
            alert(8)
        } else if(/msie [9]\./i.test(navigator.userAgent) || navigator.appVersion .split(";")[1].replace(/[ ]/g,"")=="MSIE9.0"){
            alert(9)
        } else if(/msie [10]\./i.test(navigator.userAgent) || navigator.appVersion .split(";")[1].replace(/[ ]/g,"")=="MSIE10.0"){
            alert(10)
        } else if(/msie [11]\./i.test(navigator.userAgent) || navigator.appVersion .split(";")[1].replace(/[ ]/g,"")=="MSIE11.0"){
            alert(11)
        } else {
            alert(3333)
        }*/




        if (getQueryString('is_login') == 1) {
          //alert(5555555555)
            $.cookie('is_login', 1);
            $.cookie('pay_id', getQueryString('pay_id'));
        }
            
            // 绑定点击事件
            loginBind();
            // 显示验证码
            //loginCode();
            var CID = $.cookie('cid');
            if (CID == undefined) {
                getCidList();
            }

            // 是否ie8，针对ie8兼容
            if(navigator.appName == "Microsoft Internet Explorer" && (navigator.appVersion .split(";")[1].replace(/[ ]/g,"")=="MSIE8.0" || navigator.appVersion .split(";")[1].replace(/[ ]/g,"")=="MSIE9.0" || navigator.appVersion .split(";")[1].replace(/[ ]/g,"")=="MSIE10.0" || !!window.ActiveXObject || "ActiveXObject" in window || navigator.userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1)) {
                
                $('#password').hide();
                $('#password_text').show();
                $('#passwordPro').hide();
                ndPassword = $('#password');


                $('#username').focus(function() {
                    var input = $(this);
                    if (input.val() == input.attr('placeholder')) {
                        input.val('');
                        input.removeClass('placeholder');
                    }
                }).blur(function() {
                    var input = $(this);
                    if (input.val() == '' || input.val() == input.attr('placeholder')) {
                        input.addClass('placeholder');
                        input.val(input.attr('placeholder'));
                    }
                }).blur();


                $("#password").blur(function(){  
                    if($(this).val()==""){  
                        //$(this).val("请输入您的密码");  
                          
                        if($(this).attr("type") == "password"){  
                            $(this).hide();  
                            $('#password_text').show();  
                            $('#password_text').val("请输入您的密码");  
                          
                        }else{  
                             var pass = $('#password_text').val();  
                             if(pass.length<1){  
                              $(this).hide();  
                               $('#password_text').show();  
                             }  
                        }  
                    }  
                });  
                $("#password_text").focus(function(){  
                     if($(this).val()=="请输入您的密码"){  
                        //alert('ddd');
                          $(this).val("");  
                           if($(this).attr("type")=="text"){  
                             $(this).hide();  
                             $('#password').show();  
                             $('#password').val("");  
                             $('#password').focus();//加上  
                           }else{  
                             var pass = $('#password').val();  
                             if(pass.length<1){  
                              $(this).hide();  
                               $('#password_text').show();  
                             }  
                           }  
                     }  
                });

            } else {
                $('#password').hide();
                $('#password_text').hide();
                $('#passwordPro').show();
                ndPassword = $('#passwordPro');
            }


            // 获取cid，并请求接口获取商户信息
            function getCidList () {
                setAjax(AdminUrl.userCid, '', ndPromptMsg, {20: ''}, function (respnoseText) {
                    if (respnoseText.code == 20) {
                        CID = respnoseText.data;
                        $.cookie('cid', CID);
                    } else {
                        displayMsg(ndPromptMsg, respnoseText.message, 2000);
                    }
                }, 0);
            }
            // 显示商户基本信息到登录页面
            function getLoginList () {
                setAjax(AdminUrl.userInfo, {}, ndPromptMsg,{20: ''}, function (respnoseText) {
                    if (respnoseText.code == 20) {
                        // 将获取到的商户数据填充到页面
                        $('#cardName').text(respnoseText.data.card_name);
                        $.cookie('cardName', respnoseText.data.card_name, {path:'/html',domain:'.lekabao.net'});
                        // 营业周期偏移秒数
                        $.cookie('time_offset', respnoseText.data.time_offset);
                    } else {
                        displayMsg(ndPromptMsg, respnoseText.message, 2000);
                    }
                }, 0);
            }

            // // 显示商户基本信息到登录页面
            // function getLoginList () {
            //     setAjax(AdminUrl.userInfo, {}, ndPromptMsg,{20: ''}, function (respnoseText) {
            //         if (respnoseText.code == 20) {
            //             // 将获取到的商户数据填充到页面
            //             $('#cardName').text(respnoseText.data.card_name);
            //             $.cookie('cardName', respnoseText.data.card_name);
            //             // 营业周期偏移秒数
            //             $.cookie('time_offset', respnoseText.data.time_offset);
            //         } else {
            //             displayMsg(ndPromptMsg, respnoseText.message, 2000);
            //         }
            //     }, 0);
            // }

            // 绑定点击事件
            function loginBind () {
                // 提交登陆数据
                $('#submit-btn').click(function () {
                    if ($.cookie('card_shell') == 1) {
                        loginSso(ndUsername.val(), ndPassword.val());
                    } else {
                        loginSubmit(ndUsername.val(), ndPassword.val());
                    }
                });
                // // 点击键盘上回车键
                // $(window).keydown(function (event) {
                //     if (event.keyCode == 13) {
                //         loginSubmit();
                //     }
                // });
                // 回车键触发菜品助记码搜索 或者 触发划菜按钮
                if(/msie [6789]\./i.test(navigator.userAgent) || !!window.ActiveXObject || "ActiveXObject" in window || navigator.userAgent.indexOf('Trident') > -1 && navigator.userAgent.indexOf("rv:11.0") > -1){
                    $("body").keydown(function(e){
                        var ev = window.event || e;
                        var code = ev.keyCode || ev.which;
                        if(code == 13 || code == 35){
                            if ($.cookie('card_shell') == 1) {
                                loginSso(ndUsername.val(), ndPassword.val());
                            } else {
                                loginSubmit(ndUsername.val(), ndPassword.val());
                            }
                        }
                    });
                } else {
                    // 点击键盘上回车键
                    $(window).keydown(function (event) {
                        if(event.keyCode == 13 || event.keyCode == 35){
                            if ($.cookie('card_shell') == 1) {
                                loginSso(ndUsername.val(), ndPassword.val());
                            } else {
                                loginSubmit(ndUsername.val(), ndPassword.val());
                            }
                        }

                    });
                }

                /*// 用户点击看不清楚刷新验证码
                $('#Cantsee').click(function () {
                    loginCode();
                });

                // 点击验证码的时候
                $('#checkCode').click(function () {
                    loginCode();
                });*/
            }

            // 获取验证码
            /*function loginCode () {
                $('#checkCode').val('');
                // 获取到生成的验证码的值
                code = alphaNumCode();
                // 将获取到的验证码显示到页面,填充进文本框
                $('#checkCode').val(code);
            }*/

            // 请求登录
            function loginSubmit (user_name, user_pass, card_id) {
                //alert(ndUsername.val()+'---'+ndPassword.val());
                if (user_name == '' || user_pass == '') {
                    displayMsg(ndPromptMsg, '用户名或者密码不能为空', 2000);
                    return;
                }

                /*// 获取到用户输入的验证码
                var inputCode = $("#checkcode").val().toUpperCase();
                // 获取到生成的验证码
                var codeToUp = code.toUpperCase();

                if(inputCode.length <=0) {
                    displayMsg(ndPromptMsg, '验证码不能为空', 2000);
                    return;
                } else if(inputCode != codeToUp ){
                    displayMsg(ndPromptMsg, '验证码输入错误', 2000);
                    // 重新获取验证码
                    loginCode();
                    return;
                }*/
                /* else {
                    displayMsg(ndPromptMsg, '验证码正确', 2000);
                }*/

               /* // 刷新二维码
                loginCode();*/
        
                // 请求登录接口
                setAjax(AdminUrl.userLogin, {
                    'a_user_mobile': user_name,
                    'a_user_pass': user_pass,
                    'card_id': card_id
                }, ndPromptMsg, {205102: ''}, function (respnoseText) {
                    if (respnoseText.code == 205102) {// 单商户
                        if(ua.match(/iPad/i)=="ipad") {
                          localStorage["keptUser"] = user_name;
                        }
                        $.cookie('loginUser', user_name, {expires: 365 });
                        ndUsername.val('');
                        ndPassword.val('');
                        $.cookie('a_user', 1, {path: '/'});

                        // $.cookie('card_id', respnoseText.data.card_id, {path:'/html',domain:'.lekabao.net'});
                        $.cookie('cardName', respnoseText.data.card_name, {path:'/html',domain:'.lekabao.net'});
                        // 营业周期偏移秒数
                        $.cookie('time_offset', respnoseText.data.time_offset);

                        if (card_id == undefined) {
                            // 区分是单商户还是多商户
                            $.cookie('many_merchant', 0);
                        }

                        // 跳转到了后台首页
                        window.location.replace('index-select.html?v='+Math.random()+'');
                    } else if (respnoseText.code == 205144) {// 多商户
                        $.cookie('a_user', 1, {path: '/'});
                        // 区分是单商户还是多商户
                        $.cookie('many_merchant', 1);
                        
                        // 显示选择商户页面
                        chooseMerchantPage(respnoseText.data, user_name, user_pass);
                        // window.location.replace('chooseMerchant.html?login=1&v='+Math.random()+'');
                    } else {
                        displayMsg(ndPromptMsg, respnoseText.message, 2000);
                    }
                }, 0);
            }

            // 显示选择商户
            function chooseMerchantPage (data, user_name, user_pass) {
                // 显示选择商户，隐藏登录
                $('#login_display').addClass('hide');
                $('#many_display').removeClass('hide');
                $('body').css('background', 'none');

                // 点击退出按钮，隐藏选择商户，显示登录
                $('#exitBtn').unbind('click').bind('click', function () {
                    $('#login_display').removeClass('hide');
                    $('#many_display').addClass('hide');
                    $('body').css('background', '#ffe6cc');
                });
                
                var aUserName = $.cookie("a_user_name");
                // 真实姓名 decodeURIComponent() 对编码后的 URI 进行解码
                $('#userName').text(aUserName == undefined ? '' : decodeURIComponent(aUserName));


                // 显示选择商户数据
                merchant_list(data);

                // 点击商户
                $('#allContent').delegate('li', 'click', function() {
                    var id = $(this).attr('data-id');
                    var card_id = $(this).attr('card_id');
                    // 从多商户数据中获取具体商户数据
                    var data_t = data.brand_list[id].card_list[card_id];

                    if (card_id != '' && card_id != undefined) {
                        $.cookie('company_name_en', data_t.company_name_en);
                        // 先请求登录，再跳转选择店铺页面，因为这时候没有真实登录
                        loginSubmit(user_name, user_pass, card_id);
                    }
                });
            }
            // 显示商户列表
            function merchant_list(data) {
                $('#allContent').html('');
                //品牌名
                //card_list = 品牌下面的商户名
                var brand = '';
                for (var i in data.brand_list) {
                    var card_list = '';
                    for (var k in data.brand_list[i].card_list) {
                        /*card_list += '<li is_validate =' + data.brand_list[i].card_list[k].is_validate + '  time_offset=' + data.brand_list[i].card_list[k].time_offset + ' card_id=' + data.brand_list[i].card_list[k].card_id + ' card_name=' + data.brand_list[i].card_list[k].card_name + ' otherCompany_name_en=' + data.brand_list[i].card_list[k].company_name_en + '><span>' + data.brand_list[i].card_list[k].card_name + '' + (data.brand_list[i].card_list[k].is_validate == true ? '' : '<u>(未认证)</u>') + '<i></i></span></li>';*/

                        card_list += '<li class="shopbor" data-id="'+i+'" card_id="'+k+'">'+
                                        '<div class="shoplogo_2">'+
                                            '<img src="../img/business/'+k+'/logo.jpg?'+Math.random()+'+">'+
                                        '</div>'+
                                        '<div class="shoplogo-txt">'+data.brand_list[i].card_list[k].card_name + '' + (data.brand_list[i].card_list[k].is_validate == true ? '' : '<u>(未认证)</u>')+'</div>'+
                                      '</li>';
                    }
                    /*brand += '<ul>' +
                        '<li>' + data.brand_list[i].brand_name + '</li>' + card_list +
                        '</ul>';*/
                    brand += card_list;
                }

                $('#allContent').html(brand);
            }

            // 壳子请求的登录
            function loginSso (user_name, user_pass) {
                // 请求登录接口
                setAjax(AdminUrl.userSso, {
                    'a_user_mobile': user_name,
                    'a_user_pass': user_pass,
                    'shop_id': $.cookie('shop_id')
                }, ndPromptMsg, {205102: ''}, function (respnoseText) {
                    if (respnoseText.code == 205102) {// 单商户
                        if(ua.match(/iPad/i)=="ipad") {
                          localStorage["keptUser"] = user_name;
                        }
                        $.cookie('loginUser', user_name, {expires: 365 });
                        ndUsername.val('');
                        ndPassword.val('');
                        $.cookie('a_user', 1, {path: '/'});

                        // 在壳子里才执行
                        if ($.cookie('card_shell') == 1) {
                            // 反馈给box
                            window.parent.feedback_call(2, 1);
                        }

                        // $.cookie('card_id', respnoseText.data.card_id, {path:'/html',domain:'.lekabao.net'});
                        $.cookie('cardName', respnoseText.data.card_name, {path:'/html',domain:'.lekabao.net'});
                        // 营业周期偏移秒数
                        $.cookie('time_offset', respnoseText.data.time_offset);

                        // 区分是单商户还是多商户
                        $.cookie('many_merchant', 0);

                        $.cookie('jump_link', 2, {path:'/html',domain:'.lekabao.net'});
                        $.cookie('is_shop', 1);
                        $.cookie('return_2_2', 1, { path: '/html', domain: '.lekabao.net' });
                        $.cookie('admin_select', 0, { path: '/html', domain: '.lekabao.net' });
                        // 这个时候说明只要一个店铺，则直接跳转请求获取左侧列表接口
                        window.location.replace('./shop/index.html?v='+version+'');
                    } else if (respnoseText.code == 205144) {// 多商户
                        $.cookie('a_user', 1, {path: '/'});
                        // 在壳子里才执行
                        if ($.cookie('card_shell') == 1) {
                            // 反馈给box
                            window.parent.feedback_call(2, 1);
                        }
                        // 区分是单商户还是多商户
                        $.cookie('many_merchant', 1);
                        // 先请求登录，再跳转选择店铺页面，因为这时候没有真实登录
                        loginSubmit(user_name, user_pass, $.cookie('card_id'));
                    } else {
                        // 在壳子里才执行
                        if ($.cookie('card_shell') == 1) {
                            // 反馈给box
                            window.parent.feedback_call(2, 0);
                        }
                        displayMsg(ndPromptMsg, respnoseText.message, 2000);
                    }
                }, 0);
            }

            // 壳子请求的登录接口报错，点击了后台，隐藏最小化和关闭系统还有背景颜色调整为灰色
            function admin_error() {
                $('#minimize,#close_t,.inline').addClass('hide');
                $('body').css('background', '#f2f2f0');
            }


