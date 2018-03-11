$(function () {

	// 会员统计 授权会员


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

		        setAjax(AdminUrl.member_by_authorization, { 
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
			//数据处理
			dataProcess: function (data) {

			},
			renderTable: function (data) {
				var total = data.all_user_count.count;

				// 人数
				$('#gfemalec').html(data.authority_count.count);// 已授权
				$('#gmalec').html(data.unauthority_count);// 未授权
				$('#gtotalc').html(total);// 合计

				// 百分比变量
				var _1_ratio = '',_2_ratio = '';

				// 比率
				if(total != 0) {
					_1_ratio = parseFloat(parseFloat(accMul(accDiv(data.authority_count.count, total), 100)).toFixed(4))+'%';// 已授权
					_2_ratio = parseFloat(parseFloat(accMul(accDiv(data.unauthority_count, total), 100)).toFixed(4))+'%';// 未授权
				} else {
					_1_ratio = '0%';// 已授权
					_2_ratio = '0%';// 未授权
				}

				// 授权会员占比率
				$('#gfemalep').html(_1_ratio);// 已授权占比
				$('#gmalep').html(_2_ratio);// 未授权占比
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
				        text: '授权会员占比率',
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
				        data: ['已授权','未授权']
				    },
				    series : [
				        {
				            name: '访问来源',
				            type: 'pie',
				            radius: '55%',
				            color: ['#c90122','#2f727a'],
				            data:[
				                {value:data_re.authority_count.count, name:'已授权'},
				                {value:data_re.unauthority_count, name:'未授权'}
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
