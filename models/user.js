const mongoose = require("mongoose");
//const uniqueValidator = require("mongoose-unique-validator");

const Scheme = mongoose.Scheme;

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  notes: [
    { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Note" },
  ],
});

//userScheme.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
