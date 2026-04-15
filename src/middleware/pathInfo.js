import path from "path";
import fs from 'fs';
import "dotenv/config";

const root = path.resolve(process.env.root);

export function processPath(req, res, next) {
    // decode spaces and other symbols in the path
    const decoded = decodeURIComponent(req.path);
    const workingDirectory = decoded.replace(/^\/+/, '');
    const resolvedPath = path.resolve(root, workingDirectory);
    if (!resolvedPath.startsWith(root)) throw new Error(`Unauthorized access attempt. Attempted path: ${resolvedPath}`);
    
    // add file info
    const fileInfo = {}
    req.fileInfo = fileInfo;

    fileInfo.name = path.basename(resolvedPath);
    fileInfo.pathExists = fs.existsSync(resolvedPath);
    fileInfo.path = resolvedPath;

    if (fileInfo.pathExists) {
        fileInfo.stat = fs.statSync(resolvedPath);
        if (fileInfo.stat.isDirectory())
            fileInfo.files = fs.readdirSync(resolvedPath, {withFileTypes: true});
        else 
            return next();
    }

    next();
}