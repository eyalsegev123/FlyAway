# FlyAway - AI-Powered Holiday Planning Platform

## Overview
FlyAway is an intelligent holiday planning platform that leverages artificial intelligence to create personalized travel recommendations. Designed to make trip planning effortless, the application helps users discover vacation destinations tailored to their preferences and provides smart, curated travel plans.

The platform uses advanced natural language processing through OpenAI's technology to understand user preferences and generate personalized travel suggestions. By analyzing factors such as budget constraints, preferred activities, climate preferences, and travel duration, FlyAway creates tailored itineraries that match each user's unique requirements.

Our recommendation engine considers various factors including:
- Seasonal appropriateness of destinations
- Budget optimization strategies
- Activity matching based on user interests
- Accommodation suggestions that align with preferences
- Local attractions and hidden gems not typically found in standard travel guides

The application follows a user-centered design approach, providing an intuitive interface that guides travelers through the planning process from inspiration to finalized itinerary.

## Purpose
The main purpose of FlyAway is to:
- **Simplify the holiday planning process** using AI technology to reduce the overwhelming number of choices travelers face
- **Provide personalized travel recommendations** based on user preferences, ensuring travelers discover destinations that truly match their interests
- **Offer an intuitive platform** for discovering and organizing trip ideas with minimal friction in the user experience
- **Save users time and effort** in researching vacation destinations by consolidating information from multiple sources
- **Democratize travel planning expertise** by making intelligent recommendations available to everyone regardless of their travel experience
- **Reduce decision fatigue** by presenting curated options rather than overwhelming users with endless possibilities
- **Enhance travel experiences** by suggesting destinations that align with personal preferences but might not be on a traveler's radar
- **Support spontaneous travel** by enabling quick planning with minimal input
- **Facilitate budget-conscious travel** through smart recommendations that optimize for cost-effectiveness

## Tech Stack
- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: SQL (via connection pool)
- **Authentication**: Custom auth system
- **Styling**: Styled Components
- **Routing**: React Router
- **AI Integration**: OpenAI API
- **State Management**: React Context API
- **HTTP Client**: Axios

## Project Components

### Frontend
- **Pages**:
  - **Home**: Landing page featuring an introduction to the platform's capabilities, testimonials, and quick-start options for new visitors. Includes animated elements showcasing the recommendation process.
  
  - **AboutUs**: Information about the development team and project philosophy. Contains cards with information about the team members, mission statement, and terms of usage. Includes an interactive modal that showcases the developers with additional details.
  
  - **PlanTrip**: Interactive interface for creating new travel plans with a multi-step form that collects user preferences including budget, duration, activities, climate preferences, and travel style. Implements a conversational flow to make preference collection engaging.
  
  - **Recommendation**: Displays AI-generated travel suggestions with detailed information about destinations, including photos, cost breakdowns, activity suggestions, and accommodation options. Features a step-by-step presentation of recommendations with the ability to refine results.
  
  - **MyTrips**: User's personal dashboard for saved trip plans with ability to view, edit, and delete trips. Includes photo galleries for each trip, review capabilities, and sorting/filtering options. Implements a responsive grid layout for various screen sizes.
  
  - **MyWishlist**: Collection of destinations and trip ideas saved by the user for future reference. Features categorization options, priority settings, and integration with the recommendation engine for similar destination suggestions.
  
  - **Profile**: User profile management interface allowing personal information updates, preference settings, and account security options. Includes travel style questionnaire that informs the recommendation engine.
  
  - **Login**: Authentication interface with secure login and registration capabilities. Features password recovery, remember me functionality, and social login options.

- **Components**:
  - **Header**: Navigation component with responsive design, user authentication status display, and dynamic menu options based on login state. Includes welcome message animation for newly logged-in users.
  
  - **LoginForm**: User authentication form with validation, error handling, and secure credential processing. Implements Remember Me functionality and integration with the authentication context.
  
  - **AboutUsCard**: Information cards for the About page with styled presentation of team information and platform details. Includes interactive elements for additional information display.
  
  - **PhotoAboutUsModal**: Modal component displaying team information with photos, roles, and background information about each developer. Features animation effects for a polished user experience.
  
  - **WishlistButton**: Interactive component for adding/removing destinations from the user's wishlist with optimistic UI updates and visual feedback.
  
  - **CategoryCard**: Reusable card component for displaying categorized information with consistent styling across the application.
  
  - **MessageBox**: Feedback component for displaying system messages, alerts, and notifications to users with appropriate styling based on message type.
  
  - **LoadingTripGlobe**: Animated loading indicator designed as a spinning globe for use during API calls and data processing operations.
  
  - **SearchBox**: Reusable search component with filters and sorting options for use across the application.
  
  - **TripCardButton**: Interactive card component for trip display with expandable details and action buttons.
  
  - **PhotoCarousel**: Image display component for showcasing destination and trip photos with navigation controls.
  
  - **ConfirmationDialog**: Reusable dialog component for confirming user actions before proceeding.
  
  - **WelcomeMessage**: Animated greeting component displayed after successful login.
  
  - **HeaderButton**: Consistent styled button component for the application header.

### Backend
- **API Routes**:
  - **/api/usersRoutes**: 
    - User creation, authentication, and profile management endpoints
    - Password reset and email verification functionality
    - User preference storage and retrieval
    - Session management and token validation
  
  - **/api/tripsRoutes**: 
    - Trip creation with multiple destination support
    - Trip retrieval, updating, and deletion operations
    - Trip photo storage and management
    - Trip sharing capabilities between users
    - Trip categorization and tagging system
  
  - **/api/wishesRoutes**: 
    - Wishlist item creation and management
    - Priority and category assignment for wishlist items
    - Wishlist retrieval with filtering and sorting options
    - Automated suggestions based on existing wishlist items
  
  - **/api/openAiRoutes**: 
    - AI interaction for generating personalized travel recommendations
    - Prompt engineering and response parsing
    - Context management for multi-turn conversations
    - Recommendation refinement based on user feedback
    - Caching system for similar queries to optimize API usage

- **Configuration**:
  - Database connection pooling for efficient resource management
  - Environment variable management for secure configuration
  - Error handling middleware for consistent API responses
  - Authentication middleware with JWT validation
  - CORS policy implementation for security
  - Rate limiting to prevent abuse
  - Request validation using schema validation
  - Logging system for monitoring and debugging

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

4. Create a `.env` file in the backend directory with the following variables:
   ```
   DB_HOST=your_database_host
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   DB_NAME=flyaway_db
   PORT=5000
   OPENAI_API_KEY=your_openai_api_key
   JWT_SECRET=your_jwt_secret
   ```

### Running the Application

1. Start the backend server
   ```bash
   cd backend
   npm start
   ```

2. Start the frontend development server
   ```bash
   cd frontend
   npm start
   ```

3. Open your browser and navigate to [http://localhost:3000](http://localhost:3000)

## Features
- AI-powered travel recommendations based on user preferences
- Personalized trip planning with customizable itineraries
- User wishlist management for future travel ideas
- Secure authentication system with JWT implementation
- Responsive design for optimal experience on all devices
- Photo management for trip memories
- Interactive maps for destination exploration
- Budget estimation and management tools
- Travel tips and local insights for destinations
- Social sharing capabilities

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements
- OpenAI for powering our recommendation engine
- The React team for the frontend framework
- All contributors who have helped shape this project