//Provides mongo location data
//For a completely commented entry see line 30
//For an inventory example, see lines 124 and 205

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
                examine: {
                    none: {
                        text: [
                            'You notice several suspicious locations around the room',
                            'If you *go to* them, maybe you\'ll discover something interesting?'
                        ]
                    }
                },
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
    //Insert only once, don't want multiple entries
    "$setOnInsert":
        {
            name: 'mirror', //name
            image: 0,       //what image to use from images
            images: [       //Image collection
                'Mirror.png',
                'MirrorCleared.png'
            ],
            actions: {      //Actions specified by the player
                wipe: {     //Specific actions like wipe have priority in code over generic actions like touch
                    none: { //Item used, could be none or something like hammer to interact with the hammer
                        text: ['You run your sleeve across the mirror, and notice some of the letters ' +   //Text returned on interaction
                        'begin to vanish.',
                            'You take this as a hint and quickly pick up the speed.',
                            'A jumble of letters is left over, you pick them out and get the word - R A T H E D',
                            'Doesn\'t seem like much of a word...maybe it can be rearranged?'
                        ],
                        loc_state: {    //Run after interacting to update things related to this specific location object
                            image: 1,   //Updates the image to index 1
                        }
                    }
                },
                examine: {
                    none: {
                        text: [
                            'You look closely at the mirror, and notice there’s a weird reflection on it, perhaps something else hidden behind the letters that blot out most of the reflection. Do you look into it?',
                            'Of course you do. You look into the mirror deeply and notice...Your reflection staring back at you.'
                        ]
                    },
                    towel: {
                        text: [
                            'It\'s a regular towel. You don\'t feel an urge to pick it up.'
                        ]
                    }
                },
                touch: {
                    none: {
                        text: [
                            'You touch the mirror. Some letters seem wet, while others are dry.',
                            'What could this mean?'
                        ]
                    },
                    towel: {
                        text: [
                            'It\'s a regular towel. You don\'t feel an urge to pick it up.'
                        ]
                    }
                },
                attack: {
                    none: {
                        text: [
                            'You give the mirror a feeble slap. Doesn\'t seem to do much, but now your hand kind of hurts.'
                        ]
                    },
                    hammer: {   //Interaction with an object, same code just different handling
                        text: [
                            'The hammer clinks on the mirror. Any more and you might shatter it. Better not.'
                        ]
                    }
                },
                solve: {
                    none: {
                        solution: 'hatred', //Check for if you input the correct thing. No cheating!
                        text: [
                            'Through the jumble you rearrange the letters to form the word \'hatred\'. Seems to work.',
                            'You add the word to the chalkboard'
                        ],
                        state: {            //Updates the RoomView state with this.setState
                            chalkboard: 0b10000
                        }
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
            actions: {
                examine: {
                    none: {
                        text: [
                            'You look at the wall and discover what appears to be a riddle. You think you might be able to *solve* it',
                            'Upon further examination, you notice that the words seem to be written with sharpie. How will they ever get this off the wall?',
                            'The riddle reads "The more places I be, the less you can see. What am I?"'
                        ]
                    },
                    hammer: {
                        text: [
                            'On the table there is a hammer someone left behind.',
                            'Who could forget a perfectly good hammer?'
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
                        inventory: {        //An item added to inventory through explicit 'take'
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
                        solution: 'darkness',
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
            actions: {
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
                },
                solve: {
                    none: {
                        solution: 'fear',
                        text: [
                            'The letters are kind of hard to make out but you notice that the word \'fear\' sticks out',
                            'You add the word to the chalkboard'
                        ],
                        state: {
                            chalkboard: 0b00010
                        }
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
            flag: 0b00010,
            actions: {
                solve: 'attack',
                object: 'hammer',
                attack: {
                    hammer: {
                        text: [
                            'The desk smashes open, revealing a piece of paper with a single word. You add it to your inventory...',
                            'Maybe *using it* on the chalkboard will have some effect?'
                        ],
                        inventory: {        //An item automatically added through another action
                            name: 'Paper',
                            text: ['A single word is scrawled: \'Hostility\'']
                        },
                        loc_state: {
                            image: 1
                        }
                    },
                    none: {
                        text: [
                            'It\'s very well built but one of the drawers seems to be stuck shut. You can\'t break it open with your hands'
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
                            'It\'s very well built but one of the drawers seems to be stuck shut. You can\'t break it open when your hands'
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
            images: ['projectbookcase.png'],
            actions: {
                solution: 'loathing',
                examine: {
                    none: {
                        text: [
                            'You see a bookcase with quite a few books. You think it may be worth looking through, so you take your time...',
                            'Something seems a bit off about the shelves...',
                        ]
                    }
                },
                touch: {
                    none: {
                        text: [
                            'The case is well built, very sturdy. As you run your hand along the shelves you feel markings of some sort',
                            'Lots of books, probably for some nerd.'
                        ]
                    }
                },
                attack: {
                    none: {
                        text: [
                            'You punch the bookcase',
                            'Through your immense pain you notice letters moving left to right, top to bottom'
                        ]
                    },
                    hammer: {
                        text: [
                            'You swing the hammer into the bookcase',
                            'It teeters...won\'t be trying that again.'
                        ]
                    }
                },
                solve: {
                    none: {
                        solution: 'loathing',
                        text: [
                            'You look through the books, you look at the chalkboard, and it seems like \'loathing\' fits best',
                            'You add the word to the chalkboard'
                        ],
                        state: {
                            chalkboard: 0b01000
                        }
                    }
                }
            }
        }
}, {upsert: true});

db.locations.update({name: 'chalkboard'}, {
    "$setOnInsert":
        {
            name: 'chalkboard',
            images: [],
            actions: {
                write: {
                    solution: 'hostility',
                    none: {
                        text: [
                            'You bring the paper to the chalkboard and study the lines. You find a space where your word fits perfectly',
                            'You add it to the chalkboard'
                        ],
                        state: {
                            chalkboard: 0b00001
                        }
                    }
                },
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
                    },
                    paper: {
                        text: [
                            'You bring the paper to the chalkboard and study the lines. You find a space where your word fits perfectly',
                            'You add it to the chalkboard'
                        ],
                        state: {
                            chalkboard: 0b00001
                        }
                    }
                },
                solve: {
                    none: {
                        solution: 'horror',
                        text: [
                            'With all of the words filled in, you notice a few letters have been underlined, forming a word',
                            'As you say it aloud, a key falls out of a hidden compartment'
                        ],
                        state: {
                            chalkboard: 0b111111
                        }
                    }
                },
                take: {
                    key: {
                        text: [
                            'You grab the key. Could be useful'
                        ],
                        inventory: {        //An item added to inventory through explicit 'take'
                            name: 'Key',
                            text: 'A solid brass key. Keys usually open things...'
                        },
                        state: {
                            chalkboard: 0b1111111
                        }

                    }
                }

            }
        }
}, {upsert: true});

db.locations.update({name: 'door'}, {
    "$setOnInsert":
        {
            name: 'door',
            images: ['doorclosed.png', 'dooropen.png'],
            image: 0,
            actions: {
                examine: {
                    none: {
                        text: [
                            'A sturdy door, locked tight. If you want to get out of here, you\'ll need some sort of key.'
                        ]
                    }
                },
                touch: {
                    none: {
                        text: [
                            'You yank on the door. It won\'t budge an inch'
                        ]
                    },
                    key: {
                        text: [
                            'You insert the key into the door. It fits perfectly and turns with ease.',
                            'The door swings open, and you walk out'
                        ],
                        loc_state: {
                            image: 1
                        },
                        state: {
                            finished: true
                        }
                    }
                }
            }
        }
}, {upsert: true});

db.states.remove({});
//db.players.remove({});