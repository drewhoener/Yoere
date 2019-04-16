import React, {Component} from 'react';
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import {Image} from "react-bootstrap";

class ImageView extends Component {

    constructor(props) {
        super(props);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log("Component updated");
        console.log(JSON.stringify(this.props.curImage, null, 4));
    }

    render() {
        return (
            <div>
                <Row>
                    <Col className="parent">
                        <div className="vertical-center light-text">
                            <h1>Placeholder</h1>
                            <p className={"text-center"}>
                                Player Inventory: <br/>
                                Updated by POST request
                            </p>
                        </div>
                    </Col>
                    <Col md={10}>
                        <Image className={"align-middle"} src={`./img/${this.props.curImage}`} fluid/>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default ImageView;