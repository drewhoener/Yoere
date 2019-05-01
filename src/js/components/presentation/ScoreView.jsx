import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Table} from "react-bootstrap";

function ScoreTable(props) {
    if (props.scores && !props.scores.length) {
        return (
            <div className="alert alert-info" role="alert">
                No scores to display yet!
            </div>
        );
    }
    return (
        <Table className={`light-text`} striped bordered hover variant={"dark"}>
            <thead>
            <tr>
                <th>Name</th>
                <th>Time</th>
            </tr>
            </thead>
            <tbody>
            {
                props.scores && props.scores.length &&
                props.scores.map((score, index) => {
                    const days = parseInt((score.time) / (1000 * 60 * 60 * 24));
                    const hours = parseInt(Math.abs(score.time) / (1000 * 60 * 60) % 24);
                    const minutes = parseInt(Math.abs(score.time) / (1000 * 60) % 60);
                    const seconds = parseInt(Math.abs(score.time) / (1000) % 60);
                    const dayStr = days ? `${days} day${days === 1 ? '' : 's'}` : '';
                    const hourStr = hours ? `${hours} hour${hours === 1 ? '' : 's'}` : '';
                    const minStr = minutes ? `${minutes} minute${minutes === 1 ? '' : 's'}` : '';
                    const secStr = `${seconds} second${seconds === 1 ? '' : 's'}`;
                    const name = score.name.charAt(0).toUpperCase() + score.name.slice(1);
                    return (
                        <tr key={index}>
                            <td>{name}</td>
                            <td>{`${dayStr} ${hourStr} ${minStr} and ${secStr}`}</td>
                        </tr>
                    );
                })
            }
            </tbody>
        </Table>
    );
}

/**
 * @author Drew Hoener
 * */
class ScoreView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            loading: true
        }
    }

    componentDidMount() {
        this.loadData()
            .then()
            .catch()
    }

    async loadData() {
        let response = await fetch('/api/scores');
        try {
            if (response.ok) {
                console.log("Data ok");

                response.json().then(data => {
                    let scores = [];
                    data.scores.forEach(elem => {
                        //Prep the scores for the state
                        let score = Object.assign({}, elem);
                        score.time = Math.trunc(elem.time);
                        scores.push(score);
                    });
                    //Update our scores
                    setTimeout(() => {
                        this.setState({scores: scores.sort(), loading: false});
                    }, 2000);

                }).catch(console.error);

            } else {
                //Maybe this is cheating but I like watching the little loading icon spin for a bit
                response.json().then(error => {
                    console.error(error);
                    setTimeout(() => {
                        this.setState({loading: false, error: true});
                    }, 3000,);
                }).catch(error => {
                    setTimeout(() => {
                        this.setState({loading: false, error: true});
                    }, 3000,);
                });
            }
        } catch (err) {
            console.error(err);
            setTimeout(() => {
                this.setState({loading: false, error: true});
            }, 3000,);
        }
    }

    //Asks the server for the high scores and displays them in ascending order
    render() {
        return (
            <div className={"container"}>
                <div className={"extra-top light-text col-lg-12 col-offset-6 centered text-center"}>
                    <h2>High Scores</h2>
                    {
                        this.state.error &&
                        <div className="alert alert-danger" role="alert">
                            An error occurred loading the score data!
                        </div>
                    }
                    {
                        this.state.loading &&
                        <div className="spinner-border" role="status">
                            <span className="sr-only">Loading High Scores...</span>
                        </div>
                    }
                    {
                        !this.state.loading && !this.state.error &&
                        <ScoreTable scores={this.state.scores}/>
                    }
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