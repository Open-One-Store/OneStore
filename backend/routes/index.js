const router = require("express").Router();

router.use("/auth", require("./auth"));
router.use("/categories", require("./categories"));

module.exports = router;
