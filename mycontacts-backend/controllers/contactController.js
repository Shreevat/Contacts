const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel"); //importing the model

//description: get all contact
//route will be GET /api/contacts
//acesss define. private

const getContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find({ user_id: req.user.id });
  res.status(200).json(contacts);
});

//////////////////////////////////////////////////////////

//description: Create contact
//route will be POST /api/contacts
//acesss define. private

const createContact = asyncHandler(async (req, res) => {
  console.log("the requested body is:", req.body);
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }
  const contact = await Contact.create({
    name,
    email,
    phone,
    user_id: req.user.id, //associating the contact with the user
  });
  res.status(201).json(contact);
});

//description: Get contact by id
//route will be GET /api/contacts/:id
//acesss define. private

const getContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("not found");
  }
  res.status(200).json(contact);
});

//description: Update contact by id
//route will be PUT /api/contacts/:id
//acesss define. private

const updateContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("not found");
  }

  if (contact.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("User dont have permission");
  }

  const updatedContact = await Contact.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true } //return updated contact instead of old )
  );
  res.status(200).json(updatedContact);
});

//description: Delete contact by id
//route will be DELETE /api/contacts/:id
//acesss define. public

const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("not found");
  }
  if (contact.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("User dont have permission");
  }
  await Contact.deleteOne({ _id: req.params.id });
  res.status(200).json(contact);
});

module.exports = {
  getContacts,
  createContact,
  getContact,
  updateContact,
  deleteContact,
};
