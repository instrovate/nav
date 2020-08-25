const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
const mongoose = require('mongoose');
var coursemodel = mongoose.model("Course");
var sectionmodel = mongoose.model("Section");
const { ensureAuthenticated } = require('../config/auth');





// Passport Config
require('../config/passport')(passport);

// Passport middleware
router.use(passport.initialize());
router.use(passport.session());


// View Course Listing Routes
var coursemodel = mongoose.model("Course");
router.get("/", ensureAuthenticated, async (req, res) => {
    const posts = await coursemodel.find();
    
    var string = JSON.stringify(posts);
    var courseData = JSON.parse(string);
   res.render('courses',{courseData:courseData});
});



// View Single Section Page
router.get('/view-section/:course_id/:id', ensureAuthenticated, async(req, res) => {
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
    res.render('view_section',{sectiondata:section, chapterdata:res1}); 
    });
    });



// View Single Course Page
var db = mongoose.connection;
router.get("/view-course/:id", ensureAuthenticated, async (req, res) => {
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

                    }

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
   
   var user = req.session.passport.user;
   if (th_array.indexOf(user) >= 0) {
    console.log("Found");
    res.render('view_course',{courseData:courseData, chapterData:query1});
} else {
    console.log("Not found");
    res.send('You are not enrolled in this course');
}
   //console.log(ff);
  
     });
     
    
});

module.exports = router;