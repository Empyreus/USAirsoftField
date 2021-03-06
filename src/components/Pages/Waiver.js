import React, { Component } from 'react';

import waiver_full from '../../assets/waiver-full.png';

import waiver from './waiver.pdf';
import '../../App.css';

import { Container, Row, Col } from 'react-bootstrap/';

class Waiver extends Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }

    handlePrint = (event) => {
        event.preventDefault();
        window.open(waiver, "PRINT", "height=400,width=600");
      };

    render() {
        return (
            <div className="background-static-all">
                <div className="pdfStyle">
                    <h2 className="page-header">Waiver</h2>
                    <Container fluid>
                        <Row className="align-items-center">
                            <Col>
                            <a href={waiver} target='_blank' rel="noopener noreferrer">
                                <i className="fa fa-print fa-2x text-white"></i>
                            </a>
                            </Col>
                        </Row>
                        <Row className="align-items-center">
                            <Col className="pdfFile">
                                <img src={waiver_full} alt="Waiver for US Airsoft" />
                            </Col>
                        </Row>
                    </Container>
                </div>
            </div>
        );
    }
}


export default Waiver;