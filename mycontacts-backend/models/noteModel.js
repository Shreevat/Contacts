const mongoose = require("mongoose");

const noteSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: {
      type: String,
      required: [true, "Please add a title for the note"], 
    },
    content: {
      type: String,
      required: [true, "Please add content for the note"], 
    },
  },
  {
    timestamps: true, 
  }
);

module.exports = mongoose.model("Note", noteSchema);
