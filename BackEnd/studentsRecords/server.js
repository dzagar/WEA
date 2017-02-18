
var express = require('express');
var logger = require('./logger');
var app = express();
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/studentsRecords');

var students = require('./routes/students');
var residencies = require('./routes/residencies');
var genders = require('./routes/genders');
var scholarships = require('./routes/scholarships');
var advancedStandings = require('./routes/advancedStandings');
var highschools = require('./routes/highSchools');
var highSchoolSubjects = require('./routes/highSchoolSubjects');
var highSchoolCourses = require('./routes/highSchoolCourses');
var termCodes = require('./routes/termCodes');


app.use(function (request, response, next) {
    response.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    response.header('Access-Control-Allow-Methods', 'POST, PATCH, GET, PUT, DELETE, OPTIONS');
    next();
});
app.use(logger);
//app.use(express.static('public'));

app.use('/students', students);
app.use('/residencies', residencies);
app.use('/genders', genders);
app.use('/scholarships', scholarships);
app.use('/advancedStandings', advancedStandings);
app.use('/highSchools', highschools);
app.use('/highSchoolSubjects', highSchoolSubjects);
app.use('/highSchoolCourses', highSchoolCourses);
app.use('/termCodes', termCodes);


app.listen(3700, function () {
    console.log('Listening on port 3700');
});
