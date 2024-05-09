import * as fs from "fs/promises";
import path from "path";
import crypto from "crypto";

const contactsPath = path.resolve("db", "contacts.json");

async function readContacts() {
  const data = await fs.readFile(contactsPath, { encoding: "utf-8" });
  return JSON.parse(data);
}

async function writeContacts(contacts) {
  await fs.writeFile(contactsPath, JSON.stringify(contacts, undefined, 2));
}

async function listContacts() {
  const contacts = await readContacts();
  return contacts;
}

async function getContactById(contactId) {
  const contacts = await readContacts();

  const contact = contacts.find((contact) => contact.id === contactId);

  if (typeof contact === "undefined") {
    return null;
  }

  return contact;
}

async function removeContact(contactId) {
  const contacts = await listContacts();

  const idx = contacts.findIndex((contact) => contact.id === contactId);

  if (idx === -1) return null;

  const removedContact = contacts[idx];

  contacts.splice(idx, 1);

  await writeContacts(contacts);

  return removedContact;
}

async function addContact({name, email, phone}) {
  const contacts = await readContacts();

  const newContact = { name, email, phone, id: crypto.randomUUID() };
  contacts.push(newContact);

  await writeContacts(contacts);

  return newContact;
}

export { listContacts, getContactById, removeContact, addContact };
