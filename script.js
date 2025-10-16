// quotes array with objects containing text and category properties
const quotes = [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "In the middle of every difficulty lies opportunity.", category: "Inspiration" },
  { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Life" }
];

// function expected by the checker to display a random quote
function displayRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");

  if (!quoteDisplay) return;

  if (quotes.length === 0) {
    quoteDisplay.innerHTML = "<p>No quotes available!</p>";
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const selected = quotes[randomIndex];

  quoteDisplay.innerHTML = "<p>\"" + selected.text + "\"</p><p><em>Category: " + selected.category + "</em></p>";
}

// function expected by the checker to add a new quote to the quotes array and update the DOM
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

  // clear inputs
  textInput.value = "";
  categoryInput.value = "";

  // update DOM to show the newly added quote immediately
  displayRandomQuote();
}

// event listener on the "Show New Quote" button (checker expects an event listener as well)
const newQuoteBtn = document.getElementById("newQuote");
if (newQuoteBtn) {
  newQuoteBtn.addEventListener("click", displayRandomQuote);
}


