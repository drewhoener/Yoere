db = new Mongo().getDB('gametracker');

db.locations.remove({});

db.locations.update({name: 'overhead'}, {
    "$setOnInsert":
        {
            name: 'overhead',
            images: [
                'TopDown.png',
            ],
            actions: {
                none: {
                    touch: {
                        text: [
                            'You touch the chalkboard. Be careful not to smudge the letters!'
                        ]
                    }
                }
            }
        }
}, {upsert: true});

db.locations.update({name: 'mirror'}, {
    "$setOnInsert":
        {
            name: 'mirror',
            images: [
                'Mirror.png',
                'MirrorCleared.png'
            ],
            actions: {
                none: {
                    priority: 'wipe',
                    wipe: {
                        text: ['You run your sleeve across the mirror, and notice some of the letters ' +
                        'begin to vanish. You take this as a hint and quickly pick up the speed. ' +
                        'After a moment, you notice that only the following letters are left unerased - R A T H E D'
                        ]
                    },
                    examine: {
                        text: [
                            'You look closely at the mirror, and notice there’s a weird reflection on it, perhaps something else hidden behind the letters that blot out most of the reflection. Do you look into it?'
                        ]
                    },
                    touch: {
                        text: [
                            'You touch the mirror. Be careful not to smudge the letters!'
                        ]
                    }
                }
            }
        }
}, {upsert: true});

db.locations.update({name: 'hammer'}, {
    "$setOnInsert":
        {
            name: 'hammer',
            images: [],
            actions: {
                none: {
                    examine: {
                        text: [
                            'It\'s a fucking hammer'
                        ]
                    },
                    touch: {
                        text: [
                            'You pick it up, it has a bit of heft to it'
                        ]
                    }
                }
            }
        }
}, {upsert: true});

db.locations.update({name: 'wall'}, {
    "$setOnInsert":
        {
            name: 'wall',
            images: [],
            actions: {
                none: {
                    examine: {
                        text: [
                            'You look at the wall and discover what appears to be a riddle. You think you might be able to *solve* it',
                            'Upon further examination, you notice that the words seem to be written with sharpie. How will they ever get this off the wall?'
                        ]
                    },
                    touch: {
                        text: [
                            '“Ooh” You think to yourself. “It’s as cold as the void”'
                        ]
                    }
                }
            }
        }
}, {upsert: true});

db.locations.update({name: 'floor'}, {
    "$setOnInsert":
        {
            name: 'floor',
            images: [],
            actions: {
                none: {
                    examine: {
                        text: [
                            'You notice that some letters pop out more than others, especially the F in fright, and E in scare.'
                        ]
                    },
                    touch: {
                        text: [
                            'It’s still wet. That was gross.'
                        ]
                    }
                }
            }
        }
}, {upsert: true});

db.locations.update({name: 'desk'}, {
    "$setOnInsert":
        {
            name: 'desk',
            images: [],
            actions: {
                hammer: {
                    attack: 'The desk smashes open, revealing a piece of paper with a single word'
                },
                none: {
                    examine: {
                        text: [
                            'It\'s a sturdy desk with several drawers'
                        ]
                    },
                    touch: {
                        text: [
                            'It\'s very well built but one of the drawers seems to be stuck shut'
                        ]
                    },
                    attack: {}
                }
            }
        }
}, {upsert: true});

db.states.remove({});
//db.players.remove({});