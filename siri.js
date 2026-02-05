const AI_API_URL = "http://localhost:3000/messages";
const RETURN_PAGE = "ai-mode.html"; // Fixed to match your filename

let todos = JSON.parse(localStorage.getItem("todos")) || [];
let notes = JSON.parse(localStorage.getItem("notes")) || [];
let batteryRef = null;
let listeningAllowed = true;
let isSpeaking = false;

const statusText = document.getElementById("status-text");

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = true;
recognition.lang = "en-US";

if (navigator.getBattery) {
    navigator.getBattery().then(battery => { batteryRef = battery; });
}

window.onload = () => { startListening(); };

function startListening() {
    if (!listeningAllowed || isSpeaking) return;
    statusText.textContent = "Listening...";
    try { recognition.start(); } catch (e) {}
}

function stopListening() {
    try { recognition.stop(); } catch (e) {}
}

function speak(text) {
    speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.onstart = () => {
        isSpeaking = true;
        listeningAllowed = false;
        stopListening();
        statusText.textContent = "Speaking...";
    };
    utter.onend = () => {
        isSpeaking = false;
        listeningAllowed = true;
        statusText.textContent = "Listening...";
        setTimeout(() => startListening(), 400);
    };
    speechSynthesis.speak(utter);
}

async function handleVoiceCommand(transcript) {
    const msg = transcript.toLowerCase();

    // 1. Exit
    if (msg.includes("stop") || msg.includes("exit")) {
        speak("Exiting voice mode.");
        setTimeout(() => window.location.href = RETURN_PAGE, 1500);
        return;
    }

    // 2. Battery
    if (msg.includes("battery")) {
        const level = Math.round(batteryRef.level * 100);
        return speak(`Boss, battery is at ${level} percent.`);
    }

    // 3. Backend Call & Google Fallback
    const response = await askAI(transcript);
    
    if (response === "COMMAND_NOT_FOUND") {
        speak(`Searching Google for ${transcript}`);
        setTimeout(() => {
            window.open("https://www.google.com/search?q=" + encodeURIComponent(transcript), "_blank");
        }, 1500);
    } else {
        speak(response);
    }
}

async function askAI(message) {
    try {
        const res = await fetch(AI_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user: message })
        });
        const data = await res.json();
        return data.reply;
    } catch (e) {
        return "Server is offline, Boss.";
    }
}

recognition.onresult = (event) => {
    const transcript = event.results[event.results.length - 1][0].transcript.trim();
    handleVoiceCommand(transcript);
};

recognition.onend = () => { if (!isSpeaking) startListening(); };
