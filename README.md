# FlyAway - AI-Powered Holiday Planning Platform

## Overview

FlyAway is an intelligent holiday planning platform that leverages Artificial Intelligence to create personalized travel recommendations. Designed to make trip planning effortless, the application helps users discover vacation destinations tailored to their preferences and provides smart, accurated travel plans.

The platform uses advanced natural language processing through OpenAI's technology to understand user preferences and generate personalized travel suggestions. By analyzing factors such as budget constraints, preferred activities, climate preferences, and travel duration, FlyAway creates tailored itineraries that match each user's unique requirements.

Additionally, FlyAway leverages user-generated travel reviews from our database to provide more authentic and experience-based recommendations. These real traveler insights are incorporated into the AI recommendation process, ensuring suggestions reflect genuine experiences rather than purely algorithmic selections.

Our recommendation engine considers various factors including:

- Seasonal appropriateness of destinations
- Budget optimization strategies
- Activity matching based on user interests
- Accommodation suggestions that align with preferences
- User reviews and ratings from past travelers
- Detailed daily scheduling for the first week of travel

The application follows a user-centered design approach, providing an intuitive interface that guides travelers through the planning process from inspiration to finalized itinerary.
The design allows the end-user to improve the AI recommendation according to his notes from time to time, ensuring satisfaction.

## Purpose

The main purpose of FlyAway is to simplify holiday planning through AI technology while providing personalized travel recommendations based on user preferences. By offering an intuitive platform that supplies information from multiple sources, FlyAway aims to save travelers time and effort while ensuring they discover destinations that truly match their interests.

## Features

- AI-powered travel recommendations based on user preferences
- Personalized trip planning with customizable itineraries
- Detailed day-by-day schedule planning for the first week to jumpstart trip organization
- User wishlist management for future travel ideas, including the AI recommendation
- Past trips management for memories, includind photos and reviews
- Budget estimation recommendations
- Incorporation of real user reviews in recommendation process

## Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: Postgres - SQL (via connection pool)
- **Authentication**: Custom auth system with bcrypt password hashing and localStorage persistence
- **Styling**: Styled Components
- **Routing**: React Router
- **AI Integration**: OpenAI Assistant API
- **State Management**: React Context API
- **HTTP Client**: Axios

## Project Components

### Frontend

- **Pages**:

  - **Home**: Landing page featuring an introduction to the platform's capabilities and quick-start options for new visitors. 

  - **AboutUs**: Highlights the development team and project philosophy. Features team member cards, a mission statement, and terms of usage.

  - **PlanTrip**: Interactive interface for creating new travel plans with a multi-step form that collects user preferences including budget, duration, activities, climate preferences, and travel style. Implements a conversational flow to make preference collection engaging. Submition of the form nevigates the user to 'Reccomendation' page.

  - **Recommendation**: Displays AI-generated travel suggestions with detailed information about destinations including cost breakdowns, activity suggestions, and accommodation options. Features a step-by-step presentation of recommendations with the ability to refine results. Includes a comprehensive day-by-day schedule for the first week of travel to provide immediate planning guidance. Recommendations incorporate insights from user reviews to provide authentic travel suggestions.

  - **MyTrips**: User's personal dashboard for passed trips with the ability to view, edit, and delete trips. Includes photo galleries for each trip, review capabilities, and filtering options. Implements a responsive grid layout.

  - **MyWishlist**: A collection of destinations and trip ideas saved by the user for future reference. Allows users to revisit and review the recommendations provided during their planning process.

  - **Profile**: User profile management interface allowing personal information updates.

- **Main Components**:

  - **Header**: Navigation component with responsive design, user authentication status display, and dynamic menu options based on login state. Includes welcome message animation for logged-in users. Enables Login/Logout and Register functions.

  - **LoginForm** and **RegisterForm** manage user authentication with input validation, password confirmation, and real-time error feedback for invalid inputs.

  - **CategoryCard**: Reusable card component for displaying categorized information with consistent styling in the Recommendation.

  - **AddTripForm**: Feature-rich form component for adding new trips to a user's collection, with support for trip details, date validation, photo uploads, star ratings, and written reviews. Includes real-time validation and styled feedback for user inputs.

  - **LoadingTripGlobe**: Animated loading indicator designed as a spinning globe for use during API calls and data processing operations.

  - **SearchBox**: Reusable search component with filter options for use across the application.

  - **TripCardButton**: An interactive card component designed for displaying trip details. It includes expandable sections and action buttons, such as edit, delete, and view album, to enhance user interaction.

  - **PhotoCarousel**: Interactive carousel component that showcases destination imagery and provides instant AI recommendations directly from the home page, enhancing user experience by offering immediate inspiration without requiring navigation to the dedicated planning section. 

### Backend

- **API Routes**:

  - **/api/usersRoutes**:

    - User creation, authentication, and profile management endpoints
    - Password reset and email verification functionality

  - **/api/tripsRoutes**:

    - Trip creation with multiple destination support
    - Trip retrieval, updating, and deletion operations
    - Trip photo storage and management
    - Trip categorization and tagging system

  - **/api/wishesRoutes**:

    - Wishlist item creation and management
    - Wishlist retrieval with filtering options

  - **/api/openAiRoutes**:
    - AI interaction for generating personalized travel recommendations
    - Prompt engineering and response parsing
    - Context management for multi-turn conversations
    - Recommendation refinement based on user feedback

- **Configuration**:
  - Database connection pooling for efficient resource management
  - Environment variable management for secure configuration
  - Error handling middleware for consistent API responses
  - Request validation using schema validation

### Database Structure

FlyAway uses a relational database to manage data efficiently across three primary tables: Users, Trips, and Wishlist. Below are the details for each table:

**Users Table**:
  - user_id (PK): A unique identifier for each user.
  - name: The name of the user.
  - mail: The email address of the user.
  - password: Hashed password for user authentication.
  - birthday: User's date of birth.
  - created_at: Timestamp of when the user account was created.

**Trips Table**:
  - trip_id (PK): Unique identifier for each trip.
  - user_id (FK): References user_id from the Users table.
  - review: Textual review of the trip by the user.
  - stars: Rating given to the trip.
  - destination: Main destination of the trip.
  - trip_name: Name of the trip.
  - start_date: Start date of the trip.
  - end_date: End date of the trip.
  - album_s3location: URL or location of the trip's photo album on S3.

**Wishlist Table**:
  - wish_id (PK): Unique identifier for each wishlist entry.
  - user_id (FK): References user_id from the Users table.
  - destination: Destination the user wishes to visit.
  - trip_length: Planned length of the trip in days.
  - budget: Estimated budget for the trip.
  - wish_name: Name of the wishlist item.
  - notes: Additional notes about the wish.
  - trip_genres: Genres or themes of the trip (e.g., adventure, relaxation).
  - start_date: Intended start date of the trip.
  - end_date: Intended end date of the trip.
  - recommendation: AI-generated recommendation details.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- SQL Database (MySQL/PostgreSQL)
- OpenAI Assistant API key

### Installation

1. Setting Up the Database

    Open your PostgreSQL command line client (e.g., psql).
    Create the FlyAway database:
    
    ```bash
      CREATE DATABASE flyaway;
    ```
  
    Execute the following commands to create the necessary tables:

    ```bash
    CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name character varying(255),
    mail character varying(255) UNIQUE,
    password character varying(255),
    birthday DATE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    ```

    ```bash
    CREATE TABLE trips (
    trip_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    review TEXT,
    stars INTEGER,
    destination character varying(255),
    trip_name character varying(255),
    start_date DATE,
    end_date DATE,
    album_s3location TEXT
    );
    ```

    ```bash
    CREATE TABLE wishlist (
    wish_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    destination character varying(255),
    trip_length INTEGER,
    budget DECIMAL,
    wish_name character varying(255),
    notes TEXT,
    trip_genres character varying(255),
    start_date DATE,
    end_date DATE,
    recommendation JSON
    );
    ```

    Finalizing Setup
      Ensure your backend .env file includes the correct database connection settings as mentioned beneath.
      Consider pre-populating your database with sample data for development and testing purposes.


2. Setting Up and train the AI assistant through openAI assitant API.
   Documentation: https://platform.openai.com/docs/assistants/overview


3. Clone the repository

   ```bash
   git clone https://github.com/yourusername/flyaway.git
   cd flyaway
   ```


4. Install dependencies for backend

   ```bash
   cd backend
   npm install
   ```


5. Install dependencies for frontend

   ```bash
   cd frontend
   npm install
   ```


6. Create a `.env` file in the FlyAway directory in 'backend' folder with the following variables:
   ```bash
    #BACKEND PORT
    BACK_PORT= your backend port

    #POSTGRES - DB
    PGUSER= your postgres user
    PGHOST=localhost
    PGDATABASE= FlyAway or any name you want for your db
    PGPASSWORD= your password for postgress
    PGPORT= your db port

    #OPEN-AI
    OPEN_AI_KEY= API key for your subscription in open AI.
    OPEN_AI_ASSISTANT_ID= The id of the specified assistant trained to this project.

    #AWS CONFIGURATION
    AWS_ACCESS_KEY_ID= XXX
    AWS_SECRET_ACCESS_KEY= XXX
    AWS_SESSION_TOKEN= XXX
    AWS_REGION=us-east-1 or any other
    S3_BUCKET_NAME= you bucket name
   ```


7. Create a `.env` file in the FlyAway directory in 'frontend' folder with the following variables:
  ```bash
    #FRONTEND PORT
    REACT_APP_BACK_PORT= local host or any other deployed port

    REACT_APP_API_URL= your local host or any other deployed port 
  ```


### Running the Application

1. Start the backend server

   ```bash
   cd backend
   node index.js
   ```

2. Start the frontend development server

   ```bash
   cd frontend
   npm start
   ```

3. Open the browser and navigate to [http://localhost:3000](http://localhost:3000) or the deployed url if you have one.

4. Enjoy FlyAway.

