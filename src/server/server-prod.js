import path from "path";
import express from "express";

const app = express(), STATIC = __dirname, STATIC_HTML = path.join(STATIC, 'index.html');
const MongoClient = require('mongodb').MongoClient;

app.use(express.static(STATIC));

app.get('*', (req, res) => {
    res.sendFile(STATIC_HTML);
});

const PORT = process.env.port || 3000;

let database;
MongoClient.connect('mongodb://localhost', {useNewUrlParser: true}).then(connection => {
    database = connection.db('gametracker');
    app.listen(PORT, () => {
        console.log(`App started on port ${PORT}`);
        console.log(`Press Ctrl + C to quit`);
    });
}).catch(error => {
    console.log('ERROR:', error);
});