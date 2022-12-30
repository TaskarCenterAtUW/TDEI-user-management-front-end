import React from 'react'
import { Modal, Button, Form } from 'react-bootstrap'


function CreateStation(props) {
    return (
        <Modal
            {...props}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    CREATE STATION
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group className="mb-3" controlId="organisationId">
                    <Form.Label>Organisation ID</Form.Label>
                    <Form.Control type="text" placeholder="Enter Organisation ID" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="stopName">
                    <Form.Label>Stop Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter Stop Name" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="stopCode">
                    <Form.Label>Stop Code</Form.Label>
                    <Form.Control type="text" placeholder="Enter Stop Code" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="stopLatitude">
                    <Form.Label>Stop Latitude</Form.Label>
                    <Form.Control type="text" placeholder="Enter Stop Latitude" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="stopLongitude">
                    <Form.Label>Stop Longitude</Form.Label>
                    <Form.Control type="text" placeholder="Enter Stop Longitude" />
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-primary" onClick={props.onHide}>Cancel</Button>
                <Button onClick={props.onHide}>Create</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default CreateStation