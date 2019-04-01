import React, {Component} from 'react';
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import ChalkboardStart from './../../../img/EscapeTheRoomChalkboardStart.png';
import ChalkboardCleared from './../../../img/EscapeTheRoomChalkboardCleared.png';
import ChalkboardGeneric from './../../../img/EscapeTheRoomChalkboard.png';
import Image from "react-bootstrap/Image";

const IMAGES = [
    ChalkboardGeneric,
    ChalkboardStart,
    ChalkboardCleared
];

class ImageView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            idx: 0,
            curImage: null
        };
        this.updateImage = this.updateImage.bind(this);
        setTimeout(this.updateImage, 1000);
    }

    updateImage() {
        this.setState((state) => {
            const newIdx = (state.idx + 1 >= IMAGES.length) ? 0 : state.idx + 1;
            return {
                idx: newIdx,
                curImage: IMAGES[state.idx]
            };
        });
        console.log(this.state.curImage);
        setTimeout(this.updateImage, 5000);
    }

    render() {
        return (
            <div>
                <Row>
                    <Col className="parent">
                        <div className="vertical-center light-text">
                            <h1>Placeholder</h1>
                            <p className={"text-center"}>
                                Hints, Inventory & other stuff.<br/>
                                Maps will be on right side probably
                            </p>
                        </div>
                    </Col>
                    <Col md={10}>
                        <Image className={"align-middle"} src={this.state.curImage} fluid/>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default ImageView;