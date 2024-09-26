const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    employer: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Hash Password
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  console.log("Encrypted password " + this.password);
});

// JWT Token
UserSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
};

// Compare password
UserSchema.methods.comparePassword = async function (enteredPassword) {
  // console.log("enteredPassword " + enteredPassword);
  return bcrypt.compare(enteredPassword, this.password);
};
const User = mongoose.model("User", UserSchema);
module.exports = User;
