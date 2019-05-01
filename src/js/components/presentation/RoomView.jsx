import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import InputView from "./../container/InputView.jsx";
import ImageView from "./../container/ImageView.jsx";
import deepmerge from "deepmerge";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const events = require('events');
const _ = require('lodash/lang');

//React hook for a popup modal
function SuccessModal(props) {
    let now = props.player ? props.player.endTime : Date.now();
    let start = props.player ? props.player.start_time : Date.now();
    const days = parseInt((now - start) / (1000 * 60 * 60 * 24));
    const hours = parseInt(Math.abs(now - start) / (1000 * 60 * 60) % 24);
    const minutes = parseInt(Math.abs(now - start) / (1000 * 60) % 60);
    const seconds = parseInt(Math.abs(now - start) / (1000) % 60);
    const dayStr = days ? `${days} day${days === 1 ? '' : 's'}` : '';
    const hourStr = hours ? `${hours} hour${hours === 1 ? '' : 's'}` : '';
    const minStr = minutes ? `${minutes} minute${minutes === 1 ? '' : 's'}` : '';
    const secStr = `${seconds} second${seconds === 1 ? '' : 's'}`;
    return (
        <Modal show={props.show} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Congratulations!
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                    You have escaped the room!<br/>
                    Your time
                    was {`${dayStr} ${hourStr} ${minStr} and ${secStr}`}<br/>
                    Your time has been added to the scoreboard, feel free to explore the room, but there is nothing left
                    to do.
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}

//React hook for a popup modal
function HelpModal(props) {
    return (
        <Modal show={props.show} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Room Help
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                    Welcome to the room!<br/>
                    The input runs on simple commands <br/>
                    For example 'Do thing' 'Do thing to thing', 'Do thing on thing' or 'Do thing with thing'<br/>
                    To get around you can run commands like 'go to place', 'move to place' or some variation of
                    that.<br/>
                    You can use words like smash, attack, examine, look at, touch, grab, and pick up, along with other
                    related words.<br/>
                    Some puzzles have to be solved in their location while others require using items on different items<br/>
                    To solve a puzzle, you can use 'solve' or 'answer' followed by your guess. <br/>
                    The responses to your commands often contain hints, make sure to read them thoroughly!<br/>
                    Good Luck!
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}


/**
 * @author Drew Hoener
 * */
class RoomView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            inputResponse: '',              //Last response to a player, used by Inputview
            defaultImage: 'TopDown.png',    //Default image for first load
            curImage: 'TopDown.png',        //Current Image, used by ImageView
            curLocation: null,              //Current Location in room, the object key not the object itself because it frequently updates
            chalkboard_flag: 0b00000,       //The current binary code for the chalkboard. See the tests if you're wondering why
            finished: false,
            player: null                    //The current player, gotten via POST
        };
        this.emitter = new events.EventEmitter();
        this.emitter.on('GameFinished', (player) => this.endGame(player));
        this.endGame = this.endGame.bind(this);
        this.onLang = this.onLang.bind(this);
        this.setName = this.setName.bind(this);
        this.hideFinishModal = this.hideFinishModal.bind(this);
        this.hideHelpModal = this.hideHelpModal.bind(this);
    }

    componentDidMount() {
        console.log(`Loading Data`);
        this.loadData().then(result => {    //Load all the data from the server
            console.log("Data Loaded");
        }).catch(console.error);
        //Intro message
        this.setState({
            inputResponse: [
                `Welcome to the room! You must escape by any means necessary.`,
                `A helpful keyword is solve [answer] for some of the more abstract puzzles`,
                `To come back to this overhead, type \'go to overhead\' at any point. If you need help, type \'help\'`,
                `To start, type in your first name`
            ]
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        //Prevent accessing null objects before we load data
        if (!this.state.curLocation || !this.state.locations)
            return;

        if (this.state.finished && !prevState.finished) {
            this.emitter.emit('GameFinished', this.state.player);
            return;
        }

        //If the chalkboard flag updates while we're viewing it we have to reload the image
        if (this.state.curLocation === 'chalkboard' && (prevState.chalkboard_flag !== this.state.chalkboard_flag)) {
            let key = (this.state.chalkboard_flag >>> 0).toString(2).padStart(5, '0');
            if (this.state.chalkboard_flag > 31)
                key.padEnd(6, '1');
            this.setState({curImage: `chalkboard/${key}.png`});
            return;
        }
        //Get the current location
        let curLocation = this.state.locations[this.state.curLocation];
        if (!curLocation)
            return;
        let locImage = curLocation.images[curLocation.image];
        //If the image has changed, re-render it
        if (locImage && locImage !== this.state.curImage)
            this.setState({curImage: locImage});
    }

    endGame(player) {
        const start = player.start_time;
        const now = Date.now();
        this.setState(state => {
            let newPlayer = Object.assign({}, state.player);
            newPlayer.endTime = now;
            return {
                player: newPlayer,
                showFinish: true
            };
        });
        fetch('/api/scores', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({id: player._id, name: player.name, time: (now - start)}),
        })
            .then(result => {
                if (result.ok) {
                    console.log(result.message);
                    fetch('/api/players', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({update: 'delete', id: this.state.player._id}),
                    }).catch(console.error);
                }
            })
            .catch(console.error);
    }

    hideFinishModal() {
        this.setState({showFinish: false});
    }

    hideHelpModal() {
        this.setState({showHelp: false});
    }

    //Load ALL the data
    async loadData() {
        //I happen to like await, .then hell is a pain to deal with so I'm doing this
        //Had to use an extra babel plugin for compilation but sometimes that's life
        let response = await fetch('/api/locations');
        try {
            if (response.ok) {
                response.json().then(data => {
                    let locObj = {};
                    data.locations.forEach(elem => {
                        //Prep the locations for the state
                        locObj[elem.name] = elem;
                        //MongoDB really likes inserting floats when I just want integers
                        //This shouldn't be a problem but just to be safe trimming off the decimals
                        locObj[elem.name].flag = Math.trunc(locObj[elem.name].flag);
                        locObj[elem.name].image = Math.trunc(locObj[elem.name].image);
                    });
                    //Update our current location and set our location object
                    this.setState({locations: locObj, curLocation: 'overhead'});
                }).catch(console.error);
            } else {
                response.json().then(error => {
                    alert("Failed to fetch locations: " + error.message)
                });
            }
        } catch (err) {
            console.error(err);
            alert("Error fetching locations");
        }
    }

    //Convenience method to pass response values back to the InputView
    addResponse(response) {
        if (Array.isArray(response)) {
            let mapped = response.map(item => item.toString());
            this.setState({inputResponse: mapped});
            return;
        }
        this.setState({inputResponse: response.toString()});
    }

    addItem(item) {
        //No. Bad null.
        if (!item)
            return;
        //Sanity check, shouldn't happen but if you happen to get this far without having entered your name there's gonna be problems
        if (!this.state.player) {
            this.addResponse(`You don't seem to have a player associated with you. Try refreshing the page and entering your first name`);
            return;
        }
        //Check to make sure they don't already have that item
        //Using lodash again, it's just so convenient to check equality
        if (this.state.player.inventory.find(inv_item => _.isEqual(inv_item, item)))
            return;
        //Ask nicely for the item to be added to persistent inventory
        fetch('/api/players', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({update: 'inventory', id: this.state.player._id, item: item}),
        })
            .then(async res => {
                if (res.ok) {
                    let obj = await res.json();
                    console.log(`Player inventory successfully updated. Data: ${JSON.stringify(obj)}`);
                    //If the item was added, we can add it to the local inventory
                    this.setState(prevState => {
                        let new_player = Object.assign({}, prevState.player);
                        //Another sanity check, sometimes weird things happen
                        if (!new_player.inventory.find(inv_item => item.name === inv_item)) {
                            new_player.inventory.push(item);
                        }
                        //Return the new player object
                        return {
                            player: new_player
                        }
                    });
                } else {
                    res.json().then(error => {
                        alert(`Failed to update your inventory:  ${error.message}`);
                    });
                }
            });
    }

    //Handle all language events from InputView
    //It all cascades to here
    onLang(lang) {
        if (lang && lang.verb === 'help') {
            this.setState({showHelp: true});
            return;
        }
        //Setting up some variables
        let images = null;
        let curLocation = this.state.locations[this.state.curLocation]; //Actually get the object of our current loc.
        let location = null;
        //If the action is invalid, don't do it
        if (lang.verb && lang.verb !== 'move' && !curLocation.actions.hasOwnProperty(lang.verb)) {
            this.addResponse('Try as you might, your actions seem to have no effect');
            return;
        }
        //Our final action after traversing all the available stuff in the current location
        let final_action = null;
        //Specific verbs like 'wipe' have priority over basic ones like 'touch'
        if (curLocation.actions.hasOwnProperty(lang.originalVerb)) {
            final_action = curLocation.actions[lang.originalVerb];
        } else if (curLocation.actions.hasOwnProperty(lang.verb)) {
            final_action = curLocation.actions[lang.verb];
        }
        //console.log(`Final Action before obj: ${JSON.stringify(final_action, null, 4)}`);
        //If they've specified an item to use, find the subcategory here
        if (final_action) {
            if (lang.obj && final_action.hasOwnProperty(lang.obj)) {
                //Obviously if they don't have the item, they can't use it
                if (!this.state.player.inventory.find(inv_item => inv_item.name.toLowerCase() === lang.obj)) {
                    if (lang.verb !== 'take' && (lang.verb !== 'touch' && lang.noun !== lang.obj)) {
                        this.addResponse(`You find yourself wanting to use a ${lang.obj} to complete your task, but are disappointed to find you don't have one.`);
                        return;
                    }
                }
                final_action = final_action[lang.obj];
            } else {
                //If no object specified, we use the default
                final_action = final_action['none'];
            }
        }
        //console.log(`Final Action after obj: ${JSON.stringify(final_action, null, 4)}`);
        if (!final_action && lang.handle_incorrect && lang.verb !== 'move') {
            this.addResponse('Try as you might, your actions seem to have no effect');
            return;
        }
        //Basically all the same stuff but added flavor text so it all doesn't seem the same boring replies
        //Do the check, send the text
        switch (lang.verb.toLowerCase()) {
            case 'examine':
                if (!final_action) {
                    this.addResponse([`There doesn't seem to be anything here worth examining...`]);
                    return;
                }
                this.addResponse(final_action.text);
                break;
            case 'touch':
                if (!final_action) {
                    this.addResponse([`Everything just kinda looks gross. Better not touch it.`]);
                    return;
                }
                this.addResponse(final_action.text);
                break;
            case 'attack':
                if (!final_action) {
                    this.addResponse([`Try as you might, your actions don\'t seem to have much effect`]);
                    return;
                }
                this.addResponse(final_action.text);
                break;
            case 'listen':
                if (!final_action) {
                    this.addResponse([`You listen...and listen...Nothing.`, `Maybe time for that hearing aid?`]);
                    return;
                }
                break;
            case 'move':
                //If we're moving there's some extra parsing to do
                //Make sure the location exists
                if (!this.state.locations.hasOwnProperty(lang.noun.toLowerCase())) {
                    this.addResponse(`Couldn't find the location you're trying to go to!`);
                    return;
                }
                location = this.state.locations[lang.noun.toLowerCase()];
                //If it's the chalkboard we handle the rendering separately
                //Calculate the bits and send it off
                if (location.name.toLowerCase() === 'chalkboard') {
                    this.setState(state => {
                        let key = (this.state.chalkboard_flag >>> 0).toString(2).padStart(5, '0');
                        if (this.state.chalkboard_flag > 31) {
                            key = key.padEnd(6, '1');
                        }
                        return {
                            curImage: `chalkboard/${key}.png`,
                            curLocation: 'chalkboard',
                            inputResponse: 'You go to the chalkboard'
                        };
                    });
                    break;
                }
                //Otherwise we get the image specified by the image key and render that
                images = location.images;
                if (!images) {
                    this.addResponse(`Couldn't find the location you're trying to go to!`);
                    break;
                }
                this.setState({
                    curLocation: location.name,
                    curImage: location.image ? images[location.image] : images[0],
                    inputResponse: `You go to the ${lang.noun}`
                });
                break;
            case 'take':
                //Check to make sure there's an object to take
                if (!lang.obj)
                    break;
                if (!final_action) {
                    this.addResponse(`You look around trying to grab a ${lang.obj}, but can't seem to find one`);
                    return;
                }
                //Extra flavor text, but no items here. Items are added below since some items can be automatically added
                //and it's more effective to just have the call once
                this.addResponse(`You grab the ${lang.obj}, thinking it could be useful down the line.`);
                break;
            case 'solve':
                //Solve the puzzle, but make sure there's actually a puzzle to solve
                if (!final_action) {
                    this.addResponse(`Your mind is racing, itching to solve puzzles...but there don't seem to be any here`);
                    return;
                }
                //If it's not the solution, they didn't do it
                if (lang.noun !== final_action.solution) {
                    this.addResponse(`After hours of pondering the clues you think you have it...but it doesn't seem to fit on the chalkboard...`);
                    return;
                }
                //Display the 'you did it' text
                this.addResponse(final_action.text);
                break;
        }
        //Do the extra stuff
        if (final_action) {
            //If there was an item specified, now is the time to do it, handles all cases
            if (final_action.inventory) {
                this.addItem(final_action.inventory);
            }
            //If we're updating the location state, we have to push that to the server
            if (final_action.loc_state) {
                this.setState(state => {
                    //Update our state for setState
                    let newLocs = Object.assign({}, state.locations);
                    Object.assign(newLocs[state.curLocation], final_action.loc_state);
                    //Prepare our db object. Since it's all stored in one mongo object, mongo likes chained dot notation
                    //for updating fields and objects inside of objects
                    //states.locations.key.key
                    //Otherwise it'll overwrite the entire object with just the one value pushed. Need to be specific
                    let db_object = {};
                    for (let key in final_action.loc_state) {
                        if (!final_action.loc_state.hasOwnProperty(key))
                            continue;
                        db_object[`states.locations.${state.curLocation}.${key}`] = final_action.loc_state[key];
                    }
                    //Post it to the server with the update key so it knows what to do
                    fetch('/api/players', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({update: 'states', id: this.state.player._id, states: db_object}),
                    }).catch(console.error);
                    //Update the local state
                    return {
                        locations: newLocs
                    };
                })
            }
            //If something modifies the base state we handle that too. Usually just the chalkboard flag save
            if (final_action.state) {
                this.setState(state => {
                    let chalkboard_mod = state.chalkboard_flag;
                    //Use bitwise OR to calculate the new flag to use
                    if (final_action.state.chalkboard) {
                        chalkboard_mod |= final_action.state.chalkboard;
                    }
                    //Prepare our DB object the same way as before (above)
                    let db_object = {};
                    db_object[`states.chalkboard_flag`] = chalkboard_mod;
                    //Post it to be updated in Mongo
                    fetch('/api/players', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({update: 'states', id: this.state.player._id, states: db_object}),
                    }).catch(console.error);
                    return {
                        chalkboard_flag: chalkboard_mod,
                        finished: !!final_action.state.finished
                    }
                })
            }
        }
    }

    //Called when the player first sets their name
    setName(str) {
        //If there's already a player we don't care
        if (this.state.player)
            return;
        //Ask the server nicely for an existing player (or to create one if they don't exist)
        fetch('/api/players', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({name: str}),
        })
            .then(res => {
                if (res.ok) {
                    res.json().then(obj => {
                        //Given the player object response we can build the state
                        this.setState(state => {
                            //Clone existing values for a merge if the player has existing states
                            //Otherwise the merge/assign will just overwrite all the locations with the single fields that we saved
                            //No good.
                            let newState = Object.assign({}, {
                                chalkboard_flag: state.chalkboard_flag,
                                locations: state.locations,
                                player: obj     //The returned object
                            });
                            //Set the welcome message, and a welcome back if they're returning
                            newState.inputResponse = `Welcome ${obj.returning ? 'back ' : ''} ${str}. Escape this room...if you can!`;
                            //If we have saved states from an incomplete playthrough, we load them now
                            if (obj.states) {
                                //Using the deepmerge library, very lightweight, very nice
                                //Object.assign doesn't do going into objects within objects, it just overwrites everything
                                //with the one or two values given. Bad
                                newState = deepmerge(newState, obj.states);
                                //console.log(JSON.stringify(newState, null, 4));
                            }
                            return newState;
                        });
                    });
                } else {
                    res.json().then(error => {
                        alert(`Failed to set your name:  ${error.message}`);
                    });
                }
            });
    }

    //Everything above is packed into this tiny render and used in some way or another
    render() {
        return (
            <div>
                <ImageView curImage={this.state.curImage} player={this.state.player}/>
                <InputView setName={this.setName} onLang={this.onLang} inputResponse={this.state.inputResponse}
                           player={this.state.player}/>
                <SuccessModal
                    show={this.state.showFinish}
                    onHide={this.hideFinishModal}
                    player={this.state.player}
                />
                <HelpModal
                    show={this.state.showHelp}
                    onHide={this.hideHelpModal}
                />
            </div>
        );
    }
}

//Export to index.js
export default RoomView;

//Render at specified entry point
const RoomEntry = document.getElementById('react-entry-game');
RoomEntry ? ReactDOM.render(<RoomView/>, RoomEntry) : false;