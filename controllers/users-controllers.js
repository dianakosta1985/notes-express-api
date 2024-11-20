const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

const HttpError = require("../models/http-error");
const User = require("../models/user");

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      const error = new HttpError(
        "User exists already, please login instead.",
        422
      );
      return next(error);
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const createdUser = new User({
      email,
      password: hashedPassword,
      notes: [],
    });

    await createdUser.save();
    res.status(201).json({ user: createdUser.toObject({ getters: true }) });
  } catch (err) {
    const error = new HttpError("Signing up failed, please try again.", 500);
    return next(error);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const existUser = await User.findOne({ email: email });
    if (!existUser) {
      const error = new HttpError(
        "Invalid credentials, could not log you in.",
        404
      );
      return next(error);
    }
    // Compare the password with the hashed password in the database
    const isValidPassword = await bcrypt.compare(password, existUser.password);

    if (!isValidPassword) {
      const error = new HttpError(
        "Invalid credentials, could not log you in.",
        401
      );
      return next(error);
    }
    res.json({ message: "Logged in!" });
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    return next(error);
  }
};

exports.signup = signup;
exports.login = login;
