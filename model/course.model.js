const mongoose = require('mongoose');
var courseSchema = new mongoose.Schema({
courseName : String,
courseImg : String,
courseAbout:String,
courseDescription : String,
users_enrolled:[{type:mongoose.Schema.Types.ObjectId,
  ref:'User'}],
  addedBy: {type:mongoose.Schema.Types.ObjectId,
    ref:'Admin'
    },
created_at: { type: Date, default: Date.now() },
updated_at: { type: Date, default: Date.now() }
});
// Update the updated_at field on save
courseSchema.pre('save', (next) => {
    this.updated_at = Date.now()
    next()
  });
mongoose.model('Course',courseSchema);