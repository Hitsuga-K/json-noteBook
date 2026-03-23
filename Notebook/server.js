
// ~~~~~~~~~~
// СЕРВЕР

// МОДУЛИ
//  node модуль
const http = require("http");
const fs = require("fs").promises; // file system аналог библеотеки ОС
const path = require("path"); // нужен чтобы обращаться по путям

// Наши модули
const helper = require("./utils/helper");    //> Для персональных библиотек нужно указывать путь
const fileManager = require("./utils/fileManager");

let notes = fileManager.loadData();
const server = http.createServer(async (req, res) => {
    const {url, method} = req;
    // API
    if(url === '/' && method === 'GET'){ // 
        const html = await fs.readFile(path.join(__dirname, "public/index.html"), "utf-8");
        res.writeHead(200, {"Content-Type" : "text/html"});
        res.end(html);
        return;
    }
    if(url === '/app.js' && method === 'GET'){ // 
        const js = await fs.readFile(path.join(__dirname, "api/app.js"), "utf-8");
        res.writeHead(200, {"Content-Type" : "text/javascript"});
        res.end(js);
        return;
    }
    // API ROUTERS
    if(url === "/api/notes" && method === `GET`){
        res.writeHead(200, {"Content-Type" : "application/json"});
        res.end(JSON.stringify(notes));
        return;
    }
    
    if(url === "/api/notes" && method === `POST`){
        let body = "";
        req.on("data", (chunk) => body += chunk);
        req.on("end", async() => {
                const {title, content} = JSON.parse(body);
                const newNote ={
                    id: notes.length + 1,
                    title: title,
                    content: content,
                    date: helper.formatDate()
                };
                notes.push(newNote)
                fileManager.saveData(notes)
        res.writeHead(200, {"Content-Type" : "application/json"});
        res.end(JSON.stringify({succes : true}));
       
        });
        return;
    }
    return;
}); 

server.listen(3000, () => {
    console.log("Сервер запущен http://localhost:3000");

});