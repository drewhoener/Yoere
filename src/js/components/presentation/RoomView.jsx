import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import InputView from "./../container/InputView.jsx";
import ImageView from "./../container/ImageView.jsx";

class RoomView extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.loadData().then(result => console.log("Data Loaded")).catch(console.error);
        console.log(this.state);
    }

    async loadData() {
        let response = await fetch('/api/locations');
        try {
            if (response.ok) {
                response.json().then(data => {
                    this.setState({locations: data.locations});
                }).catch(console.error);
            } else {
                response.json().then(error => {
                    alert("Failed to fetch issues:" + error.message)
                });
            }
        } catch (err) {
            console.error(err);
            alert("Error fetching locations");
        }
    }

    render() {
        return (
            <div>
                <ImageView/>
                <InputView/>
            </div>
        );
    }
}

export default RoomView;

const RoomEntry = document.getElementById('react-entry-game');
RoomEntry ? ReactDOM.render(<RoomView/>, RoomEntry) : false;