const pool = require("../config/db"); // Import the database connection pool

// Get all wishes of a specific user
const getWishesByUserId = async (req, res) => {
  const { user_id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM wishlist WHERE user_id = $1', [user_id]);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal server error: Error getting wishes' });
  }
};


// Add a new wishlist
const addToWishlist = async (req, res) => {
  console.log(req.body);

  const {
    user_id,
    destination,
    startDate,
    endDate,
    tripGenres,
    tripLength,
    budget,
    wishName,
    notes,
    tripRecommendation
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO wishlist (user_id, destination, start_date, end_date, trip_genres, trip_length, budget, wish_name, notes, recommendation)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [user_id, destination, startDate, endDate, tripGenres, tripLength, budget, wishName, notes, tripRecommendation]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal server error: Error adding wish' });
  }
};


// Delete a wishlist
const deleteFromWishlist = async (req, res) => {
  const { wish_id } = req.params;
  try {
    const result = await pool.query('DELETE FROM wishlist WHERE wish_id = $1 RETURNING *', [wish_id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Wish not found' });
    }
    res.status(200).json({ message: 'Wishlist deleted successfully', deletedWish: result.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal server error : Error deleting wish' });
  }
};

const editWish = async (req, res) => {
  const {wish_id} = req.params;
  const {wish_name, wish_notes} = req.body;
  try{
    const result = await pool.query('UPDATE wishlist SET wish_name = $1, notes = $2 WHERE wish_id = $3 RETURNING *',
       [wish_name, wish_notes, wish_id]);
    if(result.rows.length === 0){
      return res.status(404).json({error: 'Wish not found'});
    }
    res.status(200).json({message: 'Wish updated successfully', updatedWish: result.rows[0]});
  }
  catch(err){
    console.error(err.message);
    res.status(500).json({error: 'Internal server error : Error updating wish'});
  }
};

module.exports = {
  getWishesByUserId,
  addToWishlist,
  deleteFromWishlist,
  editWish,
};
