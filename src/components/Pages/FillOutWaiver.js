import React, { Component } from 'react';
import logo from '../../assets/logo.png';
import { Container, Row, Col, Form, Button } from 'react-bootstrap/';
import SignatureCanvas from 'react-signature-canvas';
import SignedWaiver from './SignedWaiver';
import '../../App.css';

import waiver from '../../assets/Waiver-cutoff.png'

import { withAuthorization } from '../session';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';
import * as ROLES from '../constants/roles';

const WaiverPage = () => (
  <div className="background-static-all">
    <Container>
      <Row className="header-rp">
        <img src={logo} alt="US Airsoft logo" className="small-logo-home"/>
        <h2 className="page-header">Waiver Form</h2>
      </Row>
        <WaiverForm />
    </Container>
  </div>
);


const INITIAL_STATE = {
    fname: '',
    lname: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipcode: '',
    dob: '',
    pgname: '',
    pgphone: '',
    hideWaiver: false,
    errorWaiver: null,
    agecheck: true,
    age: "",
    participantImg: null,
    pgImg: null,
    pdfBlob: null,
    submitted: false,
    member: true,
    uid: null,
    saveButton: true,
    saveButton2: true,
    showLander: false,
  };

class WaiverPageFormBase extends Component {
  constructor(props) {
    super(props);

    this.completeWaiver = this.completeWaiver.bind(this);
    this.state = { ...INITIAL_STATE};
  }


  onChangeCheckbox = event => {
      this.setState({ [event.target.name]: event.target.checked });
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  checkDOB = event => {
    this.setState({ [event.target.name]: event.target.value }, function() {
      var today = new Date();
      var ageInput = new Date(this.state.dob);
      var age = today.getFullYear() - ageInput.getFullYear();
      var month = today.getMonth() - ageInput.getMonth();
      if (month < 0 || (month === 0 && today.getDate() < ageInput.getDate()))
        age--;
      if (age < 18) {
        this.setState({agecheck: false, age})
      }
      else {
        this.setState({agecheck: true, age})
      }
    });
  };

  // Prop to pass to waiver to call when complete
  completeWaiver = (blob) => {
    const {fname, lname} = this.state;
    var date = (new Date().getMonth() + 1) + "-" + (new Date().getDate()) + "-" + (new Date().getFullYear()) + ":" + 
    (new Date().getHours()) + ":" + (new Date().getMinutes()) + ":" + (new Date().getSeconds()) + ":" + (new Date().getMilliseconds());
    this.props.firebase.nonmembersWaivers(`${fname}${lname}(${date}).pdf`).put(blob).then(() => {
      this.setState({submitted: false, showLander: true})
      //this.setState({ ...INITIAL_STATE, status: "Completed"});
    })
  }
 
  render() {
    const {
      fname,
      lname,
      email,
      address,
      city,
      state,
      zipcode,
      phone,
      dob,
      pgname,
      pgphone,
      participantImg,
      pgImg,
      errorWaiver,
      hideWaiver,
      agecheck,
      age,
      submitted,
      saveButton,
      saveButton2,
      showLander
    } = this.state;

    const myProps = {fname, lname, email, address, city, state, zipcode, phone, dob, pgname, pgphone, participantImg, pgImg, age }
 
    return (
      <div>
      { !showLander ?
      <div>
        <Row className="row-rp">
          <Col>
            <Row className="row-rp waiver-row-rp">
              <img src={waiver} alt="US Airsoft waiver" className={!hideWaiver ? "waiver-rp" : "waiver-hidden-rp"}/>
              <Row className="text-block-waiver-rp">
                <Button variant="outline-secondary" type="button" 
                onClick={() => {
                  this.setState({hideWaiver: !hideWaiver})
                }}>
                    {hideWaiver ? "Show Agreement" : "Hide Agreement"}
                </Button>
              </Row>
            </Row>
            <Row className={!hideWaiver ? "row-rp" : "row-rp waiver-input-rp"}>
              <h2 className="waiver-header-rp">
                Participant Information: 
              </h2>
            </Row>
            <Row className="row-rp">
            <Form className="waiver-form-rp">
              <Row>
              <Col>
                <Form.Group>
                  <Form.Label>First Name:</Form.Label>
                  <Form.Control
                    name="fname"
                    value={fname}
                    onChange={this.onChange}
                    type="text"
                    placeholder="First Name"
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Last Name:</Form.Label>
                  <Form.Control
                    name="lname"
                    value={lname}
                    onChange={this.onChange}
                    type="text"
                    placeholder="Last Name"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>Email:</Form.Label>
                  <Form.Control
                    name="email"
                    value={email}
                    onChange={this.onChange}
                    type="text"
                    placeholder="Email Address"
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Phone Number:</Form.Label>
                  <Form.Control
                    name="phone"
                    value={phone}
                    onChange={this.onChange}
                    type="phone"
                    placeholder="Phone #"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>Address:</Form.Label>
                  <Form.Control
                    name="address"
                    value={address}
                    onChange={this.onChange}
                    type="text"
                    placeholder="Address"
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>City:</Form.Label>
                  <Form.Control
                    name="city"
                    value={city}
                    onChange={this.onChange}
                    type="text"
                    placeholder="City"
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>State:</Form.Label>
                  <Form.Control
                    name="state"
                    value={state}
                    onChange={this.onChange}
                    type="text"
                    placeholder="State"
                  />
                </Form.Group>
              </Col>
            </Row>
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>Date Of Birth:</Form.Label>
                    <Form.Control
                      name="dob"
                      value={dob}
                      onChange={this.checkDOB}
                      type="date"
                      placeholder="Ex: 03-24-1999"
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Zipcode:</Form.Label>
                    <Form.Control
                      name="zipcode"
                      value={zipcode}
                      onChange={this.onChange}
                      type="text"
                      placeholder="Zipcode"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <p className="header-sig-rp">
                    Participant Signature:
                  </p>
                </Col>
              </Row>
              <Row className="row-rp sig-row-rp">
                {!this.state.participantImg ? 
                  <SignatureCanvas penColor='black' ref={(ref) => {this.sigRef = ref}}
                  canvasProps={{width: 750, height: 150, className: 'participant-sig-rp'}} />
                  : <img className="signBox-image-rt" src={this.state.participantImg} alt="signature" />
                }
              </Row>
              <Row className="row-rp">
                <Button variant="secondary" type="button" className="clear-button-rp"
                onClick={() => {
                  this.setState({participantImg: null})
                  if (this.sigRef)
                    this.sigRef.clear();
                    this.setState({saveButton: true})
                }}>
                    Clear
                </Button>
                <Button variant="secondary" type="button" className="save-button-rp" disabled={!saveButton}
                onClick={() => {
                    if (!this.sigRef.isEmpty()) {
                    this.setState({
                      participantImg: this.sigRef.getTrimmedCanvas().toDataURL("image/png"), saveButton: false,
                    })
                  }
                }}>
                    Save
                </Button>
              </Row>
              {!agecheck ? 
              <Col>
              <Row className="row-rp">
                <h2 className="waiver-header-rp">
                  {"Guardian/Parent Information:"}
                </h2>
              </Row>
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>Parent/Guardian Full Name:</Form.Label>
                    <Form.Control
                      name="pgname"
                      value={pgname}
                      onChange={this.checkDOB}
                      type="text"
                      placeholder="Full Name"
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Emergency Number:</Form.Label>
                    <Form.Control
                      name="pgphone"
                      value={pgphone}
                      onChange={this.onChange}
                      type="phone"
                      placeholder="Phone"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <p className="header-sig-rp">
                    Parent/Guardian Signature:
                  </p>
                </Col>
              </Row>
              <Row className="row-rp sig-row-rp">
                {!this.state.pgImg? 
                  <SignatureCanvas penColor='black' ref={(ref) => {this.sigRef2 = ref}}
                  canvasProps={{width: 750, height: 150, className: 'participant-sig-rp'}} />
                  : <img className="signBox-image-rt" src={this.state.pgImg} alt="signature" />
                }
              </Row>
              <Row className="row-rp">
                <Button variant="secondary" type="button" className="clear-button-rp"
                onClick={() => {
                  this.setState({pgImg: null})
                  if (this.sigRef2)
                    this.sigRef2.clear();
                    this.setState({saveButton2: true})
                }}>
                    Clear
                </Button>
                <Button variant="secondary" type="button" className="save-button-rp" disabled={!saveButton2}
                onClick={() => {
                    if (!this.sigRef2.isEmpty()) {
                    this.setState({
                      pgImg: this.sigRef2.getTrimmedCanvas().toDataURL("image/png"), saveButton2: false,
                    })
                  }
                }}>
                    Save
                </Button>
              </Row>
              </Col>
              : ""}
              </Form>
              </Row>
              <Row className="row-rp">
                {errorWaiver && <p className="error-text-rp">{errorWaiver}</p>}
              </Row>
              <Row className="row-rp text-fow">
              {submitted ? 
                <SignedWaiver {...myProps} completeWaiver={this.completeWaiver}/> : ""
              }
              </Row>
          </Col>
          </Row>
          <Row className="row-rp nav-row-rp">
            <Button className="next-button-rp" variant="info" type="button" disabled={this.state.pageIndex===1}
            onClick={() => {
              if (address === "" || fname === "" || lname === "" || email === "" || address === "" ||
              city === "" || state === "" || zipcode === "" || phone === "" || dob === "") {
                this.setState({errorWaiver: "Please fill out all boxes with your information."})
              }
              else if ((pgname === "" || pgphone === "") && age < 18) {
                this.setState({errorWaiver: "Please fill out all boxes with your information."})
              }
              else if (this.state.participantImg === null || (this.state.pgImg === null && age < 18)) {
                this.setState({errorWaiver: "Please sign and save the waiver in the box."})
              }
              else if (age < 8) {
                this.setState({errorWaiver: "Participant must be older than 8 years."})
              }
              else if (age > 85) {
                this.setState({errorWaiver: "Participant must be younger than 85 years."})
              }
              else if (this.state.pageIndex!==1)
                this.setState({submitted: true})
            }}>
                Submit
            </Button>
          </Row> 
      </div>
      : 
      <Container>
        <Row className="row-rp">
          <Col className="col-rp">
            <h2 className="page-header">Successful Waiver Registration.</h2>
            <p className="page-header">Please let your U.S. Airsoft employee know that you have finished.</p>
          </Col>
        </Row>
        <Row className="row-rp">
            <Button className="next-button-rp" variant="info" type="button" 
            onClick={() => {
              this.setState({showLander: false})
              this.setState({ ...INITIAL_STATE, status: "Completed"});
            }}>Sign Another</Button>
        </Row>
      </Container>
      }
      </div>
    );
  };
}
 
/* 
  <label>
      Admin:
      <input
      name="isAdmin"
      type="checkbox"
      checked={isAdmin}
      onChange={this.onChangeCheckbox}
      />
  </label>
*/

const condition = authUser =>
authUser && !!authUser.roles[ROLES.ADMIN];

const WaiverForm = compose(
    withAuthorization(condition),
    withFirebase,
    )(WaiverPageFormBase);

export default WaiverPage;
 
export { WaiverForm };