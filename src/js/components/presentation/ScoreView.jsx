import React, {Component} from 'react';
import ReactDOM from 'react-dom';

class ScoreView extends Component {
    constructor(props) {
        super(props);
    }

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

const ScoreEntry = document.getElementById("react-score-entry");
ScoreEntry ? ReactDOM.render(<ScoreView/>, ScoreEntry) : false;