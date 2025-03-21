const express = require("express");
const router = express.Router();
const openAiController = require("../controllers/openAiController");

// Ask openAI for a trip planning
router.post("/planTrip", openAiController.askOpenAi);
router.post("/improveRecommendation/:threadId", openAiController.improveRecommendation);
router.delete('/cancelRequest/:threadId', openAiController.cancelRequest);
router.delete('/deleteThread/:threadId', openAiController.deleteThread);

module.exports = router;
