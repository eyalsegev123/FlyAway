// Mock database for now
let trips = [
    { id: 1, destination: "Paris", startDate: "2024-12-15", endDate: "2024-12-20" },
    { id: 2, destination: "New York", startDate: "2025-01-10", endDate: "2025-01-15" }
];

// Controller: Get all trips
exports.getAllTrips = (req, res) => {
    res.json(trips); // Send the list of trips as JSON
};

// Controller: Create a new trip
exports.createTrip = (req, res) => {
    const { destination, startDate, endDate } = req.body;

    if (!destination || !startDate || !endDate) {
        return res.status(400).json({ error: "All fields are required: destination, startDate, endDate" });
    }

    const newTrip = {
        id: trips.length + 1, // Auto-generate an ID
        destination,
        startDate,
        endDate
    };

    trips.push(newTrip); // Add to the mock database
    res.status(201).json(newTrip); // Send the created trip
};

// Controller: Get a specific trip by ID
exports.getTripById = (req, res) => {
    const { id } = req.params;
    const trip = trips.find(t => t.id === parseInt(id));

    if (!trip) {
        return res.status(404).json({ error: "Trip not found" });
    }

    res.json(trip);
};

// Controller: Update a trip by ID
exports.updateTrip = (req, res) => {
    const { id } = req.params;
    const { destination, startDate, endDate } = req.body;

    const trip = trips.find(t => t.id === parseInt(id));

    if (!trip) {
        return res.status(404).json({ error: "Trip not found" });
    }

    // Update trip details
    trip.destination = destination || trip.destination;
    trip.startDate = startDate || trip.startDate;
    trip.endDate = endDate || trip.endDate;

    res.json(trip);
};

// Controller: Delete a trip by ID
exports.deleteTrip = (req, res) => {
    const { id } = req.params;

    const tripIndex = trips.findIndex(t => t.id === parseInt(id));
    if (tripIndex === -1) {
        return res.status(404).json({ error: "Trip not found" });
    }

    trips.splice(tripIndex, 1); // Remove the trip from the mock database
    res.status(204).send(); // Send no content
};
