$(function () {

	// 会员统计 折扣会员


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

		        setAjax(AdminUrl.member_by_discount, {
					'start_date': startDate,
					'end_date': endDate
				}, $('#prompt-message'), {20: ''}, function(respnoseText) {
		            if (respnoseText.code == 20) {
		                // 得到返回数据
		                if (respnoseText.data.all_user_count.count == 0 || respnoseText.data.discount_count == '') {
		                	$('#memberStat,#charts_wrap').addClass('hide');
		                	if (respnoseText.data.all_user_count.count == 0) {
		                		displayMsg(ndPromptMsg, '没有查询到数据！', 2000);
		                	} else {
		                		displayMsg(ndPromptMsg, '当前日期区间没有折扣会员！', 2000);
		                	}
		                } else {
		                	$('#memberStat,#charts_wrap').removeClass('hide');
		                	_self.renderTable(respnoseText.data);
		            	}
		            } else {
		            	$('#memberStat,#charts_wrap').addClass('hide');
		                displayMsg(ndPromptMsg, respnoseText.message, 2000);
		            }
		        }, 0);
			},
			renderTable: function (data) {
				var co_thead = '';
				var co_tent_1 = '';
				var co_tent_2 = '';
				var co_main = '';

				var total = data.all_user_count.count;
				var discount_count = data.discount_count;

				for (var i in discount_count) {
					co_thead += '<th>'+discount_count[i].discount_rate+(discount_count[i].discount_rate == '100' ? '%' : '折')+'</th>';
					co_tent_1 += '<td>'+discount_count[i].count+'</td>';
					co_tent_2 += '<td>'+parseFloat(parseFloat(accMul(accDiv(discount_count[i].count, total), 100)).toFixed(4))+'%</td>';
				}

				co_main = '<thead>'+
			                    '<tr>'+
			                        '<th>名称</th>'+
			                        co_thead+
			                        '<th>合计</th>'+
			                    '</tr>'+
			                '</thead>'+
			                '<tbody>'+
			                    '<tr>'+
			                        '<td class="tdbg">人数</td>'+
			                        co_tent_1+
			                        '<td id="gtotalc">'+total+'</td>'+
			                    '</tr>'+
			                    '<tr>'+
			                        '<td class="tdbg">折扣会员占比率</td>'+
			                        co_tent_2+
			                        '<td id="gtotalp">100%</td>'+
			                    '</tr>'+
			                '</tbody>';

				$('#memberStat').html(co_main);

				if (co_thead == '') {
					$('#charts_wrap').addClass('hide');
				} else {
					$('#charts_wrap').removeClass('hide');
					// 加载图表
					this.renderChart(data.discount_count);
				}
			},
			// 渲染图表
			renderChart: function (data_re) {
				// console.log('初始化echarts实例');
				// 基于准备好的dom，初始化echarts实例
		        var myGenderChart = echarts.init(document.getElementById('charts'));

		        var legend_array = new Array();
				var series_array = new Array();
				var series_array_2 = {};
		        var num = 0;

		        for (var i in data_re) {
		        	series_array_2 = {};
		        	legend_array[num] = data_re[i].discount_rate+(data_re[i].discount_rate == '100' ? '%' : '折');
		        	series_array_2['value'] = data_re[i].count;
		        	series_array_2['name'] = data_re[i].discount_rate+(data_re[i].discount_rate == '100' ? '%' : '折');
		        	series_array[num] = series_array_2;
		        	num++;
		        }


				option = {
					// center: ['50%', '60%'],
					title: {
				        text: '折扣会员占比',
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
				        data: legend_array
				    },
				    series : [
				        {
				            name: '访问来源',
				            type: 'pie',
				            radius: '55%',
				            color: ['#c90122','#2f727a','#e47b31','#b4c341','#f9ce2e','#ccc'],
				            data:series_array
				        }
				    ]
				};

		        // 使用刚指定的配置项和数据显示图表。
		        myGenderChart.setOption(option);
			}
		};

		OrderReview.init();

});
