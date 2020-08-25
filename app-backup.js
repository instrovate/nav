const connection = require('./model');
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
var express=require('express');
var app=express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'pug');
const multer = require('multer');
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

app.use('/uploads', express.static('/uploads'));

app.use(express.static('first-project'));

//Serves all the request which includes /images in the url from Images folder
app.use('/uploads', express.static(__dirname + '/uploads'));



// Routes

// View Course Listing Routes
app.get("/", async (req, res) => {
    const posts = await coursemodel.find();
    
    var string = JSON.stringify(posts);
    var courseData = JSON.parse(string);
   res.render('courses',{courseData:courseData});
});


// View Single Course Page
var db = mongoose.connection;
app.get("/view-course/:id", async (req, res) => {
    var query = { _id: req.params.id };
    const course = await coursemodel.find(query);
    db.collection('chapters').aggregate([
        {
            "$project": {
              "_id": {
                "$toString": "$_id"
              },
              "name":"$chapterName",
              "courseID":"$courseID"
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
        console.log(dd);
    var string = JSON.stringify(course);
    var courseData = JSON.parse(string);
    
    
  res.render('view_course',{courseData:courseData, chapterData:query1});
     });
     
    
});






// Course Add and Insert Routes
app.get('/add-course', function(req,res){
    res.render('course');
    });

var coursemodel = mongoose.model("Course");
app.post('/insert_course',function(req, res){
//res.end(req.body.coursename);
    new coursemodel({
    courseName: req.body.coursename,
    courseDescription: req.body.coursedescription
}).save(function(err,doc){
if(err)res.json(err);
else res.send('<a href="chapter/'+doc._id+'">Enter Chapters In This Course</a>');
});
});



// Chapter Add and Insert Routes
app.get('/chapter/:id',function(req,res){
res.render('chapter', {'id': req.params.id});
});

var chaptermodel = mongoose.model("Chapter");
app.post('/insert_chapter', function(req, res){
    
    //console.log(req.file.originalname);
    
    new chaptermodel({
        chapterName: req.body.chaptername,
        chapterDescription: req.body.chapterdescription,
        courseID: req.body.course_id
    
    }).save(function(err,doc){
        if(err)res.json(err);
        else res.send('<a href="section/'+doc._id+'">Add Section in this Chapter</a>');
        });
 
});

 


// Section Add and Insert Routes
    app.get('/section/:id',function(req,res){
    res.render('section', {'id': req.params.id});
    });
    
    var sectionmodel = mongoose.model("Section"); 
    app.post('/insert_section', upload.single('pdf'), function(req, res, file){
        
        //console.log(req.file.originalname);
        
        new sectionmodel({
            sectionName: req.body.sectionname,
            sectionDescription: req.body.sectiondescription,
            chapterID: req.body.chapter_id,
            pdf: req.file.originalname
        
        }).save(function(err,doc){
            if(err)res.json(err);
            else res.send('section Inserted');
            });
     
    });















//schema.plugin(courseSchema.mongoosePlugin);
var server=app.listen(3000,function()
{
});

