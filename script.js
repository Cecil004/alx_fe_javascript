let quotes = JSON.parse(localStorage.getItem('quotes')) || [];
let lastFilter = localStorage.getItem('lastFilter') || 'all';

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

  const newQuote = { text, author, category };
  quotes.push(newQuote);
  saveQuotes();
  populateCategories();
  filterQuotes(); // reapply filter so the new one shows if matches
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

// Initialize
window.onload = function() {
  populateCategories();
  filterQuotes();
};





