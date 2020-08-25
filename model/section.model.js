const mongoose = require('mongoose');
var sectionSchema = new mongoose.Schema({
sectionName : String,
order:{type:Number, default: 99},
chapterID: {type:mongoose.Schema.Types.ObjectId,
    ref:'Chapter'
    },
    addedBy: {type:mongoose.Schema.Types.ObjectId,
      ref:'Admin'
      },
sectionType:{ type:String, enum:['text','pdf','url','quiz', 'video']
},
sectionDescription : String,
ques:[{
  question : String,
  hint : String
   }],  
pdf: String,
url:String,
created_at: { type: Date, default: Date.now() },
updated_at: { type: Date, default: Date.now() },


});
// Update the updated_at field on save
sectionSchema.pre('save', (next) => {
    this.updated_at = Date.now()
    next();


  });


mongoose.model('Section',sectionSchema);