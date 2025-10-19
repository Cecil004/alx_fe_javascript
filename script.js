let quotes = JSON.parse(localStorage.getItem('quotes')) || [];
let lastFilter = localStorage.getItem('lastFilter') || 'all';
const API_URL = 'https://jsonplaceholder.typicode.com/posts'; // mock server

function displayQuotes(filteredQuotes = quotes) {
  const quoteDisplay = document.getElementById('quoteDisplay');
  quoteDisplay.innerHTML = '';
  filteredQuotes.forEach(q => {
    const div = document.createElement('div');
    div.textContent = `"${q.text}" - ${q.author} [${q.category}]`;
    quoteDisplay.appendChild(div);
  });
}

function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

function addQuote() {
  const text = document.getElementById('quoteInput').value.trim();
  const author = document.getElementById('authorInput').value.trim();
  const category = document.getElementById('categoryInput').value.trim();

  if (!text || !author || !category) {
    alert('Please fill in all fields!');
    return;
  }

  const newQuote = { text, author, category, id: Date.now() };
  quotes.push(newQuote);
  saveQuotes();
  populateCategories();
  filterQuotes();
  document.getElementById('quoteInput').value = '';
  document.getElementById('authorInput').value = '';
  document.getElementById('categoryInput').value = '';
}

function populateCategories() {
  const categoryFilter = document.getElementById('categoryFilter');
  const uniqueCategories = [...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  uniqueCategories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });
  categoryFilter.value = lastFilter;
}

function filterQuotes() {
  const categoryFilter = document.getElementById('categoryFilter');
  const selectedCategory = categoryFilter.value;
  lastFilter = selectedCategory;
  localStorage.setItem('lastFilter', selectedCategory);

  if (selectedCategory === 'all') {
    displayQuotes();
  } else {
    const filtered = quotes.filter(q => q.category === selectedCategory);
    displayQuotes(filtered);
  }
}

function exportToJsonFile() {
  const jsonStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  a.click();
  URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    const importedQuotes = JSON.parse(e.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    populateCategories();
    filterQuotes();
    alert('Quotes imported successfully!');
  };
  fileReader.readAsText(event.target.files[0]);
}

async function syncQuotes() {
  const notification = document.getElementById('notification');
  notification.textContent = 'Syncing with server...';

  try {
    // Simulate fetching server data
    const response = await fetch(API_URL);
    const serverData = await response.json();

    // Simulate that only 5 random items are quotes
    const serverQuotes = serverData.slice(0, 5).map(item => ({
      id: item.id,
      text: item.title,
      author: 'Server',
      category: 'ServerData'
    }));

    // Merge and resolve conflicts (server wins)
    const localIds = new Set(quotes.map(q => q.id));
    const merged = [
      ...quotes.filter(q => !serverQuotes.some(sq => sq.id === q.id)),
      ...serverQuotes
    ];

    quotes = merged;
    saveQuotes();
    populateCategories();
    filterQuotes();

    notification.textContent = 'Sync complete! Server data updated.';
  } catch (error) {
    console.error('Sync failed:', error);
    notification.textContent = 'Sync failed. Please try again.';
  }

  // Clear notification after 5 seconds
  setTimeout(() => (notification.textContent = ''), 5000);
}

// Initialize
window.onload = function() {
  populateCategories();
  filterQuotes();
};






