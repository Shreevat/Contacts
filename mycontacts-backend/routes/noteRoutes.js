const express = require("express");
const router = express.Router();
const {
  getNotes,
  createNote,
  getNote,
  updateNote,
  deleteNote,
} = require("../controllers/noteController");
const validateToken = require("../middleware/validateTokenHandler");

// Applying authentication 
router.use(validateToken);


router.route("/").get(getNotes).post(createNote);
router.route("/:id").get(getNote).put(updateNote).delete(deleteNote);

module.exports = router;
