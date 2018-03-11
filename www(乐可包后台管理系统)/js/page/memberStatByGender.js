$(function () {

	// 会员统计 按性别年龄


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
					// displayMsg($('#prompt-message'), '您查询的记录为空！', 2000);

					// 检测搜索的项
					// _self.checkCondition();
					_self.getData();
				});
			},
			// 获取数据
			getData: function () {
				// 先清空
				// .html('');
				var _self = this;
		        var startDate = $("#start-date").val(); // 开始日期   
		        var endDate = $("#end-date").val();     // 结束日期

		        setAjax(AdminUrl.member_by_gender, { 
					'start_date': startDate,
		            'end_date': endDate
		        }, $('#prompt-message'), {20: ''}, function(respnoseText) {
		            if (respnoseText.code == 20) {
		                // 得到返回数据
		                // displayMsg(ndPromptMsg, respnoseText.message, 2000);
		                // console.log(respnoseText.data);
		                if (respnoseText.data.all_user_count.count == 0) {
		                	$('#gender_table,#count_table,#charts_wrap').addClass('hide');
		                	displayMsg(ndPromptMsg, '没有查询到数据！', 2000);
		                } else {
		                	$('#gender_table,#count_table,#charts_wrap').removeClass('hide');
		                	_self.renderTable(respnoseText.data);
		            	}
		            } else {
		            	$('#gender_table,#count_table,#charts_wrap').addClass('hide');
		                displayMsg(ndPromptMsg, respnoseText.message, 2000);
		            }
		        }, 0);
			},
			//数据处理
			dataProcess: function (data) {

			},

			renderTable: function (data) {
				var genderArr = [];
				var ageArr = [];
				var total = data.all_user_count.count;
				var ageList = data.age_list;
				var sexList = data.sex_list;

				// 百分比变量
				var sex_1_ratio = '',sex_2_ratio = '',sex_3_ratio = '',
					age_1_ratio = '',age_2_ratio = '',age_3_ratio = '',age_4_ratio = '';

				// 性别渲染
				$('#gfemalec').html(sexList.sex_1.count);// 女性
				$('#gmalec').html(sexList.sex_2.count);// 男性
				$('#gotherc').html(sexList.sex_3.count);// 其他
				$('#gtotalc').html(total);// 合计

                // 年龄渲染
                $('#alt20c').html(ageList.age_1.count);// 小于20岁
                $('#agt20c').html(ageList.age_2.count);// 20-30
                $('#agt30c').html(ageList.age_3.count);// 30-40
                $('#agt40c').html(ageList.age_4.count);// 40以上
                // 合计
                var totalNumber = parseInt(ageList.age_1.count)+parseInt(ageList.age_2.count)+parseInt(ageList.age_3.count)+parseInt(ageList.age_4.count);
                // 无生日
                var notNumber = parseInt(total)-parseInt(totalNumber);
                $('#age-not').html(notNumber);
                $('#atotalc').html(totalNumber);
                $('#age-all').html(total);// 全部
				// 性别比率
				if(total != 0) {
                    sex_1_ratio = parseFloat(parseFloat(accMul(accDiv(sexList.sex_1.count, total), 100)).toFixed(4))+'%';// 女性比率
                    sex_2_ratio = parseFloat(parseFloat(accMul(accDiv(sexList.sex_2.count, total), 100)).toFixed(4))+'%';// 男性比率
                    sex_3_ratio = parseFloat(parseFloat(accMul(accDiv(sexList.sex_3.count, total), 100)).toFixed(4))+'%';// 其他比率
				} else {
					sex_1_ratio = '0%';// 女性比率
					sex_2_ratio = '0%';// 男性比率
					sex_3_ratio = '0%';// 其他比率
				}
				// 年龄比率
				if(totalNumber != 0) {
                    age_1_ratio = parseFloat(parseFloat(accMul(accDiv(ageList.age_1.count, totalNumber), 100)).toFixed(4))+'%';// 小于20岁
                    age_2_ratio = parseFloat(parseFloat(accMul(accDiv(ageList.age_2.count, totalNumber), 100)).toFixed(4))+'%';// 20-30
                    age_3_ratio = parseFloat(parseFloat(accMul(accDiv(ageList.age_3.count, totalNumber), 100)).toFixed(4))+'%';// 30-40
                    age_4_ratio = parseFloat(parseFloat(accMul(accDiv(ageList.age_4.count, totalNumber), 100)).toFixed(4))+'%';// 40以上
				} else {
					age_1_ratio = '0%';// 小于20岁
					age_2_ratio = '0%';// 20-30
					age_3_ratio = '0%';// 30-40
					age_4_ratio = '0%';// 40以上
				}

				$('#gfemalep').html(sex_1_ratio);
				$('#gmalep').html(sex_2_ratio);
				$('#gotherp').html(sex_3_ratio);
				$('#gtotalp').html('100%');// 性别合计比率

                $('#alt20p').html(age_1_ratio);
                $('#agt20p').html(age_2_ratio);
                $('#agt30p').html(age_3_ratio);
                $('#agt40p').html(age_4_ratio);
                $('#atotalp').html('100%');// 年龄合计比率

                // 无生日比率
                $('#age-not-p').html('');

                // 加载图表
                this.renderGenderChart(sexList);
                this.renderAgeChart(ageList);
			},
			// 性别渲染图表
			renderGenderChart: function (sex_list) {
				// console.log('初始化echarts实例');
				// 基于准备好的dom，初始化echarts实例
		        var myGenderChart = echarts.init(document.getElementById('gender_charts'));
				option = {
					// center: ['50%', '60%'],
					title: {
				        text: '会员性别占比',
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
				        data: ['男性','女性','其他']
				    },
				    series : [
				        {
				            name: '访问来源',
				            type: 'pie',
				            radius: '55%',
				            color: ['#c90122','#2f727a','#f9ce2e'],
				            data:[
				                {value:sex_list.sex_2.count, name:'男性'},
				                {value:sex_list.sex_1.count, name:'女性'},
				                {value:sex_list.sex_3.count, name:'其他'}
				            ]
				        }
				    ]
				};

		        // 使用刚指定的配置项和数据显示图表。
		        myGenderChart.setOption(option);
			},
			// 年龄渲染图表
			renderAgeChart: function (age_list) {
				// console.log('初始化echarts实例');
				// 基于准备好的dom，初始化echarts实例
		        var myAgeChart = echarts.init(document.getElementById('count_charts'));
				option = {
					// center: ['50%', '70%'],
					title: {
				        text: '会员年龄占比',
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
				        data: ['20以下','20-30','30-40','40以上']
				    },
				    series : [
				        {
				            name: '访问来源',
				            type: 'pie',
				            radius: '55%',
				            color: ['#c90122','#2f727a','#f9ce2e','#e47b31'],
				            data:[
				                {value:age_list.age_1.count, name:'20以下'},
				                {value:age_list.age_2.count, name:'20-30'},
				                {value:age_list.age_3.count, name:'30-40'},
				                {value:age_list.age_4.count, name:'40以上'}
				            ]
				        }
				    ]
				};

		        // 使用刚指定的配置项和数据显示图表。
		        myAgeChart.setOption(option);
			},
		};
		OrderReview.init();
});
