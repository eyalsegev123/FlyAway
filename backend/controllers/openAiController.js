const pool = require("../config/db"); // Database connection
require("dotenv").config();

exports.askOpenAi = async (req, res) => {
    try {
        const { destination, startDate, endDate, length, budget, currency, tripGenre, travelers } = req.body;

        // Handling tripGenre array to convert it into a readable string
        const genreList = tripGenre && tripGenre.length > 0 ? tripGenre.join(", ") : "none";

        // Constructing the message with all details
        const message = `Hello, I want to plan a vacation to ${destination}. 
        The period of the vacation needs to be between ${startDate} to ${endDate}, 
        and the length of the trip needs to be ${length} days. Our budget is ${budget} ${currency}. 
        The things we like are ${genreList}. Our group is going to be construcetd ${travelers}. 
        Please plan a detailed trip while considering the whole details I gave you.`;
        
        console.log("Message sent to OpenAI:", message);

        // Step 1: Create a thread
        const threadResponse = await createThread(message);
        const thread_id = threadResponse.id;

        // Step 2: Create a run
        const runResponse = await createRun(thread_id);
        const run_id = runResponse.id;
        
        //Step 3: Check status
        let runStatus = "in_progress"; 
        while (runStatus !== "completed") {
            console.log("Checking run status...");  
            const statusResponse = await checkStatus(thread_id, run_id);
            runStatus = statusResponse.status;
            console.log(`Current run status: ${runStatus}`);
            if (runStatus === "completed") {
                break; // Exit the loop if status is completed
            }
            await sleep(500); // Wait for 0.5 seconds before polling again
        }
        console.log("Run completed successfully!"); 

        //Step 4: retrieve the messages in the conversaton
        const listMessagesResponse = await listMessages(thread_id);
        const messageToReturn = listMessagesResponse.data[listMessagesResponse.data.length - 1].content[0].text.value;
        
        //Step 5: delete thread
        deleteThread(thread_id);
        
        // Sending a response back
        res.status(200).json({ message: "The process succeeded!", answer: messageToReturn });

    } catch (error) {
        console.error("Error handling OpenAI request:", error);
        res.status(500).json({ error: "Failed to process the request." });
    }

// Create a new thread
const createThread = async (message) => {
  const url = "https://api.openai.com/v1/threads"; // OpenAI API endpoint
  const headers = {
      "OpenAI-Beta": "assistants=v2",
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPEN_AI_KEY}`, // API key from .env
  };

  const body = {
      messages: [
          {
              role: "user",
              content: message,
          },
      ],
  };

  try {
      // Make the API request
      const response = await fetch(url, {
          method: "POST",
          headers: headers,
          body: JSON.stringify(body),
      });

      if (!response.ok) {
          const errorDetails = await response.json();
          throw new Error(`Failed to create thread: ${JSON.stringify(errorDetails)}`);
      }

      const data = await response.json();
      return data; // Return the thread data
  } catch (error) {
      console.error("Error creating thread:", error.message);
      throw error; // Propagate the error up
  }
};

// Create a new run
const createRun = async (threadId) => {
  const url = `https://api.openai.com/v1/threads/${threadId}/runs`; // API endpoint
  const headers = {
    "OpenAI-Beta": "assistants=v2",
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.OPEN_AI_KEY}`, // API key from .env
  };

  const body = {
    assistant_id: process.env.OPEN_AI_ASSISTANT_ID,
  };

  try {
    // Make the API request
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorDetails = await response.json(); // Parse error details
      throw new Error(`Failed to create run: ${JSON.stringify(errorDetails)}`);
    }

    const data = await response.json(); // Parse the successful response
    return data; // Return the run data
  } catch (error) {
    console.error("Error creating run:", error.message); // Log the error
    throw error; // Propagate the error up
  }
};

module.exports = { createRun };


  // Delete a thread
const deleteThread = async (thread_id) => {  
    // Validate input
    if (!thread_id) {
      console.error("Thread id invalid")
      return
    }
  
    const url = https://api.openai.com/v1/threads/${thread_id}; // API endpoint
    const headers = {
      "OpenAI-Beta": "assistants=v2",
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.AIapikey}`, // Use the API key from .env
    };
  
    try {
      // Make the DELETE request
      const response = await fetch(url, {
        method: "DELETE",
        headers: headers,
      });
  
      if (!response.ok) {
        const errorDetails = await response.json(); // Parse error details
        return res
          .status(response.status)
          .json({ error: "Failed to delete thread", details: errorDetails });
      }
  
      res.status(200).json({
        message: "Thread deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting thread:", error.message); // Log the error
    }
  };
  
  module.exports = { deleteThread };

  // Check status of a run
const checkStatus = async (thread_id, run_id) => {
  
    // Validate input
    if (!thread_id || !run_id) {
      console.error("Thread ID and Run ID are required");
      return;
    }
  
    const url = `https://api.openai.com/v1/threads/${thread_id}/runs/${run_id}`; // API endpoint
    const headers = {
      "OpenAI-Beta": "assistants=v2",
      "Content-Type": "application/json",
      Authorization: `'Bearer' ${process.env.OPEN_AI_KEY}`, // Use the API key from .env
    };
  
    try {
      // Make the GET request
      const response = await fetch(url, {
        method: "GET",
        headers: headers,
      });
  
      // Parse the response
      if (!response.ok) {
        const errorDetails = await response.json(); // Parse error details
        throw new Error(`Failed to check status: ${JSON.stringify(errorDetails)}`);
      }
  
      const statusData = await response.json(); // Parse response body
      return statusData;
    } catch (error) {
      console.error("Error checking run status:", error.message); // Log the error
    }
  };
  
  module.exports = { checkStatus };

  // List messages in a thread
const listMessages = async (req, res) => {
    const { thread_id } = req.params; // Extract thread_id from the request parameters
  
    // Validate input
    if (!thread_id) {
      return res.status(400).json({ error: "Thread ID is required" });
    }
  
    const url = https://api.openai.com/v1/threads/${thread_id}/messages; // API endpoint
    const headers = {
      "OpenAI-Beta": "assistants=v2",
      "Content-Type": "application/json",
      Authorization: Bearer ${process.env.AIapikey}, // Use the API key from .env
    };
  
    try {
      // Make the GET request
      const response = await fetch(url, {
        method: "GET",
        headers: headers,
      });
  
      // Parse the response
      if (!response.ok) {
        const errorDetails = await response.json(); // Parse error details
        return res
          .status(response.status)
          .json({ error: "Failed to fetch messages", details: errorDetails });
      }
  
      const messages = await response.json(); // Parse response body
      res.status(200).json({
        message: "Messages retrieved successfully",
        data: messages,
      });
    } catch (error) {
      console.error("Error fetching messages:", error.message); // Log the error
      res.status(500).json({ error: "Internal Server Error", details: error.message }); // Return server error
    }
  };
  
  module.exports = { listMessages };
  

};


