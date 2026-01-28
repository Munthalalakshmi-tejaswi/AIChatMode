
const AI_API_URL = "http://localhost:3000/messages";
const RETURN_PAGE = "ai.html";


// ------- ELEMENTS -------
const statusText = document.getElementById("status-text");
const siriCircle = document.getElementById("siri-circle");

// ------- SPEECH RECOGNITION -------
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.continuous = true;
recognition.interimResults = false;
recognition.lang = "en-US";

let listeningAllowed = true;
let isSpeaking = false;

// Auto Start
window.onload = () => {
    startListening();
};

// ------- START LISTENING -------
function startListening() {
    if (!listeningAllowed || isSpeaking) return;

    statusText.textContent = "Listening…";

    try { recognition.start(); } catch (e) {}
}

// ------- STOP LISTENING -------
function stopListening() {
    try { recognition.stop(); } catch (e) {}
}

// ------- SPEAK -------
function speak(text) {
    speechSynthesis.cancel();

    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 1.0;
    utter.pitch = 1.0;

    utter.onstart = () => {
        isSpeaking = true;
        listeningAllowed = false;
        stopListening();
        statusText.textContent = "Speaking…";
    };

    utter.onend = () => {
        isSpeaking = false;
        listeningAllowed = true;
        statusText.textContent = "Listening…";
        setTimeout(() => startListening(), 400);
    };

    speechSynthesis.speak(utter);
}

// ------- SMART QUICK RESPONSES -------
function smartReply(message) {
    const msg = message.toLowerCase();

    if (["hi", "hey", "hello"].includes(msg))
        return "Hi! How can I help you?";

    if (msg.includes("how are you"))
        return "I'm working perfectly!";

    if (msg.includes("your name"))
        return "I am your Siri style assistant.";

    if (msg.includes("date"))
        return "Today is " + new Date().toLocaleDateString();

    if (msg.includes("time"))
        return "The time is " + new Date().toLocaleTimeString();

    if (msg.startsWith("calculate") || msg.startsWith("solve")) {
        try {
            let exp = msg.replace("calculate", "").replace("solve", "").trim();
            let result = eval(exp);
            return `The answer is ${result}`;
        } catch {
            return "I couldn't calculate that.";
        }
    }

    return null;
}

// ------- ON RESULT -------
recognition.onresult = async (event) => {
    let transcript = event.results[event.results.length - 1][0].transcript.trim();
    console.log("User:", transcript);

    const msg = transcript.toLowerCase();

    if (msg === "stop") {
        speak("Exiting voice mode.");
        setTimeout(() => window.location.href = RETURN_PAGE, 1500);
        return;
    }

    const quick = smartReply(msg);
    if (quick !== null) {
        speak(quick);
        return;
    }

    const reply = await askAI(msg);
    speak(reply);
};

// ------- CALL YOUR AI BACKEND -------
async function askAI(message) {
    try {
        // SAVE message in JSON server
        await fetch(AI_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user: message })
        });

        // GET last reply from database (if needed)
        const res = await fetch(AI_API_URL);
        const all = await res.json();

        // last message (fallback reply)
        const lastItem = all[all.length - 1];

        return lastItem.reply || "No response stored.";
    } catch (e) {
        console.error("API Error:", e);
        return "Error connecting to the server.";
    }
}

// ------- SAFE ERROR HANDLING -------
recognition.onerror = () => {
    setTimeout(() => startListening(), 500);
};

recognition.onend = () => {
    if (!isSpeaking && listeningAllowed) {
        setTimeout(() => startListening(), 300);
    }
};