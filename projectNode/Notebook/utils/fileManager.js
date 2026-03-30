// -=-= Импорты =-=- //
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Определяем __dirname в ES-модулях
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Путь к файлу (теперь в корне проекта)
const filePath = path.join(__dirname, '..', 'note.json'); // поднимаемся на уровень выше

console.log(" NOTES FILE PATH:", filePath);

export const saveData = async (notes) => {
    const jsonData = JSON.stringify(notes, null, 2);
    await fs.writeFile(filePath, jsonData);
    console.log(" Notes saved successfully!");
};

export const loadData = async () => {
    try {
        const jsonData = await fs.readFile(filePath, 'utf-8');
        const notes = JSON.parse(jsonData);
        console.log(`Loaded ${notes.length} notes`);
        return notes;
    } catch (error) {
        console.log('No notes file found, starting with empty list');
        return [];
    }
};