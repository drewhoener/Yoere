import path from "path";
import express from "express";
import webpack from 'webpack';
import webpackDevMiddleware from "webpack-dev-middleware";
import config from "../../webpack.dev.config.js";

const bodyParser = require('body-parser');
const JSON = require('circular-json');
const compiler = webpack(config);
const app = express(), STATIC = __dirname, STATIC_HTML = path.join(STATIC, 'index.html');
const MongoClient = require('mongodb').MongoClient;

app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath
}));

app.use(express.static(STATIC));
app.use(bodyParser.json());

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

app.post('*/api/players', async (req, res) => {
    const body = req.body;
    console.log(JSON.stringify(body, null, 4));
    if (!body.name) {
        console.log("Invalid error");
        res.status(422).json({message: `Invalid object format: ${JSON.stringify(body)}`});
        return;
    }

    let player = await getPlayer(body.name)
        .then(data => {
            console.log(data);
            return data;
        })
        .catch(console.error);
    console.log(`Data is ${JSON.stringify(player)}`);
    if (!player) {
        console.error(`Player not in database, inserting`);
        player = {
            name: body.name,
            inventory: []
        };
        updatePlayer(player).then(response => console.log(`Set player`)).catch(console.error);
    }

    res.json(player);
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

let updatePlayer = (player) => {
    let collection = db.collection('players');
    console.log(`Inserting Player`);
    return collection.insertOne(player);
};

let getPlayer = (name) => {
    let collection = db.collection('players');
    let data = {name: name};
    return collection.findOne(data);
};