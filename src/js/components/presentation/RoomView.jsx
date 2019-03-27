import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import InputView from "./../container/InputView.jsx";
import ImageView from "./../container/ImageView.jsx";

class RoomView extends Component {

    constructor(props) {
        super(props);
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