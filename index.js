const express = require('express');
const session = require('express-session');
const fs = require('fs');
const app = express();
const port = 3000;
const sessionOpt = {
  secret: 'mysecret for hash function',
  cookie: {},
  resave: false,
  saveUninitialized: false
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session(sessionOpt));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.post('/contact', (req, res) => {
  const args = ['email', 'content'];
  for(const param of args)
  {
    if(!(param in req.body))
    {
      res.send('{status: false}');
      return;
    }
  }

  const contact = {
    email: req.body.email,
    content: req.body.content,
    time: Date.now()
  }
  
  const contacts_path = __dirname + '/private/contacts.json';
  const contactDataJson = fs.readFileSync(contacts_path);
  const json_data = JSON.parse(contactDataJson);
  json_data["contacts"].push(contact);
  fs.writeFileSync(contacts_path, JSON.stringify(json_data));

  res.send('{ "status" : true }');
});

app.post('/login', (req, res) => {
  if(req.session.adminConnected)
  {
    res.send('{ "success" : true }');
    return;
  }

  const args = ['username', 'pass'];
  for(const arg of args)
  {
    if(!(arg in req.body))
    {
      
      res.send('{ "success" : false }');
      return;  
    }
  }

  const credential_path = __dirname + '/private/credentials.json';
  const credentialDataJson = fs.readFileSync(credential_path);
  const json_credentials = JSON.parse(credentialDataJson);

  if(req.body.username === json_credentials['username'] && req.body.pass === json_credentials['pass'])
  {
    req.session.adminConnected = true;
    res.send('{ "success" : true }');
    return;
  }

  res.send('{ "success" : false }');
});


app.get('/admin', (req, res) => {
  if(!req.session.adminConnected)
  {
    res.send('Not an admin, Please login!');
    return;
  }

  res.render(__dirname + '/views/admin.ejs');
});

// app.get('/admin/getcontacts', (req, res) => {
//   if(!req.session.adminConnected)
//   {
//     res.send('Not an admin, Please login!');
//     return;
//   }

//   res.sendFile(__dirname + '/private/contacts.json');
// });

app.get('/admin/panel', (req, res) => {
  if(!req.session.adminConnected)
  {
    res.send('Not an admin, Please login!');
    return;
  }

  const data = fs.readFileSync(__dirname + '/private/contacts.json');
  const json_contacts = JSON.parse(data);
  res.render(__dirname + '/views/adminpanel.ejs', 
  {
    contacts: json_contacts['contacts']
  });
});


app.post('/logout', (req, res) => {
  if(req.session.adminConnected)
    req.session.destroy();

  res.send('{ "success" : true  }')
});




app.get('*', function(req, res){
  res.status(404).sendFile(__dirname + '/public/404.html');
});


app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
})