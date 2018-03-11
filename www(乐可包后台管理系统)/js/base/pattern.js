
// 正则表达式
var Pattern = {
    empty: '',
    number: /^[0-9]\d*(\.(\d){1,2})?$/,
    sale: /^(0|100|[1-9]\d?)$/,
    // sale: /^(100|[0-9]\d?)$/,
    chinese: /[\u4e00-\u9fa5]/,
    //phoneNumber: /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/,
    phoneNumber: /^((0\d{2,3}-\d{7,8})|(1[0-9]{1}[0-9]{1}[0-9]{8}))$/, ///^[\d]{11}$/,
    mobileNumber: /^(([1]\d{10})[\s]?|^(([1-9]{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})))$/,
    email: /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,4}$/,
    id: /\d{15}|\d{18}/,
    entity_card: /^[a-zA-Z0-9]{3,30}$/
};

// 验证正则表达式
var Validate = {

    // 空验证
    isEmpty: function(text) {
        //alert(text);
        if (text == Pattern.empty) {
            return true;
        }
    },

    // 数字验证
    isNumber: function(text) {
        if (!Pattern.number.test(text)) {
            return true;
        }
    },

    // 纯数字验证
    isSale: function(text) {
        if (!Pattern.sale.test(text)) {
            return true;
        }
    },

    // 汉字验证
    isChinese: function(text) {
        if (!Pattern.chinese.test(text)) {
            return true;
        }
    },

    // 电话验证
    isPhoneNumber: function(text) {
        if (!Pattern.phoneNumber.test(text)) {
            return true;
        }
    },

    // 手机验证
    isMobileNumber: function(text) {
        if(!Pattern.mobileNumber.test(text)) {
            return true;
        }
    },

    // 邮箱验证
    isEmail: function(text) {
        if (!Pattern.email.test(text)) {
            return true;
        }
    },

    // 身份证验证
    isId: function(text) {
        if (!Pattern.id.test(text)) {
            return true;
        }
    },

    // 特殊字符验证 test() 方法检索字符串中的指定值
    isContainSpecial : function (text) {
        if (!Pattern.containSpecial.test(text)) {
            return true;
        }
    },

    // 长度验证
    isPassLength : function (text) {
        if (text.length > 6 && text.length < 16) {
            return true;
        }
    },

    // 短信验证码长度验证
    isSmsVerification: function (text) {
        if (text.length == 6) {
            return true;
        }
    },

    // 密码验证 （字母或数字6-16位）
    ispass: function (text) {
        if (!Pattern.pass.test(text)) {
            return true;
        }
    }
}

/* 校验数据 */
function dataTest(dom, prompt, options) {
    var text = $(dom).val();
    var description = $(dom).attr('data-description');
    if ( $(dom).attr('data-required') == 'true' || ($(dom).attr('data-required') != 'true') ) {
        if (options.empty && Validate.isEmpty(text)) {
            displayMsg(prompt, description + options.empty, 2000);
            return false;
        } else if (options.id && Validate.isId(text)) {
            displayMsg(prompt, description + options.id, 2000);
            return false;
        } else if (options.mobileNumber && Validate.isMobileNumber(text)) {
            displayMsg(prompt, description + options.mobileNumber, 2000);
            return false;
        } else if (options.phoneNumber && Validate.isPhoneNumber(text)) {
            displayMsg(prompt, description + options.phoneNumber, 2000);
            return false;
        } else if (options.number && Validate.isNumber(text)) {
            displayMsg(prompt, description + options.number, 2000);
            return false;
        } else if (options.chinese && Validate.isChinese(text)) {
            displayMsg(prompt, description + options.chinese, 2000);
            return false;
        } else if (options.sale && Validate.isSale(text)) {
            displayMsg(prompt, description + options.sale, 2000);
            return false;
        }
    }
    return true;
}