var express = require("express");
var app = express();
var port = 3000;
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://<username>:<password>@cluster0-shard-00-00-xeyx5.gcp.mongodb.net:27017,cluster0-shard-00-01-xeyx5.gcp.mongodb.net:27017,cluster0-shard-00-02-xeyx5.gcp.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true",{
    useNewUrlParser: true
},function(err){
    if(err){
        console.log(err);
    }else {
        console.log("connection established");
    }
});
var nameSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    roll: String,
    phone: Number,
    email: String,
    address: String,
    city: String,
    state: String
});
var User = mongoose.model("User", nameSchema);

app.set('view engine','ejs');

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.get("/page", (req, res) => {
    res.sendFile(__dirname + "/page.html");
});

app.get('/list', function(req,res){
    User.find({},function(err,result){
        if(err){
            throw err;
        } else {
            var student = ["No. of students submitted","yet to submit"];
            var data = [result.length,74];
            if(result.length<74){
                var surya = `Still  ${74-(result.length)} members need to submit their details`
            } else if(result.length===74){
                var surya = "Hola..! Target accomplished"
            } else{
                var surya = "Uh..ohh..target exceeded"
            }
            res.render('graph',{student,data,surya});
        }
    })
});

app.post('/addstudent', (req, res) => {
    var myData = new User(req.body);
    myData.save()
        .then(item => {    
        })
        .catch(err => {
            res.status(400).send("Unable to save to database");
        });
        res.redirect("/page");
});

app.post('/redirect', (req,res) => {
    res.redirect("list");
})

app.listen(port, () => {
    console.log("Server listening on port " + port);
});