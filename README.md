# 🎓 SkillSphere - AI-Powered Full-Stack Learning Platform

**SkillSphere** is a premium, modern, and comprehensive full-stack learning platform that combines the best features of LeetCode (interactive coding challenges), W3Schools (structured language lessons), Coursera (learning tracks with verified resources), and an interactive AI Tutor. 

---

## 🌟 Key Features

*   **Interactive Learning Roadmaps**: Clean, gamified, and responsive paths to learn HTML, CSS, JavaScript, Python, SQL, C++, Java, and more.
*   **LeetCode-style Coding Practice**: 
    *   38+ built-in coding challenges ranging from Easy to Hard.
    *   A structured layout featuring client-side pagination (6 items per page) designed with a balance of **45% Easy/Medium** and **55% Hard** challenges.
    *   Live code execution simulation with instant feedback.
*   **AI Study Companion**:
    *   Integrated AI Tutor powered by OpenRouter API (`openrouter/free` models).
    *   Dynamic chat history with context-aware learning assistance.
*   **Resource Library**: Curated video tutorials in English, Urdu, and Hindi from top content creators (e.g., Tech with Tim, CodeWithHarry) to supplement learning.
*   **Modern Premium Design**: Sleek glassmorphism UI, elegant gradients, responsive layouts, and interactive hover effects.

---

## 🛠️ Technology Stack

*   **Frontend**: React.js (built with Vite), CSS3 (Modern Glassmorphism, CSS Variables, Flexbox/Grid), React Router DOM, React Icons.
*   **Backend**: Python FastAPI, SQLite Database, SQLAlchemy ORM, Bcrypt (native password hashing), Uvicorn.
*   **AI Integration**: OpenRouter API.

---

## 🔒 Privacy & Security

This project is configured with a robust `.gitignore` file to ensure **zero privacy leaks** when uploading to public platforms like GitHub:
*   Local database binaries (`*.db`) are ignored.
*   Vite and FastAPI environment configuration files (`.env`, `.env.local`) containing sensitive API keys (`OPENROUTER_API_KEY`, `GOOGLE_CLIENT_ID`) are ignored.
*   A clean `.env.example` file is provided to allow easy local configuration.

---

## ⚙️ Local Installation & Setup

Follow these steps to run the project locally on your machine:

### 1. Prerequisites
Ensure you have the following installed:
*   [Node.js](https://nodejs.org/) (v16 or higher)
*   [Python](https://www.python.org/) (v3.9 or higher)
*   [Git](https://git-scm.com/)

---

### 2. Backend Setup
1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Create a virtual environment:
    ```bash
    python -m venv venv
    ```
3.  Activate the virtual environment:
    *   **Windows (PowerShell)**:
        ```powershell
        .\venv\Scripts\activate
        ```
    *   **Mac/Linux**:
        ```bash
        source venv/bin/activate
        ```
4.  Install the required dependencies:
    ```bash
    pip install -r requirements.txt
    ```
5.  Create a `.env` file inside the `backend` folder by copying the example template:
    ```bash
    cp .env.example .env
    ```
    Open `.env` and fill in your OpenRouter API Key and Google OAuth details:
    ```env
    DATABASE_URL=sqlite:///./skillsphere.db
    SECRET_KEY=your_jwt_secret_key
    OPENROUTER_API_KEY=your_actual_openrouter_key
    OPENROUTER_MODEL=openrouter/free
    GOOGLE_CLIENT_ID=your_google_client_id
    ```
6.  Seed the database with default challenges, paths, and video resources:
    ```bash
    python app/seed.py
    ```
7.  Run the FastAPI development server:
    ```bash
    python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
    ```

---

### 3. Frontend Setup
1.  Open a new terminal and navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install the npm dependencies:
    ```bash
    npm install
    ```
3.  Start the Vite dev server:
    ```bash
    npm run dev
    ```
4.  Open your browser and navigate to `http://localhost:5173`.
