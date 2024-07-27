const router = require("express").Router();
const prisma = require("../utils/prisma");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const authenticationRequired = require("../utils/authenticationRequired");

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // Find the user with the email provided
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!existingUser) {
      // If the user does not exist, return an error
      next(new Error("USER_NOT_FOUND"));
    }
    // Compare the password provided with the hashed password
    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatch) {
      // If the passwords do not match, return an error
      next(new Error("USER_NOT_FOUND"));
    }
    // Generate a JWT token
    const token = jwt.sign(
      { id: existingUser.id, email: existingUser.email },
      process.env.JWT_SECRET
    );

    // Return the token
    res.json({
      success: true,
      data: {
        id: existingUser.id,
        email: existingUser.email,
        token,
      },
    });
  } catch (e) {
    // If an error occurs, pass it to the error handler
    next(e);
  }
});

router.post("/register", async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (existingUser) {
      // If the user already exists, return an error
      next(new Error("USER_ALREADY_EXISTS"));
    }
    // TODO: Add more validation for password
    if (password.length < 8) {
      // If the password is too short, return an error
      next(new Error("PASSWORD_REQUIREMENT_LENGTH"));
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new user
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });
    // Generate a JWT token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      process.env.JWT_SECRET
    );

    // Return the token
    res.json({
      success: true,
      data: {
        id: newUser.id,
        email: newUser.email,
        token,
      },
    });
  } catch (e) {
    // If an error occurs, pass it to the error handler
    next(e);
  }
});

router.get("/me", authenticationRequired, async (req, res, next) => {
  try {
    // Return the user object attached to the request object
    res.json({
      success: true,
      data: req.user,
    });
  } catch (e) {
    // If an error occurs, pass it to the error handler
    next(e);
  }
});

module.exports = router;
