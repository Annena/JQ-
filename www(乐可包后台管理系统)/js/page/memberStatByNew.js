$(function () {

	// 会员统计 新增会员


		var OrderReview = {

			init: function () {
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

		        setAjax(AdminUrl.member_by_new, { 
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
				$('#gfemalec').html(data.new_count.count);// 新增会员
				$('#gtotalc').html(total);// 全部会员

				// 百分比变量
				var _1_ratio = '';

				// 比率
				if(total != 0) {
					_1_ratio = parseFloat(parseFloat(accMul(accDiv(data.new_count.count, total), 100)).toFixed(4))+'%';// 新增会员
				} else {
					_1_ratio = '0%';// 新增会员
				}

				// 新增会员占比率
				$('#gfemalep').html(_1_ratio);// 新增会员占比
				$('#gtotalp').html('100%');// 全部会员占比

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
				        text: '新增会员占比率',
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
				        data: ['新增会员','全部会员']
				    },
				    series : [
				        {
				            name: '访问来源',
				            type: 'pie',
				            radius: '55%',
				            color: ['#c90122','#2f727a'],
				            data:[
				                {value:data_re.new_count.count, name:'新增会员'},
				                {value:data_re.all_user_count.count, name:'全部会员'}
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
