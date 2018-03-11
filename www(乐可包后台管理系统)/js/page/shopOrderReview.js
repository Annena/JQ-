$(function () {

	// 门店=====订单点评

		// ipad滚动条无法滚动的解决
		scrollHei('.pinglun-nav', '.pinglun-content', '.stafffloatdiv');
		// 从cookie中获取到门店id
		var shopIdPro = $.cookie('shop-shop_id');


		var OrderReview = {

			init: function () {
				// 显示默认当前时间为开始日期和结束日期
	            /*$("#start-date").val(getLocalDate());
	            $("#end-date").val(getLocalDate());*/

	            $("#start-date").val(getOffsetDateTime().start_day);
	            $("#end-date").val(getOffsetDateTime().end_day);

				// 查询订单点评
				//this.OrderReviewList();
				// 绑定点击事件
				this.OrderReviewBind();
			},

			// 绑定点击事件
			OrderReviewBind: function () {
				var _self = this;

				// 点击搜索
				$('#searchbtn').unbind('click').bind('click', function () {
					// 检测搜索的项
					_self.checkCondition();
				});

	            // 点评绑定事件
	            $('#comment-content').delegate('nav', 'click', function(event) {

	            	var type = $(event.target).attr('data-type');
	            	var orderid = $(this).attr('id');// 得到的是订单id
	                // 回复
	                if (type == 'reply') {
	                	var commentid = $(this).find('div[data-class="reply"]').attr('id');
	                    _self.replyComment(orderid,commentid);
	                }

	                // 回复删除
	                if (type == 'reply-delete') {
	                    //_self.deleteConfirm($(event.target).parents('[data-class="reply"]').attr('id'));
	                    _self.deleteConfirm(orderid,$(event.target).parents('[data-class="reply"]').attr('id'));
	                }
	            });

	            // 取消
				// $('#cancel-reply').unbind('click').bind('click', function () {
				// 	layer.close(layerBox);
				// });
			},

	        // 检测条件
	        checkCondition: function() {

	            var _self = this;

	            var start = $('#start-date').val(),
	                end = $('#end-date').val();

	            if (start == "" || end == "") {
	                displayMsg($('#prompt-message'), '请选择开始时间和结束时间!', 2000);
	                return;
	            }

	            if (start > end) {
	                displayMsg($('#prompt-message'), '开始时间应小于结束时间!', 2000);
	                return;
	            }

	            // 查询数据
	            _self.OrderReviewList();
	        },

			// 搜索显示数据
			OrderReviewList: function () {
				var _self = this;
				
				// 搜索之前清空列表数据
				$('#comment-content').html('');

                setAjax(AdminUrl.commentSearchCommentList, {
					'start_date': $('#start-date').val(),
					'end_date': $('#end-date').val(),
					'shop_id': shopIdPro
                }, $('#prompt-message'), {20: ''}, function(respnoseText) {
					// 得到返回数据
                    var data = respnoseText.data;
                    // 有数据显示点评列表，没有数据就隐藏点评列表
                    if (data) {
						$('#comment-content').show();
						// 写入点评
						_self.processCommentData(data);
					} else {
						$('#comment-content').hide();
					}
                }, 2);
			},

			// 显示数据
			processCommentData: function (data) {
				var self = this;
	            var content = '';
				var contentPro  = '';
				var payId;
				var payNo;
	            for (var i in data) {

	            	contentPro = '';

	                /*var reply = '', info = data[i];*/
	                /*if (info.length > 0) {
	                    for (var j in info) {
	                        reply += self.addReply(
	                            info[j].re_id,
	                            info[j].status_name,
	                            getAppointTime(new Date(info[j].add_time * 1000)),
	                            info[j].content
	                        );
	                    }
	                }

	                content += '<li id="'+ data[i] +'">'+
	                    '<div class="pinglun-main clearfix">'+
	                        '<ul>'+
	                            '<li>'+
	                                '<p>用户名：'+data[j].user_mobile+'</p>'+
	                                '<p>门店：'+data[j].shop_name+'</p>'+
	                                '<p>服务评分：'+
	                            
	                                	'<img src="../../img/base/start_'+data[i].star_1+'.png">'+
	                                '</p>'+
	                                '<p>产品评分：'+
	                                	'<img src="../../img/base/start_'+data[i].star_2+'.png">'+
	                                '</p>'+
	                                '<p>订单编号：'+data[i].parent_id+'</p>'+
	                                '<p class="pinglun-main-pspan">评论时间：'+getAppointTime(new Date(data[i].add_time * 1000))+'</p>'+
	                            '</li>'+
	                        '</ul>'+
	                    '</div>'+
	                    '<div class="pinglun-main-txt">'+data[i].content+'</div>'+
	                    '<div class="pinglun-main-footer clearfix">'+
	                        '<ul>'+
	                            '<li>'+
	                                '<p class="pinglun-main-pspan">'+
	                                    '<input type="button" value="回复" data-type="reply">'+
	                                '</p>'+
	                            '</li>'+
	                        '</ul>'+
	                    '</div>'+
	                    '<div class="reply">' + reply + '</div>'+
	                '</li>';*/


					for (var j in data[i]) {
						// console.log(data[i][j].pay_no);
						// console.log(data[i][j].pay_id);
						if(!data[i][j].pay_no) {
							payNo = '';
						} else {
							payNo = data[i][j].pay_no;
						}
						payId = data[i][j].pay_id;
						contentPro +=   '<div id="'+ data[i][j].comment_id +'" data-class="reply" class="pinglun-conborder">'+
						                    '<div class="pinglun-main clearfix">'+
						                        '<ul>'+
						                            '<li>'+
						                                '<p>'+(data[i][j].a_user_id ==  null ? '用户名：' : '回复：')+''+data[i][j].user_name+'</p>'+
						                                (data[i][j].a_user_id ==  null ?
						                                '<p>门店：'+data[i][j].shop_name+'店</p>': '')+
						                                (data[i][j].a_user_id ==  null ?
						                                '<p>服务评分：'+
						                                	'<img src="../../img/base/start_'+data[i][j].star_1+'.png">'+
						                                '</p>'+
						                                '<p>产品评分：'+
						                                	'<img src="../../img/base/start_'+data[i][j].star_2+'.png">'+
						                                '</p>': '')+
						                                '<p class="pinglun-main-pspan">'+(data[i][j].a_user_id ==  null ? '评论时间：' : '回复时间：')+''+getAppointTime(data[i][j].add_time)+'</p>'+
						                            '</li>'+
						                        '</ul>'+
						                    '</div>'+
						                    '<div class="pinglun-main-txt">'+data[i][j].content+'</div>'+
						                    '<div class="pinglun-main-footer clearfix">'+
						                        '<ul>'+
						                            '<li>'+
						                                '<p class="pinglun-main-pspan">'+
						                                    '<input type="button" class="pinglunbtn" value="'+(data[i][j].a_user_id ==  null ? '回复' : '删除')+'" data-type="'+(data[i][j].a_user_id ==  null ? 'reply' : 'reply-delete')+'">'+
						                                '</p>'+
						                            '</li>'+
						                        '</ul>'+
						                    '</div>'+
						                    '<div class="reply"></div>'+
						                '</div>';
					}

					content += '<nav class="pinglungroup" id="'+i+'">'+
									'<div class="pinglun-mainlan clearfix" order-id="'+i+'">'+'<b>'+'流水单号：'+pay_no_he(payNo)+'('+payId+')'+'</b>'+'</div>'+
									'<div data-type="orderReview">'+contentPro+'</div>'+
								'</nav>';



					// console.log(i);


	            }

	            $('#comment-content').html(content);
			},

	        // 添加回复
	        addReply: function(id, admin, time, content) {
	            return '<div class="pinglun-huifu-txt" data-class="reply" id="'+ id +'">'+
	                        '<div class="pinglun-huifu clearfix">'+
	                            '<ul>'+
	                                '<li>'+
	                                    '<p>回复人：<span>管理员</span></p>'+
	                                    '<p>回复时间：'+time+'</p>'+
	                                '</li>'+
	                            '</ul>'+
	                        '</div>'+
	                        '<div class="pinglun-huifu-txt">'+content+'</div>'+
	                        '<div class="pinglun-main-footer clearfix">'+
	                            '<ul>'+
	                                '<li>'+
	                                    '<p class="pinglun-main-pspan">'+
	                                        '<input type="button" data-type="reply-delete" value="删除">'+
	                                    '</p>'+
	                                '</li>'+
	                            '</ul>'+
	                        '</div>'+
	                    '</div>';
	        },

	        // 回复评论
	        replyComment: function(orderid,commentid) {

	            var _self = this;
	            
			    displayAlertMessage('#reply-message', '#cancelt-reply');

				$('#definite-reply').unbind('click').bind('click', function () {

				    var replyInfo = $('#reply-info').val();

				    if (replyInfo == '') {
				        displayMsgTime('#prompt-message', '请输入回复内容');
				        return;
				    }

				    _self.replayOrderComment(orderid,commentid, replyInfo);
				});
	        },

	        // 回复订单点评
	        replayOrderComment: function(orderid,commentid, content) {

	            var _self = this;

				setAjax(AdminUrl.commentCommentAdd, {
					'comment_id': commentid,
					'content': content
				}, $('#prompt-message'), {20: ''},  function (respnoseText) {
					                
					var data = respnoseText.data;
					if (respnoseText.code == 20) {
					    layer.close(layerBox);
					    /*$('#' + id).find('[class="reply"]').append(_self.addReply(
						    data.data,
						    data.status_name,
						    getAppointTime(new Date()),
						    content
					    ));*/
						var con = ' <div id="'+ data.comment_id +'" data-class="reply" class="pinglun-conborder">'+
						                    '<div class="pinglun-main clearfix">'+
						                        '<ul>'+
						                            '<li>'+
						                                '<p>回复人：'+data.user_name+'</p>'+
						                                '<p class="pinglun-main-pspan">回复时间：'+getLocalDate()+'</p>'+
						                            '</li>'+
						                        '</ul>'+
						                    '</div>'+
						                    '<div class="pinglun-main-txt">'+content+'</div>'+
						                    '<div class="pinglun-main-footer clearfix">'+
						                        '<ul>'+
						                            '<li>'+
						                                '<p class="pinglun-main-pspan">'+
						                                    '<input type="button" class="pinglunbtn" value="删除" data-type="reply-delete">'+
						                                '</p>'+
						                            '</li>'+
						                        '</ul>'+
						                    '</div>'+
						                    '<div class="reply"></div>'+
						                '</div>';

						$('#' + orderid).find('div[data-type="orderReview"]').append(con);

					    displayMsgTime($('#prompt-message'), '回复成功!');
					    $('#reply-info').val('');
					} else {
					    layer.close(layerBox);
					    displayMsgTime($('#prompt-message'), respnoseText.message);
					}

				}, 0);
	        },

	        // 删除确认
	        deleteConfirm: function(orderid,id) {

	            var _self = this;
	            //alert(121321);
	            $('#alert-content').html('你确定要删除此回复吗？');
	            displayAlertMessage('#alert-message', '#cancel-alert');

	            $('#definite-alert').unbind('click').bind('click', function () {
	                //_self.delOrderComment(id);
		            setAjax(AdminUrl.commentCommentDel, {
		                'comment_id': id
		            }, ndAlertProMsg, {20: ''}, function (respnoseText) {
		                //$('#' + id).find('[data-type="reply-delete"]').hide();
		                if (respnoseText.code == 20) {
			                $('#' + id).remove();
			                layer.close(layerBox);
		                	displayMsgTime($('#prompt-message'), '删除成功!');
		            	} else {
		            		layer.close(layerBox);
		                	displayMsgTime($('#prompt-message'), respnoseText.message);
		            	}
		            }, 0);
	            });
	        }

		}

		OrderReview.init();

});
