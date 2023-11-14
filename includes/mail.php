<?PHP
	 require_once("class.phpmailer.php");
    if($_POST)
	 {  
    	$name = $_POST['name'];
		$email = $_POST['email'];
		$mobile = $_POST['phone'];
		$message = $_POST['message'];
		$subject = $_POST['subject'];
			
      $mail = new PHPMailer();
      $mail->From = $email;
      $mail->FromName = $name;
      $mail->AddAddress('sivakum@innovmox.com');
      $mail->AddReplyTo($email);
      $mail->WordWrap = 50;// set word wrap
      //now Attach file with mail
      //$mail->AddAttachment($full_path);
      //$Email_msg="Print this Image:";
      $mail->Body = $message;
      $mail->IsHTML(false);// send as HTML
      $mail->Subject = $subject;
      if(!$mail->Send())
      {
        echo "Message was not sent <p>";
        echo "Mailer Error: " . $mail->ErrorInfo;
        exit;
        }
        echo "Message has been sent";
	}
?>
