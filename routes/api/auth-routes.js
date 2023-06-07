const express = require("express");

const { validation, authentificate, upload } = require("../../middlewares");

const {
  userSchema,
  userUpdSubcrSchema,
} = require("../../validationSchemas/validationSchemas");

const router = express.Router();

const {
  userRegister,
  userLogin,
  userCurrent,
  userLogout,
  userUpdSubscr,
  updateAvatar,
} = require("../../controllers/auth-controller");

router.post("/register", validation(userSchema), userRegister);

router.post("/login", validation(userSchema), userLogin);

router.get("/current", authentificate, userCurrent);

router.post("/logout", authentificate, userLogout);

router.patch(
  "/",
  authentificate,
  validation(userUpdSubcrSchema),
  userUpdSubscr
);

router.patch("/avatars", authentificate, upload.single("avatar"), updateAvatar);

module.exports = router;
