const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const noteSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    userId: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
    sharedWith: [{ type: mongoose.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

noteSchema.index({ title: "text", description: "text" });

module.exports = mongoose.model("Note", noteSchema);