import React, { useState } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import useCreateOrganisation from '../../hooks/organisation/useCreateOrganisation';
import { useDispatch } from 'react-redux';
import { show} from '../../store/notification.slice';

const CreateOrganisation = (props) => {
    const dispatch = useDispatch();
    const [orgData, setOrgData] = useState({ name: '', phone: '', url: '', address: '',coordinates: [{
        "longitude": 0,
        "latitude": 0
      },{
        "longitude": 0,
        "latitude": 0
      },{
        "longitude": 0,
        "latitude": 0
      },{
        "longitude": 0,
        "latitude": 0
      }] });
    const onSuccess = (data) => {
        console.log("suucessfully created", data);
        props.onHide();
        dispatch(show({message: 'Organization created successfully', type: 'success'}));
    }
    const onError = (err) => {
        console.error("error message", err);
        dispatch(show({message: 'Error in creating organization', type: 'danger'}));
        
    }
    const { isLoading, mutate } = useCreateOrganisation({ onSuccess, onError });

    const handleOrgData = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setOrgData({ ...orgData, [name]: value })
    }
    const handleCreate = () => {
        mutate(orgData);
    }

    return (
        <Modal
            {...props}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    CREATE ORGANIZATION
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group className="mb-3" controlId="organisationName ">
                    <Form.Label>Organization Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter Name" name='name' onChange={handleOrgData} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="phoneNumber">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control type="number" placeholder="Enter Phone Number" name='phone' onChange={handleOrgData} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="url">
                    <Form.Label>URL</Form.Label>
                    <Form.Control type="text" placeholder="Enter URL" name='url' onChange={handleOrgData} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="address">
                    <Form.Label>Address</Form.Label>
                    <Form.Control as="textarea" rows={3} name='address' onChange={handleOrgData} />
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-primary" onClick={props.onHide}>Cancel</Button>
                <Button onClick={handleCreate} disabled={isLoading}>{`${isLoading ? 'Creating...' : 'Create'}`}</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default CreateOrganisation