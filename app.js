import http from "http";
import express from "express";
import path from "path";
import fs from "fs";

import { getPathInfo } from "./pathInfo.js";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(express.static("public"));
app.set('view engine', 'pug');
app.set('views', './src/views');

app.get('/about', (req, res) => {
    res.redirect('/about.html');
});

app.get('/', (req, res) => {
    res.redirect('/root/');
})

app.get('/root/{*all}', getPathInfo, (req, res, next) => {
    const files = [];
    if (!req.isDir && req.query.download === 1) { // file download
        
    } else if (req.isDir && req.files) { // view files
        for (const file of req.files) {
            const absPath = path.join(file.parentPath, file.name);
            const fileStat = fs.statSync(absPath);
            files.push({
                name: file.name,
                isDir: fileStat.isDirectory(),
                size: fileStat.isDirectory() ? undefined : fileStat.size,
                createdAt: fileStat.birthtime,
                lastModified: fileStat.mtime,
                owner: "Aozora pi owner"
            });
        }
    }
   
    res.render("index", {files: files, pathExists: req.pathExists, isDir: req.isDir});
});

app.get('/{*all}', (req, res) => {
    res.status(404).send("404 not found");
})

const server = http.createServer(app);
const PORT = process.env.PORT || 3000;
server.listen(PORT, "0.0.0.0", () => {
    console.log("App is listening on port " + PORT);
});