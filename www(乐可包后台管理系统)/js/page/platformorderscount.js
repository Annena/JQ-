$(function() {
    var page = getQueryString('page');
    var self = this;
    // 总合计
    var totalContent = '';


    $("#startDate").val(getOffsetDateTime().start_day);
    $("#endDate").val(getOffsetDateTime().end_day);

    // 绑定点击事件
    merchantBindClick();

    function merchantBindClick() {
        // 点击查询
        $('#selectbtn').unbind('click').bind('click', function() {
            selectMember();
        });
    }
    // 显示数据
    function selectMember() {

        var startDate = $('#startDate').val();
        var endDate = $('#endDate').val();

        var dataPro = {
            'start_date': startDate,
            'end_date': endDate
        }

        if (startDate > endDate) {
            displayMsg(ndPromptMsg, '开始时间应小于结束时间!', 2000);
            return;
        }
        // 加载数据之前先清空数据
        $('#tbodys').html('');
        setAjax(AdminUrl.takeawayCount, dataPro, $('#prompt-message'), { 20: '' }, function(respnoseText) {
            var data = respnoseText.data;
            if (respnoseText.code == '20') {
                $('#nav0-content').removeClass('hide');             
                $('#default-null-page').addClass('hide');
                memberList(data);
            } else if(respnoseText.code == '205146') {
                // displayMsg(ndPromptMsg, respnoseText.message, 2000);
                $('#nav0-content').addClass('hide');             
                $('#default-null-page').removeClass('hide');
            } else {
                displayMsg(ndPromptMsg, respnoseText.message, 2000);
            }
        }, 0);
    }

    // 显示列表数据
    function memberList(data) {
        totalContent = '';
        taotalData = data.ct;

        // 总合计数据
        var allCt = data.ct; //读取并删除全部合计
        var allTakeOutCount = accAdd(accAdd(accAdd(parseFloat(allCt.meituan), parseFloat(allCt.baidu)), parseFloat(allCt.eleme)), parseFloat(allCt.takeout));
        var allTakeOutRate = (allCt.all == 0 ? 0 :((accDiv(parseFloat(allTakeOutCount),parseFloat(allCt.all)))*100).toFixed(0));
        
        delete data.ct;
        totalContent += '<tr>' +
                            '<td data-type="total" class="text_decoration">小计</td>' +
                            '<td>' + allCt.meituan + '</td>' +   //  合计 美团包单数
                            '<td>' + allCt.baidu + '</td>' +     //  合计 百度包单数
                            '<td>' + allCt.eleme+ '</td>' +      //  合计 饿了么包单数
                            '<td>' + allCt.takeout + '</td>' +   //  合计 乐卡包单数    takeout
                            '<td>' + allTakeOutCount + '</td>' + //  合计 外卖单数    m+b+e+takeout
                            '<td>' + allCt.all + '</td>' +       //  合计 店铺单数    all
                            '<td>' + allTakeOutRate + '%</td>' + //  合计 外卖占比      (m+b+e+takeout)/all *100
                        '</tr>';
        for (var i in data) {
            var eachTakeOutCount = accAdd(accAdd(accAdd(parseFloat(data[i].meituan), parseFloat(data[i].baidu)), parseFloat(data[i].eleme)), parseFloat(data[i].takeout));
            var eachTakeOutRate = (data[i].all == 0 ? 0 : ((accDiv(parseFloat(eachTakeOutCount),parseFloat(data[i].all)))*100).toFixed(0));
            totalContent += '<tr>' +
                                '<td data-type="total" class="text_decoration">'+data[i].shop_name+'</td>' +
                                '<td>' + data[i].meituan + '</td>' +     //  合计 美团包单数
                                '<td>' + data[i].baidu + '</td>' +     //  合计 百度包单数
                                '<td>' + data[i].eleme+ '</td>' +      //  合计 饿了么包单数
                                '<td>' + data[i].takeout + '</td>' +   //  合计 乐卡包单数    takeout
                                '<td>' + eachTakeOutCount + '</td>' + //  合计 外卖单数    m+b+e+takeout
                                '<td>' + data[i].all + '</td>' +       //  合计 店铺单数    all
                                '<td>' + eachTakeOutRate + '%</td>' + //  合计 外卖占比     (m+b+e+takeout)/all *100
                            '</tr>';
        }

        $('#tbodys').html(totalContent);

    }
});