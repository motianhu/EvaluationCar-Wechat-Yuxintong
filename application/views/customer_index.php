<?php
defined('BASEPATH') OR exit('No direct script access allowed');
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"> 
<html xmlns="http://www.w3.org/1999/xhtml" lang="zh-cn"> 
    <head>
        <title>在线客服</title>
    </head>
    <body style="background-color:#0069b7">
        <?php  
            $s="http://www.xiniuche.com:8080/carWeb/view/external/chat/chatlist.php?clientUser=".$englishName;
            header("Location:".$s);?>
    </body>
</html>
