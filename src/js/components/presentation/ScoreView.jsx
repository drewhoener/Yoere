import React, {Component} from 'react';
import ReactDOM from 'react-dom';

/**
 * @author Drew Hoener
 * */
class ScoreView extends Component {
    constructor(props) {
        super(props);
    }

    //Asks the server for the high scores and displays them in ascending order
    render() {
        return (
            <div className={"container"}>
                <div className={"d-flex justify-content-center"}>
                    <h1>High Scores</h1>
                </div>
            </div>
        );
    }
}

//Export view to index.js
export default ScoreView;

//Render at specified entry point
const ScoreEntry = document.getElementById("react-score-entry");
ScoreEntry ? ReactDOM.render(<ScoreView/>, ScoreEntry) : false;