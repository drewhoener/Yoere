import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import InputView from "./../container/InputView.jsx";
import ImageView from "./../container/ImageView.jsx";
import {isEqual} from "lodash/lang";

class RoomView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            inputResponse: '',
            defaultImage: 'TopDown.png',
            curImage: 'TopDown.png',
            curLocation: null,
            chalkboard_flag: 0b00000,
            player: null
        };
        this.onLang = this.onLang.bind(this);
        this.setName = this.setName.bind(this);
    }

    componentDidMount() {
        console.log(`Loading Data`);
        this.loadData().then(result => {
            console.log("Data Loaded");
        }).catch(console.error);
        this.setState({inputResponse: [`To come back to this overhead, type \'go to overhead\' at any point.`, `To start, type in your first name`]})
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!this.state.curLocation || !this.state.locations)
            return;
        if (this.state.curLocation === 'chalkboard')
            return;
        let curLocation = this.state.locations[this.state.curLocation];
        if (!curLocation)
            return;
        let locImage = curLocation.images[curLocation.image];
        if (locImage && locImage !== this.state.curImage)
            this.setState({curImage: locImage});
    }

    async loadData() {
        let response = await fetch('/api/locations');
        try {
            if (response.ok) {
                response.json().then(data => {
                    let locObj = {};
                    data.locations.forEach(elem => {
                        locObj[elem.name] = elem;
                        //MongoDB really likes inserting floats when I want integers
                        //This shouldn't be a problem but just to be safe trimming off the decimals
                        locObj[elem.name].flag = Math.trunc(locObj[elem.name].flag);
                        locObj[elem.name].image = Math.trunc(locObj[elem.name].image);
                    });
                    this.setState({locations: locObj, curLocation: 'overhead'});
                }).catch(console.error);
            } else {
                response.json().then(error => {
                    alert("Failed to fetch issues: " + error.message)
                });
            }
        } catch (err) {
            console.error(err);
            alert("Error fetching locations");
        }
    }

    addItem(item) {
        if (!item)
            return;
        if (!this.state.player) {
            this.setState({inputResponse: `You don't seem to have a player associated with you. Try refreshing the page and entering your first name`});
            return;
        }
        if (this.state.player.inventory.find(inv_item => isEqual(inv_item, item)))
            return;
        fetch('/api/players', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({update: 'inventory', id: this.state.player._id, item: item}),
        })
            .then(async res => {
                if (res.ok) {
                    let obj = await res.json();
                    console.log(`Player inventory successfully updated. Data: ${JSON.stringify(obj)}`);
                    this.setState(prevState => {
                        let new_player = Object.assign({}, prevState.player);
                        if (!new_player.inventory.find(inv_item => item.name === inv_item)) {
                            new_player.inventory.push(item);
                        }
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

    onLang(lang) {
        let images = null;
        let curLocation = this.state.locations[this.state.curLocation];
        let location = null;
        //console.log(`Data output: ${(lang.verb && lang.verb !== 'move')}`);
        if (lang.verb && lang.verb !== 'move' && !curLocation.actions.hasOwnProperty(lang.verb)) {
            this.setState({inputResponse: 'Try as you might, your actions seem to have no effect'});
            return;
        }
        let final_action = null;

        if (curLocation.actions.hasOwnProperty(lang.originalVerb)) {
            final_action = curLocation.actions[lang.originalVerb];
        } else if (curLocation.actions.hasOwnProperty(lang.verb)) {
            final_action = curLocation.actions[lang.verb];
        }
        console.log(`Final Action before obj: ${JSON.stringify(final_action, null, 4)}`);
        if (final_action) {
            if (lang.obj && final_action.hasOwnProperty(lang.obj)) {
                final_action = final_action[lang.obj];
            } else {
                final_action = final_action['none'];
            }
        }
        console.log(`Final Action after obj: ${JSON.stringify(final_action, null, 4)}`);
        if (!final_action && lang.handle_incorrect && lang.verb !== 'move') {
            this.setState({inputResponse: 'Try as you might, your actions seem to have no effect'});
            return;
        }
        switch (lang.verb.toLowerCase()) {
            case 'examine':
                if (!final_action) {
                    this.setState({inputResponse: [`There doesn't seem to be anything here worth examining...`]});
                    return;
                }
                this.setState({inputResponse: final_action.text});
                break;
            case 'touch':
                if (!final_action) {
                    this.setState({inputResponse: [`Everything just kinda looks gross. Better not touch it.`]});
                    return;
                }
                this.setState({inputResponse: final_action.text});
                break;
            case 'attack':
                break;
            case 'listen':
                if (!final_action) {
                    this.setState({inputResponse: [`You listen...and listen...Nothing.`, `Maybe time for that hearing aid?`]});
                    return;
                }
                break;
            case 'move':
                if (!this.state.locations.hasOwnProperty(lang.noun.toLowerCase())) {
                    this.setState({inputResponse: `Couldn't find the location you're trying to go to!`});
                    return;
                }
                location = this.state.locations[lang.noun.toLowerCase()];
                if (!location) {
                    this.setState({inputResponse: `Couldn't find the location you're trying to go to!`});
                    return;
                }
                if (location.name.toLowerCase() === 'chalkboard') {
                    this.setState(state => ({
                        curImage: `chalkboard/${(state.chalkboard_flag >>> 0).toString(2).padStart(5, '0')}.png`,
                        curLocation: 'chalkboard',
                        inputResponse: 'You go to the chalkboard'
                    }));
                    break;
                }
                images = location.images;
                if (!images) {
                    this.setState({inputResponse: `Couldn't find the location you're trying to go to!`});
                    break;
                }
                this.setState({
                    curLocation: location.name,
                    curImage: location.image ? images[location.image] : images[0],
                    inputResponse: `You go to the ${lang.noun}`
                });
                //this.setState({inputResponse: `You go to the ${lang.noun}`});
                break;
            case 'take':
                if (!lang.obj)
                    break;
                if (!final_action) {
                    this.setState({inputResponse: `You look around trying to grab a ${lang.obj}, but can't seem to find one`});
                    break;
                }
                this.setState({inputResponse: `You grab the ${lang.obj}, thinking it could be useful down the line.`});
                break;
            case 'solve':
                if (!final_action) {
                    this.setState({inputResponse: `After hours of pondering the clues you think you have it...but it doesn't seem to fit on the chalkboard...`});
                    break;
                }
                this.setState({inputResponse: final_action.text});
                break;
        }
        if (final_action) {
            if (final_action.inventory) {
                this.addItem(final_action.inventory);
            }
            if (final_action.loc_state) {
                this.setState(state => {
                    let newLocs = Object.assign({}, state.locations);
                    Object.assign(newLocs[state.curLocation], final_action.loc_state);
                    return {
                        locations: newLocs
                    };
                })
            }
            if (final_action.state) {
                this.setState(state => {
                    let chalkboard_mod = state.chalkboard_flag;
                    if (final_action.state.chalkboard) {
                        chalkboard_mod |= final_action.state.chalkboard;
                    }
                    return {
                        chalkboard_flag: chalkboard_mod
                    }
                })
            }
        }
    }

    setName(str) {
        if (this.state.player)
            return;
        fetch('/api/players', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({name: str}),
        })
            .then(res => {
                if (res.ok) {
                    res.json().then(obj => {
                        this.setState({
                            player: obj,
                            inputResponse: `Welcome ${obj.returning ? 'back ' : ''} ${str}. Escape this room...if you can!`
                        });
                    });
                } else {
                    res.json().then(error => {
                        alert(`Failed to set your name:  ${error.message}`);
                    });
                }
            });
    }

    render() {
        return (
            <div>
                <ImageView curImage={this.state.curImage} player={this.state.player}/>
                <InputView setName={this.setName} onLang={this.onLang} inputResponse={this.state.inputResponse}
                           player={this.state.player}/>
            </div>
        );
    }
}

export default RoomView;

const RoomEntry = document.getElementById('react-entry-game');
RoomEntry ? ReactDOM.render(<RoomView/>, RoomEntry) : false;