import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Container from "react-bootstrap/Container";

import FadeButton from '../container/FadeButton.jsx';
import Row from "react-bootstrap/Row";

const PLACES = {
    play: "/game.html",
    credits: "/credits.html"
};

class WelcomeView extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <>
                <div>
                </div>
                <div className="container overlay-parent">
                    <div className="image-overlay">
                        <FadeButton size="lg" text="Hello World"/>
                    </div>
                </div>
            </>
        );
    }
}

export default WelcomeView;

const WelcomeEntry = document.getElementById("react-welcome-entry");
WelcomeEntry ? ReactDOM.render(<WelcomeView/>, WelcomeEntry) : false;