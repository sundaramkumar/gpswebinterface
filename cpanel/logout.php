<?php
#logout.php
session_start();
setcookie( "cook", "", time()- 60, "/","", 0);
session_destroy();
?>
<script language="javascript">

window.location.href="./index.php";
</script>
