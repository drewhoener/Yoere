import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import FadeButton from '../container/FadeButton.jsx';
import ButtonGroup from "react-bootstrap/ButtonGroup";

const PLACES = {
    Play: "/game.html",
    Credits: "/credits.html"
};

class WelcomeView extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <>
                <div className="container">
                    <div className={"pt-3 d-flex flex-column"}>
                        <ButtonGroup size={"lg"}>
                        {
                            Object.keys(PLACES).map((val, idx) => {
                                return(
                                    <FadeButton key={idx} link={PLACES[val]} timeIn={1000 * (idx + 1)} size="lg" text={val}/>
                                )
                            })
                        }
                        </ButtonGroup>
                    </div>
                </div>
            </>
        );
    }
}

export default WelcomeView;

const WelcomeEntry = document.getElementById("react-welcome-entry");
WelcomeEntry ? ReactDOM.render(<WelcomeView/>, WelcomeEntry) : false;