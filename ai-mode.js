// ====== ELEMENTS ======
const chatContainer = document.getElementById("chatContainer");
const userInput = document.getElementById("userInput");
const micBtn = document.getElementById("micBtn");
const AI_API_URL = "http://localhost:3000/messages";

// ====== GLOBAL STATE (With Persistence) ======
let batteryRef = null;

// Load data from LocalStorage or initialize as empty
let todos = JSON.parse(localStorage.getItem("todos")) || [];
let notes = JSON.parse(localStorage.getItem("notes")) || [];

// Save data helper
function saveToDisk() {
    localStorage.setItem("todos", JSON.stringify(todos));
    localStorage.setItem("notes", JSON.stringify(notes));
}

// ==========================================
// INITIALIZATION (Hello Boss Greeting)
// ==========================================
window.addEventListener("load", () => {
    const hour = new Date().getHours();
    let greeting = "";

    if (hour < 12) greeting = "Good morning";
    else if (hour < 18) greeting = "Good afternoon";
    else greeting = "Good evening";

    botReply(`🤖 Hello Boss, ${greeting}. I am online and ready.`);
});

// Mic Button → Redirect to Siri Voice Page
micBtn.addEventListener("click", () => {
    speak("Switching to Siri Voice Mode...");
    setTimeout(() => {
        window.location.href = "siri.html";
    }, 800);
});

// ====== SPEECH RECOGNITION ======
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript.trim();
        addMessage(transcript, "user");
        handleCommand(transcript);
    };
    
    window.startSpeech = () => recognition.start();
    window.stopSpeech = () => recognition.stop();
}

// ====== CHAT DISPLAY ======
function addMessage(text, sender) {
    const msg = document.createElement("div");
    msg.className = `message ${sender}`;
    msg.innerHTML = text;
    chatContainer.appendChild(msg);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// ====== TEXT TO SPEECH ======
function speak(text) {
    const utter = new SpeechSynthesisUtterance(text);
    // Remove HTML and Emojis for clean speech
    utter.text = text.replace(/<br>/g, " ").replace(/🤖|❌|✅|📋|📝|🔋|🔌|🌡️|🌍|🧮|⏰|📅|🛡️|📰|🔔/g, "");
    speechSynthesis.cancel();
    speechSynthesis.speak(utter);
}

function botReply(text) {
    addMessage(text, "bot");
    speak(text);
}

// ====== CORE FEATURES ======

// 1. TO-DOs
function addTodo(task) {
    if (!task) return botReply("❌ Please provide a task.");
    todos.push({ task, done: false });
    saveToDisk();
    botReply(`✅ Task added: ${task}`);
}

function listTodos() {
    if (todos.length === 0) return botReply("📭 Your To-Do list is empty.");
    let list = "📋 Your To-Do List:<br>";
    todos.forEach((t, i) => {
        list += `${i + 1}. ${t.done ? "✔️" : "❌"} ${t.task}<br>`;
    });
    botReply(list);
}

// 2. NOTES
function addNote(text) {
    if (!text) return botReply("❌ Say something to save as a note.");
    notes.push(text);
    saveToDisk();
    botReply("📝 Note saved, Boss.");
}

function listNotes() {
    if (notes.length === 0) return botReply("📭 No notes found.");
    let list = "📝 Your Notes:<br>";
    notes.forEach((n, i) => (list += `${i + 1}. ${n}<br>`));
    botReply(list);
}

// 3. WEATHER
async function getWeather() {
    if (navigator.geolocation) {
        botReply("🌍 Fetching your location, Boss...");
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            try {
                const API_KEY = "YOUR_OPEN_WEATHER_API_KEY"; 
                const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
                const data = await response.json();
                const temp = Math.round(data.main.temp);
                const desc = data.weather[0].description;
                botReply(`🌡️ Boss, in ${data.name} it is ${temp}°C with ${desc}.`);
            } catch (err) {
                botReply("❌ Sorry Boss, I couldn't fetch the weather.");
            }
        }, () => botReply("❌ Location access denied."));
    } else {
        botReply("❌ Geolocation not supported.");
    }
}

// 4. BATTERY STATUS
if (navigator.getBattery) {
    navigator.getBattery().then(battery => { batteryRef = battery; });
}

function getBatteryStatus() {
    if (!batteryRef) return botReply("❌ Battery status not supported.");
    const level = Math.round(batteryRef.level * 100);
    const charging = batteryRef.charging ? "🔌 Charging" : "🔋 Not charging";
    botReply(`🔋 Boss, your battery is at ${level}%. Status: ${charging}`);
}

// 5. SYSTEM SCAN
function runSystemScan() {
    botReply("🌍 Starting system diagnostic...");
    setTimeout(() => {
        const platform = navigator.platform;
        const language = navigator.language;
        const onlineStatus = navigator.onLine ? "Online" : "Offline";
        const battery = batteryRef ? Math.round(batteryRef.level * 100) + "%" : "Unknown";
        
        botReply(`
            🛡️ Scan Complete:<br>
            • OS: ${platform}<br>
            • Language: ${language}<br>
            • Network: ${onlineStatus}<br>
            • Power: ${battery}<br>
            Everything is operational, Boss.
        `);
    }, 1500);
}

// 6. NEWS INTEGRATION
async function getNews() {
    botReply("📰 Fetching latest headlines, Boss...");
    try {
        const API_KEY = "YOUR_NEWS_API_KEY"; 
        const response = await fetch(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`);
        const data = await response.json();
        
        if (data.articles && data.articles.length > 0) {
            let newsMsg = "📰 Top Headlines:<br>";
            for (let i = 0; i < 3; i++) {
                newsMsg += `• ${data.articles[i].title}<br>`;
            }
            botReply(newsMsg);
        } else {
            botReply("❌ I couldn't find any news at the moment.");
        }
    } catch (err) {
        botReply("❌ Failed to connect to news protocol.");
    }
}

// 7. TIMER / ALARM
function setTimer(input) {
    const seconds = parseInt(input.replace(/[^0-9]/g, ''));
    if (isNaN(seconds)) return botReply("❌ Please specify the number of seconds, Boss.");
    
    botReply(`⏰ Timer set for ${seconds} seconds.`);
    
    setTimeout(() => {
        botReply("🔔 Boss, the timer is up!");
    }, seconds * 1000);
}

// 8. CALCULATOR / CONVERTER
function runUnitConverter(message) {
    const numbers = message.match(/\d+(\.\d+)?/);
    if (!numbers) return botReply("❌ Please provide a numerical value, Boss.");
    const val = parseFloat(numbers[0]);

    if (message.includes("km") || message.includes("kilometer")) {
        const miles = (val * 0.621371).toFixed(2);
        botReply(`🧮 ${val} kilometers is approximately ${miles} miles.`);
    } else if (message.includes("dollar")) {
        const rupees = (val * 83.0).toFixed(2); // Using a fixed rate of 83 for demo
        botReply(`💰 ${val} dollars is approximately ${rupees} Indian Rupees.`);
    } else {
        botReply("❌ I don't know that conversion yet, Boss.");
    }
}

// 9. CSE DEFINITIONS
const definitions = {
    html: "HTML is used to structure web pages.",
    css: "CSS is used to style and design web pages.",
    javascript: "JavaScript is a programming language used for interactivity.",
    dbms: "DBMS is software used to manage data efficiently.",
    os: "An Operating System manages hardware and software resources.",
    ai: "Artificial Intelligence mimics human intelligence.",
    oops: "OOPS is a paradigm based on objects and classes."
};

const jokes = [
    "Why do programmers hate nature? Too many bugs 🐛",
    "Why Java developers wear glasses? Because they don’t C 👓",
    "I told my computer I needed a break… it froze 😆"
];

// ====== COMMAND HANDLER (The Brain) ======
async function handleCommand(message) {
    const lower = message.toLowerCase().trim();

    // 1. Stealth Mode & Themes
    if (lower.includes("stealth mode")) {
        document.body.style.backgroundColor = "#1a0000"; // Dark red
        document.body.style.color = "#ff4d4d";
        chatContainer.style.borderColor = "#ff4d4d";
        return botReply("🔴 Stealth mode activated. Visual interface minimized.");
    }
    if (lower.includes("lights on") || lower.includes("cyan mode") || lower.includes("normal mode")) {
        document.body.style.backgroundColor = "#0d0d0d";
        document.body.style.color = "#f0f0f0";
        chatContainer.style.borderColor = "#00bcd4";
        return botReply("🔵 Restoring standard interface. Systems online.");
    }

    // 2. Unit Converter
    if (lower.includes("convert")) {
        return runUnitConverter(lower);
    }

    // 3. Basics
    if (lower === "hi" || lower === "hello" || lower === "hey") {
        return botReply("🤖 Hello Boss! How can I assist you today?");
    }
    if (lower.includes("time")) {
        return botReply(`⏰ Boss, current time: ${new Date().toLocaleTimeString()}`);
    }
    if (lower.includes("date")) {
        return botReply(`📅 Today is ${new Date().toLocaleDateString()}`);
    }

    // 4. Features
    if (lower.includes("timer") || lower.includes("alarm")) return setTimer(lower);
    if (lower.includes("news")) return getNews();
    if (lower.includes("scan") || lower.includes("diagnostic")) return runSystemScan();
    if (lower.includes("weather")) return getWeather();
    if (lower.includes("battery")) return getBatteryStatus();
    if (lower.includes("joke")) return botReply(jokes[Math.floor(Math.random() * jokes.length)]);
    
    if (lower.includes("help") || lower === "commands") {
        return botReply("📌 Boss, ask for Weather, News, Converter, Stealth mode, Scan, Battery, Time, Math, or manage Tasks/Notes.");
    }

    // 5. Definitions
    for (let key in definitions) {
        if (lower.includes(`define ${key}`) || lower.includes(`what is ${key}`)) {
            return botReply(definitions[key]);
        }
    }

    // 6. Persistence Logic
    if (lower.includes("add task")) return addTodo(message.replace(/add task/i, "").trim());
    if (lower.includes("list tasks")) return listTodos();
    if (lower.includes("save note")) return addNote(message.replace(/save note/i, "").trim());
    if (lower.includes("list notes")) return listNotes();

    // 7. Math
    if (lower.startsWith("calculate")) return calculate(lower.replace("calculate", ""));

    // 8. Navigations
    if (lower.includes("open google")) return window.open("https://google.com", "_blank");
    if (lower.includes("open youtube")) return window.open("https://youtube.com", "_blank");

    // BACKEND & GOOGLE FALLBACK
    try {
        const res = await fetch(AI_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user: message })
        });
        const data = await res.json();

        if (data.reply === "COMMAND_NOT_FOUND") {
            triggerGoogleSearch(message);
        } else {
            botReply(data.reply);
        }
    } catch (e) {
        triggerGoogleSearch(message);
    }
}

function triggerGoogleSearch(message) {
    botReply(`🔍 Searching Google for "${message}" now...`);
    setTimeout(() => {
        window.open("https://www.google.com/search?q=" + encodeURIComponent(message), "_blank");
    }, 1500);
}

// ====== INPUT EVENTS ======
function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;
    addMessage(text, "user");
    handleCommand(text);
    userInput.value = "";
}

userInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
});
