# Essay Grading System Design Document

## Problem Statement
```
┌─────────────────────────────────────────────────────────────┐
│                     Current Challenges                       │
├─────────────────────────────────────────────────────────────┤
│ 1. Manual grading is time-consuming and inconsistent        │
│ 2. Students lack immediate feedback on their writing        │
│ 3. Difficulty in maintaining consistent grading standards   │
│ 4. Need for objective evaluation of writing quality         │
└─────────────────────────────────────────────────────────────┘
```

## System Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                     System Overview                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐   │
│  │   Frontend  │     │   Backend   │     │  Database   │   │
│  │  (React)    │◄───►│  (Node.js)  │◄───►│  (MongoDB)  │   │
│  │   + Vite    │     │  + Express  │     │            │   │
│  └─────────────┘     └─────────────┘     └─────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Grading Criteria Implementation
```
┌─────────────────────────────────────────────────────────────┐
│                     Grading Rules                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ 1. Word Count (50% max deduction)                           │
│    └─► Less than required words: -50%                       │
│                                                             │
│ 2. Nasty No-Nos                                            │
│    └─► "very": -1% each                                    │
│    └─► "really": -1% each                                  │
│    └─► Forms of "get": -1% each                           │
│                                                             │
│ 3. Sentence Starters                                        │
│    └─► Same starter within 3 sentences: -3% per pair       │
│    └─► No double counting of sentences                     │
│                                                             │
│ 4. Spelling                                                 │
│    └─► Each misspelling: -1%                              │
│    └─► Uses dictionary-based checking                      │
│                                                             │
│ 5. Preposition Endings                                      │
│    └─► Sentences ending in prepositions: -1% each          │
│                                                             │
│ 6. Plagiarism Detection                                     │
│    └─► Exact matches: Grade of 0                           │
│    └─► Similar content detection                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Implementation Details
```
┌─────────────────────────────────────────────────────────────┐
│                     Key Components                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Backend (server.js):                                        │
│ ├─► Express server on port 5001                            │
│ ├─► MongoDB connection                                     │
│ ├─► Spell checker initialization                           │
│ └─► Essay grading endpoints                                │
│                                                             │
│ Grading Functions:                                          │
│ ├─► checkWordCount()                                       │
│ ├─► checkNastyNoNos()                                     │
│ ├─► checkRepeatedStarters()                               │
│ ├─► checkSpelling()                                       │
│ ├─► checkPrepositionEndings()                             │
│ └─► checkPlagiarism()                                     │
│                                                             │
│ Frontend:                                                   │
│ ├─► React + Vite setup                                    │
│ ├─► Real-time essay input                                 │
│ └─► Grade display with feedback                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Setup and Deployment
```
┌─────────────────────────────────────────────────────────────┐
│                     Setup Process                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Prerequisites:                                              │
│ ├─► Node.js (v14+)                                        │
│ ├─► MongoDB                                               │
│ └─► npm                                                   │
│                                                             │
│ Installation:                                               │
│ ├─► Clone repository                                      │
│ ├─► Run setup.sh script                                   │
│ │   └─► Installs dependencies                            │
│ │   └─► Starts MongoDB                                   │
│ │   └─► Launches backend (port 5001)                     │
│ │   └─► Launches frontend (port 5173)                    │
│ └─► Alternative: Manual setup                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Technical Dependencies
```
┌─────────────────────────────────────────────────────────────┐
│                     Dependencies                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Backend:                                                    │
│ ├─► express: Web server framework                          │
│ ├─► mongoose: MongoDB ODM                                  │
│ ├─► cors: Cross-origin resource sharing                    │
│ └─► nodehun: Spell checking                               │
│                                                             │
│ Frontend:                                                   │
│ ├─► react: UI library                                     │
│ ├─► vite: Build tool                                      │
│ └─► axios: HTTP client                                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Error Handling
```
┌─────────────────────────────────────────────────────────────┐
│                     Error Management                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Server-side:                                                │
│ ├─► Port conflict detection                               │
│ ├─► MongoDB connection errors                             │
│ ├─► Spell checker initialization                          │
│ └─► Essay processing errors                               │
│                                                             │
│ Client-side:                                                │
│ ├─► Input validation                                      │
│ ├─► API error handling                                    │
│ └─► User feedback display                                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Grading Criteria Flowchart
```
┌─────────────────────────────────────────────────────────────┐
│                     Grading Process                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐    │
│  │   Input     │     │   Analysis  │     │   Output    │    │
│  │  Essay Text │────►│  & Scoring  │────►│   Grade     │    │
│  └─────────────┘     └─────────────┘     └─────────────┘    │
│         ▲                     ▲                     ▲       │
│         │                     │                     │       │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐    │
│  │   Rules     │     │   Metrics   │     │  Feedback   │    │
│  │  Applied    │     │  Calculated │     │  Generated  │    │
│  └─────────────┘     └─────────────┘     └─────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

## Grading Rules Breakdown
```
┌─────────────────────────────────────────────────────────────┐
│                     Grading Rules                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ 1. Word Count (30%)                                         │
│    └─► 500+ words: 30%                                      │
│    └─► <500 words: 0%                                       │
│                                                             │
│ 2. Nasty No-Nos (15%)                                       │
│    └─► "very": -1% each                                     │
│    └─► "really": -1% each                                   │
│    └─► "get": -1% each                                      │
│                                                             │
│ 3. Sentence Starters (45%)                                  │
│    └─► Repeated within 3 sentences: -3% per pair           │
│                                                             │
│ 4. Spelling (10%)                                           │
│    └─► Each misspelling: -1%                               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram
```
┌─────────────────────────────────────────────────────────────┐
│                     Data Flow                               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐    │
│  │   Client    │     │   Server    │     │  Database   │    │
│  │             │     │             │     │             │    │
│  │ 1. Upload   │     │ 1. Process  │     │ 1. Store    │    │
│  │ 2. Submit   │────►│ 2. Analyze  │────►│ 2. Query    │    │
│  │ 3. Display  │     │ 3. Grade    │     │ 3. Retrieve │    │
│  └─────────────┘     └─────────────┘     └─────────────┘    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Technical Stack
```
┌─────────────────────────────────────────────────────────────┐
│                     Technology Stack                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Frontend:                                                    │
│ ┌─────────────┐                                             │
│ │ React      │                                             │
│ │ Material-UI│                                             │
│ │ Vite       │                                             │
│ └─────────────┘                                             │
│                                                             │
│ Backend:                                                     │
│ ┌─────────────┐                                             │
│ │ Node.js    │                                             │
│ │ Express    │                                             │
│ │ MongoDB    │                                             │
│ └─────────────┘                                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Performance Metrics
```
┌─────────────────────────────────────────────────────────────┐
│                     Performance Goals                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Response Time: < 2 seconds                                  │
│                                                             │
│ Throughput: 100 essays/minute                               │
│                                                             │
│ Accuracy: 99.9%                                             │
│                                                             │
│ Availability: 99.99%                                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Future Enhancements
```
┌─────────────────────────────────────────────────────────────┐
│                     Future Roadmap                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ 1. Advanced Analytics                                       │
│    └─► Writing style analysis                              │
│    └─► Progress tracking                                   │
│                                                             │
│ 2. Enhanced Feedback                                       │
│    └─► Detailed suggestions                                │
│    └─► Improvement tips                                    │
│                                                             │
│ 3. Integration Features                                    │
│    └─► LMS integration                                     │
│    └─► API access                                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Security Considerations
```
┌─────────────────────────────────────────────────────────────┐
│                     Security Measures                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ 1. Data Protection                                          │
│    └─► Encrypted storage                                   │
│    └─► Secure transmission                                 │
│                                                             │
│ 2. Access Control                                          │
│    └─► User authentication                                 │
│    └─► Role-based access                                   │
│                                                             │
│ 3. Compliance                                              │
│    └─► FERPA compliance                                    │
│    └─► Data retention                                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Testing Strategy
```
┌─────────────────────────────────────────────────────────────┐
│                     Testing Approach                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ 1. Unit Testing                                            │
│    └─► Individual components                               │
│    └─► Grading algorithms                                  │
│                                                             │
│ 2. Integration Testing                                     │
│    └─► API endpoints                                       │
│    └─► Database operations                                 │
│                                                             │
│ 3. End-to-End Testing                                      │
│    └─► User workflows                                      │
│    └─► System integration                                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
``` 