db = new Mongo().getDB('gametracker');

db.gametracker.remove({});

db.gametracker.insert([
    {
        status: 'Start', owner: 'Player', score: '0'
    }


]);