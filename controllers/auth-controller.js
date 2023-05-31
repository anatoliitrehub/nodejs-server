const User = require("../models/user");
const { HttpError, ctrlWrapper } = require("../helpers");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = process.env;

const userRegister = async (req, res, next) => {
  const { email, password } = req.body;
  const userExist = await User.findOne({ email });
  if (userExist) throw HttpError(409, "Email in use");

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ ...req.body, password: hashedPassword });
  if (!newUser) throw HttpError(400, "Bad request");
  res.status(201).json({
    user: {
      email: newUser.email,
      subsciption: newUser.subscription,
    },
  });
};

const userLogin = async (req, res, next) => {
  const { email, password } = req.body;
  const userExist = await User.findOne({ email });
  if (!userExist) throw HttpError(401, "Email or password is wrong");
  const passCompare = await bcrypt.compare(password, userExist.password);
  if (!passCompare) throw HttpError(401, "Email or password is wrong");
  const payload = {
    id: userExist._id,
  };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "5h" });

  await User.findByIdAndUpdate(userExist._id, { token });
  res.status(201).json({
    token,
    user: {
      email: userExist.email,
      subsciption: userExist.subscription,
    },
  });
};

const userCurrent = async (req, res) => {
  const { email, subscription } = req.user;
  res.json({
    email,
    subscription,
  });
};

const userLogout = async (req, res) => {
  const { _id } = req.user;

  await User.findByIdAndUpdate(_id, { token: "" });
  res.status(204).json();
};

const userUpdSubscr = async (req, res) => {
  const { _id } = req.user;
  const updUser = await User.findByIdAndUpdate(_id, req.body, {
    new: true,
  });
  if (!updUser) throw HttpError(404, "Not found");
  res.status(200).json({
    email: updUser.email,
    subscription: updUser.subscription,
  });
};

module.exports = {
  userRegister: ctrlWrapper(userRegister),
  userLogin: ctrlWrapper(userLogin),
  userCurrent: ctrlWrapper(userCurrent),
  userLogout: ctrlWrapper(userLogout),
  userUpdSubscr: ctrlWrapper(userUpdSubscr),
};
