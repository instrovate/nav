const mongoose = require('mongoose');
var applySchema = new mongoose.Schema({
    type:{type:Array, required:true},
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true },
    mobile:{type:Number, required:true},
    gender: { type: String, required: true },
    dob: {type:Date, default:null},
    country:{type:String, default:null},
    state:{type:String, default:null},
    city:{type:String, default:null},
    highest_level_of_education:{type:String, default:null},
    college:{type:String, default:null},
    degree:{type:String, default:null},
    experience:{type:String, default:null},
    brand_portfolio:{type:String, default:null},
    career_fields:{type:Array},
    specialisations:{type:Array},
    short_bio:{type:String, default:null},
    picture:{type:String, default:null}
  });
  
 
  mongoose.model('Application', applySchema);  