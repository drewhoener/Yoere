import path from "path";
import express from "express";
import webpack from 'webpack';
import webpackDevMiddleware from "webpack-dev-middleware";
import config from "../../webpack.dev.config.js";

const compiler = webpack(config);
const app = express(), STATIC = __dirname, STATIC_HTML = path.join(STATIC, 'index.html');
const MongoClient = require('mongodb').MongoClient;


app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath
}));

app.use(express.static(STATIC));

app.get('*/api/locations', (req, res) => {
    db.collection('locations').find().toArray()
        .then(locations => {
            const meta = {data_length: locations.length};
            res.json({_metadata: meta, locations: locations});
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({message: `Internal Server Error: ${err}`});
        })

});

app.get('*', (req, res, next) => {
    compiler.outputFileSystem.readFile(STATIC_HTML, (err, result) => {
        if (err) {
            return next(err)
        }
        res.set('content-type', 'text/html');
        res.send(result);
        res.end()
    })
});

const PORT = 3000;

let db;
MongoClient.connect('mongodb://localhost', {useNewUrlParser: true}).then(connection => {
    db = connection.db('gametracker');
    app.listen(PORT, () => {
        console.log(`App started on port ${PORT}`);
        console.log(`Press Ctrl + C to quit`);
    });
}).catch(error => {
    console.log('ERROR:', error);
});