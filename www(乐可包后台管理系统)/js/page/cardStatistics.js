$(function () {
	var menuStatus = 1; //当前选中的标签data-type的值 0:退单 1:退菜 2:退款
	var menuType = 1; //1，会员储值类型；2，实体卡储值类型
	var $cardTypeContent = $('#cardTypeContent_1 .tbodys');//jQ初始对象存储对应的内容DIV
	// 储值卡售卖记录 cardStatistics 

    /*$("#end-date").val(getLocalDate());*/
    $("#start-date").val(getOffsetDateTime().start_day);
    $("#end-date").val(getOffsetDateTime().start_day);
    
    // 绑定点击事件
    CashierBind();
		
		
	//添加切换事件
	$("#cardType_1,#cardType_2,#cardType_3,#cardType_4").click(function(){
		
		$(".caipin-fenleicheck").removeClass("caipin-fenleicheck").addClass("caipin-fenleinucheck");
		menuStatus = $(this).removeClass("caipin-fenleinucheck").addClass("caipin-fenleicheck").attr("data-type");
		menuStatus = parseInt(menuStatus);
		menuType = $(this).attr("type");
        menuType = parseInt(menuType);
		
		//显示内容
		$(".stores-content").addClass("hide");
		
		switch(menuStatus)
		{	// 定义菜品状态参数 0:退单 1:退菜 2:退款
			case 1:
				if(menuType==1){
					var $theContent = $("#cardTypeContent_1");
					$theContent.removeClass("hide");
					$cardTypeContent = $theContent.find(".tbodys");
				}else{
					var $theContent =  $("#cardTypeContent_4");
					$theContent.removeClass("hide");
					$cardTypeContent = $theContent.find(".tbodys");
				
				}
				
				//alert(menuStatus);
				//DishesData(0);
			break;
			case 2:
				var $theContent = $("#cardTypeContent_2");
				$theContent.removeClass("hide");
				$cardTypeContent = $theContent.find(".tbodys");
				
				//alert(menuStatus);
				//DishesData(1);
			break;
			case 3:
				var $theContent =  $("#cardTypeContent_3");
				$theContent.removeClass("hide");
				$cardTypeContent = $theContent.find(".tbodys");
				
				//alert(menuStatus);
				//DishesData(2);
			break;
		}
	});
		
	// 绑定点击事件
    function CashierBind () {
        // 点击搜索
        $('#selectbtn').unbind('click').bind('click', function () {
            var selectType = menuStatus;//获取当前类型标签
			var storedType = menuType;//获取当前储值类型
			//此处有可能页面进入后默认显示某日搜索，顾用变量$cardTypeContent，未纯参数传递
			selectCashier(selectType,$cardTypeContent,storedType);
        });
        
    }

    // 搜索发卡日期
    function selectCashier (selectType,$theContent,storedType) { // (类型，指向应显示的内容jQ，储值类型)
    	var startDate = $("#start-date").val();
        var endDate = $("#end-date").val();
		// 搜索显示数据之前先清空数据
		
        $theContent.html('');
        // 日期
        
       // setAjax("../../php/test_unqingji3.php", {//测试用
		setAjax(AdminUrl.sellRecord, {
           'start_date': startDate,
            'end_date': endDate,
            'type': selectType,//传输类型
            'stored_type':storedType //储值类型
		}, $('#prompt-message'), {20: ''}, function(respnoseText) {
            
			//判断是字符还是json如果是json则解析
			if(typeof respnoseText == "string"){
				respnoseText = JSON.parse(respnoseText);
			}
			
			if (respnoseText.code == 20) {
                
				// 得到返回数据
                var data = respnoseText.data;
                CashierList(data,$theContent,storedType);
            } else {
                displayMsg(ndPromptMsg, respnoseText.message, 2000);
            }
        }, 0);
    }

    // 显示数据
    function CashierList (data,$theContent,storedType) {
    	
            var content = '';
            var contMain = '';
            
			var totalStoredMoney = 0,   // 合计储值金额
				totalGiveMoney = 0,     // 合计赠送金额
				totalCards = 0,			// 合计卡数
				totalCash = 0,			// 现金
				totalCard = 0,			// 银行卡
				totalFree = 0,			// 免单
				wxpay_shop = 0,			// 银台微信
				alipay_shop = 0,		// 银台支付宝
				wxpay = 0;				// 微信支付
				alipay = 0;				// 支付宝支付
           

			// 储值状态
			var stored_stat = '';


            for (var i in data) {

					if (data[i].d_user_id != undefined && data[i].d_user_id != null && data[i].d_user_id != '') {
						stored_stat = '已作废<br/>'+ data[i].d_user_name;
					} else if (data[i].user_id != undefined && data[i].user_id != null && data[i].user_id != '') {
						stored_stat = '已储值<br/>'+ data[i].user_mobile;
					} else if (data[i].entity_id != undefined && data[i].entity_id != null && data[i].entity_id != '') {
						stored_stat = '已储值<br/>'+ data[i].entity_no;
					} else {
						stored_stat = '正常售卖<br/>未储值';
					}

					//console.log(data);
					content +=  '<tr class="total-tr">'+
									'<td class="total-tel" data-type="addTime">'+getAppointTimeSec(data[i].add_time)+'</td>'+//时间
									(storedType == 2 ?
                                    '<td class="total-tel" data-type="storedMoney">'+data[i].entity_no+'</td>':'')+  //录入卡号

									'<td class="total-addr" data-type="storedName">'+data[i].stored_name+'</td>'+	// 储值名称

									'<td class="total-addr" data-type="storedName">'+stored_stat+'</td>'+			// 储值状态

									'<td class="total-tel" data-type="storedMoney">'+data[i].stored_money+'</td>'+	// 储值金额
									'<td class="total-tel" data-type="giveMoney">'+data[i].give_money+'</td>'+		// 赠送金额
									'<td class="total-tel" data-type="cash">'+parseFloat(data[i].cash).toFixed(2)+'</td>'+	// 现金
									'<td class="total-tel" data-type="card">'+parseFloat(data[i].card).toFixed(2)+'</td>'+	// 银行卡
									'<td class="total-tel" data-type="free">'+parseFloat(data[i].free).toFixed(2)+'</td>'+	// 免单
									'<td class="total-tel">'+(data[i].wxpay_shop == null ? '0' : parseFloat(data[i].wxpay_shop).toFixed(2))+'</td>'+	// 银台微信
									'<td class="total-tel">'+(data[i].alipay_shop == null ? '0' : parseFloat(data[i].alipay_shop).toFixed(2))+'</td>'+	// 银台支付宝
									'<td class="total-tel">'+parseFloat(data[i].wxpay).toFixed(2)+'</td>'+// 微信支付
									'<td class="total-tel">'+parseFloat(data[i].alipay).toFixed(2)+'</td>'+// 支付宝支付
									'<td class="total-tel">'+data[i].s_user_name+'</td>'+// 售卖员工
									'<td class="total-tel">'+data[i].a_user_name+'</td>'+// 收银员工

									'<td class="hide" data-type="type">'+data[i].type+'</td>'+							//状态  1 售卖  2已使用   3作废
									'<td class="hide" data-type="recordId">'+data[i].record_id+'</td>'+        //记录ID
									'<td class="hide" data-type="aUserName">'+data[i].a_user_name+'</td>'+	//操作人
									'<td class="hide" data-type="storedMoney">'+data[i].stored_money+'</td>'+	//储值金额
									'<td class="hide" data-type="giveMoney">'+data[i].type+'</td>'+		//反赠金额
								'</tr>';

                totalStoredMoney += parseFloat(data[i].stored_money);// 合计储值金额
                totalGiveMoney += parseFloat(data[i].give_money);// 合计赠送金额
				totalCash += parseFloat(data[i].cash);			// 现金
				totalCard += parseFloat(data[i].card);			// 银行卡
				totalFree += parseFloat(data[i].free);			// 免单
				wxpay_shop += (data[i].wxpay_shop == null ? 0 : parseFloat(data[i].wxpay_shop));			// 银台微信
				alipay_shop += (data[i].alipay_shop == null ? 0 : parseFloat(data[i].alipay_shop));			// 银台支付宝
                totalCards ++; // 合计实收金额
                wxpay += parseFloat(data[i].wxpay);
                alipay += parseFloat(data[i].alipay);
            }

            // 合计
            contMain +=  '<tr class="total-trheji">'+
                            '<td class="total-addr">合计'+totalCards.toFixed(0)+'张</td>'+
                            '<td>——</td>'+
                            '<td>——</td>'+
                            (storedType == 2 ?
                            '<td>——</td>':'')+
                            '<td class="total-addr">'+totalStoredMoney.toFixed(2)+'</td>'+
                            '<td class="total-addr">'+totalGiveMoney.toFixed(2)+'</td>'+
                            '<td class="total-addr">'+totalCash.toFixed(2)+'</td>'+
                            '<td class="total-addr">'+totalCard.toFixed(2)+'</td>'+
                            '<td class="total-addr">'+totalFree.toFixed(2)+'</td>'+
                            '<td class="total-addr">'+wxpay_shop.toFixed(2)+'</td>'+
                            '<td class="total-addr">'+alipay_shop.toFixed(2)+'</td>'+
                            '<td class="total-addr">'+wxpay.toFixed(2)+'</td>'+
                            '<td class="total-addr">'+alipay.toFixed(2)+'</td>'+
                            '<td>——</td>'+
                            '<td>——</td>'+
                        '</tr>'+content;



            // 添加到页面中
            $theContent.html(contMain);
    }
});
