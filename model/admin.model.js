const mongoose = require('mongoose');
var adminSchema = new mongoose.Schema({
email : { type: String, required: true },
password : { type: String, required: true },
role : { type: String, required: true }
});
// Update the updated_at field on save
adminSchema.pre('save', (next) => {
    this.updated_at = Date.now()
    next()
  });
mongoose.model('Admin',adminSchema);