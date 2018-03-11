$(function() {

    // 外卖菜品关联

    // 获取权限
    var is_up = authority_judgment('外卖菜品添加修改'); // 是否有修改权限 0 否 1 是
    var dishesMenu = {}; // 菜品数据

    // 初始化
    init();

    // 初始化
    function init() {
        // 请求获取菜品列表信息
        dishesList();
        if (is_up == 0) {
            $('#operation,#platformAdd').addClass('hide');
        } else {
            // 绑定添加按钮事件
            addbtnBind();
        }
    }

    // 绑定添加按钮事件
    function addbtnBind() {
        $('#platformAdd').unbind('click').bind('click', function() {
            // 添加到初始
            $('#tbodys').prepend('<tr>' +
                '<td width="32%">' +
                '<div class="stores-caozuo-btn" data-type="addhold">保存</div>' +
                '<div class="stores-caozuo-delbtn" data-type="exit">取消</div>' +
                '</td>' +
                '<td width="24%">' +
                '<input type="text" class="dishes-name-input" data-type="nametext">' +
                '</td>' +
                '<td width="22%">' +
                '<div class="dishes-select-category" data-type="classify">' +
                '请选择分类' +
                '</div>' +
                '</td>' +
                '<td width="22%">' +
                '<div class="dishes-select-related" data-type="dishes">' +
                '请选择菜品' +
                '</div>' +
                '</td>' +
                '</tr>');
            // 绑定列表按钮点击事件
            platformBind();
        });
    }

    // 请求获取菜品列表信息
    function dishesList() {
        setAjax(AdminUrl.menuMenuList, {
            'menu_status': 0,
            'sale_shop_id': 'all'
        }, $('#prompt-message'), { 20: '' }, function(respnoseText) {
            if (respnoseText.code == 20) {
                delete respnoseText.data.depot_info;
                // 得到返回数据
                dishesMenu = respnoseText.data;
                // 请求列表接口
                platformData();
            } else {
                displayMsg(ndPromptMsg, respnoseText.message, 2000);
            }
        }, 0);
    }

    // 请求列表接口
    function platformData() {
        setAjax(AdminUrl.platformList, {}, $('#prompt-message'), { 20: '' }, function(respnoseText) {
            if (respnoseText.code == 20) {
                // 得到返回数据
                var data = respnoseText.data;
                // 显示数据
                platformList(data);
            } else {
                displayMsg(ndPromptMsg, respnoseText.message, 2000);
            }
        }, 0);
    }

    // 显示数据
    function platformList(data) {
        var content = '';
        for (var i in data) {
            content += '<tr record-id="' + data[i].record_id + '">' +
                (is_up == 0 ? '' :
                    '<td width="32%">' +
                    (data[i].menu_id != '' ?
                        '<div class="stores-caozuo-delbtn" data-type="delete">删除</div>' :
                        '<div class="stores-caozuo-btn" data-type="uphold">保存</div>') +
                    '</td>') +
                '<td width="24%">' +
                '<p class="dishes-name-text">' +
                data[i].p_menu_name +
                '</p>' +
                '</td>' +
                '<td width="22%">' +
                (data[i].menu_id != '' ?
                    '<p class="dishes-name-category">' +
                    dishesMenu[data[i].menu_type_id].menu_type +
                    '</p>' :
                    (is_up == 0 ? '' :
                        '<div class="dishes-select-category" data-type="classify" type-id="">' +
                        '请选择分类' +
                        '</div>')) +
                '</td>' +
                '<td width="22%">' +
                (data[i].menu_id != '' ?
                    '<p class="dishes-name-related">' +
                    data[i].menu_name +
                    '</p>' :
                    (is_up == 0 ? '' :
                        '<div class="dishes-select-related" data-type="dishes" type-id="">' +
                        '请选择菜品' +
                        '</div>')) +
                '</td>' +
                '</tr>';
        }
        // 添加到页面中
        $('#tbodys').html(content);
        if (is_up == 1) {
            // 绑定列表按钮点击事件
            platformBind();
        }
    }

    // 绑定列表按钮点击事件
    function platformBind() {
        // 绑定
        $('#tbodys').find('tr').each(function() {
            var self = this,
                record_id = $(self).attr('record-id');

            $(self).find('div[data-type="uphold"]').unbind('click').bind('click', function() {
                platformUphold(self, record_id); // 修改保存
            });
            $(self).find('div[data-type="delete"]').unbind('click').bind('click', function() {
                platformDelete(self, record_id); // 删除
            });
            $(self).find('div[data-type="addhold"]').unbind('click').bind('click', function() {
                platformAddhold(self); // 保存
            });
            $(self).find('div[data-type="exit"]').unbind('click').bind('click', function() {
                $(self).remove(); // 取消
            });
            $(self).find('div[data-type="classify"]').unbind('click').bind('click', function() {
                var top = $(window).height() - $('#dishes-select').height();
                var left = $(window).width() - $('#dishes-select').width()
                $('#dishes-select').css({ 'top': top / 2, 'left': left / 2 });
                platformClassify(1, $(self).find('div[data-type="classify"]'), $(self).find('div[data-type="dishes"]')); // 分类
            });
            $(self).find('div[data-type="dishes"]').unbind('click').bind('click', function() {
                var top = $(window).height() - $('#dishes-select').height();
                var left = $(window).width() - $('#dishes-select').width()
                $('#dishes-select').css({ 'top': top / 2, 'left': left / 2 });
                platformClassify(2, $(self).find('div[data-type="dishes"]'), $(self).find('div[data-type="classify"]').attr('type-id')); // 菜品
            });
        });
    }

    /* 修改保存菜品
        self 当前tr
        record_id 记录id
    */
    function platformUphold(self, record_id) {
        var menu_type_id = $(self).find('div[data-type="classify"]').attr('type-id');
        var menu_id = $(self).find('div[data-type="dishes"]').attr('type-id');
        var menu_name = $(self).find('div[data-type="dishes"]').text();

        if (!menu_type_id || menu_type_id == '') {
            displayMsg(ndPromptMsg, '请选择关联菜品分类！', 2000);
            return;
        }
        if (!menu_id || menu_id == '') {
            displayMsg(ndPromptMsg, '请选择关联菜品！', 2000);
            return;
        }

        setAjax(AdminUrl.platformUpdate, {
            'record_id': record_id,
            'menu_name': menu_name,
            'menu_id': menu_id,
            'menu_type_id': menu_type_id
        }, $('#prompt-message'), { 20: '' }, function(respnoseText) {
            if (respnoseText.code == 20) {
                displayMsg(ndPromptMsg, '保存成功', 2000, function() {
                    // 请求列表接口
                    platformData();
                });
            } else {
                displayMsg(ndPromptMsg, respnoseText.message, 2000);
            }
        }, 0);
    }

    /* 删除菜品
        self 当前tr
        record_id 记录id
    */
    function platformDelete(self, record_id) {
        $('#system-hint').removeClass('hide');
        displayAlertMessage('#system-hint', '#system-exit');
        $('#definite-hint-btn').unbind('click').bind('click', function() {
            layer.close(layerBox);
            setAjax(AdminUrl.platformDelete, {
                'record_id': record_id //记录ID
            }, $('#prompt-message'), { 20: '' }, function(respnoseText) {
                if (respnoseText.code == 20) {
                    displayMsg(ndPromptMsg, '删除成功', 2000);
                    $(self).remove();
                } else {
                    displayMsg(ndPromptMsg, respnoseText.message, 2000);
                }
            }, 0);
        });
        $('#cancel-hint-btn').unbind('click').bind('click', function() {
            layer.close(layerBox);
        });
    }

    // 保存菜品
    function platformAddhold(self) {
        var menu_type_id = $(self).find('div[data-type="classify"]').attr('type-id');
        var menu_id = $(self).find('div[data-type="dishes"]').attr('type-id');
        var p_menu_name = $(self).find('input[data-type="nametext"]').val();
        var menu_name = $(self).find('div[data-type="dishes"]').text();

        if (p_menu_name == '') {
            displayMsg(ndPromptMsg, '请输入外卖菜品名称！', 2000);
            return;
        }
        if (!menu_type_id || menu_type_id == '') {
            displayMsg(ndPromptMsg, '请选择关联菜品分类！', 2000);
            return;
        }
        if (!menu_id || menu_id == '') {
            displayMsg(ndPromptMsg, '请选择关联菜品！', 2000);
            return;
        }

        setAjax(AdminUrl.platformAdd, {
            'p_menu_name': p_menu_name,
            'menu_name': menu_name,
            'menu_id': menu_id,
            'menu_type_id': menu_type_id
        }, $('#prompt-message'), { 20: '' }, function(respnoseText) {
            if (respnoseText.code == 20) {
                displayMsg(ndPromptMsg, '添加成功', 2000, function() {
                    // 请求列表接口
                    platformData();
                });
            } else {
                displayMsg(ndPromptMsg, respnoseText.message, 2000);
            }
        }, 0);
    }

    /* 分类选择、菜品选择
        type 1分类 2菜品
        self 当前(this)
        self_id type == 1(当前菜品) type == 2(当前分类id)
    */
    function platformClassify(type, self, self_id) {
        if (type == 2 && !self_id) {
            displayMsg(ndPromptMsg, '请先选择菜品分类！', 2000);
            return;
        }

        $('#dishes-select').removeClass('hide');
        displayAlertMessage('#dishes-select', '#dishe-exit');

        var type_id = self.attr('type-id'); // 选中的id
        var type_class = ''; // 选中样式
        var content = ''; // 弹出层内容
        var dishes_text = '选择菜品'; // 弹出层头部标题

        if (type == 1) {
            dishes_text = '选择分类';
        }
        $('#dishes-text').html(dishes_text);

        // 循环显示数据
        for (var i in dishesMenu) {
            if (type == 1) {
                if (type_id == i) {
                    type_class = 'dishes-selected-li';
                } else {
                    type_class = '';
                }
                content += '<li type-id="' + i + '" class="' + type_class + '">' +
                    dishesMenu[i].menu_type +
                    '</li>';
            } else {
                if (self_id == i) {
                    for (var j in dishesMenu[i].menu_list) {
                        if (dishesMenu[i].menu_list[j].is_set_menu == 1) {
                            continue;
                        }
                        if (type_id == j) {
                            type_class = 'dishes-selected-li';
                        } else {
                            type_class = '';
                        }
                        content += '<li type-id="' + j + '" class="' + type_class + '">' +
                            dishesMenu[i].menu_list[j].menu_name +
                            '</li>';
                    }
                }
            }
        }
        $('#dishes-select-content').html(content);

        // 绑定点击事件
        $('#dishes-select-content').find('li').each(function() {
            $(this).unbind('click').bind('click', function() {
                var id = $(this).attr('type-id');
                self.attr('type-id', id);
                self.text($(this).text());
                // 如果当前选择的分类，与之前选择的分类不一样，清空关联菜品内容，显示默认文字
                if (type == 1 && id != type_id) {
                    self_id.attr('type-id', '');
                    self_id.text('请选择菜品');
                }
                layer.close(layerBox);
            });
        });
    }
});