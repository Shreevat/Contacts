const asyncHandler = require("express-async-handler");
const Note = require("../models/noteModel");

// @desc    Get all notes for the logged-in user
// @route   GET /api/notes
// @access  Private
const getNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find({ user: req.user.id });
  res.status(200).json(notes);
});

// @desc    Create a new note
// @route   POST /api/notes
// @access  Private
const createNote = asyncHandler(async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    res.status(400);
    throw new Error("Please provide a title and content for the note");
  }

  const note = await Note.create({
    title,
    content,
    user: req.user.id, // Link note to logged-in user
  });

  res.status(201).json(note);
});

// @desc    Get a specific note
// @route   GET /api/notes/:id
// @access  Private
const getNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (!note || note.user.toString() !== req.user.id) {
    res.status(404);
    throw new Error("Note not found or access denied");
  }

  res.status(200).json(note);
});

// @desc    Update a specific note
// @route   PUT /api/notes/:id
// @access  Private
const updateNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (!note || note.user.toString() !== req.user.id) {
    res.status(404);
    throw new Error("Note not found or access denied");
  }

  const updatedNote = await Note.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json(updatedNote);
});

// @desc    Delete a specific note
// @route   DELETE /api/notes/:id
// @access  Private
const deleteNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (!note || note.user.toString() !== req.user.id) {
    res.status(404);
    throw new Error("Note not found or access denied");
  }

  await note.remove();

  res.status(200).json({ message: "Note deleted successfully" });
});

module.exports = {
  getNotes,
  createNote,
  getNote,
  updateNote,
  deleteNote,
};
