# FlyAway - AI-Powered Holiday Planning Platform

## Overview

FlyAway is an intelligent holiday planning platform that leverages Artificial Intelligence to create personalized travel recommendations. Designed to make trip planning effortless, the application helps users discover vacation destinations tailored to their preferences and provides smart, curated travel plans.

The platform uses advanced natural language processing through OpenAI's technology to understand user preferences and generate personalized travel suggestions. By analyzing factors such as budget constraints, preferred activities, climate preferences, and travel duration, FlyAway creates tailored itineraries that match each user's unique requirements.

Additionally, FlyAway leverages user-generated travel reviews from our database to provide more authentic and experience-based recommendations. These real traveler insights are incorporated into the AI recommendation process, ensuring suggestions reflect genuine experiences rather than purely algorithmic selections.

Our recommendation engine considers various factors including:

- Seasonal appropriateness of destinations
- Budget optimization strategies
- Activity matching based on user interests
- Accommodation suggestions that align with preferences
- Local attractions and hidden gems not typically found in standard travel guides
- User reviews and ratings from past travelers
- Detailed daily scheduling for the first week of travel

The application follows a user-centered design approach, providing an intuitive interface that guides travelers through the planning process from inspiration to finalized itinerary.

## Purpose

The main purpose of FlyAway is to simplify holiday planning through AI technology while providing personalized travel recommendations based on user preferences. By offering an intuitive platform that consolidates information from multiple sources, FlyAway aims to save travelers time and effort while ensuring they discover destinations that truly match their interests.

Additional goals include:

- **Democratize travel planning expertise** by making intelligent recommendations available to everyone regardless of their travel experience
- **Reduce decision fatigue** by presenting curated options rather than overwhelming users with endless possibilities
- **Enhance travel experiences** by suggesting destinations that align with personal preferences but might not be on a traveler's radar
- **Support spontaneous travel** by enabling quick planning with minimal input
- **Facilitate budget-conscious travel** through smart recommendations that optimize for cost-effectiveness

## Features

- AI-powered travel recommendations based on user preferences
- Personalized trip planning with customizable itineraries
- Detailed day-by-day schedule planning for the first week to jumpstart trip organization
- User wishlist management for future travel ideas
- Photo management for trip memories
- Budget estimation recommendations
- Travel tips and local insights for destinations
- Incorporation of real user reviews in recommendation process

## Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: Postgres - SQL (via connection pool)
- **Authentication**: Custom auth system with bcrypt password hashing and localStorage persistence
- **Styling**: Styled Components
- **Routing**: React Router
- **AI Integration**: OpenAI API
- **State Management**: React Context API
- **HTTP Client**: Axios

## Project Components

### Frontend

- **Pages**:

  - **Home**: Landing page featuring an introduction to the platform's capabilities, testimonials, and quick-start options for new visitors. 

  - **AboutUs**: Highlights the development team and project philosophy. Features team member cards, a mission statement, and terms of usage.

  - **PlanTrip**: Interactive interface for creating new travel plans with a multi-step form that collects user preferences including budget, duration, activities, climate preferences, and travel style. Implements a conversational flow to make preference collection engaging.

  - **Recommendation**: Displays AI-generated travel suggestions with detailed information about destinations including cost breakdowns, activity suggestions, and accommodation options. Features a step-by-step presentation of recommendations with the ability to refine results. Includes a comprehensive day-by-day schedule for the first week of travel to provide immediate planning guidance. Recommendations incorporate insights from user reviews to provide authentic travel suggestions.

  - **MyTrips**: User's personal dashboard for saved trip plans with ability to view, edit, and delete trips. Includes photo galleries for each trip, review capabilities, and filtering options. Implements a responsive grid layout.

  - **MyWishlist**: A collection of destinations and trip ideas saved by the user for future reference. Allows users to revisit and review the recommendations provided during their planning process.

  - **Profile**: User profile management interface allowing personal information updates.

- **Main Components**:

  - **Header**: Navigation component with responsive design, user authentication status display, and dynamic menu options based on login state. Includes welcome message animation for newly logged-in users. Enables Login/Logout and Register functions.

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

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- SQL Database (MySQL/PostgreSQL)
- OpenAI API key

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/yourusername/flyaway.git
   cd flyaway
   ```

2. Install dependencies for backend

   ```bash
   cd backend
   npm install
   ```

3. Install dependencies for frontend

   ```bash
   cd frontend
   npm install
   ```

4. Create a `.env` file in the FlyAway directory with the following variables:
   ```
    FRONT_PORT=3000 //Optional change as you wish
    BACK_PORT=5001 //Optional change as you wish
    REACT_APP_BACK_PORT= 5001

    PGUSER= <Enter your PG User>
    PGHOST= <Enter your PG Host>
    PGDATABASE= <Enter your PG Database>
    PGPASSWORD= <Enter your PG Password>
    PGPORT= <Enter your PG Port>

    OPEN_AI_KEY= <Your OpenAI API key>
    OPEN_AI_ASSISTANT_ID= <Assistant ID from OpenAI playground>

    AWS_ACCESS_KEY_ID= <Enter your Access Key Id>
    AWS_SECRET_ACCESS_KEY= <Enter your Secret Access Key>
    AWS_SESSION_TOKEN= <Enter your AWS Session Token>
    AWS_REGION= <Enter your AWS Region>
    S3_BUCKET_NAME = <Your S3 Bucket Name>
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

3. Open your browser and navigate to [http://localhost:3000](http://localhost:3000)

