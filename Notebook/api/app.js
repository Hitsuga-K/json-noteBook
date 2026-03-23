const stat = document.getElementById("stat");
const content = document.getElementById("content");

let notes = []

async function loadNotes(){
    try{
    const res = await fetch("/api/notes")
    notes = await res.json();
    stat.innerText = `Заметок ${notes.length}`;
    }
    catch(error){
        console.log("Ошибка", error.message);
        stat.innerText = `Заметки не найдены!`;
    }

}
async function addNote(){
    const title = prompt("Введите значение ");
    const content = prompt("Введите содержание ");
    try{
    await fetch("api/notes", {
        method: "POST",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify({title, content}),
        
    });      
    loadNotes();  
    } catch(error){
        console.log("ERROR", error.message)
    }

}
async function showNotes(){
    await loadNotes();
    if(notes.length === 0){
        content.innerHTML = "<h2>ХА ПЕНСИЯ У ТЕБЯ ЗАМЕТОК НЕТУ</h2>";
    }
    let html = "<h3>Заметки:</h3>";

    notes.forEach(note => {
        html += `
            <div>
                <small>[${note.id}] ${note.date}</small><br>
                <strong>${note.title}</strong><br>
                ${note.content}
            </div>
            <hr>
        `;
    });


    content.innerHTML = html;
}

loadNotes();