$(function () {

	// 会员统计 储值会员


		var OrderReview = {

			init: function () {
				// console.log($('.stafffloat').outHeight())
	            $("#start-date").val(getOffsetDateTime().start_day);
	            $("#end-date").val(getOffsetDateTime().end_day);

				// 绑定点击事件
				this.OrderReviewBind();
				this.getData();
			},

			// 绑定点击事件
			OrderReviewBind: function () {
				var _self = this;

				// 点击搜索
				$('#selectbtn').unbind('click').bind('click', function () {
					// 检测搜索的项
					_self.getData();
				});
			},
			// 获取数据
			getData: function () {
				var _self = this;

				var	startDate = $("#start-date").val(); // 开始日期   
		        var	endDate = $("#end-date").val();     // 结束日期

		        setAjax(AdminUrl.member_by_store, { 
					'start_date': startDate,
		            'end_date': endDate
		        }, $('#prompt-message'), {20: ''}, function(respnoseText) {
		            if (respnoseText.code == 20) {
		                // 得到返回数据
		                if (respnoseText.data.all_user_count.count == 0) {
		                	$('#tables,#charts_wrap').addClass('hide');
		                	displayMsg(ndPromptMsg, '没有查询到数据！', 2000);
		                } else {
		                	$('#tables,#charts_wrap').removeClass('hide');
		                	_self.renderTable(respnoseText.data);
		            	}
		            } else {
		            	$('#tables,#charts_wrap').addClass('hide');
		                displayMsg(ndPromptMsg, respnoseText.message, 2000);
		            }
		        }, 0);
			},

			renderTable: function (data) {
				var total = data.all_user_count.count;

				// 人数
				$('#gfemalec').html(data.no_stored_amount_count);// 未储值
				$('#gmalec').html(data.stored_consume_count.count);// 储值无金额
				$('#gotherc').html(data.have_stored_amount_count.count);// 储值有金额
				$('#gtotalc').html(total);// 合计

				// 百分比变量
				var _1_ratio = '',_2_ratio = '',_3_ratio = '';

				// 比率
				if(total != 0) {
					_1_ratio = parseFloat(parseFloat(accMul(accDiv(data.no_stored_amount_count, total), 100)).toFixed(4))+'%';// 未储值
					_2_ratio = parseFloat(parseFloat(accMul(accDiv(data.stored_consume_count.count, total), 100)).toFixed(4))+'%';// 储值无金额
					_3_ratio = parseFloat(parseFloat(accMul(accDiv(data.have_stored_amount_count.count, total), 100)).toFixed(4))+'%';// 储值有金额
				} else {
					_1_ratio = '0%';// 未储值
					_2_ratio = '0%';// 储值无金额
					_3_ratio = '0%';// 储值有金额
				}

				// 储值会员占比率
				$('#gfemalep').html(_1_ratio);// 未储值占比
				$('#gmalep').html(_2_ratio);// 储值无金额占比
				$('#gotherp').html(_3_ratio);// 储值有金额占比
				$('#gtotalp').html('100%');// 合计占比


                // 加载图表
                this.renderChart(data);
			},
			// 渲染图表
			renderChart: function (data_re) {
				// console.log('初始化echarts实例');
				// 基于准备好的dom，初始化echarts实例
		        var myChart = echarts.init(document.getElementById('charts'));
				option = {
					// center: ['50%', '60%'],
					title: {
				        text: '储值会员占比率',
				        left: 'center',
				        top: 5,
				        textStyle: {
				            color: '#333'
				        }
				    },
				    legend: {
				        type: 'plain',
				        orient: 'vertical',
				        left: 15,
				        top: 30,
				        // bottom: 20,
				        data: ['未储值','储值有金额','储值无金额']
				    },
				    series : [
				        {
				            name: '访问来源',
				            type: 'pie',
				            radius: '55%',
				            color: ['#c90122','#2f727a','#f9ce2e'],
				            data:[
				                {value:data_re.no_stored_amount_count, name:'未储值'},
				                {value:data_re.have_stored_amount_count.count, name:'储值有金额'},
				                {value:data_re.stored_consume_count.count, name:'储值无金额'}
				            ]
				        }
				    ]
				};

		        // 使用刚指定的配置项和数据显示图表。
		        myChart.setOption(option);
			}
		};

		OrderReview.init();

});
