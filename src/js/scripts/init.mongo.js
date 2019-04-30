db = new Mongo().getDB('gametracker');

db.locations.remove({});
db.players.remove({});

db.locations.update({name: 'overhead'}, {
    "$setOnInsert":
        {
            name: 'overhead',
            image: 0,
            images: [
                'TopDown.png',
            ],
            actions: {
                touch: {
                    none: {
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
            image: 0,
            images: [
                'Mirror.png',
                'MirrorCleared.png'
            ],
            flag: 0b10000,
            actions: {
                solve: 'wipe',
                object: null,
                wipe: {
                    none: {
                        text: ['You run your sleeve across the mirror, and notice some of the letters ' +
                        'begin to vanish. You take this as a hint and quickly pick up the speed.',
                            'After a moment, you notice that only the following letters are left unerased - R A T H E D',
                            'You are able to rearrange them, forming the word HATRED. You add this word to the chalkboard'
                        ],
                        loc_state: {
                            image: 1,
                        },
                        state: {
                            chalkboard: 0b10000
                        }
                    }
                },
                examine: {
                    none: {
                        text: [
                            'You look closely at the mirror, and notice there’s a weird reflection on it, perhaps something else hidden behind the letters that blot out most of the reflection. Do you look into it?' +
                            'Of course you do. You look into the mirror deeply and notice...Your reflection staring back at you.'
                        ]
                    }
                },
                touch: {
                    none: {
                        text: [
                            'You touch the mirror. Be careful not to smudge the letters!'
                        ]
                    }
                }
            }
        }
}, {upsert: true});

db.locations.update({name: 'table'}, {
    "$setOnInsert":
        {
            name: 'table',
            image: 0,
            images: ['projecttable.png', 'projecttablenohammer.png'],
            flag: 0b00100,
            actions: {
                solution: 'darkness',
                examine: {
                    none: {
                        text: [
                            'You look at the wall and discover what appears to be a riddle. You think you might be able to *solve* it',
                            'Upon further examination, you notice that the words seem to be written with sharpie. How will they ever get this off the wall?',
                            'The riddle reads "The more places I be, the less you can see. What am I?"'
                        ]
                    }
                },
                touch: {
                    none: {
                        text: [
                            '“Ooh” You think to yourself. “It’s as cold as the void”'
                        ]
                    },
                    hammer: {
                        text: [
                            'You lift the hammer. It has a decent bit of weight to it. Maybe it could be useful somewhere?'
                        ]
                    }
                },
                take: {
                    hammer: {
                        text: [
                            'You grab the hammer. Could be useful'
                        ],
                        inventory: {
                            name: 'Hammer',
                            text: 'A hefty looking hammer. Probably good for smashing stuff'
                        },
                        loc_state: {
                            image: 1
                        }

                    }
                },
                solve: {
                    none: {
                        text: [
                            'After scratching your head for a while you come to the conclusion that the answer must be \'Darkness\'',
                            'You add the word to the chalkboard'
                        ],
                        state: {
                            chalkboard: 0b00100
                        }
                    }
                }
            }
        }
}, {upsert: true});

db.locations.update({name: 'floor'}, {
    "$setOnInsert":
        {
            name: 'floor',
            image: 0,
            images: ['floor.png'],
            flag: 0b00010,
            actions: {
                solution: 'fear',
                examine: {
                    none: {
                        text: [
                            'You notice that some letters pop out more than others, especially the F in fright, and E in scare.'
                        ]
                    }
                },
                touch: {
                    none: {
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
            image: 0,
            images: [
                'projectdesk.png',
                'projectdeskopen.png'
            ],
            flag: 0b01000,
            actions: {
                solve: 'attack',
                object: 'hammer',
                attack: {
                    hammer: {
                        text: [
                            'The desk smashes open, revealing a piece of paper with a single word. You add it to your inventory...',
                            'Maybe using it on the chalkboard will have some effect?'
                        ],
                        inventory: {
                            name: 'Paper',
                            text: ['A single word is scrawled: \'Hostility\'']
                        },
                        loc_state: {
                            image: 1
                        }
                    },
                    none: {
                        text: [
                            'It\'s very well built but one of the drawers seems to be stuck shut. You can\t break it open when your hands'
                        ]
                    }
                },
                examine: {
                    none: {
                        text: [
                            'It\'s a sturdy desk with several drawers'
                        ]
                    }
                },
                touch: {
                    none: {
                        text: [
                            'It\'s very well built but one of the drawers seems to be stuck shut. You can\t break it open when your hands'
                        ]
                    }
                }
            }
        }
}, {upsert: true});

db.locations.update({name: 'bookshelf'}, {
    "$setOnInsert":
        {
            name: 'bookshelf',
            image: 0,
            images: [],
            flag: 0b00001,
            actions: {
                solution: 'loathing',
                examine: {
                    none: {
                        text: [
                            'You see a bookcase with quite a few books. You think it may be worth looking through, so you take your time...',
                            'After a bit, you come to the conclusion that the word is either loathing, scarecrow, or jealous. ',
                            'To solve this puzzle, enter solve [your answer] while standing here'
                        ]
                    }
                },
                touch: {
                    none: {
                        text: [
                            'Lots of books, probably for some nerd.'
                        ]
                    }
                },
            }
        }
}, {upsert: true});

db.locations.update({name: 'chalkboard'}, {
    "$setOnInsert":
        {
            name: 'chalkboard',
            images: [],
            actions: {
                examine: {
                    none: {
                        text: [
                            'You see a chalkboard, with words written in. You think this is the main puzzle to solve - it seems different.'
                        ]
                    }
                },
                touch: {
                    none: {
                        text: [
                            'Lots of chalk, with a place to write in the words you\'ve discovered.'
                        ]
                    }
                },
            }
        }
}, {upsert: true});

db.states.remove({});
//db.players.remove({});