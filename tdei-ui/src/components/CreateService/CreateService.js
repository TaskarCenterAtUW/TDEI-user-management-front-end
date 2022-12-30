import React from 'react'
import { Modal, Button, Form } from 'react-bootstrap'


const CreateService = (props) => {
    return (
        <Modal
            {...props}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    CREATE SERVICE
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group className="mb-3" controlId="organisationId ">
                    <Form.Label>Organisation ID</Form.Label>
                    <Form.Control type="text" placeholder="Enter Organisation ID" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="serviceName">
                    <Form.Label>Service Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter Service Name" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="serviceDescription">
                    <Form.Label>Service Description</Form.Label>
                    <Form.Control as="textarea" rows={3} />
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-primary" onClick={props.onHide}>Cancel</Button>
                <Button onClick={props.onHide}>Create</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default CreateService