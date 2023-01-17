import React from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getNotification } from '../../selectors';
import { hide } from '../../store/notification.slice';
import style from './Notification.module.css';

const Notification = () => {
    const dispatch = useDispatch();
    const notification = useSelector(getNotification);
    React.useEffect(() => {
        let timeout = setTimeout(() => {
            dispatch(hide());
        }, 5000)
        return () => {
            clearTimeout(timeout)
        }
    }, [notification.type, dispatch])
    return (
        <ToastContainer position='top-center' className={style.container}>
            <Toast onClose={() => dispatch(hide())} show={!!notification?.type} bg={notification?.type}>
                <Toast.Header>
                    <strong className="me-auto">{notification?.message}</strong>
                </Toast.Header>
            </Toast>
        </ToastContainer>

    )
}

export default Notification