const express = require("express");

const { validation } = require("../../middlewares");
const {
  contactAddSchema,
  contactUpdSchema,
} = require("../../validationSchemas/validationSchemas");

const router = express.Router();

const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
} = require("../../controllers/contacts-controller");

router.get("/", listContacts);

router.get("/:contactId", getContactById);

router.post("/", validation(contactAddSchema), addContact);

router.delete("/:contactId", removeContact);

router.put("/:contactId", validation(contactUpdSchema), updateContact);

module.exports = router;
