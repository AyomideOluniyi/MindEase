# MindEase – AI-Powered Mental Health Support App

MindEase is a cross-platform mobile mental health support application developed using **React Native (Expo)** for the frontend and **Node.js (Express)** for the backend. It integrates **OpenAI GPT-3.5** for chatbot responses and **Hugging Face GoEmotions** for sentiment analysis.

> ❗ Disclaimer: This app is not a replacement for professional therapy. It provides supportive conversations and mood logging only.

---

## 🔍 Key Features

- 🧠 **AI Chatbot** – Users can send messages and receive GPT-generated empathetic responses.
- 🌦️ **Mood Logger** – Users log their mood with emoji selections and optional notes.
- 📖 **Daily Journal** – A simple reflection area for users to write about their day.
- 📊 **Weekly Mood Summary** – Aggregated view of moods for the week (text summary).
- ⚙️ **Crisis Support Logic** – Backend detects signs of emotional distress and shows support guidance.

---

## 🛠️ Tech Stack

| Layer       | Tooling / Libraries                          |
|-------------|----------------------------------------------|
| Frontend    | React Native (Expo), AsyncStorage, Axios     |
| Backend     | Node.js, Express, dotenv                     |
| AI Services | OpenAI GPT-3.5 (`/chat`), HuggingFace API (`/analyze`) |
| Dev Tools   | Replit (backend), Expo Go (mobile testing), GitHub |

---

## ⚙️ How to Run the Project Locally

### Backend (Replit or Node locally):
1. Clone the repo and go to backend directory (if separated).
2. Add a `.env` file:
    ```
    OPENAI_API_KEY=your-openai-key
    HUGGINGFACE_API_KEY=your-huggingface-key
    ```
3. Run:
    ```bash
    node index.js
    ```
4. Use **ngrok** to expose:
    ```bash
    npx ngrok http 3000
    ```
5. Copy the `https` URL and update the frontend `API_URL`.

---

### Frontend (Expo):
1. Go to the frontend directory or root of the project.
2. Install dependencies:
    ```bash
    npm install
    ```
3. Start Expo:
    ```bash
    npx expo start
    ```
4. Scan the QR code using **Expo Go** on your phone (iOS/Android).

---

## 📦 Project Structure

---

MindEase/

├── App.js 

├── index.js 

├── components/ 

├── assets/ 

├── .replit / .gitignore 

└── README.md 

---

## 👨🏽‍💻 Author

Timi Oluniyi 

---

