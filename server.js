const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// ====== MIDDLEWARE ======
app.use(cors()); 
app.use(express.json()); 

// ====== DATABASE (In-Memory) ======
let messages = [];

// ====== ROUTES ======

/**
 * HOME ROUTE
 * This fixes the "Cannot GET /" error.
 */
app.get('/', (req, res) => {
    res.send(`
        <div style="background: #000; color: #00bcd4; height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; font-family: 'Segoe UI', sans-serif; text-align: center;">
            <h1 style="border: 2px solid #00bcd4; padding: 20px; border-radius: 10px; box-shadow: 0 0 20px #00bcd4;">🚀 JARVIS CORE: ONLINE</h1>
            <p style="color: #fff; margin-top: 20px;">The backend is active. Communication port: <strong>${PORT}</strong></p>
            <p style="font-size: 0.9em; opacity: 0.6; color: #aaa;">Ready for requests from frontend...</p>
        </div>
    `);
});

/**
 * GET MESSAGES
 * View history at http://localhost:3000/messages
 */
app.get('/messages', (req, res) => {
    res.json(messages);
});

/**
 * POST MESSAGE
 * Handles incoming data from your 'askAI' function
 */
app.post('/messages', (req, res) => {
    const userMessage = req.body.user;

    if (!userMessage) {
        return res.status(400).json({ error: "No message received" });
    }

    // --- Jarvis Reply Logic ---
    let jarvisReply = "";
    const input = userMessage.toLowerCase();

    if (input.includes("status")) {
        jarvisReply = "All systems are operational. Power levels at 100%.";
    } else if (input.includes("who are you")) {
        jarvisReply = "I am Jarvis, your personal AI interface.";
    } else if (input.includes("protocol")) {
        jarvisReply = "House party protocol is currently disabled, sir.";
    } else {
        jarvisReply = `I have processed your request: "${userMessage}". How else can I help?`;
    }

    const newMessage = {
        id: Date.now(),
        user: userMessage,
        reply: jarvisReply,
        timestamp: new Date().toLocaleTimeString()
    };
    messages.push(newMessage);

    // Logs for your terminal
    console.log(`[${newMessage.timestamp}] User: ${userMessage}`);
    console.log(`[${newMessage.timestamp}] Jarvis: ${jarvisReply}`);

    res.status(201).json(newMessage);
});

// ====== START SERVER ======
app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`🚀 JARVIS SERVER ONLINE: http://localhost:${PORT}`);
    console.log(`📡 GET logs at: http://localhost:${PORT}/messages`);
    console.log(`=========================================`);
});