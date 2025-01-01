import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
//import Header from "../components/Header";


const MyWishList = () => {
  const [wishlist, setWishlist] = useState([]); // State to store wishlist trips
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { user } = useAuth();

  // Fetch wishlist when the component mounts
  useEffect(() => {
    const fetchWishlist = async () => {
      setLoading(true);
      try {
        const user_id = user.id;

        if (!user_id) {
          setErrorMessage("User not logged in.");
          return;
        }

        // Fetch wishlist items for the user
        const response = await axios.get(
          `http://localhost:5001/api/wishesRoutes/getUserWishes/${user_id}`
        );

        if (response.status === 200) {
          setWishlist(response.data); // Set the wishlist state
        }
      } catch (err) {
        setErrorMessage("An error occurred while fetching the wishlist.");
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [user.id]);

  return (
    <div className="wishlist-list">
      {loading ? (
        <p>Loading wishlist...</p>
      ) : errorMessage ? (
        <div className="error-message-wishlist">{errorMessage}</div>
      ) : wishlist.length > 0 ? (
        wishlist.map((trip) => (
          <div key={trip.wish_id} className="wishlist-card">
            <h3>{trip.wish_name}</h3>
            <p><strong>Destination:</strong> {trip.destination}</p>
            <p><strong>Travel Dates:</strong> {trip.start_range} - {trip.end_range}</p>
            <p><strong>Genre:</strong> {trip.trip_genre}</p>
            <p><strong>Budget:</strong> ${trip.budget}</p>
            <p><strong>Recommendation:</strong> {trip.content}</p>
            <p><strong>Travelers:</strong> {trip.travellers}</p>
            <p><strong>Notes:</strong> {trip.notes}</p>
          </div>
        ))
      ) : (
        <p>Your wishlist is empty.</p>
      )}
    </div>
  );
};

export default MyWishList;
