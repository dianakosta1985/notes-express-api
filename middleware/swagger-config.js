const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Notes API",
      version: "1.0.0",
      description: "API documentation for the Notes Express application",
    },
    servers: [
      {
        url: "http://localhost:5000", // Replace with your base URL
      },
    ],
  },
  apis: ["./routes/*.js"], // Adjust the path to your route files
};

const specs = swaggerJsdoc(options);

module.exports = specs;
