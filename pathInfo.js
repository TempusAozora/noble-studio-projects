import path from "path";
import fs from 'fs';
import "dotenv/config";

const root = path.resolve(process.env.root);

export function getPathInfo(req, res, next) {
    // decode spaces and other symbols in the path
    const decoded = decodeURIComponent(req.path);

    // remove "root" from path name
    const dirs = decoded.split("/").filter(Boolean);
    dirs.shift();
    const rootPath = "/" + dirs.join("/");

    // secure the path
    const workingDirectory = rootPath.replace(/^\/+/, '');
    const resolvedPath = path.resolve(root, workingDirectory);
    if (!resolvedPath.startsWith(root)) throw new Error(`Unauthorized access attempt. Attempted path: ${resolvedPath}`);
    
    // check path
    req.pathExists = fs.existsSync(resolvedPath);
    if (req.pathExists) {
        const stat = fs.statSync(resolvedPath);
        req.isDir = stat.isDirectory()
        if (req.isDir)
            req.files = fs.readdirSync(resolvedPath, {withFileTypes: true});
        else 
            return next();
    }

    next();
}