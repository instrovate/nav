const mongoose = require('mongoose');
var chapterSchema = new mongoose.Schema({
chapterName : String,
order:{type:Number, default: 99},
courseID: {type:mongoose.Schema.Types.ObjectId,
ref:'Course'
},
addedBy: {type:mongoose.Schema.Types.ObjectId,
  ref:'Admin'
  },
created_at: { type: Date, default: Date.now() },
updated_at: { type: Date, default: Date.now() }
});
// Update the updated_at field on save
chapterSchema.pre('save', (next) => {
    this.updated_at = Date.now()
    next()
  });
mongoose.model('Chapter',chapterSchema);