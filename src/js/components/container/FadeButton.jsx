import React, {Component} from 'react';
import Fade from "react-bootstrap/Fade";
import Button from "react-bootstrap/Button";

class FadeButton extends Component {

    constructor(props) {
        super(props);
        this.state = {open: false};
        this.onClick = this.onClick.bind(this);
        console.log(props.timeIn);
        setTimeout(() => {
            this.setState({open: true});
        }, props.timeIn ? props.timeIn : 5000);
    }

    onClick(e) {
        console.log("Hello");
    }

    render() {
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