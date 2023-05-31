const express = require("express");

const { validation, authentificate } = require("../../middlewares");

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

module.exports = router;
