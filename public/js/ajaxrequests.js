function sendLogin()
{
    let xhttp = new XMLHttpRequest();
    
    xhttp.onreadystatechange = function() {

        if (this.readyState == 4 && this.status == 200) 
        {
            json_login = JSON.parse(this.responseText);
            if(!json_login['success'])
            {
                document.getElementById('status').style.display = 'block';
                return;
            }
            
            window.location.href = "/admin";
        }
    }

    let params = 'username=' + document.getElementById('username').value + '&pass=' + document.getElementById('pass').value;
    xhttp.open("POST", "/login", true);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.send(params); 
}

function sendContact()
{
    let xhttp = new XMLHttpRequest();
    
    xhttp.onreadystatechange = function() {

        if (this.readyState == 4 && this.status == 200) 
        {
           var response = JSON.parse(this.responseText);
           if(response['status'])
                document.getElementById('status').style.display = 'block';


            document.getElementById('email').value = '';
            document.getElementById('content').value = '';
        }
    }

    let params = 'email=' + document.getElementById('email').value + '&content=' + document.getElementById('content').value;
    xhttp.open("POST", "/contact", true);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.send(params); 
}