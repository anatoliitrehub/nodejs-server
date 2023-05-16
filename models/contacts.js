const fs = require("fs/promises");
const path = require("path");
const uniqid = require("uniqid");

const contactsPath = path.join(__dirname, "/contacts.json"); // dirname - path to file from root

const listContacts = async () => {
  const contacts = await fs.readFile(contactsPath, "utf-8").then((data) => {
    return JSON.parse(data);
  });

  // console.log(contacts);
  return contacts;
};

const getContactById = async (contactId) => {
  const contacts = await fs.readFile(contactsPath, "utf-8").then((data) => {
    return JSON.parse(data);
  });
  return contacts.find((el) => el.id === contactId);
};

const removeContact = async (contactId) => {
  const contacts = await fs.readFile(contactsPath, "utf-8").then((data) => {
    return JSON.parse(data);
  });
  const contactsAfterRemove = contacts.filter((el) => el.id !== contactId);
  if (contactsAfterRemove.length === contacts.length) return false;
  fs.writeFile(contactsPath, JSON.stringify(contactsAfterRemove, null, 2));
  return true;
};

const addContact = async (body) => {
  const { name, email, phone } = body;
  const contacts = await fs.readFile(contactsPath, "utf-8").then((data) => {
    return JSON.parse(data);
  });
  const newUser = { id: uniqid(), name, email, phone };
  const updatedContacts = [...contacts, newUser];

  await fs.writeFile(contactsPath, JSON.stringify(updatedContacts, null, "\t"));
  return newUser;
};

const updateContact = async (contactId, body) => {
  const contacts = await fs.readFile(contactsPath, "utf-8").then((data) => {
    return JSON.parse(data);
  });
  const ind = contacts.findIndex((contact, index) => contact.id === contactId);
  if (ind === -1) return false;
  const updUser = { ...contacts[ind], ...body };
  contacts[ind] = updUser;
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, "\t"));
  return updUser;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
