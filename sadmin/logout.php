<?php
#logout.php
session_start();
session_destroy();
?>
<script language="javascript">
window.location.href="./index.php";
</script>
