import React from "react";
import {Button, Col, Form, Modal, Row} from "react-bootstrap";

const ShowJobMessageModal = (props) => {
    return (
        <Modal
            onHide={props.onHide}
            show={props.show}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {"Message"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group as={Row}>
                        <Col sm={4} className="d-flex align-items-baseline">
                            <Form.Label>Dataset / File Name</Form.Label>
                        </Col>
                        <Col sm={6}>
                            <Form.Text>{props.message.fileName}</Form.Text>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Col sm={4} className="d-flex align-items-baseline">
                            <Form.Label>Type</Form.Label>
                        </Col>
                        <Col sm={6}>
                            <Form.Text>{props.message.type}</Form.Text>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Col sm={4} className="d-flex align-items-baseline">
                            <Form.Label>Job Id</Form.Label>
                        </Col>
                        <Col sm={6}>
                            <Form.Text>{props.message.job_id}</Form.Text>
                        </Col>
                    </Form.Group>
                    <div style={{
                        maxHeight: '300px',
                        padding: '20px',
                        background: '#404040',
                        color: 'white',
                        overflowY: 'auto',
                        overflowX: 'hidden'
                    }}>
                        <p>{props.message.message}</p>
                    </div>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    onClick={props.onHide}
                    variant="outline-secondary"
                    className="tdei-secondary-button"
                    disabled={props.isLoading}
                >
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ShowJobMessageModal;
