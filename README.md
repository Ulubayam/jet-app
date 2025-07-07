# 🚀 Jet App - Restaurant Discovery Platform

[![CI/CD](https://github.com/ulubayam/jet-app/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/ulubayam/jet-app/actions/workflows/ci-cd.yml)
[![Coverage](https://img.shields.io/badge/coverage-70%25-brightgreen)](https://github.com/ulubayam/jet-app/actions/workflows/ci-cd.yml)

A modern web application for discovering and exploring restaurants, built with React, TypeScript, and Firebase. This project showcases clean architecture, modern React patterns, and comprehensive testing.

## ✨ Features

- 🔍 Search and filter restaurants
- 📍 Interactive Google Maps integration
- 🔒 User authentication with Firebase
- ❤️ Save favorite restaurants
- 📱 Responsive design for all devices
- 🧪 Comprehensive test coverage
- 🚀 CI/CD pipeline with GitHub Actions

## 🛠 Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **State Management**: Redux Toolkit, Redux-Saga
- **Styling**: CSS Modules
- **Maps**: Google Maps JavaScript API
- **Authentication**: Firebase Authentication
- **Testing**: Jest, React Testing Library, Playwright
- **Linting/Formatting**: ESLint, Prettier
- **CI/CD**: GitHub Actions

## 🚀 Getting Started

### Prerequisites

#### For Local Development:

- Node.js 18+
- npm or yarn
- Firebase account
- Google Cloud Platform account with Maps JavaScript API enabled

#### For Docker Deployment:

- Docker 20.10+
- Docker Compose 1.29+

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/ulubayam/jet-app.git
   cd jet-app
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

## 🐳 Docker Deployment

### Prerequisites

- Docker and Docker Compose installed on your system
- A `.env` file with all required environment variables (copy from `.env.example`)

### Quick Start with Docker Compose

1. Copy the example environment file:

   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file with your Firebase and Google Maps API credentials:

   ```bash
   nano .env  # or use your preferred text editor
   ```

3. Build and start the containers:

   ```bash
   docker-compose up --build
   ```

4. The application will be available at: http://localhost:8080

### Docker Commands

- Start the application:

  ```bash
  docker-compose up -d
  ```

- View logs:

  ```bash
  docker-compose logs -f
  ```

- Stop the application:

  ```bash
  docker-compose down
  ```

- Rebuild containers (after making changes to Dockerfile or dependencies):
  ```bash
  docker-compose up --build
  ```

### Running with Docker Directly

If you prefer not to use Docker Compose:

1. Build the Docker image:

   ```bash
   docker build -t jet-app .
   ```

2. Run the container:
   ```bash
   docker run -d -p 8080:8080 --name jet-app-container --env-file .env jet-app
   ```

## 🏗 Development with Docker

For development with hot-reloading:

1. Install dependencies locally:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. The development server will be available at: http://localhost:5173

## 🙏 Acknowledgments

- [Vite](https://vitejs.dev/)
- [React](https://reactjs.org/)
- [Firebase](https://firebase.google.com/)
- [Google Maps Platform](https://developers.google.com/maps)
- [Redux Toolkit](https://redux-toolkit.js.org/)

3. Set up environment variables:

   - Copy the example environment file:
     ```bash
     cp .env.example .env
     ```
   - Or create a new `.env` file in the root directory and add the following variables:

     ```env
     # Firebase Configuration
     VITE_FIREBASE_API_KEY=your_firebase_api_key
     VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
     VITE_FIREBASE_PROJECT_ID=your_project_id
     VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
     VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
     VITE_FIREBASE_APP_ID=your_firebase_app_id

     # Google Maps API Key
     VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
     ```

### 🔑 Getting API Keys

#### Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Go to Project Settings (⚙️ > Project settings)
4. Under "Your apps" section, add a new web app
5. Copy the configuration object and use the values in your `.env` file

#### Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Places API
4. Go to Credentials > Create Credentials > API Key
5. Restrict the API key to only the necessary APIs for security
6. Copy the API key to your `.env` file

### 🔄 Environment Files Explained

- `.env`: Main environment file (not committed to Git)
- `.env.example`: Template showing required variables (committed to Git)
- `.env.local`: Local overrides (not committed to Git, optional)

For production, set these environment variables in your hosting provider's settings.

4. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

   The application will be available at `http://localhost:5173`

## 🔧 Project Scripts

- `dev` - Start development server
- `build` - Build for production
- `preview` - Preview production build locally
- `test` - Run unit tests
- `test:coverage` - Run tests with coverage report
- `test:e2e` - Run end-to-end tests
- `lint` - Run ESLint

## 🧪 Testing

### Unit Tests

Run unit tests with coverage:

```bash
npm test -- --coverage
```

### End-to-End Tests

Run Playwright tests:

```bash
npm run test:e2e
```

## 📊 Test Coverage

We maintain a minimum of 70% test coverage. The coverage report is generated when running tests with the `--coverage` flag and is enforced in our CI/CD pipeline.

## 🛠 CI/CD Pipeline

The project uses GitHub Actions for CI/CD. The pipeline includes:

1. Linting with ESLint
2. Running unit tests with Jest
3. Running end-to-end tests with Playwright
4. Enforcing 70%+ test coverage
5. Building the application

## 📁 Project Structure

```
src/
├── components/    # Reusable UI components
├── pages/         # Page components
├── redux/         # Redux store, actions, reducers, sagas
├── services/      # API and third-party services
├── types/         # TypeScript type definitions
├── utils/         # Utility functions
├── App.tsx        # Main application component
└── main.tsx       # Application entry point
```

---

Made with ❤️ by Gizem Birinci
