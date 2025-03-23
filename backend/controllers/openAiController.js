const { Console } = require("console");
const pool = require("../config/db.js"); // Database connection
const openAiService = require("../services/openAIService.js");

// Keep track of active threads and their associated run IDs
const activeThreads = new Map();

//Helper function to handle the OpenAI thread
const handleOpenAiThread = async (threadId, res) => {
  // Step 1: Create a run
  const runResponse = await openAiService.createRun(threadId);
  const runId = runResponse.id;
  console.log(`Run ${runId} created`);


  activeThreads.set(threadId, {
    status: 'in_progress',
    runId: runId,
  });

  let runStatus = 'in_progress';

  const checkCancellation = () => {
    return (
      !activeThreads.has(threadId) ||
      activeThreads.get(threadId).status === 'cancelled'
    );
  };

  while (runStatus !== 'completed') {
    if (checkCancellation()) {
      const threadInfo = activeThreads.get(threadId);

      if (threadInfo && threadInfo.runId) {
        try {
          await openAiService.cancelRun(threadId, threadInfo.runId);
          console.log(`Run ${threadInfo.runId} cancelled by user`);
        } catch (cancelError) {
          console.error('Error cancelling run:', cancelError);
        }
      }

      await openAiService.deleteThread(threadId);
      activeThreads.delete(threadId);

      if (!res.headersSent) {
        return res.status(499).json({ message: 'Request cancelled' });
      }
      return;
    }

    console.log('Checking run status...');
    const statusResponse = await openAiService.checkStatus(threadId, runId);
    runStatus = statusResponse.status;

    if (runStatus === 'completed') break;

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  console.log('Run completed successfully!');

  if (!checkCancellation()) {
    const listMessagesResponse = await openAiService.listMessages(threadId);
    const messageToReturn =
      listMessagesResponse.data[0].content[0].text.value;

    console.log('Message returned:', messageToReturn);

    return res.status(200).json({
      message: 'The process succeeded!',
      answer: messageToReturn,
      threadId: threadId
    });
  }
};

const askOpenAi = async (req, res) => {
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

    const genreList =
    tripGenres && tripGenres.length > 0
      ? tripGenres.join(', ')
      : 'dynamic';

    const destinationList = destination
    .split(',')
    .map(dest => dest.trim())
    .filter(dest => dest !== '');
  
    let reviews = "";

    if (destinationList.length > 0) {
      const placeholders = destinationList.map((_, i) => `$${i + 1}`).join(', ');
      const query = `SELECT destination, review FROM trips WHERE destination IN (${placeholders})`;
      const result = await pool.query(query, destinationList);

      if (result.rows.length > 0) {
        reviews = result.rows
          .map((row, i) => `Review ${i + 1} for ${row.destination}: ${row.review}`)
          .join('\n');
      }
    }

    const message = `Hello, I want to plan a vacation to ${destination}. 
      The period of the vacation needs to be between ${startDate} to ${endDate}, 
      and the length of the trip should be ${tripLength} days. Our budget is ${budget} ${currency} per person, excluding flights. 
      The types of activities we enjoy are ${genreList}. Our group is going to be constructed of ${travelers}. ${additionalNotes}.
      Please plan a detailed trip while considering the whole details I gave you.
      If for any reason this plan is not fully possible or the trip genres don't fit the destination, please suggest adjustments or alternatives.
      
      Here are some past user reviews for these destinations:
      ${reviews || "No reviews found for these destinations."}
      `;

    const threadResponse = await openAiService.createThread(message);
    const threadId = threadResponse.id;
    console.log(`Thread ${threadId} created`);

    console.log(`Message sent to openAI: ${message}`);

    activeThreads.set(threadId, { status: 'in_progress' });
    setDeletionTimer(threadId);
    req.openAiThreadId = threadId;

    return await handleOpenAiThread(threadId, res);
  } catch (error) {
    console.error('Error handling OpenAI request:', error);

    if (req.openAiThreadId && activeThreads.has(req.openAiThreadId)) {
      try {
        const threadInfo = activeThreads.get(req.openAiThreadId);
        if (threadInfo.timer) {
          clearTimeout(threadInfo.timer);
        }
  
        await openAiService.deleteThread(req.openAiThreadId);
        activeThreads.delete(req.openAiThreadId);
    
        console.log(`Thread ${req.openAiThreadId} cleaned after error`);
      } catch (cleanupError) {
        console.error("Error cleaning up thread after failure:", cleanupError);
      }
    }
    
    return res.status(500).json({ error: 'Failed to process the request.' });
  }
};

// Add a new endpoint to handle cancellation requests
const cancelRequest = async (req, res) => {
  const { threadId } = req.params;
  
  if (!threadId) {
    return res.status(400).json({ error: "Thread ID is required" });
  }
  
  try {
    // Mark the thread as cancelled if it exists
    if (activeThreads.has(threadId)) {
      const currentInfo = activeThreads.get(threadId);

      // Mark as cancelled and clear timer
      if (currentInfo.timer) {
        clearTimeout(currentInfo.timer);
      }

      activeThreads.set(threadId, {
        ...currentInfo,
        status: 'cancelled',
        timer: null,
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

const improveRecommendation = async (req, res) => {
  const { threadId } = req.params;
  const { message } = req.body;

  if (!threadId || !message) {
    return res
      .status(400)
      .json({ error: 'Thread ID and message are required' });
  }

  try {
    if (activeThreads.has(threadId)) {
      await openAiService.createMessage(threadId, message);
      setDeletionTimer(threadId);
      return await handleOpenAiThread(threadId, res);
    } else {
      res.status(404).json({ error: 'Thread not found' });
    }
  } catch (error) {
    console.error('Error in improveRecommendation:', error);
    res.status(500).json({ error: 'Failed to improve recommendation' });
  }
};

const deleteThread = async (req, res) => {

  const { threadId } = req.params;
 
  try {
    const threadInfo = activeThreads.get(threadId);
    if (threadInfo && threadInfo.timer) {
      clearTimeout(threadInfo.timer);
    }

    // Delete the thread
    await openAiService.deleteThread(threadId);
    console.log("Thread deleted");
    
    // Remove from active threads
    activeThreads.delete(threadId); 
  } catch(error) {
    console.error("Error cancelling request:", error);
    res.status(500).json({ error: "Failed to deleteThread" });
  }

};

//Helper function to set a deletion timer for a thread
const setDeletionTimer = (threadId, timeoutMs = 15 * 60 * 1000) => {
  const threadInfo = activeThreads.get(threadId);
  
  // If there's an existing timer, clear it first
  if (threadInfo && threadInfo.timer) {
    clearTimeout(threadInfo.timer);
  }

  // Set a new timer
  const timer = setTimeout(async () => {
    try {
      await openAiService.deleteThread(threadId);
      console.log(`Thread ${threadId} auto-deleted after inactivity.`);
    } catch (err) {
      console.error(`Error auto-deleting thread ${threadId}:`, err);
    } finally {
      activeThreads.delete(threadId);
    }
  }, timeoutMs);

  // Update the existing threadInfo or create a new entry
  activeThreads.set(threadId, {
    ...(threadInfo || {}),
    timer,
  });
};

// Clean up any lingering threads when the server restarts
process.on('SIGINT', async () => {
  console.log("Server shutting down, cleaning up active threads...");
  
  // Attempt to clean up all active threads
  for (const [threadId, threadInfo] of activeThreads.entries()) {
    if (threadInfo.timer) clearTimeout(threadInfo.timer);

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

module.exports = {
  askOpenAi,
  improveRecommendation,
  cancelRequest,
  deleteThread
}


