import http from "http";
import express from "express";
import path from "path";
import fs from "fs";

import mainRouter from "./src/routes/main.js"
import rootRouter from "./src/routes/root.js"

const app = express();

app.use(express.static("public"));
app.set('view engine', 'pug');
app.set('views', './src/views');

app.use('/root/', rootRouter)
app.use('/', mainRouter)


const server = http.createServer(app);
const PORT = process.env.PORT || 3000;
server.listen(PORT, "0.0.0.0", () => {
    console.log("App is listening on port " + PORT);
});