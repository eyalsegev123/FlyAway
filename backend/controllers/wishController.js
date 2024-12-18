const pool = require("../config/db"); // Import the database connection pool

// Get all wishes of a specific user
const getWishesByUserId = async (req, res) => {
  const { user_id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM wishlist WHERE user_id = $1', [user_id]);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get a specific wish of a user by a name
const getWishByUserIdAndName = async (req, res) => {
  const { user_id, name } = req.params;

  try {
    const result = await pool.query('SELECT * FROM wishlist WHERE user_id = $1 AND name = $2', [user_id, name]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Wish not found' });
    }
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get a specific wish of a user by a destination
const getWishByUserIdAndDestination = async (req, res) => {
  const { user_id, destination } = req.params;

  try {
    const result = await pool.query('SELECT * FROM wishlist WHERE user_id = $1 AND destination = $2', [user_id, name]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Wish not found' });
    }
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Add a new wishlist
const addWishlist = async (req, res) => {
  const { name, destination, start_range, end_range, trip_genre, trip_length } = req.body;
  const {user_id} = req.params;
  try {
    const result = await pool.query(
      `INSERT INTO wishlist (user_id, name, destination, start_range, end_range, trip_genre, trip_length)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [user_id, name, destination, start_range, end_range, trip_genre, trip_length]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete a wishlist
const deleteWishlist = async (req, res) => {
  const { wish_id } = req.params;

  try {
    const result = await pool.query('DELETE FROM wishlist WHERE wish_id = $1 RETURNING *', [wish_id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Wish not found' });
    }
    res.status(200).json({ message: 'Wishlist deleted successfully', deletedWish: result.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Edit a wishlist
const editWishlist = async (req, res) => {
  const { wish_id } = req.params;
  const { name, destination, start_range, end_range, trip_genre, trip_length } = req.body;

  try {
    const result = await pool.query(
      `UPDATE wishlist
       SET name = $1, destination = $2, start_range = $3, end_range = $4, trip_genre = $5, trip_length = $6
       WHERE wish_id = $7 RETURNING *`,
      [name, destination, start_range, end_range, trip_genre, trip_length, wish_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Wish not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getWishesByUserId,
  getWishByUserIdAndName,
  getWishByUserIdAndDestination,
  addWishlist,
  deleteWishlist,
  editWishlist,
};
