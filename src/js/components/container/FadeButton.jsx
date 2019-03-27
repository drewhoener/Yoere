import React, {Component} from 'react';
import Fade from "react-bootstrap/Fade";
import Button from "react-bootstrap/Button";

class FadeButton extends Component {

    constructor(props) {
        super(props);
        this.state = {open: false};
        setTimeout(() => {
            this.setState({open: true});
        }, props.timeIn ? props.timeIn : 1000);
    }

    onClick(e) {
        console.log("Hello");
    }

    render() {
        const size = this.props.size ? this.props.size : "sm";
        const text = this.props.text ? this.props.text : "Placeholder";
        return (
            <Fade in={this.state.open}>
                <div className="float-right">
                    <Button type="button" size={size} onClick={this.onClick}>
                        {text}
                    </Button>
                </div>
            </Fade>
        );
    }
}

export default FadeButton;