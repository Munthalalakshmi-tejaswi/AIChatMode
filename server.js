const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors()); 
app.use(express.json()); 

let messages = [];

app.get('/', (req, res) => {
    res.send(`<h1 style="font-family:sans-serif; text-align:center; margin-top:50px;">🚀 JARVIS CORE ONLINE</h1>`);
});

app.get('/messages', (req, res) => {
    res.json(messages);
});

app.post('/messages', (req, res) => {
    const userMessage = req.body.user;
    if (!userMessage) return res.status(400).json({ error: "Empty message" });

    let jarvisReply = "";
    const input = userMessage.toLowerCase();

    // Custom Backend Intelligence
    if (input.includes("status")) {
        jarvisReply = "All systems are operational, Boss. Power levels at 100%.";
    } else if (input.includes("who are you")) {
        jarvisReply = "I am Jarvis, your personal AI interface.";
    } else if (input.includes("protocol")) {
        jarvisReply = "Protocol Zero is currently standby. All defense systems are active.";
    } else {
        // Fallback for Backend
        jarvisReply = "COMMAND_NOT_FOUND"; 
    }

    const newMessage = {
        id: Date.now(),
        user: userMessage,
        reply: jarvisReply,
        timestamp: new Date().toLocaleTimeString()
    };
    messages.push(newMessage);
    res.status(201).json(newMessage);
});

app.listen(PORT, () => {
    console.log(`🚀 JARVIS SERVER ONLINE: http://localhost:${PORT}`);
});
