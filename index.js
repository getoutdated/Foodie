const express = require("express"); // Importing Express framework
const cors = require("cors"); // Importing CORS for handling cross-origin requests
const app = express(); // Creating an instance of Express
const port = 8000; // Setting the port number

// Connect to MongoDB
const mongoDb = require("./db"); // Importing the function to connect to MongoDB from db.js
mongoDb(); // Invoking the function to connect to MongoDB

app.use(cors()); // Adding CORS middleware to enable cross-origin requests

// Middleware to set CORS headers for all routes
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000"); // Allowing requests from localhost:3000
  res.setHeader("Access-Control-Allow-Headers", "Content-Type"); // Allowing Content-Type header
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  ); // Allowing specified HTTP methods
  next(); // Moving to the next middleware/route handler
});

app.use(express.json()); // Middleware to parse incoming JSON requests
app.use("/api", require("./Routes/CreateUser")); // Route for handling user creation
app.use("/api", require("./Routes/DisplayData")); // Route for displaying data
app.use("/api", require("./Routes/OrderData")); // Route for handling order-related operations

// Default route
app.get("/", (req, res) => {
  res.send("Hello World!"); // Sending "Hello World!" for requests to the root route
});

// Start listening on the specified port
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`); // Logging a message when the server starts listening
});
