// ====== ELEMENTS ======
const chatContainer = document.getElementById("chatContainer");
const userInput = document.getElementById("userInput");
const micBtn = document.getElementById("micBtn");

// ====== GLOBAL ======
let listening = false;
let todos = [];

// ==========================================
// MIC BUTTON → OPEN SIRI PAGE
// ==========================================
micBtn.addEventListener("click", () => {
  speak("Switching to Siri Voice Mode...");
  setTimeout(() => {
    window.location.href = "siri.html";
  }, 500);
});

// ====== SPEECH RECOGNITION ======
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.continuous = true;
recognition.interimResults = false;
recognition.lang = "en-US";

window.addEventListener("load", () => {
  botReply("🤖 Hello! How may I help you?");
});

recognition.onresult = (event) => {
  const transcript =
    event.results[event.results.length - 1][0].transcript.trim();
  addMessage(transcript, "user");
  handleCommand(transcript);
};

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
  speechSynthesis.speak(utter);
}

function botReply(text) {
  addMessage(text, "bot");
  speak(text);
}

// ====== TO-DO FUNCTIONS ======
function addTodo(task) {
  if (!task) return botReply("❌ Please provide a task.");
  todos.push({ task, done: false });
  botReply(`✅ Added task: ${task}`);
}

function listTodos() {
  if (todos.length === 0)
    return botReply("📭 Your To-Do list is empty.");

  let list = "📋 Your To-Do List:<br>";
  todos.forEach((t, i) => {
    list += `${i + 1}. ${t.done ? "✔️" : "❌"} ${t.task}<br>`;
  });
  addMessage(list, "bot");
}

function completeTodo(index) {
  index--;
  if (!todos[index]) return botReply("❌ Invalid task number.");
  todos[index].done = true;
  botReply(`✔️ Task completed: ${todos[index].task}`);
}

function deleteTodo(index) {
  index--;
  if (!todos[index]) return botReply("❌ Invalid task number.");
  const removed = todos.splice(index, 1);
  botReply(`🗑️ Deleted: ${removed[0].task}`);
}

function clearTodos() {
  todos = [];
  botReply("🧹 All tasks cleared.");
}

// ====== CALCULATOR ======
function calculate(expr) {
  try {
    const result = eval(expr);
    botReply(`🧮 Result: ${result}`);
  } catch {
    botReply("❌ Invalid calculation.");
  }
}

// ====== NAVIGATION ======
function speakAndNavigate(msg, url) {
  botReply(msg);
  setTimeout(() => window.open(url, "_blank"), 1200);
}

// ====== COMMAND HANDLER ======
function handleCommand(message) {
  const lower = message.toLowerCase();

  // Greetings
  if (lower.includes("hello") || lower.includes("hi"))
    return botReply("🤖 Hello! How may I help you?");

  // To-Do Commands
  if (lower.startsWith("add ")) return addTodo(message.slice(4));
  if (lower === "list") return listTodos();
  if (lower.startsWith("done "))
    return completeTodo(parseInt(message.split(" ")[1]));
  if (lower.startsWith("delete "))
    return deleteTodo(parseInt(message.split(" ")[1]));
  if (lower === "clear") return clearTodos();

  // Date & Time
  if (lower.includes("time"))
    return botReply("🕒 " + new Date().toLocaleTimeString());

  if (lower.includes("date"))
    return botReply("📅 " + new Date().toLocaleDateString());

  // Calculator
  if (lower.startsWith("calculate"))
    return calculate(message.replace("calculate", ""));

  // Websites
  if (lower.includes("open google"))
    return speakAndNavigate("Opening Google...", "https://google.com");
  if (lower.includes("open youtube"))
    return speakAndNavigate("Opening YouTube...", "https://youtube.com");

  // Default Search
  speakAndNavigate(
    `Searching for ${message}`,
    "https://www.google.com/search?q=" + message.replace(/ /g, "+")
  );
}

// ====== MANUAL MESSAGE SEND ======
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