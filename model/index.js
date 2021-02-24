const mongoose = require('mongoose');


/*
mongoose.connect('mongodb+srv://naveen123:Pass123@cluster0-nxrhl.mongodb.net/secondDb?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true }, (err)=>{
if(!err) {console.log('mongodb selected') }
}); 
*/




mongoose.connect('mongodb+srv://akriti_lal:Pass123@cluster0.wncdg.mongodb.net/instrovate?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true }, (err)=>{
if(!err) {console.log('mongodb selected') }
});


/*
mongoose.connect('mongodb://localhost:27017/firstDb?readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=false', {useNewUrlParser: true, useUnifiedTopology: true }, (err)=>{
if(!err) {console.log('mongodb selected') }
});
*/
const course = require('./course.model');
const chapter = require('./chapter.model');
const section = require('./section.model');
const user = require('./user.model');
const application = require('./application.model');
const admin = require('./admin.model');
