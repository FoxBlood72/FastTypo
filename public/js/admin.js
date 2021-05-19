function logout()
{
    let xhttp = new XMLHttpRequest();
    
    xhttp.onreadystatechange = function() {

        if (this.readyState == 4 && this.status == 200) 
        {
            console.log(this.responseText);
            json_login = JSON.parse(this.responseText);
            if(json_login['success'])
                window.location.href = "/";
        }
    }

    xhttp.open("POST", "/logout", true);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.send(); 
}


function setAdminPanel()
{
    let xhttp = new XMLHttpRequest();
    
    xhttp.onreadystatechange = function() {

        if (this.readyState == 4 && this.status == 200) 
        {
            document.getElementById('content').innerHTML = this.responseText;
        }
    }

    xhttp.open("GET", "/admin/panel", true);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.send(); 
}