$(function() {
    var self = this;
    var shop_id = sessionStorage.getItem("shop_id");
    var shop_name = sessionStorage.getItem('shop_name');
    var user_id = sessionStorage.getItem("user_id");
    var user_name = sessionStorage.getItem('user_name');

    $('#shopName').text(shop_name);
    $('#userName').text(user_name);

    // 绑定点击事件
    merchantBindClick();
    selectMember();

    function merchantBindClick() {
        $('#openPromo').unbind('click').bind('click', function() {
            window.location.replace('promotion.html?returnd=3&v='+version);
        });
        $('#shopName').unbind('click').bind('click', function() {
            window.location.replace('promotionUser.html?v='+version);
        });

    }


    // 显示数据
    function selectMember() {

        var statDate = sessionStorage.getItem("statDate");
        var endDate = sessionStorage.getItem("endDate");

        if (shop_id == null) {
            shop_id = '';
        }
        if (user_id == null) {
            user_id = '';
        }
        // 加载数据之前先清空数据
        setAjax(AdminUrl.promotionMenu, {
            'start_date': statDate,
            'end_date': endDate,
            'shop_id': shop_id,
            'a_user_id': user_id
        }, ndPromptMsg, { 20: '' }, function(respnoseText) {
            var data = respnoseText.data;
            if (respnoseText.code == '20') {
                memberList(data);
            } else {
                displayMsg(ndPromptMsg, respnoseText.message, 2000);
            }
        }, 2);
    }

    // 显示列表数据
    function memberList(data) {
        //产品销售明细
        var ctContent = '';
        var allCt = '';
        var content = '';
        allCt = data['1'].ct;
        delete data['1'].ct;

        ctContent += '<tr class="haderTr">' +
                '<th>产品名称</th>' +
                '<th>产品销量</th>' +
                '<th>提成金额</th>' +
                '<th>产品提成</th>' +
            '</tr>' +
            '<tr class="haderBr shallow haderBru" id="">' +
                '<td class="leftTd">' + allCt.sale_name + '</td>' +
                '<td id="">' + allCt.sale_num + '</td>' +
                '<td id="">' + (allCt.sale_commission == '' || allCt.sale_commission == null ? 0 : parseFloat(allCt.sale_commission)) + '</td>' +
                '<td id="">' + parseFloat(allCt.sale_money) + '</td>' +
            '</tr>';
        for (var i in data['1']) {
            content += '<tr class="haderBr shallow" id="">' +
                '<td class="leftTd">' + data['1'][i].sale_name + '</td>' +
                '<td id="">' + data['1'][i].sale_num + '</td>' +
                '<td id="">' + (data['1'][i].sale_commission == '' || data['1'][i].sale_commission == null ? 0 : parseFloat(data['1'][i].sale_commission)) + '</td>' +
                '<td id="">' + parseFloat(data['1'][i].sale_money) + '</td>' +
                '</tr>';

        }
        $('#tableOne').html(ctContent + content);
            //储值卡明细
        var storedCtContent = '';
        var storedallCt = '';
        var storedContent = '';
        storedallCt = data['2'].ct;
        delete data['2'].ct;
        storedCtContent += '<tr class="haderTr">' +
            '<th>储值名称</th>' +
            '<th>储值销量</th>' +
            '<th>提成金额</th>' +
            '<th>储值提成</th>' +
            '</tr>' +
            '<tr class="haderBr shallow haderBru" id="">' +
            '<td class="leftTd">' + storedallCt.sale_name + '</td>' +
            '<td>' + parseFloat(storedallCt.sale_num) + '</td>' +
            '<td>' + (storedallCt.sale_commission == '' || storedallCt.sale_commission == null ? 0 : parseFloat(storedallCt.sale_commission)) + '</td>' +
            '<td>' + parseFloat(storedallCt.sale_money) + '</td>' +
            '</tr>';
        for (var i in data['2']) {
            storedContent += '<tr class="haderBr shallow" id="">' +
                '<td class="leftTd">' + data['2'][i].sale_name + '</td>' +
                '<td>' + parseFloat(data['2'][i].sale_num) + '</td>' +
                '<td>' + (data['2'][i].sale_commission == '' || data['2'][i].sale_commission == null ? 0 : parseFloat(data['2'][i].sale_commission)) + '</td>' +
                '<td>' + parseFloat(data['2'][i].sale_money) + '</td>' +
                '</tr>';
        }
        $('#tableTwo').html(storedCtContent + storedContent);
    }
});