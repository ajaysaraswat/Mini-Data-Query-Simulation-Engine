const express = require("express");
const router = express.Router();
const queryController = require("../controllers/queryController");

router.post("/query", queryController.processQuery);
router.post("/explain", queryController.explainQuery);
router.post("/validate", queryController.validateQuery);

module.exports = router;
