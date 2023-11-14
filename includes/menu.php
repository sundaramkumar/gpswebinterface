<?
#menu.php
$curpage = substr($_SERVER["SCRIPT_NAME"],strrpos($_SERVER["SCRIPT_NAME"],"/")+1);
?>
  <tr>
    <td colspan="4" bgcolor="#2D3943">
      <table width="1000" border="0" cellspacing="0" cellpadding="0">
        <tr>
          <td width="1"><img src="images/spacer.gif" width="1" height="51" /></td>
          <td width="999" align="center">
            <table width="965" border="0" cellspacing="0" cellpadding="0">
              <tr>
                <td background="images/index_17.jpg" class="<? if($curpage == "tracking.php") echo 'menuTextSelected'; else echo 'menuText'; ?>" onclick="javascript: window.location.href='./tracking.php'; ">Tracking</td>
                <td width="1"><img src="images/index_15.jpg" width="1" height="51" /></td>
                <td background="images/index_17.jpg" class="<? if($curpage == "products.php") echo 'menuTextSelected'; else echo 'menuText'; ?>" onclick="javascript: window.location.href='./products.php'; ">Products</td>
                <td width="1"><img src="images/index_15.jpg" width="1" height="51" /></td>
                <td background="images/index_17.jpg" class="<? if($curpage == "features.php") echo 'menuTextSelected'; else echo 'menuText'; ?>" onclick="javascript: window.location.href='./features.php'; ">Features</td>
                <td width="1"><img src="images/index_15.jpg" width="1" height="51" /></td>
                <td background="images/index_17.jpg" class="menuText" onclick="javascript: openAWindow('http://122.165.81.219/cpanel/cpanel.php','track',800,600,true); ">Login</td>
                <td width="1"><img src="images/index_15.jpg" width="1" height="51" /></td>
                <td background="images/index_17.jpg" class="<? if($curpage == "aboutus.php") echo 'menuTextSelected'; else echo 'menuText'; ?>" onclick="javascript: window.location.href='./aboutus.php'; ">About Us</td>
                <td width="1"><img src="images/index_15.jpg" width="1" height="51" /></td>
                <td background="images/index_17.jpg" class="<? if($curpage == "contactus.php") echo 'menuTextSelected'; else echo 'menuText'; ?>" onclick="javascript: window.location.href='./contactus.php'; ">Contact Us</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>
  <tr>
    <td colspan="4" background="./images/flashbg_20.jpg" bgcolor="#ffffff"><!--bgcolor="#D6E0E7"-->
      <table width="1000" border="0" cellspacing="0" cellpadding="0">
        <tr>
          <td width="1"><img src="images/spacer.gif" width="1" height="320" /></td>
          <td width="999" align="center" bgcolor="#D6E0E7">
            <object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
                      codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=8,0,0,24"
                      width="980" height="320">
                      <param name="movie" value="./images/innovtrack.swf" /
                      <param name="quality" value="high" />
                      <param name="menu" value="false" />
              <!--[if !IE]> <-->
              <object data="images/innovtrack.swf"
                         width="980" height="320" type="application/x-shockwave-flash">
                         <param name="quality" value="high" />
                         <param name="menu" value="false" />
                         <param name="pluginurl" value="http://www.macromedia.com/go/getflashplayer" />
               FAIL (the browser should render some flash content, not this).
              </object>
            </object>
          </td>
        </tr>
      </table>
      <!--<img src="images/index_19.jpg" width="1000" height="316" alt="" />-->
    </td>
  </tr>