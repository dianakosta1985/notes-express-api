const express = require("express");
const path = require("path");
require("dotenv").config();
const mongoose = require("mongoose");
const swaggerDocs = require("./utils/swagger-config");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const notesRouter = require("./routes/notes-routers");
const usersRouter = require("./routes/users-routes");
const verifyToken = require("./middleware/check-auth");

const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI;
app.use("/utils", express.static(path.join(__dirname, "utils")));
app.use(bodyParser.json());

app.use(cors()); // Enable CORS for all routes
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

app.use("/api/users", usersRouter);
app.use("/api/notes", verifyToken, notesRouter);

app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

mongoose
  .connect(MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      swaggerDocs(app, PORT);
    });
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = app;
