const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
var userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone:{type:Number, required:true},
    role: { type: String, enum: ['admin', 'restricted'], required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
  
    created_at: { type: Date, default: Date.now() },
    updated_at: { type: Date, default: Date.now() }
  });
  
  // Update the updated_at field on save
  userSchema.pre('save', function (next) {
    var user = this;
    /*bcrypt.hash(user.password, 10, function (err, hash) {
      if (err) {
        return next(err); }
      user.password = hash;
      user.updated_at = Date.now();
      next();
    }); */
    user.updated_at = Date.now();
      next();
  });


  
  mongoose.model('User', userSchema);  