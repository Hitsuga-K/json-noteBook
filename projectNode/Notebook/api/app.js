const stat = document.getElementById("stat");
const contents = document.getElementById("content");

let notes = []

async function loadNotes(){
    try{
        const res = await fetch("api/notes");
        notes = await res.json();
        stat.innerText = `Notes ${notes.length}`;
        console.log(`Notes ${notes.length}`);
    }catch(error){
        console.log("ERROR", error.message);
        stat.innerText = `Notes not found`;
    }
}

async function addNote(){
    const title = prompt("Enter name: ");
    const content = prompt("Enter content: ");
    if (title === null || content === null){
        stat.innerText = `fill that!!!`
        return;
    }

    try{
        await fetch("api/notes", {
            method: "POST",
            headers: {"Content-Type" : "application/json"},
            body: JSON.stringify({title, content}),
        });
        await loadNotes();
    }catch(error){
        console.log("ERROR", error.message)
    }
    await showNotes();
}

async function showNotes() {
    await loadNotes();
    
    if(notes.length === 0){
        contents.innerHTML = '<h2> NO NOTES NOW </h2>'
        return;
    }
    let html = '<h3>YOUR NOTES </h3>'

    notes.forEach(note => {
        html += `
        <div class="note-card" data-id="${note.id}">
            <div class="note-header">
                <small>[${note.id}] ${note.date}</small>
                <div class="note-actions">
                    <button class="edit-btn" onclick="editNote(${note.id})">✏️ EDIT</button>
                    <button class="delete-btn" onclick="deleteSingleNote(${note.id})">🗑️ DELETE</button>
                </div>
            </div>
            <strong>${escapeHtml(note.title)}</strong>
            <p>${escapeHtml(note.content)}</p>
        </div>
        `;
    });

    contents.innerHTML = html;
}

// Функция для экранирования HTML (безопасность)
function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// Новая функция: редактирование заметки
async function editNote(id) {
    // Находим заметку по ID
    const note = notes.find(n => n.id === id);
    
    if (!note) {
        alert("Note not found!");
        return;
    }
    
    // Создаем диалоговое окно с текущими значениями
    const newTitle = prompt("Edit title:", note.title);
    if (newTitle === null) return; // Отмена
    
    const newContent = prompt("Edit content:", note.content);
    if (newContent === null) return; // Отмена
    
    try {
        const response = await fetch(`api/notes/${id}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({title: newTitle, content: newContent}),
        });
        
        if (response.ok) {
            alert(" Note updated successfully!");
            await showNotes(); // Обновляем отображение
        } else {
            const error = await response.json();
            alert(`Error: ${error.error || "Failed to update note"}`);
        }
    } catch(error) {
        console.log("ERROR", error.message);
        alert("Network error while updating note");
    }
}

// Новая функция: удаление одной заметки (без подтверждения ID)
async function deleteSingleNote(id) {
    const note = notes.find(n => n.id === id);
    if (!note) return;
    
    const confirmDelete = confirm(`Delete note "${note.title}"?`);
    if (!confirmDelete) return;
    
    try {
        const response = await fetch(`api/notes/${id}`, {method: 'DELETE'});
        
        if (response.ok) {
            alert(" Note deleted successfully!");
            await showNotes();
        } else {
            const error = await response.json();
            alert(` Error: ${error.error || "Failed to delete note"}`);
        }
    } catch(error) {
        console.log("ERROR", error.message);
        alert("Network error while deleting note");
    }
}

// Старая функция удаления (через prompt с выбором ID)
async function delNotes(){
    await loadNotes()

    if(notes.length === 0){
        alert("No notes for now! create note first")
        return;
    }

    let list = '';
    for (const note of notes){
        list += `${note.id}: ${note.title}\n`;
    }
    list = list.trim();

    const input = prompt(`Enter note number to delete: \n\n${list}`)

    const id = parseInt(input);

    if(isNaN(id)){
        alert("Need enter number!");
        return;
    }
    
    // Проверяем существование
    const noteExists = notes.some(note => note.id === id);
    if (!noteExists) {
        alert(`Note with ID ${id} not found!`);
        return;
    }
    
    const res = await fetch(`api/notes/${id}`, {method : 'DELETE'});
    
    if(res.ok){
        await showNotes();
    }else{
        alert("Error deleting note");
    }
}

loadNotes();