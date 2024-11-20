const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../app"); // Your Express app
const User = require("../models/user");
require("dotenv").config();

// Mock bcrypt and jwt
jest.mock("bcryptjs", () => ({
  hash: jest.fn().mockResolvedValue("hashedPassword"),
  compare: jest.fn().mockResolvedValue(true),
}));
jest.mock("jsonwebtoken", () => ({
  sign: jest.fn().mockReturnValue("fakeToken"),
}));

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = process.env.MONGO_URI;
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

afterEach(async () => {
  await User.deleteMany();
});

describe("User Controller - Signup", () => {
  test("should successfully sign up a user", async () => {
    const response = await request(app).post("/api/users/signup").send({
      email: "test@example.com",
      password: "testpassword",
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("user");

    const user = await User.findOne({ email: "test@example.com" });
    expect(user).toBeTruthy();
    expect(user).toHaveProperty("email", "test@example.com");
    expect(user.password).toBe("hashedPassword");
  });

  test("should return 422 if the email already exists", async () => {
    // Arrange: Mock existing user
    User.findOne = jest.fn().mockResolvedValue({ email: "test@example.com" });

    const response = await request(app).post("/api/users/signup").send({
      email: "test@example.com",
      password: "testpassword",
    });

    // Assert
    expect(response.status).toBe(422); // Ensure correct status code
    expect(response.body.message).toBe(
      "User exists already, please login instead."
    );
  });
});

describe("User Controller - Login", () => {
  beforeEach(async () => {
    await User.deleteMany(); // Clean up database
  });
  test("should successfully log in a user", async () => {
    const newUser = new User({
      email: "test@example.com",
      password: "hashedPassword",
    });
    await newUser.save();

    const response = await request(app).post("/api/users/login").send({
      email: "test@example.com",
      password: "testpassword",
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Logged in!" });

    const user = await User.findOne({ email: "test@example.com" });
    expect(user).toBeTruthy();
    expect(user).toHaveProperty("email", "test@example.com");
    expect(user.password).toBe(undefined);
  });

  test("should return 404 if email does not exist", async () => {
    User.findOne = jest.fn().mockResolvedValue(null);
    const response = await request(app).post("/api/users/login").send({
      email: "nonexistent@example.com",
      password: "testpassword",
    });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe(
      "Invalid credentials, could not log you in."
    );
  });

  test("should return 401 if password is incorrect", async () => {
    User.findOne = jest.fn().mockResolvedValue("test2@example.com");

    // Mock bcrypt.compare to return false
    require("bcryptjs").compare.mockResolvedValue(false);

    const response = await request(app).post("/api/users/login").send({
      email: "test2@example.com",
      password: "wrongpassword",
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe(
      "Invalid credentials, could not log you in."
    );
  });
});
