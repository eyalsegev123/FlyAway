const pool = require("../config/db"); // Database connection

exports.askOpenAi = async (req, res) => {
    try {
        const { destination, startDate, endDate, length, budget, currency, tripGenre, travelers } = req.body;

        // Handling tripGenre array to convert it into a readable string
        const genreList = tripGenre && tripGenre.length > 0 ? tripGenre.join(", ") : "none";

        // Constructing the message with all details
        const message = `Hello, I want to plan a vacation to ${destination}. The period of the vacation needs to be between ${startDate} to ${endDate}, and the length of the trip needs to be ${length} days. Our budget is ${budget} ${currency}. The things we like are ${genreList}. We are going to be ${travelers}. Please plan a detailed trip while considering the whole details I gave you.`;
        console.log("Message sent to OpenAI:", message);
        
        //** API request to openAI assistant with those message (create thread, create run, list message, delete thread)
        // **
        // **
        //  **

        // Sending a response back
        res.status(200).json({ message: "Request sent to OpenAI successfully.", details: message });
    } catch (error) {
        console.error("Error handling OpenAI request:", error);
        res.status(500).json({ error: "Failed to process the request." });
    }
/*
// Create a new thread
const createThread = async (req, res) => {
  const { message } = req.body; // Extract 'message' from the request body

  // Validate input
  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  const url = "https://api.openai.com/v1/threads"; // API endpoint
  const headers = {
    "OpenAI-Beta": "assistants=v2",
    "Content-Type": "application/json",
    Authorization: Bearer ${process.env.AIapikey}, // Use the API key from .env
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
      const errorDetails = await response.json(); // Parse error details
      return res
        .status(response.status)
        .json({ error: "Failed to create thread", details: errorDetails });
    }

    const data = await response.json(); // Parse the successful response

    res.status(201).json({
      message: "Thread created successfully",
      thread: data, // Return the full thread data
    });
  } catch (error) {
    console.error("Error creating thread:", error.message); // Log the error
    res.status(500).json({ error: "Internal Server Error", details: error.message }); // Return server error
  }
};

module.exports = { createThread };

// Create a new run
const createRun = async (req, res) => {
    const { thread_id, assistant_id } = req.body; // Extract thread_id and assistant_id from the request body
  
    // Validate input
    if (!thread_id || !assistant_id) {
      return res.status(400).json({ error: "Thread ID and Assistant ID are required" });
    }
  
    const url = https://api.openai.com/v1/threads/${thread_id}/runs; // API endpoint
    const headers = {
      "OpenAI-Beta": "assistants=v2",
      "Content-Type": "application/json",
      Authorization: Bearer ${process.env.AIapikey}, // Use the API key from .env
    };
  
    const body = {
      assistant_id: assistant_id,
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
        return res
          .status(response.status)
          .json({ error: "Failed to create run", details: errorDetails });
      }
  
      const data = await response.json(); // Parse the successful response
  
      res.status(201).json({
        message: "Run created successfully",
        run: data, // Return the run data
      });
    } catch (error) {
      console.error("Error creating run:", error.message); // Log the error
      res.status(500).json({ error: "Internal Server Error", details: error.message }); // Return server error
    }
  };
  
  module.exports = { createRun };

  // Delete a thread
const deleteThread = async (req, res) => {
    const { thread_id } = req.params; // Extract thread_id from the request parameters
  
    // Validate input
    if (!thread_id) {
      return res.status(400).json({ error: "Thread ID is required" });
    }
  
    const url = https://api.openai.com/v1/threads/${thread_id}; // API endpoint
    const headers = {
      "OpenAI-Beta": "assistants=v2",
      "Content-Type": "application/json",
      Authorization: Bearer ${process.env.AIapikey}, // Use the API key from .env
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
      res.status(500).json({ error: "Internal Server Error", details: error.message }); // Return server error
    }
  };
  
  module.exports = { deleteThread };

  // Check status of a run
const checkStatus = async (req, res) => {
    const { thread_id, run_id } = req.params; // Extract thread_id and run_id from the request parameters
  
    // Validate input
    if (!thread_id || !run_id) {
      return res.status(400).json({ error: "Thread ID and Run ID are required" });
    }
  
    const url = https://api.openai.com/v1/threads/${thread_id}/runs/${run_id}; // API endpoint
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
          .json({ error: "Failed to fetch run status", details: errorDetails });
      }
  
      const statusData = await response.json(); // Parse response body
      res.status(200).json({
        message: "Run status retrieved successfully",
        data: statusData,
      });
    } catch (error) {
      console.error("Error checking run status:", error.message); // Log the error
      res.status(500).json({ error: "Internal Server Error", details: error.message }); // Return server error
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
  */

};


