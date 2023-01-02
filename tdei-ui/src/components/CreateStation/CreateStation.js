import React from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import { useDispatch } from 'react-redux';
import useCreateStation from '../../hooks/station/useCreateStation';
import { show } from '../../store/notification.slice';

function CreateStation(props) {
    const dispatch = useDispatch();
    const [stationData, setStationData] = React.useState({
        "org_id": "",
        "stop_name": "",
        "stop_code": "",
        "stop_lat": 0,
        "stop_lon": 0
    });
    const onSuccess = (data) => {
        console.log("suucessfully created", data);
        props.onHide();
        dispatch(show({ message: 'Station created successfully', type: 'success' }));
    }
    const onError = (err) => {
        console.error("error message", err);
        dispatch(show({ message: 'Error in creating station', type: 'danger' }));

    }
    const { isLoading, mutate } = useCreateStation({ onSuccess, onError });

    const handleStationData = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setStationData({ ...stationData, [name]: value })
    }
    const handleCreateStation = () => {
        mutate(stationData);
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
                    CREATE STATION
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group className="mb-3" controlId="organisationId">
                    <Form.Label>Organization ID</Form.Label>
                    <Form.Control type="text" placeholder="Enter Organization ID" name='org_id' onChange={handleStationData} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="stopName">
                    <Form.Label>Stop Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter Stop Name" name='stop_name' onChange={handleStationData}/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="stopCode">
                    <Form.Label>Stop Code</Form.Label>
                    <Form.Control type="text" placeholder="Enter Stop Code" name='stop_code' onChange={handleStationData}/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="stopLatitude">
                    <Form.Label>Stop Latitude</Form.Label>
                    <Form.Control type="text" placeholder="Enter Stop Latitude" name='stop_lat' onChange={handleStationData}/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="stopLongitude">
                    <Form.Label>Stop Longitude</Form.Label>
                    <Form.Control type="text" placeholder="Enter Stop Longitude" name='stop_lon' onChange={handleStationData} />
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-primary" onClick={props.onHide}>Cancel</Button>
                <Button onClick={handleCreateStation}>{isLoading ? 'loading...' : 'Create'}</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default CreateStation