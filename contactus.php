<?
#index.php
?>
<?
include('./includes/header.php');
include('./includes/menu.php');
?>
  <tr>
    <td colspan="4"><table width="1000" border="0" cellspacing="0" cellpadding="0">
      <tr>
        <td width="1"><img src="images/spacer.gif" width="1" height="344" /></td>
        <td width="999" valign="top" bgcolor="#FFFFFF">
		  <table width="1000" border="0" cellspacing="0" cellpadding="0">
			<tr>
			  <td colspan="7"><img src="images/spacer.gif" width="1" height="10"></td>
			  </tr>
			<tr>
			  <td width="37"><img src="images/spacer.gif" width="1" height="300" /></td>
			  <td colspan="5" valign="top" class="bodyText">
<table width="100%" border="0" cellspacing="1" cellpadding="1">
              <tr>
                <td width="31%" valign="top">
                	<table width="100%" border="0" cellspacing="0" cellpadding="0">
                        <tr>
                          <td width="108" align="center" valign="middle"><img src="images/00_home_38.jpg" width="81" height="82" alt="" /></td>
                          <td width="10"><img src="./images/spacer.gif" height="100" width="5"/></td>
                          <td width="218" align="center" valign="top" class="bodyText"><p class="contactHeading" style="color:#737B83">Contact Us</p>
                            <br /><p class="Heading">+91-44-42605439<br/>+91-9840711124<br/>info@innovtrack.com</p>
                          </td>
                            <td width="5"><img src="./images/spacer.gif" height="100" width="5"/></td>
                        </tr>
						<tr>
                          <td width="108" align="center" valign="middle"><img src="images/mail.png" width="81" height="82" alt="" /></td>
                          <td width="10"><img src="./images/spacer.gif" height="100" width="5"/></td>
                          <td width="218" align="center" valign="top" class="bodyText"><br>
							Sales : <span class="mail"><a href="mailto:sales@innovtrack.com">sales@innovtrack.com</a></span>
							Support : <span class="mail"><a href="mailto:support@innovtrack.com">support@innovtrack.com</a></span>
                          </td>
                            <td width="5"><img src="./images/spacer.gif" height="100" width="5"/></td>
                        </tr>
                    </table>
                </td>
                <td width="39%" valign="top">
				  <form id="the_form" method="post" action="./includes/mailing.php">
				  <table width="100%" border="0" cellspacing="1" cellpadding="1">
					<tr>
					  <td><p class="contactHeading" style="color:#737B83">Contact Form</p></td>
					</tr>
					<tr>
					  <td>
						  <table width="100%" border="0" cellspacing="3" cellpadding="2">
								<tr>
								  <td align="left"><input type="text" name="name" id="name" class="nameBox"/></td>
								</tr>
								<tr>
								  <td align="left"><input type="text" name="phone" id="phone" class="phoneBox"/></td>
							  </tr>
								  <tr>
									  <td align="left"><input type="text" name="email" id="email" class="emailBox"/></td>
								  </tr>
								  <tr>
									  <td align="left"><input type="text" name="subject" id="subject" class="subjectBox"/></td>
								  </tr>
								  <tr>
									  <td align="left"><textarea name="message" id="message" rows="6" class="messageBox" cols="100"></textarea></td>
								  </tr>
								<tr>
									<td align="right" style="padding-right:30px">
									  <table border="0" cellspacing="0" cellpadding="0">
												  <tr>
													  <td class="mainText" height="40" style="cursor:pointer">
														  <div id="showmsg" style="float:left; height:35px;overflow:hidden;overflow-x:hidden;">
															  <img id="imgid" src="./images/sending.gif" title="" width="21" height="21" style="visibility:hidden" border="0"/>
															  <label id="loading" valign ="top" style="visibility:hidden">Sending Mail ... Please wait!</label>
														  </div>
													  </td>
													  <td width="25" style="cursor:pointer"><img src="./images/btnclear.png" title="Clear Inputs" width="57" height="25" border="0"/></td>
													  <td width="5"><img src="./images/spacer.gif" title="" width="5" height="1" border="0"/></td>
													  <td width="25" style="cursor:pointer" onclick="sendMail()"><img src="./images/btnsend.png" title="Send Mail" width="57" height="25" border="0"/></td>
												  </tr>

											  </table>
									</td>
								</tr>
							  </table>
					  </td>
					</tr>
				  </table>
				  </form>
				</td>
                <td width="30%" valign="top">
				  <table width="100%" border="0" cellspacing="1" cellpadding="1">
					<tr>
					  <td colspan="2"><p class="contactHeading" style="color:#737B83">Our Coordinates</p></td>
					</tr>
					<tr>
					  <td colspan="2">
						  <span class="address">Office Address</span><br>
						  <p class="bodyText">
							Old No.42, New No.52,<br/>
							Giri Road, T Nagar,<br/>
							Near GN Chetty Road,<br/>
							Chennai - 600 017,<br/>
							Tamil Nadu.<br/>
						  </p><br>
						  <!--<span class="address">Pickup and Delivery </span><br>
						  <p>
							  Pyco Linux Labs<br>
							  No 177 Royapettah High Road,<br>
							  Mylapore,<br>
							  Chennai - 600 004
						  </p>-->
					  </td>
					</tr>
					<tr>
					  <td>&nbsp;</td>
					  <td>&nbsp;</td>
					</tr>
				  </table>
				</td>
              </tr>
            </table>
			  </td>
			  <td width="37"><img src="images/spacer.gif" width="1" height="300" /></td>
			</tr>

			<tr>
			  <td>&nbsp;</td>
			  <td width="275">&nbsp;</td>
			  <td width="50">&nbsp;</td>
			  <td width="275">&nbsp;</td>
			  <td width="50">&nbsp;</td>
			  <td width="275">&nbsp;</td>
			  <td width="37">&nbsp;</td>
			</tr>


		  </table>
		</td>
      </tr>
    </table></td>
  </tr>
<?
include('./includes/footer.php');
?>

<!--  <tr>
    <td>
    <table width="1000" border="0" cellspacing="0" cellpadding="0">
		<tr>
			<td align="left" valign="top">

			</td>
	  </tr>
    </table>

	</td>
  </tr>-->
  <?
 // include('./includes/footer.php');
  ?>
