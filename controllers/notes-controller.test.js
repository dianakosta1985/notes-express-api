require("dotenv").config();
const mongoose = require("mongoose");
const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../app"); // Assume this is where your Express app is defined
const Note = require("../models/note");
const User = require("../models/user");
const { MongoMemoryServer } = require("mongodb-memory-server");
const MONGO_URI = process.env.MONGO_URI;
let mongoServer;

jest.mock("bcryptjs", () => ({
  hash: jest.fn().mockResolvedValue("hashedPassword"),
  compare: jest.fn().mockResolvedValue(true),
}));

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = MONGO_URI;
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterEach(async () => {
  await Note.deleteMany();
  await User.deleteMany();
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("Notes Controller Tests", () => {
  let user;
  let note;
  let token; // Variable to store the JWT token

  beforeEach(async () => {
    // Create a mock user with a password
    user = new User({
      _id: new mongoose.Types.ObjectId(),
      email: "test@example.com",
      password: "testpassword", // Add a password field
      notes: [],
    });
    await user.save();

    // Create a mock note
    note = new Note({
      title: "Test Note",
      content: "This is a test note",
      userId: user._id,
    });
    await note.save();
    user.notes.push(note._id);
    await user.save();

    // Generate JWT token for the user
    token = jwt.sign(
      { userId: user._id.toString(), email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
  });

  test("should get all notes for a user", async () => {
    const res = await request(app)
      .get("/api/notes/")
      .set("Authorization", `Bearer ${token}`); // Add token to Authorization header
    expect(res.status).toBe(200);
    expect(res.body.notes).toHaveLength(1);
    expect(res.body.notes[0].title).toBe(note.title);
  });

  test("should get a note by its ID", async () => {
    const res = await request(app)
      .get(`/api/notes/getNote/${note._id}`)
      .set("Authorization", `Bearer ${token}`); // Add token to Authorization header
    expect(res.status).toBe(200);
    expect(res.body.notes[0].title).toBe(note.title);
  });

  test("should create a new note", async () => {
    const newNote = {
      title: "New Note",
      content: "This is a new note",
      userId: user._id.toString(),
    };

    const res = await request(app)
      .post("/api/notes/create")
      .set("Authorization", `Bearer ${token}`) // Add token to Authorization header
      .send(newNote);
    expect(res.status).toBe(201);
    expect(res.body.createNote.title).toBe(newNote.title);

    const notes = await Note.find();
    expect(notes).toHaveLength(2); // Ensure a new note was added
  });

  test("should update an existing note", async () => {
    const updatedData = {
      title: "Updated Title",
      content: "Updated content",
    };

    const res = await request(app)
      .patch(`/api/notes/${note._id}`)
      .set("Authorization", `Bearer ${token}`) // Add token to Authorization header
      .send(updatedData);

    expect(res.status).toBe(200);
    expect(res.body.notes.title).toBe(updatedData.title);
  });

  test("should delete a note", async () => {
    const res = await request(app)
      .delete(`/api/notes/${note._id}`)
      .set("Authorization", `Bearer ${token}`); // Add token to Authorization header
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Deleted note.");

    const notes = await Note.find();
    expect(notes).toHaveLength(0);
  });

  test("should share a note with another user", async () => {
    const anotherUser = new User({
      _id: new mongoose.Types.ObjectId(),
      email: "other@example.com",
      password: "OtherUser",
      notes: [],
    });
    await anotherUser.save();

    const res = await request(app)
      .post(`/api/notes/${note._id}/share`)
      .set("Authorization", `Bearer ${token}`) // Add token to Authorization header
      .send({ sharedWith: anotherUser._id });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Note shared successfully");

    const sharedNote = await Note.findById(note._id);
    expect(sharedNote.sharedWith).toContainEqual(anotherUser._id);
  });

  test("should search for notes with a keyword", async () => {
    const res = await request(app)
      .get(`/api/notes/search?q=Test`)
      .set("Authorization", `Bearer ${token}`); // Add token to Authorization header

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].title).toBe("Test Note");
  });
});
