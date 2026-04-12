import path from "path";
import fs from 'fs';
import "dotenv/config";

const root = path.resolve(process.env.root);

export function getPathInfo(req, res, next) {
    const decoded = decodeURIComponent(req.url);
    const workingDirectory = decoded.replace(/^\/+/, '');
    const absPath = path.resolve(root, workingDirectory);

    if (!absPath.startsWith(root)) throw new Error(`Unauthorized access attempt. Attempted path: ${absPath}`);
    req.pathExists = fs.existsSync(absPath);

    if (req.pathExists) {
        const stat = fs.statSync(absPath);
        req.isDir = stat.isDirectory()
        if (req.isDir)
            req.files = fs.readdirSync(absPath, {withFileTypes: true});
        else 
            return next();
    }

    next();
}