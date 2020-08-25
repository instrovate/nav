const connection = require('./model');
var http = require('http');
const bcrypt = require('bcrypt');
const AdminBro = require('admin-bro');
const AdminBroExpress = require('admin-bro-expressjs');
const nodemailer = require("nodemailer");
const mongoose = require('mongoose');
var express=require('express');
const passport = require('passport');
const flash = require('flash-express');
const session = require('express-session');
var app=express();
app.use('/admin', require('./admin'));
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'pug');
const multer = require('multer');
var storage1 = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/resumes');
     },
    filename: function (req, file, cb) {
        cb(null , file.originalname);
    }
});
const upload1 = multer({
    storage: storage1 // this saves your file into a directory called "uploads"
    
  });
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads');
     },
    filename: function (req, file, cb) {
        cb(null , file.originalname);
    }
});
const upload = multer({
  storage: storage // this saves your file into a directory called "uploads"
  
}); 

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
  }));


// Passport Config
require('./config/passport')(passport);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());



//Login register routes
var myusers = require('./routes/users');
app.use('/users', myusers);


// Registered Users Page
var useraccess = require('./routes/useraccess');
app.use('/', useraccess);

// View Course Listing Routes
var coursemodel = mongoose.model("Course");
app.get("/admin/courses", async (req, res) => {
    const posts = await coursemodel.find();
    var string = JSON.stringify(posts);
    var courseData = JSON.parse(string);
    res.render('courses_admin',{courseData:courseData});
});

app.use('/uploads', express.static('/uploads'));

app.use(express.static('first-project'));

//Serves all the request which includes /images in the url from Images folder
app.use('/uploads', express.static(__dirname + '/uploads'));

// Serves all css and js requests from this path public
app.use('/views', express.static(__dirname + '/views'));


// Routes


// apply as trainer, mentor etc.
app.get('/apply',function(req,res){
//console.log(req.session.adminUser._id);

res.render('user/application');
});

var applyModel = mongoose.model("Application");

app.post('/apply',function(req,res){
    new applyModel({
        type: req.body.usertype,
        first_name: req.body.f_name,
        last_name: req.body.l_name,
        email:req.body.email,
        mobile:req.body.mobile,
        gender:req.body.gender
    }).save(function(err,doc){
    if(err)res.json(err);
    else res.render('user/application2',{id:doc._id});
});
});


app.post('/apply-educational-details',function(req,res){
    var myquery = { _id: mongoose.Types.ObjectId(req.body.id) }; 
    var newvalues = { $set: {dob: req.body.dob, country: req.body.country, state:req.body.state, city:req.body.city, highest_level_of_education:req.body.highest_level_of_education, college:req.body.college, degree:req.body.degree } }; 
    applyModel.updateOne(myquery, newvalues, function(err, res1){
    if(err) throw err;
    else res.render('user/application3',{id:req.body.id});
    
    });
});

app.post('/apply-personnel-details',function(req,res){
    var myquery = { _id: mongoose.Types.ObjectId(req.body.id) }; 
    var newvalues = { $set: {experience:req.body.experience, brand_portfolio:req.body.brand_portfolio, career_fields:req.body.career_fields, specialisations:req.body.specialisations, short_bio:req.body.short_bio } }; 
    applyModel.updateOne(myquery, newvalues, function(err, res1){
    if(err) throw err;
    else res.render('user/application4',{id:req.body.id});
    
    });
});



app.post('/apply-display-profile', upload1.single('image'), function(req, res, file){
    console.log(req.file.originalname);
    var myquery = { _id: mongoose.Types.ObjectId(req.body.id) }; 
    var newvalues = { $set: {picture:req.file.originalname} }; 
    applyModel.updateOne(myquery, newvalues, function(err, res1){
    if(err) throw err;
    else res.render('user/application-thankyou');
    
    });
});













// Course Add and Insert Routes
app.get('/admin/add-course', async(req,res)=>{
    const courses = await coursemodel.find();
    res.render('course',{courses:courses, admin_id:req.session.adminUser._id});
    });


app.post('/insert_course', upload.single('courseImg'), function(req, res, file){
console.log(req.file.originalname);
    new coursemodel({
    courseImg: req.file.originalname,
    courseName: req.body.coursename,
    courseAbout:req.body.courseabout,
    addedBy:req.body.admin_id,
    courseDescription: req.body.coursedescription
}).save(function(err,doc){
if(err)res.json(err);
//else res.send('<a href="admin/chapter/'+doc._id+'">Enter Chapters In This Course</a>');
//else res.render('add-course',{'id':doc._id, 'name':doc.courseName});
else res.redirect('admin/chapter/'+doc._id);
});
});






var db = mongoose.connection;
app.get("/admin/view-course/:id", async (req, res) => {
    var query = { _id: req.params.id };
    const course = await coursemodel.find(query);
    db.collection('chapters').aggregate([
        {
            $match: {
                'courseID': mongoose.Types.ObjectId(req.params.id)
            }
        },
        { $sort: { 'order': 1 } },
        
        {
            "$project": {
              "_id": "$_id",
              "name":"$chapterName",
              "courseID":mongoose.Types.ObjectId(req.params.id)
              
            }
          },

        { $lookup:

                    {

                        from: 'sections',

                        localField: '_id',

                        foreignField: 'chapterID',

                        as: 'chapterdetails'

                    },

        }
    ]).toArray(function (err1, res1) {

        if (err1)

            throw err1;
        let dd= JSON.stringify(res1);
        var query1 = JSON.parse(dd);
        //console.log(dd);
    var string = JSON.stringify(course);
    var courseData = JSON.parse(string, true);
    
   var th = JSON.stringify(courseData[0].users_enrolled) ;
   th = th.replace('[','');
   th = th.replace(']','');
   th = th.replace(/\"/g,'');
   var th_array = th.split(',');
   res.render('view_course_admin',{courseData:courseData, chapterData:query1});

     });
     
    
});


// View Single Section Page admin
app.get('/admin/view-section/:course_id/:id', async(req, res) => {
    var query = { _id: req.params.id };
    const section = await sectionmodel.find(query);
    db.collection('chapters').aggregate([
        {
            $match: {
                'courseID': mongoose.Types.ObjectId(req.params.course_id)
            }
        },
        { $sort: { 'order': 1 } },
        {
            "$project": {
              "_id": "$_id",
              "name":"$chapterName",
              "courseID":mongoose.Types.ObjectId(req.params.course_id)
              
            }
          },

        { $lookup:

                    {

                        from: 'sections',

                        localField: '_id',

                        foreignField: 'chapterID',

                        as: 'chapterdetails'

                    }

        }
    ]).toArray(function (err1, res1) {

        if (err1)

            throw err1;
        let dd= JSON.stringify(res1);
        var query1 = JSON.parse(dd);
        console.log(res1);
    res.render('view_section_admin',{sectiondata:section, chapterdata:res1}); 
    });
    });












var chaptermodel = mongoose.model("Chapter");
// Chapter Add and Insert Routes
app.get('/admin/chapter/:id',async(req,res)=>{
var query = { courseID: mongoose.Types.ObjectId(req.params.id)}
var query1 = {_id:mongoose.Types.ObjectId(req.params.id)}
const chapters = await chaptermodel.find(query);
const courses = await coursemodel.find(query1);
res.render('chapter', {'id': req.params.id, chapters:chapters, courses:courses, admin_id:req.session.adminUser._id});
});


app.post('/insert_chapter', function(req, res){
    
    //console.log(req.file.originalname);
    var n = req.body.chapterorder;
    var cour_id = req.body.course_id;
    var query = {order:n, courseID:cour_id};
    var query1 = {order:{$gt:n}, courseID:cour_id};
    const chapters = chaptermodel.find(query);
    //console.log(chapters);
    var newvalues = { $set: {order: ++n} };
    var newvalues1 = {$inc: {order: +1}};
        
    chaptermodel.update(query1, newvalues1, function(err, res) {
        if (err) throw err;
        console.log("2 document updated");
    });
    chaptermodel.update(query, newvalues, function(err, res) {
        if (err) throw err;
        console.log("1 document updated");
    });
    new chaptermodel({
        chapterName: req.body.chaptername,
        order: req.body.chapterorder,
        courseID: req.body.course_id,
        addedBy:req.body.admin_id
    
    }).save(function(err,doc){
        if(err)res.json(err);
        else res.redirect('admin/sectionType/'+doc._id);
        //else res.render('add-section',{'id':doc._id, 'name':doc.chapterName, 'courseid':doc.courseID});
        });
 
});

 


// Section Add and Insert Routes

var sectionmodel = mongoose.model("Section");

app.get('/admin/sectionType/:id', async(req,res) =>{
    var query = { chapterID: mongoose.Types.ObjectId(req.params.id)}
    var query1 = {_id:mongoose.Types.ObjectId(req.params.id)}
    const chapters= await chaptermodel.find(query1);
    const sections = await sectionmodel.find(query);
    res.render('sectionType', {'id': req.params.id, sections:sections, chapters:chapters, admin_id:req.session.adminUser._id});
});

app.post('/get_sectionType',async(req,res)=>{
var sectionType = req.body.sectionType;
var order = req.body.sectionorder;
var q1 = {_id:mongoose.Types.ObjectId(req.body.chapter_id)}
const chapters = await chaptermodel.find(q1);
if(sectionType=='text')
{
    res.render('section', {'id': req.body.chapter_id, 'sectionType':sectionType, 'chapters':chapters,  'order':order, 'admin_id':req.body.admin_id});
}
else if(sectionType=='pdf')
{
    res.render('sectionPDF', {'id': req.body.chapter_id, 'sectionType':sectionType, 'chapters':chapters,  'order':order, 'admin_id':req.body.admin_id}); 
}
else if(sectionType=='video' || sectionType=='url')
{
    res.render('sectionVideo', {'id': req.body.chapter_id, 'sectionType':sectionType, 'chapters':chapters,  'order':order, 'admin_id':req.body.admin_id});
}
else if(sectionType=='quiz')
{
    res.render('sectionQuiz',{'id': req.body.chapter_id, 'sectionType':sectionType, 'chapters':chapters,  'order':order, 'admin_id':req.body.admin_id});
}
});
   
   
     
    app.post('/insert_section', upload.single('pdf'), function(req, res, file){


        var n = req.body.sectionorder;
        var ch_id = req.body.chapter_id;
    var query = {order:n, chapterID:ch_id};
    var query1 = {order:{$gt:n}, chapterID:ch_id};
    const chapters = sectionmodel.find(query);
    //console.log(chapters);
    var newvalues = { $set: {order: ++n} };
    var newvalues1 = {$inc: {order: +1}};
        
    sectionmodel.update(query1, newvalues1, function(err, res) {
        if (err) throw err;
        console.log("2 document updated");
    });
    sectionmodel.update(query, newvalues, function(err, res) {
        if (err) throw err;
        console.log("1 document updated");
    });
        
        //console.log(req.file.originalname);
        if(req.body.sectionType=='text')
        {
            
        new sectionmodel({
            sectionName: req.body.sectionname,
            sectionDescription: req.body.sectiondescription,
            chapterID: req.body.chapter_id,
            sectionType:req.body.sectionType,
            order:req.body.sectionorder,
            addedBy:req.body.admin_id,
            ques:{},
            pdf: '',
            url:''
            //pdf: req.file.originalname
        
        }).save(function(err,doc){
            if(err)res.json(err);
            //else res.send('section Inserted');
            else res.render('add-section2',{'id':doc._id, 'name':doc.sectionName, 'chapterid':req.body.chapter_id});
            });
        }
        else if (req.body.sectionType=='pdf')
        {
            new sectionmodel({
                sectionName: req.body.sectionname,
                sectionDescription: '',
                chapterID: req.body.chapter_id,
                sectionType:req.body.sectionType,
                order:req.body.sectionorder,
                addedBy:req.body.admin_id,
                ques:{},
                pdf: req.file.originalname,
                url:''
                
            
            }).save(function(err,doc){
                if(err)res.json(err);
                //else res.send('section Inserted');
                else res.render('add-section2',{'id':doc._id, 'name':doc.sectionName, 'chapterid':req.body.chapter_id});
                });  
        }

        else if(req.body.sectionType=='video' || req.body.sectionType=='url')
        {
            var video = req.body.sectionVideoUrl;
            var newStr = video.replace(/watch/g, "/");
            var newStr1 = newStr.replace(/v=/g,''); 
            var newStr2 = newStr1.replace(/\?/g,'embed/')
            console.log(newStr2);
            if(req.body.sectionType=='video')
            {
                var insert_url = newStr2;
            }
            else
            {
            var insert_url = req.body.sectionVideoUrl;

            }
            new sectionmodel({
                sectionName: req.body.sectionname,
                sectionDescription: '',
                chapterID: req.body.chapter_id,
                sectionType:req.body.sectionType,
                order:req.body.sectionorder,
                ques:{},
                addedBy:req.body.admin_id,
                pdf: '',
                url:insert_url
                
            
            }).save(function(err,doc){
                if(err)res.json(err);
                //else res.send('section Inserted');
                else res.render('add-section2',{'id':doc._id, 'name':doc.sectionName, 'chapterid':req.body.chapter_id});
                });
        }
        else if(req.body.sectionType=='quiz')
        {
            var i=1;
            var ques_arr=[];
            while(i<=20)
            {
                
                var qq= 'quiz'+i;
                var hh= 'hint'+i;
                var qu = req.body[qq];
                var hi = req.body[hh];
                if(qu)
                {
                 var obj = {question:qu, hint:hi}
                 ques_arr.push(obj);
                }
                i++;
            }
            //console.log(ques_arr[0].question);
            new sectionmodel({
                sectionName: req.body.sectionname,
                sectionDescription: '',
                chapterID: req.body.chapter_id,
                sectionType:req.body.sectionType,
                order:req.body.sectionorder,
                ques:ques_arr,
                addedBy:req.body.admin_id,
                pdf: '',
                url:''
                
            }).save(function(err,doc){
                if(err)res.json(err);
                //else res.redirect('section Inserted');
                else res.render('add-section2',{'id':doc._id, 'name':doc.sectionName, 'chapterid':req.body.chapter_id});
                });
                
               console.log(ques_arr);
        }
    });


//schema.plugin(courseSchema.mongoosePlugin);
var server=app.listen(process.env.PORT || 8080,function()
{
});

