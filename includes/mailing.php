<?PHP
	if($_POST)
	{
		$to = "sivakumar@innovmox.com";
		$name = $_POST['name'];
		$email = $_POST['email'];
		$mobile = $_POST['phone'];
		$message = $_POST['message'];
		$subject = $_POST['subject'];
		$header = "From:".$email;
		$retval = mail($to,$subject,$message,$header);
		if($retval == 1 )
		{
			echo "Your message has been sent..";
		}
		else
		{
			echo "Messsge sending failed..Please try again..";
		}
	}
?>
