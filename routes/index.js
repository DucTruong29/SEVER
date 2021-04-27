var express = require('express');
var router = express.Router();

  // var dbConnect = 'mongodb+srv://admin:admin@cluster0.l4cdo.mongodb.net/F8_Learn?retryWrites=true&w=majority'
var dbConnect = 'mongodb+srv://ductruong:@cluster0.dm4fh.mongodb.net/ductruong?retryWrites=true&w=majority'
const mongoose = require('mongoose');
mongoose.connect(dbConnect, {useNewUrlParser:true, useUnifiedTopology: true, useCreateIndex:true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!
  console.log('connected!!!!')
});

var multer  = require('multer')

var user = new mongoose.Schema({
  username: String,
  password: String,
  name: String,
  address: String,
  number_phone: String,
  avatar: String,
})


/* GET home page. */
router.get('/', function (req, res) {
  res.render('index');
});


// getUser
router.get('/getUser',function (req,res){
  var connectUsers = db.model('users', user);
  var baseJson = {
    errorCode : undefined,
    errorMessage : undefined,
    data : undefined
  }
  connectUsers.find({},function (err,users){
    if (err){
      baseJson.errorCode = 403
      baseJson.errorMessage = '403 Forbidden'
      baseJson.data= []
    }else {
      baseJson.errorCode = 200
      baseJson.errorMessage = 'OK'
      baseJson.data = users
      res.json(baseJson)
    }
  })
})


// Create User

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {

    cb(null, req.body.email+'.png')
  }
})

var upload = multer({ storage: storage
  , limits:{
    fileSize:1024*1024*10,
  }
});



router.post('/createUser', upload.single('avatar'), function (req, res) {
  var connectUsers = db.model('users', user);
  connectUsers({
    username: req.body.email,
    password: req.body.password,
    name: req.body.name,
    address: req.body.address,
    number_phone: req.body.number_phone,
    avatar:req.body.email+'.png',
  }).save(function (error) {
    if (error) {
      res.render('index', {action: 'Express Loi!!!!'});
    } else {
      res.render('index')
    }
  })

})



// Search user
router.get('/search',function (req,res){
  var connectUsers = db.model('users', user);
  var baseJson = {
    errorCode : undefined,
    errorMessage : undefined,
    data : undefined
  }
  connectUsers.find({},function (err,users){
    if (err){
      baseJson.errorCode = 403
      baseJson.errorMessage = '403 Forbidden'
      baseJson.data= []
    }else {
      baseJson.errorCode = 200
      baseJson.errorMessage = 'OK'
      baseJson.data = users
      res.render('search',{data: baseJson.data})
    }
  })
})



router.post('/findName',upload.single('avatar'),function (req,res){
  var connectUsers = db.model('users', user);
  connectUsers.find({name:req.body.name},(err,data) =>{
    if (err){
      console.log(err);
    }else {
      res.render('search',{data:data});
    }
  })
})

//delete user

router.get('/delete/:username',function (req,res){
  var connectUsers = db.model('users', user);
  connectUsers.deleteOne({username:req.params.username})
      .then(()=>{
        res.redirect('back');
      })

})


//Edit user
router.get('/edit/:username', function (req, res) {
  var connectUsers = db.model('users', user);
  connectUsers.find({username: req.params.username},(err,data) =>{
    if (err){
      console.log(err);
    }else {
      res.render('edit',{data: data})
    }
  })

});


var storagEdit = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, req.params.username+'.png')
  }
})

var edit = multer({ storage: storagEdit
  , limits:{
    fileSize:1024*1024*10,
  }
});

router.post('/editUser/:username',edit.single('avatar') ,function (req, res) {
  var connectUsers = db.model('users', user);
  connectUsers.updateOne({username:req.params.username}, {
    name: req.body.name,
    number_phone: req.body.phone_number,
    address: req.body.address,
    password: req.body.password,
    avatar: req.params.username+'.png',
  }).then(() => {
    res.redirect('/search')
    // res.json(req.body);
  })

  // res.json(req.body);

});


module.exports = router;