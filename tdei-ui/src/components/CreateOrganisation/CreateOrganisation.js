import React from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import useCreateOrganisation from '../../hooks/organisation/useCreateOrganisation';
import { useDispatch } from 'react-redux';
import { show } from '../../store/notification.slice';
import { Formik } from 'formik';
import * as yup from "yup";
import { PHONE_REGEX } from '../../utils';


const CreateOrganisation = (props) => {
    const dispatch = useDispatch();
    const initialValues = {
        name: '', phone: '', url: '', address: '', coordinates: [{
            "longitude": 0,
            "latitude": 0
        }, {
            "longitude": 0,
            "latitude": 0
        }, {
            "longitude": 0,
            "latitude": 0
        }, {
            "longitude": 0,
            "latitude": 0
        }]
    }

    const validationSchema = yup.object().shape({
        name: yup.string().required('Organization Name is required'),
        address: yup.string().required('Address is required'),
        phone: yup.string().matches(PHONE_REGEX, 'Phone number is not valid')
    })

    const onSuccess = (data) => {
        console.log("suucessfully created", data);
        props.onHide();
        dispatch(show({ message: 'Organization created successfully', type: 'success' }));
    }
    const onError = (err) => {
        console.error("error message", err);
        dispatch(show({ message: 'Error in creating organization', type: 'danger' }));

    }
    const { isLoading, mutate } = useCreateOrganisation({ onSuccess, onError });

    const handleCreate = (value) => {
        mutate(value);
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
            <Formik initialValues={initialValues} onSubmit={handleCreate} validationSchema={validationSchema}>{({ values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit }) => <Form noValidate onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3" controlId="organisationName ">
                            <Form.Label>Organization Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter Name" name='name' onChange={handleChange} onBlur={handleBlur} value={values.name} isInvalid={touched.name && !!errors.name} />
                            <Form.Control.Feedback type="invalid">
                                {errors.name}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="phoneNumber">
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control type="number" placeholder="Enter Phone Number" name='phone' onChange={handleChange} onBlur={handleBlur} value={values.phone} isInvalid={touched.phone && !!errors.phone}/>
                            <Form.Control.Feedback type="invalid">
                                {errors.phone}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="url">
                            <Form.Label>URL</Form.Label>
                            <Form.Control type="text" placeholder="Enter URL" name='url' onChange={handleChange} onBlur={handleBlur} value={values.url} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="address">
                            <Form.Label>Address</Form.Label>
                            <Form.Control as="textarea" rows={3} name='address' onChange={handleChange} onBlur={handleBlur} value={values.address} isInvalid={touched.address && !!errors.address} />
                            <Form.Control.Feedback type="invalid">
                                {errors.address}
                            </Form.Control.Feedback>
                        </Form.Group>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="outline-primary" onClick={props.onHide}>Cancel</Button>
                        <Button type='submit' disabled={isLoading}>{`${isLoading ? 'Creating...' : 'Create'}`}</Button>
                    </Modal.Footer></Form>
            }
            </Formik>
        </Modal>
    )
}

export default CreateOrganisation