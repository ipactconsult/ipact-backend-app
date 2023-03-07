const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require ('cors');
const fs = require('fs');
require("dotenv").config();
const app = express();
var options={
  key: fs.readFileSync('abels-key.pem'),
  cert: fs.readFileSync('abels-cert.pem')
}///mongodb://localhost:27017/
mongoose.connect('mongodb+srv://IPACT:IPACT2022@cluster0.yxlyy.mongodb.net/IPACT?retryWrites=true&w=majority',{
  useNewUrlParser : true,
  useUnifiedTopology: true,
  useCreateIndex : true,
  retryWrites:false
}, (err)=> {
  if(err) throw err;
  console.log("MongoDB connection established");
});

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  next();
});


app.use(express.json());

app.use(express.static(__dirname));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

  app.use('/header', require('./routes/header_route'));
  app.use('/service',require('./routes/service_route'));
  app.use('/about',require('./routes/about_route'));
  app.use('/developer',require('./routes/developer_route'));
  app.use('/user',require('./routes/user_route'));
  app.use('/contact',require('./routes/contact_route'));
  app.use('/feedback',require('./routes/feedback_route'));
  app.use('/contactform',require('./routes/contactform_route'));
  app.use('/project',require('./routes/project-route'));
  app.use('/admin',require('./routes/admin_route'));
  app.use('/partner',require('./routes/partner_route'));
  app.use('/subservice',require('./routes/subservice_route'));
  app.use('/squad',require('./routes/squad_route'));
  app.use('/taas',require('./routes/taas_route'));

