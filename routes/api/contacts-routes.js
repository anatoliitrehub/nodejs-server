const express = require("express");

const { validation, isValidId } = require("../../middlewares");
const {
  contactAddSchema,
  contactUpdSchema,
  updFavorSchema,
} = require("../../validationSchemas/validationSchemas");

const router = express.Router();

const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  updateStatusContact,
} = require("../../controllers/contacts-controller");

router.get("/", listContacts);

router.get("/:contactId", isValidId, getContactById);

router.post("/", validation(contactAddSchema), addContact);

router.delete("/:contactId", isValidId, removeContact);

router.put(
  "/:contactId",
  isValidId,
  validation(contactUpdSchema),
  updateContact
);

router.patch(
  "/:contactId/favorite",
  isValidId,
  validation(updFavorSchema),
  updateStatusContact
);

module.exports = router;
