
    var Inum = 0;
    // 是否跳转到储值卡售卖 0：不是，1：是
    var is_chu = 0;
    var ua = navigator.userAgent.toLowerCase(); //判断是否是ipad
    //alert($.cookie('luser'));
    // 如果没有cookie就调整到登陆页面并删除cookie，否则请求接口
    // if (ua.match(/iPad/i) == "ipad") {
        $('#leftList').addClass('borleft');
    // }
    if ($.cookie('a_user') != 1) { //$.cookie('a_user_id') == undefined && 

        // 指定域名 清除cookie
        $.removeCookie('a_login_time', { path: '/', domain: '.lekabao.net' });
        $.removeCookie('a_user_id', { path: '/', domain: '.lekabao.net' });
        $.removeCookie('a_user_mobile', { path: '/', domain: '.lekabao.net' });
        $.removeCookie('a_user_name', { path: '/', domain: '.lekabao.net' });
        $.cookie('return_2', 2, { path: '/html', domain: '.lekabao.net' });
        if ($.cookie('card_shell') == 1) {
            if (ua.match(/iPad/i) == "ipad") {
                window.top.location.href = 'http://cashier.lekabao.net/html/box_ipad.html?v=' + version + '&return=2';
            } else {
                window.top.location.href = 'http://cashier.lekabao.net/html/box.html?v=' + version + '&return=2';
            }
        } else {
            window.top.location.href = ajax_php_ress+'/html/index.html';
        }
    } else {
        $.cookie('return_2', 0, { path: '/html', domain: '.lekabao.net' });
        setAjax(AdminUrl.userMenu, {}, ndPromptMsg, { 20: '' }, function(respnoseText) {
            if (respnoseText.code == 20) {
                // 得到返回数据
                var data = respnoseText.data;
                //$("#leftList ul:first-child li:eq(1)").addClass("navLeftCheck");
                leftList(data);
                PreferentiaBind();
            }
        }, 0);
    }
    // 显示基本数据
    function leftList(data) {

        var content = '';
        var contentt = '';
        var perIsEdit = {};
        var peris_cookie = '';
        var num = 0;
        var num1 = 0;
        var cookie_t = '';
        var num_class = '';
        var num_1 = 0;
        var imgUrl = '';
        var is_symbol = '';
        for (var i in data) {
            Inum++
            if (i == '商户管理') {
                imgUrl = '../../img/base/information.png'
            } else if (i == '信息管理') {
                imgUrl = '../../img/base/orderReview.png'
            } else if (i == '数据统计' ) {
                imgUrl = '../../img/base/cleanerRecords.png'
            } else if (i == '门店信息') {
                imgUrl = '../../img/base/shopInformation.png'
            } else if (i == '会员管理') {
                imgUrl = '../../img/base/cardManage.png'
            } else if (i == '会员营销') {
                imgUrl = '../../img/base/memberByMarketing.png'
            } else if (i == '收银管理') {
                imgUrl = '../../img/base/storedAccountPay.png'
            } else if (i == '会员统计') {
                imgUrl = '../../img/base/memberStatBy.png'
            } else if (i == '会员账户') {
                imgUrl = '../../img/base/member.png'
            } else if (i == '统计信息') {
                imgUrl = '../../img/base/statistics.png'
            } 
            content += '<p class="left-line" data-type="top" '+(i != '会员账户' ? '' : 'data-pay="1"')+'><img src="' + imgUrl + '"><u>' + i + '</u><i class="down"></i></p>';
            content += '<ul class="uls hide">';
            // 外层循环显示左侧，内层循环显示权限
            for (var j in data[i]) {
                if (data[i][j].menu == '优惠方案统计') {
                    continue;
                }
                if (num_1 == 0) {
                    num_class = '';
                } else {
                    num_class = '';
                }
                if (data[i][j].url.indexOf('?') != -1) {
                    is_symbol = '&';
                } else {
                    is_symbol = '?';
                }
                //data[i].url.split("/")[3]可以这样取出相对路径的HTML，或者可以绝对路径的URL
                content += '<li class="left-zuosuojin' + num_class + '" data-type="buttom">' +
                    '<a href="'+ ajax_php_ress + data[i][j].url +is_symbol+ 'v=' + version + '" target="main">' + data[i][j].menu + '</a>' +
                    '</li>';
                // 获取可使用的权限
                for (var k in data[i][j].admin) {
                    // 将可使用的权限放到数组中
                    perIsEdit[data[i][j].admin[k].menu] = data[i][j].admin[k].url;

                    peris_cookie += k+',';
                    //num ++;
                    //alert(data[i].admin[j].menu);
                    //return;
                    cookie_t += data[i][j].admin[k].menu + ',';
                }

                num = num + 1;
                if (data[i][j].menu == '账户支付') {
                    num1 = num;
                    cookie_t += data[i][j].menu + ',';
                }
            }
            num_1++;
            num = num + 1;
            content += '</ul>';
        }
        // 如果想看到数组中的值，就进行转换，但是转换之后无法使用perIsEdit['']通过键获取值
        // var b = JSON.stringify(perIsEdit);
        // 如果不转换，则可以通过键获取值perIsEdit['菜品添加修改']
        //alert(perIsEdit['dd']);

        // 存到cookie里面因为Java壳子里面用不了缓存
        $.cookie('perIs_cookie', peris_cookie, {path:'/html',domain:'.lekabao.net'});

        $('#leftList').html(content);

        //添加左侧默认样式
        if (cookie_t.indexOf('账户支付') != -1 && $.cookie('is_login') == 1) { //($.cookie('is_shop') == 1 || 
            $("#leftList li:eq(" + (num1-1) + ")").addClass("navLeftCheck");
        } else {
            $("#leftList .uls:first-child li:eq(1)").addClass("navLeftCheck");
        }
        $.cookie('cookie_t', cookie_t);

        $('#leftList').each(function() {
            var self = this;
            $(this).find('p').unbind('click').bind('click', function() {
                var clas = $(this).children('i').attr('class');
                if (clas == 'down') {
                    $(this).children('i').attr('class', 'up');
                    $(this).siblings('p').children('i').attr('class', 'down');
                    $(this).next('ul').removeClass('hide');
                    $(this).next('ul').children('li:eq(0)').children('a').click();
                    $(this).next('ul').siblings('ul').addClass('hide');
                    var url = $(this).next('ul').children('li:eq(0)').children('a').attr('href');
                    $('#mainFrame').attr('src', url);
                    parent.main.location.href = url;

                    // 没有实体卡开关权限，就删除不显示实体卡功能
                    if ($(this).find('u').text() == '会员管理' && $.cookie('is_entity_card') == 0) {
                        $('#leftList').find('a').each(function () {
                            if ($(this).text() == '实体卡发放') {
                                $(this).parent().remove();
                            }
                        });
                    }
                } else {
                    $(this).children('i').attr('class', 'down');
                    $(this).next('ul').addClass('hide');
                };

            });
        });
        //判断页面的高度，修改UL的高度
        var winHei = $(window).height();
        /*var ulHei = $(window).height() - Inum * 50;
        $('.uls').css('height', ulHei);*/
        $('.left').css('height', winHei);
        //第一个UL显示出来，
        $('.uls:eq(0)').removeClass('hide');
        if (cookie_t.indexOf('账户支付') != -1 && $.cookie('is_login') == 1) {

        } else {
            $('.uls:eq(0)').children('li:eq(0)').addClass('navLeftCheck');
        }
        $('.uls:eq(0)').prev('p').children('i').addClass('up');

        // 将各个权限放到里面,然后在各个页面通过键值对的方式判断如果存在就显示，不存在就不显示
        Cache.set('perIsEdit', perIsEdit);
    };

    // 壳子跳转过来
    function jump_pay_stored() {
        var self = $('#leftList').find('p[data-pay="1"]');
        self.children('i').attr('class', 'up');
        self.siblings('p').children('i').attr('class', 'down');
        self.next('ul').removeClass('hide');
        self.next('ul').children('li:eq(4)').children('a').click();
        self.next('ul').siblings('ul').addClass('hide');
    }

    //点击绑定事件
    function PreferentiaBind() {
        //点击左侧li 添加样式
        $('#leftList .uls li a').unbind('click').bind('click', function() {
            $(this).parent().addClass("navLeftCheck").siblings().removeClass("navLeftCheck") && $(this).parent().parent().siblings().children().removeClass("navLeftCheck");
            $.removeCookie('shopListcookie');
            $.removeCookie('typeTy1')
            $.removeCookie('typeTy2')
            $.removeCookie('typeTy3')
            $.removeCookie('typeTy4')
            // $.removeCookie(str)
        });
    }
