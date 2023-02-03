import React from 'react';
import style from './AssignPoc.module.css';
import { Button, Form, Alert } from 'react-bootstrap'
import { show } from '../../store/notification.slice';
import { useDispatch } from 'react-redux';
import OrgList from '../OrganisationList/OrgList';
import useAssignRoles from '../../hooks/roles/useAssignRoles';
import { Formik, Field } from 'formik';
import * as yup from "yup";

const AssignPoc = () => {
    const dispatch = useDispatch();
    const initialvalues = { "org_id": '', "user_name": '', roles: ['poc'] }
    const validationSchema = yup.object().shape({
        org_id: yup.string().required('Organization Name is required'),
        user_name: yup.string().required('Username is required')
    })
    const onSuccess = (data) => {
        console.log("Assigned POC", data);
        dispatch(show({ message: 'Assigned POC successfully', type: 'success' }));
    }

    const onError = (err) => {
        //dispatch(show({ message: 'Error in assigning POC', type: 'danger' }));
        console.error(err);
    }

    const { isLoading, mutate, isError, error } = useAssignRoles({ onError, onSuccess });

    const handleAssignPoc = (values) => {
        mutate(values);
    }


    return (
        <div className={style.card}>
            <h5 className='mb-4'>ASSIGN POC</h5>
            {isError ? <Alert variant={"danger"}>
                {error.data?.message || "Error in assigning POC"}
            </Alert> : null}
            <Formik initialValues={initialvalues} onSubmit={handleAssignPoc} validationSchema={validationSchema}>{({ values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit }) => <Form noValidate onSubmit={handleSubmit}><Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="email" placeholder="Enter Username" value={values.user_name} name='user_name' isInvalid={touched.user_name && !!errors.user_name} onChange={handleChange}
                        onBlur={handleBlur} />
                    <Form.Control.Feedback type="invalid">
                        {errors.user_name}
                    </Form.Control.Feedback>
                </Form.Group>
                    <Form.Group className="mb-3" controlId="organisationId">
                        <Form.Label>Organization Name</Form.Label>
                        <Field component={OrgList} name="org_id" />
                        {/* <OrgList setOrgId={setOrgId} /> */}
                    </Form.Group>
                    <Button variant="primary" type="submit" disabled={isLoading}>
                        {isLoading ? 'Assigning...' : 'Submit'}
                    </Button></Form>}</Formik>

        </div>
    )
}

export default AssignPoc