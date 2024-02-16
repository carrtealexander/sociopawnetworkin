// FILE COMPLETE
const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: "Email address is required",
    unique: true,
    trim: true,
    lowercase: true,
    // Source for Mongoose matching validation: https://mongoosejs.com/docs/schematypes.html#string-validators
    match: [ 
    /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/,
    "Please enter a valid email address",
    ]
  },
  thoughts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Thought'
    }
  ],
  friends: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ]
},
{
  toJSON: {
    virtuals: true,
  },
  id: false
}
);


UserSchema.virtual('friendCount').get(function() {
  return this.friends.length;
});

// BONUS: ⚠️  
 
// Remove thoughts related to a user
UserSchema.pre('remove', function(next) {
  this.model('Thought').remove({ user: this._id }, next);
});




const User = model("User", UserSchema);

module.exports = User;