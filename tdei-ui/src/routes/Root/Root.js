import React from 'react';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import Navigation from '../../components/Navigation/Navigation';
import UserHeader from '../../components/UserHeader/UserHeader';
import Creation from '../../components/Creation/Creation';
import useGetRoles from '../../hooks/roles/useGetRoles';
import style from './style.module.css'

const Root = () => {
    const { data, error, isLoading, isError } = useGetRoles();
    const authorizedUser = error?.status !== 401
    return (
        <Container fluid className='p-0'>
            <div className='d-flex'>
                <div className={style.navigationBlock}>
                    <Navigation />
                </div>
                <div className={style.contentBlock}>
                    {isLoading ? <div className='d-flex justify-content-center'><Spinner size='lg' /></div> : <><UserHeader authorizedUser={authorizedUser} />
                        {authorizedUser ? <Creation rolesData={data} error={isError}/> : null}</>}
                </div>
            </div>
        </Container>
    )
};

export default Root;