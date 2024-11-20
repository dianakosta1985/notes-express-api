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
 * /api/notes/user/{uid}:
 *   get:
 *     summary: Get all notes for a user
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
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
router.get("/user/:uid", notesController.getAllUsrNotes);

/**
 * @swagger
 * /api/notes/{nid}/user/{uid}:
 *   get:
 *     summary: Get a specific note for a user
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
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
router.get("/:nid/user/:uid", notesController.getNoteById);

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
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the note
 *               description:
 *                 type: string
 *                 description: Content of the note
 *               userId:
 *                 type: string
 *                 description: ID of the user
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
  [
    check("title").not().isEmpty(),
    check("description").not().isEmpty(),
    check("userId").not().isEmpty(),
  ],
  notesController.createNote
);

/**
 * @swagger
 * /api/notes/{nid}/user/{uid}:
 *   patch:
 *     summary: Update a note
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
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
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Note updated
 *       404:
 *         description: Note not found
 */
router.patch(
  "/:nid/user/:uid/",
  [check("title").not().isEmpty(), check("description").not().isEmpty()],
  notesController.updateNote
);

/**
 * @swagger
 * /api/notes/{nid}/user/{uid}:
 *   delete:
 *     summary: Delete a note
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
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
router.delete("/:nid/user/:uid", notesController.deleteNote);

/**
 * @swagger
 * /api/notes/{nid}/user/{uid}/share:
 *   post:
 *     summary: Share a note with another user
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
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
 *                 description: ID of the user to share with
 *     responses:
 *       200:
 *         description: Note shared successfully
 *       404:
 *         description: User or note not found
 */
router.post("/:nid/user/:uid/share", notesController.shareNote);

/**
 * @swagger
 * /api/notes/search/{userId}:
 *   get:
 *     summary: Search notes by query
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query
 *     responses:
 *       200:
 *         description: List of notes matching the query
 */
router.get("/search/:userId", notesController.findNote);

module.exports = router;
