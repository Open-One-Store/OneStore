const router = require("express").Router();

router.use("/auth", require("./auth"));
router.use("/categories", require("./categories"));
router.use("/tags", require("./tags"));
router.use("/items", require("./items"));

module.exports = router;
