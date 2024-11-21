const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Notes API",
      version: "1.0.0",
      description: "API documentation for the Notes Express application",
    },
    components: {
      schemas: {
        Note: {
          type: "object",
          properties: {
            title: {
              type: "string",
              description: "Title of the note",
            },
            content: {
              type: "string",
              description: "content of the note",
            },
            // userId: {
            //   type: "string",
            //   content: "ID of the user who created the note",
            // },
            // sharedWith: {
            //   type: "array",
            //   content: "List of users with whom the note is shared",
            //   items: {
            //     $ref: "#/components/schemas/User",
            //   },
            // },
          },
          required: ["title", "content"],
        },
        User: {
          type: "object",
          properties: {
            email: {
              type: "string",
              format: "email",
              description: "Email address of the user",
            },
            password: {
              type: "string",
              description: "Password for the user account",
            },
          },
          required: ["email", "password"],
        },
      },
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    servers: [
      {
        url: "http://localhost:5000", // Replace with your base URL
      },
    ],
  },
  apis: ["./routes/*.js"], // Adjust the path to your route files
};

const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app, port) {
  // Swagger page
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Docs in JSON format
  app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
}

module.exports = swaggerDocs;
