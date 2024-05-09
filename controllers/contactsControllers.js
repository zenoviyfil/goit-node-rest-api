import HttpError from "../helpers/HttpError.js";
import contactsService from "../services/contactsServices.js";

export const getAllContacts = (req, res) => {
    const contacts = listContacts();

    return res.status(200).json(contacts)
};

export const getOneContact = (req, res) => {
    const contact = getContactById(contactId);

    if(contact) {
        return res.status(200).json(contact)
    } else {
        return res.send(HttpError(404));
    }
};

export const deleteContact = (req, res) => {
    const removedContact = removeContact(contactId);

    if(contact) {
        return res.status(200).json(removedContact)
    } else {
        return res.send(HttpError(404));
    }
};

export const createContact = (req, res) => {
    validateBody(createContactSchema);

    const newContact = addContact(req.body)
    return res.status(201).json(newContact)
};

export const updateContact = (req, res) => {
    if(!req.body) {
        return res.send(
          HttpError(400, { "message": "Body must have at least one field" })
        );
    }

    validateBody(updateContactSchema);

    const updatedContact = updateContact(req.params.id, req.body)

    if(!updatedContact) {
        return res.send(HttpError(404))
    }

    return res.status(201).json(updatedContact)
};
