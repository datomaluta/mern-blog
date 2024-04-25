const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const path = require("path");
const AppError = require("../utils/appError");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);

  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httponly: true,
    secure: req.secure || req.headers["x-forwarded-photo"] === "https",
  });

  user.password = undefined;

  res.status(statusCode).json({ status: "success", data: { user } });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    photo: "/images/avatar.jpg",
  });

  createSendToken(newUser, 201, req, res);
});

exports.signin = catchAsync(async (req, res, next) => {
  // 1) Extract email and password from body
  const { email, password } = req.body;

  // 2) Check if email and password exists on body
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  // 3) check if user exists && password is correct
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorect email or password", 401));
  }

  // 4) if Everithing is okay, send token to client
  createSendToken(user, 200, req, res);
});
