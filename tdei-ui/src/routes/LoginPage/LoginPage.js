import React from 'react';
import { Container, Row, Form, Button, Card, Col } from 'react-bootstrap';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import style from './style.module.css';
import tempLogo from './../../assets/img/tdei_logo.svg'
import { useDispatch } from 'react-redux';
import {show} from '../../store/notification.slice';

const LoginPage = () => {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const auth = useAuth();
    const dispatch = useDispatch();

    const handleSignIn = async(e) => {
        setLoading(true);
        e.preventDefault();
        auth.signin({username, password}, (data) => {
            setLoading(false);
        }, (err) => {
            console.error(err)
            setLoading(false);
            dispatch(show({message: 'Error in signing in', type: 'danger'}));
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
                                <img src={tempLogo} className={style.loginLogo} />
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control type="email" placeholder="Enter Username" onChange={(e) => setUsername(e.target.value)}/>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formBasicPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" placeholder="Enter Password" onChange={(e) => setPassword(e.target.value)}/>
                                </Form.Group>
                                <Form.Group className="mb-3 d-flex justify-content-between align-items-center" controlId="formBasicCheckbox">
                                    <Form.Check type="checkbox" label="Remember me" />
                                    <Button variant="link">Reset Password?</Button>
                                </Form.Group>
                                <Button variant="primary col-12 mx-auto" type="submit" disabled={!username || !password || loading} onClick={handleSignIn}>
                                    {loading ? 'Loading...' : 'Sign In'}
                                </Button>
                                <div className='mt-5'>
                                    New to TDEI? <Link to={'/register'}>Register Now</Link>
                                </div>
                            </>
                        </Card.Body>
                    </Card>
                </div>
            </Row>
        </div>
    )
};

export default LoginPage;