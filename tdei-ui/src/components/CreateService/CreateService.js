import React from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux';
import useCreateService from '../../hooks/service/useCreateService';
import { useAuth } from '../../hooks/useAuth';
import { getSelectedOrg } from '../../selectors';
import { show } from '../../store/notification.slice';
import OrgList from '../OrganisationList/OrgList';


const CreateService = (props) => {
    const dispatch = useDispatch();
    const [serviceData, setServiceData] = React.useState({ name: '', org_id: '', description: '' });
    const { user } = useAuth();
    const selectedOrg = useSelector(getSelectedOrg);

    React.useEffect(() => {
        if (!user.isAdmin) {
            if (selectedOrg?.orgId) {
                setServiceData({ ...serviceData, org_id: selectedOrg.orgId })
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedOrg, user.isAdmin]);
    const onSuccess = (data) => {
        console.log("suucessfully created", data);
        props.onHide();
        dispatch(show({ message: 'Service created successfully', type: 'success' }));
    }
    const onError = (err) => {
        console.error("error message", err);
        dispatch(show({ message: 'Error in creating service', type: 'danger' }));

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

    const setOrgId = (orgList) => {
        setServiceData({ ...serviceData, "org_id": orgList?.id })
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
                    <Form.Label>Organization Name</Form.Label>
                    {user.isAdmin ?
                        <OrgList setOrgId={setOrgId}/> :
                        <Form.Control type="text" placeholder="Enter Organization ID" name='org_id' value={selectedOrg.orgName} onChange={handleServiceData} disabled />}
                </Form.Group>
                <Form.Group className="mb-3" controlId="serviceName">
                    <Form.Label>Service Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter Service Name" name='name' onChange={handleServiceData} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="serviceDescription">
                    <Form.Label>Service Description</Form.Label>
                    <Form.Control as="textarea" rows={3} name='description' onChange={handleServiceData} />
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