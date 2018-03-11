$(function () {

	// 会员统计


		var OrderReview = {

			init: function () {
				// console.log($('.stafffloat').outHeight())
	            $("#start-date").val(getOffsetDateTime().start_day);
	            $("#end-date").val(getOffsetDateTime().end_day);

				// 绑定点击事件
				this.OrderReviewBind();
				this.renderGenderChart();
				this.renderAgeChart();
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
				// 条件查询事件
				$("#select_condition").change(function(){
					if ($(this).val() == 0) {
						$("#start-date-wrap").addClass('hide');
						$("#end-date-wrap").addClass('hide');
					} else {
						$("#start-date-wrap").removeClass('hide');
						$("#end-date-wrap").removeClass('hide');
					}
				});


			},
			// 获取数据
			getData: function () {
				var startDate;
				var endDate;
				var condition = $("#select_condition").val();// 查询条件
				var _self = this;
				if (condition == 0) {
					startDate ='';
					endDate = '';
				} else {
					startDate = $("#start-date").val(); // 开始日期   
		        	endDate = $("#end-date").val();     // 结束日期
				}

		        setAjax(AdminUrl.member_by_gender, { 
		            'start_date': startDate,
		            'end_date': endDate
		        }, $('#prompt-message'), {20: ''}, function(respnoseText) {
		            if (respnoseText.code == 20) {                
		                // 得到返回数据
		                displayMsg(ndPromptMsg, respnoseText.message, 2000);
		                console.log(respnoseText.data);
		                // this.dataProcess(respnoseText.data);
		                _self.renderTable(respnoseText.data);
		                // renderGenderChart(respnoseText.data.sex_list);
		                // renderAgeChart(respnoseText.data.age_list);
		            } else {
		                displayMsg(ndPromptMsg, respnoseText.message, 2000);
		            }
		        }, 0);
			},
			//数据处理
			dataProcess: function (data) {

			},
			// 渲染图表
			renderGenderChart: function (sex_list) {
				console.log('初始化echarts实例');
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
				                {value:60, name:'男性'},
				                {value:30, name:'女性'},
				                {value:20, name:'其他'}
				            ]
				        }
				    ]
				};

		        // 使用刚指定的配置项和数据显示图表。
		        myGenderChart.setOption(option);
			},
			// 渲染图表
			renderAgeChart: function () {
				console.log('初始化echarts实例');
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
				                {value:10, name:'20以下'},
				                {value:20, name:'20-30'},
				                {value:30, name:'30-40'},
				                {value:40, name:'40以上'}
				            ]
				        }
				    ]
				};

		        // 使用刚指定的配置项和数据显示图表。
		        myAgeChart.setOption(option);
			},
			renderTable: function (data) {
				var genderArr = [];
				var ageArr = [];
				var total = data.all_user_count.count;
				var ageList = data.age_list;
				var sexList = data.sex_list;
				console.log('总数',total);
				console.log('性别列表',sexList);
				console.log('年龄列表',ageList);
				
				//user_sex  用户性别（1：男；2:女；3：保密）
				var maleC = 0;
				var femaleC = 0;
				var otherC = 0;
				// for (var i = 0; i < sexList.length; i++) {
				// 	if(sexList[i].user_sex == 1){
				// 		maleC = sexList[i].count;
				// 	} else if (sexList[i].user_sex == 2) {
				// 		femaleC = sexList[i].count;
				// 	} 		
				// };
				// other = Num(total)-Num(maleC)-Num(femaleC);
				// 年龄渲染
				$('#alt20c').html(ageList.age_1.count);// 小于20岁
				$('#agt20c').html(ageList.age_2.count);// 20-30
				$('#agt30c').html(ageList.age_3.count);// 30-40
				$('#agt40c').html(ageList.age_4.count);// 40以上
				$('#atotalc').html(ageList.age_4.count);// 合计
				// 年龄比率
				if(total != 0) {
					$('#alt20c').html((parseFloat((ageList.age_1.count/total)).toFixed(2)*100)+'%');// 小于20岁
					$('#agt20c').html((parseFloat((ageList.age_2.count/total)).toFixed(2)*100)+'%');// 20-30
					$('#agt30c').html((parseFloat((ageList.age_3.count/total)).toFixed(2)*100)+'%');// 30-40
					$('#agt40c').html((parseFloat((ageList.age_4.count/total)).toFixed(2)*100)+'%');// 40以上	
				}
				$('#atotalp').html('100%');// 合计
			}
		};

		OrderReview.init();

});
