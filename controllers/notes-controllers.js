const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const HttpError = require("../models/http-error");

const Note = require("../models/note");
const User = require("../models/user");

const getAllUsrNotes = async (req, res, next) => {
  const userId = req.userData.userId;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return next(new HttpError("Invalid user ID format.", 400));
  }
  try {
    const notes = await Note.find({ userId: userId });

    if (!notes) {
      const error = new HttpError(
        "Could not find a note for the provided id.",
        404
      );
      return next(error);
    }

    res.json({ notes: notes.map((note) => note.toObject({ getters: true })) });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a note.",
      500
    );
    return next(error);
  }
};

const getNoteById = async (req, res, next) => {
  const userId = req.userData.userId;
  const noteId = req.params.nid;
  try {
    const notes = await Note.find({ _id: noteId, userId: userId });

    if (!notes) {
      const error = new HttpError(
        "Could not find a note for the provided id.",
        404
      );
      return next(error);
    }

    res.json({ notes: notes.map((note) => note.toObject({ getters: true })) });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a note.",
      500
    );
    return next(error);
  }
};

const createNote = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const { title, content } = req.body;
  const userId = req.userData.userId;
  const createNote = new Note({
    title,
    content,
    userId,
  });
  let user;

  try {
    user = await User.findById(userId);
  } catch (err) {
    const error = new HttpError("Creating note failed, please try again", 500);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createNote.save({ session: sess });
    user.notes.push(createNote);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError("Creating note failed, please try again.", 500);
    return next(error);
  }

  res.status(201).json({ createNote: createNote });
};

const updateNote = async (req, res, next) => {
  const userId = req.userData.userId;
  const noteId = req.params.nid;
  const { title, content } = req.body;
  let updatedNote;
  try {
    updatedNote = await Note.findOne({ _id: noteId, userId });
    if (!updatedNote) {
      const error = new HttpError("Could not find note for provided id", 404);
      return next(error);
    }
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update note.",
      500
    );
    return next(error);
  }

  try {
    updatedNote.title = title;
    updatedNote.content = content;
    await updatedNote.save();
    res.status(200).json({
      notes: updatedNote.toObject({ getters: true }),
    });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update note!",
      500
    );
    return next(error);
  }
};

const deleteNote = async (req, res, next) => {
  const { nid } = req.params; // Note ID, User ID
  const { userId } = req.userData;

  let deletedNote;
  try {
    // First, find the note to delete
    deletedNote = await Note.findOne({ _id: nid, userId });
    if (!deletedNote) {
      const error = new HttpError("Could not find note for provided id", 404);
      return next(error);
    }
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find note.",
      500
    );
    return next(error);
  }

  // Now, start the session for transaction
  const sess = await mongoose.startSession();
  try {
    sess.startTransaction();

    // Delete the note from the database
    await Note.findOneAndDelete({ _id: nid, userId }, { session: sess });

    // Find the user
    const user = await User.findOne({ _id: userId }).session(sess);
    if (!user) {
      await sess.abortTransaction();
      sess.endSession();
      const error = new HttpError("Could not find user for provided ID", 404);
      return next(error);
    }

    // Remove the note from the user's notes array
    user.notes.pull(deletedNote._id);
    await user.save({ session: sess });

    // Commit the transaction
    await sess.commitTransaction();
    sess.endSession();

    // Return success response
    res.status(200).json({ message: "Deleted note." });
  } catch (err) {
    await sess.abortTransaction();
    sess.endSession();
    const error = new HttpError(
      "Something went wrong, could not delete note!",
      500
    );
    return next(error);
  }
};

const shareNote = async (req, res, next) => {
  try {
    const { nid } = req.params; // Note ID, User ID
    const { userId } = req.userData;

    const { sharedWith } = req.body; // User ID of the recipient to share with

    // Find the note and check ownership
    const note = await Note.findOne({ _id: nid, userId });
    if (!note) {
      return res
        .status(404)
        .json({ error: "Note not found or unauthorized access" });
    }

    // Check if the note is already shared with this user
    if (!sharedWith || note.sharedWith.includes(sharedWith)) {
      return res
        .status(400)
        .json({ error: "Note already shared with this user" });
    }

    // Add the user to the sharedWith array
    note.sharedWith.push(sharedWith);
    await note.save();

    res.json({ message: "Note shared successfully", note });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const findNote = async (req, res, next) => {
  try {
    const notes = await Note.find({
      $text: { $search: req.query.q },
      userId: req.userData.userId, // Ensure you're filtering by userId
    });
    res.status(200).json(notes);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not search notes!",
      500
    );
    return next(error);
  }
};

exports.getAllUsrNotes = getAllUsrNotes;
exports.getNoteById = getNoteById;
exports.createNote = createNote;
exports.updateNote = updateNote;
exports.deleteNote = deleteNote;
exports.shareNote = shareNote;
exports.findNote = findNote;
