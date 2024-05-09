import { error } from "console";
import HttpError from "../helpers/HttpError.js";
import {
  listContacts,
  getContactById,
  removeContact,
  addContact,
} from "../services/contactsServices.js";
import { createContactSchema, updateContactSchema } from "../schemas/contactsSchemas.js";
import validateBody from "../helpers/validateBody.js";

export const getAllContacts = (req, res) => {
    listContacts().then((contacts) => res.status(200).json(contacts));
};

export const getOneContact = (req, res) => {
    getContactById(req.params.id)
      .then((contact) => res.status(200).json(contact))
      .catch(() => res.send(HttpError(404)))
};

export const deleteContact = (req, res) => {
    removeContact(req.params.id)
      .then((contact) => res.status(200).json(contact))
      .catch(() => res.send(HttpError(404)));
};

export const createContact = (req, res) => {
    const contact = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
    }

    const { error } = createContactSchema.validate(contact, {abortEarly: false})

    if(error) {
        return res.status(400).send(error.details.map((error) => error.message).join(", "))
    }
    
    addContact(req.body).then((contact) => res.status(201).json(contact));
    
};

export const updateContact = (req, res) => {
    if(!req.body) {
        res.send(
          HttpError(400)
        );
    }

    validateBody(updateContactSchema);

    updateContact(req.params.id, req.body).then((updatedContact) =>
      res.status(201).json(updatedContact)
    );
};
