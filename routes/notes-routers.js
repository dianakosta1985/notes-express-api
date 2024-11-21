const express = require("express");
const { check } = require("express-validator");

const notesController = require("../controllers/notes-controllers");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Notes
 *   description: API endpoints for managing notes
 */

/**
 * @swagger
 * /api/notes:
 *   get:
 *     summary: Get all notes for a user
 *     tags: [Notes]
 *     responses:
 *       200:
 *         description: List of notes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Note'
 *       404:
 *         description: Notes not found
 */
router.get("/", notesController.getAllUsrNotes);

/**
 * @swagger
 * /api/notes/getNote/{nid}:
 *   get:
 *     summary: Get a specific note for a user
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: nid
 *         required: true
 *         schema:
 *           type: string
 *         description: Note ID
 *     responses:
 *       200:
 *         description: A specific note
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Note'
 *       404:
 *         description: Note not found
 */
router.get("/getNote/:nid", notesController.getNoteById);

/**
 * @swagger
 * /api/notes/create:
 *   post:
 *     summary: Create a new note
 *     tags: [Notes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Note'
 *     responses:
 *       201:
 *         description: Note created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Note'
 *       422:
 *         description: Invalid input
 */
router.post(
  "/create",
  [check("title").not().isEmpty(), check("content").not().isEmpty()],
  notesController.createNote
);

/**
 * @swagger
 * /api/notes/{nid}:
 *   patch:
 *     summary: Update a note
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: nid
 *         required: true
 *         schema:
 *           type: string
 *         description: Note ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Note'
 *     responses:
 *       200:
 *         description: Note updated
 *       404:
 *         description: Note not found
 */
router.patch(
  "/:nid",
  [check("title").not().isEmpty(), check("content").not().isEmpty()],
  notesController.updateNote
);

/**
 * @swagger
 * /api/notes/{nid}:
 *   delete:
 *     summary: Delete a note
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: nid
 *         required: true
 *         schema:
 *           type: string
 *         description: Note ID
 *     responses:
 *       200:
 *         description: Note deleted
 *       404:
 *         description: Note not found
 */
router.delete("/:nid", notesController.deleteNote);

/**
 * @swagger
 * /api/notes/{nid}/share:
 *   post:
 *     summary: Share a note with another user
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: nid
 *         required: true
 *         schema:
 *           type: string
 *         description: Note ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sharedWith:
 *                 type: string
 *                 description: User ID of the user to share the note with
 *     responses:
 *       200:
 *         description: Note shared successfully
 *       404:
 *         description: User or note not found
 */
router.post("/:nid/share", notesController.shareNote);

/**
 * @swagger
 * /api/notes/search:
 *   get:
 *     summary: Search notes by query
 *     tags: [Notes]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *           description: The search query to filter notes
 *     responses:
 *       200:
 *         description: A list of notes matching the query
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Note'
 *       400:
 *         description: Bad request if the query parameter is missing or invalid
 *       500:
 *         description: Internal server error
 */
router.get("/search", notesController.findNote);

module.exports = router;
