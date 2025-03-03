# Essay Grader

A web application that grades essays based on specific criteria. Currently implements grading based on the use of certain words and phrases.

## Features

- Upload text files containing essays
- Grade essays from -200% to 100%
- Current grading criteria:
  - -1% for each use of "very"
  - -1% for each use of "really"
  - -1% for each use of any form of "get" (get, gets, got, gotten, getting)

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or a MongoDB Atlas connection string)
- npm or yarn

## Setup

### Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following content:
   ```
   MONGODB_URI=mongodb://localhost:27017/essay-grader
   PORT=5000
   ```

4. Start the backend server:
   ```bash
   node server.js
   ```

### Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

## Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Click the "Upload Essay" button to select a text file containing your essay
3. The essay content will be displayed in the text area
4. Click "Grade Essay" to receive your grade and feedback
5. The grade and detailed feedback will be displayed below the form

## Technologies Used

- Frontend:
  - React
  - Material-UI
  - Axios

- Backend:
  - Node.js
  - Express
  - MongoDB
  - Mongoose 