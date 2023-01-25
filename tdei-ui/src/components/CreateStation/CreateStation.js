import React from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux';
import useCreateStation from '../../hooks/station/useCreateStation';
import { useAuth } from '../../hooks/useAuth';
import { getSelectedOrg } from '../../selectors';
import { show } from '../../store/notification.slice';
import OrgList from '../OrganisationList/OrgList';

function CreateStation(props) {
    const dispatch = useDispatch();
    const [stationData, setStationData] = React.useState({
        "org_id": "",
        "name": "",
        coordinates: [{
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
          }]
    });

    const { user } = useAuth();
    const selectedOrg = useSelector(getSelectedOrg);

    React.useEffect(() => {
        if (!user.isAdmin) {
            if (selectedOrg?.orgId) {
                setStationData({ ...stationData, org_id: selectedOrg.orgId })
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedOrg, user.isAdmin]);
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

    const setOrgId = (orgList) => {
        setStationData({ ...stationData, "org_id": orgList?.org_id })
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
                <Form.Group className="mb-3" controlId="organisationId ">
                    <Form.Label>Organization Name</Form.Label>
                    {user.isAdmin ?
                        <OrgList setOrgId={setOrgId}/> :
                        <Form.Control type="text" placeholder="Enter Organization ID" name='org_id' value={selectedOrg.orgName} onChange={handleStationData} disabled />}
                </Form.Group>
                <Form.Group className="mb-3" controlId="name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter Name" name='name' onChange={handleStationData} />
                </Form.Group>
                {/* <Form.Group className="mb-3" controlId="stopCode">
                    <Form.Label>Stop Code</Form.Label>
                    <Form.Control type="text" placeholder="Enter Stop Code" name='stop_code' onChange={handleStationData} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="stopLatitude">
                    <Form.Label>Stop Latitude</Form.Label>
                    <Form.Control type="text" placeholder="Enter Stop Latitude" name='stop_lat' onChange={handleStationData} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="stopLongitude">
                    <Form.Label>Stop Longitude</Form.Label>
                    <Form.Control type="text" placeholder="Enter Stop Longitude" name='stop_lon' onChange={handleStationData} />
                </Form.Group> */}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-primary" onClick={props.onHide}>Cancel</Button>
                <Button onClick={handleCreateStation}>{isLoading ? 'Creating...' : 'Create'}</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default CreateStation