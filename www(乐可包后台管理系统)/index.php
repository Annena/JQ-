<?php

/******************************

	首页调度程序
	
	版本：1.0
	编写：红蚂蚁开发小组
	日期：2015-11-11

******************************/

//定义全局部署路径
DEFINE('PATH_HOST',	$_SERVER['DOCUMENT_ROOT'] . '/..');						//项目根路径
DEFINE('PATH_WWW',	$_SERVER['DOCUMENT_ROOT'] . '/../../..');				//全局根路径

//定义404页面地址
DEFINE('PATH_404',	'/html/404.html');	

try {
		
	//载入全局路由
	include_once(PATH_WWW . '/global/lib/route.php');
	
	ROUTE::go();
	
} catch (Exception $e) {
	
	header("location: " . PATH_404); exit;
	
}

?>