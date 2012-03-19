<?php
	$file_name=$_REQUEST["filename"];
	//echo $files;
	
	$file_dir = "";
	if (!file_exists($file_dir . $file_name)) { //检查文件是否存在
		echo " 文件 ".$file_dir . $file_name."  找不到";
		exit;
	} else {

		$file = fopen($file_dir . $file_name,"r"); // 打开文件
		// 输入文件标签
		Header("Content-type: application/octet-stream");
		Header("Accept-Ranges: bytes");
		Header("Accept-Length: ".filesize($file_dir . $file_name));
		Header("Content-Disposition: attachment; filename=" . $file_name);
		// 输出文件内容
		echo fread($file,filesize($file_dir . $file_name));
		fclose($file);
		exit;

	}
?>