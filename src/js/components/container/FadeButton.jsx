import React, {Component} from 'react';
import Fade from "react-bootstrap/Fade";
import Button from "react-bootstrap/Button";

/**
 * @author Drew Hoener
 * */
//Fading in buttons for the welcome screen
class FadeButton extends Component {

    constructor(props) {
        super(props);
        this.state = {open: false};
        this.onClick = this.onClick.bind(this);
        setTimeout(() => {
            this.setState({open: true});
        }, props.timeIn ? props.timeIn : 3000);
    }

    onClick(e) {
        console.log("Hello");
    }

    render() {
        //Parameters from props with defaults in case they're not set
        const size = this.props.size ? this.props.size : "sm";
        const text = this.props.text ? this.props.text : "Placeholder";
        const link = this.props.link ? this.props.link : "#";
        return (
            <Fade in={this.state.open}>
                <Button href={link} variant={"primary"} type="button" size={size} onClick={this.onClick}>
                    {text}
                </Button>
            </Fade>
        );
    }
}

export default FadeButton;