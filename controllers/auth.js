const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");

const register = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  // console.log(firstName);

  if (!firstName || !lastName || !email || !password) {
    throw new BadRequestError("All fields are required");
  }
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new BadRequestError("User already exists");
  }

  const newUser = new User({ firstName, lastName, email, password });

  await newUser.save();
  // console.log(newUser);

  // const token = user.getJwtToken();

  res.status(StatusCodes.CREATED).json({
    success: true,
    msg: "Registered successfully!",
    user: { firstName, lastName, email },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }

  // Find user by email
  const user = await User.findOne({ email });

  if (!user) {
    throw new UnauthenticatedError("Invalid Credentials!");
  }

  // Compare password
  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  // Create token
  const token = user.getJwtToken();

  // Return only necessary user info
  const { firstName, lastName, email: userEmail } = user;

  res.status(StatusCodes.OK).json({
    msg: "Login successful!",
    success: true,
    user: { firstName, lastName, email: userEmail },
    token,
  });
};

module.exports = { register, login };
