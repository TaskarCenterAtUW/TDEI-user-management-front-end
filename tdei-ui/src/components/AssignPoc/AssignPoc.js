import React from 'react';
import style from './AssignPoc.module.css';
import { Button, Form } from 'react-bootstrap'
import useAssignPoc from '../../hooks/poc/useAssignPoc';
import { show} from '../../store/notification.slice';
import { useDispatch } from 'react-redux';


const AssignPoc = () => {
    const dispatch = useDispatch();
    const [pocData, setPocData] = React.useState({ "org_id": '', "poc_user_name": '' });
    const onSuccess = (data) => {
        console.log("Assigned POC", data);
        dispatch(show({message: 'Assigned POC successfully', type: 'success'}));
        setPocData({ "org_id": '', "poc_user_name": '' });
    }

    const onError = (err) => {
        dispatch(show({message: 'Error in assigning POC', type: 'danger'}));
        console.error(err);

    }

    const {isLoading, mutate} = useAssignPoc({onError, onSuccess});

    const handlePocData = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setPocData({ ...pocData, [name]: value })
    }

    const handleAssignPoc = () => {
        mutate(pocData);
    }
    return (
        <div className={style.card}>
            <h5 className='mb-4'>ASSIGN POC</h5>
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Username</Form.Label>
                <Form.Control type="email" placeholder="Enter Username" value={pocData.poc_user_name} name='poc_user_name' onChange={handlePocData}/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="organisationId">
                <Form.Label>Organisation Id</Form.Label>
                <Form.Control type="text" placeholder="Enter Organisation Id" value={pocData.org_id} name='org_id' onChange={handlePocData}/>
            </Form.Group>
            <Button variant="primary" type="submit" onClick={handleAssignPoc}>
                {isLoading ? 'loading...' : 'Submit'}
            </Button>
        </div>
    )
}

export default AssignPoc