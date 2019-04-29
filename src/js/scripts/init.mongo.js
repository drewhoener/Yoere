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
            flag: 0b10000,
            actions: {
                none: {
                    solve: 'wipe',
                    object: null,
                    wipe: {
                        text: [ 'On the mirror, you see the following' +
                        'You run your sleeve across the mirror, and notice some of the letters ' +
                        'begin to vanish. You take this as a hint and quickly pick up the speed. ' +
                        'After a moment, you notice that only the following letters are left unerased - R A T H E D' + 
                        'You are able to rearrange them, foring the word HATRED'
                        ]
                    },
                    examine: {
                        text: [
                            'You look closely at the mirror, and notice there’s a weird reflection on it, perhaps something else hidden behind the letters that blot out most of the reflection. Do you look into it?' +
                            'Of course you do. You look into the mirror deeply and notice...Your reflection staring back at you.'
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
                            'It\'s a fucking hammer. Might be useful to pick up.'
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
            flag: 0b00100,
            actions: {
                none: {
                    examine: {
                        text: [
                            'You look at the wall and discover what appears to be a riddle. You think you might be able to *solve* it',
                            'Upon further examination, you notice that the words seem to be written with sharpie. How will they ever get this off the wall?',
                            'The riddle reads "The more places I be, the less you can see. What am I?"'
                        ]
                    },
                    touch: {
                        text: [
                            '“Ooh” You think to yourself. “It’s as cold as the void”'
                        ]
                    },
                    solve: 'darkness'
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
                solve: 'fear',
                flag: 0b00010,
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
                solve: 'attack',
                object: 'hammer',
                flag: 0b01000,
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
                            'It\'s very well built but one of the drawers seems to be stuck shut. You can\t break it open when your hands'
                        ]
                    },
                    attack: {}
                }
            }
        }
}, {upsert: true});

db.locations.update({name: 'bookcase'}, {
    "$setOnInsert":
        {
            name: 'bookcase',
            images: [],
            actions: {
                solve: 'Loathing',
                flag: 0b00001,
                none: {
                    examine: {
                        text: [
                            'You see a bookcase with quite a few books. You think it may be worth looking through, so you take your time...' +
                            'After a bit, you come to the conclustion that the word is either loathing, scarecrow, or jealous. '
                        ]
                    },
                    touch: {
                        text: [
                            'Lots of books, probably for some nerd.'
                        ]
                    },
                }
            }
        }
}, {upsert: true});

db.locations.update({name: 'Chalkboard'}, {
    "$setOnInsert":
        {
            name: 'chalkboard',
            images: [],
            actions: {
                none: {
                    examine: {
                        text: [
                            'You see a chalkboard, with words written in. You think this is the main puzzle to solve - it seems different.'
                        ]
                    },
                    touch: {
                        text: [
                            'Lots of chalk, with a place to write in the words you\'ve discovered.'
                        ]
                    },
                }
            }
        }
}, {upsert: true});

db.states.remove({});
//db.players.remove({});