import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import InputView from "./../container/InputView.jsx";
import ImageView from "./../container/ImageView.jsx";

class RoomView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            inputResponse: '',
            defaultImage: 'TopDown.png',
            curImage: 'TopDown.png',
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
        this.setState({inputResponse: `To come back to this overhead, type \'go to overhead\' at any point.\nTo start, type in your name`})
    }

    async loadData() {
        let response = await fetch('/api/locations');
        try {
            if (response.ok) {
                response.json().then(data => {
                    let locObj = {};
                    data.locations.forEach(elem => locObj[elem.name] = elem);
                    this.setState({locations: locObj});
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

    onLang(lang) {
        let images = null;
        if (!this.state.locations.hasOwnProperty(lang.noun.toLowerCase())) {
            this.setState({inputResponse: `Couldn't find the location you're trying to go to!`});
            return;
        }
        switch (lang.verb.toLowerCase()) {
            case 'examine':
                break;
            case 'touch':
                break;
            case 'attack':
                break;
            case 'listen':
                break;
            case 'move':
                images = this.state.locations[lang.noun.toLowerCase()].images;
                if (!images) {
                    this.setState({inputResponse: `Couldn't find the location you're trying to go to!`});
                    break;
                }
                this.setState({curImage: images[0]});
                this.setState({inputResponse: `You go to the ${lang.noun}`});
                break;
            case 'take':
                break;
            case 'solve':
                break;
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
                        this.setState({player: obj, inputResponse: `Welcome ${str}. Escape this room...if you can!`});
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
                <ImageView curImage={this.state.curImage}/>
                <InputView setName={this.setName} onLang={this.onLang} inputResponse={this.state.inputResponse}/>
            </div>
        );
    }
}

export default RoomView;

const RoomEntry = document.getElementById('react-entry-game');
RoomEntry ? ReactDOM.render(<RoomView/>, RoomEntry) : false;