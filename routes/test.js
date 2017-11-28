var express = require('express');
var app = express();

var bodyPaser = require('body-parser');

var mongoose = require('mongoose');


Biodata = require('./models/biodata');

//Connect to Mongo DB
mongoose.connect('mongodb://localhost/ALC');
var db = mongoose.connection;




// var mongojs = require('mongojs');
// var Biodata = mongojs('mongodb://raphealolams:ajilore1@ds235775.mlab.com:35775/students', ['bioDatas']);

app.use(bodyPaser.json());

app.use(express.static(__dirname + '/frontend'));
app.use(express.static(__dirname + '/node_modules/angular'));
app.use(express.static(__dirname + '/node_modules/angular-route'));
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use(express.static(__dirname + '/node_modules/jquery/dist/'));



app.get('/', function(req, res) {
    res.send('Please Use The API End Point');
});

// API POST REQUEST
app.post('/api/students', function(req, res) {
    var student = req.body;
    Biodata.addStudent(student, function(err, student) {
        if (err) {
            throw err;
        }
        res.json(student);
    });
});

// API PUT REQUEST
app.put('/api/students/:_id', function(req, res) {
    var id = req.params._id
    var student = req.body;
    Biodata.updateStudent(id, student, {}, function(err, student) {
        if (err) {
            throw err;
        }
        res.json(student);
    });
});

//  API Delete REQUEST FOR ONE STUDENTS
app.delete('/api/students/:_id', function(req, res) {
    var id = req.params._id
    Biodata.deleteStudent(id, function(err, biodata) {
        if (err) {
            throw err;
        }
        res.json(biodata);
    });
});

// API GET REQUEST FOR ALL STUDENTS
app.get('/api/students', function(req, res) {
    Biodata.getStudents(function(err, bioData) {
        if (err) {
            throw err;
        }
        res.json(bioData);
    });
});

//  API GET REQUEST FOR ONE STUDENTS
app.get('/api/students/:_id', function(req, res) {
    Biodata.getStudentById(req.params._id, function(err, biodata) {
        if (err) {
            throw err;
        }
        res.json(biodata);
    });
});

app.listen(3000);
console.log('Running on Port 3000....');