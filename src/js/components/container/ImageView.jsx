import React, {Component} from 'react';
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import {Card, Image} from "react-bootstrap";

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
                        <div className="text-center">
                            <h1 className={"light-text"}>Inventory</h1>
                            {
                                //non-null check
                                this.props.player !== null &&
                                this.props.player.inventory.map(item => {
                                    return (
                                        <React.Fragment key={item.name}>
                                            <div className={"extra"}>
                                                <Card>
                                                    <Card.Header>{item.name}</Card.Header>
                                                    <Card.Body>
                                                        <Card.Text>Description: {item.text ? item.text : "None"}</Card.Text>
                                                    </Card.Body>
                                                </Card>
                                            </div>
                                        </React.Fragment>
                                    );
                                })
                            }
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