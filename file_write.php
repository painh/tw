<?php
if($_SERVER['REMOTE_ADDR'] != "127.0.0.1")
	exit;

echo file_put_contents ( $_REQUEST['filename'] , $_REQUEST['contents']);


