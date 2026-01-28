# 🚀 AI Chat Mode: Jarvis System

<p align="center">
  <img src="AIChat_Mode_backend connect_node.png" alt="Jarvis Banner" width="700">
</p>

This project is a Siri-inspired virtual assistant named **Jarvis**. It utilizes a **Node.js** backend to process user queries and a high-tech **JavaScript** frontend for real-time voice recognition and speech synthesis.

---

## 📂 Project Structure & Quick Links

* 🖥️ **Frontend:** [`ai-mode.html`](./ai-mode.html) – Main chat interface
* 🎨 **Styling:** [`ai-mode.css`](./ai-mode.css) – Sci-fi inspired HUD design
* 🧠 **Logic:** [`ai-mode.js`](./ai-mode.js) – Core command handler
* 🎙️ **Voice Mode:** [`siri.html`](./siri.html) – Specialized voice-only interface
* 🐍 **Backend:** [`server.js`](./server.js) – Node.js Express server logic

---

## 📋 System Overview

The system operates on a client-server architecture. The browser captures voice input via the Web Speech API and sends it to the Node.js backend for processing.

### Technical Specifications

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | HTML5 / CSS3 / JS | UI with "Roboto Mono" typography and animations. |
| **Backend** | Node.js (Express) | Handles API requests and manages message history. |
| **Recognition** | Web Speech API | Converts user voice into text strings. |
| **Voice Sync** | SpeechSynthesis | Converts Jarvis's replies into spoken audio. |
| **Data Flow** | JSON / Fetch API | Standardized communication between client and server. |

---

## 🛠️ Tech Stack

![Node.js](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)

---

## 🎙️ Supported Commands

| Command Category | Examples |
| :--- | :--- |
| **Greetings** | "Hello", "Hi", "Hey Jarvis" |
| **Utilities** | "Time", "Date", "Battery" |
| **To-Do List** | "Add [Task]", "List", "Clear", "Done [Number]" |
| **Web Navigation**| "Open Google", "Open YouTube" |
| **Calculations** | "Calculate 5 * 10 + 2" |
| **System Info** | "Status", "Who are you?" |

---

## 🚀 Setup Instructions

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) (v16 or higher) installed.

### 2. Installation
Open your terminal in the `AI_ChatMode` folder and run:
```bash
npm init -y
npm install express cors
