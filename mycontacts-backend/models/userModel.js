const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      require: [true, "Please add the username"],
    },
    email: {
      type: String,
      require: [true, "Please add the email address"],
      unique: [true, "Email already existss"],
    },
    password: {
      type: String,
      require: [true, "Please add the password"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
