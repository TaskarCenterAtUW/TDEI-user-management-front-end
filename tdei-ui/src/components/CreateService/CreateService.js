import React from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import { useDispatch } from 'react-redux';
import useCreateService from '../../hooks/service/useCreateService';
import { show} from '../../store/notification.slice';


const CreateService = (props) => {
    const dispatch = useDispatch();
    const [serviceData, setServiceData] = React.useState({ name: '', org_id: '', description: ''});
    const onSuccess = (data) => {
        console.log("suucessfully created", data);
        props.onHide();
        dispatch(show({message: 'Service created successfully', type: 'success'}));
    }
    const onError = (err) => {
        console.error("error message", err);
        dispatch(show({message: 'Error in creating service', type: 'danger'}));
        
    }
    const { isLoading, mutate } = useCreateService({ onSuccess, onError });

    const handleServiceData = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setServiceData({ ...serviceData, [name]: value })
    }
    const handleCreateService = () => {
        mutate(serviceData);
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
                    CREATE SERVICE
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group className="mb-3" controlId="organisationId ">
                    <Form.Label>Organization ID</Form.Label>
                    <Form.Control type="text" placeholder="Enter Organization ID" name='org_id' onChange={handleServiceData}/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="serviceName">
                    <Form.Label>Service Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter Service Name" name='name' onChange={handleServiceData} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="serviceDescription">
                    <Form.Label>Service Description</Form.Label>
                    <Form.Control as="textarea" rows={3} name='description' onChange={handleServiceData}/>
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-primary" onClick={props.onHide}>Cancel</Button>
                <Button onClick={handleCreateService}>{isLoading ? 'loading...' : 'Create'}</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default CreateService