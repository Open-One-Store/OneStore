const jwt = require("jsonwebtoken");
const prisma = require("./prisma");
/**
 * Middleware that checks if the user is authenticated
 * @param {Request} req - Request object
 * @param {Response} res - Response object
 * @param {Function} next - Next function
 * @returns {void}
 */
function authenticationRequired(req, res, next) {
  // Get the token from the Authorization header (Bearer token)
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    // If the token is missing, return a 401 error
    return res.status(401).json({ error: "Unauthorized" });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      // If the token is invalid, return a 403 error
      return res.status(403).json({ error: "Forbidden" });
    }
    // Attach the user object to the request object
    user = prisma.user
      .findUnique({
        where: {
          id: user.id,
        },
      })
      .then((user) => {
        req.user = {
          id: user.id,
          email: user.email,
          name: user.name,
          imageUrl: user.imageUrl,
        };
        next();
      });
  });
}

module.exports = authenticationRequired;
