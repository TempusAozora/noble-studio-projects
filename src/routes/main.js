import express from "express";
const router = express.Router();

router.get('/about', (req, res) => {
    res.redirect('/about.html');
});

router.get('/', (req, res) => {
    res.redirect('/root/');
});

router.get('/{*all}', (req, res) => {
    res.status(404).send("404 not found");
})

export default router;