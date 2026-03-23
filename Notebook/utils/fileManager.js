const fs = require("fs"); // Модуль сохранения
const path = 'note.json'

const saveData = (notes) => {
    const jsonData = JSON.stringify(notes);
    fs.writeFileSync(path, jsonData);
    console.log("Note save success!")
};

const loadData = () => {
    try{
        const jsonData = fs.readFileSync(path, 'utf-8');
        return JSON.parse(jsonData);
    }
    catch(error){
        console.log('Error')
        return [];
    }
};

module.exports = {saveData, loadData};