// const contactsOperations = require("../models/contacts");
const Contact = require("../models/contact");
const { HttpError, ctrlWrapper } = require("../helpers");

const listContacts = async (req, res, next) => {
  const { _id: owner } = req.user;
  const { page, limit, favorite } = req.query;
  const skip = (page - 1) * limit;
  if (skip < 0) throw HttpError(400, "Bad request");
  const contacts = await Contact.find(
    !favorite ? { owner } : { owner, favorite },
    "",
    { skip, limit }
  ).populate("owner", "name email");
  if (!Object.keys(contacts)) throw HttpError(404, "Not found");
  res.json(contacts);
};

const getContactById = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await Contact.findById(contactId);
  if (!contact) throw HttpError(404, "Not found");
  res.json(contact);
};

const addContact = async (req, res, next) => {
  const { _id: owner } = req.user;
  const newContact = await Contact.create({ ...req.body, owner });
  if (!newContact) throw HttpError(400, "Bad request");
  res.status(201).json(newContact);
};

const removeContact = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await Contact.findByIdAndDelete(contactId);
  if (!contact) throw HttpError(404, "Not found");
  res.status(200).json({ message: "contact deleted" });
};

const updateContact = async (req, res, next) => {
  const { contactId } = req.params;
  const updContact = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });
  if (!updContact) throw HttpError(404, "Not found");
  res.status(200).json(updContact);
};

const updateStatusContact = async (req, res, next) => {
  const { contactId } = req.params;
  const updContact = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });
  if (!updContact) throw HttpError(404, "Not found");
  res.status(200).json(updContact);
};

module.exports = {
  listContacts: ctrlWrapper(listContacts),
  getContactById: ctrlWrapper(getContactById),
  addContact: ctrlWrapper(addContact),
  removeContact: ctrlWrapper(removeContact),
  updateContact: ctrlWrapper(updateContact),
  updateStatusContact: ctrlWrapper(updateStatusContact),
};
