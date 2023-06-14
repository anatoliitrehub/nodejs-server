const User = require("../models/user");
const { HttpError, ctrlWrapper, sendEmail } = require("../helpers");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs/promises");
const { SECRET_KEY, BASE_URL } = process.env;
const gravatar = require("gravatar");
const avatarDir = path.join(__dirname, "../", "public", "avatars");
const Jimp = require("jimp");
const uniqid = require("uniqid");

const userRegister = async (req, res, next) => {
  const { email, password } = req.body;
  const userExist = await User.findOne({ email });
  if (userExist) throw HttpError(409, "Email in use");

  const hashedPassword = await bcrypt.hash(password, 10);
  const avatarUrl = gravatar.url(email);
  const verificationToken = uniqid();

  const newUser = await User.create({
    ...req.body,
    password: hashedPassword,
    avatarUrl,
    verificationToken,
  });
  if (!newUser) throw HttpError(400, "Bad request");
  res.status(201).json({
    user: {
      email: newUser.email,
      subsciption: newUser.subscription,
    },
  });

  const verifyText = `<a target="_blank" href="${BASE_URL}/users/verify/${verificationToken}">Email verification link</a>`;

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: verifyText,
  };

  await sendEmail(verifyEmail);
};

const userVerify = async (req, res, next) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) throw HttpError(404, "User not found");

  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: "",
  });

  res.json({ message: "Verification successful" });
};

const userResendVerifyEmail = async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw HttpError(404, "User not found");
  if (user.verify) throw HttpError(400, "Verification has already been passed");

  const verifyText = `<a target="_blank" href="${BASE_URL}/users/verify/${user.verificationToken}">Email verification link</a>`;

  const verifyEmail = {
    to: email,
    subject: "Repeated verification email",
    html: verifyText,
  };

  await sendEmail(verifyEmail);
  res.json({ message: "Verification email sent" });
};

const userLogin = async (req, res, next) => {
  const { email, password } = req.body;
  const userExist = await User.findOne({ email });
  if (!userExist) throw HttpError(401, "Email or password is wrong");

  if (!userExist.verify) throw HttpError(401, "Email not verified yet");

  const passCompare = await bcrypt.compare(password, userExist.password);
  if (!passCompare) throw HttpError(401, "Email or password is wrong");
  const payload = {
    id: userExist._id,
  };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "5h" });

  await User.findByIdAndUpdate(userExist._id, { token });
  res.json({
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

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: tempUpload, originalname } = req.file;
  const fileName = `${_id}_${originalname}`;
  const resUpl = path.join(avatarDir, fileName);
  await fs.rename(tempUpload, resUpl);
  Jimp.read(resUpl)
    .then((avatar) => {
      return avatar.resize(250, 250).write(resUpl);
    })
    .catch((err) => {
      console.error(err);
    });
  const avatarUrl = path.join("avatars", fileName);
  await User.findByIdAndUpdate(_id, { avatarUrl });

  res.json({
    avatarUrl,
  });
};

module.exports = {
  userRegister: ctrlWrapper(userRegister),
  userVerify: ctrlWrapper(userVerify),
  userResendVerifyEmail: ctrlWrapper(userResendVerifyEmail),
  userLogin: ctrlWrapper(userLogin),
  userCurrent: ctrlWrapper(userCurrent),
  userLogout: ctrlWrapper(userLogout),
  userUpdSubscr: ctrlWrapper(userUpdSubscr),
  updateAvatar: ctrlWrapper(updateAvatar),
};
