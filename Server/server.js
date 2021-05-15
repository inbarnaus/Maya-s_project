const express = require('express')
const app = express()
// const port = 8080
const cors = require('cors');
var bodyParser = require('body-parser')
app.use(express.json());
var {User} = require('./mongoose')
var {Project} = require('./mongoose')
var bcrypt = require('bcrypt')
app.use(express.static('public'))
app.use(cors());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.post('/form1', (req, res)=>{
  if(req.body.tot_days > 0){
    const project = new Project({
      tot_days: req.body.tot_days,
      cost: req.body.cost,
      winter: req.body.winter,
      dis_tractor_days: req.body.dis_tractor_days,
      dis_bagi_days: req.body.dis_bagi_days,
      dis_track: req.body.dis_track,
      dis_track_days: req.body.dis_track_days,
      dis_workers: req.body.dis_workers,
      dis_workers_days: req.body.dis_workers_days,
      basement: req.body.basement,
      dig_tractor: req.body.dig_tractor,
      dig_tractor_days: req.body.dig_tractor_days,
      dig_digers: req.body.dig_digers,
      dig_digers_days: req.body.dig_digers_days,
      dig_track: req.body.dig_track,
      dig_track_days: req.body.dig_track_days,
      pou_iron: req.body.pou_iron,
      pou_iron_days: req.body.pou_iron_days,
      pou_workers: req.body.pou_workers,
      pou_workers_days: req.body.pou_workers_days
    }).save();
    res.send({succeded: true})
  }
})

function calculateCost(project){
  console.log(project)
  const tractor_sum = project.dis_tractor_days + project.dig_tractor*project.dig_tractor_days;
  const tracks_sum = project.dis_track*project.dis_track_days + project.dig_track*project.dig_track_days;
  const workers = project.dis_workers*project.dis_workers_days + project.pou_workers*project.pou_workers_days;
  const iron = project.pou_iron*project.pou_iron_days;
  return 2500*tractor_sum +
              5000*project.dis_bagi_days +
              1500*tracks_sum + 
              1000*workers + 
              1200*iron
}

app.post('/form2', (req, res)=>{
  if(req.body.tot_days === -1) {
    Project.find({winter: req.body.winter}, (err,obj)=>{
      if(obj !== undefined){
        //calculating cost
        const cost_prev_projects = obj.map(item => item.cost- calculateCost(item))
        const days = obj.map(item=> item.tot_days)
        const avg_cost = cost_prev_projects.reduce((a, b)=> a + b, 0)/obj.length
        const cost = avg_cost + calculateCost(req.body)
        
        //calculating days
        const total_days = req.body.dis_track_days + req.body.dis_tractor_days + req.body.dis_workers_days +
                            req.body.dis_bagi_days + req.body.dig_digers_days + req.body.dig_track_days + 
                            req.body.dig_tractor_days + req.body.pou_iron_days + req.body.pou_workers_days;
        // if(req.body.basement === 'true')
        //   total_days = total_days + 10
        res.send({days: total_days, cost: cost})
      }
    })
  }
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