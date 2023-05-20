const contactsOperations = require("../models/contacts");
const HttpError = require("../helpers");

const listContacts = async (req, res, next) => {
  const contacts = await contactsOperations.listContacts();
  res.json(contacts);
};

const getContactById = async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const contact = await contactsOperations.getContactById(contactId);
    if (!contact) throw new Error();
    res.json(contact);
  } catch (error) {
    res.status(404).json({ message: "Not found" });
  }
};

const addContact = async (req, res, next) => {
  try {
    const newContact = await contactsOperations.addContact(req.body);
    if (!newContact) throw HttpError(400, "Something fail, please, try again");
    res.status(201).json(newContact);
  } catch (error) {
    res.status(error.status).json({ message: error.message });
  }
};

const removeContact = async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const contact = await contactsOperations.removeContact(contactId);
    if (!contact) throw HttpError(404, "Not found");
    res.status(200).json({ message: "contact deleted" });
  } catch (error) {
    res.status(error.status).json({ message: error.message });
  }
};

const updateContact = async (req, res, next) => {
  try {
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
};

module.exports = {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
};
