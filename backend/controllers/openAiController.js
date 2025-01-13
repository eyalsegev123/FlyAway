const { Console } = require("console");
const pool = require("../config/db.js"); // Database connection
const openAiService = require("../services/openAIService.js");

exports.askOpenAi = async (req, res) => {
  try {
    const {
      destination,
      startDate,
      endDate,
      tripLength,
      budget,
      currency,
      tripGenres,
      travelers,
      additionalNotes,
    } = req.body;

    const genreList = tripGenres && tripGenres.length > 0 ? tripGenres.join(", ") : "dynamic";
    console.log("destination:  ${destination}");
    console.log("Additional Notes:  ${additionalNotes}")
    const message = `Hello, I want to plan a vacation to ${destination}. 
        The period of the vacation needs to be between ${startDate} to ${endDate}, 
        and the length of the trip needs to be ${tripLength} days. Our budget is ${budget} ${currency} per person. 
        The things we like are ${genreList}. Our group is going to be constructed of ${travelers}. ${additionalNotes}.
        Please plan a detailed trip while considering the whole details I gave you. `;


    console.log("Message sent to OpenAI:", message);

    // Use the OpenAiService for the API interactions
    //Step 1: Create a thread
    const threadResponse = await openAiService.createThread(message);
    const threadId = threadResponse.id;
    console.log(threadId + " created");

    //Step 2: Create a run
    const runResponse = await openAiService.createRun(threadId);
    const runId = runResponse.id;
    console.log(runId+ " created");

    //Step 3: Check Status of the run
    let runStatus = "in_progress";
    while (runStatus !== "completed") {
      console.log("Checking run status...");
      const statusResponse = await openAiService.checkStatus(threadId, runId);
      runStatus = statusResponse.status;
      if (runStatus === "completed") break;
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    console.log("Run completed successfully!");
    const listMessagesResponse = await openAiService.listMessages(threadId);
    const messageToReturn =
      listMessagesResponse.data[0].content[0]
        .text.value;

    console.log("message returned:" + messageToReturn);

    //Step 4: Delete the thread
    await openAiService.deleteThread(threadId);
    console.log("thread deleted");

    //Step 5: Return the response to the client
    res
      .status(200)
      .json({ message: "The process succeeded!", answer: messageToReturn });
  } catch (error) {
    console.error("Error handling OpenAI request:", error);
    res.status(500).json({ error: "Failed to process the request." });
  }
};
