$(function () {

    // 新闻资讯
       

        // 定义状态参数 0:正常，1：下架，默认是0显示正常列表
        var newsStatus = 0;
        // 从缓存中得到用户是否有添加修改权限
        var perIsEdit = Cache.get('perIsEdit');

        var NewsList = {

            init: function () {
                var self = this;
                // 判断如果等于undefined说明没有添加修改权限
                if (perIsEdit['新闻资讯添加修改'] == undefined) {
                    $('#permissions').addClass('hide');
                    $('#operation').addClass('hide');
                } else {
                    $('#permissions').removeClass('hide');
                    $('#operation').removeClass('hide');
                }
                // 是否从添加修改 返回回来的
                if (getQueryString('is_select') == 1) {
                    self.clickLabel(parseFloat(getQueryString('type')));
                } else {
                    // 显示数据
                    this.NewsManageData(newsStatus);
                }

                // 绑定点击事件
                this.NewsListBind();
            },

            // 请求显示数据
            NewsManageData: function (newsStatus) {
                // 请求之前先清空列表数据
                $('#tbodys').html('');

                var self = this;
                setAjax(AdminUrl.newsNewsList, {
                    'news_status': newsStatus
                }, $('#prompt-message'), {20: ''}, function(respnoseText) {
                    // 得到返回数据
                    var data = respnoseText.data;
                    // 显示数据
                    self.NewsManageList(data);
                }, 1);
            },

            // 显示数据
            NewsManageList: function (data) {
                    var content = '';

                    for (var i in data) {
                        content += '<tr class="total-tr" news-id="'+data[i].news_id+'">'+
                                        '<td class="tdjianju" data-type="newsTitle">'+data[i].news_title+'</td>'+
                                        '<td class="tdjianju" data-type="postTime">'+getAppointTime(data[i].post_time)+'</td>'+
                                        (perIsEdit['新闻资讯添加修改'] == undefined ? '' :
                                        '<td class="total-caozuo" class="clearfix">'+
                                            '<span>'+
                                                '<input type="button" value="修改" data-type="update" class="stores-caozuo-btn">'+
                                            '</span>'+
                                        '</td>')+
                                        '<td class="hide" data-type="content">'+data[i].content+'</td>'+
                                    '</tr>';
                    }
                    // 添加到页面中
                    $('#tbodys').html(content);
            },

            // 绑定点击事件
            NewsListBind: function () {
                var self = this;
                // 点击修改
                $('#tbodys').delegate('tr', 'click', function(event) {
                    var self = this,
                    newsId = $(self).attr('news-id'),
                    type = $(event.target).attr('data-type');

                    if (type == 'update') {
                        // 点击修改的时候，创建一个数据，存储要修改的这一行的信息，然后存到缓存中，到修改页面取出来填充到页面中去
                        
                        var newsTitle = $(self).find('td[data-type="newsTitle"]').text();
                        var postTime =$(self).find('td[data-type="postTime"]').text();
                        var content =$(self).find('td[data-type="content"]').text();
                        
                        var newUp = {
                            'news_id': newsId,
                            'news_title': newsTitle,
                            'post_time': postTime,
                            'content': content,
                            'news_status': newsStatus
                        };
                        Cache.set('newUp',newUp);

                        window.location.replace('newsEdit.html?v=' + version + '&news_id='+newsId+'&type='+newsStatus);
                    }
                });

                // 点击新闻资讯列表
                $('#normal').unbind('click').bind('click', function () {
                    self.clickLabel(0);
                });

                // 点击下架列表
                $('#shelves').unbind('click').bind('click', function () {
                    self.clickLabel(1);
                });

                // 点击添加
                $('#updatebtn').unbind('click').bind('click', function () {
                    window.location.replace('newsEdit.html?v=' + version + '&type='+newsStatus);
                });


            },

            // 点击标签页显示隐藏 调用数据
            clickLabel: function (type) {
                var self = this;

                switch(type) {
                    case 0:
                        // 点击新闻资讯列表，删除不选中的样式，添加选中的样式
                        $('#normal').removeClass('caipin-fenleinucheck');
                        $('#normal').addClass('caipin-fenleicheck');
                        // 下架列表，删除选中样式，添加不选中的样式
                        $('#shelves').removeClass('caipin-fenleicheck');
                        $('#shelves').addClass('caipin-fenleinucheck');


                        self.NewsManageData(0);

                        newsStatus = 0;
                    break;
                    case 1:
                        // 点击下架列表，删除不选中的样式，添加选中的样式
                        $('#shelves').removeClass('caipin-fenleinucheck');
                        $('#shelves').addClass('caipin-fenleicheck');
                        // 新闻资讯列表，删除选中样式，添加不选中的样式
                        $('#normal').removeClass('caipin-fenleicheck');
                        $('#normal').addClass('caipin-fenleinucheck');

                        self.NewsManageData(1);

                        newsStatus = 1;
                    break;
                }
            }
        };

        NewsList.init();

});
