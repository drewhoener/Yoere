import path from "path";
import express from "express";

const app = express(), STATIC = __dirname, STATIC_HTML = path.join(STATIC, 'index.html');

app.use(express.static(STATIC));

app.get('*', (req, res) => {
    res.sendFile(STATIC_HTML);
});

const PORT = process.env.port || 3000;

app.listen(PORT, () => {
    console.log(`App started on port ${PORT}`);
    console.log(`Press Ctrl + C to quit`);
});