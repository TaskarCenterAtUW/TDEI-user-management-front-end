import React from 'react';
import style from './AssignPoc.module.css';
import { Button, Form } from 'react-bootstrap'
import { show} from '../../store/notification.slice';
import { useDispatch } from 'react-redux';
import OrgList from '../OrganisationList/OrgList';
import useAssignRoles from '../../hooks/roles/useAssignRoles';


const AssignPoc = () => {
    const dispatch = useDispatch();
    const [pocData, setPocData] = React.useState({ "org_id": '', "user_name": '', roles:['poc']  });
    const onSuccess = (data) => {
        console.log("Assigned POC", data);
        dispatch(show({message: 'Assigned POC successfully', type: 'success'}));
        setPocData({ "org_id": '', "user_name": '' });
    }

    const onError = (err) => {
        dispatch(show({message: 'Error in assigning POC', type: 'danger'}));
        console.error(err);

    }

    const {isLoading, mutate} = useAssignRoles({onError, onSuccess});

    const handlePocData = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setPocData({ ...pocData, [name]: value })
    }

    const handleAssignPoc = () => {
        mutate(pocData);
    }

    const setOrgId = (orgList) => {
        setPocData({ ...pocData, "org_id": orgList?.org_id })
    }
    return (
        <div className={style.card}>
            <h5 className='mb-4'>ASSIGN POC</h5>
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Username</Form.Label>
                <Form.Control type="email" placeholder="Enter Username" value={pocData.user_name} name='user_name' onChange={handlePocData}/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="organisationId">
                <Form.Label>Organization Name</Form.Label>
                <OrgList setOrgId={setOrgId}/>
            </Form.Group>
            <Button variant="primary" type="submit" onClick={handleAssignPoc}>
                {isLoading ? 'Assigning...' : 'Submit'}
            </Button>
        </div>
    )
}

export default AssignPoc