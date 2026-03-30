let quotes = [];

function loadQotes() {
    const saved = localStorage.getItem("quotes");
    if (saved) {
        quotes = JSON.parse(saved); 
    }
    renderQotes();
    showAllQuotes();
}

function saveQotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

function addQotes() {
    let textInput = document.getElementById("quoteText");
    let autorInput = document.getElementById("quoteAutor");

    let text = textInput.value.trim();
    let autor = autorInput.value.trim();

    if (text && autor) { 
        quotes.push({
            text: text,
            autor: autor
        });
        saveQotes();
        renderQotes();
        showAllQuotes();
        textInput.value = '';
        autorInput.value = '';
    } else {
        alert("Введите и автора, и текст");
    }
}

function renderQotes() {
    const quoteList = document.getElementById("quote-list");
    quoteList.innerHTML = '';

    quotes.forEach((quote, index) => {
        const quoteCard = document.createElement('div');
        quoteCard.className = 'quote-card';
        quoteCard.innerHTML = `
            <p><strong>"${quote.text}"</strong></p>
            <p>— ${quote.autor}</p>
            <button class="delete-btn" data-index="${index}">Удалить</button>
        `;
        
        const deleteBtn = quoteCard.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => deleteQuote(index));
        
        quoteList.appendChild(quoteCard);
    });
}

function deleteQuote(index) {
    quotes.splice(index, 1);
    saveQotes();
    renderQotes();
    showAllQuotes();
}

function showAllQuotes() {
    const container = document.getElementById("all-quotes");
    if (container) {
        const all = `Всего цитат: ${quotes.length} штук`;
        container.innerText = all;
    }
}

document.getElementById('addBtn').addEventListener('click', addQotes);
loadQotes();