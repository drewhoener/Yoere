import React, {Component} from 'react';
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import {Card, Image} from "react-bootstrap";

/**
 * @author Drew Hoener
 * */
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
                <Row>{/*Using Bootstrap Row and column for nice dynamic sizing/alignment while developing. It gets weird with console open otherwise*/}
                    <Col className="parent">
                        <div className="text-center">
                            <h1 className={"light-text"}>Inventory</h1>
                            {
                                //non-null check
                                this.props.player !== null &&
                                //Map the player's inventory to a collection of Bootstrap Cards
                                //Uses React fragments because it can be finicky about having multiple items in a component
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
                        {
                            //Render the current image on screen from props. Using Bootstrap's fluid image to fill the space
                        }
                        <Image className={"align-middle"} src={`./img/${this.props.curImage}`} fluid/>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default ImageView;