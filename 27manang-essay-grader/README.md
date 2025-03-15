# Essay Grader Application

An application that grades essays based on various criteria including word count, repeated sentence starters, spelling, and more.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm (Node Package Manager)

## Quick Start

1. Clone the repository:
   ```bash
   git clone git@github.com:mnn31/essay-grader.git
   cd essay-grader
   ```

2. Make the setup script executable:
   ```bash
   chmod +x setup.sh
   ```

3. Run the setup script:
   ```bash
   ./setup.sh
   ```

The script will:
- Install all necessary dependencies for both frontend and backend
- Start MongoDB if not already running
- Start the backend server on port 5001
- Start the frontend development server on port 5173

## Manual Setup

If you prefer to set up manually or if the setup script doesn't work:

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the backend server:
   ```bash
   node server.js
   ```

The backend server will run on http://localhost:5001

### Frontend Setup

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
   npm run build
   ```

The frontend application will run on http://localhost:5173

## Usage

1. Open your browser and navigate to http://localhost:5173
2. Enter your essay text in the input field
3. Click the "Grade Essay" button
4. View your essay's grade and feedback in the results section

## Features

- Word count analysis
- Spelling check
- Repeated sentence starter detection
- Preposition ending detection
- Plagiarism detection
- Real-time grading and feedback

## Technical Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MongoDB
- Spell Checking: Nodehun
- File Upload: Multer
- Cross-Origin Resource Sharing: CORS 
