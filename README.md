✨ Features
🔐 Authentication System
User Registration - New user signup
User Login - JWT-based authentication
Protected Routes - Secure access to management features

⚡ Charging Station Management

Add New Station - Create charging stations with complete details
View All Stations - List all registered charging stations
Update Station Info - Edit existing station details
Delete Stations - Remove stations from the system

📊 Station Information Tracking

Station Name - Unique identifier for each location
Geographic Location - Latitude and longitude coordinates
Operational Status - Active/Inactive status tracking
Power Specifications - Power output in kW
Connector Types - Different charging connector standards

🔍 Advanced Filtering & Search

Status Filter - Show only active or inactive stations
Power Output Filter - Filter by charging capacity (kW)
Connector Type Filter - Filter by specific connector standards
Multi-criteria Filtering - Combine multiple filters

🗺️ Interactive Map Features

Geographic Visualization - All stations plotted on interactive map
Clickable Markers - Tap/click markers for station details
Real-time Location Display - Current station positions
Station Details Popup - Quick info view on map interaction

🌐 Web Interface

Responsive Dashboard - Modern Vue.js interface
Login Screen - Clean authentication interface
Management Panel - Comprehensive admin controls
Map Integration - Google Maps or OpenStreetMap support

🔗 API Integration

RESTful APIs - Standard HTTP methods for all operations
Real-time Data - Live synchronization between frontend and backend
Cross-platform Access - APIs accessible for future mobile apps

☁️ Cloud Deployment

Live Application - Deployed and accessible online
Public API Endpoints - Available for testing and integration
Scalable Infrastructure - Cloud-based hosting

🚀 Quick Start
Prerequisites

Node.js 18.0 or higher
npm 8.0 or higher
MongoDB 5.0 or higher
Installation

Clone the repository
git clone https://github.com/Adarshtiwarikrai/Evoltsoft.git
cd Evoltsoft

# Install frontend dependencies
cd vue_project
npm install

cd ..
# Install backend dependencies
cd backend
npm install


Environment setup
I have provided all the Environment variable for clean setup use them  

Start the application
bash# Development mode (runs both backend and frontend)
npm run dev

# Or start them separately
node server.js   # Backend only
npm run dev    # Frontend only

Open your browser
Navigate to http://localhost:5174

📖 Usage
Getting Started with Your EV Charging Network

1) Sign up for a new account or login with the demo credentials:

Email: demo@evcharger.com
Password: demo123

2) Add your first charging station:

Click "Add Charger" on the dashboard
Fill in the station details:

Name: Downtown Mall Charger
Location: Use the map picker or enter coordinates
Status: Active
Power Output: 50 kW
Connector Type: CCS Type 2

3) View all charging network:

you will see all the chargers that are avaiable in list view
Use filters to find specific stations by status, power, or connector type
Edit station details using the edit icon
Delete stations that are no longer in service

Switch to "Map View" to see geographic distribution
when you click on the stations marker the popup will appear that show stations details 
in popup their are two button find directions and show route when click on find directions it show the directions from 
your location to that stations in google map and when you click show route it show direction in the current map

4) Find closest station
Click the Find Near me button on dashboard it will show the nearest station to current user location
it will show the nearest station to user location and in map view when we click on the station marker in map it will show tow button
find direction to find direction from the user location to station in google map and their is another button show route it will show the route
in current map 
<pre lang="markdown"> ```text 🏗️ Project Structure Evoltsoft/ ├── vue_project/ │ ├── public/ │ │ └── index.html │ ├── src/ │ │ ├── assets/ # Static assets like images, global CSS │ │ │ └── logo.png │ │ ├── components/ # Reusable UI components │ │ │ ├── Navbar.vue │ │ │ ├── ChargerForm.vue │ │ │ └── ChargerMap.vue │ │ ├── router/ # Vue Router configuration │ │ │ └── index.js │ │ ├── services/ # API interaction logic │ │ │ ├── apiClient.js │ │ │ └── stationService.js │ │ ├── store/ # Vuex state management │ │ │ ├── index.js │ │ │ └── modules/ │ │ │ ├── auth.js │ │ │ └── stations.js │ │ ├── views/ # Page-level components │ │ │ ├── LoginView.vue │ │ │ ├── RegisterView.vue │ │ │ ├── DashboardView.vue │ │ │ └── NotFoundView.vue │ │ ├── App.vue # Root Vue component │ │ └── main.js # Main entry point │ ├── .env # For local environment variables │ ├── babel.config.js │ ├── package.json │ └── vue.config.js # Optional Vue config ├── backend/ # Node.js backend │ ├── controllers/ # Route handlers │ ├── models/ # Database models │ ├── middleware/ # Express middleware │ ├── routes/ # API routes │ ├── utils/ # Helper functions │ └── config/ # Configuration files ├── .env # Environment variables template └── package.json # Root package.json ``` </pre>
