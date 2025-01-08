import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import { Delete } from "@mui/icons-material";

const WishCard = ({ trip, onDelete }) => {
  return (
    <Card variant="outlined" sx={{ height: "100%" }}>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" gutterBottom>
            {trip.wish_name}
          </Typography>
          <IconButton
            onClick={() => onDelete(trip.wish_id)}
            aria-label="Delete"
          >
            <Delete color="error" />
          </IconButton>
        </Box>
        <Typography variant="body2" color="text.secondary">
          <strong>Destination:</strong> {trip.destination}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Travel Dates:</strong> {trip.start_range} - {trip.end_range}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Genre:</strong> {trip.trip_genre}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Budget:</strong> ${trip.budget}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Recommendation:</strong> {trip.content}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Travelers:</strong> {trip.travellers}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Notes:</strong> {trip.notes}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default WishCard;
