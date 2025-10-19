// Quotes array with objects containing text and category
let quotes = [
  { text: "The best way to predict the future is to invent it.", category: "Inspiration" },
  { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Motivation" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" }
];

const STORAGE_KEY = "quotes";
const SESSION_LAST_INDEX = "lastViewedQuoteIndex";

// Save quotes array to localStorage
function saveQuotes() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes));
  } catch (e) {
    console.error("Failed to save quotes to localStorage:", e);
  }
}

// Load quotes from localStorage if available
function loadQuotes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        // simple validation: ensure objects have text and category
        const valid = parsed.every(q => q && typeof q.text === "string" && typeof q.category === "string");
        if (valid) {
          quotes = parsed;
        } else {
          console.warn("Imported quotes from localStorage are malformed — keeping defaults.");
        }
      }
    }
  } catch (e) {
    console.error("Failed to load quotes from localStorage:", e);
  }
}

// Display a random quote and save its index to sessionStorage
function displayRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");
  if (!quoteDisplay) return;

  if (quotes.length === 0) {
    quoteDisplay.innerHTML = "<p>No quotes available!</p>";
    sessionStorage.removeItem(SESSION_LAST_INDEX);
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const selected = quotes[randomIndex];

  quoteDisplay.innerHTML = "<p>\"" + selected.text + "\"</p><p><em>Category: " + selected.category + "</em></p>";

  // store last viewed index in sessionStorage (session-only)
  try {
    sessionStorage.setItem(SESSION_LAST_INDEX, String(randomIndex));
  } catch (e) {
    console.warn("Unable to set session storage:", e);
  }
}

// Add a new quote, save to localStorage and update DOM
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  if (!textInput || !categoryInput) return;

  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (!text || !category) {
    alert("Please fill in both fields!");
    return;
  }

  quotes.push({ text: text, category: category });

  // persist to localStorage
  saveQuotes();

  // clear inputs
  textInput.value = "";
  categoryInput.value = "";

  // show the newly added quote immediately
  displayRandomQuote();
}

// Export quotes to a JSON file (download)
function exportToJsonFile() {
  try {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "quotes.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
  } catch (e) {
    console.error("Failed to export quotes as JSON:", e);
    alert("Export failed. See console for details.");
  }
}

// Import quotes from a JSON file (called via input onchange)
function importFromJsonFile(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) {
    alert("No file selected.");
    return;
  }

  const fileReader = new FileReader();
  fileReader.onload = function (evt) {
    try {
      const imported = JSON.parse(evt.target.result);
      if (!Array.isArray(imported)) {
        alert("Imported JSON should be an array of quotes.");
        return;
      }
      // validate items and only accept those with text and category strings
      const validItems = imported.filter(q => q && typeof q.text === "string" && typeof q.category === "string");
      if (validItems.length === 0) {
        alert("No valid quotes found in the file.");
        return;
      }

      // append imported quotes
      quotes.push(...validItems);
      saveQuotes();
      alert("Quotes imported successfully!");
      displayRandomQuote();
    } catch (err) {
      console.error("Failed to import JSON:", err);
      alert("Failed to import JSON file. See console for details.");
    } finally {
      // reset the file input so the same file can be imported again if needed
      event.target.value = "";
    }
  };
  fileReader.readAsText(file);
}

// Clear stored quotes from localStorage and reset to defaults
function clearStoredQuotes() {
  if (!confirm("This will clear saved quotes from local storage and reset to defaults. Continue?")) return;
  localStorage.removeItem(STORAGE_KEY);
  // reload default initial quotes by reloading the page (simplest)
  location.reload();
}

// On init: load quotes from localStorage, show last viewed if in sessionStorage else do nothing
function init() {
  loadQuotes();

  // show last viewed quote (session-only) if available
  const lastIndex = sessionStorage.getItem(SESSION_LAST_INDEX);
  if (lastIndex !== null) {
    const idx = parseInt(lastIndex, 10);
    if (!Number.isNaN(idx) && idx >= 0 && idx < quotes.length) {
      const quoteDisplay = document.getElementById("quoteDisplay");
      if (quoteDisplay) {
        const selected = quotes[idx];
        quoteDisplay.innerHTML = "<p>\"" + selected.text + "\"</p><p><em>Category: " + selected.category + "</em></p>";
      }
    }
  }

  // top-level event listeners (explicit)
  document.getElementById("newQuote").addEventListener("click", displayRandomQuote);
  document.getElementById("addQuoteButton").addEventListener("click", addQuote);
  document.getElementById("exportJsonButton").addEventListener("click", exportToJsonFile);
  document.getElementById("clearStorageButton").addEventListener("click", clearStoredQuotes);
}

// Run initialization after DOM loaded to be safe
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}




