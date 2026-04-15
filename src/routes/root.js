import express from "express";
import { processPath } from "../middleware/pathInfo.js";
import { Readable } from "stream";
import path from "path";
import fs from 'fs';
import AdmZip from 'adm-zip'

const router = express.Router();

router.get('/{*all}', processPath, (req, res, next) => {
    const files = [];

    if (!req.fileInfo.files && req.fileInfo.pathExists && req.query.download === '1') { // file download
        res.download(req.fileInfo.path, (err) => {
            if (err) console.error("DOWNLOAD ERROR:", err); 
            if (!res.headersSent) {
                return res.status(404).send("File not found on server.");
            }
        });
        return;
    } else if (req.fileInfo.files && req.fileInfo.pathExists && req.query.download === '1') {
        const zip = new AdmZip();
        function recursiveAdd(PATH) {
            const files = fs.readdirSync(PATH, {withFileTypes: true});
            files.forEach(file => {
                const filePath = path.join(file.path, file.name)
                const fileStat = fs.statSync(filePath)
                if (fileStat.isDirectory()) {
                    recursiveAdd(filePath);
                } else {
                    const zipPath = file.path.split(req.fileInfo.path);
                    zip.addLocalFile(filePath, zipPath[1]);
                }
            })
        }

        recursiveAdd(req.fileInfo.path);
        const zipBuffer = zip.toBuffer();
        const readableStream = Readable.from(zipBuffer);

        res.set({
            'Content-Type': 'application/zip',
            'Content-Disposition': 'attachment; filename=' + '"' + req.fileInfo.name + '.zip"',
            'Content-Length': zipBuffer.length
        });

        readableStream.pipe(res);
        return;
    } else if (!!req.fileInfo.files) { // view files
        for (const file of req.fileInfo.files) {
            const absPath = path.join(file.path, file.name);

            const fileStat = fs.statSync(absPath);
            files.push({
                name: file.name,
                isDir: fileStat.isDirectory(),
                size: fileStat.isDirectory() ? undefined : fileStat.size,
                createdAt: fileStat.birthtime,
                lastModified: fileStat.mtime,
                owner: "AozoraTempus"
            });
        }
    }

    const status = (req.fileInfo.pathExists) ? 200 : 404;
    res.status(status).render("index", {files: files, pathExists: req.fileInfo.pathExists, isDir: !!req.fileInfo.files});
});

export default router;