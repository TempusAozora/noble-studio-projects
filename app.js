import http from "http";
import express from "express";

import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.get('/', (req, res) => {
    res.sendFile("index.html");
});

const server = http.createServer(app);
const PORT = process.env.PORT || 3000;
server.listen(PORT, "0.0.0.0", () => {
    console.log("App is listening on port " + PORT);
});