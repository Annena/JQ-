//var index       = 'http://merapi.lekabao.net';                   // 系统地址

var bus = location.href.split('//')[1].split('.')[0];
var index = 'http://admin.lekabao.net';

var AdminUrl = {

    userCid: index +            '/user/cid.php',                    // 获取cid
    userLogin: index +          '/user/login.php',                  // 登录接口
    userInfo: index +           '/user/info.php',                   // 登录页面获取商户基本信息
    userSso: index +            '/user/sso.php',                    // 登录并选择本店接口
    staffPwdUpdate: index +     '/staff/pwd_update.php',            // 修改密码
    userLogout: index +         '/user/logout.php',                 // 退出登录

    user_brand: index +         '/user/brand.php',                  // 切换商户接口
    userPermit: index +         '/user/permit.php',                 // 店铺选择页面，获取显示所有店铺
    userShop: index +           '/user/shop.php',                   // 选门店的接口将门店提交给服务器
    brandList: index +          '/user/brand_list.php',             //集团商户列表

    userMenu: index +           '/user/menu.php',                   // 左侧菜单项

    infoCompanyInfo: index +    '/info/company_info.php',           // 获取商户信息
    infoCompanyInfoUpdate: index + '/info/company_info_update.php', // 商户信息修改

    shopShopInfo: index +       '/shop/shop_info.php',              // 门店信息

    infoCardInfo: index +       '/info/card_info.php',              // 会员卡信息
    infoCardInfoUpdate: index + '/info/card_info_update.php',       // 会员卡信息修改

    shopAreaShopList: index +   '/shop/area_shop_list.php',         // 搜索门店列表
    shopShopAdd: index +        '/shop/shop_add.php',               // 添加门店
    shopShopUpdate: index +     '/shop/shop_update.php',            // 修改门店

    download_zip: index +       '/download/zip.php',                // 门店一键安装包下载的接口和参数
    tableList: index +          '/shop_table/table_list.php',       // 桌台列表
    tableTableAdd: index +      '/shop_table/table_add.php',        // 桌台添加
    tableTableUpdate: index +   '/shop_table/table_update.php',     // 桌台修改
    tableTableDel: index +      '/shop_table/table_del.php',        // 桌台删除
    printerShopPrinter: index + '/printer/shop_printer.php',        // 打印机列表

    regionList: index +         '/shop_region/region_list.php',     // 查询区域列表
    regionAdd: index +          '/shop_region/region_add.php',      // 添加区域的接口
    regionUpdate: index +       '/shop_region/region_update.php',   // 修改区域的接口
    regionDel: index +          '/shop_region/region_del.php',      // 禁用/删除区域

    shopShopList: index +       '/shop/shop_list.php',              // 显示所有正常的门店
    shopDepotList: index +      '/staff/depot_list.php',            // 显示所有仓库的门店
    currencyCard: index +      '/info/currency_card.php',            // 显示所有仓库的门店
    consume: index +            '/stored_currency/consume.php',     //储值通用消费明细
    refund: index +             '/stored_currency/refund.php',      //储值通用退款明细
    sumList: index +            '/stored_currency/sum.php',         //储值通用对账

    staffStaffList: index +     '/staff/staff_list.php',            // 搜索员工列表
    staffStaffAdd: index +      '/staff/staff_add.php',             // 添加员工
    staffStaffUpdate: index +   '/staff/staff_update.php',          // 修改员工

    shopPositionList: index +   '/shop/position_list.php',          // 省份、城市、区域、门店

    staffStaffStatusList: index +       '/staff/staff_status_list.php',     // 员工身份列表
    staffStaffStatusAdd: index +        '/staff/staff_status_add.php',      // 员工身份添加
    staffStaffStatusPermList: index +   '/staff/status_permit_list.php',     // 员工身份权限
    staffStaffStatusUpdate: index +     '/staff/staff_status_update.php',   // 员工身份修改
    staffStaffStatusDel: index +        '/staff/staff_status_del.php',      // 员工身份删除

    menuMenuTypeList: index +           '/menu/menu_type_list.php',         // 菜品分类列表
    menuAllMenuTypeList: index +        '/menu/all_menu_type_list.php',     // 菜品所有分类列表
    staffMenuTypeAdd: index +           '/menu/menu_type_add.php',          // 菜品分类添加
    staffMenuTypeUpdate: index +        '/menu/menu_type_update.php',       // 菜品分类修改
    menuMenuTypeDel: index +            '/menu/menu_type_del.php',          // 菜品分类删除
    storeUpdate: index +                '/menu/menu_update.php',            // 门店菜品修改

    menuMenuAttributeList: index +      '/menu/menu_attribute_list.php',    // 菜品属性列表
    menuAllMenuAttributeList: index +   '/menu/all_menu_attribute_list.php',// 菜品所有属性列表
    staffMenuAttributeAdd: index +      '/menu/menu_attribute_add.php',     // 菜品属性添加
    staffMenuAttributeUpdate: index +   '/menu/menu_attribute_update.php',  // 菜品属性修改
    menuMenuAttributeDel: index +       '/menu/menu_attribute_del.php',     // 菜品属性删除

    menuMenuList: index +       '/menu/menu_list.php',              // 菜品列表
    menuMenuAdd: index +        '/menu/menu_store_add.php',         // 菜品添加
    menuMenuUpdate: index +     '/menu/menu_store_update.php',      // 菜品修改
    menuMenuSubmit: index +     '/menu/menu_submit.php',

    platformList: index +       '/platform_menu/menu_list.php',     // 外卖菜品关联列表
    platformAdd: index +        '/platform_menu/menu_add.php',      // 外卖菜品关联添加
    platformUpdate: index +     '/platform_menu/menu_update.php',   // 外卖菜品关联修改
    platformDelete: index +     '/platform_menu/menu_delete.php',   // 外卖菜品关联删除

    menuMenuTypeSort: index +   '/menu/menu_type_sort.php',         // 菜品分类排序
    menuMenuSort: index +       '/menu/menu_sort.php',              // 菜品排序

    menuShopMenuUpdate: index + '/menu/shop_menu_update.php',       // 门店菜品状态修改

    infoIntegralLeiji: index +  '/info/integral.php',               // 积分管理
    infointegralInfo: index +   '/info/integral_info.php',          // 获取积分数据

    payTypePayTypeList: index + '/pay_type/pay_type_list.php',      // 支付方式列表
    payTypePayTypeAdd: index +  '/pay_type/pay_type_add.php',       // 支付方式添加
    payTypePayTypeUpdate: index +'/pay_type/pay_type_update.php',   // 支付方式修改
    pay_type_sort: index +      '/pay_type/pay_type_sort.php',      // 支付方式排序

    payTypeShopPayTypeUpdate: index +   '/pay_type/shop_pay_type_update.php',// 门店支付方式修改

    voucherVoucherList: index +         '/voucher/voucher_list.php',        // 抵用劵列表
    voucherVoucherAdd: index +          '/voucher/voucher_add.php',         // 抵用劵添加
    voucherVoucherUpdate: index +       '/voucher/voucher_update.php',      // 抵用劵修改
    infoVoucherTriesLimit: index +      '/info/voucher_tries_limit.php',    // 抵用劵每日领用限制查询
    infoVoucherTriesLimitUp: index +    '/info/voucher_tries_limit_up.php', // 抵用劵每日领用限制修改

    storetStoredList: index +   '/stored/stored_list.php',          // 储值卡列表
    storedStoredAdd: index +    '/stored/stored_add.php',           // 储值卡添加
    storedStoredUpdate: index + '/stored/stored_update.php',        // 储值卡修改

    promoPromoList: index +     '/promo/promo_list.php',            // 优惠方案列表
    promoPromoAdd: index +      '/promo/promo_add.php',             // 优惠方案添加
    promoPromoUpdate: index +   '/promo/promo_update.php',          // 优惠方案修改

    commentCommentList: index +         '/comment/comment_list.php',        // 订单评论列表
    commentSearchCommentList: index +   '/comment/search_comment_list.php', // 订单评论搜索
    commentCommentAdd: index +          '/comment/comment_add.php',         // 订单评论添加回复
    commentCommentDel: index +          '/comment/comment_del.php',         // 订单评论修改删除

    newsNewsList: index +       '/news/news_list.php',              // 新闻列表
    newsNewsAdd: index +        '/news/news_add.php',               // 新闻添加
    newsNewsUpdate: index +     '/news/news_update.php',            // 新闻修改
    newsNewsInfo: index +       '/news/news_info.php',              // 读取单个信息信息

    memberUserInfo: index +     '/member/user_info.php',            // 会员信息按用户搜索
    memberUserListDate: index + '/member/user_list.php',            // 会员列表按日期搜索

    //createQuickPay: index + '/journal/create_quick_pay.php',      // 快捷支付打印二维码
    //journalList: index + '/journal/journal_list.php',             // SOUSUO流水信息列表

    quickPayCreate: index +     '/quick_pay/create.php',            // 创建快捷支付订单
    quickPayList: index +       '/quick_pay/list.php',              // 门店当天的快捷支付订单接口
    quickPayUse: index +        '/quick_pay/use.php',               // 使用快捷支付订单

    storedSellList: index +     '/stored_sell/list.php',            // 读取可售卖的储值码列表
    storedSellPay: index +      '/stored_sell/pay.php',             // 储值卡售卖接口
    storedSellDel: index +      '/stored_sell/del.php',             // 储值卡作废接口

    verificationCode: index +   '/order/sms.php',                   // app会员注册获取短信验证码
    verificatCode: index +      '/order/sms.php',                   // 获取短信验证码接口
    registerLogin: index +      '/member/register.php',             // 会员注册接口
    sellingStore: index +       '/stored_sell/pay.php',             // 储值码售卖接口
    memberAuthority: index +    '/member_authority/pay.php',        // 授权卡售卖接口
    BalanceDeduct: index +      '/member/amount_minus.php',         // 会员信息详情余额扣减
    userRecord: index +         '/member/user_record.php',          // 会员记录接口

    entity_card_register: index +       '/entity_card/register.php',    // 实体卡注册
    entity_card_info: index +           '/entity_card/info.php',        // 实体卡详情
    entity_card_amount_minus: index +   '/entity_card/amount_minus.php',// 实体卡余额扣减
    entity_card_record: index +         '/entity_card/record.php',      // 实体卡记录（消费，储值记录）
    entity_card_list: index +           '/entity_card/list.php',        // 实体卡列表
    entity_card_freeze: index +         '/entity_card/freeze.php',      // 实体卡冻结/解冻

    memberUserDiscountUpdate: index +   '/member/user_discount_update.php', // 会员折扣信息修改

    printerPrinterList: index +         '/printer/printer_list.php',        // 打印机列表
    printerMenuPrinterList: index +     '/printer/menu_printer_list.php',   // 正常的打印机列表
    printerPrinterAdd: index +          '/printer/printer_add.php',         // 打印机添加
    printerPrinterUpdate: index +       '/printer/printer_update.php',      // 打印机修改
    printerPrinterDel: index +          '/printer/printer_del.php',         // 打印机删除

    storedCountFirst: index +   '/stored_count/first.php',          // 储值统计

    payCountFirst: index +      '/pay_count/first.php',             // 收银统计

    promoCountFirst: index +    '/promo_count/first.php',           // 优惠方案统计

    quickpayCountFirst: index + '/quick_pay_count/first.php',       // 快捷支付统计

    menuCountFirst: index +     '/menu_count/first.php',            // 菜品统计

    propertytFirst: index +     '/menu_count/attribute_first.php',  // 菜品属性统计

    packageFirst: index +       '/menu_count/set_menu_first.php',   //套餐统计

    sellRecord: index +         '/stored/sell_record.php',          // 储值卡售卖记录

    storedCountSellRecord: index + '/stored_count/sell_record.php', // 储值统计

    storedQuotaInfo: index +    '/stored/stored_quota_info.php',    //读取当日可使用的储值额度

    setStoredQuota: index +     '/stored/set_stored_quota.php',     //设置当日可使用额度

    setDiscountInfo: index +    '/member/set_discount_info.php',    //总部发卡员修改接口

    recordCheckupRecord: index + '/record/checkup_record.php',      // 日结清机记录
    recordCheckupInfo: index +  '/record/checkup_info.php',         // 清机记录详情

    recordPayRecord: index +    '/record/pay_record.php',           // 收银记录
    recordPayInfo: index +      '/record/pay_info.php',             // 收银记录详情

    pay_count_wx_order_check: index +   '/pay_count/wx_order_check.php',    // 支付对账列表
    pay_count_wx_order_download: index + '/pay_count/wx_order_download.php',// 支付对账下载

    money: index +              '/money_count/money.php',           // 退款汇总
    refundInfo: index +         '/money_count/refund_info.php',     // 退款详情

    orderRecord: index +        '/record/order_record.php',         // 退单列表
    backOrderInfo: index +      '/record/back_order_info.php',      // 退单返回详情

    menuCountBackMenu: index +  '/menu_count/back_menu.php',        // 退菜记录

    memberAuthorityPay: index + '/member_authority/pay.php',        // 授权会员码售卖
    memberAuthorityDel: index + '/member_authority/del.php',        // 授权会员吗作废
    userCountMemberAuthorization: index + '/user_count/member_authorization.php', // 授权会员统计

    storedCountDownload: index + '/stored_count/download.php',      // 储值统计下载
    menuCountDownload: index +  '/menu_count/download.php',         // 菜品统计下载
    packageDownload: index +    '/menu_count/set_menu_download.php',// 套餐统计下载
    propertyDownload: index +   '/menu_count/attribute_download.php',// 菜品属性统计下载
    payCountDownload: index +   '/pay_count/download.php',          // 收银统计下载
    userCountDownload: index +  '/user_count/download.php',         // 授权会员统计下载

    storedCountUserStatistics: index +      '/stored_count/user_statistics.php', // 储值统计里账户统计
    oldStoredCountUserStatistics: index +   '/stored_count/history_user_statistics.php', // 储值统计里账户统计

    memberUserFreeze: index +   '/member/user_freeze.php',          // 用户冻结和解冻接口

    payTypeWxpay: index +       '/pay_type/wxpay.php',              // 微信支付列表
    payTypeUpdateWxpay: index + '/pay_type/update_wxpay.php',       // 微信支付修改

    payTypeAlipay: index +      '/pay_type/alipay.php',             // 支付宝支付列表
    payTypeUpdateAlipay: index + '/pay_type/update_alipay.php',     // 支付宝支付修改

    staffStaffStatusShopList: index +       '/staff/staff_status_shop_list.php', // 门店服务员列表
    menuCountWaiterStatistics: index +      '/menu_count/waiter_statistics.php', // 服务员销售统计
    menuCountWaiterStatisticsDownload: index + '/menu_count/waiter_statistics_download.php', // 服务员销售统计下载

    menuCountBackMenuDownload: index +      '/menu_count/back_menu_download.php', // 退菜统计下载

    infoTableList: index +      '/info/table_list.php',             // 桌台二维码查询桌台信息
    user_status_list: index +   '/staff/user_status_list.php',      // 员工身份查询
    voucher: index +            '/voucher/first.php',               // 抵用券领取查询

    orderInfo: index +          '/order/info.php',                  // 用户储值支付，读取结账单信息
    orderPay: index +           '/order/pay.php',                   // 用户储值支付，支付结账单
    orderSms: index +           '/order/sms.php',                   // 用户储值支付，发生验证码
    promotiondian: index +      '/commission_count/shop.php',       // 门店促销报表
    promotionUsre: index +      '/commission_count/user.php',       // 人员促销报表
    promotionMenu: index +      '/commission_count/menu.php',       // 菜品促销报表

    promotionDownload: index +  '/commission_count/download.php',   // 下载人员促销报表

    special: index +            '/menu/special_menu.php',           // 打包盒
    takeawayCount: index +      '/takeaway_count/shop.php',         // 外卖统计表
    member_market: index +      '/member_market/list.php',          // 会员营销查询
    member_marketAdd: index +   '/member_market/add.php',           // 会员营销添加
    market_status: index +      '/member_market/update_status.php', // 会员营销启用 / 停用的接口
    member_marketDelete: index + '/member_market/delete.php',       // 会员营销删除的接口
    member_marketUpdate: index + '/member_market/update.php',       // 会员营销修改的接口

    // 会员统计接口
    member_by_gender: index +   '/member/sex_count.php',            // 按性别年龄
    member_by_store: index +    '/member/stored_count.php',         // 按储值会员
    member_by_authorization: index + '/member/authority_count.php', // 按授权会员
    member_by_discount: index + '/member/discount_count.php',       // 按折扣会员
    member_by_active: index +   '/member/user_pay_count.php',       // 按会员活跃
    member_by_new: index +      '/member/new_count.php',            // 按新增会员


    materielCategoryList: index + '/depot_api/category_list.php',   // 物料分类列表
    materielMaterielList: index + '/depot_api/materiel_list.php',   // 物料列表

    menu_count_day_status: index +          '/menu_count/day_status.php',           // 营业报表列表
    menu_count_day_status_download: index + '/menu_count/day_status_download.php',  // 营业报表下载
    menu_count_day_status_print: index +    '/menu_count/day_status_print.php'      // 打印报表列表
};