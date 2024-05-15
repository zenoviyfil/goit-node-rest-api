import Joi from "joi";
import mongoose from "mongoose";

export const createContactSchema = Joi.object({
<<<<<<< HEAD
  name: Joi.string().required().min(3),
  email: Joi.string().email().required(),
  phone: Joi.number().required().min(8),
  favorite: Joi.boolean()
=======
    name: Joi.string().required().min(3),
    email: Joi.string().email().required(),
    phone: Joi.number().required().min(8)
>>>>>>> main
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3),
  email: Joi.string().email(),
  phone: Joi.number().min(8),
  favorite: Joi.boolean()
});

export const updateFavorite = Joi.object({
  name: Joi.string().min(3),
  email: Joi.string().email(),
  phone: Joi.number().min(8),
  favorite: Joi.boolean().required()
})

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Set name for contact"],
  },
  email: {
    type: String,
    required: [true, "Set email for contact"],
  },
  phone: {
    type: String,
    required: [true, "Set phone for contact"],
  },
  favorite: {
    type: Boolean,
    default: false,
  },
});

export const Contact = mongoose.model("Contact", contactSchema);