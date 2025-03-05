require("dotenv").config();

class OpenAiService {
  constructor() {
    this.headers = {
      "OpenAI-Beta": "assistants=v2",
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPEN_AI_KEY}`,
    };
  }

  async createThread(message) {
    const url = "https://api.openai.com/v1/threads";

    if (!message) throw new Error("Message is invalid");

    const body = {
      messages: [{ role: "user", content: message }],
    };

    const response = await fetch(url, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorDetails = await response.json();
      throw new Error(
        `Failed to create thread: ${JSON.stringify(errorDetails)}`
      );
    }

    return response.json();
  }

  async createRun(threadId) {
    const url = `https://api.openai.com/v1/threads/${threadId}/runs`;

    if (!threadId) throw new Error("Thread ID is invalid");

    const body = { assistant_id: process.env.OPEN_AI_ASSISTANT_ID };

    const response = await fetch(url, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorDetails = await response.json();
      throw new Error(`Failed to create run: ${JSON.stringify(errorDetails)}`);
    }

    return response.json();
  }

  async checkStatus(threadId, runId) {
    const url = `https://api.openai.com/v1/threads/${threadId}/runs/${runId}`;

    const response = await fetch(url, {
      method: "GET",
      headers: this.headers,
    });

    if (!response.ok) {
      const errorDetails = await response.json();
      throw new Error(
        `Failed to check status: ${JSON.stringify(errorDetails)}`
      );
    }

    return response.json();
  }

  async cancelRun(threadId, runId) {
    const url = `https://api.openai.com/v1/threads/${threadId}/runs/${runId}/cancel`;

    const response = await fetch(url, {
      method: "POST",
      headers: this.headers,
    });

    if (!response.ok) {
      const errorDetails = await response.json();
      throw new Error(
        `Failed to cancel run: ${JSON.stringify(errorDetails)}`
      );
    }

    return response.json();
  }

  async listMessages(threadId) {
    const url = `https://api.openai.com/v1/threads/${threadId}/messages`;

    const response = await fetch(url, {
      method: "GET",
      headers: this.headers,
    });

    if (!response.ok) {
      const errorDetails = await response.json();
      throw new Error(
        `Failed to list messages: ${JSON.stringify(errorDetails)}`
      );
    }

    return response.json();
  }

  async deleteThread(threadId) {
    const url = `https://api.openai.com/v1/threads/${threadId}`;

    const response = await fetch(url, {
      method: "DELETE",
      headers: this.headers,
    });

    if (!response.ok) {
      const errorDetails = await response.json();
      throw new Error(
        `Failed to delete thread: ${JSON.stringify(errorDetails)}`
      );
    }

    return response.json();
  }

  async createMessage(threadId, message) {
    const url = `https://api.openai.com/v1/threads/${threadId}/messages`;

    const body = { 
      role: "user",
      content: message
    };

    const response = await fetch(url, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorDetails = await response.json();
      throw new Error(
        `Failed to create message: ${JSON.stringify(errorDetails)}`
      );
    }

    return response.json();
  }
}

module.exports = new OpenAiService();