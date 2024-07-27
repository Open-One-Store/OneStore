const express = require("express");
const routes = require("./routes");
const Cors = require("cors");

const app = express();

// Custom error handler
const errorHandler = (err, req, res, next) => {
  console.error(err);
  switch (err.message) {
    case "USER_NOT_FOUND":
      // If the error is "USER_NOT_FOUND", return a 401 error
      res.status(401).json({ error: "Invalid Credentials" });
      break;
    case "USER_ALREADY_EXISTS":
      // If the error is "USER_ALREADY_EXISTS", return a 409 error
      res.status(409).json({ error: "User already exists" });
      break;
    case "PASSWORD_REQUIREMENT_LENGTH":
      // If the error is "PASSWORD_REQUIREMENT_LENGTH", return a 400 error
      res
        .status(400)
        .json({ error: "Password must be at least 8 characters long" });
      break;
    default:
      // If the error is not recognized, return a generic error message
      return res.status(500).json({ error: "Internal server error" });
  }
};

app.use(express.json()); // Parse JSON bodies
app.use(Cors()); // Enable CORS
app.use(errorHandler); // Custom error handler

app.use("/", routes);

app.listen(parseInt(process.env.PORT) || 3000, () => {
  console.log("Server is running on port 3000");
});
