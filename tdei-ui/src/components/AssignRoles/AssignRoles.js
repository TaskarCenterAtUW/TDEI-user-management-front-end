import React from 'react'
import { Form, Button, Table, Spinner, Tooltip, OverlayTrigger, Alert } from 'react-bootstrap'
import useAssignRoles from '../../hooks/roles/useAssignRoles';
import style from './AssignRoles.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { show } from '../../store/notification.slice';
import useGetRoles from '../../hooks/roles/useGetRoles';
import { getSelectedOrg } from '../../selectors';
import infoIcon from '../../assets/img/information.png';
import { Formik } from 'formik';
import * as yup from "yup";
import clsx from 'clsx'

const AssignRoles = () => {
    const { data, isLoading: isRolesLoading, isError } = useGetRoles();
    const selectedOrg = useSelector(getSelectedOrg);

    const [rolesData, setRolesData] = React.useState({ user_name: '', org_id: '', roles: [] });
    const dispatch = useDispatch()

    React.useEffect(() => {
        if (selectedOrg?.orgId) {
            setRolesData({ ...rolesData, org_id: selectedOrg.orgId })
        }
    }, [selectedOrg])

    const validationSchema = yup.object().shape({
        user_name: yup.string().required('Username is required'),
        roles: yup.array().of(yup.string()).min(1, 'Please select roles')
    })

    const onSuccess = () => {
        dispatch(show({ message: 'Assigned roles successfully', type: 'success' }));
    }

    const onError = (err) => {
        console.error(err);
    }

    const { mutate, isLoading, error, isError: assignRolesError } = useAssignRoles({ onError, onSuccess });

    const handleAssignRoles = (values) => {
        mutate(values);
    }

    return (
        <div className={style.card}>
            <h5 className='mb-4'>ASSIGN ROLES</h5>
            {assignRolesError ? <Alert variant={"danger"}>
                {error.data?.message || "Error in Assigning roles"}
            </Alert> : null}
            <Formik initialValues={rolesData} onSubmit={handleAssignRoles} validationSchema={validationSchema} enableReinitialize>{({ values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit }) => <Form noValidate onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="email" placeholder="Enter Username" value={values.user_name} name='user_name' isInvalid={touched.user_name && !!errors.user_name} onChange={handleChange}
                            onBlur={handleBlur} />
                        <Form.Control.Feedback type="invalid">
                            {errors.user_name}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="organisationId">
                        <Form.Label>Organization Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter Organization ID" value={selectedOrg.orgName} name='org_id' disabled />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="rolesData">
                        <Form.Label>Select Roles</Form.Label>
                        {isError && <div className={style.danger}>Error in loading roles</div>}
                        {isRolesLoading ? <div className='d-flex justify-content-center'><Spinner size='lg' /></div> : null}
                        <Table bordered className={clsx({ "is-invalid": touched.roles && !!errors.roles })}>
                            <tbody>
                                {data?.data?.map(val => (<tr key={val.name}><td><Form.Check type="checkbox" name="roles" onChange={handleChange}
                                    onBlur={handleBlur} value={val.name} checked={values.roles.includes(val.name)} /></td><td >{val.name}<OverlayTrigger placement="top" overlay={<Tooltip id="tooltip">{val.description}</Tooltip>}><span className={style.info}><img src={infoIcon} alt="information-tooltip" /></span></OverlayTrigger></td></tr>))}
                            </tbody>
                        </Table>
                        <Form.Control.Feedback type="invalid">
                            {errors.roles}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        {isLoading ? 'Assigning...' : 'Submit'}
                    </Button>
                </Form>}
            </Formik>
        </div>
    )
}

export default AssignRoles