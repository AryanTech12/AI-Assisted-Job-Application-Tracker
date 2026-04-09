# AI-Assisted Job Application Tracker

A powerful, full-stack Kanban board for tracking job applications. Integrates with the OpenAI API to automatically parse Job Descriptions, map them to database fields, and generate tailor-made resume tips for each role.

## ✨ Features
* **Authentication**: Fully functional secure JWT authentication.
* **Kanban Board**: Drag-and-drop job application cards across statuses (Applied, Phone Screen, Interview, Offer, Rejected) using `@hello-pangea/dnd`.
* **AI Parser Integration**: Paste a job description and AI automatically maps out the **Company**, **Role**, **Location**, and **Skills**.
* **AI Resume Coaching**: Returns 3-5 hyper-specific resume bullet points geared toward the exact job you pasted.
* **Premium UI/UX**: Includes a beautifully animated Dark/Light Mode toggle, 3D card tilt effects, glassmorphism UI elements, and highly responsive Tailwind styling.

## 🛠 Tech Stack
* **Frontend:** React, TypeScript, Vite, Tailwind CSS, React Query
* **Backend:** Node.js, Express, TypeScript
* **Database:** MongoDB & Mongoose
* **AI Integration:** OpenAI API (`gpt-3.5-turbo`)

## 🏗 Implementation Decisions
1. **React Query over Redux Toolkit**: I chose `@tanstack/react-query` to manage client state. Since this is an API-heavy dashboard (pulling, dragging, parsing, deleting), React Query cleanly handles optimistic UI updates when dragging Kanban cards, avoiding heavy boilerplate code.
2. **`json_object` OpenAI Mode**: Inside `ai.service.ts`, AI responses are strictly forced to `json_object` mode so the backend parsing logic never fails or crashes due to unexpected markdown blocks.
3. **Optimistic UI Updates**: When a user drags a card, the frontend immediately updates its UI array structure before the backend saves the changes. This provides a completely zero-latency "native application" feel.
4. **Tailwind Dark Mode**: Extended Tailwind with custom animated gradients and a dark mode toggle to hit the "Premium" stretch goal requirements.

## 🚀 How to Run Locally

### 1. Prerequisites
- Node.js installed
- A running MongoDB Database (Local instance via Compass or an Atlas URI)
- An OpenAI API Key

### 2. Environment Setup
In the `backend` folder, create a `.env` file based off `.env.example`:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/job-tracker
JWT_SECRET=supersecretjwtkey_change_in_production
OPENAI_API_KEY=your_openai_api_key_here
```

### 3. Installation
Open two terminal windows.

**Terminal 1 (Backend):**
```bash
cd backend
npm install
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm install
npm run dev
```

### 4. Open the App
Go to `http://localhost:5173/` in your browser. Register a new user, and click **"Add Application"** to test the OpenAI Job Extraction form!
