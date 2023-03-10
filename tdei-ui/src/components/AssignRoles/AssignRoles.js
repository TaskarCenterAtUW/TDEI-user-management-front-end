import React from 'react'
import { Form, Button, Table } from 'react-bootstrap'
import useAssignRoles from '../../hooks/roles/useAssignRoles';
import style from './AssignRoles.module.css';
import { useDispatch } from 'react-redux';
import { show} from '../../store/notification.slice';

const AssignRoles = ({rolesData: data, isError}) => {
    const [rolesData, setRolesData] = React.useState({ user_name: '', org_id: '' });
    const [selectedRole, setSelectedRole] = React.useState([])
    const dispatch = useDispatch()

    const onSuccess = () => {
        dispatch(show({ message: 'Assigned roles successfully', type: 'success' }));
        setRolesData({ user_name: '', org_id: '' });
        setSelectedRole([]);
    }

    const onError = (err) => {
        console.error(err);
        dispatch(show({ message: 'Error in Assigning roles', type: 'danger' }));
    }

    const { mutate, isLoading } = useAssignRoles({ onError, onSuccess });

    const handleSelectRoles = (e) => {
        const role = e.target.id;
        if (!selectedRole.includes(role)) {
            setSelectedRole([...selectedRole, role])
        } else {
            const roleCopy = [...selectedRole];
            roleCopy.splice(selectedRole.indexOf(role), 1);
            setSelectedRole(roleCopy)
        }
    }

    const handleRolesData = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setRolesData({ ...rolesData, [name]: value })
    }

    const handleAssignRoles = (e) => {
        e.preventDefault();
        mutate({ ...rolesData, roles: selectedRole });
    }

    return (
        <div className={style.card}>
            <h5 className='mb-4'>ASSIGN ROLES</h5>
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Username</Form.Label>
                <Form.Control type="email" placeholder="Enter Username" value={rolesData.user_name} name='user_name' onChange={handleRolesData} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="organisationId">
                <Form.Label>Organization ID</Form.Label>
                <Form.Control type="text" placeholder="Enter Organization ID" value={rolesData.org_id} name='org_id' onChange={handleRolesData} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="rolesData">
                <Form.Label>Select Roles</Form.Label>
                {isError && <div className={style.danger}>Error in loading roles</div>}
                <Table bordered>
                    <tbody>
                        {data?.data?.map(val => (<tr key={val.name}><td title={val.description}>{val.name}</td><td><Form.Check type="checkbox" id={val.name} checked={selectedRole.includes(val.name)} onChange={handleSelectRoles} /></td></tr>))}
                    </tbody>
                </Table>
            </Form.Group>
            <Button variant="primary" type="submit" onClick={handleAssignRoles}>
                {isLoading ? 'loading...' : 'Submit'}
            </Button>
        </div>
    )
}

export default AssignRoles