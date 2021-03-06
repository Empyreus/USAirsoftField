import React, { Component } from 'react';
import '../../App.css';

import map from '../../assets/MapHigherRes.jpg';
import lowmap from '../../assets/MapLowerRes.jpg'

import { SideBySideMagnifier } from "react-image-magnifiers";


import { Container, Row, Col } from 'react-bootstrap/';

class Map extends Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }

    render() {
        return (
            <div className="background-static-all">
                <div className="mapStyle">
                    <h2 className="page-header">Map</h2>
                    <Container>
                        <Row>
                            <Col>
                                <SideBySideMagnifier 
                                    imageSrc={lowmap}
                                    className="img-map"
                                    imageAlt="Field Map"
                                    largeImageSrc={map}
                                    alwaysInPlace={true}
                                    fillAvailableSpace={true}
                                />
                            </Col>
                        </Row>
                    </Container>
                </div>
            </div>
        );
    }
}


export default Map;