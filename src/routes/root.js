import express from "express";
import { processPath } from "../middleware/pathInfo.js";
import { downloadFile, uploadFile, sendPage } from "../services/fileHandling.js";

const router = express.Router();

router.get('/{*all}', processPath, (req, res) => {
    if (req.fileInfo.pathExists) {
        if (req.query.download === '1') {
            return downloadFile(req, res);
        } else if (req.query.upload === '1') {
            return uploadFile(req, res);
        }
    }

    return sendPage(req, res);
});

export default router;