import AdmZip from 'adm-zip';
import path from 'path';
import fs from 'fs';
import { Readable } from 'stream';

function recursiveAdd(zip, basePath, currentPath = basePath) {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(currentPath, entry.name);
        if (entry.isDirectory()) {
            recursiveAdd(basePath, fullPath);
        } else {
            const relativePath = path.relative(basePath, currentPath);
            zip.addLocalFile(fullPath, relativePath);
        }
    }
}

export function downloadFile(req, res) {
    if (!req.fileInfo.files) { // file download
        return res.download(req.fileInfo.path, (err) => {
            if (err) console.error("DOWNLOAD ERROR:", err); 
            if (!res.headersSent) {
                return res.status(404).send("File not found on server.");
            }
        });
    } else {
        const zip = new AdmZip();
        recursiveAdd(zip, req.fileInfo.path);

        const zipBuffer = zip.toBuffer();
        const readableStream = Readable.from(zipBuffer);

        res.set({
            'Content-Type': 'application/zip',
            'Content-Disposition': 'attachment; filename=' + '"' + req.fileInfo.name + '.zip"',
            'Content-Length': zipBuffer.length
        });

        return readableStream.pipe(res);
    }
}

export function uploadFile(req, res) {
    // Work in progress
}

export function sendPage(req, res) {
    const files = [];

    if (!!req.fileInfo.files) { // view files
        for (const file of req.fileInfo.files) {
            console.log(file)
            const absPath = path.join(file.path || file.parentPath, file.name);
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
    return res.status(status).render("index", {files: files, pathExists: req.fileInfo.pathExists, isDir: !!req.fileInfo.files});
}