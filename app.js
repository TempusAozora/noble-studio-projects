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
app.set('views', './views');

app.get('/about', (req, res) => {
    res.redirect('/about.html');
});


app.use(getPathInfo, (req, res, next) => {
    if (req.url.includes('.well-known') || req.url.includes('favicon.ico')) return next();

    const files = [];

    if (req.isDir && req.files) {
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

const server = http.createServer(app);
const PORT = process.env.PORT || 3000;
server.listen(PORT, "0.0.0.0", () => {
    console.log("App is listening on port " + PORT);
});