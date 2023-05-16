const express = require("express");
const Joi = require("joi");
const HttpError = require("../../helpers");

const router = express.Router();

const contactsOperations = require("../../models/contacts");

const contactsSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
});
const contactsUpdSchema = Joi.object().min(1);

router.get("/", async (req, res, next) => {
  const contacts = await contactsOperations.listContacts();
  res.json(contacts);
});

router.get("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const contact = await contactsOperations.getContactById(contactId);
    if (!contact) throw new Error();
    res.json(contact);
  } catch (error) {
    res.status(404).json({ message: "Not found" });
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { error } = contactsSchema.validate(req.body);
    if (error) throw HttpError(400, "missing required name field");

    const newContact = await contactsOperations.addContact(req.body);
    if (!newContact) throw HttpError(400, "Something fail");
    res.status(201).json(newContact);
  } catch (error) {
    res.status(error.status).json({ message: error.message });
  }
});

router.delete("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const contact = await contactsOperations.removeContact(contactId);
    if (!contact) throw HttpError(404, "Not found");
    res.status(200).json({ message: "contact deleted" });
  } catch (error) {
    res.status(error.status).json({ message: error.message });
  }
});

router.put("/:contactId", async (req, res, next) => {
  try {
    const { error } = contactsUpdSchema.validate(req.body);

    if (error) throw HttpError(400, "missing fields");

    const { contactId } = req.params;
    const updContact = await contactsOperations.updateContact(
      contactId,
      req.body
    );
    if (!updContact) throw HttpError(404, "Not found");
    res.status(200).json(updContact);
  } catch (error) {
    res.status(error.status).json({ message: error.message });
  }
});

module.exports = router;
