var Cache = {
        // 设置缓存
        set: function(key, data) {
            localStorage.setItem(key, JSON.stringify(data));
        },

        // 删除缓存
        del: function(key, data, fn) {
            //alert('删除缓存：key--'+key+"-data--"+data);
            var locallength = localStorage.length;
            var nodel = new Array();
            //alert('缓存长度--'+locallength);
            if (typeof key == 'string') {
                //alert('key是string类型');
                if (key == 'all') {
                    //alert("key==all");
                    if (data && data instanceof Array) {
                        //alert('data有数据并且data是数组');

                        
                        for(var i = locallength - 1;i >= 0 ; i--){
                            if ($.inArray(localStorage.key(i), data) == -1) {
                                //alert("---"+localStorage.key(i));
                                nodel[i] = localStorage.key(i);
                            }
                        }
                        for(var y = 0;y < nodel.length; y++){
                            //alert(nodel.length +"--删除的缓存--"+nodel[y]);
                            localStorage.removeItem(nodel[y]);
                        }

                        /*for(var y = 0;y < nodel.length;y++){
                            //for(var q = 0;q < locallength; q++)
                                //if(nodel[y] == localStorage.key(q)){
                            localStorage.removeItem(nodel[i]);
                               // }
                        }*/

                        /*for (var f = locallength - 1; f>=0; f--) {
                            
                            //alert('menu的下表--'+localStorage.key("menuVersion"));
                            //alert("缓存中的长度--"+f+"--值--"+localStorage.key(f));
                            //如果指定数组中没有要查找的值也就是-1，就删除查找的值
                            if ($.inArray(localStorage.key(f), data) == -1) {
                                //alert("删除指定key本地存储的值");
                                localStorage.removeItem(localStorage.key(f));
                            }
                        }*/
                    } else {
                        //alert("data没有数据或者data不是数组，清空同源的本地存储数据");
                        localStorage.clear();
                    }
                } else {
                    //alert("key!=all");
                    localStorage.removeItem(key);
                }
            } else if ( (typeof key == 'object') && (key instanceof Array)) {
                //alert('是object类型并且key是数组');
                for (var i=0; i<key.length; i++) {
                    //alert("删除指定key本地存储的值");
                    localStorage.removeItem(key[i]);
                }
            }

            if (typeof fn == 'function') {
                fn();
            }

        },

        // 获取缓存
        get: function(key) {
            return JSON.parse(localStorage.getItem(key));
        }
};