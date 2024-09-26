const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError } = require("../errors");

const register = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName || !email || !password) {
    throw new BadRequestError("All fields are required");
  }
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new BadRequestError("User already exists");
  }

  const newUser = new User({ firstName, lastName, email, password });

  const user = await newUser.save();

  const token = user.getJwtToken();

  res
    .status(StatusCodes.CREATED)
    .json({ user: { firstName, lastName, email }, token });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }

  // console.log(email);

  const user = await User.findOne({ email });

  if (!user) {
    throw new UnauthenticatedError("Invalid Credentials!");
  }

  // compare password
  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  // create token
  const token = user.getJwtToken();

  // exclude password
  const theUser = user.toJSON();

  res.status(StatusCodes.OK).json({ success: true, user: theUser, token });
};

module.exports = { register, login };
