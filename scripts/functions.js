function sendMail(){
	name = document.getElementById('name').value;
	email = document.getElementById('email').value;
	mobile = document.getElementById('phone').value;
	message = document.getElementById('message').value;
	subject = document.getElementById('subject').value;
	var regMail = /^([_a-zA-Z0-9-]+)(\.[_a-zA-Z0-9-]+)*@([a-zA-Z0-9-]+\.)+([a-zA-Z]{2,3})$/;
	if(name=='')
	{
		alert("Please Enter Your Name");
		return false;
	}
	else if(regMail.test(email) == false)
	{
        alert("Valid Email Address");
		return false;
	}
	else if(mobile=='')
	{
		alert("Please Enter Your mobile no");
		return false;
	}
	else if(isNaN(mobile)||mobile.indexOf(" ")!=-1)
    {
		alert("Enter numeric value")
		return false; 
	}
	else if(mobile.length<6)
           {
                alert("Minimum Mobile No 6 characters");
                return false;
           }

	else if(message=='')
	{
		alert("Please Enter Your Message");
		return false;
	}
	else{
	    document.getElementById('the_form').submit();
	}

}
