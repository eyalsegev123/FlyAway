const { Console } = require("console");
const pool = require("../config/db.js"); // Database connection
const openAiService = require("../services/openAIService.js");

// Keep track of active threads and their associated run IDs
const activeThreads = new Map();

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
    console.log(`destination: ${destination}`);
    console.log(`Additional Notes: ${additionalNotes}`);
    const message = `Hello, I want to plan a vacation to ${destination}. 
        The period of the vacation needs to be between ${startDate} to ${endDate}, 
        and the length of the trip needs to be ${tripLength} days. Our budget is ${budget} ${currency} per person. 
        The things we like are ${genreList}. Our group is going to be constructed of ${travelers}. ${additionalNotes}.
        Please plan a detailed trip while considering the whole details I gave you. `;

    console.log("Message sent to OpenAI:", message);

    // Step 1: Create a thread
    const threadResponse = await openAiService.createThread(message);
    const threadId = threadResponse.id;
    console.log(`Thread ${threadId} created`);
    
    // Initialize in the active threads map (without a run ID yet)
    activeThreads.set(threadId, { status: 'in_progress' });
    
    // Set response headers to track thread ID but don't send chunked response yet
    // Instead, we'll attach the thread ID to the request object for later use
    req.openAiThreadId = threadId;

    // Step 2: Create a run
    const runResponse = await openAiService.createRun(threadId);
    const runId = runResponse.id;
    console.log(`Run ${runId} created`);
    
    // Now update the thread entry with the run ID
    activeThreads.set(threadId, { 
      status: 'in_progress',
      runId: runId 
    });

    // Step 3: Check Status of the run
    let runStatus = "in_progress";
    
    // Check if the client has already disconnected
    const checkCancellation = () => {
      return !activeThreads.has(threadId) || activeThreads.get(threadId).status === 'cancelled';
    };
    
    while (runStatus !== "completed") {
      // Check if the request was cancelled
      if (checkCancellation()) {
        // Get the run ID from our map
        const threadInfo = activeThreads.get(threadId);
        
        // Attempt to cancel the run if we have a run ID
        if (threadInfo && threadInfo.runId) {
          try {
            await openAiService.cancelRun(threadId, threadInfo.runId);
            console.log(`Run ${threadInfo.runId} cancelled by user`);
          } catch (cancelError) {
            console.error("Error cancelling run:", cancelError);
          }
        }
        
        // Clean up and return
        await openAiService.deleteThread(threadId);
        activeThreads.delete(threadId);
        
        // If headers haven't been sent yet, send a cancellation response
        if (!res.headersSent) {
          return res.status(499).json({ message: "Request cancelled" });
        }
        return; // Exit the function
      }
      
      console.log("Checking run status...");
      const statusResponse = await openAiService.checkStatus(threadId, runId);
      runStatus = statusResponse.status;
      
      if (runStatus === "completed") break;
      
      // Wait before checking again
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    // If we've gotten here, the run completed successfully
    console.log("Run completed successfully!");
    
    // Only proceed if the request wasn't cancelled
    if (!checkCancellation()) {
      const listMessagesResponse = await openAiService.listMessages(threadId);
      const messageToReturn = listMessagesResponse.data[0].content[0].text.value;

      console.log("Message returned:", messageToReturn);

      // Delete the thread
      await openAiService.deleteThread(threadId);
      console.log("Thread deleted");
      
      // Remove from active threads
      activeThreads.delete(threadId);

      // Return the response in the expected format (not chunked)
      return res.status(200).json({ 
        message: "The process succeeded!", 
        answer: messageToReturn 
      });
    }
  } catch (error) {
    console.error("Error handling OpenAI request:", error);
    
    // If there was a thread created, clean it up
    if (req.openAiThreadId && activeThreads.has(req.openAiThreadId)) {
      try {
        await openAiService.deleteThread(req.openAiThreadId);
        activeThreads.delete(req.openAiThreadId);
        console.log(`Thread ${req.openAiThreadId} deleted after error`);
      } catch (cleanupError) {
        console.error("Error cleaning up thread:", cleanupError);
      }
    }
    
    // Send error response
    return res.status(500).json({ error: "Failed to process the request." });
  }
};

// Add a new endpoint to handle cancellation requests
exports.cancelRequest = async (req, res) => {
  const { threadId } = req.params;
  
  if (!threadId) {
    return res.status(400).json({ error: "Thread ID is required" });
  }
  
  try {
    // Mark the thread as cancelled if it exists
    if (activeThreads.has(threadId)) {
      // Just update the status but keep the runId
      const currentInfo = activeThreads.get(threadId);
      activeThreads.set(threadId, { 
        ...currentInfo,
        status: 'cancelled' 
      });
      
      console.log(`Thread ${threadId} marked for cancellation`);
      res.status(200).json({ message: "Request cancellation initiated" });
    } else {
      res.status(404).json({ error: "Thread not found or already completed" });
    }
  } catch (error) {
    console.error("Error cancelling request:", error);
    res.status(500).json({ error: "Failed to cancel the request" });
  }
};

// Clean up any lingering threads when the server restarts
process.on('SIGINT', async () => {
  console.log("Server shutting down, cleaning up active threads...");
  
  // Attempt to clean up all active threads
  for (const [threadId, threadInfo] of activeThreads.entries()) {
    try {
      await openAiService.deleteThread(threadId);
      console.log(`Thread ${threadId} cleaned up during shutdown`);
    } catch (error) {
      console.error(`Failed to clean up thread ${threadId}:`, error);
    }
  }
  
  // Clear the map
  activeThreads.clear();
  process.exit(0);
});