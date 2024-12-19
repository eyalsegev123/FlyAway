const bcrypt = require("bcrypt");
const pool = require("../config/db"); // Import the db.js file to get the pool object

// Register a new user
const registerUser = async (req, res) => {
  const { name, email, password, birthday } = req.body;

  // Validate input
  if (!name || !email || !password || !birthday) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Check if user already exists
    const existingUser = await pool.query("SELECT * FROM users WHERE mail = $1", [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: "User with this email already exists" });
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into the database
    const result = await pool.query(
      "INSERT INTO users (name, mail, password, birthday, created_at) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP) RETURNING *",
      [name, email, hashedPassword, birthday]
    );
    const newUser = result.rows[0]; // Get the inserted user data
  
    res.status(201).json({
      message: "Welcome to FlyAway " + newUser.name,
      user: { name: newUser.name, id: newUser.user_id },
    });
  } catch (error) {
    console.error("Error registering user:", error); // Log the full error
    res.status(500).json({ error: error.message || "Internal Server Error" }); // Send back the error message
  }
};

// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Validate input (optional but recommended)
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    // Fetch the user from the database by email
    const result = await pool.query("SELECT * FROM users WHERE mail = $1", [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(400).json({ error: "Invalid email" });
    }

    const user = result.rows[0];

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid password" , given: password, right: user.password});
    }

    // If authentication is successful, send a response with a token (you can use JWT)
    const token = "exampleToken123"; // Replace with actual JWT logic for production use

    res.status(200).json({
      message: "Hello " + user.name,
      user: { name: user.name, id: user.user_id },
    });
  } catch (error) {
    console.error("Error logging in user:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


// Update user details (user_id is now in req.params)
const updateUser = async (req, res) => {
  const user_id = req.params.user_id; // Get the user_id from the URL params
  const { name, email, password } = req.body;

  // Validate that at least one field (name, email, or password) is provided
  if (!user_id || (!name && !email && !password)) {
    return res.status(400).json({ error: "You must provide a user_id in the URL and at least one field to update (name, email, or password)" });
  }

  try {
    // Construct the SQL query for updating user details
    const fieldsToUpdate = [];
    const values = [];

    if (name) {
      fieldsToUpdate.push("name = $1");
      values.push(name);
    }
    if (email) {
      fieldsToUpdate.push("email = $2");
      values.push(email);
    }
    if (password) {
      fieldsToUpdate.push("password = $3");
      values.push(password);
    }

    // Make sure the correct number of parameters are passed
    const setClause = fieldsToUpdate.join(", ");
    values.push(user_id); // Add user_id at the end for WHERE clause

    // Execute the update query
    const query = `UPDATE users SET ${setClause} WHERE user_id = $${values.length} RETURNING *`;
    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const updatedUser = result.rows[0];
    res.status(200).json({
      message: "User updated successfully",
      user: { user_id: updatedUser.user_id, name: updatedUser.name, email: updatedUser.email },
    });
  } catch (error) {
    console.error("Error updating user:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  const user_id = req.params.user_id; // Get the user_id from the URL params

  if (!user_id) {
    return res.status(400).json({ error: "User ID is required to delete a user" });
  }

  try {
    // Query to delete the user by user_id
    const query = "DELETE FROM users WHERE user_id = $1 RETURNING *";
    const result = await pool.query(query, [user_id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // If deletion is successful
    res.status(200).json({
      message: "User deleted successfully",
      deletedUser: result.rows[0],
    });
  } catch (error) {
    console.error("Error deleting user:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { registerUser, loginUser, updateUser, deleteUser};
