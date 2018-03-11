$(function () {

    // 登录之后的页面，选择商户
    var is_login = getQueryString('login');// 从登录过来的
    // 多商户数据
    var brandData = {};

    // 显示基本数据
    ChooseShopList();
    // 绑定点击事件
    merchantBindClick();


    // 显示基本数据
    function ChooseShopList () {
        // 用来区分壳子上，到这个中间页面之后可以调用登录
        if ($.cookie('card_shell') == 1) {
            // 如果是壳子不显示退出登录按钮
            $('#admin_header').addClass('hide');
        } else {
            $('#admin_header').removeClass('hide');
        }
        // 从cookie中取出用户真实姓名和手机号
        var aUserName = $.cookie("a_user_name");
        var aUserMobile = $.cookie("a_user_mobile");
        
        // 真实姓名 decodeURIComponent() 对编码后的 URI 进行解码
        $('#userName').text(aUserName == undefined ? '' : decodeURIComponent(aUserName));
        // 手机号
        //$('#userMobile').text(aUserMobile == undefined ? '' : decodeURIComponent(aUserMobile));
        
        // 商户列表接口
        merchant_ajax();
    }

    // 商户列表接口
    function merchant_ajax () {
        //如果是登录进来的login=1的时候则不走请求，直接拿login返回来的缓存，
        if (is_login != '1') {
            setAjax(AdminUrl.brandList, {}, $('#prompt-message'), {20: ''}, function(respnoseText) {
                if (respnoseText.code == 20) {
                    brandData = respnoseText.data;
                    // 显示商户列表
                    merchant_list(brandData);
                } else {
                    displayMsg(ndPromptMsg, respnoseText.message, 2000);
                }
            }, 0);
        }
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

    // 绑定点击事件
    function merchantBindClick () {
        // 点击商户
        $('#allContent').delegate('li', 'click', function() {
            var id = $(this).attr('data-id');
            var card_id = $(this).attr('card_id');
            // 从多商户数据中获取具体商户数据
            var data = brandData.brand_list[id].card_list[card_id];

            if (card_id != '' && card_id != undefined) {
                $.cookie('company_name_en', data.company_name_en);
                //储存商户名
                $.cookie('cardName', data.card_name, {path:'/html',domain:'.lekabao.net'});
                //储存card_id
                // $.cookie('card_id', card_id, {path:'/html',domain:'.lekabao.net'});
                //储存time_offset
                $.cookie('time_offset', data.time_offset);
                //判断，如果是登陆进来的，走login,二次登陆，
                if (is_login != '1') {
                    // 先请求切换商户，再跳转选择店铺页面
                    user_brand_ajax(card_id);
                } else {
                    // 先请求登录，再跳转选择店铺页面，因为这时候没有真实登录
                    loginFc(card_id);
                }
            }
        });


        $('#exit').html('<a href="../html/loginEdit.html" "target="main">修改密码</a>');
        $('#userName').click(function(){
            $('#exit').toggle();
        });
        $('#downopen').click(function(){
            $('#exit').toggle();
        });
    }

    // 先请求切换商户，再跳转选择店铺页面
    function user_brand_ajax(card_id) {
        setAjax(AdminUrl.user_brand, {
            'card_id': card_id
        }, ndPromptMsg, {20: ''}, function (respnoseText) {
            if (respnoseText.code == 20) {
                // 跳转到了选择店铺
                window.location.replace('index-select.html?v='+Math.random()+'');
            } else {
                displayMsg(ndPromptMsg, respnoseText.message, 2000);
            }
        }, 0);
    }

    // 请求登录接口确认真实登录
    function loginFc(card_id) {
        // 获取用户名，密码cookie
        var real_login = $.cookie('real_login');

        setAjax(AdminUrl.userLogin, {
            'a_user_mobile': real_login.split('-')[0],
            'a_user_pass': real_login.split('-')[1],
            'card_id': card_id
        }, ndPromptMsg, {205102: ''}, function (respnoseText) {
            if (respnoseText.code == 205102) {// 单商户
                // 删除无用cookie
                $.removeCookie('real_login');

                // 跳转到了选择店铺
                window.location.replace('index-select.html?v='+Math.random()+'');
            } else {
                displayMsg(ndPromptMsg, respnoseText.message, 2000);
            }
        }, 0);
    }
});
