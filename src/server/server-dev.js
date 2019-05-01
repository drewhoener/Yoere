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
const ObjectID = require('mongodb').ObjectID;

//Allows webpack to reload on changes
app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath
}));

app.use(express.static(STATIC));
app.use(bodyParser.json());

//Get request for all Location data provided by mongo
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

//Generic get request, provides page
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

//Post handler
//inventory requests go to handleInventory
//state requests go to handleState
//default action is to provide player
app.post('*/api/players', async (req, res) => {
    const body = req.body;
    console.log(JSON.stringify(body, null, 4));
    if (body.update === 'inventory') {
        handleInventory(req, res, body);
        return;
    }
    if (body.update === 'states') {
        handleState(req, res, body);
        return;
    }
    if (!body.name) {
        //console.log("Invalid error");
        res.status(422).json({message: `Invalid object format: ${JSON.stringify(body)}`});
        return;
    }

    let player = await getPlayer(body.name.toLowerCase())
        .then(data => {
            if (data)
                data.returning = true;
            return data;
        })
        .catch(console.error);
    console.log(`Data is ${JSON.stringify(player)}`);
    if (!player) {
        console.error(`Player not in database, inserting`);
        player = {
            name: body.name.toLowerCase(),
            inventory: [],
            start_time: Date.now()
        };
        insertPlayer(player).then(response => console.log(`Set player`)).catch(console.error);
    }

    res.json(player);
});

app.post('*/api/scores', async (req, res) => {
    const body = req.body;
    console.log(JSON.stringify(body, null, 4));
    if (!body.id) {
        console.error(`Cannot update player with invalid id`);
        res.status(422).json({message: `Invalid Player ID, cannot update. ${JSON.stringify(body)}`});
        return;
    }
    if (!body.time) {
        console.error(`Cannot update player with invalid time`);
        res.status(422).json({message: `Invalid Player time, cannot update. ${JSON.stringify(body)}`});
        return;
    }

    setPlayerTime(body.id, body.time)
        .then(result => {
            res.json({message: `Player time stored successfully`, result: result});
        })
        .catch(error => res.status(422).json({message: `Unable to store player time. Error: ${JSON.stringify(error)}`}))
});

//Start server with mongodb
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

let handleInventory = (req, res, body) => {
    if (!body.id) {
        console.error(`Cannot update player with invalid id`);
        res.status(422).json({message: `Invalid Player ID, cannot update. ${JSON.stringify(body)}`});
        return;
    }
    if (!body.item) {
        console.error(`Cannot update player with invalid inventory`);
        res.status(422).json({message: `Invalid Player inventory, cannot update. ${JSON.stringify(body)}`});
        return;
    }
    insertInventory(body.id, body.item)
        .then(result => {
            //console.log(`Data is ${result}`);
            res.json(result);
        })
        .catch(console.error);
};

let handleState = (req, res, body) => {
    if (!body.id) {
        console.error(`Cannot update player with invalid id`);
        res.status(422).json({message: `Invalid Player ID, cannot update. ${JSON.stringify(body)}`});
        return;
    }
    if (!body.states) {
        console.error(`Cannot update player with invalid states`);
        res.status(422).json({message: `Invalid Player states, cannot update. ${JSON.stringify(body)}`});
        return;
    }
    updatePlayerStates(body.id, body.states)
        .then(result => {
            //console.log(`Data is ${result}`);
            res.json(result);
        })
        .catch(console.error);
};

//Mongo queries, I like to separate them from the code for easy editing
//All return promises
let setPlayerTime = (id, name, time) => {
    let collection = db.collection('players');
    let data = {_id: new ObjectID(id), name: name, time: time};
    return collection.insertOne(data);
};
let insertInventory = (id, item) => {
    let collection = db.collection('players');
    let key = {_id: new ObjectID(id)};
    return collection.updateOne(key, {'$push': {inventory: item}});
};

let updatePlayerStates = (id, states) => {
    let collection = db.collection('players');
    let key = {_id: new ObjectID(id)};
    return collection.updateOne(key, {'$set': states});
};

let insertPlayer = (player) => {
    let collection = db.collection('players');
    console.log(`Inserting Player`);
    return collection.insertOne(player);
};

let getPlayer = (name) => {
    let collection = db.collection('players');
    let data = {name: name};
    return collection.findOne(data);
};