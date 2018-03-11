$(function () {
    // 新闻资讯添加修改
        var person_get = person_get_data();
        // 商户英文名
        var business = person_get.company_name_en;
        // 获取到修改传过来的id
        var newsId = getQueryString('news_id');
        // 获取到修改传过来的缓存
        var dataPro = Cache.get('newUp');
        // 判断是修改还是添加 0；添加，1：修改
        var addIsUp = 0;
        // UE文本编译器
        var ue;

        var NewsEdit = {

            init: function () {
                var self = this;
                // 显示UE文本编译器
                ue = UE.getEditor('description');
                //UE.getEditor('description').setContent('dddddd');
                // 判断是修改还是添加
                if (newsId != null && newsId != undefined && dataPro != null && dataPro != undefined) {
                    addIsUp = 1;
                    // 把状态显示
                    $('#addNoDisplay').removeClass('hide');
                    $('#addAndedit').text('新闻修改');
               
                    setAjax(AdminUrl.newsNewsInfo, {
                        'news_id': newsId
                    }, $('#prompt-message'), {20: ''}, function(respnoseText) {
                        // 得到返回数据
                        var data = respnoseText.data;
                        // 显示数据
                        self.NewsEditList(data);
                    }, 1);
                } else {
                    // 默认显示今天
                    $('#postTime').val(getLocalDate());
                    addIsUp = 0;
                    // 把状态隐藏
                    $('#addNoDisplay').addClass('hide');
                    $('#addAndedit').text('新闻添加');
                }

                // 绑定点击事件
                this.NewsEditBind();
            },

            // 显示数据
            NewsEditList: function (data) {
                // 显示数据
                // 从缓存中获取到cardId
                var cardId = person_get.card_id;
                //alert('tt');
                // 标题
                $('#newsTitle').val(data.news_title);
                // 发布时间
                $('#postTime').val(getAppointTime(data.post_time));

                // 内容
                //对编辑器的操作最好在编辑器ready之后再做
                ue.ready(function(){
                    //设置编辑器的内容
                    ue.setContent(data.content);
                    //获取html内容，返回: <p>hello</p>
                    //var html = ue.getContent();
                    //获取纯文本内容，返回: hello
                    //var txt = ue.getContentTxt();
                });

                // 状态
                $('#newsStatus').val(dataPro.news_status);

                // 图片
                $('#getImg').attr('src','../../img/business/'+cardId+'/news/'+data.news_id+'.jpg?'+Math.random()+'">');


                // 缓存中的数据取出之后删除
                Cache.del('newUp');
            },

            // 绑定点击事件
            NewsEditBind: function () {
                var _self = this;
                // 点击修改
               $('#updatebtn').unbind('click').bind('click', function () {
                    if (addIsUp == 0) {
                        _self.NewsEditAdd();
                    } else if (addIsUp == 1) {
                        _self.NewsEditUpdate();
                    }
                });

                // 点击取消
                $('#exitbtn').unbind('click').bind('click', function () {
                    window.location.replace('newsInformation.html?is_select=1&type='+getQueryString('type'));
                });

                // 点击导航
                $('#selectJump').unbind('click').bind('click', function () {
                    window.location.replace('newsInformation.html?is_select=1&type='+getQueryString('type'));
                });

                // 点击选择图片按钮后存取生成图片路径
                $("#isImages").change(function(){
                    var objUrl = getObjectURL(this.files[0]) ;
                    //$('#menuPic').removeClass('hide');
                    //console.log("objUrl = "+objUrl) ;
                    // 判断文件类型必须是JPG，png，bump中的一种
                    if(checkImgType(this)){
                        if (objUrl) {
                            $("#getImg").attr("src", objUrl) ;
                            //$('#menuPic').html('<img id="dishesmenupic" src="'+objUrl+'">');
                        }
                    }
                }) ;
                //建立一個可存取到該file的url
                function getObjectURL(file) {
                    var url = null ;
                    if (window.createObjectURL!=undefined) { // basic
                        url = window.createObjectURL(file) ;
                    } else if (window.URL!=undefined) { // mozilla(firefox)
                        url = window.URL.createObjectURL(file) ;
                    } else if (window.webkitURL!=undefined) { // webkit or chrome
                        url = window.webkitURL.createObjectURL(file) ;
                    }
                    return url ;
                }

            },

            // 添加
            NewsEditAdd: function () {
                // 获取到各个数据，请求接口提交数据
                var self = this;
                // 把cid放进去
                $('#CID').val($.cookie('cid'));
                $('#companyNameEn').val(business);

                // 文字标题校验不能超过30个字
                var newsTitle = $('#newsTitle').val();
                if (newsTitle.length > 30) {
                    displayMsg(ndPromptMsg, '文章标题最多只能输入三十个字!', 2000);
                    return;
                }

                // UE文本编辑器不能为空
                if (!ue.hasContents()) {
                    displayMsg(ndPromptMsg, '请输入详细内容', 2000);
                    return;
                }
                $('#article_content').val(ue.getContent());

                if ($('#isImages').val() == '') {
                    displayMsg(ndPromptMsg, '请上传缩略图', 2000);
                    return;
                }

                // 效验数据通过才能修改
                if (this.dataCheck()) {
                    $("#form").ajaxSubmit({
                        type: 'post',
                        xhrFields:{withCredentials:true},
                        url: AdminUrl.newsNewsAdd,
                        success: function (respnoseText) {
                            //respnoseText = JSON.parse(respnoseText);
                            console.log(respnoseText);
                            var data = respnoseText.data;
                            if (respnoseText.code == 20) {
                                displayMsg($('#prompt-message'), respnoseText.message, 1000, function () {
                                    layer.close(layerBox);
                                    window.location.replace('newsInformation.html?is_select=1&type='+getQueryString('type'));
                                });
                            } else {
                                displayMsg($('#prompt-message'), respnoseText.message, 2000);
                            }
                        },
                        error: function (XmlHttpRequest, textStatus, errorThrown) {
                            displayMsg($('#prompt-message'), '图片上传失败', 2000);
                        }
                    });
                }
            },

            // 修改
            NewsEditUpdate: function () {
                // 获取到各个数据，请求接口提交数据
                var self = this;
                // 把cid放进去
                $('#CID').val($.cookie('cid'));
                $('#companyNameEn').val(business);
                $('#newsId').val(newsId);

                // 文字标题校验不能超过30个字
                var newsTitle = $('#newsTitle').val();
                if (newsTitle.length > 30) {
                    displayMsg(ndPromptMsg, '文章标题最多只能输入三十个字!', 2000);
                    return;
                }

                // UE文本编辑器不能为空
                if (!ue.hasContents()) {
                    displayMsg($('#prompt-message'), '请输入详细内容', 2000);
                    return;
                }
                $('#article_content').val(ue.getContent());

                /*if ($('#isImages').val() == '') {
                    displayMsg($('#prompt-message'), '请上传缩略图', 2000);
                    return;
                }*/

                // 效验数据通过才能修改
                if (this.dataCheck()) {
                    $("#form").ajaxSubmit({
                        type: 'post',
                        xhrFields:{withCredentials:true},
                        url: AdminUrl.newsNewsUpdate,
                        success: function (respnoseText) {
                            //respnoseText = JSON.parse(respnoseText);
                            var data = respnoseText.data;
                            if (respnoseText.code == 20) {
                                displayMsg($('#prompt-message'), respnoseText.message, 1000, function () {
                                    layer.close(layerBox);
                                    window.location.replace('newsInformation.html?is_select=1&type='+getQueryString('type'));
                                });
                            } else {
                                displayMsg($('#prompt-message'), respnoseText.message, 2000);
                            }
                        },
                        error: function (XmlHttpRequest, textStatus, errorThrown) {
                            displayMsg($('#prompt-message'), '图片上传失败', 2000);
                        }
                    });
                }
            },

            // 效验要修改的数据
            dataCheck: function () {
                if ( dataTest('#newsTitle', '#prompt-message', { 'empty': '不能为空'})
                    && dataTest('#postTime', '#prompt-message', { 'empty': '不能为空'})
                
                ) {
                    //alert('tt');
                    return true;
                }

                return false;
            }
        }

        NewsEdit.init();

});

