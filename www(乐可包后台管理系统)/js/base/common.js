var ndPromptMsg = $('#prompt-message'),                       // 页面提示条
    ndAlertProMsg = $('#alert-prompt-message');               // 弹出框提示条

$(function () {

    // 退出系统
    $('#exit-system').click(function () {

        var ua = navigator.userAgent.toLowerCase();  //判断是否是ipad
        /*$('#alert-content').html('你确定要退出用户管理系统吗？');
        displayAlertMessage('#alert-message', '#cancel-alert');

        $('#definite-alert').click(function () {
            setAjax(AdminUrl.logoutUrl, null, ndAlertProMsg, function (respnoseText) {
                layer.close(layerBox);
                displayMsg(ndPromptMsg, '服务器请求中...请稍候...', 30000);
                window.location.replace(AdminUrl.indexUrl);
            });
        });*/

        // 删除从收银跳转过来存储的cookie
        $.removeCookie('is_login');
        $.removeCookie('pay_id');

        setAjax(AdminUrl.userLogout, {}, ndPromptMsg, {205104: ''}, function (respnoseText) {
            if (respnoseText.code == 205104) {
                // 删除无用cookie
                $.removeCookie('real_login');

                //layer.close(layerBox);
                $.removeCookie('a_user', {path: '/'});
                $.cookie('return_2', 2, {path:'/html',domain:'.lekabao.net'});
                //displayMsg(ndPromptMsg, '服务器请求中...请稍候...', 3000);
                if ($.cookie('card_shell') == 1) {
                    if(ua.match(/iPad/i)=="ipad") {
                        window.top.location.href = 'http://cashier.lekabao.net/html/box_ipad.html?v='+version+'&return=2';
                    } else {
                        window.top.location.href = 'http://cashier.lekabao.net/html/box.html?v='+version+'&return=2';
                    }
                    
                } else {
                    window.top.location.href = ajax_php_ress+'/html/index.html?v='+version;
                }
            } else {
                displayMsg(ndPromptMsg, respnoseText.message, 3000);
            }
        }, 0);
    });

    switch (getQueryString('r')) {
        case 'Admin/Info': $('#admin-info').addClass('current'); break;
        case 'Article/Show': $('#article').addClass('current'); break;
        case 'UArticle/Show': $('#uarticle').addClass('current'); break;
        case 'Article/AddShow': $('#article-add').addClass('current'); break;
        case 'Comment/ShowArticleComment': $('#article-comment').addClass('current'); break;
        case 'Admin/Index': $('#discount-manage').addClass('current'); break;
        case 'User/Show': $('#user-account').addClass('current'); break;
        case 'Comment/ShowUserComment': $('#user-comment').addClass('current'); break;
        case 'List/ConsumeShow': $('#consume-show').addClass('current'); break;
        case 'List/OrderShow': $('#order-show').addClass('current'); break;
        case 'List/UserShow': $('#user-show').addClass('current'); break;
        case 'List/CardShow': $('#payrecord-show').addClass('current'); break;
        case 'List/SumCardShow': $('#recharge-show').addClass('current'); break;
        case 'Comment/Show': $('#comment-show').addClass('current'); break;
        case 'List/ConsumeSumShow': $('#consumesum-show').addClass('current'); break;
        //case 'Lunch/show': $('#Lunchdate-show').addClass('current'); break;   上传销售数据页面下线
    }

});