import React from 'react';
import { Container, Row , Col} from 'react-bootstrap';
import Navigation from '../../components/Navigation/Navigation';
import UserHeader from '../../components/UserHeader/UserHeader';
import Creation from '../../components/Creation/Creation';
import style from './style.module.css'

const Root = () => {
    return (
        <Container fluid className='p-0'>
            <div className='d-flex'>
                <div className={style.navigationBlock}>
                    <Navigation />
                </div>
                <div className={style.contentBlock}>
                    <UserHeader />
                    <Creation />
                </div>
            </div>
        </Container>
    )
};

export default Root;