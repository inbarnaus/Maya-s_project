const express = require('express')
const app = express()
const port = 8080
const cors = require('cors');
var bodyParser = require('body-parser')
app.use(express.json());
var User = require('./mongoose')
var Project = require('./mongoose')
var bcrypt = require('bcrypt')

app.use(cors());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.post('/form1', (req, res)=>{
    console.log(req.body)
    res.send('true')
})

app.post('/signup', (req, res) => {
  if(req.body.firstName !=='' && req.body.lastName !=='' && req.body.email !=='' && req.body.password !==''){
    const user = new User({
      fname: req.body.firstName, 
      lname: req.body.lastName, 
      email: req.body.email, 
      password: req.body.password
    });
    User.find({email: req.body.email}, (err, obj)=>{
      if(obj.length == 0)
        user.save(function (err) {
          if (err) 
            return console.error(err);
          res.send({succeded: true})
        });
      else
        res.send({succeded: false})
    })
  }
})

app.post('/', (req, res) => {
  if(req.body.mail !== '' && req.body.password !== ''){
    User.find({email: req.body.email}, (err, obj)=>{
      if(obj.length != 0)
        bcrypt.compare(req.body.password, obj[0].password, (err, isMatch) => {
          res.send({succeded: isMatch})
        });
    })
  }
})

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8080;
}
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

app.set('port', process.env.PORT || port);