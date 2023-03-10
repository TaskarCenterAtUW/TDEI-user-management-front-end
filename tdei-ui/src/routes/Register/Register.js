import React from 'react';
import { Container, Row, Form, Button, Card, Col } from 'react-bootstrap';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';
import style from './style.module.css';
import tempLogo from './../../assets/img/tdei_logo.svg'
import { useDispatch } from 'react-redux';
import {show} from '../../store/notification.slice';


const Register = () => {
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [emailId, setEmailId] = React.useState('');
    const [phoneNumber, setPhoneNumber] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const auth = useAuth();
    const dispatch = useDispatch();

    const handleCreateAccount = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('https://tdei-usermanagement-ts-dev.azurewebsites.net/api/v1/register', {
                firstName,
                lastName,
                email: emailId,
                phone: phoneNumber,
                password
            });
            auth.signin({username:emailId, password}, (data) => {
                setLoading(false);
            }, (err) => {
                console.error(err)
                setLoading(false);
            });
        } catch (err) {
            setLoading(false);
            dispatch(show({message: 'Error in registering', type: 'danger'}));
        }
    }

    return (
        <div className={style.registerContainer}>
            <Row className="justify-content-center align-items-center">
                <div className={style.registerCard}>
                    <Card>
                        <Card.Body>
                            <>
                                <img src={tempLogo} className={style.loginLogo} />
                                <Row>
                                    <Col lg="6">
                                        <Form.Group className="mb-3" controlId="firstName">
                                            <Form.Label>First Name</Form.Label>
                                            <Form.Control type="text" placeholder="Enter First Name" onChange={(e) => setFirstName(e.target.value)} />
                                        </Form.Group>
                                    </Col>
                                    <Col lg="6">
                                        <Form.Group className="mb-3" controlId="lastName">
                                            <Form.Label>Last Name</Form.Label>
                                            <Form.Control type="text" placeholder="Enter Last Name" onChange={(e) => setLastName(e.target.value)} />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Form.Group className="mb-3" controlId="emailId">
                                    <Form.Label>Email Id</Form.Label>
                                    <Form.Control type="email" placeholder="Enter Email Id" onChange={(e) => setEmailId(e.target.value)} />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="phoneNumber">
                                    <Form.Label>Phone Number</Form.Label>
                                    <Form.Control type="number" placeholder="Enter Phone Number" onChange={(e) => setPhoneNumber(e.target.value)} />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="password">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" placeholder="Enter Password" onChange={(e) => setPassword(e.target.value)} />
                                </Form.Group>
                                <Button variant="primary col-12 mx-auto" type="submit" disabled={!password || !emailId || loading} onClick={handleCreateAccount}>
                                    {loading ? 'Loading...' : 'Create Account'}
                                </Button>
                                <div className='mt-5'>
                                    Already have an account? <Link to={'/login'}>Sign in</Link>
                                </div>
                            </>
                        </Card.Body>
                    </Card>
                </div>
            </Row>
        </div>
    )
};

export default Register;