import * as fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { func } from "joi";

const mongoose = require('mongoose')
//-----------------------------
const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Set name for contact"],
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
});

const Contact = mongoose.model('Contact', contactSchema)

//-----------------------------
//-----------------------------
const uri =
  "mongodb+srv://user1:YGyE7PyeB7x@cluster0.hlp2rdj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

  async function connect() {
    try {
      await mongoose.connect(uri)
      const db = mongoose.connection
      db.on('connected', () => {
        console.log("Database connection successful");
      })
      db.on('error', (error) => {
        console.error("Database connection error:", error);
        process.exit(1)
      })
    } catch (error) {
      console.log(error.message)
    } finally {
      await mongoose.disconnect()
    }
  }

  connect()
//-----------------------------
//-----------------------------
async function getAllContacts() {
  try {
    const contacts = await Contact.find()
    console.log('All contacts:', contacts)
  } catch (error) {
    console.error('Error getting contacts:', error)
  }
}

async function getContactByName(name) {
  try {
    const contact = await Contact.findOne({name})
    if(contact) {
      console.log('Contact found:', contact)
    }else{
      console.log('Contact not found')
    }
  } catch (error) {
    console.error('Error getting contact:', error)
  }
}

async function addContact(name, email, phone) {
  try {
    const newContact = new Contact({name, email, phone})
    await newContact.save()
    console.log('Contact added successfully')
  } catch (error) {
    console.error('Error adding contact:', error)
  }
}

async function deleteContact(name) {
  try {
    const deletedContact = await Contact.findOneAndDelete({name})
    if (deletedContact) {
      console.log('Contact deleted successfully')
    }else{
      console.log('Contact not found')
    }
  } catch (error) {
    console.error('Error deleting contact:', error)
  }
}

async function updateContact(name, newData) {
  try {
    const updatedContact = await Contact.findOneAndUpdate(
      { name },
      { $set: newData },
      { new: true }
    );
    if (updatedContact) {
      console.log("Contact updated successfully");
    } else {
      console.log("Contact not found");
    }
  } catch (err) {
    console.error("Error updating contact:", err);
  }
};
//-----------------------------

export { getAllContacts,
getContactByName,
addContact,
deleteContact,
updateContact };

// const contactsPath = path.resolve("db", "contacts.json");

// async function readContacts() {
//   const data = await fs.readFile(contactsPath, { encoding: "utf-8" });
//   return JSON.parse(data);
// }

// async function writeContacts(contacts) {
//   await fs.writeFile(contactsPath, JSON.stringify(contacts, undefined, 2));
// }

// async function listContacts() {
//   const contacts = await readContacts();
//   return contacts;
// }

// async function getContactById(contactId) {
//   const contacts = await readContacts();

//   const contact = contacts.find((contact) => contact.id === contactId);

//   if (typeof contact === "undefined") {
//     return null;
//   }

//   return contact;
// }

// async function removeContact(contactId) {
//   const contacts = await listContacts();

//   const idx = contacts.findIndex((contact) => contact.id === contactId);

//   if (idx === -1) return null;

//   const removedContact = contacts[idx];

//   contacts.splice(idx, 1);

//   await writeContacts(contacts);

//   return removedContact;
// }

// async function addContact({name, email, phone}) {
//   const contacts = await readContacts();

//   const newContact = { name, email, phone, id: crypto.randomUUID() };
//   contacts.push(newContact);

//   await writeContacts(contacts);

//   return newContact;
// }

