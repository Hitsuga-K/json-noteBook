// -=-=-=-=| Сервер |=-=-=-=- //

// -=-= Модули | Node =-=- //
import http from 'http';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from "url";

// Создаём __dirname для ES-модулей
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// -=-= Модули | Наши =-=- //
import { reindexIds, formatDate } from './utils/helper.js';
import { saveData, loadData } from './utils/fileManager.js';

// Загружаем заметки
let notes = await loadData();

// -= API | обработка запросов
const server = http.createServer(async (req, res) => {
    const { url, method } = req;

    // -= Root Routers
    if (url === '/' && method === 'GET') {
        const html = await fs.readFile(path.join(__dirname, "public/index.html"), "utf-8");
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(html);
        return;
    }

    if (url === '/api/app.js' && method === 'GET') {
        const js = await fs.readFile(path.join(__dirname, "api/app.js"), "utf-8");
        res.writeHead(200, { "Content-Type": "application/javascript" });
        res.end(js);
        return;
    }
        // Обработка JavaScript файлов
    if ((url === '/app.js' || url === '/api/app.js') && method === 'GET') {
        try {
            // Исправляем путь - ищем в папке api
            const js = await fs.readFile(path.join(__dirname, "api/app.js"), "utf-8");
            res.writeHead(200, { "Content-Type": "application/javascript" });
            res.end(js);
        } catch (error) {
            console.error("Error loading app.js:", error);
            res.writeHead(404);
            res.end("File not found");
        }
        return;
    }
    // Обработка CSS файлов
    if (url === '/style.css' && method === 'GET') {
        try {
            const css = await fs.readFile(path.join(__dirname, "public/style.css"), "utf-8");
            res.writeHead(200, { "Content-Type": "text/css" });
            res.end(css);
        } catch (error) {
            res.writeHead(404);
            res.end("CSS file not found");
        }
        return;
    }
    // -= API Routers
    if (url === "/api/notes" && method === 'GET') {
        res.writeHead(200, { 'Content-Type': "application/json" });
        res.end(JSON.stringify(notes));
        return;
    }

    if (url === "/api/notes" && method === 'POST') {
        let body = "";
        req.on("data", (chunk) => body += chunk);
        req.on("end", async () => {
            const { title, content } = JSON.parse(body);
            const newNote = {
                id: notes.length + 1,
                title,
                content,
                date: formatDate()
            };
            notes.push(newNote);
            await saveData(notes);

            res.writeHead(200, { 'Content-Type': "application/json" });
            res.end(JSON.stringify({ success: true }));
        });
        return;
    }

    if (url.startsWith("/api/notes/") && method === 'DELETE') {
        const id = parseInt(url.split('/')[3]);

        if (id > 0 && id <= notes.length) {
            notes.splice(id - 1, 1);
            notes = reindexIds(notes);
            await saveData(notes);

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: true }));
        } else {
            res.writeHead(404);
            res.end(JSON.stringify({ success: false }));
        }
        return;
    }
});

server.listen(3000, () => {
    console.log("Server started: http://localhost:3000");
});
