import React from 'react';
import { Row, Form, Button, Card } from 'react-bootstrap';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import style from './style.module.css';
import tempLogo from './../../assets/img/tdei_logo.svg'
import { useDispatch } from 'react-redux';
import { show } from '../../store/notification.slice';
import { Formik } from 'formik';
import * as yup from "yup";

const LoginPage = () => {
    const [loading, setLoading] = React.useState(false);
    const auth = useAuth();
    const dispatch = useDispatch();

    const initialValues = {
        username: '',
        password: ''
    }

    const validationSchema = yup.object().shape({
        username: yup.string().required('Username is required'),
        password: yup.string().required('Password is required')
    })

    const handleSignIn = async (values) => {
        setLoading(true);
        auth.signin(values, (data) => {
            setLoading(false);
        }, (err) => {
            console.error(err)
            setLoading(false);
            dispatch(show({ message: 'Error in signing in', type: 'danger' }));
        });
    }

    if (auth.user) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className={style.loginContainer}>
            <Row className="justify-content-center align-items-center">
                <div className={style.loginCard}>
                    <Card>
                        <Card.Body>
                            <>
                                <img src={tempLogo} className={style.loginLogo} alt="logo" />
                                <Formik initialValues={initialValues} onSubmit={handleSignIn} validationSchema={validationSchema}>{({ values,
                                    errors,
                                    touched,
                                    handleChange,
                                    handleBlur,
                                    handleSubmit }) => <Form noValidate onSubmit={handleSubmit}>
                                        <Form.Group className="mb-3" controlId="formBasicEmail">
                                            <Form.Label>Username</Form.Label>
                                            <Form.Control type="email" placeholder="Enter Username" value={values.username} name='username' isInvalid={touched.username && !!errors.username} onChange={handleChange}
                                                onBlur={handleBlur} />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.username}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group className="mb-3" controlId="formBasicPassword">
                                            <Form.Label>Password</Form.Label>
                                            <Form.Control type="password" placeholder="Enter Password" value={values.password} name='password' isInvalid={touched.password && !!errors.password} onChange={handleChange}
                                                onBlur={handleBlur} />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.password}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group className="mb-3 d-flex justify-content-between align-items-center" controlId="formBasicCheckbox">
                                            <Form.Check type="checkbox" label="Remember me" />
                                            <Button variant="link">Reset Password?</Button>
                                        </Form.Group>
                                        <Button variant="primary col-12 mx-auto" type="submit" disabled={loading}>
                                            {loading ? 'Signing In...' : 'Sign In'}
                                        </Button>
                                        <div className='mt-5'>
                                            New to TDEI? <Link to={'/register'}>Register Now</Link>
                                        </div>
                                    </Form>}
                                </Formik>
                            </>
                        </Card.Body>
                    </Card>
                </div>
            </Row>
        </div>
    )
};

export default LoginPage;